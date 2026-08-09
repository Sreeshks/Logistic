from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status

from app.models.blog import Blog, BlogStatus
from app.schemas.blog import BlogCreate, BlogUpdate
from app.utils.slug import generate_slug


def create_blog(db: Session, data: BlogCreate) -> Blog:
    slug = data.slug or generate_slug(data.title)
    existing = db.query(Blog).filter(Blog.slug == slug).first()
    if existing:
        base_slug = slug
        count = 1
        while db.query(Blog).filter(Blog.slug == f"{base_slug}-{count}").first():
            count += 1
        slug = f"{base_slug}-{count}"

    blog_dict = data.model_dump()
    blog_dict["slug"] = slug

    # Format tags if provided as list
    if isinstance(blog_dict.get("tags"), list):
        blog_dict["tags"] = ",".join([t.strip() for t in blog_dict["tags"] if t.strip()])

    if blog_dict["status"] == BlogStatus.PUBLISHED and not blog_dict.get("published_at"):
        blog_dict["published_at"] = datetime.now(timezone.utc)

    blog = Blog(**blog_dict)
    db.add(blog)
    db.commit()
    db.refresh(blog)
    return blog


def list_blogs(
    db: Session,
    page: int = 1,
    limit: int = 20,
    search: str | None = None,
    category: str | None = None,
    tag: str | None = None,
    blog_status: BlogStatus | None = None,
    is_featured: bool | None = None,
) -> tuple[list[Blog], int]:
    query = db.query(Blog)

    if blog_status:
        query = query.filter(Blog.status == blog_status)

    if is_featured is not None:
        query = query.filter(Blog.is_featured == is_featured)

    if category and category.strip():
        query = query.filter(Blog.category.ilike(f"%{category.strip()}%"))

    if tag and tag.strip():
        query = query.filter(Blog.tags.ilike(f"%{tag.strip()}%"))

    if search and search.strip():
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Blog.title.ilike(search_pattern),
                Blog.short_description.ilike(search_pattern),
                Blog.content.ilike(search_pattern),
            )
        )

    total = query.count()
    offset = (page - 1) * limit
    blogs = (
        query.order_by(Blog.published_at.desc().nullslast(), Blog.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return blogs, total


def get_blog_by_id(db: Session, blog_id: int) -> Blog:
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found",
        )
    return blog


def get_blog_by_slug(db: Session, slug: str, public_only: bool = True) -> Blog:
    query = db.query(Blog).filter(Blog.slug == slug)
    if public_only:
        query = query.filter(Blog.status == BlogStatus.PUBLISHED)
    blog = query.first()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found",
        )
    return blog


def update_blog(db: Session, blog_id: int, data: BlogUpdate) -> Blog:
    blog = get_blog_by_id(db, blog_id)
    update_dict = data.model_dump(exclude_unset=True)

    if "slug" in update_dict and update_dict["slug"]:
        new_slug = generate_slug(update_dict["slug"])
        existing = db.query(Blog).filter(Blog.slug == new_slug, Blog.id != blog_id).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A blog post with this slug already exists",
            )
        update_dict["slug"] = new_slug

    if isinstance(update_dict.get("tags"), list):
        update_dict["tags"] = ",".join([t.strip() for t in update_dict["tags"] if t.strip()])

    if update_dict.get("status") == BlogStatus.PUBLISHED and not blog.published_at and not update_dict.get("published_at"):
        update_dict["published_at"] = datetime.now(timezone.utc)

    for field, value in update_dict.items():
        setattr(blog, field, value)

    db.commit()
    db.refresh(blog)
    return blog


def delete_blog(db: Session, blog_id: int) -> None:
    blog = get_blog_by_id(db, blog_id)
    db.delete(blog)
    db.commit()
