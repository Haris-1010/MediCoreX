// One-shot data transfer: SQL Server (old MediCoreX database) -> PostgreSQL.
//
// The PostgreSQL schema must already exist (created by the EF Core migrations,
// `dotnet ef database update`). This tool never creates or alters tables; it
// copies rows into the schema the application actually uses, so any source
// column the application would not see is reported instead of silently dropped.
//
//   dotnet run --project tools/ClinIQ.DbMigrator -- \
//       --source "Server=...;Database=MediCoreX;..." \
//       --target "Host=...;Database=medicorex;..." [--replace] [--verify-only] \
//       [--fill-null "Tenants.Package=0,Tenants.SubscriptionStatus=0"]
//
// Steps:
//   1. read every source row that maps onto a target table,
//   2. validate all of it (missing columns, NULLs in NOT NULL columns, text
//      longer than the target column, NUL characters, numeric precision),
//      and stop before writing anything if a single value would not fit,
//   3. binary COPY everything in ONE transaction with FK triggers deferred
//      (session_replication_role = replica, needs a superuser),
//   4. re-read both sides and compare every value of every row by primary key,
//   5. report foreign keys whose parent row is missing.

using System.Data;
using System.Globalization;
using System.Text;
using Microsoft.Data.SqlClient;
using Npgsql;
using NpgsqlTypes;

var opts = ParseArgs(args);
if (!opts.TryGetValue("source", out var sourceCs) || !opts.TryGetValue("target", out var targetCs))
{
    Console.Error.WriteLine("usage: --source <sqlserver connection> --target <postgres connection> [--replace] [--verify-only]");
    return 2;
}
var replace = opts.ContainsKey("replace");
var verifyOnly = opts.ContainsKey("verify-only");
var fillNull = (opts.GetValueOrDefault("fill-null") ?? "")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    .Select(f => f.Split('=', 2))
    .ToDictionary(p => (Table: p[0].Split('.')[0], Column: p[0].Split('.')[1]), p => p[1]);

await using var src = new SqlConnection(sourceCs);
await using var dst = new NpgsqlConnection(targetCs);
await src.OpenAsync();
await dst.OpenAsync();

var targetTables = await LoadTargetSchemaAsync(dst);
var sourceTables = await LoadSourceSchemaAsync(src);
var problems = new List<string>();
var warnings = new List<string>();

foreach (var name in sourceTables.Keys.Where(t => t != "__EFMigrationsHistory" && !targetTables.ContainsKey(t)))
    problems.Add($"{name}: table exists in SQL Server but not in PostgreSQL ({await CountAsync(src, name)} rows would be lost)");

