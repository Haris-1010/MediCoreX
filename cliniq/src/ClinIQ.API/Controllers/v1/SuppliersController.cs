using ClinIQ.Domain.Entities.Inventory;
using ClinIQ.Domain.Interfaces;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Models;
using ClinIQ.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class SuppliersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;

    public SuppliersController(ApplicationDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.SuppliersView)]
    public async Task<IActionResult> GetSuppliers(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        var query = _context.Suppliers.Where(s => !s.IsDeleted && s.TenantId == tenantId);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(s =>
                s.Name.ToLower().Contains(term) ||
                (s.Code != null && s.Code.ToLower().Contains(term)) ||
                (s.Email != null && s.Email.ToLower().Contains(term)) ||
                (s.Phone != null && s.Phone.Contains(term)));
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(s => s.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new
            {
                s.Id,
                s.Name,
                s.Code,
                s.Email,
                s.Phone,
                s.Address,
                s.City,
                s.ContactPersonName,
                s.PaymentTermsDays,
                s.CreditLimit,
                s.OutstandingPayable,
                s.Rating,
                s.IsActive
            })
            .ToListAsync();

        return Ok(Result<object>.Success(new { items, totalCount, pageNumber, pageSize }));
    }

    [HttpGet("all")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.SuppliersView)]
    public async Task<IActionResult> GetAllSuppliers()
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        var suppliers = await _context.Suppliers
            .Where(s => !s.IsDeleted && s.IsActive && s.TenantId == tenantId)
            .OrderBy(s => s.Name)
            .Select(s => new
            {
                s.Id,
                s.Name,
                s.Code,
                s.Phone,
                s.Email
            })
            .ToListAsync();

        return Ok(Result<object>.Success(suppliers));
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.SuppliersView)]
    public async Task<IActionResult> GetSupplier(Guid id)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        var supplier = await _context.Suppliers
            .Where(s => s.Id == id && !s.IsDeleted && s.TenantId == tenantId)
            .Select(s => new
            {
                s.Id,
                s.Name,
                s.Code,
                s.Description,
                s.Email,
                s.Phone,
                s.Fax,
                s.Website,
                s.Address,
                s.City,
                s.State,
                s.Country,
                s.PostalCode,
                s.TaxNumber,
                s.PanNumber,
                s.ContactPersonName,
                s.ContactPersonPhone,
                s.ContactPersonEmail,
                s.PaymentTermsDays,
                s.CreditLimit,
                s.PaymentMethod,
                s.BankName,
                s.BankAccountNumber,
                s.BankBranch,
                s.IFSC,
                s.OutstandingPayable,
                s.Rating,
                s.IsActive
            })
            .FirstOrDefaultAsync();

        if (supplier == null)
            return NotFound(Result.Failure("Supplier not found"));

        return Ok(Result<object>.Success(supplier));
    }

    [HttpPost]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.SuppliersManage)]
    public async Task<IActionResult> CreateSupplier([FromBody] CreateSupplierRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));

        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(Result.Failure("Supplier name is required"));

        var supplier = new Supplier
        {
            Name = request.Name,
            Code = request.Code,
            Description = request.Description,
            Email = request.Email,
            Phone = request.Phone,
            Fax = request.Fax,
            Website = request.Website,
            Address = request.Address,
            City = request.City,
            State = request.State,
            Country = request.Country,
            PostalCode = request.PostalCode,
            TaxNumber = request.TaxNumber,
            PanNumber = request.PanNumber,
            ContactPersonName = request.ContactPersonName,
            ContactPersonPhone = request.ContactPersonPhone,
            ContactPersonEmail = request.ContactPersonEmail,
            PaymentTermsDays = request.PaymentTermsDays,
            CreditLimit = request.CreditLimit,
            PaymentMethod = request.PaymentMethod,
            BankName = request.BankName,
            BankAccountNumber = request.BankAccountNumber,
            BankBranch = request.BankBranch,
            IFSC = request.IFSC,
            IsActive = true,
            TenantId = tenantId
        };

        _context.Suppliers.Add(supplier);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { supplier.Id }, "Supplier created successfully"));
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.SuppliersManage)]
    public async Task<IActionResult> UpdateSupplier(Guid id, [FromBody] CreateSupplierRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        var supplier = await _context.Suppliers.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted && s.TenantId == tenantId);
        if (supplier == null)
            return NotFound(Result.Failure("Supplier not found"));

        supplier.Name = request.Name ?? supplier.Name;
        supplier.Code = request.Code;
        supplier.Description = request.Description;
        supplier.Email = request.Email;
        supplier.Phone = request.Phone;
        supplier.Fax = request.Fax;
        supplier.Website = request.Website;
        supplier.Address = request.Address;
        supplier.City = request.City;
        supplier.State = request.State;
        supplier.Country = request.Country;
        supplier.PostalCode = request.PostalCode;
        supplier.TaxNumber = request.TaxNumber;
        supplier.PanNumber = request.PanNumber;
        supplier.ContactPersonName = request.ContactPersonName;
        supplier.ContactPersonPhone = request.ContactPersonPhone;
        supplier.ContactPersonEmail = request.ContactPersonEmail;
        supplier.PaymentTermsDays = request.PaymentTermsDays;
        supplier.CreditLimit = request.CreditLimit;
        supplier.PaymentMethod = request.PaymentMethod;
        supplier.BankName = request.BankName;
        supplier.BankAccountNumber = request.BankAccountNumber;
        supplier.BankBranch = request.BankBranch;
        supplier.IFSC = request.IFSC;
        supplier.IsActive = request.IsActive;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Supplier updated successfully"));
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.SuppliersManage)]
    public async Task<IActionResult> DeleteSupplier(Guid id)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        var supplier = await _context.Suppliers.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted && s.TenantId == tenantId);
        if (supplier == null)
            return NotFound(Result.Failure("Supplier not found"));

        supplier.IsDeleted = true;
        supplier.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(Result.Success("Supplier deleted successfully"));
    }

    public class CreateSupplierRequest
    {
        public string? Name { get; set; }
        public string? Code { get; set; }
        public string? Description { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Fax { get; set; }
        public string? Website { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? PostalCode { get; set; }
        public string? TaxNumber { get; set; }
        public string? PanNumber { get; set; }
        public string? ContactPersonName { get; set; }
        public string? ContactPersonPhone { get; set; }
        public string? ContactPersonEmail { get; set; }
        public int? PaymentTermsDays { get; set; }
        public decimal? CreditLimit { get; set; }
        public string? PaymentMethod { get; set; }
        public string? BankName { get; set; }
        public string? BankAccountNumber { get; set; }
        public string? BankBranch { get; set; }
        public string? IFSC { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
