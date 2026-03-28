// WheelEngine.js — Physics-based Canvas spinning wheel at 60fps with center SPIN button
import { confetti } from './ConfettiEngine.js';
export class WheelEngine {
  constructor(canvasId, options = {}) {
    this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!this.canvas) throw new Error(`Canvas not found: ${canvasId}`);
    this.ctx = this.canvas.getContext('2d');

    // Entries
    this.entries = options.entries || ['Yes', 'No'];
    this.colors = options.colors || [];
    this.weights = options.weights || [];

    // Physics
    this.angle = 0;
    this.angularVelocity = 0;
    this.friction = options.friction || 0.985;
    this.spinPower = options.spinPower || 5;
    this.maxDuration = options.maxDuration || 8;
    this.isSpinning = false;
    this.spinStartTime = 0;

    // Visual
    this.fontSize = options.fontSize || 14;
    this.fontFamily = options.fontFamily || "'Inter', sans-serif";
    this.pointerAngle = -Math.PI / 2;
    this.centerImage = options.centerImage || null;
    this.centerText = options.centerText || '';
    this.centerEmoji = options.centerEmoji || '';
    this.darkMode = options.darkMode !== false;
    this.showGlow = options.showGlow !== false;
    this.showCenterButton = options.showCenterButton !== false;
    this.skipConfetti = options.skipConfetti || false;

    // Callbacks
    this.onTick = options.onTick || null;
    this.onResult = options.onResult || null;
    this.onSpinStart = options.onSpinStart || null;

    // Animation
    this._animFrameId = null;
    this._lastTickSlice = -1;

    // Sizing
    this._resizeHandler = () => this._setupSize();
    this._setupSize();
    window.addEventListener('resize', this._resizeHandler);

    // Click on center button to spin
    this._clickHandler = (e) => this._handleClick(e);
    this.canvas.addEventListener('click', this._clickHandler);
    this.canvas.style.cursor = 'pointer';

