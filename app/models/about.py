from datetime import datetime
import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class About(Base):
    __tablename__ = "about_us"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True, autoincrement=True)
    page_title: Mapped[str] = mapped_column(sa.String(255), nullable=False, default="About Our Logistics Company")
    short_description: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    company_story: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    mission: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    vision: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    core_values: Mapped[str | None] = mapped_column(sa.Text, nullable=True)  # Store as JSON array or text
    about_image: Mapped[str | None] = mapped_column(sa.String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False
    )
