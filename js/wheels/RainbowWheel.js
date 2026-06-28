// RainbowWheel.js — ROYGBIV color spectrum wheel with unique SEO content
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { getLocalizedWheelSeedEntries, getWheelSharedText, getWheelUiText, splitLocaleFromPath, buildLocalizedPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { createResultOnlyMode } from './resultOnlyMode.js';
import { getWheelPageContent } from '../wheelContent.js';

const RAINBOW_COLORS = [
  '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3',
];

function generateRainbowColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i / count) * 360;
    colors.push(`hsl(${hue}, 85%, 55%)`);
  }
  return colors;
}

const RAINBOW_FAQ = [
  { q: 'What is a rainbow wheel?', a: 'A rainbow wheel is a colorful spinning tool that assigns a rainbow gradient to each segment. Instead of plain text labels, every slice gets a distinct hue from the visible light spectrum, making the spin more visually engaging while keeping the same 50/50 or multi-outcome probability as a standard spinner.' },
  { q: 'How is a rainbow wheel different from a regular yes or no wheel?', a: 'A regular yes or no wheel uses two segments with solid colors. A rainbow wheel distributes multiple colors evenly around the wheel, so even when the outcome is the same, the visual presentation is more dynamic. The randomization logic is identical — the rainbow version simply adds color variety.' },
  { q: 'Is the rainbow wheel truly random?', a: 'Yes. The wheel uses browser-based physics simulation with randomized starting velocity, friction, and angle. Each spin produces an unpredictable result because the initial conditions vary every time. No server or external service determines the outcome.' },
  { q: 'Can kids use the rainbow wheel?', a: 'The rainbow wheel is well-suited for children. The bright colors make it visually appealing for classroom activities, and the simple spin mechanic requires no reading or setup. Teachers use it for picking students, choosing activities, or teaching color recognition.' },
  { q: 'Can I add my own entries to the rainbow wheel?', a: 'Yes. The customization sidebar lets you add, remove, or rename any entry on the wheel. You can type custom labels, change segment colors, and adjust the number of slices. Changes take effect immediately on the next spin.' },
  { q: 'Is the rainbow wheel free to use?', a: 'The rainbow wheel is completely free with no signup, no ads covering the tool, and no usage limits. You can spin as many times as you want without creating an account.' },
  { q: 'Does the rainbow wheel work on mobile?', a: 'The wheel adapts to any screen size. On phones and tablets, the canvas scales to fit the viewport, and the spin button and result display adjust for touch interaction. No app download is needed — it runs in your mobile browser.' },
];

