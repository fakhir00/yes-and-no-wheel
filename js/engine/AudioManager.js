// AudioManager.js — Web Audio API synthesized sounds
export class AudioManager {
  constructor() {
    this.ctx = null;
    this.tickEnabled = true;
    this.fanfareEnabled = true;
    this.volume = 0.3;
    this._initialized = false;
    this._unlockBound = false;
    this._unlockHandler = null;
  }

  init() {
    if (this._initialized) {
      this._bindUnlockListeners();
      return this.ctx;
    }
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._initialized = true;
      this._bindUnlockListeners();
      return this.ctx;
    } catch (e) {
      console.warn('Web Audio API not available');
      return null;
    }
  }

  _bindUnlockListeners() {
    if (this._unlockBound || typeof document === 'undefined') return;

    this._unlockHandler = () => {
      this._ensureContext()
        .then(() => this._primeContext())
        .then(() => {
          if (this.ctx && this.ctx.state === 'running') {
            this._removeUnlockListeners();
          }
        })
        .catch(() => {});
    };

    ['pointerdown', 'touchstart', 'click'].forEach(eventName => {
      document.addEventListener(eventName, this._unlockHandler, { passive: true });
    });
    this._unlockBound = true;
  }

  _removeUnlockListeners() {
    if (!this._unlockBound || !this._unlockHandler || typeof document === 'undefined') return;
    ['pointerdown', 'touchstart', 'click'].forEach(eventName => {
      document.removeEventListener(eventName, this._unlockHandler, { passive: true });
    });
    this._unlockBound = false;
  }

  async _ensureContext() {
    if (!this._initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    return this.ctx;
  }

  _primeContext() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.01);
  }

  _withReadyContext(callback) {
    this._ensureContext()
      .then((ctx) => {
        if (!ctx || ctx.state !== 'running') return;
        callback(ctx);
      })
      .catch(() => {});
  }

  _playTickNow(ctx) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);

    gain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  }

  _playFanfareNow(ctx) {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const duration = 0.15;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * duration);

      const startTime = ctx.currentTime + i * duration;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.5, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 2);

      osc.start(startTime);
      osc.stop(startTime + duration * 2);
    });

    setTimeout(() => {
      if (!this.ctx || this.ctx.state !== 'running') return;
      const chord = [523.25, 659.25, 783.99];
      chord.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(this.volume * 0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.8);
      });
    }, notes.length * duration * 1000);
  }

  _playClickNow(ctx) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(this.volume * 0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.03);
  }

  unlock() {
    this._ensureContext()
      .then(() => this._primeContext())
      .catch(() => {});
  }

  playTick() {
    if (!this.tickEnabled) return;
    this._withReadyContext((ctx) => this._playTickNow(ctx));
  }

  playFanfare() {
    if (!this.fanfareEnabled) return;
    this._withReadyContext((ctx) => this._playFanfareNow(ctx));
  }

  playClick() {
    this._withReadyContext((ctx) => this._playClickNow(ctx));
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  toggleTick() {
    this.tickEnabled = !this.tickEnabled;
    return this.tickEnabled;
  }

  toggleFanfare() {
    this.fanfareEnabled = !this.fanfareEnabled;
    return this.fanfareEnabled;
  }
}

// Singleton
export const audioManager = new AudioManager();
