// ContactPage.js
import { getStaticPageContent, splitLocaleFromPath } from '../i18n.js';

export function renderContactPage(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const content = getStaticPageContent(locale, 'contact');
  container.innerHTML = `
    <div class="static-page">
      <h1 class="page-title">${content.title}</h1>
      <p class="page-intro">${content.intro}</p>

      <div class="contact-layout">
        <form class="contact-form" id="contactForm">
          <div class="form-group">
            <label for="contactName">${content.form.name}</label>
            <input type="text" id="contactName" name="name" required placeholder="John Doe">
          </div>
          <div class="form-group">
            <label for="contactEmail">${content.form.email}</label>
            <input type="email" id="contactEmail" name="email" required placeholder="john@example.com">
          </div>
          <div class="form-group">
            <label for="contactMessage">${content.form.message}</label>
            <textarea id="contactMessage" name="message" required rows="6" placeholder="Tell us what's on your mind..."></textarea>
          </div>
          <button type="submit" class="submit-btn" id="contactSubmit">${content.form.submit}</button>
          <p class="form-status" id="formStatus"></p>
        </form>

        <div class="contact-info">
          ${content.cards.map((card, index) => `
            <div class="contact-card">
              <span class="contact-icon">${index === 0 ? '📧' : index === 1 ? '⏰' : '💡'}</span>
              <h3>${card.title}</h3>
              <p>${card.body}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;

  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const btn = document.getElementById('contactSubmit');
    btn.disabled = true;
    btn.textContent = content.form.sending;
    status.textContent = '';
    status.className = 'form-status';

    // Simulate form submission
    setTimeout(() => {
      status.textContent = content.form.sent;
      status.className = 'form-status success';
      btn.disabled = false;
      btn.textContent = content.form.submit;
      document.getElementById('contactForm').reset();
    }, 1500);
  });
}
