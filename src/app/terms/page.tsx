import React from 'react';

export const metadata = {
  title: 'Terms of Service | PropTelangana',
  description: 'Terms and conditions for utilizing the PropTelangana real estate discovery platform.',
};

export default function TermsPage() {
  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-navy-950 mb-6">Terms of Service</h1>
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <p>
            By accessing PropTelangana.com, you agree to be bound by these Terms of Service and applicable Telangana real estate laws.
          </p>
          <h2 className="text-lg font-bold text-navy-950">1. Platform Nature</h2>
          <p>
            PropTelangana functions as an informational and facilitation portal for verified properties. All transactional sale agreements, deed registrations, and financial payments are executed directly between the purchaser and the respective developer or title holder.
          </p>
          <h2 className="text-lg font-bold text-navy-950">2. Accuracy of Project Details</h2>
          <p>
            While PropTelangana validates TG-RERA and layout approvals, buyers are encouraged to verify sanctioned plans and legal title search reports prior to disbursing booking advances.
          </p>
          <h2 className="text-lg font-bold text-navy-950">3. User Conduct</h2>
          <p>
            Users agree not to submit fraudulent contact information, scrape listing data without express authorization, or misuse site forms for unsolicited commercial communications.
          </p>
        </div>
      </div>
    </div>
  );
}
