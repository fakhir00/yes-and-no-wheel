import { buildLocalizedPath, getLocalizedRouteContent, getHomeText } from '../i18n.js';

const WHEEL_META = {
  home: { icon: 'Y/N', accent: '#22d3ee' },
  rainbow: { icon: '🌈', accent: '#f97316' },
  'wheel-of-fate': { icon: '⚔️', accent: '#8b5cf6' },
  word: { icon: '📖', accent: '#3b82f6' },
  'spin-the-wheel-truth-or-dare': { icon: '🎉', accent: '#ec4899' },
  'dti-theme': { icon: '👗', accent: '#f472b6' },
  country: { icon: '🌍', accent: '#22c55e' },
  zodiac: { icon: '✨', accent: '#a78bfa' },
  'hair-color': { icon: '💇', accent: '#06b6d4' },
  'random-food': { icon: '🍔', accent: '#ff4757' },
  'tarot': { icon: '🃏', accent: '#7b2cbf' },
  'oracle': { icon: '🔮', accent: '#415a77' }
};

const WHEEL_ORDER = [
  'home',
  'rainbow',
  'wheel-of-fate',
  'word',
  'spin-the-wheel-truth-or-dare',
  'dti-theme',
  'country',
  'zodiac',
  'hair-color',
  'random-food',
  'tarot',
  'oracle'
];

const SILO_COPY = {
  en: { title: 'Explore All Wheels', intro: 'Jump between related spinner tools to keep this topic cluster tightly connected.', cta: 'Open wheel' },
  es: { title: 'Explorar todas las ruletas', intro: 'Salta entre herramientas relacionadas para mantener este grupo tematico bien conectado.', cta: 'Abrir ruleta' },
  fr: { title: 'Explorer toutes les roulettes', intro: 'Passez d un outil de roue a l autre pour garder ce cluster thematique bien relie.', cta: 'Ouvrir la roulette' },
  de: { title: 'Alle Wheels entdecken', intro: 'Wechsle zwischen verwandten Wheel-Tools, um dieses Themen-Cluster stark zu verknupfen.', cta: 'Wheel offnen' },
  ar: { title: 'استكشف كل العجلات', intro: 'تنقل بين ادوات العجلات المرتبطة للحفاظ على ترابط هذا القسم الموضوعي.', cta: 'افتح العجلة' },
  'zh-CN': { title: '探索所有转盘', intro: '在相关转盘工具之间切换，让这一主题集群保持紧密连接。', cta: '打开转盘' },
  hi: { title: 'सभी व्हील देखें', intro: 'इस टॉपिक क्लस्टर को मजबूत रखने के लिए संबंधित व्हील टूल्स के बीच जाएं।', cta: 'व्हील खोलें' },
  bn: { title: 'সব হুইল দেখুন', intro: 'এই টপিক ক্লাস্টারকে শক্ত রাখতে সম্পর্কিত হুইল টুলগুলোর মধ্যে যান।', cta: 'হুইল খুলুন' },
  pt: { title: 'Explorar todas as roletas', intro: 'Navegue entre ferramentas relacionadas para manter este cluster tematico bem conectado.', cta: 'Abrir roleta' },
  ru: { title: 'Все колеса', intro: 'Переходите между связанными инструментами, чтобы этот тематический кластер был хорошо связан.', cta: 'Открыть колесо' },
  ur: { title: 'تمام وہیل دیکھیں', intro: 'اس موضوعی کلسٹر کو مضبوط رکھنے کے لئے متعلقہ وہیل ٹولز کے درمیان جائیں۔', cta: 'وہیل کھولیں' },
  id: { title: 'Jelajahi semua roda', intro: 'Berpindahlah di antara alat roda terkait agar klaster topik ini tetap terhubung kuat.', cta: 'Buka roda' },
  ja: { title: 'すべてのルーレットを見る', intro: '関連するルーレットツール同士を行き来して、このトピッククラスターを強く結びます。', cta: 'ルーレットを開く' },
  mr: { title: 'सर्व व्हील पहा', intro: 'हा विषयक क्लस्टर मजबूत राहावा म्हणून संबंधित व्हील साधनांमध्ये जा.', cta: 'व्हील उघडा' },
  te: { title: 'అన్ని వీల్స్ చూడండి', intro: 'ఈ టాపిక్ క్లస్టర్ బలంగా ఉండేందుకు సంబంధించిన వీల్ టూల్స్ మధ్య మారండి.', cta: 'వీల్ తెరవండి' }
};

function getSiloCopy(locale) {
  return SILO_COPY[locale] || SILO_COPY.en;
}

export function renderWheelTextSilo(locale, currentSlug, maxLinks = 4) {
  const copy = getSiloCopy(locale);
  const currentIndex = WHEEL_ORDER.indexOf(currentSlug);
  const orderedLinks = currentIndex === -1
    ? WHEEL_ORDER
    : [...WHEEL_ORDER.slice(currentIndex + 1), ...WHEEL_ORDER.slice(0, currentIndex)];

  const links = orderedLinks
    .filter((slug) => slug !== currentSlug)
    .slice(0, maxLinks)
    .map((slug) => {
      const page = getLocalizedRouteContent(locale, slug);
      return `<a href="${buildLocalizedPath(locale, slug)}">${page.title}</a>`;
    })
    .join('');

  if (!links) return '';

  return `
    <div class="wheel-text-silo" aria-label="${copy.title}">
      <p>${copy.intro}</p>
      <div class="wheel-text-silo-links">${links}</div>
    </div>
  `;
}

export function renderWheelSilo(locale, currentSlug) {
  const copy = getSiloCopy(locale);
  const t = getHomeText(locale);
  const spinNow = t.spinNow || copy.cta;

  const cards = WHEEL_ORDER
    .filter((slug) => slug !== currentSlug)
    .map((slug) => {
      const page = getLocalizedRouteContent(locale, slug);
      const meta = WHEEL_META[slug];
      const desc = (t.wheelDescriptions && t.wheelDescriptions[slug]) || page.subtitle;
      return `
        <a href="${buildLocalizedPath(locale, slug)}" class="wheel-card" style="--card-accent:${meta.accent}">
          <div class="wheel-card-icon">${meta.icon}</div>
          <h3 class="wheel-card-title">${page.title}</h3>
          <p class="wheel-card-desc">${desc}</p>
          <span class="wheel-card-cta">${spinNow} →</span>
        </a>
      `;
    })
    .join('');

  return `
    <section class="wheels-grid">
      <h2 class="section-title">${copy.title}</h2>
      <p class="section-subtitle">${copy.intro}</p>
      <div class="cards-grid">
        ${cards}
      </div>
    </section>
  `;
}
