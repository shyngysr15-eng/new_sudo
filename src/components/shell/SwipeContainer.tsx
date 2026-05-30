'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useDrag, useWheel } from '@use-gesture/react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useGameStore } from '../../store/useGameStore';
import ProfilePanel from '../panels/ProfilePanel';
import MainMenuPanel from '../panels/MainMenuPanel';
import LeaderboardPanel from '../panels/LeaderboardPanel';
import { SudokuBoard } from '../panels/SudokuBoard';
import { DifficultySelector } from '../panels/DifficultySelector';
import { MultiplayerLobby } from '../panels/MultiplayerLobby';

export const SwipeContainer: React.FC = () => {
  const { activeIndex, isAnimating, setAnimating, next, prev } = useNavigationStore();
  const { activeView } = useGameStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // High-performance Framer Motion value for vertical offsets
  const y = useMotionValue(0);

  // Trigger page snap animation using highly optimized spring mechanics
  const triggerTransition = (direction: 'next' | 'prev') => {
    if (isAnimating) return;
    
    const containerHeight = containerRef.current?.clientHeight || window.innerHeight;
    const target = direction === 'next' ? -containerHeight : containerHeight;
    
    setAnimating(true);
    
    animate(y, target, {
      type: 'spring',
      stiffness: 420,
      damping: 38,
      mass: 0.9,
      restDelta: 0.5,
      onComplete: () => {
        // Perform virtual ring switch
        if (direction === 'next') {
          next();
        } else {
          prev();
        }
        // Instantly reset position to 0 (invisible visual handoff)
        y.set(0);
        setAnimating(false);
      }
    });
  };

  // Keyboard navigation for power-users (Arrow keys)
  useEffect(() => {
    if (activeView !== null) return; // Disable keyboard panels swipe when inside game
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;
      if (e.key === 'ArrowUp') {
        triggerTransition('prev');
      } else if (e.key === 'ArrowDown') {
        triggerTransition('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnimating, activeIndex, activeView]);

  // Touch Swipe Gesture Processing (ignores micro-swipes to avoid false triggers)
  const bindDrag = useDrag(
    ({ active, movement: [, my], velocity: [, vy], direction: [, dy], cancel, event }) => {
      if (activeView !== null) return; // Disable drag swipes during active gameplay

      const target = event.target as HTMLElement;
      if (target.closest('.overflow-y-auto') && !target.closest('.overflow-y-auto')?.classList.contains('select-none')) {
        const scrollEl = target.closest('.overflow-y-auto') as HTMLElement;
        const isAtTop = scrollEl.scrollTop <= 0;
        const isAtBottom = Math.abs(scrollEl.scrollHeight - scrollEl.clientHeight - scrollEl.scrollTop) < 2;

        if (dy > 0 && !isAtTop) return; 
        if (dy < 0 && !isAtBottom) return; 
      }

      if (isAnimating) {
        cancel();
        return;
      }

      if (active) {
        y.set(my);
      } else {
        const containerHeight = containerRef.current?.clientHeight || window.innerHeight;
        const threshold = containerHeight * 0.22;
        const isFastSwipe = vy > 0.45;

        if (Math.abs(my) < 20) {
          animate(y, 0, { type: 'spring', stiffness: 450, damping: 40 });
          return;
        }

        if (my < -threshold || (isFastSwipe && dy < 0)) {
          triggerTransition('next');
        } else if (my > threshold || (isFastSwipe && dy > 0)) {
          triggerTransition('prev');
        } else {
          setAnimating(true);
          animate(y, 0, {
            type: 'spring',
            stiffness: 450,
            damping: 40,
            onComplete: () => setAnimating(false)
          });
        }
      }
    },
    {
      axis: 'y',
      filterTaps: true,
      pointer: { touch: true },
    }
  );

  // Mouse wheel and trackpad accumulation swipe scrolling
  const bindWheel = useWheel(
    ({ active, delta: [, dy], memo = 0 }) => {
      if (activeView !== null || isAnimating) return memo; // Block scrolling inside game

      const accumulated = memo + dy;
      const threshold = 140; 

      if (accumulated > threshold) {
        triggerTransition('next');
        return 0; 
      } else if (accumulated < -threshold) {
        triggerTransition('prev');
        return 0; 
      }

      return accumulated;
    },
    {
      axis: 'y',
    }
  );

  // If a game view is active, render it directly and skip swiper layout completely
  if (activeView !== null) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-[#FFF9E6]">
        {activeView === 'daily' && <SudokuBoard />}
        {activeView === 'custom-select' && <DifficultySelector />}
        {activeView === 'custom-play' && <SudokuBoard />}
        {(activeView === 'multiplayer-lobby' || activeView === 'multiplayer-play') && <MultiplayerLobby />}
      </div>
    );
  }

  // Map panel index to dynamic Y translate offset based on activeIndex
  const getPanelOffset = (panelIdx: number) => {
    const prevIdx = (activeIndex - 1 + 3) % 3;
    const nextIdx = (activeIndex + 1) % 3;

    if (panelIdx === activeIndex) return '0%';
    if (panelIdx === prevIdx) return '-100%';
    if (panelIdx === nextIdx) return '100%';
    return '100%'; 
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none bg-neutral-950"
      {...(bindDrag() as any)}
      {...(bindWheel() as any)}
    >
      {/* Moving gesture-bound track */}
      <motion.div
        style={{ y, translateZ: 0 }}
        className="absolute inset-0 w-full h-full will-change-transform transform-gpu"
      >
        {/* Profile Panel (Permanently Mounted) */}
        <div 
          className="absolute left-0 top-0 w-full h-full"
          style={{ transform: `translate3d(0, ${getPanelOffset(0)}, 0)` }}
        >
          <ProfilePanel />
        </div>

        {/* Main Menu Panel (Permanently Mounted) */}
        <div 
          className="absolute left-0 top-0 w-full h-full"
          style={{ transform: `translate3d(0, ${getPanelOffset(1)}, 0)` }}
        >
          <MainMenuPanel />
        </div>

        {/* Leaderboard Panel (Permanently Mounted) */}
        <div 
          className="absolute left-0 top-0 w-full h-full"
          style={{ transform: `translate3d(0, ${getPanelOffset(2)}, 0)` }}
        >
          <LeaderboardPanel />
        </div>
      </motion.div>

      {/* Ultra-subtle overlay indicator indicating active screen dot */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-50 pointer-events-none">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full border border-neutral-900/40 transition-all duration-300 ${
              activeIndex === i ? 'bg-neutral-800 scale-125' : 'bg-neutral-800/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SwipeContainer;
