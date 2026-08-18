import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { LOCALES, buildLocalizedPath, getHomeText, getLocalizedRouteContent, getStaticPageContent, getWheelSharedText, getUiText } from '../js/i18n.js';

const SITE_URL = 'https://yesandnowheel.com';
const DEFAULT_LOCALE = 'en';
const ASSET_VERSION = '20260408-brand1';

import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const OG_IMAGE_URL = `${SITE_URL}/og-image.svg?v=${ASSET_VERSION}`;

const ROUTE_TITLES_EN = {
  '': 'Yes and No Wheel | Free Yes or No Spinner',
  'about-us': 'About Us — YesAndNoWheel.com',
  contact: 'Contact Us — YesAndNoWheel.com',
  terms: 'Terms of Service — YesAndNoWheel.com',
  privacy: 'Privacy Policy — YesAndNoWheel.com',
  faq: 'Frequently Asked Questions — YesAndNoWheel.com',
  languages: 'Languages — YesAndNoWheel.com',
  sitemap: 'Sitemap — YesAndNoWheel.com',
  rainbow: 'Rainbow Wheel — #1 Free Color Picker Spinner Wheel',
  'wheel-of-fate': 'Wheel of Fate — The Best Custom RPG Story Spinner',
  word: 'Word Wheel — #1 Free Random Name Picker Spinner',
  'spin-the-wheel-truth-or-dare': 'Spin the Wheel Truth or Dare — Fun Party Game',
  'dti-theme': 'DTI Theme Wheel — Spin For 180+ DTI Outfit Themes',
  country: 'Country Wheel — Pick Randomly From Top 199 Countries',
  zodiac: 'Zodiac Wheel — Spin For Your Best Star Sign Destiny',
  'hair-color': 'Hair Color Wheel — Find Your Next Hair Dye Color',
  'random-food': 'Food Spin Wheel - Random Food Decision Picker',
  'chance-fortune-wheel': 'Chance and Fortune Wheel — Spin the Wheel of Luck Online',
  'oracle': 'Yes No Oracle | Accurate Yes or No Oracle Free Online',
  'tarot': 'Yes or No Tarot Wheel — Free Online Card Draw',
  'yes-and-no-dice': 'Yes and No Dice — Free 3D Physics Decision Maker',
  'blog': 'Blog — Tips, Tricks & Wheel Wisdom | YesAndNoWheel.com',
  'blog/cant-decide-what-to-eat': "Can't Decide What to Eat for Dinner? | YesAndNoWheel Blog",
  'blog/should-i-let-fate-decide': 'Should I Let Fate Decide? 5 Life Questions | YesAndNoWheel Blog',
  'blog/word-of-the-day-word-wheel': 'Word of the Day — Let the Word Wheel Inspire You | YesAndNoWheel Blog',
  'blog/truth-or-dare-spin-the-wheel': 'Truth or Dare — Spin the Wheel and Stop Arguing | YesAndNoWheel Blog',
  'blog/random-country-wheel-travel': 'Country Wheel — Pick Your Next Dream Destination | YesAndNoWheel Blog',
  'blog/hair-color-wheel-bold-choice': 'Hair Color Wheel — Spin for a Bold Choice | YesAndNoWheel Blog'
};

