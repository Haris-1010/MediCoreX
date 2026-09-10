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

        optionsBuilder.UseSqlServer(
            "Server=DESKTOP-4LT3VRG;Database=ClinIQ;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True");

        // Provide stub services for design-time (migrations only)
        var tenantService = new StubTenantService();
        var currentUserService = new StubCurrentUserService();
        var dateTimeService = new StubDateTimeService();

        return new ApplicationDbContext(optionsBuilder.Options, tenantService, currentUserService, dateTimeService);
    }
}
