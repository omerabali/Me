# Render checklist — API + static frontend (free)
# https://dashboard.render.com → New → Blueprint → omerabali/Me (render.yaml)
#
# Servisler:
#   portfolio-api  → Docker (backend/)
#   portfolio-web  → Static (Vite dist)

$ErrorActionPreference = "Stop"
$BackendRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$EnvFile = Join-Path $BackendRoot ".env"

Write-Host "=== Render deploy (portfolio API + web) ==="
Write-Host ""
Write-Host "1) https://dashboard.render.com → New → Blueprint"
Write-Host "2) Repo: omerabali/Me  (render.yaml otomatik okunur)"
Write-Host "3) Apply → iki servis oluşur: portfolio-api, portfolio-web"
Write-Host "4) portfolio-api → Environment → secret'ları doldur (asagida)"
Write-Host "5) portfolio-api URL'ini not et (https://....onrender.com)"
Write-Host "6) ALLOWED_ORIGINS = https://PORTFOLIO-WEB.onrender.com"
Write-Host "   (istersen ,https://omerabali.github.io ekle)"
Write-Host "7) API Manual Deploy → web build VITE_API_BASE_URL ile yeniden tetiklensin"
Write-Host "8) Smoke: API/api/health  +  Web/projects"
Write-Host ""

function Get-DotEnvValue([string]$Key) {
  if (-not (Test-Path $EnvFile)) { return $null }
  $line = Get-Content $EnvFile | Where-Object { $_ -match "^$Key=" } | Select-Object -First 1
  if (-not $line) { return $null }
  return $line.Substring($Key.Length + 1).Trim().Trim('"').Trim("'")
}

Write-Host "--- portfolio-api Environment (Dashboard) ---"
@(
  "ENVIRONMENT=production",
  "DEBUG=False",
  "PORT=8080",
  "ALLOWED_ORIGINS=https://<portfolio-web>.onrender.com",
  "DATABASE_URL=<Neon>",
  "ADMIN_PASSWORD_SALT=...",
  "ADMIN_PASSWORD_SHA256=...",
  "ADMIN_JWT_SECRET=... (min 32)",
  "GITHUB_OWNER=omerabali",
  "GITHUB_AUTO_SYNC=false"
) | ForEach-Object { Write-Host $_ }

if (Test-Path $EnvFile) {
  Write-Host ""
  Write-Host "--- backend/.env durumu (maskeli) ---"
  foreach ($name in @("DATABASE_URL", "ADMIN_PASSWORD_SALT", "ADMIN_PASSWORD_SHA256", "ADMIN_JWT_SECRET", "GITHUB_TOKEN")) {
    $v = Get-DotEnvValue $name
    if ($v) { Write-Host "$name=*** (dolu — Render'a yapıştır)" }
    else { Write-Host "$name=EKSIK — .\backend\scripts\gen-admin-secrets.ps1" }
  }
}

Write-Host ""
Write-Host "Not: Free web service ~15 dk idle uyur; ilk istekte cold start normal."
Write-Host "Render kotası hesabındaki diger free servislerle paylaşılır."
