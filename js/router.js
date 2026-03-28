// router.js — Hash-based SPA router with all pages
import { renderHomePage } from './pages/HomePage.js';
import { renderAboutPage } from './pages/AboutPage.js';
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
  'terms': renderTermsPage,
  'privacy': renderPrivacyPage,
  'sitemap': renderSitemapPage,
  '404': renderNotFoundPage,
  'rainbow': renderRainbowWheel,
  'fate': renderWheelOfFate,
  'word': renderWordWheel,
  'tod': renderTruthOrDare,
  'dti': renderDTIWheel,
  'country': renderCountryWheel,
  'zodiac': renderZodiacWheel,
  'hair': renderHairColorWheel,
};

const routeTitles = {
  '': 'YesAndNoWheel.com — Yes No Picker Wheel',
  'home': 'YesAndNoWheel.com — Yes No Picker Wheel',
  'about-us': 'About Us — YesAndNoWheel.com',
  'terms': 'Terms of Service — YesAndNoWheel.com',
  'privacy': 'Privacy Policy — YesAndNoWheel.com',
  'sitemap': 'Sitemap — YesAndNoWheel.com',
  '404': 'Page Not Found — YesAndNoWheel.com',
  'rainbow': 'Rainbow Wheel — YesAndNoWheel.com',
  'fate': 'Wheel of Fate — YesAndNoWheel.com',
  'word': 'Word Wheel — YesAndNoWheel.com',
  'tod': 'Truth or Dare Wheel — YesAndNoWheel.com',
  'dti': 'DTI Theme Wheel — YesAndNoWheel.com',
  'country': 'Country Wheel — YesAndNoWheel.com',
  'zodiac': 'Zodiac Wheel — YesAndNoWheel.com',
  'hair': 'Hair Color Wheel — YesAndNoWheel.com',
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
