// CountryWheel.js — Geographic wheel with continent filters and flags
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { countries, continents, getCountriesByFilter } from '../data/countries.js';
import { getLocalizedContinentName, getLocalizedCountryName, getWheelSharedText, getWheelUiText, splitLocaleFromPath, buildLocalizedPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { createResultOnlyMode } from './resultOnlyMode.js';
import { getWheelPageContent } from '../wheelContent.js';

const GEO_COLORS = [
  '#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED',
  '#0891B2', '#CA8A04', '#BE185D', '#0D9488', '#4F46E5',
  '#65A30D', '#9333EA', '#0E7490', '#EA580C', '#C026D3',
  '#1D4ED8', '#047857', '#B45309', '#B91C1C', '#6D28D9'
];

const COUNTRY_FAQ = [
  { q: 'What is the country wheel?', a: 'The country wheel is a spinning tool that randomly selects from 199 countries. Each country displays its flag emoji and name on the wheel segment. You can filter by continent to narrow the pool before spinning.' },
  { q: 'How many countries are on the wheel?', a: 'The wheel includes 199 countries from all seven continents. The default pool includes every country in the database, but you can filter by continent to reduce the selection to specific regions.' },
  { q: 'Can I filter by continent?', a: 'Yes. The continent filter section above the wheel shows checkboxes for Africa, Asia, Europe, North America, South America, Oceania, and Antarctica. Toggle continents on or off to control which countries appear on the wheel.' },
  { q: 'How does the country randomizer work?', a: 'The wheel uses browser-based physics simulation with randomized starting velocity and friction. Each spin produces an unpredictable result because the initial conditions vary every time. The country that the wheel lands on is determined by the physics simulation, not by a predetermined algorithm.' },
  { q: 'Can I use this for travel planning?', a: 'The country wheel is useful for picking a random travel destination when you are open to anywhere. Spin the wheel and let it choose a country for your next trip. Filter by continent if you have a regional preference.' },
  { q: 'Is the country wheel free?', a: 'The country wheel is completely free with no signup, no ads, and no usage limits. You can spin as many times as you want.' },
];

function renderCountryFaq(locale) {
  const c = getWheelPageContent(locale, 'country');
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

function renderCountryContent(locale) {
  const c = getWheelPageContent(locale, 'country');
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

export function renderCountryWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'country');
  const ui = getWheelUiText(locale);
  const spinAgainText = ui.spinAgain || 'Spin Again';
  const c = getWheelPageContent(locale, 'country');
  let enabledContinents = [...continents];

  container.innerHTML = `
    <div class="wheel-page country-theme">
      <div class="wheel-header">
        <h1 class="wheel-title">${c.title || 'Country Wheel'}</h1>
        <p class="wheel-subtitle">${c.subtitle || ''}</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="region-filters">
            <p class="region-filters-title">🗺️ ${ui.regionFilters}</p>
            <div class="region-toggle-list" id="regionToggles">
              ${continents.map(c => {
                const count = countries.filter(co => co.continent === c).length;
                return `<label class="region-toggle">
                  <input type="checkbox" checked data-continent="${c}">
                  <span class="region-name">${getLocalizedContinentName(locale, c)}</span>
                  <span class="region-count">(${count})</span>
                </label>`;
              }).join('')}
            </div>
            <div class="region-summary" id="regionSummary">${ui.countriesSelected.replace('{count}', countries.length)}</div>
          </div>

          <div class="wheel-canvas-container" id="countryCanvasContainer">
            <canvas id="countryCanvas"></canvas>
          </div>
          <button class="spin-btn country-spin-btn" id="countrySpinBtn">
            <span class="spin-text">🌍 ${ui.spinGlobe}</span>
            <div class="spin-ripple"></div>
          </button>
          <div class="result-display" id="countryResult"></div>
        </div>

        <div class="wheel-sidebar" id="countrySidebar"></div>
      </div>

      <div class="wheel-instructions howto-tutorial-style">
        <h2>${c.howToUse?.title || 'How to Use the Country Wheel'}</h2>
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

      ${renderCountryContent(locale)}
      ${renderCountryFaq(locale)}
      ${renderWheelSilo(locale, 'country')}
    </div>
  `;

  function getFilteredCountries() {
    return getCountriesByFilter(enabledContinents);
  }

  function getWheelEntries() {
    const filtered = getFilteredCountries();
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled;
  }

  let currentWheelCountries = getWheelEntries();
  let resultMode;

  const engine = new WheelEngine('countryCanvas', {
    entries: currentWheelCountries.map(c => c.flag + ' ' + getLocalizedCountryName(locale, c)),
    colors: GEO_COLORS,
    fontSize: 11,
    spinPower: 4.2,
    friction: 0.972,
    stopThreshold: 0.003,
    maxDuration: 4,
    onTick: () => audioManager.playTick(),
    onResult: (winner) => {
      audioManager.playFanfare();
      const countryName = winner.entry.replace(/^[^\s]+\s/, '');
      const country = currentWheelCountries.find(c => getLocalizedCountryName(locale, c) === countryName)
        || countries.find(c => getLocalizedCountryName(locale, c) === countryName)
        || { flag: '🌍', name: countryName };

      const resultEl = document.getElementById('countryResult');
      resultEl.innerHTML = `<div class="result-winner country-result">
        <span class="country-flag-big">${country.flag}</span>
        <span class="result-text">${getLocalizedCountryName(locale, country)}</span>
        <span class="country-continent">${country.continent ? getLocalizedContinentName(locale, country.continent) : ''}</span>
      </div>`;
      resultEl.classList.add('show');
      resultMode.showResultOnly();

      engine.centerEmoji = country.flag;
      engine.draw();

      customPanel.addResult(getLocalizedCountryName(locale, country));
      document.getElementById('countrySpinBtn').disabled = false;
    },
    onSpinStart: () => {
      audioManager.init();
      resultMode.hideResultOnly();
      document.getElementById('countryResult').classList.remove('show');
      document.getElementById('countrySpinBtn').disabled = true;
      engine.centerEmoji = '';
      currentWheelCountries = getWheelEntries();
      engine.setEntries(currentWheelCountries.map(c => c.flag + ' ' + getLocalizedCountryName(locale, c)), GEO_COLORS);
    }
  });

  const customPanel = new CustomizationPanel(engine, { wheelName: 'country' });
  customPanel.render('countrySidebar');
  resultMode = createResultOnlyMode({
    root: container,
    resultSelector: '#countryResult',
    spinAgainText,
    onSpinAgain: () => {}
  });

  document.getElementById('regionToggles').addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const continent = e.target.dataset.continent;
      if (e.target.checked) {
        enabledContinents.push(continent);
      } else {
        enabledContinents = enabledContinents.filter(c => c !== continent);
      }
      currentWheelCountries = getWheelEntries();
      engine.setEntries(currentWheelCountries.map(c => c.flag + ' ' + getLocalizedCountryName(locale, c)), GEO_COLORS);
      document.getElementById('regionSummary').textContent = ui.countriesSelected.replace('{count}', getFilteredCountries().length);
    }
  });

  document.getElementById('countrySpinBtn').addEventListener('click', () => {
    if (getFilteredCountries().length < 2) {
      alert(ui.enableAtLeastTwoRegions);
      return;
    }
    engine.spin();
  });

  return engine;
}
