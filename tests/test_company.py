from fastapi.testclient import TestClient
import pytest
from app.main import app

def get_auth_header(client: TestClient) -> dict[str, str]:
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@logistics.com", "password": "AdminPassword123!"},
    ).json()
    token = login_res["data"]["tokens"]["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_public_company_info() -> None:
    with TestClient(app) as client:
        res = client.get("/api/v1/public/company")
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert "name" in data["data"]


def test_admin_get_and_update_company() -> None:
    with TestClient(app) as client:
        headers = get_auth_header(client)

        # Get
        res_get = client.get("/api/v1/admin/company", headers=headers)
        assert res_get.status_code == 200

        # Update
        update_payload = {
            "name": "Updated Logistics Inc",
            "tagline": "Fast & Reliable Freight",
            "phone": "+1 800 123 4567",
            "email": "info@updatedlogistics.com",
            "facebook": "https://facebook.com/updated",
        }
        res_put = client.put("/api/v1/admin/company", json=update_payload, headers=headers)
        assert res_put.status_code == 200
        updated = res_put.json()
        assert updated["success"] is True
        assert updated["data"]["name"] == "Updated Logistics Inc"
        assert updated["data"]["email"] == "info@updatedlogistics.com"

        # Public API reflects changes
        res_pub = client.get("/api/v1/public/company")
        assert res_pub.json()["data"]["name"] == "Updated Logistics Inc"
