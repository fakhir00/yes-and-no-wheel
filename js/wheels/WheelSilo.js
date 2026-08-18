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
  'chance-fortune-wheel': { icon: '🍀', accent: '#f59e0b' },
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
  'chance-fortune-wheel',
  'tarot',
  'oracle'
];

const SILO_COPY = {
  en: { title: 'Explore All Wheels', intro: 'Jump between related spinner tools to keep this topic cluster tightly connected.', cta: 'Open wheel', homeIntro: 'is the main decision hub on this site — spin it for fast yes or no answers, or keep exploring the wheels below.' },
  es: { title: 'Explorar todas las ruletas', intro: 'Salta entre herramientas relacionadas para mantener este grupo tematico bien conectado.', cta: 'Abrir ruleta', homeIntro: 'es el centro de decisiones principal de este sitio: gírala para obtener respuestas rápidas de sí o no, o sigue explorando las ruletas de abajo.' },
  fr: { title: 'Explorer toutes les roulettes', intro: 'Passez d un outil de roue a l autre pour garder ce cluster thematique bien relie.', cta: 'Ouvrir la roulette', homeIntro: "est le hub de décision principal de ce site — faites-la tourner pour des réponses rapides oui ou non, ou continuez d'explorer les roues ci-dessous." },
  de: { title: 'Alle Wheels entdecken', intro: 'Wechsle zwischen verwandten Wheel-Tools, um dieses Themen-Cluster stark zu verknupfen.', cta: 'Wheel offnen', homeIntro: 'ist das zentrale Entscheidungsrad dieser Seite — drehen Sie es für schnelle Ja- oder Nein-Antworten oder entdecken Sie weitere Räder weiter unten.' },
  ar: { title: 'استكشف كل العجلات', intro: 'تنقل بين ادوات العجلات المرتبطة للحفاظ على ترابط هذا القسم الموضوعي.', cta: 'افتح العجلة', homeIntro: 'هي العجلة الرئيسية لاتخاذ القرارات على هذا الموقع — أدرها للحصول على إجابة نعم أو لا سريعة، أو واصل استكشاف العجلات أدناه.' },
  'zh-CN': { title: '探索所有转盘', intro: '在相关转盘工具之间切换，让这一主题集群保持紧密连接。', cta: '打开转盘', homeIntro: '是本网站的主要决策转盘——旋转它快速获得“是”或“否”答案，或继续探索下方转盘。' },
  hi: { title: 'सभी व्हील देखें', intro: 'इस टॉपिक क्लस्टर को मजबूत रखने के लिए संबंधित व्हील टूल्स के बीच जाएं।', cta: 'व्हील खोलें', homeIntro: 'इस साइट का मुख्य निर्णय व्हील है — इसे घुमाकर तेज़ हाँ या नहीं उत्तर पाएं, या नीचे दिए गए अन्य व्हील देखें।' },
  bn: { title: 'সব হুইল দেখুন', intro: 'এই টপিক ক্লাস্টারকে শক্ত রাখতে সম্পর্কিত হুইল টুলগুলোর মধ্যে যান।', cta: 'হুইল খুলুন', homeIntro: 'এই সাইটের মূল সিদ্ধান্ত হুইল — এটিকে ঘোরালে দ্রুত হ্যাঁ বা না উত্তর পাবেন, অথবা নিচের বাকি হুইলগুলোও ব্যবহার করুন।' },
  pt: { title: 'Explorar todas as roletas', intro: 'Navegue entre ferramentas relacionadas para manter este cluster tematico bem conectado.', cta: 'Abrir roleta', homeIntro: 'é o centro de decisões principal deste site — gire para respostas rápidas de sim ou não ou continue explorando as roletas abaixo.' },
  ru: { title: 'Все колеса', intro: 'Переходите между связанными инструментами, чтобы этот тематический кластер был хорошо связан.', cta: 'Открыть колесо', homeIntro: '— главное колесо решений на этом сайте. Покрутите его для быстрого ответа «да» или «нет» или продолжайте изучать колеса ниже.' },
  ur: { title: 'تمام وہیل دیکھیں', intro: 'اس موضوعی کلسٹر کو مضبوط رکھنے کے لئے متعلقہ وہیل ٹولز کے درمیان جائیں۔', cta: 'وہیل کھولیں', homeIntro: 'اس سائٹ کا مرکزی فیصلہ ویل ہے — اسے گھما کر فوری ہاں یا نہیں جواب پائیں، یا نیچے دوسرے ویلز بھی دیکھیں۔' },
  id: { title: 'Jelajahi semua roda', intro: 'Berpindahlah di antara alat roda terkait agar klaster topik ini tetap terhubung kuat.', cta: 'Buka roda', homeIntro: 'adalah pusat keputusan utama situs ini — putar untuk jawaban ya atau tidak yang cepat, atau lanjut menjelajahi roda di bawah.' },
  ja: { title: 'すべてのルーレットを見る', intro: '関連するルーレットツール同士を行き来して、このトピッククラスターを強く結びます。', cta: 'ルーレットを開く', homeIntro: 'このサイトのメインの決定ルーレットです。回してすばやく「はい」か「いいえ」の答えを得るか、下のルーレットも探索できます。' },
  mr: { title: 'सर्व व्हील पहा', intro: 'हा विषयक क्लस्टर मजबूत राहावा म्हणून संबंधित व्हील साधनांमध्ये जा.', cta: 'व्हील उघडा', homeIntro: 'या साइटचे मुख्य निर्णय व्हील — ते फिरवा आणि पटकन होय किंवा नाही उत्तर मिळवा, किंवा खालील इतर व्हील्स शोधा.' },
  te: { title: 'అన్ని వీల్స్ చూడండి', intro: 'ఈ టాపిక్ క్లస్టర్ బలంగా ఉండేందుకు సంబంధించిన వీల్ టూల్స్ మధ్య మారండి.', cta: 'వీల్ తెరవండి', homeIntro: 'ఈ సైట్‌లో ప్రధాన నిర్ణయ వీల్ — త్వరగా అవును లేదా కాదు సమాధానానికి దాన్ని తిప్పండి, లేదా క్రింద ఇతర వీల్‌లను అన్వేషించండి.' }
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

  const cards = ['home', ...WHEEL_ORDER]
    .filter((slug) => slug !== currentSlug && slug !== 'home')
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

  let homeCard = '';
  if (currentSlug !== 'home') {
    const homePage = getLocalizedRouteContent(locale, 'home');
    const homeMeta = WHEEL_META.home;
    const homeDesc = (t.wheelDescriptions && t.wheelDescriptions.home) || homePage.subtitle;
    homeCard = `
      <a href="${buildLocalizedPath(locale, 'home')}" class="wheel-card wheel-card-home" style="--card-accent:${homeMeta.accent}">
        <div class="wheel-card-icon">${homeMeta.icon}</div>
        <h3 class="wheel-card-title">${homePage.title}</h3>
        <p class="wheel-card-desc">${homeDesc}</p>
        <span class="wheel-card-cta">${spinNow} →</span>
      </a>
    `;
  }

  const homeIntro = currentSlug !== 'home'
    ? `<p class="wheel-silo-home-intro"><a href="${buildLocalizedPath(locale, 'home')}">${getLocalizedRouteContent(locale, 'home').title}</a> ${copy.homeIntro}</p>`
    : '';

  return `
    <section class="wheels-grid">
      <h2 class="section-title">${copy.title}</h2>
      <p class="section-subtitle">${copy.intro}</p>
      ${homeIntro}
      <div class="cards-grid">
        ${homeCard}${cards}
      </div>
    </section>
  `;
}
