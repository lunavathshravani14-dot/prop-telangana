'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Home,
  Building,
  Building2,
  Users,
  Contact,
  TrendingUp,
  Clock,
  Eye,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-sm font-semibold text-slate-500 py-10">Loading real estate analytics...</div>;
  }

  const metrics = stats?.metrics || {};
  const recentLeads = stats?.recentLeads || [];
  const topProperties = stats?.topProperties || [];
  const leadTimeline = stats?.leadTimeline || [];
  const leadBreakdown = stats?.leadStatusBreakdown || [];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">Platform Performance Overview</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time metrics for listings, customer enquiries, site visits, and developer portfolios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/properties?action=new"
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition-all"
          >
            + Create Property
          </Link>
          <Link
            href="/admin/leads"
            className="px-4 py-2.5 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs rounded-xl transition-all"
          >
            Manage CRM Leads
          </Link>
        </div>
      </div>

      {/* 1. KEY METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Properties</span>
            <Home className="w-5 h-5 text-brand-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-navy-950">{metrics.totalProperties || 0}</p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
            <span className="text-emerald-600 font-bold">{metrics.publishedProperties || 0} Published</span>
            <span>•</span>
            <span className="text-amber-600 font-bold">{metrics.pendingProperties || 0} Pending</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer Leads</span>
            <Contact className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-navy-950">{metrics.totalLeads || 0}</p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
            <span className="text-blue-600 font-bold">{metrics.newLeads || 0} New</span>
            <span>•</span>
            <span className="text-purple-600 font-bold">{metrics.siteVisitLeads || 0} Site Visits</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Mega Projects</span>
            <Building className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-navy-950">{metrics.totalProjects || 0}</p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
            <span className="text-slate-600 font-semibold">{metrics.totalDevelopers || 0} Verified Builders</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Users</span>
            <Users className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-navy-950">{metrics.totalUsers || 0}</p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
            <span className="text-emerald-600 font-bold">{metrics.convertedLeads || 0} Deals Converted</span>
          </div>
        </div>
      </div>

      {/* 2. CHARTS & PIPELINE BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Lead Inflow Chart (CSS Bar visualization) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-navy-950 text-base">Weekly Lead & Site Visit Pipeline</h3>
              <p className="text-xs text-slate-400">Total customer inquiries received over the last 7 days</p>
            </div>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              Real-time Inflow
            </span>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 pt-8 pb-2 px-4 border-b border-slate-100">
            {leadTimeline.map((item: any) => {
              const maxVal = 16;
              const leadHeightPercent = Math.round((item.leads / maxVal) * 100);
              const visitHeightPercent = Math.round((item.visits / maxVal) * 100);

              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full max-w-[36px] flex items-end justify-center gap-1.5 h-full">
                    {/* Leads bar */}
                    <div
                      style={{ height: `${leadHeightPercent}%` }}
                      className="w-1/2 bg-brand-600 rounded-t-md group-hover:bg-brand-500 transition-all relative"
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-navy-950 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                        {item.leads}
                      </span>
                    </div>
                    {/* Visits bar */}
                    <div
                      style={{ height: `${visitHeightPercent}%` }}
                      className="w-1/2 bg-purple-500 rounded-t-md group-hover:bg-purple-400 transition-all relative"
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-navy-950 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                        {item.visits}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{item.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-brand-600 rounded-sm" />
              <span className="font-semibold text-slate-700">Property Enquiries</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-500 rounded-sm" />
              <span className="font-semibold text-slate-700">Scheduled Site Visits</span>
            </div>
          </div>
        </div>

        {/* Lead Status Breakdown Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-navy-950 text-base mb-1">CRM Status Distribution</h3>
            <p className="text-xs text-slate-400 mb-6">Current breakdown of active customer opportunities</p>

            <div className="space-y-4">
              {leadBreakdown.map((item: any) => {
                const totalL = metrics.totalLeads || 1;
                const pct = Math.round((item.count / totalL) * 100);
                return (
                  <div key={item.status}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">{item.status?.replace(/_/g, ' ')}</span>
                      <span className="text-slate-900">{item.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`h-full rounded-full ${
                          item.status === 'NEW'
                            ? 'bg-blue-600'
                            : item.status === 'SITE_VISIT'
                            ? 'bg-purple-600'
                            : item.status === 'CONVERTED'
                            ? 'bg-emerald-500'
                            : 'bg-slate-400'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href="/admin/leads"
            className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <span>Open CRM Lead Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. RECENT LEADS & TOP PROPERTIES TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Leads */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-navy-950 text-base">Recent Inquiries</h3>
            <Link href="/admin/leads" className="text-xs font-bold text-brand-600 hover:underline">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5">Lead ID</th>
                  <th className="py-2.5">Client</th>
                  <th className="py-2.5">Property</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentLeads.map((l: any) => (
                  <tr key={l.id} className="hover:bg-slate-50/60">
                    <td className="py-3 font-mono font-bold text-brand-700">{l.leadId}</td>
                    <td className="py-3">
                      <p className="font-bold text-slate-900">{l.name}</p>
                      <p className="text-[11px] text-slate-400">{l.phone}</p>
                    </td>
                    <td className="py-3 truncate max-w-[150px]">
                      {l.property?.title || 'General Enquiry'}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Viewed Properties */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-navy-950 text-base">Top Viewed Properties</h3>
            <Link href="/admin/properties" className="text-xs font-bold text-brand-600 hover:underline">
              Manage →
            </Link>
          </div>

          <div className="space-y-3">
            {topProperties.map((p: any) => (
              <div
                key={p.id}
                className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs"
              >
                <div className="truncate max-w-[200px]">
                  <p className="font-bold text-slate-900 truncate">{p.title}</p>
                  <p className="text-[11px] text-slate-500">{p.locality} • {p.priceDisplay}</p>
                </div>
                <div className="flex items-center gap-1 text-slate-500 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.viewsCount} views</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
