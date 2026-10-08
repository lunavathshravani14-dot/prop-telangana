'use client';

import React, { useState, useEffect } from 'react';
import { History, ShieldAlert } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/audit-logs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogs(data.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy-950">Administrative Audit Trail</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable log of operational mutations, property updates, deletions, and CRM status changes.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="p-4">Action</th>
                <th className="p-4">Entity</th>
                <th className="p-4">Entity ID</th>
                <th className="p-4">Performed By</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-sans">
                    Loading audit trail records...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-sans">
                    No audit records recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-navy-950">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-brand-700">{log.entity}</td>
                    <td className="p-4 text-slate-500 truncate max-w-[120px]">{log.entityId}</td>
                    <td className="p-4 text-slate-800 font-sans font-semibold">{log.userEmail || 'System'}</td>
                    <td className="p-4 text-slate-400 font-sans">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="p-4 text-slate-500 truncate max-w-[200px]">
                      {log.metadata || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
