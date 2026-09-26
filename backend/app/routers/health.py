from fastapi import APIRouter
from app.core.config import settings
from app.models.schemas import HealthResponse

router = APIRouter(prefix="/api", tags=["health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Service Health and Configuration check",
)
async def health_check():
    return HealthResponse(
        status="healthy",
        app_name=settings.APP_NAME,
        environment=settings.ENVIRONMENT,
        github_configured=bool(settings.GITHUB_USERNAME),
        cache_ttl_seconds=settings.CACHE_TTL_SECONDS,
    )
