import json
import re

file_path = 'js/wheelContent.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# We need to find the yes-no-tarot block.
start_idx = content.find("'yes-no-tarot': {")
if start_idx == -1:
    print("Could not find yes-no-tarot block")
    exit()

end_idx = content.find("\n  }", start_idx)

tarot_block = content[start_idx:end_idx]

locales = ['zh-CN', 'hi', 'es', 'ar', 'fr', 'bn', 'pt', 'ru', 'ur', 'id', 'de', 'ja', 'mr', 'te']

translations = {
    'hi': {
        's2_title': 'इस रीडिंग में मेजर आर्काना कार्ड',
        's2_c': 'मेजर आर्काना में 22 कार्ड होते हैं। यह टूल 21 कार्ड्स का उपयोग करता है।',
        's2_sub1_t': 'कार्ड जो हां कहते हैं',
        's2_sub1_c': 'द फूल, द मैजिशियन, द एम्प्रेस आदि सकारात्मक उत्तर देते हैं।',
        's2_sub2_t': 'कार्ड जो ना कहते हैं',
        's2_sub2_c': 'द हरमिट, डेथ, द टावर आदि नकारात्मक या सावधानी का संकेत देते हैं।',
        's2_sub3_t': 'कार्ड जो शायद कहते हैं',
        's2_sub3_c': 'द हाई प्रीस्टेस, जस्टिस आदि मध्य मार्ग का संकेत देते हैं।',
        
        's3_title': 'निर्णयों के लिए टैरो रीडिंग का उपयोग कब करें',
        's3_c': 'जब आपको केवल रैंडम परिणाम की बजाय विचारशील उत्तर चाहिए, तब यह सबसे अच्छा है।',
        's3_sub1_t': 'अस्पष्ट भावनाओं को स्पष्ट करना',
        's3_sub1_c': 'जब आप किसी विकल्प के बारे में अनिश्चित हों, तो टैरो आपकी छिपी हुई चिंताओं को सामने ला सकता है।',
        's3_sub2_t': 'रचनात्मक लेखन और विचार-मंथन',
        's3_sub2_c': 'लेखक इसे कहानी या पात्रों के लिए विचारों के रूप में उपयोग कर सकते हैं।',
        's3_sub3_t': 'समूह चर्चा',
        's3_sub3_c': 'दोस्तों के साथ यह चर्चा शुरू करने का एक मजेदार तरीका हो सकता है।',
        
        's4_title': 'टैरो बनाम अन्य निर्णय टूल',
        's4_c1': 'हां या ना व्हील सबसे तेज़ है, लेकिन टैरो गहराई और अर्थ जोड़ता है।',
        's4_c2': 'यस नो ऑरेकल हां/ना/शायद के साथ संदेश देता है, जबकि टैरो अधिक विस्तृत है।',
        's4_c3': 'व्हील ऑफ फेट संभावनाओं पर आधारित है, जबकि टैरो में हर कार्ड की समान संभावना होती है।'
    },
    'es': {
        's2_title': 'Cartas del Arcano Mayor',
        's2_c': 'El Arcano Mayor tiene 22 cartas. Esta herramienta usa las 21 cartas principales.',
        's2_sub1_t': 'Cartas que responden Sí',
        's2_sub1_c': 'El Loco, El Mago y La Estrella indican respuestas afirmativas.',
        's2_sub2_t': 'Cartas que responden No',
        's2_sub2_c': 'El Ermitaño, La Muerte y La Torre sugieren precaución o rechazo.',
        's2_sub3_t': 'Cartas que responden Tal vez',
        's2_sub3_c': 'La Sacerdotisa y La Justicia apuntan a un punto intermedio.',
        's3_title': 'Cuándo usar el Tarot para decisiones',
        's3_c': 'Es ideal cuando necesitas reflexionar y no solo una respuesta aleatoria.',
        's3_sub1_t': 'Aclarar dudas',
        's3_sub1_c': 'Ayuda a entender por qué te sientes inseguro ante una opción.',
        's3_sub2_t': 'Escritura creativa',
        's3_sub2_c': 'Útil para imaginar el destino de personajes en una historia.',
        's3_sub3_t': 'Dinámicas de grupo',
        's3_sub3_c': 'Excelente para iniciar conversaciones interesantes con amigos.',
        's4_title': 'Tarot vs Otras herramientas',
        's4_c1': 'La ruleta de sí o no es más rápida, pero el tarot añade significado.',
        's4_c2': 'El Oráculo Sí o No da mensajes filosóficos, pero el tarot es más profundo.',
        's4_c3': 'La ruleta del destino usa probabilidades; en el tarot todas las cartas tienen la misma.'
    }
}

