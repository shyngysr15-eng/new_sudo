'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sliders, Users, Flame, Volume2, VolumeX, Music, Settings } from 'lucide-react';

export const MainMenuPanel: React.FC = () => {
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);

  // Premium 7x4 minimalist calendar dots (28 days)
  const calendarDays = Array.from({ length: 28 }, (_, i) => {
    // Mock some active streak days
    const activeDays = [2, 3, 4, 8, 9, 10, 11, 15, 16, 17, 22, 23, 24];
    return {
      id: i,
      active: activeDays.includes(i + 1),
      isToday: i + 1 === 25,
    };
  });

  return (
    <div className="relative w-full h-full text-neutral-800 flex flex-col justify-between p-6 select-none overflow-hidden bg-gradient-to-b from-[#F5F2EB] to-[#E6EEF2]">
      
      {/* ========================================================================= */}
      {/* 🏛️ TOP ZONE: THE PREMIUM 3D DASHBOARD (Top 1/3) */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full flex gap-4 h-[135px] mt-2">
        
        {/* Left Panel: Calendar Grid */}
        <div 
          className="flex-[2] bg-[#F9F6F0] border border-neutral-200 rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-300"
          style={{
            boxShadow: '0 8px 0 0 #EADCC9',
          }}
        >
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
              Training Grid
            </span>
            <span className="text-[9px] font-extrabold uppercase text-[#2A5C43] bg-[#2A5C43]/10 px-1.5 py-0.5 rounded-md">
              13 Active
            </span>
          </div>

          {/* 7x4 Perfect Recessed Dots */}
          <div className="grid grid-cols-7 gap-y-2 gap-x-1.5 mt-2">
            {calendarDays.map((day) => (
              <div 
                key={day.id}
                className="flex items-center justify-center aspect-square"
              >
                {day.isToday ? (
                  <motion.div 
                    animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2.5 h-2.5 rounded-full bg-[#4A90E2] border border-[#F9F6F0] shadow-[0_0_6px_#4A90E2]"
                  />
                ) : day.active ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2A5C43] border border-[#F9F6F0] shadow-sm" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-neutral-200/90 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.06)]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Streak Counter */}
        <div 
          className="flex-[1] bg-[#F9F6F0] border border-neutral-200 rounded-2xl p-3.5 flex flex-col items-center justify-between transition-all duration-300"
          style={{
            boxShadow: '0 8px 0 0 #EADCC9',
          }}
        >
          <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
            Streak
          </span>

          <div className="relative flex items-center justify-center my-1.5">
            <motion.div 
              animate={{ 
                scale: [1, 1.08, 1],
                y: [0, -1, 0] 
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-[#C0392B] flex items-center justify-center"
            >
              <Flame className="w-8 h-8 stroke-[1.25px] fill-[#C0392B]/10" />
            </motion.div>
            <span className="absolute text-[12px] font-black text-neutral-800 top-[7.5px] tracking-tighter">
              7
            </span>
          </div>

          <span className="text-[8px] font-bold uppercase tracking-wider text-neutral-600 bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded">
            Weeks
          </span>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* HUD OPTIONS ROW (Volume Controls & Brand Identity) */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full flex justify-between items-center my-auto py-3">
        <div className="flex gap-2">
          {/* SFX Switch */}
          <motion.button 
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
            onClick={() => setSfxEnabled(!sfxEnabled)}
            className="w-9 h-9 rounded-xl border border-neutral-200 bg-[#F9F6F0] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.05),0_2px_0_0_#EADCC9] active:translate-y-[2px] active:shadow-none transition-all duration-100 cursor-pointer outline-none"
          >
            {sfxEnabled ? <Volume2 className="w-4.5 h-4.5 text-neutral-700 stroke-[1.5px]" /> : <VolumeX className="w-4.5 h-4.5 text-neutral-400 stroke-[1.5px]" />}
          </motion.button>

          {/* Music Switch */}
          <motion.button 
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
            onClick={() => setMusicEnabled(!musicEnabled)}
            className="w-9 h-9 rounded-xl border border-neutral-200 bg-[#F9F6F0] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.05),0_2px_0_0_#EADCC9] active:translate-y-[2px] active:shadow-none transition-all duration-100 cursor-pointer outline-none"
          >
            <Music className={`w-4.5 h-4.5 stroke-[1.5px] ${musicEnabled ? 'text-[#2A5C43]' : 'text-neutral-400'}`} />
          </motion.button>
        </div>

        {/* Dynamic Minimal Brand Badge */}
        <div className="flex flex-col items-end">
          <span className="text-[12px] font-black uppercase text-neutral-800 tracking-wider">
            Sudoku Sandbox
          </span>
          <span className="text-[7px] font-bold uppercase tracking-widest text-[#8D7B68] opacity-80 leading-none">
            Minimal-Voxel v2.0
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🧩 BOTTOM ZONE: THE TRI-BLOCK JIGSAW MATRIX CORE */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-[328px] mx-auto flex flex-col gap-4 mb-5">
        
        {/* Top Split Row: Block 1 & Block 2 */}
        <div className="grid grid-cols-2 gap-4 h-[115px]">
          
          {/* BLOCK 1: DAILY CHALLENGES (TOP LEFT) */}
          <div className="relative h-full w-full">
            <motion.button
              whileTap={{ y: 8, boxShadow: '0 0px 0 0 #1b3f2c' }}
              className="absolute inset-0 bg-[#2A5C43] border border-[#234e38] rounded-2xl flex flex-col justify-between p-4 text-white text-left outline-none cursor-pointer select-none transition-all duration-100 ease-out shadow-[0_8px_0_0_#1b3f2c]"
            >
              <Trophy className="w-6 h-6 stroke-[1.5px] text-[#A2D3B9]" />
              <div className="flex flex-col mt-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider leading-none">Daily</span>
                <span className="text-[8px] font-medium uppercase tracking-wider text-[#A2D3B9] mt-0.5">Challenges</span>
              </div>
            </motion.button>
          </div>

          {/* BLOCK 2: CUSTOM MODE (TOP RIGHT) */}
          <div className="relative h-full w-full">
            <motion.button
              whileTap={{ y: 8, boxShadow: '0 0px 0 0 #2b5b96' }}
              className="absolute inset-0 bg-[#4A90E2] border border-[#3779c7] rounded-2xl flex flex-col justify-between p-4 text-white text-left outline-none cursor-pointer select-none transition-all duration-100 ease-out shadow-[0_8px_0_0_#2b5b96]"
            >
              <Sliders className="w-6 h-6 stroke-[1.5px] text-[#A6C9F2]" />
              <div className="flex flex-col mt-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider leading-none">Custom</span>
                <span className="text-[8px] font-medium uppercase tracking-wider text-[#A6C9F2] mt-0.5">Voxel Mode</span>
              </div>
            </motion.button>
          </div>

        </div>

        {/* Bottom Span: Block 3 */}
        <div className="relative w-full h-[95px]">
          <motion.button
            whileTap={{ y: 8, boxShadow: '0 0px 0 0 #802217' }}
            className="absolute inset-0 bg-[#C0392B] border border-[#9b2a1e] rounded-2xl flex flex-row items-center gap-4 p-5 text-white text-left outline-none cursor-pointer select-none transition-all duration-100 ease-out shadow-[0_8px_0_0_#802217]"
          >
            <div className="p-2.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-center">
              <Users className="w-6 h-6 stroke-[1.5px] text-[#FF9E9E]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold uppercase tracking-wider leading-none">Multiplayer Arena</span>
              <span className="text-[8px] font-medium uppercase tracking-wider text-[#FF9E9E] mt-1">
                PvP Voxel Sudoku Battles
              </span>
            </div>
          </motion.button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🚀 BOTTOM NAVIGATION PROMPT INDICATOR */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full py-1 flex flex-col items-center text-neutral-500 gap-0.5 select-none animate-bounce">
        <span className="text-[8px] font-bold uppercase tracking-widest text-[#8D7B68] opacity-80">
          Swipe Up for Leaderboard
        </span>
        <svg className="w-4 h-4 text-[#8D7B68]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

    </div>
  );
};

export default MainMenuPanel;
