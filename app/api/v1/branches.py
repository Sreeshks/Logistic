from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.branch import (
    BranchCreate,
    BranchUpdate,
    BranchResponse,
    BranchContactCreate,
    BranchContactResponse,
)
from app.services import branch_service

public_router = APIRouter(prefix="/public/branches", tags=["Public - Branches"])
admin_router = APIRouter(prefix="/admin/branches", tags=["Admin - Branches"])


@public_router.get("", response_model=list[BranchResponse])
def get_public_branches(db: Session = Depends(get_db)):
    return branch_service.list_branches(db)


@admin_router.get("", response_model=list[BranchResponse])
def get_admin_branches(
    status_filter: str | None = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return branch_service.list_branches(db, status_filter=status_filter)


@admin_router.post("", response_model=BranchResponse, status_code=status.HTTP_201_CREATED)
def create_branch(
    data: BranchCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return branch_service.create_branch(db, data)


@admin_router.put("/{branch_id}", response_model=BranchResponse)
def update_branch(
    branch_id: int,
    data: BranchUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return branch_service.update_branch(db, branch_id, data)


@admin_router.delete("/{branch_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_branch(
    branch_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    branch_service.delete_branch(db, branch_id)


@admin_router.post("/{branch_id}/contacts", response_model=BranchContactResponse, status_code=status.HTTP_201_CREATED)
def add_branch_contact(
    branch_id: int,
    data: BranchContactCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return branch_service.add_branch_contact(db, branch_id, data)


@admin_router.delete("/contacts/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_branch_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    branch_service.delete_branch_contact(db, contact_id)
