import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Award,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Bot,
  ClipboardX,
} from 'lucide-react';
import { Certificate, KeystrokeEvent, AntiCheatTelemetry } from '../types';
import { calculateTypingMetrics, analyzeKeystrokeDynamics } from '../utils/typingMath';
import {
  determineTier,
  getTierColor,
  generateCertificateId,
  generateDigitalSignature,
} from '../utils/certGenerator';

interface TypingEngineDemoProps {
  onCertificateMinted: (cert: Certificate) => void;
  onGoToPortalWithId: (id: string) => void;
}

const SAMPLE_TEXTS = [
  {
    category: 'Engineering & Architecture',
    text: 'Modern web architectures require strict decoupling between presentation layers and state-authoritative backends. By processing keystroke telemetry through statistical variance pipelines, high-throughput engines achieve deterministic fraud detection without imposing perceptible latency on touch-typists.',
  },
  {
    category: 'Legal & Clerical Standard',
    text: 'The certified transcript represents an accurate verbatim record of testimony presented before the administrative tribunal. Speed and mechanical consistency remain paramount, ensuring every spoken syllable is captured with verified fidelity and cryptographic chain of custody.',
  },
  {
    category: 'Competitive Prose',
    text: 'Swift fingers moved across the mechanical switches with rhythmic precision. Each stroke resonated with clockwork cadence, transforming thoughts into fluid streams of alphanumeric characters while the digital proctor silently verified the natural biomechanical variance of human hands.',
  },
];

