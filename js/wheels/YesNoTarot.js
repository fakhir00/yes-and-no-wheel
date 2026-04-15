// YesNoTarot.js — Yes No Tarot Grid Engine
import { audioManager } from '../engine/AudioManager.js';
import { getWheelSharedText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { renderWheelFaq } from './WheelFaq.js';
import { renderWheelSeoContent } from './WheelSeoContent.js';

const TAROT_DEFAULT_ENTRIES = [
  {
    "name": "The Fool",
    "answer": "Yes",
    "meaning": "New beginnings, spontaneity, and a leap of faith.",
    "guidance": "Trust the process and embrace the unknown with an open heart.",
    "element": "Air",
    "color": "\ud83d\udfe1"
  },
  {
    "name": "The Magician",
    "answer": "Yes",
    "meaning": "Manifestation, resourcefulness, and power.",
    "guidance": "You have everything you need to succeed. Take action now.",
    "element": "Air",
    "color": "\ud83d\udfe1"
  },
  {
    "name": "The High Priestess",
    "answer": "Maybe",
    "meaning": "Intuition, subconscious mind, and mystery.",
    "guidance": "Look within for the answers. Trust your inner voice.",
    "element": "Water",
    "color": "\ud83d\udd35"
  },
  {
    "name": "The Empress",
    "answer": "Yes",
    "meaning": "Abundance, nurturing, and fertility.",
    "guidance": "Focus on growth and bringing beauty into the world.",
    "element": "Earth",
    "color": "\ud83d\udfe2"
  },
  {
    "name": "The Emperor",
    "answer": "Yes",
    "meaning": "Structure, stability, and authority.",
    "guidance": "Take charge and establish logical boundaries.",
    "element": "Fire",
    "color": "\ud83d\udd34"
  },
  {
    "name": "The Hierophant",
    "answer": "Maybe",
    "meaning": "Tradition, conformity, and spiritual wisdom.",
    "guidance": "Seek counsel from established systems or mentors.",
    "element": "Earth",
    "color": "\ud83d\udfe2"
  },
  {
    "name": "The Lovers",
    "answer": "Yes",
    "meaning": "Harmony, relationships, and alignment.",
    "guidance": "Make choices that align with your truest self and values.",
    "element": "Air",
    "color": "\ud83d\udfe1"
  },
  {
    "name": "The Chariot",
    "answer": "Yes",
    "meaning": "Control, willpower, and victory.",
    "guidance": "Stay focused and overcome obstacles with determination.",
    "element": "Water",
    "color": "\ud83d\udd35"
  },
  {
    "name": "Strength",
    "answer": "Yes",
    "meaning": "Courage, persuasion, and compassion.",
    "guidance": "Tap into your inner strength. Use gentle force.",
    "element": "Fire",
    "color": "\ud83d\udd34"
  },
  {
    "name": "The Hermit",
    "answer": "No",
    "meaning": "Soul-searching, introspection, and inner guidance.",
    "guidance": "Step back from the situation to reflect in solitude.",
    "element": "Earth",
    "color": "\ud83d\udfe2"
  },
  {
    "name": "Wheel of Fortune",
    "answer": "Maybe",
    "meaning": "Karma, fate, and turning points.",
    "guidance": "Luck is turning. Be adaptable to incoming changes.",
    "element": "Fire",
    "color": "\ud83d\udd34"
  },
  {
    "name": "Justice",
    "answer": "Maybe",
    "meaning": "Fairness, truth, and law.",
    "guidance": "Seek absolute fairness. Actions have clear consequences.",
    "element": "Air",
    "color": "\ud83d\udfe1"
  },
  {
    "name": "The Hanged Man",
    "answer": "No",
    "meaning": "Suspension, surrender, and new perspectives.",
    "guidance": "Pause your efforts and look at things from a different angle.",
    "element": "Water",
    "color": "\ud83d\udd35"
  },
  {
    "name": "Death",
    "answer": "No",
    "meaning": "Endings, change, and transformation.",
    "guidance": "Let go of what is ending to make room for the new.",
    "element": "Water",
    "color": "\ud83d\udd35"
  },
  {
    "name": "Temperance",
    "answer": "Maybe",
    "meaning": "Balance, moderation, and patience.",
    "guidance": "Avoid extremes. Find a middle path forward.",
    "element": "Fire",
    "color": "\ud83d\udd34"
  },
  {
    "name": "The Devil",
    "answer": "No",
    "meaning": "Shadow self, attachment, and restriction.",
    "guidance": "Examine any toxic patterns holding you back.",
    "element": "Earth",
    "color": "\ud83d\udfe2"
  },
  {
    "name": "The Tower",
    "answer": "No",
    "meaning": "Sudden upheaval, broken pride, and revelation.",
    "guidance": "Expect unexpected shifts. Rebuild on stronger foundations.",
    "element": "Fire",
    "color": "\ud83d\udd34"
  },
  {
    "name": "The Star",
    "answer": "Yes",
    "meaning": "Hope, faith, and rejuvenation.",
    "guidance": "A period of healing and spiritual guidance is at hand.",
    "element": "Air",
    "color": "\ud83d\udfe1"
  },
  {
    "name": "The Moon",
    "answer": "No",
    "meaning": "Illusion, fear, and anxiety.",
    "guidance": "Things are not as they seem. Wait for clarity before acting.",
    "element": "Water",
    "color": "\ud83d\udd35"
  },
  {
    "name": "The Sun",
    "answer": "Yes",
    "meaning": "Success, joy, and positive energy surround your question.",
    "guidance": "The universe is aligned in your favor. Move forward with confidence.",
    "element": "Fire",
    "color": "\ud83d\udd34"
  },
  {
    "name": "Judgement",
    "answer": "Yes",
    "meaning": "Rebirth, inner calling, and absolution.",
    "guidance": "It is time for an important awakening or decisive action.",
    "element": "Fire",
    "color": "\ud83d\udd34"
  },
  {
    "name": "The World",
    "answer": "Yes",
    "meaning": "Completion, integration, and accomplishment.",
    "guidance": "You are reaching a successful conclusion to this cycle.",
    "element": "Earth",
    "color": "\ud83d\udfe2"
  }
];

export function renderYesNoTarot(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'yes-no-tarot');
  
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
        <div class="tarot-card-item" data-index="0"><span>Card 1</span></div>
        <div class="tarot-card-item" data-index="1"><span>Card 2</span></div>
        <div class="tarot-card-item" data-index="2"><span>Card 3</span></div>
        <div class="tarot-card-item" data-index="3"><span>Card 4</span></div>
        <div class="tarot-card-item" data-index="4"><span>Card 5</span></div>
        <div class="tarot-card-item" data-index="5"><span>Card 6</span></div>
      </div>

      <div class="tarot-action-area">
        <button class="tarot-universe-btn" id="tarotUniverseBtn">Let the Universe Choose</button>
      </div>

      <div class="tarot-result-display tarot-result-expanded" style="display: none;" id="tarotOutcome"></div>

      ${renderWheelSeoContent(t.title, 'yes-no-tarot', locale)}
      ${renderWheelFaq(locale)}
      ${renderWheelSilo(locale, 'yes-no-tarot')}
    </div>
  `;

  const cardsNodes = container.querySelectorAll('.tarot-card-item');
  const universeBtn = container.querySelector('#tarotUniverseBtn');
  const resultDisplay = container.querySelector('#tarotOutcome');
  const grid = container.querySelector('.tarot-card-grid');
  const actionArea = container.querySelector('.tarot-action-area');
  const instructionBox = container.querySelector('.tarot-instruction-box');
  const gridTitle = container.querySelector('.tarot-grid-title');
  
  let isDrawn = false;

  const revealCard = (chosenElement) => {
    if (isDrawn) return;
    isDrawn = true;
    
    const randIndex = Math.floor(Math.random() * TAROT_DEFAULT_ENTRIES.length);
    const result = TAROT_DEFAULT_ENTRIES[randIndex];
    
    audioManager.init();
    audioManager.playFanfare();

    grid.style.display = 'none';
    actionArea.style.display = 'none';
    gridTitle.style.display = 'none';

    resultDisplay.innerHTML = `
      <div class="tarot-drawn-card-graphic">
        <div class="card-title-drawn">${result.name}</div>
        <div class="card-element-drawn">
          <span class="element-circle">${result.color}</span> ${result.element}
        </div>
      </div>

      <div class="tarot-drawn-pill ${result.answer.toLowerCase()}">${result.answer}</div>
      <h3 class="tarot-drawn-title">${result.name}</h3>
      
      <h4 class="tarot-drawn-section">Card Meaning</h4>
      <p class="tarot-drawn-desc">${result.meaning}</p>
      
      <h4 class="tarot-drawn-section">Guidance</h4>
      <p class="tarot-drawn-desc">${result.guidance}</p>
      
      <div class="tarot-drawn-meta">
        <strong>Element:</strong> <span class="element-circle">${result.color}</span> ${result.element}
      </div>

      <button class="tarot-full-btn" id="tarotResetBtn">Draw Another Card</button>
    `;
    
    resultDisplay.style.display = 'flex';

    container.querySelector('#tarotResetBtn').addEventListener('click', () => {
      isDrawn = false;
      resultDisplay.style.display = 'none';
      grid.style.display = 'grid';
      actionArea.style.display = 'block';
      gridTitle.style.display = 'block';
    });
  };

  cardsNodes.forEach(card => card.addEventListener('click', () => revealCard(card)));
  universeBtn.addEventListener('click', () => revealCard(null));

  return { destroy: () => {} };
}
