// YesNoOracleWheel.js — 3-Step Text Input Layout Engine
import { audioManager } from '../engine/AudioManager.js';
import { getWheelSharedText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { renderWheelFaq } from './WheelFaq.js';
import { renderWheelSeoContent } from './WheelSeoContent.js';

const ORACLE_DATA = [
  {
    "answer": "Yes",
    "emoji": "\ud83d\udd25",
    "message": "\"The phoenix rises, and so shall you.\"",
    "wisdom": "Transformation brings renewal. Embrace the change that leads to growth.",
    "energy": "Rebirth"
  },
  {
    "answer": "Yes",
    "emoji": "\u2600\ufe0f",
    "message": "\"Light conquers all shadows.\"",
    "wisdom": "Clarity and joy are on the horizon. Move confidently in your illuminated path.",
    "energy": "Clarity"
  },
  {
    "answer": "No",
    "emoji": "\ud83c\udf0a",
    "message": "\"Even the strongest tides must recede.\"",
    "wisdom": "Patience is required. Step back and let the situation cool down before acting.",
    "energy": "Patience"
  },
  {
    "answer": "No",
    "emoji": "\u26f0\ufe0f",
    "message": "\"The mountain does not move for the wind.\"",
    "wisdom": "Stand firm in your current position. This is not the time to force an outcome.",
    "energy": "Stillness"
  },
  {
    "answer": "Maybe",
    "emoji": "\ud83c\udf2b\ufe0f",
    "message": "\"The mist obscures what is not yet meant to be seen.\"",
    "wisdom": "Information is missing. Trust your intuition over hasty decisions.",
    "energy": "Mystery"
  },
  {
    "answer": "Yes",
    "emoji": "\ud83c\udf3f",
    "message": "\"From small seeds, great forests grow.\"",
    "wisdom": "Your efforts will bear fruit. Continue nurturing your current path steadily.",
    "energy": "Growth"
  },
  {
    "answer": "Maybe",
    "emoji": "\ud83c\udf00",
    "message": "\"The winds of fate are ever-shifting.\"",
    "wisdom": "Adaptability is your greatest strength right now. Stay open to new alternatives.",
    "energy": "Flux"
  },
  {
    "answer": "No",
    "emoji": "\u2744\ufe0f",
    "message": "\"Winter's chill demands preservation, not expansion.\"",
    "wisdom": "Conserve your energy. Focus on internal healing rather than external pursuits.",
    "energy": "Restoration"
  }
];

export function renderYesNoOracleWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'yes-no-oracle');
  
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
        <button class="oracle-submit-btn" id="oracleSubmitBtn">Seek Wisdom</button>
      </div>

      <div class="oracle-contemplate-box" id="oracleContemplateBox" style="display: none;">
        <div class="oracle-crystal">🔮</div>
        <h3>The Oracle Contemplates...</h3>
        <p>Ancient wisdom is being channeled for your question</p>
        <div class="oracle-dots">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div class="oracle-result-display tarot-result-expanded" style="display: none;" id="oracleOutcome"></div>

      ${renderWheelSeoContent(t.title, 'yes-no-oracle', locale)}
      ${renderWheelFaq(locale)}
      ${renderWheelSilo(locale, 'yes-no-oracle')}
    </div>
  `;

  // Attach functionality
  const submitBtn = container.querySelector('#oracleSubmitBtn');
  const resultDisplay = container.querySelector('#oracleOutcome');
  const inputContainer = container.querySelector('#oracleInputContainer');
  const contemplateBox = container.querySelector('#oracleContemplateBox');
  const textarea = container.querySelector('#oracleQuestion');
  
  let isDrawn = false;

  submitBtn.addEventListener('click', () => {
    if (isDrawn) return;
    isDrawn = true;
    
    // Grab text from user input or fallback
    const userQuestion = textarea.value.trim() || "Will my path be clear?";
    
    // Transition to Step 2 (Thinking)
    textarea.disabled = true;
    submitBtn.textContent = 'Consulting the Oracle...';
    submitBtn.classList.add('disabled-state');
    
    contemplateBox.style.display = 'flex';

    // Think for 2.5 seconds
    setTimeout(() => {
        const randIndex = Math.floor(Math.random() * ORACLE_DATA.length);
        const result = ORACLE_DATA[randIndex];
        
        audioManager.init();
        audioManager.playFanfare();

        // Step 3 (Reveal)
        inputContainer.style.display = 'none';
        contemplateBox.style.display = 'none';

        resultDisplay.innerHTML = `
          <div class="oracle-emoji-hero">${result.emoji}</div>
          <div class="tarot-drawn-pill ${result.answer.toLowerCase()}" style="margin-top:1rem;">${result.answer}</div>
          
          <h3 class="oracle-h3-title">Oracle's Message</h3>
          <p class="oracle-italic-message">${result.message}</p>
          
          <h3 class="oracle-h3-title" style="margin-top: 1rem;">Ancient Wisdom</h3>
          <p class="tarot-drawn-desc">${result.wisdom}</p>
          
          <div class="oracle-energy-tag">
            <span>Energy:</span> <div class="energy-pill">${result.energy}</div>
          </div>
          
          <div class="oracle-question-echo">Your question: "${userQuestion}"</div>

          <button class="oracle-outline-btn" id="oracleResetBtn">Ask Another Question</button>
        `;
        
        resultDisplay.classList.add('oracle-result-active');
        resultDisplay.style.display = 'flex';

        // Reset flow
        container.querySelector('#oracleResetBtn').addEventListener('click', () => {
          isDrawn = false;
          resultDisplay.classList.remove('oracle-result-active');
          resultDisplay.style.display = 'none';
          
          textarea.value = '';
          textarea.disabled = false;
          submitBtn.textContent = 'Seek Wisdom';
          submitBtn.classList.remove('disabled-state');
          inputContainer.style.display = 'flex';
        });
    }, 2500);

  });

  return { destroy: () => {} };
}
