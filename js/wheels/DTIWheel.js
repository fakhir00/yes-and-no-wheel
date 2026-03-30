// DTIWheel.js — Dress To Impress theme wheel with pastel pink aesthetic
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { dtiThemes, dtiCategories, getEnabledThemes } from '../data/dtiThemes.js';

const PASTEL_COLORS = [
  '#FFB6C1', '#FFD1DC', '#FFDAB9', '#E6E6FA', '#B0E0E6',
  '#98FB98', '#DDA0DD', '#F0E68C', '#FFC0CB', '#E0B0FF',
  '#87CEEB', '#F5DEB3', '#FFE4E1', '#D8BFD8', '#AFEEEE',
  '#FAFAD2', '#FFF0F5', '#E6E6FA', '#F0F8FF', '#F5F5DC'
];

export function renderDTIWheel(container) {
  let localThemes = JSON.parse(JSON.stringify(dtiThemes));

  container.innerHTML = `
    <div class="wheel-page dti-theme">
      <div class="wheel-header">
        <h1 class="wheel-title dti-title">👗 DTI Theme Wheel</h1>
        <p class="wheel-subtitle">Spin the <strong>DTI Theme Wheel</strong> — specifically for Dress To Impress players — find creative outfit inspiration instantly!</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="dti-library">
            <h3>📚 Theme Library <span class="dti-count" id="dtiEnabledCount">${localThemes.filter(t=>t.enabled).length} themes</span></h3>
            <div class="dti-category-filters" id="dtiFilters">
              <button class="dti-filter-btn active" data-cat="all">All</button>
              ${dtiCategories.map(c => `<button class="dti-filter-btn" data-cat="${c}">${c}</button>`).join('')}
            </div>
            <div class="dti-toggle-all">
              <button class="custom-btn secondary" id="dtiSelectAll">Select All</button>
              <button class="custom-btn secondary" id="dtiDeselectAll">Deselect All</button>
            </div>
            <div class="dti-theme-grid" id="dtiThemeGrid"></div>
          </div>

          <div class="wheel-canvas-container" id="dtiCanvasContainer">
            <canvas id="dtiCanvas"></canvas>
          </div>
          <button class="spin-btn dti-spin-btn" id="dtiSpinBtn">
            <span class="spin-text">👗 SPIN FOR A THEME</span>
            <div class="spin-ripple"></div>
          </button>
          <div class="result-display" id="dtiResult"></div>
        </div>

        <div class="wheel-sidebar" id="dtiSidebar"></div>
      </div>

      <div class="wheel-instructions howto-tutorial-style">
        <h2>How to Use the <strong>DTI Theme Wheel</strong></h2>
        <p class="howto-intro">The <strong>DTI Theme Wheel</strong> is built specifically for Dress To Impress players. Browse 180+ pre-loaded themes organized by category and spin for random outfit inspiration.</p>
        <div class="howto-steps-list">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">1</span> Browse Themes</h3>
            <p class="howto-step-desc">Explore 180+ pre-loaded themes on the <strong>DTI Theme Wheel</strong>. Toggle themes on/off to customize your wheel.</p>
            <div class="howto-step-screenshot">
              <img src="/images/howto/dti-theme-wheel.png" alt="DTI Theme Wheel for Dress To Impress outfit inspiration" class="howto-inline-img" loading="lazy">
            </div>
          </div>
          <hr class="howto-divider">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">2</span> Filter by Category</h3>
            <p class="howto-step-desc">Use the category buttons to filter by Era, Genre, Aesthetic, Style, Culture, Nature, Concept, or Profession.</p>
          </div>
          <hr class="howto-divider">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">3</span> Spin the <strong>DTI Theme Wheel</strong></h3>
            <p class="howto-step-desc">Spin and use the selected theme for your next DTI outfit challenge! Also try the <a href="/hair-color/">Hair Color Wheel</a> or <a href="/rainbow/">Rainbow Wheel</a>.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  function getEnabled() {
    return localThemes.filter(t => t.enabled).map(t => t.name);
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
      resultEl.innerHTML = `<div class="result-winner dti-result"><span class="result-emoji">👗</span><span class="result-text">${winner.entry}</span><span class="dti-subtitle">Time to dress to impress!</span></div>`;
      resultEl.classList.add('show');
      customPanel.addResult(winner.entry);
      document.getElementById('dtiSpinBtn').disabled = false;
    },
    onSpinStart: () => {
      audioManager.init();
      document.getElementById('dtiResult').classList.remove('show');
      document.getElementById('dtiSpinBtn').disabled = true;
      // Re-randomize which entries are shown
      engine.setEntries(getWheelEntries(), PASTEL_COLORS);
    }
  });

  const customPanel = new CustomizationPanel(engine, { wheelName: 'dti' });
  customPanel.render('dtiSidebar');

  function buildThemeGrid(filter = 'all') {
    const grid = document.getElementById('dtiThemeGrid');
    const filtered = filter === 'all' ? localThemes : localThemes.filter(t => t.category === filter);
    grid.innerHTML = filtered.map((t, i) => {
      const globalIdx = localThemes.indexOf(t);
      return `<label class="dti-theme-item ${t.enabled ? 'enabled' : ''}">
        <input type="checkbox" ${t.enabled ? 'checked' : ''} data-idx="${globalIdx}">
        <span class="dti-theme-name">${t.name}</span>
        <span class="dti-theme-cat">${t.category}</span>
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
    document.getElementById('dtiEnabledCount').textContent = getEnabled().length + ' themes';
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
      alert('Please enable at least 2 themes!');
      return;
    }
    engine.spin();
  });

  return engine;
}
