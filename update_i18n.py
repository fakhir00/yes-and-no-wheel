import re

with open('js/i18n.js', 'r', encoding='utf-8') as f:
    content = f.read()

translations = {
  "en": "'Random Food Wheel'",
  "zh-CN": "'随机食物转盘'",
  "hi": "'रैंडम फूड व्हील'",
  "es": "'Ruleta de Comida Aleatoria'",
  "ar": "'عجلة الطعام العشوائي'",
  "fr": "'Roue de Nourriture Aléatoire'",
  "bn": "'র্যান্ডম ফুড চাকা'",
  "pt": "'Roleta de Comida Aleatória'",
  "ru": "'Колесо Случайной Еды'",
  "ur": "'رینڈم فوڈ ویل'",
  "id": "'Roda Makanan Acak'",
  "de": "'Zufälliges Essensrad'",
  "ja": "'ランダムフードルーレット'",
  "mr": "'रँडम फूड व्हील'",
  "te": "'రాండమ్ ఫుడ్ వీల్'"
}

for lang, trans_val in translations.items():
    # Because 'hair-color' occurs multiple times, we only want the one inside ROUTE_NAMES.
    # ROUTE_NAMES starts with `const ROUTE_NAMES = {`
    
    # We can split by `const ROUTE_NAMES = {` and `const ROUTE_SUBTITLE_TEMPLATES = {`
    parts = content.split('const ROUTE_SUBTITLE_TEMPLATES = {')
    route_names_part = parts[0]
    
    # Within route_names_part, find the language section
    pattern = r"(" + lang + r": \{[^\}]+?'hair-color': '[^']+')(\n  \},|\n  \})"
    
    def replacer(match):
        return match.group(1) + ",\n    'random-food': " + trans_val + match.group(2)
        
    new_route_names_part = re.sub(pattern, replacer, route_names_part, count=1)
    content = new_route_names_part + 'const ROUTE_SUBTITLE_TEMPLATES = {' + parts[1]


seed_content = """
  'random-food': {
    en: [{ entry: 'Pizza' }, { entry: 'Sushi' }, { entry: 'Burger' }, { entry: 'Tacos' }, { entry: 'Pasta' }, { entry: 'Salad' }, { entry: 'Steak' }, { entry: 'Sandwich' }],
    'zh-CN': [{ entry: '比萨' }, { entry: '寿司' }, { entry: '汉堡' }, { entry: '玉米面豆卷' }, { entry: '意面' }, { entry: '沙拉' }, { entry: '牛排' }, { entry: '三明治' }],
    hi: [{ entry: 'पिज्जा' }, { entry: 'सुशी' }, { entry: 'बर्गर' }, { entry: 'टैकोस' }, { entry: 'पास्ता' }, { entry: 'सलाद' }, { entry: 'स्टेक' }, { entry: 'सैंडविच' }],
    es: [{ entry: 'Pizza' }, { entry: 'Sushi' }, { entry: 'Hamburguesa' }, { entry: 'Tacos' }, { entry: 'Pasta' }, { entry: 'Ensalada' }, { entry: 'Bife' }, { entry: 'Sándwich' }],
    ar: [{ entry: 'بيتزا' }, { entry: 'سوشي' }, { entry: 'برجر' }, { entry: 'تاكو' }, { entry: 'مكرونة' }, { entry: 'سلطة' }, { entry: 'ستيك' }, { entry: 'ساندويتش' }],
    fr: [{ entry: 'Pizza' }, { entry: 'Sushi' }, { entry: 'Burger' }, { entry: 'Tacos' }, { entry: 'Pâtes' }, { entry: 'Salade' }, { entry: 'Steak' }, { entry: 'Sandwich' }],
    bn: [{ entry: 'পিজা' }, { entry: 'সুশি' }, { entry: 'বার্গার' }, { entry: 'ট্যাকো' }, { entry: 'পাস্তা' }, { entry: 'সালাদ' }, { entry: 'স্টেক' }, { entry: 'স্যান্ডউইচ' }],
    pt: [{ entry: 'Pizza' }, { entry: 'Sushi' }, { entry: 'Hambúrguer' }, { entry: 'Tacos' }, { entry: 'Massa' }, { entry: 'Salada' }, { entry: 'Bife' }, { entry: 'Sanduíche' }],
    ru: [{ entry: 'Пицца' }, { entry: 'Суши' }, { entry: 'Бургер' }, { entry: 'Тако' }, { entry: 'Паста' }, { entry: 'Салат' }, { entry: 'Стейк' }, { entry: 'Сэндвич' }],
    ur: [{ entry: 'پیزا' }, { entry: 'سوشی' }, { entry: 'برگر' }, { entry: 'ٹاکوس' }, { entry: 'پاستا' }, { entry: 'سلاد' }, { entry: 'اسٹیک' }, { entry: 'سینڈوچ' }],
    id: [{ entry: 'Pizza' }, { entry: 'Sushi' }, { entry: 'Burger' }, { entry: 'Tacos' }, { entry: 'Pasta' }, { entry: 'Salad' }, { entry: 'Steak' }, { entry: 'Sandwich' }],
    de: [{ entry: 'Pizza' }, { entry: 'Sushi' }, { entry: 'Burger' }, { entry: 'Tacos' }, { entry: 'Pasta' }, { entry: 'Salat' }, { entry: 'Steak' }, { entry: 'Sandwich' }],
    ja: [{ entry: 'ピザ' }, { entry: '寿司' }, { entry: 'バーガー' }, { entry: 'タコス' }, { entry: 'パスタ' }, { entry: 'サラダ' }, { entry: 'ステーキ' }, { entry: 'サンドイッチ' }],
    mr: [{ entry: 'पिझ्झा' }, { entry: 'सुशी' }, { entry: 'बर्गर' }, { entry: 'टॅको' }, { entry: 'पास्ता' }, { entry: 'सॅलड' }, { entry: 'स्टेक' }, { entry: 'सँडविच' }],
    te: [{ entry: 'పిజ్జా' }, { entry: 'సుషీ' }, { entry: 'బర్గర్' }, { entry: 'టాకోస్' }, { entry: 'పాస్తా' }, { entry: 'సలాడ్' }, { entry: 'స్టీక్' }, { entry: 'శాండ్విచ్' }]
  },
"""

content = content.replace('const WHEEL_SEED_ENTRIES = {', 'const WHEEL_SEED_ENTRIES = {' + seed_content)

content = content.replace(
    "['rainbow', 'wheel-of-fate', 'word', 'spin-the-wheel-truth-or-dare', 'dti-theme', 'country', 'zodiac', 'hair-color']",
    "['rainbow', 'wheel-of-fate', 'word', 'spin-the-wheel-truth-or-dare', 'dti-theme', 'country', 'zodiac', 'hair-color', 'random-food']"
)

with open('js/i18n.js', 'w', encoding='utf-8') as f:
    f.write(content)
