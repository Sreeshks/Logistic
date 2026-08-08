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


def test_faq_crud_and_public() -> None:
    with TestClient(app) as client:
        headers = get_auth_header(client)

        faq_payload = {
            "question": "How can I request a shipment quote?",
            "answer": "You can contact our sales team using the contact form or call our direct line.",
            "category": "General",
            "is_active": True,
        }
        res_create = client.post("/api/v1/admin/faqs", json=faq_payload, headers=headers)
        assert res_create.status_code == 201
        faq_id = res_create.json()["data"]["id"]

        # Public list
        res_pub = client.get("/api/v1/public/faqs")
        assert res_pub.status_code == 200
        assert any(f["id"] == faq_id for f in res_pub.json()["data"])

        # Update FAQ
        res_put = client.put(f"/api/v1/admin/faqs/{faq_id}", json={"question": "How to get a quote?"}, headers=headers)
        assert res_put.status_code == 200

        # Delete FAQ
        res_del = client.delete(f"/api/v1/admin/faqs/{faq_id}", headers=headers)
        assert res_del.status_code == 200
