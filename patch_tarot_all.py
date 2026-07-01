import json
import re

file_path = 'js/wheelContent.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find("'yes-no-tarot': {")
if start_idx == -1:
    print("Could not find yes-no-tarot block")
    exit()

end_idx = content.find("\n  }", start_idx)
tarot_block = content[start_idx:end_idx]

locales = ['zh-CN', 'ar', 'fr', 'bn', 'pt', 'ru', 'ur', 'id', 'de', 'ja', 'mr', 'te']

translations = {
    'zh-CN': {
        's2_title': '本次解读中的大阿尔卡那牌',
        's2_c': '大阿尔卡那由22张牌组成。此工具使用从愚者到世界的所有21张非数字牌。',
        's2_sub1_t': '回答“是”的牌',
        's2_sub1_c': '一些大阿尔卡那牌倾向于肯定的答案。愚者代表新的开始，魔术师象征足智多谋。',
        's2_sub2_t': '回答“否”的牌',
        's2_sub2_c': '其他牌暗示谨慎或衰退。隐士呼吁独处，死神代表结束。',
        's2_sub3_t': '回答“也许”的牌',
        's2_sub3_c': '一些牌占据中间立场。女祭司指向直觉，正义要求公平。',
        's3_title': '何时使用塔罗牌占卜进行决策',
        's3_c': '当你需要一个反思的提示而不是纯粹的机械随机结果时，是或否塔罗牌最适用。',
        's3_sub1_t': '澄清模棱两可的感觉',
        's3_sub1_c': '当你不确定某个选择但又说不出原因时，抽一张塔罗牌可以浮现潜在的担忧。',
        's3_sub2_t': '创意写作和头脑风暴',
        's3_sub2_c': '作家使用塔罗牌作为角色提示。',
        's3_sub3_t': '小组讨论和破冰',
        's3_sub3_c': '在社交场合，抽塔罗牌创造了共同的体验。',
        's4_title': '塔罗牌与其他决策工具',
        's4_c1': '是或否轮盘是最快的决策工具。塔罗牌通过牌意增加叙事深度。',
        's4_c2': '神谕提供中间立场的答案。塔罗牌更有层次感。',
        's4_c3': '命运之轮使用加权结果，而塔罗牌给每张牌相同的概率。'
    },
    'ar': {
        's2_title': 'بطاقات أركانا الكبرى في هذه القراءة',
        's2_c': 'تتكون أركانا الكبرى من 22 بطاقة. تستخدم هذه الأداة 21 بطاقة.',
        's2_sub1_t': 'بطاقات تجيب بنعم',
        's2_sub1_c': 'بعض البطاقات تميل للإيجابية، مثل الأحمق والساحر.',
        's2_sub2_t': 'بطاقات تجيب بلا',
        's2_sub2_c': 'تشير بطاقات أخرى إلى الحذر، مثل الناسك والموت.',
        's2_sub3_t': 'بطاقات تجيب بربما',
        's2_sub3_c': 'بعض البطاقات تحتل منطقة وسطى، مثل الكاهنة والعدالة.',
        's3_title': 'متى تستخدم قراءة التاروت للقرارات',
        's3_c': 'عندما تحتاج إلى التفكير العميق وليس مجرد نتيجة عشوائية.',
        's3_sub1_t': 'توضيح المشاعر الغامضة',
        's3_sub1_c': 'تساعدك البطاقات على فهم مخاوفك الخفية.',
        's3_sub2_t': 'الكتابة الإبداعية',
        's3_sub2_c': 'يستخدمها الكتاب لإلهام الشخصيات.',
        's3_sub3_t': 'المناقشات الجماعية',
        's3_sub3_c': 'تجربة مشتركة ممتعة مع الأصدقاء.',
        's4_title': 'التاروت مقابل أدوات القرار الأخرى',
        's4_c1': 'العجلة أسرع، لكن التاروت يضيف المعنى.',
        's4_c2': 'العراف يقدم رسائل فلسفية، لكن التاروت أعمق.',
        's4_c3': 'عجلة القدر تعتمد على الاحتمالات، في التاروت كل البطاقات متساوية الاحتمال.'
    },
    'fr': {
        's2_title': 'Les cartes des Arcanes Majeurs',
        's2_c': 'Les Arcanes Majeurs comptent 22 cartes. Cet outil utilise 21 cartes.',
        's2_sub1_t': 'Cartes qui répondent Oui',
        's2_sub1_c': 'Le Fou et Le Magicien indiquent des réponses affirmatives.',
        's2_sub2_t': 'Cartes qui répondent Non',
        's2_sub2_c': 'L\'Ermite et La Mort suggèrent la prudence ou la fin.',
        's2_sub3_t': 'Cartes qui répondent Peut-être',
        's2_sub3_c': 'La Papesse et La Justice indiquent un terrain d\'entente.',
        's3_title': 'Quand utiliser le Tarot',
        's3_c': 'Idéal pour réfléchir plutôt que d\'avoir un résultat mécanique.',
        's3_sub1_t': 'Clarifier les doutes',
        's3_sub1_c': 'Aide à comprendre vos préoccupations sous-jacentes.',
        's3_sub2_t': 'Écriture créative',
        's3_sub2_c': 'Utile pour imaginer le destin des personnages.',
        's3_sub3_t': 'Discussions de groupe',
        's3_sub3_c': 'Crée une expérience partagée amusante.',
        's4_title': 'Le Tarot vs Autres outils',
        's4_c1': 'La roue est plus rapide, mais le tarot a plus de sens.',
        's4_c2': 'L\'Oracle donne des messages, le tarot est plus profond.',
        's4_c3': 'La roue du destin utilise des probabilités variables, le tarot est équitable.'
    },
    'bn': {
        's2_title': 'মেজর আরকানা কার্ডস',
        's2_c': 'এই রিডিং ২১টি মেজর আরকানা কার্ড ব্যবহার করে।',
        's2_sub1_t': 'যে কার্ডগুলো হ্যাঁ বলে',
        's2_sub1_c': 'দ্য ফুল বা দ্য স্টার ইতিবাচক উত্তর দেয়।',
        's2_sub2_t': 'যে কার্ডগুলো না বলে',
        's2_sub2_c': 'দ্য টাওয়ার বা ডেথ নেতিবাচক উত্তর দেয়।',
        's2_sub3_t': 'যে কার্ডগুলো হয়তো বলে',
        's2_sub3_c': 'জাস্টিস বা হাই প্রিস্টেস মাঝামাঝি অবস্থান নেয়।',
        's3_title': 'ট্যারো কখন ব্যবহার করবেন',
        's3_c': 'গভীর চিন্তার জন্য এটি ব্যবহার করুন।',
        's3_sub1_t': 'অস্পষ্ট অনুভূতি পরিষ্কার করা',
        's3_sub1_c': 'আপনার ভেতরের উদ্বেগগুলো বুঝতে সাহায্য করে।',
        's3_sub2_t': 'সৃজনশীল লেখা',
        's3_sub2_c': 'গল্পের চরিত্রদের জন্য দারুণ।',
        's3_sub3_t': 'গ্রুপ আড্ডা',
        's3_sub3_c': 'বন্ধুদের সাথে আলোচনার ভালো মাধ্যম।',
        's4_title': 'ট্যারো বনাম অন্যান্য টুল',
        's4_c1': 'চাকা অনেক দ্রুত, কিন্তু ট্যারো অর্থবহ।',
        's4_c2': 'ওরাকল শুধু বার্তা দেয়, ট্যারো দেয় গভীরতা।',
        's4_c3': 'ভাগ্যের চাকায় সম্ভাবনা ভিন্ন, কিন্তু ট্যারোতে সবার সম্ভাবনা সমান।'
    },
    'pt': {
        's2_title': 'Cartas dos Arcanos Maiores',
        's2_c': 'Os Arcanos Maiores têm 22 cartas. Esta ferramenta usa as 21 principais.',
        's2_sub1_t': 'Cartas que respondem Sim',
        's2_sub1_c': 'O Louco e O Mago indicam respostas afirmativas.',
        's2_sub2_t': 'Cartas que respondem Não',
        's2_sub2_c': 'O Eremita e A Morte sugerem cautela.',
        's2_sub3_t': 'Cartas que respondem Talvez',
        's2_sub3_c': 'A Sacerdotisa e A Justiça apontam para um meio-termo.',
        's3_title': 'Quando usar o Tarô',
        's3_c': 'Ideal quando você precisa refletir sobre uma decisão.',
        's3_sub1_t': 'Esclarecer sentimentos',
        's3_sub1_c': 'Ajuda a descobrir por que você está inseguro.',
        's3_sub2_t': 'Escrita criativa',
        's3_sub2_c': 'Útil para imaginar histórias.',
        's3_sub3_t': 'Dinâmicas de grupo',
        's3_sub3_c': 'Ótimo para iniciar conversas.',
        's4_title': 'Tarô vs Outras ferramentas',
        's4_c1': 'A roleta é mais rápida, mas o tarô adiciona profundidade.',
        's4_c2': 'O Oráculo dá mensagens curtas, o tarô é mais detalhado.',
        's4_c3': 'A roleta do destino usa probabilidades, o tarô não.'
    },
    'ru': {
        's2_title': 'Карты Старших Арканов',
        's2_c': 'В Старших Арканах 22 карты. Этот инструмент использует 21 карту.',
        's2_sub1_t': 'Карты, отвечающие Да',
        's2_sub1_c': 'Шут и Маг указывают на положительный ответ.',
        's2_sub2_t': 'Карты, отвечающие Нет',
        's2_sub2_c': 'Отшельник и Смерть предполагают осторожность.',
        's2_sub3_t': 'Карты, отвечающие Может быть',
        's2_sub3_c': 'Жрица и Справедливость указывают на золотую середину.',
        's3_title': 'Когда использовать Таро для решений',
        's3_c': 'Идеально для глубоких размышлений, а не просто случайных ответов.',
        's3_sub1_t': 'Прояснение чувств',
        's3_sub1_c': 'Помогает понять скрытые опасения.',
        's3_sub2_t': 'Творческое письмо',
        's3_sub2_c': 'Полезно для писателей и создания персонажей.',
        's3_sub3_t': 'Групповые обсуждения',
        's3_sub3_c': 'Отличный способ начать разговор в компании.',
        's4_title': 'Таро против других инструментов',
        's4_c1': 'Колесо быстрее, но таро добавляет смысл.',
        's4_c2': 'Оракул дает сообщения, а таро глубже.',
        's4_c3': 'Колесо судьбы использует вероятности, в таро шансы равны.'
    },
    'ur': {
        's2_title': 'بڑے آرکانا کارڈز',
        's2_c': 'یہ ٹول 21 بڑے آرکانا کارڈز استعمال کرتا ہے۔',
        's2_sub1_t': 'ہاں کہنے والے کارڈز',
        's2_sub1_c': 'مثبت کارڈز جیسے دی فول اور دی میجیشن۔',
        's2_sub2_t': 'نہ کہنے والے کارڈز',
        's2_sub2_c': 'منفی کارڈز جیسے ڈیتھ اور دی ٹاور۔',
        's2_sub3_t': 'شاید کہنے والے کارڈز',
        's2_sub3_c': 'جسٹس جیسے کارڈز درمیانی راستہ دکھاتے ہیں۔',
        's3_title': 'ٹیرو کا استعمال کب کریں',
        's3_c': 'جب آپ کو گہری سوچ کی ضرورت ہو۔',
        's3_sub1_t': 'احساسات کو واضح کرنا',
        's3_sub1_c': 'یہ آپ کے اندرونی خیالات کو سمجھنے میں مدد کرتا ہے۔',
        's3_sub2_t': 'تخلیقی تحریر',
        's3_sub2_c': 'کہانی کے کرداروں کے لیے بہترین۔',
        's3_sub3_t': 'دوستوں کے ساتھ بات چیت',
        's3_sub3_c': 'محفل میں بات چیت شروع کرنے کا ایک زبردست طریقہ۔',
        's4_title': 'ٹیرو بمقابلہ دیگر ٹولز',
        's4_c1': 'پہیہ تیز ہے، لیکن ٹیرو زیادہ معنی خیز ہے۔',
        's4_c2': 'اوریکل صرف پیغامات دیتا ہے، جبکہ ٹیرو زیادہ گہرا ہے۔',
        's4_c3': 'قسمت کے پہیے میں امکانات مختلف ہوتے ہیں، لیکن ٹیرو میں سب برابر ہیں۔'
    },
    'id': {
        's2_title': 'Kartu Major Arcana',
        's2_c': 'Alat ini menggunakan 21 kartu Major Arcana.',
        's2_sub1_t': 'Kartu yang Menjawab Ya',
        's2_sub1_c': 'Kartu The Fool dan The Magician menunjukkan hasil positif.',
        's2_sub2_t': 'Kartu yang Menjawab Tidak',
        's2_sub2_c': 'Kartu Death dan The Tower menunjukkan hasil negatif.',
        's2_sub3_t': 'Kartu yang Menjawab Mungkin',
        's2_sub3_c': 'Kartu Justice menunjukkan jalan tengah.',
        's3_title': 'Kapan Menggunakan Tarot',
        's3_c': 'Gunakan saat Anda butuh refleksi, bukan sekadar hasil acak.',
        's3_sub1_t': 'Memperjelas Perasaan',
        's3_sub1_c': 'Membantu Anda memahami kekhawatiran yang tersembunyi.',
        's3_sub2_t': 'Menulis Kreatif',
        's3_sub2_c': 'Sangat berguna untuk karakter dalam cerita.',
        's3_sub3_t': 'Diskusi Kelompok',
        's3_sub3_c': 'Cara yang menyenangkan untuk berbagi pemikiran.',
        's4_title': 'Tarot vs Alat Lainnya',
        's4_c1': 'Roda lebih cepat, tetapi tarot lebih bermakna.',
        's4_c2': 'Oracle memberi pesan, tarot memberi kedalaman.',
        's4_c3': 'Roda nasib memakai probabilitas khusus, tarot memiliki peluang sama.'
    },
    'de': {
        's2_title': 'Die Großen Arkana-Karten',
        's2_c': 'Dieses Tool verwendet 21 Karten der Großen Arkana.',
        's2_sub1_t': 'Karten, die Ja sagen',
        's2_sub1_c': 'Der Narr und Der Magier deuten auf eine positive Antwort hin.',
        's2_sub2_t': 'Karten, die Nein sagen',
        's2_sub2_c': 'Der Tod und Der Turm deuten auf Vorsicht hin.',
        's2_sub3_t': 'Karten, die Vielleicht sagen',
        's2_sub3_c': 'Die Gerechtigkeit deutet auf einen Mittelweg hin.',
        's3_title': 'Wann man Tarot verwenden sollte',
        's3_c': 'Ideal für tiefes Nachdenken statt nur schnelle Antworten.',
        's3_sub1_t': 'Gefühle klären',
        's3_sub1_c': 'Hilft dabei, versteckte Sorgen zu verstehen.',
        's3_sub2_t': 'Kreatives Schreiben',
        's3_sub2_c': 'Nützlich für die Entwicklung von Charakteren.',
        's3_sub3_t': 'Gruppendiskussionen',
        's3_sub3_c': 'Toller Einstieg in Gespräche mit Freunden.',
        's4_title': 'Tarot vs Andere Tools',
        's4_c1': 'Das Rad ist schneller, aber Tarot bietet mehr Bedeutung.',
        's4_c2': 'Das Orakel gibt philosophische Nachrichten, Tarot ist tiefer.',
        's4_c3': 'Das Schicksalsrad nutzt Wahrscheinlichkeiten, Tarot nicht.'
    },
    'ja': {
        's2_title': '大アルカナカードについて',
        's2_c': 'このツールは21枚の大アルカナカードを使用します。',
        's2_sub1_t': '「はい」と答えるカード',
        's2_sub1_c': '「愚者」や「魔術師」は肯定的な結果を示します。',
        's2_sub2_t': '「いいえ」と答えるカード',
        's2_sub2_c': '「死神」や「塔」は否定的な結果を示唆します。',
        's2_sub3_t': '「たぶん」と答えるカード',
        's2_sub3_c': '「正義」などは中立的な結果を示します。',
        's3_title': 'タロットを使用するタイミング',
        's3_c': '単なるランダムな結果ではなく、熟考したい時に最適です。',
        's3_sub1_t': '感情の整理',
        's3_sub1_c': '言葉にできない不安を表面化するのに役立ちます。',
        's3_sub2_t': 'クリエイティブな執筆',
        's3_sub2_c': 'キャラクターの行動を決めるのに役立ちます。',
        's3_sub3_t': 'グループでの会話',
        's3_sub3_c': '友人たちとの楽しいコミュニケーションのきっかけになります。',
        's4_title': 'タロット vs 他のツール',
        's4_c1': 'ルーレットは早いですが、タロットには意味があります。',
        's4_c2': 'オラクルはメッセージを出し、タロットはより深みがあります。',
        's4_c3': '運命の輪は確率を使用しますが、タロットのカードはすべて平等です。'
    },
    'mr': {
        's2_title': 'मेजर अर्काना कार्ड्स',
        's2_c': 'हे टूल २१ मेजर अर्काना कार्ड्स वापरते.',
        's2_sub1_t': 'होय म्हणणारी कार्ड्स',
        's2_sub1_c': 'द फूल आणि द मॅजिशियन सारखी कार्ड्स सकारात्मक उत्तर देतात.',
        's2_sub2_t': 'नाही म्हणणारी कार्ड्स',
        's2_sub2_c': 'द डेथ आणि द टॉवर सारखी कार्ड्स नकारात्मक उत्तर देतात.',
        's2_sub3_t': 'कदाचित म्हणणारी कार्ड्स',
        's2_sub3_c': 'जस्टिस सारखी कार्ड्स तटस्थ उत्तर देतात.',
        's3_title': 'टॅरो कधी वापरावा',
        's3_c': 'जेव्हा तुम्हाला सखोल विचारांची गरज असते.',
        's3_sub1_t': 'भावना स्पष्ट करणे',
        's3_sub1_c': 'निर्णयाबद्दल लपलेल्या भावना समजण्यास मदत करते.',
        's3_sub2_t': 'सर्जनशील लेखन',
        's3_sub2_c': 'कथा लेखनासाठी उत्तम.',
        's3_sub3_t': 'गट चर्चा',
        's3_sub3_c': 'मित्रांसोबत चर्चा सुरू करण्याचा मजेदार मार्ग.',
        's4_title': 'टॅरो विरूद्ध इतर टूल्स',
        's4_c1': 'चाक जलद आहे, पण टॅरो अधिक अर्थपूर्ण आहे.',
        's4_c2': 'ओरेकल फक्त संदेश देतो, टॅरो अधिक सखोल आहे.',
        's4_c3': 'नशिबाचे चाक संभाव्यता वापरते, टॅरोमध्ये सर्व कार्ड्स समान आहेत.'
    },
    'te': {
        's2_title': 'మేజర్ అర్కానా కార్డ్‌లు',
        's2_c': 'ఈ సాధనం 21 మేజర్ అర్కానా కార్డ్‌లను ఉపయోగిస్తుంది.',
        's2_sub1_t': 'అవును అని చెప్పే కార్డ్‌లు',
        's2_sub1_c': 'ద ఫూల్ మరియు ద మెజీషియన్ సానుకూల ఫలితాన్ని సూచిస్తాయి.',
        's2_sub2_t': 'కాదు అని చెప్పే కార్డ్‌లు',
        's2_sub2_c': 'ద డెత్ మరియు ద టవర్ ప్రతికూల ఫలితాన్ని సూచిస్తాయి.',
        's2_sub3_t': 'బహుశా అని చెప్పే కార్డ్‌లు',
        's2_sub3_c': 'ద జస్టిస్ మధ్యస్థ ఫలితాన్ని సూచిస్తుంది.',
        's3_title': 'టారోను ఎప్పుడు ఉపయోగించాలి',
        's3_c': 'లోతైన ఆలోచన అవసరమైనప్పుడు దీనిని ఉపయోగించండి.',
        's3_sub1_t': 'భావాలను స్పష్టం చేయడం',
        's3_sub1_c': 'దాగి ఉన్న ఆందోళనలను అర్థం చేసుకోవడంలో సహాయపడుతుంది.',
        's3_sub2_t': 'సృజనాత్మక రచన',
        's3_sub2_c': 'కథల కోసం ఆలోచనలకు ఇది అద్భుతమైనది.',
        's3_sub3_t': 'సమూహ చర్చలు',
        's3_sub3_c': 'స్నేహితులతో చర్చను ప్రారంభించడానికి ఒక ఆహ్లాదకరమైన మార్గం.',
        's4_title': 'టారో vs ఇతర సాధనాలు',
        's4_c1': 'చక్రం వేగంగా ఉంటుంది, కానీ టారో మరింత అర్థవంతమైనది.',
        's4_c2': 'ఓరాకిల్ సందేశాలను ఇస్తుంది, టారో మరింత లోతైనది.',
        's4_c3': 'విధి చక్రం సంభావ్యతలను ఉపయోగిస్తుంది, టారోలో కార్డ్‌లన్నీ సమానం.'
    }
}

