import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Certificate } from '../types';
import { ShieldCheck, Printer, X, Check, Copy } from 'lucide-react';

interface OfficialCertificateProps {
  certificate: Certificate;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const OfficialCertificate: React.FC<OfficialCertificateProps> = ({
  certificate,
  onClose,
  theme = 'dark',
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const verificationUrl = `https://type-cert-enterprise.vercel.app/verify/${certificate.publicCode}`;
  const isDark = theme === 'dark';

  // Ensure modal scrolls to the top upon opening
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.scrollTop = 0;
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    // Generate high-resolution QR code for razor-sharp paper printing
    QRCode.toDataURL(verificationUrl, {
      width: 256,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [verificationUrl]);

  // Manage print lifecycle: strip dark mode during print so paper/PDF outputs clean white diploma
  useEffect(() => {
    const handleBeforePrint = () => {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.classList.add('is-printing-certificate');
    };

    const handleAfterPrint = () => {
      document.body.classList.remove('is-printing-certificate');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [theme]);

  const handlePrint = () => {
    const root = document.documentElement;
    const wasDark = root.classList.contains('dark') || theme === 'dark';
    if (wasDark) {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    document.body.classList.add('is-printing-certificate');

    // Give browser paint engine 50ms to settle DOM before capturing print canvas
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.body.classList.remove('is-printing-certificate');
        if (wasDark) {
          root.classList.add('dark');
        }
      }, 300);
    }, 50);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md overflow-y-auto font-sans certificate-modal-overlay animate-in fade-in duration-200 print:static print:inset-auto print:bg-white print:p-0 print:m-0 print:overflow-visible print:backdrop-blur-none print:shadow-none print:border-none print:animate-none"
    >
      <div
        className={`relative max-w-4xl w-full my-2 sm:my-6 rounded-2xl shadow-2xl p-4 sm:p-8 animate-in zoom-in-95 transition-colors certificate-modal-wrapper print:static print:max-w-none print:w-full print:m-0 print:p-0 print:border-none print:shadow-none print:bg-white print:animate-none ${
          isDark
            ? 'bg-slate-900/95 border border-white/15 text-slate-100 shadow-black/60'
            : 'bg-white/95 border border-slate-200 text-slate-900 shadow-slate-300/60'
        }`}
      >
        {/* Sticky Top Control Bar (Never scrolled out of view, hidden during print) */}
        <div
          className={`sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 pt-2 border-b mb-6 gap-3 print-control-bar no-print print:hidden backdrop-blur-xl ${
            isDark
              ? 'border-white/10 bg-slate-900/95 text-slate-100'
              : 'border-slate-200 bg-white/95 text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border ${
                isDark
                  ? 'bg-[#94E1FF]/20 text-[#94E1FF] border-[#94E1FF]/30'
                  : 'bg-teal-100 text-teal-800 border-teal-300'
              }`}
            >
              Official Credential
            </span>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10">
              ID: {certificate.publicCode}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-3.5 py-2 font-medium text-xs rounded-xl border transition-all cursor-pointer backdrop-blur-md active:scale-95 ${
                isDark
                  ? 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/15'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Copy public verification URL"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-teal-500 dark:text-[#94E1FF]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Copied Link' : 'Share Link'}</span>
            </button>

            {/* Primary Print to PDF Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#94E1FF] via-cyan-400 to-teal-400 text-slate-950 font-bold text-xs uppercase hover:brightness-110 transition-all rounded-xl cursor-pointer shadow-md shadow-[#94E1FF]/25 active:scale-95"
              title="Print certificate or save as PDF"
            >
              <Printer className="h-4 w-4 text-slate-950" />
              <span>Print to PDF</span>
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                isDark
                  ? 'border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Close Modal"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Credential Sheet */}
        <div className="border-2 border-slate-300 rounded-xl p-6 sm:p-10 md:p-12 bg-[#fafaf8] text-slate-900 space-y-7 sm:space-y-8 text-center relative certificate-sheet shadow-xl print:m-0 print:w-full print:border-2 print:border-slate-800 print:bg-white print:shadow-none print:p-6 print:rounded-lg">
          {/* Subtle Guilloche Corner Accents */}
          <div className="absolute top-3 left-3 h-8 w-8 border-t-2 border-l-2 border-slate-700 pointer-events-none print:border-slate-900" />
          <div className="absolute top-3 right-3 h-8 w-8 border-t-2 border-r-2 border-slate-700 pointer-events-none print:border-slate-900" />
          <div className="absolute bottom-3 left-3 h-8 w-8 border-b-2 border-l-2 border-slate-700 pointer-events-none print:border-slate-900" />
          <div className="absolute bottom-3 right-3 h-8 w-8 border-b-2 border-r-2 border-slate-700 pointer-events-none print:border-slate-900" />

          {/* Header */}
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded text-xs font-mono font-bold uppercase tracking-widest print-bg-amber">
              TypeCert Global Authority
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-black uppercase text-slate-950 tracking-tight">
              Certificate of Keyboard Proficiency
            </h1>
            <p className="text-xs font-serif italic text-slate-700 max-w-lg mx-auto">
              This document officially certifies that the candidate has successfully demonstrated certified proctored keyboard velocity, mechanical precision, and biometric cadence consistency.
            </p>
          </div>

          {/* Candidate Name Presentation */}
          <div className="border-y-2 border-slate-300 py-4 space-y-1">
            <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider font-mono">
              This certifies that
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-black uppercase text-slate-950 tracking-tight">
              {certificate.candidateName}
            </h2>
            <div className="text-xs text-slate-600 font-mono font-semibold">{certificate.candidateEmail}</div>
          </div>

          {/* Certified Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
            <div className="border border-slate-300 bg-white p-3.5 rounded-lg shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-slate-950">{certificate.netWpm}</div>
              <div className="text-[10px] font-bold uppercase text-slate-700 mt-1">Certified Net WPM</div>
              <div className="text-[9px] text-slate-500">5-Char Word Standard</div>
            </div>

            <div className="border border-slate-300 bg-white p-3.5 rounded-lg shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-slate-950">{certificate.grossWpm}</div>
              <div className="text-[10px] font-bold uppercase text-slate-700 mt-1">Gross Velocity</div>
              <div className="text-[9px] text-slate-500">Raw Throughput</div>
            </div>

            <div className="border border-slate-300 bg-white p-3.5 rounded-lg shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-slate-950">{certificate.accuracyPercentage}%</div>
              <div className="text-[10px] font-bold uppercase text-slate-700 mt-1">Accuracy</div>
              <div className="text-[9px] text-slate-500">Precision Ratio</div>
            </div>

            <div className="border border-slate-300 bg-white p-3.5 rounded-lg shadow-sm">
              <div className="text-xl sm:text-2xl font-black text-slate-950 mt-1 uppercase">{certificate.tier}</div>
              <div className="text-[10px] font-bold uppercase text-slate-700 mt-1">Proficiency Tier</div>
              <div className="text-[9px] text-slate-500">{certificate.consistencyPercentage}% Consistency</div>
            </div>
          </div>

          {/* Footer: ID, Anti-Cheat Seal, and Real QR Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t-2 border-slate-300 items-center text-left font-mono">
            {/* Left: Certificate ID & Dates */}
            <div className="space-y-0.5">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Certificate ID</div>
              <div className="text-sm font-bold text-slate-950 underline">{certificate.publicCode}</div>
              <div className="text-[10px] text-slate-600 mt-1">
                Issued: <strong>{new Date(certificate.issuedAt).toLocaleDateString()}</strong>
              </div>
              <div className="text-[10px] text-slate-500">
                Expires: {new Date(certificate.expiresAt).toLocaleDateString()} (2-Year Expiry)
              </div>
            </div>

            {/* Middle: Biometric Integrity Stamp */}
            <div className="text-center border border-emerald-300 p-2.5 bg-emerald-50 rounded-lg shadow-xs print-bg-emerald">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase text-emerald-950">
                <ShieldCheck className="h-4 w-4 text-emerald-800" />
                <span>Biometrics Verified</span>
              </div>
              <div className="text-[10px] text-emerald-900 font-bold mt-0.5">
                {certificate.antiCheatScore}% Human Confidence
              </div>
              <div className="text-[9px] text-emerald-700 font-medium">
                Cadence Variance Confirmed · 0 Violations
              </div>
            </div>

            {/* Right: Dynamic High-Res QR Code */}
            <div className="flex items-center justify-end gap-3 text-right">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Scan to Verify</div>
                <div className="text-[10px] font-bold text-slate-950 underline">type-cert-enterprise.vercel.app</div>
                <div className="text-[8px] text-slate-500 truncate max-w-[110px] mt-0.5">
                  {certificate.signature.slice(0, 16)}...
                </div>
              </div>

              {/* Real QR Code Image */}
              <div className="p-1 border border-slate-300 bg-white rounded shrink-0">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`Verification QR Code for ${certificate.publicCode}`}
                    className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                  />
                ) : (
                  <div className="h-16 w-16 bg-slate-100 flex items-center justify-center text-[9px] text-slate-500">
                    Loading QR...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Secondary Action Bar (Hidden during print) */}
        <div
          className={`mt-6 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-mono no-print print:hidden ${
            isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>Official Proctored Diploma</span>
            <span>·</span>
            <span className="text-teal-600 dark:text-[#94E1FF] font-bold">Standard 8.5" x 11" Landscape Ready</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#94E1FF] via-cyan-400 to-teal-400 text-slate-950 font-bold text-xs uppercase rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Printer className="h-3.5 w-3.5 text-slate-950" />
              <span>Print to PDF</span>
            </button>
            <button
              onClick={onClose}
              className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                  : 'border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
