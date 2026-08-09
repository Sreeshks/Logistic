from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import database_session
from app.services.health_service import HealthService
from app.utils.response import success_response

router = APIRouter(tags=["System"])
health_service = HealthService()


@router.get("/health", summary="Application health check")
def health_check() -> dict:
    return success_response("API is running")


@router.get("/health/database", summary="Database connectivity health check")
def database_health_check(db: Session = Depends(database_session)) -> dict:
    health_service.check_database(db)
    return success_response("Database connection is healthy")
