# ClinIQ Development Setup Guide

This guide will help you set up the ClinIQ project on your local development machine.

## Prerequisites

### Required Software

1. **.NET 8 SDK**
   - Download from: https://dotnet.microsoft.com/download/dotnet/8.0
   - Verify installation: `dotnet --version`

2. **Node.js 18+ and npm**
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

3. **SQL Server 2019+**
   - Options:
     - SQL Server Express (free): https://www.microsoft.com/sql-server/sql-server-downloads
     - SQL Server Developer (free for dev): https://www.microsoft.com/sql-server/sql-server-downloads
     - Docker: `docker pull mcr.microsoft.com/mssql/server:2022-latest`

4. **Angular CLI 19**
   - Install: `npm install -g @angular/cli@19`
   - Verify: `ng version`

5. **IDE (Recommended)**
   - Visual Studio 2022 (Windows)
   - Visual Studio Code with C# extensions
   - JetBrains Rider

### Optional Software

- **Docker Desktop** - For containerized development
- **Azure Data Studio** - For database management
- **Postman** - For API testing

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cliniq
```

### 2. Database Setup

#### Option A: Using SQL Server directly

1. Open SQL Server Management Studio or Azure Data Studio
2. Connect to your SQL Server instance
3. Create a new database named `ClinIQ`

```sql
CREATE DATABASE ClinIQ;
```

#### Option B: Using Docker

```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=ClinIQ@2024!" \
  -p 1433:1433 --name cliniq-sql \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

### 3. Configure Connection String

Edit `src/ClinIQ.API/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ClinIQ;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

For Docker/SQL Server with password:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=ClinIQ;User Id=sa;Password=ClinIQ@2024!;TrustServerCertificate=True"
  }
}
```

### 4. Run Database Migrations

```bash
cd src/ClinIQ.API
dotnet ef database update
```

If Entity Framework CLI is not installed:
```bash
dotnet tool install --global dotnet-ef
```

### 5. Seed Initial Data (Optional)

Using SQL Server Management Studio or Azure Data Studio:
1. Open `scripts/seed-data.sql`
2. Execute the script against the ClinIQ database

### 6. Run the Backend API

```bash
cd src/ClinIQ.API
dotnet run
```

The API will start at:
- HTTPS: https://localhost:5001
- HTTP: http://localhost:5000

Swagger documentation: https://localhost:5001/swagger

### 7. Run the Frontend

Open a new terminal:

```bash
cd src/ClinIQ.Web
npm install
ng serve
```

The frontend will start at: http://localhost:4200

### 8. Access the Application

1. Open http://localhost:4200 in your browser
2. Login with default credentials:
   - Email: `admin@cliniq.com`
   - Password: `Admin@123`

## Project Structure

```
cliniq/
├── src/
│   ├── ClinIQ.Domain/          # Domain entities and interfaces
│   ├── ClinIQ.Shared/          # Shared utilities and DTOs
│   ├── ClinIQ.Application/     # Business logic and services
│   ├── ClinIQ.Infrastructure/  # Data access and external services
│   ├── ClinIQ.API/             # REST API (start here for backend)
│   └── ClinIQ.Web/             # Angular frontend (start here for frontend)
├── tests/
│   ├── ClinIQ.Domain.Tests/
│   ├── ClinIQ.Application.Tests/
│   ├── ClinIQ.Infrastructure.Tests/
│   └── ClinIQ.API.Tests/
├── docs/                       # Documentation
├── docker/                     # Docker configuration
└── scripts/                    # Database scripts
```

## Running Tests

### Backend Tests

```bash
# Run all tests
dotnet test

# Run specific project tests
dotnet test tests/ClinIQ.API.Tests

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"
```

### Frontend Tests

```bash
cd src/ClinIQ.Web

# Run unit tests
ng test

# Run e2e tests
ng e2e

# Run with coverage
ng test --code-coverage
```

## Common Commands

### Backend

```bash
# Restore packages
dotnet restore

# Build solution
dotnet build

# Run API
cd src/ClinIQ.API && dotnet run

# Watch mode (auto-restart on changes)
cd src/ClinIQ.API && dotnet watch run

# Add migration
cd src/ClinIQ.API
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Rollback migration
dotnet ef database update PreviousMigrationName
```

### Frontend

```bash
cd src/ClinIQ.Web

# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build --configuration production

# Generate component
ng generate component features/module-name/component-name

# Generate service
ng generate service core/services/service-name

# Lint code
ng lint

# Format code
npm run format
```

## Docker Development

### Using Docker Compose

```bash
cd docker
docker-compose up --build
```

This will start:
- SQL Server on port 1433
- API on port 5000
- Web app on port 80
- Redis on port 6379

### Individual Containers

```bash
# Build API image
docker build -f docker/Dockerfile.api -t cliniq-api .

# Build Web image
docker build -f docker/Dockerfile.web -t cliniq-web .

# Run API
docker run -p 5000:5000 cliniq-api

# Run Web
docker run -p 80:80 cliniq-web
```

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Verify SQL Server is running
   - Check connection string in appsettings.json
   - Ensure firewall allows connection on port 1433

2. **EF Core migration errors**
   - Ensure you're in the API project directory
   - Verify dotnet-ef tool is installed
   - Check that migrations exist in Infrastructure project

3. **Angular build errors**
   - Delete `node_modules` and run `npm install`
   - Clear Angular cache: `ng cache clean`
   - Verify Node.js version matches requirements

4. **CORS errors**
   - Check CORS configuration in API Program.cs
   - Verify frontend is running on expected port

5. **JWT authentication issues**
   - Check JWT settings in appsettings.json
   - Verify token hasn't expired
   - Ensure Authorization header is properly formatted

### Getting Help

1. Check the documentation in `/docs` folder
2. Review API documentation at /swagger
3. Check error logs in `/logs` folder
4. Contact the development team

## IDE Setup

### Visual Studio Code

Recommended extensions:
- C# (Microsoft)
- C# Dev Kit
- Angular Language Service
- Prettier
- ESLint
- GitLens

### Visual Studio 2022

1. Open `ClinIQ.sln`
2. Set `ClinIQ.API` as startup project
3. Run with F5

### JetBrains Rider

1. Open the solution folder
2. Trust the solution when prompted
3. Run configuration should auto-detect

## Next Steps

1. Review the architecture documentation: `docs/ARCHITECTURE.md`
2. Study the database schema: `docs/DATABASE.md`
3. Explore the API endpoints: `docs/API.md`
4. Start with small bug fixes to understand the codebase
5. Follow coding conventions in `.editorconfig`
