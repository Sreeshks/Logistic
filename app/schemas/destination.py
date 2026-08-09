from datetime import datetime
from pydantic import BaseModel, ConfigDict


class DestinationBase(BaseModel):
    name: str
    code: str | None = None
    description: str | None = None
    is_active: bool = True
    display_order: int = 0


class DestinationCreate(DestinationBase):
    pass


class DestinationUpdate(BaseModel):
    name: str | None = None
    code: str | None = None
    description: str | None = None
    is_active: bool | None = None
    display_order: int | None = None


class DestinationResponse(DestinationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
