import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { hairColors, hairCategories, nameToHex } from '../data/hairColors.js';
import { getLocalizedHairCategory, getLocalizedHairColorName, getWheelSharedText, getWheelUiText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { renderWheelFaq } from './WheelFaq.js';
import { renderWheelSeoContent } from './WheelSeoContent.js';

const defaultColors = hairColors.slice(0, 16);

export function renderHairColorWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'hair-color');
  const ui = getWheelUiText(locale);
  container.innerHTML = `
    <div class="wheel-page hair-theme">
      <div class="wheel-header">
        <p class="wheel-title hair-title">💇 ${t.title}</p>
        <p class="wheel-subtitle">${t.subtitle}</p>
      </div>
      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="hair-palette-selector">
            <p class="hair-palette-title">🎨 ${ui.colorPalette}</p>
            <div class="hair-cat-btns">
              <button class="hair-cat-btn active" data-cat="all">${ui.allColors}</button>
              ${hairCategories.map(c => `<button class="hair-cat-btn" data-cat="${c}">${c}</button>`).join('')}
            </div>
            <div class="hair-color-grid" id="hairColorGrid"></div>
            <div class="hair-custom-add">
              <input type="text" id="hairCustomName" placeholder="${ui.customColorPlaceholder}">
              <button class="custom-btn" id="hairAddCustom">+ ${ui.add}</button>
            </div>
          </div>
          <div class="wheel-canvas-container" id="hairCanvasContainer"><canvas id="hairCanvas"></canvas></div>
          <button class="spin-btn hair-spin-btn" id="hairSpinBtn"><span class="spin-text">💇 ${ui.spinForColor}</span></button>
          <div class="result-display" id="hairResult"></div>
        </div>
        <div class="wheel-sidebar" id="hairSidebar"></div>
      </div>
      <div class="wheel-instructions howto-tutorial-style">
        <h1>${t.howToUse}</h1>
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

      ${renderWheelSeoContent(t.title, 'hair-color', locale)}
      ${renderWheelFaq(locale)}
      ${renderWheelSilo(locale, 'hair-color')}
    </div>`;

  let selectedColors = [...defaultColors];

  function getDisplayColorName(color) {
    const sourceIndex = hairColors.findIndex((item) => item.name === color.name && item.hex === color.hex);
    const index = sourceIndex >= 0 ? sourceIndex : selectedColors.indexOf(color);
    return getLocalizedHairColorName(locale, color, Math.max(index, 0));
  }

  function getEntries() { return selectedColors.map((c) => getDisplayColorName(c)); }
  function getColors() { return selectedColors.map(c => c.hex); }

  const engine = new WheelEngine('hairCanvas', {
    entries: getEntries(), colors: getColors(),
    onTick: () => audioManager.playTick(),
    onResult: (w) => {
      audioManager.playFanfare();
      const color = selectedColors.find(c => getDisplayColorName(c) === w.entry);
      const hex = color ? color.hex : w.color;
      document.getElementById('hairResult').innerHTML = `<div class="result-winner hair-result"><div class="hair-swatch" style="background:${hex}"></div><span class="result-text">${w.entry}</span><span class="hair-hex">${hex}</span></div>`;
      document.getElementById('hairResult').classList.add('show');
      engine.centerText = w.entry;
      engine.draw();
      cp.addResult(w.entry);
      document.getElementById('hairSpinBtn').disabled = false;
    },
    onSpinStart: () => { audioManager.init(); document.getElementById('hairResult').classList.remove('show'); document.getElementById('hairSpinBtn').disabled = true; engine.centerText = ''; }
  });

  const cp = new CustomizationPanel(engine, { wheelName: 'hair' });
  cp.render('hairSidebar');

  function buildGrid(cat) {
    const grid = document.getElementById('hairColorGrid');
    const list = cat === 'all' ? hairColors : hairColors.filter(c => c.category === cat);
    grid.innerHTML = list.map(c => {
      const active = selectedColors.some(s => s.name === c.name);
      const displayName = getDisplayColorName(c);
      return `<label class="hair-color-item ${active ? 'active' : ''}" title="${displayName}"><input type="checkbox" ${active ? 'checked' : ''} data-name="${c.name}" data-hex="${c.hex}"><span class="hair-dot" style="background:${c.hex}"></span><span class="hair-color-name">${displayName}</span></label>`;
    }).join('');
    grid.querySelectorAll('input').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const name = e.target.dataset.name, hex = e.target.dataset.hex;
        if (e.target.checked) { selectedColors.push({ name, hex, category: '' }); }
        else { selectedColors = selectedColors.filter(c => c.name !== name); }
        e.target.parentElement.classList.toggle('active', e.target.checked);
        if (selectedColors.length > 0) engine.setEntries(getEntries(), getColors());
      });
    });
  }
  buildGrid('all');

  document.querySelectorAll('.hair-cat-btn').forEach((button) => {
    const category = button.dataset.cat;
    if (category === 'all') return;
    button.textContent = getLocalizedHairCategory(locale, category);
  });

  document.querySelector('.hair-cat-btns').addEventListener('click', (e) => {
    if (e.target.classList.contains('hair-cat-btn')) {
      document.querySelectorAll('.hair-cat-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      buildGrid(e.target.dataset.cat);
    }
  });

  // Hex Sync: custom color name
  document.getElementById('hairAddCustom').addEventListener('click', () => {
    const name = document.getElementById('hairCustomName').value.trim();
    if (!name) return;
    const hex = nameToHex(name) || '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
    selectedColors.push({ name, hex, category: 'Custom' });
    engine.setEntries(getEntries(), getColors());
    document.getElementById('hairCustomName').value = '';
  });

  document.getElementById('hairSpinBtn').onclick = () => {
    if (selectedColors.length < 2) { alert(ui.selectAtLeastTwoColors); return; }
    engine.spin();
  };
  return engine;
}
