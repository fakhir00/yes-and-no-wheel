// router.js — Hash-based SPA router with all pages
import { renderHomePage } from './pages/HomePage.js';
import { renderAboutPage } from './pages/AboutPage.js';
import { renderContactPage } from './pages/ContactPage.js';
import { renderTermsPage } from './pages/TermsPage.js';
import { renderPrivacyPage } from './pages/PrivacyPage.js';
import { renderSitemapPage } from './pages/SitemapPage.js';
import { renderNotFoundPage } from './pages/NotFoundPage.js';
import { renderRainbowWheel } from './wheels/RainbowWheel.js';
import { renderWheelOfFate } from './wheels/WheelOfFate.js';
import { renderWordWheel } from './wheels/WordWheel.js';
import { renderTruthOrDare } from './wheels/TruthOrDare.js';
import { renderDTIWheel } from './wheels/DTIWheel.js';
import { renderCountryWheel } from './wheels/CountryWheel.js';
import { renderZodiacWheel } from './wheels/ZodiacWheel.js';
import { renderHairColorWheel } from './wheels/HairColorWheel.js';

const routes = {
  '': renderHomePage,
  'home': renderHomePage,
  'about-us': renderAboutPage,
  'contact': renderContactPage,
  'terms': renderTermsPage,
  'privacy': renderPrivacyPage,
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
  // Legacy route aliases (for backwards compat)
  'fate': renderWheelOfFate,
  'tod': renderTruthOrDare,
  'dti': renderDTIWheel,
  'hair': renderHairColorWheel,
};

const routeTitles = {
  '': 'Yes and No Wheel — Free Spinner [2025 Guide]',
  'home': 'Yes and No Wheel — Free Spinner [2025 Guide]',
  'about-us': 'About Us — YesAndNoWheel.com',
  'contact': 'Contact Us — YesAndNoWheel.com',
  'terms': 'Terms of Service — YesAndNoWheel.com',
  'privacy': 'Privacy Policy — YesAndNoWheel.com',
  'sitemap': 'Sitemap — YesAndNoWheel.com',
  '404': 'Page Not Found — YesAndNoWheel.com',
  'rainbow': 'Rainbow Wheel — Top Free Spinner [2025]',
  'wheel-of-fate': 'Wheel of Fate — Best RPG Spinner [2025]',
  'word': 'Word Wheel — #1 Name Picker Spinner [2025]',
  'spin-the-wheel-truth-or-dare': 'Spin the Wheel Truth or Dare [2025 Guide]',
  'dti-theme': 'DTI Theme Wheel — 180+ Themes [2025]',
  'country': 'Country Wheel — Top 199 Countries [2025]',
  'zodiac': 'Zodiac Wheel — Best Star Sign Spinner [2025]',
  'hair-color': 'Hair Color Wheel — Top Dye Picker [2025]',
  // Legacy
  'fate': 'Wheel of Fate — Best RPG Spinner [2025]',
  'tod': 'Spin the Wheel Truth or Dare [2025 Guide]',
  'dti': 'DTI Theme Wheel — 180+ Themes [2025]',
  'hair': 'Hair Color Wheel — Top Dye Picker [2025]',
};

const routeDescriptions = {
  '': 'Spin the Yes and No Wheel to decide instantly! Free online spinner with 8 wheels. Customizable and fun. Try it now!',
  'home': 'Spin the Yes and No Wheel to decide instantly! Free online spinner with 8 wheels. Customizable and fun. Try it now!',
  'contact': 'Contact YesAndNoWheel.com — reach out with questions, feedback, or feature requests. We respond within 24-48 hours.',
  'rainbow': 'Spin the Rainbow Wheel and let ROYGBIV colors decide. Free online color spinner with custom entries. Try it now!',
  'wheel-of-fate': 'Spin the Wheel of Fate for dramatic outcomes. Perfect for writers and RPG players. Weighted entries and cosmic design.',
  'word': 'Use the Word Wheel to randomly pick names. Upload CSV, paste names, and spin. Perfect for classrooms and raffles.',
  'spin-the-wheel-truth-or-dare': 'Spin the Wheel Truth or Dare for parties! 200+ curated prompts with player picker. Free neon-themed game.',
  'dti-theme': 'Spin the DTI Theme Wheel for Dress To Impress inspiration! 180+ themes by category. Free random theme generator.',
  'country': 'Spin the Country Wheel to pick from 199 countries! Filter by continent with flags. Great for geography games.',
  'zodiac': 'Spin the Zodiac Wheel to reveal your star sign destiny. 12 signs with traits and compatibility. Free spinner.',
  'hair-color': 'Spin the Hair Color Wheel to find your next dye color! Classic and fantasy palettes with hex codes. Try now!',
  // Legacy
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

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash.slice(1) || '';
  const route = hash.split('?')[0];
  const app = document.getElementById('app');

  if (currentEngine && currentEngine.destroy) currentEngine.destroy();

  app.style.opacity = '0';
  app.style.transform = 'translateY(10px)';

  setTimeout(() => {
    try {
      const renderer = routes[route] || renderNotFoundPage;
      currentEngine = renderer(app);
      document.title = routeTitles[route] || routeTitles[''];

      // Update meta description for SEO
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
      canonicalEl.setAttribute('href', `https://yesandnowheel.com/${canonical}`);

      // Update BreadcrumbList schema
      updateBreadcrumb(route);

      // Update active nav
      document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
        const href = link.getAttribute('href')?.slice(1) || '';
        link.classList.toggle('active', href === route);
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
  breadcrumbEl.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yesandnowheel.com/home" },
      ...(route && route !== 'home' ? [{ "@type": "ListItem", "position": 2, "name": pageName, "item": `https://yesandnowheel.com/${canonical}` }] : [])
    ]
  });
}
