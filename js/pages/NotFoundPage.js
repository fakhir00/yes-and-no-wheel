// NotFoundPage.js
import { getStaticPageContent, splitLocaleFromPath } from '../i18n.js';

export function renderNotFoundPage(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const content = getStaticPageContent(locale, '404');
  container.innerHTML = `
    <div class="static-page not-found-page">
      <div class="not-found-content">
        <div class="not-found-icon">🎰</div>
        <h1 class="not-found-title">${content.title}</h1>
        <p class="not-found-text">${content.intro}</p>
        <p class="not-found-sub">${content.intro}</p>
        <a href="/" class="cta-btn primary">← ${content.backHome}</a>
      </div>
    </div>`;
}
