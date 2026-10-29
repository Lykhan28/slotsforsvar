# ⚔️ Castle Defense (Slotsforsvar)

A medieval 3D tower defense game for the browser. All the graphics and sound are drawn and generated in code (three.js + WebAudio), so the project contains no image or audio files.

## How to run it
1. Install [Node.js](https://nodejs.org) if you don't have it yet.
2. Open a terminal in the project folder:
   ```
   npm install
   npm run dev
   ```
3. Open http://localhost:5173 in a browser. No internet connection needed: three.js is included in `vendor/`.

You can also open `archive/slotsforsvar-en-fil.html`: that's the whole game in a single file, exactly as it was in the original chat (still in Danish).

## Keep building with Claude Code
Open the folder in Claude Code (run `claude` in a terminal inside the folder). It reads `CLAUDE.md` automatically, so it knows how the project is laid out and the pitfalls we ran into along the way.

Some ideas for what to ask first:
- "Open the game in the browser, play a few waves and tell me about any console errors."
- "Add a quality setting (low/medium/high) so it runs better on my phone."
- "Come up with a new role for the Wizard and build it." (Its tile is locked for now.)
- "Add a main menu and a pause button."
- "Save my best score (highest wave) in the browser."

## Folder layout
```
index.html        the page; loads the scripts in order
css/style.css     styling (Warcraft-style interface)
js/               the game code, split up by topic (see CLAUDE.md)
vendor/three/     three.js r128 + the post-processing scripts it needs
docs/             game design: rules, numbers, ideas
archive/          the old single-file version
scripts/check.mjs quick code check without a browser
scripts/sim.mjs   balance simulator: npm run sim -- --help
```

## Git
The project is already a git repository with an initial commit. Commit before asking for big changes so you can always go back.
