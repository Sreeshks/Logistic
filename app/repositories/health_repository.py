from sqlalchemy import text
from sqlalchemy.orm import Session


class HealthRepository:
    def check_connection(self, db: Session) -> None:
        db.execute(text("SELECT 1"))
