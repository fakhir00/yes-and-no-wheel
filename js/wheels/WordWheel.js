// WordWheel.js — Minimalist high-readability word/name picker
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { getLocalizedWheelSeedEntries, getWheelSharedText, getWheelUiText, splitLocaleFromPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { renderWheelFaq } from './WheelFaq.js';
import { renderWheelSeoContent } from './WheelSeoContent.js';
import { createResultOnlyMode } from './resultOnlyMode.js';

const WORD_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#F97316', '#EC4899', '#14B8A6', '#6366F1',
  '#84CC16', '#A855F7', '#22D3EE', '#FB923C', '#E879F9'
];

export function renderWordWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'word');
  const ui = getWheelUiText(locale);
  const spinAgainText = ui.spinAgain || 'Spin Again';
  container.innerHTML = `
    <div class="wheel-page word-theme">
      <div class="wheel-header">
        <h1 class="wheel-title">📖 ${t.title}</h1>
        <p class="wheel-subtitle">${t.subtitle}</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="wheel-canvas-container" id="wordCanvasContainer">
            <canvas id="wordCanvas"></canvas>
          </div>
          <button class="spin-btn word-spin-btn" id="wordSpinBtn">
            <span class="spin-text">📖 ${ui.pickAWord}</span>
            <div class="spin-ripple"></div>
          </button>
          <div class="result-display" id="wordResult"></div>

          <div class="csv-upload-area" id="wordUploadArea">
            <div class="upload-zone" id="wordDropZone">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              <p>${ui.dragDropFile}</p>
              <span>${ui.or}</span>
              <label class="upload-btn">
                ${ui.browseFiles}
                <input type="file" accept=".csv,.txt,.xlsx" id="wordFileInput" hidden>
              </label>
            </div>
          </div>

          <div class="quick-paste">
            <textarea id="wordQuickPaste" placeholder="${ui.quickPastePlaceholder}&#10;Apple&#10;Banana&#10;Cherry&#10;Dragon" rows="4"></textarea>
            <button class="custom-btn" id="wordPasteApply">${ui.loadWords}</button>
          </div>
        </div>

        <div class="wheel-sidebar" id="wordSidebar"></div>
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

      ${renderWheelSeoContent(t.title, 'word', locale)}
      ${renderWheelFaq(locale)}
      ${renderWheelSilo(locale, 'word')}
    </div>
  `;

  const defaultEntries = getLocalizedWheelSeedEntries(locale, 'word');
  let resultMode;

  const engine = new WheelEngine('wordCanvas', {
    entries: defaultEntries,
    colors: WORD_COLORS,
    fontSize: 16,
    onTick: () => audioManager.playTick(),
    onResult: (winner) => {
      audioManager.playFanfare();
      const resultEl = document.getElementById('wordResult');
      resultEl.innerHTML = `<div class="result-winner word-result"><span class="result-emoji">🎯</span><span class="result-text">${winner.entry}</span></div>`;
      resultEl.classList.add('show');
      resultMode.showResultOnly();
      customPanel.addResult(winner.entry);
      document.getElementById('wordSpinBtn').disabled = false;
    },
    onSpinStart: () => {
      audioManager.init();
      resultMode.hideResultOnly();
      document.getElementById('wordResult').classList.remove('show');
      document.getElementById('wordSpinBtn').disabled = true;
    }
  });

  const customPanel = new CustomizationPanel(engine, { wheelName: 'word' });
  customPanel.render('wordSidebar');
  customPanel.setEntries(defaultEntries);
  resultMode = createResultOnlyMode({
    root: container,
    resultSelector: '#wordResult',
    spinAgainText,
    onSpinAgain: () => {}
  });

  // Spin button
  document.getElementById('wordSpinBtn').addEventListener('click', () => engine.spin());

  // Quick paste
  document.getElementById('wordPasteApply').addEventListener('click', () => {
    const text = document.getElementById('wordQuickPaste').value;
    const entries = text.split('\n').map(s => s.trim()).filter(s => s);
    if (entries.length > 0) {
      engine.setEntries(entries, WORD_COLORS);
      customPanel.setEntries(entries);
    }
  });

  // File upload
  document.getElementById('wordFileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      // Parse CSV or plain text
      let entries;
      if (file.name.endsWith('.csv')) {
        entries = text.split(/[\r\n,]+/).map(s => s.trim()).filter(s => s && s !== '');
      } else {
        entries = text.split(/[\r\n]+/).map(s => s.trim()).filter(s => s);
      }
      if (entries.length > 0) {
        engine.setEntries(entries, WORD_COLORS);
        customPanel.setEntries(entries);
        document.getElementById('wordQuickPaste').value = entries.join('\n');
      }
    };
    reader.readAsText(file);
  });

  // Drag & drop
  const dropZone = document.getElementById('wordDropZone');
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) {
      const input = document.getElementById('wordFileInput');
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      input.dispatchEvent(new Event('change'));
    }
  });

  return engine;
}
