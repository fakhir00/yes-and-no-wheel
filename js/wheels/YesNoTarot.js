// YesNoTarot.js — Yes No Tarot tool using CardEngine
import { CardEngine } from '../engine/CardEngine.js';
import { getWheelSharedText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { renderWheelSeoContent } from './WheelSeoContent.js';

const TAROT_ENTRIES = [
  { title: 'The Fool', answer: 'Yes', meaning: 'New beginnings, spontaneity, and a leap of faith into the unknown.', icon: '🎒' },
  { title: 'The Magician', answer: 'Yes', meaning: 'Tap into your full potential and manifest your desires into reality.', icon: '✨' },
  { title: 'The High Priestess', answer: 'Maybe', meaning: 'Trust your intuition. The complete answer is not yet revealed to you.', icon: '🌙' },
  { title: 'The Empress', answer: 'Yes', 'meaning': 'Abundance, nurturing growth, and expressing your creative energy.', icon: '👑' },
  { title: 'The Emperor', answer: 'Yes', meaning: 'Structure, stability, and establishing authority and logical boundaries.', icon: '⚔️' },
  { title: 'The Hierophant', answer: 'Maybe', meaning: 'Seek tradition, established systems, and wise counsel before deciding.', icon: '🗝️' },
  { title: 'The Lovers', answer: 'Yes', meaning: 'Harmony, alignment of values, and choices made out of true love.', icon: '❤️' },
  { title: 'The Chariot', answer: 'Yes', meaning: 'Overcome obstacles through willful determination, focus, and drive.', icon: '🪖' },
  { title: 'Strength', answer: 'Yes', meaning: 'Inner courage, compassion, and gentle persuasion will see you through.', icon: '🦁' },
  { title: 'The Hermit', answer: 'No', meaning: 'Withdraw and reflect. It is time for soul-searching, not immediate action.', icon: '🏮' },
  { title: 'Wheel of Fortune', answer: 'Maybe', meaning: 'Luck is turning. Karma and fate are at play; stay adaptable to change.', icon: '🎡' },
  { title: 'Justice', answer: 'Maybe', meaning: 'Actions have consequences. Seek absolute fairness and objective truth.', icon: '⚖️' },
  { title: 'The Hanged Man', answer: 'No', meaning: 'Pause indefinitely. You must surrender to the present and look from a new angle.', icon: '🪢' },
  { title: 'Death', answer: 'No', meaning: 'A necessary ending to make way for the new. Do not hold on to the past.', icon: '💀' },
  { title: 'Temperance', answer: 'Maybe', meaning: 'Seek balance, patience, and moderation. Avoid extremes right now.', icon: '🌊' },
  { title: 'The Devil', answer: 'No', meaning: 'Beware of unhealthy attachments, restrictions, or toxic repeating patterns.', icon: '⛓️' },
  { title: 'The Tower', answer: 'No', meaning: 'Sudden upheaval, broken pride, and unexpected but necessary change.', icon: '⚡' },
  { title: 'The Star', answer: 'Yes', meaning: 'Hope, inspiration, spiritual healing, and renewed faith in the future.', icon: '⭐' },
  { title: 'The Moon', answer: 'No', meaning: 'Illusions and anxiety cloud your judgment. You do not have all the facts yet.', icon: '🐺' },
  { title: 'The Sun', answer: 'Yes', meaning: 'Absolute joy, success, vitality, and radiant positive energy.', icon: '☀️' },
  { title: 'Judgement', answer: 'Yes', meaning: 'Rebirth, inner calling, and absolution. It is time for an important awakening.', icon: '📯' },
  { title: 'The World', answer: 'Yes', meaning: 'Completion, wholeness, achievement, and concluding a major life cycle.', icon: '🌍' }
];

export function renderYesNoTarot(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'yes-no-tarot');
  
  container.innerHTML = \`
    <div class="wheel-page tool-page tarot-page">
      <div class="wheel-header">
        <h1 class="wheel-title tarot-text">🃏 \${t.title}</h1>
        <p class="wheel-subtitle">\${t.subtitle}</p>
      </div>

      <!-- Card Engine Container -->
      <div id="tarotCardContainer"></div>

      <div class="wheel-instructions howto-tutorial-style">
        <h2>\${t.howToUse}</h2>
        <p class="howto-intro">\${t.howToIntro}</p>
        <div class="howto-steps-list">
          <div class="howto-step-item">
            <h2 class="howto-step-heading"><span class="howto-step-num">1</span> \${t.step1Title}</h2>
            <p class="howto-step-desc">\${t.step1Desc}</p>
          </div>
          <hr class="howto-divider">
          <div class="howto-step-item">
            <h2 class="howto-step-heading"><span class="howto-step-num">2</span> \${t.step2Title}</h2>
            <p class="howto-step-desc">\${t.step2Desc}</p>
          </div>
          <hr class="howto-divider">
          <div class="howto-step-item">
            <h2 class="howto-step-heading"><span class="howto-step-num">3</span> \${t.step3Title}</h2>
            <p class="howto-step-desc">\${t.step3Desc}</p>
          </div>
        </div>
      </div>

      \${renderWheelSeoContent(t.title, 'yes-no-tarot', locale)}
      \${renderWheelSilo(locale, 'yes-no-tarot')}
    </div>
  \`;

  // Initialize Card Engine
  const engine = new CardEngine('tarotCardContainer', {
    entries: TAROT_ENTRIES,
    theme: 'tarot-theme'
  });

  return engine;
}
