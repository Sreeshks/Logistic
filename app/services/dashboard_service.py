from sqlalchemy.orm import Session

from app.models.service import Service
from app.models.blog import Blog, BlogStatus
from app.models.gallery import GalleryItem
from app.models.faq import FAQ
from app.models.contact import ContactMessage, ContactStatus


def get_dashboard_summary(db: Session) -> dict:
    total_services = db.query(Service).count()
    total_blogs = db.query(Blog).count()
    published_blogs = db.query(Blog).filter(Blog.status == BlogStatus.PUBLISHED).count()
    total_gallery_items = db.query(GalleryItem).count()
    total_faqs = db.query(FAQ).count()
    total_contact_messages = db.query(ContactMessage).count()
    new_contact_messages = db.query(ContactMessage).filter(ContactMessage.status == ContactStatus.NEW).count()

    recent_contact_messages = (
        db.query(ContactMessage).order_by(ContactMessage.id.desc()).limit(5).all()
    )
    recent_blogs = (
        db.query(Blog).order_by(Blog.id.desc()).limit(5).all()
    )
    recent_services = (
        db.query(Service).order_by(Service.id.desc()).limit(5).all()
    )

    return {
        "total_services": total_services,
        "total_blogs": total_blogs,
        "published_blogs": published_blogs,
        "total_gallery_items": total_gallery_items,
        "total_faqs": total_faqs,
        "total_contact_messages": total_contact_messages,
        "new_contact_messages": new_contact_messages,
        "recent_contact_messages": recent_contact_messages,
        "recent_blogs": recent_blogs,
        "recent_services": recent_services,
    }
