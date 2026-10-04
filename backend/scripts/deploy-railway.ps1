# Railway checklist + optional CLI deploy
# Önkoşul: https://railway.app hesabı (GitHub ile giriş kolay)
#
# A) Dashboard (önerilen, CLI şart değil):
#   1) New Project → Deploy from GitHub repo (omerabali/Me)
#   2) Settings → Root Directory: backend
#   3) Variables'a production env'leri ekle (aşağıdaki liste)
#   4) Deploy → public URL'i kopyala
#
# B) CLI:
#   npm i -g @railway/cli
#   railway login
#   cd backend
#   railway init / railway link
#   railway up

param(
  [switch]$PrintEnvTemplate
)

$ErrorActionPreference = "Stop"
$BackendRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$EnvFile = Join-Path $BackendRoot ".env"

Write-Host "=== Railway deploy (portfolio API) ==="
Write-Host "Backend klasörü: $BackendRoot"
Write-Host ""
Write-Host "Dashboard adımları:"
Write-Host "1) https://railway.app/new  → GitHub repo: omerabali/Me"
Write-Host "2) Service → Settings → Root Directory = backend"
Write-Host "3) Variables → aşağıdaki key'leri ekle"
Write-Host "4) Settings → Networking → Generate Domain"
Write-Host "5) URL'i GitHub Actions secret VITE_API_BASE_URL yap"
Write-Host "6) Pages workflow'u yeniden çalıştır"
Write-Host ""

function Get-DotEnvValue([string]$Key) {
  if (-not (Test-Path $EnvFile)) { return $null }
  $line = Get-Content $EnvFile | Where-Object { $_ -match "^$Key=" } | Select-Object -First 1
  if (-not $line) { return $null }
  return $line.Substring($Key.Length + 1).Trim().Trim('"').Trim("'")
}

$keys = @(
  "ENVIRONMENT=production",
  "DEBUG=False",
  "ALLOWED_ORIGINS=https://omerabali.github.io",
  "GITHUB_OWNER=omerabali",
  "GITHUB_AUTO_SYNC=false",
  "DATABASE_URL=<backend/.env'deki Neon URL>",
  "ADMIN_PASSWORD_SALT=<backend/.env>",
  "ADMIN_PASSWORD_SHA256=<backend/.env>",
  "ADMIN_JWT_SECRET=<backend/.env min 32>",
  "GITHUB_TOKEN=<opsiyonel>"
)

Write-Host "--- Railway Variables şablonu ---"
foreach ($k in $keys) { Write-Host $k }

if (Test-Path $EnvFile) {
  Write-Host ""
  Write-Host "--- backend/.env'den kopyalanabilir değerler (ekrana; commit etme) ---"
  foreach ($name in @("DATABASE_URL", "ADMIN_PASSWORD_SALT", "ADMIN_PASSWORD_SHA256", "ADMIN_JWT_SECRET", "GITHUB_TOKEN")) {
    $v = Get-DotEnvValue $name
    if ($v) {
      if ($name -eq "DATABASE_URL" -or $name -eq "ADMIN_JWT_SECRET") {
        Write-Host "$name=*** (dolu, Railway'e yapıştır — bu script tam değeri yazmaz)"
      } else {
        Write-Host "$name=$v"
      }
    } else {
      Write-Host "$name=EKSIK — .\backend\scripts\gen-admin-secrets.ps1 ile üret"
    }
  }
} else {
  Write-Host ""
  Write-Host "Uyarı: backend/.env yok. Önce gen-admin-secrets.ps1 + DATABASE_URL doldur."
}

if (Get-Command railway -ErrorAction SilentlyContinue) {
  Write-Host ""
  Write-Host "railway CLI bulundu. Link + up için:"
  Write-Host "  cd `"$BackendRoot`""
  Write-Host "  railway link"
  Write-Host "  railway up"
} else {
  Write-Host ""
  Write-Host "CLI yok — dashboard yeterli. İstersen: npm i -g @railway/cli"
}

if ($PrintEnvTemplate) { exit 0 }
