$ErrorActionPreference = 'Stop'

$psql  = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$dump  = Join-Path $PSScriptRoot "..\..\DataBase Schema\MediCoreX_PostgreSQL.sql"
$db    = "medicorex"
$user  = "medicorex"
$pass  = "medicorex_dev"

$env:PGPASSWORD = 'postgres'

Write-Host "== 1/4 Creating role $user and database $db ==" -ForegroundColor Cyan
& $psql -U postgres -h 127.0.0.1 -w -v ON_ERROR_STOP=1 -c "CREATE ROLE $user LOGIN PASSWORD '$pass' CREATEDB SUPERUSER;"
if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne 3) { Write-Host "role may already exist, continuing" -ForegroundColor Yellow }

& $psql -U postgres -h 127.0.0.1 -w -c "SELECT 1 FROM pg_database WHERE datname='$db'" -t -A | Out-Null
$exists = (& $psql -U postgres -h 127.0.0.1 -w -t -A -c "SELECT count(*) FROM pg_database WHERE datname='$db'").Trim()
if ($exists -eq '0') {
    & $psql -U postgres -h 127.0.0.1 -w -v ON_ERROR_STOP=1 -c "CREATE DATABASE $db OWNER $user;"
} else {
    Write-Host "database $db already exists" -ForegroundColor Yellow
}

Write-Host "== 2/4 Loading schema+data dump (67 tables) ==" -ForegroundColor Cyan
& $psql -U postgres -h 127.0.0.1 -w -d $db -v ON_ERROR_STOP=1 -f $dump
if ($LASTEXITCODE -ne 0) { throw "dump load failed" }

Write-Host "== 3/4 Verifying ==" -ForegroundColor Cyan
$env:PGPASSWORD = $pass
& $psql -U $user -h 127.0.0.1 -w -d $db -t -A -c "SELECT count(*) || ' tables' FROM information_schema.tables WHERE table_schema='public';"
& $psql -U $user -h 127.0.0.1 -w -d $db -t -A -c "SELECT Email FROM public.""Users"" LIMIT 5;"

Write-Host "== 4/4 Done ==" -ForegroundColor Green
