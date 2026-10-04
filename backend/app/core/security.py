"""
Admin kimlik doğrulama — maksimum güvenlik:

- Tek kullanıcı, yalnızca şifre (kullanıcı adı yok)
- Şifre: salt + SHA-256 (env'de hash saklanır; düz metin asla)
- Oturum: JWT (HS256), httpOnly + Secure + SameSite cookie
- CSRF double-submit, login rate limit (5/dk)
"""

from __future__ import annotations

import hashlib
import hmac
import secrets
import time
from typing import Dict, Optional

import jwt
from fastapi import Depends, HTTPException, Request, status

from app.core.config import settings

# Yalnızca local development fallback (üretimde assert_secure_runtime engeller).
DEFAULT_PASSWORD_SALT = "portfolio-dev-salt"
DEFAULT_PASSWORD_SHA256 = "5c60dc7543ee83099f21183016f20f42e78e9acf2a35c09292ef7450e4940d71"

COOKIE_NAME = "admin_session"
CSRF_COOKIE_NAME = "admin_csrf"
CSRF_HEADER_NAME = "X-CSRF-Token"

JWT_ALGORITHM = "HS256"
JWT_ISSUER = "portfolio-admin"
# Üretimde kısa ömür tercih edilir; yenileme login ile yapılır
JWT_EXPIRE_SECONDS = 60 * 60 * 12  # 12 saat

# Bilinen zayıf / örnek değerler — üretimde yasak
_INSECURE_JWT_SECRETS = frozenset(
    {
        "",
        "super-secret-portfolio-session-key-2026",
        "uzun-rastgele-jwt-gizli-anahtar-en-az-32",
        "change-me",
        "secret",
    }
)
_INSECURE_SALTS = frozenset(
    {
        "",
        DEFAULT_PASSWORD_SALT,
        "degistir-bu-salt-degerini",
        "change-me",
    }
)

LOGIN_ATTEMPTS: Dict[str, list] = {}
RATE_LIMIT_WINDOW = 60
MAX_ATTEMPTS = 5


def _is_production() -> bool:
    return str(getattr(settings, "ENVIRONMENT", "")).lower() == "production"


def _jwt_secret() -> str:
    secret = (
        getattr(settings, "ADMIN_JWT_SECRET", None)
        or getattr(settings, "ADMIN_SESSION_SECRET", None)
        or ""
    )
    secret = (secret or "").strip()
    if _is_production():
        if len(secret) < 32 or secret in _INSECURE_JWT_SECRETS:
            raise RuntimeError(
                "Üretimde güçlü ADMIN_JWT_SECRET zorunlu (min 32 karakter, örnek değer yasak)."
            )
        return secret
    # Dev: bilinçli zayıf fallback (yalnızca local)
    return secret or "super-secret-portfolio-session-key-2026"


def assert_secure_runtime() -> None:
    """
    Canlı ortamda zayıf / eksik sırlarla ayağa kalkmayı engeller.
    Development'ta yalnızca uyarı loglanır (çağıran taraf).
    """
    if not _is_production():
        return

    errors: list[str] = []

    if getattr(settings, "DEBUG", False):
        errors.append("DEBUG=True üretimde kapalı olmalı")

    sha = (getattr(settings, "ADMIN_PASSWORD_SHA256", None) or "").strip()
    salt = (getattr(settings, "ADMIN_PASSWORD_SALT", None) or "").strip()
    if not sha:
        errors.append("ADMIN_PASSWORD_SHA256 zorunlu (düz metin şifre asla env'e yazma)")
    if not salt or salt in _INSECURE_SALTS:
        errors.append("ADMIN_PASSWORD_SALT zorunlu ve örnek/dev değer olmamalı")

    jwt_secret = (getattr(settings, "ADMIN_JWT_SECRET", None) or "").strip()
    if len(jwt_secret) < 32 or jwt_secret in _INSECURE_JWT_SECRETS:
        errors.append("ADMIN_JWT_SECRET zorunlu (min 32 karakter, rastgele)")

    db = (
        getattr(settings, "DATABASE_URL", None)
        or getattr(settings, "NEON_DATABASE_URL", None)
        or ""
    ).strip()
    if not db or "user:pass@" in db or "ep-xxxx" in db:
        errors.append("Gerçek DATABASE_URL zorunlu")

    if getattr(settings, "ADMIN_PASSWORD", None):
        errors.append("ADMIN_PASSWORD (düz metin) üretimde yasak; yalnızca SHA-256 hash kullan")

    if errors:
        raise RuntimeError(
            "Üretim güvenlik kontrolü başarısız:\n- " + "\n- ".join(errors)
        )


