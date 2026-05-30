'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Shield, ArrowUp, Zap } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  name: string;
  score: number;
  avatar: string;
  badge: string;
  badgeColor: string;
}

const TOP_THREE: LeaderboardUser[] = [
  { rank: 2, name: 'HexaVoxel', score: 14280, avatar: '🦊', badge: 'Silver', badgeColor: 'bg-slate-300 text-slate-800' },
  { rank: 1, name: 'SudoKing', score: 18940, avatar: '👑', badge: 'Gold', badgeColor: 'bg-[#FFD369] text-neutral-900' },
  { rank: 3, name: 'CraftyCat', score: 12150, avatar: '🐱', badge: 'Bronze', badgeColor: 'bg-amber-600 text-amber-50' },
];

const LEADERBOARD_LIST: LeaderboardUser[] = [
  { rank: 4, name: 'BlockNinja', score: 9840, avatar: '🥷', badge: 'Expert', badgeColor: 'bg-neutral-800 text-neutral-200' },
  { rank: 5, name: 'CosmicVoxel', score: 8750, avatar: '👽', badge: 'Expert', badgeColor: 'bg-neutral-800 text-neutral-200' },
  { rank: 6, name: 'PixelBaker', score: 7920, avatar: '🍞', badge: 'Adept', badgeColor: 'bg-emerald-100 text-emerald-800' },
  { rank: 7, name: 'SudokuPro', score: 6850, avatar: '🧠', badge: 'Adept', badgeColor: 'bg-emerald-100 text-emerald-800' },
  { rank: 8, name: 'SpikeCube', score: 5410, avatar: '🌵', badge: 'Novice', badgeColor: 'bg-[#DFD3C3] text-neutral-700' },
  { rank: 9, name: 'ZeroBugs', score: 4920, avatar: '🐛', badge: 'Novice', badgeColor: 'bg-[#DFD3C3] text-neutral-700' },
  { rank: 10, name: 'CozyBlock', score: 3950, avatar: '🏠', badge: 'Novice', badgeColor: 'bg-[#DFD3C3] text-neutral-700' },
];

