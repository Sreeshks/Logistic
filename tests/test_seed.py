import pytest
from app.seed import seed_database
from app.core.database import SessionLocal
from app.models.admin import Admin
from app.models.company import Company
from app.models.home import HomeHero, CompanyStatistic
from app.models.about import About
from app.models.service import Service
from app.models.gallery import GalleryItem
from app.models.blog import Blog
from app.models.faq import FAQ
from app.models.contact import ContactMessage


def test_seed_database_populates_all_tables() -> None:
    seed_database()
    db = SessionLocal()
    try:
        assert db.query(Admin).filter(Admin.email == "admin@logistics.com").first() is not None
        assert db.query(Company).first() is not None
        assert db.query(HomeHero).first() is not None
        assert db.query(CompanyStatistic).count() >= 4
        assert db.query(About).first() is not None
        assert db.query(Service).count() >= 4
        assert db.query(GalleryItem).count() >= 3
        assert db.query(Blog).count() >= 2
        assert db.query(FAQ).count() >= 3
        assert db.query(ContactMessage).count() >= 1
    finally:
        db.close()
