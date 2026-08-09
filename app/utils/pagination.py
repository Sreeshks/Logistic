from typing import Any, Generic, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationMetadata(BaseModel):
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)
    total: int = Field(default=0, ge=0)
    total_pages: int = Field(default=0, ge=0)


class PaginatedResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str
    data: list[T]
    pagination: PaginationMetadata


def build_paginated_response(
    items: list[Any],
    total: int,
    page: int,
    limit: int,
    message: str = "Data retrieved successfully",
) -> dict[str, Any]:
    total_pages = (total + limit - 1) // limit if limit > 0 else 0
    return {
        "success": True,
        "message": message,
        "data": items,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": total_pages,
        },
    }
