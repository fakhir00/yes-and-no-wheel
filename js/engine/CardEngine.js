// CardEngine.js — Handles drawing and flipping cards for Tarot and Oracle tools
import { audioManager } from './AudioManager.js';

export class CardEngine {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) throw new Error(\`Container \${containerId} not found\`);

    this.options = {
      entries: options.entries || [], // Array of objects: { title, answer, meaning, image, icon }
      defaultBackImage: options.defaultBackImage || '/images/tools/card-back-mystic.png',
      onDraw: options.onDraw || null,
      theme: options.theme || '',
      ...options
    };

    this.isDrawing = false;
    this.hasDrawn = false;
    this.initHTML();
  }

  initHTML() {
    this.container.innerHTML = \`
      <div class="card-engine-wrap \${this.options.theme}">
        <div class="card-deck-area">
          <div class="card-scene">
            <div class="card-object" id="activeCard">
              <div class="card-face card-back" style="background-image: url('\${this.options.defaultBackImage}')"></div>
              <div class="card-face card-front">
                <div class="card-front-inner">
                  <div class="card-icon" id="cardIcon">✨</div>
                  <h3 class="card-title" id="cardTitle">Card Title</h3>
                  <div class="card-answer" id="cardAnswer">Yes</div>
                </div>
              </div>
            </div>
          </div>
          <button class="draw-btn" id="drawBtn">
            <span class="draw-btn-text">Draw a Card</span>
            <div class="draw-btn-glow"></div>
          </button>
        </div>
        <div class="card-result-panel" id="cardResultPanel">
          <h4 id="resultTitle"></h4>
          <p id="resultMeaning"></p>
        </div>
      </div>
    \`;

    this.cardEl = this.container.querySelector('#activeCard');
    this.drawBtn = this.container.querySelector('#drawBtn');
    this.resultPanel = this.container.querySelector('#cardResultPanel');
    
    this.drawBtn.addEventListener('click', () => this.drawCard());
    this.cardEl.addEventListener('click', () => {
      if (!this.hasDrawn && !this.isDrawing) this.drawCard();
    });
  }

  setEntries(newEntries) {
    this.options.entries = newEntries;
  }

  drawCard() {
    if (this.isDrawing) return;
    if (this.options.entries.length === 0) return;

    this.isDrawing = true;
    
    // Reset if previously drawn
    if (this.hasDrawn) {
      this.cardEl.classList.remove('is-flipped');
      this.resultPanel.classList.remove('show');
      
      // Wait for flip back animation before drawing new
      setTimeout(() => this.executeDraw(), 400); 
    } else {
      this.executeDraw();
    }
  }

  executeDraw() {
    audioManager.init();
    audioManager.playTick(); // Play a shuffle/draw sound
    this.drawBtn.disabled = true;

    // Pick random card
    const idx = Math.floor(Math.random() * this.options.entries.length);
    const card = this.options.entries[idx];

    // Populate front
    this.container.querySelector('#cardIcon').textContent = card.icon || '✨';
    this.container.querySelector('#cardTitle').textContent = card.title;
    
    const ansEl = this.container.querySelector('#cardAnswer');
    ansEl.textContent = card.answer || '';
    ansEl.className = 'card-answer ' + (card.answer ? card.answer.toLowerCase() : '');

    // Add brief delay for suspense, then flip
    setTimeout(() => {
      this.cardEl.classList.add('is-flipped');
      audioManager.playFanfare(); // Play reveal sound
      
      // Show meaning
      setTimeout(() => {
        this.container.querySelector('#resultTitle').innerHTML = \`You drew: <strong>\${card.title}</strong>\`;
        this.container.querySelector('#resultMeaning').textContent = card.meaning || '';
        this.resultPanel.classList.add('show');
        
        this.isDrawing = false;
        this.hasDrawn = true;
        this.drawBtn.disabled = false;
        this.drawBtn.querySelector('.draw-btn-text').textContent = 'Draw Another Card';

        if (this.options.onDraw) this.options.onDraw(card);
      }, 500);
      
    }, 400);
  }
}
