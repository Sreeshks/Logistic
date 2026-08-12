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
} from 'lucide-react';

import { Container } from '../../components/ui/Container';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { getHomeData } from '../../api/home.api';
import { getCompanyInfo } from '../../api/company.api';
import { getAboutContent } from '../../api/about.api';
import { getImageUrl } from '../../utils/image';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../../components/ScrollReveal';
import { HeroCarousel } from '../../components/HeroCarousel';

export const HomePage: React.FC = () => {
  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['homeData'],
    queryFn: getHomeData,
  });

  const { data: companyResponse } = useQuery({
    queryKey: ['companyInfoHome'],
    queryFn: getCompanyInfo,
  });

  const { data: aboutResponse } = useQuery({
    queryKey: ['aboutContentHome'],
    queryFn: getAboutContent,
  });

  const companyInfo = companyResponse?.data;
  const about = aboutResponse?.data;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

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
  const services = homeData?.featured_services || [];
  const gallery = homeData?.featured_gallery || [];
  const blogs = homeData?.featured_blogs || [];

  // Filter gallery items by category
  const categories: string[] = [
    'ALL',
    ...Array.from(new Set(gallery.map((item) => item.category).filter((c): c is string => Boolean(c)))),
  ];
  const filteredGallery =
    activeCategory === 'ALL' ? gallery : gallery.filter((item) => item.category === activeCategory);

  // Background image priority: Hero DB image -> Hero uploaded background -> public local hero image fallback
  const heroBgImage =
    hero?.background_image ||
    hero?.background_image_url ||
    '/hero_landing_bg.png';

  // Hero title helper to render multi-tone dynamic title attractively
  const rawTitle = hero?.title || hero?.heading || 'DELIVERING TRUST, CONNECTING WORLDWIDE';
  const titleParts = rawTitle.includes(',') ? rawTitle.split(',') : [rawTitle];
  const firstPart = titleParts[0]?.trim();
  const secondPart = titleParts.slice(1).join(',').trim();

  // Helper to resolve service icons
  const getServiceIcon = (title: string, iconStr?: string | null) => {
    const name = (iconStr || title || '').toLowerCase();
    if (name.includes('air')) return <Plane className="w-6 h-6 text-primary" />;
    if (name.includes('sea')) return <Ship className="w-6 h-6 text-primary" />;
    if (name.includes('door')) return <Truck className="w-6 h-6 text-primary" />;
    if (name.includes('pack') || name.includes('shift')) return <Box className="w-6 h-6 text-primary" />;
    if (name.includes('storage') || name.includes('ware')) return <Warehouse className="w-6 h-6 text-primary" />;
    return <Truck className="w-6 h-6 text-primary" />;
  };

  // Helper to resolve stat icons
  const getStatIcon = (iconStr?: string | null) => {
    const icon = (iconStr || '').toLowerCase();
    if (icon.includes('trophy') || icon.includes('year') || icon.includes('award')) return <Trophy className="w-8 h-8 text-primary shrink-0" />;
    if (icon.includes('package') || icon.includes('box') || icon.includes('customer')) return <Package className="w-8 h-8 text-primary shrink-0" />;
    if (icon.includes('globe') || icon.includes('country') || icon.includes('world')) return <Globe2 className="w-8 h-8 text-primary shrink-0" />;
    return <Truck className="w-8 h-8 text-primary shrink-0" />;
  };

  // Helper to resolve highlight icons
  const getHighlightIcon = (iconStr?: string) => {
    const icon = (iconStr || '').toLowerCase();
    if (icon.includes('shield') || icon.includes('safe') || icon.includes('lock')) return <ShieldCheck className="w-4 h-4" />;
    if (icon.includes('clock') || icon.includes('time')) return <Clock className="w-4 h-4" />;
    if (icon.includes('globe') || icon.includes('world')) return <Globe2 className="w-4 h-4" />;
    if (icon.includes('box') || icon.includes('door') || icon.includes('package')) return <Box className="w-4 h-4" />;
    return <ShieldCheck className="w-4 h-4" />;
  };

  // Dynamic feature highlights from DB
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
      // Fallback to default
    }
  }

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen overflow-hidden">
      {/* 1. HERO BANNER SECTION (MATCHES LANDINGPAGE.PNG EXACTLY) */}
      <section className="relative min-h-[640px] lg:min-h-[720px] bg-[#0c182c] text-white flex items-center overflow-hidden py-12 lg:py-16">
        {/* Background Carousel with Dark Overlay */}
        <HeroCarousel
          bannerImages={hero?.banner_images}
          mobileBannerImages={hero?.mobile_banner_images}
          defaultImage={heroBgImage}
        />

        <Container className="relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
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

                  <Link to={hero?.secondary_button_url || hero?.secondary_cta_url || '/services'}>
                    <button
                      type="button"
                      className="relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm text-slate-900 bg-white hover:bg-slate-100 hover:scale-105 border border-white shadow-xl transition-all duration-300 cursor-pointer group"
                    >
                      <span>{hero?.secondary_button_text || hero?.secondary_cta_text || 'Our Services'}</span>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </ScrollReveal>

              {/* Bottom 4 Feature Highlights Row */}
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

            {/* Right Quick Delivery Side Card */}
            <div className="lg:col-span-4 lg:ml-auto w-full max-w-sm sm:max-w-md">
              <ScrollReveal variant="fade-left" delay={0.3}>
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 bg-[#111e36]">
                  {/* Top Block: Air Cargo */}
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

                  {/* Middle Block: Sea Cargo */}
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

                  {/* Bottom Block: Opening Soon */}
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

      {/* 2. "WHAT WE DO" - COMPLETE LOGISTICS SOLUTIONS SECTION (MATCHES LANDINGPAGE.PNG EXACTLY) */}
      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
            {/* Left Intro Block */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">WHAT WE DO</span>
                <span className="h-0.5 w-10 bg-primary inline-block" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Complete Logistics Solutions
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                From pickup to final delivery, we handle everything with care, professionalism and commitment.
              </p>
              <div className="pt-2">
                <Link to="/services">
                  <Button variant="accent" size="md" className="px-6 py-3 rounded-xl font-bold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Explore All Services
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right 5 Services Cards Grid */}
            <div className="lg:col-span-8">
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {services.length > 0 ? (
                  services.slice(0, 5).map((srv) => (
                    <StaggerItem key={srv.id}>
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full group">
                        <div>
                          {(srv.image_url || srv.image) ? (
                            <div className="w-full h-28 rounded-xl overflow-hidden mb-3 bg-slate-100 relative">
                              <img
                                src={getImageUrl(srv.image_url || srv.image)}
                                alt={srv.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              {getServiceIcon(srv.title, srv.icon_name || srv.icon)}
                            </div>
                          )}
                          <h3 className="text-base font-extrabold text-slate-900 mb-2 leading-snug group-hover:text-primary transition-colors">
                            {srv.title}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                            {srv.short_description}
                          </p>
                        </div>
                        <div className="pt-4 border-t border-slate-100 mt-4">
                          <Link to={`/services/${srv.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:brightness-110">
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </StaggerItem>
                  ))
                ) : (
                  // Fallback 5 standard service cards
                  [
                    { title: 'Air Cargo', desc: 'Fast & reliable air cargo services to all over India.' },
                    { title: 'Sea Cargo', desc: 'Cost-effective sea cargo services to all over India.' },
                    { title: 'Door To Door', desc: 'Hassle-free door to door delivery anywhere in India.' },
                    { title: 'Packing & Shifting', desc: 'Professional packing & shifting for safe delivery.' },
                    { title: 'Storage Facility', desc: 'Long & short time storage facility with full security.' },
                  ].map((item, idx) => (
                    <StaggerItem key={idx}>
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full group">
                        <div>
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            {getServiceIcon(item.title)}
                          </div>
                          <h3 className="text-base font-extrabold text-slate-900 mb-2 leading-snug group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                        <div className="pt-4 border-t border-slate-100 mt-4">
                          <Link to="/services" className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </StaggerItem>
                  ))
                )}
              </StaggerContainer>
            </div>
          </div>

          {/* 3. STATISTICS BANNER (DARK CURVED CONTAINER BELOW SERVICES MATCHES LANDINGPAGE.PNG) */}
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
                    // Default stats fallback if empty
                    [
                      { label: 'Years Experience', value: '10+', icon: 'trophy' },
                      { label: 'Happy Customers', value: '50K+', icon: 'package' },
                      { label: 'Countries Covered', value: '8+', icon: 'globe' },
                      { label: 'On-time Delivery', value: '100%', icon: 'truck' },
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

      {/* 4. WHY CHOOSE US SECTION */}
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
                  Comprehensive transit insurance, tamper-evident container seal checks, and high-security warehouse surveillance for complete peace of mind.
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
                  Direct agent presence across major ports, customs hubs, and airport freight terminals across India, GCC, and worldwide routes.
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

      {/* 5. ABOUT COMPANY PREVIEW */}
      <section className="py-14 sm:py-20 bg-white border-t border-slate-200">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 items-center">
            <ScrollReveal variant="fade-left">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 group">
                <img
                  src={
                    about?.image_url
                      ? getImageUrl(about.image_url)
                      : 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200'
                  }
                  alt="Logistics Operations Center"
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
                  {about?.title || 'Moving Cargo Worldwide With Unmatched Reliability'}
                </h2>
                <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
                  {about?.story || about?.subtitle || companyInfo?.description || ''}
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

      {/* 6. PROJECT & FLEET GALLERY GRID */}
      {gallery.length > 0 && (
        <section className="py-12 sm:py-16 bg-slate-100/70 border-t border-slate-200">
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
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all ${activeCategory === cat
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
              {filteredGallery.map((item) => (
                <StaggerItem key={item.id}>
                  <div
                    onClick={() => setSelectedImage(getImageUrl(item.image_url))}
                    className="group relative h-60 sm:h-72 rounded-3xl overflow-hidden cursor-pointer bg-white border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-500"
                  >
                    <img
                      src={getImageUrl(item.image_url)}
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
              ))}
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
      )}

      {/* 7. FEATURED BLOG & NEWS SECTION */}
      {blogs.length > 0 && (
        <section className="py-12 sm:py-16 bg-white border-t border-slate-200">
          <Container>
            <ScrollReveal variant="fade-up">
              <SectionTitle
                badge="Latest Insights"
                title="Logistics & Trade Industry News"
                subtitle="Stay informed with shipping guidelines, customs duty tips, and transit time comparisons."
              />
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogs.map((blog) => (
                <StaggerItem key={blog.id}>
                  <div className="group rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                    <div className="h-44 sm:h-48 overflow-hidden bg-slate-100 relative">
                      <img
                        src={
                          blog.featured_image_url
                            ? getImageUrl(blog.featured_image_url)
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
                          <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm mb-5 sm:mb-6 flex-grow line-clamp-3 leading-relaxed">
                        {blog.summary}
                      </p>
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center text-xs sm:text-sm font-bold text-slate-900 hover:text-primary gap-1.5 mt-auto transition-colors"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>
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
