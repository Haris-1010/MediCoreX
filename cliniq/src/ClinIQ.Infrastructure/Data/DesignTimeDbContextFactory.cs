using ClinIQ.Infrastructure.Data;
using ClinIQ.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ClinIQ.Infrastructure.Data;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

        // Only used by `dotnet ef`; override with CLINIQ_DESIGN_CONNECTION if needed.
        optionsBuilder.UseNpgsql(
            Environment.GetEnvironmentVariable("CLINIQ_DESIGN_CONNECTION")
            ?? "Host=localhost;Port=5432;Database=medicorex;Username=medicorex;Password=medicorex_dev");

        // Provide stub services for design-time (migrations only)
        var tenantService = new StubTenantService();
        var currentUserService = new StubCurrentUserService();
        var dateTimeService = new StubDateTimeService();

        return new ApplicationDbContext(optionsBuilder.Options, tenantService, currentUserService, dateTimeService);
    }
}
