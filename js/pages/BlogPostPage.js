// BlogPostPage.js — Individual blog post renderer
import { BLOG_POSTS, getBlogBySlug } from '../data/blogPosts.js';
import { splitLocaleFromPath, buildLocalizedPath } from '../i18n.js?v=20260408-brand1';

export function renderBlogPostPage(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const parts = path.split('/');
  
  // Handle locale prefix — slug is the last segment after "blog"
  let slug = '';
  const blogIndex = parts.indexOf('blog');
  if (blogIndex !== -1 && parts.length > blogIndex + 1) {
    slug = parts[blogIndex + 1];
  }

  const post = getBlogBySlug(slug);
  if (!post) {
    container.innerHTML = `
      <div class="static-page">
        <h1 class="page-title">Post Not Found</h1>
        <p class="page-intro">The blog post you're looking for doesn't exist.</p>
        <a href="${buildLocalizedPath(locale, 'blog')}" class="cta-btn primary" style="margin-top: 24px;">← Back to Blog</a>
      </div>
    `;
    return;
  }

  // Find related posts (exclude current, take 3)
  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3);

  container.innerHTML = `
    <article class="blog-post-page">
      <div class="blog-post-hero" style="--post-accent: ${post.categoryColor}">
        <div class="blog-post-hero-bg"></div>
        <div class="blog-post-hero-content">
          <a href="${buildLocalizedPath(locale, 'blog')}" class="blog-post-back">← Back to Blog</a>
          <div class="blog-post-meta-top">
            <span class="blog-card-category" style="--cat-color: ${post.categoryColor}">${post.category}</span>
            <span class="blog-card-read">${post.readTime}</span>
          </div>
          <h1 class="blog-post-title">${post.title}</h1>
          <p class="blog-post-lead">${post.excerpt}</p>
          <div class="blog-post-date">${formatDate(post.date)}</div>
        </div>
      </div>

      <div class="blog-post-body">
        <div class="blog-post-content">
          ${post.content}
        </div>

        <div class="blog-post-cta-box" style="--cta-accent: ${post.categoryColor}">
          <div class="blog-post-cta-icon">${post.heroEmoji}</div>
          <h3>${post.ctaText}</h3>
          <a href="${post.ctaUrl}" class="cta-btn primary blog-post-cta-btn">${post.icon} ${post.ctaText} →</a>
        </div>
      </div>

      ${relatedPosts.length > 0 ? `
      <section class="blog-related">
        <h2 class="section-title">Keep Reading</h2>
        <div class="blog-grid">
          ${relatedPosts.map(rp => `
            <a href="${buildLocalizedPath(locale, 'blog/' + rp.slug)}" class="blog-card" style="--card-accent: ${rp.categoryColor}">
              <div class="blog-card-header">
                <span class="blog-card-icon">${rp.icon}</span>
                <span class="blog-card-category" style="--cat-color: ${rp.categoryColor}">${rp.category}</span>
              </div>
              <h3 class="blog-card-title">${rp.title}</h3>
              <p class="blog-card-excerpt">${rp.excerpt}</p>
              <div class="blog-card-footer">
                <div class="blog-card-meta">
                  <span class="blog-card-date">${formatDate(rp.date)}</span>
                  <span class="blog-card-dot">·</span>
                  <span class="blog-card-read">${rp.readTime}</span>
                </div>
                <span class="blog-card-cta">Read →</span>
              </div>
            </a>
          `).join('')}
        </div>
      </section>
      ` : ''}
    </article>
  `;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
