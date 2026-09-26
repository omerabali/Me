import logging
import os
import re
from typing import AsyncGenerator
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import declarative_base

from app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()


def get_async_database_url() -> tuple[str, dict]:
    """
    Constructs an async-compatible database URL for Neon Serverless PostgreSQL.
    Automatically handles Neon's sslmode=require and driver prefix (postgresql+asyncpg://).
    Local database is disabled; DATABASE_URL is strictly required.
    """
    raw_url = settings.DATABASE_URL or settings.NEON_DATABASE_URL or os.getenv("DATABASE_URL")
    connect_args = {}

    if not raw_url:
        raise RuntimeError(
            "CRITICAL: DATABASE_URL is missing! Cloud Neon PostgreSQL is strictly required. "
            "Please configure DATABASE_URL in your environment or backend/.env file."
        )

    # Handle Postgres URL transformations
    url = raw_url.strip()
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif not url.startswith("postgresql+asyncpg://"):
        pass

    # Neon requires SSL. asyncpg uses 'ssl' parameter instead of 'sslmode'
    if "neon.tech" in url or "sslmode=require" in url:
        parsed = urlparse(url)
        query_params = parse_qs(parsed.query)
        
        # Remove sslmode if present
        query_params.pop("sslmode", None)
        query_params.pop("channel_binding", None)
        
        new_query = urlencode(query_params, doseq=True)
        url = urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, new_query, parsed.fragment))
        
        # asyncpg connect argument for SSL
        connect_args["ssl"] = "require"

    target_host = url.split("@")[-1].split("/")[0] if "@" in url else "Neon Cloud"
    logger.info(f"Connecting strictly to Cloud Neon PostgreSQL (host: {target_host})...")
    return url, connect_args


DB_URL, CONNECT_ARGS = get_async_database_url()

# Create Async Engine with Neon-friendly connection pooling
engine: AsyncEngine = create_async_engine(
    DB_URL,
    echo=settings.DEBUG and False,
    future=True,
    pool_pre_ping=True,  # Crucial for Neon serverless auto-suspend
    pool_recycle=300,    # Recycle connections after 5 minutes
    connect_args=CONNECT_ARGS,
)

# Async Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for yielding async database sessions."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """Initializes and creates all database tables on application startup."""
    try:
        async with engine.begin() as conn:
            # Import models here to ensure they are registered with Base.metadata
            from app.models.db_models import ProjectDB, ContactMessageDB, SiteMetricDB  # noqa: F401
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database schema initialized successfully (Neon PostgreSQL / Async DB).")
    except Exception as e:
        logger.error(f"Failed to initialize database tables: {e}", exc_info=True)
