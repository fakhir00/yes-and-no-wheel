// main.js — App entry point
import { initRouter } from './router.js';
import { storage } from './engine/StorageManager.js';

// Apply saved theme
const theme = storage.getThemePreference();
document.body.setAttribute('data-theme', theme);

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
  const current = document.body.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', next);
  storage.setThemePreference(next);
}

const headerThemeBtn = document.getElementById('headerThemeBtn');
const footerThemeBtn = document.getElementById('footerThemeBtn');
if (headerThemeBtn) headerThemeBtn.addEventListener('click', toggleTheme);
if (footerThemeBtn) footerThemeBtn.addEventListener('click', toggleTheme);

// Language Switcher Logic
const langSelector = document.getElementById('langSelector');
if (langSelector) {
  // Try to set initial value from cookie if present
  const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
  if (match && match[1]) {
    langSelector.value = match[1];
  }

  langSelector.addEventListener('change', (e) => {
    const lang = e.target.value;
    if (lang === 'en') {
      // clear cookie for english
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + location.hostname;
    } else {
      // update googtrans cookie to trigger translation on reload
      document.cookie = 'googtrans=/en/' + lang + '; path=/';
    }
    window.location.reload();
  });
}
