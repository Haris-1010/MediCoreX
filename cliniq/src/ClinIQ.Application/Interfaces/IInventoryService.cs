using ClinIQ.Shared.DTOs.Inventory;
using ClinIQ.Shared.Models;

namespace ClinIQ.Application.Interfaces;

public interface IInventoryService
{
    Task<Result<ItemDetailDto>> GetItemByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PaginatedResult<ItemDto>> GetItemsPaginatedAsync(ItemQuery query, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<ItemDto>>> SearchItemsAsync(string searchTerm, bool medicineOnly = false, int limit = 10, CancellationToken cancellationToken = default);
    Task<Result<ItemDetailDto>> CreateItemAsync(CreateItemRequest request, CancellationToken cancellationToken = default);
    Task<Result<ItemDetailDto>> UpdateItemAsync(Guid id, CreateItemRequest request, CancellationToken cancellationToken = default);
    Task<Result> DeleteItemAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<decimal>> GetCurrentStockAsync(Guid itemId, Guid? warehouseId = null, CancellationToken cancellationToken = default);
    Task<Result> AdjustStockAsync(Guid itemId, Guid warehouseId, decimal quantity, string reason, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<StockBatchDto>>> GetStockBatchesAsync(Guid itemId, Guid? warehouseId = null, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<ItemDto>>> GetLowStockItemsAsync(Guid? warehouseId = null, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<ItemDto>>> GetExpiringItemsAsync(int daysAhead = 30, Guid? warehouseId = null, CancellationToken cancellationToken = default);
}

public class ItemQuery : PaginationQuery
{
    public Guid? CategoryId { get; set; }
    public bool? IsMedicine { get; set; }
    public bool? IsActive { get; set; }
    public bool? LowStock { get; set; }
    public Guid? WarehouseId { get; set; }
}

public record StockBatchDto(
    Guid Id,
    Guid ItemId,
    string ItemName,
    Guid WarehouseId,
    string WarehouseName,
    string? BatchNumber,
    DateTime? ExpiryDate,
    decimal AvailableQuantity,
    decimal PurchasePrice,
    decimal SellingPrice,
    bool IsExpired,
    string? RackNumber,
    string? ShelfNumber
);
