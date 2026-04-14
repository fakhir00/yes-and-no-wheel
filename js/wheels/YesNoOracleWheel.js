// YesNoOracleWheel.js — Yes No Oracle tool updated to use CardEngine
import { CardEngine } from '../engine/CardEngine.js';
import { getWheelSharedText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { renderWheelFaq } from './WheelFaq.js';
import { renderWheelSeoContent } from './WheelSeoContent.js';

const ORACLE_ENTRIES = [
  { title: 'The Sun', answer: 'Yes', meaning: 'A bright, positive outcome is highly anticipated.', icon: '☀️' },
  { title: 'The Moon', answer: 'No', meaning: 'Not right now; hidden factors exist that you do not yet see.', icon: '🌙' },
  { title: 'The Stars', answer: 'Maybe', meaning: 'The future is uncertain, but follow your hope and true north.', icon: '✨' },
  { title: 'The Anchor', answer: 'No', meaning: 'Stay grounded where you are. Do not make sudden moves.', icon: '⚓' },
  { title: 'The Key', answer: 'Yes', meaning: 'An opportunity is unlocking for you. Proceed with confidence.', icon: '🗝️' },
  { title: 'The Crossroad', answer: 'Maybe', meaning: 'The choice is truly yours to make. There is no wrong path.', icon: '🚏' },
  { title: 'The Mirror', answer: 'No', meaning: 'Reflect on your true motives before acting on this query.', icon: '🪞' },
  { title: 'The Dove', answer: 'Yes', meaning: 'Proceed with peace, gentleness, and an open heart.', icon: '🕊️' }
];

export function renderYesNoOracleWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'yes-no-oracle');
  
  container.innerHTML = `
    <div class="wheel-page tool-page oracle-page">
      <div class="wheel-header">
        <h1 class="wheel-title oracle-text">🔮 ${t.title}</h1>
        <p class="wheel-subtitle">${t.subtitle}</p>
      </div>

      <!-- Card Engine Container -->
      <div id="oracleCardContainer"></div>

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

      ${renderWheelSeoContent(t.title, 'yes-no-oracle', locale)}
      ${renderWheelFaq(locale)}
      ${renderWheelSilo(locale, 'yes-no-oracle')}
    </div>
  `;

  // Initialize Card Engine
  const engine = new CardEngine('oracleCardContainer', {
    entries: ORACLE_ENTRIES,
    theme: 'oracle-theme'
  });

  return engine;
}
