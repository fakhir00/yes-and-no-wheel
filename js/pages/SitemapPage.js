// SitemapPage.js
import { buildLocalizedPath, getLocalizedRouteContent, getStaticPageContent, splitLocaleFromPath } from '../i18n.js';

export function renderSitemapPage(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const content = getStaticPageContent(locale, 'sitemap');
  const mainPages = [
    { title: getLocalizedRouteContent(locale, 'home').title, path: buildLocalizedPath(locale, '') },
    { title: getLocalizedRouteContent(locale, 'about-us').title, path: buildLocalizedPath(locale, 'about-us') },
    { title: getLocalizedRouteContent(locale, 'contact').title, path: buildLocalizedPath(locale, 'contact') },
    { title: getLocalizedRouteContent(locale, 'terms').title, path: buildLocalizedPath(locale, 'terms') },
    { title: getLocalizedRouteContent(locale, 'privacy').title, path: buildLocalizedPath(locale, 'privacy') },
    { title: getLocalizedRouteContent(locale, 'faq').title, path: buildLocalizedPath(locale, 'faq') },
    { title: getLocalizedRouteContent(locale, 'languages').title, path: buildLocalizedPath(locale, 'languages') },
    { title: getLocalizedRouteContent(locale, 'sitemap').title, path: buildLocalizedPath(locale, 'sitemap') },
  ];

  const wheelPages = [
    { title: `🌈 ${getLocalizedRouteContent(locale, 'rainbow').title}`, path: buildLocalizedPath(locale, 'rainbow') },
    { title: `⚔️ ${getLocalizedRouteContent(locale, 'wheel-of-fate').title}`, path: buildLocalizedPath(locale, 'wheel-of-fate') },
    { title: `📖 ${getLocalizedRouteContent(locale, 'word').title}`, path: buildLocalizedPath(locale, 'word') },
    { title: `🎉 ${getLocalizedRouteContent(locale, 'spin-the-wheel-truth-or-dare').title}`, path: buildLocalizedPath(locale, 'spin-the-wheel-truth-or-dare') },
    { title: `👗 ${getLocalizedRouteContent(locale, 'dti-theme').title}`, path: buildLocalizedPath(locale, 'dti-theme') },
    { title: `🌍 ${getLocalizedRouteContent(locale, 'country').title}`, path: buildLocalizedPath(locale, 'country') },
    { title: `✨ ${getLocalizedRouteContent(locale, 'zodiac').title}`, path: buildLocalizedPath(locale, 'zodiac') },
    { title: `💇 ${getLocalizedRouteContent(locale, 'hair-color').title}`, path: buildLocalizedPath(locale, 'hair-color') },
  ];

  container.innerHTML = `
    <div class="static-page">
      <h1 class="page-title">${content.title}</h1>
      <p class="page-intro">${content.intro}</p>

      <div class="page-content sitemap-content">
        <section class="content-section">
          <h2>${content.sectionPages}</h2>
          <ul class="sitemap-list">
            ${mainPages.map(p => `<li><a href="${p.path}">${p.title}</a></li>`).join('')}
          </ul>
        </section>

        <section class="content-section">
          <h2>${content.sectionWheels}</h2>
          <ul class="sitemap-list">
            ${wheelPages.map(p => `<li><a href="${p.path}">${p.title}</a></li>`).join('')}
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
