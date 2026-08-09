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


def test_contact_form_submission_and_admin_management() -> None:
    with TestClient(app) as client:
        headers = get_auth_header(client)

        # Submit contact form
        contact_payload = {
            "name": "Jane Smith",
            "email": "jane@example.com",
            "phone": "+1 555 999 8888",
            "subject": "Bulk Freight Rate Inquiry",
            "message": "Interested in shipping 10 containers from NY to London.",
        }
        res_submit = client.post("/api/v1/public/contact", json=contact_payload)
        assert res_submit.status_code == 201
        msg = res_submit.json()["data"]
        assert msg["status"] == "NEW"
        msg_id = msg["id"]

        # Admin list contact messages
        res_list = client.get("/api/v1/admin/contact", headers=headers)
        assert res_list.status_code == 200
        assert any(m["id"] == msg_id for m in res_list.json()["data"])

        # Admin get message detail
        res_get = client.get(f"/api/v1/admin/contact/{msg_id}", headers=headers)
        assert res_get.status_code == 200
        assert res_get.json()["data"]["email"] == "jane@example.com"

        # Admin update status
        res_patch = client.patch(
            f"/api/v1/admin/contact/{msg_id}/status",
            json={"status": "IN_PROGRESS"},
            headers=headers,
        )
        assert res_patch.status_code == 200
        assert res_patch.json()["data"]["status"] == "IN_PROGRESS"

        # Admin delete message
        res_del = client.delete(f"/api/v1/admin/contact/{msg_id}", headers=headers)
        assert res_del.status_code == 200
