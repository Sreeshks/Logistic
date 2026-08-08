from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.home import HomeHero, CompanyStatistic
from app.models.service import Service
from app.models.gallery import GalleryItem
from app.models.blog import Blog, BlogStatus
from app.schemas.home import (
    HomeHeroUpdate,
    CompanyStatisticCreate,
    CompanyStatisticUpdate,
)


def get_or_create_home_hero(db: Session) -> HomeHero:
    hero = db.query(HomeHero).first()
    if not hero:
        hero = HomeHero(
            title="Fast & Reliable Global Logistics Solutions",
            subtitle="Connecting Markets, Delivering Success",
            description="We deliver tailored air, ocean, and land freight solutions backed by cutting-edge technology and a global network.",
            button_text="Explore Services",
            button_url="/services",
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
        query = query.filter(CompanyStatistic.is_active == True)
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
        .filter(Service.is_active == True, Service.is_featured == True)
        .order_by(Service.display_order.asc(), Service.id.asc())
        .limit(6)
        .all()
    )
    featured_gallery = (
        db.query(GalleryItem)
        .filter(GalleryItem.is_active == True, GalleryItem.is_featured == True)
        .order_by(GalleryItem.display_order.asc(), GalleryItem.id.asc())
        .limit(8)
        .all()
    )
    featured_blogs = (
        db.query(Blog)
        .filter(Blog.status == BlogStatus.PUBLISHED, Blog.is_featured == True)
        .order_by(Blog.published_at.desc(), Blog.created_at.desc())
        .limit(3)
        .all()
    )

    return {
        "hero": hero,
        "statistics": statistics,
        "featured_services": featured_services,
        "featured_gallery": featured_gallery,
        "featured_blogs": featured_blogs,
    }