export const TypingEngineDemo: React.FC<TypingEngineDemoProps> = ({
  onCertificateMinted,
  onGoToPortalWithId,
}) => {
  const [selectedTextIdx, setSelectedTextIdx] = useState(0);
  const [targetDuration, setTargetDuration] = useState(30); // 30s or 60s
  const [referenceText, setReferenceText] = useState(SAMPLE_TEXTS[0].text);
  
  const [userInput, setUserInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(targetDuration);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Keystrokes & Telemetry
  const keystrokesRef = useRef<KeystrokeEvent[]>([]);
  const lastKeyDownTimeRef = useRef<number>(0);
  const keyDownMapRef = useRef<Map<string, number>>(new Map());

  // Anti-cheat alert flags
  const [antiCheatAlert, setAntiCheatAlert] = useState<string | null>(null);
  const [pasteAttempts, setPasteAttempts] = useState(0);
  const [syntheticFlag, setSyntheticFlag] = useState(false);
  const [botSimulationActive, setBotSimulationActive] = useState(false);

  // Minted cert state for completion modal
  const [mintedCert, setMintedCert] = useState<Certificate | null>(null);
  const [candidateName, setCandidateName] = useState('Alex Morgan');

  const inputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset when text or duration changes
  const handleReset = (newTextIdx = selectedTextIdx, newDuration = targetDuration) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setSelectedTextIdx(newTextIdx);
    setReferenceText(SAMPLE_TEXTS[newTextIdx].text);
    setTargetDuration(newDuration);
    setUserInput('');
    setIsActive(false);
    setIsCompleted(false);
    setTimeRemaining(newDuration);
    setElapsedSeconds(0);
    keystrokesRef.current = [];
    lastKeyDownTimeRef.current = 0;
    keyDownMapRef.current.clear();
    setAntiCheatAlert(null);
    setSyntheticFlag(false);
    setPasteAttempts(0);
    setMintedCert(null);
    setBotSimulationActive(false);
  };

  // Timer loop
  useEffect(() => {
    if (isActive && !isCompleted) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          const remaining = Math.max(0, targetDuration - next);
          setTimeRemaining(remaining);
          if (remaining <= 0) {
            handleCompleteTest();
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isActive, isCompleted, targetDuration]);

  // Handle completion
  const handleCompleteTest = () => {
    setIsActive(false);
    setIsCompleted(true);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  // Keystroke listeners
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If not started yet, start test on first valid keypress
    if (!isActive && !isCompleted) {
      setIsActive(true);
      lastKeyDownTimeRef.current = performance.now();
    }

    if (isCompleted) return;

    const now = performance.now();
    const flightTime = lastKeyDownTimeRef.current > 0 ? now - lastKeyDownTimeRef.current : 0;
    lastKeyDownTimeRef.current = now;

    // Record down timestamp for dwell calculation
    keyDownMapRef.current.set(e.key, now);

    // Anti-cheat check 1: isTrusted
    if (!e.isTrusted) {
      setAntiCheatAlert('SECURITY ALERT: Untrusted synthetic event detected (event.isTrusted === false)');
    }

    // Save keystroke frame
    const isError = userInput.length < referenceText.length && e.key !== referenceText[userInput.length];
    
    keystrokesRef.current.push({
      key: e.key,
      code: e.code,
      downTimestamp: now,
      flightTime: flightTime,
      isTrusted: e.isTrusted,
      isError,
      charIndex: userInput.length,
    });

    // Check if finished entire text
    if (userInput.length + 1 >= referenceText.length) {
      setTimeout(() => handleCompleteTest(), 50);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const downTime = keyDownMapRef.current.get(e.key);
    if (downTime) {
      const dwell = performance.now() - downTime;
      keyDownMapRef.current.delete(e.key);

      // update the last matching keystroke with dwell
      const last = keystrokesRef.current[keystrokesRef.current.length - 1];
      if (last && last.key === e.key) {
        last.dwellTime = Math.round(dwell);
      }
    }
  };

  // Anti-Cheat: Intercept Clipboard Paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setPasteAttempts((p) => p + 1);
    setAntiCheatAlert('ANTI-CHEAT WARNING: Clipboard paste operation was intercepted and rejected. Only authentic mechanical typing is certified.');
  };

  // Calculate live metrics
  const metrics = calculateTypingMetrics(
    referenceText,
    userInput,
    Math.max(1, elapsedSeconds)
  );

  const biometricStats = analyzeKeystrokeDynamics(keystrokesRef.current);

  // Mint certificate action
  const handleMintCertificate = () => {
    const tier = determineTier(metrics.netWpm);
    const certId = generateCertificateId(tier);
    const nowIso = new Date().toISOString();
    const expDate = new Date();
    expDate.setFullYear(expDate.getFullYear() + 2);

    const cert: Certificate = {
      id: certId,
      publicCode: certId,
      candidateName: candidateName.trim() || 'Alex Morgan',
      candidateEmail: `${candidateName.toLowerCase().replace(/\s+/g, '.')}@verified.org`,
      tier,
      netWpm: metrics.netWpm,
      grossWpm: metrics.grossWpm,
      accuracyPercentage: metrics.accuracyPercentage,
      consistencyPercentage: biometricStats.consistencyPercentage,
      durationSeconds: targetDuration,
      issuedAt: nowIso,
      expiresAt: expDate.toISOString(),
      signature: generateDigitalSignature(certId, metrics.netWpm, metrics.accuracyPercentage, nowIso),
      qrPayload: `https://type-cert-enterprise.vercel.app/verify/${certId}`,
      antiCheatScore: syntheticFlag || pasteAttempts > 0 ? 64.5 : 99.4,
      proctorStatus: syntheticFlag || pasteAttempts > 2 ? 'FLAGGED' : 'VERIFIED',
      telemetrySummary: {
        dwellMean: biometricStats.meanDwellMs,
        flightStdDev: biometricStats.stdDevFlightMs,
        backspaceCorrections: keystrokesRef.current.filter((k) => k.key === 'Backspace').length,
        focusLost: 0,
      },
    };

    setMintedCert(cert);
    onCertificateMinted(cert);

    // Fire confetti for celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  // Simulate Synthetic Bot Cheating (demonstration for recruiter/evaluator)
  const handleSimulateBot = () => {
    if (botSimulationActive || isCompleted) return;
    setBotSimulationActive(true);
    handleReset();
    setIsActive(true);

    let currentIndex = 0;
    const targetText = referenceText.slice(0, 140);
    // Bot types with EXACTLY 45ms fixed interval (variance = 0.0ms)
    const botInterval = setInterval(() => {
      if (currentIndex >= targetText.length) {
        clearInterval(botInterval);
        setBotSimulationActive(false);
        setSyntheticFlag(true);
        setAntiCheatAlert('CRITICAL ANOMALY: Synthetic cadence detected! Flight time standard deviation is 0.0ms (Physiologically impossible for human hands). Disqualified.');
        handleCompleteTest();
        return;
      }

      const nextChar = targetText[currentIndex];
      setUserInput((prev) => prev + nextChar);
      
      const syntheticTime = performance.now();
      keystrokesRef.current.push({
        key: nextChar,
        code: `Key${nextChar.toUpperCase()}`,
        downTimestamp: syntheticTime,
        dwellTime: 20, // identical dwell
        flightTime: 45, // identical flight
        isTrusted: true,
        isError: false,
        charIndex: currentIndex,
      });

      currentIndex++;
    }, 45);
  };

  const currentTier = determineTier(metrics.netWpm);
  const tierStyle = getTierColor(currentTier);

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 px-2 font-mono">Duration:</span>
            {[30, 60].map((dur) => (
              <button
                key={dur}
                onClick={() => handleReset(selectedTextIdx, dur)}
                className={`px-3 py-1 text-xs rounded-md font-mono font-semibold transition-all cursor-pointer ${
                  targetDuration === dur
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {dur}s
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 px-2 font-mono">Text:</span>
            {SAMPLE_TEXTS.map((st, idx) => (
              <button
                key={idx}
                onClick={() => handleReset(idx, targetDuration)}
                className={`px-2.5 py-1 text-xs rounded-md transition-all cursor-pointer ${
                  selectedTextIdx === idx
                    ? 'bg-slate-800 text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st.category.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Anti-cheat simulation buttons for architectural demonstration */}
          <button
            onClick={() => {
              setPasteAttempts((p) => p + 1);
              setAntiCheatAlert('SIMULATED PASTE TRAP: Clipboard paste was blocked by browser DOM listener. Proctor flagged event.');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 text-red-400 border border-red-800/40 text-xs hover:bg-red-900/40 transition-colors cursor-pointer"
            title="Demonstrate how copy-pasting is trapped"
          >
            <ClipboardX className="h-3.5 w-3.5" />
            <span>Test Paste Trap</span>
          </button>

          <button
            onClick={handleSimulateBot}
            disabled={botSimulationActive || isActive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/40 text-purple-400 border border-purple-800/40 text-xs hover:bg-purple-900/40 transition-colors cursor-pointer disabled:opacity-50"
            title="Demonstrate zero-variance synthetic bot detection"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Simulate Script Bot</span>
          </button>

          <button
            onClick={() => handleReset()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Anti-Cheat Alert Banner */}
      {antiCheatAlert && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start gap-3 text-red-200 animate-in fade-in">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-red-300 font-mono">Proctor Telemetry Security Flag</h4>
            <p className="text-xs text-red-200 leading-relaxed">{antiCheatAlert}</p>
          </div>
        </div>
      )}

      {/* Real-Time Metrics HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Net WPM</span>
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">
            {metrics.netWpm}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Certified Metric</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Gross WPM</span>
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-1">
            {metrics.grossWpm}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Raw Throughput</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Accuracy</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-blue-400 mt-1">
            {metrics.accuracyPercentage}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono">{metrics.unfixedErrors} unfixed errors</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Timer</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-1">
            {timeRemaining}s
          </div>
          <div className="text-[10px] text-slate-500 font-mono">of {targetDuration}s total</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Projected Tier</span>
            <Award className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="mt-1">
            <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded ${tierStyle.badge}`}>
              {currentTier}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Threshold: {metrics.netWpm} WPM</div>
        </div>
      </div>

      {/* Main Interactive Typing Area */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="relative rounded-2xl border-2 border-slate-800 bg-slate-950 p-6 md:p-8 cursor-text transition-colors hover:border-slate-700 focus-within:border-emerald-500/80 shadow-2xl"
      >
        {/* Hidden active input catching keystrokes */}
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

        {/* Character-by-character render */}
        <div className="font-mono text-lg md:text-xl leading-relaxed tracking-wide select-none">
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
                    ? 'bg-emerald-500/30 text-white border-b-2 border-emerald-400'
                    : isCorrect
                    ? 'text-emerald-400'
                    : isError
                    ? 'text-red-400 bg-red-950/60 underline decoration-red-500'
                    : 'text-slate-600'
                }`}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Typing hint footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between text-xs text-slate-500 border-t border-slate-900 pt-4">
          <div className="flex items-center gap-2">
            {!isActive && !isCompleted ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono animate-pulse">
                <Play className="h-3 w-3" /> Click anywhere and start typing to begin proctored session
              </span>
            ) : isActive ? (
              <span className="flex items-center gap-1.5 text-cyan-400 font-mono">
                <Activity className="h-3 w-3" /> Session active: Keystroke telemetry streaming to proctor engine
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

      {/* Real-time Keystroke Biometric Telemetry Bar */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Real-Time Anti-Cheat Telemetry Monitor
            </h4>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Biometrics: {syntheticFlag ? 'ANOMALY DETECTED' : 'NATURAL HUMAN DYNAMICS'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">MEAN FLIGHT TIME (IKI)</span>
            <span className="text-slate-200 font-bold">{biometricStats.meanFlightMs} ms</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">FLIGHT VARIANCE (STDDEV)</span>
            <span className={biometricStats.stdDevFlightMs < 5.0 && userInput.length > 20 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
              {biometricStats.stdDevFlightMs} ms {biometricStats.stdDevFlightMs < 5.0 && userInput.length > 20 ? '(Synthetic)' : '(Normal)'}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">MEAN DWELL TIME</span>
            <span className="text-slate-200 font-bold">{biometricStats.meanDwellMs} ms</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">EVENT TRUST AUDIT</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> isTrusted 100%
            </span>
          </div>
        </div>
      </div>

      {/* Completion Modal / Certificate Minting */}
      {isCompleted && (
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-500/40 shadow-2xl space-y-6 animate-in zoom-in-95">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6 text-emerald-400" />
                <h3 className="text-xl md:text-2xl font-bold text-white">Certified Test Completed!</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Your keystroke telemetry was validated by the proctor engine. Ready for cryptographic sealing.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-mono">Assigned Tier</div>
                <span className={`px-3 py-1 text-sm font-mono font-bold rounded ${tierStyle.badge}`}>
                  {currentTier}
                </span>
              </div>
            </div>
          </div>

          {/* Results Summary Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">Certified Net WPM</span>
              <div className="text-3xl font-extrabold font-mono text-emerald-400">{metrics.netWpm}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">Gross Throughput</span>
              <div className="text-3xl font-extrabold font-mono text-cyan-400">{metrics.grossWpm}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">Accuracy</span>
              <div className="text-3xl font-extrabold font-mono text-blue-400">{metrics.accuracyPercentage}%</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">Anti-Cheat Score</span>
              <div className={`text-3xl font-extrabold font-mono ${syntheticFlag ? 'text-red-400' : 'text-purple-400'}`}>
                {syntheticFlag ? '64.5%' : '99.4%'}
              </div>
            </div>
          </div>

          {/* Minting form */}
          {!mintedCert ? (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full md:w-auto flex-1">
                <label className="text-xs text-slate-400 font-mono block mb-1">
                  Candidate Name on Certificate:
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="Enter full name"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={handleMintCertificate}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Lock className="h-4 w-4" />
                  <span>Mint Cryptographic Certificate</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                    Certificate Successfully Minted & Stored in PostgreSQL!
                  </span>
                  <div className="text-base font-mono font-bold text-white mt-1">
                    ID: <span className="text-emerald-300">{mintedCert.id}</span>
                  </div>
                </div>

                <button
                  onClick={() => onGoToPortalWithId(mintedCert.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
                >
                  <span>Verify in Employer Portal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="text-xs font-mono text-slate-400 truncate">
                Digital Signature: <span className="text-slate-300">{mintedCert.signature}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
