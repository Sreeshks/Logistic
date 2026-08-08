# Logistics Website — React Admin Panel & CMS

Professional, modern React + TypeScript + Vite Admin Panel & Content Management System built for the Logistics Company Website.

---

## Technology Stack

- **Framework**: React 18+ & TypeScript (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Data Fetching & State**: TanStack Query (`@tanstack/react-query`)
- **HTTP Client**: Axios with automated token refresh & auth interceptors
- **Form Management**: React Hook Form + Zod (`@hookform/resolvers/zod`)
- **Icons**: Lucide React

---

## Features & Modules

1. **Authentication & Security**:
   - Protected Route Guards (`AuthGuard`)
   - Role-based permissions (`SUPER_ADMIN` & `ADMIN`)
   - Persistent session management & automatic refresh handling

2. **Dashboard (`/dashboard`)**:
   - Real-time statistics cards (Services, Blogs, Gallery Media, Contact Enquiries)
   - Recent Contact Messages quick response table
   - Recent Blogs & Active Services panels

3. **Company Information (`/company`)**:
   - Company branding assets (Logo, Favicon upload & preview)
   - Contact details (Phone, WhatsApp, Email, Operating Hours, Address, Google Maps)
   - Social media profiles

4. **Website Home Page CMS (`/website/home`)**:
   - Hero banner management (Heading, Subtitle, Description, CTA button, Hero Image)
   - Company Statistics Manager (Label, Value, Icon, Display Order, Active switch)

5. **About Us CMS (`/website/about`)**:
   - Page title, short overview, company story, mission, vision, core values, and banner image

6. **Services Management (`/services`)**:
   - Complete Services CRUD with image upload, slug auto-generation, featured toggle, active status, display ordering, and SEO metadata (`meta_title`, `og_image`)

7. **Gallery Management (`/gallery`)**:
   - Visual grid of gallery items with category tags, featured homepage toggles, active status, image uploader, and CRUD modals

8. **Blog CMS (`/blogs`)**:
   - Blog posts table with status badges (`DRAFT`, `PUBLISHED`, `ARCHIVED`), category & status filters, search bar, author, tags, and full CRUD

9. **FAQ Management (`/faqs`)**:
   - Categorized FAQ manager with custom display ordering and toggleable active status

10. **Contact Enquiries (`/contact-messages`)**:
    - Manage customer quote requests and contact form submissions
    - Detailed message viewer with quick status action triggers (`NEW`, `READ`, `IN_PROGRESS`, `RESOLVED`, `SPAM`)

11. **System & Profile (`/admin-users`, `/profile`, `/settings`)**:
    - Admin user list (Super Admin access)
    - Admin profile and password update

---

## Setup & Running

1. **Install Dependencies**:
   ```bash
   cd admin-panel
   npm install
   ```

2. **Configure Environment**:
   Ensure `.env` contains the API base URL pointing to the FastAPI backend:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```
