/**
 * Tactile acoustic sound synthesis for Team Echo ("Эхо") presentation
 * Generates harmonic chords, subtle clicks and resonant sound-wave pings
 */
class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

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

  // Harmonic chord chime for slide navigation
  public playSlideChime(slideIndex: number = 0) {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Pentatonic harmonic notes [C4, D4, F4, G4, A4, C5]
      const scale = [261.63, 293.66, 349.23, 392.0, 440.0, 523.25, 587.33, 659.25];
      const baseFreq = scale[slideIndex % scale.length];

      // Primary oscillator: Soft pure sine
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, now);

      gain1.gain.setValueAtTime(0.045, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      // Resonant harmonic overtone (Echo reverberation effect)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 1.5, now + 0.06);

      gain2.gain.setValueAtTime(0.02, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.46);

      osc2.start(now + 0.06);
      osc2.stop(now + 0.66);
    } catch {
      // Audio autoplay policy handled silently
    }
  }

  // Subtle acoustic click for button triggers
  public playClick() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }
}

export const soundEffects = new SoundEffectsManager();
