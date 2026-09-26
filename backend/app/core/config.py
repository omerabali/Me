import json
from typing import List, Optional, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator


class Settings(BaseSettings):
    APP_NAME: str = "Omer Abali Portfolio API"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database Configuration (Cloud Neon Serverless PostgreSQL - Required)
    DATABASE_URL: Optional[str] = Field(
        default=None, 
        description="Neon Serverless PostgreSQL connection string (postgresql://user:pass@ep-...neon.tech/neondb?sslmode=require)"
    )
    NEON_DATABASE_URL: Optional[str] = Field(
        default=None, 
        description="Alias for Neon Database URL"
    )

    # GitHub Settings
    GITHUB_USERNAME: str = Field(default="omerabali", description="Your GitHub username")
    GITHUB_TOKEN: Optional[str] = Field(
        default=None, 
        description="GitHub Personal Access Token for 5000 req/hr rate limit"
    )

    # Cache Settings (in seconds)
    CACHE_TTL_SECONDS: int = 1800

    # CORS Settings
    ALLOWED_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    # Explicit Showcase Repositories
    SHOWCASED_REPOS: Union[List[str], str] = [
        "Ai-Medium-Design",
        "Farm-Ai",
        "skill-identity-engine",
        "ai-home-design",
        "health-insurance-pricing",
        "chatter-stream",
        "lexis-app",
        "java-hotel-reservation-system",
    ]

    @field_validator("ALLOWED_ORIGINS", mode="after")
    @classmethod
    def parse_allowed_origins(cls, value):
        if isinstance(value, str):
            if value.startswith("[") and value.endswith("]"):
                try:
                    return json.loads(value)
                except Exception:
                    pass
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @field_validator("SHOWCASED_REPOS", mode="after")
    @classmethod
    def parse_showcased_repos(cls, value):
        if isinstance(value, str):
            if value.startswith("[") and value.endswith("]"):
                try:
                    return json.loads(value)
                except Exception:
                    pass
            return [repo.strip() for repo in value.split(",") if repo.strip()]
        return value

    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
