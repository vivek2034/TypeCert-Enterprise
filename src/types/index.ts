/**
 * Core Type Definitions for TypeCert Professional Platform
 */

export type CertificateTier = 'NOVICE' | 'INTERMEDIATE' | 'PROFICIENT' | 'ADVANCED' | 'MASTER' | 'ELITE';

export interface KeystrokeEvent {
  key: string;
  code: string;
  downTimestamp: number; // performance.now()
  upTimestamp?: number;
  dwellTime?: number;    // upTimestamp - downTimestamp
  flightTime?: number;   // downTimestamp(curr) - downTimestamp(prev)
  isTrusted: boolean;
  isError: boolean;
  charIndex: number;
}

export interface AntiCheatTelemetry {
  pastedDetected: boolean;
  pasteCount: number;
  untrustedEventsDetected: boolean;
  focusLostCount: number;
  totalKeystrokes: number;
  backspaceCount: number;
  meanFlightTimeMs: number;
  stdDevFlightTimeMs: number;
  meanDwellTimeMs: number;
  stdDevDwellTimeMs: number;
  artificialCadenceScore: number; // 0-100 (0 = human variance, 100 = synthetic robot)
  syntheticCadenceFlag: boolean;
  clientNonce: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface TypingMetrics {
  totalChars: number;
  correctChars: number;
  incorrectChars: number;
  unfixedErrors: number;
  grossWpm: number;
  netWpm: number;
  accuracyPercentage: number;
  consistencyPercentage: number; // based on flight time std dev
  durationSeconds: number;
  elapsedSeconds: number;
}

export interface Certificate {
  id: string; // e.g. "TC-ADV-202610-8F92A4"
  publicCode: string;
  candidateName: string;
  candidateEmail: string;
  tier: CertificateTier;
  netWpm: number;
  grossWpm: number;
  accuracyPercentage: number;
  consistencyPercentage: number;
  durationSeconds: number;
  issuedAt: string;
  expiresAt: string;
  signature: string; // HMAC-SHA256 or Ed25519 hash
  qrPayload: string;
  antiCheatScore: number; // 0-100% integrity
  proctorStatus: 'VERIFIED' | 'FLAGGED' | 'REVOKED';
  telemetrySummary: {
    dwellMean: number;
    flightStdDev: number;
    backspaceCorrections: number;
    focusLost: number;
  };
}

export interface VerificationResult {
  isValid: boolean;
  certificate?: Certificate;
  error?: string;
  verifiedAt: string;
  auditId: string;
}

export interface TestSessionState {
  sessionId: string;
  sampleText: string;
  userInput: string;
  isActive: boolean;
  isCompleted: boolean;
  startTime: number | null;
  endTime: number | null;
  durationSeconds: number;
  keystrokes: KeystrokeEvent[];
  telemetry: AntiCheatTelemetry;
  metrics: TypingMetrics;
}

export interface EndpointDefinition {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  authRequired: boolean;
  role: 'public' | 'candidate' | 'employer' | 'admin';
  rateLimit: string;
  requestBody?: string;
  responseBody: string;
}
