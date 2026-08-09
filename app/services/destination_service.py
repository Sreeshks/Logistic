from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.destination import Destination
from app.schemas.destination import DestinationCreate, DestinationUpdate


def list_destinations(db: Session, only_active: bool = False) -> list[Destination]:
    query = db.query(Destination)
    if only_active:
        query = query.filter(Destination.is_active.is_(True))
    return query.order_by(Destination.display_order.asc(), Destination.id.asc()).all()


def get_destination_by_id(db: Session, dest_id: int) -> Destination:
    dest = db.query(Destination).filter(Destination.id == dest_id).first()
    if not dest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Destination not found")
    return dest


def create_destination(db: Session, data: DestinationCreate) -> Destination:
    dest = Destination(**data.model_dump())
    db.add(dest)
    db.commit()
    db.refresh(dest)
    return dest


def update_destination(db: Session, dest_id: int, data: DestinationUpdate) -> Destination:
    dest = get_destination_by_id(db, dest_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(dest, field, value)
    db.commit()
    db.refresh(dest)
    return dest


def delete_destination(db: Session, dest_id: int) -> None:
    dest = get_destination_by_id(db, dest_id)
    db.delete(dest)
    db.commit()
