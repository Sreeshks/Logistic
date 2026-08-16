from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, engine, Base
from app.models.admin import Admin, AdminRole
from app.models.company import Company
from app.models.branch import Branch, BranchContact
from app.models.company_contact import CompanyContact
from app.models.destination import Destination
from app.models.service_category import ServiceCategory
from app.models.home import HomeHero, CompanyStatistic
from app.models.about import About
from app.models.service import Service
from app.models.gallery import GalleryItem
from app.models.blog import Blog, BlogStatus
from app.models.faq import FAQ
from app.models.contact import ContactMessage, ContactStatus
from app.models.order import Order, OrderStatus
from app.core.security import hash_password
from app.utils.slug import generate_slug


def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Seed Super Admin
        admin1 = db.query(Admin).filter(Admin.email == "admin@example.com").first()
        if not admin1:
            admin1 = Admin(
                name="White Star Admin",
                email="admin@example.com",
                password_hash=hash_password("change-before-phase-2-seeding"),
                role=AdminRole.SUPER_ADMIN,
                is_active=True,
            )
            db.add(admin1)
            print("Seeded Primary Admin user.")

        admin2 = db.query(Admin).filter(Admin.email == "admin@logistics.com").first()
        if not admin2:
            admin2 = Admin(
                name="System Super Admin",
                email="admin@logistics.com",
                password_hash=hash_password("AdminPassword123!"),
                role=AdminRole.SUPER_ADMIN,
                is_active=True,
            )
            db.add(admin2)
            print("Seeded Legacy Super Admin user.")

        # 2. Seed Company Profile
        company = db.query(Company).first()
        if not company:
            company = Company(
                name="White Star Cargo",
                arabic_name="النجم الأبيض للشحن",
                business_type="Cargo & Logistics",
                country="Oman",
                tagline="Door to Door Service | Professional Packing & Shifting",
                short_description="Worldwide Air & Sea Cargo, Professional Packing & Shifting, Long & Short Time Storage Facility.",
                full_description="White Star Cargo (النجم الأبيض للشحن) provides professional logistics solutions including door-to-door air & sea cargo forwarding, expert packing & shifting, and short and long-term storage facilities across Oman.",
                phone="+968 95807130",
                whatsapp="+968 95807130",
                email="wstarcargo@rediffmail.com",
                address="Ruwi (Near Softy Ice Cream, Old Fish Market) & Misfah (Near Emerald Hyper Market), Muscat, Sultanate of Oman",
                google_maps_url=None,
                working_hours="Sat - Thu: 8:00 AM - 9:00 PM",
                facebook=None,
                instagram=None,
                linkedin=None,
                youtube=None,
                twitter=None,
                primary_color="#ea580c",
                secondary_color="#0f172a",
                accent_color="#0284c7",
                theme_mode="light",
            )
            db.add(company)
            db.flush()
            print("Seeded Company Profile.")

            # Seed Company Contacts
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
            print("Seeded Company Contacts.")

        # 3. Seed Branches
        if db.query(Branch).count() == 0:
            ruwi = Branch(
                company_id=company.id if company else 1,
                name="Ruwi",
                location_description="Near Softy Ice Cream, Old Fish Market",
                country="Oman",
                status="ACTIVE",
                is_featured=True,
                display_order=1,
            )
            db.add(ruwi)
            db.flush()

            db.add_all([
                BranchContact(branch_id=ruwi.id, phone="99896945", country_code="+968", phone_type="PHONE", is_primary=True),
                BranchContact(branch_id=ruwi.id, phone="71100628", country_code="+968", phone_type="PHONE", is_primary=False),
            ])

            misfah = Branch(
                company_id=company.id if company else 1,
                name="Misfah",
                location_description="Near Emerald Hyper Market",
                country="Oman",
                status="ACTIVE",
                is_featured=True,
                display_order=2,
            )
            db.add(misfah)
            db.flush()

            db.add_all([
                BranchContact(branch_id=misfah.id, phone="92725902", country_code="+968", phone_type="PHONE", is_primary=True),
                BranchContact(branch_id=misfah.id, phone="99231653", country_code="+968", phone_type="PHONE", is_primary=False),
            ])

            barka = Branch(
                company_id=company.id if company else 1,
                name="Barka",
                country="Oman",
                status="COMING_SOON",
                display_order=3,
            )
            nizwa = Branch(
                company_id=company.id if company else 1,
                name="Nizwa",
                country="Oman",
                status="COMING_SOON",
                display_order=4,
            )
            db.add_all([barka, nizwa])
            print("Seeded Branches (Ruwi, Misfah, Barka, Nizwa).")

        # 4. Seed Service Categories
        if db.query(ServiceCategory).count() == 0:
            categories = [
                ServiceCategory(name="Air Cargo", slug="air-cargo", display_order=1),
                ServiceCategory(name="Sea Cargo", slug="sea-cargo", display_order=2),
                ServiceCategory(name="Door to Door", slug="door-to-door", display_order=3),
                ServiceCategory(name="Packing & Shifting", slug="packing-shifting", display_order=4),
                ServiceCategory(name="Storage", slug="storage", display_order=5),
            ]
            db.add_all(categories)
            print("Seeded Service Categories.")

        # 5. Seed Services
        if db.query(Service).count() == 0:
            services = [
                Service(
                    title="Air Cargo",
                    slug=generate_slug("Air Cargo"),
                    delivery_information="All Over India\n7 to 15 Days Delivery",
                    short_description="Worldwide Air Cargo service with delivery across India in 7 to 15 days.",
                    description="Worldwide Air Cargo service with delivery across India. Estimated delivery time: 7 to 15 days.",
                    category_name="Air Cargo",
                    icon="plane",
                    display_order=1,
                    is_featured=True,
                    is_active=True,
                ),
                Service(
                    title="Sea Cargo",
                    slug=generate_slug("Sea Cargo"),
                    delivery_information="All Over India\n25 to 35 Days Delivery",
                    short_description="Worldwide Sea Cargo service with delivery across India in 25 to 35 days.",
                    description="Worldwide Sea Cargo service with delivery across India. Estimated delivery time: 25 to 35 days.",
                    category_name="Sea Cargo",
                    icon="ship",
                    display_order=2,
                    is_featured=True,
                    is_active=True,
                ),
                Service(
                    title="Door to Door Service",
                    slug=generate_slug("Door to Door Service"),
                    delivery_information="Direct Pickup & Delivery",
                    short_description="Door to door cargo delivery service for convenient shipment handling and delivery.",
                    description="Door to door cargo delivery service for convenient shipment handling and delivery.",
                    category_name="Door to Door",
                    icon="truck",
                    display_order=3,
                    is_featured=True,
                    is_active=True,
                ),
                Service(
                    title="Professional Packing & Shifting",
                    slug=generate_slug("Professional Packing & Shifting"),
                    delivery_information="Expert Care & Safe Movement",
                    short_description="Professional packing and shifting services for safe and reliable movement of goods.",
                    description="Professional packing and shifting services for safe and reliable movement of goods.",
                    category_name="Packing & Shifting",
                    icon="box",
                    display_order=4,
                    is_featured=True,
                    is_active=True,
                ),
                Service(
                    title="Long & Short Time Storage Facility",
                    slug=generate_slug("Long & Short Time Storage Facility"),
                    delivery_information="Secure Short & Long Term Storage",
                    short_description="Long-term and short-term storage facilities for customer goods and cargo.",
                    description="Long-term and short-term storage facilities for customer goods and cargo.",
                    category_name="Storage",
                    icon="warehouse",
                    display_order=5,
                    is_featured=True,
                    is_active=True,
                ),
            ]
            db.add_all(services)
            print("Seeded Services.")

        # 6. Seed Destinations
        if db.query(Destination).count() == 0:
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
            print("Seeded Destinations.")

        # 7. Seed Home Hero
        default_highlights_json = (
            '[{"title": "AIR CARGO (7-15 DAYS)", "subtitle": "Express delivery all over India & worldwide", "icon": "plane"}, '
            '{"title": "SEA CARGO (25-35 DAYS)", "subtitle": "Economical ocean shipping all over India", "icon": "ship"}, '
            '{"title": "DOOR TO DOOR DELIVERY", "subtitle": "India, GCC, UK, USA, Philippines & more", "icon": "truck"}, '
            '{"title": "PACKING & STORAGE", "subtitle": "Professional shifting & secure storage", "icon": "box"}]'
        )
        hero = db.query(HomeHero).first()
        if not hero:
            hero = HomeHero(
                title="WHITE STAR CARGO - النجم الأبيض للشحن",
                subtitle="Door to Door Service | Professional Packing & Shifting",
                description="Worldwide Air & Sea Cargo, Professional Packing & Shifting, Long & Short Time Storage Facility.",
                button_text="Contact Us",
                button_url="/contact",
                secondary_button_text="Our Services",
                secondary_button_url="/services",
                background_image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000",
                banner_images="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000,https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=2000,https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000,https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=2000",
                highlights=default_highlights_json,
            )
            db.add(hero)
            print("Seeded Home Hero.")
        else:
            hero.title = "WHITE STAR CARGO - النجم الأبيض للشحن"
            hero.subtitle = "Door to Door Service | Professional Packing & Shifting"
            hero.description = "Worldwide Air & Sea Cargo, Professional Packing & Shifting, Long & Short Time Storage Facility."
            hero.button_text = "Contact Us"
            hero.button_url = "/contact"
            hero.secondary_button_text = "Our Services"
            hero.secondary_button_url = "/services"
            hero.highlights = default_highlights_json

        # 8. Seed Company Statistics
        if db.query(CompanyStatistic).count() == 0:
            stats = [
                CompanyStatistic(label="Years of Experience", value="10+", icon="clock", display_order=1, is_active=True),
                CompanyStatistic(label="Successful Deliveries", value="50k+", icon="package", display_order=2, is_active=True),
                CompanyStatistic(label="Active Branches", value="4", icon="map-pin", display_order=3, is_active=True),
                CompanyStatistic(label="Destinations Covered", value="8+", icon="globe", display_order=4, is_active=True),
            ]
            db.add_all(stats)
            print("Seeded Company Statistics.")

        # 9. Seed About
        about = db.query(About).first()
        if not about:
            about = About(
                page_title="About White Star Cargo",
                short_description="Door to Door Cargo & Logistics Services in Oman.",
                company_story="White Star Cargo (النجم الأبيض للشحن) is a premier cargo and logistics provider operating in Oman with main locations in Ruwi and Misfah, and upcoming branches in Barka and Nizwa. We specialize in Air Cargo, Sea Cargo, Door to Door Delivery, Professional Packing & Shifting, and Storage Facilities.",
                mission="To provide reliable, timely, and professional door-to-door cargo, packing, and storage services across international destinations.",
                vision="To be the most trusted cargo and logistics partner across Oman and global routes.",
                core_values="Reliability, Professionalism, Customer Care, Safety & Timely Delivery",
                about_image="/uploads/about_us.jpg",
            )
            db.add(about)
            print("Seeded About page.")

        # 10. Seed Gallery
        if db.query(GalleryItem).count() == 0:
            gallery_items = [
                GalleryItem(
                    title="Air Cargo Handling",
                    description="Worldwide air shipment loading and distribution.",
                    image_url="/uploads/gallery_air.jpg",
                    category="Air Freight",
                    display_order=1,
                    is_featured=True,
                    is_active=True,
                ),
                GalleryItem(
                    title="Sea Freight Container Shipping",
                    description="Ocean cargo container shipping to India & global ports.",
                    image_url="/uploads/gallery_ocean.jpg",
                    category="Sea Freight",
                    display_order=2,
                    is_featured=True,
                    is_active=True,
                ),
                GalleryItem(
                    title="Storage & Packing Warehouse",
                    description="Secure long-term and short-term storage facilities.",
                    image_url="/uploads/gallery_warehouse.jpg",
                    category="Storage",
                    display_order=3,
                    is_featured=True,
                    is_active=True,
                ),
            ]
            db.add_all(gallery_items)
            print("Seeded Gallery Items.")

        # 11. Seed Blogs
        if db.query(Blog).count() == 0:
            blogs = [
                Blog(
                    title="Air Cargo vs Sea Cargo: Choosing the Right Express Transit",
                    slug=generate_slug("Air Cargo vs Sea Cargo Choosing the Right Express Transit"),
                    short_description="Understand key timelines for Air Cargo (7-15 days) and Sea Cargo (25-35 days).",
                    content="When shipping cargo from Oman to international destinations such as India...",
                    author="White Star Cargo Specialist",
                    category="Logistics Guide",
                    tags="air_cargo,sea_cargo,shipping",
                    status=BlogStatus.PUBLISHED,
                    is_featured=True,
                    published_at=datetime.now(timezone.utc),
                ),
                Blog(
                    title="Professional Packing Guidelines for Overseas Door-to-Door Shipments",
                    slug=generate_slug("Professional Packing Guidelines for Overseas Door to Door Shipments"),
                    short_description="Best practices for packing household and commercial goods for safe transit.",
                    content="Proper packing and shifting techniques ensure zero damage during international shipping...",
                    author="White Star Cargo Specialist",
                    category="Best Practices",
                    tags="packing,shifting,door_to_door",
                    status=BlogStatus.PUBLISHED,
                    is_featured=True,
                    published_at=datetime.now(timezone.utc),
                ),
            ]
            db.add_all(blogs)
            print("Seeded Blogs.")

        # 12. Seed FAQs
        if db.query(FAQ).count() == 0:
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
            print("Seeded FAQs.")

        # 13. Seed Contact Message
        if db.query(ContactMessage).count() == 0:
            c_msg = ContactMessage(
                name="Customer Support Test",
                email="customer@example.com",
                phone="+968 95807130",
                subject="General Freight Inquiry",
                message="Requesting door to door air cargo rates to Kerala.",
                status=ContactStatus.NEW,
            )
            db.add(c_msg)
            print("Seeded Contact Message.")

        # 14. Seed Orders / Cargo Shipments
        if db.query(Order).count() == 0:
            sample_orders = [
                Order(
                    tracking_number="WSC-998231",
                    sender_name="Mohammed Al-Busaidi",
                    recipient_name="Rahul Sharma",
                    origin="Ruwi Branch, Muscat, Oman",
                    destination="Kochi, Kerala, India",
                    service_type="Air Cargo",
                    status=OrderStatus.IN_TRANSIT,
                    current_location="Muscat International Airport Freight Terminal",
                    estimated_delivery="18 Aug 2026",
                    notes="Direct Air Freight dispatch under AWB-88902.",
                ),
                Order(
                    tracking_number="WSC-100821",
                    sender_name="Ahmed Said",
                    recipient_name="Suresh Kumar",
                    origin="Misfah Warehouse, Oman",
                    destination="Mumbai, Maharashtra, India",
                    service_type="Sea Cargo",
                    status=OrderStatus.PICKED_UP,
                    current_location="Misfah Logistics Hub",
                    estimated_delivery="05 Sep 2026",
                    notes="Container loading scheduled for Sultan Qaboos Port.",
                ),
                Order(
                    tracking_number="WSC-773412",
                    sender_name="Salim Al-Harthy",
                    recipient_name="Tariq Mansoor",
                    origin="Barka Office, Oman",
                    destination="Dhaka, Bangladesh",
                    service_type="Door to Door Service",
                    status=OrderStatus.DELIVERED,
                    current_location="Dhaka Distribution Depot",
                    estimated_delivery="10 Aug 2026",
                    notes="Successfully delivered to recipient address.",
                ),
            ]
            db.add_all(sample_orders)
            print("Seeded Sample Orders & Cargo Shipments.")

        db.commit()
        print("White Star Cargo database seed completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
