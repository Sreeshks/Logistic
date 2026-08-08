from typing import Any
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.models.blog import BlogStatus
from app.schemas.blog import BlogCreate, BlogResponse, BlogUpdate
from app.services.blog_service import (
    create_blog,
    delete_blog,
    get_blog_by_id,
    get_blog_by_slug,
    list_blogs,
    update_blog,
)
from app.utils.pagination import build_paginated_response
from app.utils.response import success_response

admin_router = APIRouter(prefix="/admin/blogs", tags=["Blogs (Admin)"])
public_router = APIRouter(prefix="/public/blogs", tags=["Blogs (Public)"])


@admin_router.post("", status_code=status.HTTP_201_CREATED)
def create_blog_admin(
    payload: BlogCreate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    blog = create_blog(db, payload)
    return success_response(
        message="Blog post created successfully",
        data=BlogResponse.model_validate(blog).model_dump(),
    )


@admin_router.get("", status_code=status.HTTP_200_OK)
def list_blogs_admin(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    category: str | None = Query(default=None),
    tag: str | None = Query(default=None),
    blog_status: BlogStatus | None = Query(default=None, alias="status"),
    is_featured: bool | None = Query(default=None),
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    blogs, total = list_blogs(
        db,
        page=page,
        limit=limit,
        search=search,
        category=category,
        tag=tag,
        blog_status=blog_status,
        is_featured=is_featured,
    )
    items = [BlogResponse.model_validate(b).model_dump() for b in blogs]
    return build_paginated_response(
        items=items,
        total=total,
        page=page,
        limit=limit,
        message="Blog posts retrieved successfully",
    )


@admin_router.get("/{blog_id}", status_code=status.HTTP_200_OK)
def get_blog_admin(
    blog_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    blog = get_blog_by_id(db, blog_id)
    return success_response(
        message="Blog post retrieved successfully",
        data=BlogResponse.model_validate(blog).model_dump(),
    )


@admin_router.put("/{blog_id}", status_code=status.HTTP_200_OK)
def update_blog_admin(
    blog_id: int,
    payload: BlogUpdate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    blog = update_blog(db, blog_id, payload)
    return success_response(
        message="Blog post updated successfully",
        data=BlogResponse.model_validate(blog).model_dump(),
    )


@admin_router.delete("/{blog_id}", status_code=status.HTTP_200_OK)
def delete_blog_admin(
    blog_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
) -> dict[str, Any]:
    delete_blog(db, blog_id)
    return success_response(message="Blog post deleted successfully")


@public_router.get("", status_code=status.HTTP_200_OK)
def list_blogs_public(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    category: str | None = Query(default=None),
    tag: str | None = Query(default=None),
    is_featured: bool | None = Query(default=None),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    blogs, total = list_blogs(
        db,
        page=page,
        limit=limit,
        search=search,
        category=category,
        tag=tag,
        blog_status=BlogStatus.PUBLISHED,
        is_featured=is_featured,
    )
    items = [BlogResponse.model_validate(b).model_dump() for b in blogs]
    return build_paginated_response(
        items=items,
        total=total,
        page=page,
        limit=limit,
        message="Published blog posts retrieved successfully",
    )


@public_router.get("/{slug}", status_code=status.HTTP_200_OK)
def get_blog_by_slug_public(
    slug: str,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    blog = get_blog_by_slug(db, slug, public_only=True)
    return success_response(
        message="Blog post retrieved successfully",
        data=BlogResponse.model_validate(blog).model_dump(),
    )
