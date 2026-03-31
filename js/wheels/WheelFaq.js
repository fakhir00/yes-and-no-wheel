import { getHomeText } from '../i18n.js';

export function renderWheelFaq(locale) {
  const faq = getHomeText(locale);

  return `
    <section class="faq wheel-faq">
      <h2 class="section-title">${faq.faqTitle}</h2>
      <div class="faq-list">
        ${faq.faqItems.map((item) => `<details class="faq-item"><summary>${item.q}</summary><p>${item.a}</p></details>`).join('')}
      </div>
    </section>
  `;
}
