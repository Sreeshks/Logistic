from sqlalchemy.orm import Session
from app.models.about import About
from app.schemas.about import AboutUpdate


def get_or_create_about(db: Session) -> About:
    about = db.query(About).first()
    if not about:
        about = About(
            page_title="About Global Logistics Solutions",
            short_description="Empowering global trade with reliable, sustainable, and innovative logistics services.",
            company_story="Founded over a decade ago, our company started with a single warehouse and a vision to transform supply chain management...",
            mission="To deliver world-class logistics services through continuous innovation, client dedication, and operational excellence.",
            vision="To be the world's premier logistics partner, driving global commerce efficiently and sustainably.",
            core_values="Integrity, Innovation, Customer Commitment, Reliability, Safety, Sustainability",
        )
        db.add(about)
        db.commit()
        db.refresh(about)
    return about


def update_about(db: Session, update_data: AboutUpdate) -> About:
    about = get_or_create_about(db)
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(about, field, value)
    db.commit()
    db.refresh(about)
    return about
