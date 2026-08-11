from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.health import router as health_router
from app.api.v1.company import admin_router as company_admin_router, public_router as company_public_router
from app.api.v1.home import admin_router as home_admin_router, public_router as home_public_router
from app.api.v1.about import admin_router as about_admin_router, public_router as about_public_router
from app.api.v1.services import admin_router as services_admin_router, public_router as services_public_router
from app.api.v1.gallery import admin_router as gallery_admin_router, public_router as gallery_public_router
from app.api.v1.blogs import admin_router as blogs_admin_router, public_router as blogs_public_router
from app.api.v1.faq import admin_router as faq_admin_router, public_router as faq_public_router
from app.api.v1.contact import admin_router as contact_admin_router, public_router as contact_public_router
from app.api.v1.branches import admin_router as branches_admin_router, public_router as branches_public_router
from app.api.v1.destinations import admin_router as destinations_admin_router, public_router as destinations_public_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.upload import router as upload_router
from app.api.v1.orders import router as orders_router

api_router = APIRouter()

# Health
api_router.include_router(health_router)

# Auth
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])

# Dashboard & Upload & Orders
api_router.include_router(dashboard_router)
api_router.include_router(upload_router)
api_router.include_router(orders_router)

# Admin routers
api_router.include_router(company_admin_router)
api_router.include_router(home_admin_router)
api_router.include_router(about_admin_router)
api_router.include_router(services_admin_router)
api_router.include_router(gallery_admin_router)
api_router.include_router(blogs_admin_router)
api_router.include_router(faq_admin_router)
api_router.include_router(contact_admin_router)
api_router.include_router(branches_admin_router)
api_router.include_router(destinations_admin_router)

# Public routers
api_router.include_router(company_public_router)
api_router.include_router(home_public_router)
api_router.include_router(about_public_router)
api_router.include_router(services_public_router)
api_router.include_router(gallery_public_router)
api_router.include_router(blogs_public_router)
api_router.include_router(faq_public_router)
api_router.include_router(contact_public_router)
api_router.include_router(branches_public_router)
api_router.include_router(destinations_public_router)
