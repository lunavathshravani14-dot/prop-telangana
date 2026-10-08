'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  Scale,
  Share2,
  Phone,
  MessageCircle,
  ShieldCheck,
  Building,
  CheckCircle2,
  Calendar,
  Layers,
  Compass,
  FileText,
  User,
  ArrowRight,
  Send,
} from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';

interface PropertyDetailClientProps {
  property: any;
  similarProperties: any[];
}

export default function PropertyDetailClient({
  property,
  similarProperties,
}: PropertyDetailClientProps) {
  const images = property.images || [];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<string | null>(null);

  const activeImage =
    images[activeImageIndex]?.url ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  const handleFavoriteToggle = async () => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.id }),
      });
      const data = await res.json();
      if (data.success) {
        setIsFavorite(data.data.isFavorite);
      } else if (res.status === 401) {
        window.location.href = `/login?redirect=/properties/${property.slug}`;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          propertyId: property.id,
          message: message || `Enquiry for ${property.title}`,
          source: 'PROPERTY_PAGE_FORM',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedLead(data.data.leadId);
      } else {
        alert(data.error?.message || 'Error sending enquiry');
      }
    } catch {
      alert('Network error. Please try calling directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello PropTelangana! I am interested in "${property.title}" (${property.propertyId}) priced at ${property.priceDisplay || '₹ ' + property.price}. Please provide site visit slots and brochure.`
  );

  return (
    <div className="pt-24 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-4 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-brand-600">Properties</Link>
          <span>/</span>
          <Link href={`/locations/${property.locality.toLowerCase()}`} className="hover:text-brand-600">{property.locality}</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800 line-clamp-1">{property.title}</span>
        </div>

        {/* Title & Quick Action Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-brand-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider">
                For {property.listingType}
              </span>
              <span className="bg-navy-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                {property.propertyType}
              </span>
              {property.reraNumber && (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  RERA: {property.reraNumber}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{property.address}, {property.locality}, {property.city} - {property.pincode}</span>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2 shrink-0">
            <div className="text-left md:text-right">
              <p className="text-xs text-slate-500 font-semibold">Total Price</p>
              <p className="text-3xl font-extrabold text-navy-950">
                {property.priceDisplay || `₹ ${(property.price / 10000000).toFixed(2)} Cr`}
              </p>
              <p className="text-xs text-slate-500">
                Avg. ₹ {Math.round(property.price / property.area).toLocaleString()} / {property.areaUnit}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={handleFavoriteToggle}
                className={`p-2.5 rounded-xl border border-slate-200 bg-white transition-colors ${
                  isFavorite ? 'text-red-500 border-red-200 bg-red-50' : 'text-slate-600 hover:text-red-500'
                }`}
                title="Save Property"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-brand-600 transition-colors"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {shareCopied && (
                <span className="text-xs text-emerald-600 font-bold">Link Copied!</span>
              )}
            </div>
          </div>
        </div>

        {/* IMAGE GALLERY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-10">
          {/* Main Large Image */}
          <div className="lg:col-span-9 aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden relative shadow-md">
            <img
              src={activeImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-navy-950/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-lg">
              Photo {activeImageIndex + 1} of {Math.max(1, images.length)}
            </div>
          </div>

          {/* Thumbnails Column */}
          <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto max-h-[550px] scrollbar-none">
            {images.map((img: any, idx: number) => (
              <button
                key={img.id || idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative rounded-xl overflow-hidden aspect-[16/10] shrink-0 border-2 transition-all ${
                  activeImageIndex === idx ? 'border-brand-500 scale-95 shadow' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT (Details & Specs + Sticky Enquiry Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT 8 COLS: Specs, Description, Amenities, Developer, Map */}
          <div className="lg:col-span-8 space-y-8">
            {/* KEY SPECIFICATIONS CARD */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <h2 className="text-lg font-extrabold text-navy-950 mb-4">Key Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <p className="text-slate-400 font-medium">Super Builtup Area</p>
                  <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                    {property.area} {property.areaUnit}
                  </p>
                </div>
                {property.bedrooms && (
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <p className="text-slate-400 font-medium">Bedrooms</p>
                    <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                      {property.bedrooms} BHK
                    </p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <p className="text-slate-400 font-medium">Bathrooms</p>
                    <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                      {property.bathrooms} Baths
                    </p>
                  </div>
                )}
                {property.facing && (
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <p className="text-slate-400 font-medium">Vastu / Facing</p>
                    <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                      {property.facing}
                    </p>
                  </div>
                )}
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <p className="text-slate-400 font-medium">Possession Status</p>
                  <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                    {property.possessionStatus?.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <p className="text-slate-400 font-medium">Furnishing Status</p>
                  <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                    {property.furnishing?.replace(/_/g, ' ')}
                  </p>
                </div>
                {property.floor !== null && property.totalFloors !== null && (
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <p className="text-slate-400 font-medium">Floor Level</p>
                    <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                      {property.floor} of {property.totalFloors} Floors
                    </p>
                  </div>
                )}
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <p className="text-slate-400 font-medium">Approval Agency</p>
                  <p className="font-extrabold text-emerald-700 text-sm mt-0.5 truncate">
                    {property.approvalInfo || 'HMDA / RERA'}
                  </p>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <h2 className="text-lg font-extrabold text-navy-950 mb-3">About this Property</h2>
              <div className="text-sm text-slate-600 leading-relaxed space-y-3 whitespace-pre-line">
                {property.description}
              </div>
            </div>

            {/* AMENITIES */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <h2 className="text-lg font-extrabold text-navy-950 mb-4">Features & Lifestyle Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs font-semibold text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                      <span>{item.amenity?.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DEVELOPER CARD */}
            {property.developer && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-slate-50 p-2 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={property.developer.logo || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80'}
                    alt={property.developer.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <h3 className="font-extrabold text-lg text-navy-950">{property.developer.name}</h3>
                    {property.developer.verified && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {property.developer.description}
                  </p>
                  <div className="mt-3">
                    <Link
                      href={`/developers/${property.developer.slug}`}
                      className="text-xs font-bold text-brand-600 hover:underline"
                    >
                      View all projects by {property.developer.name} →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* MAP & LOCATION */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <h2 className="text-lg font-extrabold text-navy-950 mb-3">Location & Neighborhood</h2>
              <div className="h-64 rounded-2xl bg-slate-100 border border-slate-200 relative overflow-hidden flex flex-col items-center justify-center text-center p-6">
                <MapPin className="w-10 h-10 text-brand-600 mb-2" />
                <h4 className="font-extrabold text-base text-navy-950">{property.locality}, {property.city}</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Strategic growth node with rapid connectivity to Outer Ring Road (ORR), Rajiv Gandhi International Airport, and major IT SEZs.
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address + ', ' + property.locality + ', Hyderabad')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-4 py-2 bg-navy-900 text-white text-xs font-bold rounded-xl shadow"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLS: STICKY ENQUIRY / AGENT FORM */}
          <div className="lg:col-span-4 space-y-6">
            {/* AGENT CARD */}
            {property.agent && (
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <img
                  src={property.agent.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'}
                  alt={property.agent.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">
                    Assigned Specialist
                  </span>
                  <h4 className="font-extrabold text-sm text-navy-950">{property.agent.name}</h4>
                  <p className="text-[11px] text-slate-500">{property.agent.designation}</p>
                </div>
              </div>
            )}

            {/* ENQUIRY CARD */}
            <div id="enquire" className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg sticky top-24">
              {submittedLead ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-lg text-navy-950">Enquiry Confirmed!</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Lead reference <span className="font-mono font-bold text-brand-600">{submittedLead}</span> has been dispatched. Our consultant will reach out via WhatsApp and phone shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3.5">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-base text-navy-950">Book a VIP Site Visit</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Direct builder pricing • Zero brokerage • Free car pickup
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="ramesh@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Message</label>
                    <textarea
                      rows={2}
                      placeholder="I am interested in pricing and floor plans..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Submitting...' : 'Enquire & Download Brochure'}</span>
                  </button>

                  <a
                    href={`https://wa.me/917013873126?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-emerald-200"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                    <span>Chat on WhatsApp Instantly</span>
                  </a>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* SIMILAR PROPERTIES */}
        {similarProperties.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200">
            <h2 className="text-2xl font-extrabold text-navy-950 mb-6">
              Similar Properties in {property.locality}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((simProp) => (
                <PropertyCard key={simProp.id} property={simProp} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* STICKY BOTTOM ENQUIRY CTA ON MOBILE */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-3 z-40 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <p className="text-[10px] text-slate-500 font-semibold">Total Price</p>
          <p className="text-base font-extrabold text-navy-950">
            {property.priceDisplay || `₹ ${(property.price / 10000000).toFixed(2)} Cr`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/917013873126?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-emerald-500 text-white rounded-xl"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
          </a>

          <a
            href="#enquire"
            className="px-5 py-2.5 bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow"
          >
            Enquire Now
          </a>
        </div>
      </div>
    </div>
  );
}
