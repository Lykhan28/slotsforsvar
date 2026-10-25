# Castle Defense (Slotsforsvar) – project notes for Claude Code

Medieval 3D tower defense game for the browser (three.js r128). Built as a hobby project, the goal is fun.
**The user is Danish but prefers replies in English.** All in-game text is English – write it as natural, native English, never a literal translation from Danish. The on-screen title is "Castle Defense"; the repo/package name stays `slotsforsvar`.

## Workflow
The user works in one session per task. Commit when a task is done, and add anything a future session needs to know (new rules, gotchas) to this file or `docs/GAME_DESIGN.md` – a new session only knows what is written down here.

## Run
- `npm install` then `npm run dev` → http://localhost:5173 (static server, no bundler).
- `npm run check` → parses all js files in the order index.html loads them (no browser needed).
- three.js and its post-processing scripts load from CDNs (see index.html). Needs internet. Vendoring them into `vendor/` is on the roadmap.

## Architecture
Plain classic `<script>` files, **no modules**: they share one global scope, and **load order matters** (see index.html). All code was originally one 113 KB script; the split follows its section markers and is byte-identical to the original.

| File | Contents |
|---|---|
| `js/01-config.js` | constants, grid (12×8 cells, 60 units each), path waypoints `WP`, `road` set, tower table `T`, enemy table `E`, palette `P`, `wx/wz` coordinate helpers |
| `js/02-renderer.js` | renderer, camera, lights, sky/env map, bloom + grade post-processing (falls back if the CDN scripts are missing) |
| `js/03-textures.js` | procedural PBR textures (`genTex`: albedo + normal from noise), `TX.*` |
| `js/04-materials.js` | `part()` mesh helper, `mat()` picks texture by hex colour (STONE/WOOD/METAL/SKIN/… sets), `bake()` merges static meshes, glow sprites, blob shadows |
| `js/05-towers.js` | `buildTower()` models for all towers + the little men (`chibi`) – must load BEFORE scenery, which calls `chibi` at top level |
| `js/06-scenery.js` | terrain, walls, gate, **breach in the wall**, castle, vegetation (wind shader), butterflies, trees |
| `js/07-enemies.js` | enemy rigs (`makeEnemy`), status effects (`fxStatus`: arrows stuck, ice, shock, poison bubbles, stars), animation (`animEnemy`, `animDying`) |
| `js/08-effects.js` | particles, floating damage text |
| `js/09-game.js` | game state `g`, waves, spawning, targeting, bullets, damage, win/lose checks (`update(dt)`) and visual sync (`sync(dt)`) |
| `js/10-ui.js` | HUD, tower tiles, info panel, minimap |
| `js/11-audio.js` | all audio generated with WebAudio (no files): music (calm/battle) and `SX` sound effects, `snd(name)` |
| `js/12-input.js` | pointer/touch/mouse camera (orbit 360°, zoom, pan), placing/selecting towers |
| `js/13-ending.js` | enemy army outside the wall, victory fireworks, defeat (castle burns, keep collapses) |
| `js/14-main.js` | render loop, start |

## Gotchas learned the hard way
- **Function declarations are NOT hoisted across script files.** Top-level code in a file may only call functions defined in earlier files (or itself). This caused a black screen (`chibi is not defined`, then follow-up `rng` errors) when scenery loaded before towers. Functions called later at runtime (from `update`/`sync`/event handlers) are fine.
- **Layers:** most scenery/effects are on three.js layer 1 (`L1()`), the camera must have `cam.layers.enableAll()` or the ground vanishes.
- **`bake(root)`** merges non-animated meshes per material. Anything animated must have `userData.keep = true` and be baked separately. Towers/enemies are baked after construction.
- **Enemy templates** are built once (`tpl[type]`) and cloned with `clone(true)`; animated joints are found by name (`rig[name]`, e.g. `H0/K0` hip/knee, `S/E` shoulder/elbow, `TO` torso, `HD` head, `W0/W1` wings).
- **Never swap enemy materials for hit feedback.** An earlier white-flash did that, also hit the blob shadow (square artefacts) and bloomed. Use `hf()` / `fxStatus()` instead.
- **Name clashes:** terrain noise is `nz`, audio noise is `nzs`. Top-level `const` names are global across files – check for duplicates (`npm run check` catches syntax, not all clashes).
- **Health bar sprites** must be centred at the same point (don't offset in world x), or they drift when the camera rotates.
- Audio only starts after the first user gesture (`auInit`).
- **Layout fills the window:** body is `100dvh` with no page scroll; `#wrap` (the 3D view) is the flex item that takes whatever height the title/panel leave, and the canvas is absolutely positioned inside it. `resize()` in js/02-renderer.js reads `#wrap`'s size (window resize + ResizeObserver) and sets `cam.aspect`; when the view is narrower than 4:3 it widens `cam.fov` so the whole board stays visible. Don't hard-code a canvas aspect ratio, and keep new HUD elements from pushing the page taller than the window (small screens hide the hint line and title via media queries).
- **Verify in a browser before claiming something works.** Start the dev server via `.claude/launch.json` (config `dev`, port 5173; if the port is taken, the user's own `npm run dev` is probably running – just open http://localhost:5173), read console errors and take a screenshot. Everything is global, so you can inspect or drive the game from the page's JS console (`g`, `T`, `ui()`, `startWave()`), e.g. set `g.sel`/`g.over` to check panels and end screens without playing.

## Current rules (details in docs/GAME_DESIGN.md)
8 tower types (the Wizard has key `frost` for historical reasons; it now banishes enemies back along the road via `banish()` in js/09-game.js, enemy field `bn` = immunity timer), 4 enemy types, 20 waves, boss every 5th wave.

## Ideas / roadmap
- More levels/maps, difficulty modes, save/highscores, main menu, pause.
- Barracks tower (soldiers that block enemies), more enemy types (flying, healers, armoured).
- Vendor three.js locally; optionally migrate to ES modules + Vite once the split has settled.
- Performance options for phones (quality toggle: bloom, shadows, vegetation count).
- Real 3D models/audio files (glTF) instead of everything generated in code.
