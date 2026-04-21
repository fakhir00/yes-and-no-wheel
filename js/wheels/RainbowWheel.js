// RainbowWheel.js — Symmetrical ROYGBIV color spectrum wheel
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { getLocalizedWheelSeedEntries, getWheelSharedText, getWheelUiText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { renderWheelFaq } from './WheelFaq.js';
import { renderWheelSeoContent } from './WheelSeoContent.js';

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
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'rainbow');
  const ui = getWheelUiText(locale);
  container.innerHTML = `
    <div class="wheel-page rainbow-theme">
      <div class="wheel-header">
        <h1 class="wheel-title rainbow-text">🌈 ${t.title}</h1>
        <p class="wheel-subtitle">${t.subtitle}</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="wheel-canvas-container" id="rainbowCanvasContainer">
            <canvas id="rainbowCanvas"></canvas>
          </div>
          <button class="spin-btn rainbow-spin-btn" id="rainbowSpinBtn">
            <span class="spin-text">🌈 ${t.spinNow}</span>
            <div class="spin-ripple"></div>
          </button>
          <button class="auto-gradient-btn" id="rainbowAutoGradient">
            ✨ ${ui.autoGradient}
          </button>
          <div class="result-display" id="rainbowResult"></div>
        </div>

        <div class="wheel-sidebar" id="rainbowSidebar"></div>
      </div>

      <div class="wheel-instructions howto-tutorial-style">
        <h2>${t.howToUse}</h2>
        <p class="howto-intro">${t.howToIntro}</p>
        <div class="howto-steps-list">
          <div class="howto-step-item">
            <h2 class="howto-step-heading"><span class="howto-step-num">1</span> ${t.step1Title}</h2>
            <p class="howto-step-desc">${t.step1Desc}</p>
          </div>
          <hr class="howto-divider">
          <div class="howto-step-item">
            <h2 class="howto-step-heading"><span class="howto-step-num">2</span> ${t.step2Title}</h2>
            <p class="howto-step-desc">${t.step2Desc}</p>
          </div>
          <hr class="howto-divider">
          <div class="howto-step-item">
            <h2 class="howto-step-heading"><span class="howto-step-num">3</span> ${t.step3Title}</h2>
            <p class="howto-step-desc">${t.step3Desc}</p>
          </div>
        </div>
      </div>

      ${renderWheelSeoContent(t.title, 'rainbow', locale)}
      ${renderWheelFaq(locale)}
      ${renderWheelSilo(locale, 'rainbow')}
    </div>
  `;

  const defaultEntries = getLocalizedWheelSeedEntries(locale, 'rainbow');
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
