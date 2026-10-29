// Headless balance simulator: plays all 20 waves of a level with a given build order, no browser or rendering.
// It runs the real game code (js/01-config.js, js/09-game.js and the tower helpers in js/07-enemies.js) in a
// sandbox with the graphics/sound functions stubbed out, so balance changes in those files are picked up as-is.
// Usage: see `npm run sim -- --help` and the "Balance simulator" section in CLAUDE.md.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = f => readFileSync(join(root, f), 'utf8');

// ---------- command line ----------
const HELP = `Castle Defense balance simulator

  npm run sim -- <layout.json> [options]
  npm run sim -- --level N [--build "arrow 3,2" --build "up 3,2" ...] [options]
  npm run sim -- --map N            print level N's board (cell coordinates, roads, blocked cells)

Options:
  --level N        level 1-8 (overrides the layout file)
  --build "..."    add one build step (repeatable, appended after the file's steps)
  --keep-going     don't stop at defeat: play all 20 waves and count every leak
  --early          call every wave early ("Call wave early" button) and collect the full early bonus;
                   without it each wave starts the moment the last one ends, with no bonus
  --json           print the full result as JSON instead of the table
  --dt S           simulation step in seconds (default 1/60)
  --seed N         seed for Math.random (only affects looks in the game, kept for reproducibility)

Build steps, done in order as soon as there is enough gold (a step waits until it can be paid for,
and the steps after it wait too):
  <tower> c,r      build a tower on cell c,r: arrow cannon frost ballista storm alch banner vault
  up c,r           upgrade the tower on c,r (max level 3)
  sell c,r         sell the tower on c,r (60% back; a full refund if it was built in this same break, like Undo in the game)
  target c,r MODE  set the targeting of the tower on c,r: first last strong fast close (free, done at once)
  wave N           wait until the break before wave N`;

const args = process.argv.slice(2);
const opt = { build: [], dt: 1 / 60, seed: 1 };
for (let i = 0; i < args.length; i++) {
  const a = args[i], next = () => { if (i + 1 >= args.length) die(`${a} needs a value`); return args[++i]; };
  if (a == '--help' || a == '-h') { console.log(HELP); process.exit(0); }
  else if (a == '--level') opt.level = +next();
  else if (a == '--map') opt.map = +next();
  else if (a == '--build') opt.build.push(next());
  else if (a == '--keep-going') opt.keep = true;
  else if (a == '--early') opt.early = true;
  else if (a == '--json') opt.json = true;
  else if (a == '--dt') opt.dt = +next();
  else if (a == '--seed') opt.seed = +next();
  else if (a.startsWith('--')) die(`unknown option ${a} (see --help)`);
  else opt.file = a;
}
function die(msg) { console.error('sim: ' + msg); process.exit(1); }

