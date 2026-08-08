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


def test_gallery_crud_and_public() -> None:
    with TestClient(app) as client:
        headers = get_auth_header(client)

        payload = {
            "title": "Modern Logistics Hub",
            "description": "State of the art distribution center.",
            "image_url": "/uploads/hub.webp",
            "category": "Warehousing",
            "is_featured": True,
            "is_active": True,
        }
        res_create = client.post("/api/v1/admin/gallery", json=payload, headers=headers)
        assert res_create.status_code == 201
        item = res_create.json()["data"]
        item_id = item["id"]

        # Admin get detail
        res_get = client.get(f"/api/v1/admin/gallery/{item_id}", headers=headers)
        assert res_get.status_code == 200

        # Public list
        res_pub = client.get("/api/v1/public/gallery?category=Warehousing")
        assert res_pub.status_code == 200
        assert len(res_pub.json()["data"]) >= 1

        # Delete item
        res_del = client.delete(f"/api/v1/admin/gallery/{item_id}", headers=headers)
        assert res_del.status_code == 200
