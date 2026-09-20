#!/usr/bin/env pwsh

$uri = "http://localhost:50983/api/v1/auth/login"
$body = @{
    email = "admin@cliniq.com"
    password = "Admin@123"
} | ConvertTo-Json

Write-Host "Testing Login Credentials..." -ForegroundColor Cyan
Write-Host "Endpoint: $uri" -ForegroundColor Gray
Write-Host "Credentials: admin@cliniq.com / Admin@123" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $uri -Method Post -ContentType "application/json" -Body $body -TimeoutSec 10 -SkipCertificateCheck
    
    Write-Host "✅ SUCCESSFUL LOGIN!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host ""
    Write-Host "=== LOGIN RESPONSE ===" -ForegroundColor Cyan
    Write-Host "User Email: $($data.data.user.email)" -ForegroundColor Green
    Write-Host "User Name: $($data.data.user.firstName) $($data.data.user.lastName)" -ForegroundColor Green
    Write-Host "Role: $($data.data.user.role)" -ForegroundColor Green
    Write-Host "Token Type: Bearer" -ForegroundColor Green
    Write-Host "Access Token: $($data.data.accessToken.Substring(0, 50))..." -ForegroundColor Cyan
    Write-Host ""
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
    Write-Host "❌ LOGIN FAILED!" -ForegroundColor Red
    Write-Host "Status Code: $statusCode" -ForegroundColor Red
    
    try {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = [System.IO.StreamReader]::new($stream)
        $errorContent = $reader.ReadToEnd()
        $errorData = $errorContent | ConvertFrom-Json
        Write-Host "Error Message: $($errorData.message)" -ForegroundColor Yellow
    } catch {
        Write-Host "Error Response: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
