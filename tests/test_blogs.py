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


def test_blogs_crud_and_status_filtering() -> None:
    with TestClient(app) as client:
        headers = get_auth_header(client)

        # Create draft blog
        draft_payload = {
            "title": "Future of Green Supply Chains",
            "short_description": "Eco-friendly freight trends in 2026.",
            "content": "Sustainability is driving modern supply chain strategies...",
            "category": "Sustainability",
            "tags": ["green", "sustainability", "eco"],
            "status": "DRAFT",
        }
        res_draft = client.post("/api/v1/admin/blogs", json=draft_payload, headers=headers)
        assert res_draft.status_code == 201
        blog_id = res_draft.json()["data"]["id"]

        # Public list should NOT include DRAFT blog
        res_pub1 = client.get("/api/v1/public/blogs")
        assert not any(b["id"] == blog_id for b in res_pub1.json()["data"])

        # Update blog status to PUBLISHED
        res_pub_update = client.put(
            f"/api/v1/admin/blogs/{blog_id}",
            json={"status": "PUBLISHED", "is_featured": True},
            headers=headers,
        )
        assert res_pub_update.status_code == 200
        assert res_pub_update.json()["data"]["status"] == "PUBLISHED"
        assert res_pub_update.json()["data"]["published_at"] is not None

        # Public list should NOW include PUBLISHED blog
        res_pub2 = client.get("/api/v1/public/blogs")
        assert any(b["id"] == blog_id for b in res_pub2.json()["data"])

        # Public slug lookup
        res_slug = client.get("/api/v1/public/blogs/future-of-green-supply-chains")
        assert res_slug.status_code == 200
        assert res_slug.json()["data"]["id"] == blog_id

        # Delete blog
        res_del = client.delete(f"/api/v1/admin/blogs/{blog_id}", headers=headers)
        assert res_del.status_code == 200
