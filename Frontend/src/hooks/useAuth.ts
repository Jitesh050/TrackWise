import { useState, useEffect } from 'react';
import { userService, UserProfileUpdate } from '@/lib/userService';

// Mock User and Session types that were previously imported from '@supabase/supabase-js'
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
}

export interface Session {
  user: User | null;
  // Add any other session properties your application uses
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  userRole: 'admin' | 'user' | null;
}

// A simple in-memory store for the user state
let memoryUser: User | null = null;
let memorySession: Session | null = null;
let memoryUserRole: 'admin' | 'user' | null = null;

export const useAuth = (): AuthState & {
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<{ error: any }>;
  getUserProfile: () => User | null;
} => {
  const [user, setUser] = useState<User | null>(memoryUser);
  const [session, setSession] = useState<Session | null>(memorySession);
  const [isLoading, setIsLoading] = useState(false); // Set to false as we are not doing async operations
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(memoryUserRole);

  useEffect(() => {
    // On initial load, we can check if we have a user in our "memory"
    setUser(memoryUser);
    setSession(memorySession);
    setUserRole(memoryUserRole);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate a successful login with default profile data
    const mockUser: User = { 
      id: 'mock-user-id', 
      email,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1990-01-01',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const mockSession: Session = { user: mockUser };
    
    memoryUser = mockUser;
    memorySession = mockSession;
    // for testing purposes, let's say 'admin@example.com' is an admin
    memoryUserRole = email === 'admin@example.com' ? 'admin' : 'user';

    setUser(mockUser);
    setSession(mockSession);
    setUserRole(memoryUserRole);
    setIsLoading(false);
    
    return { error: null };
  };

  const signUp = async (email: string, password: string) => {
    // For simplicity, signUp will just sign in the user directly
    return signIn(email, password);
  };

  const signOut = async () => {
    setIsLoading(true);
    memoryUser = null;
    memorySession = null;
    memoryUserRole = null;

    setUser(null);
    setSession(null);
    setUserRole(null);
    setIsLoading(false);
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!memoryUser) {
      return { error: { message: 'No user logged in' } };
    }

    setIsLoading(true);
    
    try {
      // Call backend API to update profile
      const response = await userService.updateUserProfile(memoryUser.id, profileData as UserProfileUpdate);
      
      if (response.success && response.user) {
        // Update the user profile data
        memoryUser = response.user;
        memorySession = { user: response.user };
        
        setUser(response.user);
        setSession(memorySession);
        
        return { error: null };
      } else {
        return { error: { message: response.error || 'Failed to update profile' } };
      }
    } catch (error) {
      return { error: { message: 'Network error occurred' } };
    } finally {
      setIsLoading(false);
    }
  };

  const getUserProfile = () => {
    return memoryUser;
  };

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