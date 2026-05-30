'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2, VolumeX, Music, Settings, Compass } from 'lucide-react';
import PixelButton from '../ui/PixelButton';

export const MainMenuPanel: React.FC = () => {
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [cozyMode, setCozyMode] = useState(true);

  return (
    <div className="w-full h-full bg-[#E8F4F8] text-neutral-800 flex flex-col items-center justify-between p-6 font-mono select-none overflow-y-auto">
      
      {/* Top Floating Badge Bar */}
      <div className="w-full flex justify-between items-center py-2">
        <div className="flex items-center gap-1.5 bg-[#FAF6EE] border-2 border-neutral-900 px-3 py-1 rounded-full shadow-[2px_2px_0_0_#171717]">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700">Sandbox Mode</span>
        </div>
        <motion.button 
          whileHover={{ rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-lg border-2 border-neutral-900 bg-[#FAF6EE] flex items-center justify-center shadow-[2px_2px_0_0_#171717] cursor-pointer"
        >
          <Settings className="w-4 h-4 text-neutral-700" />
        </motion.button>
      </div>

      {/* Main Branding Section */}
      <div className="flex flex-col items-center my-auto py-4">
        {/* Parallax Swipe Hint (Down) */}
        <div className="flex flex-col items-center text-neutral-400 gap-0.5 select-none animate-bounce mb-8">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
          <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-500">Swipe Down for Profile</span>
        </div>

        {/* 3D Voxel-style Minecraft Title */}
        <div className="relative text-center mb-6 select-none scale-90 sm:scale-100">
          <h1 
            className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tighter text-neutral-900 font-sans"
            style={{
              textShadow: '3px 3px 0px #A9C7D3, 6px 6px 0px #8D7B68, 8px 8px 0px #171717',
              letterSpacing: '-0.05em'
            }}
          >
            SUDOKU
          </h1>
          <h1 
            className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-[#DFD3C3] font-sans mt-1"
            style={{
              textShadow: '2px 2px 0px #8D7B68, 4px 4px 0px #171717',
            }}
          >
            CRAFT
          </h1>
          
          {/* Voxel Sparkle Decoration */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-4 -right-4 text-xl"
          >
            ✨
          </motion.div>
        </div>

        {/* Subtitle / Cozy Flavor text */}
        <p className="text-[10px] text-neutral-500 uppercase tracking-widest text-center max-w-[240px] leading-relaxed">
          Create. Solve. Snaps. <br />
          Voxel grid sandbox v1.0.0
        </p>
      </div>

      {/* Central Interactive Launch Area */}
      <div className="w-full flex flex-col items-center gap-6 my-auto">
        <PixelButton 
          variant="accent" 
          pulse={true}
          className="w-full max-w-[260px] py-4 text-md shadow-[0_6px_0_0_#171717] active:shadow-[0_2px_0_0_#171717]"
        >
          <Play className="w-5 h-5 fill-neutral-900 stroke-none" />
          Tap to Play
        </PixelButton>

        {/* Game Mode Pill */}
        <div className="flex gap-2">
          <motion.button 
            whileHover={{ y: -1 }}
            className="px-3 py-1 rounded bg-[#DFD3C3] border border-neutral-800 text-[8px] font-bold uppercase tracking-wider text-neutral-700 shadow-[1px_2px_0_0_#171717]"
          >
            Classic Sudoku
          </motion.button>
          <motion.button 
            whileHover={{ y: -1 }}
            className="px-3 py-1 rounded bg-[#EBE3D5] border border-neutral-800 text-[8px] font-bold uppercase tracking-wider text-neutral-500 shadow-[1px_2px_0_0_#171717]"
          >
            3D Voxel Sandbox
          </motion.button>
        </div>
      </div>

      {/* Settings Grid Mockup at bottom */}
      <div className="w-full max-w-xs bg-[#FAF6EE]/90 border-2 border-neutral-900 rounded-2xl p-4 shadow-[3px_3px_0_0_#171717] mb-4">
        <div className="flex flex-col gap-3">
          
          {/* SFX Switch */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 flex items-center gap-1.5">
              {sfxEnabled ? <Volume2 className="w-3.5 h-3.5 text-neutral-700" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-400" />}
              Sound FX
            </span>
            <button 
              onClick={() => setSfxEnabled(!sfxEnabled)}
              className={`w-12 h-6 border-2 border-neutral-900 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${sfxEnabled ? 'bg-[#C5E1A5]' : 'bg-neutral-300'}`}
            >
              <motion.div 
                layout 
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-4 h-4 bg-neutral-900 rounded-full"
                style={{ marginLeft: sfxEnabled ? '24px' : '0px' }}
              />
            </button>
          </div>

          {/* Music Switch */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-neutral-700" />
              Cozy BGM
            </span>
            <button 
              onClick={() => setMusicEnabled(!musicEnabled)}
              className={`w-12 h-6 border-2 border-neutral-900 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${musicEnabled ? 'bg-[#C5E1A5]' : 'bg-neutral-300'}`}
            >
              <motion.div 
                layout 
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-4 h-4 bg-neutral-900 rounded-full"
                style={{ marginLeft: musicEnabled ? '24px' : '0px' }}
              />
            </button>
          </div>

          {/* Cozy Mode Switch */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-neutral-700" />
              Pixel Shader
            </span>
            <button 
              onClick={() => setCozyMode(!cozyMode)}
              className={`w-12 h-6 border-2 border-neutral-900 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${cozyMode ? 'bg-[#C5E1A5]' : 'bg-neutral-300'}`}
            >
              <motion.div 
                layout 
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-4 h-4 bg-neutral-900 rounded-full"
                style={{ marginLeft: cozyMode ? '24px' : '0px' }}
              />
            </button>
          </div>

        </div>
      </div>

      {/* Vertical Swipe Hint (Down) */}
      <div className="w-full py-2 flex flex-col items-center text-neutral-400 gap-1 select-none animate-bounce">
        <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-500">Swipe Up for Leaderboard</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default MainMenuPanel;
