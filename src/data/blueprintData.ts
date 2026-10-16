/**
 * Exhaustive Architectural Blueprint for TypeCert Professional Platform
 * React (Frontend) + Node.js/Express (Backend) + PostgreSQL (Database)
 */

export interface BlueprintSection {
  id: string;
  title: string;
  badge: string;
  summary: string;
  content: {
    overview: string;
    keyPoints: {
      heading: string;
      description: string;
      formulaOrCode?: string;
      codeLanguage?: string;
    }[];
    deepDive?: string;
  };
}

export const ARCHITECTURE_BLUEPRINT = {
  meta: {
    projectName: 'TypeCert Enterprise Platform',
    targetAudience: 'Software Engineers, Court Reporters, Legal Assistants, Medical Transcribers & FinTech Recruiters',
    primaryStack: {
      frontend: 'React 19 + TypeScript + Tailwind CSS + Lucide Icons + Motion',
      backend: 'Node.js 22 LTS + Express 4 / Fastify + TypeScript (tsx)',
      database: 'PostgreSQL 16 + Drizzle ORM / Prisma + pgvector (biometrics)',
      cacheAndAuth: 'Redis 7 (Rate Limiting, Session Nonces, Token Revocation) + JWT (RS256 / Ed25519)',
      cryptography: 'Web Crypto API / Node.js crypto (HMAC-SHA256, Ed25519)',
    },
  },

  sections: [
    {
      id: 'typing-engine',
      title: '1. Functional Breakdown of the Typing Engine',
      badge: 'Core Engine Math',
      summary: 'Mathematical formulation of Gross WPM, Net WPM, Net Accuracy, Standard 5-Character Word convention, and real-time sub-millisecond event state machine.',
      content: {
        overview:
          'In professional typing benchmarks (such as court reporting NCRA RPR exams, US Civil Service Clerical tests, and competitive platforms like TypeRacer / Monkeytype), speed and precision cannot be evaluated by naive word-splitting. TypeCert strictly implements the international standard standardized 5-character word length and strict error-penalty mechanics.',
        keyPoints: [
          {
            heading: 'Standardized 5-Character Word Length',
            description:
              'Natural words vary wildly in length ("a" vs "characterization"). To eliminate lexical variance across test paragraphs, all typing standards normalize text by counting 5 keystrokes (including spaces, punctuation, and capitalizations) as exactly 1 standardized word.',
            formulaOrCode: 'Standard Words = Total Character Keystrokes / 5',
          },
          {
            heading: 'Gross (Raw) Words Per Minute (GWPM)',
            description:
              'Gross WPM measures pure mechanical keyboard throughput irrespective of error count. It represents the upper bound of the candidate\'s raw finger velocity over the elapsed test window.',
            formulaOrCode: 'GWPM = (Total Typed Characters / 5) / (Elapsed Time in Seconds / 60)',
          },
          {
            heading: 'Net Words Per Minute (NWPM) & Error Penalty',
            description:
              'Net WPM is the true certified metric. Every uncorrected mistake remaining in the text imposes a harsh 1-word penalty (equivalent to 5 wasted keystrokes). If candidate types 500 characters in 60s with 4 unfixed errors: GWPM = 100 WPM, Error Penalty = 4 WPM -> Net WPM = 96 WPM.',
            formulaOrCode: 'NWPM = GWPM - (Unfixed Errors / Elapsed Minutes)\nNWPM = max(0, round(NWPM))',
          },
          {
            heading: 'Accuracy Formulas (Raw vs Strict Net)',
            description:
              'Raw Accuracy represents the ratio of correct keystrokes to total keypresses. Strict Net Accuracy factors in corrective backspaces to penalize erratic "spray and pray" typing.',
            formulaOrCode:
              'Raw Accuracy (%) = (Correct Characters / Total Characters Typed) * 100\nStrict Net Accuracy (%) = max(0, ((Total Characters - Unfixed Errors - (0.5 * CorrectedErrors)) / Total Characters) * 100)',
          },
          {
            heading: 'Sub-Millisecond Keystroke State Machine',
            description:
              'The input system tracks each character through a 5-state lifecycle: PENDING -> ACTIVE -> CORRECT | INCORRECT -> BACKSPACED. High-precision performance.now() timestamps are recorded on both keydown and keyup for every event.',
            formulaOrCode: `interface KeystrokeFrame {
  char: string;
  code: string;
  index: number;
  tDown: DOMHighResTimeStamp; // performance.now()
  tUp: DOMHighResTimeStamp;
  dwell: number;              // tUp - tDown (hold duration)
  flight: number;             // tDown(n) - tDown(n-1)
  isTrusted: boolean;         // synthetic event detection
  state: 'correct' | 'incorrect' | 'corrected';
}`,
            codeLanguage: 'typescript',
          },
        ],
      },
    },

    {
      id: 'certification-system',
      title: '2. Certification System & Unique ID Architecture',
      badge: 'Cryptographic Credentialing',
      summary: 'Tamper-evident certificate minting, collision-resistant human-readable IDs with Luhn mod-36 checksums, asymmetric signing, and relational PostgreSQL DDL.',
      content: {
        overview:
          'Certificates must be forgery-proof, verifiable offline via cryptographic signatures, resistant to brute-force enumeration, and easy for HR managers to type into an ATS without transcription errors.',
        keyPoints: [
          {
            heading: 'Unique Certificate ID Topology',
            description:
              'Format: TC-[TIER_CODE]-[YYYYMM]-[5_CHAR_CROCKFORD_ENTROPY][CHECKSUM].\nUses Crockford Base32 (omits easily confused glyphs I, L, O, U) plus a trailing Luhn Mod-36 check character. Any single transposed digit or mistyped letter is instantly caught client-side before querying the database.',
            formulaOrCode: 'Example ID: TC-MST-202610-8F92A4\n- TC: Brand prefix (TypeCert)\n- MST: Tier (Master >= 100 WPM)\n- 202610: Issuance Epoch (Year 2026, Month 10)\n- 8F92A: 33.5 million entropy bucket per month\n- 4: Mod-36 check character',
          },
          {
            heading: 'Cryptographic Signature & Tamper-Proof Sealing',
            description:
              'Upon test completion, the server compiles a canonical JSON payload of the test results and signs it with an offline Ed25519 private key or AWS KMS HSM key. Even if an attacker manipulates the database rows, the public key signature check will instantly fail.',
            formulaOrCode: `Payload: {
  certId: "TC-MST-202610-8F92A4",
  candidateId: "usr_88a4e9b",
  netWpm: 112,
  grossWpm: 115,
  accuracy: 99.1,
  durationSec: 60,
  biometricScore: 99.4,
  issuedAt: 1790950930
}
Signature: ed25519_sign(canonical_json(payload), PRIVATE_KEY)`,
            codeLanguage: 'json',
          },
          {
            heading: 'Relational Database Schema (PostgreSQL DDL)',
            description:
              'Optimized relational model with partitioned test sessions, strict foreign key constraints, B-Tree indexes on public lookup codes, and JSONB storage for high-density biometric telemetry.',
            formulaOrCode: `-- Core PostgreSQL DDL for TypeCert Platform
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

-- Indices for high-frequency queries
CREATE INDEX idx_certificates_public_code ON certificates (public_code);
CREATE INDEX idx_certificates_user ON certificates (user_id);
CREATE INDEX idx_test_sessions_user_status ON test_sessions (user_id, status);`,
            codeLanguage: 'sql',
          },
        ],
      },
    },

    {
      id: 'verification-portal',
      title: '3. Employer Verification Portal Design',
      badge: 'Public Trust Layer',
      summary: 'Public zero-friction validation, instant QR parsing, biometric telemetry proof-of-authenticity, and printable tamper-evident badge cards.',
      content: {
        overview:
          'Recruiters and hiring managers need to verify candidates in 3 seconds without having to create an account or navigate paywalls. The Verification Portal provides a publicly accessible, cryptographic audit portal.',
        keyPoints: [
          {
            heading: 'Zero-Friction Recruiter Flow',
            description:
              'Recruiters visit /verify/:code or scan the QR code printed on candidate resumes. The portal checks cache first (Redis 5-minute TTL), then executes an asymmetric signature check and displays a comprehensive verification certificate card.',
            formulaOrCode: 'GET /api/v1/certificates/verify/TC-MST-202610-8F92A4',
          },
          {
            heading: 'Anti-Tampering Credential Badges',
            description:
              'Display verified metrics: Candidate Full Name, Certified Net WPM, Raw Speed, Accuracy, Test Duration, Date of Issue, Expiration Date, and Anti-Cheat Integrity Score (e.g. 99.4% Human Variance Confirmed).',
            formulaOrCode:
              'Verification Badges:\n- Novice (< 40 WPM)\n- Intermediate (40-59 WPM)\n- Proficient (60-79 WPM)\n- Advanced (80-99 WPM)\n- Master (100-119 WPM)\n- Elite (120+ WPM)',
          },
          {
            heading: 'Replay Telemetry Visualizer',
            description:
              'Allows corporate proctors to view an interactive speed chart showing instantaneous WPM over time, highlighting pauses, backspace clusters, and cadence stability to guarantee the candidate typed continuously without robotic spikes.',
          },
          {
            heading: 'W3C Verifiable Credentials & Open Badges JSON-LD',
            description:
              'Emits standard Open Badges 2.0 / 3.0 schema metadata, allowing candidates to embed verified typing credentials directly into LinkedIn licenses, GitHub profiles, and HR ATS software like Greenhouse and Workday.',
          },
        ],
      },
    },

    {
      id: 'security-plan',
      title: '4. Security Plan & Anti-Cheat Architecture',
      badge: 'Defense-in-Depth',
      summary: 'Keystroke biometrics (flight & dwell times), DOM paste interception, trusted event flags, synthetic cadence anomaly detection, JWT auth with refresh rotation, and token bucket rate limits.',
      content: {
        overview:
          'Online typing tests are notoriously susceptible to simple browser extensions, copy-paste cheats, and automated JavaScript typing bots (e.g. setInterval key simulations). TypeCert implements a 7-tier defensive barrier.',
        keyPoints: [
          {
            heading: 'Tier 1: Keystroke Biometrics & IKI Variance',
            description:
              'Human typing displays natural biomechanical physical variance. The Inter-Keystroke Interval (IKI) follows a log-normal distribution with distinct hand-alternation flight times (e.g. "th" typed by left-right hands takes ~90ms, while "er" on same hand takes ~140ms). Automated scripts type with either static intervals (e.g. 50ms) or pseudo-random uniform variance that lacks physiological muscle hand transitions.',
            formulaOrCode:
              'Human Biometrics Indicator: 20 < stdDev(FlightTime) < 80 ms\nSynthetic Bot Alert Trigger: stdDev(FlightTime) < 5.0 ms OR variance == 0',
          },
          {
            heading: 'Tier 2: DOM & Clipboard Tamper Shielding',
            description:
              'Direct event interception: onPaste, onDrop, onContextMenu are completely blocked on the active typing viewport. Input is captured strictly via keyboard events. Reference text is rendered with split character spans and CSS user-select: none to prevent one-click document scraping.',
            formulaOrCode:
              'window.addEventListener("paste", (e) => { e.preventDefault(); flagCheat("CLIPBOARD_PASTE"); });\nif (!e.isTrusted) { flagCheat("UNTRUSTED_SYNTHETIC_EVENT"); }',
            codeLanguage: 'typescript',
          },
          {
            heading: 'Tier 3: Window Focus & Tab Switch Monitor',
            description:
              'Using Page Visibility API and window.onblur, any tab-switching, devtools opening, or window minimize triggers an immediate disqualification or flag count. A proctored certified test permits 0 window switches.',
          },
          {
            heading: 'Tier 4: Server-Side Deterministic Replay Validator',
            description:
              'The client does not merely submit "I typed 110 WPM". Instead, the client submits the encrypted array of raw keystroke timestamps. The Express backend replays the exact sequence against the reference text, validates the math independently, and verifies that the total elapsed time matches the server-issued session nonce time delta.',
          },
          {
            heading: 'Tier 5: JWT Authentication with Rotating Refresh Tokens',
            description:
              'Dual-token architecture: Access Token (15 min lifespan, RS256 signed, stored in application memory only) and Refresh Token (7 days, stored in HttpOnly, Secure, SameSite=Strict cookies). When refreshing, old tokens are invalidated in Redis to prevent replay attacks.',
          },
          {
            heading: 'Tier 6: Tiered Redis Rate Limiting',
            description:
              'Protects endpoints from denial of service and automated brute forcing:\n- /api/v1/certificates/verify/:code: 60 req/min per IP\n- /api/v1/tests/start: 10 tests/hour per authenticated user\n- /api/v1/auth/login: 5 attempts/15 min with exponential backoff',
            formulaOrCode: `import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

export const testStartLimiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args) => redisClient.sendCommand(args) }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,                   // 10 certified attempts per hour
  message: { error: 'Rate limit exceeded. Maximum 10 certified sessions per hour.' }
});`,
            codeLanguage: 'typescript',
          },
        ],
      },
    },
  ],

  roadmap: [
    {
      phase: 'Phase 1',
      title: 'Core Engine & Biometrics Foundation',
      duration: 'Weeks 1-3',
      status: 'Ready for Implementation',
      deliverables: [
        'Deterministic sub-millisecond typing state machine with performance.now()',
        'Standard 5-character word math (GWPM, NWPM, Accuracy, Error Penalty)',
        'Keystroke biometrics capture (Flight time, Dwell time, IKI distributions)',
        'Initial client-side anti-cheat defenses (Paste lock, isTrusted audit, tab blur listener)',
      ],
    },
    {
      phase: 'Phase 2',
      title: 'Backend API, Auth & PostgreSQL Architecture',
      duration: 'Weeks 4-6',
      status: 'Planned',
      deliverables: [
        'PostgreSQL schema migration (Users, TestSessions, Certificates, Biometrics)',
        'Express REST API setup with TypeScript, helmet, CORS, and Zod schema validation',
        'Dual-token JWT authentication (HttpOnly cookies + Redis refresh token rotation)',
        'Server-side deterministic replay engine to re-verify typing math and eliminate client spoofing',
      ],
    },
    {
      phase: 'Phase 3',
      title: 'Certification Minting & Cryptographic Engine',
      duration: 'Weeks 7-9',
      status: 'Planned',
      deliverables: [
        'Luhn mod-36 unique ID generator with Crockford Base32 encoding',
        'Ed25519 digital signature minting service for tamper-evident certification payloads',
        'Automated PDF certificate generator (Puppeteer / PDFKit) with embedded QR code',
        'Automated tier classification (Novice to Elite badges)',
      ],
    },
    {
      phase: 'Phase 4',
      title: 'Verification Portal & Recruiter Tools',
      duration: 'Weeks 10-12',
      status: 'Planned',
      deliverables: [
        'Zero-friction public verification portal with instant lookup and QR scanning',
        'Recruiter badge embedder (SVG badges for GitHub / LinkedIn / Portfolio)',
        'Redis-cached public verification endpoints with 60 req/min rate limiters',
        'Employer audit logging for compliance tracking',
      ],
    },
    {
      phase: 'Phase 5',
      title: 'Enterprise Proctoring, ATS Integration & Scale',
      duration: 'Weeks 13-16',
      status: 'Future Vision',
      deliverables: [
        'WebRTC webcam proctoring option for high-stakes enterprise certification',
        'Webhook integrations with Greenhouse, Lever, and Workday ATS systems',
        'Custom enterprise benchmark tests with company-specific technical vocabulary',
        'High-volume Redis cluster and read-replica PostgreSQL deployment',
      ],
    },
  ],

  directoryStructure: `typecert-platform/
├── .github/
│   └── workflows/
│       ├── ci.yml               # Lint, Unit tests, and TypeScript compilation
│       └── deploy.yml           # Automated deploy to Cloud Run / Kubernetes
├── client/                      # React 19 Single Page Application
│   ├── public/
│   │   ├── badges/              # SVG Tier badges (Novice to Elite)
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/              # Icons and branding illustrations
│   │   ├── components/
│   │   │   ├── typing-engine/   # Real-time typing display, caret, HUD
│   │   │   │   ├── Caret.tsx
│   │   │   │   ├── MetricHud.tsx
│   │   │   │   ├── VirtualKeyboard.tsx
│   │   │   │   └── TextDisplay.tsx
│   │   │   ├── verification/    # Employer validation views & QR scanner
│   │   │   │   ├── CredentialCard.tsx
│   │   │   │   ├── VerificationSearch.tsx
│   │   │   │   └── TelemetryReplayChart.tsx
│   │   │   ├── certificate/     # Official certificate renderer & PDF exporter
│   │   │   │   └── CertificateModal.tsx
│   │   │   └── common/          # Button, Modal, Badge, Tooltip primitives
│   │   ├── hooks/
│   │   │   ├── useTypingEngine.ts # Core state machine hook
│   │   │   ├── useAntiCheat.ts   # Biometric telemetry & paste interception
│   │   │   └── useAuth.ts        # User session & token management
│   │   ├── services/
│   │   │   ├── api.ts            # Axios / Fetch client with token refresh
│   │   │   └── crypto.ts         # Client-side hash checks
│   │   ├── types/                # Shared UI interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── server/                      # Node.js + Express REST API
│   ├── src/
│   │   ├── config/              # Environment variables, Redis & DB pools
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── session.controller.ts
│   │   │   ├── certificate.controller.ts
│   │   │   └── verification.controller.ts
│   │   ├── middleware/
│   │   │   ├── authenticate.ts  # JWT bearer token verification
│   │   │   ├── rateLimiter.ts   # Redis token bucket rate limiting
│   │   │   └── validateRequest.ts # Zod schema validator
│   │   ├── services/
│   │   │   ├── antiCheat.service.ts # Biometric analysis & anomaly detector
│   │   │   ├── cryptoSigner.service.ts # Ed25519 digital signature minting
│   │   │   ├── replayEngine.service.ts # Server-side test verification
│   │   │   └── pdfGenerator.service.ts # Official PDF generation
│   │   ├── routes/              # Express Router definitions
│   │   │   ├── auth.routes.ts
│   │   │   ├── session.routes.ts
│   │   │   └── certificate.routes.ts
│   │   └── app.ts               # Express bootstrap
│   └── package.json
├── database/                    # Database Migrations & Schemas
│   ├── drizzle/
│   │   └── migrations/          # Version-controlled SQL migrations
│   ├── schema.ts                # Drizzle ORM entity definitions
│   └── seed.ts                  # Test paragraphs and sample candidates
└── shared/                      # Universal types & validation contracts
    ├── types.ts                 # DTOs shared between Client and Server
    └── constants.ts             # Tier thresholds, WPM formulas, limits`,

  apiEndpoints: [
    {
      method: 'POST' as const,
      path: '/api/v1/auth/register',
      summary: 'Register a new candidate or recruiter account',
      authRequired: false,
      role: 'public' as const,
      rateLimit: '10 requests per 15 min per IP',
      requestBody: '{\n  "email": "candidate@example.com",\n  "password": "StrongPassword123!",\n  "fullName": "Jane Doe",\n  "role": "candidate"\n}',
      responseBody: '{\n  "userId": "usr_94e21ab",\n  "email": "candidate@example.com",\n  "accessToken": "eyJhbGciOi...",\n  "expiresIn": 900\n}',
    },
    {
      method: 'POST' as const,
      path: '/api/v1/auth/login',
      summary: 'Authenticate candidate; issues short-lived JWT + HttpOnly refresh cookie',
      authRequired: false,
      role: 'public' as const,
      rateLimit: '5 attempts per 15 min per IP',
      requestBody: '{\n  "email": "candidate@example.com",\n  "password": "StrongPassword123!"\n}',
      responseBody: '{\n  "accessToken": "eyJhbGciOi...",\n  "user": { "id": "usr_94e21ab", "fullName": "Jane Doe", "role": "candidate" }\n}',
    },
    {
      method: 'POST' as const,
      path: '/api/v1/tests/start',
      summary: 'Initialize a certified test session; issues signed cryptographic session token',
      authRequired: true,
      role: 'candidate' as const,
      rateLimit: '10 sessions per hour per user',
      requestBody: '{\n  "durationSeconds": 60,\n  "textCategory": "standard_literature"\n}',
      responseBody: '{\n  "sessionId": "ses_4a82b9c",\n  "sessionToken": "tok_991823abce",\n  "referenceText": "In professional environments, precision and velocity...",\n  "referenceTextId": "txt_101",\n  "startedAt": 1790950800\n}',
    },
    {
      method: 'POST' as const,
      path: '/api/v1/tests/submit',
      summary: 'Submit raw keystroke telemetry; runs anti-cheat analysis & mints certificate',
      authRequired: true,
      role: 'candidate' as const,
      rateLimit: '10 submissions per hour per user',
      requestBody: '{\n  "sessionId": "ses_4a82b9c",\n  "sessionToken": "tok_991823abce",\n  "durationSeconds": 60,\n  "typedText": "In professional environments...",\n  "keystrokes": [\n    { "char": "I", "down": 102.4, "up": 172.1, "isTrusted": true },\n    { "char": "n", "down": 221.8, "up": 289.4, "isTrusted": true }\n  ],\n  "telemetry": {\n    "pasteCount": 0,\n    "focusLossCount": 0\n  }\n}',
      responseBody: '{\n  "certificate": {\n    "id": "TC-MST-202610-8F92A4",\n    "tier": "MASTER",\n    "netWpm": 112,\n    "grossWpm": 115,\n    "accuracy": 99.1,\n    "signature": "ed25519:sig_8f92a40b38cf...",\n    "antiCheatScore": 99.4,\n    "proctorStatus": "VERIFIED"\n  }\n}',
    },
    {
      method: 'GET' as const,
      path: '/api/v1/certificates/verify/:publicCode',
      summary: 'Public zero-friction verification endpoint for employers and ATS systems',
      authRequired: false,
      role: 'public' as const,
      rateLimit: '60 requests per min per IP',
      responseBody: '{\n  "valid": true,\n  "certificate": {\n    "publicCode": "TC-MST-202610-8F92A4",\n    "candidateName": "Sarah Chen",\n    "tier": "MASTER",\n    "netWpm": 112,\n    "grossWpm": 115,\n    "accuracy": 99.1,\n    "consistency": 96.0,\n    "issuedAt": "2026-10-02T14:22:10Z",\n    "signatureValid": true,\n    "antiCheatAudit": "PASSED (99.4% Biometric Confidence)"\n  }\n}',
    },
    {
      method: 'GET' as const,
      path: '/api/v1/certificates/:publicCode/pdf',
      summary: 'Download official cryptographically watermarked high-res PDF certificate',
      authRequired: false,
      role: 'public' as const,
      rateLimit: '30 requests per min per IP',
      responseBody: 'Binary PDF Stream (application/pdf)',
    },
  ],
};
