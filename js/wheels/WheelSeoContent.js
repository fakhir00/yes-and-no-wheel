import { buildLocalizedPath, getLocalizedRouteContent, getWheelSharedText, normalizeLocale } from '../i18n.js';

const SEO_LINK_MAP = {
  home: 'rainbow',
  rainbow: 'word',
  'wheel-of-fate': 'spin-the-wheel-truth-or-dare',
  word: 'country',
  'spin-the-wheel-truth-or-dare': 'wheel-of-fate',
  'dti-theme': 'hair-color',
  country: 'zodiac',
  zodiac: 'rainbow',
  'hair-color': 'dti-theme'
};

const SEO_COPY = {
  en: {
    whatTitle: 'What is {page}?',
    whenTitle: 'When to Use This {page}?',
    what1: '{page} is a focused wheel page made for fast random results and repeat use. {subtitle}',
    what2: 'It gives visitors a simple way to spin through choices without extra setup. {intro}',
    what3: 'If you want to explore a related wheel next, try {related}.',
    when1: 'Use this {page} when you want a themed result instead of a generic random pick.',
    when2: 'It works well for quick decisions, repeat visits, group activities, and light inspiration.',
    when3: 'This page is most useful when you want a clear result quickly while staying inside the same wheel cluster.'
  },
  es: {
    whatTitle: 'Que es {page}?',
    whenTitle: 'Cuando usar este {page}?',
    what1: '{page} es una pagina de ruleta enfocada en resultados aleatorios rapidos y uso repetido. {subtitle}',
    what2: 'Ofrece una forma simple de girar opciones sin configuracion extra. {intro}',
    what3: 'Si quieres explorar otra ruleta relacionada, prueba {related}.',
    when1: 'Usa este {page} cuando quieras un resultado tematico en lugar de una eleccion aleatoria generica.',
    when2: 'Funciona bien para decisiones rapidas, visitas repetidas, actividades en grupo e inspiracion ligera.',
    when3: 'Esta pagina es mas util cuando quieres un resultado claro rapidamente y seguir dentro del mismo cluster de ruedas.'
  },
  fr: {
    whatTitle: 'Qu est-ce que {page} ?',
    whenTitle: 'Quand utiliser ce {page} ?',
    what1: '{page} est une page de roue concue pour des resultats aleatoires rapides et un usage repete. {subtitle}',
    what2: 'Elle permet de faire tourner des choix simplement, sans configuration inutile. {intro}',
    what3: 'Si vous voulez essayer une roue liee, utilisez {related}.',
    when1: 'Utilisez ce {page} quand vous voulez un resultat thematique plutot qu un choix aleatoire generique.',
    when2: 'Il convient aux decisions rapides, aux visites repetees, aux activites de groupe et a une inspiration legere.',
    when3: 'Cette page est surtout utile quand vous voulez un resultat clair rapidement tout en restant dans le meme cluster de roues.'
  },
  de: {
    whatTitle: 'Was ist {page}?',
    whenTitle: 'Wann sollte man dieses {page} nutzen?',
    what1: '{page} ist eine fokussierte Wheel-Seite fuer schnelle Zufallsergebnisse und wiederholte Nutzung. {subtitle}',
    what2: 'Sie bietet eine einfache Moeglichkeit, Optionen ohne zusaetzliche Einrichtung zu drehen. {intro}',
    what3: 'Wenn du als Naechstes ein verwandtes Wheel ausprobieren willst, nutze {related}.',
    when1: 'Nutze dieses {page}, wenn du ein thematisches Ergebnis statt einer allgemeinen Zufallsauswahl willst.',
    when2: 'Es eignet sich fuer schnelle Entscheidungen, wiederholte Besuche, Gruppenaktivitaeten und leichte Inspiration.',
    when3: 'Diese Seite ist am nuetzlichsten, wenn du schnell ein klares Ergebnis willst und im selben Wheel-Cluster bleiben moechtest.'
  },
  pt: {
    whatTitle: 'O que e {page}?',
    whenTitle: 'Quando usar este {page}?',
    what1: '{page} e uma pagina de roleta focada em resultados aleatorios rapidos e uso repetido. {subtitle}',
    what2: 'Ela oferece uma forma simples de girar escolhas sem configuracao extra. {intro}',
    what3: 'Se quiser explorar outra roleta relacionada, experimente {related}.',
    when1: 'Use este {page} quando quiser um resultado tematico em vez de uma escolha aleatoria generica.',
    when2: 'Ele funciona bem para decisoes rapidas, visitas repetidas, atividades em grupo e inspiracao leve.',
    when3: 'Esta pagina e mais util quando voce quer um resultado claro rapidamente e deseja continuar no mesmo cluster de roletas.'
  },
  ru: {
    whatTitle: 'Что такое {page}?',
    whenTitle: 'Когда использовать этот {page}?',
    what1: '{page} — это страница колеса для быстрых случайных результатов и повторного использования. {subtitle}',
    what2: 'Она помогает быстро прокручивать варианты без лишней настройки. {intro}',
    what3: 'Если хотите открыть связанное колесо, попробуйте {related}.',
    when1: 'Используйте этот {page}, когда нужен тематический результат, а не просто общий случайный выбор.',
    when2: 'Он хорошо подходит для быстрых решений, повторных посещений, групповых занятий и легкого вдохновения.',
    when3: 'Эта страница особенно полезна, когда нужен понятный результат быстро и при этом хочется остаться в том же кластере колес.'
  },
  ar: {
    whatTitle: 'ما هو {page}؟',
    whenTitle: 'متى تستخدم {page} هذا؟',
    what1: '{page} هي صفحة عجلة مخصصة للنتائج العشوائية السريعة والاستخدام المتكرر. {subtitle}',
    what2: 'تمنح الزائر طريقة بسيطة لتدوير الخيارات من دون إعدادات إضافية. {intro}',
    what3: 'إذا أردت تجربة عجلة مرتبطة، فجرّب {related}.',
    when1: 'استخدم {page} هذا عندما تريد نتيجة مرتبطة بالموضوع بدلا من اختيار عشوائي عام.',
    when2: 'هو مناسب للقرارات السريعة، والزيارات المتكررة، والأنشطة الجماعية، والإلهام الخفيف.',
    when3: 'تكون هذه الصفحة أكثر فائدة عندما تريد نتيجة واضحة بسرعة مع البقاء داخل نفس مجموعة العجلات.'
  },
  'zh-CN': {
    whatTitle: '{page} 是什么？',
    whenTitle: '什么时候使用这个{page}？',
    what1: '{page} 是一个适合快速随机结果和重复使用的转盘页面。{subtitle}',
    what2: '它让访客无需复杂设置就能快速转动选项。{intro}',
    what3: '如果你还想看看相关转盘，可以试试 {related}。',
    when1: '当你想要主题更明确的结果，而不是普通随机选择时，就适合使用这个{page}。',
    when2: '它很适合快速决定、重复访问、小组活动和轻量灵感场景。',
    when3: '当你希望快速得到清晰结果，同时继续停留在同一转盘主题集群中时，这个页面最有用。'
  },
  hi: {
    whatTitle: '{page} क्या है?',
    whenTitle: 'इस {page} का उपयोग कब करें?',
    what1: '{page} एक ऐसा व्हील पेज है जो तेज रैंडम परिणाम और बार-बार उपयोग के लिए बनाया गया है। {subtitle}',
    what2: 'यह बिना अतिरिक्त सेटअप के विकल्प घुमाने का आसान तरीका देता है। {intro}',
    what3: 'अगर आप अगला संबंधित व्हील देखना चाहते हैं, तो {related} आज़माएं।',
    when1: 'इस {page} का उपयोग तब करें जब आपको सामान्य रैंडम चयन की बजाय विषय से जुड़ा परिणाम चाहिए।',
    when2: 'यह तेज फैसलों, बार-बार विजिट, समूह गतिविधियों और हल्की प्रेरणा के लिए अच्छा है।',
    when3: 'यह पेज तब सबसे उपयोगी है जब आप जल्दी साफ परिणाम चाहते हैं और उसी व्हील क्लस्टर में रहना चाहते हैं।'
  },
  bn: {
    whatTitle: '{page} কী?',
    whenTitle: 'এই {page} কখন ব্যবহার করবেন?',
    what1: '{page} একটি হুইল পেজ যা দ্রুত র্যান্ডম ফলাফল এবং বারবার ব্যবহারের জন্য তৈরি। {subtitle}',
    what2: 'এটি অতিরিক্ত সেটআপ ছাড়াই অপশন ঘোরানোর সহজ উপায় দেয়। {intro}',
    what3: 'আপনি যদি আরেকটি সম্পর্কিত হুইল দেখতে চান, তাহলে {related} দেখুন।',
    when1: 'এই {page} ব্যবহার করুন যখন সাধারণ র্যান্ডম পিকের বদলে বিষয়ভিত্তিক ফল চান।',
    when2: 'এটি দ্রুত সিদ্ধান্ত, বারবার ভিজিট, দলীয় কাজ এবং হালকা অনুপ্রেরণার জন্য ভাল।',
    when3: 'আপনি যদি দ্রুত পরিষ্কার ফল চান এবং একই হুইল ক্লাস্টারের মধ্যে থাকতে চান, তাহলে এই পেজ সবচেয়ে উপকারী।'
  },
  ur: {
    whatTitle: '{page} کیا ہے؟',
    whenTitle: 'یہ {page} کب استعمال کریں؟',
    what1: '{page} ایک وہیل صفحہ ہے جو تیز رینڈم نتائج اور بار بار استعمال کے لئے بنایا گیا ہے۔ {subtitle}',
    what2: 'یہ بغیر اضافی سیٹ اپ کے آپشنز گھمانے کا آسان طریقہ دیتا ہے۔ {intro}',
    what3: 'اگر آپ اگلا متعلقہ وہیل دیکھنا چاہتے ہیں تو {related} آزمائیں۔',
    when1: 'یہ {page} تب استعمال کریں جب آپ عام رینڈم انتخاب کے بجائے موضوع سے جڑا نتیجہ چاہتے ہوں۔',
    when2: 'یہ تیز فیصلوں، بار بار وزٹ، گروپ سرگرمیوں اور ہلکی تحریک کے لئے مفید ہے۔',
    when3: 'یہ صفحہ تب سب سے زیادہ مفید ہے جب آپ جلد واضح نتیجہ چاہتے ہوں اور اسی وہیل کلسٹر میں رہنا چاہتے ہوں۔'
  },
  id: {
    whatTitle: 'Apa itu {page}?',
    whenTitle: 'Kapan menggunakan {page} ini?',
    what1: '{page} adalah halaman roda yang dibuat untuk hasil acak cepat dan penggunaan berulang. {subtitle}',
    what2: 'Halaman ini memberi cara sederhana untuk memutar pilihan tanpa pengaturan tambahan. {intro}',
    what3: 'Jika Anda ingin mencoba roda terkait berikutnya, gunakan {related}.',
    when1: 'Gunakan {page} ini saat Anda ingin hasil bertema, bukan pilihan acak yang terlalu umum.',
    when2: 'Halaman ini cocok untuk keputusan cepat, kunjungan berulang, aktivitas kelompok, dan inspirasi ringan.',
    when3: 'Halaman ini paling berguna saat Anda ingin hasil yang jelas dengan cepat sambil tetap berada dalam klaster roda yang sama.'
  },
  ja: {
    whatTitle: '{page}とは？',
    whenTitle: 'この{page}を使う場面',
    what1: '{page}は、すばやいランダム結果と繰り返し利用のために作られたルーレットページです。{subtitle}',
    what2: '余計な設定なしで選択肢を回せる、わかりやすい仕組みです。{intro}',
    what3: '関連するルーレットも試したい場合は、{related}を使えます。',
    when1: '一般的なランダム選択ではなく、テーマに合った結果が欲しいときにこの{page}を使います。',
    when2: '素早い判断、繰り返しの利用、グループ活動、軽い発想のきっかけに向いています。',
    when3: '同じルーレットクラスター内で、すぐにわかりやすい結果を得たいときに特に役立ちます。'
  },
  mr: {
    whatTitle: '{page} म्हणजे काय?',
    whenTitle: 'हे {page} कधी वापरावे?',
    what1: '{page} हे वेगवान रँडम निकाल आणि पुन्हा पुन्हा वापरासाठी तयार केलेले व्हील पृष्ठ आहे. {subtitle}',
    what2: 'हे कोणत्याही अतिरिक्त सेटअपशिवाय पर्याय फिरवण्याचा सोपा मार्ग देते. {intro}',
    what3: 'तुम्हाला पुढचे संबंधित व्हील पाहायचे असल्यास {related} वापरा.',
    when1: 'साध्या रँडम निवडीऐवजी विषयाशी जुळणारा निकाल हवा असेल तेव्हा हे {page} वापरा.',
    when2: 'हे जलद निर्णय, पुन्हा भेटी, गट क्रिया आणि हलक्या प्रेरणेसाठी चांगले आहे.',
    when3: 'त्याच व्हील क्लस्टरमध्ये राहून पटकन स्पष्ट निकाल हवा असेल तेव्हा हे पृष्ठ सर्वात उपयुक्त ठरते.'
  },
  te: {
    whatTitle: '{page} అంటే ఏమిటి?',
    whenTitle: 'ఈ {page} ను ఎప్పుడు ఉపయోగించాలి?',
    what1: '{page} అనేది త్వరిత యాదృచ్ఛిక ఫలితాలు మరియు మళ్లీ మళ్లీ ఉపయోగానికి రూపొందించిన వీల్ పేజీ. {subtitle}',
    what2: 'అదనపు సెటప్ లేకుండా ఎంపికలను తిప్పడానికి ఇది సరళమైన మార్గాన్ని ఇస్తుంది. {intro}',
    what3: 'తదుపరి సంబంధించిన వీల్ చూడాలనుకుంటే {related} ప్రయత్నించండి.',
    when1: 'సాధారణ రాండమ్ ఎంపికకు బదులుగా విషయం‌కు సరిపోయే ఫలితం కావాలంటే ఈ {page} ను ఉపయోగించండి.',
    when2: 'ఇది త్వరిత నిర్ణయాలు, మళ్లీ సందర్శనలు, గుంపు కార్యకలాపాలు మరియు తేలికైన ప్రేరణకు అనుకూలంగా ఉంటుంది.',
    when3: 'అదే వీల్ క్లస్టర్‌లో ఉండి త్వరగా స్పష్టమైన ఫలితం కావాలంటే ఈ పేజీ అత్యంత ఉపయోగకరం.'
  }
};