// ---- 1 + 2: read and validate -------------------------------------------------
var data = new Dictionary<string, List<object?[]>>();
foreach (var table in targetTables.Values.OrderBy(t => t.Name))
{
    if (!sourceTables.TryGetValue(table.Name, out var srcCols))
    {
        warnings.Add($"{table.Name}: not present in SQL Server, left empty");
        continue;
    }

    foreach (var c in srcCols.Where(c => table.Columns.All(t => t.Name != c)))
        problems.Add($"{table.Name}.{c}: column exists in SQL Server but not in PostgreSQL (data would be lost)");

    foreach (var c in table.Columns.Where(c => !srcCols.Contains(c.Name)))
    {
        if (!c.Nullable && !c.HasDefault)
            problems.Add($"{table.Name}.{c.Name}: NOT NULL target column has no source column and no default");
        else
            warnings.Add($"{table.Name}.{c.Name}: no source column, uses NULL/default");
    }

    var cols = table.Columns.Where(c => srcCols.Contains(c.Name)).ToList();
    table.Copied = cols;
    var rows = new List<object?[]>();
    await using (var cmd = new SqlCommand($"SELECT {string.Join(", ", cols.Select(c => $"[{c.Name}]"))} FROM [dbo].[{table.Name}]", src))
    await using (var rd = await cmd.ExecuteReaderAsync())
    {
        while (await rd.ReadAsync())
        {
            var row = new object?[cols.Count];
            for (var i = 0; i < cols.Count; i++)
                row[i] = rd.IsDBNull(i) ? null : rd.GetValue(i);
            rows.Add(row);
        }
    }
    data[table.Name] = rows;

    // --fill-null "Table.Column=value,..." replaces source NULLs in NOT NULL
    // columns with an explicit value. Every replacement is printed.
    foreach (var (col, value) in fillNull.Where(f => f.Key.Table == table.Name).Select(f => (f.Key.Column, f.Value)))
    {
        var i = cols.FindIndex(c => c.Name == col);
        if (i < 0) { problems.Add($"--fill-null: {table.Name}.{col} is not a copied column"); continue; }
        foreach (var row in rows.Where(r => r[i] is null))
        {
            row[i] = value;
            Console.WriteLine($"  fill-null: {table.Name}.{col} ({KeyOf(table, cols, row)}) NULL -> {value}");
        }
    }

    for (var i = 0; i < cols.Count; i++)
    {
        var c = cols[i];
        foreach (var (row, n) in rows.Select((r, n) => (r, n)))
        {
            var v = row[i];
            var where = $"{table.Name}.{c.Name} (row {n + 1}, {KeyOf(table, cols, row)})";
            if (v is null)
            {
                if (!c.Nullable) problems.Add($"{where}: NULL but the PostgreSQL column is NOT NULL");
                continue;
            }
            if (v is string s)
            {
                if (s.Contains('\0')) problems.Add($"{where}: contains a NUL character, which PostgreSQL text cannot store");
                var len = s.Length - s.Count(char.IsLowSurrogate);
                if (c.MaxLength is int max && len > max)
                    problems.Add($"{where}: {len} characters, column allows {max}");
            }
            if (v is decimal d && c.Scale is int scale && c.Precision is int precision)
            {
                if (decimal.Round(d, scale) != d)
                    problems.Add($"{where}: {d} has more than {scale} decimal places");
                if (Math.Abs(decimal.Truncate(d)).ToString(CultureInfo.InvariantCulture).TrimStart('0').Length > precision - scale)
                    problems.Add($"{where}: {d} does not fit numeric({precision},{scale})");
            }
        }
    }
}

