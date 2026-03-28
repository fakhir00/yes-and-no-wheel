// ContactPage.js
export function renderContactPage(container) {
  container.innerHTML = `
    <div class="static-page">
      <h1 class="page-title">Contact Us</h1>
      <p class="page-intro">Have a question, suggestion, or found a bug? We'd love to hear from you.</p>

      <div class="contact-layout">
        <form class="contact-form" id="contactForm">
          <div class="form-group">
            <label for="contactName">Your Name</label>
            <input type="text" id="contactName" name="name" required placeholder="John Doe">
          </div>
          <div class="form-group">
            <label for="contactEmail">Email Address</label>
            <input type="email" id="contactEmail" name="email" required placeholder="john@example.com">
          </div>
          <div class="form-group">
            <label for="contactMessage">Message</label>
            <textarea id="contactMessage" name="message" required rows="6" placeholder="Tell us what's on your mind..."></textarea>
          </div>
          <button type="submit" class="submit-btn" id="contactSubmit">Send Message</button>
          <p class="form-status" id="formStatus"></p>
        </form>

        <div class="contact-info">
          <div class="contact-card">
            <span class="contact-icon">📧</span>
            <h3>Email</h3>
            <p>contact@yesandnowheel.com</p>
          </div>
          <div class="contact-card">
            <span class="contact-icon">⏰</span>
            <h3>Response Time</h3>
            <p>We typically respond within 24-48 hours.</p>
          </div>
          <div class="contact-card">
            <span class="contact-icon">💡</span>
            <h3>Feature Requests</h3>
            <p>Got an idea for a new wheel? Let us know!</p>
          </div>
        </div>
      </div>
    </div>`;

  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const btn = document.getElementById('contactSubmit');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    status.textContent = '';
    status.className = 'form-status';

    // Simulate form submission
    setTimeout(() => {
      status.textContent = '✅ Message sent successfully! We will get back to you soon.';
      status.className = 'form-status success';
      btn.disabled = false;
      btn.textContent = 'Send Message';
      document.getElementById('contactForm').reset();
    }, 1500);
  });
}
