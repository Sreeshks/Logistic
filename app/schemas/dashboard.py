from pydantic import BaseModel
from app.schemas.contact import ContactMessageResponse
from app.schemas.blog import BlogResponse
from app.schemas.service import ServiceResponse


class DashboardStatsResponse(BaseModel):
    total_services: int
    total_blogs: int
    published_blogs: int
    total_gallery_items: int
    total_faqs: int
    total_contact_messages: int
    new_contact_messages: int

    recent_contact_messages: list[ContactMessageResponse] = []
    recent_blogs: list[BlogResponse] = []
    recent_services: list[ServiceResponse] = []
