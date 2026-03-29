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
        <p class="wheel-subtitle">Spin the <strong>Rainbow Wheel</strong> — choose your options, hit spin, and let the colors decide your fate!</p>
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

      <div class="wheel-instructions howto-tutorial-style">
        <h2>How to Use the <strong>Rainbow Wheel</strong></h2>
        <p class="howto-intro">The <strong>Rainbow Wheel</strong> is a free color-spectrum spinner. Add your options, apply ROYGBIV gradients, and let the vibrant colors pick a winner.</p>
        <div class="howto-steps-list">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">1</span> Add Your Options</h3>
            <p class="howto-step-desc">Open Advanced Mode and type your choices, one per line. Or use the default entries on the <strong>Rainbow Wheel</strong>.</p>
            <div class="howto-step-screenshot">
              <img src="images/howto/rainbow-wheel.png" alt="Rainbow Wheel spinner with ROYGBIV color spectrum" class="howto-inline-img" loading="lazy">
            </div>
          </div>
          <hr class="howto-divider">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">2</span> Apply Auto-Gradient</h3>
            <p class="howto-step-desc">Click the "Auto-Gradient" button to apply a beautiful ROYGBIV <strong>rainbow</strong> spectrum to all slices automatically.</p>
          </div>
          <hr class="howto-divider">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">3</span> Spin the <strong>Rainbow Wheel</strong></h3>
            <p class="howto-step-desc">Hit the SPIN button and watch the <strong>Rainbow Wheel</strong> determine your fate with vibrant color! Also try the <a href="#word">Word Wheel</a> or <a href="#spin-the-wheel-truth-or-dare">Truth or Dare</a>.</p>
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
