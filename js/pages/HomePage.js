// HomePage.js — Yes/No Picker Wheel + Hub landing
import { WheelEngine } from '../engine/WheelEngine.js';
import { audioManager } from '../engine/AudioManager.js';
import { confetti } from '../engine/ConfettiEngine.js';

export function renderHomePage(container) {
  const wheels = [
    { id: 'rainbow', icon: '🌈', title: 'Rainbow Wheel', desc: 'ROYGBIV spectrum colors decide your fate.', color: '#FF6B6B' },
    { id: 'wheel-of-fate', icon: '⚔️', title: 'Wheel of Fate', desc: 'Dark cosmic wheel with weighted outcomes.', color: '#6B2D8B' },
    { id: 'word', icon: '📖', title: 'Word Wheel', desc: 'Pick names from your list. CSV upload.', color: '#3B82F6' },
    { id: 'spin-the-wheel-truth-or-dare', icon: '🎉', title: 'Truth or Dare', desc: 'Two-step party wheel with 200+ questions.', color: '#FF006E' },
    { id: 'dti-theme', icon: '👗', title: 'DTI Theme Wheel', desc: '180+ themes for Dress To Impress.', color: '#FFB6C1' },
    { id: 'country', icon: '🌍', title: 'Country Wheel', desc: '199 countries with region filters.', color: '#059669' },
    { id: 'zodiac', icon: '✨', title: 'Zodiac Wheel', desc: '12 signs with compatibility mode.', color: '#FFD700' },
    { id: 'hair-color', icon: '💇', title: 'Hair Color Wheel', desc: 'Classic & fantasy colors with Hex Sync.', color: '#FF69B4' }
  ];

  container.innerHTML = `
    <div class="home-page">
      <!-- YES / NO PICKER WHEEL SECTION -->
      <section class="yesno-section">
        <div class="yesno-header">
          <h1 class="hero-title">YES AND NO <span class="hero-highlight">WHEEL</span> — Free Spinner</h1>
          <p class="hero-subtitle">Spin the <strong>Yes and No Wheel</strong> to make instant decisions — let fate choose for you!</p>
        </div>

        <div class="yesno-layout">
          <div class="yesno-wheel-area">
            <div class="wheel-canvas-container yesno-canvas-wrap" id="yesnoCanvasContainer">
              <canvas id="yesnoCanvas"></canvas>
            </div>
            <div class="yesno-sound-toggle">
              <button class="sound-btn" id="yesnoSoundBtn" title="Toggle Sound">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              </button>
            </div>
          </div>

          <div class="yesno-controls">
            <div class="yesno-counters">
              <div class="yesno-counter yes-counter" id="yesCounter">
                <span class="counter-num" id="yesCount">0</span>
                <span class="counter-label">YES</span>
              </div>
              <div class="yesno-counter maybe-counter" id="maybeCounter" style="display:none">
                <span class="counter-num" id="maybeCount">0</span>
                <span class="counter-label">MAYBE</span>
              </div>
              <div class="yesno-counter no-counter" id="noCounter">
                <span class="counter-num" id="noCount">0</span>
                <span class="counter-label">NO</span>
              </div>
            </div>
            <button class="reset-counts-btn" id="resetCountsBtn">↻ Reset Counts</button>

            <div class="yesno-inputs-panel">
              <div class="inputs-header">
                <h3>INPUTS</h3>
              </div>
              <div class="yesno-mode-row">
                <label>Mode</label>
                <div class="mode-toggle-group">
                  <button class="mode-btn active" id="modeYesNo">YES or NO</button>
                  <button class="mode-btn" id="modeYesNoMaybe">YES NO or MAYBE</button>
                </div>
              </div>
              <div class="yesno-sets-row">
                <label>Number of Input Sets</label>
                <div class="sets-toggle-group">
                  ${[1,2,3,4,5].map(n => `<button class="set-btn ${n===1?'active':''}" data-sets="${n}">${n}</button>`).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Result display -->
        <div class="result-display yesno-result-display" id="yesnoResult"></div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="how-it-works howto-tutorial">
        <h2 class="section-title">How to Use the <strong>Yes and No Wheel</strong></h2>
        <p class="howto-intro">This <strong>Yes and No Wheel</strong> is a free random yes or no generator. By just clicking the "SPIN" button, you will get a yes or no at the end of the spin. It helps you to make a decision quickly.</p>

        <div class="howto-steps-list">
          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">1</span> Choose a mode</h3>
            <ul class="howto-step-options">
              <li>Yes or No</li>
              <li>Yes, No or Maybe</li>
            </ul>
            <div class="howto-step-screenshot">
              <img src="images/howto/yesno-wheel.png" alt="Yes and No Wheel mode selection — YES or NO and YES NO or MAYBE buttons" class="howto-inline-img" loading="lazy">
            </div>
          </div>

          <hr class="howto-divider">

          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">2</span> Choose the number of input sets</h3>
            <ul class="howto-step-options">
              <li>From 1 set to 5 sets</li>
            </ul>
          </div>

          <hr class="howto-divider">

          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">3</span> Click the "SPIN" button to spin the <strong>Yes No Wheel</strong></h3>
            <p class="howto-step-desc">Press Ctrl+Enter or click the SPIN button in the center of the wheel to generate a result.</p>
          </div>

          <hr class="howto-divider">

          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">4</span> Result is displayed and accumulated</h3>
            <p class="howto-step-desc">The result counter shows how many times Yes, No, or Maybe has been selected.</p>
          </div>

          <hr class="howto-divider">

          <div class="howto-step-item">
            <h3 class="howto-step-heading"><span class="howto-step-num">5</span> Continue spinning or reset</h3>
            <p class="howto-step-desc">Continue with the next spin or click the reset button to clear results. Explore other wheels like the <a href="#rainbow">Rainbow Wheel</a>, <a href="#spin-the-wheel-truth-or-dare">Truth or Dare</a>, or <a href="#word">Word Wheel</a>.</p>
          </div>
        </div>
      </section>

      <!-- WHEEL HUB CARDS -->
      <section class="wheels-grid" id="about">
        <h2 class="section-title">Explore All Wheels</h2>
        <p class="section-subtitle">Each wheel is uniquely themed and packed with special features</p>
        <div class="cards-grid">
          ${wheels.map(w => `
            <a href="#${w.id}" class="wheel-card" style="--card-accent:${w.color}">
              <div class="wheel-card-icon">${w.icon}</div>
              <h3 class="wheel-card-title">${w.title}</h3>
              <p class="wheel-card-desc">${w.desc}</p>
              <span class="wheel-card-cta">Spin Now →</span>
            </a>
          `).join('')}
        </div>
      </section>

      <!-- FEATURES -->
      <section class="features">
        <h2 class="section-title">Powered by a Real Physics Engine</h2>
        <div class="features-grid">
          <div class="feature"><span class="feature-icon">🔬</span><h3>60fps Canvas</h3><p>Smooth rendering using HTML5 Canvas API</p></div>
          <div class="feature"><span class="feature-icon">⚡</span><h3>Physics Simulation</h3><p>Real acceleration, friction, and deceleration</p></div>
          <div class="feature"><span class="feature-icon">💾</span><h3>Auto-Save</h3><p>Custom lists persist via LocalStorage</p></div>
          <div class="feature"><span class="feature-icon">🔊</span><h3>Audio Engine</h3><p>Synthesized sounds via Web Audio API</p></div>
          <div class="feature"><span class="feature-icon">📱</span><h3>Responsive</h3><p>Works on desktop, tablet, and mobile</p></div>
          <div class="feature"><span class="feature-icon">🌙</span><h3>Dark Mode</h3><p>Toggle between dark and light themes</p></div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="faq">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <div class="faq-list">
          <details class="faq-item"><summary>Is YesAndNoWheel.com free to use?</summary><p>Yes! All wheels and features are completely free with no sign-up required.</p></details>
          <details class="faq-item"><summary>Are the spins truly random?</summary><p>Yes. The physics engine uses Math.random() for initial velocity and the result depends on real-time physics simulation.</p></details>
          <details class="faq-item"><summary>Can I save my custom wheel?</summary><p>Absolutely. All entries, colors, and settings are automatically saved to your browser's LocalStorage.</p></details>
          <details class="faq-item"><summary>Does it work on mobile?</summary><p>Yes! The entire platform is fully responsive.</p></details>
          <details class="faq-item"><summary>How many Truth or Dare questions are there?</summary><p>200+ curated Truth and Dare prompts, categorized from mild to spicy.</p></details>
          <details class="faq-item"><summary>Can I upload my own list?</summary><p>Yes! The Word Wheel supports CSV/TXT file upload, drag-and-drop, and paste.</p></details>
        </div>
      </section>
    </div>`;

  // ---- Yes/No Wheel Logic ----
  let mode = 'yesno'; // 'yesno' or 'yesnomaybe'
  let counts = { yes: 0, no: 0, maybe: 0 };
  let inputSets = 1;

  function getEntries() {
    const base = mode === 'yesno' ? ['Yes', 'No'] : ['Yes', 'No', 'Maybe'];
    const entries = [];
    for (let i = 0; i < inputSets; i++) base.forEach(b => entries.push(b));
    return entries;
  }

  function getColors() {
    return getEntries().map(e => {
      if (e === 'Yes') return '#2d6a30';
      if (e === 'No') return '#d4a017';
      return '#808080';
    });
  }

  const engine = new WheelEngine('yesnoCanvas', {
    entries: getEntries(),
    colors: getColors(),
    showCenterButton: true,
    skipConfetti: true,
    fontSize: 18,
    onTick: () => audioManager.playTick(),
    onResult: (winner) => {
      audioManager.playFanfare();
      const entry = winner.entry;
      if (entry === 'Yes') {
        counts.yes++;
        confetti.celebrate('YES!', '🎉', '#22c55e');
      } else if (entry === 'No') {
        counts.no++;
        confetti.oops('NO!', '😢', '#eab308');
      } else {
        counts.maybe++;
        confetti.maybe('MAYBE!', '🤔', '#9ca3af');
      }
      updateCounters();

      const resultEl = document.getElementById('yesnoResult');
      const emoji = entry === 'Yes' ? '✅' : entry === 'No' ? '❌' : '🤔';
      const colorClass = entry === 'Yes' ? 'yes-result' : entry === 'No' ? 'no-result' : 'maybe-result';
      resultEl.innerHTML = `<div class="result-winner ${colorClass}"><span class="result-emoji">${emoji}</span><span class="result-text">${entry}!</span></div>`;
      resultEl.classList.add('show');
    },
    onSpinStart: () => {
      audioManager.init();
      document.getElementById('yesnoResult').classList.remove('show');
    }
  });

  function updateCounters() {
    document.getElementById('yesCount').textContent = counts.yes;
    document.getElementById('noCount').textContent = counts.no;
    document.getElementById('maybeCount').textContent = counts.maybe;
  }

  function updateWheel() {
    engine.setEntries(getEntries(), getColors());
  }

  // Mode toggle
  document.getElementById('modeYesNo').addEventListener('click', () => {
    mode = 'yesno';
    document.getElementById('modeYesNo').classList.add('active');
    document.getElementById('modeYesNoMaybe').classList.remove('active');
    document.getElementById('maybeCounter').style.display = 'none';
    updateWheel();
  });

  document.getElementById('modeYesNoMaybe').addEventListener('click', () => {
    mode = 'yesnomaybe';
    document.getElementById('modeYesNoMaybe').classList.add('active');
    document.getElementById('modeYesNo').classList.remove('active');
    document.getElementById('maybeCounter').style.display = '';
    updateWheel();
  });

  // Input sets
  document.querySelectorAll('.set-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.set-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      inputSets = parseInt(btn.dataset.sets);
      updateWheel();
    });
  });

  // Reset counts
  document.getElementById('resetCountsBtn').addEventListener('click', () => {
    counts = { yes: 0, no: 0, maybe: 0 };
    updateCounters();
  });

  // Sound toggle
  let soundOn = true;
  document.getElementById('yesnoSoundBtn').addEventListener('click', () => {
    soundOn = !soundOn;
    audioManager.tickEnabled = soundOn;
    audioManager.fanfareEnabled = soundOn;
    document.getElementById('yesnoSoundBtn').classList.toggle('muted', !soundOn);
  });

  return engine;
}
