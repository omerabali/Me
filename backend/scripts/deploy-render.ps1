# Mimari: API = Render | Frontend = Vercel (+ domain)
# Mevcut API: https://me-vkjy.onrender.com

$ErrorActionPreference = "Stop"
$BackendRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$EnvFile = Join-Path $BackendRoot ".env"

Write-Host "=== Canlı mimari ==="
Write-Host "API (Render):  https://me-vkjy.onrender.com"
Write-Host "Web (Vercel):  vercel.com → bu repo → custom domain"
Write-Host ""
Write-Host "--- Render API Environment (zorunlu production) ---"
Write-Host "ENVIRONMENT=production"
Write-Host "DEBUG=False"
Write-Host "DATABASE_URL=..."
Write-Host "ADMIN_PASSWORD_SALT / SHA256 / JWT_SECRET"
Write-Host "ALLOWED_ORIGINS=https://SENIN-DOMAIN.com,https://PROJE.vercel.app"
Write-Host ""
Write-Host "--- Vercel Project → Settings → Environment Variables ---"
Write-Host "VITE_API_BASE_URL=https://me-vkjy.onrender.com"
Write-Host "VITE_BASE_PATH=/"
Write-Host ""
Write-Host "1) Vercel: Import omerabali/Me → Framework Vite → Deploy"
Write-Host "2) Vercel: Domains → domain ekle / satın al"
Write-Host "3) Render: ALLOWED_ORIGINS'e Vercel + custom domain ekle → Redeploy API"
Write-Host "4) Smoke: domain/projects + domain/admin"

function Get-DotEnvValue([string]$Key) {
  if (-not (Test-Path $EnvFile)) { return $null }
  $line = Get-Content $EnvFile | Where-Object { $_ -match "^$Key=" } | Select-Object -First 1
  if (-not $line) { return $null }
  return $line.Substring($Key.Length + 1).Trim().Trim('"').Trim("'")
}

if (Test-Path $EnvFile) {
  Write-Host ""
  Write-Host "--- backend/.env (maskeli) ---"
  foreach ($name in @("DATABASE_URL", "ADMIN_PASSWORD_SALT", "ADMIN_PASSWORD_SHA256", "ADMIN_JWT_SECRET")) {
    $v = Get-DotEnvValue $name
    if ($v) { Write-Host "$name=***" } else { Write-Host "$name=EKSIK" }
  }
}
