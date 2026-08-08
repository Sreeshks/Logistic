from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, engine, Base
from app.models.admin import Admin, AdminRole
from app.models.company import Company
from app.models.home import HomeHero, CompanyStatistic
from app.models.about import About
from app.models.service import Service
from app.models.gallery import GalleryItem
from app.models.blog import Blog, BlogStatus
from app.models.faq import FAQ
from app.models.contact import ContactMessage, ContactStatus
from app.core.security import hash_password
from app.utils.slug import generate_slug


def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Seed Super Admin
        admin = db.query(Admin).filter(Admin.email == "admin@logistics.com").first()
        if not admin:
            admin = Admin(
                name="System Super Admin",
                email="admin@logistics.com",
                password_hash=hash_password("AdminPassword123!"),
                role=AdminRole.SUPER_ADMIN,
                is_active=True,
            )
            db.add(admin)
            print("Seeded Super Admin user.")

        # Seed Company
        company = db.query(Company).first()
        if not company:
            company = Company(
                name="Apex Global Logistics",
                tagline="Fast, Reliable & Seamless Global Freight",
                short_description="Leading provider of end-to-end supply chain, ocean freight, air cargo, and express transport.",
                full_description="Apex Global Logistics operates a modern worldwide transportation network offering air freight, sea freight, overland trucking, custom clearance, and smart warehousing services.",
                phone="+1 (800) 555-0199",
                whatsapp="+1 (800) 555-0199",
                email="info@apexlogistics.example.com",
                address="100 Logistics Parkway, Suite 400, Chicago, IL 60601",
                google_maps_url="https://maps.google.com/?q=Chicago+IL",
                working_hours="Mon - Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM",
                facebook="https://facebook.com/apexlogistics",
                instagram="https://instagram.com/apexlogistics",
                linkedin="https://linkedin.com/company/apexlogistics",
                youtube="https://youtube.com/c/apexlogistics",
                twitter="https://x.com/apexlogistics",
            )
            db.add(company)
            print("Seeded Company info.")

        # Seed Home Hero
        hero = db.query(HomeHero).first()
        if not hero:
            hero = HomeHero(
                title="Global Freight & Smart Logistics Solutions",
                subtitle="Delivering Trust, Speed, and Reliability Worldwide",
                description="We connect global supply chains with high-precision air, ocean, and ground transportation network.",
                button_text="Get Started",
                button_url="/services",
                background_image="/uploads/hero_bg.jpg",
            )
            db.add(hero)
            print("Seeded Home Hero.")

        # Seed Company Statistics
        if db.query(CompanyStatistic).count() == 0:
            stats = [
                CompanyStatistic(label="Years of Experience", value="15+", icon="clock", display_order=1, is_active=True),
                CompanyStatistic(label="Successful Deliveries", value="1M+", icon="package", display_order=2, is_active=True),
                CompanyStatistic(label="Happy Customers", value="50k+", icon="smile", display_order=3, is_active=True),
                CompanyStatistic(label="Countries Covered", value="120+", icon="globe", display_order=4, is_active=True),
            ]
            db.add_all(stats)
            print("Seeded Company Statistics.")

        # Seed About
        about = db.query(About).first()
        if not about:
            about = About(
                page_title="About Apex Global Logistics",
                short_description="Empowering international trade through smart, sustainable logistics.",
                company_story="Founded in 2010, Apex Global Logistics grew from a regional freight handler into a global supply chain enterprise.",
                mission="To simplify global trade for businesses of all sizes through technology-driven logistics.",
                vision="To set the benchmark for green, intelligent, and transparent freight solutions worldwide.",
                core_values="Integrity, Innovation, Customer Success, Safety, Sustainability",
                about_image="/uploads/about_us.jpg",
            )
            db.add(about)
            print("Seeded About page.")

        # Seed Services
        if db.query(Service).count() == 0:
            services = [
                Service(
                    title="Air Cargo Freight",
                    slug=generate_slug("Air Cargo Freight"),
                    short_description="Express priority air freight services for time-critical cargo.",
                    description="Our air freight solutions offer reliable door-to-door and airport-to-airport transit times across global routes.",
                    icon="plane",
                    display_order=1,
                    is_featured=True,
                    is_active=True,
                    meta_title="Air Freight Services - Apex Logistics",
                    meta_description="Fast and secure global air freight services.",
                ),
                Service(
                    title="Ocean Container Shipping",
                    slug=generate_slug("Ocean Container Shipping"),
                    short_description="Cost-effective FCL and LCL ocean container freight.",
                    description="Full container load (FCL) and less-than-container load (LCL) ocean freight forwarding.",
                    icon="ship",
                    display_order=2,
                    is_featured=True,
                    is_active=True,
                    meta_title="Ocean Freight Services - Apex Logistics",
                    meta_description="Global sea cargo container shipment services.",
                ),
                Service(
                    title="Overland Trucking & Distribution",
                    slug=generate_slug("Overland Trucking & Distribution"),
                    short_description="Comprehensive nationwide ground freight transportation.",
                    description="Flexible fleet of trucks providing temperature-controlled, heavy-haul, and express ground shipping.",
                    icon="truck",
                    display_order=3,
                    is_featured=True,
                    is_active=True,
                    meta_title="Overland Trucking Services",
                    meta_description="Reliable road freight and ground cargo logistics.",
                ),
                Service(
                    title="Smart Warehousing & Fulfillment",
                    slug=generate_slug("Smart Warehousing & Fulfillment"),
                    short_description="Automated storage, inventory management, and order fulfillment.",
                    description="Modern, climate-controlled warehousing facilities with real-time inventory visibility.",
                    icon="warehouse",
                    display_order=4,
                    is_featured=False,
                    is_active=True,
                ),
            ]
            db.add_all(services)
            print("Seeded Services.")

        # Seed Gallery
        if db.query(GalleryItem).count() == 0:
            gallery_items = [
                GalleryItem(
                    title="Air Cargo Fleet",
                    description="Boeing 777 freighter loading cargo.",
                    image_url="/uploads/gallery_air.jpg",
                    category="Air Freight",
                    display_order=1,
                    is_featured=True,
                    is_active=True,
                ),
                GalleryItem(
                    title="Modern Container Port",
                    description="Deep-water container terminal operations.",
                    image_url="/uploads/gallery_ocean.jpg",
                    category="Ocean Freight",
                    display_order=2,
                    is_featured=True,
                    is_active=True,
                ),
                GalleryItem(
                    title="Automated High-Bay Warehouse",
                    description="Robotic sorting and fulfillment system.",
                    image_url="/uploads/gallery_warehouse.jpg",
                    category="Warehousing",
                    display_order=3,
                    is_featured=True,
                    is_active=True,
                ),
            ]
            db.add_all(gallery_items)
            print("Seeded Gallery Items.")

        # Seed Blogs
        if db.query(Blog).count() == 0:
            blogs = [
                Blog(
                    title="Top 5 Supply Chain Trends to Watch in 2026",
                    slug=generate_slug("Top 5 Supply Chain Trends to Watch in 2026"),
                    short_description="Discover how AI and green freight are shaping global commerce.",
                    content="Supply chain management is undergoing a digital revolution...",
                    author="Supply Chain Specialist",
                    category="Industry News",
                    tags="trends,supply_chain,innovation",
                    status=BlogStatus.PUBLISHED,
                    is_featured=True,
                    published_at=datetime.now(timezone.utc),
                    meta_title="Supply Chain Trends 2026",
                    meta_description="Key insights on modern logistics trends.",
                ),
                Blog(
                    title="How to Optimize Cold Chain Logistics for Food & Pharma",
                    slug=generate_slug("How to Optimize Cold Chain Logistics for Food & Pharma"),
                    short_description="Best practices for maintaining temperature integrity during transit.",
                    content="Cold chain integrity requires high-precision IoT monitoring...",
                    author="Logistics Engineer",
                    category="Best Practices",
                    tags="cold_chain,pharma,food",
                    status=BlogStatus.PUBLISHED,
                    is_featured=True,
                    published_at=datetime.now(timezone.utc),
                ),
            ]
            db.add_all(blogs)
            print("Seeded Blogs.")

        # Seed FAQs
        if db.query(FAQ).count() == 0:
            faqs = [
                FAQ(
                    question="What types of freight transport do you offer?",
                    answer="We offer Air Freight, Ocean Freight (FCL/LCL), Overland Trucking, and Express Courier services.",
                    category="Services",
                    display_order=1,
                    is_active=True,
                ),
                FAQ(
                    question="How can I request a quotation for my shipment?",
                    answer="Fill out the contact form on our website with your origin, destination, and cargo specs, or call our customer line.",
                    category="Quotes",
                    display_order=2,
                    is_active=True,
                ),
                FAQ(
                    question="Do you provide customs clearance assistance?",
                    answer="Yes, our certified customs brokers handle import/export documentation and tariff compliance.",
                    category="Customs",
                    display_order=3,
                    is_active=True,
                ),
            ]
            db.add_all(faqs)
            print("Seeded FAQs.")

        # Seed Contact Message
        if db.query(ContactMessage).count() == 0:
            msg = ContactMessage(
                name="Alexander Wright",
                email="alexander.wright@company.example",
                phone="+1 (555) 234-5678",
                subject="Ocean Freight Rate Consultation",
                message="Hello, we are looking for a monthly contract to ship 20 TEU containers from Shanghai to Rotterdam. Please send a quote.",
                status=ContactStatus.NEW,
            )
            db.add(msg)
            print("Seeded Contact Message.")

        db.commit()
        print("Database seed completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
