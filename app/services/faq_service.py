from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status

from app.models.faq import FAQ
from app.schemas.faq import FAQCreate, FAQUpdate


def create_faq(db: Session, data: FAQCreate) -> FAQ:
    faq = FAQ(**data.model_dump())
    db.add(faq)
    db.commit()
    db.refresh(faq)
    return faq


def list_faqs(
    db: Session,
    page: int = 1,
    limit: int = 20,
    search: str | None = None,
    category: str | None = None,
    is_active: bool | None = None,
) -> tuple[list[FAQ], int]:
    query = db.query(FAQ)

    if is_active is not None:
        query = query.filter(FAQ.is_active == is_active)

    if category and category.strip():
        query = query.filter(FAQ.category.ilike(f"%{category.strip()}%"))

    if search and search.strip():
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                FAQ.question.ilike(search_pattern),
                FAQ.answer.ilike(search_pattern),
            )
        )

    total = query.count()
    offset = (page - 1) * limit
    faqs = (
        query.order_by(FAQ.display_order.asc(), FAQ.id.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return faqs, total


def get_faq_by_id(db: Session, faq_id: int) -> FAQ:
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FAQ not found",
        )
    return faq


def update_faq(db: Session, faq_id: int, data: FAQUpdate) -> FAQ:
    faq = get_faq_by_id(db, faq_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(faq, field, value)
    db.commit()
    db.refresh(faq)
    return faq


def delete_faq(db: Session, faq_id: int) -> None:
    faq = get_faq_by_id(db, faq_id)
    db.delete(faq)
    db.commit()
