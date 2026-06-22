'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabaseClient, isClientSupabaseConfigured } from '../lib/supabase-client';

export type CustomerProfile = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type AuthUser = {
  id: string;
  email: string;
  token?: string; // Supabase JWT access token (for secure API queries)
  profile?: CustomerProfile;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  isMock: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<CustomerProfile>) => Promise<{ error?: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync state helpers for mock mode
  const getMockUsers = (): Record<string, { password?: string; profile?: CustomerProfile }> => {
    if (typeof window === 'undefined') return {};
    return JSON.parse(localStorage.getItem('cloudpeak_mock_users') || '{}');
  };

  const saveMockUsers = (users: Record<string, { password?: string; profile?: CustomerProfile }>) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cloudpeak_mock_users', JSON.stringify(users));
  };

  // Helper to load/save session in Supabase or Mock
  useEffect(() => {
    async function initSession() {
      if (isClientSupabaseConfigured && supabaseClient) {
        const client = supabaseClient;
        try {
          // 1. Get current session
          const { data: { session }, error: sessionError } = await client.auth.getSession();
          if (sessionError) throw sessionError;

          if (session?.user) {
            // 2. Fetch profile from DB
            const { data: profile, error: profileError } = await client
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Error fetching profile from Supabase:', profileError);
            }

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              token: session.access_token,
              profile: profile ? {
                fullName: profile.full_name || '',
                phone: profile.phone || '',
                address: profile.address || '',
                city: profile.city || '',
                state: profile.state || '',
                pincode: profile.pincode || '',
              } : undefined,
            });
          }
        } catch (err) {
          console.error('Supabase auth initialization error:', err);
        } finally {
          setLoading(false);
        }

        // 3. Listen to auth changes
        const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            const { data: profile } = await client
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              token: session.access_token,
              profile: profile ? {
                fullName: profile.full_name || '',
                phone: profile.phone || '',
                address: profile.address || '',
                city: profile.city || '',
                state: profile.state || '',
                pincode: profile.pincode || '',
              } : undefined,
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        });

        return () => subscription.unsubscribe();
      } else {
        // Fallback Mock Mode: check localStorage for session
        const currentMockUser = localStorage.getItem('cloudpeak_current_mock_user');
        if (currentMockUser) {
          try {
            const parsed = JSON.parse(currentMockUser) as AuthUser;
            // Refresh details from list in case it updated
            const mockUsers = getMockUsers();
            const savedDetails = mockUsers[parsed.email];
            setUser({
              ...parsed,
              profile: savedDetails?.profile || parsed.profile,
            });
          } catch {
            localStorage.removeItem('cloudpeak_current_mock_user');
          }
        }
        setLoading(false);
      }
    };

    initSession();
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    if (isClientSupabaseConfigured && supabaseClient) {
      const client = supabaseClient;
      try {
        const { data, error } = await client.auth.signUp({
          email,
          password,
        });
        if (error) return { error: error.message };

        if (data.user) {
          // Create database profile
          const { error: profileError } = await client.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName,
          });
          if (profileError) console.error('Failed to create profile row:', profileError);
        }

        return {};
      } catch (err: any) {
        return { error: err.message || 'Something went wrong.' };
      }
    } else {
      // Mock Mode: Register locally
      const mockUsers = getMockUsers();
      if (mockUsers[email.toLowerCase()]) {
        return { error: 'An account with this email already exists.' };
      }

      const newProfile: CustomerProfile = {
        fullName,
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
      };

      mockUsers[email.toLowerCase()] = {
        password,
        profile: newProfile,
      };

      saveMockUsers(mockUsers);

      // Log in immediately
      const loggedUser: AuthUser = {
        id: `mock-${Math.random().toString(36).substr(2, 9)}`,
        email: email.toLowerCase(),
        profile: newProfile,
      };
      localStorage.setItem('cloudpeak_current_mock_user', JSON.stringify(loggedUser));
      setUser(loggedUser);

      return {};
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (isClientSupabaseConfigured && supabaseClient) {
      try {
        const { error } = await supabaseClient!.auth.signInWithPassword({
          email,
          password,
        });
        if (error) return { error: error.message };
        return {};
      } catch (err: any) {
        return { error: err.message || 'Authentication failed.' };
      }
    } else {
      // Mock Mode: Verify locally
      const mockUsers = getMockUsers();
      const account = mockUsers[email.toLowerCase()];

      if (!account || account.password !== password) {
        return { error: 'Invalid email or password.' };
      }

      const loggedUser: AuthUser = {
        id: `mock-${Math.random().toString(36).substr(2, 9)}`,
        email: email.toLowerCase(),
        profile: account.profile,
      };
      localStorage.setItem('cloudpeak_current_mock_user', JSON.stringify(loggedUser));
      setUser(loggedUser);

      return {};
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (isClientSupabaseConfigured && supabaseClient) {
      try {
        const { error } = await supabaseClient!.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/profile` : undefined,
          },
        });
        if (error) return { error: error.message };
        return {};
      } catch (err: any) {
        return { error: err.message || 'Failed to initialize Google Sign-in.' };
      }
    } else {
      // Mock Mode: Simulate Google Login
      const mockEmail = 'streetwear-lover@gmail.com';
      const mockUsers = getMockUsers();

      if (!mockUsers[mockEmail]) {
        mockUsers[mockEmail] = {
          profile: {
            fullName: 'Streetwear Cultist',
            phone: '9876543210',
            address: '12 Peak View Road',
            city: 'Shillong',
            state: 'Meghalaya',
            pincode: '793001',
          },
        };
        saveMockUsers(mockUsers);
      }

      const loggedUser: AuthUser = {
        id: 'mock-google-id-1234',
        email: mockEmail,
        profile: mockUsers[mockEmail].profile,
      };

      localStorage.setItem('cloudpeak_current_mock_user', JSON.stringify(loggedUser));
      setUser(loggedUser);

      return {};
    }
  }, []);

  const signOut = useCallback(async () => {
    if (isClientSupabaseConfigured && supabaseClient) {
      await supabaseClient!.auth.signOut();
    } else {
      localStorage.removeItem('cloudpeak_current_mock_user');
      setUser(null);
    }
  }, []);

  const updateProfile = useCallback(async (updatedFields: Partial<CustomerProfile>) => {
    if (!user) return { error: 'User is not logged in.' };

    const newProfile: CustomerProfile = {
      fullName: updatedFields.fullName ?? user.profile?.fullName ?? '',
      phone: updatedFields.phone ?? user.profile?.phone ?? '',
      address: updatedFields.address ?? user.profile?.address ?? '',
      city: updatedFields.city ?? user.profile?.city ?? '',
      state: updatedFields.state ?? user.profile?.state ?? '',
      pincode: updatedFields.pincode ?? user.profile?.pincode ?? '',
    };

    if (isClientSupabaseConfigured && supabaseClient) {
      try {
        const { error } = await supabaseClient!.from('profiles').upsert({
          id: user.id,
          full_name: newProfile.fullName,
          phone: newProfile.phone,
          address: newProfile.address,
          city: newProfile.city,
          state: newProfile.state,
          pincode: newProfile.pincode,
          updated_at: newTimeISO(),
        });

        if (error) return { error: error.message };

        setUser((prev) => prev ? { ...prev, profile: newProfile } : null);
        return {};
      } catch (err: any) {
        return { error: err.message || 'Failed to update profile.' };
      }
    } else {
      // Mock Mode: Save locally
      const mockUsers = getMockUsers();
      if (mockUsers[user.email]) {
        mockUsers[user.email].profile = newProfile;
        saveMockUsers(mockUsers);
      }

      const updatedUser = { ...user, profile: newProfile };
      localStorage.setItem('cloudpeak_current_mock_user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return {};
    }
  }, [user]);

  function newTimeISO() {
    return new Date().toISOString();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isMock: !isClientSupabaseConfigured,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
