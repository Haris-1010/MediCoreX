# ClinIQ — what changed in this drop

Applied to your uploaded repo. Build artifacts (`bin`, `obj`, `node_modules`,
`.vs`, `dist`, `.angular`) were stripped so the archive is small; restore them
with `dotnet restore` and `npm install`.

I could not compile this. The container has no .NET SDK and the network policy
blocks Microsoft's download hosts, so everything below is verified by reading,
not by `dotnet build`. Expect to fix a handful of small things on first build.

---

## The reason this work was necessary

`TenantService.GetCurrentTenantId()` read the `tenant_id` claim, and when that
was missing it fell back to the **`X-Tenant-Id` request header**.
`AuthService.GenerateJwtTokenAsync` never emitted a `tenant_id` claim. So the
claim path never fired and the header path was the only one that ever ran.

Any authenticated user could read and write another organization's patient
records by changing one header. Your global query filters worked perfectly —
they scoped every query to whatever tenant the caller named.

Three consequences followed from the same root:

- All 27 controllers carried bare `[Authorize]`. No policy provider, no
  handler, no permission attribute existed. Every row in `Permissions` and
  `RolePermissions` was decorative.
- `IEntitlementService` was an interface with no implementation and no DI
  registration. Package gating did nothing.
- `CurrentUserService.Permissions` read a claim that was never minted.

---

## Backend

### New

| File | Purpose |
|---|---|
| `Domain/Entities/Identity/UserPermission.cs` | Per-user grant/deny override, optionally branch-scoped |
| `Domain/Entities/Tenancy/TenantEntitlement.cs` | `TenantEntitlement` + `TenantLimit` |
| `Domain/Interfaces/IPermissionService.cs` | Effective-permission engine contract |
| `Shared/Constants/PermissionCatalog.cs` | Metadata for all 72 permissions; drives seeder and UI |
| `Shared/Constants/PackageCatalog.cs` | Package → features and limits |
| `Shared/Constants/RolePermissionDefaults.cs` | Default grants per built-in role |
| `Shared/DTOs/Platform/OrganizationDtos.cs` | Provisioning DTOs |
| `Application/Interfaces/IOrganizationProvisioningService.cs` | |
| `Infrastructure/Services/PermissionService.cs` | Resolution + 5-min cache |
| `Infrastructure/Services/EntitlementService.cs` | Package gating + 10-min cache |
| `Infrastructure/Services/OrganizationProvisioningService.cs` | Section 106 workflow |
| `Infrastructure/Data/Seeding/PermissionSeeder.cs` | Idempotent permission/role seed |
| `Infrastructure/Data/Configurations/UserPermissionConfiguration.cs` | |
| `Infrastructure/Data/Configurations/TenantEntitlementConfiguration.cs` | |
| `API/Authorization/PermissionAuthorization.cs` | `[RequirePermission]`, policy provider, handler |
| `API/Middleware/TenantResolutionMiddleware.cs` | Per-request membership re-check |
| `API/Controllers/v1/PlatformOrganizationsController.cs` | SaaS admin (sections 105–107) |
| `API/Controllers/v1/UserPermissionsController.cs` | Permission matrix, branch scope, temp passwords |

### Modified

- **`Infrastructure/Services/TenantService.cs`** — header fallback removed. The
  tenant comes from the signed token. `X-Tenant-Id` is honoured only for a
  verified super admin, and only via the middleware.
- **`Infrastructure/Services/AuthService.cs`** — token now carries `tenant_id`,
  `branch_id`, `is_owner`, `jti`. Tenant and branch are resolved from
  `TenantUsers` / `BranchUsers`, so a requested org is honoured only when the
  user is genuinely a member. `ChangePasswordAsync` implemented (was a TODO
  returning failure) and revokes outstanding refresh tokens.
- **`Domain/Entities/Identity/ApplicationUser.cs`** — `MustChangePassword`,
  `PasswordChangedAt`, `Designation`.
- **`API/Controllers/v1/AuthController.cs`** — added `GET /api/v1/auth/me`.
- **`API/Program.cs`** — policy provider + handler registered;
  `UseTenantResolution()` placed between authentication and authorization; the
  inline try/catch role seeding replaced with `PermissionSeeder`.
