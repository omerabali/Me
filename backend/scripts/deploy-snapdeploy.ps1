# SnapDeploy checklist (Free — kart yok; ~15 dk idle uyku; ~100 saat/ay)
# Önkoşul: https://snapdeploy.dev (GitHub ile giriş)
#
# Dashboard:
#   1) New Container → GitHub → omerabali/Me → branch main
#   2) Root directory: backend | Dockerfile kullanılır | Port: 8080 | Size: Small
#   3) Environment variables (aşağıdaki şablon)
#   4) Deploy → URL (*.containers.snapdeploy.app veya *.snapdeploy.app)
#   5) Tarayıcıda URL/api/health aç (uyuyan servisi uyandır)
#   6) GitHub Actions secret VITE_API_BASE_URL = o URL
#   7) Pages workflow re-run

$ErrorActionPreference = "Stop"
$BackendRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$EnvFile = Join-Path $BackendRoot ".env"

Write-Host "=== SnapDeploy deploy (portfolio API) ==="
Write-Host "Backend klasörü: $BackendRoot"
Write-Host ""
Write-Host "Dashboard adımları:"
Write-Host "1) https://snapdeploy.dev  → New Container → repo omerabali/Me"
Write-Host "2) Root directory = backend | Port = 8080 | Size = Small (free)"
Write-Host "3) Variables → aşağıdaki key'leri ekle"
Write-Host "4) Deploy → URL'i kopyala"
Write-Host "5) Smoke: URL/api/health (gerekirse bir kez tarayıcıda aç)"
Write-Host "6) GitHub → Settings → Secrets → Actions → VITE_API_BASE_URL"
Write-Host "7) Actions → Deploy to GitHub Pages → Run workflow"
Write-Host ""

function Get-DotEnvValue([string]$Key) {
  if (-not (Test-Path $EnvFile)) { return $null }
  $line = Get-Content $EnvFile | Where-Object { $_ -match "^$Key=" } | Select-Object -First 1
  if (-not $line) { return $null }
  return $line.Substring($Key.Length + 1).Trim().Trim('"').Trim("'")
}

Write-Host "--- SnapDeploy Environment Variables şablonu ---"
@(
  "PORT=8080",
  "ENVIRONMENT=production",
  "DEBUG=False",
  "ALLOWED_ORIGINS=https://omerabali.github.io",
  "GITHUB_OWNER=omerabali",
  "GITHUB_AUTO_SYNC=false",
  "DATABASE_URL=<Neon connection string>",
  "ADMIN_PASSWORD_SALT=<backend/.env>",
  "ADMIN_PASSWORD_SHA256=<backend/.env>",
  "ADMIN_JWT_SECRET=<min 32 karakter>",
  "GITHUB_TOKEN=<opsiyonel>"
) | ForEach-Object { Write-Host $_ }

if (Test-Path $EnvFile) {
  Write-Host ""
  Write-Host "--- backend/.env durumu (hassas değerler maskeli) ---"
  foreach ($name in @("DATABASE_URL", "ADMIN_PASSWORD_SALT", "ADMIN_PASSWORD_SHA256", "ADMIN_JWT_SECRET", "GITHUB_TOKEN")) {
    $v = Get-DotEnvValue $name
    if ($v) {
      Write-Host "$name=*** (dolu — SnapDeploy paneline yapıştır)"
    } else {
      Write-Host "$name=EKSIK — .\backend\scripts\gen-admin-secrets.ps1 -Password `"SIFREN`""
    }
  }
} else {
  Write-Host ""
  Write-Host "Uyarı: backend/.env yok. Önce gen-admin-secrets.ps1 + DATABASE_URL doldur."
}

Write-Host ""
Write-Host "Not: Free tier ~15 dk idle uyur; ilk fetch 503 verebilir — API URL'sini tarayıcıda açıp yenile."
Write-Host "Aylık ~100 container-saat; uyuyan süre sayılmaz."
