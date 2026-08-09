from typing import Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.about import AboutResponse, AboutUpdate
from app.services.about_service import get_or_create_about, update_about
from app.utils.response import success_response

admin_router = APIRouter(prefix="/admin/about", tags=["About Us (Admin)"])
public_router = APIRouter(prefix="/public/about", tags=["About Us (Public)"])


@admin_router.get("", status_code=status.HTTP_200_OK)
def get_about_admin(db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)) -> dict[str, Any]:
    about = get_or_create_about(db)
    return success_response(
        message="About Us content retrieved successfully",
        data=AboutResponse.model_validate(about).model_dump(),
    )


@admin_router.put("", status_code=status.HTTP_200_OK)
def update_about_admin(
    payload: AboutUpdate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    about = update_about(db, payload)
    return success_response(
        message="About Us content updated successfully",
        data=AboutResponse.model_validate(about).model_dump(),
    )


@public_router.get("", status_code=status.HTTP_200_OK)
def get_about_public(db: Session = Depends(get_db)) -> dict[str, Any]:
    about = get_or_create_about(db)
    return success_response(
        message="About Us content retrieved successfully",
        data=AboutResponse.model_validate(about).model_dump(),
    )
