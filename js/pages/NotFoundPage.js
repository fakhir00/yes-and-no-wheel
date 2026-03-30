// NotFoundPage.js
export function renderNotFoundPage(container) {
  container.innerHTML = `
    <div class="static-page not-found-page">
      <div class="not-found-content">
        <div class="not-found-icon">🎰</div>
        <h1 class="not-found-title">404</h1>
        <p class="not-found-text">Oops! This page doesn't exist.</p>
        <p class="not-found-sub">The wheel couldn't find what you're looking for.</p>
        <a href="/" class="cta-btn primary">← Back to Home</a>
      </div>
    </div>`;
}
