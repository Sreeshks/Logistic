from datetime import datetime, timedelta, timezone
from typing import Any

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError
import jwt

from app.core.config import get_settings

settings = get_settings()
ph = PasswordHasher()
JWT_ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    """Hash a plaintext password using Argon2id."""
    return ph.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against an Argon2id hash."""
    try:
        return ph.verify(hashed_password, plain_password)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False


def create_token(
    subject: str | int,
    token_type: str,
    expires_delta: timedelta,
    additional_claims: dict[str, Any] | None = None,
) -> str:
    """Generate a JWT token with subject, type, and expiration."""
    now = datetime.now(timezone.utc)
    expire = now + expires_delta

    payload = {
        "sub": str(subject),
        "type": token_type,
        "iat": now,
        "exp": expire,
    }
    if additional_claims:
        payload.update(additional_claims)

    return jwt.encode(payload, settings.secret_key, algorithm=JWT_ALGORITHM)


def create_access_token(
    subject: str | int,
    role: str,
    expires_delta: timedelta | None = None,
) -> str:
    """Create a short-lived access JWT token."""
    delta = expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    return create_token(
        subject=subject,
        token_type="access",
        expires_delta=delta,
        additional_claims={"role": role},
    )


def create_refresh_token(
    subject: str | int,
    expires_delta: timedelta | None = None,
) -> str:
    """Create a long-lived refresh JWT token."""
    delta = expires_delta or timedelta(days=settings.refresh_token_expire_days)
    return create_token(
        subject=subject,
        token_type="refresh",
        expires_delta=delta,
    )


def decode_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT token. Raises ValueError on invalid/expired token."""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
