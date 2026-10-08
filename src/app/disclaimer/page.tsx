import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'RERA Compliance & Legal Disclaimer | PropTelangana',
  description: 'Telangana RERA statutory declarations, advertisement notices, and layout verification disclaimer.',
};

export default function DisclaimerPage() {
  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-navy-950 mb-6">RERA Disclaimer & Regulatory Notice</h1>
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              PropTelangana is an authorized real estate facilitation portal. All property listings display corresponding TG-RERA project registration numbers issued by the Telangana Real Estate Regulatory Authority.
            </span>
          </div>

          <h2 className="text-lg font-bold text-navy-950">1. Information Accuracy</h2>
          <p>
            Project specifications, floor plans, elevations, and images displayed on PropTelangana are sourced directly from registered developers, brochures, and public RERA filings. Artistic renders are indicative and intended for visual reference only.
          </p>

          <h2 className="text-lg font-bold text-navy-950">2. Consumer Advisory</h2>
          <p>
            Prospective buyers are advised to independently verify all layout approvals (HMDA/DTCP/GHMC), environmental clearances, and financial escrow accounts on the official Telangana RERA website (<a href="https://rera.telangana.gov.in" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">rera.telangana.gov.in</a>) before entering into binding agreements.
          </p>
        </div>
      </div>
    </div>
  );
}
