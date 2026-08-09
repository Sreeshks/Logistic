from datetime import datetime
from pydantic import BaseModel, ConfigDict


class CompanyContactBase(BaseModel):
    type: str  # PHONE, WHATSAPP, EMAIL
    value: str
    label: str | None = None
    is_primary: bool = False
    is_public: bool = True
    display_order: int = 0


class CompanyContactCreate(CompanyContactBase):
    company_id: int | None = None


class CompanyContactResponse(CompanyContactBase):
    id: int
    company_id: int | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
