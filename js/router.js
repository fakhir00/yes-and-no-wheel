// router.js — Path-based SPA router (no hash)
import { renderHomePage } from './pages/HomePage.js?v=20260331-wheelfaq1';
import { renderAboutPage } from './pages/AboutPage.js?v=20260331-wheelfaq2';
import { renderContactPage } from './pages/ContactPage.js?v=20260331-wheelfaq2';
import { renderTermsPage } from './pages/TermsPage.js?v=20260331-wheelfaq2';
import { renderPrivacyPage } from './pages/PrivacyPage.js?v=20260331-wheelfaq2';
import { renderSitemapPage } from './pages/SitemapPage.js?v=20260331-wheelfaq2';
import { renderNotFoundPage } from './pages/NotFoundPage.js?v=20260331-wheelfaq2';
import { renderFaqPage } from './pages/FaqPage.js?v=20260331-wheelfaq2';
import { renderLanguagesPage } from './pages/LanguagesPage.js?v=20260331-wheelfaq2';
import { renderRainbowWheel } from './wheels/RainbowWheel.js?v=20260331-wheelfaq2';
import { renderWheelOfFate } from './wheels/WheelOfFate.js?v=20260331-wheelfaq2';
import { renderWordWheel } from './wheels/WordWheel.js?v=20260331-wheelfaq2';
import { renderTruthOrDare } from './wheels/TruthOrDare.js?v=20260331-wheelfaq2';
import { renderDTIWheel } from './wheels/DTIWheel.js?v=20260331-wheelfaq2';
import { renderCountryWheel } from './wheels/CountryWheel.js?v=20260331-wheelfaq2';
import { renderZodiacWheel } from './wheels/ZodiacWheel.js?v=20260331-wheelfaq2';
import { renderHairColorWheel } from './wheels/HairColorWheel.js?v=20260331-wheelfaq2';
import { DEFAULT_LOCALE, LOCALES, buildLocalizedPath, getUiText, localizeHref, normalizeLocale, splitLocaleFromPath } from './i18n.js?v=20260331-wheelfaq1';

const routes = {
  '': renderHomePage,
  'home': renderHomePage,
  'about-us': renderAboutPage,
  'contact': renderContactPage,
  'terms': renderTermsPage,
  'privacy': renderPrivacyPage,
  'faq': renderFaqPage,
  'languages': renderLanguagesPage,
  'sitemap': renderSitemapPage,
  '404': renderNotFoundPage,
  'rainbow': renderRainbowWheel,
  'wheel-of-fate': renderWheelOfFate,
  'word': renderWordWheel,
  'spin-the-wheel-truth-or-dare': renderTruthOrDare,
  'dti-theme': renderDTIWheel,
  'country': renderCountryWheel,
  'zodiac': renderZodiacWheel,
  'hair-color': renderHairColorWheel,
  // Legacy hash-to-path aliases
  'fate': renderWheelOfFate,
  'tod': renderTruthOrDare,
  'dti': renderDTIWheel,
  'hair': renderHairColorWheel,
};

