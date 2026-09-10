using ClinIQ.Domain.Enums;
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
public class WardsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public WardsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsView)]
    public async Task<IActionResult> GetWards([FromQuery] Guid? floorId = null)
    {
        var query = _context.Wards
            .Where(w => !w.IsDeleted && w.IsActive);

        if (floorId.HasValue)
            query = query.Where(w => w.FloorId == floorId.Value);

        var wards = await query
            .OrderBy(w => w.DisplayOrder)
            .Select(w => new
            {
                w.Id,
                w.Name,
                w.Code,
                w.Description,
                WardType = w.WardType.ToString(),
                w.FloorId,
                FloorName = w.Floor != null ? w.Floor.Name : null,
                BuildingName = w.Floor != null && w.Floor.Building != null ? w.Floor.Building.Name : null,
                w.TotalBeds,
                w.DailyRate,
                AvailableBeds = w.Rooms.SelectMany(r => r.Beds).Count(b => !b.IsDeleted && b.Status == BedStatus.Available),
                OccupiedBeds = w.Rooms.SelectMany(r => r.Beds).Count(b => !b.IsDeleted && b.Status == BedStatus.Occupied),
                RoomCount = w.Rooms.Count(r => !r.IsDeleted)
            })
            .ToListAsync();

        return Ok(Result<object>.Success(wards));
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsView)]
    public async Task<IActionResult> GetWard(Guid id)
    {
        var ward = await _context.Wards
            .Where(w => w.Id == id && !w.IsDeleted)
            .Select(w => new
            {
                w.Id,
                w.Name,
                w.Code,
                w.Description,
                WardType = w.WardType.ToString(),
                w.FloorId,
                FloorName = w.Floor != null ? w.Floor.Name : null,
                w.TotalBeds,
                w.DailyRate,
                w.GenderRestriction,
                w.IsActive,
                Rooms = w.Rooms
                    .Where(r => !r.IsDeleted)
                    .OrderBy(r => r.RoomNumber)
                    .Select(r => new
                    {
                        r.Id,
                        r.RoomNumber,
                        r.Name,
                        RoomType = r.RoomType.ToString(),
                        r.Capacity,
                        Beds = r.Beds
                            .Where(b => !b.IsDeleted)
                            .Select(b => new
                            {
                                b.Id,
                                b.BedNumber,
                                BedType = b.BedType.ToString(),
                                Status = b.Status.ToString(),
                                b.CurrentPatientId,
                                b.DailyRate
                            })
                            .ToList()
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (ward == null)
            return NotFound(Result.Failure("Ward not found"));

        return Ok(Result<object>.Success(ward));
    }

    [HttpPost]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsManage)]
    public async Task<IActionResult> CreateWard([FromBody] CreateWardRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(Result.Failure("Name is required"));

        var ward = new Domain.Entities.Facility.Ward
        {
            Name = request.Name,
            Code = request.Code ?? string.Empty,
            Description = request.Description,
            FloorId = request.FloorId,
            DepartmentId = request.DepartmentId,
            WardType = Enum.TryParse<WardType>(request.WardType, true, out var wt) ? wt : WardType.General,
            TotalBeds = request.TotalBeds,
            GenderRestriction = Enum.TryParse<Gender>(request.GenderRestriction, true, out var g) ? g : null,
            DailyRate = request.DailyRate,
            IsActive = true
        };

        _context.Wards.Add(ward);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { ward.Id }, "Ward created successfully"));
    }

    [HttpGet("{id:guid}/available-beds")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsView)]
    public async Task<IActionResult> GetAvailableBeds(Guid id)
    {
        var ward = await _context.Wards.FirstOrDefaultAsync(w => w.Id == id && !w.IsDeleted);
        if (ward == null)
            return NotFound(Result.Failure("Ward not found"));

        var beds = await _context.Beds
            .Where(b => !b.IsDeleted && b.Room != null && b.Room.WardId == id && b.Status == BedStatus.Available)
            .Select(b => new
            {
                b.Id,
                b.BedNumber,
                BedType = b.BedType.ToString(),
                Status = b.Status.ToString(),
                b.DailyRate,
                RoomNumber = b.Room != null ? b.Room.RoomNumber : null,
                RoomId = b.RoomId
            })
            .ToListAsync();

        return Ok(Result<object>.Success(beds));
    }

    [HttpGet("{id:guid}/beds")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsView)]
    public async Task<IActionResult> GetWardBeds(Guid id)
    {
        var ward = await _context.Wards.FirstOrDefaultAsync(w => w.Id == id && !w.IsDeleted);
        if (ward == null)
            return NotFound(Result.Failure("Ward not found"));

        var beds = await _context.Beds
            .Where(b => !b.IsDeleted && b.Room != null && b.Room.WardId == id)
            .Select(b => new
            {
                b.Id,
                b.BedNumber,
                BedType = b.BedType.ToString(),
                Status = b.Status.ToString(),
                b.CurrentPatientId,
                b.CurrentAdmissionId,
                b.DailyRate,
                RoomNumber = b.Room != null ? b.Room.RoomNumber : null,
                RoomId = b.RoomId,
                WardId = id
            })
            .ToListAsync();

        return Ok(Result<object>.Success(beds));
    }

    public class CreateWardRequest
    {
        public string? Name { get; set; }
        public string? Code { get; set; }
        public string? Description { get; set; }
        public Guid? FloorId { get; set; }
        public Guid? DepartmentId { get; set; }
        public string? WardType { get; set; }
        public int TotalBeds { get; set; }
        public string? GenderRestriction { get; set; }
        public decimal? DailyRate { get; set; }
    }
}
