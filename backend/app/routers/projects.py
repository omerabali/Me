import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.db_models import ProjectDB
from app.models.schemas import ProjectDetailPublic, ProjectPublic

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("", response_model=List[ProjectPublic])
async def list_published_projects(
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """
    Yayındaki projeleri döndürür.
    README gövdesi içermez (has_readme bayrağı içerir).
    Public önbellekleme header'ı ekler (60 saniye).
    """
    stmt = (
        select(ProjectDB)
        .where(ProjectDB.is_published.is_(True))
        .order_by(ProjectDB.sort_order.asc(), ProjectDB.id.desc())
    )
    result = await db.execute(stmt)
    projects = result.scalars().all()

    response.headers["Cache-Control"] = "public, max-age=60"

    public_list = []
    for p in projects:
        has_readme = bool(p.readme_markdown and p.readme_markdown.strip())
        public_list.append(
            ProjectPublic(
                id=p.id,
                slug=p.slug,
                repo_name=p.repo_name,
                title_tr=p.title_tr,
                title_en=p.title_en,
                description_tr=p.description_tr,
                description_en=p.description_en,
                category=p.category,
                tags=p.tags or [],
                github_url=p.github_url,
                demo_url=p.demo_url,
                cover_image_url=p.cover_image_url,
                stars=p.stars,
                forks=p.forks,
                has_readme=has_readme,
                sort_order=p.sort_order,
                updated_at=p.updated_at,
            )
        )

    return public_list


@router.get("/{slug}", response_model=ProjectDetailPublic)
async def get_project_detail(
    slug: str,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """
    Tek bir projenin tam detayını ve ham README Markdown içeriğini döndürür.
    """
    stmt = (
        select(ProjectDB)
        .where(ProjectDB.slug == slug.lower().strip())
    )
    result = await db.execute(stmt)
    p = result.scalar_one_or_none()

    if not p or not p.is_published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"'{slug}' slug'ına sahip proje bulunamadı.",
        )

    response.headers["Cache-Control"] = "public, max-age=60"
    has_readme = bool(p.readme_markdown and p.readme_markdown.strip())

    return ProjectDetailPublic(
        id=p.id,
        slug=p.slug,
        repo_name=p.repo_name,
        title_tr=p.title_tr,
        title_en=p.title_en,
        description_tr=p.description_tr,
        description_en=p.description_en,
        category=p.category,
        tags=p.tags or [],
        github_url=p.github_url,
        demo_url=p.demo_url,
        cover_image_url=p.cover_image_url,
        stars=p.stars,
        forks=p.forks,
        has_readme=has_readme,
        sort_order=p.sort_order,
        updated_at=p.updated_at,
        readme_markdown=p.readme_markdown,
        readme_updated_at=p.readme_updated_at,
    )
