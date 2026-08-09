from datetime import datetime
import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class CompanyContact(Base):
    __tablename__ = "company_contacts"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True, autoincrement=True)
    company_id: Mapped[int | None] = mapped_column(sa.Integer, sa.ForeignKey("company_info.id", ondelete="CASCADE"), nullable=True)
    type: Mapped[str] = mapped_column(sa.String(50), nullable=False)  # PHONE, WHATSAPP, EMAIL
    value: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    label: Mapped[str | None] = mapped_column(sa.String(255), nullable=True)
    is_primary: Mapped[bool] = mapped_column(sa.Boolean, default=False, nullable=False)
    is_public: Mapped[bool] = mapped_column(sa.Boolean, default=True, nullable=False)
    display_order: Mapped[int] = mapped_column(sa.Integer, default=0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False
    )

    company = relationship("Company", back_populates="company_contacts")
