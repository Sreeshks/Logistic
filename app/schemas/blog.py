from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.models.blog import BlogStatus


class BlogCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    slug: str | None = None
    short_description: str | None = None
    content: str = Field(..., min_length=1)
    featured_image: str | None = None
    author: str = "Admin"
    category: str | None = None
    tags: str | list[str] | None = None
    status: BlogStatus = BlogStatus.DRAFT
    is_featured: bool = False
    published_at: datetime | None = None

    # SEO metadata
    meta_title: str | None = None
    meta_description: str | None = None
    og_title: str | None = None
    og_description: str | None = None
    og_image: str | None = None


class BlogUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    short_description: str | None = None
    content: str | None = None
    featured_image: str | None = None
    author: str | None = None
    category: str | None = None
    tags: str | list[str] | None = None
    status: BlogStatus | None = None
    is_featured: bool | None = None
    published_at: datetime | None = None

    # SEO metadata
    meta_title: str | None = None
    meta_description: str | None = None
    og_title: str | None = None
    og_description: str | None = None
    og_image: str | None = None


class BlogResponse(BaseModel):
    id: int
    title: str
    slug: str
    short_description: str | None = None
    content: str
    featured_image: str | None = None
    author: str
    category: str | None = None
    tags: str | None = None
    status: BlogStatus
    is_featured: bool
    published_at: datetime | None = None

    # SEO metadata
    meta_title: str | None = None
    meta_description: str | None = None
    og_title: str | None = None
    og_description: str | None = None
    og_image: str | None = None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
