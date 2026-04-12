import re

with open('js/i18n.js', 'r', encoding='utf-8') as f:
    content = f.read()

# I want to change:
# { entry: 'Pizza' } to 'Pizza'
# Basically, replace `{ entry: '([^']+)' \}` with `'\1'` inside the random-food section.

# Find the random-food section in WHEEL_SEED_ENTRIES
# I will just replace globally if it only affects the random-food section, but let's be safe.
start_idx = content.find("'random-food': {")
end_idx = content.find("},", start_idx) + 2

before = content[:start_idx]
to_change = content[start_idx:end_idx]
after = content[end_idx:]

# Replace occurrences of { entry: '...' } with '...'
import re
new_to_change = re.sub(r"\{\s*entry:\s*'([^']+)'\s*\}", r"'\1'", to_change)

with open('js/i18n.js', 'w', encoding='utf-8') as f:
    f.write(before + new_to_change + after)
