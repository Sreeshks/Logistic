from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from app.models.order import Order, OrderStatus
from app.schemas.order import OrderCreate, OrderUpdate, OrderStatusUpdate


class OrderService:
    @staticmethod
    def get_orders(
        db: Session,
        page: int = 1,
        size: int = 20,
        search: str | None = None,
        status: OrderStatus | None = None,
    ):
        query = db.query(Order)
        if status:
            query = query.filter(Order.status == status)
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                or_(
                    Order.tracking_number.ilike(search_pattern),
                    Order.sender_name.ilike(search_pattern),
                    Order.recipient_name.ilike(search_pattern),
                    Order.destination.ilike(search_pattern),
                )
            )
        total = query.count()
        orders = query.order_by(desc(Order.created_at)).offset((page - 1) * size).limit(size).all()
        return orders, total

    @staticmethod
    def get_order_by_id(db: Session, order_id: int) -> Order | None:
        return db.query(Order).filter(Order.id == order_id).first()

    @staticmethod
    def get_order_by_tracking_number(db: Session, tracking_number: str) -> Order | None:
        return db.query(Order).filter(Order.tracking_number.ilike(tracking_number.strip())).first()

    @staticmethod
    def create_order(db: Session, data: OrderCreate) -> Order:
        order = Order(
            tracking_number=data.tracking_number.strip().upper(),
            sender_name=data.sender_name,
            recipient_name=data.recipient_name,
            origin=data.origin,
            destination=data.destination,
            service_type=data.service_type,
            status=data.status,
            current_location=data.current_location,
            estimated_delivery=data.estimated_delivery,
            notes=data.notes,
        )
        db.add(order)
        db.commit()
        db.refresh(order)
        return order

    @staticmethod
    def update_order(db: Session, order: Order, data: OrderUpdate) -> Order:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(order, field, value)
        db.commit()
        db.refresh(order)
        return order

    @staticmethod
    def update_status(db: Session, order: Order, data: OrderStatusUpdate) -> Order:
        order.status = data.status
        if data.current_location is not None:
            order.current_location = data.current_location
        if data.notes is not None:
            order.notes = data.notes
        db.commit()
        db.refresh(order)
        return order

    @staticmethod
    def delete_order(db: Session, order: Order) -> None:
        db.delete(order)
        db.commit()
