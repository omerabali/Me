import logging
import time
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import delete, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.db_models import ProjectDB, SiteMetricDB, ContactMessageDB
from app.models.schemas import Project, ProjectDetail
from app.services.github_service import github_service

logger = logging.getLogger(__name__)


def normalize_text(text: Optional[str]) -> Optional[str]:
    if not text:
        return text
    if "\\n" in text:
        text = text.replace("\\n", "\n")
    if "\\r" in text:
        text = text.replace("\\r", "")
    return text


def map_db_to_schema(db_item: ProjectDB) -> Project:
    return Project(
        slug=db_item.slug,
        name=db_item.name,
        display_name=db_item.display_name or db_item.name,
        description=normalize_text(db_item.description),
        readme_h1=db_item.readme_h1,
        readme_summary=normalize_text(db_item.readme_summary),
        readme_detail=normalize_text(db_item.readme_detail),
        readme_raw=normalize_text(db_item.readme_raw),
        readme_html=db_item.readme_html,
        image_url=db_item.image_url,
        category=db_item.category or "Yazılım",
        features=db_item.features or [],
        tech_stack=db_item.tech_stack or [],
        languages=db_item.languages or {},
        github_url=db_item.github_url,
        homepage=db_item.homepage,
        stars=db_item.stars or 0,
        forks=db_item.forks or 0,
        open_issues=db_item.open_issues or 0,
        topics=db_item.topics or [],
        is_showcased=bool(db_item.is_showcased),
        created_at=db_item.created_at,
        updated_at=db_item.updated_at,
        pushed_at=db_item.updated_at,
    )


