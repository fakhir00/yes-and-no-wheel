import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { zodiacSigns, getCompatibility } from '../data/zodiacData.js';

export function renderZodiacWheel(container) {
  const signEntries = zodiacSigns.map(s => s.symbol + ' ' + s.name);
  const signColors = zodiacSigns.map(s => s.color);

  container.innerHTML = `
    <div class="wheel-page zodiac-theme">
      <div class="wheel-header">
        <h1 class="wheel-title zodiac-title">✨ Zodiac Wheel</h1>
        <p class="wheel-subtitle">Explore the stars and spin to reveal your zodiac destiny.</p>
      </div>
      <div class="wheel-layout" id="zodiacSingleLayout">
        <div class="wheel-main">
          <div class="wheel-canvas-container celestial-bg" id="zodiacCanvasContainer"><canvas id="zodiacCanvas"></canvas></div>
          <button class="spin-btn zodiac-spin-btn" id="zodiacSpinBtn"><span class="spin-text">✨ CONSULT THE STARS</span></button>
          <div class="result-display" id="zodiacResult"></div>
          <div class="zodiac-info-panel" id="zodiacInfoPanel"></div>
        </div>
        <div class="wheel-sidebar" id="zodiacSidebar"></div>
      </div>
      <div class="wheel-instructions">
        <h2>How to Use</h2>
        <div class="instruction-steps">
          <div class="step"><div class="step-number">1</div><div class="step-content"><h3>Spin</h3><p>Land on a zodiac sign and see its traits and element.</p></div></div>
          <div class="step"><div class="step-number">2</div><div class="step-content"><h3>Discover</h3><p>Learn deeply about the selected star sign's personality.</p></div></div>
        </div>
      </div>
    </div>`;

  function showInfo(name) {
    const s = zodiacSigns.find(z => z.name === name);
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
      const s = zodiacSigns.find(z => z.name === name);
      document.getElementById('zodiacResult').innerHTML = `<div class="result-winner zodiac-result"><span class="zodiac-result-symbol">${s?.symbol||'✨'}</span><span class="result-text">${name}</span><span class="zodiac-element">${s?.element||''} Sign</span></div>`;
      document.getElementById('zodiacResult').classList.add('show');
      showInfo(name); cp.addResult(name);
      document.getElementById('zodiacSpinBtn').disabled = false;
    },
    onSpinStart: () => { audioManager.init(); document.getElementById('zodiacResult').classList.remove('show'); document.getElementById('zodiacInfoPanel').classList.remove('show'); document.getElementById('zodiacSpinBtn').disabled = true; }
  });

  const cp = new CustomizationPanel(engine, { wheelName: 'zodiac' });
  cp.render('zodiacSidebar');
  document.getElementById('zodiacSpinBtn').onclick = () => engine.spin();

  return engine;
}
