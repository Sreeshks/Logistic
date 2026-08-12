import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowRight, Truck } from 'lucide-react';

import { Container } from '../../components/ui/Container';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { getPublicServices } from '../../api/services.api';
import { getImageUrl } from '../../utils/image';

export const ServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['publicServices', searchTerm],
    queryFn: () => getPublicServices(searchTerm),
  });

  const services = response?.data || [];

  return (
    <div className="py-12 space-y-12">
      <Container>
        <Breadcrumb items={[{ label: 'Services' }]} />

        <SectionTitle
          badge="End-to-End Capabilities"
          title="Logistics & Supply Chain Services"
          subtitle="Explore our comprehensive range of freight forwarding, customs brokerage, and warehousing solutions."
        />

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10 relative">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search services (e.g. Air Freight, Ocean, Customs)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Failed to Load Services"
            message="Could not fetch services from the backend. Please check network connection."
            onRetry={refetch}
          />
        ) : services.length === 0 ? (
          <EmptyState
            title="No Services Found"
            message={searchTerm ? `No services match "${searchTerm}".` : 'No active services available.'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="flex flex-col h-full">
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={
                      (service.image_url || service.image)
                        ? getImageUrl(service.image_url || service.image)
                        : 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800'
                    }
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md p-2 rounded-lg text-primary">
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
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center text-sm font-bold text-primary hover:brightness-110 gap-1.5 transition-colors"
                    >
                      <span>Explore Service</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};
