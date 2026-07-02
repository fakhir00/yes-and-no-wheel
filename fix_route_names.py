import json
import re

file_path = 'js/i18n.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

correct_translations = {
    'en': {'oracle': 'Yes No Oracle', 'tarot': 'Yes No Tarot', 'blog': 'Blog'},
    'zh-CN': {'oracle': '是或否神谕', 'tarot': '是或否塔罗牌', 'blog': '博客'},
    'hi': {'oracle': 'यस नो ऑरेकल', 'tarot': 'यस नो टैरो', 'blog': 'ब्लॉग'},
    'es': {'oracle': 'Oráculo Sí o No', 'tarot': 'Tarot Sí o No', 'blog': 'Blog'},
    'ar': {'oracle': 'عراف نعم أو لا', 'tarot': 'تاروت نعم أو لا', 'blog': 'المدونة'},
    'fr': {'oracle': 'Oracle Oui Non', 'tarot': 'Tarot Oui Non', 'blog': 'Blog'},
    'bn': {'oracle': 'হ্যাঁ না ওরাকল', 'tarot': 'হ্যাঁ না ট্যারো', 'blog': 'ব্লগ'},
    'pt': {'oracle': 'Oráculo Sim ou Não', 'tarot': 'Tarô Sim ou Não', 'blog': 'Blog'},
    'ru': {'oracle': 'Оракул Да или Нет', 'tarot': 'Таро Да или Нет', 'blog': 'Блог'},
    'ur': {'oracle': 'ہاں یا نہ اوریکل', 'tarot': 'ہاں یا نہ ٹیرو', 'blog': 'بلاگ'},
    'id': {'oracle': 'Oracle Ya atau Tidak', 'tarot': 'Tarot Ya atau Tidak', 'blog': 'Blog'},
    'de': {'oracle': 'Ja Nein Orakel', 'tarot': 'Ja Nein Tarot', 'blog': 'Blog'},
    'ja': {'oracle': 'イエスノーオラクル', 'tarot': 'イエスノータロット', 'blog': 'ブログ'},
    'mr': {'oracle': 'होय नाही ओरेकल', 'tarot': 'होय नाही टॅरो', 'blog': 'ब्लॉग'},
    'te': {'oracle': 'అవును కాదు ఓరాకిల్', 'tarot': 'అవును కాదు టారో', 'blog': 'బ్లాగ్'}
}

match = re.search(r"const ROUTE_NAMES\s*=\s*\{", content)
if not match:
    print("Could not find ROUTE_NAMES block")
    exit()

start_idx = match.start()
# find the end of the ROUTE_NAMES object by looking for the export that comes after it
end_idx = content.find("export function getRouteName", start_idx)
if end_idx == -1:
    end_idx = content.find("\n};", start_idx)
    if end_idx == -1:
        end_idx = len(content)

route_names_block = content[start_idx:end_idx]

for loc, trans in correct_translations.items():
    loc_start = route_names_block.find(f"\n  {loc}: {{")
    if loc_start == -1:
        loc_start = route_names_block.find(f"\n  '{loc}': {{")
    if loc_start == -1:
        print(f"Skipping {loc}, not found.")
        continue

    next_loc_start = route_names_block.find("\n  },", loc_start)
    if next_loc_start == -1:
        next_loc_start = len(route_names_block)

    loc_block = route_names_block[loc_start:next_loc_start]

    loc_block = re.sub(r"'oracle':\s*'.*?'", f"'oracle': '{trans['oracle']}'", loc_block)
    loc_block = re.sub(r"'tarot':\s*'.*?'", f"'tarot': '{trans['tarot']}'", loc_block)
    loc_block = re.sub(r"blog:\s*'.*?'", f"blog: '{trans['blog']}'", loc_block)
    loc_block = re.sub(r"'blog':\s*'.*?'", f"'blog': '{trans['blog']}'", loc_block)

    route_names_block = route_names_block[:loc_start] + loc_block + route_names_block[next_loc_start:]

new_content = content[:start_idx] + route_names_block + content[end_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("ROUTE_NAMES fixed successfully.")
