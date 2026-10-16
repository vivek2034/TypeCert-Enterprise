import React, { useState } from 'react';
import { ARCHITECTURE_BLUEPRINT } from '../data/blueprintData';
import { KeyRound, Play, CheckCircle2, ShieldCheck, Clock, Send, Lock } from 'lucide-react';
import { EndpointDefinition } from '../types';

export const ApiExplorer: React.FC = () => {
  const endpoints = ARCHITECTURE_BLUEPRINT.apiEndpoints;
  const [selectedIdx, setSelectedIdx] = useState(3); // default to /tests/submit
  const [activeTab, setActiveTab] = useState<'request' | 'response'>('response');
  const [simulatedResponse, setSimulatedResponse] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [latencyMs, setLatencyMs] = useState(42);

  const selectedEndpoint = endpoints[selectedIdx];

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setSimulatedResponse(selectedEndpoint.responseBody);
      setLatencyMs(Math.floor(25 + Math.random() * 35));
    }, 280);
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'POST':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'PUT':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'DELETE':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                RESTful OpenAPI 3.1 Specification
              </span>
              <span className="text-xs text-slate-400 font-mono">Express Router Contracts</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">Key API Endpoint Definitions & Contracts</h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 max-w-4xl">
          Specification of core HTTP interfaces powering candidate authentication, proctored test session initialization,
          telemetry payload submission, and public employer certificate verification.
        </p>
      </div>

      {/* Main 2-column API Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Endpoint List */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block px-1">
            Core Service Endpoints ({endpoints.length})
          </span>

          <div className="space-y-2">
            {endpoints.map((ep, idx) => {
              const isSel = idx === selectedIdx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedIdx(idx);
                    setSimulatedResponse(null);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSel
                      ? 'bg-slate-900 border-cyan-500/50 shadow-md'
                      : 'bg-slate-950 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${getMethodBadge(ep.method)}`}>
                      {ep.method}
                    </span>
                    <span className="text-xs font-mono text-slate-200 font-bold truncate">
                      {ep.path}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{ep.summary}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Endpoint Details & Sandbox */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded border ${getMethodBadge(selectedEndpoint.method)}`}>
                {selectedEndpoint.method}
              </span>
              <h3 className="text-base font-mono font-bold text-white">{selectedEndpoint.path}</h3>
            </div>

            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isExecuting ? 'Sending...' : 'Test Endpoint'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-300">{selectedEndpoint.summary}</p>

          {/* Security & Rate Limit Metadata Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">AUTHENTICATION</span>
              <span className={selectedEndpoint.authRequired ? 'text-amber-400 font-bold flex items-center gap-1 mt-0.5' : 'text-emerald-400 font-bold flex items-center gap-1 mt-0.5'}>
                {selectedEndpoint.authRequired ? <Lock className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                {selectedEndpoint.authRequired ? 'JWT Bearer' : 'Public Access'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">ALLOWED ROLE</span>
              <span className="text-slate-200 font-bold uppercase mt-0.5 block">{selectedEndpoint.role}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">RATE LIMIT (REDIS)</span>
              <span className="text-cyan-400 font-bold mt-0.5 block truncate">{selectedEndpoint.rateLimit}</span>
            </div>
          </div>

          {/* Request / Response Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex gap-2">
                {selectedEndpoint.requestBody && (
                  <button
                    onClick={() => setActiveTab('request')}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                      activeTab === 'request'
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Request Body (JSON)
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('response')}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                    activeTab === 'response'
                      ? 'bg-slate-800 text-emerald-400 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Response Payload
                </button>
              </div>

              {simulatedResponse && (
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Status 200 OK ({latencyMs}ms)
                </span>
              )}
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed max-h-80">
              <code>
                {activeTab === 'request' && selectedEndpoint.requestBody
                  ? selectedEndpoint.requestBody
                  : simulatedResponse || selectedEndpoint.responseBody}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
