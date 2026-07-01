import codecs

file_path = 'js/i18n.js'
with codecs.open(file_path, 'r', 'utf-8') as f:
    content = f.read()

translations = {
    'zh-CN': { 'tarotAndOracleHeading': '塔罗与神谕', 'oracle': '是或否神谕', 'tarot': '是或否塔罗', 'blog': '博客' },
    'es': { 'tarotAndOracleHeading': 'Tarot y Oráculo', 'oracle': 'Oráculo Sí o No', 'tarot': 'Tarot Sí o No', 'blog': 'Blog' },
    'ar': { 'tarotAndOracleHeading': 'التاروت والعراف', 'oracle': 'عراف نعم أو لا', 'tarot': 'تاروت نعم أو لا', 'blog': 'المدونة' },
    'fr': { 'tarotAndOracleHeading': 'Tarot & Oracle', 'oracle': 'Oracle Oui Non', 'tarot': 'Tarot Oui Non', 'blog': 'Blog' },
    'bn': { 'tarotAndOracleHeading': 'ট্যারো এবং ওরাকল', 'oracle': 'ইয়েস নো ওরাকল', 'tarot': 'ইয়েস নো ট্যারো', 'blog': 'ব্লগ' },
    'pt': { 'tarotAndOracleHeading': 'Tarô e Oráculo', 'oracle': 'Oráculo Sim ou Não', 'tarot': 'Tarô Sim ou Não', 'blog': 'Blog' },
    'ru': { 'tarotAndOracleHeading': 'Таро и Оракул', 'oracle': 'Оракул Да или Нет', 'tarot': 'Таро Да или Нет', 'blog': 'Блог' },
    'ur': { 'tarotAndOracleHeading': 'ٹیرو اور اوریکل', 'oracle': 'یس نو اوریکل', 'tarot': 'یس نو ٹیرو', 'blog': 'بلاگ' },
    'id': { 'tarotAndOracleHeading': 'Tarot & Oracle', 'oracle': 'Oracle Ya atau Tidak', 'tarot': 'Tarot Ya atau Tidak', 'blog': 'Blog' },
    'de': { 'tarotAndOracleHeading': 'Tarot & Orakel', 'oracle': 'Ja Nein Orakel', 'tarot': 'Ja Nein Tarot', 'blog': 'Blog' },
    'ja': { 'tarotAndOracleHeading': 'タロット＆オラクル', 'oracle': 'イエス・ノー・オラクル', 'tarot': 'イエス・ノー・タロット', 'blog': 'ブログ' },
    'mr': { 'tarotAndOracleHeading': 'टॅरो आणि ऑरेकल', 'oracle': 'येस नो ऑरेकल', 'tarot': 'येस नो टॅरो', 'blog': 'ब्लॉग' },
    'te': { 'tarotAndOracleHeading': 'టారో & ఒరాకిల్', 'oracle': 'యెస్ నో ఒరాకిల్', 'tarot': 'యెస్ నో టారో', 'blog': 'బ్లాగ్' }
}

for locale, trans in translations.items():
    if locale == 'zh-CN':
        key_str = "'zh-CN': {"
    else:
        key_str = f"{locale}: {{"

    # UI_TRANSLATIONS replacement
    # We find the start of the locale block in UI_TRANSLATIONS
    ui_idx = content.find("export const UI_TRANSLATIONS = {")
    locale_idx = content.find(key_str, ui_idx)
    
    if locale_idx != -1 and content.find("tarotAndOracleHeading:", locale_idx, locale_idx+1000) == -1:
        # insert tarotAndOracleHeading: '...',
        # find first newline after locale_idx
        nl_idx = content.find("\n", locale_idx)
        insert_str = f"\n    tarotAndOracleHeading: '{trans['tarotAndOracleHeading']}',"
        content = content[:nl_idx] + insert_str + content[nl_idx:]

    # ROUTE_NAMES replacement
    route_idx = content.find("const ROUTE_NAMES = {")
    locale_idx_route = content.find(key_str, route_idx)
    
    if locale_idx_route != -1:
        # replace oracle
        target_oracle = "'oracle': 'Yes No Oracle'"
        repl_oracle = f"'oracle': '{trans['oracle']}'"
        search_range = content[locale_idx_route:locale_idx_route+1500]
        if target_oracle in search_range:
            new_search_range = search_range.replace(target_oracle, repl_oracle)
            content = content[:locale_idx_route] + new_search_range + content[locale_idx_route+1500:]
            
        # replace tarot
        search_range = content[locale_idx_route:locale_idx_route+1500]
        target_tarot = "'tarot': 'Yes No Tarot'"
        repl_tarot = f"'tarot': '{trans['tarot']}'"
        if target_tarot in search_range:
            new_search_range = search_range.replace(target_tarot, repl_tarot)
            content = content[:locale_idx_route] + new_search_range + content[locale_idx_route+1500:]

        # add blog
        search_range = content[locale_idx_route:locale_idx_route+1500]
        if "blog:" not in search_range and "'blog':" not in search_range:
            # find end of block "},"
            end_idx = search_range.find("  },")
            if end_idx != -1:
                # add a comma if missing
                insert_str = f",\n    blog: '{trans['blog']}'\n  "
                new_search_range = search_range[:end_idx].rstrip() + insert_str + "}," + search_range[end_idx+4:]
                content = content[:locale_idx_route] + new_search_range + content[locale_idx_route+1500:]

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(content)

print("Safely patched i18n.js")
