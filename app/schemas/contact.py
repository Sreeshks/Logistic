from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.contact import ContactStatus


class ContactSubmitRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=5, max_length=50)
    subject: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=1)


class ContactStatusUpdate(BaseModel):
    status: ContactStatus


class ContactMessageResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    subject: str
    message: str
    status: ContactStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
