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


def test_admin_dashboard_stats() -> None:
    with TestClient(app) as client:
        headers = get_auth_header(client)

        res = client.get("/api/v1/admin/dashboard", headers=headers)
        assert res.status_code == 200
        data = res.json()["data"]
        assert "total_services" in data
        assert "total_blogs" in data
        assert "published_blogs" in data
        assert "total_gallery_items" in data
        assert "total_faqs" in data
        assert "total_contact_messages" in data
        assert "new_contact_messages" in data
        assert "recent_contact_messages" in data
        assert "recent_blogs" in data
        assert "recent_services" in data
