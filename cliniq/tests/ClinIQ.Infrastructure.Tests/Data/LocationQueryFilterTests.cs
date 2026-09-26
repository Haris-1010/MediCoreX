using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Entities.Facility;
using ClinIQ.Domain.Entities.Tenancy;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.Infrastructure.Tests.Data;

/// <summary>
/// SECURITY: combined tenant + location (branch) + soft-delete query filters
/// on ApplicationDbContext. These tests guard multi-location isolation.
/// </summary>
public class LocationQueryFilterTests : IDisposable
{
    private static readonly Guid TenantA = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private static readonly Guid TenantB = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
    private static readonly Guid Branch1 = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private static readonly Guid Branch2 = Guid.Parse("22222222-2222-2222-2222-222222222222");

    private readonly Mock<ITenantService> _tenantService = new();
    private readonly Mock<ICurrentUserService> _currentUser = new();
    private readonly Mock<IDateTimeService> _dateTime = new();
    private readonly ApplicationDbContext _db;

    public LocationQueryFilterTests()
    {
        _dateTime.Setup(d => d.UtcNow).Returns(DateTime.UtcNow);
        _dateTime.Setup(d => d.Now).Returns(DateTime.Now);

        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns(TenantA);
        _tenantService.Setup(t => t.GetCurrentBranchId()).Returns(Branch1);
        _tenantService.Setup(t => t.HasAllLocationAccess()).Returns(false);

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _db = new ApplicationDbContext(
            options,
            _tenantService.Object,
            _currentUser.Object,
            _dateTime.Object);

        _db.Database.EnsureCreated();
        Seed();
    }

    private void Seed()
    {
        // SaveChanges stamps TenantId/BranchId from the ambient context, so each
        // location/org combination must be saved in its own batch.
        SetContext(TenantA, Branch1, allLocations: false);
        _db.Patients.Add(NewPatient(TenantA, Branch1, "A1", "Loc1", "P-A1", "M-A1"));
        _db.Wards.Add(NewWard(TenantA, Branch1, "Ward A1", "WA1"));
        _db.Patients.Add(new Patient
        {
            Id = Guid.NewGuid(),
            TenantId = TenantA,
            BranchId = Branch1,
            FirstName = "Deleted",
            LastName = "Patient",
            PatientNumber = "P-DEL",
            MRN = "M-DEL",
            IsDeleted = true
        });
        _db.Branches.Add(NewBranch(TenantA, "Loc One", "L1"));
        _db.Branches.Add(NewBranch(TenantA, "Loc Two", "L2"));
        _db.SaveChanges();

        SetContext(TenantA, Branch2, allLocations: false);
        _db.Patients.Add(NewPatient(TenantA, Branch2, "A2", "Loc2", "P-A2", "M-A2"));
        _db.Wards.Add(NewWard(TenantA, Branch2, "Ward A2", "WA2"));
        _db.SaveChanges();

        SetContext(TenantB, Branch1, allLocations: false);
        _db.Patients.Add(NewPatient(TenantB, Branch1, "B1", "OtherOrg", "P-B1", "M-B1"));
        _db.Wards.Add(NewWard(TenantB, Branch1, "Ward B1", "WB1"));
        _db.Branches.Add(NewBranch(TenantB, "Other Org Loc", "OX"));
        _db.SaveChanges();
    }

    private void SetContext(Guid tenantId, Guid branchId, bool allLocations)
    {
        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns(tenantId);
        _tenantService.Setup(t => t.GetCurrentBranchId()).Returns(branchId);
        _tenantService.Setup(t => t.HasAllLocationAccess()).Returns(allLocations);
    }

    private static Patient NewPatient(Guid tenantId, Guid? branchId, string first, string last, string number, string mrn) => new()
    {
        Id = Guid.NewGuid(),
        TenantId = tenantId,
        BranchId = branchId,
        FirstName = first,
        LastName = last,
        PatientNumber = number,
        MRN = mrn
    };

    private static Ward NewWard(Guid tenantId, Guid? branchId, string name, string code) => new()
    {
        Id = Guid.NewGuid(),
        TenantId = tenantId,
        BranchId = branchId,
        Name = name,
        Code = code
    };

    private static Branch NewBranch(Guid tenantId, string name, string code) => new()
    {
        Id = Guid.NewGuid(),
        TenantId = tenantId,
        Name = name,
        Code = code
    };

    public void Dispose() => _db.Dispose();

    [Fact]
    public void BranchScoped_WhenSpecificBranch_SeesOnlyOwnLocation()
    {
        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns(TenantA);
        _tenantService.Setup(t => t.GetCurrentBranchId()).Returns(Branch1);
        _tenantService.Setup(t => t.HasAllLocationAccess()).Returns(false);

        var patients = _db.Patients.ToList();
        var wards = _db.Wards.ToList();

        patients.Should().ContainSingle(p => p.FirstName == "A1");
        patients.Should().NotContain(p => p.FirstName == "A2");
        patients.Should().NotContain(p => p.FirstName == "B1");
        patients.Should().NotContain(p => p.FirstName == "Deleted");

        wards.Should().ContainSingle(w => w.Name == "Ward A1");
        wards.Should().NotContain(w => w.Name == "Ward A2");
        wards.Should().NotContain(w => w.Name == "Ward B1");
    }