// Unique indexes the application declares but SQL Server may never have enforced.
// Partial indexes (WHERE ...) are left to PostgreSQL: COPY enforces them and a
// violation rolls the whole transfer back.
await using (var cmd = new NpgsqlCommand(@"
    SELECT t.relname, i.relname,
           array(SELECT a.attname FROM unnest(x.indkey) WITH ORDINALITY k(n, o) JOIN pg_attribute a ON a.attrelid = x.indrelid AND a.attnum = k.n ORDER BY o)
    FROM pg_index x
    JOIN pg_class t ON t.oid = x.indrelid
    JOIN pg_class i ON i.oid = x.indexrelid
    JOIN pg_namespace ns ON ns.oid = t.relnamespace
    WHERE ns.nspname = 'public' AND x.indisunique AND NOT x.indisprimary AND x.indexprs IS NULL AND x.indpred IS NULL", dst))
{
    var uniques = new List<(string Table, string Index, string[] Cols)>();
    await using (var rd = await cmd.ExecuteReaderAsync())
        while (await rd.ReadAsync())
            uniques.Add((rd.GetString(0), rd.GetString(1), (string[])rd.GetValue(2)));

    foreach (var (tableName, index, keyCols) in uniques.Where(u => data.ContainsKey(u.Table)))
    {
        var table = targetTables[tableName];
        var idx = keyCols.Select(k => table.Copied!.FindIndex(c => c.Name == k)).ToArray();
        if (idx.Any(i => i < 0)) continue;
        var dupes = data[tableName]
            .Where(r => idx.All(i => r[i] is not null))
            .GroupBy(r => string.Join("|", idx.Select(i => Canon(ToTarget(r[i]!, table.Copied![i])))))
            .Where(g => g.Count() > 1);
        foreach (var g in dupes)
            problems.Add($"{tableName}: {g.Count()} rows share ({string.Join(", ", keyCols)}) = ({g.Key}), violating {index}: " +
                         string.Join(", ", g.Select(r => KeyOf(table, table.Copied!, r))));
    }
}

var subMicro = data.Sum(kv => kv.Value.Sum(r => r.Count(v => v is DateTime dt && dt.Ticks % 10 != 0
                                                          || v is TimeSpan ts && ts.Ticks % 10 != 0
                                                          || v is DateTimeOffset o && o.UtcTicks % 10 != 0)));

Console.WriteLine($"Source rows read: {data.Sum(kv => kv.Value.Count)} across {data.Count} tables");
foreach (var w in warnings) Console.WriteLine($"  note: {w}");
if (problems.Count > 0)
{
    Console.Error.WriteLine($"\n{problems.Count} value(s) cannot be transferred without loss. Nothing was written:");
    foreach (var p in problems) Console.Error.WriteLine($"  - {p}");
    return 1;
}

// ---- 3: copy ------------------------------------------------------------------
if (!verifyOnly)
{
    await using var tx = await dst.BeginTransactionAsync();
    await ExecAsync(dst, "SET LOCAL session_replication_role = replica");

    var nonEmpty = new List<string>();
    foreach (var t in targetTables.Values)
        if (await ScalarAsync<long>(dst, $"SELECT count(*) FROM \"{t.Name}\"") > 0) nonEmpty.Add(t.Name);
    if (nonEmpty.Count > 0)
    {
        if (!replace)
        {
            Console.Error.WriteLine($"Target already has rows in: {string.Join(", ", nonEmpty)}. Re-run with --replace to overwrite.");
            return 1;
        }
        await ExecAsync(dst, $"TRUNCATE {string.Join(", ", targetTables.Values.Select(t => $"\"{t.Name}\""))}");
    }

    foreach (var table in targetTables.Values.Where(t => data.ContainsKey(t.Name)))
    {
        var cols = table.Copied!;
        var copySql = $"COPY \"{table.Name}\" ({string.Join(", ", cols.Select(c => $"\"{c.Name}\""))}) FROM STDIN (FORMAT BINARY)";
        await using var writer = await dst.BeginBinaryImportAsync(copySql);
        foreach (var row in data[table.Name])
        {
            await writer.StartRowAsync();
            for (var i = 0; i < cols.Count; i++)
            {
                if (row[i] is null) await writer.WriteNullAsync();
                else await writer.WriteAsync(ToTarget(row[i]!, cols[i]), cols[i].DbType);
            }
        }
        var written = await writer.CompleteAsync();
        Console.WriteLine($"  copied {written,6} rows  {table.Name}");
    }

    await tx.CommitAsync();
}

// ---- 4: verify every value ----------------------------------------------------
var mismatches = 0;
long checkedValues = 0;
foreach (var table in targetTables.Values.Where(t => data.ContainsKey(t.Name)))
{
    var cols = table.Copied!;
    var expected = data[table.Name].ToDictionary(r => KeyOf(table, cols, r), r => r.Select((v, i) => Canon(v is null ? null : ToTarget(v, cols[i]))).ToArray());

    var actual = new Dictionary<string, string[]>();
    await using (var cmd = new NpgsqlCommand($"SELECT {string.Join(", ", cols.Select(c => $"\"{c.Name}\""))} FROM \"{table.Name}\"", dst))
    await using (var rd = await cmd.ExecuteReaderAsync())
    {
        while (await rd.ReadAsync())
        {
            var row = new object?[cols.Count];
            for (var i = 0; i < cols.Count; i++) row[i] = rd.IsDBNull(i) ? null : rd.GetValue(i);
            actual[KeyOf(table, cols, row)] = row.Select(Canon).ToArray();
        }
    }

    if (expected.Count != actual.Count)
    {
        Console.Error.WriteLine($"  MISMATCH {table.Name}: {expected.Count} source rows, {actual.Count} target rows");
        mismatches++;
    }
    foreach (var (key, exp) in expected)
    {
        if (!actual.TryGetValue(key, out var act))
        {
            Console.Error.WriteLine($"  MISSING  {table.Name} {key}");
            mismatches++;
            continue;
        }
        for (var i = 0; i < exp.Length; i++)
        {
            checkedValues++;
            if (exp[i] != act[i])
            {
                Console.Error.WriteLine($"  MISMATCH {table.Name}.{cols[i].Name} {key}: source '{exp[i]}' target '{act[i]}'");
                mismatches++;
            }
        }
    }
    Console.WriteLine($"  verified {actual.Count,6} rows  {table.Name}");
}

