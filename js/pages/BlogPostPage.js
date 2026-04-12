// BlogPostPage.js — Individual blog post with interactive elements (reference: body.html)
import { BLOG_POSTS, getBlogBySlug } from '../data/blogPosts.js';
import { splitLocaleFromPath, buildLocalizedPath } from '../i18n.js?v=20260408-brand1';

export function renderBlogPostPage(container) {
  const { locale } = splitLocaleFromPath(window.location.pathname);
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const parts = path.split('/');
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
        <a href="${buildLocalizedPath(locale, 'blog')}" class="btn-blog-cta" style="margin-top:24px;display:inline-flex;">← Back to Blog</a>
      </div>`;
    return;
  }

  // Build headings for TOC from content
  const tocItems = extractHeadings(post.content);
  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3);

  container.innerHTML = `
    <article class="blog-post-page">

      <!-- ════════════ POST HERO ════════════ -->
      <header class="blog-post-hero" style="--post-accent: ${post.categoryColor}">
        <div class="blog-post-hero-bg"></div>
        <div class="blog-post-hero-content">
          <a href="${buildLocalizedPath(locale, 'blog')}" class="blog-post-back">← Back to Blog</a>
          <div class="blog-post-meta-top">
            <span class="blog-card-tag" style="--tag-color: ${post.categoryColor}">${post.category}</span>
            <span class="blog-post-readtime">${post.readTime}</span>
          </div>
          <h1 class="blog-post-title">${post.title}</h1>
          <p class="blog-post-lead">${post.excerpt}</p>
          <div class="blog-post-date-row">
            <time datetime="${post.date}">${formatDate(post.date)}</time>
            <span class="blog-post-separator">•</span>
            <span>by YesAndNoWheel Team</span>
          </div>
        </div>
      </header>

      <div class="blog-post-layout">

        <!-- ════════════ TABLE OF CONTENTS ════════════ -->
        ${tocItems.length > 0 ? `
        <nav class="toc-box" aria-label="Table of Contents">
          <h4>📑 In This Article</h4>
          <ol class="toc-list">
            ${tocItems.map(item => `<li><a href="#${item.id}">${item.text}</a></li>`).join('')}
          </ol>
        </nav>
        ` : ''}

        <!-- ════════════ STATS ROW ════════════ -->
        <div class="stats-row">
          ${getStatsForPost(post.slug)}
        </div>

        <!-- ════════════ POST BODY ════════════ -->
        <div class="blog-post-content">
          ${enhanceContent(post)}
        </div>

        <!-- ════════════ INTERACTIVE POLL ════════════ -->
        <div class="blog-interactive-poll" id="blog-poll">
          <h3>🗳️ Quick Poll</h3>
          <p class="poll-question">${getPollQuestion(post.slug)}</p>
          <div class="poll-options" id="poll-options">
            ${getPollOptions(post.slug).map((opt, i) => `
              <button class="poll-option-btn" data-idx="${i}">
                <span class="poll-option-text">${opt}</span>
                <span class="poll-option-bar"><span class="poll-bar-fill" data-pct="${getRandomPct(i)}"></span></span>
              </button>
            `).join('')}
          </div>
          <div class="poll-result-msg" id="poll-result" style="display:none;">
            <span class="poll-result-icon">✅</span> Thanks for voting! See how others responded above.
          </div>
        </div>

        <!-- ════════════ TIP / NOTE CALLOUT ════════════ -->
        <div class="info-callout tip">
          <span class="callout-icon">💡</span>
          <div class="callout-content">
            <strong>Pro Tip</strong>
            <p>${getProTip(post.slug)}</p>
          </div>
        </div>

        <!-- ════════════ CTA BOX ════════════ -->
        <div class="article-cta" style="--cta-accent: ${post.categoryColor}">
          <div class="article-cta-emoji">${post.heroEmoji}</div>
          <h3>${post.ctaText}</h3>
          <p>Click below to try the wheel featured in this article — no sign-up, no downloads, just spin!</p>
          <a href="${post.ctaUrl}" class="btn-blog-cta">${post.icon} ${post.ctaText} →</a>
        </div>

        <!-- ════════════ AUTHOR BOX ════════════ -->
        <div class="article-author">
          <div class="author-avatar">🎡</div>
          <div>
            <h4><a href="/about-us/">YesAndNoWheel Team</a></h4>
            <p>Building free decision-making tools for everyone. Our team creates fun, interactive spinning wheels to help you stop overthinking and start doing.</p>
          </div>
        </div>

      </div>

      <!-- ════════════ RELATED POSTS ════════════ -->
      ${relatedPosts.length > 0 ? `
      <section class="blog-related-section">
        <h2 class="section-title">Keep Reading</h2>
        <div class="blog-grid">
          ${relatedPosts.map(rp => `
            <a href="${buildLocalizedPath(locale, 'blog/' + rp.slug)}" class="blog-card" style="--card-accent: ${rp.categoryColor}">
              <div class="blog-card-img" style="--img-accent: ${rp.categoryColor}">
                <span class="blog-card-img-emoji">${rp.heroEmoji}</span>
                <span class="blog-card-img-icon">${rp.icon}</span>
              </div>
              <div class="blog-card-body">
                <div class="blog-card-meta">
                  <span class="blog-card-tag" style="--tag-color: ${rp.categoryColor}">${rp.category}</span>
                  <time datetime="${rp.date}">${formatDate(rp.date)}</time>
                  <span>•</span>
                  <span>${rp.readTime}</span>
                </div>
                <h3>${rp.title}</h3>
                <p>${rp.excerpt}</p>
                <span class="blog-card-link">Read Article →</span>
              </div>
            </a>
          `).join('')}
        </div>
      </section>
      ` : ''}

    </article>
  `;

  // ---- Wire up interactive poll ----
  initPoll();
  // ---- Smooth scroll TOC links ----
  initTocScroll();
  // ---- Reading progress bar ----
  initReadingProgress();
}

// ====================
// HELPER FUNCTIONS
// ====================

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function extractHeadings(html) {
  const headings = [];
  const regex = /<h2(?:\s[^>]*)?>(.+?)<\/h2>/gi;
  let match;
  let idx = 0;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    const id = 'section-' + (idx++);
    headings.push({ text, id });
  }
  return headings;
}

function enhanceContent(post) {
  // Add IDs to h2 tags for TOC linking
  let idx = 0;
  let content = post.content.replace(/<h2(?:\s[^>]*)?>/gi, () => `<h2 id="section-${idx++}">`);
  return content;
}

function getStatsForPost(slug) {
  const statsMap = {
    'cant-decide-what-to-eat': [
      { value: '35K+', label: 'Daily Decisions' },
      { value: '45min', label: 'Avg. Dinner Debate' },
      { value: '8', label: 'Pre-loaded Foods' },
      { value: '15', label: 'Languages' },
    ],
    'should-i-let-fate-decide': [
      { value: '5', label: 'Life Dilemmas' },
      { value: '8', label: 'Fate Outcomes' },
      { value: '∞', label: 'Custom Entries' },
      { value: '1', label: 'Spin Needed' },
    ],
    'word-of-the-day-word-wheel': [
      { value: '3', label: 'Creative Exercises' },
      { value: '5min', label: 'Haiku Timer' },
      { value: '∞', label: 'Word Combos' },
      { value: '200', label: 'Words/Month' },
    ],
    'truth-or-dare-spin-the-wheel': [
      { value: '100+', label: 'Curated Prompts' },
      { value: '2', label: 'Spin Rounds' },
      { value: '3', label: 'Spice Levels' },
      { value: '∞', label: 'Party Fun' },
    ],
    'random-country-wheel-travel': [
      { value: '199', label: 'Countries' },
      { value: '7', label: 'Continents' },
      { value: '3', label: 'Mini Prompts' },
      { value: '5', label: 'Spins/Tour' },
    ],
    'hair-color-wheel-bold-choice': [
      { value: '6+', label: 'Classic Colors' },
      { value: '6+', label: 'Fantasy Colors' },
      { value: '2', label: 'Palettes' },
      { value: '1', label: 'Screenshot' },
    ],
  };
  const stats = statsMap[slug] || [];
  return stats.map(s => `
    <div class="stat-box">
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
}

