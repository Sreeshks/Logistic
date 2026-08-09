# Logistics Website Backend — FastAPI API

Complete modular backend for a modern logistics company website and admin panel built with **FastAPI**, **SQLAlchemy 2.0**, **Pydantic v2**, **Alembic**, and **JWT Authentication**.

---

## Technology Stack

- **Python**: 3.12+
- **Framework**: FastAPI
- **Database**: SQLite (initial development) with PostgreSQL-compatible SQLAlchemy 2.0 architecture
- **Migrations**: Alembic
- **Authentication**: JWT authentication with Argon2 / bcrypt password hashing
- **Validation**: Pydantic v2
- **Server**: Uvicorn
- **File Uploads**: `python-multipart` with local `uploads/` static storage
- **CORS**: Environment-configurable origins
- **Testing**: Pytest

---

## Quick Start

### 1. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default `.env` configuration:

```env
APP_NAME=Logistics Website API
APP_ENV=development
DEBUG=true

DATABASE_URL=sqlite:///./logistics.db

SECRET_KEY=local-development-only-change-before-deployment
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

CORS_ORIGINS=http://localhost:3000,http://localhost:5173

UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE_MB=10

INITIAL_SUPER_ADMIN_NAME=System Super Admin
INITIAL_SUPER_ADMIN_EMAIL=admin@logistics.com
INITIAL_SUPER_ADMIN_PASSWORD=AdminPassword123!
```

### 2. Database Migrations & Seeding

Apply Alembic migrations and seed initial website content & super admin:

```bash
.venv/Scripts/python.exe app/seed.py
```

### 3. Run Application

```bash
uvicorn app.main:app --reload
```

Interactive Documentation:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## API Summary & Router Groups

### 1. Health Check
- `GET /api/v1/health` - Application health check

### 2. Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/login` - Admin login (returns Access Token, Refresh Token, Profile)
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET  /api/v1/auth/me` - Authenticated admin profile
- `POST /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/logout` - Logout

### 3. Company Information
- `GET /api/v1/public/company` - Public company profile & contact links
- `GET /api/v1/admin/company` - Admin fetch company info
- `PUT /api/v1/admin/company` - Admin update company info

### 4. Home Page CMS
- `GET /api/v1/public/home` - Aggregated public Home data (Hero, Stats, Featured Services, Featured Gallery, Featured Blogs)
- `GET /api/v1/admin/home` - Admin view hero section
- `PUT /api/v1/admin/home` - Admin update hero section
- `GET /api/v1/admin/home/statistics` - List company statistics
- `POST /api/v1/admin/home/statistics` - Add statistic
- `PUT /api/v1/admin/home/statistics/{id}` - Update statistic
- `DELETE /api/v1/admin/home/statistics/{id}` - Delete statistic

### 5. About Us CMS
- `GET /api/v1/public/about` - Public About Us content
- `GET /api/v1/admin/about` - Admin view About Us
- `PUT /api/v1/admin/about` - Admin update About Us

### 6. Services CRUD
- `GET /api/v1/public/services` - List active services (search & pagination supported)
- `GET /api/v1/public/services/{slug}` - Get service details by URL slug
- `GET /api/v1/admin/services` - List all services (paginated, active/inactive filter)
- `POST /api/v1/admin/services` - Create service
- `GET /api/v1/admin/services/{id}` - Get service by ID
- `PUT /api/v1/admin/services/{id}` - Update service
- `DELETE /api/v1/admin/services/{id}` - Delete service

### 7. Gallery Management
- `GET /api/v1/public/gallery` - List active gallery items (filter by category)
- `GET /api/v1/admin/gallery` - List all gallery items
- `POST /api/v1/admin/gallery` - Create gallery item
- `GET /api/v1/admin/gallery/{id}` - Get gallery item by ID
- `PUT /api/v1/admin/gallery/{id}` - Update gallery item
- `DELETE /api/v1/admin/gallery/{id}` - Delete gallery item

### 8. Blog CMS
- `GET /api/v1/public/blogs` - List published blog posts (category, tag, search, pagination)
- `GET /api/v1/public/blogs/{slug}` - Get published blog by slug
- `GET /api/v1/admin/blogs` - List all blogs (drafts, published, archived)
- `POST /api/v1/admin/blogs` - Create blog post
- `GET /api/v1/admin/blogs/{id}` - Get blog post by ID
- `PUT /api/v1/admin/blogs/{id}` - Update blog post
- `DELETE /api/v1/admin/blogs/{id}` - Delete blog post

### 9. FAQ Management
- `GET /api/v1/public/faqs` - List active FAQs
- `GET /api/v1/admin/faqs` - List all FAQs
- `POST /api/v1/admin/faqs` - Create FAQ
- `PUT /api/v1/admin/faqs/{id}` - Update FAQ
- `DELETE /api/v1/admin/faqs/{id}` - Delete FAQ

### 10. Contact Form & Messages
- `POST /api/v1/public/contact` - Public submit contact inquiry
- `GET /api/v1/admin/contact` - Admin list contact messages (status filter & search)
- `GET /api/v1/admin/contact/{id}` - Get contact message details
- `PATCH /api/v1/admin/contact/{id}/status` - Update message status (`NEW`, `READ`, `IN_PROGRESS`, `RESOLVED`, `SPAM`)
- `DELETE /api/v1/admin/contact/{id}` - Delete message

### 11. File Upload
- `POST /api/v1/admin/upload` - Secure image upload (JPG, PNG, WEBP) returning file URL e.g. `/uploads/file.webp`

### 12. Admin Dashboard
- `GET /api/v1/admin/dashboard` - Total counts and recent blogs, services, and messages

---

## Testing

Run unit & integration tests with pytest:

```bash
.venv/Scripts/python.exe -m pytest -v
```

---

## Project Structure

```text
logistics-backend/
├── app/
│   ├── main.py
│   ├── seed.py
│   ├── core/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── security.py
│   │   └── dependencies.py
│   ├── models/
│   │   ├── admin.py
│   │   ├── company.py
│   │   ├── home.py
│   │   ├── about.py
│   │   ├── service.py
│   │   ├── gallery.py
│   │   ├── blog.py
│   │   ├── faq.py
│   │   └── contact.py
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── company.py
│   │   ├── home.py
│   │   ├── about.py
│   │   ├── service.py
│   │   ├── gallery.py
│   │   ├── blog.py
│   │   ├── faq.py
│   │   ├── contact.py
│   │   └── dashboard.py
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py
│   │       ├── dashboard.py
│   │       ├── company.py
│   │       ├── home.py
│   │       ├── about.py
│   │       ├── services.py
│   │       ├── gallery.py
│   │       ├── blogs.py
│   │       ├── faq.py
│   │       ├── contact.py
│   │       ├── upload.py
│   │       ├── health.py
│   │       └── router.py
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── company_service.py
│   │   ├── home_service.py
│   │   ├── about_service.py
│   │   ├── service_service.py
│   │   ├── gallery_service.py
│   │   ├── blog_service.py
│   │   ├── faq_service.py
│   │   ├── contact_service.py
│   │   ├── dashboard_service.py
│   │   └── file_service.py
│   └── utils/
│       ├── pagination.py
│       ├── response.py
│       └── slug.py
├── alembic/
│   └── versions/
├── tests/
├── uploads/
├── .env
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```
