// WheelOfFate.js — Dark cosmic aesthetic with weighting system
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';

const FATE_COLORS = [
  '#2D1B69', '#4A1A6B', '#6B2D8B', '#8B3FA0', '#3D1E75',
  '#1A0A3E', '#4B0E4E', '#5C2D91', '#2E1065', '#7C3AED',
  '#312E81', '#4C1D95', '#581C87', '#6D28D9', '#7C2D12',
  '#1E1B4B', '#3730A3', '#4338CA', '#6366F1', '#8B5CF6'
];

export function renderWheelOfFate(container) {
  container.innerHTML = `
    <div class="wheel-page fate-theme">
      <div class="wheel-header">
        <h1 class="wheel-title fate-title">⚔️ Wheel of Fate</h1>
        <p class="wheel-subtitle">Spin the <strong>Wheel of Fate</strong> — a high-stakes wheel for writers and roleplayers to determine character outcomes.</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="wheel-canvas-container cosmic-bg" id="fateCanvasContainer">
            <div class="cosmic-particles"></div>
            <canvas id="fateCanvas"></canvas>
          </div>
          <button class="spin-btn fate-spin-btn" id="fateSpinBtn">
            <span class="spin-text">⚔️ SEAL YOUR FATE</span>
            <div class="spin-ripple"></div>
          </button>
          <div class="result-display" id="fateResult"></div>

          <div class="weight-editor" id="fateWeightEditor">
            <h3>⚖️ Outcome Weights</h3>
            <p class="weight-hint">Drag sliders to make outcomes more or less likely</p>
            <div class="weight-list" id="fateWeightList"></div>
          </div>
        </div>

        <div class="wheel-sidebar" id="fateSidebar"></div>
      </div>

      <div class="wheel-instructions howto-tutorial-style">
        <h2>How to Use the <strong>Wheel of Fate</strong></h2>
        <p class="howto-intro">The <strong>Wheel of Fate</strong> is a high-stakes spinner for writers and RPG players. Add dramatic outcomes with weighted probabilities and let destiny decide.</p>
        <div class="howto-steps-list">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">1</span> Set Your Outcomes</h3>
            <p class="howto-step-desc">Add dramatic outcomes for your story or roleplay. Use Advanced Mode on the <strong>Wheel of Fate</strong> for custom entries.</p>
            <div class="howto-step-screenshot">
              <img src="images/howto/wheel-of-fate.png" alt="Wheel of Fate with cosmic dark theme and weighted outcomes" class="howto-inline-img" loading="lazy">
            </div>
          </div>
          <hr class="howto-divider">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">2</span> Adjust Weights</h3>
            <p class="howto-step-desc">Use the weight sliders to make certain outcomes more or less likely. A 2x weight means that slice is twice as large!</p>
          </div>
          <hr class="howto-divider">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">3</span> Seal Your Fate</h3>
            <p class="howto-step-desc">Spin the <strong>Wheel of Fate</strong> and let destiny decide. Also try the <a href="#rainbow">Rainbow Wheel</a> or <a href="#country">Country Wheel</a>.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  const defaultEntries = ['Death', 'Mercy', 'Betrayal', 'Love', 'Victory', 'Exile', 'Redemption', 'Sacrifice'];
  const defaultWeights = [1, 1, 1, 1, 1, 1, 1, 1];

  const engine = new WheelEngine('fateCanvas', {
    entries: defaultEntries,
    colors: FATE_COLORS.slice(0, defaultEntries.length),
    weights: defaultWeights,
    onTick: () => audioManager.playTick(),
    onResult: (winner) => {
      audioManager.playFanfare();
      const resultEl = document.getElementById('fateResult');
      resultEl.innerHTML = `<div class="result-winner fate-result"><span class="result-emoji">⚔️</span><span class="result-text">${winner.entry}</span><span class="fate-subtitle">The fates have spoken.</span></div>`;
      resultEl.classList.add('show');
      customPanel.addResult(winner.entry);
      document.getElementById('fateSpinBtn').disabled = false;
    },
    onSpinStart: () => {
      audioManager.init();
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

  document.getElementById('fateSpinBtn').addEventListener('click', () => engine.spin());

  return engine;
}
