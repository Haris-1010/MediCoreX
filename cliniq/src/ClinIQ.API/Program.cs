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

app.MapHealthChecks("/health");

try
{
    // Seed permissions, system roles and their default grants. Idempotent, so
    // it is safe on every start; it is how the DB stays in sync with the code.
    using (var scope = app.Services.CreateScope())
    {
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
