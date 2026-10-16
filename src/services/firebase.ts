import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  collection,
  query,
  getDocs,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { Certificate } from '../types';
import { TestHistoryEntry, UserProfile } from '../utils/storage';

// Initialize Firebase securely via environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

const firestoreDatabaseId =
  import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || undefined;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without passing firestoreDatabaseId
export const db = getFirestore(app, firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handling Specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Authentication helpers
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Sync user profile in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userData = {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Candidate',
      photoURL: user.photoURL || '',
      role: 'candidate',
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(userDocRef, userData, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`);
    }

    return user;
  } catch (error) {
    console.error('Google Sign-In failed:', error);
    throw error;
  }
}

export async function signOutUser() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign-Out failed:', error);
    throw error;
  }
}

// Firestore Certificate Persistence
export async function saveCertificateToFirestore(cert: Certificate): Promise<void> {
  const path = `certificates/${cert.id}`;
  try {
    const certRef = doc(db, 'certificates', cert.id);
    await setDoc(certRef, {
      ...cert,
      userId: auth.currentUser?.uid || 'anonymous',
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getCertificateFromFirestore(certId: string): Promise<Certificate | null> {
  const cleanId = certId.trim();
  const path = `certificates/${cleanId}`;
  try {
    const certRef = doc(db, 'certificates', cleanId);
    const snap = await getDoc(certRef);
    if (snap.exists()) {
      return snap.data() as Certificate;
    }

    // Fallback: try uppercase document ID
    const upperRef = doc(db, 'certificates', cleanId.toUpperCase());
    const upperSnap = await getDoc(upperRef);
    if (upperSnap.exists()) {
      return upperSnap.data() as Certificate;
    }

    // Fallback: query collection for publicCode or id match
    const colRef = collection(db, 'certificates');
    const q1 = query(colRef, where('publicCode', '==', cleanId.toUpperCase()), limit(1));
    const snap1 = await getDocs(q1);
    if (!snap1.empty) {
      return snap1.docs[0].data() as Certificate;
    }

    const q2 = query(colRef, where('id', '==', cleanId.toUpperCase()), limit(1));
    const snap2 = await getDocs(q2);
    if (!snap2.empty) {
      return snap2.docs[0].data() as Certificate;
    }

    return null;
  } catch (error) {
    console.warn('Firestore certificate lookup warning:', error);
    return null;
  }
}

export async function getPublicCertificatesFromFirestore(): Promise<Certificate[]> {
  const path = 'certificates';
  try {
    const colRef = collection(db, 'certificates');
    const q = query(colRef, limit(50));
    const snap = await getDocs(q);
    const certs: Certificate[] = [];
    snap.forEach((d) => {
      certs.push(d.data() as Certificate);
    });
    return certs;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Firestore User Test Sessions
export async function saveSessionToFirestore(
  userId: string,
  session: TestHistoryEntry
): Promise<void> {
  const path = `users/${userId}/sessions/${session.id}`;
  try {
    const sessRef = doc(db, 'users', userId, 'sessions', session.id);
    await setDoc(sessRef, {
      id: session.id,
      userId,
      category: session.category,
      netWpm: session.netWpm,
      grossWpm: session.grossWpm,
      accuracy: session.accuracy,
      consistency: session.consistency,
      durationSeconds: session.durationSeconds,
      antiCheatScore: session.antiCheatScore,
      createdAt: session.date,
      certificateId: session.certificateId || '',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserSessionsFromFirestore(userId: string): Promise<TestHistoryEntry[]> {
  const path = `users/${userId}/sessions`;
  try {
    const colRef = collection(db, 'users', userId, 'sessions');
    const snap = await getDocs(colRef);
    const list: TestHistoryEntry[] = [];
    snap.forEach((d) => {
      const data = d.data();
      list.push({
        id: data.id,
        date: data.createdAt,
        category: data.category,
        netWpm: data.netWpm,
        grossWpm: data.grossWpm,
        accuracy: data.accuracy,
        consistency: data.consistency,
        durationSeconds: data.durationSeconds,
        antiCheatScore: data.antiCheatScore,
        certificateId: data.certificateId,
      });
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
