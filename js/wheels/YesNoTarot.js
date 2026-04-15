// YesNoTarot.js — Yes No Tarot Grid Engine
import { audioManager } from '../engine/AudioManager.js';
import { getWheelSharedText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { renderWheelFaq } from './WheelFaq.js';
import { renderWheelSeoContent } from './WheelSeoContent.js';

const TAROT_DEFAULT_ENTRIES = [
  { name: 'The Fool', answer: 'Yes' },
  { name: 'The Magician', answer: 'Yes' },
  { name: 'The High Priestess', answer: 'Maybe' },
  { name: 'The Empress', answer: 'Yes' },
  { name: 'The Emperor', answer: 'Yes' },
  { name: 'The Hierophant', answer: 'Maybe' },
  { name: 'The Lovers', answer: 'Yes' },
  { name: 'The Chariot', answer: 'Yes' },
  { name: 'Strength', answer: 'Yes' },
  { name: 'The Hermit', answer: 'No' },
  { name: 'Wheel of Fortune', answer: 'Maybe' },
  { name: 'Justice', answer: 'Maybe' },
  { name: 'The Hanged Man', answer: 'No' },
  { name: 'Death', answer: 'No' },
  { name: 'Temperance', answer: 'Maybe' },
  { name: 'The Devil', answer: 'No' },
  { name: 'The Tower', answer: 'No' },
  { name: 'The Star', answer: 'Yes' },
  { name: 'The Moon', answer: 'No' },
  { name: 'The Sun', answer: 'Yes' },
  { name: 'Judgement', answer: 'Yes' },
  { name: 'The World', answer: 'Yes' }
];

export function renderYesNoTarot(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'tarot');
  
  container.innerHTML = `
    <div class="wheel-page tool-page tarot-mockup-page">
      <div class="wheel-header">
        <h1 class="wheel-title tarot-text">Yes or No Tarot Reading</h1>
        <p class="wheel-subtitle dark-subtitle">Draw mystical tarot cards for instant yes or no guidance.<br>Let ancient wisdom illuminate your path forward.</p>
      </div>

      <div class="tarot-instruction-box">
        <strong>Yes or No Tarot Reading</strong>
        <p>Focus on your question and select a card, or let the universe choose for you.</p>
      </div>

      <h2 class="tarot-grid-title">Choose Your Card</h2>

      <div class="tarot-card-grid">
        <div class="tarot-card-item" data-index="0">Card 1</div>
        <div class="tarot-card-item" data-index="1">Card 2</div>
        <div class="tarot-card-item" data-index="2">Card 3</div>
        <div class="tarot-card-item" data-index="3">Card 4</div>
        <div class="tarot-card-item" data-index="4">Card 5</div>
        <div class="tarot-card-item" data-index="5">Card 6</div>
      </div>

      <div class="tarot-result-display" style="display: none;" id="tarotOutcome"></div>

      <div class="tarot-action-area">
        <button class="tarot-universe-btn" id="tarotUniverseBtn">Let the Universe Choose</button>
      </div>

      ${renderWheelSeoContent(t.title, 'tarot', locale)}
      ${renderWheelFaq(locale)}
      ${renderWheelSilo(locale, 'tarot')}
    </div>
  `;

  // Attach functionality
  const cards = container.querySelectorAll('.tarot-card-item');
  const universeBtn = container.querySelector('#tarotUniverseBtn');
  const resultDisplay = container.querySelector('#tarotOutcome');
  const grid = container.querySelector('.tarot-card-grid');
  
  let isDrawn = false;

  const revealCard = (chosenElement) => {
    if (isDrawn) return;
    isDrawn = true;
    
    // Pick random
    const randIndex = Math.floor(Math.random() * TAROT_DEFAULT_ENTRIES.length);
    const result = TAROT_DEFAULT_ENTRIES[randIndex];
    
    audioManager.init();
    audioManager.playFanfare();

    cards.forEach(card => card.classList.add('faded'));
    if (chosenElement) {
      chosenElement.classList.remove('faded');
      chosenElement.classList.add('selected-card');
    }

    grid.style.display = 'none';

    resultDisplay.innerHTML = `
      <div class="tarot-drawn-card">
        <h3>${result.name}</h3>
        <div class="tarot-drawn-answer ${result.answer.toLowerCase()}">${result.answer}</div>
      </div>
      <button class="tarot-universe-btn" id="tarotResetBtn" style="margin-top: 1rem;">Draw Again</button>
    `;
    resultDisplay.style.display = 'flex';
    universeBtn.style.display = 'none';

    container.querySelector('#tarotResetBtn').addEventListener('click', () => {
      isDrawn = false;
      cards.forEach(card => {
        card.classList.remove('faded');
        card.classList.remove('selected-card');
      });
      resultDisplay.style.display = 'none';
      grid.style.display = 'grid';
      universeBtn.style.display = 'inline-block';
    });
  };

  cards.forEach(card => card.addEventListener('click', () => revealCard(card)));
  universeBtn.addEventListener('click', () => revealCard(null));

  // Note: We return a simulated engine object to prevent router errors
  return { destroy: () => {} };
}
