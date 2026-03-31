import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const inputPath = resolve('index.css');
const outputPath = resolve('index.min.css');

function minifyCss(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

const css = readFileSync(inputPath, 'utf8');
const minified = minifyCss(css);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, minified);
console.log(`Wrote ${outputPath}`);
