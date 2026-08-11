from datetime import datetime, date
import enum
import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    PICKED_UP = "PICKED_UP"
    IN_TRANSIT = "IN_TRANSIT"
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True, autoincrement=True)
    tracking_number: Mapped[str] = mapped_column(sa.String(100), unique=True, index=True, nullable=False)
    sender_name: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    recipient_name: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    origin: Mapped[str] = mapped_column(sa.String(255), nullable=False, default="Ruwi, Muscat, Oman")
    destination: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    service_type: Mapped[str] = mapped_column(sa.String(100), nullable=False, default="Air Cargo")
    status: Mapped[OrderStatus] = mapped_column(sa.Enum(OrderStatus), nullable=False, default=OrderStatus.PENDING)
    current_location: Mapped[str | None] = mapped_column(sa.String(255), nullable=True)
    estimated_delivery: Mapped[str | None] = mapped_column(sa.String(100), nullable=True)
    notes: Mapped[str | None] = mapped_column(sa.Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False
    )
