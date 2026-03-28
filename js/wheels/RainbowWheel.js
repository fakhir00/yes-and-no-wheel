// RainbowWheel.js — Symmetrical ROYGBIV color spectrum wheel
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';

const RAINBOW_COLORS = [
  '#FF0000', // Red
  '#FF7F00', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#9400D3', // Violet
];

function generateRainbowColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i / count) * 360;
    colors.push(`hsl(${hue}, 85%, 55%)`);
  }
  return colors;
}

export function renderRainbowWheel(container) {
  container.innerHTML = `
    <div class="wheel-page rainbow-theme">
      <div class="wheel-header">
        <h1 class="wheel-title rainbow-text">🌈 Rainbow Wheel</h1>
        <p class="wheel-subtitle">Choose your options, hit spin, and let the colors decide your fate!</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="wheel-canvas-container" id="rainbowCanvasContainer">
            <canvas id="rainbowCanvas"></canvas>
          </div>
          <button class="spin-btn rainbow-spin-btn" id="rainbowSpinBtn">
            <span class="spin-text">🌈 SPIN!</span>
            <div class="spin-ripple"></div>
          </button>
          <button class="auto-gradient-btn" id="rainbowAutoGradient">
            ✨ Auto-Gradient (ROYGBIV)
          </button>
          <div class="result-display" id="rainbowResult"></div>
        </div>

        <div class="wheel-sidebar" id="rainbowSidebar"></div>
      </div>

      <div class="wheel-instructions">
        <h2>How to Use the Rainbow Wheel</h2>
        <div class="instruction-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Add Your Options</h3>
              <p>Click "Advanced Mode" and type your choices, one per line. Or use the defaults!</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Auto-Gradient</h3>
              <p>Click the "Auto-Gradient" button to apply a beautiful ROYGBIV rainbow spectrum to all slices automatically.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Spin & Decide</h3>
              <p>Hit the SPIN button and watch the wheel determine your fate with vibrant color!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const defaultEntries = ['Adventure', 'Creativity', 'Love', 'Wisdom', 'Joy', 'Peace', 'Courage'];
  const defaultColors = generateRainbowColors(defaultEntries.length);

  const engine = new WheelEngine('rainbowCanvas', {
    entries: defaultEntries,
    colors: defaultColors,
    onTick: () => audioManager.playTick(),
    onResult: (winner) => {
      audioManager.playFanfare();
      const resultEl = document.getElementById('rainbowResult');
      resultEl.innerHTML = `<div class="result-winner rainbow-result"><span class="result-emoji">🌈</span><span class="result-text">${winner.entry}</span></div>`;
      resultEl.classList.add('show');
      customPanel.addResult(winner.entry);
      document.getElementById('rainbowSpinBtn').disabled = false;
    },
    onSpinStart: () => {
      audioManager.init();
      document.getElementById('rainbowResult').classList.remove('show');
      document.getElementById('rainbowSpinBtn').disabled = true;
    }
  });

  const customPanel = new CustomizationPanel(engine, {
    wheelName: 'rainbow',
    onEntriesChange: (entries) => {
      engine.setEntries(entries, generateRainbowColors(entries.length));
    }
  });
  customPanel.render('rainbowSidebar');
  customPanel.setEntries(defaultEntries);

  document.getElementById('rainbowSpinBtn').addEventListener('click', () => engine.spin());

  document.getElementById('rainbowAutoGradient').addEventListener('click', () => {
    const colors = generateRainbowColors(engine.entries.length);
    engine.colors = colors;
    engine.draw();
  });

  return engine;
}
