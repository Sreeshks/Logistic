import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Force local sqlite test database for all pytest tests
TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(bind=test_engine, autocommit=False, autoflush=False)

from app.core.database import Base, get_db
import app.models  # Register all models
from app.main import app
from app.services.auth_service import seed_initial_super_admin
from app.seed import seed_database

@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Create all tables in memory SQLite once for test session and override get_db dependency."""
    Base.metadata.create_all(bind=test_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=test_engine)

@pytest.fixture(autouse=True)
def init_test_data():
    """Ensure super admin is seeded for test cases."""
    db = TestingSessionLocal()
    try:
        seed_initial_super_admin(db)
    finally:
        db.close()
