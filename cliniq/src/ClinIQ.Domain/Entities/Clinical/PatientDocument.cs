using ClinIQ.Domain.Common;

namespace ClinIQ.Domain.Entities.Clinical;

/// <summary>
/// Patient document/attachment
/// </summary>
public class PatientDocument : TenantEntity
{
    public Guid PatientId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string OriginalFileName { get; set; } = string.Empty;
    public string? FileExtension { get; set; }
    public string? MimeType { get; set; }
    public long FileSizeBytes { get; set; }
    public string StoragePath { get; set; } = string.Empty;
    public string? DocumentType { get; set; }
    public string? Description { get; set; }
    public bool IsConfidential { get; set; }
    public DateTime? DocumentDate { get; set; }

    // Related entities
    public Guid? VisitId { get; set; }
    public Guid? AdmissionId { get; set; }

    // Navigation properties
    public virtual Patient Patient { get; set; } = null!;
}
