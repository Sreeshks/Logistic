import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Target, Eye } from 'lucide-react';

import { Container } from '../../components/ui/Container';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { getAboutContent } from '../../api/about.api';

export const AboutPage: React.FC = () => {
  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['aboutContent'],
    queryFn: getAboutContent,
  });

  const about = response?.data;

  if (isLoading) {
    return (
      <Container className="py-12 space-y-8">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="py-16">
        <ErrorState
          title="Failed to Load About Us Content"
          message="Could not fetch company details from backend API."
          onRetry={refetch}
        />
      </Container>
    );
  }

  return (
    <div className="py-12 space-y-16">
      <Container>
        <Breadcrumb items={[{ label: 'About Us' }]} />

        <SectionTitle
          badge="Our Story & Culture"
          title={about?.title || 'Global Freight & Supply Chain Leaders'}
          subtitle={about?.subtitle || 'Pioneering reliable transport networks and transparent logistics management across worldwide trade routes.'}
        />

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 lg:p-12 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-6">
            <h3 className="text-2xl font-extrabold text-slate-900">
              {about?.years_experience ? `${about.years_experience}+ Years of Operational Leadership` : 'Decades of Logistics Precision'}
            </h3>
            <p className="text-slate-600 leading-relaxed font-normal">
              {about?.story ||
                'Founded on the principle of uncompromised supply chain efficiency, our logistics company operates seamless multi-modal freight operations. We combine modern tracking intelligence with seasoned customs expertise.'}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 bg-slate-50 rounded-xl">
                <span className="text-2xl font-black text-orange-600 block mb-1">
                  {about?.years_experience || 10}+ Years
                </span>
                <span className="text-xs font-bold text-slate-600 uppercase">Industry Leadership</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <span className="text-2xl font-black text-slate-900 block mb-1">100%</span>
                <span className="text-xs font-bold text-slate-600 uppercase">Trackable Cargo</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200">
            <img
              src={
                about?.image_url ||
                'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1000'
              }
              alt="Logistics Leadership Team & Fleet"
              className="w-full h-80 lg:h-96 object-cover"
            />
          </div>
        </div>

        {/* Mission, Vision, Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {/* Mission */}
          <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 space-y-4 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white">Our Mission</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {about?.mission ||
                'To deliver dependable, cost-effective, and fully transparent freight solutions that empower commercial enterprise growth globally.'}
            </p>
          </div>

          {/* Vision */}
          <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 space-y-4 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white">Our Vision</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {about?.vision ||
                'To be the preferred global supply chain partner recognized for digital innovation, safety standards, and sustainable shipping practices.'}
            </p>
          </div>

          {/* Values */}
          <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 space-y-4 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white">Core Values</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {about?.values ||
                'Integrity, speed, absolute cargo safety, and client-first commitment across every shipment tier.'}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};
