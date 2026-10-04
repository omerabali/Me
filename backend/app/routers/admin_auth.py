import logging

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from app.core.security import (
    COOKIE_NAME,
    CSRF_COOKIE_NAME,
    check_rate_limit,
    clear_attempts,
    cookie_common_kwargs,
    cookie_samesite_policy,
    cookie_secure_flag,
    create_csrf_token,
    create_session_token,
    record_failed_attempt,
    require_admin,
    require_admin_csrf,
    verify_password,
)
from app.models.schemas import AdminAuthResponse, AdminLoginRequest

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin/auth", tags=["admin-auth"])


def _set_auth_cookies(response: Response, request: Request, jwt_token: str, csrf: str) -> None:
    common = cookie_common_kwargs(request)
    response.set_cookie(
        key=COOKIE_NAME,
        value=jwt_token,
        httponly=True,
        **common,
    )
    response.set_cookie(
        key=CSRF_COOKIE_NAME,
        value=csrf,
        httponly=False,
        **common,
    )


def _clear_auth_cookies(response: Response, request: Request) -> None:
    # Tarayıcıların silmesi için set ile aynı samesite/secure gerekli
    common = {
        "path": "/",
        "samesite": cookie_samesite_policy(),
        "secure": cookie_secure_flag(request),
    }
    response.delete_cookie(key=COOKIE_NAME, **common)
    response.delete_cookie(key=CSRF_COOKIE_NAME, **common)


@router.post("/login", response_model=AdminAuthResponse)
async def login(req: AdminLoginRequest, request: Request, response: Response):
    client_ip = request.client.host if request.client else "unknown"
    check_rate_limit(client_ip)

    if not verify_password(req.password):
        record_failed_attempt(client_ip)
        logger.warning("Failed admin login attempt from %s", client_ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz şifre.",
        )

    clear_attempts(client_ip)
    token = create_session_token("admin")
    csrf = create_csrf_token()
    _set_auth_cookies(response, request, token, csrf)

    # İstemciye JWT gövdesini döndürme — yalnızca httpOnly cookie
    logger.info("Admin logged in successfully from %s", client_ip)
    return AdminAuthResponse(
        authenticated=True,
        username="admin",
        message="Giriş başarılı.",
    )


@router.post("/logout", response_model=AdminAuthResponse)
async def logout(
    request: Request,
    response: Response,
    _admin: dict = Depends(require_admin_csrf),
):
    _clear_auth_cookies(response, request)
    return AdminAuthResponse(authenticated=False, username="", message="Çıkış yapıldı.")


@router.get("/me", response_model=AdminAuthResponse)
async def me(admin: dict = Depends(require_admin)):
    return AdminAuthResponse(
        authenticated=True,
        username=admin.get("sub", "admin"),
        message="Oturum geçerli.",
    )
