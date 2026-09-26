import asyncio
import base64
import json
import logging
import os
import re
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import httpx

from app.core.config import settings
from app.models.schemas import Project, ProjectDetail

logger = logging.getLogger(__name__)


class MemoryCache:
    """Simple thread-safe in-memory cache with TTL."""

    def __init__(self, ttl_seconds: int = 1800):
        self.ttl = ttl_seconds
        self._store: Dict[str, Tuple[float, Any]] = {}

    def get(self, key: str) -> Optional[Any]:
        if key in self._store:
            timestamp, data = self._store[key]
            if time.time() - timestamp < self.ttl:
                return data
            # Expired
            del self._store[key]
        return None

    def set(self, key: str, value: Any) -> None:
        self._store[key] = (time.time(), value)

    def clear(self) -> None:
        self._store.clear()


def resolve_relative_markdown_urls(
    md_text: str, owner: str, repo: str, default_branch: str = "main"
) -> str:
    """
    Transforms relative image and link paths in README markdown to full raw GitHub URLs
    so diagrams, screenshots, and assets render crisply on the web portfolio.
    """
    if not md_text:
        return ""

    raw_base = f"https://raw.githubusercontent.com/{owner}/{repo}/{default_branch}"
    blob_base = f"https://github.com/{owner}/{repo}/blob/{default_branch}"

    def fix_img_md(match):
        alt = match.group(1)
        url = match.group(2).strip()
        if url.startswith(("http://", "https://", "data:", "//", "#")):
            return match.group(0)
        clean_url = url.lstrip("./")
        return f"![{alt}]({raw_base}/{clean_url})"

    def fix_img_tag(match):
        prefix = match.group(1)
        src = match.group(2).strip()
        suffix = match.group(3)
        if src.startswith(("http://", "https://", "data:", "//", "#")):
            return match.group(0)
        clean_src = src.lstrip("./")
        return f'{prefix}{raw_base}/{clean_src}"{suffix}'

    def fix_link_md(match):
        text = match.group(1)
        url = match.group(2).strip()
        if url.startswith(("http://", "https://", "mailto:", "#", "tel:")):
            return match.group(0)
        clean_url = url.lstrip("./")
        return f"[{text}]({blob_base}/{clean_url})"

    # 1. Fix Markdown images: ![alt](path)
    result = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", fix_img_md, md_text)

    # 2. Fix HTML img tags: <img ... src="path" ...>
    result = re.sub(
        r'(<img\s+[^>]*?src=["\'])([^"\']+)(["\'][^>]*?>)',
        fix_img_tag,
        result,
        flags=re.IGNORECASE,
    )

    # 3. Fix Markdown relative links: [text](path) (ignoring ![alt])
    result = re.sub(r'(?<!\!)\[([^\]]+)\]\(([^)]+)\)', fix_link_md, result)

    return result


def clean_markdown_for_summary(md_text: str) -> str:
    """Extract a clean, readable text summary from raw markdown."""
    if not md_text:
        return ""
    # Strip HTML tags
    text = re.sub(r"<[^>]+>", " ", md_text)
    # Strip image links ![alt](url)
    text = re.sub(r"!\[.*?\]\(.*?\)", "", text)
    # Strip standard links [text](url) -> text
    text = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", text)
    # Strip badges and markdown headers
    text = re.sub(r"^#+\s+.*$", "", text, flags=re.MULTILINE)
    # Strip code blocks
    text = re.sub(r"```[\s\S]*?```", "", text)
    # Strip inline code
    text = re.sub(r"`([^`]+)`", r"\1", text)
    # Strip bold/italic markers
    text = re.sub(r"[*_]{1,3}", "", text)
    # Normalize whitespace
    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
        and not line.strip().startswith(("-", "*", "#", "|", ">", "["))
    ]
    summary = " ".join(lines[:3])
    if len(summary) > 280:
        summary = summary[:277].rstrip() + "..."
    return summary


def extract_readme_h1(md_text: str, fallback_name: str) -> str:
    """Extract the first H1 header or title from markdown."""
    if not md_text:
        return fallback_name
    match = re.search(r"^#\s+(.+)$", md_text, flags=re.MULTILINE)
    if match:
        title = match.group(1).strip()
        # Remove emojis and extra symbols for display name
        cleaned = re.sub(r"^[^\w\s]+", "", title).strip()
        return cleaned or title
    return fallback_name