// ---- 5: referential integrity ---------------------------------------------------
var orphans = 0;
await using (var cmd = new NpgsqlCommand(@"
    SELECT c.conname, cl.relname, pl.relname,
           array(SELECT attname FROM unnest(c.conkey) WITH ORDINALITY k(n, o) JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = k.n ORDER BY o),
           array(SELECT attname FROM unnest(c.confkey) WITH ORDINALITY k(n, o) JOIN pg_attribute a ON a.attrelid = c.confrelid AND a.attnum = k.n ORDER BY o)
    FROM pg_constraint c
    JOIN pg_class cl ON cl.oid = c.conrelid
    JOIN pg_class pl ON pl.oid = c.confrelid
    JOIN pg_namespace ns ON ns.oid = cl.relnamespace
    WHERE c.contype = 'f' AND ns.nspname = 'public'", dst))
{
    var fks = new List<(string Name, string Child, string Parent, string[] ChildCols, string[] ParentCols)>();
    await using (var rd = await cmd.ExecuteReaderAsync())
        while (await rd.ReadAsync())
            fks.Add((rd.GetString(0), rd.GetString(1), rd.GetString(2), (string[])rd.GetValue(3), (string[])rd.GetValue(4)));

    foreach (var fk in fks)
    {
        var notNull = string.Join(" AND ", fk.ChildCols.Select(c => $"ch.\"{c}\" IS NOT NULL"));
        var join = string.Join(" AND ", fk.ChildCols.Zip(fk.ParentCols, (c, p) => $"pa.\"{p}\" = ch.\"{c}\""));
        var n = await ScalarAsync<long>(dst, $"SELECT count(*) FROM \"{fk.Child}\" ch WHERE {notNull} AND NOT EXISTS (SELECT 1 FROM \"{fk.Parent}\" pa WHERE {join})");
        if (n > 0)
        {
            orphans += (int)n;
            Console.WriteLine($"  orphan: {n} row(s) in {fk.Child}({string.Join(",", fk.ChildCols)}) point at a missing {fk.Parent} ({fk.Name})");
        }
    }
}

Console.WriteLine();
Console.WriteLine($"Values compared: {checkedValues}, mismatches: {mismatches}, orphaned FK rows: {orphans}");
if (subMicro > 0)
    Console.WriteLine($"Note: {subMicro} date/time value(s) had 100ns digits; PostgreSQL stores microseconds, so the 7th fractional digit was dropped.");
return mismatches == 0 ? 0 : 1;

// ---------------------------------------------------------------------------------

static object ToTarget(object v, Col c) => (v, c.DbType) switch
{
    (DateTime dt, NpgsqlDbType.TimestampTz) => new DateTime(Micro(dt.Ticks), DateTimeKind.Utc),
    (DateTimeOffset o, NpgsqlDbType.TimestampTz) => new DateTime(Micro(o.UtcTicks), DateTimeKind.Utc),
    (DateTimeOffset o, NpgsqlDbType.Timestamp) => new DateTime(Micro(o.UtcDateTime.Ticks), DateTimeKind.Unspecified),
    (DateTime dt, NpgsqlDbType.Date) => dt.Date,
    (DateTime dt, _) => new DateTime(Micro(dt.Ticks), DateTimeKind.Unspecified),
    (TimeSpan ts, NpgsqlDbType.Time) => new TimeSpan(Micro(ts.Ticks)),
    (TimeSpan ts, _) => new TimeSpan(Micro(ts.Ticks)),
    (_, NpgsqlDbType.Integer) => Convert.ToInt32(v, CultureInfo.InvariantCulture),
    (_, NpgsqlDbType.Smallint) => Convert.ToInt16(v, CultureInfo.InvariantCulture),
    (_, NpgsqlDbType.Bigint) => Convert.ToInt64(v, CultureInfo.InvariantCulture),
    (_, NpgsqlDbType.Boolean) => Convert.ToBoolean(v, CultureInfo.InvariantCulture),
    (_, NpgsqlDbType.Numeric) => Convert.ToDecimal(v, CultureInfo.InvariantCulture),
    (_, NpgsqlDbType.Double) => Convert.ToDouble(v, CultureInfo.InvariantCulture),
    (_, NpgsqlDbType.Real) => Convert.ToSingle(v, CultureInfo.InvariantCulture),
    (Guid g, NpgsqlDbType.Text or NpgsqlDbType.Varchar) => g.ToString(),
    _ => v,
};

static long Micro(long ticks) => ticks - ticks % 10;

static string Canon(object? v) => v switch
{
    null => "<NULL>",
    DateTime dt => dt.Ticks.ToString(CultureInfo.InvariantCulture),
    DateOnly d => d.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
    DateTimeOffset o => o.UtcTicks.ToString(CultureInfo.InvariantCulture),
    TimeSpan ts => ts.Ticks.ToString(CultureInfo.InvariantCulture),
    decimal d => d.ToString("0.############################", CultureInfo.InvariantCulture),
    byte[] b => "0x" + Convert.ToHexString(b),
    Guid g => g.ToString("D"),
    bool b => b ? "true" : "false",
    double f => f.ToString("R", CultureInfo.InvariantCulture),
    float f => f.ToString("R", CultureInfo.InvariantCulture),
    IFormattable f => f.ToString(null, CultureInfo.InvariantCulture),
    _ => v.ToString() ?? "",
};

static string KeyOf(Table t, List<Col> cols, object?[] row) =>
    string.Join("|", t.PrimaryKey.Select(pk => Canon(row[cols.FindIndex(c => c.Name == pk)])));

static async Task<Dictionary<string, Table>> LoadTargetSchemaAsync(NpgsqlConnection cn)
{
    var tables = new Dictionary<string, Table>();
    await using (var cmd = new NpgsqlCommand(@"
        SELECT table_name, column_name, data_type, is_nullable = 'YES', column_default IS NOT NULL,
               character_maximum_length, numeric_precision, numeric_scale
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name <> '__EFMigrationsHistory'
        ORDER BY table_name, ordinal_position", cn))
    await using (var rd = await cmd.ExecuteReaderAsync())
    {
        while (await rd.ReadAsync())
        {
            var name = rd.GetString(0);
            if (!tables.TryGetValue(name, out var t)) tables[name] = t = new Table(name);
            var type = rd.GetString(2);
            t.Columns.Add(new Col(rd.GetString(1), type, MapType(type), rd.GetBoolean(3), rd.GetBoolean(4),
                rd.IsDBNull(5) ? null : rd.GetInt32(5),
                type == "numeric" && !rd.IsDBNull(6) ? rd.GetInt32(6) : null,
                type == "numeric" && !rd.IsDBNull(7) ? rd.GetInt32(7) : null));
        }
    }
    await using (var cmd = new NpgsqlCommand(@"
        SELECT tc.table_name, kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON kcu.constraint_name = tc.constraint_name AND kcu.table_schema = tc.table_schema
        WHERE tc.table_schema = 'public' AND tc.constraint_type = 'PRIMARY KEY'
        ORDER BY tc.table_name, kcu.ordinal_position", cn))
    await using (var rd = await cmd.ExecuteReaderAsync())
        while (await rd.ReadAsync())
            if (tables.TryGetValue(rd.GetString(0), out var t)) t.PrimaryKey.Add(rd.GetString(1));

    foreach (var t in tables.Values.Where(t => t.PrimaryKey.Count == 0))
        throw new InvalidOperationException($"{t.Name} has no primary key; rows cannot be verified");
    return tables;
}

static async Task<Dictionary<string, HashSet<string>>> LoadSourceSchemaAsync(SqlConnection cn)
{
    var tables = new Dictionary<string, HashSet<string>>();
    await using var cmd = new SqlCommand(@"
        SELECT c.TABLE_NAME, c.COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS c
        JOIN INFORMATION_SCHEMA.TABLES t ON t.TABLE_NAME = c.TABLE_NAME AND t.TABLE_SCHEMA = c.TABLE_SCHEMA
        WHERE c.TABLE_SCHEMA = 'dbo' AND t.TABLE_TYPE = 'BASE TABLE'", cn);
    await using var rd = await cmd.ExecuteReaderAsync();
    while (await rd.ReadAsync())
    {
        var name = rd.GetString(0);
        if (!tables.TryGetValue(name, out var cols)) tables[name] = cols = new HashSet<string>();
        cols.Add(rd.GetString(1));
    }
    return tables;
}

static NpgsqlDbType MapType(string pgType) => pgType switch
{
    "uuid" => NpgsqlDbType.Uuid,
    "boolean" => NpgsqlDbType.Boolean,
    "smallint" => NpgsqlDbType.Smallint,
    "integer" => NpgsqlDbType.Integer,
    "bigint" => NpgsqlDbType.Bigint,
    "numeric" => NpgsqlDbType.Numeric,
    "real" => NpgsqlDbType.Real,
    "double precision" => NpgsqlDbType.Double,
    "text" => NpgsqlDbType.Text,
    "character varying" => NpgsqlDbType.Varchar,
    "timestamp without time zone" => NpgsqlDbType.Timestamp,
    "timestamp with time zone" => NpgsqlDbType.TimestampTz,
    "date" => NpgsqlDbType.Date,
    "interval" => NpgsqlDbType.Interval,
    "time without time zone" => NpgsqlDbType.Time,
    "bytea" => NpgsqlDbType.Bytea,
    _ => throw new NotSupportedException($"PostgreSQL type '{pgType}' is not handled by the migrator"),
};

static async Task<long> CountAsync(SqlConnection cn, string table)
{
    await using var cmd = new SqlCommand($"SELECT COUNT_BIG(*) FROM [dbo].[{table}]", cn);
    return (long)(await cmd.ExecuteScalarAsync())!;
}

static async Task ExecAsync(NpgsqlConnection cn, string sql)
{
    await using var cmd = new NpgsqlCommand(sql, cn);
    await cmd.ExecuteNonQueryAsync();
}

static async Task<T> ScalarAsync<T>(NpgsqlConnection cn, string sql)
{
    await using var cmd = new NpgsqlCommand(sql, cn);
    return (T)(await cmd.ExecuteScalarAsync())!;
}

static Dictionary<string, string> ParseArgs(string[] a)
{
    var d = new Dictionary<string, string>();
    for (var i = 0; i < a.Length; i++)
    {
        if (!a[i].StartsWith("--")) continue;
        var key = a[i][2..];
        d[key] = i + 1 < a.Length && !a[i + 1].StartsWith("--") ? a[++i] : "true";
    }
    return d;
}

sealed record Col(string Name, string PgType, NpgsqlDbType DbType, bool Nullable, bool HasDefault,
                  int? MaxLength, int? Precision, int? Scale);

sealed class Table(string name)
{
    public string Name { get; } = name;
    public List<Col> Columns { get; } = [];
    public List<string> PrimaryKey { get; } = [];
    public List<Col>? Copied { get; set; }
}
