from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class FAQCreate(BaseModel):
    question: str = Field(..., min_length=1, max_length=500)
    answer: str = Field(..., min_length=1)
    category: str | None = "General"
    display_order: int = 0
    is_active: bool = True


class FAQUpdate(BaseModel):
    question: str | None = None
    answer: str | None = None
    category: str | None = None
    display_order: int | None = None
    is_active: bool | None = None


class FAQResponse(BaseModel):
    id: int
    question: str
    answer: str
    category: str | None = None
    display_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
