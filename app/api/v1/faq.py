from typing import Any
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.faq import FAQCreate, FAQResponse, FAQUpdate
from app.services.faq_service import (
    create_faq,
    delete_faq,
    get_faq_by_id,
    list_faqs,
    update_faq,
)
from app.utils.pagination import build_paginated_response
from app.utils.response import success_response

admin_router = APIRouter(prefix="/admin/faqs", tags=["FAQ (Admin)"])
public_router = APIRouter(prefix="/public/faqs", tags=["FAQ (Public)"])


@admin_router.post("", status_code=status.HTTP_201_CREATED)
def create_faq_admin(
    payload: FAQCreate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    faq = create_faq(db, payload)
    return success_response(
        message="FAQ created successfully",
        data=FAQResponse.model_validate(faq).model_dump(),
    )


@admin_router.get("", status_code=status.HTTP_200_OK)
def list_faqs_admin(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    category: str | None = Query(default=None),
    is_active: bool | None = Query(default=None),
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    faqs, total = list_faqs(
        db, page=page, limit=limit, search=search, category=category, is_active=is_active
    )
    items = [FAQResponse.model_validate(f).model_dump() for f in faqs]
    return build_paginated_response(
        items=items,
        total=total,
        page=page,
        limit=limit,
        message="FAQs retrieved successfully",
    )


@admin_router.put("/{faq_id}", status_code=status.HTTP_200_OK)
def update_faq_admin(
    faq_id: int,
    payload: FAQUpdate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    faq = update_faq(db, faq_id, payload)
    return success_response(
        message="FAQ updated successfully",
        data=FAQResponse.model_validate(faq).model_dump(),
    )


@admin_router.delete("/{faq_id}", status_code=status.HTTP_200_OK)
def delete_faq_admin(
    faq_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    delete_faq(db, faq_id)
    return success_response(message="FAQ deleted successfully")


@public_router.get("", status_code=status.HTTP_200_OK)
def list_faqs_public(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    category: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    faqs, total = list_faqs(
        db, page=page, limit=limit, search=search, category=category, is_active=True
    )
    items = [FAQResponse.model_validate(f).model_dump() for f in faqs]
    return build_paginated_response(
        items=items,
        total=total,
        page=page,
        limit=limit,
        message="FAQs retrieved successfully",
    )
