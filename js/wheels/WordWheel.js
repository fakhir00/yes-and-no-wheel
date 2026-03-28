// WordWheel.js — Minimalist high-readability word/name picker
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';

const WORD_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#F97316', '#EC4899', '#14B8A6', '#6366F1',
  '#84CC16', '#A855F7', '#22D3EE', '#FB923C', '#E879F9'
];

export function renderWordWheel(container) {
  container.innerHTML = `
    <div class="wheel-page word-theme">
      <div class="wheel-header">
        <h1 class="wheel-title">📖 Word Wheel</h1>
        <p class="wheel-subtitle">Paste your list of names or words, customize the font, and pick a winner instantly.</p>
      </div>

      <div class="wheel-layout">
        <div class="wheel-main">
          <div class="wheel-canvas-container" id="wordCanvasContainer">
            <canvas id="wordCanvas"></canvas>
          </div>
          <button class="spin-btn word-spin-btn" id="wordSpinBtn">
            <span class="spin-text">📖 PICK A NAME</span>
            <div class="spin-ripple"></div>
          </button>
          <div class="result-display" id="wordResult"></div>

          <div class="csv-upload-area" id="wordUploadArea">
            <div class="upload-zone" id="wordDropZone">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              <p>Drag & drop a CSV/TXT file here</p>
              <span>or</span>
              <label class="upload-btn">
                Browse Files
                <input type="file" accept=".csv,.txt,.xlsx" id="wordFileInput" hidden>
              </label>
            </div>
          </div>

          <div class="quick-paste">
            <textarea id="wordQuickPaste" placeholder="Or paste names/words here, one per line...&#10;Alice&#10;Bob&#10;Charlie&#10;Diana" rows="4"></textarea>
            <button class="custom-btn" id="wordPasteApply">Load Names</button>
          </div>
        </div>

        <div class="wheel-sidebar" id="wordSidebar"></div>
      </div>

      <div class="wheel-instructions">
        <h2>How to Use the Word Wheel</h2>
        <div class="instruction-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Add Your List</h3>
              <p>Paste names directly, upload a CSV/TXT file, or use Advanced Mode. Perfect for teachers picking students!</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Customize Display</h3>
              <p>Adjust font size for readability in presentations. Large fonts work great on projectors.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Pick a Winner</h3>
              <p>Spin to randomly select from your list. Fair, fun, and transparent!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const defaultEntries = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];

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
      customPanel.addResult(winner.entry);
      document.getElementById('wordSpinBtn').disabled = false;
    },
    onSpinStart: () => {
      audioManager.init();
      document.getElementById('wordResult').classList.remove('show');
      document.getElementById('wordSpinBtn').disabled = true;
    }
  });

  const customPanel = new CustomizationPanel(engine, { wheelName: 'word' });
  customPanel.render('wordSidebar');
  customPanel.setEntries(defaultEntries);

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
