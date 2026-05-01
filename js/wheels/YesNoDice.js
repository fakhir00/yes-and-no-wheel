import { audioManager } from '../engine/AudioManager.js';
import { createResultOnlyMode } from '../wheels/resultOnlyMode.js';

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
  ]).then(() => {
    return loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/geometries/RoundedBoxGeometry.js');
  });
}

const DICE_SIZE = 3.5;

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

  createTextDisplay(text, colorHex, bgColor1, bgColor2) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 1. Fill entire face with white (to act as the white dice body)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);

    // 2. Draw a rounded colored inner square for the face
    const padding = 30;
    const size = 512 - padding * 2;
    const radius = 60;
    
    ctx.beginPath();
    ctx.moveTo(padding + radius, padding);
    ctx.lineTo(padding + size - radius, padding);
    ctx.quadraticCurveTo(padding + size, padding, padding + size, padding + radius);
    ctx.lineTo(padding + size, padding + size - radius);
    ctx.quadraticCurveTo(padding + size, padding + size, padding + size - radius, padding + size);
    ctx.lineTo(padding + radius, padding + size);
    ctx.quadraticCurveTo(padding, padding + size, padding, padding + size - radius);
    ctx.lineTo(padding, padding + radius);
    ctx.quadraticCurveTo(padding, padding, padding + radius, padding);
    ctx.closePath();

    const grad = ctx.createLinearGradient(padding, padding, padding, padding + size);
    grad.addColorStop(0, bgColor1);
    grad.addColorStop(1, bgColor2);
    ctx.fillStyle = grad;
    
    // Add inner glow/shadow to the inset
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;
    ctx.fill();

    // Reset shadow for text
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Text
    ctx.fillStyle = colorHex;
    ctx.font = '900 140px "Outfit", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 256 + 10); // slight y adjustment for Outfit font baseline

    const texture = new window.THREE.CanvasTexture(canvas);
    texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    
    return new window.THREE.MeshStandardMaterial({ 
      map: texture, 
      roughness: 0.15, 
      metalness: 0.1 
    });
  }

  updateDiceFaces(probYes) {
    let numYes = Math.round(probYes * 6);
    let numNo = 6 - numYes;

    const matYes = this.createTextDisplay('YES', '#ffffff', '#34d399', '#059669');
    const matNo = this.createTextDisplay('NO', '#ffffff', '#fb7185', '#be123c');

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
    let geometry;
    if (window.THREE.RoundedBoxGeometry) {
      geometry = new window.THREE.RoundedBoxGeometry(DICE_SIZE, DICE_SIZE, DICE_SIZE, 6, 0.5);
    } else {
      geometry = new window.THREE.BoxGeometry(DICE_SIZE, DICE_SIZE, DICE_SIZE);
    }
    
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
    const planeMat = new window.THREE.ShadowMaterial({ opacity: 0.4 });
    const planeMesh = new window.THREE.Mesh(planeGeom, planeMat);
    planeMesh.rotation.x = -Math.PI / 2;
    planeMesh.position.y = 0;
    planeMesh.receiveShadow = true;
    this.scene.add(planeMesh);

    // Glowing rings on the floor
    const ringGeom = new window.THREE.RingGeometry(7, 7.5, 64);
    const ringMat = new window.THREE.MeshBasicMaterial({ color: 0x00ffff, side: window.THREE.DoubleSide, transparent: true, opacity: 0.5, blending: window.THREE.AdditiveBlending });
    const ringMesh = new window.THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.01;
    this.scene.add(ringMesh);
    
    const ringGeom2 = new window.THREE.RingGeometry(6.5, 7, 64);
    const ringMat2 = new window.THREE.MeshBasicMaterial({ color: 0xff00ff, side: window.THREE.DoubleSide, transparent: true, opacity: 0.5, blending: window.THREE.AdditiveBlending });
    const ringMesh2 = new window.THREE.Mesh(ringGeom2, ringMat2);
    ringMesh2.rotation.x = -Math.PI / 2;
    ringMesh2.position.y = 0.01;
    this.scene.add(ringMesh2);

    // Starry Background
    const starGeom = new window.THREE.BufferGeometry();
    const starCount = 300;
    const starPos = new Float32Array(starCount * 3);
    for(let i=0; i<starCount*3; i++) {
        starPos[i] = (Math.random() - 0.5) * 150;
    }
    starGeom.setAttribute('position', new window.THREE.BufferAttribute(starPos, 3));
    const starMat = new window.THREE.PointsMaterial({ color: 0xffffff, size: 0.2, transparent: true, opacity: 0.8 });
    this.stars = new window.THREE.Points(starGeom, starMat);
    this.scene.add(this.stars);

    const wallThickness = 1;
    const w1 = new window.CANNON.Body({ mass: 0, shape: new window.CANNON.Box(new window.CANNON.Vec3(15, 15, wallThickness)) });
    w1.position.set(0, 5, -8);
    this.world.addBody(w1);

    const w2 = new window.CANNON.Body({ mass: 0, shape: new window.CANNON.Box(new window.CANNON.Vec3(15, 15, wallThickness)) });
    w2.position.set(0, 5, 8);
    this.world.addBody(w2);

    const w3 = new window.CANNON.Body({ mass: 0, shape: new window.CANNON.Box(new window.CANNON.Vec3(wallThickness, 15, 15)) });
    w3.position.set(-8, 5, 0);
    this.world.addBody(w3);

    const w4 = new window.CANNON.Body({ mass: 0, shape: new window.CANNON.Box(new window.CANNON.Vec3(wallThickness, 15, 15)) });
    w4.position.set(8, 5, 0);
    this.world.addBody(w4);
  }

  roll(probabilityYes) {
    if (this.isRolling) return;
    this.isRolling = true;

    this.updateDiceFaces(probabilityYes);

    if (this.diceBody.wakeUp) this.diceBody.wakeUp();

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

        <div class="yesno-layout">
          <div class="yesno-wheel-area">
            <div class="wheel-canvas-container yesno-canvas-wrap" id="diceCanvasContainer">
              <div id="diceLoading" class="dice-loading-overlay">Loading 3D Engine...</div>
            </div>
            <div class="yesno-sound-toggle">
              <div id="diceStatus" class="ready-pill" style="margin-bottom:0; background: transparent; border: none; font-size: 0.75rem; color: var(--text-muted);">
                 <span style="opacity: 0.6;">Click or press SPACE</span>
              </div>
            </div>
          </div>

          <div class="yesno-controls">
            <div class="yesno-counters">
              <div class="yesno-counter yes-counter">
                <span class="counter-num" id="diceStatYes">0</span>
                <span class="counter-label">Yes</span>
              </div>
              <div class="yesno-counter no-counter">
                <span class="counter-num" id="diceStatNo">0</span>
                <span class="counter-label">No</span>
              </div>
            </div>
            <button class="reset-counts-btn" id="diceResetBtn" style="margin-bottom: var(--space-md);">↻ Reset Stats</button>

            <button id="rollDiceBtn" disabled style="width: 100%; margin-bottom: var(--space-lg); font-size: 1.1rem; padding: 12px; border-radius: 8px; background: var(--gradient-primary); color: white; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">
              Roll Dice
            </button>

            <div class="yesno-inputs-panel">
              <div class="inputs-header">
                <p>Settings</p>
              </div>
              <div class="yesno-mode-row">
                <label>Mode</label>
                <div class="mode-toggle-group">
                  <button class="mode-btn active" data-val="1">Single</button>
                  <button class="mode-btn" data-val="3">Best of 3</button>
                  <button class="mode-btn" data-val="5">Best of 5</button>
                </div>
              </div>
              <div class="yesno-sets-row" style="margin-top: 15px;">
                <label style="display: flex; justify-content: space-between;">
                  <span>Probability</span>
                  <span><span id="diceProbLabelYes" style="color: var(--success);">50% Yes</span> <span style="opacity:0.4;">|</span> <span id="diceProbLabelNo" style="color: var(--danger);">50% No</span></span>
                </label>
                <input type="range" id="diceProbSlider" min="0" max="100" value="50" step="10" class="dice-prob-slider" style="margin-top: 5px;">
              </div>
              <div class="yesno-sets-row" style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center;">
                <label style="margin:0;">Auto-roll</label>
                <label class="toggle-switch">
                  <input type="checkbox" id="diceAutoRoll">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Result display -->
        <div class="result-display yesno-result-display" id="diceResultDisplay"></div>

        <!-- Psychology Section -->
        <section id="dicePsychSection" class="wheel-instructions howto-tutorial-style" style="max-width: 900px; margin: 2rem auto 0; display: none;">
          <h2>Your Reaction Matters</h2>
          <p class="howto-intro">Usually, your initial reaction to a random result matters more than the result itself. It reveals what you truly wanted all along.</p>
          <div class="reaction-btns" style="display: flex; gap: 1rem; justify-content: center; margin: 2rem 0;">
            <button id="dicePsychYes" class="reset-counts-btn" style="background: var(--bg-card); border-radius: 50px; padding: 12px 30px;">😊 Glad</button>
            <button id="dicePsychNo" class="reset-counts-btn" style="background: var(--bg-card); border-radius: 50px; padding: 12px 30px;">😕 Wanted the other</button>
          </div>
          <p id="dicePsychConclusion" style="text-align: center; color: var(--accent-primary); font-weight: 700; min-height: 24px;"></p>
        </section>

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
  const resetBtn = document.getElementById('diceResetBtn');

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.yesCount = 0;
      state.noCount = 0;
      state.totalRolls = 0;
      state.currentStreak = 0;
      state.streakType = null;
      updateStatsUI();
    });
  }

  // Activate Button
  rollDiceBtn.disabled = false;

  const yesnoResultMode = createResultOnlyMode({
    root: container,
    resultSelector: '#diceResultDisplay',
    layoutSelector: '.yesno-layout',
    mainSelector: null,
    sectionSelector: '.yesno-section',
    spinAgainText: 'Roll Again',
    buttonClassName: 'home-spin-again-btn',
    onSpinAgain: () => {}
  });

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

  function showResult(text, isYes, isFinal = true) {
    const emoji = isYes ? '✅' : '❌';
    const colorClass = isYes ? 'yes-result' : 'no-result';
    resultDisplay.innerHTML = '<div class="result-winner ' + colorClass + '"><span class="result-emoji">' + emoji + '</span><span class="result-text">' + text + '</span></div>';
    resultDisplay.classList.add('show');
    if (isFinal) {
      yesnoResultMode.showResultOnly();
    }
  }

  function showPsychologyMode(result) {
    psychSection.style.display = 'block';
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

    yesnoResultMode.hideResultOnly();
    resultDisplay.classList.remove('show');
    resultDisplay.innerHTML = '';
    psychSection.style.display = 'none';

    if (statusBadge) {
      statusBadge.classList.add('rolling');
      statusBadge.querySelector('span:last-child').innerText = 'Rolling...';
    }

    if (navigator.vibrate) navigator.vibrate(50);
    let probYes = parseFloat(probSlider.value) / 100;
    if (isNaN(probYes)) probYes = 0.5;
    
    rollDiceBtn.disabled = true;
    diceEngine.roll(probYes);
  }

  function handleResult(result) {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    audioManager.playFanfare();

    const isYes = result === 'YES';

    if (rollMode > 1) {
      currentSeries.push(result);
      showResult(result + '!', isYes, false);

      const winsNeeded = Math.ceil(rollMode / 2);
      let yesC = currentSeries.filter(x => x === 'YES').length;
      let noC = currentSeries.filter(x => x === 'NO').length;

      if (yesC >= winsNeeded || noC >= winsNeeded) {
        const finalWinner = yesC > noC ? 'YES' : 'NO';
        setTimeout(() => {
          showResult(finalWinner + ' WINS!', finalWinner === 'YES', true);
          currentSeries = [];
          processFinalResult(finalWinner);
        }, 1000);
      } else {
        setTimeout(doRoll, 1000);
      }
    } else {
      showResult(result + '!', isYes, true);
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
