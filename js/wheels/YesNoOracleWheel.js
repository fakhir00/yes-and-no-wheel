// YesNoOracleWheel.js — Yes No Oracle tool updated to use WheelEngine
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { getWheelSharedText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { renderWheelFaq } from './WheelFaq.js';
import { renderWheelSeoContent } from './WheelSeoContent.js';

const ORACLE_COLORS = [
  '#0d1b2a', '#1b263b', '#415a77', '#778da9', '#e0e1dd'
];

const ORACLE_DEFAULT_ENTRIES = [
  'The Sun (Yes)', 'The Moon (No)', 'The Stars (Maybe)', 'The Anchor (No)',
  'The Key (Yes)', 'The Crossroad (Maybe)', 'The Mirror (No)', 'The Dove (Yes)'
];

export function renderYesNoOracleWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'yes-no-oracle');
  
  container.innerHTML = `
    <div class="wheel-page oracle-theme">
      <div class="wheel-header">
        <h1 class="wheel-title oracle-text">🔮 ${t.title}</h1>
        <p class="wheel-subtitle">${t.subtitle}</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="wheel-canvas-container" id="oracleCanvasContainer">
            <canvas id="oracleCanvas"></canvas>
          </div>
          <button class="spin-btn oracle-spin-btn" id="oracleSpinBtn">
            <span class="spin-text">🔮 ${t.spinNow || 'Spin Now'}</span>
            <div class="spin-ripple"></div>
          </button>
          <div class="result-display" id="oracleResult"></div>
        </div>

        <div class="wheel-sidebar" id="oracleSidebar"></div>
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

      ${renderWheelSeoContent(t.title, 'yes-no-oracle', locale)}
      ${renderWheelFaq(locale)}
      ${renderWheelSilo(locale, 'yes-no-oracle')}
    </div>
  `;

  const getColors = (len) => Array.from({ length: len }, (_, i) => ORACLE_COLORS[i % ORACLE_COLORS.length]);
  
  const engine = new WheelEngine('oracleCanvas', {
    entries: ORACLE_DEFAULT_ENTRIES,
    colors: getColors(ORACLE_DEFAULT_ENTRIES.length),
    onTick: () => audioManager.playTick(),
    onResult: (winner) => {
      audioManager.playFanfare();
      const resultEl = document.getElementById('oracleResult');
      resultEl.innerHTML = `<div class="result-winner oracle-result"><span class="result-emoji">🔮</span><span class="result-text">${winner.entry}</span></div>`;
      resultEl.classList.add('show');
      customPanel.addResult(winner.entry);
      document.getElementById('oracleSpinBtn').disabled = false;
    },
    onSpinStart: () => {
      audioManager.init();
      document.getElementById('oracleResult').classList.remove('show');
      document.getElementById('oracleSpinBtn').disabled = true;
    }
  });

  const customPanel = new CustomizationPanel(engine, {
    wheelName: 'yes-no-oracle',
    onEntriesChange: (entries) => {
      engine.setEntries(entries, getColors(entries.length));
    }
  });
  customPanel.render('oracleSidebar');
  customPanel.setEntries(ORACLE_DEFAULT_ENTRIES);

  document.getElementById('oracleSpinBtn').addEventListener('click', () => engine.spin());

  return engine;
}
