// DTIWheel.js — Dress To Impress theme wheel with pastel pink aesthetic
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { dtiThemes, dtiCategories } from '../data/dtiThemes.js';
import { getLocalizedDtiCategory, getLocalizedDtiThemeName, getWheelSharedText, getWheelUiText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { renderWheelFaq } from './WheelFaq.js';
import { renderWheelSeoContent } from './WheelSeoContent.js';
import { createResultOnlyMode } from './resultOnlyMode.js';

const PASTEL_COLORS = [
  '#FFB6C1', '#FFD1DC', '#FFDAB9', '#E6E6FA', '#B0E0E6',
  '#98FB98', '#DDA0DD', '#F0E68C', '#FFC0CB', '#E0B0FF',
  '#87CEEB', '#F5DEB3', '#FFE4E1', '#D8BFD8', '#AFEEEE',
  '#FAFAD2', '#FFF0F5', '#E6E6FA', '#F0F8FF', '#F5F5DC'
];

export function renderDTIWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'dti-theme');
  const ui = getWheelUiText(locale);
  const spinAgainText = ui.spinAgain || 'Spin Again';
  let localThemes = JSON.parse(JSON.stringify(dtiThemes));
  let resultMode;

  function getDisplayThemeName(theme) {
    const index = localThemes.indexOf(theme);
    return getLocalizedDtiThemeName(locale, theme, Math.max(index, 0));
  }

  container.innerHTML = `
    <div class="wheel-page dti-theme">
      <div class="wheel-header">
        <h1 class="wheel-title dti-title">👗 ${t.title}</h1>
        <p class="wheel-subtitle">${t.subtitle}</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="dti-library">
            <p class="dti-library-title">📚 ${ui.themeLibrary} <span class="dti-count" id="dtiEnabledCount">${ui.themesCount.replace('{count}', localThemes.filter(t=>t.enabled).length)}</span></p>
            <div class="dti-category-filters" id="dtiFilters">
              <button class="dti-filter-btn active" data-cat="all">${ui.all}</button>
              ${dtiCategories.map(c => `<button class="dti-filter-btn" data-cat="${c}">${getLocalizedDtiCategory(locale, c)}</button>`).join('')}
            </div>
            <div class="dti-toggle-all">
              <button class="custom-btn secondary" id="dtiSelectAll">${ui.selectAll}</button>
              <button class="custom-btn secondary" id="dtiDeselectAll">${ui.deselectAll}</button>
            </div>
            <div class="dti-theme-grid" id="dtiThemeGrid"></div>
          </div>

          <div class="wheel-canvas-container" id="dtiCanvasContainer">
            <canvas id="dtiCanvas"></canvas>
          </div>
          <button class="spin-btn dti-spin-btn" id="dtiSpinBtn">
            <span class="spin-text">👗 ${ui.spinForTheme}</span>
            <div class="spin-ripple"></div>
          </button>
          <div class="result-display" id="dtiResult"></div>
        </div>

        <div class="wheel-sidebar" id="dtiSidebar"></div>
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

      ${renderWheelSeoContent(t.title, 'dti-theme', locale)}
      ${renderWheelFaq(locale)}
      ${renderWheelSilo(locale, 'dti-theme')}
    </div>
  `;

  function getEnabled() {
    return localThemes.filter(t => t.enabled).map(t => getDisplayThemeName(t));
  }

  // Limit wheel to max 20 random from enabled
  function getWheelEntries() {
    const enabled = getEnabled();
    if (enabled.length <= 20) return enabled;
    const shuffled = [...enabled].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 20);
  }

  const engine = new WheelEngine('dtiCanvas', {
    entries: getWheelEntries(),
    colors: PASTEL_COLORS,
    onTick: () => audioManager.playTick(),
    onResult: (winner) => {
      audioManager.playFanfare();
      const resultEl = document.getElementById('dtiResult');
      resultEl.innerHTML = `<div class="result-winner dti-result"><span class="result-emoji">👗</span><span class="result-text">${winner.entry}</span><span class="dti-subtitle">${ui.dtiResultSubtitle}</span></div>`;
      resultEl.classList.add('show');
      resultMode.showResultOnly();
      customPanel.addResult(winner.entry);
      document.getElementById('dtiSpinBtn').disabled = false;
    },
    onSpinStart: () => {
      audioManager.init();
      resultMode.hideResultOnly();
      document.getElementById('dtiResult').classList.remove('show');
      document.getElementById('dtiSpinBtn').disabled = true;
      // Re-randomize which entries are shown
      engine.setEntries(getWheelEntries(), PASTEL_COLORS);
    }
  });

  const customPanel = new CustomizationPanel(engine, { wheelName: 'dti' });
  customPanel.render('dtiSidebar');
  resultMode = createResultOnlyMode({
    root: container,
    resultSelector: '#dtiResult',
    spinAgainText,
    onSpinAgain: () => {
      if (getEnabled().length >= 2) {
        engine.spin();
      }
    }
  });

  function buildThemeGrid(filter = 'all') {
    const grid = document.getElementById('dtiThemeGrid');
    const filtered = filter === 'all' ? localThemes : localThemes.filter(t => t.category === filter);
    grid.innerHTML = filtered.map((t, i) => {
      const globalIdx = localThemes.indexOf(t);
      return `<label class="dti-theme-item ${t.enabled ? 'enabled' : ''}">
        <input type="checkbox" ${t.enabled ? 'checked' : ''} data-idx="${globalIdx}">
        <span class="dti-theme-name">${getDisplayThemeName(t)}</span>
        <span class="dti-theme-cat">${getLocalizedDtiCategory(locale, t.category)}</span>
      </label>`;
    }).join('');

    grid.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const idx = parseInt(e.target.dataset.idx);
        localThemes[idx].enabled = e.target.checked;
        e.target.parentElement.classList.toggle('enabled', e.target.checked);
        updateCount();
        engine.setEntries(getWheelEntries(), PASTEL_COLORS);
      });
    });
  }

  function updateCount() {
    document.getElementById('dtiEnabledCount').textContent = ui.themesCount.replace('{count}', getEnabled().length);
  }

  buildThemeGrid();

  // Category filters
  document.getElementById('dtiFilters').addEventListener('click', (e) => {
    if (e.target.classList.contains('dti-filter-btn')) {
      document.querySelectorAll('.dti-filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      buildThemeGrid(e.target.dataset.cat);
    }
  });

  // Select/deselect all
  document.getElementById('dtiSelectAll').addEventListener('click', () => {
    localThemes.forEach(t => t.enabled = true);
    buildThemeGrid(document.querySelector('.dti-filter-btn.active')?.dataset.cat || 'all');
    updateCount();
    engine.setEntries(getWheelEntries(), PASTEL_COLORS);
  });

  document.getElementById('dtiDeselectAll').addEventListener('click', () => {
    localThemes.forEach(t => t.enabled = false);
    buildThemeGrid(document.querySelector('.dti-filter-btn.active')?.dataset.cat || 'all');
    updateCount();
  });

  document.getElementById('dtiSpinBtn').addEventListener('click', () => {
    if (getEnabled().length < 2) {
      alert(ui.enableAtLeastTwoThemes);
      return;
    }
    engine.spin();
  });

  return engine;
}
