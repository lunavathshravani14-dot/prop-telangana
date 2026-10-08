'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, ShieldCheck, Phone, Mail, User } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: any;
  project?: any;
}

export default function EnquiryModal({ isOpen, onClose, property, project }: EnquiryModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leadId, setLeadId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const title = property?.title || project?.name || 'Telangana Real Estate Consultation';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          message: message || `Enquiry for ${title}`,
          propertyId: property?.id,
          projectId: project?.id,
          source: property ? 'PROPERTY_MODAL' : project ? 'PROJECT_MODAL' : 'GENERAL_MODAL',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setLeadId(data.data.leadId);
      } else {
        setErrorMsg(data.error?.message || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('Network error. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-navy-950">Enquiry Received!</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Thank you, <span className="font-semibold">{name}</span>. Your enquiry reference ID is{' '}
              <span className="font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">{leadId}</span>.
              Our dedicated property specialist will contact you on <span className="font-semibold">{phone}</span> shortly with official brochures and site visit slots.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full py-3 bg-navy-950 hover:bg-navy-900 text-white font-bold rounded-xl text-sm transition-all"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-navy-950 to-navy-900 p-6 text-white">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-400 bg-brand-950/60 border border-brand-500/30 px-2.5 py-1 rounded-full">
                Instant Advisory
              </span>
              <h3 className="text-xl font-extrabold mt-2 tracking-tight line-clamp-1">{title}</h3>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Zero Brokerage • 100% Verified TG-RERA Properties
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Venkat Rao"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="venkat@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message / Requirements</label>
                <textarea
                  rows={3}
                  placeholder="I am interested in pricing, floor plans, and site visit schedule..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Honeypot field (hidden) */}
              <input type="text" name="website_honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Connecting with Advisor...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Get Free Callback & Brochure</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                🔒 Your contact info is strictly confidential under PropTelangana Privacy Policy.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
