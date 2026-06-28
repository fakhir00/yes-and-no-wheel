// WordWheel.js — Minimalist high-readability word/name picker
import { WheelEngine } from '../engine/WheelEngine.js';
import { CustomizationPanel } from '../engine/CustomizationPanel.js';
import { audioManager } from '../engine/AudioManager.js';
import { getLocalizedWheelSeedEntries, getWheelSharedText, getWheelUiText, splitLocaleFromPath, buildLocalizedPath } from '../i18n.js';
import { renderWheelSilo } from './WheelSilo.js';
import { createResultOnlyMode } from './resultOnlyMode.js';
import { getWheelPageContent } from '../wheelContent.js';

const WORD_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#F97316', '#EC4899', '#14B8A6', '#6366F1',
  '#84CC16', '#A855F7', '#22D3EE', '#FB923C', '#E879F9'
];

const WORD_FAQ = [
  { q: 'What is the word wheel?', a: 'The word wheel is a random word picker that spins a wheel of custom text entries. You can type words manually, paste a list, or upload a CSV file. The wheel randomly selects one entry when it stops spinning.' },
  { q: 'How do I add my own words?', a: 'Three methods are available. Type words directly into the quick-paste textarea (one word per line) and click Load. Upload a CSV or text file using the file picker or drag-and-drop zone. Or use the customization sidebar to add, edit, and remove entries one at a time.' },
  { q: 'What file formats are supported?', a: 'The word wheel accepts CSV, TXT, and XLSX files. For CSV files, entries can be separated by commas or line breaks. For TXT files, each line is treated as one entry. The file is parsed entirely in your browser — no data is uploaded to a server.' },
  { q: 'Can I use this for classroom activities?', a: 'The word wheel works well for classrooms. Teachers use it to pick student names for activities, assign groups, select vocabulary words for practice, or choose topics for discussion. The visual spinning makes the selection process engaging for students.' },
  { q: 'Is there a limit to how many words I can add?', a: 'There is no hard limit, but the wheel becomes harder to read with more than about 50 entries because the segments become very small. For best results, keep the list under 30 entries. The customization sidebar lets you manage any number of entries.' },
  { q: 'Is the word wheel free?', a: 'The word wheel is completely free with no signup, no ads, and no usage limits. Your word lists are processed entirely in your browser and are not stored on any server.' },
];

function renderWordFaq(locale) {
  const c = getWheelPageContent(locale, 'word');
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

function renderWordContent(locale) {
  const c = getWheelPageContent(locale, 'word');
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

export function renderWordWheel(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const t = getWheelSharedText(locale, 'word');
  const ui = getWheelUiText(locale);
  const spinAgainText = ui.spinAgain || 'Spin Again';
  const c = getWheelPageContent(locale, 'word');
  container.innerHTML = `
    <div class="wheel-page word-theme">
      <div class="wheel-header">
        <h1 class="wheel-title">${c.title || 'Word Wheel'}</h1>
        <p class="wheel-subtitle">${c.subtitle || ''}</p>
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
        <h2>${c.howToUse?.title || 'How to Use the Word Wheel'}</h2>
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

      ${renderWordContent(locale)}
      ${renderWordFaq(locale)}
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
    onSpinAgain: () => { }
  });

  document.getElementById('wordSpinBtn').addEventListener('click', () => engine.spin());

  document.getElementById('wordPasteApply').addEventListener('click', () => {
    const text = document.getElementById('wordQuickPaste').value;
    const entries = text.split('\n').map(s => s.trim()).filter(s => s);
    if (entries.length > 0) {
      engine.setEntries(entries, WORD_COLORS);
      customPanel.setEntries(entries);
    }
  });

  document.getElementById('wordFileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
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
