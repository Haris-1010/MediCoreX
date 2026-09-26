using ClinIQ.Domain.Common;
using ClinIQ.Domain.Entities.Billing;
using ClinIQ.Domain.Entities.Clinical;
using ClinIQ.Domain.Entities.Inventory;
using ClinIQ.Domain.Entities.Tenancy;

namespace ClinIQ.Domain.Tests.Common;

public class AuditSemanticTests
{
    private static readonly IReadOnlyDictionary<string, object?> NoValues = new Dictionary<string, object?>();

    private static AuditSemantic? Update(Type type, string field, object? before, object? after) =>
        AuditPolicy.ResolveSemantic(type, "UPDATE", "Thing", "X",
            new Dictionary<string, (object?, object?)> { [field] = (before, after) }, NoValues, passwordChanged: false);

    [Theory]
    [InlineData(typeof(Admission), "Discharged", "PATIENT_DISCHARGED")]
    [InlineData(typeof(Invoice), "Paid", "INVOICE_PAID")]
    [InlineData(typeof(RadiologyOrderItem), "Verified", "RADIOLOGY_REPORT_VERIFIED")]
    [InlineData(typeof(PurchaseOrder), "Received", "PURCHASE_RECEIVED")]
    public void KnownStatusTransitions_AreNamed(Type type, string status, string expected) =>
        Update(type, "Status", "Pending", status)!.Action.Should().Be(expected);

    [Fact]
    public void UnknownStatusTransition_IsStatusChanged_WithBeforeAndAfter()
    {
        var semantic = Update(typeof(Visit), "Status", "Open", "Closed");
        semantic!.Action.Should().Be("STATUS_CHANGED");
        semantic.Description.Should().Contain("Open").And.Contain("Closed");
    }

    [Fact]
    public void Dispensing_IsNamed() =>
        Update(typeof(Prescription), "IsDispensed", false, true)!.Action.Should().Be("MEDICINE_DISPENSED");

    [Fact]
    public void Adjustment_Movement_IsStockAdjusted() =>
        AuditPolicy.ResolveSemantic(typeof(StockMovement), "CREATE", "Stock Movement", "SM-1",
            new Dictionary<string, (object?, object?)>(),
            new Dictionary<string, object?> { ["MovementType"] = "Adjustment" }, false)!
            .Action.Should().Be("STOCK_ADJUSTED");

    [Fact]
    public void PlainFieldEdit_KeepsGenericVerb() =>
        Update(typeof(Invoice), "Notes", "a", "b").Should().BeNull();

    [Fact]
    public void BranchDeactivation_IsLocationDeactivated() =>
        Update(typeof(Branch), "IsActive", true, false)!.Action.Should().Be("LOCATION_DEACTIVATED");

    [Theory]
    [InlineData("PasswordHash")]
    [InlineData("RefreshToken")]
    [InlineData("ApiKey")]
    [InlineData("PlainPassword")]
    [InlineData("SmtpPassword")]
    public void Secrets_AreNeverAuditable(string field) =>
        AuditPolicy.IsAuditableField(field).Should().BeFalse();

    [Theory]
    [InlineData("Diagnosis")]
    [InlineData("Findings")]
    [InlineData("Allergies")]
    public void ClinicalText_IsNeverAuditable(string field) =>
        AuditPolicy.IsAuditableField(field).Should().BeFalse();
}
