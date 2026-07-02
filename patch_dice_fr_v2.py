import json
import re

file_path = 'js/wheelContent.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find("'yes-and-no-dice': {")
if start_idx == -1:
    print("Could not find yes-and-no-dice block")
    exit()

end_idx = content.find("\n};", start_idx)
if end_idx == -1:
    end_idx = len(content)

dice_block = content[start_idx:end_idx]

translations = {
    'fr': {
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
        's3_sub4_c': "Le curseur de probabilité ajuste la distribution des faces du dé de 0% Oui à 100% Oui. À 50%, le dé est équilibré.",
        
        's4_title': "Quand utiliser les dés vs une roulette",
        's4_c1': "La roue oui ou non et les dés oui et non produisent tous deux des résultats binaires aléatoires. La différence réside dans l'expérience et le contexte de la décision.",
        's4_c2': "La roue qui tourne est visuelle et continue — vous la regardez tourner et ralentir. L'outil de dés est tactile et physique. L'animation 3D, la physique des rebonds et la chute aléatoire ressemblent davantage au lancer d'un vrai dé.",
        's4_c3': "Pour les décisions où vous souhaitez plusieurs résultats au-delà de oui et non, envisagez la roue de nourriture aléatoire ou la roue des pays.",
        
        's5_title': "Suivi de vos statistiques de lancer",
        's5_c1': "L'outil de dés suit automatiquement vos statistiques de session. Il compte vos lancers totaux, votre série actuelle de résultats identiques, et calcule votre taux de victoire basé sur le côté que vous considérez comme une victoire.",
        's5_c2': "Ces statistiques sont stockées dans le stockage local de votre navigateur et persistent entre les sessions, afin que vous puissiez suivre votre chance au fil du temps."
    }
}

loc_start = dice_block.find("    fr: {")
if loc_start == -1:
    loc_start = dice_block.find("    'fr': {")

if loc_start != -1:
    eng_start = dice_block.find('{\n                        "title": "How the 3D Physics Engine Works"', loc_start)
    if eng_start != -1:
        faq_start = dice_block.find('"faq": [', eng_start)
        if faq_start != -1:
            sections_end = dice_block.rfind(']', eng_start, faq_start)
            
            t = translations['fr']
            replacement = f"""{{
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
                  }},
                  {{
                        "title": "{t['s4_title']}",
                        "content": [
                              "{t['s4_c1']}",
                              "{t['s4_c2']}",
                              "{t['s4_c3']}"
                        ]
                  }},
                  {{
                        "title": "{t['s5_title']}",
                        "content": [
                              "{t['s5_c1']}",
                              "{t['s5_c2']}"
                        ]
                  }}
            """
            
            dice_block = dice_block[:eng_start] + replacement + dice_block[sections_end:]
            
content = content[:start_idx] + dice_block + content[end_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully replaced French chunks in Dice sections.")
