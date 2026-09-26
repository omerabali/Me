from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class TechMetric(BaseModel):
    name: str
    bytes_count: int
    percentage: float


class Project(BaseModel):
    slug: str
    name: str
    display_name: Optional[str] = None
    description: Optional[str] = None
    readme_h1: Optional[str] = None
    readme_summary: Optional[str] = None
    readme_detail: Optional[str] = None
    readme_raw: Optional[str] = None
    readme_html: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = "Software"
    features: List[str] = Field(default_factory=list)
    tech_stack: List[str] = Field(default_factory=list)
    languages: Dict[str, float] = Field(
        default_factory=dict, 
        description="Language distribution percentages"
    )
    github_url: str
    homepage: Optional[str] = None
    stars: int = 0
    forks: int = 0
    open_issues: int = 0
    topics: List[str] = Field(default_factory=list)
    is_showcased: bool = False
    created_at: datetime
    updated_at: datetime
    pushed_at: Optional[datetime] = None


class ProjectDetail(Project):
    default_branch: str = "main"
    license: Optional[str] = None
    archived: bool = False


class ProjectsListResponse(BaseModel):
    total: int
    showcased_count: int
    cached: bool
    data: List[Project]


class HealthResponse(BaseModel):
    status: str = "healthy"
    app_name: str
    environment: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    github_configured: bool
    cache_ttl_seconds: int
