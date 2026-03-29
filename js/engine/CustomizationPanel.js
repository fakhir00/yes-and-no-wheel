// CustomizationPanel.js — Advanced mode panel for all wheels
import { audioManager } from './AudioManager.js';
import { storage } from './StorageManager.js';

export class CustomizationPanel {
  constructor(wheelEngine, options = {}) {
    this.engine = wheelEngine;
    this.wheelName = options.wheelName || 'wheel';
    this.storageKey = `custom_${this.wheelName}`;
    this.onEntriesChange = options.onEntriesChange || null;
    this.isOpen = true; // Always start open
    this.container = null;
  }

  render(parentId) {
    const parent = document.getElementById(parentId);
    if (!parent) return;

    this.container = document.createElement('div');
    this.container.className = 'customization-panel';
    this.container.innerHTML = this._getHTML();
    parent.appendChild(this.container);

    this._bindEvents();
    this._loadSavedSettings();
  }

  _getHTML() {
    return `
      <button class="custom-toggle-btn active" id="customToggle_${this.wheelName}" aria-label="Toggle Advanced Mode">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        <span>Advanced Mode</span>
      </button>

      <div class="custom-drawer open" id="customDrawer_${this.wheelName}">
        <div class="custom-drawer-content">
          <div class="custom-section">
            <h3>📝 Entry Management</h3>
            <textarea class="custom-textarea" id="customEntries_${this.wheelName}" 
              placeholder="Enter items, one per line..." rows="6"></textarea>
            <div class="custom-btn-row">
              <button class="custom-btn" id="customApply_${this.wheelName}">Apply</button>
              <button class="custom-btn secondary" id="customShuffle_${this.wheelName}">🔀 Shuffle</button>
              <button class="custom-btn danger" id="customClear_${this.wheelName}">🗑 Clear</button>
            </div>
          </div>

          <div class="custom-section">
            <h3>🎨 Visual Styling</h3>
            <div class="custom-field">
              <label>Font Size</label>
              <input type="range" min="9" max="24" value="14" id="customFontSize_${this.wheelName}">
              <span id="customFontSizeVal_${this.wheelName}">14px</span>
            </div>
            <div class="custom-field">
              <label>Theme</label>
              <div class="custom-theme-toggle">
                <button class="theme-btn active" data-theme="dark" id="themeDark_${this.wheelName}">🌙 Dark</button>
                <button class="theme-btn" data-theme="light" id="themeLight_${this.wheelName}">☀️ Light</button>
              </div>
            </div>
          </div>

          <div class="custom-section">
            <h3>🔊 Audio Controls</h3>
            <div class="custom-field">
              <label>Tick Sound</label>
              <label class="toggle-switch">
                <input type="checkbox" checked id="customTick_${this.wheelName}">
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="custom-field">
              <label>Winner Fanfare</label>
              <label class="toggle-switch">
                <input type="checkbox" checked id="customFanfare_${this.wheelName}">
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="custom-field">
              <label>Volume</label>
              <input type="range" min="0" max="100" value="30" id="customVolume_${this.wheelName}">
            </div>
          </div>

          <div class="custom-section">
            <h3>⚙️ Physics Settings</h3>
            <div class="custom-field">
              <label>Spin Power</label>
              <input type="range" min="1" max="10" value="5" id="customPower_${this.wheelName}">
              <span id="customPowerVal_${this.wheelName}">5</span>
            </div>
            <div class="custom-field">
              <label>Duration</label>
              <input type="range" min="3" max="20" value="8" id="customDuration_${this.wheelName}">
              <span id="customDurationVal_${this.wheelName}">8s</span>
            </div>
          </div>

          <div class="custom-section">
            <h3>📜 Results History</h3>
            <div class="history-list" id="customHistory_${this.wheelName}"></div>
            <button class="custom-btn secondary" id="customClearHistory_${this.wheelName}">Clear History</button>
          </div>
        </div>
      </div>
    `;
  }

