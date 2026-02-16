import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, inMemoryPersistence, signOut, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

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

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

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
} catch (error) {
  console.error("Failed to initialize Firebase:", error);
  // Mock objects to prevent crash on module import
  // This allows the app to load even if Firebase is misconfigured, preventing white screen on critical error
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
  storage = {} as FirebaseStorage;
}

export { app, auth, db, storage };
export default app;
