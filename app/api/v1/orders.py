from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.models.order import OrderStatus
from app.schemas.order import (
    OrderCreate,
    OrderUpdate,
    OrderStatusUpdate,
    OrderResponse,
    PublicOrderTrackResponse,
)
from app.services.order_service import OrderService
from app.services.home_service import get_or_create_home_hero
from app.utils.pagination import build_paginated_response
from app.utils.response import success_response, error_response

router = APIRouter(tags=["Orders & Cargo Tracking"])


# PUBLIC / ADMIN TRACKING TOGGLE ENDPOINTS
@router.get("/public/orders/tracking-toggle")
def get_public_tracking_toggle(db: Annotated[Session, Depends(get_db)]):
    hero = get_or_create_home_hero(db)
    return success_response(
        message="Tracking toggle status retrieved",
        data={"show_tracking": getattr(hero, "show_tracking", True)},
    )


@router.get("/admin/orders/tracking-toggle")
def get_admin_tracking_toggle(
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[Admin, Depends(get_current_admin)],
):
    hero = get_or_create_home_hero(db)
    return success_response(
        message="Tracking toggle status retrieved",
        data={"show_tracking": getattr(hero, "show_tracking", True)},
    )


@router.patch("/admin/orders/tracking-toggle")
def update_admin_tracking_toggle(
    payload: dict,
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[Admin, Depends(get_current_admin)],
):
    hero = get_or_create_home_hero(db)
    show_tracking = payload.get("show_tracking", True)
    hero.show_tracking = bool(show_tracking)
    db.commit()
    db.refresh(hero)
    return success_response(
        message="Landing page tracking visibility updated successfully",
        data={"show_tracking": hero.show_tracking},
    )


# PUBLIC ORDER TRACKING ENDPOINT
@router.get("/public/orders/track/{tracking_number}")

def public_track_order(
    tracking_number: str,
    db: Annotated[Session, Depends(get_db)],
):
    order = OrderService.get_order_by_tracking_number(db, tracking_number)
    if not order:
        return {
            "success": False,
            "message": f"No shipment found matching tracking number '{tracking_number}'",
            "data": {
                "found": False,
                "tracking_number": tracking_number,
            },
        }

    return success_response(
        message="Shipment status retrieved successfully",
        data={
            "found": True,
            "tracking_number": order.tracking_number,
            "status": order.status.value,
            "service_type": order.service_type,
            "origin": order.origin,
            "destination": order.destination,
            "current_location": order.current_location,
            "estimated_delivery": order.estimated_delivery,
            "last_updated": order.updated_at.isoformat() if order.updated_at else None,
        },
    )


# ADMIN ORDER MANAGEMENT ENDPOINTS
@router.get("/admin/orders")
def get_all_orders(
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[Admin, Depends(get_current_admin)],
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    search: str | None = None,
    order_status: OrderStatus | None = Query(None, alias="status"),
):
    orders, total = OrderService.get_orders(db, page, size, search, order_status)
    return build_paginated_response(
        items=[OrderResponse.model_validate(o).model_dump(mode="json") for o in orders],
        total=total,
        page=page,
        limit=size,
        message="Orders retrieved successfully",
    )


@router.post("/admin/orders", status_code=status.HTTP_201_CREATED)
def create_order(
    data: OrderCreate,
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[Admin, Depends(get_current_admin)],
):
    existing = OrderService.get_order_by_tracking_number(db, data.tracking_number)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Order with tracking number '{data.tracking_number}' already exists.",
        )
    order = OrderService.create_order(db, data)
    return success_response(
        message="Order created successfully",
        data=OrderResponse.model_validate(order).model_dump(mode="json"),
    )


@router.get("/admin/orders/{order_id}")
def get_order_details(
    order_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[Admin, Depends(get_current_admin)],
):
    order = OrderService.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return success_response(
        message="Order details retrieved",
        data=OrderResponse.model_validate(order).model_dump(mode="json"),
    )


@router.put("/admin/orders/{order_id}")
def update_order(
    order_id: int,
    data: OrderUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[Admin, Depends(get_current_admin)],
):
    order = OrderService.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    updated = OrderService.update_order(db, order, data)
    return success_response(
        message="Order updated successfully",
        data=OrderResponse.model_validate(updated).model_dump(mode="json"),
    )


@router.patch("/admin/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[Admin, Depends(get_current_admin)],
):
    order = OrderService.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    updated = OrderService.update_status(db, order, data)
    return success_response(
        message="Order status updated",
        data=OrderResponse.model_validate(updated).model_dump(mode="json"),
    )


@router.delete("/admin/orders/{order_id}")
def delete_order(
    order_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_admin: Annotated[Admin, Depends(get_current_admin)],
):
    order = OrderService.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    OrderService.delete_order(db, order)
    return success_response(message="Order deleted successfully")
