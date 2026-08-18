// LetterPickerWheel.js — Random alphabet letter spinner
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { getLocalizedWheelSeedEntries, getWheelSharedText, getWheelUiText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { createResultOnlyMode } from './resultOnlyMode.js';
import { getWheelPageContent } from '../wheelContent.js';

const LETTER_COLORS = [
  '#6366f1', '#3b82f6', '#06b6d4', '#14b8a6', '#22c55e',
  '#a3e635', '#eab308', '#f97316', '#ef4444', '#ec4899',
  '#8b5cf6', '#6366f1', '#0ea5e9', '#10b981', '#f59e0b',
  '#f43f5e', '#7c3aed', '#0891b2', '#84cc16', '#d946ef'
];

function renderLetterContent(locale) {
  const c = getWheelPageContent(locale, 'letter-picker-wheel');
  if (!c || !c.sections) return '';
  let html = '<section class="wheel-seo-content page-content">';
  for (const sec of c.sections) {
    html += '<section class="content-section">';
    html += `<h2>${sec.title}</h2>`;
    if (sec.content) {
      for (const p of sec.content) html += `<p>${p}</p>`;
    }
    if (sec.subsections) {
      for (const sub of sec.subsections) {
        html += `<h3>${sub.title}</h3>`;
        html += `<p>${sub.content}</p>`;
      }
    }
    html += '</section>';
  }
  html += '</section>';
  return html;
}

function renderLetterFaq(locale) {
  const c = getWheelPageContent(locale, 'letter-picker-wheel');
  if (!c || !c.faq) return '';
  return `
    <section class="faq wheel-faq">
      <h2 class="section-title">Frequently Asked Questions</h2>
      <div class="faq-list">
        ${c.faq.map((item) => `<details class="faq-item"><summary>${item.q}</summary><p>${item.a}</p></details>`).join('')}
      </div>
    </section>
  `;
}

export function renderLetterPickerWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'letter-picker-wheel');
  const ui = getWheelUiText(locale);
  const spinAgainText = ui.spinAgain || 'Spin Again';
  const c = getWheelPageContent(locale, 'letter-picker-wheel');

  container.innerHTML = `
    <div class="wheel-page letter-theme">
      <div class="wheel-header">
        <h1 class="wheel-title letter-title">${c.title || 'Letter Picker Wheel'}</h1>
        <p class="wheel-subtitle">${c.subtitle || ''}</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="wheel-canvas-container" id="letterCanvasContainer">
            <canvas id="letterCanvas"></canvas>
          </div>
          <button class="spin-btn letter-spin-btn" id="letterSpinBtn">
            <span class="spin-text">🔤 ${t.spinNow}</span>
            <div class="spin-ripple"></div>
          </button>
          <div class="result-display" id="letterResult"></div>
        </div>

        <div class="wheel-sidebar" id="letterSidebar"></div>
      </div>

      <div class="wheel-instructions howto-tutorial-style">
        <h2>${c.howToUse?.title || 'How to Use the Letter Picker Wheel'}</h2>
        <p class="howto-intro">${c.howToUse?.intro || ''}</p>
        <div class="howto-steps-list">
          ${(c.howToUse?.steps || []).map((step, i) => `
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">${i + 1}</span> ${step.title}</h3>
            <p class="howto-step-desc">${step.desc}</p>
          </div>
          ${i < (c.howToUse?.steps?.length || 0) - 1 ? '<hr class="howto-divider">' : ''}
          `).join('')}
        </div>
      </div>

      ${renderLetterContent(locale)}
      ${renderLetterFaq(locale)}

      ${renderWheelSilo(locale, 'letter-picker-wheel')}
    </div>
  `;

  const defaultEntries = getLocalizedWheelSeedEntries(locale, 'letter-picker-wheel');
  const getColors = (len) => Array.from({ length: len }, (_, i) => LETTER_COLORS[i % LETTER_COLORS.length]);
  let resultMode;

  const engine = new WheelEngine('letterCanvas', {
    entries: defaultEntries,
    colors: getColors(defaultEntries.length),
    onTick: () => audioManager.playTick(),
    onResult: (winner) => {
      audioManager.playFanfare();
      const resultEl = document.getElementById('letterResult');
      resultEl.innerHTML = `<div class="result-winner letter-result"><span class="result-emoji">🔤</span><span class="result-text">${winner.entry}</span></div>`;
      resultEl.classList.add('show');
      resultMode.showResultOnly();
      customPanel.addResult(winner.entry);
      document.getElementById('letterSpinBtn').disabled = false;
    },
    onSpinStart: () => {
      audioManager.init();
      resultMode.hideResultOnly();
      document.getElementById('letterResult').classList.remove('show');
      document.getElementById('letterSpinBtn').disabled = true;
    }
  });

  const customPanel = new CustomizationPanel(engine, {
    wheelName: 'letter-picker-wheel',
    onEntriesChange: (entries) => {
      engine.setEntries(entries, getColors(entries.length));
    }
  });
  customPanel.render('letterSidebar');
  customPanel.setEntries(defaultEntries);
  resultMode = createResultOnlyMode({
    root: container,
    resultSelector: '#letterResult',
    spinAgainText,
    onSpinAgain: () => {}
  });

  document.getElementById('letterSpinBtn').addEventListener('click', () => engine.spin());

  return engine;
}
