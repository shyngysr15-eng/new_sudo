'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Sparkles, Gem, Hammer, Trophy, Compass, Flame, Star } from 'lucide-react';

interface BadgeItem {
  id: string;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  borderColor: string;
}

const BADGES: BadgeItem[] = [
  { id: '1', name: 'First Craft', desc: 'Solved first voxel sudoku grid.', icon: Hammer, color: 'bg-[#FFE699]', borderColor: 'border-[#D4A325]' },
  { id: '2', name: 'Fire Starter', desc: 'Completed a speed-run in under 3 minutes.', icon: Flame, color: 'bg-[#FF9F9F]', borderColor: 'border-[#D15F5F]' },
  { id: '3', name: 'Cozy Architect', desc: 'Placed 500 blocks in Sandbox mode.', icon: Compass, color: 'bg-[#C5E1A5]', borderColor: 'border-[#7CB342]' },
  { id: '4', name: 'Mind Bender', desc: 'Solved 10 puzzles without using notes.', icon: Sparkles, color: 'bg-[#B2EBF2]', borderColor: 'border-[#00ACC1]' },
  { id: '5', name: 'Grand Master', desc: 'Won a tournament match.', icon: Trophy, color: 'bg-[#E1BEE7]', borderColor: 'border-[#8E24AA]' },
  { id: '6', name: 'Gem Collector', desc: 'Found all hidden voxel easter eggs.', icon: Gem, color: 'bg-[#F8BBD0]', borderColor: 'border-[#D81B60]' },
  { id: '7', name: 'High Flyer', desc: 'Reached Level 42 on the leaderboards.', icon: Shield, color: 'bg-[#D1E8E2]', borderColor: 'border-[#107896]' },
  { id: '8', name: 'Infinite Voyager', desc: 'Scrolled the TikTok loop 100 times.', icon: Award, color: 'bg-[#FFF9C4]', borderColor: 'border-[#FBC02D]' },
  { id: '9', name: 'Super Star', desc: 'Gained 5-star ratings on all worlds.', icon: Star, color: 'bg-[#FFE0B2]', borderColor: 'border-[#F57C00]' },
];

export const ProfilePanel: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#FAF6EE] text-neutral-800 flex flex-col p-6 font-mono select-none overflow-y-auto">
      {/* Top Navbar Placeholder */}
      <div className="flex justify-between items-center pb-4 border-b-2 border-neutral-300">
        <span className="font-bold text-xs uppercase tracking-widest text-neutral-500">Player Info</span>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-xs uppercase tracking-widest text-neutral-600">Online</span>
        </div>
      </div>

      {/* Profile Header Details */}
      <div className="flex flex-col items-center my-6">
        {/* Pixel Border Avatar */}
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 1 }}
          className="relative w-24 h-24 bg-[#EBE3D5] border-4 border-neutral-900 rounded-xl p-1 shadow-[4px_4px_0_0_#171717]"
        >
          <div className="w-full h-full border-2 border-dashed border-neutral-600 rounded-lg flex items-center justify-center bg-[#DFD3C3] overflow-hidden">
            {/* Simple pixelated emoji avatar */}
            <span className="text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🧙‍♂️</span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#FFD369] border-2 border-neutral-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-[2px_2px_0_0_#171717]">
            PRO
          </div>
        </motion.div>

        <h2 className="mt-4 text-xl font-bold uppercase tracking-wider text-neutral-900">VoxelAdventurer</h2>
        <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">Cozy Crafter</p>

        {/* Player Level Progress */}
        <div className="w-full max-w-xs mt-4 bg-neutral-200 border-2 border-neutral-950 p-1 rounded-lg shadow-[2px_2px_0_0_#171717]">
          <div className="flex justify-between text-[10px] font-bold uppercase px-1 mb-1 text-neutral-700">
            <span>Level 42</span>
            <span>72% to Lvl 43</span>
          </div>
          <div className="w-full h-4 bg-[#EBE3D5] rounded border border-neutral-400 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '72%' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full bg-[#A9C7D3] border-r border-neutral-600 shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.15)]"
            />
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="flex-1 min-h-0 flex flex-col">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3 flex items-center gap-1">
          <Award className="w-4 h-4 text-[#8D7B68]" /> Sandbox Badges (9)
        </h3>

        {/* 3x3 Badge Grid Mockup */}
        <div className="grid grid-cols-3 gap-3 pb-8">
          {BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative p-2.5 rounded-xl border-2 border-neutral-900 
                  flex flex-col items-center text-center cursor-pointer
                  shadow-[0_3px_0_0_#171717] hover:shadow-[0_5px_0_0_#171717]
                  active:translate-y-[2px] active:shadow-[0_1px_0_0_#171717]
                  transition-all duration-100
                  ${badge.color}
                `}
              >
                <div className={`w-8 h-8 rounded-lg border border-neutral-800 flex items-center justify-center bg-white/40 mb-1.5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]`}>
                  <Icon className="w-4.5 h-4.5 text-neutral-800" />
                </div>
                <span className="text-[9px] font-extrabold uppercase leading-tight line-clamp-1 text-neutral-900">{badge.name}</span>
                <span className="text-[7px] text-neutral-600 font-bold uppercase leading-none mt-0.5 tracking-tight line-clamp-1">{badge.desc}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Vertical Swipe Hint (Up) */}
      <div className="mt-auto py-2 flex flex-col items-center text-neutral-400 gap-1 select-none animate-bounce">
        <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-500">Swipe Up for Main Menu</span>
        <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default ProfilePanel;
