import re

with open('js/i18n.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace `{ entry: 'XYZ' }` with `'XYZ'` in the whole file
new_content = re.sub(r"\{\s*entry:\s*'([^']+)'\s*\}", r"'\1'", content)

with open('js/i18n.js', 'w', encoding='utf-8') as f:
    f.write(new_content)
