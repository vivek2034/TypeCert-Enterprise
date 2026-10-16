/**
 * Certificate Generator & Cryptographic Verification Utility
 * Implements unique ID minting, checksum validation, and cryptographic signature simulation
 */

import { Certificate, CertificateTier } from '../types';

export function determineTier(netWpm: number): CertificateTier {
  if (netWpm >= 120) return 'ELITE';
  if (netWpm >= 100) return 'MASTER';
  if (netWpm >= 80) return 'ADVANCED';
  if (netWpm >= 60) return 'PROFICIENT';
  if (netWpm >= 40) return 'INTERMEDIATE';
  return 'NOVICE';
}

export function getTierColor(tier: CertificateTier): {
  bg: string;
  text: string;
  border: string;
  glow: string;
  badge: string;
} {
  switch (tier) {
    case 'ELITE':
      return {
        bg: 'bg-purple-950/40',
        text: 'text-purple-400',
        border: 'border-purple-500/40',
        glow: 'shadow-purple-500/20',
        badge: 'bg-purple-500 text-white',
      };
    case 'MASTER':
      return {
        bg: 'bg-amber-950/40',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        glow: 'shadow-amber-500/20',
        badge: 'bg-amber-500 text-black font-semibold',
      };
    case 'ADVANCED':
      return {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        glow: 'shadow-emerald-500/20',
        badge: 'bg-emerald-500 text-black font-semibold',
      };
    case 'PROFICIENT':
      return {
        bg: 'bg-cyan-950/40',
        text: 'text-cyan-400',
        border: 'border-cyan-500/40',
        glow: 'shadow-cyan-500/20',
        badge: 'bg-cyan-500 text-black font-semibold',
      };
    case 'INTERMEDIATE':
      return {
        bg: 'bg-blue-950/40',
        text: 'text-blue-400',
        border: 'border-blue-500/40',
        glow: 'shadow-blue-500/20',
        badge: 'bg-blue-500 text-white',
      };
    default:
      return {
        bg: 'bg-slate-900/40',
        text: 'text-slate-400',
        border: 'border-slate-700',
        glow: 'shadow-slate-500/10',
        badge: 'bg-slate-700 text-white',
      };
  }
}

/**
 * Calculates a Luhn mod-36 checksum character for typo protection
 */
export function calculateChecksum(input: string): string {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    const val = chars.indexOf(input[i]);
    const factor = (i % 2 === 0) ? 1 : 2;
    sum += (val >= 0 ? val : 0) * factor;
  }
  return chars[sum % chars.length];
}

/**
 * Generates an official Certificate ID
 * Format: TC-[TIER_CODE]-[YYYYMM]-[6_HEX_ENTROPY][CHECKSUM]
 * Example: TC-ADV-202610-A9F4E2
 */
export function generateCertificateId(tier: CertificateTier): string {
  const tierCodes: Record<CertificateTier, string> = {
    ELITE: 'ELT',
    MASTER: 'MST',
    ADVANCED: 'ADV',
    PROFICIENT: 'PRF',
    INTERMEDIATE: 'INT',
    NOVICE: 'NOV',
  };

  const code = tierCodes[tier] || 'GEN';
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  // 5 chars entropy
  const entropyChars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  let entropy = '';
  for (let i = 0; i < 5; i++) {
    entropy += entropyChars[Math.floor(Math.random() * entropyChars.length)];
  }

  const rawString = `${code}${yearMonth}${entropy}`;
  const checksum = calculateChecksum(rawString);

  return `TC-${code}-${yearMonth}-${entropy}${checksum}`;
}

/**
 * Simulates generating a SHA-256 HMAC digital signature
 */
export function generateDigitalSignature(certId: string, netWpm: number, accuracy: number, timestamp: string): string {
  const payload = `${certId}:${netWpm}:${accuracy}:${timestamp}:SEC_PROCTOR_KEY_V1`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hexPart = Math.abs(hash).toString(16).padStart(8, '0');
  return `ed25519:sig_${hexPart}a9b3f742c01d4e9821804b38ca`;
}

