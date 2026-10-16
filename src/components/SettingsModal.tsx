import React from 'react';
import { UserProfile } from '../utils/storage';
import { SoundTheme, keyboardAudio } from '../utils/keyboardAudio';
import { Volume2, VolumeX, Sliders, ShieldAlert, X } from 'lucide-react';

interface SettingsModalProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  onUpdateProfile,
  onClose,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const handleSoundThemeChange = (newTheme: SoundTheme) => {
    keyboardAudio.setTheme(newTheme);
    onUpdateProfile({ soundTheme: newTheme, soundEnabled: newTheme !== 'muted' });
    keyboardAudio.playKeyClick();
  };

  const handleToggleSound = () => {
    const isEnabled = keyboardAudio.toggleSound();
    onUpdateProfile({ soundEnabled: isEnabled });
    if (isEnabled) keyboardAudio.playKeyClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md font-sans">
      <div
        className={`relative max-w-md w-full backdrop-blur-2xl rounded-2xl shadow-2xl p-6 space-y-6 animate-in zoom-in-95 transition-colors ${
          isDark
            ? 'bg-slate-900/90 border border-white/15 text-slate-100 shadow-black/50'
            : 'bg-white/95 border border-slate-200 text-slate-900 shadow-slate-300/50'
        }`}
      >
        <div className={`flex items-center justify-between pb-3.5 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2.5">
            <Sliders className="h-4 w-4 text-emerald-500" />
            <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Engine Preferences
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-white/10'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mechanical Switch Audio */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className={`text-xs font-semibold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Mechanical Switch Audio
              </span>
              <span className={`text-[11px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Web Audio API switch synthesizer
              </span>
            </div>
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border text-xs font-medium cursor-pointer transition-all active:scale-95 ${
                profile.soundEnabled
                  ? isDark
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : isDark
                  ? 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-800'
              }`}
            >
              {profile.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: 'cherry-blue', label: 'Cherry MX Blue', desc: 'Clicky' },
              { id: 'cherry-brown', label: 'Cherry MX Brown', desc: 'Tactile' },
              { id: 'typewriter', label: 'Typewriter', desc: 'Metallic Clack' },
              { id: 'muted', label: 'Muted', desc: 'Silent' },
            ].map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => handleSoundThemeChange(themeOption.id as SoundTheme)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all active:scale-95 ${
                  profile.soundTheme === themeOption.id
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs font-semibold'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs font-semibold'
                    : isDark
                    ? 'bg-slate-950/60 hover:bg-slate-950 text-slate-300 border-white/10 hover:border-white/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-xs">{themeOption.label}</div>
                <div className={`text-[10px] font-sans mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {themeOption.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Caret Style */}
        <div className={`space-y-2 pt-2 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <span className={`text-xs font-semibold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            Cursor Style
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { id: 'line', label: 'Line' },
              { id: 'block', label: 'Block' },
              { id: 'underline', label: 'Underline' },
            ].map((caret) => (
              <button
                key={caret.id}
                onClick={() => onUpdateProfile({ caretStyle: caret.id as any })}
                className={`py-2 rounded-xl border text-center cursor-pointer transition-all active:scale-95 ${
                  profile.caretStyle === caret.id
                    ? isDark
                      ? 'bg-white/15 text-white font-semibold border-white/25 shadow-xs'
                      : 'bg-slate-900 text-white font-semibold shadow-xs'
                    : isDark
                    ? 'bg-slate-950/60 hover:bg-slate-950 text-slate-400 border-white/10'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                }`}
              >
                {caret.label}
              </button>
            ))}
          </div>
        </div>

        {/* Strict Proctor Mode */}
        <div
          className={`p-3.5 rounded-xl border space-y-1.5 ${
            isDark
              ? 'border-white/10 bg-slate-950/50'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-emerald-500" />
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Strict Proctor Mode
              </span>
            </div>
            <input
              type="checkbox"
              checked={profile.strictProctorMode}
              onChange={(e) => onUpdateProfile({ strictProctorMode: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400 cursor-pointer"
            />
          </div>
          <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Records focus violations if the browser window loses focus or tabs are switched during an active test.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#94E1FF] via-cyan-400 to-teal-400 text-slate-950 font-bold text-xs uppercase hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#94E1FF]/25 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