function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}

export function renderWheelSeoContent(primaryKeyword, slug, locale = 'en') {
  const safeLocale = normalizeLocale(locale);
  const copy = SEO_COPY[safeLocale] || SEO_COPY.en;
  const relatedSlug = SEO_LINK_MAP[slug];
  const t = getWheelSharedText(safeLocale, slug === 'home' ? 'rainbow' : slug);
  const relatedTitle = relatedSlug ? getLocalizedRouteContent(safeLocale, relatedSlug).title : '';
  const related = relatedSlug ? `<a href="${buildLocalizedPath(safeLocale, relatedSlug)}">${relatedTitle}</a>` : '';
  const englishRelated = relatedSlug ? `<a href="${buildLocalizedPath(safeLocale, relatedSlug)}">${getLocalizedRouteContent(safeLocale, relatedSlug).title}</a>` : '';

  if (safeLocale === 'en') {
    const englishContent = {
      home: {
        what: [
          `${primaryKeyword} is a yes, no, and maybe decision spinner created for users who need quick answers for simple choices, daily decisions, games, and lightweight prompts. It is built for people who want a fast answer without setting up a full custom spinner first. That makes it useful for instant decisions, fun yes-or-no questions, quick maybe answers, casual games, and low-friction random choices, especially when speed matters more than complexity.`,
          `Visitors can open the page, spin immediately, and get a clear result that still feels interactive and repeatable. The homepage version also acts as the central entry point for the broader wheel cluster, helping users move from simple decisions to more themed tools when needed.`,
          `If you want a more visual and colorful variation after using the main decision wheel, ${englishRelated} is a natural next step. Overall, ${primaryKeyword} works as the main everyday decision wheel for users who want low friction, quick results, and a format that stays useful across repeated visits.`
        ],
        when: [
          `You should use this ${primaryKeyword} when you want a fast answer without building a full custom list first. It works best for small daily decisions, group votes, playful challenges, content ideas, and quick moments where you want the wheel to answer for you.`,
          `Users can open the homepage, spin once, and move forward instead of spending time building options manually. This makes the page useful for repeat visits because the problem it solves is broad, common, and easy to understand.`,
          `A quick yes-or-no style result fits everyday choices, light games, content ideas, and small group activities. In short, use this ${primaryKeyword} when you want the fastest decision wheel on the site, with simple controls, clear answers, and strong repeat value.`
        ]
      },
      generic: {
        what: [
          `${primaryKeyword} is a focused wheel page built for fast random results and repeat use. Instead of using plain lists or manual picking, this wheel turns selection into a clearer visual experience that is easier to repeat.`,
          `It is useful for themed decisions, repeat visits, group activities, and quick inspiration, which gives the page value beyond a one-time novelty spin. One of the main strengths of ${primaryKeyword} is its balance of usefulness and presentation. Visitors can understand the result quickly, customize the tool when needed, and return without friction.`,
          `That makes the page relevant for entertainment, education, creativity, and practical selection. If you want to explore a related wheel next, ${englishRelated} can support a different kind of spin experience while keeping users inside the same topic cluster. Overall, ${primaryKeyword} stays focused on a clear keyword, a strong use case, and repeatable user intent.`
        ],
        when: [
          `You should use this ${primaryKeyword} when a themed spinner adds more value than a generic picker. In practical terms, that can include planning, teaching, content creation, hosting, and quick solo inspiration.`,
          `In those moments, the wheel does more than generate a result. It adds pace, structure, and a sense of engagement that helps users keep moving instead of hesitating over the next choice. ${primaryKeyword} works best when the visitor wants a relevant themed outcome rather than any random answer.`,
          `The themed focus narrows the decision space while keeping the final result random. In short, use this ${primaryKeyword} when you want a wheel that fits the moment, supports the activity around it, and stays useful across repeated visits.`
        ]
      }
    };

    const selected = slug === 'home' ? englishContent.home : englishContent.generic;

    return `
      <section class="wheel-seo-content page-content">
        <section class="content-section">
          <h2>What is ${primaryKeyword}?</h2>
          ${selected.what.map((paragraph) => `<p>${paragraph}</p>`).join('')}
        </section>
        <section class="content-section">
          <h2>When to Use This ${primaryKeyword}?</h2>
          ${selected.when.map((paragraph) => `<p>${paragraph}</p>`).join('')}
        </section>
      </section>
    `;
  }

  const values = {
    page: primaryKeyword,
    subtitle: getLocalizedRouteContent(safeLocale, slug || 'home').subtitle,
    intro: t.howToIntro || '',
    related
  };

  return `
    <section class="wheel-seo-content page-content">
      <section class="content-section">
        <h2>${fill(copy.whatTitle, values)}</h2>
        <p>${fill(copy.what1, values)}</p>
        <p>${fill(copy.what2, values)}</p>
        ${related ? `<p>${fill(copy.what3, values)}</p>` : ''}
      </section>
      <section class="content-section">
        <h2>${fill(copy.whenTitle, values)}</h2>
        <p>${fill(copy.when1, values)}</p>
        <p>${fill(copy.when2, values)}</p>
        <p>${fill(copy.when3, values)}</p>
      </section>
    </section>
  `;
}
