'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Shield, ArrowUp, Zap, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface LeaderboardUser {
  rank: number;
  name: string;
  score: number; // Represents level / cumulative XP
  avatar: string;
  badge: string;
  badgeColor: string;
  solves: number;
}

// Fallback high scores in case database leaderboard has fewer than 3 entries
const DEFAULT_TOP_THREE: LeaderboardUser[] = [
  { rank: 2, name: 'HexaVoxel', score: 14280, avatar: '🦊', badge: 'Silver', badgeColor: 'bg-slate-300 text-slate-800', solves: 14 },
  { rank: 1, name: 'SudoKing', score: 18940, avatar: '👑', badge: 'Gold', badgeColor: 'bg-[#FFD369] text-neutral-900', solves: 25 },
  { rank: 3, name: 'CraftyCat', score: 12150, avatar: '🐱', badge: 'Bronze', badgeColor: 'bg-amber-600 text-amber-50', solves: 9 },
];

export const LeaderboardPanel: React.FC = () => {
  const [players, setPlayers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch live consolidated high scores from Supabase view
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('global_player_leaderboard')
          .select('*')
          .limit(10);

        if (error) throw error;

        const emojis = ['👑', '🦊', '🐱', '🥷', '👽', '🍞', '🧠', '🌵', '🐛', '🏠'];
        
        // Map postgres view rows to user-friendly leaderboard structures
        const mappedList: LeaderboardUser[] = (data || []).map((row, index) => {
          const scoreVal = row.level ?? 0;
          let badgeName = 'Novice';
          let badgeClass = 'bg-[#DFD3C3] text-neutral-700';

          if (scoreVal >= 1000) {
            badgeName = 'Legend';
            badgeClass = 'bg-indigo-600 text-white';
          } else if (scoreVal >= 500) {
            badgeName = 'Grandmaster';
            badgeClass = 'bg-purple-600 text-white';
          } else if (scoreVal >= 200) {
            badgeName = 'Expert';
            badgeClass = 'bg-neutral-800 text-neutral-200';
          } else if (scoreVal >= 100) {
            badgeName = 'Adept';
            badgeClass = 'bg-emerald-100 text-emerald-800';
          }

          return {
            rank: index + 1,
            name: row.nickname || 'Anonymous',
            score: scoreVal,
            avatar: row.avatar_url || emojis[index % emojis.length],
            badge: badgeName,
            badgeColor: badgeClass,
            solves: row.total_solves ?? 0,
          };
        });

        // Robust layout fallback: if fewer than 3 players are registered, fill with defaults
        const filledList = [...mappedList];
        if (filledList.length < 3) {
          const indexOffset = filledList.length;
          for (let i = indexOffset; i < 3; i++) {
            const defUser = DEFAULT_TOP_THREE[i];
            filledList.push({
              ...defUser,
              rank: i + 1,
            });
          }
        }

        // Sort properly for podium layout: index 0 is 2nd, index 1 is 1st, index 2 is 3rd
        const podiumReadyList = [...filledList];
        setPlayers(podiumReadyList);
      } catch (err) {
        console.error('Error fetching global leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Extract Podium participants
  const firstPlace = players[0] ? players.find(p => p.rank === 1) : DEFAULT_TOP_THREE[1];
  const secondPlace = players[0] ? players.find(p => p.rank === 2) : DEFAULT_TOP_THREE[0];
  const thirdPlace = players[0] ? players.find(p => p.rank === 3) : DEFAULT_TOP_THREE[2];

  // Extract scroll list players
  const scrollList = players.filter(p => p.rank > 3);

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

      {loading ? (
        <div className="flex-grow flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
          <span className="text-[10px] font-black uppercase text-neutral-500">Querying Rankings...</span>
        </div>
      ) : (
        <>
          {/* Voxel Podium Section */}
          <div className="flex items-end justify-center gap-4 my-4 pb-4">
            
            {/* 2nd Place Podium */}
            {secondPlace && (
              <div className="flex flex-col items-center">
                <div className="text-2xl mb-1">{secondPlace.avatar}</div>
                <span className="text-[10px] font-bold text-neutral-800 leading-tight uppercase max-w-[65px] truncate text-center">{secondPlace.name}</span>
                <span className="text-[8px] font-bold text-neutral-500 mb-2">{secondPlace.score} XP</span>
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
            )}

            {/* 1st Place Podium */}
            {firstPlace && (
              <div className="flex flex-col items-center">
                <div className="relative text-3xl mb-1">
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-sm rotate-12">👑</span>
                  {firstPlace.avatar}
                </div>
                <span className="text-[11px] font-extrabold text-neutral-900 leading-tight uppercase max-w-[70px] truncate text-center">{firstPlace.name}</span>
                <span className="text-[9px] font-extrabold text-amber-600 mb-2">{firstPlace.score} XP</span>
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
            )}

            {/* 3rd Place Podium */}
            {thirdPlace && (
              <div className="flex flex-col items-center">
                <div className="text-2xl mb-1">{thirdPlace.avatar}</div>
                <span className="text-[10px] font-bold text-neutral-800 leading-tight uppercase max-w-[65px] truncate text-center">{thirdPlace.name}</span>
                <span className="text-[8px] font-bold text-neutral-500 mb-2">{thirdPlace.score} XP</span>
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
            )}

          </div>

          {/* List Section */}
          <div className="flex-1 min-h-0 flex flex-col mt-2">
            <div 
              className="flex-1 overflow-y-auto border-2 border-neutral-900 rounded-2xl bg-[#FAF6EE] shadow-[3px_3px_0_0_#171717] p-2 pr-1"
              style={{ touchAction: 'pan-y' }}
            >
              {scrollList.length === 0 ? (
                <div className="w-full py-8 text-center text-xs font-black uppercase text-neutral-400">
                  Ready to compete? Start solving!
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 pb-2">
                  {scrollList.map((user) => (
                    <div 
                      key={user.rank}
                      className="flex items-center justify-between p-2 rounded-xl bg-white border border-neutral-200 hover:border-neutral-500 hover:shadow-[1px_1px_0_0_#171717] transition-all duration-100"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md border border-neutral-400 bg-[#E8F4F8] flex items-center justify-center text-[10px] font-extrabold text-neutral-600">
                          {user.rank}
                        </span>
                        <span className="text-md">{user.avatar}</span>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-extrabold uppercase leading-tight text-neutral-800">{user.name}</span>
                          <span className={`text-[6px] font-bold uppercase w-fit px-1 rounded mt-0.5 ${user.badgeColor}`}>
                            {user.badge}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-right">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase">{user.solves} Solves</span>
                        <span className="text-[11px] font-bold text-neutral-700">{user.score} XP</span>
                        <Zap className="w-3.5 h-3.5 fill-amber-400 stroke-neutral-900 stroke-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

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
