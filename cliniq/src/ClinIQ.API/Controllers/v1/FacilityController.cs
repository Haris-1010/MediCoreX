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

    public FacilityController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("buildings")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsView)]
    public async Task<IActionResult> GetBuildings()
    {
        var buildings = await _context.Buildings
            .Where(b => !b.IsDeleted && b.IsActive)
            .OrderBy(b => b.DisplayOrder)
            .Select(b => new
            {
                b.Id,
                b.Name,
                b.Code,
                b.Description,
                b.Address,
                b.NumberOfFloors,
                FloorCount = b.Floors.Count(f => !f.IsDeleted),
                BedCount = b.Floors.SelectMany(f => f.Wards).SelectMany(w => w.Rooms).SelectMany(r => r.Beds).Count(b => !b.IsDeleted)
            })
            .ToListAsync();

        return Ok(Result<object>.Success(buildings));
    }

    [HttpGet("buildings/{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsView)]
    public async Task<IActionResult> GetBuilding(Guid id)
    {
        var building = await _context.Buildings
            .Where(b => b.Id == id && !b.IsDeleted)
            .Select(b => new
            {
                b.Id,
                b.Name,
                b.Code,
                b.Description,
                b.Address,
                b.NumberOfFloors,
                b.IsActive,
                Floors = b.Floors
                    .Where(f => !f.IsDeleted)
                    .OrderBy(f => f.FloorNumber)
                    .Select(f => new
                    {
                        f.Id,
                        f.Name,
                        f.Code,
                        f.FloorNumber,
                        WardCount = f.Wards.Count(w => !w.IsDeleted)
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (building == null)
            return NotFound(Result.Failure("Building not found"));

        return Ok(Result<object>.Success(building));
    }

    [HttpPost("buildings")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsManage)]
    public async Task<IActionResult> CreateBuilding([FromBody] CreateBuildingRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(Result.Failure("Name is required"));

        var building = new Domain.Entities.Facility.Building
        {
            Name = request.Name,
            Code = request.Code ?? string.Empty,
            Description = request.Description,
            Address = request.Address,
            NumberOfFloors = request.NumberOfFloors,
            IsActive = true
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

        var floors = await query
            .OrderBy(f => f.BuildingId)
            .ThenBy(f => f.FloorNumber)
            .Select(f => new
            {
                f.Id,
                f.Name,
                f.Code,
                f.FloorNumber,
                BuildingName = f.Building != null ? f.Building.Name : null,
                BuildingId = f.BuildingId,
                WardCount = f.Wards.Count(w => !w.IsDeleted)
            })
            .ToListAsync();

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

        var rooms = await query
            .OrderBy(r => r.WardId)
            .ThenBy(r => r.RoomNumber)
            .Select(r => new
            {
                r.Id,
                r.RoomNumber,
                r.Name,
                RoomType = r.RoomType.ToString(),
                WardId = r.WardId,
                r.Capacity,
                r.HasBathroom,
                r.HasTV,
                r.HasAC,
                r.IsIsolation,
                r.DailyRate,
                BedCount = r.Beds.Count(b => !b.IsDeleted),
                AvailableBeds = r.Beds.Count(b => !b.IsDeleted && b.Status == Domain.Enums.BedStatus.Available),
                OccupiedBeds = r.Beds.Count(b => !b.IsDeleted && b.Status == Domain.Enums.BedStatus.Occupied)
            })
            .ToListAsync();

        return Ok(Result<object>.Success(rooms));
    }

    [HttpGet("equipment")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsView)]
    public IActionResult GetEquipment()
    {
        // Equipment is not a separate entity yet - return empty for now
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
