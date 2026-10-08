'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Contact,
  Search,
  Phone,
  Mail,
  User,
  Calendar,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  X,
} from 'lucide-react';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Selected lead for detail slide-over
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState('');

  const fetchLeads = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== 'ALL') params.set('status', statusFilter);
    if (priorityFilter !== 'ALL') params.set('priority', priorityFilter);
    if (search) params.set('search', search);

    fetch(`/api/admin/leads?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLeads(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, priorityFilter]);

  const openLeadDetail = (id: string) => {
    setDetailLoading(true);
    fetch(`/api/admin/leads/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSelectedLead(data.data);
          setUpdatingStatus(data.data.status);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setDetailLoading(false));
  };

  const handleUpdateStatusAndNote = async () => {
    if (!selectedLead) return;
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updatingStatus,
          note: newNote,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewNote('');
        openLeadDetail(selectedLead.id);
        fetchLeads();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const statusBadges: Record<string, string> = {
    NEW: 'bg-blue-50 text-blue-700 border-blue-200',
    CONTACTED: 'bg-amber-50 text-amber-700 border-amber-200',
    INTERESTED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    SITE_VISIT: 'bg-purple-50 text-purple-700 border-purple-200',
    NEGOTIATION: 'bg-orange-50 text-orange-700 border-orange-200',
    CONVERTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    LOST: 'bg-rose-50 text-rose-700 border-rose-200',
    CLOSED: 'bg-slate-100 text-slate-700 border-slate-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950">Customer Leads & CRM Pipeline</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track inquiries, schedule site inspections, assign advisors, and document follow-up notes.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by client name, mobile, email, or Lead ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-bold whitespace-nowrap">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Stages</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="INTERESTED">Interested</option>
            <option value="SITE_VISIT">Site Visit Scheduled</option>
            <option value="NEGOTIATION">Negotiation</option>
            <option value="CONVERTED">Converted</option>
            <option value="LOST">Lost</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="p-4">Lead ID</th>
                <th className="p-4">Customer Contact</th>
                <th className="p-4">Inquired Property / Project</th>
                <th className="p-4">Assigned Advisor</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-semibold">
                    Loading CRM leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-semibold">
                    No leads found matching criteria.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors cursor-pointer" onClick={() => openLeadDetail(lead.id)}>
                    <td className="p-4 font-mono font-bold text-brand-700">{lead.leadId}</td>
                    <td className="p-4">
                      <p className="font-extrabold text-navy-950">{lead.name}</p>
                      <p className="text-[11px] text-slate-500">{lead.phone}</p>
                    </td>
                    <td className="p-4 truncate max-w-[200px]">
                      {lead.property?.title || lead.project?.name || 'General Inquiry'}
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {lead.assignedAgent?.name || 'Unassigned'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${statusBadges[lead.status] || 'bg-slate-100'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[11px]">
                      {lead.priority}
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLeadDetail(lead.id);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 font-bold rounded-lg"
                      >
                        Details →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LEAD DETAIL SLIDE-OVER MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-white h-full p-6 sm:p-8 overflow-y-auto space-y-6 animate-in slide-in-from-right flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    {selectedLead.leadId}
                  </span>
                  <h3 className="font-extrabold text-xl text-navy-950 mt-1">{selectedLead.name}</h3>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-2 text-slate-400 hover:text-navy-950">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contact details */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Mobile Phone:</span>
                  <a href={`tel:${selectedLead.phone}`} className="font-bold text-brand-600 hover:underline">
                    {selectedLead.phone}
                  </a>
                </div>
                {selectedLead.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Email:</span>
                    <a href={`mailto:${selectedLead.email}`} className="font-semibold text-slate-700">
                      {selectedLead.email}
                    </a>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Source:</span>
                  <span className="font-semibold text-slate-700">{selectedLead.source}</span>
                </div>
              </div>

              {/* Requirement / Message */}
              {selectedLead.message && (
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-xs">
                  <span className="font-bold text-amber-900 block mb-1">Client Message:</span>
                  <p className="text-slate-700 leading-relaxed">{selectedLead.message}</p>
                </div>
              )}

              {/* Update Stage & Add Note Form */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700">Update Lead Stage</label>
                <select
                  value={updatingStatus}
                  onChange={(e) => setUpdatingStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="INTERESTED">Interested</option>
                  <option value="SITE_VISIT">Site Visit Scheduled</option>
                  <option value="NEGOTIATION">Negotiation</option>
                  <option value="CONVERTED">Converted (Sale Finalized)</option>
                  <option value="LOST">Lost</option>
                  <option value="CLOSED">Closed</option>
                </select>

                <label className="block text-xs font-bold text-slate-700 mt-3">Add Follow-Up Note</label>
                <textarea
                  rows={3}
                  placeholder="Record client requirements, budget feedback, or scheduled site inspection timings..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
                />

                <button
                  type="button"
                  onClick={handleUpdateStatusAndNote}
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow transition-all"
                >
                  Save Stage & Add Note
                </button>
              </div>

              {/* Activity Timeline / History */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                  Interaction Timeline & Notes
                </h4>
                <div className="space-y-3">
                  {selectedLead.notes?.map((n: any) => (
                    <div key={n.id} className="p-3 bg-slate-50 rounded-xl text-xs border border-slate-100">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-slate-600">{n.authorName}</span>
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-700">{n.note}</p>
                    </div>
                  ))}

                  {selectedLead.statusHistory?.map((h: any) => (
                    <div key={h.id} className="p-2.5 bg-blue-50/50 rounded-xl text-[11px] border border-blue-100 text-blue-900">
                      <span className="font-bold">Stage changed to {h.newStatus}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{new Date(h.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedLead(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
