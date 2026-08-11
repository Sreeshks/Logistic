import React, { useState } from 'react';
import { Search, Truck, Calculator, ArrowRight, ShieldCheck, AlertCircle, MapPin, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';

interface TrackResult {
  found: boolean;
  tracking_number: string;
  status?: string;
  service_type?: string;
  origin?: string;
  destination?: string;
  current_location?: string;
  estimated_delivery?: string;
  last_updated?: string;
}

export const QuickTrackWidget: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [activeTab, setActiveTab] = useState<'track' | 'quote'>('track');
  const [isLoading, setIsLoading] = useState(false);
  const [trackResult, setTrackResult] = useState<TrackResult | null>(null);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingNumber.trim();
    if (!query) return;

    setIsLoading(true);
    setTrackResult(null);

    try {
      const response = await apiClient.get<any>(`/public/orders/track/${encodeURIComponent(query)}`);
      // apiClient interceptor unwrap: response is { success, message, data }
      if (response && response.data) {
        setTrackResult(response.data);
      } else {
        setTrackResult({ found: false, tracking_number: query });
      }
    } catch (error) {
      setTrackResult({ found: false, tracking_number: query });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'IN_TRANSIT':
        return 'text-primary bg-primary/10 border-primary/30';
      case 'DELIVERED':
        return 'text-emerald-700 bg-emerald-100 border-emerald-300';
      case 'PICKED_UP':
        return 'text-blue-700 bg-blue-100 border-blue-300';
      case 'OUT_FOR_DELIVERY':
        return 'text-purple-700 bg-purple-100 border-purple-300';
      case 'CANCELLED':
        return 'text-rose-700 bg-rose-100 border-rose-300';
      default:
        return 'text-amber-700 bg-amber-100 border-amber-300';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl relative z-30 glow-brand">
      {/* Widget Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-4 sm:mb-6 gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              setActiveTab('track');
              setTrackResult(null);
            }}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'track'
                ? 'bg-primary text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Track Cargo Shipment</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('quote');
              setTrackResult(null);
            }}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'quote'
                ? 'bg-primary text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Instant Rate Estimate</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Real-Time Live Database Tracking</span>
        </div>
      </div>

      {/* Tab 1: Live Track Cargo */}
      {activeTab === 'track' && (
        <form onSubmit={handleTrackSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Waybill or Tracking Number (e.g. WSC-998231, WSC-100821)..."
                value={trackingNumber}
                onChange={(e) => {
                  setTrackingNumber(e.target.value);
                  setTrackResult(null);
                }}
                className="w-full h-13 bg-slate-50 border border-slate-300 rounded-2xl pl-12 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono transition-all uppercase font-bold"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="h-13 px-8 bg-brand-gradient hover:brightness-110 text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shrink-0 shadow-md disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Track Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Real Live Order Tracking Results */}
          {trackResult && (
            <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm space-y-4 animate-in fade-in duration-300">
              {trackResult.found ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
                    <div>
                      <span className="text-xs text-slate-500 font-semibold">Tracking Number:</span>
                      <h4 className="font-mono text-lg font-black text-primary">{trackResult.tracking_number}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-semibold">Status:</span>
                      <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full border ${getStatusColor(trackResult.status)}`}>
                        {trackResult.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Route & Service</span>
                      <span className="font-bold text-slate-900 block">{trackResult.service_type || 'Cargo Shipping'}</span>
                      <span className="text-slate-600 text-[11px] mt-0.5 block">{trackResult.origin} → {trackResult.destination}</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Current GPS Location</span>
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{trackResult.current_location || 'Hub Processing'}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Estimated Delivery</span>
                      <span className="font-bold text-emerald-700 block text-sm">{trackResult.estimated_delivery || 'On Schedule'}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-start gap-3 text-rose-700">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900">No Cargo Shipment Found</h5>
                    <p className="text-xs text-slate-600 mt-1">
                      No order was found matching tracking number <span className="font-mono font-bold text-slate-900">"{trackResult.tracking_number}"</span>. Please verify your waybill number or contact customer support.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      )}

      {/* Tab 2: Rate Estimator CTA */}
      {activeTab === 'quote' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="sm:col-span-2 space-y-1">
            <h4 className="text-base font-bold text-slate-900">Need an Instant Freight & Cargo Shipping Quote?</h4>
            <p className="text-xs text-slate-600">
              Get transparent door-to-door Air Cargo, Sea Freight, and Packing rates to India & worldwide destinations.
            </p>
          </div>
          <div className="text-right">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-primary hover:brightness-110 text-white font-bold text-sm rounded-2xl transition-all gap-2 shadow-md"
            >
              <span>Request Custom Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
