'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, Plus, Search, Edit, Trash2, ShieldCheck, X } from 'lucide-react';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPrj, setEditingPrj] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    city: 'Hyderabad',
    projectType: 'LUXURY_APARTMENTS',
    totalArea: '',
    totalUnits: '',
    apartmentSizes: '',
    priceRange: '',
    possessionDate: '',
    reraNumber: '',
    approvalDetails: 'HMDA & RERA Approved',
    status: 'ONGOING',
    imageUrl: '',
  });

  const fetchProjects = () => {
    setLoading(true);
    fetch('/api/projects?limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProjects(data.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreate = () => {
    setEditingPrj(null);
    setFormData({
      name: '',
      description: '',
      location: '',
      city: 'Hyderabad',
      projectType: 'LUXURY_APARTMENTS',
      totalArea: '',
      totalUnits: '',
      apartmentSizes: '',
      priceRange: '',
      possessionDate: '',
      reraNumber: '',
      approvalDetails: 'HMDA & RERA Approved',
      status: 'ONGOING',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPrj ? `/api/projects/${editingPrj.id}` : '/api/projects';
      const method = editingPrj ? 'PUT' : 'POST';

      const payload = {
        ...formData,
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
        fetchProjects();
      } else {
        alert(data.error?.message || 'Error saving project');
      }
    } catch {
      alert('Error saving project');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete project "${name}"?`)) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchProjects();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950">Gated Projects & Townships</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage master communities, possession dates, and developer affiliations.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="p-4">Project</th>
                <th className="p-4">Location</th>
                <th className="p-4">Type</th>
                <th className="p-4">Price Range</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Loading projects...</td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">No projects found.</td>
                </tr>
              ) : (
                projects.map((prj) => (
                  <tr key={prj.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-extrabold text-navy-950">
                      <Link href={`/projects/${prj.slug}`} target="_blank" className="hover:text-brand-600">
                        {prj.name}
                      </Link>
                      <p className="text-[10px] font-mono text-slate-400 font-normal">{prj.projectId}</p>
                    </td>
                    <td className="p-4">{prj.location}, {prj.city}</td>
                    <td className="p-4 font-semibold">{prj.projectType}</td>
                    <td className="p-4 font-extrabold text-brand-600">{prj.priceRange || 'On Request'}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                        {prj.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(prj.id, prj.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-navy-950 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base">Add New Mega Project</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-3.5 text-xs flex-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. My Home Sayuk"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Tellapur, Near Financial District"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Project Type</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="LUXURY_APARTMENTS">Luxury Apartments</option>
                    <option value="GATED_COMMUNITY_VILLAS">Gated Villas</option>
                    <option value="PLOTTED_DEVELOPMENT">Plotted Development</option>
                    <option value="COMMERCIAL_COMPLEX">Commercial Complex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price Range</label>
                  <input
                    type="text"
                    value={formData.priceRange}
                    onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                    placeholder="₹ 1.25 Cr - ₹ 2.80 Cr"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Possession</label>
                  <input
                    type="text"
                    value={formData.possessionDate}
                    onChange={(e) => setFormData({ ...formData, possessionDate: e.target.value })}
                    placeholder="December 2026"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">TG-RERA Registration</label>
                  <input
                    type="text"
                    value={formData.reraNumber}
                    onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                    placeholder="P02400003923"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="ONGOING">Under Construction (Ongoing)</option>
                    <option value="UPCOMING">New Launch (Upcoming)</option>
                    <option value="READY_TO_MOVE">Ready to Move</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl shadow"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
