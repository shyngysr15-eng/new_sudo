'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore, DifficultyMode } from '../../store/useGameStore';
import { ArrowLeft, Play, AlertCircle } from 'lucide-react';
import { soundManager } from '../../lib/soundManager';

export const DifficultySelector: React.FC = () => {
  const { difficulty, setDifficulty, setView, resetGameStore } = useGameStore();

  const handleDifficultySelect = (mode: DifficultyMode) => {
    soundManager.playClick();
    setDifficulty(mode);
  };

  const startGame = () => {
    soundManager.playClick();
    setView('custom-play');
  };

  return (
    <div className="w-full h-full text-black flex flex-col justify-between p-6 select-none bg-[#FFF9E6]">
      
      {/* 🏛️ HEADER CONTROLS */}
      <div className="relative z-10 w-full flex items-center justify-start mt-2 border-b border-black pb-3">
        <button 
          onClick={() => {
            soundManager.playClick();
            resetGameStore();
          }}
          className="w-9 h-9 rounded-lg border-2 border-black bg-[#FFFDF9] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer outline-none transition-all duration-75 mr-4"
        >
          <ArrowLeft className="w-4 h-4 text-black stroke-[2.5px]" />
        </button>
        <span className="text-sm font-black uppercase tracking-wider">
          Custom Mode Options
        </span>
      </div>

      {/* 🧩 DIFFICULTY SELECTOR INTERFACE */}
      <div className="flex-1 flex flex-col justify-center gap-6 my-4 w-full max-w-[290px] mx-auto">
        
        <div className="text-center mb-2">
          <h3 className="text-lg font-black uppercase tracking-wide">
            Select Difficulty
          </h3>
          <p className="text-[10px] text-neutral-500 uppercase font-black mt-0.5">
            Harder grids yield higher XP rewards
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* EASY BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ x: 3, y: 3, boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)' }}
            onClick={() => handleDifficultySelect('easy')}
            className={`
              w-full py-3.5 border-[3px] border-black rounded-xl flex items-center justify-between px-5 font-black uppercase tracking-wider text-xs cursor-pointer outline-none transition-all duration-75
              ${difficulty === 'easy' 
                ? 'bg-[#2ECC71] shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] translate-x-1 translate-y-1' 
                : 'bg-[#FFFDF9] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              }
            `}
          >
            <span>Easy Mode</span>
            <span className="text-[10px] font-black px-2 py-0.5 border border-black rounded bg-white/40">
              +50 XP
            </span>
          </motion.button>

          {/* MEDIUM BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ x: 3, y: 3, boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)' }}
            onClick={() => handleDifficultySelect('medium')}
            className={`
              w-full py-3.5 border-[3px] border-black rounded-xl flex items-center justify-between px-5 font-black uppercase tracking-wider text-xs cursor-pointer outline-none transition-all duration-75
              ${difficulty === 'medium' 
                ? 'bg-[#FFD369] shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] translate-x-1 translate-y-1' 
                : 'bg-[#FFFDF9] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              }
            `}
          >
            <span>Medium Mode</span>
            <span className="text-[10px] font-black px-2 py-0.5 border border-black rounded bg-white/40">
              +100 XP
            </span>
          </motion.button>

          {/* HARD BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ x: 3, y: 3, boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)' }}
            onClick={() => handleDifficultySelect('hard')}
            className={`
              w-full py-3.5 border-[3px] border-black rounded-xl flex items-center justify-between px-5 font-black uppercase tracking-wider text-xs cursor-pointer outline-none transition-all duration-75
              ${difficulty === 'hard' 
                ? 'bg-[#E74C3C] text-white shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] translate-x-1 translate-y-1' 
                : 'bg-[#FFFDF9] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              }
            `}
          >
            <span className={difficulty === 'hard' ? 'text-white' : 'text-black'}>Hard Mode</span>
            <span className={`text-[10px] font-black px-2 py-0.5 border border-black rounded ${difficulty === 'hard' ? 'bg-white/20 text-white' : 'bg-white/40'}`}>
              +200 XP
            </span>
          </motion.button>
        </div>

        {/* Dynamic difficulty description details */}
        <div className="p-3 border-2 border-black bg-neutral-50 rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
          <p className="text-[9px] font-bold uppercase text-neutral-500 leading-normal">
            {difficulty === 'easy' && 'Easy Mode contains 40 pre-filled numbers. Perfect for a quick warm-up or speed-run streak.'}
            {difficulty === 'medium' && 'Medium Mode contains 32 pre-filled numbers. Balance of challenge and smooth puzzle gameplay.'}
            {difficulty === 'hard' && 'Hard Mode contains 24 pre-filled numbers. Requires deep logical analysis and note-taking!'}
          </p>
        </div>

      </div>

      {/* 🚀 START GAME BUTTON */}
      <div className="relative z-10 w-full pb-4">
        <button
          onClick={startGame}
          className="w-full py-3.5 border-[3px] border-black bg-[#2ECC71] text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer outline-none transition-all duration-75 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 stroke-[3px]" />
          <span>Start Crafting Game</span>
        </button>
      </div>

    </div>
  );
};

export default DifficultySelector;
