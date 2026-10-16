import React, { useState } from 'react';
import { ARCHITECTURE_BLUEPRINT } from '../data/blueprintData';
import {
  Code2,
  Cpu,
  Database,
  Lock,
  Layers,
  ArrowRight,
  Sparkles,
  Check,
  Copy,
  FileCheck2,
} from 'lucide-react';

interface BlueprintViewProps {
  onGoToEngine: () => void;
  onGoToPortal: () => void;
  onGoToSecurity: () => void;
}

export const BlueprintView: React.FC<BlueprintViewProps> = ({
  onGoToEngine,
  onGoToPortal,
  onGoToSecurity,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('typing-engine');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Architecture Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" /> System Architecture Blueprint
            </span>
            <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              React 19 • Express • PostgreSQL • Ed25519
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Professional-Grade Typing Test & Certification Platform
          </h2>
          <p className="mt-2 text-base text-slate-300 max-w-4xl leading-relaxed">
            A production-ready technical specification addressing rigorous WPM/Accuracy mathematical models,
            tamper-proof cryptographic certification with Luhn-checked IDs, employer validation portals, and a
            defense-in-depth anti-cheat security system based on keystroke biometric dynamics.
          </p>

          {/* Quick interactive action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onGoToEngine}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Cpu className="h-4 w-4" />
              <span>Launch Live Engine Demo</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onGoToPortal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm border border-slate-700 transition-colors cursor-pointer"
            >
              <FileCheck2 className="h-4 w-4 text-cyan-400" />
              <span>Employer Verification Portal</span>
            </button>
            <button
              onClick={onGoToSecurity}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm border border-slate-700 transition-colors cursor-pointer"
            >
              <Lock className="h-4 w-4 text-purple-400" />
              <span>Anti-Cheat Security Lab</span>
            </button>
          </div>
        </div>

        {/* High-Level Architecture Flow Diagram */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-emerald-400" /> End-to-End System Data Flow
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 relative">
              <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Step 1: Client Engine</div>
              <div className="text-sm font-semibold text-white mt-1">High-Precision Keystroke Capture</div>
              <p className="text-xs text-slate-400 mt-1">
                Sub-ms performance.now() timestamps, dwell times, flight times, and clipboard shields.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 relative">
              <div className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">Step 2: Backend Replay</div>
              <div className="text-sm font-semibold text-white mt-1">Server Verification & Biometrics</div>
              <p className="text-xs text-slate-400 mt-1">
                Express re-evaluates all keystrokes, validates mathematical metrics, checks IKI Gaussian variance.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 relative">
              <div className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider">Step 3: Cryptographic Mint</div>
              <div className="text-sm font-semibold text-white mt-1">Ed25519 & PostgreSQL Persistence</div>
              <p className="text-xs text-slate-400 mt-1">
                Luhn mod-36 unique ID assigned, payload digitally signed, and stored in partitioned PostgreSQL tables.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 relative">
              <div className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">Step 4: Employer Portal</div>
              <div className="text-sm font-semibold text-white mt-1">Zero-Friction Public Validation</div>
              <p className="text-xs text-slate-400 mt-1">
                Recruiters scan QR or input ID; Redis-cached public endpoint validates signature and displays credentials.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blueprint Navigation Pills */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {ARCHITECTURE_BLUEPRINT.sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setSelectedSection(section.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedSection === section.id
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            {section.title.split('.')[1] || section.title}
          </button>
        ))}
      </div>

      {/* Blueprint Content Sections */}
      <div className="space-y-12">
        {ARCHITECTURE_BLUEPRINT.sections
          .filter((section) => selectedSection === 'all' || section.id === selectedSection)
          .map((section) => (
            <div
              key={section.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 md:p-8 space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {section.badge}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white">{section.title}</h3>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{section.summary}</p>
                </div>
              </div>

              <div className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/60">
                {section.content.overview}
              </div>

              {/* Key Architectural Points */}
              <div className="grid grid-cols-1 gap-6">
                {section.content.keyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800/80 bg-slate-900/30 p-5 space-y-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-md bg-slate-800 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center border border-slate-700">
                          {idx + 1}
                        </span>
                        <h4 className="text-base font-semibold text-white">{point.heading}</h4>
                      </div>
                      {point.formulaOrCode && (
                        <button
                          onClick={() => copyToClipboard(point.formulaOrCode!, `${section.id}-${idx}`)}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/80 border border-slate-700 cursor-pointer"
                          title="Copy snippet"
                        >
                          {copiedId === `${section.id}-${idx}` ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400 font-mono text-[11px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span className="font-mono text-[11px]">Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {point.description}
                    </p>

                    {point.formulaOrCode && (
                      <div className="relative mt-2">
                        <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                          <code>{point.formulaOrCode}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Tech Stack Matrix Overview */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Database className="h-5 w-5 text-emerald-400" />
          Technical Stack & Architectural Decisions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-1">Frontend Layer</span>
            <div className="text-slate-300 font-sans text-sm font-semibold">React 19 + TypeScript + Vite</div>
            <p className="text-slate-400 font-sans text-xs mt-1">
              Deterministic event loop, zero-latency caret motion, raw keyboard listener, web crypto helpers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">Backend Engine</span>
            <div className="text-slate-300 font-sans text-sm font-semibold">Node.js 22 LTS + Express</div>
            <p className="text-slate-400 font-sans text-xs mt-1">
              Server-side deterministic replay validator, statistical biometric analysis, Ed25519 payload signing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-purple-400 font-bold block mb-1">Persistence & Indexing</span>
            <div className="text-slate-300 font-sans text-sm font-semibold">PostgreSQL 16 + Redis 7</div>
            <p className="text-slate-400 font-sans text-xs mt-1">
              B-Tree index on public_code, JSONB telemetry store, Redis token bucket rate limiting (60 req/min).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
