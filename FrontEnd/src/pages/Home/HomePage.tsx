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
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { getHomeData } from '../../api/home.api';

export const HomePage: React.FC = () => {
  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['homeData'],
    queryFn: getHomeData,
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  const homeData = response?.data;

  if (isLoading) {
    return (
      <div className="py-12 space-y-12">
        <Container>
          <Skeleton className="h-[450px] w-full rounded-2xl mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        </Container>
      </div>
    );
  }

  if (isError) {
    return (
      <Container className="py-16">
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

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center bg-slate-900 text-white overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              hero?.background_image_url ||
              'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000'
            }
            alt="Logistics Fleet & Container Shipping"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        <Container className="relative z-10 py-16 lg:py-24">
          <div className="max-w-2xl space-y-6">
            {hero?.subtitle && (
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Truck className="w-3.5 h-3.5" />
                {hero.subtitle}
              </span>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
              {hero?.heading || (hero as any)?.title || 'GLOBAL LOGISTICS & SUPPLY CHAIN EXCELLENCE'}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              {hero?.description ||
                'Connecting international trade lanes through seamless freight forwarding, ocean cargo, air express, and intelligent warehousing solutions.'}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link to={hero?.primary_cta_url || (hero as any)?.button_url || '/contact'}>
                <Button variant="accent" size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  {hero?.primary_cta_text || (hero as any)?.button_text || 'Get a Quote'}
                </Button>
              </Link>

              <Link to={hero?.secondary_cta_url || '/services'}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-slate-900">
                  {hero?.secondary_cta_text || 'Explore Services'}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. STATISTICS COUNTER */}
      {statistics.length > 0 && (
        <section className="-mt-16 relative z-20">
          <Container>
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {statistics.map((stat) => (
                <div key={stat.id} className="text-center pt-4 md:pt-0 first:pt-0">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-orange-600 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 3. FEATURED SERVICES SECTION */}
      <section className="py-8">
        <Container>
          <SectionTitle
            badge="Our Core Capabilities"
            title="Comprehensive Logistics Solutions"
            subtitle="Tailored transportation and supply chain services designed for operational precision and global reliability."
          />

          {services.length === 0 ? (
            <EmptyState title="No Featured Services" message="Services will appear here once configured in the admin panel." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card key={service.id} className="flex flex-col h-full">
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={
                        service.image_url ||
                        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800'
                      }
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md p-2 rounded-lg text-orange-400">
                      <Truck className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed line-clamp-3">
                      {service.short_description}
                    </p>
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center text-sm font-bold text-orange-600 hover:text-orange-700 gap-1.5 mt-auto transition-colors"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Logistics Services
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 4. WHY CHOOSE US TRUST SECTION */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <Container>
          <SectionTitle
            badge="Why Choose Us"
            title="Building Global Supply Chain Trust"
            subtitle="Industry-leading performance metrics backed by modern tracking technology, compliance, and dedicated account support."
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-800/80 rounded-xl border border-slate-700 hover:border-orange-500/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">100% Cargo Security</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Full insurance coverage, sealed container integrity checks, and high-security warehouse surveillance for your peace of mind.
              </p>
            </div>

            <div className="p-6 bg-slate-800/80 rounded-xl border border-slate-700 hover:border-orange-500/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
                <Globe2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Global Partner Network</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Direct agent presence across major ports, customs hubs, and airport freight terminals across 100+ countries.
              </p>
            </div>

            <div className="p-6 bg-slate-800/80 rounded-xl border border-slate-700 hover:border-orange-500/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">On-Time Delivery Guarantee</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Optimized route planning, real-time GPS fleet monitoring, and expedited customs clearance protocols minimize transit delays.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. ABOUT PREVIEW SECTION */}
      <section className="py-8">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200"
                alt="Logistics Operations Center"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md p-6 rounded-xl border border-slate-700 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-600 rounded-lg">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-base">Certified Freight Operator</h5>
                    <p className="text-xs text-slate-300">ISO 9001:2015 & IATA Accredited</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700 border border-orange-200">
                About Our Company
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                Moving Businesses Forward With Dependable Logistics
              </h2>
              <p className="text-slate-600 leading-relaxed">
                With over a decade of operational expertise, we specialize in multi-modal freight transport, complex customs handling, and supply chain optimization tailored for commercial enterprises worldwide.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">End-to-end multimodal transport management</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">Transparent freight pricing & duty calculation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">24/7 dedicated cargo tracking support desk</span>
                </div>
              </div>

              <div className="pt-4">
                <Link to="/about">
                  <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Read More About Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. FEATURED GALLERY PREVIEW */}
      {gallery.length > 0 && (
        <section className="py-8 bg-slate-100">
          <Container>
            <SectionTitle
              badge="Work Showcase"
              title="Project & Fleet Gallery"
              subtitle="Visual insights into our shipping operations, container terminals, and heavy transport projects."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item.image_url)}
                  className="group relative h-64 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    {item.category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-slate-900/80 px-2 py-0.5 rounded mb-1 inline-block">
                        {item.category}
                      </span>
                    )}
                    <h4 className="text-base font-bold">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/gallery">
                <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View Full Gallery
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* 7. FEATURED BLOGS */}
      {blogs.length > 0 && (
        <section className="py-8">
          <Container>
            <SectionTitle
              badge="Latest Insights"
              title="Logistics & Supply Chain News"
              subtitle="Stay updated with trade regulation changes, shipping tips, and industry trends."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Card key={blog.id} className="flex flex-col h-full">
                  <div className="h-44 overflow-hidden">
                    <img
                      src={
                        blog.featured_image_url ||
                        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
                      }
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-orange-600 uppercase">{blog.category || 'General'}</span>
                      {blog.published_at && (
                        <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 flex-grow line-clamp-3 leading-relaxed">
                      {blog.summary || (blog as any).short_description}
                    </p>
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="inline-flex items-center text-sm font-bold text-slate-900 hover:text-orange-600 gap-1 mt-auto transition-colors"
                    >
                      Read Full Article →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/blog">
                <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View All Blog Articles
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white p-2 hover:bg-slate-800 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img src={selectedImage} alt="Expanded view" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain" />
        </div>
      )}
    </div>
  );
};