let layout = { build: [] };
if (opt.file) {
  const f = existsSync(opt.file) ? opt.file : join(root, opt.file);
  if (!existsSync(f)) die(`layout file not found: ${opt.file}`);
  try { layout = JSON.parse(readFileSync(f, 'utf8')); } catch (e) { die(`${opt.file}: ${e.message}`); }
}
const level = opt.map || opt.level || layout.level || 1;
const nLevels = (src('js/01-config.js').match(/^const LEVELS=\[([\s\S]*?)\];/m)?.[1].match(/^\{n:/gm) || []).length;
if (!(Number.isInteger(level) && level >= 1 && level <= nLevels)) die(`level must be 1-${nLevels}, got ${level}`);
const steps = [...(layout.build || []), ...opt.build];
if (!opt.map && !steps.length && !opt.file && !opt.level) { console.log(HELP); process.exit(0); }

// ---------- sandbox with the real game code ----------
const noop = () => {};
let seed = opt.seed >>> 0 || 1;
const ctx = vm.createContext({
  console, performance, URLSearchParams,
  location: { search: '?level=' + level }, localStorage: { getItem: () => null, setItem: noop },
  document: { getElementById: () => null },
  // rendering, sound and UI hooks called by the game logic
  sc: { add: noop, remove: noop }, snd: noop, burst: noop, fx: noop, popText: noop, bolt: noop, tfx: noop, killFx: noop, healFx: noop, sapFx: noop, trollFx: noop, phzFx: noop, foeSeen: noop, kingFx: noop, raiseFx: noop,
  hf: (o, h, d, kind) => { o.lk = kind; }, mkBullet: () => ({ visible: true }),
  buildEnemy: () => ({ m: { scale: { setScalar: noop } }, rig: {} }),
  ui: noop, selRng: noop, endReset: noop, lvWon: noop, startEnd: noop,
});
vm.runInContext(`Math.random=(()=>{let s=${seed};return()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};})();`, ctx);

// pull single top-level functions/consts out of files that also build scenery at load
function extractFn(code, name, file) {
  const i = code.search(new RegExp(`(^|\\n)function ${name}\\(`));
  if (i < 0) die(`function ${name} not found in ${file} – update scripts/sim.mjs`);
  let j = code.indexOf('{', i), depth = 0, q = null;
  for (; j < code.length; j++) {
    const c = code[j];
    if (q) { if (c == '\\') j++; else if (c == q) q = null; continue; }
    if (c == "'" || c == '"' || c == '`') q = c;
    else if (c == '{') depth++;
    else if (c == '}' && --depth == 0) break;
  }
  return code.slice(i, j + 1).trim();
}
function extractLine(code, re, what, file) {
  const m = code.match(re);
  if (!m) die(`${what} not found in ${file} – update scripts/sim.mjs`);
  return m[0];
}
const enemies = src('js/07-enemies.js'), input = src('js/12-input.js');
vm.runInContext(src('js/01-config.js'), ctx, { filename: 'js/01-config.js' });
vm.runInContext(src('js/09-game.js'), ctx, { filename: 'js/09-game.js' });
vm.runInContext(['volley', 'zap', 'buffs'].map(n => extractFn(enemies, n, 'js/07-enemies.js')).join('\n'), ctx, { filename: 'js/07-enemies.js (excerpt)' });
vm.runInContext(extractLine(input, /^const free=.*$/m, 'const free', 'js/12-input.js'), ctx, { filename: 'js/12-input.js (excerpt)' });
const run = code => vm.runInContext(code, ctx);
const LV = run('LV'), T = run('T'), W = run('W'), H = run('H'), MAXW = run('MAXW');

// ---------- --map ----------
function boardMap(towers = []) {
  const road = run('road'), blk = run('blk'), ch = { arrow: 'A', cannon: 'C', frost: 'W', ballista: 'B', storm: 'S', alch: 'P', banner: 'F', vault: 'V' };
  const rows = ['    ' + [...Array(W)].map((_, c) => String(c).padStart(3)).join('')];
  for (let r = 0; r < H; r++) rows.push(String(r).padStart(3) + ' ' + [...Array(W)].map((_, c) => {
    const t = towers.find(t => t.c == c && t.r == r), k = c + ',' + r;
    return (t ? ch[t.k] + (t.l > 1 ? t.l : '') : road.has(k) ? '#' : blk.has(k) ? 'x' : '.').padStart(3);
  }).join(''));
  return rows.join('\n');
}
if (opt.map) {
  console.log(`Level ${level}: ${LV.n} – ${W}×${H} cells, ${LV.gold} starting gold, enemy health ×${LV.hp}, ${LV.p.length} road(s)`);
  console.log(boardMap());
  console.log(`\n# road   x blocked   . buildable   (cells are "column,row", e.g. "arrow 3,2")`);
  process.exit(0);
}

// ---------- build steps ----------
const parsed = steps.map((s, n) => {
  const m = String(s).trim().match(/^(\w+)\s+(\d+)(?:\s*,\s*(\d+))?(?:\s+(\w+))?$/);
  if (!m) die(`build step ${n + 1} "${s}" – expected e.g. "arrow 3,2", "up 3,2", "sell 3,2", "target 3,2 strong" or "wave 5"`);
  const [, k, a, b, tm] = m;
  if (k == 'wave') return { k, wave: +a, s };
  if (b === undefined) die(`build step "${s}" needs a cell like 3,2`);
  if (k == 'target') { const M = run('TGK'); if (!M.includes(tm)) die(`build step "${s}": targeting must be one of ${M.join(', ')}`); return { k, c: +a, r: +b, tm, s }; }
  if (tm !== undefined) die(`build step "${s}": unexpected "${tm}"`);
  if (k != 'up' && k != 'sell' && !T[k]) die(`build step "${s}": unknown tower "${k}" (${Object.keys(T).join(', ')})`);
  return { k, c: +a, r: +b, s };
});

// ---------- the run ----------
run('reset()');
const g = () => run('g');
const LIFE0 = 20, PAD = opt.keep ? 1e6 : 0;   // --keep-going: give the castle a huge buffer and subtract it again when reporting
g().lives += PAD;
const lives = () => g().lives - PAD;
let pc = 0, spent = 0, earnedBase = 0;
const log = [], warn = [];
// do the next build steps that can be done now; inBreak = between waves, before wave g.wave+1
function doSteps(inBreak) {
  while (pc < parsed.length) {
    const st = parsed[pc], G = g();
    if (st.k == 'wave') { if (inBreak && G.wave + 1 >= st.wave) { pc++; continue; } return; }
    const t = G.tw.find(t => t.c == st.c && t.r == st.r);
    if (st.k == 'up') {
      if (!t) { warn.push(`"${st.s}": no tower there – skipped`); pc++; continue; }
      if (t.l >= 3) { warn.push(`"${st.s}": already level 3 – skipped`); pc++; continue; }
      const c = run('upCost')(t); if (G.gold < c) return;
      G.gold -= c; t.inv += c; t.l++; spent += c; log.push({ wave: G.wave, t: G.wt, s: st.s, cost: c }); pc++; continue;
    }
    if (st.k == 'target') {
      if (!t) { warn.push(`"${st.s}": no tower there – skipped`); pc++; continue; }
      t.tm = st.tm; log.push({ wave: G.wave, t: G.wt, s: st.s, cost: 0 }); pc++; continue;
    }
    if (st.k == 'sell') {
      if (!t) { warn.push(`"${st.s}": no tower there – skipped`); pc++; continue; }
      // same as sellVal() in js/10-ui.js
      const v = !G.run && t.bw === G.wave ? t.inv : Math.round(t.inv * .6); G.gold += v; spent -= v; G.tw = G.tw.filter(x => x !== t); log.push({ wave: G.wave, t: G.wt, s: st.s, cost: -v }); pc++; continue;
    }
    if (!run('free')(st.c, st.r)) { warn.push(`"${st.s}": cell is not buildable (road, blocked, taken or off the board) – skipped`); pc++; continue; }
    const c = T[st.k].c; if (G.gold < c) return;
    G.gold -= c; spent += c;
    // same tower object as addTw() in js/12-input.js; head stands in for the 3D model (bullets start from its height)
    G.tw.push({ k: st.k, c: st.c, r: st.r, x: st.c * 60 + 30, y: st.r * 60 + 30, l: 1, cd: 0, inv: c, bw: G.run ? undefined : G.wave, head: { position: { y: 0 } } });
    log.push({ wave: G.wave, t: G.wt, s: st.s, cost: c }); pc++;
  }
}

const waves = [], gold = [];
let time = 0, failed = null;
const dt = opt.dt, update = run('update'), startWave = run(opt.early ? 'callEarly' : 'startWave');
for (let w = 1; w <= MAXW; w++) {
  // a row covers the break before wave w (building) and the wave itself: goldStart + income - spent = goldEnd
  const G0 = g(), row = { wave: w, goldStart: G0.gold, lifeStart: lives(), spentBefore: spent, towers: 0, mix: run('waveMix')(w).reduce((o, k) => (o[k] = (o[k] || 0) + 1, o), {}) };
  const earned0 = G0.gold + spent; // gold + everything spent so far only grows by income
  doSteps(true);
  startWave();
  let wt = 0;
  while (g().run && !g().over) {
    update(dt); time += dt; wt += dt;
    doSteps(false);
    if (Math.round(time / dt) % Math.round(5 / dt) == 0) gold.push({ t: +time.toFixed(1), wave: w, gold: g().gold });
    if (wt > 3600) die(`wave ${w} did not end after an hour of game time – something is stuck`);
  }
  const G = g();
  Object.assign(row, { goldEnd: G.gold, income: G.gold + spent - earned0, spent: spent - row.spentBefore, lifeEnd: Math.max(lives(), opt.keep ? -Infinity : 0), lost: row.lifeStart - lives(), seconds: +wt.toFixed(1), towers: G.tw.length });
  delete row.spentBefore;
  waves.push(row);
  if (lives() <= 0 && !failed) failed = w;
  if (G.over && !G.won) break;
}
const G = g();
const result = {
  level, levelName: LV.n, won: !failed, failedOnWave: failed, wavesPlayed: waves.length,
  livesLeft: Math.max(0, lives()), livesLost: LIFE0 - lives(), goldLeft: G.gold, goldSpent: spent,
  gameTimeSeconds: +time.toFixed(1), stepsDone: pc, stepsTotal: parsed.length,
  towers: G.tw.map(t => ({ k: t.k, c: t.c, r: t.r, l: t.l })), waves, gold, builds: log, warnings: warn,
};

if (opt.json) { console.log(JSON.stringify(result, null, 2)); process.exit(0); }

// ---------- report ----------
const pad = (v, n) => String(v).padStart(n);
const mixS = m => Object.entries(m).map(([k, n]) => n + ({ bat: 'v', sapper: 'p', troll: 'r', imp: 'i', ghost: 'h', king: 'k', ram: 'm', necro: 'x', skel: 'z' }[k] || k[0])).join(' '); // v bats, p sappers, r trolls, i imps, h ghosts, k Goblin King, m Siege Ram, x Necromancer, z skeletons (b, s, t, g are taken)
console.log(`Level ${level}: ${LV.n}   start gold ${LV.gold}, enemy health ×${LV.hp}${opt.keep ? '   (--keep-going: defeat ignored)' : ''}`);
console.log('\nwave  enemies         gold before  income  spent  gold after  lives  lost  towers   time');
for (const r of waves) console.log(`${pad(r.wave, 4)}  ${mixS(r.mix).padEnd(15)} ${pad(r.goldStart, 11)} ${pad('+' + r.income, 7)} ${pad(r.spent ? -r.spent : 0, 6)} ${pad(r.goldEnd, 10)} ${pad(r.lifeEnd, 6)} ${pad(r.lost || '', 5)} ${pad(r.towers, 7)} ${pad(r.seconds + 's', 6)}`);
console.log('\n' + boardMap(G.tw));
if (warn.length) console.log('\nWarnings:\n  ' + warn.join('\n  '));
if (pc < parsed.length) console.log(`\nNot reached: ${parsed.length - pc} build step(s) from "${parsed[pc].s}" on (never enough gold, or the run ended first).`);
console.log(`\n${failed ? `DEFEAT on wave ${failed}` : 'VICTORY'} – lives lost ${result.livesLost}${opt.keep ? '' : ` (${result.livesLeft} left)`}, gold spent ${spent}, gold left ${G.gold}, ${waves.length} waves in ${Math.round(time / 60)} min game time`);
