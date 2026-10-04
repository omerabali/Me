# Cloud Run'a backend deploy (Windows PowerShell)
# Önkoşul: gcloud CLI kurulu + `gcloud auth login` + billing açık proje
#
# Kullanım (backend klasöründen veya repo kökünden):
#   .\backend\scripts\deploy-cloudrun.ps1 -ProjectId "SENIN_GCP_PROJECT" -Region "europe-west1"
#
# Env değerlerini kendi .env / Secret Manager değerlerinle doldur.

param(
  [Parameter(Mandatory = $true)][string]$ProjectId,
  [string]$Region = "europe-west1",
  [string]$ServiceName = "portfolio-api",
  [string]$AllowUnauthenticated = "true"
)

$ErrorActionPreference = "Stop"
$BackendRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

Write-Host "Project: $ProjectId | Region: $Region | Service: $ServiceName"
Write-Host "Backend: $BackendRoot"

gcloud config set project $ProjectId

# Gerekli API'ler
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --project $ProjectId

# .env'den oku (yoksa uyar)
$EnvFile = Join-Path $BackendRoot ".env"
if (-not (Test-Path $EnvFile)) {
  Write-Error "backend/.env bulunamadı. Production değerlerini oraya koy, sonra tekrar dene."
}

function Get-DotEnvValue([string]$Key) {
  $line = Get-Content $EnvFile | Where-Object { $_ -match "^$Key=" } | Select-Object -First 1
  if (-not $line) { return $null }
  return $line.Substring($Key.Length + 1).Trim().Trim('"').Trim("'")
}

$DatabaseUrl = Get-DotEnvValue "DATABASE_URL"
$Salt = Get-DotEnvValue "ADMIN_PASSWORD_SALT"
$Sha = Get-DotEnvValue "ADMIN_PASSWORD_SHA256"
$Jwt = Get-DotEnvValue "ADMIN_JWT_SECRET"
$GithubToken = Get-DotEnvValue "GITHUB_TOKEN"

if (-not $DatabaseUrl -or -not $Salt -or -not $Sha -or -not $Jwt) {
  Write-Error "DATABASE_URL, ADMIN_PASSWORD_SALT, ADMIN_PASSWORD_SHA256, ADMIN_JWT_SECRET backend/.env içinde dolu olmalı."
}
if ($Jwt.Length -lt 32) {
  Write-Error "ADMIN_JWT_SECRET en az 32 karakter olmalı."
}

# Virgül/özel karakter güvenliği için env-vars-file kullan
$EnvYaml = Join-Path $env:TEMP "portfolio-cloudrun-env.yaml"
$yaml = @"
ENVIRONMENT: "production"
DEBUG: "False"
DATABASE_URL: "$DatabaseUrl"
ADMIN_PASSWORD_SALT: "$Salt"
ADMIN_PASSWORD_SHA256: "$Sha"
ADMIN_JWT_SECRET: "$Jwt"
ALLOWED_ORIGINS: "https://omerabali.github.io"
GITHUB_OWNER: "omerabali"
GITHUB_AUTO_SYNC: "false"
"@
if ($GithubToken) {
  $yaml += "GITHUB_TOKEN: `"$GithubToken`"`n"
}
Set-Content -Path $EnvYaml -Value $yaml -Encoding utf8

$AllowFlag = @()
if ($AllowUnauthenticated -eq "true") {
  $AllowFlag = @("--allow-unauthenticated")
}

Write-Host "Deploying from source (Cloud Build)..."
gcloud run deploy $ServiceName `
  --source $BackendRoot `
  --region $Region `
  --project $ProjectId `
  --memory 512Mi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 2 `
  --timeout 300 `
  --env-vars-file $EnvYaml `
  @AllowFlag

Remove-Item $EnvYaml -ErrorAction SilentlyContinue

$url = gcloud run services describe $ServiceName --region $Region --project $ProjectId --format="value(status.url)"
Write-Host ""
Write-Host "OK — Cloud Run URL:"
Write-Host $url
Write-Host ""
Write-Host "Sonraki adımlar:"
Write-Host "1) Smoke:  $url/api/health"
Write-Host "2) GitHub repo → Settings → Secrets and variables → Actions"
Write-Host "   Name: VITE_API_BASE_URL"
Write-Host "   Value: $url"
Write-Host "3) Actions → Deploy to GitHub Pages → Re-run / workflow_dispatch"
