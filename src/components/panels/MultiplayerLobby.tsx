'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { useAuthStore } from '../../store/useAuthStore';
import { useGameStore } from '../../store/useGameStore';
import { generateSudoku, isValid } from '../../lib/sudokuGenerator';
import { 
  Users, ArrowLeft, Plus, LogIn, Trophy, Clock, 
  AlertTriangle, CheckCircle, Sparkles, Send, ShieldAlert,
  Edit3, Trash2
} from 'lucide-react';

export const MultiplayerLobby: React.FC = () => {
  const { user, profile, fetchProfile } = useAuthStore();
  const { 
    activeView, lobbyCode, opponentProgress, opponentName,
    setView, setLobbyCode, setOpponentProgress, setOpponentName, resetGameStore 
  } = useGameStore();

  const [mode, setMode] = useState<'menu' | 'waiting' | 'joining' | 'playing' | 'won' | 'lost'>('menu');
  const [inputCode, setInputCode] = useState('');
  const [role, setRole] = useState<'host' | 'client'>('host');
  
  // Game states (identical to SudokuBoard but synchronized)
  const [grid, setGrid] = useState<number[][]>([]);
  const [initial, setInitial] = useState<boolean[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [pencilMode, setPencilMode] = useState(false);
  const [notes, setNotes] = useState<number[][][]>(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => []))
  );
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const channelRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const nickname = profile?.nickname || 'Player';

  // 1. Calculate and broadcast local progress
  const getProgress = (currentGrid: number[][]) => {
    let emptyCount = 0;
    let correctCount = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!initial[r][c]) {
          emptyCount++;
          if (currentGrid[r][c] === solution[r][c]) {
            correctCount++;
          }
        }
      }
    }
    return emptyCount > 0 ? Math.round((correctCount / emptyCount) * 100) : 0;
  };

  const broadcastProgress = (progVal: number) => {
    if (channelRef.current && mode === 'playing') {
      channelRef.current.send({
        type: 'broadcast',
        event: 'progress',
        payload: {
          name: nickname,
          progress: progVal,
        }
      });
    }
  };

  // 2. Setup Realtime Broadcast Channel
  const connectChannel = (code: string) => {
    const channel = supabase.channel(`lobby_${code}`, {
      config: {
        broadcast: { self: false },
      }
    });

    channel
      .on('broadcast', { event: 'join' }, ({ payload }) => {
        // HOST ONLY: Client joins, so host sends the board data
        if (role === 'host') {
          setOpponentName(payload.name);
          setOpponentProgress(0);
          
          // Send grid data to sync client
          channel.send({
            type: 'broadcast',
            event: 'start',
            payload: {
              name: nickname,
              board: grid,
              solution: solution,
              initial: initial,
            }
          });
          setMode('playing');
        }
      })
      .on('broadcast', { event: 'start' }, ({ payload }) => {
        // CLIENT ONLY: Host sent game grid config
        if (role === 'client') {
          setOpponentName(payload.name);
          setOpponentProgress(0);
          setGrid(payload.board);
          setSolution(payload.solution);
          setInitial(payload.initial);
          setNotes(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => [])));
          setMistakes(0);
          setTimer(0);
          setMode('playing');
        }
      })
      .on('broadcast', { event: 'progress' }, ({ payload }) => {
        // Dynamic opponent tracking
        setOpponentProgress(payload.progress);
        if (!opponentName) {
          setOpponentName(payload.name);
        }
      })
      .on('broadcast', { event: 'win' }, ({ payload }) => {
        // Defeat condition: opponent won
        setMode('lost');
        setOpponentProgress(100);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Connected to room lobby_${code}`);
          if (role === 'client') {
            // Send join alert to host
            channel.send({
              type: 'broadcast',
              event: 'join',
              payload: { name: nickname }
            });
          }
        }
      });

    channelRef.current = channel;
  };

  // Cleanup channel on leave
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 3. Timer loop
  useEffect(() => {
    if (mode === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode]);

  // 4. Host Lobbies Creation
  const createLobby = () => {
    setLoading(true);
    setErrorMsg(null);
    setRole('host');

    // Generate lobby code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setLobbyCode(code);

    // Generate exact shared puzzle
    const puzzle = generateSudoku('normal');
    setGrid(puzzle.board.map((row) => [...row]));
    setSolution(puzzle.solution);
    setInitial(puzzle.board.map((row) => row.map((cell) => cell !== 0)));

    connectChannel(code);
    setMode('waiting');
    setLoading(false);
  };

  // 5. Join Lobbies Entry
  const joinLobby = () => {
    if (inputCode.length !== 4) {
      setErrorMsg('Lobby code must be exactly 4 digits.');
      return;
    }

    setRole('client');
    setLobbyCode(inputCode);
    connectChannel(inputCode);
    setMode('joining');
  };

  const handleCellSelect = (r: number, c: number) => {
    if (mode !== 'playing') return;
    setSelected([r, c]);
  };

  // 6. Handle Input Number
  const inputNumber = (num: number) => {
    if (mode !== 'playing' || !selected) return;
    const [row, col] = selected;

    if (initial[row][col]) return; // clues locked

    if (pencilMode) {
      // notes mode
      const cellNotes = [...notes[row][col]];
      if (cellNotes.includes(num)) {
        setNotes((prev) => {
          const next = prev.map((r) => r.map((c) => [...c]));
          next[row][col] = cellNotes.filter((n) => n !== num);
          return next;
        });
      } else {
        setNotes((prev) => {
          const next = prev.map((r) => r.map((c) => [...c]));
          next[row][col] = [...cellNotes, num].sort();
          return next;
        });
      }
      setGrid((prev) => {
        const next = prev.map((r) => [...r]);
        next[row][col] = 0;
        return next;
      });
    } else {
      // placement mode
      setNotes((prev) => {
        const next = prev.map((r) => r.map((c) => [...c]));
        next[row][col] = [];
        return next;
      });

      const correct = num === solution[row][col];
      if (correct) {
        const nextGrid = grid.map((r) => [...r]);
        nextGrid[row][col] = num;
        setGrid(nextGrid);

        const currentProgress = getProgress(nextGrid);
        broadcastProgress(currentProgress);

        if (currentProgress >= 100) {
          // VICTORY: Solve completely!
          setMode('won');
          if (channelRef.current) {
            channelRef.current.send({
              type: 'broadcast',
              event: 'win',
              payload: { name: nickname }
            });
          }
          awardVictoryXP();
        }
      } else {
        const nextMistakes = mistakes + 1;
        setMistakes(nextMistakes);
        if (nextMistakes >= 3) {
          // Auto-defeat if mistakes equal 3
          setMode('lost');
        }
      }
    }
  };

  const eraseCell = () => {
    if (mode !== 'playing' || !selected) return;
    const [row, col] = selected;
    if (initial[row][col]) return;

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

  const awardVictoryXP = async () => {
    if (!user) return;
    try {
      // Award massive multiplayer victory bonus +300 XP
      const currentLevel = profile?.level ?? 0;
      await supabase
        .from('profiles')
        .update({ level: currentLevel + 300 })
        .eq('id', user.id);
      
      await fetchProfile(user.id);
    } catch (err) {
      console.error('Error awarding multiplayer victory score:', err);
    }
  };

  const isHighlighted = (r: number, c: number) => {
    if (!selected) return false;
    const [sRow, sCol] = selected;
    if (r === sRow || c === sCol) return true;
    
    const sBoxRow = sRow - (sRow % 3);
    const sBoxCol = sCol - (sCol % 3);
    const cBoxRow = r - (r % 3);
    const cBoxCol = c - (c % 3);
    return sBoxRow === cBoxRow && sBoxCol === cBoxCol;
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleBackToMenu = () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
    resetGameStore();
  };

  return (
    <div className="w-full h-full text-black flex flex-col justify-between p-6 select-none bg-[#FFF9E6]">
      
      {/* ========================================================================= */}
      {/* 🏛️ MENU LOBBY MATCHMAKING VIEW */}
      {/* ========================================================================= */}
      {mode === 'menu' && (
        <div className="flex-1 flex flex-col justify-between py-6">
          <div className="flex items-center gap-4 mt-2 border-b border-black pb-3">
            <button 
              onClick={handleBackToMenu}
              className="w-9 h-9 rounded-lg border-2 border-black bg-[#FFFDF9] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer outline-none transition-all duration-75"
            >
              <ArrowLeft className="w-4 h-4 text-black stroke-[2.5px]" />
            </button>
            <span className="text-sm font-black uppercase tracking-wider">Multiplayer Battle</span>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-8 w-full max-w-[290px] mx-auto">
            <div className="text-center">
              <Users className="w-16 h-16 text-[#E74C3C] stroke-[2px] mx-auto mb-2" />
              <h3 className="text-lg font-black uppercase tracking-wide">Dynamic Dual Duels</h3>
              <p className="text-[9px] text-neutral-500 uppercase font-black leading-relaxed mt-1">
                Play the exact same board concurrently against a friend! First to 100% correct wins.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 border-2 border-red-500 bg-red-100 text-red-700 text-xs font-black rounded-xl uppercase">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {/* Option A: Create Match Room */}
              <button
                onClick={createLobby}
                disabled={loading}
                className="w-full py-4 border-[3px] border-black bg-[#FFD369] text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer outline-none transition-all duration-75 flex items-center justify-center gap-2"
              >
                <Plus className="w-4.5 h-4.5 stroke-[3px]" />
                <span>Create Lobby Room</span>
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-black border-dashed"></div>
                <span className="flex-shrink mx-4 text-[9px] font-black uppercase text-neutral-400">OR JOIN MATCH</span>
                <div className="flex-grow border-t border-black border-dashed"></div>
              </div>

              {/* Option B: Enter Match Room Code */}
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="ENTER 4-DIGIT CODE"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full text-center py-3 border-3 border-black rounded-xl text-lg font-black bg-white uppercase placeholder-neutral-400 tracking-widest focus:outline-none"
                />
                <button
                  onClick={joinLobby}
                  className="w-full py-3.5 border-[3px] border-black bg-[#E74C3C] text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer outline-none transition-all duration-75 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4.5 h-4.5 stroke-[3px]" />
                  <span>Join Opponent's Room</span>
                </button>
              </div>
            </div>
          </div>
          <div className="h-9" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🕒 WAITING FOR OPPONENT VIEW */}
      {/* ========================================================================= */}
      {mode === 'waiting' && (
        <div className="flex-1 flex flex-col justify-between py-6">
          <div className="flex items-center gap-4 mt-2 border-b border-black pb-3">
            <button 
              onClick={handleBackToMenu}
              className="w-9 h-9 rounded-lg border-2 border-black bg-[#FFFDF9] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer outline-none transition-all duration-75"
            >
              <ArrowLeft className="w-4 h-4 text-black stroke-[2.5px]" />
            </button>
            <span className="text-sm font-black uppercase tracking-wider">Lobby created</span>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 max-w-[290px] mx-auto">
            <h3 className="text-lg font-black uppercase tracking-wide">Waiting for Opponent...</h3>
            
            {/* LOBBY CODE BOX */}
            <div className="p-6 border-3 border-black bg-[#FFD369] rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/50 mb-1 block">SHARE CODE WITH FRIEND</span>
              <span className="text-5xl font-black tracking-widest">{lobbyCode}</span>
            </div>

            <p className="text-[10px] text-neutral-500 uppercase font-black leading-relaxed">
              Once your friend opens their game, clicks "Multiplayer Battle" and enters this 4-digit code, the duel will instantly start!
            </p>
          </div>
          <div className="h-9" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📡 JOINING / CONNECTING VIEW */}
      {/* ========================================================================= */}
      {mode === 'joining' && (
        <div className="flex-1 flex flex-col justify-center items-center text-center gap-4">
          <div className="p-4 bg-[#FFFDF9] border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-4 text-black max-w-[260px]">
            <Users className="w-10 h-10 animate-pulse text-[#E74C3C] stroke-[2.5px]" />
            <span className="text-xs font-black uppercase tracking-wider">Connecting to Room {lobbyCode}...</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ⚔️ ACTIVE MULTIPLAYER PLAY VIEW */}
      {/* ========================================================================= */}
      {mode === 'playing' && (
        <div className="flex-grow flex flex-col justify-between py-2">
          
          {/* TOP REALTIME STATS (Opponent vs Local progress) */}
          <div className="w-full flex flex-col gap-2 border-b border-black pb-2 mb-2">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wide text-neutral-600">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span>You: {getProgress(grid)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timer)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>{opponentName || 'Opponent'}: {opponentProgress}%</span>
              </div>
            </div>

            {/* Visual Duel Bar */}
            <div className="w-full h-3 border-2 border-black bg-neutral-200 rounded-md overflow-hidden flex">
              <div 
                className="h-full bg-[#FFD369] border-r-2 border-black transition-all duration-300"
                style={{ width: `${getProgress(grid)}%` }}
              />
              <div 
                className="h-full bg-[#E74C3C] transition-all duration-300"
                style={{ width: `${opponentProgress}%` }}
              />
            </div>
            
            {/* Mistake Alert */}
            <div className="flex justify-between items-center text-[9px] font-black uppercase">
              <span className="text-neutral-400">Battle Room: {lobbyCode}</span>
              <span className="text-red-700 bg-red-100 border border-black px-1.5 py-0.5 rounded leading-none">
                Mistakes: {mistakes}/3
              </span>
            </div>
          </div>

          {/* 9x9 SUDOKU DUEL BOARD */}
          <div className="w-full max-w-[290px] mx-auto aspect-square bg-[#FFFDF9] border-[3px] border-black rounded-xl p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid grid-cols-9 gap-px relative overflow-hidden">
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
                    onClick={() => handleCellSelect(rIdx, cIdx)}
                    className={`
                      relative flex items-center justify-center cursor-pointer select-none text-sm font-black
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
                      <div className="absolute inset-0.5 grid grid-cols-3 grid-rows-3 gap-0 text-[6px] text-neutral-400 font-bold leading-none select-none">
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

          {/* 🛠️ PLAY TOOLS ROW (Notes, Erase) */}
          <div className="w-full flex justify-center gap-4 my-2">
            <button
              onClick={() => setPencilMode(!pencilMode)}
              className={`w-14 h-11 border-2 border-black rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-75 ${
                pencilMode ? 'bg-[#FFD369]' : 'bg-[#FFFDF9]'
              }`}
            >
              <Edit3 className="w-4 h-4 text-black" />
              <span className="text-[7px] font-black uppercase">Notes</span>
            </button>

            <button
              onClick={eraseCell}
              className="w-14 h-11 border-2 border-black bg-[#FFFDF9] rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-75"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span className="text-[7px] font-black uppercase text-neutral-600">Erase</span>
            </button>
          </div>

          {/* 🔢 KEYPAD INPUT */}
          <div className="w-full max-w-[270px] mx-auto grid grid-cols-9 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => inputNumber(num)}
                className="h-9 border-2 border-black bg-[#FFFDF9] rounded-lg text-xs font-black flex items-center justify-center cursor-pointer shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] outline-none"
              >
                {num}
              </button>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 🏆 VICTORY DUEL RESULT SCREEN */}
      {/* ========================================================================= */}
      {mode === 'won' && (
        <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
          <div className="w-full max-w-sm bg-[#FFFDF9] border-[3px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-[#FFE699] border-2 border-black rounded-full shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                <Trophy className="w-12 h-12 text-[#D4A325] stroke-[2px]" />
              </div>
            </div>

            <h2 className="text-2xl font-black uppercase tracking-wider text-[#2ECC71]">
              DUEL VICTORY!
            </h2>
            <p className="text-xs font-black uppercase tracking-wide text-neutral-500 mt-1">
              You beat {opponentName || 'opponent'}!
            </p>

            <div className="my-5 p-3.5 border-2 border-black bg-[#E8F4F8] rounded-xl flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-600 animate-spin" />
              <span className="text-sm font-black uppercase text-sky-700">
                +300 XP Duel Winner Bonus!
              </span>
            </div>

            <button
              onClick={handleBackToMenu}
              className="w-full py-3.5 border-2 border-black bg-[#2ECC71] text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer outline-none"
            >
              Back to Main Menu
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💥 DEFEAT DUEL RESULT SCREEN */}
      {/* ========================================================================= */}
      {mode === 'lost' && (
        <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
          <div className="w-full max-w-sm bg-[#FFFDF9] border-[3px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-100 border-2 border-black rounded-full shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                <ShieldAlert className="w-12 h-12 text-red-500 stroke-[2px]" />
              </div>
            </div>

            <h2 className="text-2xl font-black uppercase tracking-wider text-red-600">
              DUEL DEFEAT!
            </h2>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mt-1">
              {opponentName || 'Opponent'} solved the board first!
            </p>

            <div className="my-5 p-3.5 border-2 border-black bg-neutral-100 rounded-xl flex flex-col gap-1 text-xs font-black uppercase text-neutral-600">
              <p>Opponent completed: 100%</p>
              <p>Your completion: {getProgress(grid)}%</p>
            </div>

            <button
              onClick={handleBackToMenu}
              className="w-full py-3.5 border-2 border-black bg-neutral-300 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] cursor-pointer outline-none"
            >
              Back to Main Menu
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default MultiplayerLobby;
