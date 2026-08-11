from datetime import datetime
import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class HomeHero(Base):
    __tablename__ = "home_hero"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(sa.String(255), nullable=False, default="WHITE STAR CARGO")
    subtitle: Mapped[str | None] = mapped_column(sa.String(255), nullable=True, default="Door to Door Cargo & Logistics Services")
    description: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    button_text: Mapped[str | None] = mapped_column(sa.String(100), nullable=True, default="Contact Us")
    button_url: Mapped[str | None] = mapped_column(sa.String(255), nullable=True, default="/contact")
    secondary_button_text: Mapped[str | None] = mapped_column(sa.String(100), nullable=True, default="Our Services")
    secondary_button_url: Mapped[str | None] = mapped_column(sa.String(255), nullable=True, default="/services")
    background_image: Mapped[str | None] = mapped_column(sa.String(500), nullable=True)
    banner_images: Mapped[str | None] = mapped_column(sa.Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False
    )


class CompanyStatistic(Base):
    __tablename__ = "company_statistics"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True, autoincrement=True)
    label: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    value: Mapped[str] = mapped_column(sa.String(50), nullable=False)
    icon: Mapped[str | None] = mapped_column(sa.String(100), nullable=True)
    display_order: Mapped[int] = mapped_column(sa.Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(sa.Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False
    )
