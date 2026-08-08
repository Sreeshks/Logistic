from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class GalleryCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    image_url: str = Field(..., min_length=1)
    category: str | None = "General"
    display_order: int = 0
    is_featured: bool = False
    is_active: bool = True


class GalleryUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    image_url: str | None = None
    category: str | None = None
    display_order: int | None = None
    is_featured: bool | None = None
    is_active: bool | None = None


class GalleryResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    image_url: str
    category: str | None = None
    display_order: int
    is_featured: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
