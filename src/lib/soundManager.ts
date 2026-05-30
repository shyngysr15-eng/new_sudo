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
  private clickBuffer: AudioBuffer | null = null;

  constructor() {
    // Lazy-load AudioContext to comply with browser autoplay policies
    if (typeof window !== 'undefined') {
      this.isMuted = localStorage.getItem('sudoku_muted') === 'true';

      // Setup a global click/touchstart handler to transition AudioContext out of 'suspended' state on first tap
      const handleGesture = () => {
        this.resumeContext();
        window.removeEventListener('click', handleGesture);
        window.removeEventListener('touchstart', handleGesture);
      };
      window.addEventListener('click', handleGesture, { passive: true });
      window.addEventListener('touchstart', handleGesture, { passive: true });
    }
  }

  private async loadClickSound() {
    if (this.clickBuffer || !this.ctx) return;
    try {
      const response = await fetch('/mixkit-cool-interface-click-tone-2568.mp3');
      const arrayBuffer = await response.arrayBuffer();
      // Decode audio data safely in browser
      this.clickBuffer = await this.ctx.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.error('Failed to load or decode static click sound:', e);
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      // Set initial volume
      this.masterGain.gain.value = this.isMuted ? 0 : 0.15; // cozy soft volume
      this.masterGain.connect(this.ctx.destination);

      // Eagerly load the MP3 sound file
      this.loadClickSound();
    }
    
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(err => console.log('Autoplay context resume attempt inside initCtx:', err));
    }
  }

  resumeContext() {
    this.initCtx();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
        .then(() => {
          console.log('AudioContext resumed successfully via user gesture.');
          if (!this.isMuted) {
            this.startBGM();
          }
        })
        .catch(err => console.error('Failed to resume AudioContext:', err));
    } else if (this.ctx && this.ctx.state === 'running') {
      if (!this.isMuted && !this.bgmInterval) {
        this.startBGM();
      }
    }
  }

  setMute(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sudoku_muted', String(muted));
    }

    this.initCtx();
    
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.15, this.ctx.currentTime);
    }

    if (muted) {
      this.stopBGM();
    } else {
      this.resumeContext();
    }
  }

  getMutedStatus(): boolean {
    return this.isMuted;
  }

  private playMp3Click() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    if (this.clickBuffer) {
      const source = this.ctx.createBufferSource();
      source.buffer = this.clickBuffer;
      source.connect(this.masterGain!);
      source.start();
    } else {
      // Fallback bubble pop if buffer isn't loaded yet
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    }
  }

  // 1. Crisp click blip (Default)
  playClick() {
    this.playMp3Click();
  }

  // 2. Specialized: "Daily Challenges" click (Now mapped to MP3)
  playDailyClick() {
    this.playMp3Click();
  }

  // 3. Specialized: "Custom Mode" click (Now mapped to MP3)
  playCustomClick() {
    this.playMp3Click();
  }

  // 4. Specialized: "Multiplayer" click (Now mapped to MP3)
  playMultiplayerClick() {
    this.playMp3Click();
  }

  // 5. Specialized: Volume Switch & Small buttons (Now mapped to MP3)
  playToggleClick() {
    this.playMp3Click();
  }

  // 6. Cozy major chime for correct placements (Satisfying heavy stone block Minecraft thud + arpeggio tail!)
  playCorrect() {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;

    // A. Satisfying Minecraft-style heavy stone thud ASMR
    const thudOsc = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    const lpFilter = this.ctx.createBiquadFilter();

    lpFilter.type = 'lowpass';
    lpFilter.frequency.setValueAtTime(180, now); // lock to low frequency warmth

    thudOsc.type = 'triangle';
    thudOsc.frequency.setValueAtTime(130, now);
    thudOsc.frequency.exponentialRampToValueAtTime(35, now + 0.14);

    thudGain.gain.setValueAtTime(0.65, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    thudOsc.connect(lpFilter);
    lpFilter.connect(thudGain);
    thudGain.connect(this.masterGain!);

    thudOsc.start(now);
    thudOsc.stop(now + 0.14);

    // B. Light woodblock dig transient
    const digOsc = this.ctx.createOscillator();
    const digGain = this.ctx.createGain();
    digOsc.type = 'triangle';
    digOsc.frequency.setValueAtTime(90, now);
    digOsc.frequency.exponentialRampToValueAtTime(30, now + 0.08);
    digGain.gain.setValueAtTime(0.4, now);
    digGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    digOsc.connect(digGain);
    digGain.connect(this.masterGain!);
    digOsc.start(now);
    digOsc.stop(now + 0.08);

    // C. Elegant cozy chime tail
    const playChimeTone = (freq: number, delay: number, dur: number) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.15, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + delay);
      osc.stop(now + delay + dur);
    };

    // Major arpeggio tail starting right after the thud impact
    playChimeTone(523.25, 0.02, 0.2);
    playChimeTone(659.25, 0.08, 0.2);
    playChimeTone(783.99, 0.14, 0.28);
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
