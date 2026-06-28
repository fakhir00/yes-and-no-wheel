// YesNoOracleWheel.js — 3-Step Text Input Layout Engine
import { audioManager } from '../engine/AudioManager.js';
import { getWheelSharedText, splitLocaleFromPath, buildLocalizedPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { createResultOnlyMode } from './resultOnlyMode.js';
import { getWheelPageContent } from '../wheelContent.js';

const ORACLE_DATA = [
  { answer: 'Yes', emoji: '🔥', message: '"The phoenix rises, and so shall you."', wisdom: 'Transformation brings renewal. Embrace the change that leads to growth.', energy: 'Rebirth' },
  { answer: 'Yes', emoji: '☀️', message: '"Light conquers all shadows."', wisdom: 'Clarity and joy are on the horizon. Move confidently in your illuminated path.', energy: 'Clarity' },
  { answer: 'No', emoji: '🌊', message: '"Even the strongest tides must recede."', wisdom: 'Patience is required. Step back and let the situation cool down before acting.', energy: 'Patience' },
  { answer: 'No', emoji: '⛰️', message: '"The mountain does not move for the wind."', wisdom: 'Stand firm in your current position. This is not the time to force an outcome.', energy: 'Stillness' },
  { answer: 'Maybe', emoji: '🌫️', message: '"The mist obscures what is not yet meant to be seen."', wisdom: 'Information is missing. Trust your intuition over hasty decisions.', energy: 'Mystery' },
  { answer: 'Yes', emoji: '🌿', message: '"From small seeds, great forests grow."', wisdom: 'Your efforts will bear fruit. Continue nurturing your current path steadily.', energy: 'Growth' },
  { answer: 'Maybe', emoji: '🌀', message: '"The winds of fate are ever-shifting."', wisdom: 'Adaptability is your greatest strength right now. Stay open to new alternatives.', energy: 'Flux' },
  { answer: 'No', emoji: '❄️', message: '"Winter chill demands preservation, not expansion."', wisdom: 'Conserve your energy. Focus on internal healing rather than external pursuits.', energy: 'Restoration' },
];

const ORACLE_FAQ = [
  { q: 'What is the Yes No Oracle?', a: 'The Yes No Oracle is a text-based decision tool that provides yes, no, or maybe answers to your questions. Type a question, click Seek Wisdom, and receive a random answer with an accompanying message, wisdom text, and energy tag.' },
  { q: 'How is the oracle different from a yes or no wheel?', a: 'The oracle uses a text input and contemplation animation instead of a spinning wheel. It produces three possible answers (yes, no, maybe) instead of two, and each answer includes a philosophical message and wisdom text that adds context to the result.' },
  { q: 'Is the oracle random?', a: 'Yes. The oracle selects a random result from eight possible outcomes using browser-based randomization. No outcome is predetermined or influenced by your question text.' },
  { q: 'Can I ask the oracle any type of question?', a: 'The oracle works best with yes or no questions — decisions where you want a binary or near-binary answer. Open-ended questions will still produce a result, but the yes/no/maybe framing may not fit.' },
  { q: 'What does the energy tag mean?', a: 'Each oracle result includes an energy tag like Rebirth, Patience, or Mystery. These are thematic labels that describe the general tone of the answer. They do not have technical or mystical significance — they are descriptive labels for the result.' },
  { q: 'Is the oracle free to use?', a: 'The Yes No Oracle is completely free with no signup, no ads, and no usage limits. You can ask as many questions as you want.' },
];

function renderOracleFaq(locale) {
  const c = getWheelPageContent(locale, 'yes-no-oracle');
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

function renderOracleContent(locale) {
  const c = getWheelPageContent(locale, 'yes-no-oracle');
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

export function renderYesNoOracleWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'yes-no-oracle');
  const c = getWheelPageContent(locale, 'yes-no-oracle');

  container.innerHTML = `
    <div class="wheel-page tool-page oracle-mockup-page">
      <div class="wheel-header">
        <h1 class="wheel-title oracle-text">${c.title || 'Yes No Oracle'}</h1>
        <p class="wheel-subtitle dark-subtitle">${c.subtitle || ''}</p>
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

      ${renderOracleContent(locale)}
      ${renderOracleFaq(locale)}
      ${renderWheelSilo(locale, 'oracle')}
    </div>
  `;

  const submitBtn = container.querySelector('#oracleSubmitBtn');
  const resultDisplay = container.querySelector('#oracleOutcome');
  const inputContainer = container.querySelector('#oracleInputContainer');
  const contemplateBox = container.querySelector('#oracleContemplateBox');
  const textarea = container.querySelector('#oracleQuestion');

  let isDrawn = false;

  submitBtn.addEventListener('click', () => {
    if (isDrawn) return;
    isDrawn = true;

    const userQuestion = textarea.value.trim() || "Will my path be clear?";

    inputContainer.style.display = 'none';
    contemplateBox.style.display = 'flex';

    setTimeout(() => {
      const randIndex = Math.floor(Math.random() * ORACLE_DATA.length);
      const result = ORACLE_DATA[randIndex];

      audioManager.init();
      audioManager.playFanfare();

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
