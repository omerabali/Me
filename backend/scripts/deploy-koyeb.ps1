# Koyeb checklist (Free Instance — istekte uyanır, ~1 saat idle sonrası uyku)
# Önkoşul: https://www.koyeb.com hesabı (GitHub ile giriş)
#
# Dashboard (önerilen):
#   1) Create Web Service → GitHub → omerabali/Me → branch main
#   2) Builder: Dockerfile | Work directory: backend | Dockerfile: Dockerfile
#   3) Port: 8080 | Route: / → 8080 | Instance: Free
#   4) Environment variables (aşağıdaki şablon)
#   5) Deploy → public URL (*.koyeb.app)
#   6) GitHub Actions secret VITE_API_BASE_URL = o URL
#   7) Pages workflow re-run

$ErrorActionPreference = "Stop"
$BackendRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$EnvFile = Join-Path $BackendRoot ".env"

Write-Host "=== Koyeb deploy (portfolio API) ==="
Write-Host "Backend klasörü: $BackendRoot"
Write-Host ""
Write-Host "Dashboard adımları:"
Write-Host "1) https://app.koyeb.com  → Create Web Service → GitHub repo omerabali/Me"
Write-Host "2) Work directory = backend | Builder = Dockerfile | Port = 8080"
Write-Host "3) Instance type = Free"
Write-Host "4) Variables → aşağıdaki key'leri ekle"
Write-Host "5) Deploy → URL'i kopyala (https://....koyeb.app)"
Write-Host "6) GitHub → Settings → Secrets → Actions → VITE_API_BASE_URL"
Write-Host "7) Actions → Deploy to GitHub Pages → Run workflow"
Write-Host ""

function Get-DotEnvValue([string]$Key) {
  if (-not (Test-Path $EnvFile)) { return $null }
  $line = Get-Content $EnvFile | Where-Object { $_ -match "^$Key=" } | Select-Object -First 1
  if (-not $line) { return $null }
  return $line.Substring($Key.Length + 1).Trim().Trim('"').Trim("'")
}

Write-Host "--- Koyeb Environment Variables şablonu ---"
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
      Write-Host "$name=*** (dolu — Koyeb paneline yapıştır)"
    } else {
      Write-Host "$name=EKSIK — .\backend\scripts\gen-admin-secrets.ps1 -Password `"SIFREN`""
    }
  }
} else {
  Write-Host ""
  Write-Host "Uyarı: backend/.env yok. Önce gen-admin-secrets.ps1 + DATABASE_URL doldur."
}

Write-Host ""
Write-Host "Smoke test:  https://SENIN-APP.koyeb.app/api/health"
Write-Host "Not: Free tier ~1 saat trafiksiz kalınca uyur; ilk istekte cold start normal."
