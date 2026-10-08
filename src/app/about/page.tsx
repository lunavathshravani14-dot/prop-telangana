import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, Award, Users, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About Us | PropTelangana Real Estate Advisory',
  description: 'Learn about PropTelangana, Telangana’s dedicated real estate portal providing verified RERA properties.',
};

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Our Vision & Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 mt-1">
            Re-engineering Telangana Real Estate with 100% Transparency
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mt-4 leading-relaxed">
            PropTelangana was founded with a single mission: to eliminate real estate disinformation, unapproved ventures, and broker speculation across Hyderabad and Telangana.
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
          <div>
            <h2 className="text-xl font-extrabold text-navy-950 mb-3">Who We Are</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              PropTelangana is an institutional real estate technology and advisory firm based in Cyber City, Hyderabad. We connect discerning buyers, NRIs, and institutional funds directly with vetted developers including My Home Group, Aparna Constructions, Rajapushpa, Prestige, and Brigade.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-3xl font-extrabold text-brand-600">₹ 0</p>
              <p className="text-xs text-slate-500 font-bold mt-1">Buyer Brokerage Fee</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-3xl font-extrabold text-navy-950">1,200+</p>
              <p className="text-xs text-slate-500 font-bold mt-1">Verified Properties</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-3xl font-extrabold text-brand-600">100%</p>
              <p className="text-xs text-slate-500 font-bold mt-1">RERA & HMDA Sanctioned</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-navy-950 mb-3">The 4 Pillars of PropTelangana</h2>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>No Speculative Listings:</strong> We never list unapproved or pending-layout land ventures. Every project must present an active TG-RERA and HMDA registration number.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>Direct Builder Pricing:</strong> Buyers receive official builder pricing without inflated intermediary margins or commission surcharges.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>Full Legal Due-Diligence:</strong> 30-year title searches, master layout clearances, and bank loan approvals are cataloged for each venture.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>Dedicated Personal Advisor:</strong> Experienced local consultants coordinate property tours and negotiate directly on your behalf.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
