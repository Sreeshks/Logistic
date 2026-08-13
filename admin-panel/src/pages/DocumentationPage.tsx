import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Home,
  FileText,
  Building2,
  Truck,
  Image as ImageIcon,
  Newspaper,
  HelpCircle,
  Mail,
  Package,
  Share2,
  Search,
  CheckCircle2,
  Globe,
  Settings,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Card } from '../components/ui/Card';

export const DocumentationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cms' | 'content' | 'enquiries' | 'seo'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'overview', label: '1. Platform Overview', icon: BookOpen },
    { id: 'cms', label: '2. Website CMS (Home & About)', icon: Home },
    { id: 'content', label: '3. Services, Gallery & Blogs', icon: Truck },
    { id: 'enquiries', label: '4. Enquiries & Orders', icon: Mail },
    { id: 'seo', label: '5. SEO & Social Media Guide', icon: Share2 },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <Breadcrumb items={[{ label: 'Settings', href: '/settings' }, { label: 'User Documentation Guide' }]} />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <BookOpen className="w-3.5 h-3.5" /> Administrator & User Handbook
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Logistics System User Documentation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-normal">
            Welcome to your logistics platform guide. Learn how to manage public website content, upload images, handle customer enquiries, track cargo shipments, and configure search engine (SEO) settings.
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card title="System Structure Overview" subtitle="Understanding the two core components of your logistics platform">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Frontend Card */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">1. Public Website (FrontEnd)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The client-facing website accessible to your customers. Displays live air/sea cargo services, interactive rate quick delivery cards, gallery photos, company history, contact form, and cargo tracking widget.
                </p>
                <div className="pt-2">
                  <a
                    href="http://localhost:5173"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
                  >
                    <span>Visit Live Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Admin Panel Card */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">2. Content Management Panel (Admin Panel)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your secure backend dashboard for editing website text, uploading hero banner carousels, managing logistics services, adding blog posts, viewing customer messages, and customizing company brand colors.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-500">Secured with Admin & Super Admin Role Access</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Quick Start Module Sitemap" subtitle="Where to find each feature in your admin panel navigation">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/website/home" className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Home Page CMS</h4>
                    <p className="text-[11px] text-slate-500">Edit hero title, desktop/mobile carousel & stats</p>
                  </div>
                </div>
              </Link>

              <Link to="/services" className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Services Manager</h4>
                    <p className="text-[11px] text-slate-500">Add Air Freight, Sea Cargo, Storage & SEO metadata</p>
                  </div>
                </div>
              </Link>

              <Link to="/company" className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Company & Theme</h4>
                    <p className="text-[11px] text-slate-500">Logo, phone, email, WhatsApp & 1-click theme colors</p>
                  </div>
                </div>
              </Link>

              <Link to="/gallery" className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Media Gallery</h4>
                    <p className="text-[11px] text-slate-500">Upload fleet photos & project showcase media</p>
                  </div>
                </div>
              </Link>

              <Link to="/blogs" className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Blog Articles</h4>
                    <p className="text-[11px] text-slate-500">Publish shipping guidelines & industry trade news</p>
                  </div>
                </div>
              </Link>

              <Link to="/contact-messages" className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Contact Enquiries</h4>
                    <p className="text-[11px] text-slate-500">View customer quote requests & contact messages</p>
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: WEBSITE CMS */}
      {activeTab === 'cms' && (
        <div className="space-y-6">
          <Card title="Homepage CMS Guide" subtitle="How to customize the main landing hero banner, carousel, and company statistics">
            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Primary Background Image & Desktop Carousel Slides
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Go to <Link to="/website/home" className="text-blue-600 font-bold hover:underline">Website CMS → Home Page</Link>. Upload images using the Image Uploader component. You can add multiple desktop banner images to create an automated auto-rotating hero background slider on widescreen desktop displays.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Mobile Banner Carousel Slides (Optimized for Phones)
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Under the Mobile Banner Image Uploader section, upload vertical or mobile-optimized banner images. On mobile devices (&lt; 640px), the public website automatically switches to these mobile-friendly slides.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Headline Text & Call-To-Action Buttons
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Edit the <strong>Main Heading</strong>, <strong>Subtitle</strong>, <strong>Description</strong>, and <strong>Button Labels / Links</strong> (e.g. Primary "Contact Us" and Secondary "Our Services"). Use a comma in the Main Heading to split title colors dynamically.
                </p>
              </div>
            </div>
          </Card>

          <Card title="Company Profile & 1-Click Color Themes" subtitle="Updating global business branding and website theme colors">
            <div className="space-y-4 text-xs text-slate-700">
              <p className="text-slate-600 leading-relaxed">
                Open <Link to="/company" className="text-blue-600 font-bold hover:underline">Company Information</Link> to configure:
              </p>
              <ul className="list-disc list-inside space-y-1.5 font-medium text-slate-700">
                <li><strong>Branding Assets</strong>: Company Logo and Browser Favicon icon.</li>
                <li><strong>Contact Phone & WhatsApp</strong>: Public numbers displayed in header, footer, and floating contact widget.</li>
                <li><strong>Operating Hours & Physical Address</strong>: Displayed on the Contact Us page and footer.</li>
                <li><strong>1-Click Matched Color Themes</strong>: Switch website brand styling instantly between <em>Classic Cargo Orange</em>, <em>Ocean Maritime Blue</em>, or <em>Emerald Express Green</em>, or pick custom primary/accent hex colors.</li>
              </ul>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: CONTENT MANAGEMENT */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <Card title="Services Management" subtitle="Adding logistics service offerings (Air Cargo, Sea Cargo, Warehousing, etc.)">
            <div className="space-y-3 text-xs text-slate-700">
              <p className="leading-relaxed">
                Navigate to <Link to="/services" className="text-blue-600 font-bold hover:underline">Content Management → Services</Link> to create or edit service items.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900">Featured Service Switch</span>
                  <p className="text-slate-500 text-[11px]">Enabling "Featured Service" displays the service on the homepage "What We Do" grid.</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900">Icon Name</span>
                  <p className="text-slate-500 text-[11px]">Enter icon keys like <code>plane</code>, <code>ship</code>, <code>truck</code>, or <code>warehouse</code> to show specialized graphics.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Gallery Portfolio & Blog Posts" subtitle="Managing photo showcases and industry articles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-600" /> Gallery Portfolio
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Upload project photos (Air Cargo Loading, Ocean Vessels, Logistics Warehouses). Assign categories so visitors can filter photos on the public Gallery page. Toggle the <strong>Star Icon</strong> to feature photos on the homepage operations gallery grid.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-rose-600" /> Blog & News Manager
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Publish shipping guidelines, customs duty advice, and trade announcements. Supports rich description formatting, author names, tags, and custom SEO metadata.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: ENQUIRIES & ORDERS */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <Card title="Customer Contact Enquiries & Quote Requests" subtitle="Responding to inquiries submitted by visitors">
            <div className="space-y-4 text-xs text-slate-700">
              <p className="leading-relaxed">
                When visitors fill out the contact form on your public website, submissions immediately arrive under <Link to="/contact-messages" className="text-blue-600 font-bold hover:underline">Enquiries → Contact Messages</Link>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center space-y-1">
                  <span className="font-bold text-blue-900 block">Status: New</span>
                  <span className="text-[11px] text-blue-700">Newly received unread enquiry</span>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-1">
                  <span className="font-bold text-amber-900 block">Status: In Progress</span>
                  <span className="text-[11px] text-amber-700">Team is reviewing quote rate</span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                  <span className="font-bold text-emerald-900 block">Status: Resolved</span>
                  <span className="text-[11px] text-emerald-700">Client contacted & completed</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Orders & Shipment Tracking" subtitle="Managing tracking numbers for customer cargo shipments">
            <div className="space-y-3 text-xs text-slate-700">
              <p className="leading-relaxed">
                In <Link to="/orders" className="text-blue-600 font-bold hover:underline">Orders & Tracking</Link>, administrators can create tracking numbers (e.g. <code>LOG-987654</code>). Customers can enter their tracking ID in the public website header or tracking widget to view real-time status updates (<em>Booked</em>, <em>In Transit</em>, <em>Out for Delivery</em>, <em>Delivered</em>).
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 5: SEO GUIDE */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <Card title="Search Engine Optimization (SEO) & Social Sharing Guide" subtitle="How SEO fields work and how to maximize online visibility">
            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
                <h4 className="font-bold text-blue-900 flex items-center gap-2 text-sm">
                  <Share2 className="w-4 h-4 text-blue-600" />
                  What is SEO and why is it important?
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  SEO (Search Engine Optimization) controls how your logistics services and blog articles appear when searched on Google, or when links are shared on WhatsApp, Facebook, and LinkedIn.
                </p>
              </div>

              <div className="overflow-hidden border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                      <th className="p-3">Field Name</th>
                      <th className="p-3">Where It Displays</th>
                      <th className="p-3">Best Practice Tip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-mono font-bold text-blue-600">Meta Title</td>
                      <td className="p-3">Google search headline & browser tab title</td>
                      <td className="p-3">Include primary keyword & company name (50–60 chars).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-blue-600">Meta Description</td>
                      <td className="p-3">Paragraph snippet shown under link on Google</td>
                      <td className="p-3">Write a compelling 2-sentence summary with call-to-action (120–160 chars).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-blue-600">OG Title</td>
                      <td className="p-3">Bold headline on WhatsApp / Facebook preview card</td>
                      <td className="p-3">Short, catchy headline for social media sharing.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-blue-600">OG Description</td>
                      <td className="p-3">Sub-text inside WhatsApp chat bubble link preview</td>
                      <td className="p-3">Highlight key benefit (e.g. 7-15 day delivery across India).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-blue-600">OG Image</td>
                      <td className="p-3">Thumbnail photo attached to link when shared on social media</td>
                      <td className="p-3">Upload a clean banner image (1200x630px recommended).</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
