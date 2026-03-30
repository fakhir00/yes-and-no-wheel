// CountryWheel.js — Geographic wheel with continent filters and flags
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { countries, continents, getCountriesByFilter } from '../data/countries.js';

const GEO_COLORS = [
  '#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED',
  '#0891B2', '#CA8A04', '#BE185D', '#0D9488', '#4F46E5',
  '#65A30D', '#9333EA', '#0E7490', '#EA580C', '#C026D3',
  '#1D4ED8', '#047857', '#B45309', '#B91C1C', '#6D28D9'
];

export function renderCountryWheel(container) {
  let enabledContinents = [...continents];

  container.innerHTML = `
    <div class="wheel-page country-theme">
      <div class="wheel-header">
        <h1 class="wheel-title">🌍 Country Wheel</h1>
        <p class="wheel-subtitle">Spin the <strong>Country Wheel</strong> to pick a random destination for travel, geography study, or food challenges!</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="region-filters">
            <h3>🗺️ Region Filters</h3>
            <div class="region-toggle-list" id="regionToggles">
              ${continents.map(c => {
                const count = countries.filter(co => co.continent === c).length;
                return `<label class="region-toggle">
                  <input type="checkbox" checked data-continent="${c}">
                  <span class="region-name">${c}</span>
                  <span class="region-count">(${count})</span>
                </label>`;
              }).join('')}
            </div>
            <div class="region-summary" id="regionSummary">${countries.length} countries selected</div>
          </div>

          <div class="wheel-canvas-container" id="countryCanvasContainer">
            <canvas id="countryCanvas"></canvas>
          </div>
          <button class="spin-btn country-spin-btn" id="countrySpinBtn">
            <span class="spin-text">🌍 SPIN THE GLOBE</span>
            <div class="spin-ripple"></div>
          </button>
          <div class="result-display" id="countryResult"></div>
        </div>

        <div class="wheel-sidebar" id="countrySidebar"></div>
      </div>

      <div class="wheel-instructions howto-tutorial-style">
        <h2>How to Use the <strong>Country Wheel</strong></h2>
        <p class="howto-intro">The <strong>Country Wheel</strong> lets you randomly pick from 199 countries. Filter by continent, spin, and discover a new destination for travel, geography study, or food challenges.</p>
        <div class="howto-steps-list">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">1</span> Filter Regions</h3>
            <p class="howto-step-desc">Toggle continents on/off to narrow down the 199 countries. Study just Europe or explore all of Asia!</p>
            <div class="howto-step-screenshot">
              <img src="/images/howto/country-wheel.png" alt="Country Wheel with region filters and flag display" class="howto-inline-img" loading="lazy">
            </div>
          </div>
          <hr class="howto-divider">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">2</span> Spin the Globe</h3>
            <p class="howto-step-desc">Hit the spin button and watch the <strong>Country Wheel</strong> select a random country from your filtered list.</p>
          </div>
          <hr class="howto-divider">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">3</span> Discover</h3>
            <p class="howto-step-desc">The winning country's flag appears in the center! Use it for travel, food challenges, or study. Try the <a href="/zodiac/">Zodiac Wheel</a> or <a href="/wheel-of-fate/">Wheel of Fate</a> next.</p>
          </div>
        </div>
      </div>
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
    entries: currentWheelCountries.map(c => c.flag + ' ' + c.name),
    colors: GEO_COLORS,
    fontSize: 11,
    onTick: () => audioManager.playTick(),
    onResult: (winner) => {
      audioManager.playFanfare();
      // Find the country
      const countryName = winner.entry.replace(/^[^\s]+\s/, '');
      const country = countries.find(c => c.name === countryName) || { flag: '🌍', name: countryName };

      const resultEl = document.getElementById('countryResult');
      resultEl.innerHTML = `<div class="result-winner country-result">
        <span class="country-flag-big">${country.flag}</span>
        <span class="result-text">${country.name}</span>
        <span class="country-continent">${country.continent || ''}</span>
      </div>`;
      resultEl.classList.add('show');

      // Set flag as center emoji
      engine.centerEmoji = country.flag;
      engine.draw();

      customPanel.addResult(country.name);
      document.getElementById('countrySpinBtn').disabled = false;
    },
    onSpinStart: () => {
      audioManager.init();
      document.getElementById('countryResult').classList.remove('show');
      document.getElementById('countrySpinBtn').disabled = true;
      engine.centerEmoji = '';
      // Resample countries for variety
      currentWheelCountries = getWheelEntries();
      engine.setEntries(currentWheelCountries.map(c => c.flag + ' ' + c.name), GEO_COLORS);
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
      engine.setEntries(currentWheelCountries.map(c => c.flag + ' ' + c.name), GEO_COLORS);
      document.getElementById('regionSummary').textContent = getFilteredCountries().length + ' countries selected';
    }
  });

  document.getElementById('countrySpinBtn').addEventListener('click', () => {
    if (getFilteredCountries().length < 2) {
      alert('Please enable at least 2 regions!');
      return;
    }
    engine.spin();
  });

  return engine;
}
