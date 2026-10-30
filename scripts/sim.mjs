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
  npm run sim -- --waves N          print level N's wave table (LV.wv): mix, health, gold and length of every wave

Options:
  --level N        level 1-8 (overrides the layout file)
  --build "..."    add one build step (repeatable, appended after the file's steps)
  --diff D         difficulty easy|normal|hard (default easy, the original game; DIFS in js/01-config.js)
  --endless        Endless mode: waves go on past 20 (made up by endWave()) until defeat (at most 100);
                   with --waves N it prints waves 1-40
  --perks "a:3,b:2" Royal Armoury perks by id and rank (PERKS in js/09-game.js, e.g. arch:3,gold:2; 'all' = every perk at max)
  --hp X           try another enemy health multiplier for the level (instead of its hp in LEVELS)
  --gold N         try another starting gold for the level
  --keep-going     don't stop at defeat: play all 20 waves and count every leak
  --early          call every wave early ("Call wave early" button) and collect the full early bonus;
                   without it each wave starts the moment the last one ends, with no bonus
  --no-hero        play without the hero (Sir Kirkevang); the spells still work
  --no-cast        never use the spells or Divine Smite (by default the sim casts them like a player would:
                   Rain of Arrows on the biggest crowd of 4+, Boiling Oil with 3+ enemies at the gate,
                   Reinforcements in front of the leading enemy on foot when 4+ are on the board,
                   Divine Smite with 6+ enemies or a boss near the hero)
  --json           print the full result as JSON instead of the table
  --dt S           simulation step in seconds (default 1/60)
  --seed N         seed for Math.random (only affects looks in the game, kept for reproducibility)

Build steps, done in order as soon as there is enough gold (a step waits until it can be paid for,
and the steps after it wait too):
  <tower> c,r      build a tower on cell c,r: arrow cannon frost ballista storm alch banner vault barracks
                   (a Barracks only next to the road; its rally point starts on the nearest road cell)
  up c,r [BRANCH]  upgrade the tower on c,r (max level 3). Archers, Catapult, Wizard and Storm Tower pick a branch at level 3, by the start
                   of its name: longbow crossbow / fire boulder / archmage time / tempest thunder (also on a level-3 tower without one).
                   Without a branch they get a plain level 3, as before branches – not possible in the game, kept for comparisons
  sell c,r         sell the tower on c,r (60% back; a full refund if it was built in this same break, like Undo in the game)
  target c,r MODE  set the targeting of the tower on c,r: first last strong fast close (free, done at once)
  repair           repair the gate: buy back a life (waits for the gold; skipped at full lives)
  hero c,r         send the hero to road cell c,r (free, done at once, also mid-wave)
  rally c,r C,R    move the rally point of the Barracks on c,r to road cell C,R (within its range; free, done at once)
  wave N           wait until the break before wave N`;

const args = process.argv.slice(2);
const opt = { build: [], dt: 1 / 60, seed: 1 };
for (let i = 0; i < args.length; i++) {
  const a = args[i], next = () => { if (i + 1 >= args.length) die(`${a} needs a value`); return args[++i]; };
  if (a == '--help' || a == '-h') { console.log(HELP); process.exit(0); }
  else if (a == '--level') opt.level = +next();
  else if (a == '--map') opt.map = +next();
  else if (a == '--waves') opt.waves = +next();
  else if (a == '--diff') opt.diff = next();
  else if (a == '--endless') opt.endless = true;
  else if (a == '--perks') opt.perks = next();
  else if (a == '--hp') opt.hp = +next();
  else if (a == '--gold') opt.gold = +next();
  else if (a == '--build') opt.build.push(next());
  else if (a == '--keep-going') opt.keep = true;
  else if (a == '--early') opt.early = true;
  else if (a == '--no-hero') opt.noHero = true;
  else if (a == '--no-cast') opt.noCast = true;
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
const level = opt.map || opt.waves || opt.level || layout.level || 1;
const nLevels = (src('js/01-config.js').match(/^const LEVELS=\[([\s\S]*?)\];/m)?.[1].match(/^\{n:/gm) || []).length;
if (!(Number.isInteger(level) && level >= 1 && level <= nLevels)) die(`level must be 1-${nLevels}, got ${level}`);
const steps = [...(layout.build || []), ...opt.build];
if (!opt.map && !opt.waves && !steps.length && !opt.file && !opt.level) { console.log(HELP); process.exit(0); }

// ---------- sandbox with the real game code ----------
// leaked enemies of the current wave by type: the game removes a leaked enemy's model (sc.remove) while it's still in g.en with leak set
let leaked = {};
function countLeak(m) { if (!m || !m.en) return; const e = vm.runInContext('g', ctx).en.find(o => o.m === m); if (e && e.leak) leaked[e.type] = (leaked[e.type] || 0) + 1; }
const noop = () => {};
let seed = opt.seed >>> 0 || 1;
const ctx = vm.createContext({
  console, performance, URLSearchParams,
  location: { search: '?level=' + level + '&diff=' + (opt.diff || 'easy') }, localStorage: { getItem: () => null, setItem: noop },
  document: { getElementById: () => null },
  // rendering, sound and UI hooks called by the game logic
  sc: { add: noop, remove: m => countLeak(m) }, snd: noop, burst: noop, fx: noop, popText: noop, bolt: noop, tfx: noop, killFx: noop, shake: noop, gateHit: noop, healFx: noop, sapFx: noop, trollFx: noop, zoneFx: noop, zoneEnd: noop, plagueFx: noop, solDie: noop, heroFx: noop, heroLvl: noop, heroHit: noop, spellFx: noop, squadEnd: noop, repFx: noop, phzFx: noop, foeSeen: noop, kingFx: noop, raiseFx: noop, burnFx: noop, burnEnd: noop, ruinFx: noop, graveFx: noop, eruptFx: noop, darkFx: noop, harvestFx: noop, landFx: noop, mirFx: noop, mirEnd: noop, coldFx: noop, rockFx: noop, rockEnd: noop, strikeFx: noop, riftFx: noop, riftTp: noop, rumFx: noop, plunderFx: noop,
  hf: (o, h, d, kind) => { o.lk = kind; }, mkBullet: () => ({ visible: true }),
  buildEnemy: () => ({ m: { en: 1, scale: { setScalar: noop } }, rig: {} }),
  ui: noop, infRec: noop, ach: noop, selRng: noop, endReset: noop, lvWon: noop, startEnd: noop,
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
if (opt.hp) run(`LV.hp=${opt.hp}`);
if (opt.endless) run('INF=true');
if (opt.perks) run(opt.perks == 'all' ? 'for(const p of PERKS)PK[p.id]=p.mx' : `Object.assign(PK,${JSON.stringify(Object.fromEntries(opt.perks.split(',').map(x => x.split(':')).map(([k, v]) => [k, +v])))})`);
if (opt.gold) run(`LV.gold=${opt.gold}`);
const LV = run('LV'), T = run('T'), BRN = run('BRN'), W = run('W'), H = run('H'), MAXW = run('MAXW');
// one letter per enemy type, as in the wave tables (WC in js/01-config.js)
const WL = Object.fromEntries(Object.entries(run('WC')).map(([l, k]) => [k, l]));
const mixS = m => Object.entries(m).map(([k, n]) => n + (WL[k] || '?')).join(' ');

// ---------- --map ----------
function boardMap(towers = []) {
  const road = run('road'), blk = run('blk'), ch = { arrow: 'A', cannon: 'C', frost: 'W', ballista: 'B', storm: 'S', alch: 'P', banner: 'F', vault: 'V', barracks: 'K' };
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

// ---------- --waves ----------
// units = the wave's health counted in goblins (sum of E[type].h; goblins summoned, raised or split off later aren't counted), hp = its real total health
if (opt.waves) {
  const E = run('E'), wq = run('waveQ'), wn = run('waveName');
  console.log(`Level ${level}: ${LV.n}   enemy health ×${LV.hp}\nLetters: ${Object.entries(run('WC')).map(([l, k]) => l + ' ' + k).join(', ')}\n`);
  console.log('wave  name                  enemies                         count  units      hp  gold  spawns');
  for (let w = 1; w <= (opt.endless ? 40 : MAXW); w++) {
    let q; try { q = wq(w); } catch (e) { die(e.message); }
    const m = {}; for (const o of q) m[o.type] = (m[o.type] || 0) + 1;
    const u = q.reduce((a, o) => a + E[o.type].h, 0), hp = run('wHP')(w) * LV.hp * run('DF.hp') * u, gd = q.reduce((a, o) => a + E[o.type].rw, 0);
    console.log(`${String(w).padStart(4)}  ${wn(w).slice(0, 20).padEnd(20)}  ${mixS(m).padEnd(31)} ${String(q.length).padStart(5)} ${u.toFixed(1).padStart(6)} ${String(Math.round(hp)).padStart(7)} ${String(gd).padStart(5)} ${((q.at(-1)?.t || 0).toFixed(1) + 's').padStart(7)}`);
  }
  process.exit(0);
}

// ---------- build steps ----------
const parsed = steps.map((s, n) => {
  const ry = String(s).trim().match(/^rally\s+(\d+)\s*,\s*(\d+)\s+(\d+)\s*,\s*(\d+)$/);
  if (ry) return { k: 'rally', c: +ry[1], r: +ry[2], rc: +ry[3], rr: +ry[4], s };
  if (String(s).trim() == 'repair') return { k: 'repair', s };
  const hy = String(s).trim().match(/^hero\s+(\d+)\s*,\s*(\d+)$/);
  if (hy) return { k: 'hero', c: +hy[1], r: +hy[2], s };
  const m = String(s).trim().match(/^(\w+)\s+(\d+)(?:\s*,\s*(\d+))?(?:\s+(\w+))?$/);
  if (!m) die(`build step ${n + 1} "${s}" – expected e.g. "arrow 3,2", "up 3,2", "sell 3,2", "target 3,2 strong" or "wave 5"`);
  const [, k, a, b, tm] = m;
  if (k == 'wave') return { k, wave: +a, s };
  if (b === undefined) die(`build step "${s}" needs a cell like 3,2`);
  if (k == 'target') { const M = run('TGK'); if (!M.includes(tm)) die(`build step "${s}": targeting must be one of ${M.join(', ')}`); return { k, c: +a, r: +b, tm, s }; }
  if (k == 'up') return { k, c: +a, r: +b, br: tm && tm.toLowerCase(), s };
  if (tm !== undefined) die(`build step "${s}": unexpected "${tm}"`);
  if (k != 'up' && k != 'sell' && !T[k]) die(`build step "${s}": unknown tower "${k}" (${Object.keys(T).join(', ')})`);
  return { k, c: +a, r: +b, s };
});

// ---------- the run ----------
run('reset()');
if (opt.noHero) run('g.hero=null');
const g = () => run('g');
const LIFE0 = run('maxL()'), PAD = opt.keep ? 1e6 : 0;   // --keep-going: give the castle a huge buffer and subtract it again when reporting
g().lives += PAD;
const lives = () => g().lives - PAD;
let pc = 0, spent = 0, earnedBase = 0;
const log = [], warn = [];
// do the next build steps that can be done now; inBreak = between waves, before wave g.wave+1
function doSteps(inBreak) {
  while (pc < parsed.length) {
    const st = parsed[pc], G = g();
    if (st.k == 'wave') { if (inBreak && G.wave + 1 >= st.wave) { pc++; continue; } return; }
    // towers are built and sold only between waves (as in the game); upgrades, targeting, rally and hero orders work mid-wave
    if (G.run && st.k != 'up' && st.k != 'target' && st.k != 'rally' && st.k != 'hero') return;
    if (st.k == 'repair') {
      // same as repair() in js/09-game.js; lives in the sim may be padded by --keep-going
      if (lives() >= run('maxL()')) { warn.push(`"${st.s}": already at full lives – skipped`); pc++; continue; }
      const c = run('repCost')(); if (G.gold < c) return;
      G.gold -= c; G.lives++; G.rep++; spent += c; log.push({ wave: G.wave, t: G.wt, s: st.s, cost: c }); pc++; continue;
    }
    if (st.k == 'hero') {
      // same rule as tap() in js/12-input.js: any road cell
      if (!run('onB')(st.c, st.r)) { warn.push(`"${st.s}": not a road cell on the board – skipped`); pc++; continue; }
      if (!G.hero || G.hero.hp <= 0) return;
      run('heroGo')(st.c * 60 + 30, st.r * 60 + 30); log.push({ wave: G.wave, t: G.wt, s: st.s, cost: 0 }); pc++; continue;
    }
    const t = G.tw.find(t => t.c == st.c && t.r == st.r);
    if (st.k == 'up') {
      if (!t) { warn.push(`"${st.s}": no tower there – skipped`); pc++; continue; }
      // the branch, by the start of its name without spaces (BRN in js/01-config.js); same rules as upTw() in js/10-ui.js
      let bi = null;
      if (st.br) {
        const B = BRN[t.k]; if (!B) die(`build step "${st.s}": ${T[t.k].n} has no upgrade branches`);
        bi = B.findIndex(b => b.n.toLowerCase().replace(/\s/g, '').startsWith(st.br));
        if (bi < 0) die(`build step "${st.s}": ${T[t.k].n} branches are ${B.map(b => b.n).join(', ')}`);
        if (t.l == 3 && t.br == null) { t.br = bi; log.push({ wave: G.wave, t: G.wt, s: st.s, cost: 0 }); pc++; continue; }
        if (t.l < 2) die(`build step "${st.s}": a branch is picked on the upgrade to level 3 (this tower is level ${t.l})`);
      }
      if (t.l >= 3) { warn.push(`"${st.s}": already level 3 – skipped`); pc++; continue; }
      const c = run('upCost')(t); if (G.gold < c) return;
      G.gold -= c; t.inv += c; t.l++; if (bi != null) t.br = bi; spent += c; log.push({ wave: G.wave, t: G.wt, s: st.s, cost: c }); pc++; continue;
    }
    if (st.k == 'target') {
      if (!t) { warn.push(`"${st.s}": no tower there – skipped`); pc++; continue; }
      t.tm = st.tm; log.push({ wave: G.wave, t: G.wt, s: st.s, cost: 0 }); pc++; continue;
    }
    if (st.k == 'rally') {
      // same rules as tap() in js/12-input.js
      const x = st.rc * 60 + 30, y = st.rr * 60 + 30;
      if (!t || !t.sol) { warn.push(`"${st.s}": no Barracks there – skipped`); pc++; continue; }
      if (!run('road').has(st.rc + ',' + st.rr) || Math.hypot(x - t.x, y - t.y) > run('stat')(t).r) { warn.push(`"${st.s}": not a road cell in its range – skipped`); pc++; continue; }
      run('setRally')(t, x, y); log.push({ wave: G.wave, t: G.wt, s: st.s, cost: 0 }); pc++; continue;
    }
    if (st.k == 'sell') {
      if (!t) { warn.push(`"${st.s}": no tower there – skipped`); pc++; continue; }
      run('barGone')(t);
      // same as sellVal() in js/10-ui.js
      const v = !G.run && t.bw === G.wave ? t.inv : Math.round(t.inv * .6); G.gold += v; spent -= v; G.tw = G.tw.filter(x => x !== t); log.push({ wave: G.wave, t: G.wt, s: st.s, cost: -v }); pc++; continue;
    }
    // Emberwood: a burning cell holds the queue until the fire is out (the main loop lets the break run on meanwhile, as a player would wait)
    if (run('burnAt')(st.c, st.r)) return 'fire';
    if (!run('free')(st.c, st.r)) { warn.push(`"${st.s}": cell is not buildable (road, blocked, taken or off the board) – skipped`); pc++; continue; }
    if (T[st.k].bar && !run('nearRoad')(st.c, st.r)) { warn.push(`"${st.s}": a Barracks must stand next to the road – skipped`); pc++; continue; }
    const c = T[st.k].c; if (G.gold < c) return;
    G.gold -= c; spent += c;
    // same tower object as addTw() in js/12-input.js; head stands in for the 3D model (bullets start from its height)
    const nt = { k: st.k, c: st.c, r: st.r, x: st.c * 60 + 30, y: st.r * 60 + 30, l: 1, cd: 0, inv: c, bw: G.run ? undefined : G.wave, head: { position: { y: 0 } } };
    if (T[st.k].bar) run('barInit')(nt);
    G.tw.push(nt);
    log.push({ wave: G.wave, t: G.wt, s: st.s, cost: c }); pc++;
  }
}

// the hero's abilities, cast the way a player would (see --no-cast)
const casts = [0, 0, 0, 0];
function heroAI() {
  const G = g(); if (!G.run) return;
  const HAB = run('HAB'), cast = (i, x, y) => { if (run('heroCast')(i, x, y)) casts[i]++; }, live = G.en.filter(e => e.hp > 0 && !e.out);
  if (G.scd[0] <= 0) { let best = null, bn = 3; for (const e of live) { const n = live.filter(o => Math.hypot(o.x - e.x, o.y - e.y) <= HAB[0].r).length; if (n > bn) { bn = n; best = e; } } if (best) cast(0, best.x, best.y); }
  if (G.scd[1] <= 0 && live.filter(e => !e.fy && run('gateTiles')().some(q => Math.hypot(e.x - q.x, e.y - q.y) <= HAB[1].r)).length >= 3) cast(1);
  const foot = live.filter(e => !e.fy && !e.bs && e.x >= 0 && e.x < W * 60 && e.y >= 0 && e.y < H * 60);
  if (G.scd[2] <= 0 && foot.length >= 4) { const lead = foot.reduce((a, e) => run('prog')(e) > run('prog')(a) ? e : a); const c = Math.floor(lead.x / 60), r = Math.floor(lead.y / 60); if (run('onB')(c, r)) cast(2, c * 60 + 30, r * 60 + 30); }
  const h = G.hero; if (h && h.hp > 0 && h.ult) { const n = live.filter(e => Math.hypot(e.x - h.x, e.y - h.y) <= HAB[3].r); if (n.length >= 6 || n.some(e => e.bs)) cast(3); }
}
const waves = [], gold = [];
let time = 0, failed = null;
const dt = opt.dt, update = run('update'), startWave = run(opt.early ? 'callEarly' : 'startWave');
for (let w = 1; w <= (opt.endless ? 100 : MAXW); w++) {
  // a row covers the break before wave w (building) and the wave itself: goldStart + income - spent = goldEnd
  leaked = {};
  const G0 = g(), row = { wave: w, goldStart: G0.gold, lifeStart: lives(), spentBefore: spent, towers: 0, mix: run('waveMix')(w).reduce((o, k) => (o[k] = (o[k] || 0) + 1, o), {}) };
  const earned0 = G0.gold + spent; // gold + everything spent so far only grows by income
  // a step waiting for a fire to burn out lets the break run on (up to its BRK s), then the wave starts anyway
  while (doSteps(true) == 'fire' && g().brk < run('BRK')) { update(dt); time += dt; }
  startWave();
  let wt = 0;
  while (g().run && !g().over) {
    update(dt); time += dt; wt += dt;
    if (!opt.noCast) heroAI();
    doSteps(false);
    if (Math.round(time / dt) % Math.round(5 / dt) == 0) gold.push({ t: +time.toFixed(1), wave: w, gold: g().gold });
    if (wt > 3600) die(`wave ${w} did not end after an hour of game time – something is stuck`);
  }
  const G = g();
  Object.assign(row, { goldEnd: G.gold, income: G.gold + spent - earned0, spent: spent - row.spentBefore, lifeEnd: Math.max(lives(), opt.keep ? -Infinity : 0), lost: row.lifeStart - lives(), seconds: +wt.toFixed(1), towers: G.tw.length, leaked });
  delete row.spentBefore;
  waves.push(row);
  if (lives() <= 0 && !failed) failed = w;
  if (G.over && !G.won) break;
}
const G = g();
const result = {
  level, levelName: LV.n, won: !failed, failedOnWave: failed, wavesPlayed: waves.length,
  livesLeft: Math.max(0, lives()), livesLost: LIFE0 - lives(), goldLeft: G.gold, goldSpent: spent,
  gameTimeSeconds: +time.toFixed(1), stepsDone: pc, stepsTotal: parsed.length, hero: g().hero ? { level: g().hero.lv, xp: g().hero.xp, casts } : null,
  towers: G.tw.map(t => ({ k: t.k, c: t.c, r: t.r, l: t.l, br: t.br != null ? run('BRN')[t.k][t.br].n : undefined })), waves, gold, builds: log, warnings: warn,
};

if (opt.json) { console.log(JSON.stringify(result, null, 2)); process.exit(0); }

// ---------- report ----------
const pad = (v, n) => String(v).padStart(n);
console.log(`Level ${level}: ${LV.n}   ${run('DF.n')}: start gold ${Math.round(LV.gold * run('DF.gold'))}, enemy health ×${+(LV.hp * run('DF.hp')).toFixed(3)}, ${LIFE0} lives${opt.keep ? '   (--keep-going: defeat ignored)' : ''}`);
console.log('\nwave  enemies         gold before  income  spent  gold after  lives  lost  towers   time  leaked');
for (const r of waves) console.log(`${pad(r.wave, 4)}  ${mixS(r.mix).padEnd(15)} ${pad(r.goldStart, 11)} ${pad('+' + r.income, 7)} ${pad(r.spent ? -r.spent : 0, 6)} ${pad(r.goldEnd, 10)} ${pad(r.lifeEnd, 6)} ${pad(r.lost || '', 5)} ${pad(r.towers, 7)} ${pad(r.seconds + 's', 6)}  ${mixS(r.leaked)}`);
console.log('\n' + boardMap(G.tw));
if (warn.length) console.log('\nWarnings:\n  ' + warn.join('\n  '));
if (pc < parsed.length) console.log(`\nNot reached: ${parsed.length - pc} build step(s) from "${parsed[pc].s}" on (never enough gold, or the run ended first).`);
console.log(`\n${failed ? `DEFEAT on wave ${failed}` : 'VICTORY'} – lives lost ${result.livesLost}${opt.keep ? '' : ` (${result.livesLeft} left)`}, gold spent ${spent}, gold left ${G.gold}, ${waves.length} waves in ${Math.round(time / 60)} min game time`);
if (g().hero) console.log(`Hero: level ${g().hero.lv} (${g().hero.xp} xp), abilities used: ${run('HAB').map((a, i) => a.n + ' ' + casts[i]).join(', ')}`);