const routeTitles = {
  '': 'Yes and No Wheel — #1 Free Random Decision Spinner [2026]',
  'home': 'Yes and No Wheel — #1 Free Random Decision Spinner [2026]',
  'about-us': 'About Us — YesAndNoWheel.com',
  'contact': 'Contact Us — YesAndNoWheel.com',
  'terms': 'Terms of Service — YesAndNoWheel.com',
  'privacy': 'Privacy Policy — YesAndNoWheel.com',
  'faq': 'Frequently Asked Questions — YesAndNoWheel.com',
  'languages': 'Languages — YesAndNoWheel.com',
  'sitemap': 'Sitemap — YesAndNoWheel.com',
  '404': 'Page Not Found — YesAndNoWheel.com',
  'rainbow': 'Rainbow Wheel — #1 Free Color Picker Spinner Wheel [2026]',
  'wheel-of-fate': 'Wheel of Fate — The Best Custom RPG Story Spinner [2026]',
  'word': 'Word Wheel — #1 Free Random Name Picker Spinner [2026]',
  'spin-the-wheel-truth-or-dare': 'Spin the Wheel Truth or Dare — Fun Party Game [2026]',
  'dti-theme': 'DTI Theme Wheel — Spin For 180+ DTI Outfit Themes [2026]',
  'country': 'Country Wheel — Pick Randomly From Top 199 Countries [2026]',
  'zodiac': 'Zodiac Wheel — Spin For Your Best Star Sign Destiny [2026]',
  'hair-color': 'Hair Color Wheel — Find Your Next Hair Dye Color [2026]',
  'fate': 'Wheel of Fate — The Best Custom RPG Story Spinner [2026]',
  'tod': 'Spin the Wheel Truth or Dare — Fun Party Game [2026]',
  'dti': 'DTI Theme Wheel — Spin For 180+ DTI Outfit Themes [2026]',
  'hair': 'Hair Color Wheel — Find Your Next Hair Dye Color [2026]',
};

const routeDescriptions = {
  '': 'Spin the Yes and No Wheel to decide instantly! Free online spinner with 8 wheels. Customizable and fun. Try it now!',
  'home': 'Spin the Yes and No Wheel to decide instantly! Free online spinner with 8 wheels. Customizable and fun. Try it now!',
  'contact': 'Contact YesAndNoWheel.com — reach out with questions, feedback, or feature requests. We respond within 24-48 hours.',
  'faq': 'Read common questions and answers about YesAndNoWheel.com, our random wheels, customization features, and device compatibility.',
  'languages': 'Browse the supported language versions of YesAndNoWheel.com and discover language-specific route paths.',
  'rainbow': 'Spin the Rainbow Wheel and let ROYGBIV colors decide. Free online color spinner with custom entries. Try it now!',
  'wheel-of-fate': 'Spin the Wheel of Fate for dramatic outcomes. Perfect for writers and RPG players. Weighted entries and cosmic design.',
  'word': 'Use the Word Wheel to randomly pick names. Upload CSV, paste names, and spin. Perfect for classrooms and raffles.',
  'spin-the-wheel-truth-or-dare': 'Spin the Wheel Truth or Dare for parties! 200+ curated prompts with player picker. Free neon-themed game.',
  'dti-theme': 'Spin the DTI Theme Wheel for Dress To Impress inspiration! 180+ themes by category. Free random theme generator.',
  'country': 'Spin the Country Wheel to pick from 199 countries! Filter by continent with flags. Great for geography games.',
  'zodiac': 'Spin the Zodiac Wheel to reveal your star sign destiny. 12 signs with traits and compatibility. Free spinner.',
  'hair-color': 'Spin the Hair Color Wheel to find your next dye color! Classic and fantasy palettes with hex codes. Try now!',
  'fate': 'Spin the Wheel of Fate for dramatic outcomes. Perfect for writers and RPG players. Weighted entries and cosmic design.',
  'tod': 'Spin the Wheel Truth or Dare for parties! 200+ curated prompts with player picker. Free neon-themed game.',
  'dti': 'Spin the DTI Theme Wheel for Dress To Impress inspiration! 180+ themes by category. Free random theme generator.',
  'hair': 'Spin the Hair Color Wheel to find your next dye color! Classic and fantasy palettes with hex codes. Try now!',
};

// Canonical slug mapping (legacy routes redirect to canonical)
const canonicalSlugs = {
  '': 'home',
  'fate': 'wheel-of-fate',
  'tod': 'spin-the-wheel-truth-or-dare',
  'dti': 'dti-theme',
  'hair': 'hair-color',
};

let currentEngine = null;
let currentLocale = DEFAULT_LOCALE;

/**
 * Extract the route slug from the current URL.
 * Supports both path-based (/rainbow/) and hash-based (#rainbow) for backwards compat.
 */
