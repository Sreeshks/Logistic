from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field
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

    branches: list[BranchResponse] = []
    company_contacts: list[CompanyContactResponse] = []

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
