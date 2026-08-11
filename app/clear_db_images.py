import os
import sys

# Ensure current directory is in PYTHONPATH
sys.path.insert(0, os.path.abspath("."))

from app.core.database import SessionLocal
from app.models import Company, HomeHero, About, Service, GalleryItem, Blog

def clear_all_images():
    db = SessionLocal()
    try:
        # Clear company logo and favicon
        companies = db.query(Company).all()
        for c in companies:
            c.logo = None
            c.favicon = None
        
        # Clear home hero background image & banner_images
        heroes = db.query(HomeHero).all()
        for h in heroes:
            h.background_image = None
            h.banner_images = None
            
        # Clear about us image
        abouts = db.query(About).all()
        for a in abouts:
            a.about_image = None

        # Clear services images & og_image
        services = db.query(Service).all()
        for s in services:
            s.image = None
            s.og_image = None

        # Clear blog featured_image & og_image
        blogs = db.query(Blog).all()
        for b in blogs:
            b.featured_image = None
            b.og_image = None

        # Delete seed gallery items so admin can upload fresh gallery images
        db.query(GalleryItem).delete()

        db.commit()
        print("Successfully cleared all image URLs from the Supabase PostgreSQL database!")
    except Exception as e:
        db.rollback()
        print(f"Error clearing images from database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    clear_all_images()
