from datetime import datetime
from enum import Enum
import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ContactStatus(str, Enum):
    NEW = "NEW"
    READ = "READ"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    SPAM = "SPAM"


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    email: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    phone: Mapped[str] = mapped_column(sa.String(50), nullable=False)
    subject: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    message: Mapped[str] = mapped_column(sa.Text, nullable=False)
    status: Mapped[ContactStatus] = mapped_column(
        sa.Enum(ContactStatus, native_enum=False, values_callable=lambda obj: [e.value for e in obj]),
        default=ContactStatus.NEW,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False
    )
