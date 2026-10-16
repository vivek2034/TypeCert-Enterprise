/**
 * Persistent Storage Utilities (localStorage)
 * Ensures user certificates, test history, and settings persist across page reloads
 */

import { Certificate } from '../types';
import { SEED_CERTIFICATES } from './certGenerator';
import { SoundTheme } from './keyboardAudio';

export interface TestHistoryEntry {
  id: string;
  date: string;
  category: string;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  consistency: number;
  durationSeconds: number;
  antiCheatScore: number;
  certificateId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  title: string;
  soundTheme: SoundTheme;
  soundEnabled: boolean;
  caretStyle: 'line' | 'block' | 'underline';
  strictProctorMode: boolean;
  theme: 'dark' | 'light';
}

const CERTIFICATES_KEY = 'typecert_certificates_v1';
const HISTORY_KEY = 'typecert_history_v1';
const PROFILE_KEY = 'typecert_profile_v1';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Morgan',
  email: 'alex.morgan@certified.io',
  title: 'Full-Stack Software Engineer',
  soundTheme: 'cherry-blue',
  soundEnabled: true,
  caretStyle: 'line',
  strictProctorMode: false,
  theme: 'dark',
};

export const DEFAULT_HISTORY: TestHistoryEntry[] = [
  {
    id: 'th_01',
    date: '2026-10-14T09:30:00Z',
    category: 'Tech & Architecture',
    netWpm: 92,
    grossWpm: 95,
    accuracy: 98.4,
    consistency: 94,
    durationSeconds: 60,
    antiCheatScore: 99.2,
    certificateId: 'TC-ADV-202610-84E91B',
  },
  {
    id: 'th_02',
    date: '2026-10-13T16:15:00Z',
    category: 'Legal & Court Reporting',
    netWpm: 84,
    grossWpm: 88,
    accuracy: 97.2,
    consistency: 91,
    durationSeconds: 60,
    antiCheatScore: 98.8,
  },
  {
    id: 'th_03',
    date: '2026-10-12T11:40:00Z',
    category: 'Benchmark Words',
    netWpm: 104,
    grossWpm: 106,
    accuracy: 99.0,
    consistency: 96,
    durationSeconds: 30,
    antiCheatScore: 99.6,
    certificateId: 'TC-MST-202610-8F92A4',
  },
];

export function getStoredCertificates(): Certificate[] {
  try {
    const raw = localStorage.getItem(CERTIFICATES_KEY);
    if (!raw) {
      localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(SEED_CERTIFICATES));
      return SEED_CERTIFICATES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_CERTIFICATES;
  } catch {
    return SEED_CERTIFICATES;
  }
}

export function saveCertificate(cert: Certificate): Certificate[] {
  try {
    const existing = getStoredCertificates();
    const updated = [cert, ...existing.filter((c) => c.id !== cert.id)];
    localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [cert, ...SEED_CERTIFICATES];
  }
}

export function getStoredHistory(): TestHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(DEFAULT_HISTORY));
      return DEFAULT_HISTORY;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_HISTORY;
  } catch {
    return DEFAULT_HISTORY;
  }
}

export function saveHistoryEntry(entry: TestHistoryEntry): TestHistoryEntry[] {
  try {
    const existing = getStoredHistory();
    const updated = [entry, ...existing].slice(0, 50); // keep last 50
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [entry];
  }
}

export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: Partial<UserProfile>): UserProfile {
  try {
    const current = getStoredProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_PROFILE;
  }
}
