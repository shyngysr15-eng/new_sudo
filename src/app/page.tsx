'use client';

import React, { useEffect } from 'react';
import { SwipeContainer } from '../components/shell/SwipeContainer';
import { Smartphone, Zap, Sparkles, MoveVertical, Hammer, Code, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuthStore } from '../store/useAuthStore';
import { AuthGateway } from '../components/shell/AuthGateway';

export default function Home() {
  const { session, loading, setSession, setLoading, fetchProfile } = useAuthStore();

  useEffect(() => {
    // 1. Initial Session Retrieval
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
      } catch (err) {
        console.error('Error fetching session:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // 2. Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        await fetchProfile(newSession.user.id);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setLoading, fetchProfile]);

  // Loading Screen (Tactile Neo-Brutalist design)
  if (loading) {
    return (
      <div className="relative min-h-[100dvh] w-full bg-[#FAF6EE] flex flex-col items-center justify-center font-mono p-6">
        <div className="p-6 bg-[#FFFDF9] border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-4 text-black">
          <Loader2 className="w-10 h-10 animate-spin text-[#3498DB] stroke-[2.5px]" />
          <span className="text-xs font-black uppercase tracking-wider">
            Verifying Credentials...
          </span>
        </div>
      </div>
    );
  }

  // Not logged in -> Render the Auth Gateway
  if (!session) {
    return <AuthGateway />;
  }

  // Logged in -> Render Main Workspace Wrapper
  return (
    <div className="relative min-h-[100dvh] w-full bg-[#FAF6EE] flex items-center justify-center overflow-hidden font-mono p-0 md:p-8">
      
      {/* Dynamic Voxel Ambient Background - CSS grid & floating particle shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 hidden md:block">
        <div 
          className="absolute inset-0 bg-neutral-900/[0.04]"
          style={{
            backgroundImage: 'radial-gradient(#171717 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        {/* Floating cozy block 1 */}
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[8%] w-16 h-16 bg-[#E8F4F8] border-2 border-neutral-950 rounded-xl shadow-[4px_4px_0_0_#171717]"
        />
        {/* Floating cozy block 2 */}
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[15%] left-[12%] w-12 h-12 bg-[#EEF7F2] border-2 border-neutral-950 rounded-lg shadow-[3px_3px_0_0_#171717]"
        />
        {/* Floating cozy block 3 */}
        <motion.div 
          animate={{ y: [0, -25, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[20%] right-[10%] w-14 h-14 bg-[#FAF6EE] border-2 border-neutral-950 rounded-xl shadow-[4px_4px_0_0_#171717]"
        />
      </div>

      {/* Main Workspace Wrapper (Centered Layout on Desktop) */}
      <div className="relative z-10 w-full h-[100dvh] md:h-auto max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12">
        
        {/* Left Side: Tech Architecture & Spec Panel (Desktop Only) */}
        <div className="hidden md:flex flex-col max-w-sm text-neutral-800 gap-5 p-6 bg-[#FAF6EE] border-2 border-neutral-900 rounded-3xl shadow-[6px_6px_0_0_#171717] select-none">
          <div className="flex items-center gap-2 border-b-2 border-neutral-300 pb-3">
            <Hammer className="w-5 h-5 text-[#8D7B68]" />
            <h2 className="font-extrabold uppercase text-sm tracking-wider text-neutral-900">Architecture Spec</h2>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold leading-tight uppercase tracking-tight text-neutral-900">
              Cozy Sudoku <br />Swipe Shell
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              A production-ready vertical navigation loop utilizing hardware acceleration for native-feeling 60fps+ transitions.
            </p>
          </div>

          {/* Feature Specs */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded bg-[#E8F4F8] border border-[#A9C7D3] mt-0.5">
                <Zap className="w-3.5 h-3.5 text-sky-700" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase text-neutral-800">GPU Accelerated</span>
                <span className="text-[9px] text-neutral-500 leading-normal">Bypasses main thread via composite translates and will-change styling.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded bg-[#EEF7F2] border border-[#A9D3B9] mt-0.5">
                <MoveVertical className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase text-neutral-800">Infinite Virtual Ring</span>
                <span className="text-[9px] text-neutral-500 leading-normal">Maintains exactly 3 full-screen viewport DOM layers to prevent memory leaks.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded bg-[#FFE699]/60 border border-[#D4A325] mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase text-neutral-800">Touch & Wheel Physics</span>
                <span className="text-[9px] text-neutral-500 leading-normal">Debounces micro-swipes and integrates fluid spring physics.</span>
              </div>
            </div>
          </div>

          {/* Desktop Controls Guide */}
          <div className="bg-[#EBE3D5]/50 border border-neutral-300 rounded-xl p-3 flex flex-col gap-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" /> Desktop Shortcuts
            </span>
            <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-neutral-700 uppercase">
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white border border-neutral-400 rounded shadow-sm">↑</kbd>
                <span>Swipe Up</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white border border-neutral-400 rounded shadow-sm">↓</kbd>
                <span>Swipe Down</span>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 pt-1 border-t border-dashed border-neutral-300">
                <kbd className="px-1.5 py-0.5 bg-white border border-neutral-400 rounded shadow-sm">Wheel</kbd>
                <span>Scroll Trackpad</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Gorgeous Smartphone Container mockup on Desktop */}
        <div className="relative w-full h-[100dvh] md:h-[760px] md:w-[360px] flex-shrink-0">
          
          {/* Bezel frame wrapper (desktop only) */}
          <div className="absolute inset-0 hidden md:block bg-neutral-900 rounded-[48px] p-4 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.4),0_0_0_2px_rgba(25,25,25,0.8)] border border-neutral-700 z-20 pointer-events-none">
            {/* Phone Speaker Notch */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-neutral-950 rounded-full flex items-center justify-center">
              {/* Speaker mesh */}
              <div className="w-10 h-1 bg-neutral-800 rounded-full" />
              {/* Camera dot */}
              <div className="w-2.5 h-2.5 bg-neutral-900 border border-neutral-800 rounded-full ml-3" />
            </div>
            
            {/* Side Action Buttons (aesthetic) */}
            <div className="absolute -left-1.5 top-28 w-1 h-12 bg-neutral-700 rounded-r" />
            <div className="absolute -left-1.5 top-44 w-1 h-16 bg-neutral-700 rounded-r" />
            <div className="absolute -left-1.5 top-64 w-1 h-16 bg-neutral-700 rounded-r" />
            <div className="absolute -right-1.5 top-40 w-1 h-20 bg-neutral-700 rounded-l" />
          </div>

          {/* Actual Screen Content viewport - fills screen on mobile, inside bezel on desktop */}
          <div className="w-full h-full md:rounded-[36px] overflow-hidden md:shadow-[inset_0_0_12px_rgba(0,0,0,0.8)] border-0 md:border-[10px] border-neutral-900 bg-neutral-950 relative z-10 transform-gpu">
            <SwipeContainer />
          </div>
        </div>

      </div>
    </div>
  );
}
