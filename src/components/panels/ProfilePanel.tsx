'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Sparkles, Gem, Hammer, Trophy, Compass, Flame, Star, LogOut, Lock } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabaseClient';

interface BadgeItem {
  id: string;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  borderColor: string;
  checkUnlocked: (solvesCount: number, bestTime: number, levelScore: number) => boolean;
}

const BADGES: BadgeItem[] = [
  { 
    id: '1', 
    name: 'First Craft', 
    desc: 'Solved first voxel sudoku grid.', 
    icon: Hammer, 
    color: 'bg-[#FFE699]', 
    borderColor: 'border-[#D4A325]',
    checkUnlocked: (solves) => solves > 0 
  },
  { 
    id: '2', 
    name: 'Fire Starter', 
    desc: 'Speed-run solved in under 5 minutes.', 
    icon: Flame, 
    color: 'bg-[#FF9F9F]', 
    borderColor: 'border-[#D15F5F]',
    checkUnlocked: (_, bestTime) => bestTime > 0 && bestTime < 300
  },
  { 
    id: '3', 
    name: 'Cozy Architect', 
    desc: 'Completed 3 daily sudoku saves.', 
    icon: Compass, 
    color: 'bg-[#C5E1A5]', 
    borderColor: 'border-[#7CB342]',
    checkUnlocked: (solves) => solves >= 3
  },
  { 
    id: '4', 
    name: 'Mind Bender', 
    desc: 'Completed 5 daily sudoku saves.', 
    icon: Sparkles, 
    color: 'bg-[#B2EBF2]', 
    borderColor: 'border-[#00ACC1]',
    checkUnlocked: (solves) => solves >= 5
  },
  { 
    id: '5', 
    name: 'Grand Master', 
    desc: 'Completed 10 daily sudoku saves.', 
    icon: Trophy, 
    color: 'bg-[#E1BEE7]', 
    borderColor: 'border-[#8E24AA]',
    checkUnlocked: (solves) => solves >= 10
  },
  { 
    id: '6', 
    name: 'Gem Collector', 
    desc: 'Earned over 500 cumulative XP score.', 
    icon: Gem, 
    color: 'bg-[#F8BBD0]', 
    borderColor: 'border-[#D81B60]',
    checkUnlocked: (_, __, levelScore) => levelScore >= 500
  },
];

export const ProfilePanel: React.FC = () => {
  const { profile, signOut } = useAuthStore();
  
  const [solvesCount, setSolvesCount] = useState(0);
  const [bestTime, setBestTime] = useState(0);

  // 1. Fetch live solve statistics to dynamically check unlocked achievements
  useEffect(() => {
    if (!profile?.id) return;

    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('daily_solves')
          .select('*')
          .eq('user_id', profile.id);

        if (error) throw error;
        
        const solves = data || [];
        setSolvesCount(solves.length);

        if (solves.length > 0) {
          const times = solves.map((s) => s.time_taken);
          setBestTime(Math.min(...times));
        }
      } catch (err) {
        console.error('Error fetching profile solved stats:', err);
      }
    };

    fetchStats();
  }, [profile]);

  // RPG Progression: Calculate levels based on level (cumulative XP score)
  const scoreVal = profile?.level ?? 0;
  const computedLevel = Math.floor(scoreVal / 500) + 1;
  const currentXP = scoreVal % 500;
  const pct = Math.round((currentXP / 500) * 100);

  return (
    <div className="w-full h-full bg-[#FAF6EE] text-neutral-800 flex flex-col p-6 font-mono select-none overflow-y-auto">
      {/* Top Navbar */}
      <div className="flex justify-between items-center pb-4 border-b-2 border-neutral-300">
        <span className="font-bold text-xs uppercase tracking-widest text-neutral-500">Player Info</span>
        <button
          onClick={signOut}
          className="flex items-center gap-1 text-[10px] font-black uppercase text-red-600 hover:text-red-700 underline decoration-2 cursor-pointer transition-colors duration-100"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Header Details */}
      <div className="flex flex-col items-center my-6">
        {/* Pixel Border Avatar */}
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 1 }}
          className="relative w-24 h-24 bg-[#EBE3D5] border-4 border-neutral-900 rounded-xl p-1 shadow-[4px_4px_0_0_#171717]"
        >
          <div className="w-full h-full border-2 border-dashed border-neutral-600 rounded-lg flex items-center justify-center bg-[#DFD3C3] overflow-hidden">
            {/* Display profile avatar emoji or fallback wizard emoji */}
            <span className="text-4xl animate-bounce" style={{ animationDuration: '3s' }}>
              {profile?.avatar_url || '🧙‍♂️'}
            </span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#FFD369] border-2 border-neutral-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-[2px_2px_0_0_#171717]">
            PRO
          </div>
        </motion.div>

        {/* Live Nickname */}
        <h2 className="mt-4 text-xl font-bold uppercase tracking-wider text-neutral-900">
          {profile?.nickname || 'Guest Player'}
        </h2>
        <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">
          {computedLevel >= 3 ? 'Master Craftsman' : 'Apprentice Builder'}
        </p>

        {/* Live Player Level Progress */}
        <div className="w-full max-w-xs mt-4 bg-neutral-200 border-2 border-neutral-950 p-1 rounded-lg shadow-[2px_2px_0_0_#171717]">
          <div className="flex justify-between text-[10px] font-bold uppercase px-1 mb-1 text-neutral-700">
            <span>Level {computedLevel}</span>
            <span>{pct}% to Lvl {computedLevel + 1} ({currentXP}/500 XP)</span>
          </div>
          <div className="w-full h-4 bg-[#EBE3D5] rounded border border-neutral-400 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full bg-[#A9C7D3] border-r border-neutral-600 shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.15)]"
            />
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="flex-1 min-h-0 flex flex-col">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3 flex items-center gap-1">
          <Award className="w-4 h-4 text-[#8D7B68]" /> Dynamic Sandbox Badges ({BADGES.filter(b => b.checkUnlocked(solvesCount, bestTime, scoreVal)).length})
        </h3>

        {/* 3x2 / 3x3 Reactive Badge Grid */}
        <div className="grid grid-cols-3 gap-3 pb-8">
          {BADGES.map((badge) => {
            const Icon = badge.icon;
            const isUnlocked = badge.checkUnlocked(solvesCount, bestTime, scoreVal);

            return (
              <motion.div
                key={badge.id}
                whileHover={isUnlocked ? { scale: 1.05, y: -2 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                className={`
                  relative p-2.5 rounded-xl border-2 border-neutral-900 
                  flex flex-col items-center text-center cursor-pointer
                  transition-all duration-100
                  ${isUnlocked 
                    ? `${badge.color} shadow-[0_3px_0_0_#171717] hover:shadow-[0_5px_0_0_#171717] active:translate-y-[2px] active:shadow-[0_1px_0_0_#171717]` 
                    : 'bg-neutral-100 opacity-40 border-neutral-400 shadow-none cursor-not-allowed'
                  }
                `}
              >
                {!isUnlocked && (
                  <div className="absolute top-1 right-1">
                    <Lock className="w-2.5 h-2.5 text-neutral-400" />
                  </div>
                )}
                
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
