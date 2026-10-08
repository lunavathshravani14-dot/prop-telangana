'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Plus, Edit, Trash2, CheckCircle2, X } from 'lucide-react';

export default function AdminDevelopersPage() {
  const [developers, setDevelopers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    phone: '',
    email: '',
    officeAddress: '',
    experienceYears: '20',
    verified: true,
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80',
  });

  const fetchDevs = () => {
    setLoading(true);
    fetch('/api/developers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDevelopers(data.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDevs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/developers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchDevs();
      } else {
        alert(data.error?.message || 'Error saving developer');
      }
    } catch {
      alert('Error saving developer');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete developer "${name}"?`)) return;
    try {
      const res = await fetch(`/api/developers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchDevs();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950">Verified Developers Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage certified builder profiles and corporate credentials.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Developer</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="p-4">Developer</th>
                <th className="p-4">Experience</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Projects</th>
                <th className="p-4">Units</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Loading developers...</td>
                </tr>
              ) : developers.map((dev) => (
                <tr key={dev.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-extrabold text-navy-950 flex items-center gap-3">
                    <img src={dev.logo || ''} alt="" className="w-8 h-8 rounded-lg object-contain bg-slate-50 border p-1" />
                    <Link href={`/developers/${dev.slug}`} target="_blank" className="hover:text-brand-600">
                      {dev.name}
                    </Link>
                  </td>
                  <td className="p-4">{dev.experienceYears}+ Years</td>
                  <td className="p-4">{dev.phone || dev.email || 'N/A'}</td>
                  <td className="p-4 font-semibold">{dev._count?.projects || 0}</td>
                  <td className="p-4 font-semibold">{dev._count?.properties || 0}</td>
                  <td className="p-4">
                    {dev.verified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Standard</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(dev.id, dev.name)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-extrabold text-base">Register New Builder</h3>
              <button onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Developer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  placeholder="e.g. My Home Group"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Years Experience</label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Corporate Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Office Address</label>
                <input
                  type="text"
                  value={formData.officeAddress}
                  onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company Profile</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-brand-600 text-white font-extrabold rounded-xl shadow">
                  Save Developer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
