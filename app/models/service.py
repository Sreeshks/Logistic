from datetime import datetime
import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    slug: Mapped[str] = mapped_column(sa.String(255), unique=True, index=True, nullable=False)
    short_description: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    description: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    icon: Mapped[str | None] = mapped_column(sa.String(100), nullable=True)
    image: Mapped[str | None] = mapped_column(sa.String(500), nullable=True)
    display_order: Mapped[int] = mapped_column(sa.Integer, default=0, nullable=False)
    is_featured: Mapped[bool] = mapped_column(sa.Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(sa.Boolean, default=True, nullable=False)

    # SEO metadata
    meta_title: Mapped[str | None] = mapped_column(sa.String(255), nullable=True)
    meta_description: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    og_title: Mapped[str | None] = mapped_column(sa.String(255), nullable=True)
    og_description: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    og_image: Mapped[str | None] = mapped_column(sa.String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False
    )
