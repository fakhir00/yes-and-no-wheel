// FoodWheel.js — Symmetrical food choices wheel
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { getLocalizedWheelSeedEntries, getWheelSharedText, getWheelUiText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { createResultOnlyMode } from './resultOnlyMode.js';
import { getWheelPageContent } from '../wheelContent.js';

const FOOD_COLORS = [
  '#ff4757', // Red
  '#ff6b81', // Pink
  '#ff7f50', // Coral
  '#ffa502', // Orange
  '#eccc68', // Yellow
  '#2ed573', // Green
  '#1e90ff', // Blue
  '#3742fa', // Indigo
];

const FOOD_EMOJI_REGEX = /\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/gu;

function renderFoodContent(locale) {
  const c = getWheelPageContent(locale, 'random-food');
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

function renderFoodFaq(locale) {
  const c = getWheelPageContent(locale, 'random-food');
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

function getFoodResultEmoji(entry) {
  if (typeof entry !== 'string') return '🍽️';
  const matches = entry.match(FOOD_EMOJI_REGEX);
  return matches && matches.length ? matches[matches.length - 1] : '🍽️';
}

export function renderFoodWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'random-food');
  const ui = getWheelUiText(locale);
  const spinAgainText = ui.spinAgain || 'Spin Again';
  const c = getWheelPageContent(locale, 'random-food');
  
  // Note: ui could be missing randomFood specific strings in some older localized files, 
  // but it's safe to use standard ui where applicable. We are only using standard generic things or `t` instead.
  // Not using autoGradient string because it says ROYGBIV. Let's just not include auto-gradient button since it's food.
  
  container.innerHTML = `
    <div class="wheel-page food-theme">
      <div class="wheel-header">
        <h1 class="wheel-title food-text">${c.title || 'Random Food Wheel'}</h1>
        <p class="wheel-subtitle">${c.subtitle || ''}</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="wheel-canvas-container" id="foodCanvasContainer">
            <canvas id="foodCanvas"></canvas>
          </div>
          <button class="spin-btn food-spin-btn" id="foodSpinBtn">
            <span class="spin-text">🍔 ${t.spinNow}</span>
            <div class="spin-ripple"></div>
          </button>
          <div class="result-display" id="foodResult"></div>
        </div>

        <div class="wheel-sidebar" id="foodSidebar"></div>
      </div>

      <div class="wheel-instructions howto-tutorial-style">
        <h2>${c.howToUse?.title || 'How to Use the Random Food Wheel'}</h2>
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

      ${renderFoodContent(locale)}
      ${renderFoodFaq(locale)}

      ${renderWheelSilo(locale, 'random-food')}
    </div>
  `;

  const defaultEntries = getLocalizedWheelSeedEntries(locale, 'random-food');
  const getColors = (len) => Array.from({ length: len }, (_, i) => FOOD_COLORS[i % FOOD_COLORS.length]);
  const defaultColors = getColors(defaultEntries.length);
  let resultMode;

  const engine = new WheelEngine('foodCanvas', {
    entries: defaultEntries,
    colors: defaultColors,
    onTick: () => audioManager.playTick(),
    onResult: (winner) => {
      audioManager.playFanfare();
      const resultEl = document.getElementById('foodResult');
      const resultEmoji = getFoodResultEmoji(winner.entry);
      resultEl.innerHTML = `<div class="result-winner food-result"><span class="result-emoji">${resultEmoji}</span><span class="result-text">${winner.entry}</span></div>`;
      resultEl.classList.add('show');
      resultMode.showResultOnly();
      customPanel.addResult(winner.entry);
      document.getElementById('foodSpinBtn').disabled = false;
    },
    onSpinStart: () => {
      audioManager.init();
      resultMode.hideResultOnly();
      document.getElementById('foodResult').classList.remove('show');
      document.getElementById('foodSpinBtn').disabled = true;
    }
  });

  const customPanel = new CustomizationPanel(engine, {
    wheelName: 'random-food',
    onEntriesChange: (entries) => {
      engine.setEntries(entries, getColors(entries.length));
    }
  });
  customPanel.render('foodSidebar');
  customPanel.setEntries(defaultEntries);
  resultMode = createResultOnlyMode({
    root: container,
    resultSelector: '#foodResult',
    spinAgainText,
    onSpinAgain: () => {}
  });

  document.getElementById('foodSpinBtn').addEventListener('click', () => engine.spin());

  return engine;
}
