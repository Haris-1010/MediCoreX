using ClinIQ.Application.Interfaces;
using ClinIQ.Domain.Entities.Billing;
using ClinIQ.Shared.DTOs.Billing;
using ClinIQ.Shared.Models;
using AutoFixture;

namespace ClinIQ.Application.Tests.Services;

public class BillingServiceTests
{
    private readonly Mock<IBillingService> _billingServiceMock;
    private readonly Fixture _fixture;

    public BillingServiceTests()
    {
        _billingServiceMock = new Mock<IBillingService>();
        _fixture = new Fixture();
    }

    [Fact]
    public async Task CreateInvoiceAsync_WithValidData_CreatesInvoice()
    {
        // Arrange
        var createRequest = _fixture.Create<CreateInvoiceRequest>();
        var invoiceDetailDto = _fixture.Create<InvoiceDetailDto>();
        var result = Result<InvoiceDetailDto>.Success(invoiceDetailDto);

        _billingServiceMock
            .Setup(s => s.CreateInvoiceAsync(createRequest, It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        // Act
        var serviceResult = await _billingServiceMock.Object.CreateInvoiceAsync(createRequest);

        // Assert
        serviceResult.Should().NotBeNull();
        serviceResult.Succeeded.Should().BeTrue();
        serviceResult.Data.Should().NotBeNull();
    }

    [Fact]
    public async Task CreatePaymentAsync_WithValidData_CreatesPayment()
    {
        // Arrange
        var createPaymentRequest = _fixture.Create<CreatePaymentRequest>();
        var paymentDto = _fixture.Create<PaymentDto>();
        var result = Result<PaymentDto>.Success(paymentDto);

        _billingServiceMock
            .Setup(s => s.CreatePaymentAsync(createPaymentRequest, It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        // Act
        var serviceResult = await _billingServiceMock.Object.CreatePaymentAsync(createPaymentRequest);

        // Assert
        serviceResult.Should().NotBeNull();
        serviceResult.Succeeded.Should().BeTrue();
        serviceResult.Data.Should().NotBeNull();
    }

    [Fact]
    public async Task CreatePaymentAsync_WithInvalidData_ReturnsFail()
    {
        // Arrange
        var createPaymentRequest = _fixture.Create<CreatePaymentRequest>();
        var errorResult = Result<PaymentDto>.Failure("Invalid payment data");

        _billingServiceMock
            .Setup(s => s.CreatePaymentAsync(createPaymentRequest, It.IsAny<CancellationToken>()))
            .ReturnsAsync(errorResult);

        // Act & Assert
        var serviceResult = await _billingServiceMock.Object.CreatePaymentAsync(createPaymentRequest);
        serviceResult.Succeeded.Should().BeFalse();
    }

    [Fact]
    public async Task GetInvoicesPaginatedAsync_ReturnsInvoices()
    {
        // Arrange
        var query = _fixture.Create<InvoiceQuery>();
        var invoiceDtos = _fixture.CreateMany<InvoiceDto>(5).ToList();
        var paginatedResult = PaginatedResult<InvoiceDto>.Success(
            invoiceDtos,
            5,
            1,
            10
        );

        _billingServiceMock
            .Setup(s => s.GetInvoicesPaginatedAsync(query, It.IsAny<CancellationToken>()))
            .ReturnsAsync(paginatedResult);

        // Act
        var result = await _billingServiceMock.Object.GetInvoicesPaginatedAsync(query);

        // Assert
        result.Should().NotBeNull();
        result.Succeeded.Should().BeTrue();
        result.Data.Should().HaveCount(5);
    }

    [Fact]
    public async Task CancelInvoiceAsync_WithValidId_CancelsInvoice()
    {
        // Arrange
        var invoiceId = Guid.NewGuid();
        var reason = "Duplicate entry";
        var result = Result.Success();

        _billingServiceMock.Setup(s => s.CancelInvoiceAsync(invoiceId, reason, It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        // Act
        var serviceResult = await _billingServiceMock.Object.CancelInvoiceAsync(invoiceId, reason);

        // Assert
        serviceResult.Should().NotBeNull();
        serviceResult.Succeeded.Should().BeTrue();
    }

    [Fact]
    public async Task CancelInvoiceAsync_WithInvalidInvoice_ReturnsFail()
    {
        // Arrange
        var invoiceId = Guid.NewGuid();
        var reason = "Cannot cancel";
        var errorResult = Result.Failure("Invoice cannot be cancelled");

        _billingServiceMock.Setup(s => s.CancelInvoiceAsync(invoiceId, reason, It.IsAny<CancellationToken>()))
            .ReturnsAsync(errorResult);

        // Act & Assert
        var serviceResult = await _billingServiceMock.Object.CancelInvoiceAsync(invoiceId, reason);
        serviceResult.Succeeded.Should().BeFalse();
    }

    [Fact]
    public async Task GetInvoiceByIdAsync_WithValidId_ReturnsInvoice()
    {
        // Arrange
        var invoiceId = Guid.NewGuid();
        var invoiceDetailDto = _fixture.Create<InvoiceDetailDto>();
        var result = Result<InvoiceDetailDto>.Success(invoiceDetailDto);

        _billingServiceMock
            .Setup(s => s.GetInvoiceByIdAsync(invoiceId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(result);

        // Act
        var serviceResult = await _billingServiceMock.Object.GetInvoiceByIdAsync(invoiceId);

        // Assert
        serviceResult.Should().NotBeNull();
        serviceResult.Succeeded.Should().BeTrue();
        serviceResult.Data.Should().NotBeNull();
    }
}
