import io
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


def test_file_upload_success_and_validation() -> None:
    with TestClient(app) as client:
        headers = get_auth_header(client)

        # Upload valid PNG image
        fake_png_data = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4"
        files = {"file": ("test_logo.png", io.BytesIO(fake_png_data), "image/png")}

        res_upload = client.post("/api/v1/admin/upload", files=files, headers=headers)
        assert res_upload.status_code == 201
        res_json = res_upload.json()
        assert res_json["success"] is True
        url = res_json["data"]["url"]
        assert url.startswith("/uploads/") or url.startswith("https://") or "supabase" in url

        # If local upload, verify static file retrieval
        if url.startswith("/uploads/"):
            res_file = client.get(url)
            assert res_file.status_code == 200
            assert res_file.content == fake_png_data


        # Upload invalid file type
        invalid_files = {"file": ("script.exe", io.BytesIO(b"binary"), "application/octet-stream")}
        res_invalid = client.post("/api/v1/admin/upload", files=invalid_files, headers=headers)
        assert res_invalid.status_code == 400