    [Fact]
    public void BranchScoped_WhenAllLocationAccess_SeesAllLocationsInTenant()
    {
        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns(TenantA);
        _tenantService.Setup(t => t.GetCurrentBranchId()).Returns((Guid?)null);
        _tenantService.Setup(t => t.HasAllLocationAccess()).Returns(true);

        var patients = _db.Patients.ToList();

        patients.Should().HaveCount(2);
        patients.Should().Contain(p => p.FirstName == "A1");
        patients.Should().Contain(p => p.FirstName == "A2");
        patients.Should().NotContain(p => p.FirstName == "B1");
        patients.Should().NotContain(p => p.FirstName == "Deleted");
    }

    [Fact]
    public void BranchScoped_WhenNoBranchAndNoAllAccess_FailsClosed()
    {
        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns(TenantA);
        _tenantService.Setup(t => t.GetCurrentBranchId()).Returns((Guid?)null);
        _tenantService.Setup(t => t.HasAllLocationAccess()).Returns(false);

        _db.Patients.Should().BeEmpty();
        _db.Wards.Should().BeEmpty();
    }

    [Fact]
    public void TenantScoped_WhenOtherTenantContext_SeesOnlyOwnOrg()
    {
        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns(TenantB);
        _tenantService.Setup(t => t.GetCurrentBranchId()).Returns(Branch1);
        _tenantService.Setup(t => t.HasAllLocationAccess()).Returns(true);

        var patients = _db.Patients.ToList();

        patients.Should().ContainSingle(p => p.FirstName == "B1");
        patients.Should().NotContain(p => p.FirstName.StartsWith("A"));
    }

    [Fact]
    public void TenantScoped_WhenNoTenantContext_FailsClosed()
    {
        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns((Guid?)null);
        _tenantService.Setup(t => t.GetCurrentBranchId()).Returns((Guid?)null);
        _tenantService.Setup(t => t.HasAllLocationAccess()).Returns(false);

        _db.Patients.Should().BeEmpty();
        _db.Branches.Should().BeEmpty();
    }

    [Fact]
    public void SoftDelete_IsAlwaysFiltered()
    {
        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns(TenantA);
        _tenantService.Setup(t => t.GetCurrentBranchId()).Returns(Branch1);
        _tenantService.Setup(t => t.HasAllLocationAccess()).Returns(true);

        _db.Patients.Should().NotContain(p => p.FirstName == "Deleted");
        _db.Patients.IgnoreQueryFilters().Should().Contain(p => p.FirstName == "Deleted");
    }

    [Fact]
    public void Branches_AreOrgWide_NotLocationScoped()
    {
        // Branch rows themselves are org-level (not IBranchEntity).
        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns(TenantA);
        _tenantService.Setup(t => t.GetCurrentBranchId()).Returns(Branch1);
        _tenantService.Setup(t => t.HasAllLocationAccess()).Returns(false);

        var branches = _db.Branches.ToList();

        branches.Should().HaveCount(2);
        branches.Should().NotContain(b => b.TenantId == TenantB);
    }

    [Fact]
    public async Task SaveChanges_StampsCurrentBranchAndTenant_OnCreate()
    {
        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns(TenantA);
        _tenantService.Setup(t => t.GetCurrentBranchId()).Returns(Branch2);
        _tenantService.Setup(t => t.HasAllLocationAccess()).Returns(false);

        var patient = new Patient
        {
            Id = Guid.NewGuid(),
            FirstName = "Stamped",
            LastName = "Row",
            PatientNumber = "P-STAMP",
            MRN = "M-STAMP"
            // TenantId / BranchId intentionally omitted — must be stamped.
        };

        _db.Patients.Add(patient);
        await _db.SaveChangesAsync();

        patient.TenantId.Should().Be(TenantA);
        patient.BranchId.Should().Be(Branch2);

        var reloaded = await _db.Patients.IgnoreQueryFilters()
            .SingleAsync(p => p.Id == patient.Id);
        reloaded.TenantId.Should().Be(TenantA);
        reloaded.BranchId.Should().Be(Branch2);
    }

    [Fact]
    public void GetById_CrossLocation_ReturnsNull()
    {
        _tenantService.Setup(t => t.GetCurrentTenantId()).Returns(TenantA);
        _tenantService.Setup(t => t.GetCurrentBranchId()).Returns(Branch1);
        _tenantService.Setup(t => t.HasAllLocationAccess()).Returns(false);

        var otherLocationPatient = _db.Patients.IgnoreQueryFilters()
            .Single(p => p.TenantId == TenantA && p.BranchId == Branch2);

        _db.Patients.FirstOrDefault(p => p.Id == otherLocationPatient.Id).Should().BeNull();
    }
}
