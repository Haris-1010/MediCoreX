using ClinIQ.Domain.Enums;
using ClinIQ.Infrastructure.Data;
using ClinIQ.Shared.Models;
using ClinIQ.API.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinIQ.API.Controllers.v1;

[ApiController]
[Route("api/v1/purchase-orders")]
[Authorize]
public class PurchaseOrdersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PurchaseOrdersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PurchaseOrdersView)]
    public async Task<IActionResult> GetPurchaseOrders(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? status = null)
    {
        var query = _context.PurchaseOrders
            .Where(po => !po.IsDeleted);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(po =>
                po.PONumber.ToLower().Contains(term) ||
                (po.Supplier != null && po.Supplier.Name.ToLower().Contains(term)));
        }

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<PurchaseOrderStatus>(status, true, out var s))
            query = query.Where(po => po.Status == s);

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(po => po.OrderDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(po => new
            {
                po.Id,
                po.PONumber,
                SupplierName = po.Supplier != null ? po.Supplier.Name : null,
                po.SupplierId,
                po.OrderDate,
                po.ExpectedDeliveryDate,
                po.ReceivedDate,
                Status = po.Status.ToString(),
                po.SubTotal,
                po.DiscountAmount,
                po.TaxAmount,
                po.TotalAmount,
                po.IsPaid,
                po.PaidAmount,
                ItemCount = po.Items.Count
            })
            .ToListAsync();

        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
        return Ok(Result<object>.Success(new
        {
            items,
            totalCount,
            pageNumber,
            pageSize,
            totalPages,
            hasPreviousPage = pageNumber > 1,
            hasNextPage = pageNumber < totalPages
        }));
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PurchaseOrdersView)]
    public async Task<IActionResult> GetPurchaseOrder(Guid id)
    {
        var po = await _context.PurchaseOrders
            .Where(p => p.Id == id && !p.IsDeleted)
            .Select(p => new
            {
                p.Id,
                p.PONumber,
                SupplierName = p.Supplier != null ? p.Supplier.Name : null,
                p.SupplierId,
                p.WarehouseId,
                p.OrderDate,
                p.ExpectedDeliveryDate,
                p.ReceivedDate,
                Status = p.Status.ToString(),
                p.SubTotal,
                p.DiscountAmount,
                p.DiscountPercent,
                p.TaxAmount,
                p.TotalAmount,
                p.ShippingCost,
                p.ShippingMethod,
                p.TrackingNumber,
                p.PaymentTerms,
                p.IsPaid,
                p.PaidAmount,
                p.Notes,
                p.InternalNotes,
                p.ApprovedAt,
                p.RejectionReason,
                Items = p.Items.Select(i => new
                {
                    i.Id,
                    i.ItemId,
                    ItemName = i.Item != null ? i.Item.Name : null,
                    i.OrderedQuantity,
                    i.ReceivedQuantity,
                    i.PendingQuantity,
                    i.Unit,
                    i.UnitPrice,
                    i.DiscountPercent,
                    i.DiscountAmount,
                    i.TaxPercent,
                    i.TaxAmount,
                    i.TotalAmount,
                    i.Notes
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (po == null)
            return NotFound(Result.Failure("Purchase order not found"));

        return Ok(Result<object>.Success(po));
    }

    [HttpPost]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PurchaseOrdersCreate)]
    public async Task<IActionResult> CreatePurchaseOrder([FromBody] CreatePurchaseOrderRequest request)
    {
        if (request.SupplierId == Guid.Empty)
            return BadRequest(Result.Failure("SupplierId is required"));

        var supplier = await _context.Suppliers.FirstOrDefaultAsync(s => s.Id == request.SupplierId && !s.IsDeleted);
        if (supplier == null)
            return NotFound(Result.Failure("Supplier not found"));

        var count = await _context.PurchaseOrders.CountAsync(po => po.OrderDate.Date == DateTime.UtcNow.Date);
        var poNumber = $"PO-{DateTime.UtcNow:yyyyMMdd}-{(count + 1):D4}";

        var purchaseOrder = new Domain.Entities.Inventory.PurchaseOrder
        {
            PONumber = poNumber,
            SupplierId = request.SupplierId,
            WarehouseId = request.WarehouseId ?? Guid.Empty,
            OrderDate = DateTime.UtcNow,
            ExpectedDeliveryDate = request.ExpectedDeliveryDate,
            Status = PurchaseOrderStatus.Draft,
            Notes = request.Notes,
            InternalNotes = request.InternalNotes,
            PaymentTerms = request.PaymentTerms
        };

        if (request.Items != null && request.Items.Any())
        {
            foreach (var item in request.Items)
            {
                purchaseOrder.Items.Add(new Domain.Entities.Inventory.PurchaseOrderItem
                {
                    ItemId = item.ItemId,
                    OrderedQuantity = item.Quantity,
                    PendingQuantity = item.Quantity,
                    Unit = item.Unit,
                    UnitPrice = item.UnitPrice,
                    TotalAmount = item.Quantity * item.UnitPrice
                });
            }
            purchaseOrder.SubTotal = purchaseOrder.Items.Sum(i => i.TotalAmount);
            purchaseOrder.TotalAmount = purchaseOrder.SubTotal - purchaseOrder.DiscountAmount + purchaseOrder.TaxAmount;
        }

        _context.PurchaseOrders.Add(purchaseOrder);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new
        {
            purchaseOrder.Id,
            purchaseOrder.PONumber
        }, "Purchase order created successfully"));
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PurchaseOrdersCreate)]
    public async Task<IActionResult> UpdatePurchaseOrder(Guid id, [FromBody] UpdatePurchaseOrderRequest request)
    {
        var po = await _context.PurchaseOrders.FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);
        if (po == null)
            return NotFound(Result.Failure("Purchase order not found"));

        if (request.ExpectedDeliveryDate.HasValue) po.ExpectedDeliveryDate = request.ExpectedDeliveryDate;
        if (request.Notes != null) po.Notes = request.Notes;
        if (request.InternalNotes != null) po.InternalNotes = request.InternalNotes;
        if (request.Status != null && Enum.TryParse<PurchaseOrderStatus>(request.Status, true, out var s))
            po.Status = s;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Purchase order updated"));
    }

    [HttpGet("recent")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PurchaseOrdersView)]
    public async Task<IActionResult> GetRecentPurchaseOrders()
    {
        var orders = await _context.PurchaseOrders
            .Where(po => !po.IsDeleted)
            .OrderByDescending(po => po.OrderDate)
            .Take(10)
            .Select(po => new
            {
                po.Id,
                po.PONumber,
                SupplierName = po.Supplier != null ? po.Supplier.Name : null,
                po.OrderDate,
                Status = po.Status.ToString(),
                po.TotalAmount
            })
            .ToListAsync();

        return Ok(Result<object>.Success(orders));
    }

    [HttpPost("{id:guid}/receive")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.PurchaseOrdersReceive)]
    public async Task<IActionResult> ReceivePurchaseOrder(Guid id)
    {
        var po = await _context.PurchaseOrders
            .Include(p => p.Items)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

        if (po == null)
            return NotFound(Result.Failure("Purchase order not found"));

        if (po.Status != PurchaseOrderStatus.Approved)
            return BadRequest(Result.Failure("Only approved purchase orders can be received"));

        po.Status = PurchaseOrderStatus.Received;
        po.ReceivedDate = DateTime.UtcNow;

        // Update stock for each item
        foreach (var item in po.Items)
        {
            var inventoryItem = await _context.Items.FirstOrDefaultAsync(i => i.Id == item.ItemId);
            if (inventoryItem != null)
            {
                var quantityBefore = inventoryItem.CurrentStock;
                inventoryItem.CurrentStock += item.OrderedQuantity;

                var movement = new Domain.Entities.Inventory.StockMovement
                {
                    MovementNumber = $"PO-REC-{DateTime.UtcNow:yyyyMMddHHmmss}",
                    ItemId = item.ItemId,
                    WarehouseId = po.WarehouseId,
                    MovementType = StockMovementType.Purchase,
                    MovementDate = DateTime.UtcNow,
                    Quantity = item.OrderedQuantity,
                    QuantityBefore = quantityBefore,
                    QuantityAfter = inventoryItem.CurrentStock,
                    UnitPrice = item.UnitPrice,
                    TotalAmount = item.TotalAmount,
                    ReferenceType = "PurchaseOrder",
                    ReferenceId = po.Id,
                    ReferenceNumber = po.PONumber
                };
                _context.StockMovements.Add(movement);

                item.ReceivedQuantity = item.OrderedQuantity;
                item.PendingQuantity = 0;
            }
        }

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Purchase order received and stock updated"));
    }

    public class CreatePurchaseOrderRequest
    {
        public Guid SupplierId { get; set; }
        public Guid? WarehouseId { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public string? Notes { get; set; }
        public string? InternalNotes { get; set; }
        public string? PaymentTerms { get; set; }
        public List<POItemRequest>? Items { get; set; }
    }

    public class UpdatePurchaseOrderRequest
    {
        public DateTime? ExpectedDeliveryDate { get; set; }
        public string? Notes { get; set; }
        public string? InternalNotes { get; set; }
        public string? Status { get; set; }
    }

    public class POItemRequest
    {
        public Guid ItemId { get; set; }
        public decimal Quantity { get; set; }
        public string? Unit { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
