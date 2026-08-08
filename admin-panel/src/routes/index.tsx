import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from '../components/common/AuthGuard';
import { MainLayout } from '../layouts/MainLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CompanyPage } from '../pages/CompanyPage';
import { HomeManagementPage } from '../pages/website/HomeManagementPage';
import { AboutManagementPage } from '../pages/website/AboutManagementPage';
import { ServicesListPage } from '../pages/services/ServicesListPage';
import { ServiceCreatePage } from '../pages/services/ServiceCreatePage';
import { ServiceEditPage } from '../pages/services/ServiceEditPage';
import { GalleryListPage } from '../pages/gallery/GalleryListPage';
import { BlogsListPage } from '../pages/blogs/BlogsListPage';
import { BlogCreatePage } from '../pages/blogs/BlogCreatePage';
import { BlogEditPage } from '../pages/blogs/BlogEditPage';
import { FAQsListPage } from '../pages/faqs/FAQsListPage';
import { ContactListPage } from '../pages/contact/ContactListPage';
import { ContactDetailPage } from '../pages/contact/ContactDetailPage';
import { AdminUsersPage } from '../pages/admin-users/AdminUsersPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SettingsPage } from '../pages/SettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/company" element={<CompanyPage />} />

        {/* Website CMS */}
        <Route path="/website/home" element={<HomeManagementPage />} />
        <Route path="/website/about" element={<AboutManagementPage />} />

        {/* Services */}
        <Route path="/services" element={<ServicesListPage />} />
        <Route path="/services/create" element={<ServiceCreatePage />} />
        <Route path="/services/:id/edit" element={<ServiceEditPage />} />

        {/* Gallery */}
        <Route path="/gallery" element={<GalleryListPage />} />

        {/* Blogs */}
        <Route path="/blogs" element={<BlogsListPage />} />
        <Route path="/blogs/create" element={<BlogCreatePage />} />
        <Route path="/blogs/:id/edit" element={<BlogEditPage />} />

        {/* FAQs */}
        <Route path="/faqs" element={<FAQsListPage />} />

        {/* Contact Enquiries */}
        <Route path="/contact-messages" element={<ContactListPage />} />
        <Route path="/contact-messages/:id" element={<ContactDetailPage />} />

        {/* System & Profile */}
        <Route
          path="/admin-users"
          element={
            <AuthGuard requireSuperAdmin>
              <AdminUsersPage />
            </AuthGuard>
          }
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
