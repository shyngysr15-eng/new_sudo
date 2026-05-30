import { create } from 'zustand';

export type GameView = 
  | null 
  | 'daily' 
  | 'custom-select' 
  | 'custom-play' 
  | 'multiplayer-lobby' 
  | 'multiplayer-play';

export type DifficultyMode = 'easy' | 'medium' | 'hard' | 'normal';

export interface GameState {
  activeView: GameView;
  difficulty: DifficultyMode;
  lobbyCode: string | null;
  opponentProgress: number;
  opponentName: string | null;
  setView: (view: GameView) => void;
  setDifficulty: (difficulty: DifficultyMode) => void;
  setLobbyCode: (code: string | null) => void;
  setOpponentProgress: (progress: number) => void;
  setOpponentName: (name: string | null) => void;
  resetGameStore: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  activeView: null,
  difficulty: 'normal',
  lobbyCode: null,
  opponentProgress: 0,
  opponentName: null,
  setView: (view) => set({ activeView: view }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setLobbyCode: (code) => set({ lobbyCode: code }),
  setOpponentProgress: (progress) => set({ opponentProgress: progress }),
  setOpponentName: (name) => set({ opponentName: name }),
  resetGameStore: () => set({
    activeView: null,
    difficulty: 'normal',
    lobbyCode: null,
    opponentProgress: 0,
    opponentName: null,
  }),
}));
export default useGameStore;
