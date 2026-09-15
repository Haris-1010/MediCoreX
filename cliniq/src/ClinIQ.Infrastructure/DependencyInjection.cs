using ClinIQ.Application.Interfaces;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Infrastructure.Data.Repositories;
using ClinIQ.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ClinIQ.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        // Repositories
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Permission and entitlement caches are per-node, 5-10 minute TTL.
        // Swap for IDistributedCache (Redis) when running more than one node.
        services.AddMemoryCache();

        // Services
        services.AddScoped<ITenantService, TenantService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IDateTimeService, DateTimeService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IPermissionService, PermissionService>();
        services.AddScoped<IEntitlementService, EntitlementService>();
        services.AddScoped<IOrganizationProvisioningService, OrganizationProvisioningService>();
        services.AddScoped<IServiceService, ServiceService>();

        // Seeding
        services.AddScoped<Data.Seeding.PermissionSeeder>();

        return services;
    }
}