const ROUTE_DESCRIPTIONS_EN = {
  '': 'Spin the Yes and No Wheel to decide instantly! Free online spinner with 8 wheels. Customizable and fun. Try it now!',
  'about-us': 'Learn more about YesAndNoWheel.com, our free spinner tools, and the ideas behind our random decision wheel pages.',
  contact: 'Contact YesAndNoWheel.com — reach out with questions, feedback, or feature requests. We respond within 24-48 hours.',
  terms: 'Read the terms of service for YesAndNoWheel.com and understand how our free wheel tools and content may be used.',
  privacy: 'Read the privacy policy for YesAndNoWheel.com and learn how browser data and basic analytics are handled.',
  faq: 'Read common questions and answers about YesAndNoWheel.com, our random wheels, customization features, and device compatibility.',
  languages: 'Browse the supported language versions of YesAndNoWheel.com and discover language-specific route paths.',
  sitemap: 'Explore the YesAndNoWheel.com sitemap and find links to every main wheel page and important site section.',
  rainbow: 'Spin the Rainbow Wheel and let ROYGBIV colors decide. Free online color spinner with custom entries. Try it now!',
  'wheel-of-fate': 'Spin the Wheel of Fate for dramatic outcomes. Perfect for writers and RPG players. Weighted entries and cosmic design.',
  word: 'Use the Word Wheel to randomly pick names. Upload CSV, paste names, and spin. Perfect for classrooms and raffles.',
  'spin-the-wheel-truth-or-dare': 'Spin the Wheel Truth or Dare for parties! 200+ curated prompts with player picker. Free neon-themed game.',
  'dti-theme': 'Spin the DTI Theme Wheel for Dress To Impress inspiration! 180+ themes by category. Free random theme generator.',
  country: 'Spin the Country Wheel to pick from 199 countries! Filter by continent with flags. Great for geography games.',
  zodiac: 'Spin the Zodiac Wheel to reveal your star sign destiny. 12 signs with traits and compatibility. Free spinner.',
  'hair-color': 'Spin the Hair Color Wheel to find your next dye color! Classic and fantasy palettes with hex codes. Try now!',
  'random-food': 'Use our Food Spin Wheel to randomly decide what to eat. Perfect for dinner dilemmas, restaurants, and meal planning. Spin now!',
  'chance-fortune-wheel': 'Spin the Chance and Fortune Wheel to see what luck has in store. Free fortune spinner with yes/no, lucky numbers, and custom entries. Try it now!',
  'oracle': 'Need clarity? Consult our free Yes No Oracle. This accurate yes or no spinner helps you make decisions quickly. Just focus on your yes or no question and spin the oracle for instant answers. Perfect for when you are stuck and need divine intervention.',
  'tarot': 'Spin the Yes or No Tarot Wheel for a free one-card reading. Draw a Major Arcana card for an instant yes or no answer with meaning and guidance. No signup.',
  'yes-and-no-dice': 'Roll the Yes and No Dice for a random answer. 3D physics, probability control, and streak tracking. Free, no signup.',
  'blog': 'Read decision-making tips, party game ideas, and creative prompts powered by our spinning wheels. Free blog articles.',
  'blog/cant-decide-what-to-eat': "End the dinner debate! Spin the Random Food Wheel and let fate pick your meal. Decision-making tips and fun ideas.",
  'blog/should-i-let-fate-decide': 'Fate vs free will — 5 life dilemmas to spin the Wheel of Fate. Real scenarios, real decisions, real fun.',
  'blog/word-of-the-day-word-wheel': 'Writers, artists, journalers: spin the Word Wheel for creative prompts. Haiku challenge, character names, icebreakers.',
  'blog/truth-or-dare-spin-the-wheel': 'Stop arguing about Truth or Dare! Spin the wheel for 100+ curated prompts. Perfect for parties and game nights.',
  'blog/random-country-wheel-travel': 'Too many countries, too little time. Spin the Country Wheel and plan a virtual world tour tonight.',
  'blog/hair-color-wheel-bold-choice': 'Should you dye your hair? Spin the Hair Color Wheel for classic and fantasy colors. Take a screenshot for your stylist.'
};

const ROUTES = ['', 'about-us', 'contact', 'terms', 'privacy', 'faq', 'languages', 'sitemap', 'rainbow', 'wheel-of-fate', 'word', 'spin-the-wheel-truth-or-dare', 'dti-theme', 'country', 'zodiac', 'hair-color', 'random-food', 'chance-fortune-wheel', 'oracle', 'tarot', 'yes-and-no-dice', 'blog', 'blog/cant-decide-what-to-eat', 'blog/should-i-let-fate-decide', 'blog/word-of-the-day-word-wheel', 'blog/truth-or-dare-spin-the-wheel', 'blog/random-country-wheel-travel', 'blog/hair-color-wheel-bold-choice'];
const WHEEL_ROUTES = new Set(['', 'rainbow', 'wheel-of-fate', 'word', 'spin-the-wheel-truth-or-dare', 'dti-theme', 'country', 'zodiac', 'hair-color', 'random-food', 'chance-fortune-wheel', 'oracle', 'tarot', 'yes-and-no-dice']);

// English source-copy overrides for crawler-visible static shells (keyed by route slug).
const SOURCE_H1_OVERRIDES_EN = {
  'random-food': 'Food Spin Wheel - Random Food Picker',
  'chance-fortune-wheel': 'Chance and Fortune Wheel — Spin the Wheel of Luck Online',
  'tarot': 'Yes or No Tarot Wheel — Free Online Card Draw'
};

