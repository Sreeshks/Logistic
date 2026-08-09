import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { HomePage } from '../pages/Home/HomePage';
import { AboutPage } from '../pages/About/AboutPage';
import { ServicesPage } from '../pages/Services/ServicesPage';
import { ServiceDetailPage } from '../pages/Services/ServiceDetailPage';
import { GalleryPage } from '../pages/Gallery/GalleryPage';
import { BlogPage } from '../pages/Blog/BlogPage';
import { BlogDetailPage } from '../pages/Blog/BlogDetailPage';
import { FAQPage } from '../pages/FAQ/FAQPage';
import { ContactPage } from '../pages/Contact/ContactPage';
import { NotFoundPage } from '../pages/NotFound/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'services/:slug', element: <ServiceDetailPage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'blog/:slug', element: <BlogDetailPage /> },
      { path: 'faq', element: <FAQPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
