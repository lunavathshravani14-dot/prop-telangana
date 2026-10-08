'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Home,
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Eye,
  X,
  Upload,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building,
  RefreshCw,
} from 'lucide-react';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal states for Create/Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProp, setEditingProp] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'APARTMENT',
    listingType: 'BUY',
    price: '',
    priceDisplay: '',
    area: '',
    areaUnit: 'sqft',
    bedrooms: '3',
    bathrooms: '3',
    balconies: '1',
    facing: 'East',
    furnishing: 'UNFURNISHED',
    possessionStatus: 'READY_TO_MOVE',
    reraNumber: '',
    approvalInfo: 'HMDA & RERA Approved',
    address: '',
    locality: 'Kokapet',
    city: 'Hyderabad',
    pincode: '500075',
    featured: false,
    status: 'PUBLISHED',
    imageUrl: '',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchProperties = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('limit', '100');
    params.set('status', statusFilter);
    if (search.trim()) params.set('search', search.trim());

    fetch(`/api/properties?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProperties(data.data);
        } else {
          showToast(data.error?.message || 'Failed to load properties', 'error');
        }
      })
      .catch((err) => {
        console.error(err);
        showToast('Network error while loading properties', 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProperties();
  }, [statusFilter]);

  // Check URL query param for auto-opening Create modal (e.g. from Dashboard button)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('action') === 'new') {
        handleOpenCreate();
      }
    }
  }, []);

  const handleOpenCreate = () => {
    setEditingProp(null);
    setFormData({
      title: '',
      description: '',
      propertyType: 'APARTMENT',
      listingType: 'BUY',
      price: '',
      priceDisplay: '',
      area: '',
      areaUnit: 'sqft',
      bedrooms: '3',
      bathrooms: '3',
      balconies: '1',
      facing: 'East',
      furnishing: 'UNFURNISHED',
      possessionStatus: 'READY_TO_MOVE',
      reraNumber: '',
      approvalInfo: 'HMDA & RERA Approved',
      address: '',
      locality: 'Kokapet',
      city: 'Hyderabad',
      pincode: '500075',
      featured: false,
      status: 'PUBLISHED',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingProp(p);
    setFormData({
      title: p.title || '',
      description: p.description || '',
      propertyType: p.propertyType || 'APARTMENT',
      listingType: p.listingType || 'BUY',
      price: p.price !== undefined && p.price !== null ? p.price.toString() : '',
      priceDisplay: p.priceDisplay || '',
      area: p.area !== undefined && p.area !== null ? p.area.toString() : '',
      areaUnit: p.areaUnit || 'sqft',
      bedrooms: p.bedrooms !== null && p.bedrooms !== undefined ? p.bedrooms.toString() : '',
      bathrooms: p.bathrooms !== null && p.bathrooms !== undefined ? p.bathrooms.toString() : '',
      balconies: p.balconies !== null && p.balconies !== undefined ? p.balconies.toString() : '',
      facing: p.facing || 'East',
      furnishing: p.furnishing || 'UNFURNISHED',
      possessionStatus: p.possessionStatus || 'READY_TO_MOVE',
      reraNumber: p.reraNumber || '',
      approvalInfo: p.approvalInfo || '',
      address: p.address || '',
      locality: p.locality || 'Kokapet',
      city: p.city || 'Hyderabad',
      pincode: p.pincode || '',
      featured: Boolean(p.featured),
      status: p.status || 'PUBLISHED',
      imageUrl: p.images?.[0]?.url || '',
    });
    setModalOpen(true);
  };

  // Helper to auto-format priceDisplay from numeric price
  const handleAutoFormatPrice = () => {
    const raw = String(formData.price).replace(/,/g, '').trim();
    const num = parseFloat(raw);
    if (!isNaN(num) && num > 0) {
      if (num >= 10000000) {
        setFormData({ ...formData, priceDisplay: `₹ ${(num / 10000000).toFixed(2)} Cr` });
      } else if (num >= 100000) {
        setFormData({ ...formData, priceDisplay: `₹ ${(num / 100000).toFixed(2)} L` });
      } else {
        setFormData({ ...formData, priceDisplay: `₹ ${num.toLocaleString('en-IN')}` });
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingProp ? `/api/properties/${editingProp.id}` : '/api/properties';
      const method = editingProp ? 'PUT' : 'POST';

      const cleanPrice = String(formData.price).replace(/,/g, '').trim();
      const cleanArea = String(formData.area).replace(/,/g, '').trim();

      const numPrice = parseFloat(cleanPrice);
      const numArea = parseFloat(cleanArea);

      if (isNaN(numPrice) || numPrice <= 0) {
        showToast('Please enter a valid numeric price', 'error');
        setSaving(false);
        return;
      }

      if (isNaN(numArea) || numArea <= 0) {
        showToast('Please enter a valid area', 'error');
        setSaving(false);
        return;
      }

      // Auto-compute display price if not provided
      let displayPrice = formData.priceDisplay.trim();
      if (!displayPrice) {
        if (numPrice >= 10000000) {
          displayPrice = `₹ ${(numPrice / 10000000).toFixed(2)} Cr`;
        } else if (numPrice >= 100000) {
          displayPrice = `₹ ${(numPrice / 100000).toFixed(2)} L`;
        } else {
          displayPrice = `₹ ${numPrice.toLocaleString('en-IN')}`;
        }
      }

      const payload = {
        ...formData,
        price: numPrice,
        priceDisplay: displayPrice,
        area: numArea,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms, 10) : null,
        balconies: formData.balconies ? parseInt(formData.balconies, 10) : null,
        images: formData.imageUrl ? [{ url: formData.imageUrl }] : [],
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchProperties();
        showToast(
          editingProp
            ? `Property "${data.data?.title || 'Record'}" updated successfully!`
            : 'New property published successfully!',
          'success'
        );
      } else {
        showToast(data.error?.message || 'Error saving property', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving property. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?\n\nThis will remove the property from public listings.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (modalOpen && editingProp?.id === id) {
          setModalOpen(false);
        }
        fetchProperties();
        showToast(`Property "${title}" deleted successfully.`, 'success');
      } else {
        showToast(data.error?.message || 'Failed to delete property', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while deleting property', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeature = async (p: any) => {
    try {
      const res = await fetch(`/api/properties/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !p.featured }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProperties();
        showToast(
          !p.featured ? `Marked "${p.title}" as Featured!` : `Removed Featured status from "${p.title}"`,
          'success'
        );
      }
    } catch (e) {
      console.error(e);
      showToast('Error updating featured status', 'error');
    }
  };

  const handleToggleStatus = async (p: any) => {
    const nextStatus = p.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/properties/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProperties();
        showToast(`Status updated to ${nextStatus}`, 'success');
      }
    } catch (e) {
      console.error(e);
      showToast('Error toggling status', 'error');
    }
  };

  const isLandOrPlot = formData.propertyType === 'PLOT' || formData.propertyType === 'LAND';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-bold transition-all animate-bounce ${
            toast.type === 'success'
              ? 'bg-emerald-900/95 text-emerald-100 border-emerald-500'
              : 'bg-red-900/95 text-red-100 border-red-500'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950">Property Inventory Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add new property listings, update existing property specifications, or delete old records.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchProperties}
            disabled={loading}
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl transition-all shadow-sm"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-lg hover:shadow-brand-600/25 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Property</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, location, or property ID (Press Enter)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProperties()}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-bold whitespace-nowrap">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses ({properties.length})</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="p-4">Property Details</th>
                <th className="p-4">Type</th>
                <th className="p-4">Location</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4 text-right">Actions (Update / Delete)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 font-semibold">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-brand-600" />
                      <span>Loading property catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 font-semibold">
                    <div className="max-w-xs mx-auto space-y-3">
                      <Building className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-slate-600 font-bold">No properties found</p>
                      <button
                        onClick={handleOpenCreate}
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs"
                      >
                        Add Your First Property
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                properties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            p.images?.[0]?.url ||
                            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'
                          }
                          alt=""
                          className="w-14 h-11 object-cover rounded-xl shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0 max-w-sm">
                          <Link
                            href={`/properties/${p.slug}`}
                            target="_blank"
                            className="font-extrabold text-navy-950 hover:text-brand-600 line-clamp-1 block transition-colors"
                          >
                            {p.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-bold">
                              {p.propertyId}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {p.area} {p.areaUnit || 'sqft'}
                            </span>
                            {p.reraNumber && (
                              <span className="text-[10px] text-emerald-700 font-mono font-semibold">
                                ✓ RERA
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px]">
                        {p.propertyType}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-900">{p.locality}</p>
                      <p className="text-[11px] text-slate-400">{p.city}</p>
                    </td>
                    <td className="p-4 font-extrabold text-navy-950">
                      {p.priceDisplay || `₹ ${(p.price / 10000000).toFixed(2)} Cr`}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all ${
                          p.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : p.status === 'DRAFT'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Click to toggle PUBLISHED / DRAFT"
                      >
                        {p.status}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleFeature(p)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          p.featured ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'
                        }`}
                        title={p.featured ? 'Featured on Homepage (Click to unfeature)' : 'Click to feature on Homepage'}
                      >
                        <Star className={`w-4 h-4 ${p.featured ? 'fill-amber-500' : ''}`} />
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* UPDATE BUTTON */}
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-blue-200 shadow-sm"
                          title="Update / Edit this property"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Update</span>
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          disabled={deletingId === p.id}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-red-200 shadow-sm"
                          title="Delete this property"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{deletingId === p.id ? 'Deleting...' : 'Delete'}</span>
                        </button>

                        {/* VIEW LIVE BUTTON */}
                        <Link
                          href={`/properties/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-navy-950 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View live page on website"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PROPERTY MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-navy-950 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wide ${
                      editingProp ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' : 'bg-brand-500/20 text-brand-300 border border-brand-400/30'
                    }`}
                  >
                    {editingProp ? 'Update Previous Property' : 'Add New Property Listing'}
                  </span>
                  {editingProp && (
                    <span className="font-mono text-xs text-slate-400">({editingProp.propertyId})</span>
                  )}
                </div>
                <h3 className="font-extrabold text-lg mt-1">
                  {editingProp ? `Update: ${editingProp.title}` : 'Publish New Telangana Property Listing'}
                </h3>
                <p className="text-xs text-slate-400">
                  {editingProp
                    ? 'Modify price, specifications, images, and approvals. Changes reflect immediately.'
                    : 'Fill property details, RERA compliance, pricing, and high-resolution cover photo.'}
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Ultra-Luxury 4 BHK Sky Residence in Neopolis Kokapet"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:bg-white focus:outline-none text-slate-900 font-semibold"
                />
              </div>

              {/* Type, Listing Type, and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Property Type *</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="APARTMENT">Apartment / Flat</option>
                    <option value="VILLA">Gated Villa</option>
                    <option value="PLOT">Open / Villa Plot</option>
                    <option value="COMMERCIAL">Commercial Office / Retail</option>
                    <option value="LAND">Development Land / Farm</option>
                    <option value="INDEPENDENT_HOUSE">Independent House</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Listing Type *</label>
                  <select
                    value={formData.listingType}
                    onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="BUY">For Sale (Buy)</option>
                    <option value="RENT">For Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Listing Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-brand-700"
                  >
                    <option value="PUBLISHED">Published (Active)</option>
                    <option value="DRAFT">Draft (Hidden)</option>
                    <option value="PENDING_REVIEW">Pending Review</option>
                    <option value="SOLD">Sold Out</option>
                  </select>
                </div>
              </div>

              {/* Price & Display Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Numeric Price (INR) *</label>
                    <button
                      type="button"
                      onClick={handleAutoFormatPrice}
                      className="text-[10px] text-brand-600 hover:underline font-bold"
                    >
                      Auto-Format ➔
                    </button>
                  </div>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    onBlur={handleAutoFormatPrice}
                    placeholder="e.g. 38500000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Raw number without commas (e.g. 38500000 = 3.85 Cr)</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Display Price (User Facing) *</label>
                  <input
                    type="text"
                    required
                    value={formData.priceDisplay}
                    onChange={(e) => setFormData({ ...formData, priceDisplay: e.target.value })}
                    placeholder="e.g. ₹ 3.85 Cr"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Shown on property cards & detail headers</p>
                </div>
              </div>

              {/* Area & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Super Built-up / Plot Area *</label>
                  <input
                    type="number"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g. 3850"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Area Measurement Unit *</label>
                  <select
                    value={formData.areaUnit}
                    onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="sqft">Square Feet (Sq.Ft)</option>
                    <option value="sqyd">Square Yards (Sq.Yds)</option>
                    <option value="acres">Acres</option>
                    <option value="guntas">Guntas</option>
                  </select>
                </div>
              </div>

              {/* Bedrooms, Bathrooms, Balconies (Hidden for Plot / Land) */}
              {!isLandOrPlot && (
                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bedrooms (BHK)</label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      placeholder="e.g. 3"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      placeholder="e.g. 3"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Balconies</label>
                    <input
                      type="number"
                      value={formData.balconies}
                      onChange={(e) => setFormData({ ...formData, balconies: e.target.value })}
                      placeholder="e.g. 2"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* Facing, Furnishing, Possession */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vastu / Facing</label>
                  <select
                    value={formData.facing}
                    onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="North-East">North-East</option>
                    <option value="North-West">North-West</option>
                    <option value="South-East">South-East</option>
                    <option value="South-West">South-West</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Furnishing</label>
                  <select
                    value={formData.furnishing}
                    onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="UNFURNISHED">Unfurnished</option>
                    <option value="SEMI_FURNISHED">Semi-Furnished</option>
                    <option value="FULLY_FURNISHED">Fully-Furnished</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Possession Status</label>
                  <select
                    value={formData.possessionStatus}
                    onChange={(e) => setFormData({ ...formData, possessionStatus: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="READY_TO_MOVE">Ready to Move</option>
                    <option value="UNDER_CONSTRUCTION">Under Construction</option>
                    <option value="NEW_LAUNCH">New Launch</option>
                    <option value="RESALE">Resale</option>
                  </select>
                </div>
              </div>

              {/* Location details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Micro-market / Locality *</label>
                  <input
                    type="text"
                    required
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    placeholder="e.g. Kokapet, Tellapur, Gachibowli"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="e.g. 500075"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Physical Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Tower 2, Golden Mile Road, Neopolis, Kokapet"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* TG-RERA & Statutory Approvals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                <div>
                  <label className="block font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>TG-RERA Registration Number</span>
                  </label>
                  <input
                    type="text"
                    value={formData.reraNumber}
                    onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                    placeholder="e.g. P02400006211"
                    className="w-full p-2 bg-white border border-emerald-300 rounded-xl font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Statutory Approval Info</label>
                  <input
                    type="text"
                    value={formData.approvalInfo}
                    onChange={(e) => setFormData({ ...formData, approvalInfo: e.target.value })}
                    placeholder="e.g. HMDA & TG-RERA Approved"
                    className="w-full p-2 bg-white border border-emerald-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Cover Image URL & Preview */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
                {formData.imageUrl && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-16 h-12 object-cover rounded-lg border border-slate-300 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                    <div className="text-[11px] text-slate-500">
                      <p className="font-semibold text-slate-700">Image Preview</p>
                      <p className="truncate max-w-md">{formData.imageUrl}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Property Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive walkthrough of specifications, floor layout, luxury amenities, road access, and builder credibility..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="featuredCheckbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                />
                <label htmlFor="featuredCheckbox" className="font-bold text-slate-700 cursor-pointer">
                  Feature this property on Homepage Spotlight & Top Search Results
                </label>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                {editingProp ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(editingProp.id, editingProp.title)}
                    disabled={saving || deletingId === editingProp.id}
                    className="w-full sm:w-auto px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete This Property</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl shadow-lg hover:shadow-brand-600/30 transition-all flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : editingProp ? (
                      <>
                        <Edit className="w-4 h-4" />
                        <span>Save & Update Property</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Publish & Add Property</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
