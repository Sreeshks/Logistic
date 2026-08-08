from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class AboutUpdate(BaseModel):
    page_title: str = Field(..., min_length=1, max_length=255)
    short_description: str | None = None
    company_story: str | None = None
    mission: str | None = None
    vision: str | None = None
    core_values: str | None = None
    about_image: str | None = None


class AboutResponse(BaseModel):
    id: int
    page_title: str
    short_description: str | None = None
    company_story: str | None = None
    mission: str | None = None
    vision: str | None = None
    core_values: str | None = None
    about_image: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
