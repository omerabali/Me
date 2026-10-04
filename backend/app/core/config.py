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

    # Admin Authentication & Security (SHA-256 + JWT)
    # Hash üret: python -c "import hashlib; s='SALT'; p='SIFRE'; print(hashlib.sha256((s+p).encode()).hexdigest())"
    ADMIN_PASSWORD_SHA256: Optional[str] = Field(
        default=None, description="SHA-256(salt+password) hex digest"
    )
    ADMIN_PASSWORD_SALT: Optional[str] = Field(
        default=None, description="Salt used when hashing admin password with SHA-256"
    )
    ADMIN_JWT_SECRET: Optional[str] = Field(
        default=None, description="HS256 secret for admin JWT (min 32 chars in production)"
    )
    ADMIN_PASSWORD_HASH: Optional[str] = Field(
        default=None, description="Legacy bcrypt hash (optional fallback)"
    )
    ADMIN_PASSWORD: Optional[str] = Field(
        default=None, description="Dev-only plaintext fallback (ignored in production)"
    )
    ADMIN_SESSION_SECRET: Optional[str] = Field(
        default=None,
        description="Legacy fallback if ADMIN_JWT_SECRET unset (dev only; never use in production)",
    )
    # Site GitHub'dan otomatik senkron ETMEZ (README/admin manuel)
    GITHUB_AUTO_SYNC: bool = Field(
        default=False,
        description="Always false: new repos/commits never auto-publish to the site",
    )
    GITHUB_OWNER: str = Field(default="omerabali", description="GitHub username or org for image resolution")

    # Cache Settings (in seconds)
    CACHE_TTL_SECONDS: int = 60

    # CORS Settings (production'da https://omerabali.github.io zorunlu)
    ALLOWED_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://omerabali.github.io",
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
