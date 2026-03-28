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
        <p class="wheel-subtitle">A high-stakes wheel for writers and roleplayers to determine character outcomes.</p>
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

      <div class="wheel-instructions">
        <h2>How to Use the Wheel of Fate</h2>
        <div class="instruction-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Set Your Outcomes</h3>
              <p>Add dramatic outcomes for your story or roleplay. Use the Advanced Mode for custom entries.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Adjust Weights</h3>
              <p>Use the weight sliders to make certain outcomes more or less likely. A 2x weight means that slice is twice as large!</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Seal Your Fate</h3>
              <p>Hit the button and let destiny decide. The cosmic wheel waits for no one.</p>
            </div>
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
