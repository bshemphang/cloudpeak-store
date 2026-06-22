'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import MountainRidgeDivider from '../../components/MountainRidgeDivider';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, isMock, signIn, signUp, signInWithGoogle } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const redirectUrl = searchParams.get('redirect') || '/profile';

  useEffect(() => {
    // If already logged in, redirect to target page
    if (!loading && user) {
      router.push(redirectUrl);
    }
  }, [user, loading, router, redirectUrl]);

  if (loading) {
    return <LoginLoading message="Loading session..." />;
  }

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setActionLoading(true);

    try {
      if (activeTab === 'login') {
        const res = await signIn(email, password);
        if (res?.error) {
          setErrorMsg(res.error);
        } else {
          router.push(redirectUrl);
        }
      } else {
        if (!fullName.trim()) {
          setErrorMsg('Full name is required.');
          setActionLoading(false);
          return;
        }
        const res = await signUp(email, password, fullName);
        if (res?.error) {
          setErrorMsg(res.error);
        } else {
          if (isMock) {
            // Mock registers and logs in immediately
            router.push(redirectUrl);
          } else {
            setSuccessMsg('Account created! Please check your email to verify your account, then log in.');
            setActiveTab('login');
            setPassword('');
          }
        }
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setActionLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res?.error) {
        setErrorMsg(res.error);
      } else if (isMock) {
        // Mock Google login logs in instantly client-side
        router.push(redirectUrl);
      }
    } catch {
      setErrorMsg('Failed to sign in with Google.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-storeWhite min-h-screen pb-24">
      <section className="bg-midnightNavy py-12 md:py-16 text-center px-4">
        <h1 className="font-display text-4xl md:text-6xl text-summitGold uppercase tracking-wide mb-2">
          {activeTab === 'login' ? 'Sign In' : 'Join the Club'}
        </h1>
        <p className="text-storeWhite/60 text-sm uppercase tracking-widest">
          {activeTab === 'login' ? 'Access your orders and saved address' : 'Create an account to checkout faster'}
        </p>
      </section>

      <MountainRidgeDivider />

      <div className="max-w-md mx-auto px-4 py-12">
        {/* Mock Sandbox Alert Banner */}
        {isMock && (
          <div className="mb-6 p-4 bg-summitGold/10 border border-summitGold/30 text-xs text-midnightNavy font-medium leading-relaxed rounded-sm flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-summitGoldDark">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-summitGold animate-ping"></span>
              Development Sandbox Mode
            </div>
            <p className="text-midnightNavy/85">
              Client-side Supabase credentials are not configured yet. The system is running in **Mock Mode** using localStorage. 
              Any login email/password will mock-authenticate instantly.
            </p>
          </div>
        )}

        <div className="bg-cardGray border border-borderGray p-6 md:p-8 shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-borderGray mb-6">
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
              }}
              className={`flex-1 pb-3 text-xs font-black uppercase tracking-widest text-center transition-colors ${
                activeTab === 'login'
                  ? 'border-b-2 border-summitGold text-midnightNavy'
                  : 'text-midnightNavy/50 hover:text-midnightNavy'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setErrorMsg('');
              }}
              className={`flex-1 pb-3 text-xs font-black uppercase tracking-widest text-center transition-colors ${
                activeTab === 'register'
                  ? 'border-b-2 border-summitGold text-midnightNavy'
                  : 'text-midnightNavy/50 hover:text-midnightNavy'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-200">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 text-xs font-semibold text-green-700 bg-green-50 border border-green-200">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleAuthAction} className="space-y-4">
            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-midnightNavy/60 mb-1.5">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Streetwear Enthusiast"
                  className="w-full border border-borderGray bg-storeWhite px-4 py-3 text-sm outline-none focus:border-summitGold transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-midnightNavy/60 mb-1.5">
                Email Address *
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-borderGray bg-storeWhite px-4 py-3 text-sm outline-none focus:border-summitGold transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-midnightNavy/60 mb-1.5">
                Password *
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full border border-borderGray bg-storeWhite px-4 py-3 text-sm outline-none focus:border-summitGold transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full bg-midnightNavy text-summitGold py-3.5 text-xs font-black uppercase tracking-widest hover:bg-midnightNavyLight transition-colors disabled:opacity-50 mt-2"
            >
              {actionLoading
                ? 'Processing...'
                : activeTab === 'login'
                ? 'Sign In'
                : 'Register'}
            </button>
          </form>

          <div className="relative my-6 flex items-center justify-center">
            <hr className="w-full border-borderGray" />
            <span className="absolute bg-cardGray px-3 text-[10px] font-bold uppercase tracking-widest text-midnightNavy/40">
              Or Connect With
            </span>
          </div>

          {/* Social Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={actionLoading}
            className="w-full flex items-center justify-center gap-3 border border-borderGray hover:border-midnightNavy/40 bg-storeWhite text-midnightNavy py-3 text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            {/* Google SVG Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.21-.63-.35-1.3-.35-2.08c0-.78.14-1.45.35-2.08V7.06h-2.85C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginLoading({ message = 'Loading login...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-storeWhite flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-summitGold border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs uppercase font-bold tracking-widest text-midnightNavy/60">{message}</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
}