/**
 * Seed repository of verified candidate certificates for instant testing in the Verification Portal
 */
export const SEED_CERTIFICATES: Certificate[] = [
  {
    id: 'TC-MST-202610-8F92A4',
    publicCode: 'TC-MST-202610-8F92A4',
    candidateName: 'Sarah Chen',
    candidateEmail: 'sarah.chen@alum.mit.edu',
    tier: 'MASTER',
    netWpm: 112,
    grossWpm: 115,
    accuracyPercentage: 99.1,
    consistencyPercentage: 96,
    durationSeconds: 60,
    issuedAt: '2026-10-02T14:22:10Z',
    expiresAt: '2028-10-02T14:22:10Z',
    signature: 'ed25519:sig_8f92a40b38cf402dae918231c9e',
    qrPayload: 'https://typecert.org/verify/TC-MST-202610-8F92A4',
    antiCheatScore: 99.4,
    proctorStatus: 'VERIFIED',
    telemetrySummary: {
      dwellMean: 68,
      flightStdDev: 24.3,
      backspaceCorrections: 3,
      focusLost: 0,
    },
  },
  {
    id: 'TC-ADV-202609-5D71C9',
    publicCode: 'TC-ADV-202609-5D71C9',
    candidateName: 'Alex Rivera',
    candidateEmail: 'arivera.dev@gmail.com',
    tier: 'ADVANCED',
    netWpm: 88,
    grossWpm: 91,
    accuracyPercentage: 97.8,
    consistencyPercentage: 93,
    durationSeconds: 60,
    issuedAt: '2026-09-18T09:14:32Z',
    expiresAt: '2028-09-18T09:14:32Z',
    signature: 'ed25519:sig_5d71c9fa91304e28bb184209acc',
    qrPayload: 'https://typecert.org/verify/TC-ADV-202609-5D71C9',
    antiCheatScore: 98.7,
    proctorStatus: 'VERIFIED',
    telemetrySummary: {
      dwellMean: 76,
      flightStdDev: 31.8,
      backspaceCorrections: 5,
      focusLost: 0,
    },
  },
  {
    id: 'TC-PRF-202610-3E84B7',
    publicCode: 'TC-PRF-202610-3E84B7',
    candidateName: 'David Kim',
    candidateEmail: 'dkim.legal@outlook.com',
    tier: 'PROFICIENT',
    netWpm: 68,
    grossWpm: 70,
    accuracyPercentage: 98.2,
    consistencyPercentage: 90,
    durationSeconds: 60,
    issuedAt: '2026-10-10T16:45:00Z',
    expiresAt: '2028-10-10T16:45:00Z',
    signature: 'ed25519:sig_3e84b7119da03ec8481abf021e',
    qrPayload: 'https://typecert.org/verify/TC-PRF-202610-3E84B7',
    antiCheatScore: 97.9,
    proctorStatus: 'VERIFIED',
    telemetrySummary: {
      dwellMean: 82,
      flightStdDev: 38.5,
      backspaceCorrections: 4,
      focusLost: 0,
    },
  },
  {
    id: 'TC-ELT-202608-9A13F0',
    publicCode: 'TC-ELT-202608-9A13F0',
    candidateName: 'Elena Rostova',
    candidateEmail: 'e.rostova@datadoghq.com',
    tier: 'ELITE',
    netWpm: 134,
    grossWpm: 136,
    accuracyPercentage: 99.4,
    consistencyPercentage: 98,
    durationSeconds: 60,
    issuedAt: '2026-08-25T11:05:40Z',
    expiresAt: '2028-08-25T11:05:40Z',
    signature: 'ed25519:sig_9a13f0bc83e201a973ff8193ac',
    qrPayload: 'https://typecert.org/verify/TC-ELT-202608-9A13F0',
    antiCheatScore: 100,
    proctorStatus: 'VERIFIED',
    telemetrySummary: {
      dwellMean: 54,
      flightStdDev: 18.2,
      backspaceCorrections: 2,
      focusLost: 0,
    },
  },
];
