import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { LOCALES, buildLocalizedPath, getHomeText, getLocalizedRouteContent, getStaticPageContent, getWheelSharedText } from '../js/i18n.js';

const SITE_URL = 'https://www.yesandnowheel.com';
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
  'random-food': 'Random Food Wheel | Food Decision Spinner',
  'yes-no-oracle': 'Yes No Oracle | Accurate Yes or No Oracle Free Online',
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
  'random-food': 'Spin the Random Food Wheel to decide what to eat! Free online food spinner with custom entries. Try it now!',
  'yes-no-oracle': 'Need clarity? Consult our free Yes No Oracle. This accurate yes or no spinner helps you make decisions quickly. Just focus on your yes or no question and spin the oracle for instant answers. Perfect for when you are stuck and need divine intervention.',
  'blog': 'Read decision-making tips, party game ideas, and creative prompts powered by our spinning wheels. Free blog articles.',
  'blog/cant-decide-what-to-eat': "End the dinner debate! Spin the Random Food Wheel and let fate pick your meal. Decision-making tips and fun ideas.",
  'blog/should-i-let-fate-decide': 'Fate vs free will — 5 life dilemmas to spin the Wheel of Fate. Real scenarios, real decisions, real fun.',
  'blog/word-of-the-day-word-wheel': 'Writers, artists, journalers: spin the Word Wheel for creative prompts. Haiku challenge, character names, icebreakers.',
  'blog/truth-or-dare-spin-the-wheel': 'Stop arguing about Truth or Dare! Spin the wheel for 100+ curated prompts. Perfect for parties and game nights.',
  'blog/random-country-wheel-travel': 'Too many countries, too little time. Spin the Country Wheel and plan a virtual world tour tonight.',
  'blog/hair-color-wheel-bold-choice': 'Should you dye your hair? Spin the Hair Color Wheel for classic and fantasy colors. Take a screenshot for your stylist.'
};

const ROUTES = ['', 'about-us', 'contact', 'terms', 'privacy', 'faq', 'languages', 'sitemap', 'rainbow', 'wheel-of-fate', 'word', 'spin-the-wheel-truth-or-dare', 'dti-theme', 'country', 'zodiac', 'hair-color', 'random-food', 'yes-no-oracle', 'blog', 'blog/cant-decide-what-to-eat', 'blog/should-i-let-fate-decide', 'blog/word-of-the-day-word-wheel', 'blog/truth-or-dare-spin-the-wheel', 'blog/random-country-wheel-travel', 'blog/hair-color-wheel-bold-choice'];
const WHEEL_ROUTES = new Set(['', 'rainbow', 'wheel-of-fate', 'word', 'spin-the-wheel-truth-or-dare', 'dti-theme', 'country', 'zodiac', 'hair-color', 'random-food', 'yes-no-oracle']);

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
    : `${routeInfo.title} on YesAndNoWheel.com.`;
  let value = base || fallback;
  const additions = [' Learn more.', ' Try now.', ' Online.', ' Fast.', ' Now.', '.'];

  if (charLength(value) > 155) {
    value = `${sliceChars(value, 152).trim().replace(/[,\-;: ]+$/g, '')}...`;
  }

  while (charLength(value) < 150) {
    const room = 155 - charLength(value);
    const addition = additions.find((item) => charLength(item) <= room) || '.';
    value += addition;
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

function getSourceH1(locale, route) {
  const routeKey = route || 'home';

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
  const currentTitle = getLocalizedRouteContent(locale, routeKey).title;
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

const locales = [DEFAULT_LOCALE, ...LOCALES.map((locale) => locale.code).filter((code) => code !== DEFAULT_LOCALE)];

for (const locale of locales) {
  for (const route of ROUTES) {
    const { title, description: rawDescription } = getMeta(locale, route);
    const description = ensureMetaDescription(rawDescription, locale, route);
    const canonicalPath = getCanonicalPath(locale, route);
    const url = `${SITE_URL}${canonicalPath}`;

    let html = template
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
      .replace(/<meta name="description" content="[\s\S]*?">/, `<meta name="description" content="${description}">`)
      .replace(/<link rel="canonical" href="[\s\S]*?">/, `<link rel="canonical" href="${url}">`)
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
