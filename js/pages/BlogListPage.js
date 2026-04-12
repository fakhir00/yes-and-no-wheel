// BlogListPage.js — Blog listing page redesigned (reference: index copy.html)
import { BLOG_POSTS } from '../data/blogPosts.js';
import { splitLocaleFromPath, buildLocalizedPath } from '../i18n.js?v=20260408-brand1';

export function renderBlogListPage(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);

  container.innerHTML = `
    <div class="blog-page">

      <!-- ════════════ HERO ════════════ -->
      <section class="page-hero blog-page-hero" aria-labelledby="blog-title">
        <div class="page-hero-bg"></div>
        <div class="page-hero-content">
          <div class="hero-badge">🎡 Guides & Articles on Decision-Making</div>
          <h1 id="blog-title">YesAndNoWheel Blog</h1>
          <p>Real-life decision hacks, party game ideas, creative prompts, and travel inspiration — all powered by a spin of the wheel. Stop overthinking. Start spinning.</p>
          <div class="blog-hero-stats">
            <div class="blog-stat-pill"><span class="blog-stat-num">${BLOG_POSTS.length}</span> Articles</div>
            <div class="blog-stat-pill"><span class="blog-stat-num">6</span> Wheels Featured</div>
            <div class="blog-stat-pill"><span class="blog-stat-num">30+</span> Min Read Total</div>
          </div>
        </div>
      </section>

      <!-- ════════════ BLOG GRID ════════════ -->
      <section class="blog-listing-section" aria-labelledby="blog-articles-heading">
        <h2 class="sr-only" id="blog-articles-heading">Articles</h2>
        <div class="blog-grid">
          ${BLOG_POSTS.map((post, i) => `
            <a href="${buildLocalizedPath(locale, 'blog/' + post.slug)}" class="blog-card" id="article-${post.slug}" style="--card-accent: ${post.categoryColor}">
              <div class="blog-card-img" style="--img-accent: ${post.categoryColor}">
                <span class="blog-card-img-emoji">${post.heroEmoji}</span>
                <span class="blog-card-img-icon">${post.icon}</span>
                ${i === 0 ? '<span class="blog-card-featured-badge">✨ Featured</span>' : ''}
              </div>
              <div class="blog-card-body">
                <div class="blog-card-meta">
                  <span class="blog-card-tag" style="--tag-color: ${post.categoryColor}">${post.category}</span>
                  <time datetime="${post.date}">${formatDate(post.date)}</time>
                  <span>•</span>
                  <span>${post.readTime}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <span class="blog-card-link">Read Article →</span>
              </div>
            </a>
          `).join('')}
        </div>
      </section>

      <!-- ════════════ CTA ════════════ -->
      <section class="blog-bottom-cta">
        <div class="blog-bottom-cta-inner">
          <h2>🎡 Try Our Decision Wheels</h2>
          <p>Ready to stop overthinking? Pick a wheel, spin it, and let fate decide. We have 9+ specialized wheels for every situation — from dinner to travel to party games.</p>
          <a href="/" class="btn-blog-cta">Explore All Wheels →</a>
        </div>
      </section>

    </div>
  `;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