- **`Infrastructure/DependencyInjection.cs`** — `AddMemoryCache` and the three
  new services registered.
- **`ApplicationDbContext`** — three DbSets added.
- **149 `[RequirePermission]` attributes** across 24 controllers.

Deliberately not permission-gated: `AuthController` (anonymous or self-service)
and `PlatformOrganizationsController` (super-admin check in code, because a
tenant owner must never reach it whatever their org granted them).

---

## Frontend

- `core/services/permission.service.ts` — signal-based context from `/auth/me`
- `core/services/navigation.service.ts` — sidebar filtered by entitlement +
  permission; groups with no reachable child are dropped
- `core/guards/permission.guard.ts` — replaced; `permissionGuard` and
  `entitlementGuard`
- `shared/directives/has-permission.directive.ts` — replaced; supports
  `module:` and `mode: 'any'`

---

## Database

`scripts/01-permissions-entitlements.sql` — three tables, three `Users`
columns, 72 permissions, 17 system roles, four supporting indexes. Idempotent.

**Prefer the EF migration** so the model snapshot stays in sync:

```bash
dotnet ef migrations add AddPermissionOverridesAndEntitlements \
  -p src/ClinIQ.Infrastructure -s src/ClinIQ.API
dotnet ef database update -p src/ClinIQ.Infrastructure -s src/ClinIQ.API
```

Use the raw script only where you apply SQL by hand.

---

## Bugs I fixed along the way

- `RefreshToken.IsRevoked` is a computed C# property. Your original
  `RefreshTokenAsync` used `!rt.IsRevoked` inside a LINQ-to-Entities query,
  which EF cannot translate and throws on at runtime. Changed to
  `rt.RevokedAt == null` in all three call sites.
- `Permission` extends `BaseEntity`, not `BaseAuditableEntity`, so it has no
  `IsDeleted`. Removed from my query.

---

## First-build checklist

1. `dotnet restore && dotnet build` — fix whatever surfaces; the likely
   candidates are missing usings in controllers I annotated by script.
2. Add the migration (above).
3. Start the API. `PermissionSeeder` populates permissions and roles.
4. Create your first organization via `POST /api/v1/platform/organizations`.
   You need a super-admin user, which `POST /api/v1/auth/register` creates
   (it sets `IsSuperAdmin = true` on the first user — tighten this before
   production).
5. Frontend: wire `PermissionService.load()` into an `APP_INITIALIZER`, call
   `load(true)` after login, `clear()` on logout.

---

## Still not built

Being straight about the gap, since the master prompt asks for far more:

- **No permission-matrix UI.** The API is there
  (`GET/PUT /api/v1/users/{id}/permissions`, `GET /users/permission-catalog`);
  the Angular screen from section 111 is not.
- **No platform-admin UI.** Same story — endpoints exist, screens do not.
- **Branch scoping in queries.** Tenant filtering works; branch-level row
  filtering is not applied in the feature controllers.
- **My permission-to-endpoint mapping is a first pass.** It was applied by
  script from HTTP verb plus route. Review it — a wrong mapping is either a
  locked-out user or an open door. `LaboratoryController` and
  `RadiologyController` in particular got `visits.*`, which is a stand-in.
- **No tests.** These are the ones that would have caught the original bug:

```csharp
[Fact] Authenticated_user_cannot_read_another_tenant_via_X_Tenant_Id_header
[Fact] Token_without_tenant_claim_is_rejected_with_403
[Fact] User_removed_from_tenant_is_rejected_before_token_expiry
[Fact] Explicit_user_deny_overrides_role_grant
[Fact] Permission_without_feature_entitlement_is_stripped
[Fact] Downgraded_package_immediately_revokes_paid_features
[Fact] Actor_cannot_grant_a_permission_they_do_not_hold
[Fact] Organization_provisioning_rolls_back_completely_on_failure
```

- Everything else in the 133 sections: IPD clinical workflow, nursing, EMR
  depth, insurance claims, procurement, LIS/RIS, telemedicine, reporting,
  command palette, the light-theme design-system pass.
