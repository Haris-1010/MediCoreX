# ClinIQ - Enterprise Hospital Management System

A production-grade, enterprise-level, multi-tenant Clinic + Hospital Management + EMR SaaS platform built with ASP.NET Core 8 and Angular 19.

## Features

### Clinical Modules
- **OPD (Outpatient Department)**: Queue management, token system, consultations
- **IPD (Inpatient Department)**: Admissions, bed management, nursing stations, discharge workflow
- **Emergency Department**: Triage system, priority-based queue
- **Appointments**: Scheduling, doctor availability, slot management
- **EMR (Electronic Medical Records)**: Patient medical history, diagnoses, prescriptions

### Administrative Modules
- **Patient Management**: Registration, demographics, medical history
- **Doctor Management**: Profiles, schedules, specializations
- **Staff Management**: HR functions, attendance, roles
- **Facility Management**: Buildings, wards, rooms, beds, equipment

### Financial Modules
- **Billing**: Invoice generation, payment tracking
- **Insurance**: Claims processing, policy management
- **Inventory**: Stock management, purchase orders
- **Pharmacy**: Dispensing, stock tracking

### Clinical Support
- **Laboratory**: Test ordering, result entry, reports
- **Radiology**: Imaging orders, reports

### System Features
- Multi-tenant architecture with tenant/branch isolation
- Role-based access control (RBAC)
- Real-time updates via SignalR
- Comprehensive reporting
- Audit logging

## Technology Stack

### Backend
- **Framework**: ASP.NET Core 8
- **Database**: SQL Server with Entity Framework Core 8
- **Authentication**: JWT with refresh token rotation
- **Real-time**: SignalR
- **Validation**: FluentValidation
- **Mapping**: AutoMapper

### Frontend
- **Framework**: Angular 19
- **UI Components**: Angular Material
- **State Management**: RxJS
- **HTTP Client**: Angular HttpClient with interceptors

## Prerequisites

- .NET 8 SDK
- Node.js 18+ and npm
- SQL Server 2019+ (or SQL Server Express)
- Angular CLI 19

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cliniq
```

### 2. Setup Database
```bash
# Update connection string in appsettings.json
# Then run migrations
cd src/ClinIQ.API
dotnet ef database update
```

### 3. Run Backend
```bash
cd src/ClinIQ.API
dotnet run
```
The API will be available at `https://localhost:5001`

### 4. Run Frontend
```bash
cd src/ClinIQ.Web
npm install
ng serve
```
The application will be available at `http://localhost:4200`

## Project Structure

```
cliniq/
├── src/
│   ├── ClinIQ.Domain/          # Domain entities, enums, interfaces
│   ├── ClinIQ.Shared/          # Shared utilities, DTOs, models
│   ├── ClinIQ.Application/     # Business logic, services, validators
│   ├── ClinIQ.Infrastructure/  # Data access, external services
│   ├── ClinIQ.API/             # REST API, controllers, middleware
│   └── ClinIQ.Web/             # Angular frontend application
├── tests/
│   ├── ClinIQ.Domain.Tests/
│   ├── ClinIQ.Application.Tests/
│   ├── ClinIQ.Infrastructure.Tests/
│   └── ClinIQ.API.Tests/
├── docs/                       # Documentation
└── docker/                     # Docker configuration
```

## Architecture

The solution follows Clean Architecture principles:

- **Domain Layer**: Core business entities and interfaces
- **Application Layer**: Business logic, DTOs, service interfaces
- **Infrastructure Layer**: Data persistence, external services
- **API Layer**: HTTP endpoints, authentication, authorization
- **Web Layer**: Angular SPA frontend

### Multi-Tenancy

The system supports multi-tenant architecture with:
- Tenant isolation via global query filters
- Branch-level data segregation
- Tenant-specific configurations

### Security

- JWT-based authentication with refresh token rotation
- Role-based access control (RBAC)
- Permission-based authorization
- API rate limiting
- Request validation

## Configuration

### API Configuration (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=ClinIQ;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "Secret": "your-secret-key-min-32-characters",
    "Issuer": "ClinIQ",
    "Audience": "ClinIQ",
    "AccessTokenExpirationMinutes": 60,
    "RefreshTokenExpirationDays": 7
  }
}
```

### Angular Configuration (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api',
  signalRUrl: 'https://localhost:5001/hubs'
};
```

## Running Tests

### Backend Tests
```bash
dotnet test
```

### Frontend Tests
```bash
cd src/ClinIQ.Web
ng test
```

## Docker Support

### Build and Run with Docker Compose
```bash
docker-compose up --build
```

## API Documentation

API documentation is available via Swagger at `https://localhost:5001/swagger` when running in development mode.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, please contact the development team.
