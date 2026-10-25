# ⚔️ Slotsforsvar

Et middelalderligt 3D tower defense spil til browseren. Alt grafik og lyd bliver tegnet og genereret i kode (three.js + WebAudio), så der ligger ingen billed- eller lydfiler i projektet.

## Sådan kører du det
1. Installér [Node.js](https://nodejs.org) (hvis du ikke har det).
2. Åbn en terminal i projektmappen:
   ```
   npm install
   npm run dev
   ```
3. Åbn http://localhost:5173 i en browser. (Du skal have internet, da three.js hentes fra et CDN.)

Du kan også åbne `archive/slotsforsvar-en-fil.html`: det er hele spillet i én fil, præcis som det var i chatten.

## Arbejd videre med Claude Code
Åbn mappen i Claude Code (`claude` i terminalen i mappen). Den læser `CLAUDE.md` automatisk og kender dermed opbygningen og de faldgruber, vi fandt undervejs.

Forslag til første ting at bede om:
- "Åbn spillet i browseren, spil et par bølger og fortæl mig om fejl i konsollen."
- "Lav en kvalitetsknap (lav/mellem/høj), så det kører bedre på min telefon."
- "Find på en ny rolle til Magikeren og byg den." (Feltet er låst nu.)
- "Tilføj en hovedmenu og en pause-knap."
- "Gem min rekord (højeste bølge) i browseren."

## Mappen
```
index.html        siden, indlæser filerne i rækkefølge
css/style.css     udseende (Warcraft-agtigt interface)
js/               spillets kode, delt op efter emne (se CLAUDE.md)
docs/             spildesign: regler, tal, ideer
archive/          den gamle enkelt-fil-version
scripts/check.mjs hurtig kontrol af koden uden browser
```

## Git
Projektet ligger allerede i et git-repository med en første commit. Lav en commit, før du beder om store ændringer, så du kan gå tilbage.
