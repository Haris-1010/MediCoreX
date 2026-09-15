using ClinIQ.Domain.Enums;
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
public class InventoryController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;

    public InventoryController(ApplicationDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    private async Task<Guid> GetOrCreateDefaultWarehouseId()
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null) throw new InvalidOperationException("Unable to resolve the current organization.");

        var warehouse = await _context.Warehouses
            .FirstOrDefaultAsync(w => !w.IsDeleted && w.IsActive && w.TenantId == tenantId.Value);
        if (warehouse != null) return warehouse.Id;

        warehouse = new Domain.Entities.Inventory.Warehouse
        {
            Name = "Main Warehouse",
            Code = "WH-001",
            WarehouseType = "Main",
            IsDefault = true,
            IsActive = true,
            TenantId = tenantId
        };
        _context.Warehouses.Add(warehouse);
        await _context.SaveChangesAsync();
        return warehouse.Id;
    }

    [HttpGet("items")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.InventoryView)]
    public async Task<IActionResult> GetItems(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? categoryId = null)
    {
        var query = _context.Items.Where(i => !i.IsDeleted && i.IsActive);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(i =>
                i.Name.ToLower().Contains(term) ||
                i.Code.ToLower().Contains(term) ||
                (i.GenericName != null && i.GenericName.ToLower().Contains(term)) ||
                (i.BrandName != null && i.BrandName.ToLower().Contains(term)));
        }

        if (Guid.TryParse(categoryId, out var catId))
        {
            query = query.Where(i => i.CategoryId == catId);
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(i => i.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(i => new
            {
                i.Id,
                i.Name,
                i.Code,
                i.GenericName,
                i.BrandName,
                CategoryName = i.Category != null ? i.Category.Name : null,
                i.CurrentStock,
                i.ReorderLevel,
                i.PurchasePrice,
                i.SellingPrice,
                i.IsMedicine,
                i.RequiresPrescription,
                StockStatus = i.CurrentStock <= 0 ? "OutOfStock" :
                    i.CurrentStock <= i.ReorderLevel ? "LowStock" : "InStock"
            })
            .ToListAsync();

        return Ok(Result<object>.Success(new { items, totalCount, pageNumber, pageSize }));
    }

    [HttpGet("items/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.InventoryView)]
    public async Task<IActionResult> GetItem(Guid id)
    {
        var item = await _context.Items
            .Where(i => i.Id == id && !i.IsDeleted)
            .Select(i => new
            {
                i.Id,
                i.Name,
                i.Code,
                i.Barcode,
                i.Description,
                i.CategoryId,
                CategoryName = i.Category != null ? i.Category.Name : null,
                i.IsMedicine,
                i.GenericName,
                i.BrandName,
                i.ManufacturerId,
                ManufacturerName = i.Manufacturer != null ? i.Manufacturer.Name : null,
                i.Strength,
                i.Form,
                i.PackSize,
                i.RequiresPrescription,
                i.IsControlledSubstance,
                i.StorageInstructions,
                i.PurchaseUnit,
                i.SaleUnit,
                i.ConversionFactor,
                i.PurchasePrice,
                i.SellingPrice,
                i.MRP,
                i.CostPrice,
                i.TaxPercent,
                i.IsTaxInclusive,
                i.CurrentStock,
                i.MinimumStock,
                i.MaximumStock,
                i.ReorderLevel,
                i.ReorderQuantity,
                i.TracksExpiry,
                i.TracksBatches,
                i.ExpiryWarningDays,
                i.DefaultLocation,
                i.DefaultWarehouseId,
                i.IsActive,
                i.IsDiscontinued
            })
            .FirstOrDefaultAsync();

        if (item == null)
            return NotFound(Result.Failure("Item not found"));

        return Ok(Result<object>.Success(item));
    }

    [HttpPost("items")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.InventoryManage)]
    public async Task<IActionResult> CreateItem([FromBody] CreateItemRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(Result.Failure("Name is required"));

        var item = new Domain.Entities.Inventory.Item
        {
            Name = request.Name,
            Code = request.Code ?? string.Empty,
            Barcode = request.Barcode,
            Description = request.Description,
            CategoryId = request.CategoryId,
            IsMedicine = request.IsMedicine,
            GenericName = request.GenericName,
            BrandName = request.BrandName,
            ManufacturerId = request.ManufacturerId,
            Strength = request.Strength,
            Form = request.Form,
            PackSize = request.PackSize,
            RequiresPrescription = request.RequiresPrescription,
            IsControlledSubstance = request.IsControlledSubstance,
            StorageInstructions = request.StorageInstructions,
            PurchaseUnit = request.PurchaseUnit,
            SaleUnit = request.SaleUnit,
            ConversionFactor = request.ConversionFactor,
            PurchasePrice = request.PurchasePrice,
            SellingPrice = request.SellingPrice,
            MRP = request.MRP,
            CostPrice = request.CostPrice,
            TaxPercent = request.TaxPercent,
            IsTaxInclusive = request.IsTaxInclusive,
            CurrentStock = request.CurrentStock,
            MinimumStock = request.MinimumStock,
            MaximumStock = request.MaximumStock,
            ReorderLevel = request.ReorderLevel,
            ReorderQuantity = request.ReorderQuantity,
            TracksExpiry = request.TracksExpiry,
            TracksBatches = request.TracksBatches,
            ExpiryWarningDays = request.ExpiryWarningDays,
            DefaultLocation = request.DefaultLocation,
            DefaultWarehouseId = request.DefaultWarehouseId,
            IsActive = true
        };

        _context.Items.Add(item);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { item.Id }, "Item created successfully"));
    }

    [HttpPut("items/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.InventoryManage)]
    public async Task<IActionResult> UpdateItem(Guid id, [FromBody] CreateItemRequest request)
    {
        var item = await _context.Items.FirstOrDefaultAsync(i => i.Id == id && !i.IsDeleted);
        if (item == null)
            return NotFound(Result.Failure("Item not found"));

        item.Name = request.Name ?? item.Name;
        item.Code = request.Code ?? item.Code;
        item.Barcode = request.Barcode;
        item.Description = request.Description;
        item.CategoryId = request.CategoryId;
        item.IsMedicine = request.IsMedicine;
        item.GenericName = request.GenericName;
        item.BrandName = request.BrandName;
        item.ManufacturerId = request.ManufacturerId;
        item.Strength = request.Strength;
        item.Form = request.Form;
        item.PackSize = request.PackSize;
        item.RequiresPrescription = request.RequiresPrescription;
        item.IsControlledSubstance = request.IsControlledSubstance;
        item.StorageInstructions = request.StorageInstructions;
        item.PurchaseUnit = request.PurchaseUnit;
        item.SaleUnit = request.SaleUnit;
        item.ConversionFactor = request.ConversionFactor;
        item.PurchasePrice = request.PurchasePrice;
        item.SellingPrice = request.SellingPrice;
        item.MRP = request.MRP;
        item.CostPrice = request.CostPrice;
        item.TaxPercent = request.TaxPercent;
        item.IsTaxInclusive = request.IsTaxInclusive;
        item.CurrentStock = request.CurrentStock;
        item.MinimumStock = request.MinimumStock;
        item.MaximumStock = request.MaximumStock;
        item.ReorderLevel = request.ReorderLevel;
        item.ReorderQuantity = request.ReorderQuantity;
        item.TracksExpiry = request.TracksExpiry;
        item.TracksBatches = request.TracksBatches;
        item.ExpiryWarningDays = request.ExpiryWarningDays;
        item.DefaultLocation = request.DefaultLocation;
        item.DefaultWarehouseId = request.DefaultWarehouseId;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Item updated successfully"));
    }

    [HttpPost("adjustments")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.InventoryAdjust)]
    public async Task<IActionResult> CreateAdjustment([FromBody] StockAdjustmentRequest request)
    {
        try
        {
            if (request.ItemId == Guid.Empty)
                return BadRequest(Result.Failure("ItemId is required"));

            var item = await _context.Items.FirstOrDefaultAsync(i => i.Id == request.ItemId && !i.IsDeleted);
            if (item == null)
                return NotFound(Result.Failure("Item not found"));

            var quantityBefore = item.CurrentStock;
            decimal adjustment;

            var adjType = (request.AdjustmentType ?? request.Type ?? "increase").ToLower();
            if (adjType == "add" || adjType == "increase")
            {
                adjustment = request.Quantity;
            }
            else if (adjType == "set")
            {
                adjustment = request.Quantity - item.CurrentStock;
            }
            else
            {
                adjustment = -request.Quantity;
            }

            item.CurrentStock += adjustment;

            var warehouseId = item.DefaultWarehouseId ?? await GetOrCreateDefaultWarehouseId();

            var movement = new Domain.Entities.Inventory.StockMovement
            {
                MovementNumber = $"ADJ-{DateTime.UtcNow:yyyyMMddHHmmss}",
                ItemId = request.ItemId,
                WarehouseId = warehouseId,
                MovementType = StockMovementType.Adjustment,
                MovementDate = DateTime.UtcNow,
                Quantity = Math.Abs(adjustment),
                QuantityBefore = quantityBefore,
                QuantityAfter = item.CurrentStock,
                UnitPrice = item.PurchasePrice,
                TotalAmount = Math.Abs(adjustment) * item.PurchasePrice,
                Reason = request.Reason,
                Notes = request.Notes
            };

            _context.StockMovements.Add(movement);
            await _context.SaveChangesAsync();

            return Ok(Result<object>.Success(new { movement.Id, movement.MovementNumber }, "Stock adjusted successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, Result.Failure($"Failed to adjust stock: {ex.InnerException?.Message ?? ex.Message}"));
        }
    }

    [HttpGet("adjustments")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.InventoryView)]
    public async Task<IActionResult> GetAdjustments([FromQuery] Guid? itemId = null)
    {
        var query = _context.StockMovements
            .Where(m => m.MovementType == StockMovementType.Adjustment);

        if (itemId.HasValue)
            query = query.Where(m => m.ItemId == itemId.Value);

        var adjustments = await query
            .OrderByDescending(m => m.MovementDate)
            .Take(100)
            .Select(m => new
            {
                m.Id,
                m.MovementNumber,
                ItemName = m.Item != null ? m.Item.Name : null,
                m.Quantity,
                m.QuantityBefore,
                m.QuantityAfter,
                m.Reason,
                m.MovementDate
            })
            .ToListAsync();

        return Ok(Result<object>.Success(adjustments));
    }

    [HttpGet("stock")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.InventoryView)]
    public async Task<IActionResult> GetStock()
    {
        var stock = await _context.Items
            .Where(i => !i.IsDeleted && i.IsActive)
            .Select(i => new
            {
                ItemId = i.Id,
                i.Name,
                i.Code,
                i.CurrentStock,
                i.ReorderLevel,
                i.MinimumStock,
                i.MaximumStock,
                CategoryName = i.Category != null ? i.Category.Name : null,
                i.SellingPrice,
                StockValue = i.CurrentStock * i.PurchasePrice,
                StockStatus = i.CurrentStock <= 0 ? "OutOfStock" :
                    i.CurrentStock <= i.ReorderLevel ? "LowStock" : "InStock"
            })
            .OrderBy(i => i.Name)
            .ToListAsync();

        return Ok(Result<object>.Success(stock));
    }

    [HttpGet("transfers")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.InventoryView)]
    public async Task<IActionResult> GetTransfers()
    {
        var transfers = await _context.StockTransfers
            .OrderByDescending(t => t.CreatedAt)
            .Take(50)
            .Select(t => new
            {
                t.Id,
                t.TransferNumber,
                t.Status,
                t.RequestedAt,
                t.ReceivedAt
            })
            .ToListAsync();

        return Ok(Result<object>.Success(transfers));
    }

    [HttpPost("transfers")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.InventoryTransfer)]
    public IActionResult CreateTransfer([FromBody] object request)
    {
        return Ok(Result<object>.Success(new { id = Guid.NewGuid() }, "Transfer created"));
    }

    [HttpGet("categories")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.InventoryView)]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.ItemCategories
            .Where(c => !c.IsDeleted && c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.Code,
                c.Description,
                c.IsMedicineCategory,
                ItemCount = c.Items.Count(i => !i.IsDeleted)
            })
            .ToListAsync();

        return Ok(Result<object>.Success(categories));
    }

    [HttpGet("items/search")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.InventoryView, ClinIQ.Shared.Constants.Permissions.PurchaseOrdersCreate, RequireAll = false)]
    public async Task<IActionResult> SearchItems([FromQuery] string term)
    {
        if (string.IsNullOrWhiteSpace(term))
            return Ok(Result<object>.Success(Array.Empty<object>()));

        var termLower = term.ToLower();
        var items = await _context.Items
            .Where(i => !i.IsDeleted && i.IsActive &&
                (i.Name.ToLower().Contains(termLower) ||
                 i.Code.ToLower().Contains(termLower) ||
                 (i.GenericName != null && i.GenericName.ToLower().Contains(termLower)) ||
                 (i.BrandName != null && i.BrandName.ToLower().Contains(termLower))))
            .Take(20)
            .Select(i => new
            {
                i.Id,
                i.Name,
                i.Code,
                i.GenericName,
                i.BrandName,
                i.CurrentStock,
                i.SellingPrice,
                StockStatus = i.CurrentStock <= 0 ? "OutOfStock" :
                    i.CurrentStock <= i.ReorderLevel ? "LowStock" : "InStock"
            })
            .ToListAsync();

        return Ok(Result<object>.Success(items));
    }

    [HttpGet("low-stock")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.InventoryView)]
    public async Task<IActionResult> GetLowStockItems()
    {
        var items = await _context.Items
            .Where(i => !i.IsDeleted && i.IsActive && i.CurrentStock <= i.ReorderLevel)
            .OrderBy(i => i.CurrentStock)
            .Select(i => new
            {
                i.Id,
                i.Name,
                i.Code,
                i.CurrentStock,
                i.ReorderLevel,
                i.MinimumStock,
                CategoryName = i.Category != null ? i.Category.Name : null,
                i.SellingPrice,
                StockStatus = i.CurrentStock <= 0 ? "OutOfStock" : "LowStock"
            })
            .ToListAsync();

        return Ok(Result<object>.Success(items));
    }

    [HttpGet("stats")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.InventoryView)]
    public async Task<IActionResult> GetStats()
    {
        var totalItems = await _context.Items.CountAsync(i => !i.IsDeleted && i.IsActive);
        var lowStockItems = await _context.Items.CountAsync(i => !i.IsDeleted && i.IsActive && i.CurrentStock <= i.ReorderLevel);
        var totalValue = await _context.Items
            .Where(i => !i.IsDeleted && i.IsActive)
            .SumAsync(i => i.CurrentStock * i.PurchasePrice);
        var pendingOrders = await _context.PurchaseOrders
            .CountAsync(po => po.Status == PurchaseOrderStatus.Pending || po.Status == PurchaseOrderStatus.Approved);

        return Ok(Result<object>.Success(new
        {
            totalItems,
            lowStockItems,
            totalValue,
            pendingOrders
        }));
    }

    // Request models
    public class CreateItemRequest
    {
        public string? Name { get; set; }
        public string? Code { get; set; }
        public string? Barcode { get; set; }
        public string? Description { get; set; }
        public Guid? CategoryId { get; set; }
        public bool IsMedicine { get; set; }
        public string? GenericName { get; set; }
        public string? BrandName { get; set; }
        public Guid? ManufacturerId { get; set; }
        public string? Strength { get; set; }
        public string? Form { get; set; }
        public string? PackSize { get; set; }
        public bool RequiresPrescription { get; set; }
        public bool IsControlledSubstance { get; set; }
        public string? StorageInstructions { get; set; }
        public string? PurchaseUnit { get; set; }
        public string? SaleUnit { get; set; }
        public decimal ConversionFactor { get; set; } = 1;
        public decimal PurchasePrice { get; set; }
        public decimal SellingPrice { get; set; }
        public decimal? MRP { get; set; }
        public decimal? CostPrice { get; set; }
        public decimal TaxPercent { get; set; }
        public bool IsTaxInclusive { get; set; }
        public decimal CurrentStock { get; set; }
        public decimal MinimumStock { get; set; }
        public decimal MaximumStock { get; set; }
        public decimal ReorderLevel { get; set; }
        public decimal ReorderQuantity { get; set; }
        public bool TracksExpiry { get; set; }
        public bool TracksBatches { get; set; }
        public int? ExpiryWarningDays { get; set; }
        public string? DefaultLocation { get; set; }
        public Guid? DefaultWarehouseId { get; set; }
    }

    public class StockAdjustmentRequest
    {
        public Guid ItemId { get; set; }
        public decimal Quantity { get; set; }
        public string? AdjustmentType { get; set; }
        public string? Type { get; set; }
        public string? Reason { get; set; }
        public string? Notes { get; set; }
    }
}
