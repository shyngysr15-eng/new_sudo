'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sliders, Users, Flame, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuthStore } from '../../store/useAuthStore';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../lib/soundManager';

export const MainMenuPanel: React.FC = () => {
  const { user } = useAuthStore();
  const { setView } = useGameStore();

  // Unified audio mute state
  const [isMuted, setIsMuted] = useState(true);
  const [realSolves, setRealSolves] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);

  // Initialize sound state on mount
  useEffect(() => {
    const mutedStatus = soundManager.getMutedStatus();
    setIsMuted(mutedStatus);
    
    // Auto-start cozy BGM arpeggio if not muted
    if (!mutedStatus) {
      soundManager.startBGM();
    }

    return () => {
      // Stop BGM when unmounting Main Menu if desired, or keep it running globally!
      // We will keep it running or let individual views trigger it.
    };
  }, []);

  // Fetch live daily solves to render calendar and streak from Supabase
  useEffect(() => {
    if (!user) return;

    const fetchSolves = async () => {
      try {
        const { data, error } = await supabase
          .from('daily_solves')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        const solves = data || [];
        setRealSolves(solves);

        // Calculate real consecutive daily solves streak
        const solvedDates = new Set(solves.map((s) => s.solve_date));
        let currentStreak = 0;
        const checkDate = new Date(); 

        while (true) {
          const dateStr = checkDate.toISOString().split('T')[0];
          if (solvedDates.has(dateStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            if (currentStreak === 0 && checkDate.toDateString() === new Date().toDateString()) {
              checkDate.setDate(checkDate.getDate() - 1);
              const yesterdayStr = checkDate.toISOString().split('T')[0];
              if (solvedDates.has(yesterdayStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
                continue;
              }
            }
            break;
          }
        }
        setStreak(currentStreak);
      } catch (err) {
        console.error('Error fetching calendar solves:', err);
      }
    };

    fetchSolves();
  }, [user]);

  // Unified audio toggle trigger
  const handleAudioToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMute(nextMuted);
    soundManager.playToggleClick();
  };

  const handleNavigate = (view: 'daily' | 'custom-select' | 'multiplayer-lobby') => {
    if (view === 'daily') {
      soundManager.playDailyClick();
    } else if (view === 'custom-select') {
      soundManager.playCustomClick();
    } else if (view === 'multiplayer-lobby') {
      soundManager.playMultiplayerClick();
    } else {
      soundManager.playClick();
    }
    setView(view);
  };

  const calendarDays = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const dateStr = d.toISOString().split('T')[0];
    const hasSolved = realSolves.some((s) => s.solve_date === dateStr);
    const isToday = d.toDateString() === new Date().toDateString();

    return {
      id: i,
      dayNum: d.getDate(),
      active: hasSolved,
      isToday,
    };
  });

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 select-none overflow-hidden bg-[#FFF9E6] text-black">
      
      {/* ========================================================================= */}
      {/* 🏛️ TOP ZONE: THE NEO-BRUTALIST STONE DASHBOARD (Top 1/3) */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full flex gap-4 h-[135px] mt-2">
        
        {/* Left Block: Calendar Grid */}
        <div 
          className="flex-[2] border-[3px] border-black rounded-xl p-3.5 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-[#FFFDF9]"
        >
          <div className="flex justify-between items-center border-b border-black pb-1.5 mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-black">
              Training Grid
            </span>
            <span className="text-[9px] font-black uppercase text-[#2ECC71] bg-[#2ECC71]/15 border border-black px-1.5 py-0.5 rounded">
              Active Logs
            </span>
          </div>

          {/* 7x4 Mathematically Perfect Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 w-full h-full max-h-[72px] items-center justify-items-center overflow-hidden">
            {calendarDays.map((day) => (
              <div 
                key={day.id}
                className="w-5.5 h-5.5 flex items-center justify-center"
              >
                {day.active ? (
                  <div className="w-5 h-5 rounded bg-[#3498DB] text-white flex items-center justify-center text-[9px] font-black leading-none">
                    {day.dayNum}
                  </div>
                ) : (
                  <div className="text-[9px] font-bold flex items-center justify-center w-5 h-5 leading-none text-neutral-500">
                    {day.dayNum}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Block: Streak Counter */}
        <div 
          className="flex-[1] border-[3px] border-black rounded-xl p-3.5 flex flex-col items-center justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-[#FFFDF9]"
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-center w-full border-b border-black pb-1.5 mb-1 text-black">
            Streak
          </span>

          <div className="flex flex-col items-center justify-center flex-1 my-1">
            <Flame className="w-7 h-7 stroke-[2.5px] fill-[#E74C3C] text-black" />
            <span className="text-sm font-black uppercase mt-1.5 leading-none text-black">
              {streak} {streak === 1 ? 'Day' : 'Days'}
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* HUD SETTINGS OPTIONS ROW (Single Unified Volume Toggle) */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full flex justify-between items-center my-auto py-3">
        <div className="flex gap-2">
          {/* SFX & Music Joint Switch */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ x: 3, y: 3, boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)' }}
            onClick={handleAudioToggle}
            className="w-9 h-9 rounded-lg border-2 border-black bg-[#FFFDF9] flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer outline-none transition-all duration-100 ease-out"
          >
            {isMuted ? (
              <VolumeX className="w-4.5 h-4.5 text-neutral-400 stroke-[2px]" />
            ) : (
              <Volume2 className="w-4.5 h-4.5 text-[#2ECC71] stroke-[2px]" />
            )}
          </motion.button>
        </div>

        {/* Brand identity badge */}
        <div className="flex flex-col items-end">
          <span className="text-[13px] font-black uppercase tracking-wide border-b-2 border-black leading-tight">
            Sudoku Sandbox
          </span>
          <span className="text-[8px] font-black uppercase tracking-widest mt-1 leading-none text-neutral-500">
            Neo-Brutalist v3.0
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🧩 BOTTOM ZONE: THE TRI-BLOCK GRID SYSTEM (Bottom 2/3) */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-[328px] mx-auto grid grid-cols-2 gap-4 mb-5">
        
        {/* BUTTON 1: DAILY CHALLENGES (SPANS BOTH COLUMNS) */}
        <div className="relative h-[95px] col-span-2">
          <motion.button
            whileTap={{ x: 6, y: 6, boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)' }}
            onClick={() => handleNavigate('daily')}
            className="absolute inset-0 border-[3px] border-black rounded-xl flex flex-row items-center justify-center gap-4 p-5 text-black outline-none cursor-pointer select-none transition-all duration-100 ease-out shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-[#2ECC71]"
          >
            <Trophy className="w-8 h-8 stroke-[2px]" />
            <span className="text-[14px] font-black uppercase tracking-widest">
              Daily Challenges
            </span>
          </motion.button>
        </div>

        {/* BUTTON 2: CUSTOM MODE */}
        <div className="relative h-[115px] col-span-1">
          <motion.button
            whileTap={{ x: 6, y: 6, boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)' }}
            onClick={() => handleNavigate('custom-select')}
            className="absolute inset-0 border-[3px] border-black rounded-xl flex flex-col items-center justify-center p-4 text-black outline-none cursor-pointer select-none transition-all duration-100 ease-out shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-[#3498DB]"
          >
            <Sliders className="w-8 h-8 stroke-[2px]" />
            <span className="text-[12px] font-black uppercase tracking-wider mt-2">
              Custom
            </span>
          </motion.button>
        </div>

        {/* BUTTON 3: MULTIPLAYER */}
        <div className="relative h-[115px] col-span-1">
          <motion.button
            whileTap={{ x: 6, y: 6, boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)' }}
            onClick={() => handleNavigate('multiplayer-lobby')}
            className="absolute inset-0 border-[3px] border-black rounded-xl flex flex-col items-center justify-center p-4 text-black outline-none cursor-pointer select-none transition-all duration-100 ease-out shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-[#E74C3C]"
          >
            <Users className="w-8 h-8 stroke-[2px]" />
            <span className="text-[12px] font-black uppercase tracking-wider mt-2">
              Multiplayer
            </span>
          </motion.button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🚀 BOTTOM NAVIGATION PROMPT INDICATOR */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full py-1 flex flex-col items-center gap-0.5 select-none animate-bounce text-black">
        <span className="text-[9px] font-black uppercase tracking-widest text-black/80">
          Swipe Up for Leaderboard
        </span>
        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

    </div>
  );
};

export default MainMenuPanel;
