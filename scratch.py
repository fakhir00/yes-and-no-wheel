import re

with open('js/i18n.js', 'r', encoding='utf-8') as f:
    content = f.read()

translations = {
  "en": "'Random Food Wheel'",
  "zh-CN": "'随机食物转盘'",
  "hi": "'रैंडम फूड व्हील'",
  "es": "'Ruleta de Comida Aleatoria'",
  "ar": "'عجلة الطعام العشوائية'",
  "fr": "'Roue de Nourriture Aléatoire'",
  "bn": "'র্যান্ডম ফুড চাকা'",
  "pt": "'Roleta de Comida Aleatória'",
  "ru": "'Колесо Случайной Еды'",
  "ur": "'رینڈم فوڈ ویل'",
  "id": "'Roda Makanan Acak'",
  "de": "'Zufälliges Essensrad'",
  "ja": "'ランダム・フード・ルーレット'",
  "mr": "'रँडम फूड व्हील'",
  "te": "'రాండమ్ ఫుడ్ వీల్'"
}

for lang, trans_val in translations.items():
    pattern = r"(" + lang + r": \{[^\}]+'hair-color': [^}]+)(  \},|  \})|(" + lang + r": \{[^\}]+'hair-color': [^}]+)(    \},|    \})"
    # Wait, the fallback might be different indentations, it's safer to avoid regex entirely or use a simpler one.
    
    # Actually wait. Let's look at the occurrences of `'hair-color'` in ROUTE_NAMES.
    # In js/i18n.js, `ROUTE_NAMES` format is exactly:
    # 'hair-color': 'Hair Color Wheel'
    #  },
    
