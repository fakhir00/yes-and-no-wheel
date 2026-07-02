import json
import re

file_path = 'js/wheelContent.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find("'yes-and-no-dice': {")
if start_idx == -1:
    print("Could not find yes-and-no-dice block")
    exit()

end_idx = content.find("\n  }", start_idx)
dice_block = content[start_idx:end_idx]

translations = {
    'fr': {
        's1_title': "Qu'est-ce que l'outil Dés Oui Non ?",
        's1_c1': "L'outil Dés Oui Non est un décideur basé sur la physique 3D qui lance un dé virtuel avec des faces Oui et Non. Au lieu de cliquer sur une roulette ou de tirer à pile ou face, vous regardez un dé 3D réaliste culbuter dans l'espace, rebondir sur des surfaces et s'arrêter sur un résultat aléatoire.",
        's1_c2': "Chaque face du dé affiche un Oui ou un Non en texte gras sur un fond coloré — vert pour Oui, rouge pour Non. Le curseur de probabilité vous permet d'ajuster combien de faces affichent Oui par rapport à Non.",
        's1_c3': "L'outil fonctionne entièrement dans votre navigateur en utilisant Three.js pour le rendu 3D et Cannon.js pour la simulation physique. Aucune communication avec le serveur ne se produit pendant un lancer.",
        
        's2_title': "Comment fonctionne le moteur physique 3D",
        's2_c1': "Lorsque vous cliquez sur le bouton Lancer le dé, le moteur physique lance le dé depuis une position aléatoire au-dessus du sol. Le dé reçoit une vélocité aléatoire en trois dimensions et une vélocité angulaire aléatoire pour la rotation.",
        's2_c2': "Le moteur suit l'orientation du dé en utilisant des quaternions — une représentation mathématique qui évite le blocage de cardan et fournit une interpolation de rotation fluide.",
        's2_c3': "Pour trouver le résultat, le moteur vérifie quelle face du dé pointe le plus directement vers le haut en comparant le vecteur normal de chaque face par rapport à la direction haut du monde.",
        
        's3_title': "Modes de jeu et contrôle de probabilité",
        's3_c': "L'outil de dés propose trois modes de jeu qui changent combien de lancers déterminent la réponse finale.",
        's3_sub1_t': "Mode lancer unique",
        's3_sub1_c': "En mode Unique, un seul lancer produit le résultat final. C'est l'option la plus rapide et fonctionne bien pour les questions oui ou non simples.",
        's3_sub2_t': "Mode meilleur des 3",
        's3_sub2_c': "Le meilleur des 3 nécessite deux des trois lancers pour déterminer un gagnant. Ce mode ajoute du suspense et donne plus d'opportunités au dé.",
        's3_sub3_t': "Mode meilleur des 5",
        's3_sub3_c': "Le meilleur des 5 nécessite trois des cinq lancers pour gagner. Ce mode est le meilleur pour les décisions qui semblent assez importantes pour justifier un processus plus long.",
        's3_sub4_t': "Curseur de probabilité",
        's3_sub4_c': "Le curseur de probabilité ajuste la distribution des faces du dé de 0% Oui à 100% Oui. À 50%, le dé est équilibré."
    }
}

def build_sections_json(t):
    return f"""[
                  {{
                        "title": "{t['s1_title']}",
                        "content": [
                              "{t['s1_c1']}",
                              "{t['s1_c2']}",
                              "{t['s1_c3']}"
                        ]
                  }},
                  {{
                        "title": "{t['s2_title']}",
                        "content": [
                              "{t['s2_c1']}",
                              "{t['s2_c2']}",
                              "{t['s2_c3']}"
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
                              }},
                              {{
                                    "title": "{t['s3_sub4_t']}",
                                    "content": "{t['s3_sub4_c']}"
                              }}
                        ]
                  }}
            ]"""

loc = 'fr'
loc_start = dice_block.find(f"    {loc}: {{")
if loc_start == -1:
    loc_start = dice_block.find(f"    '{loc}': {{")

if loc_start != -1:
    sections_start = dice_block.find('"sections": [', loc_start)
    if sections_start != -1:
        faq_start = dice_block.find('"faq": [', sections_start)
        if faq_start != -1:
            sections_end = dice_block.rfind(']', sections_start, faq_start)
            
            t = translations['fr']
            replacement = build_sections_json(t)
            
            # replace the sections array entirely
            # from `"sections": [` to `]`
            
            # Wait, the sections array is matched from `sections_start` to `sections_end + 1`
            # Let's replace that exact slice.
            
            dice_block = dice_block[:sections_start] + '"sections": ' + replacement + "\n            ," + dice_block[sections_end+1:]
            
            # Need to clean up the comma if there's a duplicate or something
            # Just do standard replacement
            
content = content[:start_idx] + dice_block + content[end_idx:]

# The string concatenation might leave `\n            ,"faq": [` which is fine in JS syntax since there's a trailing comma before `"faq"`. 
# Wait, replacing `sections_start` to `sections_end+1` replaces the `],` before `"faq"`.
# So let's make sure we include the comma.

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully replaced French chunks in Dice sections.")