const SOURCE_BODY_SECTIONS_EN = {
  'random-food': [
    { heading: 'How to Use the Food Spin Wheel', body: 'Review the default food options, customize your list with favorites or local restaurants, then press the spin button. When the Food Spin Wheel stops, the winning dish appears so you can order, cook, or decide what to eat.' },
    { heading: 'Why Use a Food Spin Wheel for Decision Making', body: 'A Food Spin Wheel removes decision fatigue when choosing a meal. It is perfect for dinner dilemmas, group meal planning, restaurant picks, meal prep, and dietary rotation. Because the result is random and visible to everyone, the choice feels fair and the debate ends fast.' },
    { heading: 'Popular Food Options on the Spin Wheel', body: 'The Food Spin Wheel comes pre-loaded with popular choices like Pizza, Sushi, Burger, Tacos, Pasta, Salad, Steak, and Sandwich. Use the sidebar to add your own dishes and cuisines, and spin again for a different result every time.' }
  ],
  'chance-fortune-wheel': [
    { heading: 'How to Use the Chance and Fortune Wheel', body: 'Pick between Fortune messages, a Yes / No decision, or Lucky Numbers, then press the spin button. When the Chance and Fortune Wheel stops, the winning segment appears so you can follow your luck, settle a choice, or just enjoy the result.' },
    { heading: 'Why Use a Chance and Fortune Wheel for Decisions', body: 'A chance and fortune wheel removes the stress of small decisions by turning them into a game of luck. It is perfect for daily fortunes, quick yes or no answers, lucky numbers, party dares, and group turn-taking. Because the result is random and visible to everyone, it feels fair and ends the debate fast.' },
    { heading: 'Popular Modes on the Chance and Fortune Wheel', body: 'The Chance and Fortune Wheel comes with three presets: Fortune messages like Great Fortune and Lucky Day, a simple Yes / No mode, and Lucky Numbers one through eight. Use the sidebar to add your own fortunes and outcomes, and spin again for a different result every time.' }
  ],
  'tarot': [
    { heading: 'How to Use the Yes or No Tarot Wheel', body: 'Focus on a clear yes or no question, choose one of the six face-down cards, or press Let the Universe Choose. The Yes or No Tarot Wheel then reveals a Major Arcana card with a yes, no, or maybe answer, its meaning, and guidance text.' },
    { heading: 'Why Use a Yes or No Tarot Wheel for Decisions', body: 'A yes or no tarot wheel adds narrative depth to a simple decision. Instead of a bare random pick, you get a yes or no answer plus card meaning and guidance, so every draw gives you something to reflect on. It is perfect for quick guidance, creative writing prompts, and group icebreakers.' },
    { heading: 'Cards on the Yes or No Tarot Wheel', body: 'The Yes or No Tarot Wheel draws from 21 Major Arcana cards, from The Fool to The World. Each card is pre-assigned a Yes, No, or Maybe answer along with a meaning and guidance text, so every draw delivers a complete, self-contained reading.' }
  ]
};

const templatePath = resolve(projectRoot, 'index.html');
const template = readFileSync(templatePath, 'utf8');

function charLength(value) {
  return [...String(value || '')].length;
}

function sliceChars(value, maxChars) {
  return [...String(value || '')].slice(0, maxChars).join('');
}

function removeFaqSchema(html) {
  return html.replace(/\s*<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>/, '');
}

function getMeta(locale, route) {
  const routeKey = route || 'home';
  if (locale === DEFAULT_LOCALE) {
    return {
      title: ensureLongTitle(ROUTE_TITLES_EN[route], locale, routeKey),
      description: ROUTE_DESCRIPTIONS_EN[route]
    };
  }

  const routeInfo = getLocalizedRouteContent(locale, routeKey);
  return {
    title: ensureLongTitle(`${routeInfo.title} — ${routeInfo.subtitle}`, locale, routeKey),
    description: routeInfo.subtitle
  };
}

function ensureLongTitle(title, locale, route) {
  if (title.length >= 30) return title;
  const routeInfo = getLocalizedRouteContent(locale, route || 'home');
  const fallback = locale === DEFAULT_LOCALE
    ? `${routeInfo.title} Guide and Online Tool`
    : `${routeInfo.title} — ${routeInfo.subtitle}`;
  return fallback.length >= 30 ? fallback : `${fallback} | YesAndNoWheel.com`;
}

function ensureMetaDescription(description, locale, route) {
  const routeInfo = getLocalizedRouteContent(locale, route || 'home');
  const base = String(description || '').replace(/\s+/g, ' ').trim();
  const fallback = locale === DEFAULT_LOCALE
    ? `${routeInfo.title} on YesAndNoWheel.com with fast access to related wheels and tools.`
    : `${routeInfo.title} — ${routeInfo.subtitle}`;
  let value = base || fallback;

  if (charLength(value) > 160) {
    value = `${sliceChars(value, 157).trim().replace(/[,\-;: ]+$/g, '')}...`;
  }

  return value;
}

