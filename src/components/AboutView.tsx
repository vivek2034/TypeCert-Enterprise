import React from 'react';
import { Award, Zap, ShieldCheck, CheckCircle2, ArrowRight, Lock, Target } from 'lucide-react';

interface AboutViewProps {
  onStartTest: () => void;
  onGoToPortal: () => void;
  theme?: 'dark' | 'light';
}

export const AboutView: React.FC<AboutViewProps> = ({ onStartTest, onGoToPortal, theme = 'dark' }) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`space-y-10 max-w-5xl mx-auto pb-16 font-sans transition-colors duration-200 ${
        isDark ? 'text-slate-100' : 'text-slate-900'
      }`}
    >
      {/* Hero Corporate Glass Card */}
      <div
        className={`rounded-2xl backdrop-blur-xl p-6 sm:p-10 shadow-xl relative overflow-hidden transition-colors ${
          isDark
            ? 'bg-slate-900/50 border border-white/10'
            : 'bg-white/85 border border-slate-200/90 shadow-slate-200/50'
        }`}
      >
        <div className="inline-block text-xs font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#94E1FF] to-teal-400 uppercase tracking-wider mb-2">
          Standardized Certification Authority
        </div>
        <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          TypeCert Enterprise Standards
        </h1>
        <p className={`mt-4 text-base sm:text-lg leading-relaxed max-w-3xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          TypeCert is an authenticated keyboard velocity and precision benchmarking authority. Engineered for software engineers, court transcribers, legal secretaries, and executive assistants who require verifiable proof of keyboard competency.
        </p>

        <div className="mt-8 flex flex-wrap gap-3.5">
          <button
            onClick={onStartTest}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#94E1FF] via-cyan-400 to-teal-400 text-slate-950 font-bold text-xs uppercase hover:brightness-110 transition-all shadow-lg shadow-[#94E1FF]/25 cursor-pointer active:scale-95"
          >
            <span>Take Certification Test</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={onGoToPortal}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-xs uppercase transition-all shadow-sm cursor-pointer backdrop-blur-md active:scale-95 border ${
              isDark
                ? 'bg-white/10 hover:bg-white/15 text-white border-white/15'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-xs'
            }`}
          >
            <span>Verify an ID</span>
          </button>
        </div>
      </div>

      {/* Math & Calculation Grid */}
      <div
        className={`rounded-2xl backdrop-blur-xl border p-6 sm:p-8 shadow-xl space-y-6 transition-colors ${
          isDark
            ? 'bg-slate-900/50 border-white/10'
            : 'bg-white/85 border-slate-200/90 shadow-slate-200/50'
        }`}
      >
        <div className={`border-b pb-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <span className="text-xs font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#94E1FF] to-teal-400 uppercase tracking-wider block mb-1">
            Standardized Formulas
          </span>
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            How Velocity is Calculated
          </h2>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            We adhere strictly to international clerical examination conventions. Natural words vary in length, so counting words naively produces inconsistent results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`rounded-xl border p-5 backdrop-blur-md space-y-3 ${
              isDark
                ? 'border-white/10 bg-slate-950/70'
                : 'border-slate-200 bg-slate-50/80 shadow-xs'
            }`}
          >
            <div className="text-xs font-mono font-semibold text-[#94E1FF] dark:text-[#94E1FF] uppercase">1. 5-Character Normalization</div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Standard Word Length</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Every 5 keystrokes (including letters, spaces, and punctuation) equals exactly 1 standard word.
            </p>
            <div
              className={`font-mono text-xs p-2.5 rounded-lg border ${
                isDark
                  ? 'bg-slate-900/90 text-emerald-300 border-white/10'
                  : 'bg-white text-emerald-800 border-emerald-200 shadow-xs'
              }`}
            >
              Words = Total Characters / 5
            </div>
          </div>

          <div
            className={`rounded-xl border p-5 backdrop-blur-md space-y-3 ${
              isDark
                ? 'border-white/10 bg-slate-950/70'
                : 'border-slate-200 bg-slate-50/80 shadow-xs'
            }`}
          >
            <div className="text-xs font-mono font-semibold text-cyan-500 uppercase">2. Raw Mechanical Velocity</div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Gross WPM (GWPM)</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Gross WPM measures pure mechanical finger speed before applying penalties for typographical errors.
            </p>
            <div
              className={`font-mono text-xs p-2.5 rounded-lg border ${
                isDark
                  ? 'bg-slate-900/90 text-cyan-300 border-white/10'
                  : 'bg-white text-cyan-800 border-cyan-200 shadow-xs'
              }`}
            >
              GWPM = (Characters / 5) / Minutes
            </div>
          </div>

          <div
            className={`rounded-xl border p-5 backdrop-blur-md space-y-3 ${
              isDark
                ? 'border-white/10 bg-slate-950/70'
                : 'border-slate-200 bg-slate-50/80 shadow-xs'
            }`}
          >
            <div className="text-xs font-mono font-semibold text-amber-500 uppercase">3. Certified Authority Metric</div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Net WPM (Certified)</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Every uncorrected typographical error remaining incurs a rigorous 1-word penalty (5 wasted keystrokes).
            </p>
            <div
              className={`font-mono text-xs p-2.5 rounded-lg border ${
                isDark
                  ? 'bg-slate-900/90 text-amber-300 border-white/10'
                  : 'bg-white text-amber-800 border-amber-200 shadow-xs'
              }`}
            >
              Net WPM = GWPM - (Errors / Minutes)
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl border p-4 text-xs font-mono space-y-1 ${
            isDark
              ? 'bg-slate-950/60 border-white/10 text-slate-300'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className={`font-semibold uppercase text-[11px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Accuracy Ratio Formula:
          </div>
          <div>Accuracy (%) = (Correct Characters Typed / Total Characters Typed) &times; 100</div>
        </div>
      </div>

      {/* Anti-Cheat & Authenticity Guarantee */}
      <div
        className={`rounded-2xl backdrop-blur-xl border p-6 sm:p-8 shadow-xl space-y-6 transition-colors ${
          isDark
            ? 'bg-slate-900/50 border-white/10'
            : 'bg-white/85 border-slate-200/90 shadow-slate-200/50'
        }`}
      >
        <div className={`border-b pb-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <span className="text-xs font-mono font-semibold text-purple-500 uppercase tracking-wider block mb-1">
            Proctor Security Guarantee
          </span>
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Why Employers Trust TypeCert
          </h2>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Unproctored typing websites can be easily bypassed with browser automation scripts or clipboard paste extensions. TypeCert runs active proctor biometrics to ensure verifiable human performance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className={`rounded-xl border p-5 backdrop-blur-md space-y-2 ${
              isDark
                ? 'border-white/10 bg-slate-950/70'
                : 'border-slate-200 bg-slate-50/80 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm">
              <ShieldCheck className="h-4 w-4" />
              <span>Biometric Keystroke Dynamics</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Human typing exhibits natural biometric cadence and flight time variance. Automated bots generate uniform intervals with zero standard deviation, which our engine detects and flags immediately.
            </p>
          </div>

          <div
            className={`rounded-xl border p-5 backdrop-blur-md space-y-2 ${
              isDark
                ? 'border-white/10 bg-slate-950/70'
                : 'border-slate-200 bg-slate-50/80 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2 text-purple-500 font-semibold text-sm">
              <Lock className="h-4 w-4" />
              <span>Ed25519 Cryptographic Signatures</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Each certificate is signed with an asymmetric cryptographic hash. Any unauthorized tampering with database records or parameters invalidates the signature instantly.
            </p>
          </div>

          <div
            className={`rounded-xl border p-5 backdrop-blur-md space-y-2 ${
              isDark
                ? 'border-white/10 bg-slate-950/70'
                : 'border-slate-200 bg-slate-50/80 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
              <Target className="h-4 w-4" />
              <span>Clipboard Shield & Focus Guard</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Clipboard paste operations, synthetic script events, and browser window defocus are intercepted and recorded as infractions.
            </p>
          </div>

          <div
            className={`rounded-xl border p-5 backdrop-blur-md space-y-2 ${
              isDark
                ? 'border-white/10 bg-slate-950/70'
                : 'border-slate-200 bg-slate-50/80 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2 text-cyan-500 font-semibold text-sm">
              <Award className="h-4 w-4" />
              <span>Public Verification Ledger</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Employers, recruiters, and HR teams can enter any candidate Certificate ID into the public verification ledger to immediately view proctored test session metrics and credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
