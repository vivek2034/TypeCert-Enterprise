import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Award,
  User as UserIcon,
  HelpCircle,
  Volume2,
  VolumeX,
  LogOut,
  Sliders,
  Sun,
  Moon,
  Menu,
  X,
  Check,
} from 'lucide-react';
import { keyboardAudio, SoundTheme } from '../utils/keyboardAudio';
import { UserProfile } from '../utils/storage';
import { User as FirebaseUser } from 'firebase/auth';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  certificateCount: number;
  profile: UserProfile;
  currentUser: FirebaseUser | null;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onSignInWithGoogle: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  certificateCount,
  profile,
  currentUser,
  theme,
  onToggleTheme,
  onOpenSettings,
  onSignInWithGoogle,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  // Close mobile drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { id: 'engine', label: 'Typing Test', shortLabel: 'Test', icon: Terminal },
    { id: 'portal', label: 'Verify Certificate', shortLabel: 'Verify', icon: Award, badge: `${certificateCount}` },
    { id: 'dashboard', label: 'My Dashboard', shortLabel: 'Dashboard', icon: UserIcon },
    { id: 'about', label: 'Standards & FAQ', shortLabel: 'FAQ', icon: HelpCircle },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl transition-colors duration-200 ${
        isDark
          ? 'bg-slate-950/80 border-b border-white/10 text-slate-100 shadow-md shadow-black/20'
          : 'bg-white/85 border-b border-slate-200/90 text-slate-900 shadow-sm shadow-slate-200/50'
      }`}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4 py-2.5 sm:py-3">
          {/* Zone 1: Wordmark & Brand Badge */}
          <button
            onClick={() => handleNavClick('engine')}
            className="flex items-center gap-2 sm:gap-2.5 text-left cursor-pointer group whitespace-nowrap shrink-0"
            aria-label="TypeCert Enterprise Home"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#94E1FF] via-cyan-400 to-teal-400 flex items-center justify-center shadow-md shadow-[#94E1FF]/30 group-hover:scale-105 transition-transform shrink-0">
              <span className="font-mono font-black text-slate-950 text-xs tracking-tighter">TC</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-base sm:text-lg font-bold tracking-tight transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                TypeCert
              </span>
              <span
                className={`hidden xs:inline-block text-[9px] sm:text-[10px] font-mono font-semibold tracking-wider uppercase px-1.5 py-0.2 rounded border ${
                  isDark
                    ? 'text-[#94E1FF] bg-[#94E1FF]/10 border-[#94E1FF]/25'
                    : 'text-teal-800 bg-teal-50 border-teal-200'
                }`}
              >
                Enterprise
              </span>
            </div>
          </button>

          {/* Zone 2: Desktop Navigation Links (Hidden on mobile/tablet) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 xl:px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? isDark
                        ? 'bg-gradient-to-r from-[#94E1FF]/15 via-teal-500/10 to-transparent text-white font-semibold border border-[#94E1FF]/30 shadow-xs'
                        : 'bg-slate-900 text-white font-semibold shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${
                      isActive ? (isDark ? 'text-[#94E1FF]' : 'text-[#94E1FF] dark:text-[#94E1FF]') : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.2 text-[10px] rounded font-mono font-semibold ${
                        isActive
                          ? isDark
                            ? 'bg-[#94E1FF]/20 text-[#94E1FF] border border-[#94E1FF]/35'
                            : 'bg-teal-500/20 text-teal-800'
                          : isDark
                          ? 'bg-white/10 text-slate-400'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Controls (Audio, Theme, Settings, Auth, Mobile Menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Audio Toggle Button */}
            <button
              onClick={() => {
                const isEnabled = keyboardAudio.toggleSound();
                if (isEnabled) keyboardAudio.playKeyClick();
              }}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                keyboardAudio.isEnabled()
                  ? isDark
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : isDark
                  ? 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-800'
              }`}
              title="Toggle Mechanical Keyboard Audio"
              aria-label="Toggle Keyboard Audio"
            >
              {keyboardAudio.isEnabled() ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              <span className="hidden xl:inline text-[11px] capitalize">
                {profile.soundTheme.replace('-', ' ')}
              </span>
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                isDark
                  ? 'bg-white/5 text-amber-300 border-white/10 hover:bg-white/10 hover:border-amber-400/40'
                  : 'bg-slate-100 text-amber-600 border-slate-200 hover:bg-slate-200 hover:border-amber-500/40'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark and Light Mode"
            >
              {isDark ? <Sun className="h-3.5 w-3.5 text-amber-300 animate-spin-slow" /> : <Moon className="h-3.5 w-3.5 text-slate-700" />}
              <span className="hidden xl:inline text-[11px] font-semibold">
                {isDark ? 'Light' : 'Dark'}
              </span>
            </button>

            {/* Settings button */}
            <button
              onClick={onOpenSettings}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                  : 'border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="Preferences & Audio Theme"
              aria-label="Open Settings"
            >
              <Sliders className="h-4 w-4" />
            </button>

            {/* Google Authentication (Visible on screens >= 640px) */}
            <div className="hidden sm:flex items-center">
              {currentUser ? (
                <div
                  className={`flex items-center gap-2 rounded-full pl-1.5 pr-2.5 py-1 border transition-colors ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="h-5 w-5 rounded-full border border-white/20"
                    />
                  ) : (
                    <div className="h-5 w-5 bg-slate-800 text-emerald-400 font-mono text-[10px] font-bold rounded-full flex items-center justify-center">
                      {(currentUser.displayName || 'C').charAt(0)}
                    </div>
                  )}
                  <span
                    className={`text-xs font-medium truncate max-w-[85px] md:max-w-[120px] ${
                      isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    {currentUser.displayName?.split(' ')[0] || currentUser.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={onSignOut}
                    className="text-slate-400 hover:text-red-400 p-0.5 cursor-pointer ml-0.5 transition-colors"
                    title="Sign Out"
                    aria-label="Sign out"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onSignInWithGoogle}
                  className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold text-xs rounded-lg transition-all shadow-xs cursor-pointer whitespace-nowrap active:scale-[0.98] ${
                    isDark
                      ? 'bg-white text-slate-950 hover:bg-slate-100'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile/Tablet Menu Hamburger Button (Hidden on desktop lg:hidden) */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`lg:hidden p-1.5 rounded-lg border transition-colors cursor-pointer ${
                mobileMenuOpen
                  ? isDark
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                    : 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : isDark
                  ? 'border-white/10 bg-white/5 text-slate-300 hover:text-white'
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:text-slate-900'
              }`}
              title="Open Navigation Menu"
              aria-label="Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Responsive Drawer Overlay */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-t py-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 ${
              isDark ? 'border-white/10 bg-slate-950/95' : 'border-slate-200 bg-white/95'
            }`}
          >
            {/* Nav Links Grid */}
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? isDark
                          ? 'bg-gradient-to-r from-[#94E1FF]/20 to-teal-500/15 text-[#94E1FF] font-semibold border border-[#94E1FF]/35 shadow-xs'
                          : 'bg-slate-900 text-white font-semibold'
                        : isDark
                        ? 'bg-slate-900/60 text-slate-300 border border-white/5 hover:bg-slate-800'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? (isDark ? 'text-[#94E1FF]' : 'text-teal-300') : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold shrink-0 ${
                          isDark ? 'bg-[#94E1FF]/20 text-[#94E1FF] border border-[#94E1FF]/30' : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Settings & Theme Bar in Drawer */}
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                isDark ? 'bg-slate-900/50 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Theme:</span>
                <button
                  onClick={onToggleTheme}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    isDark
                      ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                      : 'bg-white text-slate-800 border border-slate-300 shadow-xs'
                  }`}
                >
                  {isDark ? <Sun className="h-3 w-3 text-amber-300" /> : <Moon className="h-3 w-3 text-slate-700" />}
                  <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSettings();
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  isDark
                    ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Sliders className="h-3 w-3" />
                <span>Audio Preset</span>
              </button>
            </div>

            {/* Mobile Auth Button (Screens < 640px) */}
            <div className="sm:hidden pt-1 border-t border-white/5">
              {currentUser ? (
                <div
                  className={`flex items-center justify-between p-2.5 rounded-xl border ${
                    isDark ? 'bg-slate-900/60 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="User" className="h-6 w-6 rounded-full shrink-0" />
                    ) : (
                      <div className="h-6 w-6 bg-slate-800 text-emerald-400 font-mono text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                        {(currentUser.displayName || 'U').charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {currentUser.displayName || 'Signed In'}
                      </p>
                      <p className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onSignOut}
                    className="text-xs text-red-400 hover:text-red-300 font-medium px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 shrink-0 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={onSignInWithGoogle}
                  className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer shadow-sm ${
                    isDark
                      ? 'bg-white text-slate-950 hover:bg-slate-100'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign In with Google</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quick-switch tab bar for mobile/tablet horizontal glance */}
        <nav
          className={`flex lg:hidden overflow-x-auto py-1.5 border-t gap-1.5 no-scrollbar scroll-smooth ${
            isDark ? 'border-white/5' : 'border-slate-200/80'
          }`}
          aria-label="Mobile Navigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'bg-gradient-to-r from-[#94E1FF]/20 to-teal-500/15 text-[#94E1FF] font-semibold border border-[#94E1FF]/35 shadow-xs'
                      : 'bg-slate-900 text-white font-semibold shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`h-3 w-3 ${isActive ? (isDark ? 'text-[#94E1FF]' : 'text-teal-300') : 'text-slate-400'}`} />
                <span>{item.shortLabel || item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1 rounded ${
                      isActive
                        ? isDark
                          ? 'bg-[#94E1FF]/25 text-[#94E1FF]'
                          : 'bg-teal-500/30 text-teal-900'
                        : isDark
                        ? 'bg-white/10 text-slate-400'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
