import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, inMemoryPersistence, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

// Initialize once in the browser environment
const requiredKeys: Array<keyof typeof firebaseConfig> = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const missing = requiredKeys.filter((k) => !firebaseConfig[k]);
if (missing.length) {
  // Provide a clear console error to guide setup

  console.error(
    `Firebase env missing/invalid: ${missing.join(', ')}.\n` +
    'Add your Firebase Web App config to a .env file using VITE_FIREBASE_* keys and restart the dev server.'
  );
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
// Ensure sessions are not restored across reloads or new tabs (always require fresh login)
void setPersistence(auth, inMemoryPersistence)
  .then(() => {
    // Clear any previously persisted session from older persistence
    if (auth.currentUser) {
      return signOut(auth);
    }
  })
  .catch(() => {
    // ignore; default persistence applies
  });
export const db = getFirestore(app);
export default app;
