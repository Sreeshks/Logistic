import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  ShieldCheck,
  Globe2,
  Clock,
  Award,
  Truck,
  X,
  CheckCircle2,
  Plane,
  Ship,
  Box,
  Warehouse,
  MapPin,
  Trophy,
  Package,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  PhoneCall,
  Building2,
  Calendar,
  User,
} from 'lucide-react';

import { Container } from '../../components/ui/Container';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { getHomeData } from '../../api/home.api';
import { getCompanyInfo } from '../../api/company.api';
import { getAboutContent } from '../../api/about.api';
import { getPublicFAQs } from '../../api/faq.api';
import { getPublicBlogs } from '../../api/blogs.api';
import { getPublicServices } from '../../api/services.api';
import { getPublicGallery } from '../../api/gallery.api';
import { getImageUrl } from '../../utils/image';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../../components/ScrollReveal';
import { HeroCarousel } from '../../components/HeroCarousel';
import { SEO } from '../../components/SEO';
import { apiClient } from '../../api/client';
import type { Service, BlogPost, GalleryItem, FAQItem } from '../../types/api';

export const HomePage: React.FC = () => {
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackResult, setTrackResult] = useState<{
    found: boolean;
    tracking_number: string;
    status?: string;
    service_type?: string;
    origin?: string;
    destination?: string;
    current_location?: string;
    estimated_delivery?: string;
    last_updated?: string;
  } | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeGalleryCategory, setActiveGalleryCategory] = useState<string>('ALL');
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');

  // 1. Fetch Home Aggregated Data
  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['homeData'],
    queryFn: getHomeData,
  });

  // 2. Fetch Company Info
  const { data: companyResponse } = useQuery({
    queryKey: ['companyInfoHome'],
    queryFn: getCompanyInfo,
  });

  // 3. Fetch About Us Content
  const { data: aboutResponse } = useQuery({
    queryKey: ['aboutContentHome'],
    queryFn: getAboutContent,
  });

  // 4. Fetch Public FAQs (Ensures total sync with /faq page)
  const { data: faqResponse } = useQuery({
    queryKey: ['publicFAQsHome'],
    queryFn: getPublicFAQs,
  });

  // 5. Fetch Public Blogs (Ensures total sync with /blog page)
  const { data: blogResponse } = useQuery({
    queryKey: ['publicBlogsHome'],
    queryFn: () => getPublicBlogs(),
  });

  // 6. Fetch Public Services (Ensures total sync with /services page)
  const { data: servicesResponse } = useQuery({
    queryKey: ['publicServicesHome'],
    queryFn: () => getPublicServices(),
  });

  // 7. Fetch Public Gallery (Ensures total sync with /gallery page)
  const { data: galleryResponse } = useQuery({
    queryKey: ['publicGalleryHome'],
    queryFn: () => getPublicGallery(),
  });

  const companyInfo = companyResponse?.data;
  const about = aboutResponse?.data;
  const homeData = response?.data;

  if (isLoading) {
    return (
      <div className="py-12 space-y-12 bg-slate-50 min-h-screen text-slate-900">
        <Container>
          <Skeleton className="h-[480px] w-full rounded-2xl sm:rounded-3xl mb-8 bg-slate-200" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl bg-slate-200" />
            ))}
          </div>
        </Container>
      </div>
    );
  }

  if (isError) {
    return (
      <Container className="py-16 sm:py-20">
        <ErrorState
          title="Failed to Load Home Page Content"
          message="We could not establish a connection with the logistics backend server. Please verify the backend API is running."
          onRetry={refetch}
        />
      </Container>
    );
  }

  const hero = homeData?.hero;
  const statistics = homeData?.statistics || [];

  // DEFAULT FALLBACK SERVICES
  const defaultServices: Service[] = [
    {
      id: 1,
      title: 'Air Cargo',
      slug: 'air-cargo',
      short_description: 'Fast worldwide Air Cargo service with delivery across India in 7 to 15 days.',
      delivery_information: 'All Over India | 7 to 15 Days',
      category_name: 'Air Cargo',
      icon: 'plane',
      icon_name: 'plane',
      image: null,
      image_url: null,
      is_featured: true,
      is_active: true,
    },
    {
      id: 2,
      title: 'Sea Cargo',
      slug: 'sea-cargo',
      short_description: 'Cost-effective worldwide Sea Cargo service with delivery across India in 25 to 35 days.',
      delivery_information: 'All Over India | 25 to 35 Days',
      category_name: 'Sea Cargo',
      icon: 'ship',
      icon_name: 'ship',
      image: null,
      image_url: null,
      is_featured: true,
      is_active: true,
    },
    {
      id: 3,
      title: 'Door to Door Service',
      slug: 'door-to-door',
      short_description: 'Hassle-free door-to-door pickup and shipment delivery directly to recipient addresses.',
      delivery_information: 'Direct Pickup & Doorstep Delivery',
      category_name: 'Door to Door',
      icon: 'truck',
      icon_name: 'truck',
      image: null,
      image_url: null,
      is_featured: true,
      is_active: true,
    },
    {
      id: 4,
      title: 'Professional Packing & Shifting',
      slug: 'packing-shifting',
      short_description: 'Expert packing materials and safe box handling for household and commercial shifting.',
      delivery_information: 'Expert Care & Safe Handling',
      category_name: 'Packing & Shifting',
      icon: 'box',
      icon_name: 'box',
      image: null,
      image_url: null,
      is_featured: true,
      is_active: true,
    },
    {
      id: 5,
      title: 'Long & Short Time Storage Facility',
      slug: 'storage-facility',
      short_description: 'Secure short-term and long-term warehouse storage facilities for goods & cargo.',
      delivery_information: '24/7 Monitored Storage Units',
      category_name: 'Storage',
      icon: 'warehouse',
      icon_name: 'warehouse',
      image: null,
      image_url: null,
      is_featured: true,
      is_active: true,
    },
  ];

  const fetchedServices = servicesResponse?.data || homeData?.featured_services || [];
  const services = fetchedServices.length > 0 ? fetchedServices : defaultServices;

  // DEFAULT FALLBACK GALLERY
  const defaultGallery: GalleryItem[] = [
    {
      id: 1,
      title: 'Air Cargo Handling & Loading',
      category: 'Air Freight',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200',
      image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200',
      description: 'Palletized air cargo loading for express overseas shipment.',
      is_featured: true,
      is_active: true,
    },
    {
      id: 2,
      title: 'Sea Freight Container Terminal',
      category: 'Sea Freight',
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200',
      image_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200',
      description: 'Ocean cargo shipping containers ready for port clearance.',
      is_featured: true,
      is_active: true,
    },
    {
      id: 3,
      title: 'Storage & Warehouse Facility',
      category: 'Storage',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200',
      image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200',
      description: 'Climate-controlled warehouse for long and short-term cargo storage.',
      is_featured: true,
      is_active: true,
    },
  ];

  const fetchedGallery = galleryResponse?.data || homeData?.featured_gallery || [];
  const gallery = fetchedGallery.length > 0 ? fetchedGallery : defaultGallery;

  const categories: string[] = [
    'ALL',
    ...Array.from(new Set(gallery.map((item) => item.category).filter((c): c is string => Boolean(c)))),
  ];
  const filteredGallery =
    activeGalleryCategory === 'ALL' ? gallery : gallery.filter((item) => item.category === activeGalleryCategory);

  // DEFAULT FALLBACK BLOGS
  const defaultBlogs: BlogPost[] = [
    {
      id: 1,
      title: 'Air Cargo vs Sea Cargo: Choosing the Right Express Transit',
      slug: 'air-cargo-vs-sea-cargo',
      summary: 'Understand key timelines for Air Cargo (7-15 days) and Sea Cargo (25-35 days) to optimize your shipping budget.',
      short_description: 'Understand key timelines for Air Cargo (7-15 days) and Sea Cargo (25-35 days).',
      category: 'Logistics Guide',
      published_at: '2026-08-10',
      featured_image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
      featured_image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
      author: 'White Star Cargo Specialist',
      author_name: 'White Star Cargo Specialist',
      is_featured: true,
      status: 'PUBLISHED',
      content: '',
    },
    {
      id: 2,
      title: 'Professional Packing Guidelines for Overseas Door-to-Door Shipments',
      slug: 'professional-packing-guidelines',
      summary: 'Best practices for packing household and commercial goods for safe international transit without damage.',
      short_description: 'Best practices for packing household and commercial goods for safe transit.',
      category: 'Best Practices',
      published_at: '2026-08-08',
      featured_image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800',
      featured_image_url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800',
      author: 'White Star Cargo Specialist',
      author_name: 'White Star Cargo Specialist',
      is_featured: true,
      status: 'PUBLISHED',
      content: '',
    },
  ];

  const fetchedBlogs = blogResponse?.data || homeData?.featured_blogs || [];
  const blogs = fetchedBlogs.length > 0 ? fetchedBlogs : defaultBlogs;

  // DEFAULT FALLBACK FAQS
  const defaultFaqs: FAQItem[] = [
    {
      id: 1,
      question: 'What is the estimated delivery time for Air Cargo to India?',
      answer: 'Air Cargo delivery to all major destinations across India typically takes 7 to 15 days from dispatch.',
      category: 'Services',
      display_order: 1,
      is_active: true,
    },
    {
      id: 2,
      question: 'What is the estimated delivery time for Sea Cargo to India?',
      answer: 'Sea Cargo door-to-door shipment to all locations across India typically takes 25 to 35 days from port departure.',
      category: 'Services',
      display_order: 2,
      is_active: true,
    },
    {
      id: 3,
      question: 'Where are your primary branches located in Oman?',
      answer: 'Our main active branches are in Ruwi (Near Softy Ice Cream, Old Fish Market) and Misfah (Near Emerald Hyper Market), with new branches opening soon in Barka and Nizwa.',
      category: 'Locations',
      display_order: 3,
      is_active: true,
    },
    {
      id: 4,
      question: 'Do you offer professional packing and door-to-door pickup?',
      answer: 'Yes, our expert team provides custom box packing, fragile item wrapping, and direct door-to-door pickup across Oman.',
      category: 'Packing & Shifting',
      display_order: 4,
      is_active: true,
    },
    {
      id: 5,
      question: 'How can I track my cargo shipment status?',
      answer: 'You can track your shipment live using your tracking number (e.g., WSC-998231) or contact our WhatsApp support desk anytime.',
      category: 'Tracking',
      display_order: 5,
      is_active: true,
    },
  ];

  const fetchedFaqs = faqResponse?.data || [];
  const faqsList = fetchedFaqs.length > 0 ? fetchedFaqs : defaultFaqs;
  const filteredFaqs = faqsList.filter(
    (f) =>
      f.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearchQuery.toLowerCase())
  );

  // Destinations Showcase Data
  const destinations = [
    { name: 'India', transit: '7-15 Days Air / 25-35 Days Sea', flag: '🇮🇳', route: 'All Over India' },
    { name: 'GCC Countries', transit: '3-7 Days Express', flag: '🇴🇲', route: 'Oman, UAE, KSA, Qatar' },
    { name: 'Philippines', transit: '7-12 Days Air Freight', flag: '🇵🇭', route: 'Manila & Luzon Ports' },
    { name: 'Indonesia', transit: '8-14 Days Air Freight', flag: '🇮🇩', route: 'Jakarta & Major Cities' },
    { name: 'Sri Lanka', transit: '5-10 Days Freight', flag: '🇱🇰', route: 'Colombo & Doorstep' },
    { name: 'Bangladesh', transit: '7-12 Days Freight', flag: '🇧🇩', route: 'Dhaka & Chittagong' },
    { name: 'United Kingdom', transit: '5-9 Days Air Freight', flag: '🇬🇧', route: 'London & UK Mainland' },
    { name: 'United States', transit: '7-14 Days Global Cargo', flag: '🇺🇸', route: 'Major US Airports' },
  ];

  // Branches Data
  const branches = [
    {
      id: 1,
      name: 'Ruwi Branch',
      status: 'ACTIVE',
      location: 'Near Softy Ice Cream, Old Fish Market, Ruwi, Oman',
      phones: ['+968 99896945', '+968 71100628'],
      badge: 'Main Branch',
    },
    {
      id: 2,
      name: 'Misfah Branch',
      status: 'ACTIVE',
      location: 'Near Emerald Hyper Market, Misfah, Oman',
      phones: ['+968 92725902', '+968 99231653'],
      badge: 'Logistics Hub',
    },
    {
      id: 3,
      name: 'Barka Branch',
      status: 'COMING SOON',
      location: 'Sultanate of Oman',
      phones: ['+968 95807130'],
      badge: 'Opening Soon',
    },
    {
      id: 4,
      name: 'Nizwa Branch',
      status: 'COMING SOON',
      location: 'Sultanate of Oman',
      phones: ['+968 95807130'],
      badge: 'Opening Soon',
    },
  ];

  // Background image priority
  const heroBgImage =
    hero?.background_image ||
    hero?.background_image_url ||
    '/hero_landing_bg.png';

  const rawTitle = hero?.title || hero?.heading || 'DELIVERING TRUST, CONNECTING WORLDWIDE';
  const titleParts = rawTitle.includes(',') ? rawTitle.split(',') : [rawTitle];
  const firstPart = titleParts[0]?.trim();
  const secondPart = titleParts.slice(1).join(',').trim();

  // Icon Helper
  const getServiceIcon = (title: string, iconStr?: string | null) => {
    const name = (iconStr || title || '').toLowerCase();
    if (name.includes('air')) return <Plane className="w-6 h-6 text-primary" />;
    if (name.includes('sea')) return <Ship className="w-6 h-6 text-primary" />;
    if (name.includes('door')) return <Truck className="w-6 h-6 text-primary" />;
    if (name.includes('pack') || name.includes('shift')) return <Box className="w-6 h-6 text-primary" />;
    if (name.includes('storage') || name.includes('ware')) return <Warehouse className="w-6 h-6 text-primary" />;
    return <Truck className="w-6 h-6 text-primary" />;
  };

  const getStatIcon = (iconStr?: string | null) => {
    const icon = (iconStr || '').toLowerCase();
    if (icon.includes('trophy') || icon.includes('year') || icon.includes('award')) return <Trophy className="w-8 h-8 text-primary shrink-0" />;
    if (icon.includes('package') || icon.includes('box') || icon.includes('customer')) return <Package className="w-8 h-8 text-primary shrink-0" />;
    if (icon.includes('globe') || icon.includes('country') || icon.includes('world')) return <Globe2 className="w-8 h-8 text-primary shrink-0" />;
    return <Truck className="w-8 h-8 text-primary shrink-0" />;
  };

  const getHighlightIcon = (iconStr?: string) => {
    const icon = (iconStr || '').toLowerCase();
    if (icon.includes('shield') || icon.includes('safe') || icon.includes('lock')) return <ShieldCheck className="w-4 h-4" />;
    if (icon.includes('clock') || icon.includes('time')) return <Clock className="w-4 h-4" />;
    if (icon.includes('globe') || icon.includes('world')) return <Globe2 className="w-4 h-4" />;
    if (icon.includes('box') || icon.includes('door') || icon.includes('package')) return <Box className="w-4 h-4" />;
    return <ShieldCheck className="w-4 h-4" />;
  };

  const defaultHighlights = [
    { title: 'SAFE & SECURE', subtitle: 'Your cargo is safe in our hands', icon: 'shield' },
    { title: 'ON-TIME DELIVERY', subtitle: 'Fast & reliable delivery across India', icon: 'clock' },
    { title: 'WORLDWIDE REACH', subtitle: 'Air & Sea cargo to all major destinations', icon: 'globe' },
    { title: 'DOOR TO DOOR', subtitle: 'Complete logistics solution', icon: 'box' },
  ];

  let heroHighlights = defaultHighlights;
  if (hero?.highlights) {
    try {
      const parsed = typeof hero.highlights === 'string' ? JSON.parse(hero.highlights) : hero.highlights;
      if (Array.isArray(parsed) && parsed.length > 0) {
        heroHighlights = parsed;
      }
    } catch (e) {
      // Fallback
    }
  }

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingNumberInput.trim();
    if (!query) return;

    setIsTrackingLoading(true);
    setIsTrackingModalOpen(true);
    setTrackResult(null);

    try {
      const response: any = await apiClient.get(`/public/orders/track/${encodeURIComponent(query)}`);
      if (response && response.success && response.data?.found) {
        setTrackResult(response.data);
      } else {
        setTrackResult({ found: false, tracking_number: query });
      }
    } catch (err: any) {
      setTrackResult({ found: false, tracking_number: query });
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const getTrackingStepIndex = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 0;
      case 'PICKED_UP':
        return 1;
      case 'IN_TRANSIT':
        return 2;
      case 'OUT_FOR_DELIVERY':
        return 3;
      case 'DELIVERED':
        return 4;
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };


  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen overflow-hidden">
      <SEO
        title={companyInfo?.company_name ? `${companyInfo.company_name} - ${companyInfo.tagline || 'Worldwide Air & Sea Cargo Logistics'}` : 'Worldwide Air & Sea Cargo Logistics'}
        description={hero?.description || companyInfo?.description || 'Worldwide Air & Sea Cargo, Professional Packing & Shifting, and Storage Facilities.'}
        ogImage={heroBgImage}
      />

      {/* 1. HERO BANNER SECTION */}
      <section className="relative min-h-[640px] lg:min-h-[720px] bg-[#0c182c] text-white flex items-center overflow-hidden py-12 lg:py-16">
        <HeroCarousel
          bannerImages={hero?.banner_images}
          mobileBannerImages={hero?.mobile_banner_images}
          defaultImage={heroBgImage}
        />

        <Container className="relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              <ScrollReveal variant="fade-down" delay={0.1}>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-primary">
                    {hero?.subtitle || 'TRUSTED | RELIABLE | WORLDWIDE'}
                  </span>
                  <span className="h-0.5 w-10 bg-primary inline-block" />
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={0.2}>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.18] uppercase">
                  <span className="bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent drop-shadow-sm block">
                    {firstPart}
                  </span>
                  {secondPart && (
                    <span className="bg-gradient-to-r from-amber-400 via-primary to-orange-400 bg-clip-text text-transparent font-black drop-shadow-md block mt-1 sm:mt-1.5">
                      {secondPart}
                    </span>
                  )}
                </h1>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={0.3}>
                <p className="text-xs sm:text-sm lg:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
                  {hero?.description ||
                    'Worldwide Air & Sea Cargo, Professional Packing & Shifting, and Long & Short Time Storage Facilities.'}
                </p>
              </ScrollReveal>

              <ScrollReveal variant="zoom-in" delay={0.4}>
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Link to={hero?.button_url || hero?.primary_cta_url || '/contact'}>
                    <Button
                      variant="accent"
                      size="md"
                      className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xl justify-center"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      {hero?.button_text || hero?.primary_cta_text || 'Contact Us'}
                    </Button>
                  </Link>

                  <Link to="/contact">
                    <Button
                      variant="outline"
                      size="md"
                      className="px-6 py-3 rounded-xl font-black text-xs sm:text-sm text-slate-950 bg-white hover:bg-slate-100 border-2 border-white shadow-xl cursor-pointer"
                      leftIcon={<PhoneCall className="w-4 h-4 text-slate-950" />}
                    >
                      Speak to an Expert
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>

              {/* Bottom 4 Feature Highlights */}
              <ScrollReveal variant="fade-up" delay={0.5} className="pt-6 sm:pt-10">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-700/60 pt-6">
                  {heroHighlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="p-2 rounded-lg bg-primary/20 text-primary border border-primary/30 shrink-0">
                        {getHighlightIcon(item.icon)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{item.title}</h4>
                        <p className="text-[11px] text-slate-300 leading-tight mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Right Delivery Card */}
            <div className="lg:col-span-4 lg:ml-auto w-full max-w-sm sm:max-w-md">
              <ScrollReveal variant="fade-left" delay={0.3}>
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 bg-[#111e36]">
                  {/* Air Cargo Block */}
                  <div className="p-4 sm:p-4.5 bg-[#111e36] border-b border-slate-700/50 relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-tight">AIR CARGO</h3>
                        <p className="text-[10px] sm:text-[11px] font-bold text-primary uppercase tracking-wider mt-0.5">ALL OVER INDIA</p>
                        <div className="mt-1.5 text-sm sm:text-base font-black text-white">7 – 15 DAYS DELIVERY</div>
                        <Link
                          to="/services"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-200 hover:text-white mt-2 group-hover:translate-x-1 transition-transform"
                        >
                          <span>Learn More</span>
                          <ArrowRight className="w-3 h-3 text-primary" />
                        </Link>
                      </div>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-primary shrink-0">
                        <Plane className="w-5 h-5 stroke-[1.5]" />
                      </div>
                    </div>
                  </div>

                  {/* Sea Cargo Block */}
                  <div className="p-4 sm:p-4.5 bg-primary text-white relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-tight">SEA CARGO</h3>
                        <p className="text-[10px] sm:text-[11px] font-bold text-white/90 uppercase tracking-wider mt-0.5">ALL OVER INDIA</p>
                        <div className="mt-1.5 text-sm sm:text-base font-black text-white">25 – 35 DAYS DELIVERY</div>
                        <Link
                          to="/services"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-white mt-2 group-hover:translate-x-1 transition-transform"
                        >
                          <span>Learn More</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                        <Ship className="w-5 h-5 stroke-[1.5]" />
                      </div>
                    </div>
                  </div>

                  {/* Opening Soon Footer */}
                  <div className="px-3.5 py-2.5 bg-[#0c1628] text-white flex flex-wrap items-center justify-between gap-2 text-[11px] border-t border-slate-800">
                    <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">OPENING SOON</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-bold text-white">
                        <MapPin className="w-3 h-3 text-primary" />
                        BARKA
                      </span>
                      <span className="flex items-center gap-1 font-bold text-white">
                        <MapPin className="w-3 h-3 text-primary" />
                        NIZWA
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. TRACK SHIPMENT QUICK SEARCH BAR */}
      {hero?.show_tracking !== false && (
        <section className="bg-slate-900 border-y border-slate-800 py-6 text-white relative z-20">
          <Container>
            <div className="bg-[#111e36] p-4 sm:p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">Track Your Cargo Shipment</h3>
                  <p className="text-xs text-slate-300">Enter tracking number (e.g. WSC-998231) for live shipment updates</p>
                </div>
              </div>

              <form onSubmit={handleTrackSubmit} className="w-full md:w-auto flex items-center gap-2 max-w-md">
                <div className="relative flex-grow">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="Enter Tracking Number (e.g. WSC-100821)..."
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <Button
                  type="submit"
                  variant="accent"
                  size="sm"
                  isLoading={isTrackingLoading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold shrink-0"
                >
                  Track
                </Button>
              </form>
            </div>
          </Container>
        </section>
      )}

      {/* 3. WHAT WE DO - COMPLETE LOGISTICS SERVICES SECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
            {/* Left Intro */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">WHAT WE DO</span>
                <span className="h-0.5 w-10 bg-primary inline-block" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Complete Logistics Solutions
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                From pickup to final doorstep delivery, we handle every cargo shipment with utmost care, speed, and safety.
              </p>
              <div className="pt-2">
                <Link to="/services">
                  <Button variant="accent" size="md" className="px-6 py-3 rounded-xl font-bold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Explore All Services
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Services Cards Grid */}
            <div className="lg:col-span-8">
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {services.map((srv) => {
                  const srvImage = srv.image_url || srv.image;
                  const srvDesc = srv.short_description || srv.description || '';
                  const srvIcon = srv.icon_name || srv.icon;
                  return (
                    <StaggerItem key={srv.id}>
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full group">
                        <div>
                          {srvImage ? (
                            <div className="w-full h-28 rounded-xl overflow-hidden mb-3 bg-slate-100 relative">
                              <img
                                src={getImageUrl(srvImage)}
                                alt={srv.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              {getServiceIcon(srv.title, srvIcon)}
                            </div>
                          )}
                          <h3 className="text-base font-extrabold text-slate-900 mb-2 leading-snug group-hover:text-primary transition-colors">
                            {srv.title}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                            {srvDesc}
                          </p>
                        </div>
                        <div className="pt-4 border-t border-slate-100 mt-4">
                          <Link to={`/services/${srv.slug || 'details'}`} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:brightness-110">
                            <span>View Details</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </div>
          </div>

          {/* 4. STATISTICS BANNER */}
          <div className="mt-8">
            <ScrollReveal variant="zoom-in">
              <div className="bg-[#0b172a] text-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-800">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
                  {statistics.length > 0 ? (
                    statistics.map((stat) => (
                      <div key={stat.id} className="flex flex-col md:flex-row items-center md:items-start gap-4">
                        {getStatIcon(stat.icon)}
                        <div>
                          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            {stat.value}
                          </div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    [
                      { label: 'Years Experience', value: '10+', icon: 'trophy' },
                      { label: 'Successful Deliveries', value: '50K+', icon: 'package' },
                      { label: 'Active Branches', value: '4', icon: 'map-pin' },
                      { label: 'Countries Covered', value: '8+', icon: 'globe' },
                    ].map((stat, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row items-center md:items-start gap-4">
                        {getStatIcon(stat.icon)}
                        <div>
                          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            {stat.value}
                          </div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* 5. WHY CHOOSE US SECTION */}
      <section className="py-14 sm:py-20 relative overflow-hidden bg-slate-50 border-t border-slate-200">
        <Container>
          <ScrollReveal variant="fade-up">
            <SectionTitle
              badge={companyInfo?.company_name ? `Why Choose ${companyInfo.company_name}` : 'Why Choose Us'}
              title="Building Global Supply Chain Trust"
              subtitle="Industry-leading logistics standards backed by real-time tracking, customs compliance, and dedicated support."
            />
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <StaggerItem>
              <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 group h-full">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5">100% Cargo Safety & Insurance</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Comprehensive transit insurance, tamper-evident container seal checks, and high-security warehouse surveillance for total security.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 group h-full">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                  <Globe2 className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5">Global Freight Network</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Direct agent presence across major international ports, customs hubs, and airport freight terminals across India and GCC routes.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 group h-full">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5">On-Time Delivery Guarantee</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Air cargo delivery (7-15 days) and Sea Cargo transit (25-35 days) supported by automated route planning and fast customs protocols.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </Container>
      </section>

      {/* 6. ABOUT COMPANY PREVIEW */}
      <section className="py-14 sm:py-20 bg-white border-t border-slate-200">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 items-center">
            <ScrollReveal variant="fade-left">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 group">
                <img
                  src={
                    (about?.about_image || about?.image_url)
                      ? getImageUrl(about?.about_image || about?.image_url)
                      : 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200'
                  }
                  alt={about?.page_title || about?.title || 'Logistics Operations Center'}
                  className="w-full h-[320px] sm:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-slate-200 text-slate-900 shadow-xl">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3.5 bg-primary rounded-xl text-white shadow-md shrink-0">
                      <Award className="w-5 h-5 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm sm:text-lg text-slate-900">Licensed Freight Forwarder</h5>
                      <p className="text-[11px] sm:text-xs text-primary font-semibold">
                        {about?.years_experience ? `${about.years_experience}+ Years Experience` : 'Professional Supply Chain Logistics'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-right">
              <div className="space-y-4 sm:space-y-6">
                <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  About Our Company
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                  {about?.page_title || about?.title || 'Moving Cargo Worldwide With Unmatched Reliability'}
                </h2>
                <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
                  {about?.company_story || about?.story || about?.short_description || about?.subtitle || companyInfo?.description || 'White Star Cargo provides professional logistics solutions including door-to-door air & sea cargo forwarding, expert packing & shifting, and short and long-term storage facilities across Oman.'}
                </p>

                <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">End-to-end Air & Sea Cargo handling across India & worldwide</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">Door to Door pick-up and delivery services</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">Short-term & long-term warehouse storage facilities</span>
                  </div>
                </div>

                <div className="pt-2 sm:pt-4">
                  <Link to="/about">
                    <Button variant="accent" size="md" className="w-full sm:w-auto justify-center rounded-xl font-bold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Read More About Us
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* 7. DESTINATIONS COVERED & GLOBAL SHIPPING ROUTES SECTION */}
      <section className="py-14 sm:py-20 bg-slate-900 text-white border-t border-slate-800">
        <Container>
          <ScrollReveal variant="fade-up">
            <SectionTitle
              badge="Worldwide Network"
              title="Global Destinations & Trade Routes"
              subtitle="Express Air Cargo and Sea Shipping routes from Oman to international destinations."
            />
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8">
            {destinations.map((dest, idx) => (
              <StaggerItem key={idx}>
                <div className="p-5 rounded-2xl bg-[#111e36] border border-slate-800 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{dest.flag}</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg">
                      Active Route
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white mb-1 group-hover:text-primary transition-colors">{dest.name}</h3>
                  <p className="text-xs text-slate-400 mb-3">{dest.route}</p>
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      Transit Time:
                    </span>
                    <span className="text-white">{dest.transit}</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* 8. BRANCH LOCATIONS SHOWCASE SECTION */}
      <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200">
        <Container>
          <ScrollReveal variant="fade-up">
            <SectionTitle
              badge="Our Presence in Oman"
              title="Branch Locations & Service Hubs"
              subtitle="Visit our nearest active branch or contact our local logistics coordinators."
            />
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {branches.map((branch) => (
              <StaggerItem key={branch.id}>
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        branch.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {branch.status === 'ACTIVE' ? 'Active Branch' : 'Opening Soon'}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 mb-2">{branch.name}</h3>
                    <p className="text-xs text-slate-600 flex items-start gap-1.5 mb-4 leading-relaxed">
                      <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{branch.location}</span>
                    </p>
                  </div>

                    <div className="pt-4 border-t border-slate-100 space-y-2">
                    {branch.phones.length > 0 ? (
                      branch.phones.map((phone, pIdx) => {
                        const cleanPhone = phone.replace(/[^0-9]/g, '').replace(/^968/, '');
                        const displayPhone = phone.startsWith('+968') ? phone : `+968 ${phone}`;
                        return (
                          <a
                            key={pIdx}
                            href={`tel:+968${cleanPhone}`}
                            className="flex items-center justify-between text-xs font-bold text-slate-700 hover:text-primary transition-colors py-1 px-2.5 rounded-lg bg-slate-50 hover:bg-slate-100"
                          >
                            <span className="flex items-center gap-1.5">
                              <PhoneCall className="w-3.5 h-3.5 text-primary" />
                              {displayPhone}
                            </span>
                            <span className="text-[10px] text-primary">Call</span>
                          </a>
                        );
                      })
                    ) : (
                      <div className="text-xs font-medium text-slate-400 italic py-1">Contact Muscat Main Office</div>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* 9. FAQ (FREQUENTLY ASKED QUESTIONS) ACCORDION SECTION */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <Container size="md">
          <ScrollReveal variant="fade-up">
            <SectionTitle
              badge="Frequently Asked Questions"
              title="Common Questions & Help"
              subtitle="Find quick answers regarding transit times, customs documentation, door pickup, and cargo rates."
            />
          </ScrollReveal>

          {/* Search FAQ */}
          <ScrollReveal variant="fade-up" delay={0.1} className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search questions (e.g. air cargo, delivery time, tracking)..."
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
            </div>
          </ScrollReveal>

          {/* Accordions */}
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <ScrollReveal key={faq.id} variant="fade-up">
                  <div className="bg-slate-50/70 border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200">
                    <button
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base hover:text-primary transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-3 pr-4">
                        <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-200/60 leading-relaxed bg-white">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link to="/faq">
              <Button variant="outline" size="sm" className="border-slate-300 text-slate-800 hover:bg-slate-100 rounded-xl font-bold">
                View All FAQs
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 10. OPERATIONS & FLEET GALLERY SHOWCASE GRID */}
      <section className="py-14 sm:py-20 bg-slate-100/70 border-t border-slate-200">
        <Container>
          <ScrollReveal variant="fade-up">
            <SectionTitle
              badge="Work & Fleet Showcase"
              title="Operations & Project Gallery"
              subtitle="Explore our air cargo loading, sea shipping containers, and warehouse storage facilities."
            />
          </ScrollReveal>

          {/* Category Filter Tabs */}
          {categories.length > 1 && (
            <ScrollReveal variant="fade-up" delay={0.1} className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveGalleryCategory(cat)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
                    activeGalleryCategory === cat
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </ScrollReveal>
          )}

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredGallery.map((item) => {
              const itemImage = item.image_url || item.image || '';
              return (
                <StaggerItem key={item.id}>
                  <div
                    onClick={() => setSelectedImage(getImageUrl(itemImage))}
                    className="group relative h-60 sm:h-72 rounded-3xl overflow-hidden cursor-pointer bg-white border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-500"
                  >
                    <img
                      src={getImageUrl(itemImage)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 text-white">
                      {item.category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-primary px-2.5 py-1 rounded-lg mb-1.5 inline-block">
                          {item.category}
                        </span>
                      )}
                      <h4 className="text-base sm:text-lg font-bold group-hover:text-primary transition-colors">{item.title}</h4>
                      {item.description && (
                        <p className="text-[11px] sm:text-xs text-slate-200 mt-1 line-clamp-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          <ScrollReveal variant="fade-up" delay={0.2} className="text-center mt-10 sm:mt-12">
            <Link to="/gallery">
              <Button variant="outline" size="md" className="w-full sm:w-auto border-slate-300 text-slate-800 hover:bg-white justify-center rounded-xl font-bold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View Full Media Gallery
              </Button>
            </Link>
          </ScrollReveal>
        </Container>
      </section>

      {/* 11. FEATURED BLOG & TRADE NEWS SECTION */}
      <section className="py-14 sm:py-20 bg-white border-t border-slate-200">
        <Container>
          <ScrollReveal variant="fade-up">
            <SectionTitle
              badge="Latest Insights"
              title="Logistics & Trade Industry News"
              subtitle="Stay informed with shipping guidelines, customs duty tips, and transit time comparisons."
            />
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
            {blogs.map((blog) => {
              const blogImg = blog.featured_image_url || blog.featured_image;
              const blogSummary = blog.summary || blog.short_description || '';
              const blogAuthor = blog.author_name || blog.author;

              return (
                <StaggerItem key={blog.id}>
                  <div className="group rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                    <div className="h-44 sm:h-48 overflow-hidden bg-slate-100 relative">
                      <img
                        src={
                          blogImg
                            ? getImageUrl(blogImg)
                            : 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
                        }
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-5 sm:p-7 flex flex-col flex-grow">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2 sm:mb-3">
                        <span className="font-bold text-primary uppercase tracking-wider">{blog.category || 'Logistics'}</span>
                        {blog.published_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(blog.published_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm mb-5 sm:mb-6 flex-grow line-clamp-3 leading-relaxed">
                        {blogSummary}
                      </p>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                        {blogAuthor && (
                          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {blogAuthor}
                          </span>
                        )}
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="inline-flex items-center text-xs sm:text-sm font-bold text-slate-900 hover:text-primary gap-1.5 ml-auto transition-colors"
                        >
                          <span>Read Article</span>
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </Container>
      </section>

      {/* Live Order Tracking Modal */}
      {isTrackingModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setIsTrackingModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden text-slate-900 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 sm:p-3 bg-primary/20 text-primary rounded-2xl border border-primary/30 shrink-0">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">Live Cargo Shipment Tracking</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400">Real-time status verified with central logistics system</p>
                </div>
              </div>
              <button
                onClick={() => setIsTrackingModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
              {isTrackingLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                  <p className="text-sm font-bold text-slate-800">Connecting to Live Freight Database...</p>
                  <p className="text-xs text-slate-500">Querying waybill: {trackingNumberInput}</p>
                </div>
              ) : trackResult?.found ? (
                <div className="space-y-6">
                  {/* Waybill & Status Pill */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Waybill / Tracking #</span>
                      <h4 className="font-mono text-xl font-black text-primary">{trackResult.tracking_number}</h4>
                    </div>
                    <div>
                      <span className="px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-full border bg-emerald-100 text-emerald-800 border-emerald-300">
                        {trackResult.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* 5-Step Timeline Tracker */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Shipment Journey Progress</h5>
                    <div className="grid grid-cols-5 gap-2 relative">
                      {[
                        { label: 'Booking Confirmed', step: 0 },
                        { label: 'Picked Up', step: 1 },
                        { label: 'In Transit', step: 2 },
                        { label: 'Out for Delivery', step: 3 },
                        { label: 'Delivered', step: 4 },
                      ].map((item, idx) => {
                        const currentStep = getTrackingStepIndex(trackResult.status);
                        const isDone = currentStep >= item.step;
                        const isCurrent = currentStep === item.step;
                        return (
                          <div key={idx} className="flex flex-col items-center text-center">
                            <div
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                isDone
                                  ? 'bg-primary text-white shadow-md shadow-primary/40'
                                  : 'bg-slate-800 text-slate-500 border border-slate-700'
                              } ${isCurrent ? 'ring-4 ring-primary/30 animate-pulse' : ''}`}
                            >
                              {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span className={`text-[9px] sm:text-xs mt-2 font-bold leading-tight ${isDone ? 'text-white' : 'text-slate-500'}`}>
                              {item.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Service Type</span>
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm font-bold text-slate-900">{trackResult.service_type || 'Air Cargo Express'}</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Current Location</span>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm font-bold text-slate-900">{trackResult.current_location || 'Hub Sorting Facility'}</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Route (Origin → Destination)</span>
                      <span className="text-xs font-bold text-slate-800">
                        {trackResult.origin || 'Muscat, Oman'} → {trackResult.destination || 'Worldwide Destination'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Estimated Delivery</span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-sm font-black text-emerald-700">{trackResult.estimated_delivery || 'On Schedule'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <p className="text-[11px] text-slate-500">
                      Need customs clearance or delivery assistance?
                    </p>
                    <a
                      href={`https://wa.me/96895318182?text=Hello%20White%20Star%20Cargo%2C%20I%20am%20inquiring%20about%20waybill%20number%20${encodeURIComponent(trackResult.tracking_number)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>WhatsApp Support for this Waybill</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center space-y-4">
                  <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                    <HelpCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Shipment Not Found</h4>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                      No registered cargo order was found matching tracking number <span className="font-mono font-bold text-slate-900">"{trackResult?.tracking_number}"</span>.
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left text-xs text-amber-900 space-y-1 max-w-lg mx-auto">
                    <p className="font-bold">Tips for finding your shipment:</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-amber-800">
                      <li>Check that your waybill or tracking code was typed correctly.</li>
                      <li>Standard tracking IDs usually start with <code className="font-bold">WSC-</code> (e.g. WSC-100821).</li>
                      <li>If your cargo was booked today, please allow up to a few hours for the initial hub scanning.</li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setTrackingNumberInput('');
                        setIsTrackingModalOpen(false);
                      }}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                    >
                      Close & Try Again
                    </button>
                    <a
                      href="https://wa.me/96895318182?text=Hello%2C%20I%20need%20help%20tracking%20my%20cargo%20shipment."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-md transition"
                    >
                      Contact Customer Support
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white p-2.5 hover:bg-slate-800 rounded-full transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </button>
          <img src={selectedImage} alt="Expanded view" className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain border border-slate-800" />
        </div>
      )}
    </div>
  );
};

