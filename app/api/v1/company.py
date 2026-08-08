from typing import Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.company import CompanyResponse, CompanyUpdate
from app.services.company_service import get_or_create_company, update_company
from app.utils.response import success_response

admin_router = APIRouter(prefix="/admin/company", tags=["Company (Admin)"])
public_router = APIRouter(prefix="/public/company", tags=["Company (Public)"])


@admin_router.get("", status_code=status.HTTP_200_OK)
def get_company_admin(db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)) -> dict[str, Any]:
    company = get_or_create_company(db)
    return success_response(
        message="Company information retrieved successfully",
        data=CompanyResponse.model_validate(company).model_dump(),
    )


@admin_router.put("", status_code=status.HTTP_200_OK)
def update_company_admin(
    payload: CompanyUpdate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    company = update_company(db, payload)
    return success_response(
        message="Company information updated successfully",
        data=CompanyResponse.model_validate(company).model_dump(),
    )


@public_router.get("", status_code=status.HTTP_200_OK)
def get_company_public(db: Session = Depends(get_db)) -> dict[str, Any]:
    company = get_or_create_company(db)
    return success_response(
        message="Company information retrieved successfully",
        data=CompanyResponse.model_validate(company).model_dump(),
    )
