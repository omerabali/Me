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
    name = Column(String(255), nullable=False)
    display_name = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    
    # README details
    readme_h1 = Column(String(255), nullable=True)
    readme_summary = Column(Text, nullable=True)
    readme_detail = Column(Text, nullable=True)
    readme_raw = Column(Text, nullable=True)
    readme_html = Column(Text, nullable=True)
    
    # Metadata & Categories
    image_url = Column(String(500), nullable=True)
    category = Column(String(100), default="Yazılım", index=True)
    tech_stack = Column(JSON, default=list)
    languages = Column(JSON, default=dict)
    features = Column(JSON, default=list)
    topics = Column(JSON, default=list)
    
    # Links & Metrics
    github_url = Column(String(500), nullable=False)
    homepage = Column(String(500), nullable=True)
    stars = Column(Integer, default=0, index=True)
    forks = Column(Integer, default=0)
    open_issues = Column(Integer, default=0)
    is_showcased = Column(Boolean, default=False, index=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
    synced_at = Column(DateTime(timezone=True), default=utcnow)


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
