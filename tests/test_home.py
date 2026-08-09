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


def test_home_hero_and_statistics() -> None:
    with TestClient(app) as client:
        headers = get_auth_header(client)

        # Update hero
        hero_payload = {
            "title": "Global Shipping Solutions",
            "subtitle": "Connecting Continents",
            "description": "Seamless air, sea, and land transportation.",
            "button_text": "Get a Quote",
            "button_url": "/contact",
        }
        res_hero = client.put("/api/v1/admin/home", json=hero_payload, headers=headers)
        assert res_hero.status_code == 200
        assert res_hero.json()["data"]["title"] == "Global Shipping Solutions"

        # Create statistic
        stat_payload = {
            "label": "Years Experience",
            "value": "20+",
            "icon": "clock",
            "display_order": 1,
            "is_active": True,
        }
        res_stat = client.post("/api/v1/admin/home/statistics", json=stat_payload, headers=headers)
        assert res_stat.status_code == 201
        stat_id = res_stat.json()["data"]["id"]

        # Get public home
        res_pub = client.get("/api/v1/public/home")
        assert res_pub.status_code == 200
        pub_data = res_pub.json()["data"]
        assert pub_data["hero"]["title"] == "Global Shipping Solutions"
        assert any(s["label"] == "Years Experience" for s in pub_data["statistics"])

        # Delete statistic
        res_del = client.delete(f"/api/v1/admin/home/statistics/{stat_id}", headers=headers)
        assert res_del.status_code == 200