    // Initial draw
    this.draw();
  }

  _handleClick(e) {
    if (this.isSpinning) return;
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.size / rect.width;
    const scaleY = this.size / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const dx = x - this.cx;
    const dy = y - this.cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Click anywhere on the wheel spins it, but center button area is highlighted
    if (dist <= this.radius) {
      this.spin();
    }
  }

  _setupSize() {
    const container = this.canvas.parentElement;
    const size = Math.min(container.clientWidth, container.clientHeight, 600);
    this.canvas.width = size * window.devicePixelRatio;
    this.canvas.height = size * window.devicePixelRatio;
    this.canvas.style.width = size + 'px';
    this.canvas.style.height = size + 'px';
    this.ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    this.size = size;
    this.cx = size / 2;
    this.cy = size / 2;
    this.radius = Math.max(0, size / 2 - 12);
    if (!this.isSpinning) this.draw();
  }

  setEntries(entries, colors, weights) {
    this.entries = entries.length > 0 ? entries : ['Yes', 'No'];
    if (colors) this.colors = colors;
    if (weights) this.weights = weights;
    if (!this.isSpinning) this.draw();
  }

  _getSliceAngles() {
    const total = this.entries.length;
    if (this.weights.length === total) {
      const sum = this.weights.reduce((a, b) => a + b, 0);
      return this.weights.map(w => (w / sum) * Math.PI * 2);
    }
    const sliceAngle = (Math.PI * 2) / total;
    return this.entries.map(() => sliceAngle);
  }

  _getColor(index) {
    if (this.colors[index]) return this.colors[index];
    const palettes = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#AED6F1', '#D7BDE2',
      '#A3E4D7', '#FAD7A0', '#A9CCE3', '#D5F5E3', '#FADBD8'
    ];
    return palettes[index % palettes.length];
  }

  draw() {
    if (this.size < 50) return;
    const ctx = this.ctx;
    const { cx, cy, radius } = this;
    ctx.clearRect(0, 0, this.size, this.size);

    const sliceAngles = this._getSliceAngles();
    let startAngle = this.angle;

    // Outer glow
    if (this.showGlow) {
      ctx.save();
      ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
      ctx.fillStyle = 'transparent';
      ctx.fill();
      ctx.restore();
    }

    // Draw slices
    for (let i = 0; i < this.entries.length; i++) {
      const sliceAngle = sliceAngles[i];
      const endAngle = startAngle + sliceAngle;
      const midAngle = startAngle + sliceAngle / 2;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();

      const color = this._getColor(i);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, this._lighten(color, 30));
      grad.addColorStop(0.7, color);
      grad.addColorStop(1, this._darken(color, 15));
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = this.darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(midAngle);
      const textRadius = radius * 0.65;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const maxWidth = radius * 0.55;
      let fSize = Math.min(this.fontSize, sliceAngle * radius * 0.3);
      fSize = Math.max(fSize, 9);
      ctx.font = `bold ${fSize}px ${this.fontFamily}`;

      const text = this.entries[i];
      const truncated = this._truncateText(ctx, text, maxWidth);
      ctx.fillStyle = this._getTextColor(color);
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 2;
      ctx.fillText(truncated, textRadius, 0);
      ctx.shadowBlur = 0;
      ctx.restore();

      startAngle = endAngle;
    }

    // Center SPIN button
    if (this.showCenterButton) {
      this._drawCenterButton();
    } else {
      // Simple center circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.12, 0, Math.PI * 2);
      const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.12);
      cGrad.addColorStop(0, this.darkMode ? '#374151' : '#ffffff');
      cGrad.addColorStop(1, this.darkMode ? '#1f2937' : '#e5e7eb');
      ctx.fillStyle = cGrad;
      ctx.fill();
      ctx.strokeStyle = this.darkMode ? '#6366f1' : '#4f46e5';
      ctx.lineWidth = 3;
      ctx.stroke();

      if (this.centerEmoji) {
        ctx.font = `${radius * 0.1}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.centerEmoji, cx, cy);
      } else if (this.centerText) {
        ctx.font = `bold ${radius * 0.05}px ${this.fontFamily}`;
        ctx.fillStyle = this.darkMode ? '#e5e7eb' : '#374151';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.centerText, cx, cy);
      }
    }

    // Pointer
    this._drawPointer();

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
    ctx.strokeStyle = this.darkMode ? '#6366f1' : '#4f46e5';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(0, radius - 2), 0, Math.PI * 2);
    ctx.strokeStyle = this.darkMode ? 'rgba(99,102,241,0.3)' : 'rgba(79,70,229,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  _drawCenterButton() {
    const ctx = this.ctx;
    const { cx, cy, radius } = this;
    const btnRadius = radius * 0.18;

    // Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 4;

    // Button circle
    ctx.beginPath();
    ctx.arc(cx, cy, btnRadius, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(cx, cy - btnRadius * 0.3, 0, cx, cy, btnRadius);
    if (this.isSpinning) {
      grad.addColorStop(0, '#ef4444');
      grad.addColorStop(1, '#991b1b');
    } else {
      grad.addColorStop(0, '#374151');
      grad.addColorStop(1, '#111827');
    }
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    // Border
    ctx.beginPath();
    ctx.arc(cx, cy, btnRadius, 0, Math.PI * 2);
    ctx.strokeStyle = this.isSpinning ? '#fca5a5' : '#6366f1';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Highlight arc (top half)
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(0, btnRadius - 4), -Math.PI * 0.8, -Math.PI * 0.2);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // SPIN text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${btnRadius * 0.55}px ${this.fontFamily}`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 2;
    ctx.fillText(this.isSpinning ? '...' : 'SPIN', cx, cy);
    ctx.shadowBlur = 0;

    // Center emoji/text override
    if (this.centerEmoji && !this.isSpinning) {
      ctx.font = `${btnRadius * 0.6}px sans-serif`;
      ctx.fillText(this.centerEmoji, cx, cy);
    }
  }

  _drawPointer() {
    const ctx = this.ctx;
    const { cx } = this;
    const pointerSize = 24;

    ctx.save();
    ctx.translate(cx, 4);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-pointerSize / 2, -pointerSize * 0.4);
    ctx.lineTo(-pointerSize * 0.1, pointerSize * 0.8);
    ctx.lineTo(0, pointerSize);
    ctx.lineTo(pointerSize * 0.1, pointerSize * 0.8);
    ctx.lineTo(pointerSize / 2, -pointerSize * 0.4);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, -pointerSize, 0, pointerSize);
    grad.addColorStop(0, '#ef4444');
    grad.addColorStop(0.5, '#dc2626');
    grad.addColorStop(1, '#991b1b');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  _truncateText(ctx, text, maxWidth) {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let t = text;
    while (t.length > 1 && ctx.measureText(t + '…').width > maxWidth) t = t.slice(0, -1);
    return t + '…';
  }

  _getTextColor(bgHex) {
    const hex = bgHex.startsWith('#') ? bgHex : '#888888';
    try {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#1a1a2e' : '#ffffff';
    } catch { return '#ffffff'; }
  }

  _lighten(hex, percent) {
    try {
      const num = parseInt(hex.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.min(255, (num >> 16) + amt);
      const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
      const B = Math.min(255, (num & 0x0000FF) + amt);
      return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    } catch { return hex; }
  }

  _darken(hex, percent) {
    try {
      const num = parseInt(hex.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.max(0, (num >> 16) - amt);
      const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
      const B = Math.max(0, (num & 0x0000FF) - amt);
      return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    } catch { return hex; }
  }

  spin() {
    if (this.isSpinning) return;
    this.isSpinning = true;
    this.spinStartTime = Date.now();
    this._lastTickSlice = -1;

    const basePower = 0.2 + (this.spinPower / 10) * 0.6;
    const randomExtra = (Math.random() - 0.5) * 0.1;
    this.angularVelocity = basePower + randomExtra;

    const durationFactor = 1 - ((this.maxDuration - 3) / 17) * 0.012;
    this.friction = Math.max(0.97, Math.min(0.995, 0.985 * durationFactor));

    if (this.onSpinStart) this.onSpinStart();
    this._animate();
  }

  _animate() {
    this.angle += this.angularVelocity;
    this.angularVelocity *= this.friction;

    const targetAngle = -Math.PI / 2 - this.angle;
    const normalizedAngle = ((targetAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const sliceAngles = this._getSliceAngles();
    let cumAngle = 0;
    let currentSlice = 0;
    for (let i = 0; i < sliceAngles.length; i++) {
      cumAngle += sliceAngles[i];
      if (normalizedAngle < cumAngle) { currentSlice = i; break; }
    }

    if (currentSlice !== this._lastTickSlice && this._lastTickSlice !== -1) {
      if (this.onTick) this.onTick();
    }
    this._lastTickSlice = currentSlice;

    this.draw();

    if (this.angularVelocity > 0.001) {
      this._animFrameId = requestAnimationFrame(() => this._animate());
    } else {
      this.angularVelocity = 0;
      this.isSpinning = false;
      const winner = this._getWinner();
      this.draw();
      if (!this.skipConfetti) {
        confetti.celebrate(winner.entry, '🎉');
      }
      if (this.onResult) this.onResult(winner);
    }
  }

  _getWinner() {
    const targetAngle = -Math.PI / 2 - this.angle;
    const normalizedAngle = ((targetAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const sliceAngles = this._getSliceAngles();
    let cumAngle = 0;
    for (let i = 0; i < sliceAngles.length; i++) {
      cumAngle += sliceAngles[i];
      if (normalizedAngle < cumAngle) return { index: i, entry: this.entries[i], color: this._getColor(i) };
    }
    return { index: 0, entry: this.entries[0], color: this._getColor(0) };
  }

  stop() {
    if (this._animFrameId) { cancelAnimationFrame(this._animFrameId); this._animFrameId = null; }
    this.isSpinning = false;
    this.angularVelocity = 0;
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this._resizeHandler);
    this.canvas.removeEventListener('click', this._clickHandler);
  }
}
