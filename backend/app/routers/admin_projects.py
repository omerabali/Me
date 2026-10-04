import logging
import re
from datetime import datetime, timezone
from typing import List, Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import require_admin, require_admin_csrf
from app.models.db_models import ProjectDB
from app.models.schemas import (
    ProjectAdmin,
    ProjectCreate,
    ProjectUpdate,
    ReorderRequest,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin/projects", tags=["admin-projects"])


def normalize_markdown(content: Optional[str]) -> Optional[str]:
    """README metnini yalnızca BOM ve satır sonu standardizasyonu için temizler."""
    if content is None:
        return None
    # 1. Başlangıçtaki UTF-8 BOM işaretini kaldır
    text = content.replace("\ufeff", "")
    # 2. Windows CRLF satır sonlarını Linux LF formatına dönüştür
    text = text.replace("\r\n", "\n")
    return text


def slugify(text: str) -> str:
    """Türkçe karakter destekli temiz slug üretir."""
    tr_map = str.maketrans("çğıöşüÇĞİÖŞÜ", "cgiosuCGIOSU")
    cleaned = text.translate(tr_map).lower()
    cleaned = re.sub(r"[^a-z0-9\-]+", "-", cleaned)
    cleaned = re.sub(r"-+", "-", cleaned).strip("-")
    return cleaned or "proje"


@router.get("", response_model=List[ProjectAdmin])
async def list_admin_projects(
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(require_admin),
):
    """Admin paneli için taslaklar dahil tüm projeleri getirir."""
    stmt = select(ProjectDB).order_by(ProjectDB.sort_order.asc(), ProjectDB.id.desc())
    result = await db.execute(stmt)
    projects = result.scalars().all()

    admin_projects = []
    for p in projects:
        has_readme = bool(p.readme_markdown and p.readme_markdown.strip())
        admin_projects.append(
            ProjectAdmin(
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
                sort_order=p.sort_order,
                is_published=p.is_published,
                has_readme=has_readme,
                readme_markdown=p.readme_markdown,
                readme_updated_at=p.readme_updated_at,
                created_at=p.created_at,
                updated_at=p.updated_at,
            )
        )
    return admin_projects


@router.post("", response_model=ProjectAdmin, status_code=status.HTTP_201_CREATED)
async def create_project(
    data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(require_admin_csrf),
):
    """Yeni proje oluşturur."""
    slug = slugify(data.slug or data.title_tr)
    
    # Slug benzersizliği kontrolü
    existing = await db.execute(select(ProjectDB).where(ProjectDB.slug == slug))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{slug}' slug'ı zaten kullanılıyor. Lütfen farklı bir slug belirleyin.",
        )

    clean_readme = normalize_markdown(data.readme_markdown)
    now = datetime.now(timezone.utc)
    readme_updated = now if clean_readme else None

    # Eğer sort_order verilmediyse en sona ekle
    max_order_result = await db.execute(select(ProjectDB.sort_order).order_by(ProjectDB.sort_order.desc()).limit(1))
    current_max = max_order_result.scalar() or 0
    sort_order = data.sort_order if data.sort_order > 0 else current_max + 1

    project = ProjectDB(
        slug=slug,
        repo_name=data.repo_name.strip(),
        title_tr=data.title_tr.strip(),
        title_en=data.title_en.strip() if data.title_en else None,
        description_tr=data.description_tr.strip() if data.description_tr else None,
        description_en=data.description_en.strip() if data.description_en else None,
        category=data.category or "software-algo",
        tags=data.tags or [],
        github_url=data.github_url.strip(),
        demo_url=data.demo_url.strip() if data.demo_url else None,
        cover_image_url=data.cover_image_url.strip() if data.cover_image_url else None,
        stars=data.stars,
        forks=data.forks,
        sort_order=sort_order,
        is_published=data.is_published,
        readme_markdown=clean_readme,
        readme_updated_at=readme_updated,
        created_at=now,
        updated_at=now,
    )

    db.add(project)
    await db.commit()
    await db.refresh(project)
    logger.info(f"Admin created project: {project.slug} (ID: {project.id})")

    return ProjectAdmin(
        id=project.id,
        slug=project.slug,
        repo_name=project.repo_name,
        title_tr=project.title_tr,
        title_en=project.title_en,
        description_tr=project.description_tr,
        description_en=project.description_en,
        category=project.category,
        tags=project.tags or [],
        github_url=project.github_url,
        demo_url=project.demo_url,
        cover_image_url=project.cover_image_url,
        stars=project.stars,
        forks=project.forks,
        sort_order=project.sort_order,
        is_published=project.is_published,
        has_readme=bool(project.readme_markdown),
        readme_markdown=project.readme_markdown,
        readme_updated_at=project.readme_updated_at,
        created_at=project.created_at,
        updated_at=project.updated_at,
    )


@router.put("/reorder", status_code=status.HTTP_200_OK)
async def reorder_projects(
    req: ReorderRequest,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(require_admin_csrf),
):
    """Projelerin sıralamasını günceller."""
    for item in req.items:
        await db.execute(
            update(ProjectDB)
            .where(ProjectDB.id == item.id)
            .values(sort_order=item.sort_order, updated_at=datetime.now(timezone.utc))
        )
    await db.commit()
    return {"message": "Sıralama başarıyla kaydedildi."}