function getPollQuestion(slug) {
  const map = {
    'cant-decide-what-to-eat': "What's your biggest dinner decision struggle?",
    'should-i-let-fate-decide': "Would you let a wheel decide a major life choice?",
    'word-of-the-day-word-wheel': "What do you use random words for most?",
    'truth-or-dare-spin-the-wheel': "Truth or Dare — which do you usually pick?",
    'random-country-wheel-travel': "How do you usually pick travel destinations?",
    'hair-color-wheel-bold-choice': "Would you let a wheel choose your next hair color?",
  };
  return map[slug] || "Did you enjoy this article?";
}

function getPollOptions(slug) {
  const map = {
    'cant-decide-what-to-eat': ['Too many options', 'Partner disagrees', 'Nothing sounds good', 'Decision fatigue'],
    'should-i-let-fate-decide': ['Absolutely!', 'Only for small stuff', 'Maybe...', 'No way!'],
    'word-of-the-day-word-wheel': ['Writing prompts', 'Character names', 'Meeting icebreakers', 'Just for fun'],
    'truth-or-dare-spin-the-wheel': ['Always Truth', 'Always Dare', 'Depends on the group', 'Let the wheel decide!'],
    'random-country-wheel-travel': ['Google & research', 'Friends recommend', 'Price comparison', 'Random inspiration'],
    'hair-color-wheel-bold-choice': ['Yes, bring it on!', 'Only safe colors', 'For a wig/streak only', 'Never!'],
  };
  return map[slug] || ['Yes', 'No', 'Maybe'];
}

