// TruthOrDare.js — Two-step neon party wheel
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { getRandomTruth, getRandomDare } from '../data/truthOrDareDB.js';

const NEON_COLORS = [
  '#FF006E', '#FB5607', '#FFBE0B', '#3A86FF', '#8338EC',
  '#FF006E', '#06D6A0', '#118AB2', '#EF476F', '#FFD166',
  '#073B4C', '#F72585', '#7209B7', '#4361EE', '#4CC9F0'
];

export function renderTruthOrDare(container) {
  container.innerHTML = `
    <div class="wheel-page tod-theme">
      <div class="wheel-header">
        <h1 class="wheel-title neon-text">🎉 Spin the Wheel Truth or Dare</h1>
        <p class="wheel-subtitle"><strong>Spin the Wheel Truth or Dare</strong> — perfect for parties! Add players' names and let the wheel handle the questions.</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="tod-step-indicator">
            <div class="tod-step active" id="todStep1Indicator">
              <span class="tod-step-num">1</span>
              <span>Pick Player</span>
            </div>
            <div class="tod-step-arrow">→</div>
            <div class="tod-step" id="todStep2Indicator">
              <span class="tod-step-num">2</span>
              <span>Truth or Dare</span>
            </div>
          </div>

          <div class="tod-player-setup" id="todPlayerSetup">
            <textarea id="todPlayerNames" placeholder="Enter player names, one per line...&#10;Alex&#10;Jordan&#10;Sam&#10;Taylor" rows="4"></textarea>
            <button class="custom-btn" id="todLoadPlayers">Load Players</button>
          </div>

          <div class="wheel-canvas-container neon-bg" id="todCanvasContainer">
            <canvas id="todCanvas"></canvas>
          </div>
          <button class="spin-btn tod-spin-btn" id="todSpinBtn">
            <span class="spin-text" id="todSpinText">🎉 PICK A PLAYER</span>
            <div class="spin-ripple"></div>
          </button>

          <div class="result-display" id="todResult"></div>

          <!-- Truth or Dare modal -->
          <div class="tod-modal" id="todModal">
            <div class="tod-modal-content">
              <div class="tod-modal-type" id="todModalType"></div>
              <div class="tod-modal-prompt" id="todModalPrompt"></div>
              <div class="tod-modal-player" id="todModalPlayer"></div>
              <button class="custom-btn" id="todNextRound">Next Round</button>
            </div>
          </div>
        </div>

        <div class="wheel-sidebar" id="todSidebar"></div>
      </div>

      <div class="wheel-instructions">
        <h2>How to Play <strong>Spin the Wheel Truth or Dare</strong></h2>
        <div class="howto-screenshot-wrap">
          <img src="images/howto/truth-or-dare.png" alt="Spin the Wheel Truth or Dare party game with neon design" class="howto-screenshot" loading="lazy">
          <p class="howto-caption"><strong>Spin the Wheel Truth or Dare</strong> — neon-themed party game with 200+ prompts</p>
        </div>
        <div class="instruction-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Add Players</h3>
              <p>Enter everyone's names in the text box, one per line. The more players, the more fun with <strong>Spin the Wheel Truth or Dare</strong>!</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Spin to Pick a Player</h3>
              <p>The wheel selects a random player. No arguments — the wheel has spoken!</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Truth or Dare</h3>
              <p>A second spin automatically generates a Truth or Dare prompt from our database of 200+ questions.</p>
            </div>
          </div>
        </div>
      </div>
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
        resultEl.innerHTML = `<div class="result-winner tod-result"><span class="result-emoji">👤</span><span class="result-text">${winner.entry}'s turn!</span></div>`;
        resultEl.classList.add('show');

        // Auto transition to step 2
        setTimeout(() => {
          currentStep = 2;
          document.getElementById('todStep1Indicator').classList.remove('active');
          document.getElementById('todStep2Indicator').classList.add('active');

          // Set truth or dare wheel
          engine.setEntries(['Truth', 'Dare'], ['#3A86FF', '#FF006E']);
          document.getElementById('todSpinText').textContent = '🎭 TRUTH OR DARE?';
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
      document.getElementById('todSpinText').textContent = '🎉 PICK A PLAYER';
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
    document.getElementById('todSpinText').textContent = '🎉 PICK A PLAYER';
  });

  // Set initial player names
  document.getElementById('todPlayerNames').value = defaultPlayers.join('\n');

  return engine;
}
