// CountryWheel.js — Geographic wheel with continent filters and flags
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { countries, continents, getCountriesByFilter } from '../data/countries.js';
import { getLocalizedContinentName, getLocalizedCountryName, getWheelSharedText, getWheelUiText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { renderWheelFaq } from './WheelFaq.js';
import { renderWheelSeoContent } from './WheelSeoContent.js';

const GEO_COLORS = [
  '#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED',
  '#0891B2', '#CA8A04', '#BE185D', '#0D9488', '#4F46E5',
  '#65A30D', '#9333EA', '#0E7490', '#EA580C', '#C026D3',
  '#1D4ED8', '#047857', '#B45309', '#B91C1C', '#6D28D9'
];

export function renderCountryWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'country');
  const ui = getWheelUiText(locale);
  let enabledContinents = [...continents];

  container.innerHTML = `
    <div class="wheel-page country-theme">
      <div class="wheel-header">
        <h1 class="wheel-title">🌍 ${t.title}</h1>
        <p class="wheel-subtitle">${t.subtitle}</p>
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

      ${renderWheelSeoContent(t.title, 'country', locale)}
      ${renderWheelFaq(locale)}
      ${renderWheelSilo(locale, 'country')}
    </div>
  `;

  function getFilteredCountries() {
    return getCountriesByFilter(enabledContinents);
  }

  function getWheelEntries() {
    const filtered = getFilteredCountries();
    // Show all filtered countries on wheel, randomly shuffled
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled;
  }

  let currentWheelCountries = getWheelEntries();

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
      // Find the country
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

      // Set flag as center emoji
      engine.centerEmoji = country.flag;
      engine.draw();

      customPanel.addResult(getLocalizedCountryName(locale, country));
      document.getElementById('countrySpinBtn').disabled = false;
    },
    onSpinStart: () => {
      audioManager.init();
      document.getElementById('countryResult').classList.remove('show');
      document.getElementById('countrySpinBtn').disabled = true;
      engine.centerEmoji = '';
      // Resample countries for variety
      currentWheelCountries = getWheelEntries();
      engine.setEntries(currentWheelCountries.map(c => c.flag + ' ' + getLocalizedCountryName(locale, c)), GEO_COLORS);
    }
  });

  const customPanel = new CustomizationPanel(engine, { wheelName: 'country' });
  customPanel.render('countrySidebar');

  // Region toggles
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