class ProjectDBService:

    def __init__(self, cache_ttl: int = 1800):
        self.cache_ttl = cache_ttl
        self._projects_cache: Dict[str, Tuple[float, List[Project]]] = {}
        self._stats_cache: Optional[Tuple[float, Dict[str, Any]]] = None

    def invalidate_cache(self):
        """Clears in-memory RAM cache."""
        self._projects_cache.clear()
        self._stats_cache = None

    async def sync_github_to_database(self, db: AsyncSession, force_refresh: bool = False) -> Tuple[int, int]:
        """
        Fetches live repository and README data from GitHub API and upserts into Neon PostgreSQL database.
        """
        logger.info("Initiating GitHub -> Database sync...")
        projects, _ = await github_service.get_all_projects(force_refresh=force_refresh)

        if not projects:
            logger.warning("No projects retrieved from GitHub service to sync.")
            return 0, 0

        synced_count = 0
        now = datetime.now(timezone.utc)

        for p in projects:
            p_readme_raw = normalize_text(p.readme_raw)
            p_readme_detail = normalize_text(p.readme_detail)
            p_readme_summary = normalize_text(p.readme_summary)
            p_desc = normalize_text(p.description)

            # Check existing by slug
            stmt = select(ProjectDB).where(ProjectDB.slug == p.slug)
            result = await db.execute(stmt)
            existing = result.scalar_one_or_none()

            if existing:
                # Update fields
                existing.name = p.name
                existing.display_name = p.display_name
                existing.description = p_desc
                existing.readme_h1 = p.readme_h1
                existing.readme_summary = p_readme_summary
                existing.readme_detail = p_readme_detail
                existing.readme_raw = p_readme_raw
                existing.readme_html = p.readme_html
                existing.image_url = p.image_url
                existing.category = p.category
                existing.tech_stack = p.tech_stack
                existing.languages = p.languages
                existing.features = p.features
                existing.topics = p.topics
                existing.github_url = p.github_url
                existing.homepage = p.homepage
                existing.stars = p.stars
                existing.forks = p.forks
                existing.open_issues = p.open_issues
                existing.is_showcased = p.is_showcased
                existing.synced_at = now
            else:
                # Insert new
                new_project = ProjectDB(
                    slug=p.slug,
                    name=p.name,
                    display_name=p.display_name,
                    description=p_desc,
                    readme_h1=p.readme_h1,
                    readme_summary=p_readme_summary,
                    readme_detail=p_readme_detail,
                    readme_raw=p_readme_raw,
                    readme_html=p_readme_html,
                    image_url=p.image_url,
                    category=p.category,
                    tech_stack=p.tech_stack,
                    languages=p.languages,
                    features=p.features,
                    topics=p.topics,
                    github_url=p.github_url,
                    homepage=p.homepage,
                    stars=p.stars,
                    forks=p.forks,
                    open_issues=p.open_issues,
                    is_showcased=p.is_showcased,
                    created_at=p.created_at,
                    updated_at=p.updated_at,
                    synced_at=now,
                )
                db.add(new_project)
            synced_count += 1

        # Calculate and save aggregate metrics
        total_stars = sum(p.stars for p in projects)
        total_forks = sum(p.forks for p in projects)
        showcased_count = sum(1 for p in projects if p.is_showcased)

        metrics = {
            "total_projects": len(projects),
            "showcased_count": showcased_count,
            "total_stars": total_stars,
            "total_forks": total_forks,
            "last_synced_at": now.isoformat(),
        }

        stmt_metric = select(SiteMetricDB).where(SiteMetricDB.metric_key == "github_overview")
        res_metric = await db.execute(stmt_metric)
        existing_metric = res_metric.scalar_one_or_none()

        if existing_metric:
            existing_metric.metric_value = metrics
            existing_metric.updated_at = now
        else:
            db.add(SiteMetricDB(metric_key="github_overview", metric_value=metrics, updated_at=now))

        await db.commit()
        self.invalidate_cache()
        logger.info(f"Successfully synced {synced_count} projects to Database (Neon PostgreSQL).")
        return synced_count, showcased_count

    async def get_all_projects(
        self,
        db: AsyncSession,
        category: Optional[str] = None,
        search: Optional[str] = None,
        showcased_only: bool = False,
    ) -> List[Project]:
        """Queries projects with sub-millisecond RAM cache layer."""
        cache_key = f"all_projects:{category}:{search}:{showcased_only}"
        now = time.time()

        if cache_key in self._projects_cache:
            cache_time, cached_data = self._projects_cache[cache_key]
            if now - cache_time < self.cache_ttl:
                return cached_data

        query = select(ProjectDB)

        if category and category.lower() != "all" and category.lower() != "tümü":
            query = query.where(ProjectDB.category.ilike(category))

        if search:
            search_pattern = f"%{search.strip()}%"
            query = query.where(
                or_(
                    ProjectDB.name.ilike(search_pattern),
                    ProjectDB.display_name.ilike(search_pattern),
                    ProjectDB.description.ilike(search_pattern),
                    ProjectDB.readme_summary.ilike(search_pattern),
                )
            )

        if showcased_only:
            query = query.where(ProjectDB.is_showcased == True)

        query = query.order_by(ProjectDB.is_showcased.desc(), ProjectDB.stars.desc(), ProjectDB.updated_at.desc())

        result = await db.execute(query)
        db_items = result.scalars().all()

        if not db_items:
            logger.info("Database is empty. Triggering auto-sync from GitHub...")
            await self.sync_github_to_database(db)
            result = await db.execute(query)
            db_items = result.scalars().all()

        mapped = [map_db_to_schema(item) for item in db_items]
        self._projects_cache[cache_key] = (now, mapped)
        return mapped

    async def get_project_by_slug(self, db: AsyncSession, slug: str) -> Optional[ProjectDetail]:
        """Fetches single project with full README from the database."""
        stmt = select(ProjectDB).where(
            or_(ProjectDB.slug == slug.lower(), ProjectDB.name.ilike(slug))
        )
        result = await db.execute(stmt)
        item = result.scalar_one_or_none()

        if not item:
            return None

        base_proj = map_db_to_schema(item)
        return ProjectDetail(
            **base_proj.model_dump(),
            default_branch="main",
            license="MIT",
            archived=False,
        )

    async def get_site_stats(self, db: AsyncSession) -> Dict[str, Any]:
        """Returns accurate live stats from high-speed cache or database."""
        now = time.time()
        if self._stats_cache is not None:
            cache_time, cached_stats = self._stats_cache
            if now - cache_time < self.cache_ttl:
                return cached_stats

        # Check SiteMetricDB first (instant single row lookup)
        stmt_metric = select(SiteMetricDB).where(SiteMetricDB.metric_key == "github_overview")
        res_metric = await db.execute(stmt_metric)
        metric_row = res_metric.scalar_one_or_none()

        if metric_row and isinstance(metric_row.metric_value, dict):
            stats = metric_row.metric_value
        else:
            stmt_total = select(func.count(ProjectDB.id))
            total_projects = (await db.execute(stmt_total)).scalar() or 0

            stmt_showcased = select(func.count(ProjectDB.id)).where(ProjectDB.is_showcased == True)
            total_showcased = (await db.execute(stmt_showcased)).scalar() or 0

            stmt_stars = select(func.sum(ProjectDB.stars))
            total_stars = (await db.execute(stmt_stars)).scalar() or 0

            stmt_forks = select(func.sum(ProjectDB.forks))
            total_forks = (await db.execute(stmt_forks)).scalar() or 0

            stats = {
                "total_projects": total_projects,
                "showcased_count": total_showcased,
                "total_stars": int(total_stars),
                "total_forks": int(total_forks),
                "last_synced_at": datetime.now(timezone.utc).isoformat(),
            }

        self._stats_cache = (now, stats)
        return stats

    async def save_contact_message(self, db: AsyncSession, name: str, email: str, message: str, subject: Optional[str] = None) -> ContactMessageDB:
        """Saves incoming contact messages to the database."""
        msg = ContactMessageDB(name=name, email=email, subject=subject, message=message)
        db.add(msg)
        await db.commit()
        await db.refresh(msg)
        return msg


project_db_service = ProjectDBService()
