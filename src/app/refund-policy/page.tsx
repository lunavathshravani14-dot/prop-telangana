import React from 'react';

export const metadata = {
  title: 'Refund & Cancellation Policy | PropTelangana',
  description: 'PropTelangana policy on advisory consultations, booking tokens, and cancellation terms.',
};

export default function RefundPolicyPage() {
  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-navy-950 mb-6">Refund & Cancellation Policy</h1>
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-lg font-bold text-navy-950">1. Free Consumer Advisory</h2>
          <p>
            PropTelangana provides free property advisory, website browsing, and complimentary chauffeur-driven site visit services to individual home buyers. We do not collect brokerage or consulting retainers from buyers.
          </p>
          <h2 className="text-lg font-bold text-navy-950">2. Developer Booking Advances & Cancellation</h2>
          <p>
            Any token advances or unit allotment deposits paid towards a builder project are governed strictly under the terms of the builder allotment letter and statutory Telangana Real Estate Regulatory Authority (TG-RERA) rules. Refunds for cancellations are processed according to the respective developer agreement.
          </p>
          <h2 className="text-lg font-bold text-navy-950">3. Inquiries</h2>
          <p>
            If you need assistance coordinating with a developer regarding cancellation or refund status, email us at <a href="mailto:jbinfra.sales25@gmail.com" className="text-brand-600 underline">jbinfra.sales25@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
