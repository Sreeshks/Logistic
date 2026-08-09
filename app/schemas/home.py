from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.service import ServiceResponse
from app.schemas.gallery import GalleryResponse
from app.schemas.blog import BlogResponse
from app.schemas.branch import BranchResponse
from app.schemas.destination import DestinationResponse


class HomeHeroUpdate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    subtitle: str | None = None
    description: str | None = None
    button_text: str | None = None
    button_url: str | None = None
    secondary_button_text: str | None = None
    secondary_button_url: str | None = None
    background_image: str | None = None


class HomeHeroResponse(BaseModel):
    id: int
    title: str
    subtitle: str | None = None
    description: str | None = None
    button_text: str | None = None
    button_url: str | None = None
    secondary_button_text: str | None = None
    secondary_button_url: str | None = None
    background_image: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CompanyStatisticCreate(BaseModel):
    label: str = Field(..., min_length=1, max_length=100)
    value: str = Field(..., min_length=1, max_length=50)
    icon: str | None = None
    display_order: int = 0
    is_active: bool = True


class CompanyStatisticUpdate(BaseModel):
    label: str | None = None
    value: str | None = None
    icon: str | None = None
    display_order: int | None = None
    is_active: bool | None = None


class CompanyStatisticResponse(BaseModel):
    id: int
    label: str
    value: str
    icon: str | None = None
    display_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PublicHomeResponse(BaseModel):
    hero: HomeHeroResponse | None = None
    statistics: list[CompanyStatisticResponse] = []
    featured_services: list[ServiceResponse] = []
    featured_gallery: list[GalleryResponse] = []
    featured_blogs: list[BlogResponse] = []
    branches: list[BranchResponse] = []
    destinations: list[DestinationResponse] = []
    highlights: list[dict] = []
