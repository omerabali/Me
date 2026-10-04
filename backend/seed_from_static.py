"""
Tek seferlik tohumlama (Seed) scripti:
Mevcut static projects.json ve readmes klasöründeki verileri Neon PostgreSQL veritabanına aktarır.
Böylece sıfırdan başlarken hiçbir proje veya README kaybolmaz!
"""
import asyncio
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from app.core.database import AsyncSessionLocal, init_db
from app.models.db_models import ProjectDB
from sqlalchemy import select


def category_to_enum(cat_or_topics_or_langs: str, topics: list, langs: list) -> str:
    raw = (cat_or_topics_or_langs or "").lower()
    all_str = " ".join([raw] + [t.lower() for t in topics] + [l.lower() for l in langs])
    
    if any(k in all_str for k in ["ai", "ml", "yapay zeka", "machine learning", "yolo", "segmentation"]):
        return "ai-ml"
    if any(k in all_str for k in ["flutter", "dart", "mobile", "mobil", "android", "swift", "kotlin"]):
        return "mobile"
    if any(k in all_str for k in ["web", "react", "typescript", "javascript", "tailwind", "vite", "next", "bulut"]):
        return "web-cloud"
    return "software-algo"


async def seed():
    print("Veritabani tablolari guncelleniyor...")
    from app.core.database import engine, Base
    from app.models.db_models import ProjectDB
    from sqlalchemy import text

    async with engine.begin() as conn:
        print("Eski projects tablosu yeni sema icin sifirlaniyor...")
        await conn.execute(text("DROP TABLE IF EXISTS projects CASCADE;"))
        await conn.run_sync(Base.metadata.create_all)
    print("Yeni sema olusturuldu.")

    root_dir = backend_dir.parent
    projects_json_path = root_dir / "src" / "data" / "projects.json"
    readmes_dir = root_dir / "src" / "data" / "readmes"

    if not projects_json_path.exists():
        print(f"❌ {projects_json_path} bulunamadı!")
        return

    with open(projects_json_path, "r", encoding="utf-8") as f:
        projects_data = json.load(f)

    print(f"📦 {len(projects_data)} proje bulundu, veritabanına aktarılıyor...")

    async with AsyncSessionLocal() as session:
        added_count = 0
        skipped_count = 0

        for idx, p in enumerate(projects_data):
            slug = (p.get("slug") or p.get("name", "")).lower().strip()
            name = p.get("name", slug)
            
            # DB'de var mı kontrol et
            res = await session.execute(select(ProjectDB).where(ProjectDB.slug == slug))
            existing = res.scalar_one_or_none()
            if existing:
                skipped_count += 1
                continue

            # Varsa README dosyasını oku
            readme_text = None
            readme_path = readmes_dir / f"{name}.md"
            if readme_path.exists():
                try:
                    with open(readme_path, "r", encoding="utf-8") as rf:
                        readme_text = rf.read().replace("\ufeff", "").replace("\r\n", "\n")
                except Exception as err:
                    print(f"  ⚠️ {name} README okunamadı: {err}")

            category = category_to_enum(
                p.get("category", ""),
                p.get("topics", []),
                p.get("languages", [])
            )

            # Özel başlık ve açıklamalar
            title_tr = p.get("display_name") or name
            desc_tr = p.get("description") or None

            now = datetime.now(timezone.utc)
            db_project = ProjectDB(
                slug=slug,
                repo_name=name,
                title_tr=title_tr,
                title_en=name,
                description_tr=desc_tr,
                description_en=desc_tr,
                category=category,
                tags=p.get("languages") or p.get("topics") or [],
                github_url=p.get("url") or p.get("github_url") or f"https://github.com/omerabali/{name}",
                demo_url=p.get("homepage"),
                cover_image_url=None,
                stars=p.get("stars", 0),
                forks=p.get("forks", 0),
                sort_order=idx + 1,
                is_published=True,
                readme_markdown=readme_text,
                readme_updated_at=now if readme_text else None,
                created_at=now,
                updated_at=now,
            )
            session.add(db_project)
            added_count += 1

        await session.commit()
        print(f"✅ Tamamlandı! Eklenen: {added_count}, Önceden var olan (atlanan): {skipped_count}")


if __name__ == "__main__":
    asyncio.run(seed())
