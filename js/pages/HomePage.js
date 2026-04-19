// HomePage.js — Yes/No Picker Wheel + Hub landing
import { WheelEngine } from '../engine/WheelEngine.js';
import { audioManager } from '../engine/AudioManager.js';
import { confetti } from '../engine/ConfettiEngine.js';
import { buildLocalizedPath, getHomeText, getLocalizedRouteContent, splitLocaleFromPath } from '../i18n.js?v=20260408-brand1';
import { renderWheelSeoContent } from '../wheels/WheelSeoContent.js';
import { EN_HOME_HERO_FALLBACK, EN_HOME_MARKDOWN_FILE, extractHomeHero, renderHomeMarkdownToHtml } from '../utils/homeMarkdown.js';

export function renderHomePage(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getHomeText(locale);
  const isEnglishHome = locale === 'en';
  const heroText = isEnglishHome
    ? EN_HOME_HERO_FALLBACK
    : {
      title: `${t.heroTitle} — ${t.heroSuffix}`,
      subtitle: t.heroSubtitle
    };
  const wheels = [
    { id: 'rainbow', icon: '🌈', color: '#FF6B6B' },
    { id: 'wheel-of-fate', icon: '⚔️', color: '#6B2D8B' },
    { id: 'word', icon: '📖', color: '#3B82F6' },
    { id: 'spin-the-wheel-truth-or-dare', icon: '🎉', color: '#FF006E' },
    { id: 'dti-theme', icon: '👗', color: '#FFB6C1' },
    { id: 'country', icon: '🌍', color: '#059669' },
    { id: 'zodiac', icon: '✨', color: '#FFD700' },
    { id: 'hair-color', icon: '💇', color: '#FF69B4' }
  ].map((wheel) => ({
    ...wheel,
    title: getLocalizedRouteContent(locale, wheel.id).title,
    desc: t.wheelDescriptions?.[wheel.id] || getLocalizedRouteContent(locale, wheel.id).subtitle
  }));

  container.innerHTML = `
    <div class="home-page">
      <!-- YES / NO PICKER WHEEL SECTION -->
      <section class="yesno-section">
        <div class="yesno-header">
          <h1 class="hero-title" id="homeHeroTitle">${heroText.title}</h1>
          <h2 class="hero-subtitle" id="homeHeroSubtitle">${heroText.subtitle}</h2>
        </div>

        <div class="yesno-layout">
          <div class="yesno-wheel-area">
            <div class="wheel-canvas-container yesno-canvas-wrap" id="yesnoCanvasContainer">
              <canvas id="yesnoCanvas"></canvas>
            </div>
            <div class="yesno-sound-toggle">
              <button class="sound-btn" id="yesnoSoundBtn" title="${t.mode}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              </button>
            </div>
          </div>

          <div class="yesno-controls">
            <div class="yesno-counters">
              <div class="yesno-counter yes-counter" id="yesCounter">
                <span class="counter-num" id="yesCount">0</span>
                <span class="counter-label">${t.yes}</span>
              </div>
              <div class="yesno-counter maybe-counter" id="maybeCounter" style="display:none">
                <span class="counter-num" id="maybeCount">0</span>
                <span class="counter-label">${t.maybe}</span>
              </div>
              <div class="yesno-counter no-counter" id="noCounter">
                <span class="counter-num" id="noCount">0</span>
                <span class="counter-label">${t.no}</span>
              </div>
            </div>
            <button class="reset-counts-btn" id="resetCountsBtn">↻ ${t.reset}</button>

            <div class="yesno-inputs-panel">
              <div class="inputs-header">
                <p>${t.inputs}</p>
              </div>
              <div class="yesno-mode-row">
                <label>${t.mode}</label>
                <div class="mode-toggle-group">
                  <button class="mode-btn active" id="modeYesNo">${t.yesNoMode}</button>
                  <button class="mode-btn" id="modeYesNoMaybe">${t.yesNoMaybeMode}</button>
                </div>
              </div>
              <div class="yesno-sets-row">
                <label>${t.inputSets}</label>
                <div class="sets-toggle-group">
                  ${[1,2,3,4,5].map(n => `<button class="set-btn ${n===1?'active':''}" data-sets="${n}">${n}</button>`).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Result display -->
        <div class="result-display yesno-result-display" id="yesnoResult"></div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="how-it-works howto-tutorial">
        <h2 class="section-title">${t.howTitle}</h2>
        <p class="howto-intro">${t.howIntro}</p>

        <div class="howto-steps-list">
          <div class="howto-step-item">
            <h2 class="howto-step-heading"><span class="howto-step-num">1</span> ${t.step1Title}</h2>
            <ul class="howto-step-options">
              <li>${t.step1Opt1}</li>
              <li>${t.step1Opt2}</li>
            </ul>
          </div>

          <hr class="howto-divider">

          <div class="howto-step-item">
            <h2 class="howto-step-heading"><span class="howto-step-num">2</span> ${t.step2Title}</h2>
            <ul class="howto-step-options">
              <li>${t.step2Option}</li>
            </ul>
          </div>

          <hr class="howto-divider">

          <div class="howto-step-item">
            <h2 class="howto-step-heading"><span class="howto-step-num">3</span> ${t.step3Title}</h2>
            <p class="howto-step-desc">${t.step3Desc}</p>
          </div>

          <hr class="howto-divider">

          <div class="howto-step-item">
            <h2 class="howto-step-heading"><span class="howto-step-num">4</span> ${t.step4Title}</h2>
            <p class="howto-step-desc">${t.step4Desc}</p>
          </div>

          <hr class="howto-divider">

          <div class="howto-step-item">
            <h2 class="howto-step-heading"><span class="howto-step-num">5</span> ${t.step5Title}</h2>
            <p class="howto-step-desc">${t.step5Desc}</p>
          </div>
        </div>
      </section>

      <!-- WHEEL HUB CARDS -->
      <section class="wheels-grid" id="about">
        <h2 class="section-title">${t.exploreTitle}</h2>
        <p class="section-subtitle">${t.exploreSubtitle}</p>
        <div class="cards-grid">
          ${wheels.map(w => `
            <a href="${buildLocalizedPath(locale, w.id)}" class="wheel-card" style="--card-accent:${w.color}">
              <div class="wheel-card-icon">${w.icon}</div>
              <h3 class="wheel-card-title">${w.title}</h3>
              <p class="wheel-card-desc">${w.desc}</p>
              <span class="wheel-card-cta">${t.spinNow} →</span>
            </a>
          `).join('')}
        </div>
      </section>

      ${isEnglishHome
    ? `<div class="home-rich-content page-content wheel-seo-content" id="homeRichContent">${renderWheelSeoContent(t.heroTitle, 'home', locale)}</div>`
    : renderWheelSeoContent(t.heroTitle, 'home', locale)}

      ${isEnglishHome ? '' : `
      <!-- FAQ -->
      <section class="faq">
        <h2 class="section-title">${t.faqTitle}</h2>
        <div class="faq-list">
          ${t.faqItems.map((item) => `<details class="faq-item"><summary>${item.q}</summary><p>${item.a}</p></details>`).join('')}
        </div>
      </section>`}
    </div>`;

  if (isEnglishHome) {
    hydrateEnglishHomeMarkdown(container);
  }

  // ---- Yes/No Wheel Logic ----
  let mode = 'yesno'; // 'yesno' or 'yesnomaybe'
  let counts = { yes: 0, no: 0, maybe: 0 };
  let inputSets = 1;
  const labels = {
    yes: t.yes,
    no: t.no,
    maybe: t.maybe
  };

  function getEntries() {
    const base = mode === 'yesno'
      ? [labels.yes, labels.no]
      : [labels.yes, labels.no, labels.maybe];
    const entries = [];
    for (let i = 0; i < inputSets; i++) base.forEach(b => entries.push(b));
    return entries;
  }

  function getColors() {
    return getEntries().map(e => {
      if (e === labels.yes) return '#2d6a30';
      if (e === labels.no) return '#d4a017';
      return '#808080';
    });
  }

  const engine = new WheelEngine('yesnoCanvas', {
    entries: getEntries(),
    colors: getColors(),
    showCenterButton: true,
    skipConfetti: true,
    fontSize: 18,
    onTick: () => audioManager.playTick(),
    onResult: (winner) => {
      audioManager.playFanfare();
      const entry = winner.entry;
      if (entry === labels.yes) {
        counts.yes++;
        confetti.celebrate(`${labels.yes}!`, '🎉', '#22c55e');
      } else if (entry === labels.no) {
        counts.no++;
        confetti.oops(`${labels.no}!`, '😢', '#eab308');
      } else {
        counts.maybe++;
        confetti.maybe(`${labels.maybe}!`, '🤔', '#9ca3af');
      }
      updateCounters();

      const resultEl = document.getElementById('yesnoResult');
      const emoji = entry === labels.yes ? '✅' : entry === labels.no ? '❌' : '🤔';
      const colorClass = entry === labels.yes ? 'yes-result' : entry === labels.no ? 'no-result' : 'maybe-result';
      resultEl.innerHTML = `<div class="result-winner ${colorClass}"><span class="result-emoji">${emoji}</span><span class="result-text">${entry}!</span></div>`;
      resultEl.classList.add('show');
    },
    onSpinStart: () => {
      audioManager.init();
      document.getElementById('yesnoResult').classList.remove('show');
    }
  });

  function updateCounters() {
    document.getElementById('yesCount').textContent = counts.yes;
    document.getElementById('noCount').textContent = counts.no;
    document.getElementById('maybeCount').textContent = counts.maybe;
  }

  function updateWheel() {
    engine.setEntries(getEntries(), getColors());
  }

  // Mode toggle
  document.getElementById('modeYesNo').addEventListener('click', () => {
    mode = 'yesno';
    document.getElementById('modeYesNo').classList.add('active');
    document.getElementById('modeYesNoMaybe').classList.remove('active');
    document.getElementById('maybeCounter').style.display = 'none';
    updateWheel();
  });

  document.getElementById('modeYesNoMaybe').addEventListener('click', () => {
    mode = 'yesnomaybe';
    document.getElementById('modeYesNoMaybe').classList.add('active');
    document.getElementById('modeYesNo').classList.remove('active');
    document.getElementById('maybeCounter').style.display = '';
    updateWheel();
  });

  // Input sets
  document.querySelectorAll('.set-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.set-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      inputSets = parseInt(btn.dataset.sets);
      updateWheel();
    });
  });

  // Reset counts
  document.getElementById('resetCountsBtn').addEventListener('click', () => {
    counts = { yes: 0, no: 0, maybe: 0 };
    updateCounters();
  });

  // Sound toggle
  let soundOn = true;
  document.getElementById('yesnoSoundBtn').addEventListener('click', () => {
    soundOn = !soundOn;
    audioManager.tickEnabled = soundOn;
    audioManager.fanfareEnabled = soundOn;
    document.getElementById('yesnoSoundBtn').classList.toggle('muted', !soundOn);
  });

  return engine;
}

async function hydrateEnglishHomeMarkdown(container) {
  const heroTitleEl = container.querySelector('#homeHeroTitle');
  const heroSubtitleEl = container.querySelector('#homeHeroSubtitle');
  const contentEl = container.querySelector('#homeRichContent');

  if (!heroTitleEl || !heroSubtitleEl || !contentEl) return;

  try {
    const response = await fetch(EN_HOME_MARKDOWN_FILE, { cache: 'no-cache' });
    if (!response.ok) return;

    const markdown = await response.text();
    const hero = extractHomeHero(markdown, EN_HOME_HERO_FALLBACK);

    heroTitleEl.textContent = hero.title || EN_HOME_HERO_FALLBACK.title;
    heroSubtitleEl.textContent = hero.subtitle || EN_HOME_HERO_FALLBACK.subtitle;

    contentEl.innerHTML = renderHomeMarkdownToHtml(markdown, {
      skipFirstHeading: true,
      skipFirstSubtitle: true
    });
  } catch (error) {
    console.warn('Failed to hydrate home markdown content.', error);
  }
}
