'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home, IndianRupee, Layers } from 'lucide-react';

export default function HeroSearch() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'BUY' | 'RENT' | 'PROJECTS' | 'PLOTS' | 'COMMERCIAL'>('BUY');
  const [locality, setLocality] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'PROJECTS') {
      const params = new URLSearchParams();
      if (locality) params.set('search', locality);
      if (propertyType) params.set('projectType', propertyType);
      router.push(`/projects?${params.toString()}`);
      return;
    }

    const params = new URLSearchParams();

    if (activeTab === 'BUY') params.set('listingType', 'BUY');
    if (activeTab === 'RENT') params.set('listingType', 'RENT');
    if (activeTab === 'PLOTS') {
      params.set('propertyType', 'PLOT');
    } else if (activeTab === 'COMMERCIAL') {
      params.set('propertyType', 'COMMERCIAL');
    } else if (propertyType) {
      params.set('propertyType', propertyType);
    }

    if (locality) params.set('locality', locality);
    if (bedrooms) params.set('bedrooms', bedrooms);

    if (budget) {
      if (budget === 'under-1cr') params.set('maxPrice', '10000000');
      else if (budget === '1cr-2cr') {
        params.set('minPrice', '10000000');
        params.set('maxPrice', '20000000');
      } else if (budget === '2cr-4cr') {
        params.set('minPrice', '20000000');
        params.set('maxPrice', '40000000');
      } else if (budget === 'above-4cr') {
        params.set('minPrice', '40000000');
      }
    }

    router.push(`/properties?${params.toString()}`);
  };

  const tabs = [
    { id: 'BUY', label: 'Buy' },
    { id: 'RENT', label: 'Rent' },
    { id: 'PROJECTS', label: 'New Projects' },
    { id: 'PLOTS', label: 'Plots / Layouts' },
    { id: 'COMMERCIAL', label: 'Commercial' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-xl p-3 sm:p-5 rounded-3xl shadow-2xl border border-white/40">
      {/* Category Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-3 border-b border-slate-100 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-navy-900 text-white shadow-md'
                : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter inputs grid */}
      <form onSubmit={handleSearch} className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Locality Search */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Location / Locality
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-brand-600 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. Kokapet, Tellapur, Gachibowli"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Property Type
            </label>
            <div className="relative flex items-center">
              <Home className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">All Property Types</option>
                <option value="APARTMENT">Apartment / Flat</option>
                <option value="VILLA">Gated Villa</option>
                <option value="PLOT">Open Plot (HMDA/DTCP)</option>
                <option value="COMMERCIAL">Commercial Office / Retail</option>
                <option value="LAND">Development Land</option>
              </select>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Budget Range
            </label>
            <div className="relative flex items-center">
              <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">Any Budget</option>
                <option value="under-1cr">Under ₹ 1.0 Crore</option>
                <option value="1cr-2cr">₹ 1.0 Cr - ₹ 2.0 Cr</option>
                <option value="2cr-4cr">₹ 2.0 Cr - ₹ 4.0 Cr</option>
                <option value="above-4cr">Above ₹ 4.0 Crore</option>
              </select>
            </div>
          </div>

          {/* Bedrooms / BHK */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Bedrooms (BHK)
            </label>
            <div className="relative flex items-center">
              <Layers className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">Any Bedrooms</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="text-xs text-slate-500 hidden sm:flex items-center gap-2">
            <span className="font-semibold text-slate-700">Trending Search:</span>
            <button
              type="button"
              onClick={() => {
                setLocality('Kokapet');
                setActiveTab('BUY');
              }}
              className="text-brand-600 hover:underline"
            >
              Kokapet
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setLocality('Tellapur');
                setActiveTab('BUY');
              }}
              className="text-brand-600 hover:underline"
            >
              Tellapur
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setLocality('Mokila');
                setActiveTab('PLOTS');
              }}
              className="text-brand-600 hover:underline"
            >
              Mokila Plots
            </button>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Verified Properties</span>
          </button>
        </div>
      </form>
    </div>
  );
}
