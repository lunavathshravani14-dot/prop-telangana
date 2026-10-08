'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Phone, Mail, X } from 'lucide-react';

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: 'Senior Investment Advisor',
    reraNumber: '',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  });

  const fetchAgents = () => {
    setLoading(true);
    fetch('/api/admin/agents')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAgents(data.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchAgents();
      } else {
        alert(data.error?.message || 'Error creating agent');
      }
    } catch {
      alert('Error creating agent');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950">Property Advisors & Consultants</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage agent certifications, employee IDs, and assigned property pipelines.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Advisor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-slate-400 text-xs">Loading advisors...</div>
        ) : agents.map((agent) => (
          <div key={agent.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
            <img
              src={agent.photo || ''}
              alt={agent.name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="font-mono text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                {agent.employeeId}
              </span>
              <h3 className="font-extrabold text-base text-navy-950 mt-1 truncate">{agent.name}</h3>
              <p className="text-xs text-slate-500 truncate">{agent.designation}</p>

              <div className="mt-3 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{agent.email}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-500 font-semibold">
                <span>{agent._count?.leads || 0} Assigned Leads</span>
                <span>{agent._count?.properties || 0} Properties</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-extrabold text-base">Register New Advisor</h3>
              <button onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  placeholder="e.g. Ramesh Reddy"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-brand-600 text-white font-extrabold rounded-xl shadow">
                  Save Advisor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
