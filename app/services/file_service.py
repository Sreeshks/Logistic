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
    Validates file extension, MIME type, and size.
    Uploads file to Supabase Storage bucket 'Logi' if configured,
    otherwise saves file locally under settings.upload_dir.
    """
    current_settings = get_settings()
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
    max_bytes = current_settings.max_upload_size_mb * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum limit of {current_settings.max_upload_size_mb}MB",
        )

    unique_filename = f"{uuid.uuid4().hex}{ext}"

    # Try uploading to Supabase Storage bucket 'Logi' if Supabase URL and Key are set
    if current_settings.supabase_url and current_settings.supabase_key:
        try:
            from supabase import create_client
            supabase_client = create_client(current_settings.supabase_url, current_settings.supabase_key)
            bucket_name = current_settings.supabase_bucket or "Logi"

            # Upload bytes to Supabase Storage
            res = supabase_client.storage.from_(bucket_name).upload(
                path=unique_filename,
                file=contents,
                file_options={"content-type": file.content_type or "image/webp"}
            )
            # Retrieve public URL for the uploaded asset
            public_url = supabase_client.storage.from_(bucket_name).get_public_url(unique_filename)
            return public_url
        except Exception as e:
            print(f"[Supabase Storage Warning] Could not upload to bucket '{settings.supabase_bucket}': {e}. Falling back to local storage.")

    # Fallback: Save file locally under upload_dir
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    target_path = settings.upload_dir / unique_filename

    with open(target_path, "wb") as f:
        f.write(contents)

    return f"/uploads/{unique_filename}"

