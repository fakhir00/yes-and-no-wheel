import { buildLocalizedPath, getLocalizedRouteContent } from '../i18n.js';

const WHEEL_META = {
  home: { icon: '🎰', accent: '#facc15' },
  rainbow: { icon: '🌈', accent: '#f97316' },
  'wheel-of-fate': { icon: '⚔️', accent: '#8b5cf6' },
  word: { icon: '📖', accent: '#3b82f6' },
  'spin-the-wheel-truth-or-dare': { icon: '🎉', accent: '#ec4899' },
  'dti-theme': { icon: '👗', accent: '#f472b6' },
  country: { icon: '🌍', accent: '#22c55e' },
  zodiac: { icon: '✨', accent: '#a78bfa' },
  'hair-color': { icon: '💇', accent: '#06b6d4' }
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
  'hair-color'
];

const SILO_COPY = {
  en: {
    eyebrow: 'Wheel Cluster',
    title: 'Explore More Wheel Pages',
    intro: 'Jump between related spinner tools to keep this topic cluster tightly connected.',
    cta: 'Open wheel'
  },
  es: {
    eyebrow: 'Grupo de ruletas',
    title: 'Explora mas paginas de ruletas',
    intro: 'Salta entre herramientas relacionadas para mantener este grupo tematico bien conectado.',
    cta: 'Abrir ruleta'
  },
  fr: {
    eyebrow: 'Cluster de roulettes',
    title: 'Explorer plus de pages de roulettes',
    intro: 'Passez d un outil de roue a l autre pour garder ce cluster thematique bien relie.',
    cta: 'Ouvrir la roulette'
  },
  de: {
    eyebrow: 'Wheel-Cluster',
    title: 'Mehr Wheel-Seiten entdecken',
    intro: 'Wechsle zwischen verwandten Wheel-Tools, um dieses Themen-Cluster stark zu verknupfen.',
    cta: 'Wheel offnen'
  },
  ar: {
    eyebrow: 'مجموعة العجلات',
    title: 'استكشف المزيد من صفحات العجلات',
    intro: 'تنقل بين ادوات العجلات المرتبطة للحفاظ على ترابط هذا القسم الموضوعي.',
    cta: 'افتح العجلة'
  },
  'zh-CN': {
    eyebrow: '转盘集群',
    title: '探索更多转盘页面',
    intro: '在相关转盘工具之间切换，让这一主题集群保持紧密连接。',
    cta: '打开转盘'
  },
  hi: {
    eyebrow: 'व्हील क्लस्टर',
    title: 'और व्हील पेज देखें',
    intro: 'इस टॉपिक क्लस्टर को मजबूत रखने के लिए संबंधित व्हील टूल्स के बीच जाएं।',
    cta: 'व्हील खोलें'
  },
  bn: {
    eyebrow: 'হুইল ক্লাস্টার',
    title: 'আরও হুইল পেজ দেখুন',
    intro: 'এই টপিক ক্লাস্টারকে শক্ত রাখতে সম্পর্কিত হুইল টুলগুলোর মধ্যে যান।',
    cta: 'হুইল খুলুন'
  },
  pt: {
    eyebrow: 'Cluster de roletas',
    title: 'Explore mais paginas de roletas',
    intro: 'Navegue entre ferramentas relacionadas para manter este cluster tematico bem conectado.',
    cta: 'Abrir roleta'
  },
  ru: {
    eyebrow: 'Кластер колес',
    title: 'Изучите больше страниц колес',
    intro: 'Переходите между связанными инструментами, чтобы этот тематический кластер был хорошо связан.',
    cta: 'Открыть колесо'
  },
  ur: {
    eyebrow: 'وہیل کلسٹر',
    title: 'مزید وہیل صفحات دیکھیں',
    intro: 'اس موضوعی کلسٹر کو مضبوط رکھنے کے لئے متعلقہ وہیل ٹولز کے درمیان جائیں۔',
    cta: 'وہیل کھولیں'
  },
  id: {
    eyebrow: 'Klaster roda',
    title: 'Jelajahi lebih banyak halaman roda',
    intro: 'Berpindahlah di antara alat roda terkait agar klaster topik ini tetap terhubung kuat.',
    cta: 'Buka roda'
  },
  ja: {
    eyebrow: 'ルーレットクラスター',
    title: '他のルーレットページを見る',
    intro: '関連するルーレットツール同士を行き来して、このトピッククラスターを強く結びます。',
    cta: 'ルーレットを開く'
  },
  mr: {
    eyebrow: 'व्हील क्लस्टर',
    title: 'अधिक व्हील पृष्ठे पहा',
    intro: 'हा विषयक क्लस्टर मजबूत राहावा म्हणून संबंधित व्हील साधनांमध्ये जा.',
    cta: 'व्हील उघडा'
  },
  te: {
    eyebrow: 'వీల్ క్లస్టర్',
    title: 'ఇంకా వీల్ పేజీలు చూడండి',
    intro: 'ఈ టాపిక్ క్లస్టర్ బలంగా ఉండేందుకు సంబంధించిన వీల్ టూల్స్ మధ్య మారండి.',
    cta: 'వీల్ తెరవండి'
  }
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
  const cards = WHEEL_ORDER
    .filter((slug) => slug !== currentSlug)
    .map((slug) => {
      const page = getLocalizedRouteContent(locale, slug);
      const meta = WHEEL_META[slug];
      return `
        <a class="wheel-silo-card" href="${buildLocalizedPath(locale, slug)}" style="--silo-accent:${meta.accent}">
          <span class="wheel-silo-icon">${meta.icon}</span>
          <span class="wheel-silo-name">${page.title}</span>
          <span class="wheel-silo-desc">${page.subtitle}</span>
          <span class="wheel-silo-cta">${copy.cta}</span>
        </a>
      `;
    })
    .join('');

  return `
    <section class="wheel-silo">
      <div class="wheel-silo-header">
        <span class="wheel-silo-eyebrow">${copy.eyebrow}</span>
        <h2>${copy.title}</h2>
        <p>${copy.intro}</p>
      </div>
      <div class="wheel-silo-grid">
        ${cards}
      </div>
    </section>
  `;
}
