import sys
import os
import time
from deep_translator import GoogleTranslator

LOCALES = ['zh-CN', 'hi', 'es', 'ar', 'fr', 'bn', 'pt', 'ru', 'ur', 'id', 'de', 'ja', 'mr', 'te']
FILE_PATH = 'Yes or No Wheel.txt'

def chunk_text(text, limit=4800):
    chunks = []
    lines = text.split('\n')
    current_chunk = []
    current_len = 0
    for line in lines:
        line_len = len(line) + 1
        if current_len + line_len > limit:
            chunks.append('\n'.join(current_chunk))
            current_chunk = [line]
            current_len = line_len
        else:
            current_chunk.append(line)
            current_len += line_len
    if current_chunk:
        chunks.append('\n'.join(current_chunk))
    return chunks

def translate_markdown(file_path, dest_lang):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    translator = GoogleTranslator(source='en', target=dest_lang)
    chunks = chunk_text(text)
    translated_text = ""
    
    for i, chunk in enumerate(chunks):
        if not chunk.strip():
            translated_text += chunk + "\n"
            continue
        try:
            res = translator.translate(chunk)
            if not res:
                res = chunk
            translated_text += res + "\n"
        except Exception as e:
            print(f"Error at chunk {i+1} for {dest_lang}: {e}")
            translated_text += chunk + "\n"
            time.sleep(2)
            
    dest_file = f"Yes or No Wheel_{dest_lang}.txt"
    with open(dest_file, 'w', encoding='utf-8') as f:
        f.write(translated_text)
    print(f"Finished translating {dest_lang} -> {dest_file}")

if __name__ == '__main__':
    for loc in LOCALES:
        print(f"Translating to {loc}...")
        translate_markdown(FILE_PATH, loc)
