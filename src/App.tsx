import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TypingEngine } from './components/TypingEngine';
import { VerificationPortal } from './components/VerificationPortal';
import { CandidateDashboard } from './components/CandidateDashboard';
import { AboutView } from './components/AboutView';
import { OfficialCertificate } from './components/OfficialCertificate';
import { SettingsModal } from './components/SettingsModal';
import { Certificate } from './types';
import {
  getStoredCertificates,
  saveCertificate,
  getStoredHistory,
  getStoredProfile,
  saveProfile,
  UserProfile,
  TestHistoryEntry,
} from './utils/storage';
import { keyboardAudio } from './utils/keyboardAudio';
import {
  auth,
  signInWithGoogle,
  signOutUser,
  saveCertificateToFirestore,
  getPublicCertificatesFromFirestore,
  getUserSessionsFromFirestore,
} from './services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('engine');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [history, setHistory] = useState<TestHistoryEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile());
  const [theme, setTheme] = useState<'dark' | 'light'>(profile.theme || 'dark');
  const [portalSearchId, setPortalSearchId] = useState<string>('TC-MST-202610-8F92A4');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  // Modals
  const [viewingCert, setViewingCert] = useState<Certificate | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Sync theme with HTML document element and theme-color meta tag
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#080c14');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#f8fafc');
    }
  }, [theme]);

  // Initialize storage & auth listener
  useEffect(() => {
    const loadedCerts = getStoredCertificates();
    const loadedHistory = getStoredHistory();
    const loadedProfile = getStoredProfile();

    setCertificates(loadedCerts);
    setHistory(loadedHistory);
    setProfile(loadedProfile);
    if (loadedProfile.theme) setTheme(loadedProfile.theme);
    keyboardAudio.setTheme(loadedProfile.soundTheme);

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setProfile((prev) => {
          const updated = {
            ...prev,
            name: user.displayName || prev.name,
            email: user.email || prev.email,
          };
          saveProfile(updated);
          return updated;
        });

        try {
          const firestoreCerts = await getPublicCertificatesFromFirestore();
          if (firestoreCerts.length > 0) {
            setCertificates((prev) => {
              const combined = [...firestoreCerts, ...prev];
              return Array.from(new Map(combined.map((c) => [c.id, c])).values());
            });
          }

          const userSessions = await getUserSessionsFromFirestore(user.uid);
          if (userSessions.length > 0) {
            setHistory((prev) => {
              const combined = [...userSessions, ...prev];
              return Array.from(new Map(combined.map((s) => [s.id, s])).values());
            });
          }
        } catch (err) {
          console.warn('Initial cloud sync notice:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    const saved = saveProfile(updated);
    setProfile(saved);
    if (updated.theme) setTheme(updated.theme);
  };

  const handleToggleTheme = () => {
    const nextTheme: 'dark' | 'light' = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    handleUpdateProfile({ theme: nextTheme });
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google Sign-In failed:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error('Sign-Out failed:', err);
    }
  };

  const handleCertificateMinted = async (newCert: Certificate) => {
    const updated = saveCertificate(newCert);
    setCertificates(updated);
    setHistory(getStoredHistory());
    setPortalSearchId(newCert.id);

    if (currentUser) {
      try {
        await saveCertificateToFirestore(newCert);
      } catch (err) {
        console.warn('Could not save certificate to Firestore:', err);
      }
    }
  };

  const handleGoToPortalWithId = (id: string) => {
    setPortalSearchId(id);
    setActiveTab('portal');
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-colors duration-200 print:min-h-0 print:bg-white print:text-slate-900 print:p-0 print:m-0 print:overflow-visible ${
        isDark
          ? 'bg-[#080c14] text-slate-100 selection:bg-[#94E1FF]/25 selection:text-[#94E1FF]'
          : 'bg-[#f8fafc] text-slate-900 selection:bg-[#94E1FF]/35 selection:text-slate-900'
      }`}
    >
      {/* Ambient background glass gradients with #94E1FF calming ice-sky glow */}
      <div className="ambient-glow pointer-events-none fixed inset-0 z-0 overflow-hidden no-print print:hidden">
        {isDark ? (
          <>
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-[#94E1FF]/15 via-teal-500/10 to-transparent blur-3xl opacity-80" />
            <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-gradient-to-br from-[#94E1FF]/10 to-indigo-500/5 blur-3xl rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-[600px] h-[400px] bg-gradient-to-tr from-teal-500/10 to-[#94E1FF]/10 blur-3xl rounded-full" />
          </>
        ) : (
          <>
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-[#94E1FF]/25 via-teal-300/15 to-transparent blur-3xl opacity-75" />
            <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-gradient-to-br from-[#94E1FF]/15 to-sky-300/10 blur-3xl rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-[600px] h-[400px] bg-gradient-to-tr from-teal-200/15 to-[#94E1FF]/20 blur-3xl rounded-full" />
          </>
        )}
      </div>

      {/* Top Glass Navigation Bar with Responsive Drawer & Theme Toggle */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        certificateCount={certificates.length}
        profile={profile}
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setShowSettings(true)}
        onSignInWithGoogle={handleSignInWithGoogle}
        onSignOut={handleSignOut}
      />

      {/* Subtle Cloud Sync Status Banner */}
      {currentUser && (
        <div
          className={`relative z-10 border-b py-1.5 px-4 text-xs font-mono transition-colors no-print ${
            isDark
              ? 'bg-slate-900/60 backdrop-blur-md border-white/5 text-slate-300'
              : 'bg-white/80 backdrop-blur-md border-slate-200 text-slate-700'
          }`}
        >
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Synced with Firestore as {currentUser.email}</span>
            </span>
            <span
              className={`text-[11px] hidden sm:inline ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Real-time Database Sync Active
            </span>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 no-print">
        {activeTab === 'engine' && (
          <TypingEngine
            profile={profile}
            theme={theme}
            onOpenSettings={() => setShowSettings(true)}
            onCertificateMinted={handleCertificateMinted}
            onGoToPortalWithId={handleGoToPortalWithId}
            onViewOfficialCertificate={(cert) => setViewingCert(cert)}
          />
        )}

        {activeTab === 'portal' && (
          <VerificationPortal
            certificates={certificates}
            initialSearchId={portalSearchId}
            theme={theme}
          />
        )}

        {activeTab === 'dashboard' && (
          <CandidateDashboard
            certificates={certificates}
            history={history}
            profile={profile}
            currentUser={currentUser}
            theme={theme}
            onSignInWithGoogle={handleSignInWithGoogle}
            onUpdateProfile={handleUpdateProfile}
            onStartTest={() => setActiveTab('engine')}
            onGoToPortalWithId={handleGoToPortalWithId}
            onViewOfficialCertificate={(cert) => setViewingCert(cert)}
          />
        )}

        {activeTab === 'about' && (
          <AboutView
            theme={theme}
            onStartTest={() => setActiveTab('engine')}
            onGoToPortal={() => setActiveTab('portal')}
          />
        )}
      </main>

      {/* Official Certificate Presentation / Print Modal */}
      {viewingCert && (
        <OfficialCertificate
          certificate={viewingCert}
          theme={theme}
          onClose={() => setViewingCert(null)}
        />
      )}

      {/* Settings & Audio Modal */}
      {showSettings && (
        <SettingsModal
          profile={profile}
          theme={theme}
          onUpdateProfile={handleUpdateProfile}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Corporate Glassmorphism Footer with Human Search Anchor Links */}
      <footer
        className={`relative z-10 border-t py-10 mt-16 font-sans transition-colors ${
          isDark
            ? 'border-white/10 bg-slate-950/70 backdrop-blur-md text-slate-400'
            : 'border-slate-200/80 bg-white/70 backdrop-blur-md text-slate-600'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded bg-gradient-to-tr from-[#94E1FF] via-cyan-400 to-teal-400 flex items-center justify-center font-mono font-black text-slate-950 text-xs shadow-xs shadow-[#94E1FF]/20">
                TC
              </div>
              <span
                className={`font-semibold tracking-tight text-sm ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                TypeCert Enterprise
              </span>
              <span>—</span>
              <span className="text-xs">Standardized Typing Speed Test & Official Certification Authority</span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={() => setActiveTab('engine')}
                className="hover:underline cursor-pointer"
              >
                1-Minute Test
              </button>
              <span>·</span>
              <button
                onClick={() => setActiveTab('portal')}
                className="hover:underline cursor-pointer"
              >
                Verify ID
              </button>
              <span>·</span>
              <button
                onClick={() => setActiveTab('about')}
                className="hover:underline cursor-pointer"
              >
                WPM FAQ
              </button>
              <span>·</span>
              <button
                onClick={handleToggleTheme}
                className="hover:underline cursor-pointer text-emerald-500 font-medium"
              >
                {isDark ? 'Switch to Light' : 'Switch to Dark'}
              </button>
            </div>
          </div>

          <div
            className={`border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono ${
              isDark ? 'border-white/5 text-slate-500' : 'border-slate-200 text-slate-400'
            }`}
          >
            <div>
              © 2026 TypeCert Global Authority · Certified WPM & Keystroke Dynamics Proctoring
            </div>
            <div className="flex items-center gap-3">
              <span>Standard 5-Char Normalization</span>
              <span>·</span>
              <span>Ed25519 Cryptographic Signatures</span>
              <span>·</span>
              <span>Anti-Cheat Cadence Audit</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
