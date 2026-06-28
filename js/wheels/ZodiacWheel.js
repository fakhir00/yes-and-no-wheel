import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { zodiacSigns } from '../data/zodiacData.js';
import { getLocalizedZodiacSigns, getWheelSharedText, getWheelUiText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { createResultOnlyMode } from './resultOnlyMode.js';
import { getWheelPageContent } from '../wheelContent.js';

function renderZodiacContent(locale) {
  const c = getWheelPageContent(locale, 'zodiac');
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

function renderZodiacFaq(locale) {
  const c = getWheelPageContent(locale, 'zodiac');
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

export function renderZodiacWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'zodiac');
  const ui = getWheelUiText(locale);
  const spinAgainText = ui.spinAgain || 'Spin Again';
  const c = getWheelPageContent(locale, 'zodiac');
  const localizedSigns = getLocalizedZodiacSigns(locale, zodiacSigns);
  const signEntries = localizedSigns.map(s => s.symbol + ' ' + s.name);
  const signColors = localizedSigns.map(s => s.color);
  let resultMode;

  container.innerHTML = `
    <div class="wheel-page zodiac-theme">
      <div class="wheel-header">
        <h1 class="wheel-title zodiac-title">${c.title || 'Zodiac Wheel'}</h1>
        <p class="wheel-subtitle">${c.subtitle || ''}</p>
      </div>
      <div class="wheel-layout" id="zodiacSingleLayout">
        <div class="wheel-main">
          <div class="wheel-canvas-container celestial-bg" id="zodiacCanvasContainer"><canvas id="zodiacCanvas"></canvas></div>
          <button class="spin-btn zodiac-spin-btn" id="zodiacSpinBtn"><span class="spin-text">✨ ${ui.consultStars}</span></button>
          <div class="result-display" id="zodiacResult"></div>
          <div class="zodiac-info-panel" id="zodiacInfoPanel"></div>
        </div>
        <div class="wheel-sidebar" id="zodiacSidebar"></div>
      </div>
      <div class="wheel-instructions howto-tutorial-style">
        <h2>${c.howToUse?.title || 'How to Use the Zodiac Wheel'}</h2>
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

      ${renderZodiacContent(locale)}
      ${renderZodiacFaq(locale)}

      ${renderWheelSilo(locale, 'zodiac')}
    </div>`;

  function showInfo(name) {
    const s = localizedSigns.find(z => z.name === name);
    if (!s) return;
    document.getElementById('zodiacInfoPanel').innerHTML = `<div class="zodiac-info-card"><div class="zodiac-info-header"><span class="zodiac-big-symbol">${s.symbol}</span><div><h3>${s.name}</h3><span class="zodiac-dates">${s.dates}</span></div></div><div class="zodiac-info-body"><div class="zodiac-info-row"><strong>Element:</strong> ${s.element}</div><div class="zodiac-info-row"><strong>Traits:</strong> ${s.traits.join(', ')}</div><div class="zodiac-info-row"><strong>Compatible:</strong> ${s.compatible.join(', ')}</div></div></div>`;
    document.getElementById('zodiacInfoPanel').classList.add('show');
  }

  const engine = new WheelEngine('zodiacCanvas', {
    entries: signEntries, colors: signColors,
    onTick: () => audioManager.playTick(),
    onResult: (w) => {
      audioManager.playFanfare();
      const name = w.entry.split(' ').slice(1).join(' ');
      const s = localizedSigns.find(z => z.name === name);
      document.getElementById('zodiacResult').innerHTML = `<div class="result-winner zodiac-result"><span class="zodiac-result-symbol">${s?.symbol||'✨'}</span><span class="result-text">${name}</span><span class="zodiac-element">${s?.element||''} Sign</span></div>`;
      document.getElementById('zodiacResult').classList.add('show');
      resultMode.showResultOnly();
      showInfo(name); cp.addResult(name);
      document.getElementById('zodiacSpinBtn').disabled = false;
    },
    onSpinStart: () => { audioManager.init(); resultMode.hideResultOnly(); document.getElementById('zodiacResult').classList.remove('show'); document.getElementById('zodiacInfoPanel').classList.remove('show'); document.getElementById('zodiacSpinBtn').disabled = true; }
  });

  const cp = new CustomizationPanel(engine, { wheelName: 'zodiac' });
  cp.render('zodiacSidebar');
  resultMode = createResultOnlyMode({
    root: container,
    resultSelector: '#zodiacResult',
    spinAgainText,
    onSpinAgain: () => {}
  });
  document.getElementById('zodiacSpinBtn').onclick = () => engine.spin();

  return engine;
}
