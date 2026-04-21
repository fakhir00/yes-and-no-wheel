// FoodWheel.js — Symmetrical food choices wheel
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { getLocalizedWheelSeedEntries, getWheelSharedText, getWheelUiText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { renderWheelFaq } from './WheelFaq.js';
import { renderWheelSeoContent } from './WheelSeoContent.js';
import { setupWheelResultOnlyMode } from './resultOnlyMode.js';

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

export function renderFoodWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'random-food');
  
  // Note: ui could be missing randomFood specific strings in some older localized files, 
  // but it's safe to use standard ui where applicable. We are only using standard generic things or `t` instead.
  // Not using autoGradient string because it says ROYGBIV. Let's just not include auto-gradient button since it's food.
  
  container.innerHTML = `
    <div class="wheel-page food-theme">
      <div class="wheel-header">
        <h1 class="wheel-title food-text">🍔 ${t.title}</h1>
        <p class="wheel-subtitle">${t.subtitle}</p>
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

      ${renderWheelSeoContent(t.title, 'random-food', locale)}
      ${renderWheelFaq(locale)}
      ${renderWheelSilo(locale, 'random-food')}
    </div>
  `;

  const defaultEntries = getLocalizedWheelSeedEntries(locale, 'random-food');
  const getColors = (len) => Array.from({ length: len }, (_, i) => FOOD_COLORS[i % FOOD_COLORS.length]);
  const defaultColors = getColors(defaultEntries.length);
  const spinBtn = document.getElementById('foodSpinBtn');
  const resultEl = document.getElementById('foodResult');
  const resultMode = setupWheelResultOnlyMode({
    layoutEl: container.querySelector('.wheel-layout'),
    mainEl: container.querySelector('.wheel-main'),
    resultEl,
    onSpinAgain: () => spinBtn.click()
  });

  const engine = new WheelEngine('foodCanvas', {
    entries: defaultEntries,
    colors: defaultColors,
    onTick: () => audioManager.playTick(),
    onResult: (winner) => {
      audioManager.playFanfare();
      resultEl.innerHTML = `<div class="result-winner food-result"><span class="result-emoji">🍔</span><span class="result-text">${winner.entry}</span></div>`;
      resultEl.classList.add('show');
      resultMode.showResultOnly();
      customPanel.addResult(winner.entry);
      spinBtn.disabled = false;
    },
    onSpinStart: () => {
      audioManager.init();
      resultMode.reset();
      resultEl.classList.remove('show');
      spinBtn.disabled = true;
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

  spinBtn.addEventListener('click', () => engine.spin());

  return engine;
}