function getOutputPath(locale, route) {
  if (locale === DEFAULT_LOCALE) {
    if (!route) return resolve(projectRoot, 'index.html');
    return resolve(projectRoot, route, 'index.html');
  }

  const localizedPath = buildLocalizedPath(locale, route || '');
  const relative = localizedPath.replace(/^\/+|\/+$/g, '');
  return resolve(projectRoot, relative, 'index.html');
}

function getCanonicalPath(locale, route) {
  return buildLocalizedPath(locale, route || '');
}

function getHreflangTags(locale, route) {
  const allLocales = [DEFAULT_LOCALE, ...LOCALES.map((l) => l.code).filter((c) => c !== DEFAULT_LOCALE)];
  const tags = allLocales.map((l) => {
    const path = buildLocalizedPath(l, route || '');
    const langAttr = l === 'zh-CN' ? 'zh-Hans-CN' : l;
    return `<link rel="alternate" hreflang="${langAttr}" href="${SITE_URL}${path}">`;
  });
  tags.push(`<link rel="alternate" hreflang="x-default" href="${SITE_URL}${buildLocalizedPath(DEFAULT_LOCALE, route || '')}">`);
  return tags.join('\n  ');
}

function getSourceH1(locale, route) {
  const routeKey = route || 'home';

  if (locale === DEFAULT_LOCALE && SOURCE_H1_OVERRIDES_EN[routeKey]) {
    return SOURCE_H1_OVERRIDES_EN[routeKey];
  }

  if (routeKey === 'home') {
    return getLocalizedRouteContent(locale, 'home').title;
  }

  if (WHEEL_ROUTES.has(routeKey)) {
    return getLocalizedRouteContent(locale, routeKey).title;
  }

  return getLocalizedRouteContent(locale, routeKey).title;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getSourceBodyHtml(locale, route) {
  const routeKey = route || 'home';

  if (locale === DEFAULT_LOCALE && SOURCE_BODY_SECTIONS_EN[routeKey]) {
    const overrideSections = SOURCE_BODY_SECTIONS_EN[routeKey].map((section) => `
      <section>
        <h2>${escapeHtml(section.heading)}</h2>
        <p>${escapeHtml(section.body)}</p>
      </section>
    `).join('');
    return `<section><p>You are viewing the ${escapeHtml(SOURCE_H1_OVERRIDES_EN[routeKey] || getLocalizedRouteContent(locale, routeKey).title)} page in English.</p></section>${overrideSections}`;
  }

  const staticContent = getStaticPageContent(locale, routeKey);
  const sections = staticContent.supportSections || staticContent.sections || [];
  const intro = staticContent.intro ? `<section><p>${escapeHtml(staticContent.intro)}</p></section>` : '';

  if (WHEEL_ROUTES.has(routeKey)) {
    const keyword = escapeHtml(getLocalizedRouteContent(locale, routeKey).title);
    const sectionMarkup = sections.map((section, index) => `
      <section>
        <h2>${escapeHtml(section.heading || `Section ${index + 1}`)}: <strong>${keyword}</strong></h2>
        <p>${escapeHtml(section.body)}</p>
      </section>
    `).join('');
    return `${intro}${sectionMarkup}`;
  }

  const sectionMarkup = sections.map((section) => `
    <section>
      <h2>${escapeHtml(section.heading || section.title || 'More Information')}</h2>
      <p>${escapeHtml(section.body)}</p>
    </section>
  `).join('');
  return `${intro}${sectionMarkup}`;
}

function setHtmlLang(html, locale) {
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  return html.replace(/<html lang="[^"]+"(?: dir="[^"]+")? data-theme="dark">/, `<html lang="${locale}" dir="${dir}" data-theme="dark">`);
}

function getOgLocale(locale) {
  const mapping = {
    en: 'en_US',
    es: 'es_ES',
    fr: 'fr_FR',
    de: 'de_DE',
    pt: 'pt_PT',
    ru: 'ru_RU',
    ar: 'ar_AR',
    hi: 'hi_IN',
    bn: 'bn_BD',
    ur: 'ur_PK',
    id: 'id_ID',
    ja: 'ja_JP',
    mr: 'mr_IN',
    te: 'te_IN',
    'zh-CN': 'zh_CN'
  };

  return mapping[locale] || 'en_US';
}

