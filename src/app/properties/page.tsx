'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import EnquiryModal from '@/components/EnquiryModal';
import {
  Search,
  SlidersHorizontal,
  X,
  Filter,
  ArrowUpDown,
  Home,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Selected property for enquiry modal
  const [enquiryProp, setEnquiryProp] = useState<any>(null);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [listingType, setListingType] = useState(searchParams.get('listingType') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || '');
  const [locality, setLocality] = useState(searchParams.get('locality') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [furnishing, setFurnishing] = useState(searchParams.get('furnishing') || '');
  const [possessionStatus, setPossessionStatus] = useState(searchParams.get('possessionStatus') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '9');
      if (search) params.set('search', search);
      if (listingType) params.set('listingType', listingType);
      if (propertyType) params.set('propertyType', propertyType);
      if (locality) params.set('locality', locality);
      if (bedrooms) params.set('bedrooms', bedrooms);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (furnishing) params.set('furnishing', furnishing);
      if (possessionStatus) params.set('possessionStatus', possessionStatus);
      if (sort) params.set('sort', sort);

      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProperties(data.data);
        setTotal(data.meta?.total || 0);
        setTotalPages(data.meta?.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, sort, searchParams]);

  const applyFilters = () => {
    setPage(1);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (listingType) params.set('listingType', listingType);
    if (propertyType) params.set('propertyType', propertyType);
    if (locality) params.set('locality', locality);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (furnishing) params.set('furnishing', furnishing);
    if (possessionStatus) params.set('possessionStatus', possessionStatus);
    if (sort) params.set('sort', sort);

    router.push(`/properties?${params.toString()}`);
    setMobileFilterOpen(false);
  };

  const clearFilters = () => {
    setSearch('');
    setListingType('');
    setPropertyType('');
    setLocality('');
    setBedrooms('');
    setMinPrice('');
    setMaxPrice('');
    setFurnishing('');
    setPossessionStatus('');
    setSort('newest');
    setPage(1);
    router.push('/properties');
    setMobileFilterOpen(false);
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-6">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
            <span className="hover:text-brand-600 cursor-pointer" onClick={() => router.push('/')}>
              Home
            </span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Properties in Telangana</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
            Verified Properties for Sale & Rent in Hyderabad
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse through {total} verified luxury apartments, gated villas, and HMDA layout plots.
          </p>
        </div>

        {/* Top Search Bar & Sort Dropdown */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, location (Kokapet, Tellapur, Gachibowli), or builder..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold whitespace-nowrap">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-bold focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="area_asc">Area: Low to High</option>
                <option value="area_desc">Area: High to Low</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Property Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 self-start sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-extrabold text-navy-950 text-base">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                <span>Filters</span>
              </div>
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Listing Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Listing Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['', 'BUY', 'RENT'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setListingType(t)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      listingType === t
                        ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t === '' ? 'All' : t === 'BUY' ? 'Buy' : 'Rent'}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              >
                <option value="">All Categories</option>
                <option value="APARTMENT">Apartment / Flat</option>
                <option value="VILLA">Gated Villa</option>
                <option value="PLOT">Open Plot (HMDA/DTCP)</option>
                <option value="COMMERCIAL">Commercial IT/Office</option>
                <option value="LAND">Development Land</option>
              </select>
            </div>

            {/* Locality */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Locality / Zone</label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              >
                <option value="">All Localities</option>
                <option value="Kokapet">Kokapet (Neopolis)</option>
                <option value="Tellapur">Tellapur</option>
                <option value="Financial District">Financial District</option>
                <option value="Gachibowli">Gachibowli</option>
                <option value="Mokila">Mokila</option>
                <option value="Jubilee Hills">Jubilee Hills</option>
              </select>
            </div>

            {/* Bedrooms (BHK) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Bedrooms</label>
              <div className="grid grid-cols-4 gap-1.5">
                {['', '2', '3', '4'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBedrooms(b)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      bedrooms === b
                        ? 'bg-brand-600 text-white border-brand-600 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {b === '' ? 'Any' : `${b} BHK`}
                  </button>
                ))}
              </div>
            </div>

            {/* Furnishing */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Furnishing</label>
              <select
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              >
                <option value="">Any Furnishing</option>
                <option value="UNFURNISHED">Unfurnished</option>
                <option value="SEMI_FURNISHED">Semi Furnished</option>
                <option value="FULLY_FURNISHED">Fully Furnished</option>
              </select>
            </div>

            {/* Apply Button */}
            <button
              onClick={applyFilters}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all"
            >
              Apply Filter Selection
            </button>
          </aside>

          {/* PROPERTY CARDS LIST */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl h-96 p-4 animate-pulse border border-slate-200">
                    <div className="h-48 bg-slate-200 rounded-xl mb-4" />
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
                    <div className="h-10 bg-slate-100 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-navy-950 mb-2">No Properties Match Your Search</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                  Try adjusting your filters, clearing budget limits, or searching broader locations in Telangana.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-xl shadow"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      onEnquire={(p) => setEnquiryProp(p)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                          page === i + 1
                            ? 'bg-brand-600 text-white shadow'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER MODAL */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-base text-navy-950">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Listing Type</label>
              <div className="grid grid-cols-3 gap-2">
                {['', 'BUY', 'RENT'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setListingType(t)}
                    className={`py-2 text-xs font-bold rounded-xl border ${
                      listingType === t ? 'bg-navy-900 text-white' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    {t === '' ? 'All' : t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="">All Categories</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Gated Villa</option>
                <option value="PLOT">Open Plot</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Locality</label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="">All Localities</option>
                <option value="Kokapet">Kokapet</option>
                <option value="Tellapur">Tellapur</option>
                <option value="Financial District">Financial District</option>
                <option value="Gachibowli">Gachibowli</option>
                <option value="Mokila">Mokila</option>
              </select>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 py-3 bg-brand-600 text-white text-xs font-bold rounded-xl shadow"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      {enquiryProp && (
        <EnquiryModal
          isOpen={Boolean(enquiryProp)}
          onClose={() => setEnquiryProp(null)}
          property={enquiryProp}
        />
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-sm">Loading properties...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
