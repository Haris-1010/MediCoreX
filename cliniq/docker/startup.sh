#!/bin/bash
set -e

# Start nginx in background
nginx -g "daemon on;"

# Start .NET API
cd /app/api
exec dotnet ClinIQ.API.dll
