// PrivacyPage.js
import { getStaticPageContent, splitLocaleFromPath } from '../i18n.js';

export function renderPrivacyPage(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const content = getStaticPageContent(locale, 'privacy');
  container.innerHTML = `
    <div class="static-page">
      <h1 class="page-title">${content.title}</h1>
      <p class="page-intro">${content.lastUpdatedLabel}: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div class="page-content legal-content">
        ${content.sections.map(section => `
          <section class="content-section">
            <h2>${section.heading}</h2>
            <p>${section.body}</p>
          </section>
        `).join('')}
      </div>
    </div>`;
}
