// YesNoOracleWheel.js — Text Input Layout Engine
import { audioManager } from '../engine/AudioManager.js';
import { getWheelSharedText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { renderWheelFaq } from './WheelFaq.js';
import { renderWheelSeoContent } from './WheelSeoContent.js';

const ORACLE_DEFAULT_ENTRIES = [
  { name: 'The Sun', answer: 'Yes' },
  { name: 'The Moon', answer: 'No' },
  { name: 'The Stars', answer: 'Maybe' },
  { name: 'The Anchor', answer: 'No' },
  { name: 'The Key', answer: 'Yes' },
  { name: 'The Crossroad', answer: 'Maybe' },
  { name: 'The Mirror', answer: 'No' },
  { name: 'The Dove', answer: 'Yes' }
];

export function renderYesNoOracleWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'oracle');
  
  container.innerHTML = `
    <div class="wheel-page tool-page oracle-mockup-page">
      <div class="wheel-header">
        <h1 class="wheel-title oracle-text">Consult the Oracle</h1>
        <p class="wheel-subtitle dark-subtitle">Seek ancient wisdom for your modern decisions. The<br>oracle channels timeless knowledge to guide your path.</p>
      </div>

      <div class="oracle-instruction-box">
        <strong>Consult the Oracle</strong>
        <p>Ask your question with an open heart, and the ancient wisdom will guide you.</p>
      </div>

      <div class="oracle-input-box" id="oracleInputContainer">
        <h2 class="oracle-input-title">What question weighs upon your heart?</h2>
        <textarea class="oracle-textarea" id="oracleQuestion" placeholder="Enter your yes/no question here..." rows="3"></textarea>
        <button class="oracle-submit-btn tarot-universe-btn" id="oracleSubmitBtn">Seek Wisdom</button>
      </div>

      <div class="oracle-result-display" style="display: none;" id="oracleOutcome"></div>

      ${renderWheelSeoContent(t.title, 'oracle', locale)}
      ${renderWheelFaq(locale)}
      ${renderWheelSilo(locale, 'oracle')}
    </div>
  `;

  // Attach functionality
  const submitBtn = container.querySelector('#oracleSubmitBtn');
  const resultDisplay = container.querySelector('#oracleOutcome');
  const inputContainer = container.querySelector('#oracleInputContainer');
  let isDrawn = false;

  submitBtn.addEventListener('click', () => {
    if (isDrawn) return;
    isDrawn = true;
    
    const randIndex = Math.floor(Math.random() * ORACLE_DEFAULT_ENTRIES.length);
    const result = ORACLE_DEFAULT_ENTRIES[randIndex];
    
    audioManager.init();
    audioManager.playFanfare();

    inputContainer.style.display = 'none';

    resultDisplay.innerHTML = `
      <div class="oracle-drawn-card">
        <h3>${result.name}</h3>
        <div class="oracle-drawn-answer ${result.answer.toLowerCase()}">${result.answer}</div>
      </div>
      <button class="tarot-universe-btn" id="oracleResetBtn" style="margin-top: 1rem;">Ask Another Question</button>
    `;
    resultDisplay.style.display = 'flex';

    container.querySelector('#oracleResetBtn').addEventListener('click', () => {
      isDrawn = false;
      resultDisplay.style.display = 'none';
      container.querySelector('#oracleQuestion').value = '';
      inputContainer.style.display = 'flex';
    });
  });

  // Note: We return a simulated engine object to prevent router errors
  return { destroy: () => {} };
}
