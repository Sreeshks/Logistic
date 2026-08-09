from datetime import datetime
import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Company(Base):
    __tablename__ = "company_info"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(sa.String(255), nullable=False, default="White Star Cargo")
    arabic_name: Mapped[str | None] = mapped_column(sa.String(255), nullable=True)
    business_type: Mapped[str | None] = mapped_column(sa.String(255), nullable=True, default="Cargo & Logistics")
    country: Mapped[str | None] = mapped_column(sa.String(255), nullable=True, default="Oman")
    logo: Mapped[str | None] = mapped_column(sa.String(500), nullable=True)
    favicon: Mapped[str | None] = mapped_column(sa.String(500), nullable=True)
    tagline: Mapped[str | None] = mapped_column(sa.String(255), nullable=True)
    short_description: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    full_description: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    phone: Mapped[str | None] = mapped_column(sa.String(50), nullable=True)
    whatsapp: Mapped[str | None] = mapped_column(sa.String(50), nullable=True)
    email: Mapped[str | None] = mapped_column(sa.String(255), nullable=True)
    address: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    google_maps_url: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    working_hours: Mapped[str | None] = mapped_column(sa.String(255), nullable=True)

    # Social Media (kept null by default as per client prompt)
    facebook: Mapped[str | None] = mapped_column(sa.String(255), nullable=True)
    instagram: Mapped[str | None] = mapped_column(sa.String(255), nullable=True)
    linkedin: Mapped[str | None] = mapped_column(sa.String(255), nullable=True)
    youtube: Mapped[str | None] = mapped_column(sa.String(255), nullable=True)
    twitter: Mapped[str | None] = mapped_column(sa.String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False
    )

    branches = relationship("Branch", back_populates="company", cascade="all, delete-orphan")
    company_contacts = relationship("CompanyContact", back_populates="company", cascade="all, delete-orphan")
