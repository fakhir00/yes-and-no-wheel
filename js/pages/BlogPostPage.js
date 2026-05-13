// BlogPostPage.js — Premium individual blog post with interactive elements + i18n
import { BLOG_POSTS, getBlogBySlug } from '../data/blogPosts.js';
import { splitLocaleFromPath, buildLocalizedPath, getBlogText } from '../i18n.js?v=20260408-brand1';

export function renderBlogPostPage(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const b = getBlogText(locale);
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const parts = path.split('/');
  let slug = '';
  const blogIndex = parts.indexOf('blog');
  if (blogIndex !== -1 && parts.length > blogIndex + 1) slug = parts[blogIndex + 1];

  const post = getBlogBySlug(slug);
  if (!post) {
    container.innerHTML = `<div class="static-page"><h1 class="page-title">${b.postNotFound}</h1><p class="page-intro">${b.postNotFoundDesc}</p><a href="${buildLocalizedPath(locale, 'blog')}" class="bl-cta-btn" style="margin-top:24px;display:inline-flex;">${b.backToBlog}</a></div>`;
    return;
  }

  const tocItems = extractHeadings(post.content);
  const related = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3);

  container.innerHTML = `
    <article class="bp-page">

      <!-- HERO -->
      <header class="bp-hero">
        <div class="bp-hero-glow" style="--pc:${post.categoryColor}"></div>
        <div class="bp-hero-inner">
          <a href="${buildLocalizedPath(locale, 'blog')}" class="bp-back">${b.backToBlog}</a>
          <div class="bp-meta-row">
            <span class="bl-tag" style="--tag-c:${post.categoryColor}">${post.category}</span>
            <span>${post.readTime}</span>
          </div>
          <h1>${post.title}</h1>
          <p class="bp-lead">${post.excerpt}</p>
          <div class="bp-date"><time datetime="${post.date}">${fmtDate(post.date, locale)}</time> • by YesAndNoWheel Team</div>
        </div>
      </header>

      <!-- HERO IMAGE -->
      <div class="bp-hero-img-wrap">
        <img src="${post.image}" alt="${post.imageAlt}" class="bp-hero-img" width="760" height="420">
      </div>

      <div class="bp-layout">

        <!-- TOC -->
        ${tocItems.length > 1 ? `
        <nav class="bp-toc" aria-label="Table of Contents">
          <h4>${b.inThisArticle}</h4>
          <ol>${tocItems.map(t => `<li><a href="#${t.id}">${t.text}</a></li>`).join('')}</ol>
        </nav>` : ''}

        <!-- CONTENT -->
        <div class="bp-content">${enhanceContent(post)}</div>

        <!-- PRO TIP -->
        <div class="bp-callout tip">
          <span class="bp-callout-icon">💡</span>
          <div><strong>${b.proTip}</strong><p>${getProTip(post.slug)}</p></div>
        </div>

        <!-- CTA -->
        <div class="bp-cta-box" style="--cta-c:${post.categoryColor}">
          <div class="bp-cta-emoji">${post.heroEmoji}</div>
          <h3>${post.ctaText}</h3>
          <p>${b.ctaPostSub}</p>
          <a href="${post.ctaUrl}" class="bl-cta-btn">${post.icon} ${post.ctaText} →</a>
        </div>

        <!-- AUTHOR -->
        <div class="bp-author">
          <div class="bp-author-avatar">🎡</div>
          <div>
            <h4><a href="${buildLocalizedPath(locale, 'about-us')}">YesAndNoWheel Team</a></h4>
            <p>${b.authorBio}</p>
          </div>
        </div>
      </div>

      <!-- RELATED -->
      ${related.length ? `
      <section class="bp-related">
        <h2>${b.keepReading}</h2>
        <div class="bl-grid">${related.map(r => `
          <a href="${buildLocalizedPath(locale, 'blog/' + r.slug)}" class="bl-card">
            <img src="${r.image}" alt="${r.imageAlt}" class="bl-card-img" loading="lazy" width="680" height="380">
            <div class="bl-card-body">
              <div class="bl-card-meta">
                <span class="bl-tag" style="--tag-c:${r.categoryColor}">${r.category}</span>
                <time datetime="${r.date}">${fmtDate(r.date, locale)}</time><span>•</span><span>${r.readTime}</span>
              </div>
              <h3>${r.title}</h3>
              <p>${r.excerpt}</p>
              <span class="bl-card-arrow">${b.readArticle}</span>
            </div>
          </a>`).join('')}
        </div>
      </section>` : ''}
    </article>
  `;

  // Smooth TOC scroll
  document.querySelectorAll('.bp-toc a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById(a.getAttribute('href').slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Reading progress bar
  const bar = document.createElement('div');
  bar.className = 'bp-progress';
  bar.innerHTML = '<div class="bp-progress-fill"></div>';
  document.body.appendChild(bar);
  const fill = bar.querySelector('.bp-progress-fill');
  const layout = document.querySelector('.bp-layout');
  const onScroll = () => {
    if (!layout) return;
    const r = layout.getBoundingClientRect();
    const pct = Math.min(Math.max((window.scrollY - (r.top + window.scrollY)) / (r.height - window.innerHeight), 0), 1);
    fill.style.width = (pct * 100) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const obs = new MutationObserver(() => { if (!document.querySelector('.bp-layout')) { bar.remove(); window.removeEventListener('scroll', onScroll); obs.disconnect(); } });
  obs.observe(document.getElementById('app'), { childList: true });
}

/* helpers */
function fmtDate(s, locale) {
  const loc = locale === 'zh-CN' ? 'zh-CN' : (locale || 'en');
  return new Date(s + 'T00:00:00').toLocaleDateString(loc, { month: 'long', day: 'numeric', year: 'numeric' });
}

function extractHeadings(html) {
  const out = []; let i = 0;
  html.replace(/<h2[^>]*>(.+?)<\/h2>/gi, (_, text) => { out.push({ text: text.replace(/<[^>]+>/g, '').trim(), id: 'sec-' + i++ }); });
  return out;
}

function enhanceContent(post) {
  let i = 0;
  return post.content.replace(/<h2(?:\s[^>]*)?>/gi, () => `<h2 id="sec-${i++}">`);
}

function getProTip(slug) {
  const m = {
    'cant-decide-what-to-eat': "Spin the wheel 7 times on Sunday to plan your entire week's meals. Screenshot each result, build your grocery list, and never waste time deciding again.",
    'should-i-let-fate-decide': "Pay attention to your gut reaction when the wheel stops. Disappointed? That tells you what you <em>actually</em> want. The wheel doesn't decide — it reveals.",
    'word-of-the-day-word-wheel': "Set a daily \"Spin & Write\" alarm. Spin for a word, then write for 5 minutes. In 30 days you'll have 30 creative pieces and a much stronger writing habit.",
    'truth-or-dare-spin-the-wheel': "Pre-screen dares if younger guests are playing. You can customize the wheel to include only age-appropriate options while keeping it chaotic and fun.",
    'random-country-wheel-travel': "Use the wheel's customization to filter by continent when you already have a rough region in mind. Planning Europe? Load only European countries and spin 5 times for your itinerary.",
    'hair-color-wheel-bold-choice': "Not ready for permanent color? Use the wheel result to buy a temporary streak, clip-in, or wig color. Test it for a week — if you love it, book the salon. Zero risk.",
  };
  return m[slug] || "Bookmark this page and come back whenever you need inspiration!";
}
