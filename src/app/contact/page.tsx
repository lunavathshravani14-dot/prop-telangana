'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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
          message: `${subject ? '[' + subject + '] ' : ''}${message}`,
          source: 'CONTACT_PAGE',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedLead(data.data.leadId);
      } else {
        alert(data.error?.message || 'Failed to submit enquiry');
      }
    } catch {
      alert('Error contacting server. Please call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Reach Out to PropTelangana
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-1">
            Get in Touch with our Real Estate Advisory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-2">
            Have questions regarding RERA verification, project timelines, or custom site tours? Our Cyber City office is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Office Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-navy-950 text-white p-8 rounded-3xl shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                  Headquarters
                </span>
                <h3 className="text-xl font-extrabold mt-1">PropTelangana Experience Center</h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <span>Level 5, Cyber Crest, HITEC City, Hyderabad, Telangana 500081</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brand-400 shrink-0" />
                  <span>+91 70138 73126</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-brand-400 shrink-0" />
                  <a href="mailto:jbinfra.sales25@gmail.com" className="hover:text-brand-400 transition-colors">jbinfra.sales25@gmail.com</a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-brand-400 shrink-0" />
                  <span>Monday – Sunday: 9:00 AM – 8:00 PM IST</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Brokerage Policy for all residential and commercial buyers.</span>
              </div>
            </div>

            {/* Embedded Map Visual */}
            <div className="h-64 rounded-3xl bg-slate-200 border border-slate-300 overflow-hidden flex flex-col items-center justify-center p-6 text-center text-slate-600">
              <MapPin className="w-8 h-8 text-brand-600 mb-2" />
              <p className="font-bold text-sm text-slate-800">HITEC City Central, Hyderabad</p>
              <p className="text-xs text-slate-500 mt-1">Opposite Cyber Towers, 2 mins from Metro Station</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
            {submittedLead ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-navy-950">Thank You!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your enquiry reference ID is <span className="font-mono font-bold text-brand-600">{submittedLead}</span>.
                  A senior property advisor will reach out within 2 hours.
                </p>
                <button
                  onClick={() => setSubmittedLead(null)}
                  className="px-6 py-2.5 bg-navy-950 text-white font-bold text-xs rounded-xl shadow mt-4"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-extrabold text-navy-950 mb-4">Send Us a Direct Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Varma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="anand@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      placeholder="Site visit in Kokapet / Plot inquiry"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your requirements, preferred budget, and suitable call timings..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>

                {/* Honeypot field for anti-spam */}
                <input type="text" name="website_honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting Message...' : 'Send Message to Advisor'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
