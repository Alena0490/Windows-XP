import { readFileSync, writeFileSync } from 'fs';

const file = 'node_modules/gh-pages/lib/git.js';
const original = "return this.exec('rm', '--ignore-unmatch', '-r', '-f', '--', ...files);";
const patched  = "return this.exec('rm', '--ignore-unmatch', '-r', '-f', '--', '.');";

const src = readFileSync(file, 'utf8');
if (src.includes(original)) {
  writeFileSync(file, src.replace(original, patched));
  console.log('gh-pages git.js patched (ENAMETOOLONG fix)');
} else if (src.includes(patched)) {
  console.log('gh-pages git.js already patched');
} else {
  console.warn('gh-pages git.js: unexpected content, patch skipped');
}