function getRouteSlug() {
  // First check for hash (backwards compatibility)
  const hash = window.location.hash.slice(1);
  if (hash) {
    // Redirect hash URLs to path URLs
    const slug = hash.split('?')[0];
    const canonical = canonicalSlugs[slug] || slug;
    const newPath = buildLocalizedPath(currentLocale, canonical === 'home' ? '' : canonical);
    window.history.replaceState(null, '', newPath);
    return canonical === 'home' ? '' : canonical;
  }

  const { locale, slug } = splitLocaleFromPath(window.location.pathname);
  currentLocale = locale;
  return slug.replace(/^index\.html$/i, '');
}

export function initRouter() {
  // Listen for back/forward navigation
  window.addEventListener('popstate', handleRoute);

  // Intercept all internal link clicks for SPA navigation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');

    // Skip external links, mailto, tel, javascript, etc.
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

    // Handle old hash links (convert to path)
    if (href.startsWith('#')) {
      e.preventDefault();
      const slug = href.slice(1);
      const canonical = canonicalSlugs[slug] || slug;
      const newPath = buildLocalizedPath(currentLocale, canonical === 'home' ? '' : canonical);
      window.history.pushState(null, '', newPath);
      handleRoute();
      return;
    }

    // Handle relative path links (internal SPA links)
    if (href.startsWith('/')) {
      e.preventDefault();
      const { slug } = splitLocaleFromPath(href);
      const path = buildLocalizedPath(currentLocale, slug);
      window.history.pushState(null, '', path);
      handleRoute();
      return;
    }
  });

  // Handle initial route
  handleRoute();
}

function handleRoute() {
  const route = getRouteSlug();
  const app = document.getElementById('app');
  const uiText = getUiText(currentLocale);

  if (currentEngine && currentEngine.destroy) currentEngine.destroy();

  app.style.opacity = '0';
  app.style.transform = 'translateY(10px)';

  setTimeout(() => {
    try {
      const renderer = routes[route] || renderNotFoundPage;
      currentEngine = renderer(app);
      document.title = routeTitles[route] || routeTitles[''];
      document.documentElement.lang = currentLocale;
      document.documentElement.dir = currentLocale === 'ar' ? 'rtl' : 'ltr';

      // Update meta description
      const desc = routeDescriptions[route] || routeDescriptions[''];
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && desc) metaDesc.setAttribute('content', desc);

      // Update canonical URL
      const canonical = canonicalSlugs[route] || route || 'home';
      let canonicalEl = document.querySelector('link[rel="canonical"]');
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalEl);
      }
      const canonicalPath = buildLocalizedPath(currentLocale, canonical === 'home' ? '' : canonical);
      canonicalEl.setAttribute('href', `https://yesandnowheel.com${canonicalPath}`);
      updateAlternateLanguages(canonical);

      // Update BreadcrumbList schema
      updateBreadcrumb(route);
      updateStaticUi(uiText);
      updateLocalizedLinks();
      updateLanguageSelector();

      // Update active nav
      document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        let linkSlug = '';
        if (href.startsWith('/')) {
          linkSlug = href.replace(/^\/+|\/+$/g, '');
        } else if (href.startsWith('#')) {
          linkSlug = href.slice(1);
        }
        const isActive = linkSlug === route || (linkSlug === 'home' && route === '') || (linkSlug === '' && route === '');
        link.classList.toggle('active', isActive);
      });

      // Close mobile nav
      const navMenu = document.getElementById('navMenu');
      if (navMenu) navMenu.classList.remove('open');
    } catch (e) {
      console.error(e);
      app.innerHTML = `<div style="color:red; padding: 50px;">Error rendering wheel: ${e.message}<br>${e.stack}</div>`;
    }

    requestAnimationFrame(() => {
      app.style.opacity = '1';
      app.style.transform = 'translateY(0)';
      
      // Clear transform after animation completes so 'position: fixed' modals work correctly
      setTimeout(() => {
        if (app.style.transform === 'translateY(0px)' || app.style.transform === 'translateY(0)') {
          app.style.transform = '';
        }
      }, 300);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 150);
}