@router.put("/{project_id}", response_model=ProjectAdmin)
async def update_project(
    project_id: int,
    data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(require_admin_csrf),
):
    """Mevcut projeyi günceller."""
    result = await db.execute(select(ProjectDB).where(ProjectDB.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID {project_id} olan proje bulunamadı.",
        )

    # Slug değiştiyse benzersizliği doğrula
    if data.slug and data.slug != project.slug:
        clean_slug = slugify(data.slug)
        existing = await db.execute(
            select(ProjectDB).where(ProjectDB.slug == clean_slug, ProjectDB.id != project_id)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"'{clean_slug}' slug'ı başka bir projede kullanılıyor.",
            )
        project.slug = clean_slug

    if data.repo_name is not None:
        project.repo_name = data.repo_name.strip()
    if data.title_tr is not None:
        project.title_tr = data.title_tr.strip()
    if data.title_en is not None:
        project.title_en = data.title_en.strip() or None
    if data.description_tr is not None:
        project.description_tr = data.description_tr.strip() or None
    if data.description_en is not None:
        project.description_en = data.description_en.strip() or None
    if data.category is not None:
        project.category = data.category
    if data.tags is not None:
        project.tags = data.tags
    if data.github_url is not None:
        project.github_url = data.github_url.strip()
    if data.demo_url is not None:
        project.demo_url = data.demo_url.strip() or None
    if data.cover_image_url is not None:
        project.cover_image_url = data.cover_image_url.strip() or None
    if data.stars is not None:
        project.stars = data.stars
    if data.forks is not None:
        project.forks = data.forks
    if data.sort_order is not None:
        project.sort_order = data.sort_order
    if data.is_published is not None:
        project.is_published = data.is_published

    now = datetime.now(timezone.utc)
    # README güncellendiyse
    if data.readme_markdown is not None:
        clean_readme = normalize_markdown(data.readme_markdown)
        if clean_readme != project.readme_markdown:
            project.readme_markdown = clean_readme
            project.readme_updated_at = now

    project.updated_at = now

    await db.commit()
    await db.refresh(project)
    logger.info(f"Admin updated project: {project.slug} (ID: {project.id})")

    return ProjectAdmin(
        id=project.id,
        slug=project.slug,
        repo_name=project.repo_name,
        title_tr=project.title_tr,
        title_en=project.title_en,
        description_tr=project.description_tr,
        description_en=project.description_en,
        category=project.category,
        tags=project.tags or [],
        github_url=project.github_url,
        demo_url=project.demo_url,
        cover_image_url=project.cover_image_url,
        stars=project.stars,
        forks=project.forks,
        sort_order=project.sort_order,
        is_published=project.is_published,
        has_readme=bool(project.readme_markdown),
        readme_markdown=project.readme_markdown,
        readme_updated_at=project.readme_updated_at,
        created_at=project.created_at,
        updated_at=project.updated_at,
    )


@router.delete("/{project_id}", status_code=status.HTTP_200_OK)
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(require_admin_csrf),
):
    """Projeyi veritabanından kalıcı olarak siler."""
    result = await db.execute(select(ProjectDB).where(ProjectDB.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ID {project_id} olan proje bulunamadı.",
        )

    await db.delete(project)
    await db.commit()
    logger.info(f"Admin deleted project ID: {project_id}")
    return {"message": "Proje başarıyla silindi.", "id": project_id}


@router.post("/import-github-meta/{repo_name}")
async def import_github_meta(
    repo_name: str,
    _admin: dict = Depends(require_admin_csrf),
):
    """
    GitHub'dan yalnızca form alanlarını (açıklama, topics, diller, yıldız)
    tek seferlik doldurmak için yardımcı endpoint. README çekmez.
    """
    from app.core.config import settings
    owner = getattr(settings, "GITHUB_OWNER", "omerabali")
    url = f"https://api.github.com/repos/{owner}/{repo_name.strip()}"
    headers = {"User-Agent": "portfolio-admin"}
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(url, headers=headers)
            if res.status_code == 404:
                raise HTTPException(status_code=404, detail="GitHub deposu bulunamadı.")
            if res.status_code != 200:
                raise HTTPException(
                    status_code=res.status_code,
                    detail=f"GitHub API hatası: {res.status_code}",
                )
            data = res.json()

            # Dilleri çek
            langs_res = await client.get(f"{url}/languages", headers=headers)
            languages = list(langs_res.json().keys()) if langs_res.status_code == 200 else []

            return {
                "repo_name": data.get("name", repo_name),
                "title": data.get("name", repo_name),
                "description": data.get("description", ""),
                "github_url": data.get("html_url", f"https://github.com/{owner}/{repo_name}"),
                "demo_url": data.get("homepage", None),
                "stars": data.get("stargazers_count", 0),
                "forks": data.get("forks_count", 0),
                "tags": languages or (data.get("topics") or []),
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Meta verisi alınamadı: {str(e)}")
