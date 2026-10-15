import { MusicTrack } from '../types';

export const PLAYLIST: MusicTrack[] = [
  {
    id: 1,
    title: '연수 생일 축하 오르골 🎂',
    subtitle: 'Happy Birthday Yeon-soo (Loop)',
    tag: '기본 테마',
    melodyType: 'birthday',
  },
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private currentNoteIndex: number = 0;
  private listeners: Set<(playing: boolean, track: MusicTrack) => void> = new Set();

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Explicit unlock method for Mobile Safari & Android Chrome
  public async unlock(): Promise<boolean> {
    this.initContext();
    if (!this.ctx) return false;

    try {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      // Play a 1-sample silent buffer to wake up iOS hardware audio bus
      const buffer = this.ctx.createBuffer(1, 1, 22050);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.ctx.destination);
      source.start(0);
      return true;
    } catch {
      return false;
    }
  }

  public subscribe(fn: (playing: boolean, track: MusicTrack) => void) {
    this.listeners.add(fn);
    fn(this.isPlaying, PLAYLIST[0]);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    const track = PLAYLIST[0];
    this.listeners.forEach((fn) => fn(this.isPlaying, track));
  }

  public getCurrentTrack(): MusicTrack {
    return PLAYLIST[0];
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainVal: number = 0.15) {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Sweet music box / bell envelope
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainVal, this.ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio fallback catch
    }
  }

  // SFX: Candle Blow & Magical Twinkle
  public playCandleBlow() {
    this.initContext();
    if (!this.ctx) return;
    try {
      // Soft gentle chime cascade
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 0.6, 'sine', 0.12);
        }, idx * 70);
      });
    } catch {}
  }

  // SFX: Confetti Pop & Fanfare
  public playConfettiPop() {
    this.initContext();
    if (!this.ctx) return;
    try {
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 0.4, 'triangle', 0.15);
        }, idx * 50);
      });
    } catch {}
  }

  // SFX: Quest Clear
  public playQuestClear() {
    this.initContext();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 0.5, 'sine', 0.18);
        }, idx * 90);
      });
    } catch {}
  }

  // SFX: Cute Pop Click
  public playCutePop() {
    this.playTone(700, 0.15, 'sine', 0.08);
  }

  // Melodies: Default Birthday Music Box Loop
  private getMelody(): { f: number; d: number }[] {
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00;

    // "Happy Birthday to you, Happy Birthday to you, Happy Birthday dear Yeon-soo..."
    return [
      { f: C4, d: 350 }, { f: C4, d: 250 }, { f: D4, d: 600 }, { f: C4, d: 600 }, { f: F4, d: 600 }, { f: E4, d: 1100 },
      { f: C4, d: 350 }, { f: C4, d: 250 }, { f: D4, d: 600 }, { f: C4, d: 600 }, { f: G4, d: 600 }, { f: F4, d: 1100 },
      { f: C4, d: 350 }, { f: C4, d: 250 }, { f: C5, d: 600 }, { f: A4, d: 600 }, { f: F4, d: 600 }, { f: E4, d: 600 }, { f: D4, d: 800 },
      { f: B4, d: 350 }, { f: B4, d: 250 }, { f: A4, d: 600 }, { f: F4, d: 600 }, { f: G4, d: 600 }, { f: F4, d: 1400 },
      { f: 0, d: 1000 }
    ];
  }

  private stepMelody() {
    if (!this.isPlaying) return;
    const melody = this.getMelody();

    if (this.currentNoteIndex >= melody.length) {
      this.currentNoteIndex = 0;
    }

    const note = melody[this.currentNoteIndex];
    if (note && note.f > 0) {
      // Bell/Music Box timbre: warm sine with faint harmonic
      this.playTone(note.f, note.d / 1000 * 1.4, 'sine', 0.14);
      // Gentle soft sub harmonic for cozy warmth
      this.playTone(note.f * 0.5, (note.d / 1000) * 0.9, 'triangle', 0.05);
    }

    this.currentNoteIndex++;
    this.timerId = window.setTimeout(() => {
      this.stepMelody();
    }, note ? note.d : 400);
  }

  public async play() {
    await this.unlock();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.notify();
    this.stepMelody();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public resetTrack() {
    this.currentNoteIndex = 0;
  }
}

export const audioEngine = new SoundEngine();
