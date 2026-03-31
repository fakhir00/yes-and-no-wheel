// LanguagesPage.js
import { LOCALES, buildLocalizedPath, getStaticPageContent, splitLocaleFromPath } from '../i18n.js';

export function renderLanguagesPage(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const content = getStaticPageContent(locale, 'languages');
  container.innerHTML = `
    <div class="static-page">
      <h1 class="page-title">${content.title}</h1>
      <p class="page-intro">${content.intro}</p>

      <div class="page-content">
        <section class="content-section">
          <h2>${content.headings.available}</h2>
          <ul class="styled-list">
            ${LOCALES.map((locale) => `<li><a href="${buildLocalizedPath(locale.code, '')}">${locale.label}</a></li>`).join('')}
          </ul>
        </section>

        <section class="content-section">
          <h2>${content.headings.why}</h2>
          <p>${content.intro}</p>
        </section>

        <section class="content-section">
          <h2>${content.headings.popular}</h2>
          <ul class="styled-list">
            <li><a href="/rainbow/">Rainbow Wheel</a></li>
            <li><a href="/wheel-of-fate/">Wheel of Fate</a></li>
            <li><a href="/word/">Word Wheel</a></li>
            <li><a href="/country/">Country Wheel</a></li>
            <li><a href="/zodiac/">Zodiac Wheel</a></li>
          </ul>
        </section>

        ${content.supportSections.map(section => `
          <section class="content-section">
            <h2>${section.heading}</h2>
            <p>${section.body}</p>
          </section>
        `).join('')}
      </div>
    </div>`;
}
