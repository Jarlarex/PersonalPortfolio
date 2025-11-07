import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const;

function validateFirebaseConfig() {
  const missing = requiredEnvVars.filter(
    (envVar) => !process.env[envVar] || process.env[envVar] === 'YOUR_KEY' || process.env[envVar] === 'YOUR_DOMAIN' || process.env[envVar] === 'YOUR_PROJECT_ID' || process.env[envVar] === 'YOUR_BUCKET' || process.env[envVar] === 'YOUR_SENDER' || process.env[envVar] === 'YOUR_APP_ID'
  );

  if (missing.length > 0) {
    console.warn(
      `⚠️  Missing or placeholder Firebase configuration: ${missing.join(', ')}\n` +
        'Please set these environment variables in .env.local\n' +
        'See .env.example for required variables.'
    );
    return false;
  }

  return true;
}

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton pattern)
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

const isConfigValid = validateFirebaseConfig();

if (isConfigValid) {
  // Only initialize if config is valid and not already initialized
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  } else {
    // Use existing app
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
}

// Export instances (will be undefined if config is invalid)
export { app, auth, db, storage };

// Helper to check if Firebase is initialized
export function isFirebaseInitialized(): boolean {
  return !!(app && auth && db && storage);
}

// Helper to get Firebase instances safely
export function getFirebaseInstances() {
  if (!isFirebaseInitialized()) {
    throw new Error(
      'Firebase is not initialized. Please check your environment variables.'
    );
  }

  return {
    app: app!,
    auth: auth!,
    db: db!,
    storage: storage!,
  };
}

