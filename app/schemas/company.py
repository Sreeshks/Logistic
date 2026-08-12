from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field, computed_field
from app.schemas.branch import BranchResponse
from app.schemas.company_contact import CompanyContactResponse


class CompanyUpdate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    arabic_name: str | None = None
    business_type: str | None = None
    country: str | None = None
    logo: str | None = None
    favicon: str | None = None
    tagline: str | None = None
    short_description: str | None = None
    full_description: str | None = None
    phone: str | None = None
    whatsapp: str | None = None
    email: EmailStr | str | None = None
    address: str | None = None
    google_maps_url: str | None = None
    working_hours: str | None = None

    facebook: str | None = None
    instagram: str | None = None
    linkedin: str | None = None
    youtube: str | None = None
    twitter: str | None = None

    primary_color: str | None = None
    secondary_color: str | None = None
    accent_color: str | None = None
    theme_mode: str | None = None


class CompanyResponse(BaseModel):
    id: int
    name: str
    arabic_name: str | None = None
    business_type: str | None = None
    country: str | None = None
    logo: str | None = None
    favicon: str | None = None
    tagline: str | None = None
    short_description: str | None = None
    full_description: str | None = None
    phone: str | None = None
    whatsapp: str | None = None
    email: str | None = None
    address: str | None = None
    google_maps_url: str | None = None
    working_hours: str | None = None

    facebook: str | None = None
    instagram: str | None = None
    linkedin: str | None = None
    youtube: str | None = None
    twitter: str | None = None

    primary_color: str | None = None
    secondary_color: str | None = None
    accent_color: str | None = None
    theme_mode: str | None = None

    branches: list[BranchResponse] = []
    company_contacts: list[CompanyContactResponse] = []

    created_at: datetime
    updated_at: datetime

    @computed_field
    @property
    def company_name(self) -> str:
        return self.name

    @computed_field
    @property
    def logo_url(self) -> str | None:
        return self.logo

    @computed_field
    @property
    def description(self) -> str | None:
        return self.short_description or self.full_description

    @computed_field
    @property
    def facebook_url(self) -> str | None:
        return self.facebook

    @computed_field
    @property
    def instagram_url(self) -> str | None:
        return self.instagram

    @computed_field
    @property
    def linkedin_url(self) -> str | None:
        return self.linkedin

    @computed_field
    @property
    def youtube_url(self) -> str | None:
        return self.youtube

    @computed_field
    @property
    def twitter_url(self) -> str | None:
        return self.twitter

    model_config = ConfigDict(from_attributes=True)

