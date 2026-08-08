from sqlalchemy.orm import Session

from app.repositories.health_repository import HealthRepository


class HealthService:
    def __init__(self, repository: HealthRepository | None = None) -> None:
        self.repository = repository or HealthRepository()

    def check_database(self, db: Session) -> None:
        self.repository.check_connection(db)
