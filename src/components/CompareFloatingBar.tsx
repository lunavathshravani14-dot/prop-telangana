'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scale, X, ArrowRight } from 'lucide-react';

export default function CompareFloatingBar() {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const loadCompare = () => {
    try {
      const items = JSON.parse(localStorage.getItem('compare_props') || '[]');
      setCompareIds(items);
    } catch {
      setCompareIds([]);
    }
  };

  useEffect(() => {
    loadCompare();
    window.addEventListener('compare_updated', loadCompare);
    return () => window.removeEventListener('compare_updated', loadCompare);
  }, []);

  const handleClear = () => {
    localStorage.removeItem('compare_props');
    setCompareIds([]);
    window.dispatchEvent(new Event('compare_updated'));
  };

  if (compareIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-navy-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
          <Scale className="w-4 h-4" />
        </div>
        <span className="text-xs sm:text-sm font-bold">
          {compareIds.length} {compareIds.length === 1 ? 'Property' : 'Properties'} in Comparison
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/compare?ids=${compareIds.join(',')}`}
          className="px-4 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-1 shadow"
        >
          <span>Compare Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleClear}
          className="p-1.5 text-slate-400 hover:text-white transition-colors"
          title="Clear all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
