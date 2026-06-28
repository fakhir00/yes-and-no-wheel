import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { hairColors, hairCategories, nameToHex } from '../data/hairColors.js';
import { getLocalizedHairCategory, getLocalizedHairColorName, getWheelSharedText, getWheelUiText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { createResultOnlyMode } from './resultOnlyMode.js';
import { getWheelPageContent } from '../wheelContent.js';

const defaultColors = hairColors.slice(0, 16);

function renderHairContent(locale) {
  const c = getWheelPageContent(locale, 'hair-color');
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

function renderHairFaq(locale) {
  const c = getWheelPageContent(locale, 'hair-color');
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

export function renderHairColorWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'hair-color');
  const ui = getWheelUiText(locale);
  const spinAgainText = ui.spinAgain || 'Spin Again';
  const c = getWheelPageContent(locale, 'hair-color');
  container.innerHTML = `
    <div class="wheel-page hair-theme">
      <div class="wheel-header">
        <h1 class="wheel-title hair-title">${c.title || 'Hair Color Wheel'}</h1>
        <p class="wheel-subtitle">${c.subtitle || ''}</p>
      </div>
      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="hair-palette-selector">
            <p class="hair-palette-title">Color Palette</p>
            <div class="hair-cat-btns">
              <button class="hair-cat-btn active" data-cat="all">All Colors</button>
              ${hairCategories.map(c => `<button class="hair-cat-btn" data-cat="${c}">${c}</button>`).join('')}
            </div>
            <div class="hair-color-grid" id="hairColorGrid"></div>
            <div class="hair-custom-add">
              <input type="text" id="hairCustomName" placeholder="Add custom color name">
              <button class="custom-btn" id="hairAddCustom">+ Add</button>
            </div>
          </div>
          <div class="wheel-canvas-container" id="hairCanvasContainer"><canvas id="hairCanvas"></canvas></div>
          <button class="spin-btn hair-spin-btn" id="hairSpinBtn"><span class="spin-text">Spin for Color</span></button>
          <div class="result-display" id="hairResult"></div>
        </div>
        <div class="wheel-sidebar" id="hairSidebar"></div>
      </div>

      <div class="wheel-instructions howto-tutorial-style">
        <h2>${c.howToUse?.title || 'How to Use the Hair Color Wheel'}</h2>
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

      ${renderHairContent(locale)}
      ${renderHairFaq(locale)}

      ${renderWheelSilo(locale, 'hair-color')}
    </div>`;

  let selectedColors = [...defaultColors];
  let resultMode;

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
      resultMode.showResultOnly();
      engine.centerText = w.entry;
      engine.draw();
      cp.addResult(w.entry);
      document.getElementById('hairSpinBtn').disabled = false;
    },
    onSpinStart: () => { audioManager.init(); resultMode.hideResultOnly(); document.getElementById('hairResult').classList.remove('show'); document.getElementById('hairSpinBtn').disabled = true; engine.centerText = ''; }
  });

  const cp = new CustomizationPanel(engine, { wheelName: 'hair' });
  cp.render('hairSidebar');
  resultMode = createResultOnlyMode({
    root: container,
    resultSelector: '#hairResult',
    spinAgainText,
    onSpinAgain: () => {}
  });

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
