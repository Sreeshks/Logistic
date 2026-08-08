from typing import Any
from fastapi import APIRouter, Depends, File, UploadFile, status

from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.services.file_service import upload_file_service
from app.utils.response import success_response

router = APIRouter(prefix="/admin/upload", tags=["File Upload (Admin)"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    url = await upload_file_service(file)
    return success_response(
        message="File uploaded successfully",
        data={"url": url},
    )
