from datetime import datetime
from enum import Enum
import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class BlogStatus(str, Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"


class Blog(Base):
    __tablename__ = "blogs"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    slug: Mapped[str] = mapped_column(sa.String(255), unique=True, index=True, nullable=False)
    short_description: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    content: Mapped[str] = mapped_column(sa.Text, nullable=False)
    featured_image: Mapped[str | None] = mapped_column(sa.String(500), nullable=True)
    author: Mapped[str] = mapped_column(sa.String(100), default="Admin", nullable=False)
    category: Mapped[str | None] = mapped_column(sa.String(100), index=True, nullable=True)
    tags: Mapped[str | None] = mapped_column(sa.String(255), nullable=True)  # Comma-separated tags or JSON
    status: Mapped[BlogStatus] = mapped_column(
        sa.Enum(BlogStatus, native_enum=False, values_callable=lambda obj: [e.value for e in obj]),
        default=BlogStatus.DRAFT,
        nullable=False,
    )
    is_featured: Mapped[bool] = mapped_column(sa.Boolean, default=False, nullable=False)
    published_at: Mapped[datetime | None] = mapped_column(sa.DateTime(timezone=True), nullable=True)

    # SEO metadata
    meta_title: Mapped[str | None] = mapped_column(sa.String(255), nullable=True)
    meta_description: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    og_title: Mapped[str | None] = mapped_column(sa.String(255), nullable=True)
    og_description: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    og_image: Mapped[str | None] = mapped_column(sa.String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False
    )
