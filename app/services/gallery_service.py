from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status

from app.models.gallery import GalleryItem
from app.schemas.gallery import GalleryCreate, GalleryUpdate


def create_gallery_item(db: Session, data: GalleryCreate) -> GalleryItem:
    item = GalleryItem(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def list_gallery_items(
    db: Session,
    page: int = 1,
    limit: int = 20,
    category: str | None = None,
    is_featured: bool | None = None,
    is_active: bool | None = None,
) -> tuple[list[GalleryItem], int]:
    query = db.query(GalleryItem)

    if is_active is not None:
        query = query.filter(GalleryItem.is_active == is_active)

    if is_featured is not None:
        query = query.filter(GalleryItem.is_featured == is_featured)

    if category and category.strip():
        query = query.filter(GalleryItem.category.ilike(f"%{category.strip()}%"))

    total = query.count()
    offset = (page - 1) * limit
    items = (
        query.order_by(GalleryItem.display_order.asc(), GalleryItem.id.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return items, total


def get_gallery_item_by_id(db: Session, item_id: int) -> GalleryItem:
    item = db.query(GalleryItem).filter(GalleryItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery item not found",
        )
    return item


def update_gallery_item(db: Session, item_id: int, data: GalleryUpdate) -> GalleryItem:
    item = get_gallery_item_by_id(db, item_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


def delete_gallery_item(db: Session, item_id: int) -> None:
    item = get_gallery_item_by_id(db, item_id)
    db.delete(item)
    db.commit()
