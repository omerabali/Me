from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.schemas import ProjectDetail, ProjectsListResponse
from app.services.project_db_service import project_db_service

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get(
    "",
    response_model=ProjectsListResponse,
    summary="Get all showcased and public projects from Database",
    description="Fetches projects with sub-millisecond in-memory cache layer and HTTP caching.",
)
async def list_projects(
    response: Response,
    category: Optional[str] = Query(default=None, description="Filter by category"),
    search: Optional[str] = Query(default=None, description="Search term"),
    db: AsyncSession = Depends(get_db),
):
    try:
        projects = await project_db_service.get_all_projects(
            db=db,
            category=category,
            search=search,
        )
        showcased_count = sum(1 for p in projects if p.is_showcased)
        
        # HTTP Caching Header: Cache in browser for 15 mins, stale-while-revalidate for 1 day
        response.headers["Cache-Control"] = "public, max-age=900, stale-while-revalidate=86400"
        
        return ProjectsListResponse(
            total=len(projects),
            showcased_count=showcased_count,
            cached=True,
            data=projects,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve projects from database: {str(e)}",
        )


@router.get(
    "/stats",
    summary="Get live database statistics and counters",
    description="Returns accurate repository count, stars, forks with sub-millisecond speed.",
)
async def get_stats(
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    try:
        response.headers["Cache-Control"] = "public, max-age=900, stale-while-revalidate=86400"
        return await project_db_service.get_site_stats(db=db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve stats: {str(e)}",
        )


@router.post(
    "/sync",
    summary="Trigger live GitHub -> Neon Database synchronization",
    description="Fetches fresh repository data and live READMEs from GitHub API and writes them into Neon PostgreSQL.",
)
async def sync_github_projects(
    db: AsyncSession = Depends(get_db),
):
    try:
        synced, showcased = await project_db_service.sync_github_to_database(db=db, force_refresh=True)
        return {
            "success": True,
            "message": f"Successfully synchronized {synced} projects with live GitHub and READMEs into Neon DB.",
            "total_synced": synced,
            "showcased_count": showcased,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Sync failed: {str(e)}",
        )


@router.get(
    "/{slug}",
    response_model=ProjectDetail,
    summary="Get detailed project information by slug from Database",
)
async def get_project_by_slug(
    slug: str,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    response.headers["Cache-Control"] = "public, max-age=1800, stale-while-revalidate=86400"
    detail = await project_db_service.get_project_by_slug(db=db, slug=slug)
    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with slug '{slug}' not found in database.",
        )
    return detail
