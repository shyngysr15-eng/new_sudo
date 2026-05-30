import { create } from 'zustand';

export type PanelType = 'profile' | 'menu' | 'leaderboard';

export interface NavigationState {
  activeIndex: number; // 0: Profile, 1: Main Menu, 2: Leaderboard
  isAnimating: boolean;
  setActiveIndex: (index: number) => void;
  setAnimating: (animating: boolean) => void;
  next: () => void;
  prev: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeIndex: 1, // Start at Main Menu / Game Hub (Center)
  isAnimating: false,
  setActiveIndex: (index) => set({ activeIndex: (index + 3) % 3 }),
  setAnimating: (isAnimating) => set({ isAnimating }),
  next: () => set((state) => ({ activeIndex: (state.activeIndex + 1) % 3 })),
  prev: () => set((state) => ({ activeIndex: (state.activeIndex - 1 + 3) % 3 })),
}));