def detect_category(
    name: str, language: Optional[str], topics: List[str], text_content: str
) -> str:
    """Determine smart category based on tech stack and topics."""
    combined = f"{name} {language or ''} {' '.join(topics)} {text_content}".lower()

    if any(
        k in combined
        for k in [
            "pytorch",
            "opencv",
            "gemini",
            "ai",
            "machine-learning",
            "deep-learning",
            "vision",
            "görü",
        ]
    ):
        return "AI/ML"
    if any(
        k in combined
        for k in [
            "flutter",
            "dart",
            "react-native",
            "android",
            "ios",
            "mobile",
            "mobil",
        ]
    ):
        return "Mobil"
    if any(
        k in combined
        for k in [
            "fastapi",
            "django",
            "express",
            "backend",
            "api",
            "redis",
            "postgresql",
            "sql",
            "server",
        ]
    ):
        return "Backend"
    if any(
        k in combined
        for k in [
            "react",
            "next.js",
            "nextjs",
            "vue",
            "tailwind",
            "saas",
            "fullstack",
            "full-stack",
        ]
    ):
        return "Full-Stack"
    return "Yazılım"


class GitHubService:
    BASE_URL = "https://api.github.com"

    def __init__(self):
        self.cache = MemoryCache(ttl_seconds=settings.CACHE_TTL_SECONDS)
        self.username = settings.GITHUB_USERNAME or "omerabali"
        self.token = settings.GITHUB_TOKEN

    def _get_headers(
        self, accept: str = "application/vnd.github.v3+json"
    ) -> Dict[str, str]:
        headers = {
            "Accept": accept,
            "User-Agent": f"FastAPI-Portfolio-Backend/{self.username}",
        }
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers

    def _load_local_fallback(self) -> List[Project]:
        """Loads curated repo snapshots from local repos.json as safety fallback."""
        try:
            possible_paths = [
                Path(__file__).resolve().parent.parent.parent.parent
                / "src"
                / "data"
                / "repos.json",
                Path(__file__).resolve().parent.parent.parent
                / "src"
                / "data"
                / "repos.json",
                Path("src/data/repos.json"),
            ]
            for p in possible_paths:
                if p.exists():
                    with open(p, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        projects = []
                        for r in data:
                            name = r.get("name", "")
                            raw_readme = r.get("readme_raw") or r.get("readme_detail") or ""
                            resolved_readme = resolve_relative_markdown_urls(
                                raw_readme, self.username, name
                            )
                            projects.append(
                                Project(
                                    slug=name.lower(),
                                    name=name,
                                    display_name=r.get("display_name") or name,
                                    description=r.get("readme_summary")
                                    or r.get("description"),
                                    readme_h1=r.get("readme_h1"),
                                    readme_summary=r.get("readme_summary")
                                    or r.get("description"),
                                    readme_detail=resolved_readme,
                                    readme_raw=resolved_readme,
                                    image_url=r.get("image_url")
                                    or f"https://opengraph.githubassets.com/1/{self.username}/{name}",
                                    category=r.get("category") or "Software",
                                    features=r.get("features", []),
                                    tech_stack=r.get("tech_stack", []),
                                    languages=r.get("languages", {}),
                                    github_url=r.get("html_url")
                                    or f"https://github.com/{self.username}/{name}",
                                    homepage=r.get("homepage"),
                                    stars=r.get("stargazers_count", 0),
                                    forks=r.get("forks_count", 0),
                                    open_issues=0,
                                    topics=r.get("topics", []),
                                    is_showcased=bool(
                                        r.get("is_featured")
                                        or "portfolio-featured" in r.get("topics", [])
                                    ),
                                    created_at=datetime.now(timezone.utc),
                                    updated_at=datetime.now(timezone.utc),
                                )
                            )
                        return projects
        except Exception as e:
            logger.warning(f"Could not load local fallback repos.json: {e}")
        return []

    async def _fetch_repo_readme(
        self, client: httpx.AsyncClient, repo_name: str, default_branch: str = "main"
    ) -> Tuple[Optional[str], Optional[str]]:
        """Fetches raw markdown and rendered HTML for a given repository README with resolved image URLs."""
        readme_url = f"{self.BASE_URL}/repos/{self.username}/{repo_name}/readme"
        readme_raw: Optional[str] = None
        readme_html: Optional[str] = None

        try:
            res = await client.get(readme_url, headers=self._get_headers())
            if res.status_code == 200:
                data = res.json()
                if "content" in data:
                    raw_text = base64.b64decode(data["content"]).decode(
                        "utf-8", errors="ignore"
                    )
                    readme_raw = resolve_relative_markdown_urls(
                        raw_text, self.username, repo_name, default_branch
                    )
        except Exception as e:
            logger.debug(f"Could not fetch raw README for {repo_name}: {e}")

        try:
            res_html = await client.get(
                readme_url,
                headers=self._get_headers(
                    accept="application/vnd.github.html+json"
                ),
            )
            if res_html.status_code == 200:
                readme_html = res_html.text
        except Exception as e:
            logger.debug(f"Could not fetch HTML README for {repo_name}: {e}")

        return readme_raw, readme_html

    async def get_all_projects(
        self, force_refresh: bool = False
    ) -> Tuple[List[Project], bool]:
        """Fetch all public repositories for user, enriched actively with live READMEs."""
        cache_key = f"projects:v3:{self.username}"
        if not force_refresh:
            cached_data = self.cache.get(cache_key)
            if cached_data is not None:
                logger.info("Serving enriched projects list from memory cache")
                return cached_data, True

        async with httpx.AsyncClient(timeout=20.0) as client:
            url = f"{self.BASE_URL}/users/{self.username}/repos"
            params = {"type": "owner", "sort": "updated", "per_page": 100}

            try:
                response = await client.get(
                    url, headers=self._get_headers(), params=params
                )

                if response.status_code in [403, 429]:
                    logger.warning(
                        "GitHub API rate limit reached, falling back to cached snapshot"
                    )
                    fallback = self._load_local_fallback()
                    if fallback:
                        return fallback, True

                response.raise_for_status()
                repos_raw = response.json()
            except Exception as e:
                logger.error(
                    f"Failed to fetch repositories from GitHub API: {e}, attempting fallback."
                )
                fallback = self._load_local_fallback()
                if fallback:
                    return fallback, True
                raise

            semaphore = asyncio.Semaphore(8)

            async def enrich_repo(repo: Dict[str, Any]) -> Project:
                repo_name = repo.get("name", "")
                default_branch = repo.get("default_branch", "main")
                topics = repo.get("topics", [])
                primary_lang = repo.get("language")
                tech_stack = list(filter(None, [primary_lang] + topics))
                is_showcased = (
                    repo_name.lower()
                    in [r.lower() for r in settings.SHOWCASED_REPOS]
                    or "portfolio-featured" in topics
                    or repo.get("stargazers_count", 0) > 0
                )

                readme_raw: Optional[str] = None
                readme_html: Optional[str] = None

                async with semaphore:
                    readme_raw, readme_html = await self._fetch_repo_readme(
                        client, repo_name, default_branch
                    )

                summary = ""
                display_name = repo_name
                h1_title = None
                if readme_raw:
                    summary = clean_markdown_for_summary(readme_raw)
                    h1_title = extract_readme_h1(readme_raw, repo_name)
                    if h1_title and len(h1_title) < 40 and not h1_title.startswith("#"):
                        display_name = h1_title

                desc = (
                    repo.get("description")
                    or summary
                    or "Modern açık kaynak yazılım çözümü."
                )
                cat = detect_category(
                    repo_name,
                    primary_lang,
                    topics,
                    f"{desc} {readme_raw or ''}",
                )

                return Project(
                    slug=repo_name.lower(),
                    name=repo_name,
                    display_name=display_name,
                    description=desc,
                    readme_h1=h1_title,
                    readme_summary=summary or desc,
                    readme_detail=readme_raw,
                    readme_raw=readme_raw,
                    readme_html=readme_html,
                    image_url=f"https://opengraph.githubassets.com/1/{self.username}/{repo_name}",
                    category=cat,
                    features=[],
                    tech_stack=tech_stack,
                    languages={primary_lang: 100.0} if primary_lang else {},
                    github_url=repo.get(
                        "html_url",
                        f"https://github.com/{self.username}/{repo_name}",
                    ),
                    homepage=repo.get("homepage") or None,
                    stars=repo.get("stargazers_count", 0),
                    forks=repo.get("forks_count", 0),
                    open_issues=repo.get("open_issues_count", 0),
                    topics=topics,
                    is_showcased=is_showcased,
                    created_at=datetime.fromisoformat(
                        repo.get("created_at").replace("Z", "+00:00")
                    ),
                    updated_at=datetime.fromisoformat(
                        repo.get("updated_at").replace("Z", "+00:00")
                    ),
                    pushed_at=datetime.fromisoformat(
                        repo.get("pushed_at").replace("Z", "+00:00")
                    )
                    if repo.get("pushed_at")
                    else None,
                )

            tasks = [
                enrich_repo(r)
                for r in repos_raw
                if not r.get("fork", False) and not r.get("archived", False)
            ]
            projects: List[Project] = await asyncio.gather(*tasks)

            projects.sort(
                key=lambda p: p.created_at or p.pushed_at or p.updated_at,
                reverse=True,
            )

            self.cache.set(cache_key, projects)
            return projects, False

    async def get_project_detail(
        self, repo_slug: str, force_refresh: bool = False
    ) -> Optional[ProjectDetail]:
        """Fetch detailed information for a single repository, including live README and languages."""
        cache_key = f"project_detail:v3:{self.username}:{repo_slug}"
        if not force_refresh:
            cached_data = self.cache.get(cache_key)
            if cached_data is not None:
                logger.info(f"Serving project detail for '{repo_slug}' from cache")
                return cached_data

        async with httpx.AsyncClient(timeout=20.0) as client:
            repo_url = f"{self.BASE_URL}/repos/{self.username}/{repo_slug}"
            try:
                repo_res = await client.get(repo_url, headers=self._get_headers())
                if repo_res.status_code == 404:
                    return None
                repo_res.raise_for_status()
                repo = repo_res.json()
            except Exception as e:
                logger.error(f"GitHub API Error for repo {repo_slug}: {e}")
                all_p, _ = await self.get_all_projects()
                match = next(
                    (
                        p
                        for p in all_p
                        if p.slug == repo_slug.lower()
                        or p.name.lower() == repo_slug.lower()
                    ),
                    None,
                )
                if match:
                    return ProjectDetail(
                        **match.model_dump(),
                        default_branch="main",
                        license="MIT",
                        archived=False,
                    )
                return None

            default_branch = repo.get("default_branch", "main")

            # Fetch languages
            languages_dist: Dict[str, float] = {}
            lang_url = repo.get("languages_url")
            if lang_url:
                try:
                    lang_res = await client.get(lang_url, headers=self._get_headers())
                    if lang_res.status_code == 200:
                        raw_langs = lang_res.json()
                        total_bytes = sum(raw_langs.values())
                        if total_bytes > 0:
                            languages_dist = {
                                lang: round((bytes_cnt / total_bytes) * 100, 2)
                                for lang, bytes_cnt in raw_langs.items()
                            }
                except Exception as e:
                    logger.warning(f"Could not fetch languages for {repo_slug}: {e}")

            readme_raw, readme_html = await self._fetch_repo_readme(
                client, repo.get("name", repo_slug), default_branch
            )

            topics = repo.get("topics", [])
            primary_lang = repo.get("language")
            tech_stack = list(
                filter(None, [primary_lang] + list(languages_dist.keys()) + topics)
            )
            tech_stack = list(dict.fromkeys(tech_stack))

            summary = (
                clean_markdown_for_summary(readme_raw)
                if readme_raw
                else repo.get("description", "")
            )
            h1_title = (
                extract_readme_h1(readme_raw, repo.get("name", repo_slug))
                if readme_raw
                else repo.get("name")
            )

            detail = ProjectDetail(
                slug=repo.get("name", "").lower(),
                name=repo.get("name", ""),
                display_name=h1_title or repo.get("name", ""),
                description=repo.get("description") or summary,
                readme_h1=h1_title,
                readme_summary=summary,
                readme_detail=readme_raw,
                readme_raw=readme_raw,
                readme_html=readme_html,
                image_url=f"https://opengraph.githubassets.com/1/{self.username}/{repo.get('name')}",
                category=detect_category(
                    repo.get("name", ""), primary_lang, topics, summary
                ),
                features=[],
                tech_stack=tech_stack,
                languages=languages_dist,
                github_url=repo.get("html_url", ""),
                homepage=repo.get("homepage") or None,
                stars=repo.get("stargazers_count", 0),
                forks=repo.get("forks_count", 0),
                open_issues=repo.get("open_issues_count", 0),
                topics=topics,
                is_showcased=repo.get("name").lower()
                in [r.lower() for r in settings.SHOWCASED_REPOS],
                created_at=datetime.fromisoformat(
                    repo.get("created_at").replace("Z", "+00:00")
                ),
                updated_at=datetime.fromisoformat(
                    repo.get("updated_at").replace("Z", "+00:00")
                ),
                pushed_at=datetime.fromisoformat(
                    repo.get("pushed_at").replace("Z", "+00:00")
                )
                if repo.get("pushed_at")
                else None,
                default_branch=default_branch,
                license=repo.get("license", {}).get("spdx_id")
                if repo.get("license")
                else None,
                archived=repo.get("archived", False),
            )

            self.cache.set(cache_key, detail)
            return detail


github_service = GitHubService()
