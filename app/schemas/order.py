from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.models.order import OrderStatus


class OrderCreate(BaseModel):
    tracking_number: str = Field(..., min_length=3, max_length=100)
    sender_name: str = Field(..., min_length=1, max_length=255)
    recipient_name: str = Field(..., min_length=1, max_length=255)
    origin: str = Field("Ruwi, Muscat, Oman", max_length=255)
    destination: str = Field(..., min_length=1, max_length=255)
    service_type: str = Field("Air Cargo", max_length=100)
    status: OrderStatus = OrderStatus.PENDING
    current_location: str | None = None
    estimated_delivery: str | None = None
    notes: str | None = None


class OrderUpdate(BaseModel):
    sender_name: str | None = None
    recipient_name: str | None = None
    origin: str | None = None
    destination: str | None = None
    service_type: str | None = None
    status: OrderStatus | None = None
    current_location: str | None = None
    estimated_delivery: str | None = None
    notes: str | None = None


class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    current_location: str | None = None
    notes: str | None = None


class OrderResponse(BaseModel):
    id: int
    tracking_number: str
    sender_name: str
    recipient_name: str
    origin: str
    destination: str
    service_type: str
    status: OrderStatus
    current_location: str | None = None
    estimated_delivery: str | None = None
    notes: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PublicOrderTrackResponse(BaseModel):
    found: bool
    tracking_number: str
    status: OrderStatus | None = None
    service_type: str | None = None
    origin: str | None = None
    destination: str | None = None
    current_location: str | None = None
    estimated_delivery: str | None = None
    last_updated: datetime | None = None
