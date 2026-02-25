# Script para copiar la carpeta backend a XAMPP htdocs\takeoffauto-api

$source = "C:\proyectos de TAKEOFF\TAKEOFF-AUTO\backend"
$destination = "C:\xampp\htdocs\takeoffauto-api"

# Crear la carpeta destino si no existe
if (-Not (Test-Path -Path $destination)) {
    New-Item -ItemType Directory -Path $destination
}

# Copiar todos los archivos y subcarpetas recursivamente
Copy-Item -Path $source\* -Destination $destination -Recurse -Force

Write-Host "Copia completada."