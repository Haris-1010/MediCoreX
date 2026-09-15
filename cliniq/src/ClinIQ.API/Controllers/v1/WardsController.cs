using ClinIQ.Domain.Entities.Facility;
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
public class WardsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantService _tenantService;

    public WardsController(ApplicationDbContext context, ITenantService tenantService)
    {
        _context = context;
        _tenantService = tenantService;
    }

    [HttpGet]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsView)]
    public async Task<IActionResult> GetWards([FromQuery] Guid? floorId = null)
    {
        var tenantId = _tenantService.GetCurrentTenantId();

        var query = _context.Wards.IgnoreQueryFilters()
            .Where(w => !w.IsDeleted && w.IsActive);

        if (tenantId.HasValue)
            query = query.Where(w => w.TenantId == tenantId.Value);

        if (floorId.HasValue)
            query = query.Where(w => w.FloorId == floorId.Value);

        var wardIds = await query.OrderBy(w => w.DisplayOrder)
            .Select(w => w.Id).ToListAsync();

        var wards = new List<object>();
        foreach (var wid in wardIds)
        {
            var w = await _context.Wards.IgnoreQueryFilters().FirstAsync(x => x.Id == wid);
            var roomIds = await _context.Rooms.IgnoreQueryFilters()
                .Where(r => r.WardId == wid && !r.IsDeleted)
                .Select(r => r.Id).ToListAsync();
            var bedCount = 0;
            var availableBeds = 0;
            var occupiedBeds = 0;
            foreach (var rid in roomIds)
            {
                bedCount += await _context.Beds.IgnoreQueryFilters().CountAsync(b => b.RoomId == rid && !b.IsDeleted);
                availableBeds += await _context.Beds.IgnoreQueryFilters().CountAsync(b => b.RoomId == rid && !b.IsDeleted && b.Status == BedStatus.Available);
                occupiedBeds += await _context.Beds.IgnoreQueryFilters().CountAsync(b => b.RoomId == rid && !b.IsDeleted && b.Status == BedStatus.Occupied);
            }

            wards.Add(new
            {
                w.Id,
                w.Name,
                w.Code,
                w.Description,
                WardType = w.WardType.ToString(),
                w.FloorId,
                w.TotalBeds,
                w.DailyRate,
                w.IsActive,
                AvailableBeds = availableBeds,
                OccupiedBeds = occupiedBeds,
                RoomCount = roomIds.Count,
                BedCount = bedCount
            });
        }

        return Ok(Result<object>.Success(wards));
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsView)]
    public async Task<IActionResult> GetWard(Guid id)
    {
        var tenantId = _tenantService.GetCurrentTenantId();

        var w = await _context.Wards.IgnoreQueryFilters()
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted
                && (!tenantId.HasValue || x.TenantId == tenantId.Value));

        if (w == null)
            return NotFound(Result.Failure("Ward not found"));

        var floor = w.FloorId.HasValue
            ? await _context.Floors.IgnoreQueryFilters().FirstOrDefaultAsync(f => f.Id == w.FloorId.Value)
            : null;

        var rooms = await _context.Rooms.IgnoreQueryFilters()
            .Where(r => r.WardId == id && !r.IsDeleted)
            .OrderBy(r => r.RoomNumber)
            .ToListAsync();

        var roomDtos = new List<object>();
        foreach (var r in rooms)
        {
            var beds = await _context.Beds.IgnoreQueryFilters()
                .Where(b => b.RoomId == r.Id && !b.IsDeleted)
                .Select(b => new
                {
                    b.Id,
                    b.BedNumber,
                    BedType = b.BedType.ToString(),
                    Status = b.Status.ToString(),
                    b.CurrentPatientId,
                    PatientName = b.CurrentPatientId.HasValue
                        ? _context.Patients.Where(p => p.Id == b.CurrentPatientId).Select(p => p.FirstName + " " + p.LastName).FirstOrDefault()
                        : null,
                    b.DailyRate
                })
                .ToListAsync();

            roomDtos.Add(new
            {
                r.Id,
                r.RoomNumber,
                r.Name,
                RoomType = r.RoomType.ToString(),
                r.Capacity,
                r.HasBathroom,
                r.HasTV,
                r.HasAC,
                r.IsIsolation,
                r.DailyRate,
                BedCount = beds.Count,
                AvailableBeds = beds.Count(b => b.Status == "Available"),
                Beds = beds
            });
        }

        return Ok(Result<object>.Success(new
        {
            w.Id,
            w.Name,
            w.Code,
            w.Description,
            WardType = w.WardType.ToString(),
            w.FloorId,
            FloorName = floor?.Name,
            w.TotalBeds,
            w.DailyRate,
            w.GenderRestriction,
            w.IsActive,
            Rooms = roomDtos
        }));
    }

    [HttpGet("rooms")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsView)]
    public async Task<IActionResult> GetAllRooms([FromQuery] Guid? wardId = null)
    {
        var tenantId = _tenantService.GetCurrentTenantId();

        var query = _context.Rooms.IgnoreQueryFilters()
            .Where(r => !r.IsDeleted && r.IsActive && (!tenantId.HasValue || r.TenantId == tenantId.Value));

        if (wardId.HasValue)
            query = query.Where(r => r.WardId == wardId.Value);

        var roomIds = await query.OrderBy(r => r.RoomNumber).Select(r => r.Id).ToListAsync();

        var rooms = new List<object>();
        foreach (var rid in roomIds)
        {
            var r = await _context.Rooms.IgnoreQueryFilters().FirstAsync(x => x.Id == rid);
            var ward = await _context.Wards.IgnoreQueryFilters().FirstOrDefaultAsync(w => w.Id == r.WardId);
            var bedCount = await _context.Beds.IgnoreQueryFilters().CountAsync(b => b.RoomId == rid && !b.IsDeleted);
            var available = await _context.Beds.IgnoreQueryFilters().CountAsync(b => b.RoomId == rid && !b.IsDeleted && b.Status == BedStatus.Available);
            var occupied = await _context.Beds.IgnoreQueryFilters().CountAsync(b => b.RoomId == rid && !b.IsDeleted && b.Status == BedStatus.Occupied);

            rooms.Add(new
            {
                r.Id,
                r.RoomNumber,
                r.Name,
                RoomType = r.RoomType.ToString(),
                r.WardId,
                WardName = ward?.Name ?? "Unknown",
                r.Capacity,
                r.HasBathroom,
                r.HasTV,
                r.HasAC,
                r.IsIsolation,
                r.DailyRate,
                BedCount = bedCount,
                AvailableBeds = available,
                OccupiedBeds = occupied
            });
        }

        return Ok(Result<object>.Success(rooms));
    }

    [HttpPost]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsManage)]
    public async Task<IActionResult> CreateWard([FromBody] CreateWardRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(Result.Failure("Name is required"));

        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));
        var branchId = _tenantService.GetCurrentBranchId();

        var ward = new Ward
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
            IsActive = true,
            TenantId = tenantId,
            BranchId = branchId
        };

        _context.Wards.Add(ward);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { ward.Id }, "Ward created successfully"));
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsManage)]
    public async Task<IActionResult> UpdateWard(Guid id, [FromBody] CreateWardRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        var ward = await _context.Wards.IgnoreQueryFilters().FirstOrDefaultAsync(w => w.Id == id && !w.IsDeleted
            && (!tenantId.HasValue || w.TenantId == tenantId.Value));
        if (ward == null)
            return NotFound(Result.Failure("Ward not found"));

        ward.Name = request.Name ?? ward.Name;
        ward.Code = request.Code ?? ward.Code;
        ward.Description = request.Description ?? ward.Description;
        if (request.FloorId.HasValue) ward.FloorId = request.FloorId;
        if (request.DepartmentId.HasValue) ward.DepartmentId = request.DepartmentId;
        if (Enum.TryParse<WardType>(request.WardType, true, out var wt)) ward.WardType = wt;
        if (request.TotalBeds > 0) ward.TotalBeds = request.TotalBeds;
        if (Enum.TryParse<Gender>(request.GenderRestriction, true, out var g)) ward.GenderRestriction = g;
        if (request.DailyRate.HasValue) ward.DailyRate = request.DailyRate;
        if (request.IsActive.HasValue) ward.IsActive = request.IsActive.Value;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Ward updated successfully"));
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsManage)]
    public async Task<IActionResult> DeleteWard(Guid id)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        var ward = await _context.Wards.IgnoreQueryFilters().FirstOrDefaultAsync(w => w.Id == id && !w.IsDeleted
            && (!tenantId.HasValue || w.TenantId == tenantId.Value));
        if (ward == null)
            return NotFound(Result.Failure("Ward not found"));

        ward.IsDeleted = true;
        await _context.SaveChangesAsync();
        return Ok(Result.Success("Ward deleted successfully"));
    }

    [HttpPost("{id:guid}/rooms")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsManage)]
    public async Task<IActionResult> CreateRoom(Guid id, [FromBody] CreateRoomRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));
        var branchId = _tenantService.GetCurrentBranchId();

        var ward = await _context.Wards.IgnoreQueryFilters().FirstOrDefaultAsync(w => w.Id == id && !w.IsDeleted
            && (!tenantId.HasValue || w.TenantId == tenantId.Value));
        if (ward == null)
            return NotFound(Result.Failure("Ward not found"));

        var roomCount = await _context.Rooms.IgnoreQueryFilters().CountAsync(r => !r.IsDeleted && r.WardId == id);

        var room = new Room
        {
            WardId = id,
            RoomNumber = request.RoomNumber ?? $"R{(roomCount + 1):D3}",
            Name = request.Name,
            Description = request.Description,
            RoomType = Enum.TryParse<RoomType>(request.RoomType, true, out var rt) ? rt : RoomType.General,
            Capacity = request.Capacity > 0 ? request.Capacity : 1,
            DailyRate = request.DailyRate,
            IsActive = true,
            TenantId = tenantId,
            BranchId = branchId
        };

        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { room.Id }, "Room created successfully"));
    }

    [HttpPut("rooms/{roomId:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsManage)]
    public async Task<IActionResult> UpdateRoom(Guid roomId, [FromBody] CreateRoomRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        var room = await _context.Rooms.IgnoreQueryFilters().FirstOrDefaultAsync(r => r.Id == roomId && !r.IsDeleted
            && (!tenantId.HasValue || r.TenantId == tenantId.Value));
        if (room == null)
            return NotFound(Result.Failure("Room not found"));

        if (request.RoomNumber != null) room.RoomNumber = request.RoomNumber;
        if (request.Name != null) room.Name = request.Name;
        if (request.Description != null) room.Description = request.Description;
        if (Enum.TryParse<RoomType>(request.RoomType, true, out var rt)) room.RoomType = rt;
        if (request.Capacity > 0) room.Capacity = request.Capacity;
        if (request.DailyRate.HasValue) room.DailyRate = request.DailyRate;

        await _context.SaveChangesAsync();
        return Ok(Result.Success("Room updated successfully"));
    }

    [HttpDelete("rooms/{roomId:guid}")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsManage)]
    public async Task<IActionResult> DeleteRoom(Guid roomId)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        var room = await _context.Rooms.IgnoreQueryFilters().FirstOrDefaultAsync(r => r.Id == roomId && !r.IsDeleted
            && (!tenantId.HasValue || r.TenantId == tenantId.Value));
        if (room == null)
            return NotFound(Result.Failure("Room not found"));

        room.IsDeleted = true;
        await _context.SaveChangesAsync();
        return Ok(Result.Success("Room deleted successfully"));
    }

    [HttpPost("rooms/{roomId:guid}/beds")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsManage)]
    public async Task<IActionResult> CreateBed(Guid roomId, [FromBody] CreateBedRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));
        var branchId = _tenantService.GetCurrentBranchId();

        var room = await _context.Rooms.IgnoreQueryFilters().FirstOrDefaultAsync(r => r.Id == roomId && !r.IsDeleted
            && (!tenantId.HasValue || r.TenantId == tenantId.Value));
        if (room == null)
            return NotFound(Result.Failure("Room not found"));

        var bedCount = await _context.Beds.IgnoreQueryFilters().CountAsync(b => !b.IsDeleted && b.RoomId == roomId);

        var bed = new Bed
        {
            RoomId = roomId,
            BedNumber = request.BedNumber ?? $"B{room.RoomNumber}-{(bedCount + 1):D2}",
            Name = request.Name,
            Description = request.Description,
            BedType = Enum.TryParse<BedType>(request.BedType, true, out var bt) ? bt : BedType.General,
            Status = BedStatus.Available,
            DailyRate = request.DailyRate,
            HasCallBell = request.HasCallBell,
            HasOxygen = request.HasOxygen,
            HasSuction = request.HasSuction,
            IsElectric = request.IsElectric,
            IsActive = true,
            TenantId = tenantId,
            BranchId = branchId
        };

        _context.Beds.Add(bed);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { bed.Id }, "Bed created successfully"));
    }

    [HttpPost("rooms/{roomId:guid}/beds/batch")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsManage)]
    public async Task<IActionResult> CreateBedsBatch(Guid roomId, [FromBody] CreateBedsBatchRequest request)
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));
        var branchId = _tenantService.GetCurrentBranchId();

        var room = await _context.Rooms.IgnoreQueryFilters().FirstOrDefaultAsync(r => r.Id == roomId && !r.IsDeleted
            && (!tenantId.HasValue || r.TenantId == tenantId.Value));
        if (room == null)
            return NotFound(Result.Failure("Room not found"));

        var existingCount = await _context.Beds.IgnoreQueryFilters().CountAsync(b => !b.IsDeleted && b.RoomId == roomId);
        var beds = new List<Bed>();

        for (int i = 1; i <= request.Count; i++)
        {
            var bed = new Bed
            {
                RoomId = roomId,
                BedNumber = request.Prefix != null
                    ? $"{request.Prefix}{(existingCount + i):D2}"
                    : $"{room.RoomNumber}-{(existingCount + i):D2}",
                BedType = Enum.TryParse<BedType>(request.BedType, true, out var bt) ? bt : BedType.General,
                Status = BedStatus.Available,
                DailyRate = request.DailyRate,
                IsActive = true,
                TenantId = tenantId,
                BranchId = branchId
            };
            beds.Add(bed);
        }

        _context.Beds.AddRange(beds);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new { created = beds.Count, ids = beds.Select(b => b.Id) }, $"{beds.Count} beds created successfully"));
    }

    [HttpGet("{id:guid}/available-beds")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsView)]
    public async Task<IActionResult> GetAvailableBeds(Guid id)
    {
        var tenantId = _tenantService.GetCurrentTenantId();

        var roomIds = await _context.Rooms.IgnoreQueryFilters()
            .Where(r => r.WardId == id && !r.IsDeleted && (!tenantId.HasValue || r.TenantId == tenantId.Value))
            .Select(r => r.Id).ToListAsync();

        var beds = await _context.Beds.IgnoreQueryFilters()
            .Where(b => roomIds.Contains(b.RoomId) && !b.IsDeleted && b.Status == BedStatus.Available)
            .Select(b => new
            {
                b.Id,
                b.BedNumber,
                BedType = b.BedType.ToString(),
                Status = b.Status.ToString(),
                b.DailyRate,
                RoomNumber = _context.Rooms.IgnoreQueryFilters().Where(r => r.Id == b.RoomId).Select(r => r.RoomNumber).FirstOrDefault(),
                RoomId = b.RoomId
            })
            .ToListAsync();

        return Ok(Result<object>.Success(beds));
    }

    [HttpGet("{id:guid}/beds")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsView)]
    public async Task<IActionResult> GetWardBeds(Guid id)
    {
        var tenantId = _tenantService.GetCurrentTenantId();

        var roomIds = await _context.Rooms.IgnoreQueryFilters()
            .Where(r => r.WardId == id && !r.IsDeleted && (!tenantId.HasValue || r.TenantId == tenantId.Value))
            .Select(r => r.Id).ToListAsync();

        var beds = await _context.Beds.IgnoreQueryFilters()
            .Where(b => roomIds.Contains(b.RoomId) && !b.IsDeleted)
            .Select(b => new
            {
                b.Id,
                b.BedNumber,
                BedType = b.BedType.ToString(),
                Status = b.Status.ToString(),
                PatientName = b.CurrentPatientId.HasValue
                    ? _context.Patients.Where(p => p.Id == b.CurrentPatientId).Select(p => p.FirstName + " " + p.LastName).FirstOrDefault()
                    : null,
                b.CurrentPatientId,
                b.CurrentAdmissionId,
                b.DailyRate,
                RoomNumber = _context.Rooms.IgnoreQueryFilters().Where(r => r.Id == b.RoomId).Select(r => r.RoomNumber).FirstOrDefault(),
                RoomId = b.RoomId,
                WardId = id
            })
            .ToListAsync();

        return Ok(Result<object>.Success(beds));
    }

    [HttpPost("seed-defaults")]
    [RequirePermission(ClinIQ.Shared.Constants.Permissions.BedsManage)]
    public async Task<IActionResult> SeedDefaults()
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        if (tenantId is null)
            return BadRequest(Result.Failure("Unable to resolve the current organization."));
        var branchId = _tenantService.GetCurrentBranchId();

        var existingWards = await _context.Wards.IgnoreQueryFilters()
            .CountAsync(w => !w.IsDeleted && w.TenantId == tenantId);
        if (existingWards > 0)
            return Ok(Result<object>.Success(new { message = "Defaults already exist" }));

        var ward = new Ward
        {
            Name = "General Ward",
            Code = "GW",
            Description = "General medical ward",
            WardType = WardType.General,
            TotalBeds = 10,
            IsActive = true,
            TenantId = tenantId,
            BranchId = branchId
        };
        _context.Wards.Add(ward);
        await _context.SaveChangesAsync();

        var room = new Room
        {
            WardId = ward.Id,
            RoomNumber = "R101",
            Name = "General Room 1",
            RoomType = RoomType.General,
            Capacity = 10,
            IsActive = true,
            TenantId = tenantId,
            BranchId = branchId
        };
        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();

        var beds = new List<Bed>();
        for (int i = 1; i <= 10; i++)
        {
            beds.Add(new Bed
            {
                RoomId = room.Id,
                BedNumber = $"B{i:D2}",
                BedType = BedType.General,
                Status = BedStatus.Available,
                DailyRate = 1000,
                IsActive = true,
                TenantId = tenantId,
                BranchId = branchId
            });
        }
        _context.Beds.AddRange(beds);
        await _context.SaveChangesAsync();

        return Ok(Result<object>.Success(new
        {
            wardId = ward.Id,
            roomId = room.Id,
            bedCount = beds.Count,
            message = "Default ward, room, and 10 beds created successfully"
        }));
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
        public bool? IsActive { get; set; }
    }

    public class CreateRoomRequest
    {
        public string? RoomNumber { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? RoomType { get; set; }
        public int Capacity { get; set; } = 1;
        public decimal? DailyRate { get; set; }
    }

    public class CreateBedRequest
    {
        public string? BedNumber { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? BedType { get; set; }
        public decimal? DailyRate { get; set; }
        public bool HasCallBell { get; set; }
        public bool HasOxygen { get; set; }
        public bool HasSuction { get; set; }
        public bool IsElectric { get; set; }
    }

    public class CreateBedsBatchRequest
    {
        public int Count { get; set; } = 1;
        public string? Prefix { get; set; }
        public string? BedType { get; set; }
        public decimal? DailyRate { get; set; }
    }
}
