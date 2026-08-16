import os
import sys
from pathlib import Path
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, engine
from app.core.config import get_settings
from app.models import (
    Company,
    CompanyContact,
    Branch,
    BranchContact,
    Destination,
    ServiceCategory,
    Service,
    HomeHero,
    CompanyStatistic,
    About,
    FAQ,
    ContactMessage,
)
from app.utils.slug import generate_slug

settings = get_settings()

def update_data():
    db: Session = SessionLocal()
    try:
        # 1. Upload/Prepare Flyer Image
        flyer_path = Path(r"D:\starargo.jpeg")
        flyer_url = "/uploads/star_cargo_flyer.jpeg"
        if flyer_path.exists():
            # Try uploading to Supabase Storage if configured
            if settings.supabase_url and settings.supabase_key:
                try:
                    from supabase import create_client
                    supabase_client = create_client(settings.supabase_url, settings.supabase_key)
                    bucket_name = settings.supabase_bucket or "Logi"
                    with open(flyer_path, "rb") as f:
                        file_bytes = f.read()
                    
                    supabase_client.storage.from_(bucket_name).upload(
                        path="star_cargo_flyer.jpeg",
                        file=file_bytes,
                        file_options={"content-type": "image/jpeg", "upsert": "true"}
                    )
                    supa_url = supabase_client.storage.from_(bucket_name).get_public_url("star_cargo_flyer.jpeg")
                    if supa_url:
                        flyer_url = supa_url.rstrip("?")
                        print("Uploaded flyer to Supabase Storage:", flyer_url)
                except Exception as ex:
                    print(f"Supabase storage upload skipped: {ex}")

        # 2. Update Company Profile
        company = db.query(Company).first()
        if not company:
            company = Company(name="White Star Cargo")
            db.add(company)
            db.flush()

        company.name = "White Star Cargo"
        company.arabic_name = "النجم الأبيض للشحن"
        company.business_type = "Cargo & Logistics"
        company.country = "Oman"
        company.tagline = "Door to Door Service | Professional Packing & Shifting"
        company.short_description = "Worldwide Air & Sea Cargo, Professional Packing & Shifting, Long & Short Time Storage Facility."
        company.full_description = (
            "White Star Cargo (النجم الأبيض للشحن) is a premier cargo and logistics provider operating in Oman "
            "with main branches in Ruwi and Misfah, and upcoming branches in Barka and Nizwa. "
            "We provide worldwide Air Cargo (7 to 15 days delivery to India), Sea Cargo (25 to 35 days delivery to India), "
            "Door to Door delivery across India, Bangladesh, Philippines, Indonesia, Sri Lanka, UK, USA, and GCC countries, "
            "along with professional packing, shifting, and short/long term storage facilities."
        )
        company.phone = "+968 95807130"
        company.whatsapp = "+968 95807130"
        company.email = "wstarcargo@rediffmail.com"
        company.address = "Ruwi (Near Softy Ice Cream, Old Fish Market) & Misfah (Near Emerald Hyper Market), Muscat, Sultanate of Oman"
        company.working_hours = "Sat - Thu: 8:00 AM - 9:00 PM"
        
        # 3. Update Company Contacts (WhatsApp, Phone, Email)
        db.query(CompanyContact).filter(CompanyContact.company_id == company.id).delete()
        c_contacts = [
            CompanyContact(
                company_id=company.id,
                type="WHATSAPP",
                value="+968 95807130",
                label="Main WhatsApp (+968 95807130)",
                is_primary=True,
                is_public=True,
                display_order=1,
            ),
            CompanyContact(
                company_id=company.id,
                type="PHONE",
                value="+968 95807130",
                label="Customer Service (+968 95807130)",
                is_primary=True,
                is_public=True,
                display_order=2,
            ),
            CompanyContact(
                company_id=company.id,
                type="EMAIL",
                value="wstarcargo@rediffmail.com",
                label="Business Email",
                is_primary=True,
                is_public=True,
                display_order=3,
            ),
        ]
        db.add_all(c_contacts)

        # 4. Update / Recreate Branches & Contacts
        for b in db.query(Branch).all():
            db.query(BranchContact).filter(BranchContact.branch_id == b.id).delete()
        db.query(Branch).delete()
        db.flush()

        # Branch 1: Ruwi
        ruwi = Branch(
            company_id=company.id,
            name="Ruwi",
            location_description="Near Softy Ice Cream, Old Fish Market",
            address="Near Softy Ice Cream, Old Fish Market, Ruwi",
            city="Ruwi, Muscat",
            country="Oman",
            status="ACTIVE",
            is_featured=True,
            display_order=1,
        )
        db.add(ruwi)
        db.flush()
        db.add_all([
            BranchContact(branch_id=ruwi.id, phone="99896945", country_code="+968", phone_type="PHONE", is_whatsapp=True, is_primary=True),
            BranchContact(branch_id=ruwi.id, phone="71100628", country_code="+968", phone_type="PHONE", is_whatsapp=False, is_primary=False),
        ])

        # Branch 2: Misfah
        misfah = Branch(
            company_id=company.id,
            name="Misfah",
            location_description="Near Emerald Hyper Market",
            address="Near Emerald Hyper Market, Misfah",
            city="Misfah, Muscat",
            country="Oman",
            status="ACTIVE",
            is_featured=True,
            display_order=2,
        )
        db.add(misfah)
        db.flush()
        db.add_all([
            BranchContact(branch_id=misfah.id, phone="92725902", country_code="+968", phone_type="PHONE", is_whatsapp=True, is_primary=True),
            BranchContact(branch_id=misfah.id, phone="99231653", country_code="+968", phone_type="PHONE", is_whatsapp=False, is_primary=False),
        ])

        # Branch 3: Barka (Coming Soon)
        barka = Branch(
            company_id=company.id,
            name="Barka",
            location_description="Opening Soon",
            city="Barka",
            country="Oman",
            status="COMING_SOON",
            is_featured=False,
            display_order=3,
        )
        # Branch 4: Nizwa (Coming Soon)
        nizwa = Branch(
            company_id=company.id,
            name="Nizwa",
            location_description="Opening Soon",
            city="Nizwa",
            country="Oman",
            status="COMING_SOON",
            is_featured=False,
            display_order=4,
        )
        db.add_all([barka, nizwa])

        # 5. Update Destinations
        db.query(Destination).delete()
        destinations = [
            Destination(name="India", code="IN", description="Door to Door Delivery across India (Air 7-15 Days | Sea 25-35 Days)", display_order=1, is_active=True),
            Destination(name="Bangladesh", code="BD", description="Worldwide Air & Sea Cargo Door to Door Delivery", display_order=2, is_active=True),
            Destination(name="Philippines", code="PH", description="Worldwide Air & Sea Cargo Door to Door Delivery", display_order=3, is_active=True),
            Destination(name="Indonesia", code="ID", description="Worldwide Air & Sea Cargo Door to Door Delivery", display_order=4, is_active=True),
            Destination(name="Sri Lanka", code="LK", description="Worldwide Air & Sea Cargo Door to Door Delivery", display_order=5, is_active=True),
            Destination(name="United Kingdom (UK)", code="GB", description="Worldwide Air & Sea Cargo Door to Door Delivery", display_order=6, is_active=True),
            Destination(name="United States (USA)", code="US", description="Worldwide Air & Sea Cargo Door to Door Delivery", display_order=7, is_active=True),
            Destination(name="GCC Countries", code="GCC", description="Oman, UAE, Saudi Arabia, Qatar, Bahrain & Kuwait Door to Door Delivery", display_order=8, is_active=True),
        ]
        db.add_all(destinations)

        # 6. Update Services
        db.query(Service).delete()
        services = [
            Service(
                title="Air Cargo",
                slug=generate_slug("Air Cargo"),
                delivery_information="All Over India - 7 to 15 Days Delivery | Worldwide Air Cargo",
                short_description="Worldwide Air Cargo service with fast 7 to 15 days delivery across all of India.",
                description="Fast and reliable worldwide Air Cargo forwarding. We handle express shipments from Oman to all destinations across India within 7 to 15 days with full customs clearing and tracking.",
                category_name="Air Cargo",
                icon="plane",
                image="/uploads/gallery_air.jpg",
                display_order=1,
                is_featured=True,
                is_active=True,
            ),
            Service(
                title="Sea Cargo",
                slug=generate_slug("Sea Cargo"),
                delivery_information="All Over India - 25 to 35 Days Delivery | Worldwide Sea Cargo",
                short_description="Worldwide Sea Cargo and container shipping with 25 to 35 days delivery across India.",
                description="Economical ocean container shipping for commercial freight and personal household goods. Delivery across all of India in 25 to 35 days.",
                category_name="Sea Cargo",
                icon="ship",
                image="/uploads/gallery_ocean.jpg",
                display_order=2,
                is_featured=True,
                is_active=True,
            ),
            Service(
                title="Door to Door Service",
                slug=generate_slug("Door to Door Service"),
                delivery_information="Direct Door to Door Delivery to India, GCC, UK, USA & Worldwide",
                short_description="Seamless door-to-door cargo pickup in Oman and delivery to your destination address.",
                description="Complete door-to-door freight solution. We pick up your cargo directly from your home or office in Oman and safely deliver it to addresses across India, Bangladesh, Philippines, Indonesia, Sri Lanka, UK, USA, and GCC countries.",
                category_name="Door to Door",
                icon="truck",
                image="/uploads/hero_landing_bg.png",
                display_order=3,
                is_featured=True,
                is_active=True,
            ),
            Service(
                title="Professional Packing & Shifting",
                slug=generate_slug("Professional Packing & Shifting"),
                delivery_information="Expert Packing, Crating & Safe Movement",
                short_description="Professional packing, strapping, and shifting to protect cargo throughout transit.",
                description="Expert team providing multi-layer packing, wooden crating, heavy-duty carton boxing, and careful shifting for residential moves, commercial items, and fragile cargo.",
                category_name="Packing & Shifting",
                icon="box",
                image="/uploads/gallery_warehouse.jpg",
                display_order=4,
                is_featured=True,
                is_active=True,
            ),
            Service(
                title="Long & Short Time Storage Facility",
                slug=generate_slug("Long & Short Time Storage Facility"),
                delivery_information="Secure 24/7 Monitored Warehousing & Storage in Oman",
                short_description="Flexible short-term and long-term secure warehouse storage facilities.",
                description="Safe, climate-controlled, and 24/7 guarded warehouse storage facilities available in Oman for short or extended periods prior to shipment departure or collection.",
                category_name="Storage",
                icon="warehouse",
                image="/uploads/gallery_warehouse.jpg",
                display_order=5,
                is_featured=True,
                is_active=True,
            ),
        ]
        db.add_all(services)

        # 7. Update Home Hero
        hero = db.query(HomeHero).first()
        highlights_json = (
            '[{"title": "AIR CARGO (7-15 DAYS)", "subtitle": "Express delivery all over India & worldwide", "icon": "plane"}, '
            '{"title": "SEA CARGO (25-35 DAYS)", "subtitle": "Economical ocean shipping all over India", "icon": "ship"}, '
            '{"title": "DOOR TO DOOR DELIVERY", "subtitle": "India, GCC, UK, USA, Philippines & more", "icon": "truck"}, '
            '{"title": "PACKING & STORAGE", "subtitle": "Professional shifting & secure storage", "icon": "box"}]'
        )
        if hero:
            hero.title = "WHITE STAR CARGO - النجم الأبيض للشحن"
            hero.subtitle = "Door to Door Service | Professional Packing & Shifting"
            hero.description = "Worldwide Air & Sea Cargo, Professional Packing & Shifting, Long & Short Time Storage Facility."
            hero.button_text = "Contact Us"
            hero.button_url = "/contact"
            hero.secondary_button_text = "Our Services"
            hero.secondary_button_url = "/services"
            hero.highlights = highlights_json

        # 8. Update FAQs with Oman numbers
        db.query(FAQ).delete()
        faqs = [
            FAQ(
                question="What is the estimated delivery time for Air Cargo to India?",
                answer="Air Cargo delivery all over India takes 7 to 15 days.",
                category="Services",
                display_order=1,
                is_active=True,
            ),
            FAQ(
                question="What is the estimated delivery time for Sea Cargo to India?",
                answer="Sea Cargo delivery all over India takes 25 to 35 days.",
                category="Services",
                display_order=2,
                is_active=True,
            ),
            FAQ(
                question="Which international destinations do you provide Door to Door service to?",
                answer="We provide Door to Door delivery to India, Bangladesh, Philippines, Indonesia, Sri Lanka, United Kingdom (UK), United States (USA), and all GCC countries.",
                category="Services",
                display_order=3,
                is_active=True,
            ),
            FAQ(
                question="Where are your branches located in Oman and how can I contact them?",
                answer="Our active branches are in Ruwi (Near Softy Ice Cream, Old Fish Market | Tel: +968 99896945, +968 71100628) and Misfah (Near Emerald Hyper Market | Tel: +968 92725902, +968 99231653). Our WhatsApp is +968 95807130. Upcoming branches will be in Barka and Nizwa.",
                category="Locations",
                display_order=4,
                is_active=True,
            ),
        ]
        db.add_all(faqs)

        db.commit()
        print("Database successfully updated with White Star Cargo flyer data and +968 country codes!")
    except Exception as err:
        db.rollback()
        print(f"Error updating database: {err}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    update_data()
