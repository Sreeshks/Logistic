from datetime import datetime
import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Branch(Base):
    __tablename__ = "branches"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True, autoincrement=True)
    company_id: Mapped[int | None] = mapped_column(sa.Integer, sa.ForeignKey("company_info.id", ondelete="CASCADE"), nullable=True)
    name: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    location_description: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    address: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    city: Mapped[str | None] = mapped_column(sa.String(255), nullable=True)
    country: Mapped[str | None] = mapped_column(sa.String(255), nullable=True, default="Oman")
    status: Mapped[str] = mapped_column(sa.String(50), nullable=False, default="ACTIVE")
    is_featured: Mapped[bool] = mapped_column(sa.Boolean, default=False, nullable=False)
    display_order: Mapped[int] = mapped_column(sa.Integer, default=0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False
    )

    company = relationship("Company", back_populates="branches")
    contacts = relationship("BranchContact", back_populates="branch", cascade="all, delete-orphan")


class BranchContact(Base):
    __tablename__ = "branch_contacts"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True, autoincrement=True)
    branch_id: Mapped[int] = mapped_column(sa.Integer, sa.ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    phone: Mapped[str] = mapped_column(sa.String(50), nullable=False)
    country_code: Mapped[str | None] = mapped_column(sa.String(10), nullable=True, default="+968")
    phone_type: Mapped[str | None] = mapped_column(sa.String(50), nullable=True, default="PHONE")
    is_whatsapp: Mapped[bool] = mapped_column(sa.Boolean, default=False, nullable=False)
    is_primary: Mapped[bool] = mapped_column(sa.Boolean, default=False, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False
    )

    branch = relationship("Branch", back_populates="contacts")
