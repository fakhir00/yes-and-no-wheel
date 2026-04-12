// BlogListPage.js — Premium blog listing page
import { BLOG_POSTS } from '../data/blogPosts.js';
import { splitLocaleFromPath, buildLocalizedPath } from '../i18n.js?v=20260408-brand1';

export function renderBlogListPage(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);

  container.innerHTML = `
    <div class="bl-page">
      <section class="bl-hero" aria-labelledby="blog-title">
        <div class="bl-hero-glow"></div>
        <div class="bl-hero-inner">
          <span class="bl-badge">🎡 Guides & Articles on Decision-Making</span>
          <h1 id="blog-title">YesAndNoWheel Blog</h1>
          <p class="bl-hero-sub">Real-life decision hacks, party game ideas, creative prompts, and travel inspiration — all powered by a spin of the wheel.</p>
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
                  <time datetime="${post.date}">${fmtDate(post.date)}</time>
                  <span>•</span>
                  <span>${post.readTime}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <span class="bl-card-arrow">Read Article →</span>
              </div>
            </a>
          `).join('')}
        </div>
      </section>

      <section class="bl-cta-section">
        <div class="bl-cta-box">
          <h2>🎡 Try Our Decision Wheels</h2>
          <p>Ready to stop overthinking? Pick a wheel, spin it, and let fate decide. Free, fast, no sign-up required.</p>
          <a href="/" class="bl-cta-btn">Explore All Wheels →</a>
        </div>
      </section>
    </div>
  `;
}

function fmtDate(s) {
  return new Date(s + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
