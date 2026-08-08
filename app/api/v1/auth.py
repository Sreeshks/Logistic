from typing import Any

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.auth import (
    AdminResponse,
    ChangePasswordRequest,
    LoginRequest,
    RefreshTokenRequest,
)
from app.services.auth_service import (
    change_admin_password,
    login_admin,
    refresh_access_token,
)
from app.utils.response import success_response

router = APIRouter()


@router.post("/login", status_code=status.HTTP_200_OK)
def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    """Admin login endpoint returning access token, refresh token, and admin profile."""
    auth_data = login_admin(db, credentials)
    return success_response(
        message="Login successful",
        data={
            "tokens": auth_data["tokens"].model_dump(),
            "user": auth_data["user"].model_dump(),
        },
    )


@router.post("/refresh", status_code=status.HTTP_200_OK)
def refresh_token(
    payload: RefreshTokenRequest,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    """Refresh access token using a valid refresh token."""
    new_tokens = refresh_access_token(db, payload.refresh_token)
    return success_response(
        message="Token refreshed successfully",
        data=new_tokens.model_dump(),
    )


@router.get("/me", status_code=status.HTTP_200_OK)
def get_me(
    current_admin: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    """Retrieve authenticated admin profile."""
    admin_data = AdminResponse.model_validate(current_admin)
    return success_response(
        message="Admin profile retrieved successfully",
        data=admin_data.model_dump(),
    )


@router.post("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    payload: ChangePasswordRequest,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    """Change authenticated admin password."""
    change_admin_password(db, current_admin, payload)
    return success_response(message="Password updated successfully")


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(
    current_admin: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    """Stateless logout endpoint."""
    return success_response(message="Logout successful")
