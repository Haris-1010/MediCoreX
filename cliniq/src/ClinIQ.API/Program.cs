using ClinIQ.API.Extensions;
using ClinIQ.API.Middleware;
using ClinIQ.Application;
using ClinIQ.Infrastructure;
using Serilog;
using ClinIQ.Shared.Constants;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Domain.Entities.Identity;
using ClinIQ.API.Authorization;
using ClinIQ.Infrastructure.Data.Seeding;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();

// Add services
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApiServices(builder.Configuration);

// Permission-based authorization. PermissionPolicyProvider materialises the
// PERM:* policies produced by [RequirePermission] at request time, so new
// permissions need no startup registration.
builder.Services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
builder.Services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();
builder.Services.AddScoped<IAuthorizationMiddlewareResultHandler, PermissionAuthorizationMiddlewareResultHandler>();

var app = builder.Build();

// Configure middleware pipeline
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<CorrelationIdMiddleware>();
app.UseMiddleware<AuditContextMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ClinIQ API V1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowedOrigins");

app.UseStaticFiles();

app.UseAuthentication();

// Must sit between authentication and authorization: it re-checks tenant
// membership on every request and is the only place super-admin impersonation
// is accepted.
app.UseTenantResolution();

app.UseAuthorization();

app.MapControllers();
app.MapHub<ClinIQ.API.Hubs.NotificationHub>("/hubs/notifications");
app.MapHub<ClinIQ.API.Hubs.QueueHub>("/hubs/queue");
// The edge routes /api/* to this container when the app runs as parts, so
// the hubs are also exposed under /api for the Angular SignalR client.
app.MapHub<ClinIQ.API.Hubs.NotificationHub>("/api/hubs/notifications");
app.MapHub<ClinIQ.API.Hubs.QueueHub>("/api/hubs/queue");

app.MapHealthChecks("/health");

// The image ships the Angular build in wwwroot. Static files are already
// served above; this only catches extension-less paths (an Angular route
// like /login on a hard refresh) and hands them the SPA shell, while /api,
// /hubs and /health keep their own answers.
var spaIndex = Path.Combine(AppContext.BaseDirectory, "wwwroot", "index.html");
if (File.Exists(spaIndex))
{
    app.MapWhen(
        ctx => !ctx.Request.Path.StartsWithSegments("/api")
            && !ctx.Request.Path.StartsWithSegments("/hubs")
            && !ctx.Request.Path.StartsWithSegments("/health")
            && !ctx.Request.Path.StartsWithSegments("/swagger")
            && !Path.HasExtension(ctx.Request.Path),
        branch => branch.Run(async ctx =>
        {
            ctx.Response.ContentType = "text/html; charset=utf-8";
            await ctx.Response.SendFileAsync(spaIndex);
        }));
}

try
{
    // Seed permissions, system roles and their default grants. Idempotent, so
    // it is safe on every start; it is how the DB stays in sync with the code.
    using (var scope = app.Services.CreateScope())
    {
        try
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var pending = (await db.Database.GetPendingMigrationsAsync()).ToList();
            if (pending.Count > 0)
                Log.Information("Applying {Count} pending migrations: {Migrations}", pending.Count, string.Join(", ", pending));
            await db.Database.MigrateAsync();
            Log.Information("Database migrations are up to date.");
        }
        catch (Exception migrateEx)
        {
            Log.Error(migrateEx, "Auto-migration failed. Pending migrations may need manual application.");
        }

        try
        {
            var seeder = scope.ServiceProvider.GetRequiredService<PermissionSeeder>();
            seeder.SeedAsync().GetAwaiter().GetResult();
        }
        catch (Exception seedEx)
        {
            // Do not take the API down if seeding fails - log loudly instead.
            Log.Error(seedEx, "Permission seeding failed at startup.");
        }
    }

    Log.Information("Starting ClinIQ API");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
