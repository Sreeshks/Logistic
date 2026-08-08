import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException, status

from app.core.config import get_settings

settings = get_settings()

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}


async def upload_file_service(file: UploadFile) -> str:
    """
    Validates file extension, MIME type, and size, then saves file locally under settings.upload_dir.
    Returns relative URL path e.g. '/uploads/filename.webp'.
    """
    filename = file.filename or ""
    ext = Path(filename).suffix.lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file extension '{ext}'. Allowed extensions: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported MIME type '{file.content_type}'. Allowed types: {', '.join(sorted(ALLOWED_MIME_TYPES))}",
        )

    # Read file content to check size
    contents = await file.read()
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum limit of {settings.max_upload_size_mb}MB",
        )

    # Ensure upload directory exists
    settings.upload_dir.mkdir(parents=True, exist_ok=True)

    # Generate unique filename
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    target_path = settings.upload_dir / unique_filename

    with open(target_path, "wb") as f:
        f.write(contents)

    return f"/uploads/{unique_filename}"
