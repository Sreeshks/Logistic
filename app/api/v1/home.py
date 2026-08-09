from typing import Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.home import (
    HomeHeroResponse,
    HomeHeroUpdate,
    CompanyStatisticCreate,
    CompanyStatisticUpdate,
    CompanyStatisticResponse,
)
from app.schemas.service import ServiceResponse
from app.schemas.gallery import GalleryResponse
from app.schemas.blog import BlogResponse
from app.services.home_service import (
    get_or_create_home_hero,
    update_home_hero,
    list_company_statistics,
    create_company_statistic,
    update_company_statistic,
    delete_company_statistic,
    get_public_home_data,
)
from app.utils.response import success_response

admin_router = APIRouter(prefix="/admin/home", tags=["Home (Admin)"])
public_router = APIRouter(prefix="/public/home", tags=["Home (Public)"])


@admin_router.get("", status_code=status.HTTP_200_OK)
def get_home_hero_admin(db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)) -> dict[str, Any]:
    hero = get_or_create_home_hero(db)
    return success_response(
        message="Home hero section retrieved successfully",
        data=HomeHeroResponse.model_validate(hero).model_dump(),
    )


@admin_router.put("", status_code=status.HTTP_200_OK)
def update_home_hero_admin(
    payload: HomeHeroUpdate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    hero = update_home_hero(db, payload)
    return success_response(
        message="Home hero section updated successfully",
        data=HomeHeroResponse.model_validate(hero).model_dump(),
    )


@admin_router.get("/statistics", status_code=status.HTTP_200_OK)
def list_statistics_admin(db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)) -> dict[str, Any]:
    stats = list_company_statistics(db, active_only=False)
    data = [CompanyStatisticResponse.model_validate(s).model_dump() for s in stats]
    return success_response(message="Company statistics retrieved successfully", data=data)


@admin_router.post("/statistics", status_code=status.HTTP_201_CREATED)
def create_statistic_admin(
    payload: CompanyStatisticCreate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    stat = create_company_statistic(db, payload)
    return success_response(
        message="Company statistic created successfully",
        data=CompanyStatisticResponse.model_validate(stat).model_dump(),
    )


@admin_router.put("/statistics/{stat_id}", status_code=status.HTTP_200_OK)
def update_statistic_admin(
    stat_id: int,
    payload: CompanyStatisticUpdate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    stat = update_company_statistic(db, stat_id, payload)
    return success_response(
        message="Company statistic updated successfully",
        data=CompanyStatisticResponse.model_validate(stat).model_dump(),
    )


@admin_router.delete("/statistics/{stat_id}", status_code=status.HTTP_200_OK)
def delete_statistic_admin(
    stat_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    delete_company_statistic(db, stat_id)
    return success_response(message="Company statistic deleted successfully")


@public_router.get("", status_code=status.HTTP_200_OK)
def get_home_public(db: Session = Depends(get_db)) -> dict[str, Any]:
    home_data = get_public_home_data(db)
    formatted = {
        "hero": HomeHeroResponse.model_validate(home_data["hero"]).model_dump() if home_data["hero"] else None,
        "statistics": [CompanyStatisticResponse.model_validate(s).model_dump() for s in home_data["statistics"]],
        "featured_services": [ServiceResponse.model_validate(s).model_dump() for s in home_data["featured_services"]],
        "featured_gallery": [GalleryResponse.model_validate(g).model_dump() for g in home_data["featured_gallery"]],
        "featured_blogs": [BlogResponse.model_validate(b).model_dump() for b in home_data["featured_blogs"]],
    }
    return success_response(message="Home page data retrieved successfully", data=formatted)
