import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import AsyncSessionLocal, init_db
from app.routers import contact, health, projects
from app.services.project_db_service import project_db_service

# Logging configuration
logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} in {settings.ENVIRONMENT} mode...")
    
    # 1. Initialize Database Tables (Neon PostgreSQL / Async DB)
    await init_db()
    
    # 2. Background Initial Sync from GitHub into Neon DB
    async def initial_sync():
        try:
            async with AsyncSessionLocal() as session:
                logger.info("Checking database state and running initial GitHub sync...")
                await project_db_service.sync_github_to_database(db=session)
        except Exception as e:
            logger.warning(f"Initial sync warning (will retry on request): {e}")

    asyncio.create_task(initial_sync())
    
    yield
    logger.info("Shutting down API...")


app = FastAPI(
    title=settings.APP_NAME,
    description="FastAPI Backend for Modern Portfolio with Neon Serverless PostgreSQL & Live GitHub Sync",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
origins = settings.ALLOWED_ORIGINS if isinstance(settings.ALLOWED_ORIGINS, list) else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error processing {request.method} {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error occurred. Check server logs."},
    )


# Mount Routers
app.include_router(health.router)
app.include_router(projects.router)
app.include_router(contact.router)


@app.get("/", tags=["root"])
async def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "database": "Neon Serverless PostgreSQL (Async)",
        "docs": "/docs",
        "health": "/api/health",
        "projects": "/api/projects",
        "stats": "/api/projects/stats",
        "contact": "/api/contact",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