def build_sections_json(t):
    return f"""[
                  {{
                        "title": "{t['s2_title']}",
                        "content": [
                              "{t['s2_c']}"
                        ],
                        "subsections": [
                              {{
                                    "title": "{t['s2_sub1_t']}",
                                    "content": "{t['s2_sub1_c']}"
                              }},
                              {{
                                    "title": "{t['s2_sub2_t']}",
                                    "content": "{t['s2_sub2_c']}"
                              }},
                              {{
                                    "title": "{t['s2_sub3_t']}",
                                    "content": "{t['s2_sub3_c']}"
                              }}
                        ]
                  }},
                  {{
                        "title": "{t['s3_title']}",
                        "content": [
                              "{t['s3_c']}"
                        ],
                        "subsections": [
                              {{
                                    "title": "{t['s3_sub1_t']}",
                                    "content": "{t['s3_sub1_c']}"
                              }},
                              {{
                                    "title": "{t['s3_sub2_t']}",
                                    "content": "{t['s3_sub2_c']}"
                              }},
                              {{
                                    "title": "{t['s3_sub3_t']}",
                                    "content": "{t['s3_sub3_c']}"
                              }}
                        ]
                  }},
                  {{
                        "title": "{t['s4_title']}",
                        "content": [
                              "{t['s4_c1']}",
                              "{t['s4_c2']}",
                              "{t['s4_c3']}"
                        ]
                  }}
            ]"""

for loc in locales:
    loc_start = tarot_block.find(f"    {loc}: {{")
    if loc_start == -1:
        loc_start = tarot_block.find(f"    '{loc}': {{")
    if loc_start == -1:
        continue
        
    eng_start = tarot_block.find('{\n                                    "title": "Major Arcana Cards"', loc_start)
    if eng_start == -1:
        eng_start = tarot_block.find('{\n                        "title": "Major Arcana Cards"', loc_start)
        
    if eng_start != -1:
        faq_start = tarot_block.find('"faq": [', eng_start)
        if faq_start != -1:
            sections_end = tarot_block.rfind(']', eng_start, faq_start)
            
            t = translations.get(loc)
            if not t:
                continue
                
            replacement = build_sections_json(t)
            replacement_inner = replacement[1:-1]
            
            tarot_block = tarot_block[:eng_start] + replacement_inner.strip() + "\n            " + tarot_block[sections_end:]

content = content[:start_idx] + tarot_block + content[end_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully replaced English defaults with fully localized Tarot sections.")
