# Slotsforsvar – projektnoter til Claude Code

Medieval 3D tower defense game for the browser (three.js r128). Built as a hobby project, the goal is fun.
**The user speaks Danish – reply in Danish.** All in-game text is Danish.

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
| `js/05-scenery.js` | terrain, walls, gate, **breach in the wall**, castle, vegetation (wind shader), butterflies, trees |
| `js/06-towers.js` | `buildTower()` models for all towers + the little men (`chibi`) |
| `js/07-enemies.js` | enemy rigs (`makeEnemy`), status effects (`fxStatus`: arrows stuck, ice, shock, poison bubbles, stars), animation (`animEnemy`, `animDying`) |
| `js/08-effects.js` | particles, floating damage text |
| `js/09-game.js` | game state `g`, waves, spawning, targeting, bullets, damage, win/lose checks (`update(dt)`) and visual sync (`sync(dt)`) |
| `js/10-ui.js` | HUD, tower tiles, info panel, minimap |
| `js/11-audio.js` | all audio generated with WebAudio (no files): music (calm/battle) and `SX` sound effects, `snd(name)` |
| `js/12-input.js` | pointer/touch/mouse camera (orbit 360°, zoom, pan), placing/selecting towers |
| `js/13-ending.js` | enemy army outside the wall, victory fireworks, defeat (castle burns, keep collapses) |
| `js/14-main.js` | render loop, start |

## Gotchas learned the hard way
- **Layers:** most scenery/effects are on three.js layer 1 (`L1()`), the camera must have `cam.layers.enableAll()` or the ground vanishes.
- **`bake(root)`** merges non-animated meshes per material. Anything animated must have `userData.keep = true` and be baked separately. Towers/enemies are baked after construction.
- **Enemy templates** are built once (`tpl[type]`) and cloned with `clone(true)`; animated joints are found by name (`rig[name]`, e.g. `H0/K0` hip/knee, `S/E` shoulder/elbow, `TO` torso, `HD` head, `W0/W1` wings).
- **Never swap enemy materials for hit feedback.** An earlier white-flash did that, also hit the blob shadow (square artefacts) and bloomed. Use `hf()` / `fxStatus()` instead.
- **Name clashes:** terrain noise is `nz`, audio noise is `nzs`. Top-level `const` names are global across files – check for duplicates (`npm run check` catches syntax, not all clashes).
- **Health bar sprites** must be centred at the same point (don't offset in world x), or they drift when the camera rotates.
- Audio only starts after the first user gesture (`auInit`).
- The game has never been verified by Claude in a browser during this chat; the user found bugs by playing. If you can run a browser (Claude in Chrome etc.), open the page, read console errors, and take screenshots **before** claiming something works.

## Current rules (details in docs/GAME_DESIGN.md)
8 tower types (Magiker is **disabled**, `T.frost.off = true`, redesign pending), 4 enemy types, 20 waves, boss every 5th wave.

## Ideas / roadmap
- Decide what the Magiker should do (tile is locked and greyed out).
- More levels/maps, difficulty modes, save/highscores, main menu, pause.
- Barracks tower (soldiers that block enemies), more enemy types (flying, healers, armoured).
- Vendor three.js locally; optionally migrate to ES modules + Vite once the split has settled.
- Performance options for phones (quality toggle: bloom, shadows, vegetation count).
- Real 3D models/audio files (glTF) instead of everything generated in code.
