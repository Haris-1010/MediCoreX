# Build stage for .NET API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-api
WORKDIR /src

# Copy solution and project files
COPY *.sln ./
COPY src/ClinIQ.Domain/*.csproj ./src/ClinIQ.Domain/
COPY src/ClinIQ.Shared/*.csproj ./src/ClinIQ.Shared/
COPY src/ClinIQ.Application/*.csproj ./src/ClinIQ.Application/
COPY src/ClinIQ.Infrastructure/*.csproj ./src/ClinIQ.Infrastructure/
COPY src/ClinIQ.API/*.csproj ./src/ClinIQ.API/

# Restore dependencies
RUN dotnet restore

# Copy source code
COPY src/ ./src/

# Build and publish
WORKDIR /src/src/ClinIQ.API
RUN dotnet publish -c Release -o /app/publish

# Build stage for Angular
FROM node:20-alpine AS build-web
WORKDIR /app

# Copy package files
COPY src/ClinIQ.Web/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ClinIQ.Web/ ./

# Build Angular app
RUN npm run build -- --configuration production

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Install nginx for serving Angular app
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy API
COPY --from=build-api /app/publish ./api

# Copy Angular app
COPY --from=build-web /app/dist/cliniq-web /var/www/html

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy startup script
COPY docker/startup.sh /startup.sh
RUN chmod +x /startup.sh

EXPOSE 80 443

ENTRYPOINT ["/startup.sh"]
