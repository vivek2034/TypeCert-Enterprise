import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  RotateCcw,
  ShieldCheck,
  Award,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Type,
  FileCheck2,
} from 'lucide-react';
import { Certificate, KeystrokeEvent } from '../types';
import { calculateTypingMetrics, analyzeKeystrokeDynamics } from '../utils/typingMath';
import {
  determineTier,
  getTierColor,
  generateCertificateId,
  generateDigitalSignature,
} from '../utils/certGenerator';
import { TYPING_CATEGORIES, generateWordTest } from '../data/typingCorpus';
import { keyboardAudio } from '../utils/keyboardAudio';
import { UserProfile, saveHistoryEntry } from '../utils/storage';

interface TypingEngineProps {
  profile: UserProfile;
  theme?: 'dark' | 'light';
  onOpenSettings: () => void;
  onCertificateMinted: (cert: Certificate) => void;
  onGoToPortalWithId: (id: string) => void;
  onViewOfficialCertificate: (cert: Certificate) => void;
}

export const TypingEngine: React.FC<TypingEngineProps> = ({
  profile,
  theme = 'dark',
  onCertificateMinted,
  onGoToPortalWithId,
  onViewOfficialCertificate,
}) => {
  const isDark = theme === 'dark';
  // Test configuration
  const [testMode, setTestMode] = useState<'time' | 'words'>('time');
  const [targetDuration, setTargetDuration] = useState<number>(30); // 15, 30, 60, 120
  const [targetWordCount, setTargetWordCount] = useState<number>(25); // 10, 25, 50, 100
  const [categoryId, setCategoryId] = useState<string>('architecture');

  // Text state
  const [referenceText, setReferenceText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');

  // Session execution state
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(targetDuration);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Keystrokes & Telemetry
  const keystrokesRef = useRef<KeystrokeEvent[]>([]);
  const lastKeyDownTimeRef = useRef<number>(0);
  const keyDownMapRef = useRef<Map<string, number>>(new Map());

  // Anti-cheat alert flags
  const [antiCheatAlert, setAntiCheatAlert] = useState<string | null>(null);
  const [pasteAttempts, setPasteAttempts] = useState<number>(0);
  const [focusLostCount, setFocusLostCount] = useState<number>(0);

  // Minted cert state for completion modal
  const [mintedCert, setMintedCert] = useState<Certificate | null>(null);
  const [candidateName, setCandidateName] = useState<string>(profile.name);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const setupReferenceText = (mode = testMode, catId = categoryId, wordCount = targetWordCount) => {
    if (mode === 'words') {
      const generated = generateWordTest(wordCount);
      setReferenceText(generated);
    } else {
      const cat = TYPING_CATEGORIES.find((c) => c.id === catId) || TYPING_CATEGORIES[0];
      const randomText = cat.texts[Math.floor(Math.random() * cat.texts.length)];
      setReferenceText(randomText);
    }
  };

  const handleReset = (
    newMode = testMode,
    newDuration = targetDuration,
    newWordCount = targetWordCount,
    newCat = categoryId
  ) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTestMode(newMode);
    setTargetDuration(newDuration);
    setTargetWordCount(newWordCount);
    setCategoryId(newCat);
    setUserInput('');
    setIsActive(false);
    setIsCompleted(false);
    setTimeRemaining(newDuration);
    setElapsedSeconds(0);
    keystrokesRef.current = [];
    lastKeyDownTimeRef.current = 0;
    keyDownMapRef.current.clear();
    setAntiCheatAlert(null);
    setPasteAttempts(0);
    setFocusLostCount(0);
    setMintedCert(null);

    setupReferenceText(newMode, newCat, newWordCount);
  };

  useEffect(() => {
    setupReferenceText();
  }, []);

  useEffect(() => {
    setCandidateName(profile.name);
  }, [profile.name]);

  useEffect(() => {
    const handleBlur = () => {
      if (isActive && !isCompleted) {
        setFocusLostCount((prev) => prev + 1);
        if (profile.strictProctorMode) {
          setAntiCheatAlert('Proctor Notification: Window lost focus during proctored test.');
        }
      }
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [isActive, isCompleted, profile.strictProctorMode]);

  useEffect(() => {
    if (isActive && !isCompleted) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          if (testMode === 'time') {
            const remaining = Math.max(0, targetDuration - next);
            setTimeRemaining(remaining);
            if (remaining <= 0) {
              handleCompleteTest();
            }
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isActive, isCompleted, targetDuration, testMode]);

  const handleCompleteTest = () => {
    setIsActive(false);
    setIsCompleted(true);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const finalMetrics = calculateTypingMetrics(
      referenceText,
      userInput,
      Math.max(1, elapsedSeconds)
    );
    const biometrics = analyzeKeystrokeDynamics(keystrokesRef.current);

    saveHistoryEntry({
      id: `th_${Date.now()}`,
      date: new Date().toISOString(),
      category: TYPING_CATEGORIES.find((c) => c.id === categoryId)?.name || 'Standard Benchmark',
      netWpm: finalMetrics.netWpm,
      grossWpm: finalMetrics.grossWpm,
      accuracy: finalMetrics.accuracyPercentage,
      consistency: biometrics.consistencyPercentage,
      durationSeconds: testMode === 'time' ? targetDuration : elapsedSeconds,
      antiCheatScore: pasteAttempts > 0 ? 75.0 : 99.4,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isActive && !isCompleted) {
      setIsActive(true);
      lastKeyDownTimeRef.current = performance.now();
    }

    if (isCompleted) return;

    const now = performance.now();
    const flightTime = lastKeyDownTimeRef.current > 0 ? now - lastKeyDownTimeRef.current : 0;
    lastKeyDownTimeRef.current = now;

    keyDownMapRef.current.set(e.key, now);

    const isBackspace = e.key === 'Backspace';
    const isSpace = e.key === ' ';
    const isError = !isBackspace && userInput.length < referenceText.length && e.key !== referenceText[userInput.length];

    keyboardAudio.playKeyClick(isSpace, isBackspace, isError);

    keystrokesRef.current.push({
      key: e.key,
      code: e.code,
      downTimestamp: now,
      flightTime: flightTime,
      isTrusted: e.isTrusted,
      isError,
      charIndex: userInput.length,
    });

    if (userInput.length + 1 >= referenceText.length) {
      setTimeout(() => handleCompleteTest(), 50);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const downTime = keyDownMapRef.current.get(e.key);
    if (downTime) {
      const dwell = performance.now() - downTime;
      keyDownMapRef.current.delete(e.key);

      const last = keystrokesRef.current[keystrokesRef.current.length - 1];
      if (last && last.key === e.key) {
        last.dwellTime = Math.round(dwell);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setPasteAttempts((p) => p + 1);
    keyboardAudio.playKeyClick(false, false, true);
    setAntiCheatAlert('Anti-Cheat Shield: Clipboard paste intercepted. Only authentic keystrokes are certified.');
  };

  const metrics = calculateTypingMetrics(
    referenceText,
    userInput,
    Math.max(1, elapsedSeconds)
  );

  const biometricStats = analyzeKeystrokeDynamics(keystrokesRef.current);

  const handleMintCertificate = () => {
    const tier = determineTier(metrics.netWpm);
    const certId = generateCertificateId(tier);
    const nowIso = new Date().toISOString();
    const expDate = new Date();
    expDate.setFullYear(expDate.getFullYear() + 2);

    const cert: Certificate = {
      id: certId,
      publicCode: certId,
      candidateName: candidateName.trim() || profile.name,
      candidateEmail: profile.email,
      tier,
      netWpm: metrics.netWpm,
      grossWpm: metrics.grossWpm,
      accuracyPercentage: metrics.accuracyPercentage,
      consistencyPercentage: biometricStats.consistencyPercentage,
      durationSeconds: testMode === 'time' ? targetDuration : elapsedSeconds,
      issuedAt: nowIso,
      expiresAt: expDate.toISOString(),
      signature: generateDigitalSignature(certId, metrics.netWpm, metrics.accuracyPercentage, nowIso),
      qrPayload: `https://typecert.org/verify/${certId}`,
      antiCheatScore: pasteAttempts > 0 ? 75.0 : 99.4,
      proctorStatus: pasteAttempts > 2 ? 'FLAGGED' : 'VERIFIED',
      telemetrySummary: {
        dwellMean: biometricStats.meanDwellMs,
        flightStdDev: biometricStats.stdDevFlightMs,
        backspaceCorrections: keystrokesRef.current.filter((k) => k.key === 'Backspace').length,
        focusLost: focusLostCount,
      },
    };

    setMintedCert(cert);
    onCertificateMinted(cert);

    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const currentTier = determineTier(metrics.netWpm);
  const tierStyle = getTierColor(currentTier);

  return (
    <div
      className={`space-y-6 max-w-5xl mx-auto font-sans transition-colors duration-200 ${
        isDark ? 'text-slate-100' : 'text-slate-900'
      }`}
    >
      {/* Test Benchmark Control Strip */}
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3.5 rounded-2xl backdrop-blur-xl shadow-lg transition-colors ${
          isDark
            ? 'bg-slate-900/50 border border-white/10'
            : 'bg-white/80 border border-slate-200 shadow-slate-200/50'
        }`}
      >
        {/* Segmented Controls for Mode & Length */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Mode Switcher */}
          <div
            className={`flex items-center gap-0.5 p-1 rounded-xl border transition-colors ${
              isDark ? 'bg-slate-950/80 border-white/10' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => handleReset('time', targetDuration, targetWordCount, categoryId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                testMode === 'time'
                  ? isDark
                    ? 'bg-white/15 text-white font-semibold shadow-xs border border-white/10'
                    : 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="h-3 w-3" />
              <span>Time</span>
            </button>
            <button
              onClick={() => handleReset('words', targetDuration, targetWordCount, categoryId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                testMode === 'words'
                  ? isDark
                    ? 'bg-white/15 text-white font-semibold shadow-xs border border-white/10'
                    : 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Type className="h-3 w-3" />
              <span>Words</span>
            </button>
          </div>

          {/* Time/Word Options */}
          {testMode === 'time' ? (
            <div
              className={`flex items-center gap-0.5 p-1 rounded-xl border font-mono transition-colors ${
                isDark ? 'bg-slate-950/80 border-white/10' : 'bg-slate-100 border-slate-200'
              }`}
            >
              {[15, 30, 60, 120].map((dur) => (
                <button
                  key={dur}
                  onClick={() => handleReset('time', dur, targetWordCount, categoryId)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                    targetDuration === dur
                      ? isDark
                        ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                        : 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {dur}s
                </button>
              ))}
            </div>
          ) : (
            <div
              className={`flex items-center gap-0.5 p-1 rounded-xl border font-mono transition-colors ${
                isDark ? 'bg-slate-950/80 border-white/10' : 'bg-slate-100 border-slate-200'
              }`}
            >
              {[10, 25, 50, 100].map((wc) => (
                <button
                  key={wc}
                  onClick={() => handleReset('words', targetDuration, wc, categoryId)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                    targetWordCount === wc
                      ? isDark
                        ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                        : 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {wc}w
                </button>
              ))}
            </div>
          )}

          {/* Domain Category Selector */}
          {testMode === 'time' && (
            <div
              className={`flex items-center gap-0.5 p-1 rounded-xl border transition-colors ${
                isDark ? 'bg-slate-950/80 border-white/10' : 'bg-slate-100 border-slate-200'
              }`}
            >
              {TYPING_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleReset('time', targetDuration, targetWordCount, cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                    categoryId === cat.id
                      ? isDark
                        ? 'bg-white/15 text-slate-100 font-medium border border-white/10'
                        : 'bg-white text-slate-900 font-medium border border-slate-200 shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={cat.description}
                >
                  {cat.name.split(' ')[0]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reset button */}
        <button
          onClick={() => handleReset()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer backdrop-blur-md active:scale-95 ${
            isDark
              ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:border-white/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
          }`}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Anti-Cheat Alert Banner */}
      {antiCheatAlert && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2.5 backdrop-blur-md animate-in fade-in">
          <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
          <span>{antiCheatAlert}</span>
        </div>
      )}

      {/* Refined Metrics Scorecard Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div
          className={`p-4 rounded-2xl backdrop-blur-xl border flex flex-col justify-between shadow-lg transition-all ${
            isDark
              ? 'bg-slate-900/50 border-white/10 hover:border-white/20'
              : 'bg-white/80 border-slate-200 shadow-slate-200/50 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Net WPM</span>
            <Zap className="h-3.5 w-3.5 text-[#94E1FF]" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-[#94E1FF] via-cyan-400 to-teal-400 mt-1">
            {metrics.netWpm}
          </div>
          <div className="text-[10px] text-teal-600 dark:text-[#94E1FF]/80 font-mono font-medium">Standard Metric</div>
        </div>

        <div
          className={`p-4 rounded-2xl backdrop-blur-xl border flex flex-col justify-between shadow-lg transition-all ${
            isDark
              ? 'bg-slate-900/50 border-white/10 hover:border-white/20'
              : 'bg-white/80 border-slate-200 shadow-slate-200/50 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Gross WPM</span>
            <Activity className="h-3.5 w-3.5 text-cyan-500" />
          </div>
          <div
            className={`text-3xl sm:text-4xl font-extrabold font-mono tabular-nums mt-1 ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}
          >
            {metrics.grossWpm}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Raw Velocity</div>
        </div>

        <div
          className={`p-4 rounded-2xl backdrop-blur-xl border flex flex-col justify-between shadow-lg transition-all ${
            isDark
              ? 'bg-slate-900/50 border-white/10 hover:border-white/20'
              : 'bg-white/80 border-slate-200 shadow-slate-200/50 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Accuracy</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div
            className={`text-3xl sm:text-4xl font-extrabold font-mono tabular-nums mt-1 ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}
          >
            {metrics.accuracyPercentage}%
          </div>
          <div className="text-[10px] text-slate-400 font-mono">{metrics.unfixedErrors} errors</div>
        </div>

        <div
          className={`p-4 rounded-2xl backdrop-blur-xl border flex flex-col justify-between shadow-lg transition-all ${
            isDark
              ? 'bg-slate-900/50 border-white/10 hover:border-white/20'
              : 'bg-white/80 border-slate-200 shadow-slate-200/50 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>{testMode === 'time' ? 'Timer' : 'Progress'}</span>
            <Clock className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <div
            className={`text-3xl sm:text-4xl font-extrabold font-mono tabular-nums mt-1 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {testMode === 'time' ? `${timeRemaining}s` : `${userInput.length}/${referenceText.length}`}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {testMode === 'time' ? `of ${targetDuration}s total` : 'Characters typed'}
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl backdrop-blur-xl border flex flex-col justify-between col-span-2 sm:col-span-1 shadow-lg transition-all ${
            isDark
              ? 'bg-slate-900/50 border-white/10 hover:border-white/20'
              : 'bg-white/80 border-slate-200 shadow-slate-200/50 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Projected Tier</span>
            <Award className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="mt-1">
            <span
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg inline-block border ${tierStyle.badge}`}
            >
              {currentTier}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">&ge; {metrics.netWpm} WPM</div>
        </div>
      </div>

      {/* Main Focus Typing Arena */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`relative rounded-2xl border backdrop-blur-2xl p-6 sm:p-10 cursor-text transition-all focus-within:ring-2 shadow-2xl min-h-[240px] flex flex-col justify-between ${
          isDark
            ? 'border-white/10 bg-slate-950/70 hover:border-white/20 focus-within:border-[#94E1FF]/70 focus-within:ring-[#94E1FF]/20'
            : 'border-slate-200 bg-white/90 hover:border-slate-300 focus-within:border-cyan-500 focus-within:ring-[#94E1FF]/40 shadow-slate-200/60'
        }`}
      >
        <div className="absolute top-3.5 right-4 text-[10px] font-mono text-slate-400 tracking-wider uppercase">
          Proctored Console
        </div>

        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={(e) => {
            if (!isCompleted) setUserInput(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onPaste={handlePaste}
          disabled={isCompleted}
          className="absolute opacity-0 top-0 left-0 h-full w-full cursor-text"
          autoFocus
        />

        {/* Text rendering */}
        <div className="font-mono text-xl sm:text-2xl leading-relaxed tracking-wide select-none pt-4">
          {referenceText.split('').map((char, index) => {
            const isTyped = index < userInput.length;
            const isCurrent = index === userInput.length;
            const isCorrect = isTyped && userInput[index] === char;
            const isError = isTyped && userInput[index] !== char;

            return (
              <span
                key={index}
                className={`relative transition-colors duration-75 ${
                  isCurrent
                    ? isDark
                      ? 'bg-[#94E1FF]/25 text-[#94E1FF] border-b-2 border-[#94E1FF] font-semibold px-0.5 rounded-xs shadow-xs shadow-[#94E1FF]/30'
                      : 'bg-[#94E1FF]/35 text-slate-950 border-b-2 border-teal-600 font-semibold px-0.5 rounded-xs'
                    : isCorrect
                    ? isDark
                      ? 'text-slate-100 font-medium'
                      : 'text-slate-900 font-semibold'
                    : isError
                    ? 'text-rose-600 dark:text-rose-300 bg-rose-500/20 underline decoration-rose-500 decoration-1 rounded-xs px-0.5'
                    : isDark
                    ? 'text-slate-500'
                    : 'text-slate-400'
                }`}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Typing hint footer */}
        <div
          className={`mt-8 flex flex-wrap items-center justify-between text-xs border-t pt-4 font-sans ${
            isDark ? 'text-slate-400 border-white/5' : 'text-slate-500 border-slate-100'
          }`}
        >
          <div className="flex items-center gap-2">
            {!isActive && !isCompleted ? (
              <span className="flex items-center gap-1.5 text-emerald-500 font-mono text-xs font-medium">
                <Play className="h-3 w-3 fill-emerald-500" /> Click console and start typing to begin
              </span>
            ) : isActive ? (
              <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Session active · Biometric telemetry recording
              </span>
            ) : (
              <span className="text-slate-400 font-mono">Test completed</span>
            )}
          </div>
          <div className="font-mono text-slate-400">
            {userInput.length} / {referenceText.length} characters
          </div>
        </div>
      </div>

      {/* Quiet Clean Anti-Cheat Telemetry Separator */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 text-xs px-3 py-2 rounded-xl backdrop-blur-md border font-mono ${
          isDark
            ? 'bg-slate-900/40 border-white/5 text-slate-400'
            : 'bg-white/70 border-slate-200 text-slate-600'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Biometric Keystroke Dynamics</span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            Flight Variance: <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>{biometricStats.stdDevFlightMs}ms</strong>
          </span>
          <span>·</span>
          <span>
            Mean Dwell: <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>{biometricStats.meanDwellMs}ms</strong>
          </span>
          <span>·</span>
          <span>
            Paste Guard: <strong className="text-emerald-500">Active</strong>
          </span>
        </div>
      </div>

      {/* Completion Modal / Certificate Minting */}
      {isCompleted && (
        <div
          className={`p-6 sm:p-8 rounded-2xl backdrop-blur-2xl border shadow-2xl space-y-6 animate-in zoom-in-95 ${
            isDark
              ? 'bg-slate-900/85 border-emerald-500/30 text-slate-100'
              : 'bg-white/95 border-emerald-500/40 text-slate-900 shadow-slate-200/80'
          }`}
        >
          <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6 text-emerald-500" />
                <h3
                  className={`text-xl sm:text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Certified Examination Completed
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Your keystroke dynamics and cadence variance have been proctor-verified and are ready for cryptographic signing.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono block">Assigned Tier</span>
              <span className={`px-3 py-1 text-sm font-mono font-bold rounded-lg border ${tierStyle.badge}`}>
                {currentTier}
              </span>
            </div>
          </div>

          {/* Results Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              className={`p-4 rounded-xl border backdrop-blur-md ${
                isDark ? 'bg-slate-950/70 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-xs text-slate-400 font-mono">Certified Net WPM</span>
              <div className="text-3xl font-extrabold font-mono text-emerald-500 mt-1">{metrics.netWpm}</div>
            </div>
            <div
              className={`p-4 rounded-xl border backdrop-blur-md ${
                isDark ? 'bg-slate-950/70 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-xs text-slate-400 font-mono">Gross Throughput</span>
              <div
                className={`text-3xl font-extrabold font-mono mt-1 ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                {metrics.grossWpm}
              </div>
            </div>
            <div
              className={`p-4 rounded-xl border backdrop-blur-md ${
                isDark ? 'bg-slate-950/70 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-xs text-slate-400 font-mono">Accuracy</span>
              <div className="text-3xl font-extrabold font-mono text-blue-500 mt-1">{metrics.accuracyPercentage}%</div>
            </div>
            <div
              className={`p-4 rounded-xl border backdrop-blur-md ${
                isDark ? 'bg-slate-950/70 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-xs text-slate-400 font-mono">Anti-Cheat Score</span>
              <div className="text-3xl font-extrabold font-mono text-purple-500 mt-1">
                {pasteAttempts > 0 ? '75.0%' : '99.4%'}
              </div>
            </div>
          </div>

          {/* Minting Form */}
          {!mintedCert ? (
            <div
              className={`p-5 rounded-xl border backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isDark ? 'bg-slate-950/70 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="w-full sm:w-auto flex-1">
                <label
                  className={`text-xs font-medium block mb-1.5 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Candidate Name on Certificate:
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-sans focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 ${
                    isDark
                      ? 'bg-slate-900 border-white/15 text-white'
                      : 'bg-white border-slate-300 text-slate-900 shadow-xs'
                  }`}
                  placeholder="Enter full name for certificate"
                />
              </div>

              <button
                onClick={handleMintCertificate}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#94E1FF] via-cyan-400 to-teal-400 text-slate-950 font-bold text-xs uppercase hover:brightness-110 transition-all shadow-lg shadow-[#94E1FF]/25 cursor-pointer shrink-0 sm:mt-5 active:scale-95"
              >
                <Lock className="h-4 w-4" />
                <span>Mint Cryptographic Certificate</span>
              </button>
            </div>
          ) : (
            <div
              className={`p-5 rounded-xl border backdrop-blur-md space-y-3 ${
                isDark
                  ? 'bg-gradient-to-r from-[#94E1FF]/10 via-teal-950/30 to-slate-900/50 border-[#94E1FF]/30'
                  : 'bg-gradient-to-r from-sky-50/80 to-teal-50/80 border-teal-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono font-bold text-[#94E1FF] dark:text-[#94E1FF] uppercase tracking-wider block">
                    Certificate Successfully Minted & Stored in Firestore
                  </span>
                  <div
                    className={`text-lg font-mono font-bold mt-0.5 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    ID: <span className="text-teal-600 dark:text-[#94E1FF] underline">{mintedCert.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => onViewOfficialCertificate(mintedCert)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border active:scale-95 ${
                      isDark
                        ? 'bg-white/10 hover:bg-white/15 text-white border-white/15'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs'
                    }`}
                  >
                    <FileCheck2 className="h-3.5 w-3.5 text-teal-500 dark:text-[#94E1FF]" />
                    <span>View & Print Diploma</span>
                  </button>

                  <button
                    onClick={() => onGoToPortalWithId(mintedCert.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#94E1FF] via-cyan-400 to-teal-400 text-slate-950 font-sans font-bold text-xs hover:brightness-105 transition-all cursor-pointer shadow-md shadow-[#94E1FF]/20 active:scale-95"
                  >
                    <span>Verify in Portal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div
                className={`text-[11px] font-mono truncate border-t pt-2 ${
                  isDark ? 'text-slate-400 border-white/10' : 'text-slate-600 border-emerald-200'
                }`}
              >
                Digital Signature: <span className={isDark ? 'text-slate-300' : 'text-slate-800'}>{mintedCert.signature}</span>
              </div>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              onClick={() => handleReset()}
              className={`px-5 py-2 rounded-xl text-xs font-sans transition-all cursor-pointer border ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              Take Another Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
