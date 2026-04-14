// YesNoTarot.js — Yes No Tarot Wheel
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { getWheelSharedText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { renderWheelFaq } from './WheelFaq.js';
import { renderWheelSeoContent } from './WheelSeoContent.js';

const TAROT_COLORS = [
  '#2a0a4a', '#3f1163', '#5a189a', '#7b2cbf', '#9d4edd', '#c77dff'
];

const TAROT_DEFAULT_ENTRIES = [
  'The Fool (Yes)', 'The Magician (Yes)', 'The High Priestess (Maybe)', 'The Empress (Yes)',
  'The Emperor (Yes)', 'The Hierophant (Maybe)', 'The Lovers (Yes)', 'The Chariot (Yes)',
  'Strength (Yes)', 'The Hermit (No)', 'Wheel of Fortune (Maybe)', 'Justice (Maybe)',
  'The Hanged Man (No)', 'Death (No)', 'Temperance (Maybe)', 'The Devil (No)',
  'The Tower (No)', 'The Star (Yes)', 'The Moon (No)', 'The Sun (Yes)',
  'Judgement (Yes)', 'The World (Yes)'
];

export function renderYesNoTarot(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'yes-no-tarot');
  
  container.innerHTML = `
    <div class="wheel-page tarot-theme">
      <div class="wheel-header">
        <h1 class="wheel-title tarot-text">🃏 ${t.title}</h1>
        <p class="wheel-subtitle">${t.subtitle}</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="wheel-canvas-container" id="tarotCanvasContainer">
            <canvas id="tarotCanvas"></canvas>
          </div>
          <button class="spin-btn tarot-spin-btn" id="tarotSpinBtn">
            <span class="spin-text">🃏 ${t.spinNow || 'Spin Now'}</span>
            <div class="spin-ripple"></div>
          </button>
          <div class="result-display" id="tarotResult"></div>
        </div>

        <div class="wheel-sidebar" id="tarotSidebar"></div>
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

      ${renderWheelSeoContent(t.title, 'yes-no-tarot', locale)}
      ${renderWheelFaq(locale)}
      ${renderWheelSilo(locale, 'yes-no-tarot')}
    </div>
  `;

  const getColors = (len) => Array.from({ length: len }, (_, i) => TAROT_COLORS[i % TAROT_COLORS.length]);
  
  const engine = new WheelEngine('tarotCanvas', {
    entries: TAROT_DEFAULT_ENTRIES,
    colors: getColors(TAROT_DEFAULT_ENTRIES.length),
    onTick: () => audioManager.playTick(),
    onResult: (winner) => {
      audioManager.playFanfare();
      const resultEl = document.getElementById('tarotResult');
      resultEl.innerHTML = `<div class="result-winner tarot-result"><span class="result-emoji">🃏</span><span class="result-text">${winner.entry}</span></div>`;
      resultEl.classList.add('show');
      customPanel.addResult(winner.entry);
      document.getElementById('tarotSpinBtn').disabled = false;
    },
    onSpinStart: () => {
      audioManager.init();
      document.getElementById('tarotResult').classList.remove('show');
      document.getElementById('tarotSpinBtn').disabled = true;
    }
  });

  const customPanel = new CustomizationPanel(engine, {
    wheelName: 'yes-no-tarot',
    onEntriesChange: (entries) => {
      engine.setEntries(entries, getColors(entries.length));
    }
  });
  customPanel.render('tarotSidebar');
  customPanel.setEntries(TAROT_DEFAULT_ENTRIES);

  document.getElementById('tarotSpinBtn').addEventListener('click', () => engine.spin());

  return engine;
}
