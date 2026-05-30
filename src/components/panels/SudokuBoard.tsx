'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { generateSudoku, isValid } from '../../lib/sudokuGenerator';
import { useAuthStore } from '../../store/useAuthStore';
import { useGameStore } from '../../store/useGameStore';
import { supabase } from '../../lib/supabaseClient';
import { soundManager } from '../../lib/soundManager';
import { 
  Trophy, ArrowLeft, RefreshCw, Edit3, Trash2, 
  Clock, AlertTriangle, CheckCircle, Sparkles 
} from 'lucide-react';

export const SudokuBoard: React.FC = () => {
  const { user, profile, fetchProfile } = useAuthStore();
  const { activeView, difficulty, setView, resetGameStore } = useGameStore();

  const [grid, setGrid] = useState<number[][]>([]);
  const [initial, setInitial] = useState<boolean[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  
  // 9x9 grid of notes arrays
  const [notes, setNotes] = useState<number[][][]>(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => []))
  );

  const [pencilMode, setPencilMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [xpAwarded, setXpAwarded] = useState(0);
  const [savingDb, setSavingDb] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initialize Board
  useEffect(() => {
    const startNewGame = () => {
      try {
        const puzzle = generateSudoku(difficulty);
        setGrid(puzzle.board.map((row) => [...row]));
        setSolution(puzzle.solution);
        setInitial(puzzle.board.map((row) => row.map((cell) => cell !== 0)));
        setNotes(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => [])));
        setMistakes(0);
        setTimer(0);
        setStatus('playing');
        setXpAwarded(0);
        setErrorMessage(null);
      } catch (err) {
        console.error('Sudoku generation error:', err);
      }
    };

    startNewGame();
  }, [difficulty]);

  // 2. Timer Loop
  useEffect(() => {
    if (status === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // 3. Format Timer
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 4. Handle Cell Selection
  const selectCell = (row: number, col: number) => {
    if (status !== 'playing') return;
    soundManager.playClick();
    setSelected([row, col]);
  };

  // 5. Check Victory State
  const checkVictory = (currentGrid: number[][]) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentGrid[r][c] !== solution[r][c]) {
          return false; 
        }
      }
    }
    return true; 
  };

  // 6. Handle Database Saving and XP Awards on Win
  const handleVictory = async (finalTime: number) => {
    setStatus('won');
    soundManager.playVictory();
    if (!user) return;

    setSavingDb(true);
    setErrorMessage(null);

    // Calculate XP
    let xp = 150; 
    if (difficulty === 'easy') xp = 50;
    if (difficulty === 'medium') xp = 100;
    if (difficulty === 'hard') xp = 200;

    setXpAwarded(xp);

    try {
      if (difficulty === 'normal') {
        const todayStr = new Date().toISOString().split('T')[0];
        
        const { error: dailyErr } = await supabase.from('daily_solves').insert({
          user_id: user.id,
          solve_date: todayStr,
          time_taken: finalTime,
        });

        if (dailyErr) {
          if (dailyErr.code === '23505') { 
            setErrorMessage("You have already logged a Daily Solve today! XP was not re-awarded.");
            setSavingDb(false);
            return;
          }
          throw dailyErr;
        }
      }

      // Increment User Level/XP in Profiles
      const currentLevel = profile?.level ?? 0;
      const { error: profileErr } = await supabase
        .from('profiles')
        .update({ level: currentLevel + xp })
        .eq('id', user.id);

      if (profileErr) throw profileErr;

      // Reload global profile state to update user screens instantly
      await fetchProfile(user.id);
    } catch (err: any) {
      console.error('Error logging solve results:', err);
      setErrorMessage(err.message || 'Database sync error occurred.');
    } finally {
      setSavingDb(false);
    }
  };

  // 7. Input Number
  const inputNumber = (num: number) => {
    if (status !== 'playing' || !selected) return;
    const [row, col] = selected;

    if (initial[row][col]) return; // locked cell

    if (pencilMode) {
      // PENCIL MARKS / NOTES MODE
      soundManager.playClick();
      const currentNotes = [...notes[row][col]];
      if (currentNotes.includes(num)) {
        // Remove note
        setNotes((prev) => {
          const next = prev.map((r) => r.map((c) => [...c]));
          next[row][col] = currentNotes.filter((n) => n !== num);
          return next;
        });
      } else {
        // Add note
        setNotes((prev) => {
          const next = prev.map((r) => r.map((c) => [...c]));
          next[row][col] = [...currentNotes, num].sort();
          return next;
        });
      }
      // Clear cell value if notes are entered
      setGrid((prev) => {
        const next = prev.map((r) => [...r]);
        next[row][col] = 0;
        return next;
      });
    } else {
      // VALUE PLACEMENT MODE
      // Clear notes in this cell
      setNotes((prev) => {
        const next = prev.map((r) => r.map((c) => [...c]));
        next[row][col] = [];
        return next;
      });

      const isCorrect = num === solution[row][col];

      if (isCorrect) {
        // Set correct value
        soundManager.playCorrect();
        const newGrid = grid.map((r) => [...r]);
        newGrid[row][col] = num;
        setGrid(newGrid);

        // Check if game is completed
        if (checkVictory(newGrid)) {
          handleVictory(timer);
        }
      } else {
        // Mistake!
        soundManager.playError();
        const nextMistakes = mistakes + 1;
        setMistakes(nextMistakes);
        
        if (nextMistakes >= 3) {
          soundManager.playDefeat();
          setStatus('lost');
        }
      }
    }
  };

  // 8. Erase Cell
  const eraseCell = () => {
    if (status !== 'playing' || !selected) return;
    const [row, col] = selected;
    if (initial[row][col]) return;
    
    soundManager.playClick();

    setGrid((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = 0;
      return next;
    });

    setNotes((prev) => {
      const next = prev.map((r) => r.map((c) => [...c]));
      next[row][col] = [];
      return next;
    });
  };

  const handleBackToMenu = () => {
    soundManager.playClick();
    resetGameStore();
  };

  // Helper check for highlighted connections (row, col, box)
  const isHighlighted = (r: number, c: number) => {
    if (!selected) return false;
    const [selRow, selCol] = selected;
    if (r === selRow || c === selCol) return true;
    
    const selBoxRow = selRow - (selRow % 3);
    const selBoxCol = selCol - (selCol % 3);
    const cellBoxRow = r - (r % 3);
    const cellBoxCol = c - (c % 3);
    
    return selBoxRow === cellBoxRow && selBoxCol === cellBoxCol;
  };

  return (
    <div className="w-full h-full text-black flex flex-col justify-between p-6 select-none bg-[#FFF9E6]">
      
      {/* 🏛 ... HEADER CONTROLS */}
      <div className="relative z-10 w-full flex justify-between items-center mt-2 border-b border-black pb-3">
        <button 
          onClick={handleBackToMenu}
          className="w-9 h-9 rounded-lg border-2 border-black bg-[#FFFDF9] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer outline-none transition-all duration-75"
        >
          <ArrowLeft className="w-4 h-4 text-black stroke-[2.5px]" />
        </button>

        <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 border border-black rounded bg-[#FFFDF9]">
          {difficulty === 'normal' ? 'Daily Challenge' : `Custom: ${difficulty}`}
        </span>

        <div className="flex items-center gap-1 bg-[#FFFDF9] border border-black px-2.5 py-1 rounded">
          <Clock className="w-3.5 h-3.5 text-neutral-600 stroke-[2px]" />
          <span className="text-xs font-black leading-none">{formatTime(timer)}</span>
        </div>
      </div>

      {/* 📊 GAME INTERFACE */}
      {status === 'playing' ? (
        <div className="flex-1 flex flex-col justify-center my-3">
          
          {/* MISTAKES CONTROLLER */}
          <div className="w-full flex justify-between items-center mb-3">
            <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">
              Sudoku Craft
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 border border-black bg-red-100 rounded text-red-700">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase">
                Mistakes: {mistakes}/3
              </span>
            </div>
          </div>

          {/* 9x9 SUDOKU BOARD GRID MAPPED IN SOFT NEO-BRUTALISM */}
          <div className="w-full max-w-[312px] mx-auto aspect-square bg-[#FFFDF9] border-[3px] border-black rounded-xl p-1 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] grid grid-cols-9 gap-px relative overflow-hidden">
            {grid.map((row, rIdx) => 
              row.map((val, cIdx) => {
                const isClue = initial[rIdx][cIdx];
                const isSelected = selected && selected[0] === rIdx && selected[1] === cIdx;
                const isLinked = isHighlighted(rIdx, cIdx);
                
                const borderRight = (cIdx === 2 || cIdx === 5) ? 'border-r-2 border-black' : '';
                const borderBottom = (rIdx === 2 || rIdx === 5) ? 'border-b-2 border-black' : '';

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => selectCell(rIdx, cIdx)}
                    className={`
                      relative flex items-center justify-center cursor-pointer select-none text-[15px] font-black
                      ${borderRight} ${borderBottom}
                      ${isSelected 
                        ? 'bg-[#3498DB]/30' 
                        : isLinked 
                          ? 'bg-[#3498DB]/10' 
                          : 'bg-transparent'
                      }
                      transition-colors duration-100
                    `}
                  >
                    {val !== 0 ? (
                      <span className={isClue ? 'text-black font-extrabold' : 'text-[#3498DB]'}>
                        {val}
                      </span>
                    ) : (
                      <div className="absolute inset-0.5 grid grid-cols-3 grid-rows-3 gap-0 text-[7px] text-neutral-500 font-bold leading-none select-none">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                          <div key={n} className="flex items-center justify-center">
                            {notes[rIdx][cIdx].includes(n) ? n : ''}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* 🛠️ PLAY TOOLS ROW (Notes, Erase, Clear) */}
          <div className="w-full flex justify-center gap-4 my-5">
            {/* Note-Taking Mode Toggle */}
            <button
              onClick={() => {
                soundManager.playClick();
                setPencilMode(!pencilMode);
              }}
              className={`w-14 h-12 border-2 border-black rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-75 ${
                pencilMode ? 'bg-[#FFD369]' : 'bg-[#FFFDF9]'
              }`}
            >
              <Edit3 className="w-4 h-4 text-black stroke-[2px]" />
              <span className="text-[8px] font-black uppercase">Notes: {pencilMode ? 'On' : 'Off'}</span>
            </button>

            {/* Eraser Tool */}
            <button
              onClick={eraseCell}
              className="w-14 h-12 border-2 border-black bg-[#FFFDF9] rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-75"
            >
              <Trash2 className="w-4 h-4 text-red-500 stroke-[2px]" />
              <span className="text-[8px] font-black uppercase text-neutral-600">Erase</span>
            </button>
          </div>

          {/* 🔢 KEYPAD INPUT SYSTEM */}
          <div className="w-full max-w-[280px] mx-auto grid grid-cols-5 gap-2.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.05 }}
                whileTap={{ x: 2, y: 2, boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)' }}
                onClick={() => inputNumber(num)}
                className="h-10 border-2 border-black bg-[#FFFDF9] rounded-lg text-sm font-black flex items-center justify-center cursor-pointer shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] outline-none"
              >
                {num}
              </motion.button>
            ))}
          </div>

        </div>
      ) : status === 'won' ? (
        
        // 🏆 VICTORY PANEL
        <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
          <motion.div 
            initial={{ scale: 0.8, rotate: -3 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-full max-w-sm bg-[#FFFDF9] border-[3px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black"
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-[#FFE699] border-2 border-black rounded-full shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                <Trophy className="w-12 h-12 text-[#D4A325] stroke-[2px]" />
              </div>
            </div>

            <h2 className="text-2xl font-black uppercase tracking-wider">
              Grid Solved!
            </h2>
            <p className="text-xs font-black uppercase tracking-wide text-[#2ECC71] mt-1 flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Perfect Solve Verified
            </p>

            <div className="my-5 p-3 border-2 border-black bg-neutral-50 rounded-xl flex justify-between text-xs font-black uppercase">
              <span className="text-neutral-500">Solve Time:</span>
              <span>{formatTime(timer)}</span>
            </div>

            {savingDb ? (
              <div className="mb-4 text-xs font-black uppercase text-neutral-500 animate-pulse">
                Saving score to Supabase Leaderboard...
              </div>
            ) : errorMessage ? (
              <div className="mb-4 p-2.5 border border-black bg-red-100 text-red-700 text-[10px] font-bold rounded-lg uppercase">
                {errorMessage}
              </div>
            ) : (
              <div className="mb-4 p-3 border-2 border-black bg-[#E8F4F8] rounded-xl flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-600 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="text-sm font-black uppercase text-sky-700">
                  +{xpAwarded} XP gained!
                </span>
              </div>
            )}

            <button
              onClick={handleBackToMenu}
              className="w-full py-3.5 border-2 border-black bg-[#2ECC71] text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer outline-none transition-all duration-75"
            >
              Back to Main Menu
            </button>
          </motion.div>
        </div>

      ) : (

        // 💥 DEFEAT SCREEN PANEL
        <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
          <div className="w-full max-w-sm bg-[#FFFDF9] border-[3px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-100 border-2 border-black rounded-full shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                <AlertTriangle className="w-12 h-12 text-red-500 stroke-[2px]" />
              </div>
            </div>

            <h2 className="text-2xl font-black uppercase tracking-wider text-red-600">
              Defeat
            </h2>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mt-1">
              Too many mistakes (3/3)
            </p>

            <div className="my-5 p-3.5 border-2 border-black bg-neutral-100 rounded-xl flex flex-col gap-1.5 text-xs font-black uppercase text-neutral-600">
              <p>Sudoku Craft requires precision.</p>
              <p className="text-[10px] text-neutral-400">Pencil marks help prevent mistakes!</p>
            </div>

            <button
              onClick={handleBackToMenu}
              className="w-full py-3.5 border-2 border-black bg-neutral-200 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer outline-none transition-all duration-75"
            >
              Back to Main Menu
            </button>
          </div>
        </div>

      )}

    </div>
  );
};

export default SudokuBoard;
