from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class ServiceCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    slug: str | None = None
    short_description: str | None = None
    description: str | None = None
    delivery_information: str | None = None
    category_name: str | None = None
    icon: str | None = None
    image: str | None = None
    display_order: int = 0
    is_featured: bool = False
    is_active: bool = True

    # SEO metadata
    meta_title: str | None = None
    meta_description: str | None = None
    og_title: str | None = None
    og_description: str | None = None
    og_image: str | None = None


class ServiceUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    short_description: str | None = None
    description: str | None = None
    delivery_information: str | None = None
    category_name: str | None = None
    icon: str | None = None
    image: str | None = None
    display_order: int | None = None
    is_featured: bool | None = None
    is_active: bool | None = None

    # SEO metadata
    meta_title: str | None = None
    meta_description: str | None = None
    og_title: str | None = None
    og_description: str | None = None
    og_image: str | None = None


class ServiceResponse(BaseModel):
    id: int
    title: str
    slug: str
    short_description: str | None = None
    description: str | None = None
    delivery_information: str | None = None
    category_name: str | None = None
    icon: str | None = None
    image: str | None = None
    display_order: int
    is_featured: bool
    is_active: bool

    # SEO metadata
    meta_title: str | None = None
    meta_description: str | None = None
    og_title: str | None = None
    og_description: str | None = None
    og_image: str | None = None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
