// =========================================================================
// 🎵 WEB AUDIO API PROCEDURAL RETRO COZY SOUND SYNTHESIZER
// =========================================================================
// This utility leverages the browser's built-in Web Audio API to procedurally
// synthesize cozy retro chiptunes and audio feedback. No external network
// assets are needed, ensuring 100% offline reliability.
// =========================================================================

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmInterval: any = null;
  private isMuted: boolean = false;
  private bgmNotes: number[] = [261.63, 293.66, 329.63, 392.00, 440.00]; // Cozy C major pentatonic (C4, D4, E4, G4, A4)
  private bgmIndex: number = 0;

  constructor() {
    // Lazy-load AudioContext to comply with browser autoplay policies
    if (typeof window !== 'undefined') {
      this.isMuted = localStorage.getItem('sudoku_muted') === 'true';
    }
  }

  private initCtx() {
    if (this.ctx) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    this.masterGain = this.ctx.createGain();
    // Set initial volume
    this.masterGain.gain.value = this.isMuted ? 0 : 0.15; // cozy soft volume
    this.masterGain.connect(this.ctx.destination);
  }

  setMute(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sudoku_muted', String(muted));
    }

    if (!this.ctx) this.initCtx();
    
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.15, this.ctx!.currentTime);
    }

    if (muted) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
  }

  getMutedStatus(): boolean {
    return this.isMuted;
  }

  // 1. Crisp chiptune click blip
  playClick() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle'; // softer than square
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // 2. Cozy major chime for correct placements
  playCorrect() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    const playTone = (freq: number, delay: number, dur: number) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + delay);
      
      gain.gain.setValueAtTime(0, this.ctx!.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.25, this.ctx!.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + delay + dur);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(this.ctx!.currentTime + delay);
      osc.stop(this.ctx!.currentTime + delay + dur);
    };

    // Major 3rd arpeggio chime (C5 -> E5 -> G5)
    playTone(523.25, 0, 0.25);
    playTone(659.25, 0.08, 0.25);
    playTone(783.99, 0.16, 0.35);
  }

  // 3. Retro chiptune buzz for mistakes
  playError() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // 4. Triumph victory melody
  playVictory() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    const playTone = (freq: number, delay: number, dur: number) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + delay);

      gain.gain.setValueAtTime(0, this.ctx!.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.3, this.ctx!.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + delay + dur);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(this.ctx!.currentTime + delay);
      osc.stop(this.ctx!.currentTime + delay + dur);
    };

    // Upbeat major fanfare (C4 -> E4 -> G4 -> C5 -> E5 -> G5 -> C6!)
    playTone(261.63, 0, 0.15);
    playTone(329.63, 0.1, 0.15);
    playTone(392.00, 0.2, 0.15);
    playTone(523.25, 0.3, 0.15);
    playTone(659.25, 0.4, 0.15);
    playTone(783.99, 0.5, 0.15);
    playTone(1046.50, 0.6, 0.7);
  }

  // 5. Descending sad chiptune loop on defeat
  playDefeat() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    const playTone = (freq: number, delay: number, dur: number) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + delay);

      gain.gain.setValueAtTime(0, this.ctx!.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.3, this.ctx!.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + delay + dur);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(this.ctx!.currentTime + delay);
      osc.stop(this.ctx!.currentTime + delay + dur);
    };

    // Melancholy descending chords (C4 -> B3 -> A3 -> Ab3)
    playTone(261.63, 0, 0.25);
    playTone(246.94, 0.2, 0.25);
    playTone(220.00, 0.4, 0.25);
    playTone(207.65, 0.6, 0.7);
  }

  // 6. Ambient cozy chiptune music box loops (Procedural BGM)
  startBGM() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || this.bgmInterval) return;

    // A peaceful, minimal chime sequence played every 1.5 seconds
    this.bgmIndex = 0;
    this.bgmInterval = setInterval(() => {
      if (!this.ctx || this.isMuted) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Soft music box sine wave
      osc.type = 'sine';
      
      // Cozy arpeggio notes
      const notesArray = [261.63, 329.63, 392.00, 329.63, 440.00, 392.00, 523.25, 392.00];
      const freq = notesArray[this.bgmIndex % notesArray.length];
      this.bgmIndex++;

      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.3);
    }, 1500);
  }

  stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const soundManager = new SoundManager();
export default soundManager;
