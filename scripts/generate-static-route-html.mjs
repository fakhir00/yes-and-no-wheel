import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { LOCALES, buildLocalizedPath, getHomeText, getLocalizedRouteContent, getWheelSharedText } from '../js/i18n.js';

const SITE_URL = 'https://yesandnowheel.com';
const DEFAULT_LOCALE = 'en';

const ROUTE_TITLES_EN = {
  '': 'Yes and No Wheel — #1 Free Random Decision Spinner',
  home: 'Yes and No Wheel — #1 Free Random Decision Spinner',
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
  'hair-color': 'Hair Color Wheel — Find Your Next Hair Dye Color'
};

const ROUTE_DESCRIPTIONS_EN = {
  '': 'Spin the Yes and No Wheel to decide instantly! Free online spinner with 8 wheels. Customizable and fun. Try it now!',
  home: 'Spin the Yes and No Wheel to decide instantly! Free online spinner with 8 wheels. Customizable and fun. Try it now!',
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
  'hair-color': 'Spin the Hair Color Wheel to find your next dye color! Classic and fantasy palettes with hex codes. Try now!'
};

const ROUTES = ['', 'home', 'about-us', 'contact', 'terms', 'privacy', 'faq', 'languages', 'sitemap', 'rainbow', 'wheel-of-fate', 'word', 'spin-the-wheel-truth-or-dare', 'dti-theme', 'country', 'zodiac', 'hair-color'];
const WHEEL_ROUTES = new Set(['', 'home', 'rainbow', 'wheel-of-fate', 'word', 'spin-the-wheel-truth-or-dare', 'dti-theme', 'country', 'zodiac', 'hair-color']);

const templatePath = resolve('index.html');
const template = readFileSync(templatePath, 'utf8');

function removeFaqSchema(html) {
  return html.replace(/\s*<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>/, '');
}

function getMeta(locale, route) {
  if (locale === DEFAULT_LOCALE) {
    return {
      title: ROUTE_TITLES_EN[route],
      description: ROUTE_DESCRIPTIONS_EN[route]
    };
  }

  const routeKey = route || 'home';
  const routeInfo = getLocalizedRouteContent(locale, routeKey);
  return {
    title: `${routeInfo.title} — YesAndNoWheel.com`,
    description: routeInfo.subtitle
  };
}

function ensureLongMetaDescription(description, locale, route) {
  const routeInfo = getLocalizedRouteContent(locale, route || 'home');
  const fallback = locale === DEFAULT_LOCALE
    ? 'Explore the page, review key features, and move to related wheels, language routes, and support pages across YesAndNoWheel.com.'
    : `${routeInfo.title} includes related navigation, clearer page context, and links to other helpful routes on YesAndNoWheel.com.`;
  const enriched = `${description} ${routeInfo.title} is part of the wider YesAndNoWheel.com experience, with related tools, localized routes, and clearer internal navigation for users and search visibility.`;
  return enriched.length >= 160 ? enriched : `${enriched} ${fallback}`;
}

function getOutputPath(locale, route) {
  if (locale === DEFAULT_LOCALE) {
    if (!route) return resolve('index.html');
    return resolve(route, 'index.html');
  }

  const localizedPath = buildLocalizedPath(locale, route === 'home' ? '' : route);
  const relative = localizedPath.replace(/^\/+|\/+$/g, '');
  return resolve(relative, 'index.html');
}

function getCanonicalPath(locale, route) {
  return buildLocalizedPath(locale, route === 'home' ? '' : route);
}

function getSourceH1(locale, route) {
  const routeKey = route || 'home';

  if (routeKey === 'home') {
    return getHomeText(locale).howTitle;
  }

  if (WHEEL_ROUTES.has(routeKey)) {
    return getWheelSharedText(locale, routeKey).howToUse;
  }

  return getLocalizedRouteContent(locale, routeKey).title;
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

const locales = [DEFAULT_LOCALE, ...LOCALES.map((locale) => locale.code).filter((code) => code !== DEFAULT_LOCALE)];

for (const locale of locales) {
  for (const route of ROUTES) {
    const { title, description: rawDescription } = getMeta(locale, route);
    const description = ensureLongMetaDescription(rawDescription, locale, route);
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
      .replace(/<meta name="twitter:title" content="[\s\S]*?">/, `<meta name="twitter:title" content="${title}">`)
      .replace(/<meta name="twitter:description" content="[\s\S]*?">/, `<meta name="twitter:description" content="${description}">`)
      .replace(
        /"description": "Spin the Yes and No Wheel to make instant decisions! The ultimate decision-making hub with 8 specialized spinning wheels\."/,
        `"description": "${description}"`
      )
      .replace(
        /<div id="app"><\/div>/,
        `<div id="app"><h1 class="source-route-h1" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;">${getSourceH1(locale, route)}</h1></div>`
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
