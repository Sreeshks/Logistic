from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status

from app.models.contact import ContactMessage, ContactStatus
from app.schemas.contact import ContactSubmitRequest, ContactStatusUpdate


def submit_contact_message(db: Session, data: ContactSubmitRequest) -> ContactMessage:
    msg = ContactMessage(
        name=data.name.strip(),
        email=data.email.lower().strip(),
        phone=data.phone.strip(),
        subject=data.subject.strip(),
        message=data.message.strip(),
        status=ContactStatus.NEW,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


def list_contact_messages(
    db: Session,
    page: int = 1,
    limit: int = 20,
    search: str | None = None,
    contact_status: ContactStatus | None = None,
) -> tuple[list[ContactMessage], int]:
    query = db.query(ContactMessage)

    if contact_status:
        query = query.filter(ContactMessage.status == contact_status)

    if search and search.strip():
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                ContactMessage.name.ilike(search_pattern),
                ContactMessage.email.ilike(search_pattern),
                ContactMessage.subject.ilike(search_pattern),
                ContactMessage.message.ilike(search_pattern),
            )
        )

    total = query.count()
    offset = (page - 1) * limit
    messages = query.order_by(ContactMessage.id.desc()).offset(offset).limit(limit).all()
    return messages, total


def get_contact_message_by_id(db: Session, message_id: int) -> ContactMessage:
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact message not found",
        )
    return msg


def update_contact_status(db: Session, message_id: int, data: ContactStatusUpdate) -> ContactMessage:
    msg = get_contact_message_by_id(db, message_id)
    msg.status = data.status
    db.commit()
    db.refresh(msg)
    return msg


def delete_contact_message(db: Session, message_id: int) -> None:
    msg = get_contact_message_by_id(db, message_id)
    db.delete(msg)
    db.commit()
