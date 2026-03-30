// FaqPage.js
import { getStaticPageContent, splitLocaleFromPath } from '../i18n.js';

export function renderFaqPage(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const content = getStaticPageContent(locale, 'faq');
  container.innerHTML = `
    <div class="static-page">
      <h1 class="page-title">${content.title}</h1>
      <p class="page-intro">${content.intro}</p>

      <div class="page-content legal-content">
        ${content.items.map(item => `
          <section class="content-section">
            <h2>${item.q}</h2>
            <p>${item.a}</p>
          </section>
        `).join('')}
      </div>
    </div>`;
}
