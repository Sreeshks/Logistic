import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';

import { Container } from '../../components/ui/Container';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { getCompanyInfo } from '../../api/company.api';
import { submitContactForm } from '../../api/contact.api';
import type { ContactSubmission } from '../../types/api';

export const ContactPage: React.FC = () => {
  const { data: response, isLoading: companyLoading } = useQuery({
    queryKey: ['companyInfo'],
    queryFn: getCompanyInfo,
  });

  const company = response?.data;

  const [formData, setFormData] = useState<ContactSubmission>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      setSubmitSuccess(true);
      setSubmitError(null);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    },
    onError: (err: any) => {
      setSubmitError(err?.message || 'Failed to submit message. Please try again.');
      setSubmitSuccess(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    mutation.mutate(formData);
  };

  return (
    <div className="py-12 space-y-12">
      <Container>
        <Breadcrumb items={[{ label: 'Contact' }]} />

        <SectionTitle
          badge="Get In Touch"
          title="Contact Our Logistics Desk"
          subtitle="Submit your shipping inquiry or quote request. Our global freight specialists respond within 24 hours."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Company Contact Information */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
              <h3 className="text-xl font-bold text-white border-l-4 border-primary pl-3">
                Headquarters Info
              </h3>

              {companyLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full bg-slate-800" />
                  <Skeleton className="h-6 w-full bg-slate-800" />
                  <Skeleton className="h-6 w-full bg-slate-800" />
                </div>
              ) : (
                <ul className="space-y-5 text-sm">
                  {company?.address && (
                    <li className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-slate-400 block font-bold uppercase">Address</span>
                        <span className="text-slate-200">{company.address}</span>
                      </div>
                    </li>
                  )}
                  {company?.phone && (
                    <li className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-slate-400 block font-bold uppercase">Phone</span>
                        <a href={`tel:${company.phone}`} className="text-slate-200 hover:text-primary transition-colors">
                          {company.phone}
                        </a>
                      </div>
                    </li>
                  )}
                  {company?.email && (
                    <li className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-slate-400 block font-bold uppercase">Email</span>
                        <a href={`mailto:${company.email}`} className="text-slate-200 hover:text-primary transition-colors">
                          {company.email}
                        </a>
                      </div>
                    </li>
                  )}
                  {company?.working_hours && (
                    <li className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-slate-400 block font-bold uppercase">Working Hours</span>
                        <span className="text-slate-300">{company.working_hours}</span>
                      </div>
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Google Map Section */}
            {company?.google_maps_url && (
              <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 h-64">
                <iframe
                  title="Company Location Map"
                  src={company.google_maps_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Interactive Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Send Us a Message</h3>

              {submitSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <span className="font-semibold">
                    ✓ Your message has been submitted successfully. Our team will get back to you shortly.
                  </span>
                </div>
              )}

              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Freight Quote Request / General Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Message / Cargo Specifications *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Provide details about your origin, destination, cargo volume, or general inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                  />
                </div>

                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  isLoading={mutation.isPending}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send Inquiry Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
