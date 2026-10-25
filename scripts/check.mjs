// Hurtig kontrol uden browser: sætter alle js-filer sammen i samme rækkefølge som index.html
// og tjekker, at koden kan parses, og at alle filer i index.html findes.
import { readFileSync, existsSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const local = [...html.matchAll(/<script src="(js\/[^"]+)"/g)].map(m => m[1]);
let ok = true;
for (const f of local) if (!existsSync(join(root, f))) { console.error('Mangler fil:', f); ok = false; }
const all = local.map(f => readFileSync(join(root, f), 'utf8')).join('');
const tmp = join(mkdtempSync(join(tmpdir(), 'sf-')), 'all.js');
writeFileSync(tmp, all);
try { execFileSync(process.execPath, ['--check', tmp], { stdio: 'inherit' }); console.log(`Syntaks OK (${local.length} filer)`); }
catch { ok = false; }
process.exit(ok ? 0 : 1);
