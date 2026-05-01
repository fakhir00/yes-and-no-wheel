import { audioManager } from '../engine/AudioManager.js';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      // If script is already attached, check if it's loaded by polling its global object (basic check)
      // Actually, if it's attached it might still be loading, so wait a bit or assume loaded.
      // For safety, let's just resolve because Three.js/Cannon are sync once loaded.
      // A better way is to check the global variable:
      if (src.includes('three.min.js') && window.THREE) return resolve();
      if (src.includes('cannon.min.js') && window.CANNON) return resolve();
      if (src.includes('confetti') && window.confetti) return resolve();
      if (src.includes('chart.js') && window.Chart) return resolve();
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function ensureDependencies() {
  return Promise.all([
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'),
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js'),
    loadScript('https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'),
    loadScript('https://cdn.jsdelivr.net/npm/chart.js')
  ]);
}

const DICE_SIZE = 2;

class DicePhysics {
  constructor(containerEl, onResult) {
    this.container = containerEl;
    // Fix aspect ratio instead of full clientWidth to match wheel container exactly
    this.width = this.container.clientWidth || 500;
    this.height = this.container.clientHeight || 500;
    if (this.height < 10) this.height = this.width; // Fallback for zero height containers

    this.probability = 0.5;
    this.isRolling = false;
    this.rollCallback = null;
    this.globalOnResult = onResult;

    this.initThree();
    this.initCannon();
    this.createDice();
    this.createEnvironment();

    this.animFrameId = null;
    this.animate();

    this._resizeHandler = this.onWindowResize.bind(this);
    window.addEventListener('resize', this._resizeHandler);
  }

  destroy() {
    cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('resize', this._resizeHandler);
    if (this.renderer) {
      this.renderer.dispose();
      this.container.removeChild(this.renderer.domElement);
    }
  }

