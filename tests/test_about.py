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


def test_about_us_flow() -> None:
    with TestClient(app) as client:
        headers = get_auth_header(client)

        # Get admin about
        res = client.get("/api/v1/admin/about", headers=headers)
        assert res.status_code == 200

        # Update about
        payload = {
            "page_title": "About Our World Class Freight Network",
            "short_description": "Connecting businesses worldwide.",
            "company_story": "Our journey began in 2010...",
            "mission": "Deliver fast, reliable services.",
            "vision": "Lead global logistics innovation.",
            "core_values": "Integrity, Excellence, Safety",
        }
        res_put = client.put("/api/v1/admin/about", json=payload, headers=headers)
        assert res_put.status_code == 200
        assert res_put.json()["data"]["page_title"] == "About Our World Class Freight Network"

        # Check public
        res_pub = client.get("/api/v1/public/about")
        assert res_pub.status_code == 200
        assert res_pub.json()["data"]["page_title"] == "About Our World Class Freight Network"
