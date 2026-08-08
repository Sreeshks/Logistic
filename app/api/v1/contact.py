from typing import Any
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.models.contact import ContactStatus
from app.schemas.contact import (
    ContactMessageResponse,
    ContactStatusUpdate,
    ContactSubmitRequest,
)
from app.services.contact_service import (
    delete_contact_message,
    get_contact_message_by_id,
    list_contact_messages,
    submit_contact_message,
    update_contact_status,
)
from app.utils.pagination import build_paginated_response
from app.utils.response import success_response

admin_router = APIRouter(prefix="/admin/contact", tags=["Contact (Admin)"])
public_router = APIRouter(prefix="/public/contact", tags=["Contact (Public)"])


@public_router.post("", status_code=status.HTTP_201_CREATED)
def submit_contact_form(
    payload: ContactSubmitRequest,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    msg = submit_contact_message(db, payload)
    return success_response(
        message="Thank you! Your message has been received successfully.",
        data=ContactMessageResponse.model_validate(msg).model_dump(),
    )


@admin_router.get("", status_code=status.HTTP_200_OK)
def list_contact_messages_admin(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    contact_status: ContactStatus | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    messages, total = list_contact_messages(
        db, page=page, limit=limit, search=search, contact_status=contact_status
    )
    items = [ContactMessageResponse.model_validate(m).model_dump() for m in messages]
    return build_paginated_response(
        items=items,
        total=total,
        page=page,
        limit=limit,
        message="Contact messages retrieved successfully",
    )


@admin_router.get("/{message_id}", status_code=status.HTTP_200_OK)
def get_contact_message_admin(
    message_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    msg = get_contact_message_by_id(db, message_id)
    return success_response(
        message="Contact message retrieved successfully",
        data=ContactMessageResponse.model_validate(msg).model_dump(),
    )


@admin_router.patch("/{message_id}/status", status_code=status.HTTP_200_OK)
def update_contact_status_admin(
    message_id: int,
    payload: ContactStatusUpdate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    msg = update_contact_status(db, message_id, payload)
    return success_response(
        message="Contact message status updated successfully",
        data=ContactMessageResponse.model_validate(msg).model_dump(),
    )


@admin_router.delete("/{message_id}", status_code=status.HTTP_200_OK)
def delete_contact_message_admin(
    message_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    delete_contact_message(db, message_id)
    return success_response(message="Contact message deleted successfully")
