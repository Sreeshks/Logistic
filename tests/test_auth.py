from fastapi.testclient import TestClient
import pytest
from sqlalchemy import text

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.main import app
from app.models.admin import Admin, AdminRole
from app.services.auth_service import seed_initial_super_admin


@pytest.fixture(autouse=True)
def setup_test_db():
    db = SessionLocal()
    try:
        db.execute(text("DELETE FROM admins"))
        db.commit()
        seed_initial_super_admin(db)
    finally:
        db.close()


def test_admin_login_success() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": "admin@logistics.com",
                "password": "AdminPassword123!",
            },
        )
        assert response.status_code == 200
        res = response.json()
        assert res["success"] is True
        assert res["message"] == "Login successful"
        assert "access_token" in res["data"]["tokens"]
        assert "refresh_token" in res["data"]["tokens"]
        assert res["data"]["tokens"]["token_type"] == "bearer"
        assert res["data"]["user"]["email"] == "admin@logistics.com"
        assert res["data"]["user"]["role"] == "SUPER_ADMIN"


def test_admin_login_invalid_password() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": "admin@logistics.com",
                "password": "WrongPassword!",
            },
        )
        assert response.status_code == 401
        res = response.json()
        assert res["success"] is False
        assert res["error_code"] == "HTTP_ERROR"


def test_admin_login_non_existent_email() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": "nonexistent@logistics.com",
                "password": "AdminPassword123!",
            },
        )
        assert response.status_code == 401
        res = response.json()
        assert res["success"] is False


def test_get_me_success() -> None:
    with TestClient(app) as client:
        login_res = client.post(
            "/api/v1/auth/login",
            json={"email": "admin@logistics.com", "password": "AdminPassword123!"},
        ).json()
        access_token = login_res["data"]["tokens"]["access_token"]

        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        assert response.status_code == 200
        res = response.json()
        assert res["success"] is True
        assert res["data"]["email"] == "admin@logistics.com"


def test_get_me_missing_token() -> None:
    with TestClient(app) as client:
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 401
        res = response.json()
        assert res["success"] is False


def test_get_me_invalid_token() -> None:
    with TestClient(app) as client:
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "Bearer invalid.jwt.token"},
        )
        assert response.status_code == 401
        res = response.json()
        assert res["success"] is False


def test_refresh_token_success() -> None:
    with TestClient(app) as client:
        login_res = client.post(
            "/api/v1/auth/login",
            json={"email": "admin@logistics.com", "password": "AdminPassword123!"},
        ).json()
        refresh_token = login_res["data"]["tokens"]["refresh_token"]

        response = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh_token},
        )
        assert response.status_code == 200
        res = response.json()
        assert res["success"] is True
        assert "access_token" in res["data"]
        assert "refresh_token" in res["data"]


def test_refresh_token_with_access_token_fails() -> None:
    with TestClient(app) as client:
        login_res = client.post(
            "/api/v1/auth/login",
            json={"email": "admin@logistics.com", "password": "AdminPassword123!"},
        ).json()
        access_token = login_res["data"]["tokens"]["access_token"]

        response = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": access_token},
        )
        assert response.status_code == 401
        res = response.json()
        assert res["success"] is False


def test_change_password_success_and_relogin() -> None:
    db = SessionLocal()
    try:
        temp_admin = Admin(
            name="Temp Admin",
            email="tempadmin@logistics.com",
            password_hash=hash_password("OldPassword123!"),
            role=AdminRole.ADMIN,
            is_active=True,
        )
        db.add(temp_admin)
        db.commit()
    finally:
        db.close()

    with TestClient(app) as client:
        # Login with temp admin
        login_res = client.post(
            "/api/v1/auth/login",
            json={"email": "tempadmin@logistics.com", "password": "OldPassword123!"},
        ).json()
        access_token = login_res["data"]["tokens"]["access_token"]

        # Change password
        change_res = client.post(
            "/api/v1/auth/change-password",
            json={
                "current_password": "OldPassword123!",
                "new_password": "NewSecretPassword123!",
            },
            headers={"Authorization": f"Bearer {access_token}"},
        )
        assert change_res.status_code == 200
        assert change_res.json()["success"] is True

        # Attempt login with old password (should fail)
        fail_res = client.post(
            "/api/v1/auth/login",
            json={"email": "tempadmin@logistics.com", "password": "OldPassword123!"},
        )
        assert fail_res.status_code == 401

        # Attempt login with new password (should succeed)
        success_res = client.post(
            "/api/v1/auth/login",
            json={"email": "tempadmin@logistics.com", "password": "NewSecretPassword123!"},
        )
        assert success_res.status_code == 200


def test_change_password_wrong_current_password() -> None:
    with TestClient(app) as client:
        login_res = client.post(
            "/api/v1/auth/login",
            json={"email": "admin@logistics.com", "password": "AdminPassword123!"},
        ).json()
        access_token = login_res["data"]["tokens"]["access_token"]

        response = client.post(
            "/api/v1/auth/change-password",
            json={
                "current_password": "WrongCurrentPassword!",
                "new_password": "NewPassword123!",
            },
            headers={"Authorization": f"Bearer {access_token}"},
        )
        assert response.status_code == 400
        assert response.json()["success"] is False


def test_logout_endpoint() -> None:
    with TestClient(app) as client:
        login_res = client.post(
            "/api/v1/auth/login",
            json={"email": "admin@logistics.com", "password": "AdminPassword123!"},
        ).json()
        access_token = login_res["data"]["tokens"]["access_token"]

        response = client.post(
            "/api/v1/auth/logout",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        assert response.status_code == 200
        res = response.json()
        assert res["success"] is True
        assert res["message"] == "Logout successful"
