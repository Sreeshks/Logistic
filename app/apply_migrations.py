from alembic.config import Config
from alembic import command
from app.core.database import Base, engine

def run():
    # Ensure tables in database match models using Alembic upgrade head
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    print("Alembic upgrade head completed successfully.")

if __name__ == "__main__":
    run()
