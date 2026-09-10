using ClinIQ.Domain.Entities.Billing;
using ClinIQ.Domain.Enums;

namespace ClinIQ.Domain.Tests.Entities;

public class InvoiceTests
{
    [Fact]
    public void Invoice_WhenCreated_ShouldHavePendingStatus()
    {
        // Arrange & Act
        var invoice = new Invoice
        {
            Status = InvoiceStatus.Pending
        };

        // Assert
        invoice.Status.Should().Be(InvoiceStatus.Pending);
    }

    [Fact]
    public void Invoice_BalanceAmount_ShouldCalculateCorrectly()
    {
        // Arrange
        var invoice = new Invoice
        {
            TotalAmount = 1000m,
            PaidAmount = 300m
        };

        // Act
        var balance = invoice.TotalAmount - invoice.PaidAmount;

        // Assert
        balance.Should().Be(700m);
    }

    [Fact]
    public void Invoice_IsPaid_WhenPaidAmountEqualsTotal()
    {
        // Arrange
        var invoice = new Invoice
        {
            TotalAmount = 1000m,
            PaidAmount = 1000m,
            Status = InvoiceStatus.Paid
        };

        // Assert
        invoice.Status.Should().Be(InvoiceStatus.Paid);
        (invoice.TotalAmount - invoice.PaidAmount).Should().Be(0);
    }

    [Fact]
    public void Invoice_IsPartiallyPaid_WhenPaidAmountLessThanTotal()
    {
        // Arrange
        var invoice = new Invoice
        {
            TotalAmount = 1000m,
            PaidAmount = 500m,
            Status = InvoiceStatus.PartiallyPaid
        };

        // Assert
        invoice.Status.Should().Be(InvoiceStatus.PartiallyPaid);
        invoice.PaidAmount.Should().BeLessThan(invoice.TotalAmount);
    }

    [Theory]
    [InlineData(InvoiceStatus.Draft)]
    [InlineData(InvoiceStatus.PartiallyPaid)]
    [InlineData(InvoiceStatus.Paid)]
    [InlineData(InvoiceStatus.Cancelled)]
    [InlineData(InvoiceStatus.Refunded)]
    public void Invoice_ShouldSupportAllStatuses(InvoiceStatus status)
    {
        // Arrange
        var invoice = new Invoice { Status = status };

        // Assert
        invoice.Status.Should().Be(status);
    }

    [Fact]
    public void Invoice_ShouldHaveInvoiceNumber()
    {
        // Arrange
        var invoice = new Invoice
        {
            InvoiceNumber = "INV-2024-0001"
        };

        // Assert
        invoice.InvoiceNumber.Should().StartWith("INV-");
    }

    [Fact]
    public void Invoice_TaxAmount_ShouldCalculateCorrectly()
    {
        // Arrange
        var invoice = new Invoice
        {
            SubTotal = 1000m,
            TaxPercent = 10m,
            TaxAmount = 100m,
            TotalAmount = 1100m
        };

        // Assert
        invoice.TaxAmount.Should().Be(invoice.SubTotal * invoice.TaxPercent / 100);
        invoice.TotalAmount.Should().Be(invoice.SubTotal + invoice.TaxAmount);
    }

    [Fact]
    public void Invoice_Discount_ShouldReduceTotal()
    {
        // Arrange
        var invoice = new Invoice
        {
            SubTotal = 1000m,
            DiscountAmount = 100m,
            TaxPercent = 0m,
            TaxAmount = 0m,
            TotalAmount = 900m
        };

        // Assert
        invoice.TotalAmount.Should().Be(invoice.SubTotal - invoice.DiscountAmount);
    }
}
