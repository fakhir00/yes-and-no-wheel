// SitemapPage.js
export function renderSitemapPage(container) {
  const mainPages = [
    { title: 'Home — Yes No Picker Wheel', hash: '#home' },
    { title: 'About Us', hash: '#about-us' },
    { title: 'Contact Us', hash: '#contact' },
    { title: 'Terms of Service', hash: '#terms' },
    { title: 'Privacy Policy', hash: '#privacy' },
  ];

  const wheelPages = [
    { title: '🌈 Rainbow Wheel', hash: '#rainbow' },
    { title: '⚔️ Wheel of Fate', hash: '#fate' },
    { title: '📖 Word Wheel (Random Picker)', hash: '#word' },
    { title: '🎉 Truth or Dare Wheel', hash: '#tod' },
    { title: '👗 DTI Theme Wheel', hash: '#dti' },
    { title: '🌍 Country Wheel', hash: '#country' },
    { title: '✨ Zodiac Wheel', hash: '#zodiac' },
    { title: '💇 Hair Color Wheel', hash: '#hair' },
  ];

  container.innerHTML = `
    <div class="static-page">
      <h1 class="page-title">Sitemap</h1>
      <p class="page-intro">A complete list of all pages on YesAndNoWheel.com</p>

      <div class="page-content sitemap-content">
        <section class="content-section">
          <h2>Main Pages</h2>
          <ul class="sitemap-list">
            ${mainPages.map(p => `<li><a href="${p.hash}">${p.title}</a></li>`).join('')}
          </ul>
        </section>

        <section class="content-section">
          <h2>Wheel Pages</h2>
          <ul class="sitemap-list">
            ${wheelPages.map(p => `<li><a href="${p.hash}">${p.title}</a></li>`).join('')}
          </ul>
        </section>
      </div>
    </div>`;
}
