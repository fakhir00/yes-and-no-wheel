// ChanceFortuneWheel.js — Luck and fortune themed spinning wheel with preset modes
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { getLocalizedWheelSeedEntries, getWheelSharedText, getWheelUiText, getHomeText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { createResultOnlyMode } from './resultOnlyMode.js';
import { getWheelPageContent } from '../wheelContent.js';

const FORTUNE_COLORS = [
  '#f59e0b', // Amber
  '#d97706', // Dark amber
  '#b45309', // Brown
  '#8b5cf6', // Violet
  '#7c3aed', // Purple
  '#ec4899', // Pink
  '#f97316', // Orange
  '#facc15', // Yellow
];

const LUCKY_NUMBERS = ['1 🍀', '2 ✨', '3 🎲', '4 🎯', '5 💰', '6 🌟', '7 🎰', '8 🔮'];

function renderFortuneContent(locale) {
  const c = getWheelPageContent(locale, 'chance-fortune-wheel');
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

function renderFortuneFaq(locale) {
  const c = getWheelPageContent(locale, 'chance-fortune-wheel');
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

function getFortuneResultEmoji(entry) {
  const matches = String(entry || '').match(/\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/gu);
  return matches && matches.length ? matches[matches.length - 1] : '🍀';
}

export function renderChanceFortuneWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'chance-fortune-wheel');
  const ui = getWheelUiText(locale);
  const home = getHomeText(locale);
  const spinAgainText = ui.spinAgain || 'Spin Again';
  const c = getWheelPageContent(locale, 'chance-fortune-wheel');
  const presets = c?.presets || { fortunes: 'Fortunes', decision: 'Yes / No', luckyNumbers: 'Lucky Numbers' };
  const askAgainText = ui.askAgain || 'Ask Again';

  container.innerHTML = `
    <div class="wheel-page fortune-theme">
      <div class="wheel-header">
        <h1 class="wheel-title fortune-title">${c.title || 'Chance and Fortune Wheel'}</h1>
        <p class="wheel-subtitle">${c.subtitle || ''}</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="wheel-canvas-container fortune-canvas" id="fortuneCanvasContainer">
            <canvas id="fortuneCanvas"></canvas>
          </div>
          <button class="spin-btn fortune-spin-btn" id="fortuneSpinBtn">
            <span class="spin-text">🍀 ${t.spinNow}</span>
            <div class="spin-ripple"></div>
          </button>
          <div class="result-display" id="fortuneResult"></div>

          <div class="preset-picker" id="fortunePresets" aria-label="Preset modes">
            <span class="preset-picker-title">✨ ${c.presetTitle || 'Choose a Mode'}</span>
            <button type="button" class="preset-chip is-active" data-preset="fortunes">🍀 ${presets.fortunes}</button>
            <button type="button" class="preset-chip" data-preset="decision">✅ ${presets.decision}</button>
            <button type="button" class="preset-chip" data-preset="numbers">🔢 ${presets.luckyNumbers}</button>
          </div>
        </div>

        <div class="wheel-sidebar" id="fortuneSidebar"></div>
      </div>

      <div class="wheel-instructions howto-tutorial-style">
        <h2>${c.howToUse?.title || 'How to Use the Chance and Fortune Wheel'}</h2>
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

      ${renderFortuneContent(locale)}
      ${renderFortuneFaq(locale)}

      ${renderWheelSilo(locale, 'chance-fortune-wheel')}
    </div>
  `;

  const defaultEntries = getLocalizedWheelSeedEntries(locale, 'chance-fortune-wheel');
  const getColors = (len) => Array.from({ length: len }, (_, i) => FORTUNE_COLORS[i % FORTUNE_COLORS.length]);
  let resultMode;

  const engine = new WheelEngine('fortuneCanvas', {
    entries: defaultEntries,
    colors: getColors(defaultEntries.length),
    onTick: () => audioManager.playTick(),
    onResult: (winner) => {
      audioManager.playFanfare();
      const resultEl = document.getElementById('fortuneResult');
      const resultEmoji = getFortuneResultEmoji(winner.entry);
      resultEl.innerHTML = `<div class="result-winner fortune-result"><span class="result-emoji">${resultEmoji}</span><span class="result-text">${winner.entry}</span></div>`;
      resultEl.classList.add('show');
      resultMode.showResultOnly();
      customPanel.addResult(winner.entry);
      document.getElementById('fortuneSpinBtn').disabled = false;
    },
    onSpinStart: () => {
      audioManager.init();
      resultMode.hideResultOnly();
      document.getElementById('fortuneResult').classList.remove('show');
      document.getElementById('fortuneSpinBtn').disabled = true;
    }
  });

  const customPanel = new CustomizationPanel(engine, {
    wheelName: 'chance-fortune-wheel',
    onEntriesChange: (entries) => {
      engine.setEntries(entries, getColors(entries.length));
    }
  });
  customPanel.render('fortuneSidebar');
  customPanel.setEntries(defaultEntries);
  resultMode = createResultOnlyMode({
    root: container,
    resultSelector: '#fortuneResult',
    spinAgainText,
    onSpinAgain: () => {}
  });

  function loadEntries(entries) {
    engine.setEntries(entries, getColors(entries.length));
    customPanel.setEntries(entries);
    document.getElementById('fortuneResult').classList.remove('show');
  }

  document.getElementById('fortunePresets').addEventListener('click', (e) => {
    const chip = e.target.closest('.preset-chip');
    if (!chip) return;
    document.querySelectorAll('.preset-chip').forEach((c) => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    if (chip.dataset.preset === 'fortunes') {
      loadEntries(getLocalizedWheelSeedEntries(locale, 'chance-fortune-wheel'));
    } else if (chip.dataset.preset === 'decision') {
      loadEntries([`${home.yes} ✅`, `${home.no} ❌`, `${home.maybe} 🤔`, `${askAgainText} 🔮`]);
    } else if (chip.dataset.preset === 'numbers') {
      loadEntries(LUCKY_NUMBERS);
    }
  });

  document.getElementById('fortuneSpinBtn').addEventListener('click', () => engine.spin());

  return engine;
}
