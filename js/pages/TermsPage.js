// TermsPage.js
export function renderTermsPage(container) {
  container.innerHTML = `
    <div class="static-page">
      <h1 class="page-title">Terms of Service</h1>
      <p class="page-intro">Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div class="page-content legal-content">
        <section class="content-section">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using YesAndNoWheel.com ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
        </section>

        <section class="content-section">
          <h2>2. Description of Service</h2>
          <p>YesAndNoWheel.com provides interactive, web-based spinning wheel tools for entertainment and decision-making purposes. The Service includes multiple specialized wheel types, customization features, and built-in content databases.</p>
        </section>

        <section class="content-section">
          <h2>3. Use of Service</h2>
          <p>The Service is provided free of charge. You may use it for personal, educational, and entertainment purposes. You agree not to:</p>
          <ul class="styled-list">
            <li>Use the Service for any illegal or unauthorized purpose</li>
            <li>Attempt to reverse-engineer, decompile, or disassemble the software</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Use the Service to make legally binding decisions</li>
          </ul>
        </section>

        <section class="content-section">
          <h2>4. Randomness Disclaimer</h2>
          <p>While our wheel results are generated using a physics simulation with random initial conditions, the results are produced by a pseudo-random number generator and should not be considered truly random for cryptographic or legal purposes. The Service is intended for entertainment only.</p>
        </section>

        <section class="content-section">
          <h2>5. User Data</h2>
          <p>All user data (custom entries, preferences, spin history) is stored locally in your browser's LocalStorage. We do not collect, transmit, or store any personal data on our servers. See our <a href="#privacy">Privacy Policy</a> for details.</p>
        </section>

        <section class="content-section">
          <h2>6. Intellectual Property</h2>
          <p>The Service, including its design, code, and content databases (Truth/Dare questions, DTI themes, etc.), is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from the Service without permission.</p>
        </section>

        <section class="content-section">
          <h2>7. Limitation of Liability</h2>
          <p>The Service is provided "as is" without warranties of any kind. We shall not be liable for any damages arising from your use of the Service.</p>
        </section>

        <section class="content-section">
          <h2>8. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the modified terms.</p>
        </section>

        <section class="content-section">
          <h2>9. Contact</h2>
          <p>For questions about these Terms, please <a href="#contact">contact us</a>.</p>
        </section>
      </div>
    </div>`;
}
