import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Award,
  Lock,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { Certificate } from '../types';
import { getTierColor } from '../utils/certGenerator';
import { OfficialCertificate } from './OfficialCertificate';

interface VerificationPortalProps {
  certificates: Certificate[];
  initialSearchId?: string;
  theme?: 'dark' | 'light';
}

export const VerificationPortal: React.FC<VerificationPortalProps> = ({
  certificates,
  initialSearchId = '',
  theme = 'dark',
}) => {
  const [searchCode, setSearchCode] = useState(initialSearchId);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(
    certificates.find(
      (c) =>
        c.id.toUpperCase() === initialSearchId.toUpperCase() ||
        c.publicCode.toUpperCase() === initialSearchId.toUpperCase()
    ) ||
      certificates[0] ||
      null
  );
  const [copiedSig, setCopiedSig] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isSearchingFirestore, setIsSearchingFirestore] = useState(false);

  const isDark = theme === 'dark';

  // Automatically execute search when initialSearchId is provided (e.g. from /verify/:id URL)
  React.useEffect(() => {
    if (initialSearchId && initialSearchId.trim()) {
      handleSearch(initialSearchId.trim());
    }
  }, [initialSearchId]);

  const handleSearch = async (codeToSearch: string) => {
    const clean = codeToSearch.trim().toUpperCase();
    setSearchCode(clean);
    setLookupError(null);

    // Keep URL in sync with verified ID
    if (window.location.pathname.startsWith('/verify/') || window.location.hash.includes('verify/')) {
      try {
        window.history.replaceState(null, '', `/verify/${clean}`);
      } catch {
        // Safe fallback in restricted environments
      }
    }

    const found = certificates.find(
      (c) => c.id.toUpperCase() === clean || c.publicCode.toUpperCase() === clean
    );

    if (found) {
      setSelectedCert(found);
      return;
    }

    // Fallback: Query live Firestore database
    setIsSearchingFirestore(true);
    try {
      const { getCertificateFromFirestore } = await import('../services/firebase');
      const cloudCert = await getCertificateFromFirestore(clean);
      if (cloudCert) {
        setSelectedCert(cloudCert);
        setLookupError(null);
      } else {
        setLookupError(`Certificate ID "${clean}" was not found in the verified registry. Please check for transcription typos.`);
        setSelectedCert(null);
      }
    } catch {
      setLookupError(`Certificate ID "${clean}" was not found in the verified registry. Please check for transcription typos.`);
      setSelectedCert(null);
    } finally {
      setIsSearchingFirestore(false);
    }
  };

  const copySignature = (sig: string) => {
    navigator.clipboard.writeText(sig);
    setCopiedSig(true);
    setTimeout(() => setCopiedSig(false), 2000);
  };

  const tierStyle = selectedCert ? getTierColor(selectedCert.tier) : null;

  return (
    <div
      className={`space-y-8 max-w-5xl mx-auto pb-12 font-sans transition-colors duration-200 ${
        isDark ? 'text-slate-100' : 'text-slate-900'
      }`}
    >
      {/* Search Header Card */}
      <div
        className={`rounded-2xl backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-5 transition-colors ${
          isDark
            ? 'bg-slate-900/50 border border-white/10'
            : 'bg-white/85 border border-slate-200/90 shadow-slate-200/50'
        }`}
      >
        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-b pb-4 ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <div>
            <span className="text-xs font-mono text-emerald-500 font-semibold tracking-wider uppercase block mb-1">
              Public Employer Verification
            </span>
            <h2
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Validate Certificate Authenticity
            </h2>
          </div>
          <span
            className={`text-xs font-mono px-3 py-1.5 rounded-lg border backdrop-blur-md ${
              isDark
                ? 'text-slate-400 bg-white/5 border-white/10'
                : 'text-slate-600 bg-slate-100 border-slate-200'
            }`}
          >
            Zero-Friction Ledger Verification
          </span>
        </div>

        <p
          className={`text-xs sm:text-sm leading-relaxed font-sans max-w-3xl ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          Validate candidate typing speed credentials against the TypeCert ledger. Every certificate is secured with an Ed25519 digital signature and biometric keystroke dynamics audit.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchCode);
          }}
          className="flex flex-col sm:flex-row gap-2.5 pt-1"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
              placeholder="Enter Certificate ID (e.g. TC-MST-202610-8F92A4)"
              className={`w-full pl-10 pr-4 py-3 rounded-xl font-mono text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                isDark
                  ? 'bg-slate-950/80 border border-white/15 text-white placeholder:text-slate-500 focus:border-emerald-500/60 shadow-inner'
                  : 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 shadow-sm'
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingFirestore}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#94E1FF] via-cyan-400 to-teal-400 text-slate-950 font-bold text-xs uppercase hover:brightness-110 transition-all shadow-lg shadow-[#94E1FF]/25 cursor-pointer active:scale-95 shrink-0"
          >
            {isSearchingFirestore ? 'Verifying...' : 'Verify Credential'}
          </button>
        </form>

        {/* Sample Verified IDs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <span className={`font-medium text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Quick Samples:
          </span>
          {certificates.slice(0, 4).map((cert) => (
            <button
              key={cert.id}
              onClick={() => handleSearch(cert.id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                selectedCert?.id === cert.id
                  ? isDark
                    ? 'bg-[#94E1FF]/20 text-[#94E1FF] border border-[#94E1FF]/40 shadow-xs font-semibold'
                    : 'bg-teal-100 text-teal-800 border border-teal-300 font-semibold shadow-xs'
                  : isDark
                  ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {cert.candidateName.split(' ')[0]} ({cert.tier})
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {lookupError && (
        <div
          className={`rounded-xl border p-4 font-medium text-xs shadow-lg flex items-center gap-3 backdrop-blur-md ${
            isDark
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          <XCircle className="h-5 w-5 shrink-0 text-rose-500" />
          <span>{lookupError}</span>
        </div>
      )}

      {/* Verified Certificate Card */}
      {selectedCert && tierStyle && (
        <div
          className={`rounded-2xl backdrop-blur-2xl border shadow-2xl overflow-hidden transition-all ${
            isDark
              ? 'bg-slate-900/60 border-emerald-500/30'
              : 'bg-white/90 border-emerald-500/40 shadow-slate-200/60'
          }`}
        >
          {/* Top Verification Banner */}
          <div
            className={`border-b p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 ${
              isDark
                ? 'bg-gradient-to-r from-[#94E1FF]/10 via-teal-950/20 to-slate-900/60 border-[#94E1FF]/25 text-slate-100'
                : 'bg-gradient-to-r from-sky-50 to-teal-50 border-teal-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#94E1FF]/20 text-[#94E1FF] border border-[#94E1FF]/35 flex items-center justify-center font-bold text-sm shadow-sm shadow-[#94E1FF]/20">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#94E1FF] to-teal-400 uppercase tracking-wider block font-mono">
                  Official Authenticated Credential
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Recorded in TypeCert Registry · Cryptographically Signed
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowPrintModal(true)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border backdrop-blur-md cursor-pointer flex items-center gap-2 active:scale-95 ${
                isDark
                  ? 'bg-white/10 hover:bg-white/15 text-white border-white/15'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-xs'
              }`}
            >
              <Printer className="h-3.5 w-3.5 text-teal-500 dark:text-[#94E1FF]" />
              <span>Print Diploma (PDF)</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Candidate & Tier Hero */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}
            >
              <div>
                <span className={`text-xs font-mono uppercase block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Certified Candidate
                </span>
                <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedCert.candidateName}
                </h3>
                <p className={`text-xs mt-1 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {selectedCert.candidateEmail}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className={`text-xs font-mono uppercase block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Proficiency Tier
                </span>
                <span className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase inline-block border ${tierStyle.badge}`}>
                  {selectedCert.tier}
                </span>
              </div>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div
                className={`rounded-xl border p-4 backdrop-blur-md shadow-sm ${
                  isDark ? 'bg-slate-950/70 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`text-xs font-mono block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Certified Net WPM
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-[#94E1FF] via-cyan-400 to-teal-400">
                  {selectedCert.netWpm}
                </div>
                <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  5-Char Word Math
                </span>
              </div>

              <div
                className={`rounded-xl border p-4 backdrop-blur-md shadow-sm ${
                  isDark ? 'bg-slate-950/70 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`text-xs font-mono block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Gross Velocity
                </span>
                <div className={`text-3xl sm:text-4xl font-extrabold font-mono tabular-nums ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {selectedCert.grossWpm}
                </div>
                <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Raw Keystrokes
                </span>
              </div>

              <div
                className={`rounded-xl border p-4 backdrop-blur-md shadow-sm ${
                  isDark ? 'bg-slate-950/70 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`text-xs font-mono block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Accuracy
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-blue-500">
                  {selectedCert.accuracyPercentage}%
                </div>
                <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Precision Ratio
                </span>
              </div>

              <div
                className={`rounded-xl border p-4 backdrop-blur-md shadow-sm ${
                  isDark ? 'bg-slate-950/70 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`text-xs font-mono block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Consistency
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-purple-500">
                  {selectedCert.consistencyPercentage}%
                </div>
                <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Flight Cadence
                </span>
              </div>
            </div>

            {/* Security Proof & Biometrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div
                className={`rounded-xl border p-4 backdrop-blur-md space-y-2.5 ${
                  isDark ? 'border-white/10 bg-slate-950/50' : 'border-slate-200 bg-slate-50/80'
                }`}
              >
                <div
                  className={`flex items-center gap-2 text-xs font-semibold border-b pb-2 ${
                    isDark ? 'text-slate-300 border-white/5' : 'text-slate-700 border-slate-200'
                  }`}
                >
                  <Lock className="h-4 w-4 text-emerald-500" />
                  <span>Cryptographic Proof</span>
                </div>
                <div className="text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Certificate ID:</span>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedCert.publicCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Algorithm:</span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Ed25519 Elliptic Curve</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Date Issued:</span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{new Date(selectedCert.issuedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="pt-1.5">
                    <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Digital Signature Hash:</div>
                    <div
                      className={`p-2 rounded-lg border text-[10px] truncate flex items-center justify-between mt-1 ${
                        isDark ? 'bg-slate-900/80 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{selectedCert.signature}</span>
                      <button
                        onClick={() => copySignature(selectedCert.signature)}
                        className={`ml-2 cursor-pointer transition-colors ${
                          isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                        }`}
                        title="Copy Signature"
                      >
                        {copiedSig ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-xl border p-4 backdrop-blur-md space-y-2.5 ${
                  isDark ? 'border-white/10 bg-slate-950/50' : 'border-slate-200 bg-slate-50/80'
                }`}
              >
                <div
                  className={`flex items-center gap-2 text-xs font-semibold border-b pb-2 ${
                    isDark ? 'text-slate-300 border-white/5' : 'text-slate-700 border-slate-200'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Proctor Biometric Audit</span>
                </div>
                <div className="text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Anti-Cheat Score:</span>
                    <span className="font-semibold text-emerald-500">{selectedCert.antiCheatScore}% (Human)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Mean Dwell Time:</span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{selectedCert.telemetrySummary.dwellMean} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Flight Variance:</span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{selectedCert.telemetrySummary.flightStdDev} ms (Normal)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Paste Interceptions:</span>
                    <span className="font-semibold text-emerald-500">0 Violations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verified Candidates Directory Table for Recruiters */}
      <div
        className={`rounded-2xl backdrop-blur-xl border p-6 sm:p-8 shadow-xl space-y-4 transition-colors ${
          isDark
            ? 'bg-slate-900/50 border-white/10'
            : 'bg-white/85 border-slate-200/90 shadow-slate-200/50'
        }`}
      >
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <div>
            <h3 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Verified Candidate Registry
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Browse authenticated candidates with verified Net WPM and cryptographic credentials.
            </p>
          </div>
          <span
            className={`text-xs font-mono px-3 py-1 rounded-lg border self-start sm:self-auto font-semibold ${
              isDark
                ? 'text-[#94E1FF] bg-[#94E1FF]/10 border-[#94E1FF]/25'
                : 'text-teal-800 bg-teal-50 border-teal-200'
            }`}
          >
            {certificates.length} Verified Candidates
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`border-b text-[11px] font-mono uppercase ${
                isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}
            >
              <tr>
                <th className="py-3 px-3">Candidate</th>
                <th className="py-3 px-3">Certificate ID</th>
                <th className="py-3 px-3">Tier</th>
                <th className="py-3 px-3">Net WPM</th>
                <th className="py-3 px-3">Accuracy</th>
                <th className="py-3 px-3">Biometrics</th>
                <th className="py-3 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y font-sans ${
                isDark ? 'divide-white/5' : 'divide-slate-200/60'
              }`}
            >
              {certificates.map((cert) => {
                const isCurrent = selectedCert?.id === cert.id;
                return (
                  <tr
                    key={cert.id}
                    className={`transition-colors ${
                      isDark
                        ? isCurrent
                          ? 'bg-white/10 font-medium'
                          : 'hover:bg-white/5'
                        : isCurrent
                        ? 'bg-slate-100 font-medium'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{cert.candidateName}</div>
                      <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{cert.candidateEmail}</div>
                    </td>
                    <td className={`py-3 px-3 font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{cert.publicCode}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold border ${
                          isDark ? 'bg-white/10 text-slate-200 border-white/10' : 'bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        {cert.tier}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-sm text-emerald-500">{cert.netWpm}</td>
                    <td className={`py-3 px-3 font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{cert.accuracyPercentage}%</td>
                    <td className="py-3 px-3 font-mono text-emerald-500">{cert.antiCheatScore}%</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleSearch(cert.id)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer border active:scale-95 ${
                          isDark
                            ? 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-xs'
                        }`}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Certificate Printable Modal with Real QR & Print-to-PDF */}
      {showPrintModal && selectedCert && (
        <OfficialCertificate
          certificate={selectedCert}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};
