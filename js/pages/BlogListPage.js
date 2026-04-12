// BlogListPage.js — Blog listing page with interactive cards
import { BLOG_POSTS } from '../data/blogPosts.js';
import { splitLocaleFromPath, buildLocalizedPath } from '../i18n.js?v=20260408-brand1';

export function renderBlogListPage(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);

  const featuredPost = BLOG_POSTS[0];
  const restPosts = BLOG_POSTS.slice(1);

  container.innerHTML = `
    <div class="blog-page">
      <div class="blog-hero">
        <div class="blog-hero-bg"></div>
        <div class="blog-hero-content">
          <span class="blog-hero-badge">📝 Blog</span>
          <h1 class="blog-hero-title">Tips, Tricks & Wheel Wisdom</h1>
          <p class="blog-hero-subtitle">Real-life decision hacks, party game ideas, and creative prompts — all powered by a spin.</p>
        </div>
      </div>

      <section class="blog-featured">
        <a href="${buildLocalizedPath(locale, 'blog/' + featuredPost.slug)}" class="blog-featured-card" style="--card-accent: ${featuredPost.categoryColor}">
          <div class="blog-featured-badge">
            <span class="blog-card-category" style="--cat-color: ${featuredPost.categoryColor}">${featuredPost.category}</span>
            <span class="blog-featured-label">✨ Featured</span>
          </div>
          <div class="blog-featured-icon">${featuredPost.heroEmoji}</div>
          <h2 class="blog-featured-title">${featuredPost.title}</h2>
          <p class="blog-featured-excerpt">${featuredPost.excerpt}</p>
          <div class="blog-featured-meta">
            <span class="blog-card-date">${formatDate(featuredPost.date)}</span>
            <span class="blog-card-dot">·</span>
            <span class="blog-card-read">${featuredPost.readTime}</span>
          </div>
          <span class="blog-card-cta">Read Article →</span>
        </a>
      </section>

      <section class="blog-grid-section">
        <h2 class="section-title">All Articles</h2>
        <div class="blog-grid">
          ${restPosts.map(post => `
            <a href="${buildLocalizedPath(locale, 'blog/' + post.slug)}" class="blog-card" style="--card-accent: ${post.categoryColor}">
              <div class="blog-card-header">
                <span class="blog-card-icon">${post.icon}</span>
                <span class="blog-card-category" style="--cat-color: ${post.categoryColor}">${post.category}</span>
              </div>
              <h3 class="blog-card-title">${post.title}</h3>
              <p class="blog-card-excerpt">${post.excerpt}</p>
              <div class="blog-card-footer">
                <div class="blog-card-meta">
                  <span class="blog-card-date">${formatDate(post.date)}</span>
                  <span class="blog-card-dot">·</span>
                  <span class="blog-card-read">${post.readTime}</span>
                </div>
                <span class="blog-card-cta">Read →</span>
              </div>
            </a>
          `).join('')}
        </div>
      </section>

      <section class="blog-newsletter">
        <div class="blog-newsletter-content">
          <h2>🎡 Never Miss a Spin</h2>
          <p>Bookmark this page for new articles, creative prompts, and decision-making hacks every week.</p>
          <a href="/" class="cta-btn primary blog-newsletter-cta">Explore All Wheels →</a>
        </div>
      </section>
    </div>
  `;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