function getBreadcrumbSchema(locale, route) {
  const routeKey = route || 'home';
  const currentTitle = (locale === DEFAULT_LOCALE && SOURCE_H1_OVERRIDES_EN[routeKey])
    ? SOURCE_H1_OVERRIDES_EN[routeKey]
    : getLocalizedRouteContent(locale, routeKey).title;
  const homeTitle = getLocalizedRouteContent(locale, 'home').title;
  const currentPath = buildLocalizedPath(locale, routeKey === 'home' ? '' : routeKey);
  const homePath = buildLocalizedPath(locale, '');

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": homeTitle,
        "item": `${SITE_URL}${homePath}`
      },
      ...(routeKey !== 'home' ? [{
        "@type": "ListItem",
        "position": 2,
        "name": currentTitle,
        "item": `${SITE_URL}${currentPath}`
      }] : [])
    ]
  }, null, 2);
}

function getLocalizedNav(locale, activeRoute) {
  const homePath = buildLocalizedPath(locale, '');
  const isActive = (route) => (activeRoute || '') === route ? ' active' : '';
  const uiText = getUiText(locale);

  const navLinks = {
    home: buildLocalizedPath(locale, ''),
    rainbow: buildLocalizedPath(locale, 'rainbow'),
    wheelOfFate: buildLocalizedPath(locale, 'wheel-of-fate'),
    word: buildLocalizedPath(locale, 'word'),
    truthOrDare: buildLocalizedPath(locale, 'spin-the-wheel-truth-or-dare'),
    dtiTheme: buildLocalizedPath(locale, 'dti-theme'),
    country: buildLocalizedPath(locale, 'country'),
    zodiac: buildLocalizedPath(locale, 'zodiac'),
    hairColor: buildLocalizedPath(locale, 'hair-color'),
    randomFood: buildLocalizedPath(locale, 'random-food'),
    chanceFortune: buildLocalizedPath(locale, 'chance-fortune-wheel'),
    tarot: buildLocalizedPath(locale, 'tarot'),
    oracle: buildLocalizedPath(locale, 'oracle'),
    dice: buildLocalizedPath(locale, 'yes-and-no-dice'),
    aboutUs: buildLocalizedPath(locale, 'about-us'),
    contact: buildLocalizedPath(locale, 'contact'),
    blog: buildLocalizedPath(locale, 'blog')
  };

  const t = (key) => getLocalizedRouteContent(locale, key).title;

  return `
        <a href="${homePath}" class="nav-brand">
          <img class="nav-brand-mark" src="/images/brand/yes-and-no-wheel-mark.svg" alt="Yes and No Wheel logo"
            width="42" height="42">
          <span class="brand-wordmark" aria-label="Yes and No Wheel">
            <span>Yes</span>
            <span class="brand-wordmark-amp">&amp;</span>
            <span>No Wheel</span>
          </span>
        </a>

        <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <ul class="nav-menu" id="navMenu">
          <li><a href="${navLinks.home}" class="nav-link${isActive('')}">🏠 <span id="navHomeLabel">${t('home')}</span></a></li>

          <!-- Wheels Dropdown -->
          <li class="nav-dropdown" id="wheelsDropdown">
            <button class="nav-link dropdown-trigger" id="wheelsDropdownBtn">
              🎡 <span id="navWheelsLabel">${uiText.wheelsHeading || 'Decision Wheels'}</span>
              <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div class="dropdown-menu" id="wheelsDropdownMenu">
              <a href="${navLinks.rainbow}" class="dropdown-link">🌈 <span id="navRainbowWheelLabel">${t('rainbow')}</span></a>
              <a href="${navLinks.wheelOfFate}" class="dropdown-link">⚔️ <span id="navWheelOfFateLabel">${t('wheel-of-fate')}</span></a>
              <a href="${navLinks.word}" class="dropdown-link">📖 <span id="navWordWheelLabel">${t('word')}</span></a>
              <a href="${navLinks.truthOrDare}" class="dropdown-link">🎉 <span
                  id="navTruthOrDareWheelLabel">${t('spin-the-wheel-truth-or-dare')}</span></a>
              <a href="${navLinks.dtiTheme}" class="dropdown-link">👗 <span id="navDTIWheelLabel">${t('dti-theme')}</span></a>
              <a href="${navLinks.country}" class="dropdown-link">🌍 <span id="navCountryWheelLabel">${t('country')}</span></a>
              <a href="${navLinks.zodiac}" class="dropdown-link">✨ <span id="navZodiacWheelLabel">${t('zodiac')}</span></a>
              <a href="${navLinks.hairColor}" class="dropdown-link">💇 <span id="navHairColorWheelLabel">${t('hair-color')}</span></a>
              <a href="${navLinks.randomFood}" class="dropdown-link">🍔 <span id="navFoodWheelLabel">${t('random-food')}</span></a>
              <a href="${navLinks.chanceFortune}" class="dropdown-link">🍀 <span id="navChanceFortuneWheelLabel">${t('chance-fortune-wheel')}</span></a>
            </div>
          </li>

          <!-- Tarot & Oracle Dropdown -->
          <li class="nav-dropdown" id="tarotDropdown">
            <button class="nav-link dropdown-trigger" id="tarotDropdownBtn">
              🃏 <span id="navTarotOracleLabel">${uiText.tarotAndOracleHeading || 'Tarot & Oracle'}</span>
              <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div class="dropdown-menu" id="tarotDropdownMenu">
              <a href="${navLinks.tarot}" class="dropdown-link">🃏 <span id="navYesNoTarotLabel">${t('tarot')}</span></a>
              <a href="${navLinks.oracle}" class="dropdown-link">🔮 <span id="navYesNoOracleLabel">${t('oracle')}</span></a>
            </div>
          </li>

          <li><a href="${navLinks.dice}" class="nav-link">🎲 <span id="navYesNoDiceLabel">${t('yes-and-no-dice')}</span></a>
          </li>

          <li><a href="${navLinks.aboutUs}" class="nav-link">ℹ️ <span id="navAboutLabel">${t('about-us')}</span></a></li>
          <li><a href="${navLinks.contact}" class="nav-link">📧 <span id="navContactLabel">${t('contact')}</span></a></li>
          <li><a href="${navLinks.blog}" class="nav-link">📝 <span id="navBlogLabel">${t('blog')}</span></a></li>
          <li>
            <button class="theme-toggle-btn" id="headerThemeBtn" title="Toggle Dark/Light Mode"
              aria-label="Toggle Dark/Light Mode">
              <span class="sun-icon">☀️</span>
              <span class="moon-icon">🌙</span>
            </button>
          </li>
        </ul>`;
}

