// AboutPage.js
export function renderAboutPage(container) {
  container.innerHTML = `
    <div class="static-page">
      <h1 class="page-title">About YesAndNoWheel.com</h1>

      <div class="page-content">
        <section class="content-section">
          <h2>Our Mission</h2>
          <p>YesAndNoWheel.com is the ultimate decision-making hub, designed to make choosing fun, fair, and exciting. Whether you're picking a random student in class, deciding what to eat, or settling a debate with friends, our physics-based spinning wheels deliver truly random results with style.</p>
        </section>

        <section class="content-section">
          <h2>What We Offer</h2>
          <div class="about-features">
            <div class="about-feature">
              <span class="about-icon">🎰</span>
              <h3>8 Specialized Wheels</h3>
              <p>From the classic Yes/No picker to themed wheels for Truth or Dare, Zodiac compatibility, country exploration, and more — each wheel is uniquely designed for its purpose.</p>
            </div>
            <div class="about-feature">
              <span class="about-icon">⚡</span>
              <h3>Physics Engine</h3>
              <p>Our wheels use a real physics simulation with acceleration, friction, and deceleration curves running at 60 frames per second on HTML5 Canvas.</p>
            </div>
            <div class="about-feature">
              <span class="about-icon">🎨</span>
              <h3>Full Customization</h3>
              <p>Every wheel includes an Advanced Mode with entry management, color customization, audio controls, physics settings, and spin history.</p>
            </div>
            <div class="about-feature">
              <span class="about-icon">🔒</span>
              <h3>Privacy First</h3>
              <p>All data stays in your browser. We use LocalStorage — no accounts, no tracking, no data collection. Your custom wheels are yours alone.</p>
            </div>
          </div>
        </section>

        <section class="content-section">
          <h2>Who Uses YesAndNoWheel?</h2>
          <ul class="styled-list">
            <li><strong>Teachers</strong> — Pick random students, vocabulary words, or quiz topics</li>
            <li><strong>Party hosts</strong> — Run Truth or Dare games with our 200+ built-in questions</li>
            <li><strong>Writers & roleplayers</strong> — Let the Wheel of Fate decide character outcomes</li>
            <li><strong>Gamers</strong> — DTI players use our 180+ theme library for outfit inspiration</li>
            <li><strong>Travelers</strong> — Spin the Country Wheel to pick your next destination</li>
            <li><strong>Anyone</strong> — When you can't decide, let the wheel decide for you!</li>
          </ul>
        </section>

        <section class="content-section">
          <h2>Technology</h2>
          <p>YesAndNoWheel.com is built with vanilla HTML, CSS, and JavaScript — no heavy frameworks, no bloat. The result is a blazing-fast experience that works on any device, any browser, without installation.</p>
          <p>Audio is synthesized in real-time using the Web Audio API, so there are no files to download. The physics engine renders at 60fps using the HTML5 Canvas API for silky-smooth animations.</p>
        </section>
      </div>
    </div>`;
}
