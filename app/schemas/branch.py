from datetime import datetime
from pydantic import BaseModel, ConfigDict


class BranchContactBase(BaseModel):
    phone: str
    country_code: str | None = "+968"
    phone_type: str | None = "PHONE"
    is_whatsapp: bool = False
    is_primary: bool = False


class BranchContactCreate(BranchContactBase):
    pass


class BranchContactResponse(BranchContactBase):
    id: int
    branch_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BranchBase(BaseModel):
    name: str
    location_description: str | None = None
    address: str | None = None
    city: str | None = None
    country: str | None = "Oman"
    status: str = "ACTIVE"  # ACTIVE, COMING_SOON, INACTIVE
    is_featured: bool = False
    display_order: int = 0


class BranchCreate(BranchBase):
    company_id: int | None = None
    contacts: list[BranchContactCreate] = []


class BranchUpdate(BaseModel):
    name: str | None = None
    location_description: str | None = None
    address: str | None = None
    city: str | None = None
    country: str | None = None
    status: str | None = None
    is_featured: bool | None = None
    display_order: int | None = None


class BranchResponse(BranchBase):
    id: int
    company_id: int | None = None
    contacts: list[BranchContactResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
