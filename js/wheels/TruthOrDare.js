// TruthOrDare.js — Two-step neon party wheel
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { getRandomTruth, getRandomDare } from '../data/truthOrDareDB.js';
import { getWheelSharedText, getWheelUiText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { renderWheelFaq } from './WheelFaq.js';
import { renderWheelSeoContent } from './WheelSeoContent.js';

const NEON_COLORS = [
  '#FF006E', '#FB5607', '#FFBE0B', '#3A86FF', '#8338EC',
  '#FF006E', '#06D6A0', '#118AB2', '#EF476F', '#FFD166',
  '#073B4C', '#F72585', '#7209B7', '#4361EE', '#4CC9F0'
];

export function renderTruthOrDare(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'spin-the-wheel-truth-or-dare');
  const ui = getWheelUiText(locale);
  container.innerHTML = `
    <div class="wheel-page tod-theme">
      <div class="wheel-header">
        <h1 class="wheel-title neon-text">🎉 ${t.title}</h1>
        <p class="wheel-subtitle">${t.subtitle}</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="tod-step-indicator">
            <div class="tod-step active" id="todStep1Indicator">
              <span class="tod-step-num">1</span>
              <span>${ui.pickPlayer}</span>
            </div>
            <div class="tod-step-arrow">→</div>
            <div class="tod-step" id="todStep2Indicator">
              <span class="tod-step-num">2</span>
              <span>${ui.truthOrDare}</span>
            </div>
          </div>

          <div class="tod-player-setup" id="todPlayerSetup">
            <textarea id="todPlayerNames" placeholder="${ui.playersPlaceholder}&#10;Alex&#10;Jordan&#10;Sam&#10;Taylor" rows="4"></textarea>
            <button class="custom-btn" id="todLoadPlayers">${ui.loadPlayers}</button>
          </div>

          <div class="wheel-canvas-container neon-bg" id="todCanvasContainer">
            <canvas id="todCanvas"></canvas>
          </div>
          <button class="spin-btn tod-spin-btn" id="todSpinBtn">
            <span class="spin-text" id="todSpinText">🎉 ${ui.pickAPlayer}</span>
            <div class="spin-ripple"></div>
          </button>

          <div class="result-display" id="todResult"></div>

          <!-- Truth or Dare modal -->
          <div class="tod-modal" id="todModal">
            <div class="tod-modal-content">
              <div class="tod-modal-type" id="todModalType"></div>
              <div class="tod-modal-prompt" id="todModalPrompt"></div>
              <div class="tod-modal-player" id="todModalPlayer"></div>
              <button class="custom-btn" id="todNextRound">${ui.nextRound}</button>
            </div>
          </div>
        </div>

        <div class="wheel-sidebar" id="todSidebar"></div>
      </div>

      <div class="wheel-instructions howto-tutorial-style">
        <h2>${t.howToUse}</h2>
        <p class="howto-intro">${t.howToIntro}</p>
        <div class="howto-steps-list">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">1</span> ${t.step1Title}</h3>
            <p class="howto-step-desc">${t.step1Desc}</p>
          </div>
          <hr class="howto-divider">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">2</span> ${t.step2Title}</h3>
            <p class="howto-step-desc">${t.step2Desc}</p>
          </div>
          <hr class="howto-divider">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">3</span> ${t.step3Title}</h3>
            <p class="howto-step-desc">${t.step3Desc}</p>
          </div>
        </div>
      </div>

      ${renderWheelSeoContent(t.title, 'spin-the-wheel-truth-or-dare', locale)}
      ${renderWheelFaq(locale)}
      ${renderWheelSilo(locale, 'spin-the-wheel-truth-or-dare')}
    </div>
  `;

  let currentStep = 1; // 1 = pick player, 2 = truth or dare
  let selectedPlayer = '';
  const defaultPlayers = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan', 'Casey'];

  const engine = new WheelEngine('todCanvas', {
    entries: defaultPlayers,
    colors: NEON_COLORS,
    onTick: () => audioManager.playTick(),
    onResult: (winner) => {
      audioManager.playFanfare();
      if (currentStep === 1) {
        selectedPlayer = winner.entry;
        // Show player result briefly
        const resultEl = document.getElementById('todResult');
        resultEl.innerHTML = `<div class="result-winner tod-result"><span class="result-emoji">👤</span><span class="result-text">${winner.entry}${ui.turnSuffix}</span></div>`;
        resultEl.classList.add('show');
        
        // Scroll slightly down to ensure it's visible on smaller screens
        setTimeout(() => {
          resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);

        // Auto transition to step 2
        setTimeout(() => {
          currentStep = 2;
          document.getElementById('todStep1Indicator').classList.remove('active');
          document.getElementById('todStep2Indicator').classList.add('active');

          // Set truth or dare wheel
          engine.setEntries(['Truth', 'Dare'], ['#3A86FF', '#FF006E']);
          document.getElementById('todSpinText').textContent = `🎭 ${ui.truthOrDarePrompt}`;
          document.getElementById('todSpinBtn').disabled = false;
          resultEl.classList.remove('show');
        }, 1500);
      } else {
        // Step 2 result
        const isTruth = winner.entry === 'Truth';
        const prompt = isTruth ? getRandomTruth() : getRandomDare();

        // Show modal
        const modal = document.getElementById('todModal');
        document.getElementById('todModalType').textContent = winner.entry;
        document.getElementById('todModalType').className = `tod-modal-type ${isTruth ? 'truth' : 'dare'}`;
        document.getElementById('todModalPrompt').textContent = prompt;
        document.getElementById('todModalPlayer').textContent = `🎯 ${selectedPlayer}`;
        modal.classList.add('show');
        
        // Scroll slightly up so viewport clears any browser UI bars
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);

        customPanel.addResult(`${selectedPlayer}: ${winner.entry}`);
        document.getElementById('todSpinBtn').disabled = false;
      }
    },
    onSpinStart: () => {
      audioManager.init();
      document.getElementById('todResult').classList.remove('show');
      document.getElementById('todSpinBtn').disabled = true;
    }
  });

  const customPanel = new CustomizationPanel(engine, { wheelName: 'tod' });
  customPanel.render('todSidebar');

  // Spin button
  document.getElementById('todSpinBtn').addEventListener('click', () => engine.spin());

  // Load players
  document.getElementById('todLoadPlayers').addEventListener('click', () => {
    const text = document.getElementById('todPlayerNames').value;
    const players = text.split('\n').map(s => s.trim()).filter(s => s);
    if (players.length >= 2) {
      engine.setEntries(players, NEON_COLORS);
      customPanel.setEntries(players);
      currentStep = 1;
      document.getElementById('todStep1Indicator').classList.add('active');
      document.getElementById('todStep2Indicator').classList.remove('active');
      document.getElementById('todSpinText').textContent = `🎉 ${ui.pickAPlayer}`;
    }
  });

  // Next round
  document.getElementById('todNextRound').addEventListener('click', () => {
    document.getElementById('todModal').classList.remove('show');
    currentStep = 1;
    document.getElementById('todStep1Indicator').classList.add('active');
    document.getElementById('todStep2Indicator').classList.remove('active');
    engine.setEntries(
      document.getElementById('todPlayerNames').value.split('\n').map(s => s.trim()).filter(s => s).length > 0
        ? document.getElementById('todPlayerNames').value.split('\n').map(s => s.trim()).filter(s => s)
        : defaultPlayers,
      NEON_COLORS
    );
    document.getElementById('todSpinText').textContent = `🎉 ${ui.pickAPlayer}`;
  });

  // Set initial player names
  document.getElementById('todPlayerNames').value = defaultPlayers.join('\n');

  return engine;
}
