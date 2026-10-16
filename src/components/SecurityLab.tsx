import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Cpu,
  Eye,
  KeyRound,
  Server,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const SecurityLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'biometrics' | 'clipboard' | 'jwt' | 'ratelimit'>('biometrics');
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  return (
    <div className="space-y-8">
      {/* Security Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Security Architecture Lab
              </span>
              <span className="text-xs text-slate-400 font-mono">Defense-in-Depth Specification</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">Anti-Cheat, Biometrics & Cryptographic Security</h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 max-w-4xl">
          Online typing benchmarks are targets for browser automation scripts, copy-paste extensions, and DOM tampering.
          TypeCert implements a 7-tier defensive architecture enforcing physiological biomechanical validation, cryptographic
          nonces, and deterministic server-side replays.
        </p>

        {/* Sub-nav */}
        <div className="flex gap-2 border-t border-slate-800/80 pt-4 overflow-x-auto no-scrollbar">
          {[
            { id: 'biometrics', label: '1. Keystroke Biometrics (IKI)', icon: Activity },
            { id: 'clipboard', label: '2. DOM & Event Shielding', icon: ShieldAlert },
            { id: 'jwt', label: '3. JWT & Refresh Rotation', icon: KeyRound },
            { id: 'ratelimit', label: '4. Redis Rate Limiting', icon: Server },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                  isSel
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
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

      {/* Tab 1: Keystroke Biometrics */}
      {activeTab === 'biometrics' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-400" />
              Keystroke Dynamics & Inter-Keystroke Interval (IKI) Analysis
            </h3>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Physiological Verification
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            Human fingers are bound by neuromuscular physics. Typing the word <em>"there"</em> involves left-hand to right-hand
            alternation ("t" left, "h" right, "e" left, "r" left, "e" left). Inter-keystroke intervals between opposite hands
            are significantly shorter than consecutive keystrokes on the same hand. This creates a distinctive log-normal distribution.
          </p>

          {/* Visual Distribution Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Human Curve */}
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> AUTHENTIC HUMAN PROFILE
                </span>
                <span className="text-xs font-mono text-slate-400">StdDev: ~32ms</span>
              </div>

              {/* Graphical Bar Chart representing Gaussian Curve */}
              <div className="h-32 flex items-end justify-between gap-1 px-2 pt-4 bg-slate-950 rounded-lg border border-slate-800">
                {[15, 30, 55, 85, 100, 90, 65, 40, 25, 12].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      style={{ height: `${height}%` }}
                      className="w-full rounded-t bg-gradient-to-t from-emerald-600 to-emerald-400"
                    />
                    <span className="text-[9px] font-mono text-slate-600">
                      {50 + i * 20}ms
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-xs text-slate-400 space-y-1 font-mono">
                <div>• Log-normal distribution curve</div>
                <div>• Biomechanical hand-shift variance</div>
                <div>• Variance: 20ms &lt; &sigma; &lt; 75ms</div>
              </div>
            </div>

            {/* Script / Bot Spike */}
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> SYNTHETIC BOT SCRIPT PROFILE
                </span>
                <span className="text-xs font-mono text-slate-400">StdDev: 0.0 - 2.1ms</span>
              </div>

              {/* Graphical Bar Chart representing Single Spike */}
              <div className="h-32 flex items-end justify-between gap-1 px-2 pt-4 bg-slate-950 rounded-lg border border-slate-800">
                {[0, 0, 0, 0, 100, 0, 0, 0, 0, 0].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      style={{ height: `${height}%` }}
                      className={`w-full rounded-t ${height > 0 ? 'bg-red-500' : 'bg-transparent'}`}
                    />
                    <span className="text-[9px] font-mono text-slate-600">
                      {50 + i * 20}ms
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-xs text-slate-400 space-y-1 font-mono">
                <div>• Single discrete spike at 50ms (or flat uniform)</div>
                <div>• Zero physiological muscle transition</div>
                <div>• Anomaly trigger: &sigma; &lt; 4.0ms</div>
              </div>
            </div>
          </div>

          {/* Dwell vs Flight Explanation */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h4 className="text-sm font-semibold text-white">Dwell Time vs. Flight Time Lifecycle</h4>
            <div className="font-mono text-xs text-slate-300 p-3 bg-slate-950 rounded-lg border border-slate-800 leading-relaxed overflow-x-auto">
              Key 'A' Down [t=100] ----(Dwell Time = 75ms)----&gt; Key 'A' Up [t=175]
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;----(Flight Time = 135ms)----&gt; Key 'B' Down [t=235]
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: DOM & Event Integrity */}
      {activeTab === 'clipboard' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-400" />
              DOM Isolation, Clipboard Interception & Event Trust
            </h3>
            <span className="text-xs font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              Input Shielding
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <div className="text-xs font-mono font-bold text-red-400">1. Clipboard Lockout</div>
              <p className="text-xs text-slate-300">
                Hooks into <code>onPaste</code>, <code>onCopy</code>, <code>onCut</code>, and <code>onDrop</code>. Any
                clipboard mutation immediately nullifies the event, logs client telemetry, and flags the session.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <div className="text-xs font-mono font-bold text-amber-400">2. isTrusted Audit</div>
              <p className="text-xs text-slate-300">
                Modern browsers flag programmatically generated synthetic events (e.g. <code>new KeyboardEvent()</code>)
                with <code>event.isTrusted === false</code>. Disqualifies spoofed events instantly.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <div className="text-xs font-mono font-bold text-cyan-400">3. Glyph Obfuscation</div>
              <p className="text-xs text-slate-300">
                Reference text is rendered using segmented character spans with CSS <code>user-select: none</code> and
                dynamic random DOM keys, preventing trivial browser extension DOM parsers from scraping the entire target text.
              </p>
            </div>
          </div>

          {/* Interactive Window Blur Test */}
          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Page Visibility & Tab Focus Monitor</div>
              <p className="text-xs text-slate-400">
                Certified sessions track <code>document.visibilityState</code> and <code>window.onblur</code>.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-slate-500 block">Tab Switch Counter</span>
              <span className="text-lg font-mono font-bold text-emerald-400">0 Switches Allowed</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: JWT Architecture */}
      {activeTab === 'jwt' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-emerald-400" />
              JWT Dual-Token Authentication with Redis Rotation
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Zero-Trust Auth
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Access Token (In-Memory)</span>
              <div className="text-xs text-slate-300 space-y-2">
                <div>• <strong>Lifespan:</strong> 15 minutes (short-lived)</div>
                <div>• <strong>Storage:</strong> JavaScript runtime memory (never in localStorage or sessionStorage to prevent XSS exfiltration)</div>
                <div>• <strong>Algorithm:</strong> RS256 / Ed25519 signed by backend private key</div>
                <div>• <strong>Claims:</strong> <code>{'{ sub: userId, role: "candidate", exp: ... }'}</code></div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase">Refresh Token (HttpOnly Cookie)</span>
              <div className="text-xs text-slate-300 space-y-2">
                <div>• <strong>Lifespan:</strong> 7 days with sliding window</div>
                <div>• <strong>Cookie Flags:</strong> <code>HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh</code></div>
                <div>• <strong>Rotation:</strong> Single-use; each refresh replaces the token in Redis. Re-using an old token revokes the entire family!</div>
              </div>
            </div>
          </div>

          {/* Express Auth Code Snippet */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400">Node/Express JWT Middleware Implementation:</span>
            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
{`export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_PUBLIC_KEY!, { algorithms: ['RS256'] }, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired access token' });
    req.user = user;
    next();
  });
};`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Redis Rate Limiting */}
      {activeTab === 'ratelimit' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="h-5 w-5 text-cyan-400" />
              Redis Token Bucket Rate Limiting Architecture
            </h3>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              DoS & Brute-Force Shield
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border border-slate-800 rounded-lg">
              <thead className="bg-slate-900 text-slate-400">
                <tr>
                  <th className="p-3">Endpoint</th>
                  <th className="p-3">Rate Limit</th>
                  <th className="p-3">Scope</th>
                  <th className="p-3">Mitigation Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="p-3 text-cyan-400 font-bold">/api/v1/certificates/verify/:id</td>
                  <td className="p-3">60 req / min</td>
                  <td className="p-3">IP Address</td>
                  <td className="p-3">Prevents enumeration scraping of candidate certificates</td>
                </tr>
                <tr>
                  <td className="p-3 text-emerald-400 font-bold">/api/v1/tests/start</td>
                  <td className="p-3">10 tests / hour</td>
                  <td className="p-3">User UUID</td>
                  <td className="p-3">Prevents bot test spamming & resource exhaustion</td>
                </tr>
                <tr>
                  <td className="p-3 text-purple-400 font-bold">/api/v1/auth/login</td>
                  <td className="p-3">5 attempts / 15 min</td>
                  <td className="p-3">IP + Email</td>
                  <td className="p-3">Stops credential stuffing and password guessing</td>
                </tr>
                <tr>
                  <td className="p-3 text-amber-400 font-bold">/api/v1/tests/submit</td>
                  <td className="p-3">10 req / hour</td>
                  <td className="p-3">Session Nonce</td>
                  <td className="p-3">Prevents score injection replay attacks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
