/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore';

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
  role?: 'admin' | 'user';
}

export interface Session {
  user: User | null;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  userRole: 'admin' | 'user' | null;
}

const mapFirebaseUser = async (fbUser: FirebaseUser): Promise<User> => {
  // Try normal users collection first
  const userDocRef = doc(db, 'users', fbUser.uid);
  const userSnap = await getDoc(userDocRef);
  if (userSnap.exists()) {
    const data = userSnap.data() as Partial<User>;
    return {
      id: fbUser.uid,
      email: fbUser.email || undefined,
      role: 'user',
      ...data,
    } as User;
  }

  // Fallback to admins collection
  const adminDocRef = doc(db, 'admins', fbUser.uid);
  const adminSnap = await getDoc(adminDocRef);
  if (adminSnap.exists()) {
    const data = adminSnap.data() as Partial<User>;
    return {
      id: fbUser.uid,
      email: fbUser.email || undefined,
      role: 'admin',
      ...data,
    } as User;
  }

  // If neither doc exists, create a minimal user doc on first sign-in
  await setDoc(userDocRef, {
    email: fbUser.email || null,
    role: 'user',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
  return {
    id: fbUser.uid,
    email: fbUser.email || undefined,
    role: 'user',
  } as User;
};

export const useAuth = (): AuthState & {
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<{ error: any }>;
  getUserProfile: () => User | null;
} => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setSession(null);
        setUserRole(null);
        setIsLoading(false);
        return;
      }
      try {
        const mapped = await mapFirebaseUser(fbUser);
        setUser(mapped);
        setSession({ user: mapped });
        setUserRole((mapped.role as 'admin' | 'user') || 'user');
      } finally {
        setIsLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, 'users', cred.user.uid);
      await setDoc(userRef, {
        email,
        role: 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      if (!auth.currentUser) return { error: { message: 'No user logged in' } };
      // Decide collection by detected role
      const targetCollection = (userRole === 'admin') ? 'admins' : 'users';
      const userRef = doc(db, targetCollection, auth.currentUser.uid);
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
      });
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const getUserProfile = () => user;

  return {
    user,
    session,
    isLoading,
    isAdmin: userRole === 'admin',
    userRole,
    signIn,
    signUp,
    signOut,
    updateProfile,
    getUserProfile,
  };
};