function getLocalizedFooter(locale, route) {
  const homePath = buildLocalizedPath(locale, '');
  const aboutPath = buildLocalizedPath(locale, 'about-us');
  const faqPath = buildLocalizedPath(locale, 'faq');
  const dicePath = buildLocalizedPath(locale, 'yes-and-no-dice');
  const contactPath = buildLocalizedPath(locale, 'contact');
  const termsPath = buildLocalizedPath(locale, 'terms');
  const privacyPath = buildLocalizedPath(locale, 'privacy');
  const sitemapPath = buildLocalizedPath(locale, 'sitemap');

  const t = (key) => getLocalizedRouteContent(locale, key).title;
  const staticContent = getStaticPageContent(locale);
  const uiText = getUiText(locale);

  const allLocales = [{ code: 'en', label: 'English' }, ...LOCALES.filter(l => l.code !== 'en')];
  const languageOptions = allLocales.map(l => {
    const langPath = buildLocalizedPath(l.code, route || '');
    const isSelected = l.code === locale ? ' selected' : '';
    return `<option value="${langPath}"${isSelected}>${l.label}</option>`;
  }).join('');

  const langSelectHtml = `<select class="footer-lang-select" onchange="if(this.value) window.location.href=this.value">
    ${languageOptions}
  </select>`;

  return `
      <div class="footer-col footer-brand-col">
        <a href="${homePath}" class="nav-brand footer-brand-link" aria-label="YesAndNoWheel home">
          <img class="nav-brand-mark" src="/images/brand/yes-and-no-wheel-mark.svg" alt="Yes and No Wheel logo"
            width="42" height="42">
          <span class="brand-wordmark" aria-label="Yes and No Wheel">
            <span>Yes</span>
            <span class="brand-wordmark-amp">&amp;</span>
            <span>No Wheel</span>
          </span>
        </a>
        <p class="footer-desc" id="footerDescription">${uiText.footerDescription || 'Fast decision wheels for quick choices, party games, classrooms, and creative prompts.'}</p>
        <div class="footer-socials">
          <a href="https://www.facebook.com/yesandnowheel/" target="_blank" rel="noopener" aria-label="Facebook"
            title="Follow us on Facebook" class="social-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/company/yes-and-no-wheel/" target="_blank" rel="noopener"
            aria-label="LinkedIn" title="Follow us on LinkedIn" class="social-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path
                d="M6.94 8.5a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12ZM5.5 9.75h2.88V18H5.5V9.75Zm4.69 0h2.76v1.13h.04c.39-.73 1.33-1.5 2.75-1.5 2.94 0 3.48 1.94 3.48 4.46V18h-2.88v-3.67c0-.88-.02-2-.01-2 0-1.02-.73-1.49-1.42-1.49-.78 0-1.26.53-1.46 1.05-.08.18-.1.43-.1.68V18H10.2V9.75Z" />
            </svg>
          </a>
          <a href="https://www.pinterest.com/yesandnowheel/" target="_blank" rel="noopener" aria-label="Pinterest"
            title="Follow us on Pinterest" class="social-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path
                d="M12.04 2C6.58 2 4 5.93 4 9.21c0 2.27.86 4.29 2.71 5.04.3.12.57 0 .66-.33.06-.23.2-.8.26-1.04.09-.33.06-.45-.19-.75-.54-.63-.88-1.45-.88-2.61 0-3.37 2.52-6.39 6.56-6.39 3.58 0 5.54 2.19 5.54 5.11 0 3.84-1.7 7.08-4.23 7.08-1.39 0-2.43-1.15-2.09-2.56.4-1.67 1.17-3.47 1.17-4.67 0-1.08-.58-1.98-1.78-1.98-1.41 0-2.54 1.46-2.54 3.42 0 1.25.42 2.09.42 2.09l-1.7 7.21c-.5 2.12-.07 4.72-.04 4.98.02.15.21.19.29.07.12-.16 1.63-2.02 2.14-3.89.14-.53.81-3.12.81-3.12.4.77 1.57 1.44 2.82 1.44 3.71 0 6.22-3.38 6.22-7.9C20 5.18 16.78 2 12.04 2Z" />
            </svg>
          </a>
        </div>
      </div>

      <div class="footer-col footer-links-col">
        <h3 id="footerPagesHeading">${uiText.pagesHeading || 'Links'}</h3>
        <a href="${aboutPath}" id="footerAboutLink">${t('about-us')}</a>
        <a href="${faqPath}" id="footerFaqLink">${t('faq')}</a>
        <a href="${dicePath}">${t('yes-and-no-dice')}</a>
        <a href="${contactPath}" id="footerContactLink">${t('contact')}</a>
        <a href="${termsPath}" id="footerTermsLink">${t('terms')}</a>
        <a href="${privacyPath}" id="footerPrivacyLink">${t('privacy')}</a>
        <a href="${sitemapPath}" id="footerSitemapLink">${t('sitemap')}</a>
      </div>

      <div class="footer-col footer-lang-col">
        <h3 id="footerLangHeading">${uiText.language || 'Languages'}</h3>
        ${langSelectHtml}
      </div>`;
}

