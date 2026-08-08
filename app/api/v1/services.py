from typing import Any
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.service import ServiceCreate, ServiceResponse, ServiceUpdate
from app.services.service_service import (
    create_service,
    delete_service,
    get_service_by_id,
    get_service_by_slug,
    list_services,
    update_service,
)
from app.utils.pagination import build_paginated_response
from app.utils.response import success_response

admin_router = APIRouter(prefix="/admin/services", tags=["Services (Admin)"])
public_router = APIRouter(prefix="/public/services", tags=["Services (Public)"])


@admin_router.post("", status_code=status.HTTP_201_CREATED)
def create_service_admin(
    payload: ServiceCreate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    service = create_service(db, payload)
    return success_response(
        message="Service created successfully",
        data=ServiceResponse.model_validate(service).model_dump(),
    )


@admin_router.get("", status_code=status.HTTP_200_OK)
def list_services_admin(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    is_featured: bool | None = Query(default=None),
    is_active: bool | None = Query(default=None),
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    services, total = list_services(
        db, page=page, limit=limit, search=search, is_featured=is_featured, is_active=is_active
    )
    items = [ServiceResponse.model_validate(s).model_dump() for s in services]
    return build_paginated_response(
        items=items,
        total=total,
        page=page,
        limit=limit,
        message="Services retrieved successfully",
    )


@admin_router.get("/{service_id}", status_code=status.HTTP_200_OK)
def get_service_admin(
    service_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    service = get_service_by_id(db, service_id)
    return success_response(
        message="Service retrieved successfully",
        data=ServiceResponse.model_validate(service).model_dump(),
    )


@admin_router.put("/{service_id}", status_code=status.HTTP_200_OK)
def update_service_admin(
    service_id: int,
    payload: ServiceUpdate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    service = update_service(db, service_id, payload)
    return success_response(
        message="Service updated successfully",
        data=ServiceResponse.model_validate(service).model_dump(),
    )


@admin_router.delete("/{service_id}", status_code=status.HTTP_200_OK)
def delete_service_admin(
    service_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    delete_service(db, service_id)
    return success_response(message="Service deleted successfully")


@public_router.get("", status_code=status.HTTP_200_OK)
def list_services_public(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    is_featured: bool | None = Query(default=None),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    services, total = list_services(
        db, page=page, limit=limit, search=search, is_featured=is_featured, is_active=True
    )
    items = [ServiceResponse.model_validate(s).model_dump() for s in services]
    return build_paginated_response(
        items=items,
        total=total,
        page=page,
        limit=limit,
        message="Services retrieved successfully",
    )


@public_router.get("/{slug}", status_code=status.HTTP_200_OK)
def get_service_by_slug_public(
    slug: str,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    service = get_service_by_slug(db, slug, public_only=True)
    return success_response(
        message="Service retrieved successfully",
        data=ServiceResponse.model_validate(service).model_dump(),
    )
