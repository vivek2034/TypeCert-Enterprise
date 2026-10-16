import React, { useState } from 'react';
import { Certificate } from '../types';
import { TestHistoryEntry, UserProfile } from '../utils/storage';
import {
  Award,
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck,
  Copy,
  Check,
  Plus,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface CandidateDashboardProps {
  certificates: Certificate[];
  history: TestHistoryEntry[];
  profile: UserProfile;
  currentUser?: FirebaseUser | null;
  theme?: 'dark' | 'light';
  onSignInWithGoogle?: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onStartTest: () => void;
  onGoToPortalWithId: (id: string) => void;
  onViewOfficialCertificate: (cert: Certificate) => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({
  certificates,
  history,
  profile,
  currentUser,
  theme = 'dark',
  onSignInWithGoogle,
  onUpdateProfile,
  onStartTest,
  onGoToPortalWithId,
  onViewOfficialCertificate,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editTitle, setEditTitle] = useState(profile.title);

  const isDark = theme === 'dark';

  const bestWpm = history.length > 0 ? Math.max(...history.map((h) => h.netWpm)) : 0;
  const avgAccuracy = history.length > 0
    ? (history.reduce((acc, h) => acc + h.accuracy, 0) / history.length).toFixed(1)
    : '0.0';
  const totalDurationMin = Math.round(
    history.reduce((acc, h) => acc + h.durationSeconds, 0) / 60
  );

  const copyVerifyLink = (id: string) => {
    navigator.clipboard.writeText(`https://typecert.org/verify/${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveProfile = () => {
    onUpdateProfile({ name: editName, title: editTitle });
    setIsEditingProfile(false);
  };

  return (
    <div
      className={`space-y-8 max-w-5xl mx-auto pb-12 font-sans transition-colors duration-200 ${
        isDark ? 'text-slate-100' : 'text-slate-900'
      }`}
    >
      {/* Top Profile Banner */}
      <div
        className={`rounded-2xl backdrop-blur-xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors ${
          isDark
            ? 'bg-slate-900/50 border border-white/10'
            : 'bg-white/85 border border-slate-200/90 shadow-slate-200/50'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`h-16 w-16 rounded-2xl font-mono font-bold text-2xl flex items-center justify-center border shadow-inner ${
              isDark
                ? 'bg-gradient-to-tr from-[#94E1FF]/20 via-teal-500/20 to-slate-800 text-[#94E1FF] border-[#94E1FF]/25'
                : 'bg-gradient-to-tr from-[#94E1FF]/30 via-teal-100 to-slate-100 text-teal-800 border-teal-200'
            }`}
          >
            {profile.name.slice(0, 2).toUpperCase()}
          </div>

          <div>
            {!isEditingProfile ? (
              <>
                <div className="flex items-center gap-2">
                  <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {profile.name}
                  </h2>
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className={`text-xs underline cursor-pointer ${
                      isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Edit
                  </button>
                </div>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{profile.title}</p>
                <div className={`flex items-center gap-2 mt-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span className="flex items-center gap-1 text-teal-500 dark:text-[#94E1FF] font-medium">
                    <ShieldCheck className="h-3.5 w-3.5" /> Biometrics Authenticated
                  </span>
                  <span>·</span>
                  <span>{certificates.length} Credentials Minted</span>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm block focus:outline-none focus:border-emerald-500 ${
                    isDark
                      ? 'bg-slate-950 border border-white/15 text-white'
                      : 'bg-white border border-slate-300 text-slate-900'
                  }`}
                  placeholder="Full name"
                />
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm block focus:outline-none focus:border-emerald-500 ${
                    isDark
                      ? 'bg-slate-950 border border-white/15 text-white'
                      : 'bg-white border border-slate-300 text-slate-900'
                  }`}
                  placeholder="Professional title"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleSaveProfile}
                    className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-semibold cursor-pointer hover:bg-emerald-400"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${
                      isDark
                        ? 'bg-white/10 text-slate-300 border-white/10'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onStartTest}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#94E1FF] via-cyan-400 to-teal-400 text-slate-950 font-bold text-xs uppercase hover:brightness-110 transition-all shadow-lg shadow-[#94E1FF]/25 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Take Certification Test</span>
        </button>
      </div>

      {/* Cloud Sync Callout for Guest Users */}
      {!currentUser && onSignInWithGoogle && (
        <div
          className={`rounded-2xl border p-4 sm:p-5 shadow-lg backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isDark
              ? 'bg-gradient-to-r from-[#94E1FF]/10 via-teal-950/30 to-slate-900/60 border-[#94E1FF]/25'
              : 'bg-gradient-to-r from-sky-50 to-teal-50 border-teal-200'
          }`}
        >
          <div>
            <h4 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Sync Your Credentials Across Devices
            </h4>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Sign in with Google to synchronize your certificates in Firebase Firestore and share tamper-proof verification links with employers.
            </p>
          </div>
          <button
            onClick={onSignInWithGoogle}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all shadow-sm cursor-pointer shrink-0 active:scale-95 ${
              isDark
                ? 'bg-white text-slate-950 hover:bg-slate-100'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <span>Sign in with Google</span>
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          className={`p-4 rounded-2xl backdrop-blur-xl border flex flex-col justify-between shadow-lg transition-all ${
            isDark
              ? 'bg-slate-900/50 border-white/10 hover:border-white/20'
              : 'bg-white/85 border-slate-200/90 shadow-slate-200/50 hover:border-slate-300'
          }`}
        >
          <div className={`text-xs font-medium flex items-center justify-between mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Personal Best</span>
            <Zap className="h-3.5 w-3.5 text-[#94E1FF]" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-[#94E1FF] via-cyan-400 to-teal-400 mt-1">
            {bestWpm} <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>WPM</span>
          </div>
          <div className={`text-[10px] font-mono mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Certified Net Speed</div>
        </div>

        <div
          className={`p-4 rounded-2xl backdrop-blur-xl border flex flex-col justify-between shadow-lg transition-all ${
            isDark
              ? 'bg-slate-900/50 border-white/10 hover:border-white/20'
              : 'bg-white/85 border-slate-200/90 shadow-slate-200/50 hover:border-slate-300'
          }`}
        >
          <div className={`text-xs font-medium flex items-center justify-between mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Avg Accuracy</span>
            <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div className={`text-3xl sm:text-4xl font-extrabold font-mono tabular-nums mt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {avgAccuracy}%
          </div>
          <div className={`text-[10px] font-mono mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Character Precision</div>
        </div>

        <div
          className={`p-4 rounded-2xl backdrop-blur-xl border flex flex-col justify-between shadow-lg transition-all ${
            isDark
              ? 'bg-slate-900/50 border-white/10 hover:border-white/20'
              : 'bg-white/85 border-slate-200/90 shadow-slate-200/50 hover:border-slate-300'
          }`}
        >
          <div className={`text-xs font-medium flex items-center justify-between mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Tests Taken</span>
            <Award className="h-3.5 w-3.5 text-purple-500" />
          </div>
          <div className={`text-3xl sm:text-4xl font-extrabold font-mono tabular-nums mt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {history.length}
          </div>
          <div className={`text-[10px] font-mono mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Sessions Completed</div>
        </div>

        <div
          className={`p-4 rounded-2xl backdrop-blur-xl border flex flex-col justify-between shadow-lg transition-all ${
            isDark
              ? 'bg-slate-900/50 border-white/10 hover:border-white/20'
              : 'bg-white/85 border-slate-200/90 shadow-slate-200/50 hover:border-slate-300'
          }`}
        >
          <div className={`text-xs font-medium flex items-center justify-between mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Time Typed</span>
            <Clock className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className={`text-3xl sm:text-4xl font-extrabold font-mono tabular-nums mt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {totalDurationMin} <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>min</span>
          </div>
          <div className={`text-[10px] font-mono mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Benchmark Time</div>
        </div>
      </div>

      {/* Certificate Wallet */}
      <div
        className={`rounded-2xl backdrop-blur-xl border p-6 sm:p-8 shadow-xl space-y-4 transition-colors ${
          isDark
            ? 'bg-slate-900/50 border-white/10'
            : 'bg-white/85 border-slate-200/90 shadow-slate-200/50'
        }`}
      >
        <div className={`border-b pb-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <h3 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Earned Certificates Wallet
          </h3>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Verifiable credentials you can copy to LinkedIn, resume, or ATS job applications.
          </p>
        </div>

        {certificates.length === 0 ? (
          <div
            className={`text-center py-10 rounded-xl border border-dashed ${
              isDark ? 'border-white/10 bg-slate-950/40 text-slate-400' : 'border-slate-300 bg-slate-50 text-slate-500'
            }`}
          >
            <p className="text-xs font-medium">No certificates minted yet.</p>
            <button
              onClick={onStartTest}
              className={`mt-3 px-4 py-2 rounded-xl font-medium text-xs transition-all cursor-pointer border ${
                isDark
                  ? 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-xs'
              }`}
            >
              Take First Test
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className={`rounded-xl border p-5 backdrop-blur-md space-y-3.5 transition-all shadow-md ${
                  isDark
                    ? 'border-white/10 bg-slate-950/70 hover:border-white/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-slate-200/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 uppercase">
                        {cert.tier}
                      </span>
                      <span className="text-sm font-bold font-mono text-emerald-500">
                        {cert.netWpm} Net WPM
                      </span>
                    </div>
                    <h4 className={`text-sm font-mono font-semibold mt-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{cert.publicCode}</h4>
                    <p className={`text-[11px] font-mono mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Issued {new Date(cert.issuedAt).toLocaleDateString()} · {cert.durationSeconds}s Standard
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-mono block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Accuracy</span>
                    <span className={`text-sm font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{cert.accuracyPercentage}%</span>
                  </div>
                </div>

                <div className={`pt-3 border-t flex items-center justify-between gap-2 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                  <button
                    onClick={() => onViewOfficialCertificate(cert)}
                    className={`flex items-center gap-1.5 text-xs cursor-pointer transition-colors ${
                      isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Printer className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Print PDF</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyVerifyLink(cert.publicCode)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all cursor-pointer flex items-center gap-1 ${
                        isDark
                          ? 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      {copiedId === cert.publicCode ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onGoToPortalWithId(cert.publicCode)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all cursor-pointer flex items-center gap-1 font-semibold ${
                        isDark
                          ? 'bg-gradient-to-r from-[#94E1FF]/20 to-teal-500/15 text-[#94E1FF] border-[#94E1FF]/30 hover:brightness-110'
                          : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
                      }`}
                    >
                      <span>Verify</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Test History Log */}
      <div
        className={`rounded-2xl backdrop-blur-xl border p-6 sm:p-8 shadow-xl space-y-4 transition-colors ${
          isDark
            ? 'bg-slate-900/50 border-white/10'
            : 'bg-white/85 border-slate-200/90 shadow-slate-200/50'
        }`}
      >
        <h3 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Benchmark Attempt History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`border-b text-[11px] font-mono uppercase ${
                isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}
            >
              <tr>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Net WPM</th>
                <th className="py-3 px-3">Gross</th>
                <th className="py-3 px-3">Accuracy</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Biometrics</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y font-sans ${
                isDark ? 'divide-white/5' : 'divide-slate-200/60'
              }`}
            >
              {history.map((h) => (
                <tr
                  key={h.id}
                  className={`transition-colors ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className={`py-3 px-3 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{new Date(h.date).toLocaleDateString()}</td>
                  <td className={`py-3 px-3 font-medium capitalize ${isDark ? 'text-white' : 'text-slate-900'}`}>{h.category}</td>
                  <td className="py-3 px-3 font-mono font-bold text-sm text-emerald-500">{h.netWpm}</td>
                  <td className={`py-3 px-3 font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{h.grossWpm}</td>
                  <td className={`py-3 px-3 font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{h.accuracy}%</td>
                  <td className={`py-3 px-3 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{h.durationSeconds}s</td>
                  <td className="py-3 px-3 font-mono text-emerald-500">{h.antiCheatScore}%</td>
                  <td className="py-3 px-3 text-right">
                    {h.certificateId ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 uppercase">
                        Certified
                      </span>
                    ) : (
                      <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Practice</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