  _bindEvents() {
    const wn = this.wheelName;

    // Toggle
    document.getElementById(`customToggle_${wn}`).addEventListener('click', () => {
      this.isOpen = !this.isOpen;
      const drawer = document.getElementById(`customDrawer_${wn}`);
      drawer.classList.toggle('open', this.isOpen);
      document.getElementById(`customToggle_${wn}`).classList.toggle('active', this.isOpen);
    });

    // Apply entries
    document.getElementById(`customApply_${wn}`).addEventListener('click', () => {
      const text = document.getElementById(`customEntries_${wn}`).value;
      const entries = text.split('\n').map(s => s.trim()).filter(s => s);
      if (entries.length > 0) {
        this.engine.setEntries(entries);
        this._saveSettings();
        if (this.onEntriesChange) this.onEntriesChange(entries);
      }
    });

    // Shuffle
    document.getElementById(`customShuffle_${wn}`).addEventListener('click', () => {
      const textarea = document.getElementById(`customEntries_${wn}`);
      const entries = textarea.value.split('\n').map(s => s.trim()).filter(s => s);
      for (let i = entries.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [entries[i], entries[j]] = [entries[j], entries[i]];
      }
      textarea.value = entries.join('\n');
      this.engine.setEntries(entries);
      if (this.onEntriesChange) this.onEntriesChange(entries);
    });

    // Clear
    document.getElementById(`customClear_${wn}`).addEventListener('click', () => {
      document.getElementById(`customEntries_${wn}`).value = '';
    });

    // Font size
    document.getElementById(`customFontSize_${wn}`).addEventListener('input', (e) => {
      this.engine.fontSize = parseInt(e.target.value);
      document.getElementById(`customFontSizeVal_${wn}`).textContent = e.target.value + 'px';
      this.engine.draw();
      this._saveSettings();
    });

    // Theme
    document.getElementById(`themeDark_${wn}`).addEventListener('click', () => {
      document.getElementById(`themeDark_${wn}`).classList.add('active');
      document.getElementById(`themeLight_${wn}`).classList.remove('active');
      document.body.setAttribute('data-theme', 'dark');
      this.engine.darkMode = true;
      this.engine.draw();
      storage.setThemePreference('dark');
    });

    document.getElementById(`themeLight_${wn}`).addEventListener('click', () => {
      document.getElementById(`themeLight_${wn}`).classList.add('active');
      document.getElementById(`themeDark_${wn}`).classList.remove('active');
      document.body.setAttribute('data-theme', 'light');
      this.engine.darkMode = false;
      this.engine.draw();
      storage.setThemePreference('light');
    });

    // Audio
    document.getElementById(`customTick_${wn}`).addEventListener('change', (e) => {
      audioManager.tickEnabled = e.target.checked;
    });

    document.getElementById(`customFanfare_${wn}`).addEventListener('change', (e) => {
      audioManager.fanfareEnabled = e.target.checked;
    });

    document.getElementById(`customVolume_${wn}`).addEventListener('input', (e) => {
      audioManager.setVolume(parseInt(e.target.value) / 100);
    });

    // Physics
    document.getElementById(`customPower_${wn}`).addEventListener('input', (e) => {
      this.engine.spinPower = parseInt(e.target.value);
      document.getElementById(`customPowerVal_${wn}`).textContent = e.target.value;
      this._saveSettings();
    });

    document.getElementById(`customDuration_${wn}`).addEventListener('input', (e) => {
      this.engine.maxDuration = parseInt(e.target.value);
      document.getElementById(`customDurationVal_${wn}`).textContent = e.target.value + 's';
      this._saveSettings();
    });

    // Clear history
    document.getElementById(`customClearHistory_${wn}`).addEventListener('click', () => {
      storage.clearHistory();
      this.updateHistory();
    });
  }

  updateHistory() {
    const historyEl = document.getElementById(`customHistory_${this.wheelName}`);
    if (!historyEl) return;
    const history = storage.getHistory().filter(h => h.wheel === this.wheelName).slice(0, 20);
    if (history.length === 0) {
      historyEl.innerHTML = '<p class="history-empty">No spins yet</p>';
      return;
    }
    historyEl.innerHTML = history.map(h => {
      const time = new Date(h.timestamp).toLocaleTimeString();
      return `<div class="history-item"><span class="history-result">🎯 ${h.result}</span><span class="history-time">${time}</span></div>`;
    }).join('');
  }

  addResult(result) {
    storage.addToHistory(this.wheelName, result);
    this.updateHistory();
  }

  setEntries(entries) {
    const textarea = document.getElementById(`customEntries_${this.wheelName}`);
    if (textarea) textarea.value = entries.join('\n');
  }

  _saveSettings() {
    const wn = this.wheelName;
    storage.set(this.storageKey, {
      entries: document.getElementById(`customEntries_${wn}`)?.value || '',
      fontSize: this.engine.fontSize,
      spinPower: this.engine.spinPower,
      maxDuration: this.engine.maxDuration
    });
  }

  _loadSavedSettings() {
    const saved = storage.get(this.storageKey);
    if (!saved) return;

    const wn = this.wheelName;
    if (saved.entries) {
      const textarea = document.getElementById(`customEntries_${wn}`);
      if (textarea) textarea.value = saved.entries;
    }
    if (saved.fontSize) {
      this.engine.fontSize = saved.fontSize;
      const el = document.getElementById(`customFontSize_${wn}`);
      if (el) { el.value = saved.fontSize; }
      const valEl = document.getElementById(`customFontSizeVal_${wn}`);
      if (valEl) valEl.textContent = saved.fontSize + 'px';
    }
    if (saved.spinPower) {
      this.engine.spinPower = saved.spinPower;
      const el = document.getElementById(`customPower_${wn}`);
      if (el) el.value = saved.spinPower;
      const valEl = document.getElementById(`customPowerVal_${wn}`);
      if (valEl) valEl.textContent = saved.spinPower;
    }
    if (saved.maxDuration) {
      this.engine.maxDuration = saved.maxDuration;
      const el = document.getElementById(`customDuration_${wn}`);
      if (el) el.value = saved.maxDuration;
      const valEl = document.getElementById(`customDurationVal_${wn}`);
      if (valEl) valEl.textContent = saved.maxDuration + 's';
    }

    // Theme
    const theme = storage.getThemePreference();
    document.body.setAttribute('data-theme', theme);
    this.engine.darkMode = theme === 'dark';
    if (theme === 'light') {
      document.getElementById(`themeLight_${wn}`)?.classList.add('active');
      document.getElementById(`themeDark_${wn}`)?.classList.remove('active');
    }
  }
}