function getRandomPct(idx) {
  const pcts = [42, 28, 18, 12];
  return pcts[idx % pcts.length];
}

function getProTip(slug) {
  const map = {
    'cant-decide-what-to-eat': "Spin the wheel 7 times on Sunday to build your entire weekly meal plan. Screenshot the results and build your grocery list from there — you'll save 3+ hours of decision-making every week.",
    'should-i-let-fate-decide': "Pay attention to your emotional reaction when the wheel stops. If you feel disappointed by the result, that tells you what you <em>actually</em> want. The wheel doesn't decide — it reveals.",
    'word-of-the-day-word-wheel': "Set a daily alarm labeled 'Spin & Write.' Spin the Word Wheel, then write for exactly 5 minutes. In 30 days, you'll have 30 creative pieces — and a much stronger creative muscle.",
    'truth-or-dare-spin-the-wheel': "Pre-screen the dares before the party if you have younger guests. You can customize the wheel to only include age-appropriate options while keeping it fun.",
    'random-country-wheel-travel': "Use the continent filter to narrow your spins when you have a rough region in mind. Planning a Europe trip? Filter to European countries and spin 5 times for your itinerary.",
    'hair-color-wheel-bold-choice': "Not ready for permanent? Use the wheel result as a temporary streak or wig color first. Test it for a week — if you love it, book the salon appointment. Zero risk, maximum fun.",
  };
  return map[slug] || "Bookmark this page and come back whenever you need inspiration!";
}

// ---- Interactive Poll Logic ----
function initPoll() {
  const pollOptions = document.getElementById('poll-options');
  const pollResult = document.getElementById('poll-result');
  if (!pollOptions) return;

  let hasVoted = false;
  pollOptions.addEventListener('click', (e) => {
    const btn = e.target.closest('.poll-option-btn');
    if (!btn || hasVoted) return;
    hasVoted = true;

    // Highlight selected
    btn.classList.add('selected');

    // Animate all bars
    pollOptions.querySelectorAll('.poll-option-btn').forEach(b => {
      b.classList.add('revealed');
      const fill = b.querySelector('.poll-bar-fill');
      if (fill) {
        const pct = fill.dataset.pct;
        // Redistribute slightly for selected
        const adjustedPct = b === btn ? Math.min(parseInt(pct) + 8, 55) : pct;
        fill.style.width = adjustedPct + '%';
        // Add percentage label
        const label = document.createElement('span');
        label.className = 'poll-pct-label';
        label.textContent = adjustedPct + '%';
        fill.parentNode.appendChild(label);
      }
    });

    if (pollResult) {
      pollResult.style.display = 'flex';
    }
  });
}

// ---- TOC Smooth Scroll ----
function initTocScroll() {
  document.querySelectorAll('.toc-list a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ---- Reading Progress Bar ----
function initReadingProgress() {
  // Create progress bar element
  const bar = document.createElement('div');
  bar.className = 'reading-progress-bar';
  bar.innerHTML = '<div class="reading-progress-fill" id="reading-fill"></div>';
  document.body.appendChild(bar);

  const fill = document.getElementById('reading-fill');
  const article = document.querySelector('.blog-post-layout');
  if (!fill || !article) return;

  const updateProgress = () => {
    const rect = article.getBoundingClientRect();
    const articleTop = rect.top + window.scrollY;
    const articleHeight = rect.height;
    const scrolled = window.scrollY - articleTop;
    const progress = Math.min(Math.max(scrolled / (articleHeight - window.innerHeight), 0), 1);
    fill.style.width = (progress * 100) + '%';
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Clean up on page change
  const observer = new MutationObserver(() => {
    if (!document.querySelector('.blog-post-layout')) {
      bar.remove();
      window.removeEventListener('scroll', updateProgress);
      observer.disconnect();
    }
  });
  observer.observe(document.getElementById('app'), { childList: true });
}
