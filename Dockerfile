# Angular frontend
FROM node:20-alpine AS web
WORKDIR /app

COPY cliniq/src/ClinIQ.Web/package.json cliniq/src/ClinIQ.Web/package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY cliniq/src/ClinIQ.Web/ ./
RUN npm run build -- --configuration production

# .NET API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS api
WORKDIR /src

COPY cliniq/ClinIQ.sln cliniq/global.json ./
COPY cliniq/src/ ./cliniq/src/

RUN dotnet restore "cliniq/src/ClinIQ.API/ClinIQ.API.csproj"
RUN dotnet publish "cliniq/src/ClinIQ.API/ClinIQ.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime: one process, one port
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=api /app/publish .
COPY --from=web /app/dist/cliniq-web/browser/ ./wwwroot/

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "exec dotnet ClinIQ.API.dll --urls http://0.0.0.0:${PORT}"]