def _password_salt() -> str:
    return getattr(settings, "ADMIN_PASSWORD_SALT", None) or DEFAULT_PASSWORD_SALT


def hash_password_sha256(plain_password: str, salt: Optional[str] = None) -> str:
    """SHA-256(salt + password) hex digest — env'e yazılacak değer."""
    s = salt if salt is not None else _password_salt()
    return hashlib.sha256(f"{s}{plain_password}".encode("utf-8")).hexdigest()


def check_rate_limit(ip: str) -> None:
    now = time.time()
    attempts = [t for t in LOGIN_ATTEMPTS.get(ip, []) if now - t < RATE_LIMIT_WINDOW]
    LOGIN_ATTEMPTS[ip] = attempts
    if len(attempts) >= MAX_ATTEMPTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Çok fazla başarısız giriş denemesi. Lütfen 1 dakika sonra tekrar deneyin.",
        )


def record_failed_attempt(ip: str) -> None:
    LOGIN_ATTEMPTS.setdefault(ip, []).append(time.time())


def clear_attempts(ip: str) -> None:
    LOGIN_ATTEMPTS.pop(ip, None)


def verify_password(plain_password: str) -> bool:
    """
    Öncelik: ADMIN_PASSWORD_SHA256 (+ salt).
    Geriye dönük: bcrypt ADMIN_PASSWORD_HASH (eski kurulumlar).
    Üretimde düz metin ADMIN_PASSWORD kabul edilmez.
    """
    if not plain_password:
        return False

    stored_sha = getattr(settings, "ADMIN_PASSWORD_SHA256", None)
    if stored_sha:
        candidate = hash_password_sha256(plain_password)
        return hmac.compare_digest(candidate, stored_sha.strip().lower())

    # Dev varsayılan SHA-256 (ADMIN_PASSWORD_SHA256 boşsa)
    if settings.ENVIRONMENT != "production":
        candidate = hash_password_sha256(plain_password, DEFAULT_PASSWORD_SALT)
        if hmac.compare_digest(candidate, DEFAULT_PASSWORD_SHA256):
            return True

    # Eski bcrypt hash desteği
    bcrypt_hash = getattr(settings, "ADMIN_PASSWORD_HASH", None)
    if bcrypt_hash:
        try:
            import bcrypt

            return bcrypt.checkpw(
                plain_password.encode("utf-8"),
                bcrypt_hash.encode("utf-8"),
            )
        except Exception:
            pass

    # Düz metin yalnızca development
    raw_pw = getattr(settings, "ADMIN_PASSWORD", None)
    if raw_pw and settings.ENVIRONMENT != "production":
        return hmac.compare_digest(plain_password, raw_pw)

    return False


def create_csrf_token() -> str:
    return secrets.token_urlsafe(32)


def verify_csrf(request: Request) -> None:
    if request.method in ("GET", "HEAD", "OPTIONS"):
        return
    cookie_token = request.cookies.get(CSRF_COOKIE_NAME)
    header_token = request.headers.get(CSRF_HEADER_NAME)
    if (
        not cookie_token
        or not header_token
        or not hmac.compare_digest(cookie_token, header_token)
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CSRF doğrulaması başarısız.",
        )


def create_session_token(username: str = "admin") -> str:
    """JWT (HS256) oturum token'ı üretir."""
    now = int(time.time())
    payload = {
        "sub": username,
        "role": "admin",
        "iat": now,
        "nbf": now,
        "exp": now + JWT_EXPIRE_SECONDS,
        "iss": JWT_ISSUER,
        "jti": secrets.token_urlsafe(16),
    }
    return jwt.encode(payload, _jwt_secret(), algorithm=JWT_ALGORITHM)


def verify_session_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(
            token,
            _jwt_secret(),
            algorithms=[JWT_ALGORITHM],
            issuer=JWT_ISSUER,
            options={"require": ["exp", "iat", "sub"]},
        )
        if payload.get("role") != "admin":
            return None
        return payload
    except jwt.PyJWTError:
        return None


async def require_admin(request: Request) -> dict:
    token = request.cookies.get(COOKIE_NAME)

    auth_header = request.headers.get("Authorization")
    if not token and auth_header and auth_header.startswith("Bearer "):
        token = auth_header[7:].strip()

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bu işlem için admin girişi gereklidir.",
        )

    session = verify_session_token(token)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Oturum süresi dolmuş veya geçersiz.",
        )

    return session


async def require_admin_csrf(
    request: Request, admin: dict = Depends(require_admin)
) -> dict:
    verify_csrf(request)
    return admin


def cookie_secure_flag(request: Request) -> bool:
    if settings.ENVIRONMENT == "production":
        return True
    return request.url.scheme == "https"
