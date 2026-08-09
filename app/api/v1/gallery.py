from typing import Any
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.gallery import GalleryCreate, GalleryResponse, GalleryUpdate
from app.services.gallery_service import (
    create_gallery_item,
    delete_gallery_item,
    get_gallery_item_by_id,
    list_gallery_items,
    update_gallery_item,
)
from app.utils.pagination import build_paginated_response
from app.utils.response import success_response

admin_router = APIRouter(prefix="/admin/gallery", tags=["Gallery (Admin)"])
public_router = APIRouter(prefix="/public/gallery", tags=["Gallery (Public)"])


@admin_router.post("", status_code=status.HTTP_201_CREATED)
def create_gallery_item_admin(
    payload: GalleryCreate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    item = create_gallery_item(db, payload)
    return success_response(
        message="Gallery item created successfully",
        data=GalleryResponse.model_validate(item).model_dump(),
    )


@admin_router.get("", status_code=status.HTTP_200_OK)
def list_gallery_items_admin(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    category: str | None = Query(default=None),
    is_featured: bool | None = Query(default=None),
    is_active: bool | None = Query(default=None),
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    items, total = list_gallery_items(
        db, page=page, limit=limit, category=category, is_featured=is_featured, is_active=is_active
    )
    data = [GalleryResponse.model_validate(i).model_dump() for i in items]
    return build_paginated_response(
        items=data,
        total=total,
        page=page,
        limit=limit,
        message="Gallery items retrieved successfully",
    )


@admin_router.get("/{item_id}", status_code=status.HTTP_200_OK)
def get_gallery_item_admin(
    item_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    item = get_gallery_item_by_id(db, item_id)
    return success_response(
        message="Gallery item retrieved successfully",
        data=GalleryResponse.model_validate(item).model_dump(),
    )


@admin_router.put("/{item_id}", status_code=status.HTTP_200_OK)
def update_gallery_item_admin(
    item_id: int,
    payload: GalleryUpdate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    item = update_gallery_item(db, item_id, payload)
    return success_response(
        message="Gallery item updated successfully",
        data=GalleryResponse.model_validate(item).model_dump(),
    )


@admin_router.delete("/{item_id}", status_code=status.HTTP_200_OK)
def delete_gallery_item_admin(
    item_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    delete_gallery_item(db, item_id)
    return success_response(message="Gallery item deleted successfully")


@public_router.get("", status_code=status.HTTP_200_OK)
def list_gallery_items_public(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    category: str | None = Query(default=None),
    is_featured: bool | None = Query(default=None),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    items, total = list_gallery_items(
        db, page=page, limit=limit, category=category, is_featured=is_featured, is_active=True
    )
    data = [GalleryResponse.model_validate(i).model_dump() for i in items]
    return build_paginated_response(
        items=data,
        total=total,
        page=page,
        limit=limit,
        message="Gallery items retrieved successfully",
    )
