using ClinIQ.Shared.DTOs.Platform;
using ClinIQ.Shared.Models;

namespace ClinIQ.Application.Interfaces;

/// <summary>
/// Creates and configures organizations (tenants). Every operation that touches
/// more than one table runs inside a transaction.
/// </summary>
public interface IOrganizationProvisioningService
{
    Task<Result<CreateOrganizationResponse>> CreateAsync(
        CreateOrganizationRequest request, CancellationToken cancellationToken = default);

    Task<Result<OrganizationDetailDto>> GetAsync(
        Guid tenantId, CancellationToken cancellationToken = default);

    Task<Result> UpdateAsync(
        Guid tenantId, UpdateOrganizationRequest request, CancellationToken cancellationToken = default);

    Task<Result> UpdateEntitlementsAsync(
        Guid tenantId, UpdateEntitlementsRequest request, CancellationToken cancellationToken = default);

    Task<Result> SetActiveAsync(
        Guid tenantId, bool isActive, CancellationToken cancellationToken = default);
}
