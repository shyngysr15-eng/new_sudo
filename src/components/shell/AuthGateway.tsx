'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuthStore } from '../../store/useAuthStore';
import { Lock, Mail, User as UserIcon, LogIn, UserPlus } from 'lucide-react';

export const AuthGateway: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  const validateForm = (): boolean => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Email and password are required.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return false;
    }

    if (isSignUp && (!nickname || nickname.trim().length < 3)) {
      setErrorMsg('Nickname must be at least 3 characters.');
      return false;
    }

    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        // Sign Up with custom nickname in options.data metadata
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nickname: nickname.trim(),
            },
          },
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          setSuccessMsg('Account created and logged in successfully!');
          await fetchProfile(data.session.user.id);
        } else {
          setSuccessMsg('Registration successful! Please check your email for confirmation.');
        }
      } else {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          setSuccessMsg('Logged in successfully!');
          await fetchProfile(data.session.user.id);
        }
      }
    } catch (err: any) {
      console.error('Authentication Error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center bg-[#FAF6EE] p-6 font-mono">
      <div className="w-full max-w-sm bg-[#FFFDF9] border-[3px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
        
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black uppercase tracking-wider">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1 uppercase font-bold">
            {isSignUp ? 'Join Sudoku Sandbox' : 'Welcome back, player!'}
          </p>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 border-2 border-red-500 bg-red-100 text-red-700 text-xs font-bold rounded-lg uppercase">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 border-2 border-emerald-500 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg uppercase">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          
          {/* Nickname (Sign Up Only) */}
          {isSignUp && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-wide">Nickname</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <UserIcon className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="sudoku_pro"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  disabled={loading}
                  className="w-full pl-9 pr-3 py-2 border-2 border-black rounded-lg text-sm bg-white placeholder-neutral-400 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full pl-9 pr-3 py-2 border-2 border-black rounded-lg text-sm bg-white placeholder-neutral-400 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wide">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-9 pr-3 py-2 border-2 border-black rounded-lg text-sm bg-white placeholder-neutral-400 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 border-2 border-black bg-[#2ECC71] text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-100 ease-out flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Processing...</span>
            ) : isSignUp ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-neutral-300">
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="text-[10px] font-black uppercase tracking-wider text-neutral-600 hover:text-black transition-colors duration-100 underline decoration-2 cursor-pointer"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthGateway;
