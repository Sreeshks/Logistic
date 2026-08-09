from sqlalchemy.orm import Session
from app.models.company import Company
from app.schemas.company import CompanyUpdate


def get_or_create_company(db: Session) -> Company:
    company = db.query(Company).first()
    if not company:
        company = Company(
            name="White Star Cargo",
            arabic_name="النجم الأبيض للشحن",
            business_type="Cargo & Logistics",
            country="Oman",
            tagline="Door to Door Service | Professional Packing & Shifting",
            short_description="Worldwide Air & Sea Cargo, Professional Packing & Shifting, Long & Short Time Storage Facility.",
            full_description="White Star Cargo provides professional logistics solutions including door-to-door air & sea cargo, expert packing & shifting, and short and long-term storage facilities.",
            phone="95807130",
            whatsapp="95807130",
            email="wstarcargo@rediffmail.com",
            address="Ruwi & Misfah, Sultanate of Oman",
            google_maps_url=None,
            working_hours="Sat - Thu: 8:00 AM - 9:00 PM",
            facebook=None,
            instagram=None,
            linkedin=None,
            youtube=None,
            twitter=None,
        )
        db.add(company)
        db.commit()
        db.refresh(company)
    return company


def update_company(db: Session, update_data: CompanyUpdate) -> Company:
    company = get_or_create_company(db)
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(company, field, value)
    db.commit()
    db.refresh(company)
    return company