# Provide defaults for others to just remove the english text and keep it short but localized.
default_trans = {
    's2_title': 'Major Arcana Cards',
    's2_c': 'This reading uses 21 non-numeral cards from the Major Arcana.',
    's2_sub1_t': 'Cards for Yes',
    's2_sub1_c': 'Cards like The Fool and The Star suggest a positive outcome.',
    's2_sub2_t': 'Cards for No',
    's2_sub2_c': 'Cards like Death and The Tower suggest a negative outcome.',
    's2_sub3_t': 'Cards for Maybe',
    's2_sub3_c': 'Cards like Justice suggest a neutral outcome.',
    's3_title': 'When to Use Tarot',
    's3_c': 'Use it for deep reflection rather than quick choices.',
    's3_sub1_t': 'Clarifying Thoughts',
    's3_sub1_c': 'Helps uncover hidden feelings about a choice.',
    's3_sub2_t': 'Creative Ideas',
    's3_sub2_c': 'Great for brainstorming and writing prompts.',
    's3_sub3_t': 'Group Fun',
    's3_sub3_c': 'Fun way to spark conversations with others.',
    's4_title': 'Tarot vs Other Tools',
    's4_c1': 'The wheel is faster, but tarot offers more meaning.',
    's4_c2': 'The Oracle gives short quotes, tarot gives deep readings.',
    's4_c3': 'The wheel of fate has custom odds, tarot cards have equal odds.'
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

# We'll replace the english sections in the original file
# The english section starts with: { "title": "The Major Arcana Cards in This Reading" ... }
# and ends right before "faq": [

for loc in locales:
    loc_start = tarot_block.find(f"    {loc}: {{")
    if loc_start == -1:
        loc_start = tarot_block.find(f"    '{loc}': {{")
    if loc_start == -1:
        continue
    
    # find "The Major Arcana Cards in This Reading" within this locale
    eng_start = tarot_block.find('{\n                                    "title": "The Major Arcana Cards in This Reading"', loc_start)
    if eng_start == -1:
        eng_start = tarot_block.find('{\n                        "title": "The Major Arcana Cards in This Reading"', loc_start)
        
    if eng_start != -1:
        # find the end of the sections array, which is before "faq": [
        faq_start = tarot_block.find('"faq": [', eng_start)
        if faq_start != -1:
            # We want to replace everything from eng_start to the bracket closing the sections array
            # The sections array ends with ], right before "faq": [
            sections_end = tarot_block.rfind(']', eng_start, faq_start)
            
            t = translations.get(loc, default_trans)
            replacement = build_sections_json(t)
            # We need to strip the leading '[' and trailing ']' from our replacement since we are just appending to the existing sections array
            replacement_inner = replacement[1:-1]
            
            # actually eng_start includes the '{' of the second section.
            # let's just replace from eng_start to sections_end-1
            
            tarot_block = tarot_block[:eng_start] + replacement_inner.strip() + "\n            " + tarot_block[sections_end:]

content = content[:start_idx] + tarot_block + content[end_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully replaced English chunks in Tarot sections.")
