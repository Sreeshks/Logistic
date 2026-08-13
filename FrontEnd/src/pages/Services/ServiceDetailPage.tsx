import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, Shield, PhoneCall, Truck } from 'lucide-react';

import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { getServiceBySlug } from '../../api/services.api';
import { getImageUrl } from '../../utils/image';

import { SEO } from '../../components/SEO';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['serviceDetail', slug],
    queryFn: () => getServiceBySlug(slug!),
    enabled: !!slug,
  });

  const service = response?.data;

  if (isLoading) {
    return (
      <Container className="py-12">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-32 w-full mb-6" />
      </Container>
    );
  }

  if (isError || !service) {
    return (
      <Container className="py-16 text-center">
        <ErrorState
          title="Service Not Found"
          message={`We could not locate details for service "${slug}". It may have been removed or updated.`}
          onRetry={refetch}
        />
        <div className="mt-6">
          <Link to="/services">
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Services
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-12 space-y-12">
      <SEO
        title={service.meta_title || service.title}
        description={service.meta_description || service.short_description}
        ogTitle={service.og_title || service.meta_title || service.title}
        ogDescription={service.og_description || service.meta_description || service.short_description}
        ogImage={service.og_image || service.image_url || service.image}
      />
      <Container>
        <Breadcrumb items={[{ label: 'Services', href: '/services' }, { label: service.title }]} />

        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl mb-12 bg-slate-900 text-white min-h-[340px] flex items-center">
          <img
            src={
              (service.image_url || service.image)
                ? getImageUrl(service.image_url || service.image)
                : 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200'
            }
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />

          <div className="relative z-10 p-8 sm:p-12 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
              <Truck className="w-3.5 h-3.5" />
              Specialized Service
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              {service.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-300">
              {service.short_description}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Description Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Service Overview</h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                <p>{service.full_description || service.description || service.short_description}</p>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Key Capabilities & Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium text-slate-700">Real-time status tracking & milestone updates</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium text-slate-700">Full customs compliance & documentation handling</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium text-slate-700">Door-to-door multimodal transit options</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium text-slate-700">Cargo insurance coverage options available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar CTA Card */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Request a Custom Quote</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Need tailored volume rates or special cargo handling for {service.title}? Speak directly with our freight desk.
              </p>

              <div className="space-y-3 pt-2">
                <Link to="/contact" className="block w-full">
                  <Button variant="accent" size="md" className="w-full justify-center">
                    Request Quote Now
                  </Button>
                </Link>
                <Link to="/contact" className="block w-full">
                  <Button variant="outline" size="md" className="w-full justify-center bg-white text-slate-950 hover:bg-slate-100 hover:text-black font-extrabold border-2 border-white shadow" leftIcon={<PhoneCall className="w-4 h-4 text-slate-950" />}>
                    Call Freight Desk
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
