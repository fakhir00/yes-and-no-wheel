import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { hairColors, hairCategories, nameToHex } from '../data/hairColors.js';

const defaultColors = hairColors.slice(0, 16);

export function renderHairColorWheel(container) {
  container.innerHTML = `
    <div class="wheel-page hair-theme">
      <div class="wheel-header">
        <h1 class="wheel-title hair-title">💇 Hair Color Wheel</h1>
        <p class="wheel-subtitle">Spin the <strong>Hair Color Wheel</strong> — ideal for OCs or salon inspiration. Choose from classic or fantasy hair dyes!</p>
      </div>
      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="hair-palette-selector">
            <h3>🎨 Color Palette</h3>
            <div class="hair-cat-btns">
              <button class="hair-cat-btn active" data-cat="all">All Colors</button>
              ${hairCategories.map(c => `<button class="hair-cat-btn" data-cat="${c}">${c}</button>`).join('')}
            </div>
            <div class="hair-color-grid" id="hairColorGrid"></div>
            <div class="hair-custom-add">
              <input type="text" id="hairCustomName" placeholder="Custom color name (e.g. Mint Green)">
              <button class="custom-btn" id="hairAddCustom">+ Add</button>
            </div>
          </div>
          <div class="wheel-canvas-container" id="hairCanvasContainer"><canvas id="hairCanvas"></canvas></div>
          <button class="spin-btn hair-spin-btn" id="hairSpinBtn"><span class="spin-text">💇 SPIN FOR A COLOR</span></button>
          <div class="result-display" id="hairResult"></div>
        </div>
        <div class="wheel-sidebar" id="hairSidebar"></div>
      </div>
      <div class="wheel-instructions howto-tutorial-style">
        <h2>How to Use the <strong>Hair Color Wheel</strong></h2>
        <p class="howto-intro">The <strong>Hair Color Wheel</strong> helps you find your next dye color. Browse Classic or Fantasy palettes, add custom colors with hex sync, and spin for inspiration.</p>
        <div class="howto-steps-list">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">1</span> Browse Colors</h3>
            <p class="howto-step-desc">Toggle between Classic and Fantasy palettes on the <strong>Hair Color Wheel</strong>, or add custom color names.</p>
            <div class="howto-step-screenshot">
              <img src="/images/howto/hair-color-wheel.png" alt="Hair Color Wheel with classic and fantasy color palettes" class="howto-inline-img" loading="lazy">
            </div>
          </div>
          <hr class="howto-divider">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">2</span> Hex Sync</h3>
            <p class="howto-step-desc">When you type a color name like "Mint Green," the <strong>Hair Color Wheel</strong> auto-matches its hex code!</p>
          </div>
          <hr class="howto-divider">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">3</span> Spin & Inspire</h3>
            <p class="howto-step-desc">Spin to pick your next hair color for OCs or salon visits. Also try the <a href="/dti-theme/">DTI Theme Wheel</a> or <a href="/rainbow/">Rainbow Wheel</a>.</p>
          </div>
        </div>
      </div>
    </div>`;

  let selectedColors = [...defaultColors];

  function getEntries() { return selectedColors.map(c => c.name); }
  function getColors() { return selectedColors.map(c => c.hex); }

  const engine = new WheelEngine('hairCanvas', {
    entries: getEntries(), colors: getColors(),
    onTick: () => audioManager.playTick(),
    onResult: (w) => {
      audioManager.playFanfare();
      const color = selectedColors.find(c => c.name === w.entry);
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
      return `<label class="hair-color-item ${active ? 'active' : ''}" title="${c.name}"><input type="checkbox" ${active ? 'checked' : ''} data-name="${c.name}" data-hex="${c.hex}"><span class="hair-dot" style="background:${c.hex}"></span><span class="hair-color-name">${c.name}</span></label>`;
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
    if (selectedColors.length < 2) { alert('Select at least 2 colors!'); return; }
    engine.spin();
  };
  return engine;
}
