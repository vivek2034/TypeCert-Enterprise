import React, { useState } from 'react';
import { ARCHITECTURE_BLUEPRINT } from '../data/blueprintData';
import {
  GitBranch,
  FolderTree,
  Database,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ChevronRight,
  FileCode,
  Folder,
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'directory' | 'ddl'>('roadmap');
  const [copiedText, setCopiedText] = useState(false);

  const copyStructure = () => {
    navigator.clipboard.writeText(ARCHITECTURE_BLUEPRINT.directoryStructure);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Engineering Roadmap & Repository Architecture
              </span>
              <span className="text-xs text-slate-400 font-mono">Full-Stack Blueprint</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">Project Roadmap & Production Directory Structure</h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 max-w-4xl">
          Phased execution strategy for enterprise delivery, recommended monorepo structure, and production PostgreSQL
          DDL schema definitions.
        </p>

        {/* Tab switcher */}
        <div className="flex gap-2 border-t border-slate-800/80 pt-4 overflow-x-auto no-scrollbar">
          {[
            { id: 'roadmap', label: '1. Phased Project Roadmap', icon: GitBranch },
            { id: 'directory', label: '2. Suggested Directory Structure', icon: FolderTree },
            { id: 'ddl', label: '3. PostgreSQL Schema (DDL)', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                  isSel
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Phased Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {ARCHITECTURE_BLUEPRINT.roadmap.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-lg bg-slate-900 text-amber-400 font-mono font-bold text-sm flex items-center justify-center border border-slate-800">
                      0{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {item.phase}: {item.title}
                      </h3>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Clock className="h-3 w-3 text-amber-400" /> Duration: {item.duration}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-full border self-start sm:self-auto ${
                      idx === 0
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                    Key Deliverables:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                    {item.deliverables.map((del, dIdx) => (
                      <div
                        key={dIdx}
                        className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Directory Structure */}
      {activeTab === 'directory' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-amber-400" />
                Enterprise Monorepo Directory Architecture
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Decoupled full-stack structure for React 19 SPA, Express 4 REST API, and PostgreSQL Drizzle ORM.
              </p>
            </div>

            <button
              onClick={copyStructure}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
            >
              {copiedText ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Tree</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <pre className="p-5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
              <code>{ARCHITECTURE_BLUEPRINT.directoryStructure}</code>
            </pre>
          </div>

          {/* Directory Architectural Roles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
              <span className="font-mono font-bold text-emerald-400">/client</span>
              <p className="text-slate-300">
                React 19 presentation layer. Zero business logic leak; calculates instant visual feedback but relies on
                backend replay for certification.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
              <span className="font-mono font-bold text-cyan-400">/server</span>
              <p className="text-slate-300">
                Express REST API, deterministic replay engine, anti-cheat biometric anomaly analyzer, and Ed25519 signer.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
              <span className="font-mono font-bold text-purple-400">/database</span>
              <p className="text-slate-300">
                Version-controlled Drizzle migrations, PostgreSQL DDL schemas, B-Tree indices on public codes, and seed
                paragraphs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: DDL */}
      {activeTab === 'ddl' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-400" />
                PostgreSQL Relational Schema (DDL)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Normalized relational tables, foreign key constraints, JSONB telemetry storage, and high-speed B-Tree indices.
              </p>
            </div>
          </div>

          <pre className="p-5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
{`-- Core PostgreSQL DDL for TypeCert Platform
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    role VARCHAR(20) DEFAULT 'candidate' CHECK (role IN ('candidate', 'employer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE test_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(64) UNIQUE NOT NULL,
    reference_text_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'disqualified')),
    duration_seconds INT NOT NULL,
    gross_wpm NUMERIC(5,2),
    net_wpm NUMERIC(5,2),
    accuracy NUMERIC(5,2),
    consistency_score NUMERIC(5,2),
    telemetry_json JSONB NOT NULL,
    ip_address INET,
    user_agent TEXT,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ
);

CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_code VARCHAR(32) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    session_id UUID NOT NULL UNIQUE REFERENCES test_sessions(id),
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('NOVICE', 'INTERMEDIATE', 'PROFICIENT', 'ADVANCED', 'MASTER', 'ELITE')),
    net_wpm INT NOT NULL,
    gross_wpm INT NOT NULL,
    accuracy NUMERIC(4,1) NOT NULL,
    consistency NUMERIC(4,1) NOT NULL,
    signature TEXT NOT NULL,
    anti_cheat_score NUMERIC(4,1) NOT NULL,
    proctor_status VARCHAR(20) DEFAULT 'VERIFIED' CHECK (proctor_status IN ('VERIFIED', 'FLAGGED', 'REVOKED')),
    revocation_reason TEXT,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- Fast Indexing for Public Employer Verification & User Portfolios
CREATE INDEX idx_certificates_public_code ON certificates (public_code);
CREATE INDEX idx_certificates_user ON certificates (user_id);
CREATE INDEX idx_test_sessions_user_status ON test_sessions (user_id, status);`}
          </pre>
        </div>
      )}
    </div>
  );
};
