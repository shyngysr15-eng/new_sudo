'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sliders, Users, Flame, Volume2, VolumeX, Music } from 'lucide-react';

export const MainMenuPanel: React.FC = () => {
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);

  // Perfect 7x4 grid calendar days (28 days)
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
    <div className="relative w-full h-full text-black flex flex-col justify-between p-6 select-none overflow-hidden bg-[#FFF9E6]">
      
      {/* ========================================================================= */}
      {/* 🏛️ TOP ZONE: THE NEO-BRUTALIST STONE DASHBOARD (Top 1/3) */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full flex gap-4 h-[135px] mt-2">
        
        {/* Left Block: Calendar Grid */}
        <div 
          className="flex-[2] bg-[#FFFDF9] border-[3px] border-black rounded-xl p-3.5 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="flex justify-between items-center border-b border-black pb-1.5 mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider">
              Training Grid
            </span>
            <span className="text-[9px] font-black uppercase text-[#2ECC71] bg-[#2ECC71]/15 border border-black px-1.5 py-0.5 rounded">
              Active Logs
            </span>
          </div>

          {/* 7x4 Mathematically Perfect Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 flex-1 items-center">
            {calendarDays.map((day) => (
              <div 
                key={day.id}
                className="flex items-center justify-center aspect-square"
              >
                {day.isToday ? (
                  <div className="w-3.5 h-3.5 rounded bg-[#3498DB] border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]" />
                ) : day.active ? (
                  <div className="w-3 h-3 rounded-full bg-black" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-200 border border-neutral-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Block: Streak Counter */}
        <div 
          className="flex-[1] bg-[#FFFDF9] border-[3px] border-black rounded-xl p-3.5 flex flex-col items-center justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-center w-full border-b border-black pb-1.5 mb-1">
            Streak
          </span>

          <div className="flex flex-col items-center justify-center flex-1 my-1">
            <Flame className="w-7 h-7 stroke-[2.5px] fill-[#E74C3C] text-black" />
            <span className="text-xl font-black uppercase mt-0.5 leading-none">
              7 Wks
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* HUD SETTINGS OPTIONS ROW */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full flex justify-between items-center my-auto py-3">
        <div className="flex gap-2">
          {/* SFX Switch */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ x: 3, y: 3, boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)' }}
            onClick={() => setSfxEnabled(!sfxEnabled)}
            className="w-9 h-9 rounded-lg border-2 border-black bg-[#FFFDF9] flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer outline-none transition-all duration-100 ease-out"
          >
            {sfxEnabled ? <Volume2 className="w-4.5 h-4.5 text-black stroke-[2px]" /> : <VolumeX className="w-4.5 h-4.5 text-neutral-400 stroke-[2px]" />}
          </motion.button>

          {/* Music Switch */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ x: 3, y: 3, boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)' }}
            onClick={() => setMusicEnabled(!musicEnabled)}
            className="w-9 h-9 rounded-lg border-2 border-black bg-[#FFFDF9] flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer outline-none transition-all duration-100 ease-out"
          >
            <Music className={`w-4.5 h-4.5 stroke-[2px] ${musicEnabled ? 'text-[#2ECC71]' : 'text-neutral-400'}`} />
          </motion.button>
        </div>

        {/* Brand identity badge */}
        <div className="flex flex-col items-end">
          <span className="text-[13px] font-black uppercase tracking-wide border-b-2 border-black leading-tight">
            Sudoku Sandbox
          </span>
          <span className="text-[8px] font-black uppercase tracking-widest text-neutral-500 mt-1 leading-none">
            Neo-Brutalist v3.0
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🧩 BOTTOM ZONE: THE TRI-BLOCK GRID SYSTEM (Bottom 2/3) */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-[328px] mx-auto grid grid-cols-2 gap-4 mb-5">
        
        {/* BUTTON 1: DAILY CHALLENGES */}
        <div className="relative h-[115px] col-span-1">
          <motion.button
            whileTap={{ x: 6, y: 6, boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)' }}
            className="absolute inset-0 bg-[#2ECC71] border-[3px] border-black rounded-xl flex flex-col items-center justify-center p-4 text-black outline-none cursor-pointer select-none transition-all duration-100 ease-out shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            <Trophy className="w-8 h-8 stroke-[2px]" />
            <span className="text-[12px] font-black uppercase tracking-wider mt-2">
              Daily
            </span>
          </motion.button>
        </div>

        {/* BUTTON 2: CUSTOM MODE */}
        <div className="relative h-[115px] col-span-1">
          <motion.button
            whileTap={{ x: 6, y: 6, boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)' }}
            className="absolute inset-0 bg-[#3498DB] border-[3px] border-black rounded-xl flex flex-col items-center justify-center p-4 text-black outline-none cursor-pointer select-none transition-all duration-100 ease-out shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            <Sliders className="w-8 h-8 stroke-[2px]" />
            <span className="text-[12px] font-black uppercase tracking-wider mt-2">
              Custom
            </span>
          </motion.button>
        </div>

        {/* BUTTON 3: MULTIPLAYER (SPANS BOTH COLUMNS) */}
        <div className="relative h-[95px] col-span-2">
          <motion.button
            whileTap={{ x: 6, y: 6, boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)' }}
            className="absolute inset-0 bg-[#E74C3C] border-[3px] border-black rounded-xl flex flex-row items-center justify-center gap-4 p-5 text-black outline-none cursor-pointer select-none transition-all duration-100 ease-out shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            <Users className="w-8 h-8 stroke-[2px]" />
            <span className="text-[14px] font-black uppercase tracking-widest">
              Multiplayer Battle
            </span>
          </motion.button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🚀 BOTTOM NAVIGATION PROMPT INDICATOR */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full py-1 flex flex-col items-center text-black gap-0.5 select-none animate-bounce">
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
