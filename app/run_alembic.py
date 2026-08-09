from alembic.config import Config
from alembic import command
import os

def run():
    alembic_cfg = Config("alembic.ini")
    print("Generating revision...")
    command.revision(alembic_cfg, message="create_website_content_tables", autogenerate=True)
    print("Upgrading database...")
    command.upgrade(alembic_cfg, "head")

if __name__ == "__main__":
    run()
