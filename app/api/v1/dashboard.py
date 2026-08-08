from typing import Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.dashboard import DashboardStatsResponse
from app.schemas.contact import ContactMessageResponse
from app.schemas.blog import BlogResponse
from app.schemas.service import ServiceResponse
from app.services.dashboard_service import get_dashboard_summary
from app.utils.response import success_response

router = APIRouter(prefix="/admin/dashboard", tags=["Dashboard (Admin)"])


@router.get("", status_code=status.HTTP_200_OK)
def get_admin_dashboard(
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    summary = get_dashboard_summary(db)
    data = {
        "total_services": summary["total_services"],
        "total_blogs": summary["total_blogs"],
        "published_blogs": summary["published_blogs"],
        "total_gallery_items": summary["total_gallery_items"],
        "total_faqs": summary["total_faqs"],
        "total_contact_messages": summary["total_contact_messages"],
        "new_contact_messages": summary["new_contact_messages"],
        "recent_contact_messages": [
            ContactMessageResponse.model_validate(m).model_dump() for m in summary["recent_contact_messages"]
        ],
        "recent_blogs": [BlogResponse.model_validate(b).model_dump() for b in summary["recent_blogs"]],
        "recent_services": [ServiceResponse.model_validate(s).model_dump() for s in summary["recent_services"]],
    }
    return success_response(
        message="Dashboard summary retrieved successfully",
        data=data,
    )
