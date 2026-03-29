// SitemapPage.js
export function renderSitemapPage(container) {
  const mainPages = [
    { title: 'Home', hash: '#home' },
    { title: 'About Us', hash: '#about-us' },
    { title: 'Contact Us', hash: '#contact' },
    { title: 'Terms of Service', hash: '#terms' },
    { title: 'Privacy Policy', hash: '#privacy' },
    { title: 'Sitemap', hash: '#sitemap' },
  ];

  const wheelPages = [
    { title: '🌈 Rainbow Wheel', hash: '#rainbow', desc: 'Spin the rainbow spectrum' },
    { title: '⚔️ Wheel of Fate', hash: '#wheel-of-fate', desc: 'Dramatic RPG outcome spinner' },
    { title: '📖 Word Wheel', hash: '#word', desc: 'Random name & word picker' },
    { title: '🎉 Spin the Wheel Truth or Dare', hash: '#spin-the-wheel-truth-or-dare', desc: 'Party game with 200+ prompts' },
    { title: '👗 DTI Theme Wheel', hash: '#dti-theme', desc: '180+ Dress To Impress themes' },
    { title: '🌍 Country Wheel', hash: '#country', desc: 'Random country from 199 nations' },
    { title: '✨ Zodiac Wheel', hash: '#zodiac', desc: '12 zodiac signs with traits' },
    { title: '💇 Hair Color Wheel', hash: '#hair-color', desc: 'Classic & fantasy hair dyes' },
  ];

  container.innerHTML = `
    <div class="static-page">
      <h1 class="page-title">Sitemap</h1>
      <p class="page-intro">A complete list of all pages on YesAndNoWheel.com</p>

      <div class="page-content sitemap-content">
        <section class="content-section">
          <h2>Pages</h2>
          <ul class="sitemap-list">
            ${mainPages.map(p => `<li><a href="${p.hash}">${p.title}</a></li>`).join('')}
          </ul>
        </section>

        <section class="content-section">
          <h2>Wheels</h2>
          <ul class="sitemap-list">
            ${wheelPages.map(p => `<li><a href="${p.hash}">${p.title}</a></li>`).join('')}
          </ul>
        </section>
      </div>
    </div>`;
}
