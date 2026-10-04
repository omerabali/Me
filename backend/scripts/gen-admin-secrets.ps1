# Güçlü admin salt + SHA-256 + JWT secret üretir (ekrana basar; dosyaya yazmaz)
param(
  [Parameter(Mandatory = $true)][string]$Password
)

$ErrorActionPreference = "Stop"
$py = @"
import hashlib, secrets
p = '''$Password'''
s = secrets.token_urlsafe(24)
jwt = secrets.token_urlsafe(48)
print('ADMIN_PASSWORD_SALT=' + s)
print('ADMIN_PASSWORD_SHA256=' + hashlib.sha256((s + p).encode()).hexdigest())
print('ADMIN_JWT_SECRET=' + jwt)
"@
python -c $py
Write-Host ""
Write-Host "Bu üç satırı backend/.env ve Cloud Run env'ine koy. Şifreyi commit etme."
