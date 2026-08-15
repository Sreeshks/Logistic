import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Package,
  Plus,
  Search,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  AlertTriangle,
} from 'lucide-react';
import { ordersApi } from '../../api/orders.api';
import { toast } from '../../hooks/useToast';
import type { OrderItem, OrderCreateData, OrderStatus } from '../../types/order';

export const OrdersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Landing page tracking toggle query & mutation
  const { data: toggleData, isLoading: toggleLoading } = useQuery({
    queryKey: ['tracking-toggle'],
    queryFn: () => ordersApi.getTrackingToggle(),
  });

  const isTrackingVisible = toggleData?.data?.show_tracking !== false;

  const toggleMutation = useMutation({
    mutationFn: (newState: boolean) => ordersApi.updateTrackingToggle(newState),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['tracking-toggle'] });
      queryClient.invalidateQueries({ queryKey: ['home-hero'] });
      if (res.data?.show_tracking) {
        toast.success('Live Tracking bar is now VISIBLE on the website landing page.');
      } else {
        toast.success('Live Tracking bar is now HIDDEN from the website landing page.');
      }
    },
    onError: () => {
      toast.error('Failed to update tracking toggle state.');
    },
  });

  // Form State
  const [formData, setFormData] = useState<OrderCreateData>({
    tracking_number: '',
    sender_name: '',
    recipient_name: '',
    origin: 'Ruwi Branch, Muscat, Oman',
    destination: '',
    service_type: 'Air Cargo',
    status: 'PENDING',
    current_location: '',
    estimated_delivery: '',
    notes: '',
  });

  const generateTrackingNumber = () => {
    const random = Math.floor(100000 + Math.random() * 900000);
    setFormData((prev) => ({ ...prev, tracking_number: `WSC-${random}` }));
  };

  // Queries & Mutations
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-orders', page, search, statusFilter],
    queryFn: () =>
      ordersApi.getOrders({
        page,
        limit: 20,
        search: search || undefined,
        status: statusFilter || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (data: OrderCreateData) => ordersApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setIsCreateOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<OrderCreateData> }) =>
      ordersApi.updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setEditingOrder(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ordersApi.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setDeletingId(null);
    },
  });

  const resetForm = () => {
    setFormData({
      tracking_number: '',
      sender_name: '',
      recipient_name: '',
      origin: 'Ruwi Branch, Muscat, Oman',
      destination: '',
      service_type: 'Air Cargo',
      status: 'PENDING',
      current_location: '',
      estimated_delivery: '',
      notes: '',
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tracking_number || !formData.sender_name || !formData.destination) return;
    createMutation.mutate(formData);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    updateMutation.mutate({ id: editingOrder.id, data: formData });
  };

  const startEdit = (order: OrderItem) => {
    setEditingOrder(order);
    setFormData({
      tracking_number: order.tracking_number,
      sender_name: order.sender_name,
      recipient_name: order.recipient_name,
      origin: order.origin,
      destination: order.destination,
      service_type: order.service_type,
      status: order.status,
      current_location: order.current_location || '',
      estimated_delivery: order.estimated_delivery || '',
      notes: order.notes || '',
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200">PENDING</span>;
      case 'PICKED_UP':
        return <span className="px-2.5 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded-full border border-blue-200">PICKED UP</span>;
      case 'IN_TRANSIT':
        return <span className="px-2.5 py-1 text-xs font-bold bg-orange-100 text-orange-800 rounded-full border border-orange-200 animate-pulse">IN TRANSIT</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="px-2.5 py-1 text-xs font-bold bg-purple-100 text-purple-800 rounded-full border border-purple-200">OUT FOR DELIVERY</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">DELIVERED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 text-xs font-bold bg-rose-100 text-rose-800 rounded-full border border-rose-200">CANCELLED</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-800 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-7 h-7 text-orange-600" />
            Cargo Orders & Tracking Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create internal orders, update real-time GPS locations, and manage public waybill tracking status.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            generateTrackingNumber();
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Cargo Order</span>
        </button>
      </div>

      {/* Landing Page Tracking Visibility Toggle Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-700/60 shadow-md text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`p-2.5 rounded-xl ${isTrackingVisible ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Landing Page Tracking Search Bar</h3>
              <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full border ${isTrackingVisible ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'}`}>
                {isTrackingVisible ? 'Visible on Website' : 'Hidden on Website'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isTrackingVisible
                ? 'Public shipment tracking search bar is currently DISPLAYED on the home landing page.'
                : 'Public shipment tracking search bar is currently HIDDEN from the home landing page.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
          <span className="text-xs font-semibold text-slate-300">
            {isTrackingVisible ? 'Active' : 'Disabled'}
          </span>
          <button
            type="button"
            disabled={toggleMutation.isPending || toggleLoading}
            onClick={() => toggleMutation.mutate(!isTrackingVisible)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 ${
              isTrackingVisible ? 'bg-emerald-500' : 'bg-slate-600'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                isTrackingVisible ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Tracking #, Sender, Recipient, Destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
            className="px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            onClick={() => refetch()}
            className="p-2 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading cargo orders...</div>
        ) : isError ? (
          <div className="p-12 text-center text-rose-500">Failed to load orders. Please refresh.</div>
        ) : !data?.data || data.data.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">No Orders Found</p>
            <p className="text-xs text-slate-400 mt-1">Click "Add New Cargo Order" to create a shipment tracking record.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-4">Tracking #</th>
                  <th className="px-6 py-4">Sender / Recipient</th>
                  <th className="px-6 py-4">Service & Route</th>
                  <th className="px-6 py-4">Current Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.data.map((order: OrderItem) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-orange-600">{order.tracking_number}</div>
                      <div className="text-[11px] text-slate-400">Est. Delivery: {order.estimated_delivery || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{order.sender_name}</div>
                      <div className="text-xs text-slate-500">To: {order.recipient_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block text-xs font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded mb-1">
                        {order.service_type}
                      </span>
                      <div className="text-xs text-slate-500 line-clamp-1">
                        {order.origin} → <span className="font-semibold text-slate-800">{order.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span>{order.current_location || 'Hub Processing'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => startEdit(order)}
                        className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Edit / Update Status"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(order.id)}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE ORDER MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add Internal Cargo Order</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tracking Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.tracking_number}
                    onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                    className="flex-grow p-2.5 border border-slate-300 rounded-xl font-mono text-orange-600 font-bold focus:ring-2 focus:ring-orange-500 uppercase"
                  />
                  <button
                    type="button"
                    onClick={generateTrackingNumber}
                    className="px-3 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sender Name</label>
                  <input
                    type="text"
                    required
                    value={formData.sender_name}
                    onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                    placeholder="e.g. Mohammed Al-Busaidi"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={formData.recipient_name}
                    onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Origin Hub</label>
                  <input
                    type="text"
                    required
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destination Address</label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="e.g. Kochi, Kerala, India"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Type</label>
                  <select
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="Air Cargo">Air Cargo</option>
                    <option value="Sea Cargo">Sea Cargo</option>
                    <option value="Door to Door Service">Door to Door Service</option>
                    <option value="Packing & Shifting">Packing & Shifting</option>
                    <option value="Warehouse Storage">Warehouse Storage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PICKED_UP">Picked Up</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current GPS Location</label>
                  <input
                    type="text"
                    value={formData.current_location || ''}
                    onChange={(e) => setFormData({ ...formData, current_location: e.target.value })}
                    placeholder="e.g. Muscat Airport Freight Hub"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Est. Delivery Date</label>
                  <input
                    type="text"
                    value={formData.estimated_delivery || ''}
                    onChange={(e) => setFormData({ ...formData, estimated_delivery: e.target.value })}
                    placeholder="e.g. 18 Aug 2026"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Manifest Notes & Dispatch Info</label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional dispatch notes..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-6 py-2 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-md"
                >
                  {createMutation.isPending ? 'Saving...' : 'Save Cargo Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ORDER MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Update Order & Live GPS Status</h3>
                <p className="text-xs text-orange-600 font-mono font-bold">{editingOrder.tracking_number}</p>
              </div>
              <button onClick={() => setEditingOrder(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white font-bold text-orange-700"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PICKED_UP">Picked Up</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current GPS Location</label>
                  <input
                    type="text"
                    value={formData.current_location || ''}
                    onChange={(e) => setFormData({ ...formData, current_location: e.target.value })}
                    placeholder="e.g. Muscat Airport Freight Hub"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sender</label>
                  <input
                    type="text"
                    value={formData.sender_name}
                    onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recipient</label>
                  <input
                    type="text"
                    value={formData.recipient_name}
                    onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destination</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Est. Delivery Date</label>
                  <input
                    type="text"
                    value={formData.estimated_delivery || ''}
                    onChange={(e) => setFormData({ ...formData, estimated_delivery: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes & Tracking Remarks</label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-6 py-2 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-md"
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update Tracking Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Delete Order Record?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete this order? Public tracking for this waybill will be removed.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deletingId)}
                className="px-5 py-2 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 text-sm shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
