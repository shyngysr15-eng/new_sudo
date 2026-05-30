export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Returns a pseudorandom float between 0 and 1
  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  // Returns a pseudorandom integer in range [min, max]
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Shuffle array in-place using seeded random
  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled;
  }
}

// Check if placing num in grid[row][col] is valid
export function isValid(grid: number[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[startRow + r][startCol + c] === num) return false;
    }
  }

  return true;
}

// Backtracking solver
export function solveSudoku(grid: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) {
              return true;
            }
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Fill individual 3x3 box
function fillBox(grid: number[][], row: number, col: number, rng: SeededRandom) {
  let numList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  numList = rng.shuffle(numList);
  
  let index = 0;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      grid[row + r][col + c] = numList[index++];
    }
  }
}

// Solves with random candidates (using our seeded PRNG) for generation
function fillGridSeeded(grid: number[][], rng: SeededRandom): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        nums = rng.shuffle(nums);
        
        for (const num of nums) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGridSeeded(grid, rng)) {
              return true;
            }
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export interface SudokuPuzzle {
  board: number[][];       // Puzzle board (with 0s)
  solution: number[][];    // Fully solved board
}

// Main generation function
export function generateSudoku(difficulty: 'easy' | 'medium' | 'hard' | 'normal', customSeed?: number): SudokuPuzzle {
  // Determine seed
  let seed = customSeed;
  if (seed === undefined) {
    if (difficulty === 'normal') {
      // Daily seed: sum date numbers e.g. 2026 + 5 + 30 = 2061
      const d = new Date();
      seed = d.getFullYear() + (d.getMonth() + 1) + d.getDate();
    } else {
      seed = Math.floor(Math.random() * 1000000);
    }
  }

  const rng = new SeededRandom(seed);
  
  // 1. Initialize empty grid
  const grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  
  // 2. Fill diagonal 3x3 boxes (independent, safe to fill randomly)
  fillBox(grid, 0, 0, rng);
  fillBox(grid, 3, 3, rng);
  fillBox(grid, 6, 6, rng);
  
  // 3. Solve the rest of the board using Seeded PRNG
  fillGridSeeded(grid, rng);
  
  // Save full solution
  const solution = grid.map((row) => [...row]);
  
  // 4. Remove cells according to difficulty clues count
  // Easy: 40 remaining clues, Medium: 32 clues, Hard: 24 clues, Normal (Daily): 35 clues
  let cluesCount = 35;
  if (difficulty === 'easy') cluesCount = 40;
  if (difficulty === 'medium') cluesCount = 32;
  if (difficulty === 'hard') cluesCount = 24;

  const totalCellsToRemove = 81 - cluesCount;
  
  // Get all cell indices and shuffle them
  let indices: number[] = Array.from({ length: 81 }, (_, i) => i);
  indices = rng.shuffle(indices);

  const board = grid.map((row) => [...row]);
  
  for (let i = 0; i < totalCellsToRemove; i++) {
    const idx = indices[i];
    const r = Math.floor(idx / 9);
    const c = idx % 9;
    board[r][c] = 0; // set as empty
  }

  return { board, solution };
}
