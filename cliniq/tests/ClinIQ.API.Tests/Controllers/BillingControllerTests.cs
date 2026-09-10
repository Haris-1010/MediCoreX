using ClinIQ.API.Controllers;
using ClinIQ.Application.Interfaces;
using ClinIQ.Application.DTOs.Billing;
using ClinIQ.Shared.Models;
using Microsoft.AspNetCore.Mvc;

namespace ClinIQ.API.Tests.Controllers;

public class BillingControllerTests
{
    private readonly Mock<IBillingService> _billingServiceMock;
    private readonly BillingController _controller;
    private readonly Fixture _fixture;

    public BillingControllerTests()
    {
        _billingServiceMock = new Mock<IBillingService>();
        _controller = new BillingController(_billingServiceMock.Object);
        _fixture = new Fixture();
    }

    [Fact]
    public async Task GetInvoices_ReturnsOkResult_WithPagedInvoices()
    {
        // Arrange
        var invoices = _fixture.CreateMany<InvoiceListDto>(10).ToList();
        var pagedResult = new PagedResult<InvoiceListDto>
        {
            Items = invoices,
            TotalCount = 10,
            PageNumber = 1,
            PageSize = 10
        };
        _billingServiceMock.Setup(s => s.GetInvoicesAsync(It.IsAny<InvoiceQueryParameters>()))
            .ReturnsAsync(pagedResult);

        // Act
        var result = await _controller.GetInvoices(new InvoiceQueryParameters());

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeOfType<PagedResult<InvoiceListDto>>().Subject;
        returnValue.Items.Should().HaveCount(10);
    }

    [Fact]
    public async Task GetInvoiceById_WithValidId_ReturnsOkResult()
    {
        // Arrange
        var invoiceId = Guid.NewGuid();
        var invoice = _fixture.Build<InvoiceDetailDto>()
            .With(i => i.Id, invoiceId)
            .Create();
        _billingServiceMock.Setup(s => s.GetInvoiceByIdAsync(invoiceId))
            .ReturnsAsync(invoice);

        // Act
        var result = await _controller.GetInvoiceById(invoiceId);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeOfType<InvoiceDetailDto>().Subject;
        returnValue.Id.Should().Be(invoiceId);
    }

    [Fact]
    public async Task CreateInvoice_WithValidData_ReturnsCreatedResult()
    {
        // Arrange
        var createDto = _fixture.Create<CreateInvoiceDto>();
        var createdInvoice = _fixture.Create<InvoiceDetailDto>();
        _billingServiceMock.Setup(s => s.CreateInvoiceAsync(createDto))
            .ReturnsAsync(createdInvoice);

        // Act
        var result = await _controller.CreateInvoice(createDto);

        // Assert
        var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        createdResult.ActionName.Should().Be(nameof(BillingController.GetInvoiceById));
    }

    [Fact]
    public async Task RecordPayment_WithValidData_ReturnsOkResult()
    {
        // Arrange
        var invoiceId = Guid.NewGuid();
        var paymentDto = _fixture.Create<RecordPaymentDto>();
        var payment = _fixture.Create<PaymentDto>();
        _billingServiceMock.Setup(s => s.RecordPaymentAsync(invoiceId, paymentDto))
            .ReturnsAsync(payment);

        // Act
        var result = await _controller.RecordPayment(invoiceId, paymentDto);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetPatientBalance_ReturnsPatientFinancialSummary()
    {
        // Arrange
        var patientId = Guid.NewGuid();
        var balance = _fixture.Create<PatientBalanceDto>();
        _billingServiceMock.Setup(s => s.GetPatientBalanceAsync(patientId))
            .ReturnsAsync(balance);

        // Act
        var result = await _controller.GetPatientBalance(patientId);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().BeOfType<PatientBalanceDto>();
    }

    [Fact]
    public async Task VoidInvoice_WithValidId_ReturnsOkResult()
    {
        // Arrange
        var invoiceId = Guid.NewGuid();
        var voidDto = new VoidInvoiceDto { Reason = "Duplicate entry" };
        _billingServiceMock.Setup(s => s.VoidInvoiceAsync(invoiceId, voidDto.Reason))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.VoidInvoice(invoiceId, voidDto);

        // Assert
        result.Should().BeOfType<OkResult>();
    }

    [Fact]
    public async Task GetRevenueReport_ReturnsRevenueData()
    {
        // Arrange
        var startDate = DateTime.Today.AddMonths(-1);
        var endDate = DateTime.Today;
        var report = _fixture.Create<RevenueReportDto>();
        _billingServiceMock.Setup(s => s.GetRevenueReportAsync(startDate, endDate))
            .ReturnsAsync(report);

        // Act
        var result = await _controller.GetRevenueReport(startDate, endDate);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().BeOfType<RevenueReportDto>();
    }
}
