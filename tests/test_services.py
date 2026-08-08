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


def test_services_crud_and_public_access() -> None:
    with TestClient(app) as client:
        headers = get_auth_header(client)

        # Create service
        service_payload = {
            "title": "Air Freight Delivery",
            "short_description": "Rapid global air transportation.",
            "description": "Comprehensive airport-to-airport and door-to-door air freight services.",
            "icon": "plane",
            "is_featured": True,
            "is_active": True,
            "meta_title": "Air Freight Services",
            "meta_description": "Fast air cargo transport",
        }
        res_create = client.post("/api/v1/admin/services", json=service_payload, headers=headers)
        assert res_create.status_code == 201
        created = res_create.json()["data"]
        assert created["title"] == "Air Freight Delivery"
        assert created["slug"] == "air-freight-delivery"
        service_id = created["id"]

        # List admin services
        res_list = client.get("/api/v1/admin/services", headers=headers)
        assert res_list.status_code == 200
        assert res_list.json()["pagination"]["total"] >= 1

        # Public service list
        res_pub_list = client.get("/api/v1/public/services")
        assert res_pub_list.status_code == 200
        assert len(res_pub_list.json()["data"]) >= 1

        # Public get by slug
        res_slug = client.get("/api/v1/public/services/air-freight-delivery")
        assert res_slug.status_code == 200
        assert res_slug.json()["data"]["id"] == service_id

        # Update service
        res_update = client.put(
            f"/api/v1/admin/services/{service_id}",
            json={"title": "Express Air Freight", "is_featured": False},
            headers=headers,
        )
        assert res_update.status_code == 200
        assert res_update.json()["data"]["title"] == "Express Air Freight"

        # Delete service
        res_del = client.delete(f"/api/v1/admin/services/{service_id}", headers=headers)
        assert res_del.status_code == 200

        # Public lookup after delete returns 404
        res_404 = client.get("/api/v1/public/services/air-freight-delivery")
        assert res_404.status_code == 404