export const LeaderboardPanel: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#EEF7F2] text-neutral-800 flex flex-col p-6 font-mono select-none overflow-y-auto">
      
      {/* Top Navbar Header */}
      <div className="flex justify-between items-center pb-4 border-b-2 border-emerald-200">
        <span className="font-bold text-xs uppercase tracking-widest text-[#2E7D32]">Leaderboard</span>
        <div className="flex items-center gap-1">
          <Trophy className="w-4 h-4 text-amber-500 animate-bounce" />
          <span className="font-bold text-xs uppercase tracking-widest text-neutral-600">Season 4</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center my-4">
        <h2 className="text-xl font-bold uppercase tracking-wider text-neutral-900">Top Crafters</h2>
        <p className="text-[9px] text-[#2E7D32] uppercase tracking-wider font-extrabold mt-0.5">Voxel Sudoku High Scores</p>
      </div>

      {/* Voxel Podium Section */}
      <div className="flex items-end justify-center gap-4 my-4 pb-4">
        
        {/* 2nd Place Podium */}
        <div className="flex flex-col items-center">
          <div className="text-2xl mb-1">{TOP_THREE[0].avatar}</div>
          <span className="text-[10px] font-bold text-neutral-800 leading-tight uppercase max-w-[65px] truncate text-center">{TOP_THREE[0].name}</span>
          <span className="text-[8px] font-bold text-neutral-500 mb-2">{TOP_THREE[0].score}</span>
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 60 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-16 bg-slate-300 border-2 border-neutral-900 rounded-t-lg flex flex-col items-center justify-center shadow-[3px_3px_0_0_#171717]"
          >
            <span className="text-neutral-900 font-extrabold text-lg">2</span>
            <span className="text-[6px] font-extrabold uppercase bg-neutral-900 text-slate-100 px-1 rounded -mt-0.5">SLVR</span>
          </motion.div>
        </div>

        {/* 1st Place Podium */}
        <div className="flex flex-col items-center">
          <div className="relative text-3xl mb-1">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-sm rotate-12">👑</span>
            {TOP_THREE[1].avatar}
          </div>
          <span className="text-[11px] font-extrabold text-neutral-900 leading-tight uppercase max-w-[70px] truncate text-center">{TOP_THREE[1].name}</span>
          <span className="text-[9px] font-extrabold text-amber-600 mb-2">{TOP_THREE[1].score}</span>
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 85 }}
            transition={{ duration: 1 }}
            className="w-18 bg-[#FFD369] border-2 border-neutral-900 rounded-t-xl flex flex-col items-center justify-center shadow-[4px_4px_0_0_#171717]"
          >
            <span className="text-neutral-950 font-extrabold text-2xl">1</span>
            <span className="text-[7px] font-extrabold uppercase bg-neutral-900 text-[#FFD369] px-1 rounded -mt-0.5 animate-pulse">GOLD</span>
          </motion.div>
        </div>

        {/* 3rd Place Podium */}
        <div className="flex flex-col items-center">
          <div className="text-2xl mb-1">{TOP_THREE[2].avatar}</div>
          <span className="text-[10px] font-bold text-neutral-800 leading-tight uppercase max-w-[65px] truncate text-center">{TOP_THREE[2].name}</span>
          <span className="text-[8px] font-bold text-neutral-500 mb-2">{TOP_THREE[2].score}</span>
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 45 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-16 bg-amber-600 border-2 border-neutral-900 rounded-t-lg flex flex-col items-center justify-center shadow-[3px_3px_0_0_#171717]"
          >
            <span className="text-amber-50 font-extrabold text-md">3</span>
            <span className="text-[6px] font-extrabold uppercase bg-neutral-900 text-amber-300 px-1 rounded -mt-0.5">BRNZ</span>
          </motion.div>
        </div>

      </div>

      {/* List Section */}
      <div className="flex-1 min-h-0 flex flex-col mt-2">
        {/* Scrollable Leaderboard Card Container */}
        <div 
          className="flex-1 overflow-y-auto border-2 border-neutral-900 rounded-2xl bg-[#FAF6EE] shadow-[3px_3px_0_0_#171717] p-2 pr-1"
          style={{ touchAction: 'pan-y' }} // Instruct browser that touch panning inside is allowed for local scrolling
        >
          <div className="flex flex-col gap-1.5 pb-2">
            {LEADERBOARD_LIST.map((user) => (
              <div 
                key={user.rank}
                className="flex items-center justify-between p-2 rounded-xl bg-white border border-neutral-200 hover:border-neutral-500 hover:shadow-[1px_1px_0_0_#171717] transition-all duration-100"
              >
                <div className="flex items-center gap-2">
                  {/* Rank Circle */}
                  <span className="w-5 h-5 rounded-md border border-neutral-400 bg-[#E8F4F8] flex items-center justify-center text-[10px] font-extrabold text-neutral-600">
                    {user.rank}
                  </span>
                  {/* Emoji Avatar */}
                  <span className="text-md">{user.avatar}</span>
                  {/* Username */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold uppercase leading-tight text-neutral-800">{user.name}</span>
                    <span className={`text-[6px] font-bold uppercase w-fit px-1 rounded mt-0.5 ${user.badgeColor}`}>
                      {user.badge}
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-1 text-right">
                  <span className="text-[11px] font-bold text-neutral-700">{user.score}</span>
                  <Zap className="w-3.5 h-3.5 fill-amber-400 stroke-neutral-900 stroke-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Down Hint (Loop) */}
      <div className="mt-auto py-2 flex flex-col items-center text-neutral-400 gap-1 select-none animate-bounce">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
        <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-500">Swipe Down for Profile (Loop)</span>
      </div>
    </div>
  );
};

export default LeaderboardPanel;
