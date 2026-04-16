// BlogListPage.js — Premium blog listing page with i18n
import { BLOG_POSTS } from '../data/blogPosts.js';
import { splitLocaleFromPath, buildLocalizedPath, getBlogText } from '../i18n.js?v=20260408-brand1';

export function renderBlogListPage(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const b = getBlogText(locale);

  container.innerHTML = `
    <div class="bl-page">
      <section class="bl-hero" aria-labelledby="blog-title">
        <div class="bl-hero-glow"></div>
        <div class="bl-hero-inner">
          <span class="bl-badge">${b.badge}</span>
          <h1 id="blog-title">${b.pageTitle}</h1>
          <p class="bl-hero-sub">${b.pageSub}</p>
        </div>
      </section>

      <section class="bl-grid-wrap" aria-label="Articles">
        <div class="bl-grid">
          ${BLOG_POSTS.map((post, i) => `
            <a href="${buildLocalizedPath(locale, 'blog/' + post.slug)}" class="bl-card" id="article-${post.slug}">
              <img src="${post.image}" alt="${post.imageAlt}" class="bl-card-img" loading="${i < 2 ? 'eager' : 'lazy'}" width="680" height="380">
              <div class="bl-card-body">
                <div class="bl-card-meta">
                  <span class="bl-tag" style="--tag-c:${post.categoryColor}">${post.category}</span>
                  <time datetime="${post.date}">${fmtDate(post.date, locale)}</time>
                  <span>•</span>
                  <span>${post.readTime}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <span class="bl-card-arrow">${b.readArticle}</span>
              </div>
            </a>
          `).join('')}
        </div>
      </section>

      <section class="bl-cta-section">
        <div class="bl-cta-box">
          <h2>${b.ctaTitle}</h2>
          <p>${b.ctaSub}</p>
          <a href="${buildLocalizedPath(locale, '')}" class="bl-cta-btn">${b.ctaBtn}</a>
        </div>
      </section>
    </div>
  `;
}

function fmtDate(s, locale) {
  const loc = locale === 'zh-CN' ? 'zh-CN' : (locale || 'en');
  return new Date(s + 'T00:00:00').toLocaleDateString(loc, { month: 'long', day: 'numeric', year: 'numeric' });
}
