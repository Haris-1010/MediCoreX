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
public class FacilityController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;

    public FacilityController(ApplicationDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    [HttpGet("buildings")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsView)]
    public async Task<IActionResult> GetBuildings()
    {
        var buildingIds = await _context.Buildings
            .Where(b => !b.IsDeleted && b.IsActive)
            .OrderBy(b => b.DisplayOrder)
            .Select(b => b.Id)
            .ToListAsync();

        var buildings = new List<object>();
        foreach (var bid in buildingIds)
        {
            var b = await _context.Buildings.FirstAsync(x => x.Id == bid);
            var floorCount = await _context.Floors.CountAsync(f => f.BuildingId == bid && !f.IsDeleted);
            var fIds = await _context.Floors
                .Where(f => f.BuildingId == bid && !f.IsDeleted).Select(f => f.Id).ToListAsync();
            var wIds = await _context.Wards
               .Where(w => w.FloorId.HasValue
         && fIds.Contains(w.FloorId.Value)
         && !w.IsDeleted)
.Select(w => w.Id)
.ToListAsync();
            var rIds = await _context.Rooms
                .Where(r => wIds.Contains(r.WardId) && !r.IsDeleted).Select(r => r.Id).ToListAsync();
            var bedCount = await _context.Beds
                .CountAsync(bed => rIds.Contains(bed.RoomId) && !bed.IsDeleted);

            buildings.Add(new
            {
                b.Id,
                b.Name,
                b.Code,
                b.Description,
                b.Address,
                b.NumberOfFloors,
                FloorCount = floorCount,
                BedCount = bedCount
            });
        }

        return Ok(Result<object>.Success(buildings));
    }

    [HttpGet("buildings/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsView)]
    public async Task<IActionResult> GetBuilding(Guid id)
    {
        var b = await _context.Buildings
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

        if (b == null)
            return NotFound(Result.Failure("Building not found"));

        var floors = await _context.Floors
            .Where(f => f.BuildingId == id && !f.IsDeleted)
            .OrderBy(f => f.FloorNumber)
            .Select(f => new
            {
                f.Id,
                f.Name,
                f.Code,
                f.FloorNumber,
                WardCount = _context.Wards.Count(w => w.FloorId == f.Id && !w.IsDeleted)
            })
            .ToListAsync();

        return Ok(Result<object>.Success(new
        {
            b.Id,
            b.Name,
            b.Code,
            b.Description,
            b.Address,
            b.NumberOfFloors,
            b.IsActive,
            Floors = floors
        }));
    }

    [HttpPost("buildings")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsManage)]
    public async Task<IActionResult> CreateBuilding([FromBody] CreateBuildingRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(Result.Failure("Name is required"));

        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));
        var branchId = _tenantService.GetCurrentBranchId();

        var building = new Domain.Entities.Facility.Building
        {
            Name = request.Name,
            Code = request.Code ?? string.Empty,
            Description = request.Description,
            Address = request.Address,
            NumberOfFloors = request.NumberOfFloors,
            IsActive = true,
            TenantId = tenantId,
            BranchId = branchId
        };

        _context.Buildings.Add(building);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { building.Id }, "Building created successfully"));
    }

    [HttpGet("floors")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsView)]
    public async Task<IActionResult> GetFloors([FromQuery] Guid? buildingId = null)
    {
        var query = _context.Floors
            .Where(f => !f.IsDeleted && f.IsActive);

        if (buildingId.HasValue)
            query = query.Where(f => f.BuildingId == buildingId.Value);

        var floorIds = await query.OrderBy(f => f.BuildingId).ThenBy(f => f.FloorNumber)
            .Select(f => f.Id).ToListAsync();

        var floors = new List<object>();
        foreach (var fid in floorIds)
        {
            var f = await _context.Floors.FirstAsync(x => x.Id == fid);
            var building = await _context.Buildings
                .FirstOrDefaultAsync(b => b.Id == f.BuildingId);
            var wardCount = await _context.Wards.CountAsync(w => w.FloorId == fid && !w.IsDeleted);

            floors.Add(new
            {
                f.Id,
                f.Name,
                f.Code,
                f.FloorNumber,
                BuildingName = building?.Name,
                BuildingId = f.BuildingId,
                WardCount = wardCount
            });
        }

        return Ok(Result<object>.Success(floors));
    }

    [HttpGet("rooms")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsView)]
    public async Task<IActionResult> GetRooms([FromQuery] Guid? wardId = null)
    {
        var query = _context.Rooms
            .Where(r => !r.IsDeleted && r.IsActive);

        if (wardId.HasValue)
            query = query.Where(r => r.WardId == wardId.Value);

        var roomIds = await query.OrderBy(r => r.WardId).ThenBy(r => r.RoomNumber)
            .Select(r => r.Id).ToListAsync();

        var rooms = new List<object>();
        foreach (var rid in roomIds)
        {
            var r = await _context.Rooms.FirstAsync(x => x.Id == rid);
            var bedCount = await _context.Beds.CountAsync(b => b.RoomId == rid && !b.IsDeleted);
            var avail = await _context.Beds.CountAsync(b => b.RoomId == rid && !b.IsDeleted && b.Status == BedStatus.Available);
            var occ = await _context.Beds.CountAsync(b => b.RoomId == rid && !b.IsDeleted && b.Status == BedStatus.Occupied);

            rooms.Add(new
            {
                r.Id,
                r.RoomNumber,
                r.Name,
                RoomType = r.RoomType.ToString(),
                r.WardId,
                r.Capacity,
                r.HasBathroom,
                r.HasTV,
                r.HasAC,
                r.IsIsolation,
                r.DailyRate,
                BedCount = bedCount,
                AvailableBeds = avail,
                OccupiedBeds = occ
            });
        }

        return Ok(Result<object>.Success(rooms));
    }

    [HttpGet("equipment")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsView)]
    public IActionResult GetEquipment()
    {
        return Ok(Result<object>.Success(Array.Empty<object>()));
    }

    public class CreateBuildingRequest
    {
        public string? Name { get; set; }
        public string? Code { get; set; }
        public string? Description { get; set; }
        public string? Address { get; set; }
        public int? NumberOfFloors { get; set; }
    }
}
