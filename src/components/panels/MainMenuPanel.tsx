'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music, Settings, Flame } from 'lucide-react';

export const MainMenuPanel: React.FC = () => {
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);

  // Mock calendar historical active days (14 days grid)
  const historyDays = [
    { day: 1, active: true },
    { day: 2, active: true },
    { day: 3, active: false },
    { day: 4, active: true },
    { day: 5, active: true },
    { day: 6, active: true },
    { day: 7, active: false },
    { day: 8, active: true },
    { day: 9, active: true },
    { day: 10, active: true },
    { day: 11, active: false },
    { day: 12, active: true },
    { day: 13, active: true },
    { day: 14, active: 'today' }, // Today glowing state
  ];

  return (
    <div className="relative w-full h-full text-neutral-900 flex flex-col justify-between p-5 font-mono select-none overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 🌲 DYNAMIC 2D PIXEL-ART LANDSCAPE BACKGROUND */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-[#bde0fe] via-[#e8f4f8] to-[#f4f7f4]">
        {/* Layer 3: Distant Sun / Vibe */}
        <div className="absolute top-[18%] left-[20%] w-24 h-24 rounded-full bg-[#fae588]/40 blur-md" />

        {/* Layer 2: Soft Cozy Hills (Back) */}
        <div 
          className="absolute bottom-[10%] left-0 w-full h-[35%] bg-gradient-to-t from-[#c5e1a5] to-[#a9cca2]/60"
          style={{
            clipPath: 'ellipse(70% 50% at 50% 100%)',
          }}
        />

        {/* Layer 1: Cozy Hills with Forest Gradient (Front) */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[22%] bg-gradient-to-t from-[#386641]/80 to-[#7cb342]/70"
          style={{
            clipPath: 'ellipse(90% 60% at 35% 100%)',
          }}
        />

        {/* Layer 0: Voxel Village/Trees Silhouettes at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-6 flex items-end justify-between px-6 opacity-30">
          <div className="w-3 h-5 bg-[#1b4332] rounded-t" />
          <div className="w-5 h-8 bg-[#1b4332] rounded-t ml-2" />
          <div className="w-4 h-6 bg-[#1b4332] rounded-t ml-4" />
          <div className="w-6 h-4 bg-[#1b4332] rounded-t ml-auto" />
          <div className="w-3 h-7 bg-[#1b4332] rounded-t ml-2" />
        </div>
      </div>

      {/* Decorative Green Lianas/Vines Cascading on the Right */}
      <div className="absolute right-3 top-0 h-44 w-12 z-20 pointer-events-none flex flex-col items-center">
        {/* Pixel liana stem */}
        <div className="w-1.5 h-full bg-[#7cb342] shadow-[2px_0_0_0_#386641]" />
        {/* Pixel leaf absolute icons */}
        <div className="absolute top-8 right-2 w-3.5 h-3.5 bg-[#558b2f] border border-[#1b4332] rounded-br-lg rotate-45" />
        <div className="absolute top-16 left-2 w-3.5 h-3.5 bg-[#558b2f] border border-[#1b4332] rounded-bl-lg -rotate-45" />
        <div className="absolute top-28 right-1 w-4 h-4 bg-[#7cb342] border border-[#1b4332] rounded-br-lg rotate-12" />
        <div className="absolute top-36 left-3 w-3 h-3 bg-[#8def6e] border border-[#1b4332] rounded-bl-lg -rotate-12 animate-pulse" />
      </div>

      {/* ========================================================================= */}
      {/* 🏛️ TOP ZONE: THE CHISELED STONE DASHBOARD */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full flex gap-3 h-[140px] mt-2">
        
        {/* LEFT PANEL: Core Calendar Widget (2/3 width) */}
        <div className="relative flex-[2] bg-[#F2E8CF] border-2 border-neutral-900 rounded-xl p-3 shadow-[0_5px_0_0_#8D7B68] flex flex-col justify-between overflow-hidden">
          {/* Voxel cracks (SVG overlay) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" stroke="#171717" strokeWidth="1.5" fill="none">
            <path d="M 12 0 L 25 18 L 18 35 M 110 90 L 125 105 L 140 102 M 50 15 L 65 30 L 60 45" strokeDasharray="3,3" />
          </svg>

          {/* Heading */}
          <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#8D7B68] flex justify-between">
            <span>Calendar Log</span>
            <span className="text-emerald-700">11 Active</span>
          </span>

          {/* 2x7 Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 mt-1.5">
            {historyDays.map((day, idx) => (
              <div 
                key={idx}
                className="aspect-square w-full rounded bg-[#E8E0CE] border border-neutral-700/60 flex items-center justify-center relative shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]"
              >
                {day.active === 'today' && (
                  <motion.div 
                    animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-neutral-900 shadow-[0_0_4px_#FFD369]"
                  />
                )}
                {day.active === true && (
                  <div className="w-2 h-2 rounded-full bg-emerald-500 border border-emerald-900" />
                )}
                {day.active === false && (
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400/40" />
                )}
              </div>
            ))}
          </div>

          <span className="text-[7px] text-neutral-500 font-extrabold uppercase tracking-wider text-left mt-1">
            Current streak: 4 Days
          </span>
        </div>

        {/* RIGHT PANEL: Weekly Strike Widget (1/3 width) */}
        <div className="relative flex-[1] bg-[#F2E8CF] border-2 border-neutral-900 rounded-xl p-3 shadow-[0_5px_0_0_#8D7B68] flex flex-col items-center justify-between overflow-hidden">
          {/* Voxel cracks */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" stroke="#171717" strokeWidth="1.5" fill="none">
            <path d="M 40 10 L 52 28 M 15 80 L 22 95" strokeDasharray="3,3" />
          </svg>

          <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#8D7B68]">
            Strike
          </span>

          {/* Voxel Flame */}
          <div className="relative flex items-center justify-center py-0.5">
            <motion.div 
              animate={{ 
                scale: [1, 1.15, 1],
                y: [0, -2, 0] 
              }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              className="text-[#D15F5F] filter drop-shadow-[1px_2px_0_rgba(0,0,0,0.15)] flex items-center justify-center"
            >
              <Flame className="w-7 h-7 fill-[#FFD369] stroke-neutral-900 stroke-[2px]" />
            </motion.div>
            <span className="absolute text-[11px] font-extrabold text-neutral-950 top-3">7</span>
          </div>

          <span className="text-[6.5px] font-extrabold bg-[#386641] text-[#E8F4F8] px-1 rounded uppercase tracking-wide leading-normal">
            7 WEEKS
          </span>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🧭 MID ZONE: HUD SETTINGS (Volume, cozy mode indicators) */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full flex justify-between items-center my-auto py-2">
        <div className="flex gap-2">
          {/* SFX Switch */}
          <motion.button 
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
            onClick={() => setSfxEnabled(!sfxEnabled)}
            className="w-8 h-8 rounded-lg border-2 border-neutral-900 bg-[#FAF6EE] flex items-center justify-center shadow-[2px_2px_0_0_#171717] cursor-pointer"
          >
            {sfxEnabled ? <Volume2 className="w-4.5 h-4.5 text-neutral-700" /> : <VolumeX className="w-4.5 h-4.5 text-neutral-400" />}
          </motion.button>

          {/* Music Switch */}
          <motion.button 
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
            onClick={() => setMusicEnabled(!musicEnabled)}
            className={`w-8 h-8 rounded-lg border-2 border-neutral-900 bg-[#FAF6EE] flex items-center justify-center shadow-[2px_2px_0_0_#171717] cursor-pointer`}
          >
            <Music className={`w-4.5 h-4.5 ${musicEnabled ? 'text-emerald-600' : 'text-neutral-400'}`} />
          </motion.button>
        </div>

        {/* Game Title Logo Label */}
        <div className="flex flex-col items-end">
          <span 
            className="text-[13px] font-black uppercase text-neutral-950 tracking-tighter"
            style={{ textShadow: '1px 1px 0px #A9C7D3' }}
          >
            SUDOKU CRAFT
          </span>
          <span className="text-[7px] font-extrabold uppercase text-[#8D7B68] tracking-widest leading-none">
            Cozy Sandbox v1.0
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🧩 BOTTOM ZONE: THE TRI-PIECE PUZZLE INTERLOCKING CORE */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-[320px] h-[240px] mx-auto mb-4 select-none">
        
        {/* ------------------------------------------------------------ */}
        {/* PIECE A: DAILY CHALLENGES (THE TITAN - LEFT/TOP) */}
        {/* ------------------------------------------------------------ */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            filter: 'drop-shadow(2px 0px 0px #171717) drop-shadow(-2px 0px 0px #171717) drop-shadow(0px 2px 0px #171717) drop-shadow(0px -2px 0px #171717)',
          }}
        >
          {/* Depth Shadow Block underneath (Dark Forest Green) */}
          <div 
            className="absolute inset-0 bg-[#1b4332]"
            style={{
              clipPath: 'polygon(0% 0%, 60% 0%, 60% 20%, 70% 20%, 70% 35%, 60% 35%, 60% 50%, 40% 50%, 40% 65%, 25% 65%, 25% 50%, 0% 50%)',
              transform: 'translate3d(0, 6px, 0)',
            }}
          />
          {/* Interactive Button Layer */}
          <motion.button 
            whileTap={{ 
              y: 4,
              transition: { duration: 0.05 }
            }}
            className="absolute inset-0 bg-[#386641] pointer-events-auto cursor-pointer flex flex-col items-start justify-start p-4 text-white group outline-none"
            style={{
              clipPath: 'polygon(0% 0%, 60% 0%, 60% 20%, 70% 20%, 70% 35%, 60% 35%, 60% 50%, 40% 50%, 40% 65%, 25% 65%, 25% 50%, 0% 50%)',
            }}
          >
            {/* Custom Pixel Trophy SVG */}
            <div className="text-[#a9cca2] group-hover:scale-105 transition-transform duration-100 mb-1">
              <svg viewBox="0 0 16 16" className="w-9 h-9" fill="currentColor" style={{ imageRendering: 'pixelated' }}>
                <path d="M3 2h10v4c0 1.5-1.5 3-3 3v2h2v1H4v-1h2V9c-1.5 0-3-1.5-3-3V2zm8 1.5H5v2.5c0 0.8 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-2.5z" />
                <path d="M1 3h2v2H1V3zm12 0h2v2h-2V3z" />
              </svg>
            </div>
            
            {/* Label texts */}
            <span className="text-[10px] font-extrabold uppercase tracking-wide leading-none text-left">
              Daily
            </span>
            <span className="text-[8px] font-bold uppercase tracking-wider leading-none text-[#a9cca2]/90 mt-0.5 text-left">
              Challenges
            </span>
          </motion.button>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* PIECE B: CUSTOM MODE (THE ANCHOR - RIGHT/TOP) */}
        {/* ------------------------------------------------------------ */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            filter: 'drop-shadow(2px 0px 0px #171717) drop-shadow(-2px 0px 0px #171717) drop-shadow(0px 2px 0px #171717) drop-shadow(0px -2px 0px #171717)',
          }}
        >
          {/* Depth Shadow Block underneath (Dark Blue) */}
          <div 
            className="absolute inset-0 bg-[#1d3557]"
            style={{
              clipPath: 'polygon(60% 0%, 100% 0%, 100% 50%, 75% 50%, 75% 40%, 60% 40%, 60% 50%, 60% 35%, 70% 35%, 70% 20%, 60% 20%)',
              transform: 'translate3d(0, 6px, 0)',
            }}
          />
          {/* Interactive Button Layer */}
          <motion.button 
            whileTap={{ 
              y: 4,
              transition: { duration: 0.05 }
            }}
            className="absolute inset-0 bg-[#3F88C5] pointer-events-auto cursor-pointer flex flex-col items-center justify-start pt-4 pr-1 text-white group outline-none"
            style={{
              clipPath: 'polygon(60% 0%, 100% 0%, 100% 50%, 75% 50%, 75% 40%, 60% 40%, 60% 50%, 60% 35%, 70% 35%, 70% 20%, 60% 20%)',
            }}
          >
            {/* Shift content to align nicely inside Piece B shape */}
            <div className="flex flex-col items-center pl-10">
              {/* Custom Pixel Gear SVG */}
              <div className="text-[#a9c7d3] group-hover:rotate-45 transition-transform duration-200 mb-1">
                <svg viewBox="0 0 16 16" className="w-8 h-8" fill="currentColor" style={{ imageRendering: 'pixelated' }}>
                  <path d="M7 1v2h2V1H7zm3.5 1.5v2h2v-2h-2zM12.5 5h2v2h-2V5zm-1.5 4.5h2v2h-2v-2zm-3.5 2v2h2v-2H7.5zm-4-1.5v2h2v-2h-2zM1 7h2v2H1V7zm1.5-4h2v2h-2V3zm3.5 2.5h4v4H6v-4z" />
                </svg>
              </div>
              
              <span className="text-[10px] font-extrabold uppercase tracking-wide leading-none">
                Custom
              </span>
              <span className="text-[7.5px] font-bold uppercase tracking-wider leading-none text-[#a9c7d3]/95 mt-0.5">
                Voxel Mode
              </span>
            </div>
          </motion.button>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* PIECE C: MULTIPLAYER (THE BASE - BOTTOM) */}
        {/* ------------------------------------------------------------ */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            filter: 'drop-shadow(2px 0px 0px #171717) drop-shadow(-2px 0px 0px #171717) drop-shadow(0px 2px 0px #171717) drop-shadow(0px -2px 0px #171717)',
          }}
        >
          {/* Depth Shadow Block underneath (Burgundy Red) */}
          <div 
            className="absolute inset-0 bg-[#660708]"
            style={{
              clipPath: 'polygon(0% 50%, 25% 50%, 25% 65%, 40% 65%, 40% 50%, 60% 50%, 60% 40%, 75% 40%, 75% 50%, 100% 50%, 100% 100%, 0% 100%)',
              transform: 'translate3d(0, 6px, 0)',
            }}
          />
          {/* Interactive Button Layer */}
          <motion.button 
            whileTap={{ 
              y: 4,
              transition: { duration: 0.05 }
            }}
            className="absolute inset-0 bg-[#BC4749] pointer-events-auto cursor-pointer flex flex-col items-center justify-end pb-5 text-white group outline-none"
            style={{
              clipPath: 'polygon(0% 50%, 25% 50%, 25% 65%, 40% 65%, 40% 50%, 60% 50%, 60% 40%, 75% 40%, 75% 50%, 100% 50%, 100% 100%, 0% 100%)',
            }}
          >
            {/* Custom Pixel Crossed Swords SVG */}
            <div className="text-[#ff9f9f] group-hover:scale-105 transition-transform duration-100 mb-1.5 flex items-center justify-center gap-1">
              <svg viewBox="0 0 16 16" className="w-8 h-8" fill="currentColor" style={{ imageRendering: 'pixelated' }}>
                <path d="M1 14l1 1 3-3-1-1-3 3zm3-3l8-8 1 1-8 8-1-1zm8-8l3-3 1 1-3 3-1-1z" />
                <path d="M15 14l-1 1-3-3 1-1 3 3zm-3-3l-8-8-1 1 8 8 1-1zm-8-8l-3-3-1 1 3 3-1-1z" opacity="0.8" />
              </svg>
            </div>
            
            <span className="text-[11px] font-extrabold uppercase tracking-widest leading-none">
              Multiplayer Arena
            </span>
            <span className="text-[8px] font-bold uppercase tracking-wider leading-none text-[#ff9f9f]/90 mt-0.5">
              Live PvP Voxel Battles
            </span>
          </motion.button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🚀 BOTTOM NAVIGATION PROMPT INDICATOR */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full py-1.5 flex flex-col items-center text-neutral-500 gap-0.5 select-none animate-bounce">
        <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#8D7B68] opacity-80">
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
