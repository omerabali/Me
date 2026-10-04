from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class ProjectBase(BaseModel):
    slug: str
    repo_name: str
    title_tr: str
    title_en: Optional[str] = None
    description_tr: Optional[str] = None
    description_en: Optional[str] = None
    category: str = "software-algo"
    tags: List[str] = Field(default_factory=list)
    github_url: str
    demo_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    stars: int = 0
    forks: int = 0
    sort_order: int = 0
    is_published: bool = True


class ProjectCreate(ProjectBase):
    readme_markdown: Optional[str] = None


class ProjectUpdate(BaseModel):
    slug: Optional[str] = None
    repo_name: Optional[str] = None
    title_tr: Optional[str] = None
    title_en: Optional[str] = None
    description_tr: Optional[str] = None
    description_en: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    stars: Optional[int] = None
    forks: Optional[int] = None
    sort_order: Optional[int] = None
    is_published: Optional[bool] = None
    readme_markdown: Optional[str] = None


# Public Project List (README gövdesi yok, has_readme var)
class ProjectPublic(BaseModel):
    id: int
    slug: str
    repo_name: str
    title_tr: str
    title_en: Optional[str] = None
    description_tr: Optional[str] = None
    description_en: Optional[str] = None
    category: str
    tags: List[str] = Field(default_factory=list)
    github_url: str
    demo_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    stars: int = 0
    forks: int = 0
    has_readme: bool = False
    sort_order: int = 0
    updated_at: datetime

    class Config:
        from_attributes = True


# Public Project Detail (README dahil)
class ProjectDetailPublic(ProjectPublic):
    readme_markdown: Optional[str] = None
    readme_updated_at: Optional[datetime] = None


# Admin Project (Taslak/Yayın durumu ve ham markdown dahil)
class ProjectAdmin(ProjectBase):
    id: int
    has_readme: bool = False
    readme_markdown: Optional[str] = None
    readme_updated_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ReorderItem(BaseModel):
    id: int
    sort_order: int


class ReorderRequest(BaseModel):
    items: List[ReorderItem]


class AdminLoginRequest(BaseModel):
    password: str


class AdminAuthResponse(BaseModel):
    authenticated: bool
    username: str = "admin"
    message: Optional[str] = None


class HealthResponse(BaseModel):
    status: str = "healthy"
    app_name: str
    environment: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    database_connected: bool
