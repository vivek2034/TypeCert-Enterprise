/**
 * Web Audio API synthesizer for realistic mechanical keyboard switch sounds
 * Zero external audio files required - synthesized via audio nodes!
 */

export type SoundTheme = 'cherry-blue' | 'cherry-brown' | 'typewriter' | 'muted';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundTheme: SoundTheme = 'cherry-blue';
  private enabled: boolean = true;
  private volume: number = 0.25;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setTheme(theme: SoundTheme) {
    this.soundTheme = theme;
    if (theme === 'muted') {
      this.enabled = false;
    } else {
      this.enabled = true;
    }
  }

  public getTheme(): SoundTheme {
    return this.soundTheme;
  }

  public toggleSound(): boolean {
    this.enabled = !this.enabled;
    if (this.enabled && this.soundTheme === 'muted') {
      this.soundTheme = 'cherry-blue';
    }
    return this.enabled;
  }

  public isEnabled(): boolean {
    return this.enabled && this.soundTheme !== 'muted';
  }

  public playKeyClick(isSpace = false, isBackspace = false, isError = false) {
    if (!this.enabled || this.soundTheme === 'muted') return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.connect(gain);
      gain.connect(this.ctx.destination);

      if (isError) {
        // Subtle error 'thud'
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);

        gain.gain.setValueAtTime(this.volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(filter);
        osc.start(now);
        osc.stop(now + 0.09);
        return;
      }

      if (this.soundTheme === 'cherry-blue') {
        // High click + tactile thud
        const baseFreq = isSpace ? 320 : isBackspace ? 360 : 420 + Math.random() * 80;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq * 2.2, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.035);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2800, now);
        filter.Q.setValueAtTime(3.5, now);

        gain.gain.setValueAtTime(this.volume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(filter);
        osc.start(now);
        osc.stop(now + 0.045);
      } else if (this.soundTheme === 'cherry-brown') {
        // Deeper, softer tactile bump
        const baseFreq = isSpace ? 180 : 240 + Math.random() * 40;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * 1.5, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 0.05);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);

        gain.gain.setValueAtTime(this.volume * 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(filter);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (this.soundTheme === 'typewriter') {
        // Sharp metallic clack
        const baseFreq = isSpace ? 400 : 650 + Math.random() * 120;
        osc.type = 'square';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.06);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(800, now);

        gain.gain.setValueAtTime(this.volume * 0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(filter);
        osc.start(now);
        osc.stop(now + 0.07);
      }
    } catch {
      // AudioContext policy fallback
    }
  }
}

export const keyboardAudio = new SoundEngine();
