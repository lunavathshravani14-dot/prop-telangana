'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Scale, X, ArrowLeft, Check, ShieldCheck, Home } from 'lucide-react';

function CompareContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];
    if (ids.length === 0) {
      try {
        ids = JSON.parse(localStorage.getItem('compare_props') || '[]');
      } catch {
        ids = [];
      }
    }

    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    fetch(`/api/compare?ids=${ids.join(',')}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProperties(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleRemove = (id: string) => {
    const updated = properties.filter((p) => p.id !== id);
    setProperties(updated);
    const idList = updated.map((p) => p.id);
    localStorage.setItem('compare_props', JSON.stringify(idList));
    window.dispatchEvent(new Event('compare_updated'));
  };

  if (loading) {
    return <div className="pt-32 text-center text-sm font-semibold text-slate-500">Loading comparison table...</div>;
  }

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
              <Link href="/" className="hover:text-brand-600">Home</Link>
              <span>/</span>
              <span className="font-semibold text-slate-800">Compare</span>
            </div>
            <h1 className="text-3xl font-extrabold text-navy-950">Property Comparison Matrix</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Side-by-side analysis of specifications, price per sq.ft, and amenities.
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-xs font-bold rounded-xl text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Add More Properties</span>
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-navy-950 mb-2">No Properties Selected</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Click the scale/compare icon on any property card to select up to 4 units for side-by-side evaluation.
            </p>
            <Link
              href="/properties"
              className="px-6 py-3 bg-brand-600 text-white font-bold text-xs rounded-xl shadow inline-block"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="p-4 sm:p-6 w-1/4 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Specification
                  </th>
                  {properties.map((p) => (
                    <th key={p.id} className="p-4 sm:p-6 w-1/4 align-top">
                      <div className="relative group">
                        <button
                          onClick={() => handleRemove(p.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-slate-400 text-xs transition-colors"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-slate-100">
                          <img
                            src={p.images?.[0]?.url || ''}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Link href={`/properties/${p.slug}`}>
                          <h4 className="font-extrabold text-sm text-navy-950 hover:text-brand-600 transition-colors line-clamp-2">
                            {p.title}
                          </h4>
                        </Link>
                        <p className="text-base font-extrabold text-brand-600 mt-1">
                          {p.priceDisplay || `₹ ${(p.price / 10000000).toFixed(2)} Cr`}
                        </p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                <tr>
                  <td className="p-4 font-bold text-slate-500 bg-slate-50/50">Property Type</td>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4 font-semibold text-slate-800">{p.propertyType}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-500 bg-slate-50/50">Location</td>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4">{p.locality}, {p.city}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-500 bg-slate-50/50">Built-Up Area</td>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4 font-semibold">{p.area} {p.areaUnit}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-500 bg-slate-50/50">Bedrooms / BHK</td>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4">{p.bedrooms ? `${p.bedrooms} BHK` : 'N/A'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-500 bg-slate-50/50">Bathrooms</td>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4">{p.bathrooms ? `${p.bathrooms} Baths` : 'N/A'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-500 bg-slate-50/50">Furnishing</td>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4">{p.furnishing?.replace(/_/g, ' ')}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-500 bg-slate-50/50">Possession</td>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4">{p.possessionStatus?.replace(/_/g, ' ')}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-500 bg-slate-50/50">RERA Status</td>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4">
                      {p.reraNumber ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Registered
                        </span>
                      ) : (
                        'Under Verification'
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-500 bg-slate-50/50">Developer</td>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4 font-semibold">{p.developer?.name || 'Private Seller'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-500 bg-slate-50/50">Action</td>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4">
                      <Link
                        href={`/properties/${p.slug}`}
                        className="px-4 py-2 bg-navy-900 text-white font-bold text-xs rounded-xl shadow-sm block text-center hover:bg-navy-950 transition-colors"
                      >
                        View Full Details
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-sm">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}
