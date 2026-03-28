// PrivacyPage.js
export function renderPrivacyPage(container) {
  container.innerHTML = `
    <div class="static-page">
      <h1 class="page-title">Privacy Policy</h1>
      <p class="page-intro">Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div class="page-content legal-content">
        <section class="content-section">
          <h2>1. Overview</h2>
          <p>YesAndNoWheel.com respects your privacy. This policy explains how we handle information when you use our Service. The short version: <strong>we don't collect any personal data.</strong></p>
        </section>

        <section class="content-section">
          <h2>2. Information We Do NOT Collect</h2>
          <ul class="styled-list">
            <li>We do not require user accounts or registration</li>
            <li>We do not collect names, emails, or personal identifiers</li>
            <li>We do not use tracking cookies or analytics pixels</li>
            <li>We do not sell or share data with third parties</li>
          </ul>
        </section>

        <section class="content-section">
          <h2>3. Local Storage</h2>
          <p>We use your browser's LocalStorage to save your preferences, custom wheel entries, and spin history. This data:</p>
          <ul class="styled-list">
            <li>Is stored only on your device</li>
            <li>Is never transmitted to any server</li>
            <li>Can be cleared at any time through your browser settings</li>
            <li>Is automatically deleted if you clear your browser data</li>
          </ul>
        </section>

        <section class="content-section">
          <h2>4. Audio</h2>
          <p>Our audio features use the Web Audio API to synthesize sounds directly in your browser. No audio files are downloaded or transmitted.</p>
        </section>

        <section class="content-section">
          <h2>5. Third-Party Services</h2>
          <p>We load Google Fonts for typography. Google may collect anonymous usage data according to their privacy policy. No other third-party services are used.</p>
        </section>

        <section class="content-section">
          <h2>6. Children's Privacy</h2>
          <p>Our Service is suitable for all ages. We do not knowingly collect any information from children or any other users.</p>
        </section>

        <section class="content-section">
          <h2>7. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated date.</p>
        </section>

        <section class="content-section">
          <h2>8. Contact</h2>
          <p>If you have questions about this Privacy Policy, please <a href="#contact">contact us</a>.</p>
        </section>
      </div>
    </div>`;
}
