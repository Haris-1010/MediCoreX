using ClinIQ.Domain.Common;
using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Entities.Facility;

namespace ClinIQ.Domain.Tests.Common;

public class BranchEntityTests
{
    [Fact]
    public void Patient_IsBranchScoped_AndTenantScoped()
    {
        var patient = new Patient();

        patient.Should().BeAssignableTo<IBranchEntity>();
        patient.Should().BeAssignableTo<ITenantEntity>();
        patient.Should().BeAssignableTo<BaseAuditableEntity>();
        patient.BranchId.Should().BeNull();
        patient.TenantId.Should().BeNull();
        patient.IsDeleted.Should().BeFalse();
    }

    [Fact]
    public void Appointment_IsBranchScoped()
    {
        new Appointment().Should().BeAssignableTo<IBranchEntity>();
    }

    [Fact]
    public void Admission_IsBranchScoped()
    {
        new Admission().Should().BeAssignableTo<IBranchEntity>();
    }

    [Fact]
    public void Ward_IsBranchScoped()
    {
        new Ward().Should().BeAssignableTo<IBranchEntity>();
    }

    [Fact]
    public void Branch_IsTenantScoped_ButNotLocationScoped()
    {
        var branch = new ClinIQ.Domain.Entities.Tenancy.Branch();

        branch.Should().BeAssignableTo<ITenantEntity>();
        branch.Should().NotBeAssignableTo<IBranchEntity>();
        branch.IsActive.Should().BeTrue();
    }

    [Fact]
    public void Tenant_IsNotTenantScoped_UsesOwnSoftDeleteOnly()
    {
        var tenant = new ClinIQ.Domain.Entities.Tenancy.Tenant();

        tenant.Should().NotBeAssignableTo<ITenantEntity>();
        tenant.Should().BeAssignableTo<BaseAuditableEntity>();
        tenant.IsActive.Should().BeTrue();
    }

    [Fact]
    public void IBranchEntity_Extends_ITenantEntity()
    {
        typeof(ITenantEntity).IsAssignableFrom(typeof(IBranchEntity)).Should().BeTrue();
    }
}
