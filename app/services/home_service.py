from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.home import HomeHero, CompanyStatistic
from app.models.service import Service
from app.models.gallery import GalleryItem
from app.models.blog import Blog, BlogStatus
from app.models.branch import Branch
from app.models.destination import Destination
from app.schemas.home import (
    HomeHeroUpdate,
    CompanyStatisticCreate,
    CompanyStatisticUpdate,
)


def get_or_create_home_hero(db: Session) -> HomeHero:
    hero = db.query(HomeHero).first()
    if not hero:
        hero = HomeHero(
            title="WHITE STAR CARGO",
            subtitle="Door to Door Cargo & Logistics Services",
            description="Worldwide Air & Sea Cargo, Professional Packing & Shifting, and Long & Short Time Storage Facilities.",
            button_text="Contact Us",
            button_url="/contact",
            secondary_button_text="Our Services",
            secondary_button_url="/services",
            background_image="/uploads/hero_bg.jpg",
        )
        db.add(hero)
        db.commit()
        db.refresh(hero)
    return hero


def update_home_hero(db: Session, update_data: HomeHeroUpdate) -> HomeHero:
    hero = get_or_create_home_hero(db)
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(hero, field, value)
    db.commit()
    db.refresh(hero)
    return hero


def list_company_statistics(db: Session, active_only: bool = False) -> list[CompanyStatistic]:
    query = db.query(CompanyStatistic)
    if active_only:
        query = query.filter(CompanyStatistic.is_active.is_(True))
    return query.order_by(CompanyStatistic.display_order.asc(), CompanyStatistic.id.asc()).all()


def create_company_statistic(db: Session, data: CompanyStatisticCreate) -> CompanyStatistic:
    stat = CompanyStatistic(**data.model_dump())
    db.add(stat)
    db.commit()
    db.refresh(stat)
    return stat


def update_company_statistic(db: Session, stat_id: int, data: CompanyStatisticUpdate) -> CompanyStatistic:
    stat = db.query(CompanyStatistic).filter(CompanyStatistic.id == stat_id).first()
    if not stat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company statistic not found",
        )
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(stat, field, value)
    db.commit()
    db.refresh(stat)
    return stat


def delete_company_statistic(db: Session, stat_id: int) -> None:
    stat = db.query(CompanyStatistic).filter(CompanyStatistic.id == stat_id).first()
    if not stat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company statistic not found",
        )
    db.delete(stat)
    db.commit()


def get_public_home_data(db: Session) -> dict:
    hero = get_or_create_home_hero(db)
    statistics = list_company_statistics(db, active_only=True)
    featured_services = (
        db.query(Service)
        .filter(Service.is_active.is_(True))
        .order_by(Service.display_order.asc(), Service.id.asc())
        .all()
    )
    featured_gallery = (
        db.query(GalleryItem)
        .filter(GalleryItem.is_active.is_(True), GalleryItem.is_featured.is_(True))
        .order_by(GalleryItem.display_order.asc(), GalleryItem.id.asc())
        .limit(8)
        .all()
    )
    featured_blogs = (
        db.query(Blog)
        .filter(Blog.status == BlogStatus.PUBLISHED, Blog.is_featured.is_(True))
        .order_by(Blog.published_at.desc(), Blog.created_at.desc())
        .limit(3)
        .all()
    )

    branches = (
        db.query(Branch)
        .order_by(Branch.display_order.asc(), Branch.id.asc())
        .all()
    )

    destinations = (
        db.query(Destination)
        .filter(Destination.is_active.is_(True))
        .order_by(Destination.display_order.asc(), Destination.id.asc())
        .all()
    )

    highlights = [
        {"title": "Worldwide Air & Sea Cargo", "icon": "globe"},
        {"title": "Professional Packing & Shifting", "icon": "box"},
        {"title": "Long & Short Time Storage Facility", "icon": "warehouse"},
        {"title": "Door to Door Service", "icon": "truck"},
    ]

    return {
        "hero": hero,
        "statistics": statistics,
        "featured_services": featured_services,
        "featured_gallery": featured_gallery,
        "featured_blogs": featured_blogs,
        "branches": branches,
        "destinations": destinations,
        "highlights": highlights,
    }
