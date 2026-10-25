# Spildesign – Slotsforsvar

Opdateret til version 0.1.0. Tallene står i `js/01-config.js` (tårne `T`, fjender `E`) og `js/09-game.js` (bølger, økonomi).

## Mål
Forsvar slottet gennem 20 bølger. Fjenderne kommer ind gennem hullet i muren til venstre og går langs vejen til slottet til højre. Hver fjende, der slipper igennem, koster liv (boss koster 5). Start: 20 liv, 120 guld.

## Økonomi
- Guld for hver dræbt fjende (`rw`), plus bølgebonus `20 + 2 × bølge` efter hver bølge.
- Opgradering koster `pris × 0,8 × niveau` (niveau 1→2, 2→3). Salg giver 60 % af det samlede beløb.
- Opgradering giver +60 % skade og +10 rækkevidde pr. niveau.

## Tårne (pris / rækkevidde / skade / ladetid)
| Tårn | Pris | Rækkevidde | Skade | Tid | Særligt |
|---|---|---|---|---|---|
| Bueskytter | 50 | 130 | 10 | 0,5 s | Skyder 1/2/3 mål ved niveau 1/2/3 (de forreste) |
| Katapult | 100 | 110 | 30 | 1,4 s | Områdeskade (radius 55). Rammer sinkes 20/40/60 % i 1 sek |
| Magiker | 75 | 100 | 3 | 0,9 s | **Slukket**, bliver lavet om |
| Ballista | 125 | 190 | 66 | 2,2 s | Skyder altid på fjenden med flest liv |
| Stormtårn | 150 | 105 | 16 | 1,0 s | Kædelyn rammer 5/6/7 mål, lammer 0,2 s, 8 % mindre skade pr. hop |
| Alkymist | 90 | 115 | 7,8/s | 1,1 s | Giftflaske, radius 45, 3 sek gift |
| Fanetårn | 120 | 120 | – | – | +20 % skade (+10 % pr. niveau) til tårne i rækkevidde |
| Skatkiste | 150 | – | – | – | 15 guld × niveau efter hver bølge |

## Fjender
| Type | Fart | Liv (× basis) | Guld |
|---|---|---|---|
| Goblin (norm) | 50 | 1,0 | 5 |
| Ulveryttere (fast) | 90 | 0,6 | 5 |
| Sort ridder (tank) | 35 | 2,6 | 10 |
| Drage (boss) | 30 | 12 | 50 |

Basisliv = `30 × 1,2^bølge`. Bølge n har `5 + 2n` fjender, 0,8 s mellem hver. Fra bølge 3 er hver 3. fjende en ulv, fra bølge 5 hver 5. en ridder, og hver 5. bølge slutter med en drage.

## Slutscener
- Sejr: kamera glider over slottet, fyrværkeri.
- Nederlag: slottet brænder, det store tårn styrter sammen, fjendehæren jubler.

## Styring
Mus/touch: klik på bane for at bygge, klik på tårn for at opgradere/sælge. Træk = drej kamera (360°), hjul/knib = zoom, højre museknap/to fingre = flyt. Tast 1–8 vælger tårn, mellemrum starter bølge, Q/E drejer. Minikort klik = hop. ♪ og 🔊 slår musik/lyd til og fra.

## Åbne spørgsmål
- Hvad skal Magikeren bruges til?
- Er 20 bølger passende, og hvordan skal sværhedsgraden stige?
- Skal der være flere baner og et hovedmenu?