  initThree() {
    this.scene = new window.THREE.Scene();
    this.scene.background = null;

    this.camera = new window.THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 15, 20);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new window.THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = window.THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    const ambientLight = new window.THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new window.THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    this.scene.add(dirLight);
  }

  initCannon() {
    this.world = new window.CANNON.World();
    this.world.gravity.set(0, -40, 0);
    this.world.broadphase = new window.CANNON.NaiveBroadphase();
    this.world.solver.iterations = 20;

    this.floorMat = new window.CANNON.Material();
    this.diceMat = new window.CANNON.Material();

    const contactMaterial = new window.CANNON.ContactMaterial(this.floorMat, this.diceMat, {
      friction: 0.2,
      restitution: 0.6
    });
    this.world.addContactMaterial(contactMaterial);
  }

  createTextDisplay(text, colorHex, bgColorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgColorHex;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 20;
    ctx.strokeRect(10, 10, 492, 492);

    ctx.fillStyle = colorHex;
    ctx.font = 'bold 160px "Outfit", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 256);

    const texture = new window.THREE.CanvasTexture(canvas);
    return new window.THREE.MeshStandardMaterial({ map: texture, roughness: 0.3, metalness: 0.1 });
  }

  updateDiceFaces(probYes) {
    let numYes = Math.round(probYes * 6);
    let numNo = 6 - numYes;

    const matYes = this.createTextDisplay('YES', '#ffffff', '#10b981');
    const matNo = this.createTextDisplay('NO', '#ffffff', '#ef4444');

    this.materials = [];
    this.faceAssignments = [];

    for (let i = 0; i < 6; i++) {
      if (i < numYes) {
        this.materials.push(matYes);
        this.faceAssignments.push('YES');
      } else {
        this.materials.push(matNo);
        this.faceAssignments.push('NO');
      }
    }

    for (let i = this.materials.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.materials[i], this.materials[j]] = [this.materials[j], this.materials[i]];
      [this.faceAssignments[i], this.faceAssignments[j]] = [this.faceAssignments[j], this.faceAssignments[i]];
    }

    if (this.diceMesh) {
      this.diceMesh.material = this.materials;
    }
  }

  createDice() {
    const geometry = new window.THREE.BoxGeometry(DICE_SIZE, DICE_SIZE, DICE_SIZE);
    this.updateDiceFaces(0.5);
    this.diceMesh = new window.THREE.Mesh(geometry, this.materials);
    this.diceMesh.castShadow = true;
    this.diceMesh.receiveShadow = true;
    this.scene.add(this.diceMesh);

    const shape = new window.CANNON.Box(new window.CANNON.Vec3(DICE_SIZE / 2, DICE_SIZE / 2, DICE_SIZE / 2));
    this.diceBody = new window.CANNON.Body({ mass: 1, material: this.diceMat, shape: shape });

    this.diceBody.position.set(0, 15, 0);
    this.world.addBody(this.diceBody);

    this.diceMesh.position.copy(this.diceBody.position);
    this.diceMesh.quaternion.copy(this.diceBody.quaternion);
  }

  createEnvironment() {
    const planeShape = new window.CANNON.Plane();
    const planeBody = new window.CANNON.Body({ mass: 0, material: this.floorMat });
    planeBody.addShape(planeShape);
    planeBody.quaternion.setFromAxisAngle(new window.CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    this.world.addBody(planeBody);

    const planeGeom = new window.THREE.PlaneGeometry(100, 100);
    const planeMat = new window.THREE.ShadowMaterial({ opacity: 0.3 });
    const planeMesh = new window.THREE.Mesh(planeGeom, planeMat);
    planeMesh.rotation.x = -Math.PI / 2;
    planeMesh.position.y = 0;
    planeMesh.receiveShadow = true;
    this.scene.add(planeMesh);

    const wallThickness = 1;
    const w1 = new window.CANNON.Body({ mass: 0, shape: new window.CANNON.Box(new window.CANNON.Vec3(10, 10, wallThickness)) });
    w1.position.set(0, 5, -6);
    this.world.addBody(w1);

    const w2 = new window.CANNON.Body({ mass: 0, shape: new window.CANNON.Box(new window.CANNON.Vec3(10, 10, wallThickness)) });
    w2.position.set(0, 5, 6);
    this.world.addBody(w2);

    const w3 = new window.CANNON.Body({ mass: 0, shape: new window.CANNON.Box(new window.CANNON.Vec3(wallThickness, 10, 10)) });
    w3.position.set(-6, 5, 0);
    this.world.addBody(w3);

    const w4 = new window.CANNON.Body({ mass: 0, shape: new window.CANNON.Box(new window.CANNON.Vec3(wallThickness, 10, 10)) });
    w4.position.set(6, 5, 0);
    this.world.addBody(w4);
  }

  roll(probabilityYes) {
    if (this.isRolling) return;
    this.isRolling = true;

    this.updateDiceFaces(probabilityYes);

    this.diceBody.position.set(
      (Math.random() - 0.5) * 4,
      12 + Math.random() * 5,
      (Math.random() - 0.5) * 4
    );
    this.diceBody.velocity.set(
      (Math.random() - 0.5) * 10,
      -10,
      (Math.random() - 0.5) * 10
    );

    const spinSpeed = 20;
    this.diceBody.angularVelocity.set(
      Math.random() * spinSpeed,
      Math.random() * spinSpeed,
      Math.random() * spinSpeed
    );

    this.diceBody.quaternion.setFromEuler(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
  }

  getTopFace() {
    const normals = [
      new window.THREE.Vector3(1, 0, 0),
      new window.THREE.Vector3(-1, 0, 0),
      new window.THREE.Vector3(0, 1, 0),
      new window.THREE.Vector3(0, -1, 0),
      new window.THREE.Vector3(0, 0, 1),
      new window.THREE.Vector3(0, 0, -1)
    ];

    const diceQuaternion = this.diceMesh.quaternion;
    let maxDot = -Infinity;
    let winningIndex = 0;
    const upVector = new window.THREE.Vector3(0, 1, 0);

    normals.forEach((normal, index) => {
      const worldNormal = normal.clone().applyQuaternion(diceQuaternion);
      const dotProduct = worldNormal.dot(upVector);
      if (dotProduct > maxDot) {
        maxDot = dotProduct;
        winningIndex = index;
      }
    });

    return this.faceAssignments[winningIndex];
  }

  animate() {
    this.animFrameId = requestAnimationFrame(this.animate.bind(this));

    this.world.step(1 / 60);
    this.diceMesh.position.copy(this.diceBody.position);
    this.diceMesh.quaternion.copy(this.diceBody.quaternion);

    if (this.isRolling) {
      const v = this.diceBody.velocity.lengthSquared();
      const w = this.diceBody.angularVelocity.lengthSquared();

      if (v < 0.01 && w < 0.01 && this.diceBody.position.y < DICE_SIZE) {
        this.isRolling = false;
        const result = this.getTopFace();
        if (this.globalOnResult) {
          this.globalOnResult(result);
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    if (!this.container) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    if (this.height < 10) this.height = this.width;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }
}

export async function renderYesNoDice(container) {
  // Inject HTML Shell — mirrors HomePage.js yesno-section exactly
  container.innerHTML = `
    <div class="home-page">
      <section class="yesno-section">
        <div class="yesno-header">
          <h1 class="hero-title" id="homeHeroTitle">🎲 Yes and No Dice</h1>
          <h2 class="hero-subtitle" id="homeHeroSubtitle">Roll the 3D dice for interactive, gamified decision-making.</h2>
        </div>

        <div class="dice-premium-layout">
          <!-- LEFT: 3D Canvas -->
          <div class="dice-premium-canvas-area">
            <div class="dice-premium-overlay">
              <div id="diceStatus" class="dice-premium-status">
                <div class="dice-premium-status-dot"></div>
                <span>Ready to roll</span>
              </div>
            </div>
            <div class="dice-premium-canvas-wrapper" id="diceCanvasContainer">
              <div id="diceLoading" class="dice-loading-overlay">Loading 3D Engine...</div>
            </div>
            <div id="diceResultDisplay" class="dice-premium-result-pop"></div>
          </div>

          <!-- RIGHT: Controls & Insights -->
          <div class="dice-premium-sidebar">
            <div class="dice-premium-card" style="padding: 10px;">
              <button class="dice-premium-roll-btn" id="rollDiceBtn" disabled>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                Roll Dice
              </button>
              <div class="dice-premium-shortcut">Press <kbd>SPACE</kbd> to roll</div>
            </div>

            <div class="dice-premium-card">
              <div class="dice-premium-card-title">Settings</div>
              <div class="yesno-mode-row">
                <label style="display:block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Mode</label>
                <div class="mode-toggle-group">
                  <button class="mode-btn active" data-val="1">Single</button>
                  <button class="mode-btn" data-val="3">Best of 3</button>
                  <button class="mode-btn" data-val="5">Best of 5</button>
                </div>
              </div>

              <div class="yesno-sets-row" style="margin-top: 24px;">
                <label style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">
                  <span>Probability</span>
                  <span><span id="diceProbLabelYes" style="color: var(--success); font-weight: bold;">50% Yes</span> <span style="opacity:0.3">|</span> <span id="diceProbLabelNo" style="color: var(--danger); font-weight: bold;">50% No</span></span>
                </label>
                <input type="range" id="diceProbSlider" min="0" max="100" value="50" step="10" class="dice-prob-slider">
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">
                <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin:0;">Auto-roll</label>
                <label class="toggle-switch">
                  <input type="checkbox" id="diceAutoRoll">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="dice-premium-card">
              <div class="dice-premium-card-title">Live Statistics</div>
              <div class="dice-premium-mini-stats">
                <div class="dice-premium-stat-box">
                  <div class="dice-premium-stat-label">Yes</div>
                  <div class="dice-premium-stat-value yes" id="diceStatYes">0</div>
                </div>
                <div class="dice-premium-stat-box">
                  <div class="dice-premium-stat-label">No</div>
                  <div class="dice-premium-stat-value no" id="diceStatNo">0</div>
                </div>
                <div class="dice-premium-stat-box">
                  <div class="dice-premium-stat-label">Total Rolls</div>
                  <div class="dice-premium-stat-value" id="diceStatTotal">0</div>
                </div>
                <div class="dice-premium-stat-box">
                  <div class="dice-premium-stat-label">Win Rate</div>
                  <div class="dice-premium-stat-value" id="diceStatWinRate">0%</div>
                </div>
              </div>
            </div>

            <!-- Psychology Modal (Inline Card) -->
            <div id="dicePsychSection" class="dice-premium-card dice-premium-psych">
              <div class="dice-premium-card-title" style="color: var(--accent-tertiary)">Your Reaction Matters</div>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">Usually, your initial reaction to a random result matters more than the result itself. It reveals what you truly wanted all along.</p>
              <div class="dice-premium-psych-btns">
                <button id="dicePsychYes" class="dice-premium-psych-btn">😊 Glad</button>
                <button id="dicePsychNo" class="dice-premium-psych-btn">😕 Wanted the other</button>
              </div>
              <p id="dicePsychConclusion" style="display: none; margin-top: 15px; font-size: 0.85rem; color: var(--text-primary); font-weight: 700;"></p>
            </div>
          </div>
        </div>

      </section>

      <!-- SEO Content -->
      <section class="wheel-seo-content page-content">
        <section class="content-section">
          <h1>Yes and No Dice</h1>
          <p>Using the yes and no dice is simple and fun. Just click the Roll Dice button to launch the 3D physics dice into the air. The dice tumbles realistically and lands on either Yes or No, giving you a clear answer in seconds. You can customize the probability slider to weight your rolls toward Yes or No, making it ideal for situations where one outcome feels slightly more likely. Choose between Single, Best of 3, or Best of 5 modes to add extra rounds to your decision. The tool works on any device, no downloads needed. If you want a more traditional spinner, try our <a href="/">yes or no wheel</a>.</p>
        </section>

        <section class="content-section">
          <h2>How to Use Yes and No Dice Online</h2>
          <p>Whether you need a quick answer for a small daily choice or are using it for a game, rolling the dice is an intuitive way to decide. This 3D physics engine ensures every roll is independent and fair. If you are looking for more complex options, try our <a href="/wheel-of-fate/">random decision maker tool</a> which allows for custom entries.</p>
        </section>

        <section class="content-section">
          <h2>Yes or No Dice for Quick Decisions</h2>
          <p>Struggling with a small decision? The yes or no dice makes it effortless. Whether you need to decide if you should order takeout, skip the gym, or text someone back, this dice gives you a fast, no-pressure answer. It removes the stress of overthinking everyday choices. The 3D physics engine makes every roll feel real and satisfying. Unlike a basic <a href="/oracle/">coin flip tool</a>, the dice adds visual excitement and gamification to your decision-making process. Roll once for an instant verdict, or use Best of 5 for bigger choices.</p>
        </section>

        <section class="content-section">
          <h2>Random Yes No Generator with Dice</h2>
          <p>This random yes no generator uses a physically simulated 3D dice to produce unbiased results. Each roll is powered by a real-time physics engine with gravity, spin, and bounce, so the outcome is genuinely random and unpredictable. The probability slider lets you adjust the odds from 0% to 100% Yes, giving you control when you want weighted randomness. Track your results with the built-in insights panel showing total rolls, streaks, and a visual ratio chart. Every roll is stored locally, so your stats persist across sessions.</p>
        </section>

        <section class="content-section">
          <h2>Should I Do It? Use Yes and No Dice</h2>
          <p>When you are stuck asking yourself "should I do it?", let the yes and no dice decide for you. Sometimes the best way to find clarity is to let chance reveal how you really feel. After each roll, the optional psychology mode asks if you are happy with the result. Your reaction often reveals your true preference more than any rational analysis could. If the dice says No but you feel disappointed, you already know your real answer. This tool turns indecision into self-discovery with every roll.</p>
        </section>

        <section class="content-section">
          <h2>Online Decision Maker Dice Tool</h2>
          <p>This online decision maker dice tool combines advanced 3D physics with a clean, intuitive interface. It is designed to be more engaging than a basic yes/no generator. Features include adjustable probability weighting, multi-round series modes, auto-roll sequences, and a live statistics dashboard. The confetti celebration on Yes results adds a rewarding touch to every positive outcome. The tool is completely free, works on mobile and desktop, and requires no sign-up. It is the most feature-rich yes and no dice tool available online.</p>
        </section>
      </section>

      <!-- FAQ Section -->
      <section class="faq wheel-faq">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <div class="faq-list">
          <details class="faq-item">
            <summary>What is a yes and no dice?</summary>
            <p>A yes and no dice is a digital decision-making tool that simulates rolling a physical dice. Instead of numbers, the faces show Yes or No. You roll it whenever you need a quick, random answer to a binary question. It is a fun alternative to coin flips.</p>
          </details>

          <details class="faq-item">
            <summary>Is yes and no dice truly random?</summary>
            <p>Yes, the dice uses a real-time 3D physics simulation with randomized spin, velocity, and position for each roll. The result depends on how the dice physically settles, making it genuinely unpredictable. You can also adjust the probability slider for weighted outcomes.</p>
          </details>

          <details class="faq-item">
            <summary>Can I use yes and no dice for decisions?</summary>
            <p>Absolutely. The yes and no dice is perfect for everyday decisions like what to eat, whether to go out, or choosing between two options. For bigger decisions, try the Best of 5 mode or use the psychology feature to discover your true preference.</p>
          </details>

          <details class="faq-item">
            <summary>How does this dice generator work?</summary>
            <p>The tool uses Three.js for 3D rendering and Cannon.js for physics simulation. When you click Roll, the dice is launched with random force and spin. It bounces off invisible walls and settles naturally. The top face determines your Yes or No result.</p>
          </details>

          <details class="faq-item">
            <summary>Is this better than a coin flip?</summary>
            <p>The yes and no dice offers several advantages over a coin flip. It includes adjustable probability weighting, multi-round modes, streak tracking, visual statistics, and a psychology feature. The 3D animation also makes it more engaging and satisfying to use than a simple heads or tails flip.</p>
          </details>
        </div>
      </section>
    </div>
  `;

  // Wait for heavy dependencies
  await ensureDependencies();
  document.getElementById('diceLoading').style.display = 'none';

  // --- STATE ---
  let state = {
    totalRolls: 0,
    yesCount: 0,
    noCount: 0,
    currentStreak: 0,
    streakType: null,
    history: []
  };
  const savedState = localStorage.getItem('yesnodice_state');
  if (savedState) state = JSON.parse(savedState);

  let rollMode = 1;
  let currentSeries = [];

  // --- DOM Elements (dice-prefixed IDs to avoid homepage clash) ---
  const probSlider = document.getElementById('diceProbSlider');
  const probLabelYes = document.getElementById('diceProbLabelYes');
  const probLabelNo = document.getElementById('diceProbLabelNo');
  const rollDiceBtn = document.getElementById('rollDiceBtn');
  const resultDisplay = document.getElementById('diceResultDisplay');
  const modeBtns = container.querySelectorAll('.mode-btn');
  const autoRollToggle = document.getElementById('diceAutoRoll');

  const psychSection = document.getElementById('dicePsychSection');
  const psychYesBtn = document.getElementById('dicePsychYes');
  const psychNoBtn = document.getElementById('dicePsychNo');
  const psychConclusion = document.getElementById('dicePsychConclusion');

  const statusBadge = document.getElementById('diceStatus');
  const statTotal = document.getElementById('diceStatTotal');
  // Activate Button
  rollDiceBtn.disabled = false;

  function updateStatsUI() {
    if (statTotal) statTotal.innerText = state.totalRolls;

    // Main Stats
    const yesVal = document.getElementById('diceStatYes');
    const noVal = document.getElementById('diceStatNo');
    if (yesVal) yesVal.innerText = state.yesCount;
    if (noVal) noVal.innerText = state.noCount;

    // Mini Stats
    const winRateVal = document.getElementById('diceStatWinRate');
    if (winRateVal) {
      const rate = state.totalRolls > 0 ? Math.round((state.yesCount / state.totalRolls) * 100) : 0;
      winRateVal.innerText = rate + '%';
    }

    // Streaks
    const streakYes = document.getElementById('diceStatStreakYes');
    const streakNo = document.getElementById('diceStatStreakNo');
    if (streakYes) streakYes.innerText = (state.streakType === 'YES' ? state.currentStreak : 0);
    if (streakNo) streakNo.innerText = (state.streakType === 'NO' ? state.currentStreak : 0);

    localStorage.setItem('yesnodice_state', JSON.stringify(state));
  }

  function updateHistoryUI() {
    // History list removed in new layout to match image
  }

  // --- LOGIC ---
  probSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    probLabelYes.innerText = val + '% Yes';
    probLabelNo.innerText = (100 - val) + '% No';
    e.target.style.background = 'linear-gradient(90deg, #10b981 ' + val + '%, #ef4444 ' + val + '%)';
  });

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      rollMode = parseInt(btn.dataset.val);
      currentSeries = [];
      resultDisplay.innerHTML = '';
      resultDisplay.classList.remove('show');
    });
  });

  function showResult(text, isYes) {
    const colorClass = isYes ? 'yes' : 'no';
    resultDisplay.innerHTML = '<div class="dice-premium-result-text ' + colorClass + '">' + text + '</div>';
    resultDisplay.classList.add('show');
  }

  function showPsychologyMode(result) {
    psychSection.classList.add('show');
    psychSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    psychConclusion.style.display = 'none';

    psychYesBtn.onclick = () => finishPsych(true, result);
    psychNoBtn.onclick = () => finishPsych(false, result);
  }

  function finishPsych(happy, result) {
    psychConclusion.style.display = 'block';
    if (happy) {
      psychConclusion.innerText = "Awesome! Your intuition satisfies the dice. Proceed with confidence!";
    } else {
      const opposite = result === 'YES' ? 'NO' : 'YES';
      psychConclusion.innerHTML = 'You secretly wanted <span style="text-decoration: underline;">' + opposite + '</span>! Ignore the outcome and follow your heart.';
    }
  }

  const diceEngine = new DicePhysics(document.getElementById('diceCanvasContainer'), (result) => {
    handleResult(result);
  });

  function doRoll() {
    if (diceEngine.isRolling) return;
    audioManager.init();
    audioManager.playTick();

    resultDisplay.classList.remove('show');
    resultDisplay.innerHTML = '';
    psychSection.classList.remove('show');

    if (statusBadge) {
      statusBadge.classList.add('rolling');
      statusBadge.querySelector('span:last-child').innerText = 'Rolling...';
    }

    if (navigator.vibrate) navigator.vibrate(50);
    const probYes = parseInt(probSlider.value) / 100;
    rollDiceBtn.disabled = true;
    diceEngine.roll(probYes);
  }

  function handleResult(result) {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    audioManager.playFanfare();

    const isYes = result === 'YES';

    if (rollMode > 1) {
      currentSeries.push(result);
      showResult(result + '!', isYes);

      const winsNeeded = Math.ceil(rollMode / 2);
      let yesC = currentSeries.filter(x => x === 'YES').length;
      let noC = currentSeries.filter(x => x === 'NO').length;

      if (yesC >= winsNeeded || noC >= winsNeeded) {
        const finalWinner = yesC > noC ? 'YES' : 'NO';
        setTimeout(() => {
          showResult(finalWinner + ' WINS!', finalWinner === 'YES');
          currentSeries = [];
          processFinalResult(finalWinner);
        }, 1000);
      } else {
        setTimeout(doRoll, 1000);
      }
    } else {
      showResult(result + '!', isYes);
      processFinalResult(result);
    }
  }

  function processFinalResult(result) {
    state.totalRolls++;
    if (result === 'YES') state.yesCount++;
    else state.noCount++;

    if (state.streakType === result) state.currentStreak++;
    else {
      state.streakType = result;
      state.currentStreak = 1;
    }

    state.history = state.history || [];
    state.history.push(result);
    if (state.history.length > 50) state.history.shift();

    if (statusBadge) {
      statusBadge.classList.remove('rolling');
      statusBadge.querySelector('span:last-child').innerText = 'Ready to roll';
    }

    updateStatsUI();

    if (result === 'YES') {
      window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#10b981', '#ffffff'] });
    }

    rollDiceBtn.disabled = false;

    // Psychology mode (20% chance on single rolls)
    if (rollMode === 1 && Math.random() < 0.2) {
      setTimeout(() => showPsychologyMode(result), 1500);
    } else if (autoRollToggle.checked) {
      setTimeout(doRoll, 2500);
    }
  }

  rollDiceBtn.addEventListener('click', doRoll);

  // Space key roll
  const handleKeydown = (e) => {
    if (e.code === 'Space' && !diceEngine.isRolling) {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      e.preventDefault();
      doRoll();
    }
  };
  window.addEventListener('keydown', handleKeydown);

  updateStatsUI();
  updateHistoryUI();

  return {
    destroy: () => {
      window.removeEventListener('keydown', handleKeydown);
      diceEngine.destroy();
    }
  };
}
