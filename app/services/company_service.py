from sqlalchemy.orm import Session
from app.models.company import Company
from app.schemas.company import CompanyUpdate


def get_or_create_company(db: Session) -> Company:
    company = db.query(Company).first()
    if not company:
        company = Company(
            name="Global Logistics Solutions",
            tagline="Delivering Excellence Worldwide",
            short_description="Leading provider of end-to-end supply chain and freight forwarding services.",
            full_description="Global Logistics Solutions is a trusted leader in global freight, warehousing, supply chain management, and express transport services.",
            phone="+1 (800) 555-0199",
            whatsapp="+1 (800) 555-0199",
            email="contact@globallogistics.example.com",
            address="100 Logistics Way, Suite 400, Chicago, IL 60601",
            google_maps_url="https://maps.google.com/?q=Chicago+IL",
            working_hours="Mon - Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM",
            facebook="https://facebook.com/globallogistics",
            instagram="https://instagram.com/globallogistics",
            linkedin="https://linkedin.com/company/globallogistics",
            youtube="https://youtube.com/c/globallogistics",
            twitter="https://x.com/globallogistics",
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
