from datetime import datetime, timezone
from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Integer,
    String,
    Text,
)
from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class ProjectDB(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    repo_name = Column(String(255), index=True, nullable=False)
    
    # Çok dilli başlık ve açıklamalar
    title_tr = Column(String(255), nullable=False)
    title_en = Column(String(255), nullable=True)
    description_tr = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    
    # Kategori ve etiketler
    category = Column(String(100), default="software-algo", index=True, nullable=False)
    tags = Column(JSON, default=list)
    
    # Bağlantılar ve görseller
    github_url = Column(String(500), nullable=False)
    demo_url = Column(String(500), nullable=True)
    cover_image_url = Column(String(500), nullable=True)
    
    # Metrikler
    stars = Column(Integer, default=0, index=True)
    forks = Column(Integer, default=0)
    
    # README ham Markdown içeriği (PostgreSQL TEXT, sınırsız uzunluk)
    readme_markdown = Column(Text, nullable=True)
    readme_updated_at = Column(DateTime(timezone=True), nullable=True)
    
    # Yayın ve sıralama
    is_published = Column(Boolean, default=True, index=True)
    sort_order = Column(Integer, default=0, index=True)
    
    # Zaman damgaları
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


class ContactMessageDB(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    subject = Column(String(255), nullable=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    is_read = Column(Boolean, default=False)


class SiteMetricDB(Base):
    __tablename__ = "site_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    metric_key = Column(String(100), unique=True, index=True, nullable=False)
    metric_value = Column(JSON, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
