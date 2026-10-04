import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import init_db
from app.core.security import assert_secure_runtime
from app.routers import admin_auth, admin_projects, contact, health, projects

# Logging configuration
logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# Max request body size: 10 MB (README kopyalama ve büyük metinler için)
MAX_REQUEST_BODY_SIZE = 10 * 1024 * 1024


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} in {settings.ENVIRONMENT} mode...")
    assert_secure_runtime()
    # Initialize Database Tables (Neon PostgreSQL / Async DB)
    await init_db()
    yield
    logger.info("Shutting down API...")


_is_prod = str(settings.ENVIRONMENT).lower() == "production"

app = FastAPI(
    title=settings.APP_NAME,
    description="FastAPI Backend for Portfolio with Neon Serverless PostgreSQL & Database-backed Projects",
    version="3.0.0",
    lifespan=lifespan,
    # Canlıda OpenAPI yüzeyi kapalı (admin/schema sızıntısını azaltır)
    docs_url=None if _is_prod else "/docs",
    redoc_url=None if _is_prod else "/redoc",
    openapi_url=None if _is_prod else "/openapi.json",
)

# CORS Middleware (credentials=True for httpOnly cookie auth)
origins = settings.ALLOWED_ORIGINS if isinstance(settings.ALLOWED_ORIGINS, list) else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Body Size Limit Middleware
@app.middleware("http")
async def body_size_limit_middleware(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length:
        try:
            if int(content_length) > MAX_REQUEST_BODY_SIZE:
                return JSONResponse(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    content={"detail": "İstek boyutu 10 MB sınırını aşıyor."},
                )
        except ValueError:
            pass
    return await call_next(request)


# Admin / güvenlik başlıkları
@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    if request.url.path.startswith("/api/admin"):
        response.headers["Cache-Control"] = "no-store"
    return response


# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error processing {request.method} {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Sunucu hatası oluştu. Lütfen logları inceleyin."},
    )


# Mount Routers
app.include_router(health.router)
app.include_router(projects.router)
app.include_router(admin_auth.router)
app.include_router(admin_projects.router)
app.include_router(contact.router)


@app.get("/", tags=["root"])
async def root():
    payload = {
        "message": f"Welcome to {settings.APP_NAME}",
        "health": "/api/health",
        "projects": "/api/projects",
        "contact": "/api/contact",
    }
    if not _is_prod:
        payload.update(
            {
                "database": "Neon Serverless PostgreSQL (Async)",
                "docs": "/docs",
                "admin": "/api/admin/projects",
            }
        )
    return payload


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
