from fastapi.testclient import TestClient

from app.main import app


def test_health_endpoint_returns_standard_success_response() -> None:
    response = TestClient(app).get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "message": "API is running",
    }


def test_database_health_endpoint_reports_connected_database() -> None:
    response = TestClient(app).get("/api/v1/health/database")

    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "message": "Database connection is healthy",
    }


def test_unhandled_http_path_returns_safe_standard_error() -> None:
    response = TestClient(app).get("/api/v1/not-a-route")

    assert response.status_code == 404
    assert response.json() == {
        "success": False,
        "message": "Resource not found",
        "error_code": "NOT_FOUND",
    }