const locales = [DEFAULT_LOCALE, ...LOCALES.map((locale) => locale.code).filter((code) => code !== DEFAULT_LOCALE)];

for (const locale of locales) {
  for (const route of ROUTES) {
    const { title, description: rawDescription } = getMeta(locale, route);
    const description = ensureMetaDescription(rawDescription, locale, route);
    const canonicalPath = getCanonicalPath(locale, route);
    const url = `${SITE_URL}${canonicalPath}`;

    const localizedNav = getLocalizedNav(locale, route);
    const localizedFooter = getLocalizedFooter(locale, route);
    const uiText = getUiText(locale);

    let html = template
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
      .replace(/<meta name="description" content="[\s\S]*?">/, `<meta name="description" content="${description}">`)
      .replace(/<link rel="canonical" href="[\s\S]*?">/, `<link rel="canonical" href="${url}">\n  ${getHreflangTags(locale, route)}`)
      .replace(/<meta property="og:title" content="[\s\S]*?">/, `<meta property="og:title" content="${title}">`)
      .replace(/<meta property="og:description" content="[\s\S]*?">/, `<meta property="og:description" content="${description}">`)
      .replace(/<meta property="og:url" content="[\s\S]*?">/, `<meta property="og:url" content="${url}">`)
      .replace(/<meta property="og:locale" content="[\s\S]*?">/, `<meta property="og:locale" content="${getOgLocale(locale)}">`)
      .replace(/<meta property="og:image" content="[\s\S]*?">/, `<meta property="og:image" content="${OG_IMAGE_URL}">`)
      .replace(/<meta property="og:image:secure_url" content="[\s\S]*?">/, `<meta property="og:image:secure_url" content="${OG_IMAGE_URL}">`)
      .replace(/<meta property="og:image:type" content="[\s\S]*?">/, `<meta property="og:image:type" content="image/svg+xml">`)
      .replace(/<meta property="og:image:width" content="[\s\S]*?">/, `<meta property="og:image:width" content="1200">`)
      .replace(/<meta property="og:image:height" content="[\s\S]*?">/, `<meta property="og:image:height" content="630">`)
      .replace(/<meta property="og:image:alt" content="[\s\S]*?">/, `<meta property="og:image:alt" content="Yes and No Wheel professional brand preview">`)
      .replace(/<meta name="twitter:title" content="[\s\S]*?">/, `<meta name="twitter:title" content="${title}">`)
      .replace(/<meta name="twitter:description" content="[\s\S]*?">/, `<meta name="twitter:description" content="${description}">`)
      .replace(/<meta name="twitter:image" content="[\s\S]*?">/, `<meta name="twitter:image" content="${OG_IMAGE_URL}">`)
      .replace(/<meta name="twitter:image:alt" content="[\s\S]*?">/, `<meta name="twitter:image:alt" content="Yes and No Wheel professional brand preview">`)
      .replace(/<link rel="stylesheet" href="\/index\.min\.css\?v=[^"]+">/, `<link rel="stylesheet" href="/index.min.css?v=${ASSET_VERSION}">`)
      .replace(/<script type="module" src="\/js\/main\.js\?v=[^"]+"><\/script>/, `<script type="module" src="/js/main.js?v=${ASSET_VERSION}"></script>`)
      .replace(/<script type="application\/ld\+json" id="breadcrumb-schema">[\s\S]*?<\/script>/, `<script type="application/ld+json" id="breadcrumb-schema">\n${getBreadcrumbSchema(locale, route)}\n  </script>`)
      .replace(
        /"description": "Spin the Yes and No Wheel to make instant decisions! The ultimate decision-making hub with 8 specialized spinning wheels\."/,
        `"description": "${description}"`
      )
      .replace(
        /<div id="app">[\s\S]*?<\/div>\s*<\/div>\s*<\/main>\s*<!-- Footer -->/,
        `<div id="app"><div class="source-route-copy" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;"><article class="source-route-article"><header><h1 class="source-route-h1">${escapeHtml(getSourceH1(locale, route))}</h1></header><section>${getSourceBodyHtml(locale, route)}</section></article></div></div>\n  </main>\n\n  <!-- Footer -->`
      )
      .replace(
        /<header class="site-header">[\s\S]*?<\/header>/,
        `<header class="site-header">\n    <nav class="main-nav" id="mainNav">\n      <div class="nav-container">${localizedNav}\n      </div>\n    </nav>\n  </header>`
      )
      .replace(
        /<footer class="site-footer">[\s\S]*?<\/footer>/,
        `<footer class="site-footer">\n    <div class="footer-container">${localizedFooter}\n\n      <div class="footer-col footer-contact-col">\n        <h3 id="footerContactHeading">${uiText.contact || 'Contact'}</h3>\n        <p class="footer-contact-item">\n          <span class="footer-contact-icon" aria-hidden="true">\n            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"\n              stroke-linecap="round" stroke-linejoin="round">\n              <path d="M4 4h16v16H4z"></path>\n              <path d="M22 6l-10 7L2 6"></path>\n            </svg>\n          </span>\n          <span>contact@yesandnowheel.com</span>\n        </p>\n        <p class="footer-contact-item">\n          <span class="footer-contact-icon" aria-hidden="true">\n            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"\n              stroke-linecap="round" stroke-linejoin="round">\n              <path\n                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72l.39 2.57a2 2 0 0 1-.57 1.7l-1.28 1.28a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 1.7-.57l2.57.39A2 2 0 0 1 22 16.92z">\n              </path>\n            </svg>\n          </span>\n          <span>+1 (415) 555-0199</span>\n        </p>\n      </div>\n    </div>\n    <div class="footer-bottom">\n      <p>&copy; 2025 YesAndNoWheel.com. All rights reserved.</p>\n    </div>\n  </footer>`
      );

    html = setHtmlLang(html, locale);

    const isHomeVariant = route === '' || route === 'home';
    if (!isHomeVariant) {
      html = removeFaqSchema(html);
    }

    const outputPath = getOutputPath(locale, route);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, html);
    console.log(`Wrote ${outputPath}`);
  }
}
