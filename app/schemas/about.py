from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, computed_field


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

    @computed_field
    @property
    def title(self) -> str:
        return self.page_title

    @computed_field
    @property
    def subtitle(self) -> str | None:
        return self.short_description

    @computed_field
    @property
    def story(self) -> str | None:
        return self.company_story

    @computed_field
    @property
    def values(self) -> str | None:
        return self.core_values

    @computed_field
    @property
    def image_url(self) -> str | None:
        return self.about_image

    model_config = ConfigDict(from_attributes=True)

