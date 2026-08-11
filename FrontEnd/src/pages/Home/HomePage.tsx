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
} from 'lucide-react';

import { Container } from '../../components/ui/Container';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { getHomeData } from '../../api/home.api';
import { HeroCarousel } from '../../components/HeroCarousel';
import { QuickTrackWidget } from '../../components/QuickTrackWidget';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../../components/ScrollReveal';

export const HomePage: React.FC = () => {
  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['homeData'],
    queryFn: getHomeData,
  });

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-72 rounded-2xl bg-slate-200" />
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

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 sm:pb-20 bg-slate-50 text-slate-900 min-h-screen overflow-hidden">
      {/* 1. HERO BANNER SECTION WITH MULTI-IMAGE CAROUSEL */}
      <section className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden">
        {/* Multi-Image Hero Carousel Background */}
        <HeroCarousel
          bannerImages={(hero as any)?.banner_images}
          defaultImage={hero?.background_image_url}
        />

        {/* Hero Content Overlay with Animated Scroll Reveals */}
        <Container className="relative z-20 py-16 sm:py-20 lg:py-28">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            {hero?.subtitle && (
              <ScrollReveal variant="fade-down" delay={0.1}>
                <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 backdrop-blur-md shadow-lg">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {hero.subtitle}
                </span>
              </ScrollReveal>
            )}

            <ScrollReveal variant="fade-up" delay={0.2}>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                {hero?.heading || (hero as any)?.title || 'WHITE STAR CARGO & LOGISTICS'}
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={0.3}>
              <p className="text-sm sm:text-lg lg:text-xl text-slate-200 font-normal leading-relaxed max-w-2xl drop-shadow-sm">
                {hero?.description ||
                  'Connecting global trade lanes through seamless Air Cargo, Sea Freight, Door to Door shipping, professional packing & short and long term warehousing.'}
              </p>
            </ScrollReveal>

            <ScrollReveal variant="zoom-in" delay={0.4}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                <Link to={hero?.primary_cta_url || (hero as any)?.button_url || '/contact'}>
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full sm:w-auto text-sm sm:text-base font-bold shadow-xl shadow-orange-600/30 justify-center"
                    rightIcon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                  >
                    {hero?.primary_cta_text || (hero as any)?.button_text || 'Contact Us Now'}
                  </Button>
                </Link>

                <Link to={hero?.secondary_cta_url || '/services'}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-sm sm:text-base font-bold border-white/80 bg-white/10 text-white hover:bg-white hover:text-slate-900 backdrop-blur-md justify-center"
                  >
                    {hero?.secondary_cta_text || 'Our Services'}
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* 2. QUICK SHIPMENT TRACKING & CALCULATOR WIDGET */}
      <section className="-mt-16 sm:-mt-20 lg:-mt-28 relative z-30 px-2 sm:px-0">
        <Container>
          <ScrollReveal variant="zoom-in" delay={0.2}>
            <QuickTrackWidget />
          </ScrollReveal>
        </Container>
      </section>

      {/* 3. ANIMATED STATISTICS COUNTER */}
      {statistics.length > 0 && (
        <section className="py-2 sm:py-4">
          <Container>
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {statistics.map((stat) => (
                <StaggerItem key={stat.id}>
                  <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-1">
                    <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-orange-600 tracking-tight">
                      {stat.value}
                    </div>
                    <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider sm:tracking-widest group-hover:text-slate-900 transition-colors">
                      {stat.label}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>
      )}

      {/* 4. FEATURED SERVICES SECTION */}
      <section className="py-6 sm:py-10">
        <Container>
          <ScrollReveal variant="fade-up">
            <SectionTitle
              badge="Our Core Services"
              title="Comprehensive Freight & Logistics Solutions"
              subtitle="Tailored transportation, door-to-door delivery, and secure storage services designed for operational precision."
            />
          </ScrollReveal>

          {services.length === 0 ? (
            <EmptyState title="No Featured Services" message="Services will appear here once configured in the admin panel." />
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service) => (
                <StaggerItem key={service.id}>
                  <div className="group rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                    <div className="h-48 sm:h-56 overflow-hidden relative bg-slate-100">
                      <img
                        src={
                          service.image_url ||
                          'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800'
                        }
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-md p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-slate-200 text-orange-600 shadow-md">
                        <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>

                    <div className="p-5 sm:p-7 flex flex-col flex-grow">
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm mb-5 sm:mb-6 flex-grow leading-relaxed line-clamp-3">
                        {service.short_description}
                      </p>
                      <Link
                        to={`/services/${service.slug}`}
                        className="inline-flex items-center text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 gap-2 mt-auto group/link"
                      >
                        <span>Explore Details</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          <ScrollReveal variant="fade-up" delay={0.2} className="text-center mt-10 sm:mt-14">
            <Link to="/services">
              <Button variant="outline" size="md" className="w-full sm:w-auto border-slate-300 text-slate-800 hover:bg-slate-100 justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Logistics Services
              </Button>
            </Link>
          </ScrollReveal>
        </Container>
      </section>

      {/* 5. WHY CHOOSE US TRUST & SECURITY SECTION */}
      <section className="py-14 sm:py-20 relative overflow-hidden bg-white border-y border-slate-200">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <Container className="relative z-10">
          <ScrollReveal variant="fade-up">
            <SectionTitle
              badge="Why Choose White Star Cargo"
              title="Building Global Supply Chain Trust"
              subtitle="Industry-leading logistics standards backed by real-time GPS fleet monitoring, customs compliance, and dedicated support."
            />
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <StaggerItem>
              <div className="p-6 sm:p-8 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-orange-500/50 shadow-sm hover:shadow-xl transition-all duration-300 group h-full">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5">100% Cargo Safety & Insurance</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Comprehensive transit insurance, tamper-evident container seal checks, and high-security warehouse surveillance for complete peace of mind.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="p-6 sm:p-8 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-orange-500/50 shadow-sm hover:shadow-xl transition-all duration-300 group h-full">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                  <Globe2 className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5">Global Freight Network</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Direct agent presence across major ports, customs hubs, and airport freight terminals across India, GCC, and worldwide routes.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="p-6 sm:p-8 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-orange-500/50 shadow-sm hover:shadow-xl transition-all duration-300 group h-full">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
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
      <section className="py-6 sm:py-10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 items-center">
            <ScrollReveal variant="fade-left">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200 group">
                <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200"
                  alt="Logistics Operations Center"
                  className="w-full h-[320px] sm:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 text-slate-900 shadow-xl">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3.5 bg-orange-600 rounded-xl text-white shadow-md shadow-orange-600/30 shrink-0">
                      <Award className="w-5 h-5 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm sm:text-lg text-slate-900">Licensed Freight Forwarder</h5>
                      <p className="text-[11px] sm:text-xs text-orange-600 font-semibold">Ruwi & Misfah Terminals, Sultanate of Oman</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-right">
              <div className="space-y-4 sm:space-y-6">
                <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700 border border-orange-200">
                  About Our Company
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                  Moving Cargo Worldwide With Unmatched Reliability
                </h2>
                <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
                  With over a decade of operational excellence in Oman, White Star Cargo provides multi-modal freight transport, door-to-door cargo handling, professional packing, and secure storage facilities across international shipping lanes.
                </p>

                <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">End-to-end Air & Sea Cargo handling across India & worldwide</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">Door to Door pick-up and delivery services</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">Short-term & long-term warehouse storage facilities</span>
                  </div>
                </div>

                <div className="pt-2 sm:pt-4">
                  <Link to="/about">
                    <Button variant="accent" size="md" className="w-full sm:w-auto justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Read More About Us
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* 7. PROJECT & FLEET GALLERY GRID WITH LIGHTBOX */}
      {gallery.length > 0 && (
        <section className="py-10 sm:py-14 bg-slate-100/70 border-t border-slate-200">
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
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
                      activeCategory === cat
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
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
                    onClick={() => setSelectedImage(item.image_url)}
                    className="group relative h-60 sm:h-72 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer bg-white border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-500"
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 text-white">
                      {item.category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-300 bg-slate-900/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg mb-1.5 inline-block">
                          {item.category}
                        </span>
                      )}
                      <h4 className="text-base sm:text-lg font-bold group-hover:text-orange-400 transition-colors">{item.title}</h4>
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
                <Button variant="outline" size="md" className="w-full sm:w-auto border-slate-300 text-slate-800 hover:bg-white justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View Full Media Gallery
                </Button>
              </Link>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* 8. FEATURED BLOG & NEWS SECTION */}
      {blogs.length > 0 && (
        <section className="py-6 sm:py-10">
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
                  <div className="group rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                    <div className="h-44 sm:h-48 overflow-hidden bg-slate-100 relative">
                      <img
                        src={
                          blog.featured_image_url ||
                          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
                        }
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-5 sm:p-7 flex flex-col flex-grow">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2 sm:mb-3">
                        <span className="font-bold text-orange-600 uppercase tracking-wider">{blog.category || 'Logistics'}</span>
                        {blog.published_at && (
                          <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm mb-5 sm:mb-6 flex-grow line-clamp-3 leading-relaxed">
                        {blog.summary}
                      </p>
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center text-xs sm:text-sm font-bold text-slate-900 hover:text-orange-600 gap-1.5 mt-auto transition-colors"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <ScrollReveal variant="fade-up" delay={0.2} className="text-center mt-10 sm:mt-12">
              <Link to="/blog">
                <Button variant="outline" size="md" className="w-full sm:w-auto border-slate-300 text-slate-800 hover:bg-slate-100 justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View All Blog Articles
                </Button>
              </Link>
            </ScrollReveal>
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
            <X className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
          </button>
          <img src={selectedImage} alt="Expanded view" className="max-w-full max-h-[90vh] rounded-xl sm:rounded-2xl shadow-2xl object-contain border border-slate-800" />
        </div>
      )}
    </div>
  );
};
