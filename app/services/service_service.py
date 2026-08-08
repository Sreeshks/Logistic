from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status

from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceUpdate
from app.utils.slug import generate_slug


def create_service(db: Session, data: ServiceCreate) -> Service:
    slug = data.slug or generate_slug(data.title)
    # Check slug uniqueness
    existing = db.query(Service).filter(Service.slug == slug).first()
    if existing:
        base_slug = slug
        count = 1
        while db.query(Service).filter(Service.slug == f"{base_slug}-{count}").first():
            count += 1
        slug = f"{base_slug}-{count}"

    service_dict = data.model_dump()
    service_dict["slug"] = slug
    service = Service(**service_dict)
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


def list_services(
    db: Session,
    page: int = 1,
    limit: int = 20,
    search: str | None = None,
    is_featured: bool | None = None,
    is_active: bool | None = None,
) -> tuple[list[Service], int]:
    query = db.query(Service)

    if is_active is not None:
        query = query.filter(Service.is_active == is_active)

    if is_featured is not None:
        query = query.filter(Service.is_featured == is_featured)

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Service.title.ilike(search_pattern),
                Service.short_description.ilike(search_pattern),
                Service.description.ilike(search_pattern),
            )
        )

    total = query.count()
    offset = (page - 1) * limit
    services = (
        query.order_by(Service.display_order.asc(), Service.id.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return services, total


def get_service_by_id(db: Session, service_id: int) -> Service:
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )
    return service


def get_service_by_slug(db: Session, slug: str, public_only: bool = True) -> Service:
    query = db.query(Service).filter(Service.slug == slug)
    if public_only:
        query = query.filter(Service.is_active == True)
    service = query.first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )
    return service


def update_service(db: Session, service_id: int, data: ServiceUpdate) -> Service:
    service = get_service_by_id(db, service_id)
    update_dict = data.model_dump(exclude_unset=True)

    if "slug" in update_dict and update_dict["slug"]:
        new_slug = generate_slug(update_dict["slug"])
        existing = db.query(Service).filter(Service.slug == new_slug, Service.id != service_id).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A service with this slug already exists",
            )
        update_dict["slug"] = new_slug
    elif "title" in update_dict and update_dict["title"] and "slug" not in update_dict:
        # Optionally regenerate slug if title changes and slug not explicitly set? Usually keep slug stable unless requested.
        pass

    for field, value in update_dict.items():
        setattr(service, field, value)

    db.commit()
    db.refresh(service)
    return service


def delete_service(db: Session, service_id: int) -> None:
    service = get_service_by_id(db, service_id)
    db.delete(service)
    db.commit()
