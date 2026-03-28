// ConfettiEngine.js — Canvas confetti + celebration/oops overlays
export class ConfettiEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animId = null;
    this._createCanvas();
  }

  _createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'confetti-canvas';
    this.canvas.style.cssText = `
      position:fixed;inset:0;z-index:9999;pointer-events:none;
      width:100vw;height:100vh;
    `;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    this.canvas.width = window.innerWidth * devicePixelRatio;
    this.canvas.height = window.innerHeight * devicePixelRatio;
    this.ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  // Full-screen confetti burst for positive results
  celebrate(label = 'YES!', emoji = '🎉', color = '#22c55e') {
    this._showOverlay(label, emoji, color, 'celebrate');
    this._launchConfetti(120);
  }

  // Oops animation for negative results
  oops(label = 'NO!', emoji = '😬', color = '#eab308') {
    this._showOverlay(label, emoji, color, 'oops');
    this._launchSadParticles(40);
  }

  // Neutral/maybe animation
  maybe(label = 'MAYBE!', emoji = '🤔', color = '#9ca3af') {
    this._showOverlay(label, emoji, color, 'maybe');
    this._launchSparkles(30);
  }

  _showOverlay(label, emoji, color, type) {
    // Remove any existing overlay
    document.querySelectorAll('.result-overlay').forEach(el => el.remove());

    const overlay = document.createElement('div');
    overlay.className = `result-overlay result-overlay-${type}`;
    overlay.innerHTML = `
      <div class="result-overlay-content">
        <div class="result-overlay-emoji">${emoji}</div>
        <div class="result-overlay-label" style="color:${color}">${label}</div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Trigger animation
    requestAnimationFrame(() => overlay.classList.add('show'));

    // Auto-remove
    setTimeout(() => {
      overlay.classList.remove('show');
      setTimeout(() => overlay.remove(), 500);
    }, 2500);
  }

  _launchConfetti(count) {
    this.particles = [];
    const colors = ['#ff0000','#ff7f00','#ffff00','#00ff00','#00bfff','#8b5cf6','#ff69b4','#ffd700','#00ffff','#ff006e'];
    const W = window.innerWidth;
    const H = window.innerHeight;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: W / 2 + (Math.random() - 0.5) * W * 0.6,
        y: H * 0.4 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 15,
        vy: -(Math.random() * 12 + 5),
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 15,
        gravity: 0.25 + Math.random() * 0.1,
        opacity: 1,
        type: Math.random() > 0.3 ? 'rect' : 'circle'
      });
    }
    this._animate();
  }

  _launchSadParticles(count) {
    this.particles = [];
    const W = window.innerWidth;
    const H = window.innerHeight;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * W,
        y: -20 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 1,
        w: 20 + Math.random() * 15,
        h: 20,
        color: '#eab308',
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 3,
        gravity: 0.05,
        opacity: 0.8,
        type: 'emoji',
        emoji: ['😢','😬','👎','💔','😰','🙈'][Math.floor(Math.random() * 6)]
      });
    }
    this._animate();
  }

  _launchSparkles(count) {
    this.particles = [];
    const W = window.innerWidth;
    const H = window.innerHeight;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      this.particles.push({
        x: W / 2,
        y: H / 2,
        vx: Math.cos(angle) * (3 + Math.random() * 4),
        vy: Math.sin(angle) * (3 + Math.random() * 4),
        w: 4 + Math.random() * 4,
        h: 4,
        color: '#9ca3af',
        rotation: 0,
        rotSpeed: 0,
        gravity: 0.02,
        opacity: 1,
        type: 'sparkle'
      });
    }
    this._animate();
  }

  _animate() {
    if (this.animId) cancelAnimationFrame(this.animId);
    const ctx = this.ctx;
    const W = window.innerWidth;
    const H = window.innerHeight;

    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      let alive = false;

      for (const p of this.particles) {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.005;

        if (p.opacity <= 0 || p.y > H + 50) continue;
        alive = true;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.type === 'rect') {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else if (p.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else if (p.type === 'emoji') {
          ctx.font = `${p.w}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.emoji, 0, 0);
        } else if (p.type === 'sparkle') {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (alive) {
        this.animId = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, W, H);
        this.animId = null;
      }
    };
    this.animId = requestAnimationFrame(frame);
  }
}

export const confetti = new ConfettiEngine();