function renderRainbowFaq(locale) {
  const c = getWheelPageContent(locale, 'rainbow');
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

const RAINBOW_QUESTIONS = [
  { q: 'Should I try the new recipe tonight?', category: 'Cooking' },
  { q: 'Should we order pizza instead of cooking?', category: 'Food' },
  { q: 'Is today a good day to go for a walk?', category: 'Activities' },
  { q: 'Should I start that project I have been putting off?', category: 'Productivity' },
  { q: 'Will I enjoy the movie everyone is talking about?', category: 'Entertainment' },
  { q: 'Should I say yes to the invitation?', category: 'Social' },
  { q: 'Is it time to take a break?', category: 'Wellness' },
  { q: 'Should I try the spicy option on the menu?', category: 'Food' },
  { q: 'Will I finish this book before the end of the month?', category: 'Reading' },
  { q: 'Should I rearrange my desk today?', category: 'Home' },
  { q: 'Is today a good day for a road trip?', category: 'Travel' },
  { q: 'Should I learn something new this weekend?', category: 'Learning' },
  { q: 'Will I stick to my morning routine tomorrow?', category: 'Habits' },
  { q: 'Should I call a friend I have not spoken to in a while?', category: 'Social' },
  { q: 'Is it time to redecorate my room?', category: 'Home' },
  { q: 'Should I try a new hairstyle?', category: 'Appearance' },
  { q: 'Will I enjoy the new café down the street?', category: 'Food' },
  { q: 'Should I sign up for that class?', category: 'Learning' },
  { q: 'Is today the day I finally organize my closet?', category: 'Home' },
  { q: 'Should I surprise someone with a gift?', category: 'Social' },
  { q: 'Will I have enough time to finish everything today?', category: 'Productivity' },
  { q: 'Should I try the dessert even though I am full?', category: 'Food' },
  { q: 'Is it a good idea to volunteer this weekend?', category: 'Social' },
  { q: 'Should I take the scenic route home?', category: 'Travel' },
  { q: 'Will I enjoy the podcast everyone recommends?', category: 'Entertainment' },
  { q: 'Should I start a journal today?', category: 'Wellness' },
  { q: 'Is it time to update my playlist?', category: 'Entertainment' },
  { q: 'Should I try meal prepping this week?', category: 'Food' },
  { q: 'Will I feel better after a workout?', category: 'Wellness' },
  { q: 'Should I adopt a pet?', category: 'Life' },
];

function renderRainbowQuestions() {
  const categories = {};
  RAINBOW_QUESTIONS.forEach(({ q, category }) => {
    if (!categories[category]) categories[category] = [];
    categories[category].push(q);
  });

  const sections = Object.entries(categories).map(([cat, questions]) => `
    <h3>${cat} Questions</h3>
    <ul>
      ${questions.map((q) => `<li>${q}</li>`).join('')}
    </ul>
  `).join('');

  return `
    <section class="wheel-seo-content page-content">
      <section class="content-section">
        <h2>Fun Yes or No Questions for the Rainbow Wheel</h2>
        <p>Not sure what to ask? Here are over 25 yes or no questions you can try with the rainbow wheel. Pick any question, spin the wheel, and let the colors decide your answer.</p>
        ${sections}
        <p>Want even more questions? Visit the <a href="${buildLocalizedPath('en', '')}">yes or no wheel homepage</a> for a larger collection of decision-making prompts.</p>
      </section>
    </section>
  `;
}

function renderRainbowContent(locale) {
  const c = getWheelPageContent(locale, 'rainbow');
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

export function renderRainbowWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'rainbow');
  const ui = getWheelUiText(locale);
  const spinAgainText = ui.spinAgain || 'Spin Again';
  const c = getWheelPageContent(locale, 'rainbow');
  container.innerHTML = `
    <div class="wheel-page rainbow-theme">
      <div class="wheel-header">
        <h1 class="wheel-title rainbow-text">${c.title || 'Rainbow Wheel'}</h1>
        <p class="wheel-subtitle">${c.subtitle || ''}</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="wheel-canvas-container" id="rainbowCanvasContainer">
            <canvas id="rainbowCanvas"></canvas>
          </div>
          <button class="spin-btn rainbow-spin-btn" id="rainbowSpinBtn">
            <span class="spin-text">🌈 ${t.spinNow}</span>
            <div class="spin-ripple"></div>
          </button>
          <button class="auto-gradient-btn" id="rainbowAutoGradient">
            ✨ ${ui.autoGradient}
          </button>
          <div class="result-display" id="rainbowResult"></div>
        </div>

        <div class="wheel-sidebar" id="rainbowSidebar"></div>
      </div>

      <div class="wheel-instructions howto-tutorial-style">
        <h2>${c.howToUse?.title || 'How to Use the Rainbow Wheel'}</h2>
        <p class="howto-intro">${c.howToUse?.intro || ''}</p>
        <div class="howto-steps-list">
          ${(c.howToUse?.steps || []).map((step, i) => `
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">${i + 1}</span> ${step.title}</h3>
            <p class="howto-step-desc">${step.desc}</p>
          </div>
          ${i < (c.howToUse?.steps?.length || 0) - 1 ? '<hr class="howto-divider">' : ''}
          `).join('')}
        </div>
      </div>

      ${renderRainbowContent(locale)}
      ${renderRainbowQuestions()}
      ${renderRainbowFaq(locale)}
      ${renderWheelSilo(locale, 'rainbow')}
    </div>
  `;

  const defaultEntries = getLocalizedWheelSeedEntries(locale, 'rainbow');
  const defaultColors = generateRainbowColors(defaultEntries.length);
  let resultMode;

  const engine = new WheelEngine('rainbowCanvas', {
    entries: defaultEntries,
    colors: defaultColors,
    onTick: () => audioManager.playTick(),
    onResult: (winner) => {
      audioManager.playFanfare();
      const resultEl = document.getElementById('rainbowResult');
      resultEl.innerHTML = `<div class="result-winner rainbow-result"><span class="result-emoji">🌈</span><span class="result-text">${winner.entry}</span></div>`;
      resultEl.classList.add('show');
      resultMode.showResultOnly();
      customPanel.addResult(winner.entry);
      document.getElementById('rainbowSpinBtn').disabled = false;
    },
    onSpinStart: () => {
      audioManager.init();
      resultMode.hideResultOnly();
      document.getElementById('rainbowResult').classList.remove('show');
      document.getElementById('rainbowSpinBtn').disabled = true;
    }
  });

  const customPanel = new CustomizationPanel(engine, {
    wheelName: 'rainbow',
    onEntriesChange: (entries) => {
      engine.setEntries(entries, generateRainbowColors(entries.length));
    }
  });
  customPanel.render('rainbowSidebar');
  customPanel.setEntries(defaultEntries);
  resultMode = createResultOnlyMode({
    root: container,
    resultSelector: '#rainbowResult',
    spinAgainText,
    onSpinAgain: () => { }
  });

  document.getElementById('rainbowSpinBtn').addEventListener('click', () => engine.spin());

  document.getElementById('rainbowAutoGradient').addEventListener('click', () => {
    const colors = generateRainbowColors(engine.entries.length);
    engine.colors = colors;
    engine.draw();
  });

  return engine;
}
