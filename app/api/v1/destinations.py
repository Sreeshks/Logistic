from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.destination import (
    DestinationCreate,
    DestinationUpdate,
    DestinationResponse,
)
from app.services import destination_service

public_router = APIRouter(prefix="/public/destinations", tags=["Public - Destinations"])
admin_router = APIRouter(prefix="/admin/destinations", tags=["Admin - Destinations"])


@public_router.get("", response_model=list[DestinationResponse])
def get_public_destinations(db: Session = Depends(get_db)):
    return destination_service.list_destinations(db, only_active=True)


@admin_router.get("", response_model=list[DestinationResponse])
def get_admin_destinations(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return destination_service.list_destinations(db, only_active=False)


@admin_router.post("", response_model=DestinationResponse, status_code=status.HTTP_201_CREATED)
def create_destination(
    data: DestinationCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return destination_service.create_destination(db, data)


@admin_router.put("/{dest_id}", response_model=DestinationResponse)
def update_destination(
    dest_id: int,
    data: DestinationUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return destination_service.update_destination(db, dest_id, data)


@admin_router.delete("/{dest_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_destination(
    dest_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    destination_service.delete_destination(db, dest_id)