function updateBreadcrumb(route) {
  let breadcrumbEl = document.getElementById('breadcrumb-schema');
  if (!breadcrumbEl) {
    breadcrumbEl = document.createElement('script');
    breadcrumbEl.id = 'breadcrumb-schema';
    breadcrumbEl.type = 'application/ld+json';
    document.head.appendChild(breadcrumbEl);
  }
  const pageName = routeTitles[route]?.split('—')[0]?.trim() || 'Home';
  const canonical = canonicalSlugs[route] || route || 'home';
  const canonicalPath = buildLocalizedPath(currentLocale, canonical === 'home' ? '' : canonical);
  const homePath = buildLocalizedPath(currentLocale, '');
  breadcrumbEl.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://yesandnowheel.com${homePath}` },
      ...(route && route !== 'home' ? [{ "@type": "ListItem", "position": 2, "name": pageName, "item": `https://yesandnowheel.com${canonicalPath}` }] : [])
    ]
  });
}

function updateLocalizedLinks() {
  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    link.setAttribute('href', localizeHref(href, currentLocale));
  });
}

function updateLanguageSelector() {
  document.querySelectorAll('.lang-chip[data-lang]').forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === currentLocale);
  });
}

function updateStaticUi(uiText) {
  const mappings = {
    navHomeLabel: uiText.home,
    navWheelsLabel: uiText.wheels,
    navAboutLabel: uiText.about,
    navContactLabel: uiText.contact,
    footerContactHeading: uiText.contactInfo,
    footerWheelsHeading: uiText.wheelsHeading,
    footerMoreWheelsHeading: uiText.moreWheelsHeading,
    footerPagesHeading: uiText.pagesHeading,
    footerAboutLink: uiText.aboutUs,
    footerContactLink: uiText.contactUs,
    footerTermsLink: uiText.terms,
    footerPrivacyLink: uiText.privacy,
    footerSitemapLink: uiText.sitemap,
    footerLanguageLabel: uiText.language
  };

  Object.entries(mappings).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });

  const footerBuiltWith = document.getElementById('footerBuiltWith');
  if (footerBuiltWith) {
    footerBuiltWith.innerHTML = `© <span id="footerYear">${new Date().getFullYear()}</span> YesAndNoWheel. All rights reserved.`;
  }
}

function updateAlternateLanguages(canonicalSlug) {
  document.querySelectorAll('link[rel="alternate"][data-hreflang="true"]').forEach((el) => el.remove());
  LOCALES.forEach(({ code }) => {
    const alternate = document.createElement('link');
    alternate.setAttribute('rel', 'alternate');
    alternate.setAttribute('hreflang', code);
    alternate.setAttribute('href', `https://yesandnowheel.com${buildLocalizedPath(code, canonicalSlug === 'home' ? '' : canonicalSlug)}`);
    alternate.dataset.hreflang = 'true';
    document.head.appendChild(alternate);
  });

  const defaultAlternate = document.createElement('link');
  defaultAlternate.setAttribute('rel', 'alternate');
  defaultAlternate.setAttribute('hreflang', 'x-default');
  defaultAlternate.setAttribute('href', `https://yesandnowheel.com${buildLocalizedPath(DEFAULT_LOCALE, canonicalSlug === 'home' ? '' : canonicalSlug)}`);
  defaultAlternate.dataset.hreflang = 'true';
  document.head.appendChild(defaultAlternate);
}

export function getCurrentLocale() {
  return normalizeLocale(currentLocale);
}


/**
 * Helper for programmatic navigation from JS code.
 */
export function navigateTo(slug) {
  const canonical = canonicalSlugs[slug] || slug;
  const path = buildLocalizedPath(currentLocale, canonical === 'home' ? '' : canonical);
  window.history.pushState(null, '', path);
  handleRoute();
}
