import os

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.admin import Admin, AdminRole
from app.schemas.auth import (
    AdminResponse,
    ChangePasswordRequest,
    LoginRequest,
    TokenResponse,
)

settings = get_settings()


def authenticate_admin(db: Session, credentials: LoginRequest) -> Admin:
    """Verify email and password credentials for an Admin."""
    admin = db.query(Admin).filter(Admin.email == credentials.email.lower().strip()).first()
    if not admin or not verify_password(credentials.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin account is inactive",
        )

    return admin


def login_admin(db: Session, credentials: LoginRequest) -> dict:
    """Authenticate admin and return JWT tokens alongside user profile."""
    admin = authenticate_admin(db, credentials)

    access_token = create_access_token(subject=admin.id, role=admin.role.value)
    refresh_token = create_refresh_token(subject=admin.id)

    token_data = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,
    )
    admin_data = AdminResponse.model_validate(admin)

    return {
        "tokens": token_data,
        "user": admin_data,
    }


def refresh_access_token(db: Session, refresh_token_str: str) -> TokenResponse:
    """Issue a new access token and refresh token using a valid refresh token."""
    try:
        payload = decode_token(refresh_token_str)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type for refresh",
        )

    sub = payload.get("sub")
    if not sub or not sub.isdigit():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token subject",
        )

    admin_id = int(sub)
    admin = db.query(Admin).filter(Admin.id == admin_id).first()

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin user not found",
        )

    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin account is inactive",
        )

    new_access_token = create_access_token(subject=admin.id, role=admin.role.value)
    new_refresh_token = create_refresh_token(subject=admin.id)

    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,
    )


def change_admin_password(db: Session, admin: Admin, data: ChangePasswordRequest) -> None:
    """Change current admin's password after validating current password."""
    if not verify_password(data.current_password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password",
        )

    admin.password_hash = hash_password(data.new_password)
    db.add(admin)
    db.commit()


def seed_initial_super_admin(db: Session) -> None:
    """Seed initial Super Admin account if no admins exist in the database."""
    admin_exists = db.query(Admin).first()
    if admin_exists:
        return

    email = os.getenv("INITIAL_ADMIN_EMAIL", "admin@logistics.com").lower().strip()
    password = os.getenv("INITIAL_ADMIN_PASSWORD", "AdminPassword123!")
    name = os.getenv("INITIAL_ADMIN_NAME", "Super Admin")

    super_admin = Admin(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role=AdminRole.SUPER_ADMIN,
        is_active=True,
    )
    db.add(super_admin)
    db.commit()
