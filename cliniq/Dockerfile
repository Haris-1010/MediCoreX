FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

COPY . .

RUN dotnet restore "src/ClinIQ.API/ClinIQ.API.csproj"

RUN dotnet publish "src/ClinIQ.API/ClinIQ.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "exec dotnet ClinIQ.API.dll --urls http://0.0.0.0:${PORT}"]
