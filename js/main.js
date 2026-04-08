// main.js — App entry point
import { initRouter } from './router.js?v=20260408-brand1';
import { storage } from './engine/StorageManager.js';
import { audioManager } from './engine/AudioManager.js';
import { buildLocalizedPath, splitLocaleFromPath } from './i18n.js?v=20260408-brand1';

// Apply saved theme
const theme = storage.getThemePreference();
document.documentElement.setAttribute('data-theme', theme);
document.body.setAttribute('data-theme', theme);

// Defer audio context creation until the user actually interacts with the app.

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
  });
  navMenu.querySelectorAll('.nav-link:not(.dropdown-trigger), .dropdown-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Wheels dropdown
const dropdownBtn = document.getElementById('wheelsDropdownBtn');
const dropdown = document.getElementById('wheelsDropdown');
if (dropdownBtn && dropdown) {
  dropdownBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  // Close dropdown when a link is clicked
  dropdown.querySelectorAll('.dropdown-link').forEach(link => {
    link.addEventListener('click', () => {
      dropdown.classList.remove('open');
    });
  });
}

// Init router
initRouter();

// Theme Toggle Logic
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  document.body.setAttribute('data-theme', next); // Keep for backwards compatibility with any existing CSS expecting it on body
  storage.setThemePreference(next);
}

const headerThemeBtn = document.getElementById('headerThemeBtn');
const footerThemeBtn = document.getElementById('footerThemeBtn');
if (headerThemeBtn) headerThemeBtn.addEventListener('click', toggleTheme);
if (footerThemeBtn) footerThemeBtn.addEventListener('click', toggleTheme);

const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Language Switcher Logic
const langGrid = document.getElementById('langGrid');
if (langGrid) {
  langGrid.addEventListener('click', (e) => {
    const button = e.target.closest('.lang-chip[data-lang]');
    if (!button) return;
    const { slug } = splitLocaleFromPath(window.location.pathname);
    const lang = button.dataset.lang || 'en';
    window.location.href = buildLocalizedPath(lang, slug);
  });
}
