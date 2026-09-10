# ClinIQ Architecture Documentation

## Overview

ClinIQ is a multi-tenant Hospital Management System built using Clean Architecture principles. This document describes the architectural decisions, patterns, and structure of the application.

## Architecture Style

The application follows **Clean Architecture** (also known as Onion Architecture), which provides:

- Independence from frameworks
- Testability
- Independence from UI
- Independence from database
- Independence from external services

## Layer Structure

```
┌─────────────────────────────────────────────┐
│                   API Layer                  │
│         (Controllers, Middleware)            │
├─────────────────────────────────────────────┤
│              Application Layer               │
│        (Services, DTOs, Validators)          │
├─────────────────────────────────────────────┤
│              Infrastructure Layer            │
│       (EF Core, Repositories, External)      │
├─────────────────────────────────────────────┤
│                Domain Layer                  │
│         (Entities, Enums, Interfaces)        │
└─────────────────────────────────────────────┘
```

### Domain Layer (ClinIQ.Domain)

The innermost layer containing:
- **Entities**: Core business objects (Patient, Doctor, Appointment, etc.)
- **Enums**: Business-related enumerations
- **Interfaces**: Repository and service contracts
- **Value Objects**: Immutable objects representing concepts

Dependencies: None (pure .NET)

### Application Layer (ClinIQ.Application)

Contains business logic:
- **Services**: Business operations implementation
- **DTOs**: Data Transfer Objects for API communication
- **Validators**: FluentValidation rules
- **Mappings**: AutoMapper profiles

Dependencies: Domain Layer

### Infrastructure Layer (ClinIQ.Infrastructure)

Implements interfaces defined in Domain:
- **DbContext**: Entity Framework Core configuration
- **Repositories**: Data access implementation
- **External Services**: Email, SMS, file storage, etc.

Dependencies: Domain Layer, Application Layer

### API Layer (ClinIQ.API)

HTTP interface:
- **Controllers**: REST API endpoints
- **Middleware**: Request/response processing
- **Hubs**: SignalR real-time communication

Dependencies: All layers

### Web Layer (ClinIQ.Web)

Angular frontend:
- **Components**: UI elements
- **Services**: HTTP communication
- **Guards**: Route protection
- **Interceptors**: Request/response modification

## Multi-Tenancy

### Strategy

The application uses **Row-Level Multi-Tenancy** with a TenantId column on all tenant-specific entities.

### Implementation

1. **Tenant Identification**: Extracted from JWT token or subdomain
2. **Global Query Filters**: EF Core automatically filters data by TenantId
3. **Tenant Service**: Injectable service providing current tenant context

```csharp
// Global query filter example
modelBuilder.Entity<Patient>()
    .HasQueryFilter(p => p.TenantId == _tenantService.TenantId);
```

### Data Isolation

- Each tenant's data is logically isolated
- Cross-tenant queries are prevented at the database level
- Branch-level subdivision within tenants

## Authentication & Authorization

### Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│   API    │────▶│  Database│
└──────────┘     └──────────┘     └──────────┘
     │                │                │
     │  1. Login      │                │
     │───────────────▶│                │
     │                │  2. Validate   │
     │                │───────────────▶│
     │                │                │
     │  3. JWT Token  │                │
     │◀───────────────│                │
     │                │                │
     │  4. API Call   │                │
     │  + Bearer Token│                │
     │───────────────▶│                │
     │                │  5. Query      │
     │                │───────────────▶│
     │                │                │
     │  6. Response   │                │
     │◀───────────────│                │
```

### JWT Token Structure

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "tenantId": "tenant-guid",
  "branchId": "branch-guid",
  "roles": ["Admin", "Doctor"],
  "permissions": ["patients.read", "patients.write"]
}
```

### Authorization Levels

1. **Role-Based**: Broad access categories (Admin, Doctor, Nurse, etc.)
2. **Permission-Based**: Granular access control (patients.read, billing.write, etc.)
3. **Resource-Based**: Ownership and relationship checks

## Real-Time Communication

### SignalR Hubs

- **NotificationHub**: Push notifications
- **QueueHub**: OPD queue updates
- **ChatHub**: Internal messaging

### Event Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Backend  │────▶│ SignalR  │────▶│ Clients  │
└──────────┘     └──────────┘     └──────────┘
     │                │                │
     │  Event Raised  │                │
     │───────────────▶│                │
     │                │  Broadcast     │
     │                │───────────────▶│
     │                │                │
```

## Data Access Patterns

### Repository Pattern

```csharp
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
}
```

### Unit of Work

```csharp
public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken token = default);
    void BeginTransaction();
    Task CommitAsync();
    void Rollback();
}
```

## API Design

### REST Conventions

- `GET /api/v1/patients` - List patients
- `GET /api/v1/patients/{id}` - Get patient
- `POST /api/v1/patients` - Create patient
- `PUT /api/v1/patients/{id}` - Update patient
- `DELETE /api/v1/patients/{id}` - Delete patient

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "errors": []
}
```

### Pagination

```json
{
  "items": [...],
  "totalCount": 100,
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 10
}
```

## Error Handling

### Exception Types

- `ValidationException`: Input validation failures
- `NotFoundException`: Resource not found
- `UnauthorizedException`: Authentication failure
- `ForbiddenException`: Authorization failure
- `BusinessException`: Business rule violations

### Global Exception Handler

All exceptions are caught and transformed into consistent API responses.

## Performance Considerations

### Caching Strategy

- **Response Caching**: Static data caching
- **Distributed Cache**: Redis for session/token storage
- **Query Optimization**: Indexed queries, pagination

### Database Optimization

- Indexed columns for frequent queries
- Lazy loading disabled by default
- Eager loading for known relationships
- Query projections for list views

## Security Measures

### Input Validation

- FluentValidation for all DTOs
- Model binding validation
- SQL injection prevention via parameterized queries

### Output Encoding

- JSON encoding for API responses
- XSS prevention in Angular templates

### Headers

- CORS configuration
- Security headers (X-Frame-Options, CSP, etc.)

## Deployment Architecture

### Production Setup

```
                    ┌─────────────┐
                    │   Nginx     │
                    │   (LB)      │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼─────┐  ┌──────▼─────┐  ┌──────▼─────┐
    │   API-1    │  │   API-2    │  │   API-3    │
    └──────┬─────┘  └──────┬─────┘  └──────┬─────┘
           │               │               │
           └───────────────┼───────────────┘
                           │
                    ┌──────▼──────┐
                    │  SQL Server │
                    │  (Primary)  │
                    └─────────────┘
```

## Monitoring & Logging

### Structured Logging

- Serilog for structured logging
- Correlation IDs for request tracing
- Log levels: Debug, Info, Warning, Error, Fatal

### Health Checks

- Database connectivity
- External service availability
- Memory/CPU usage

## Scalability

### Horizontal Scaling

- Stateless API design
- Session externalization (Redis)
- Database connection pooling

### Vertical Scaling

- Async/await throughout
- Efficient memory usage
- Query optimization
