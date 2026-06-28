// WheelOfFate.js — Dark cosmic aesthetic with weighting system
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { getLocalizedWheelSeedEntries, getWheelSharedText, getWheelUiText, splitLocaleFromPath, buildLocalizedPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { createResultOnlyMode } from './resultOnlyMode.js';
import { getWheelPageContent } from '../wheelContent.js';

const FATE_COLORS = [
  '#2D1B69', '#4A1A6B', '#6B2D8B', '#8B3FA0', '#3D1E75',
  '#1A0A3E', '#4B0E4E', '#5C2D91', '#2E1065', '#7C3AED',
  '#312E81', '#4C1D95', '#581C87', '#6D28D9', '#7C2D12',
  '#1E1B4B', '#3730A3', '#4338CA', '#6366F1', '#8B5CF6'
];

function renderFateFaq(locale) {
  const c = getWheelPageContent(locale, 'wheel-of-fate');
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

function renderFateContent(locale) {
  const c = getWheelPageContent(locale, 'wheel-of-fate');
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

export function renderWheelOfFate(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'wheel-of-fate');
  const ui = getWheelUiText(locale);
  const spinAgainText = ui.spinAgain || 'Spin Again';
  const c = getWheelPageContent(locale, 'wheel-of-fate');
  container.innerHTML = `
    <div class="wheel-page fate-theme">
      <div class="wheel-header">
        <h1 class="wheel-title fate-title">${c.title || 'Wheel of Fate'}</h1>
        <p class="wheel-subtitle">${c.subtitle || ''}</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="wheel-canvas-container cosmic-bg" id="fateCanvasContainer">
            <div class="cosmic-particles"></div>
            <canvas id="fateCanvas"></canvas>
          </div>
          <button class="spin-btn fate-spin-btn" id="fateSpinBtn">
            <span class="spin-text">⚔️ ${ui.sealYourFate}</span>
            <div class="spin-ripple"></div>
          </button>
          <div class="result-display" id="fateResult"></div>

          <div class="weight-editor" id="fateWeightEditor">
            <p class="weight-editor-title">⚖️ ${ui.outcomeWeights}</p>
            <p class="weight-hint">${ui.outcomeWeightHint}</p>
            <div class="weight-list" id="fateWeightList"></div>
          </div>
        </div>

        <div class="wheel-sidebar" id="fateSidebar"></div>
      </div>

      <div class="wheel-instructions howto-tutorial-style">
        <h2>${c.howToUse?.title || 'How to Use the Wheel of Fate'}</h2>
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

      ${renderFateContent(locale)}
      ${renderFateFaq(locale)}
      ${renderWheelSilo(locale, 'wheel-of-fate')}
    </div>
  `;

  const defaultEntries = getLocalizedWheelSeedEntries(locale, 'wheel-of-fate');
  const defaultWeights = [1, 1, 1, 1, 1, 1, 1, 1];
  let resultMode;

  const engine = new WheelEngine('fateCanvas', {
    entries: defaultEntries,
    colors: FATE_COLORS.slice(0, defaultEntries.length),
    weights: defaultWeights,
    onTick: () => audioManager.playTick(),
    onResult: (winner) => {
      audioManager.playFanfare();
      const resultEl = document.getElementById('fateResult');
      resultEl.innerHTML = `<div class="result-winner fate-result"><span class="result-emoji">⚔️</span><span class="result-text">${winner.entry}</span><span class="fate-subtitle">${ui.fateResultSubtitle}</span></div>`;
      resultEl.classList.add('show');
      resultMode.showResultOnly();
      customPanel.addResult(winner.entry);
      document.getElementById('fateSpinBtn').disabled = false;
    },
    onSpinStart: () => {
      audioManager.init();
      resultMode.hideResultOnly();
      document.getElementById('fateResult').classList.remove('show');
      document.getElementById('fateSpinBtn').disabled = true;
    }
  });

  function buildWeightEditor() {
    const list = document.getElementById('fateWeightList');
    list.innerHTML = engine.entries.map((entry, i) => `
      <div class="weight-item">
        <span class="weight-name">${entry}</span>
        <input type="range" min="1" max="5" value="${engine.weights[i] || 1}" 
          class="weight-slider" data-index="${i}">
        <span class="weight-value">${engine.weights[i] || 1}x</span>
      </div>
    `).join('');

    list.querySelectorAll('.weight-slider').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.index);
        engine.weights[idx] = parseInt(e.target.value);
        e.target.nextElementSibling.textContent = e.target.value + 'x';
        engine.draw();
      });
    });
  }

  buildWeightEditor();

  const customPanel = new CustomizationPanel(engine, {
    wheelName: 'fate',
    onEntriesChange: (entries) => {
      engine.weights = entries.map(() => 1);
      engine.setEntries(entries, FATE_COLORS.slice(0, entries.length), engine.weights);
      buildWeightEditor();
    }
  });
  customPanel.render('fateSidebar');
  customPanel.setEntries(defaultEntries);
  resultMode = createResultOnlyMode({
    root: container,
    resultSelector: '#fateResult',
    spinAgainText,
    onSpinAgain: () => {}
  });

  document.getElementById('fateSpinBtn').addEventListener('click', () => engine.spin());

  return engine;
}
