# Gardafarm, bozza della home

Home page dimostrativa per Gardafarm: agriturismo e sale eventi a Verona, fattoria didattica e sociale a Villafranca di Verona.

Le cose da chiedere al cliente sono in [DA-VERIFICARE.md](DA-VERIFICARE.md); il sistema di design in [MASTER.md](MASTER.md).

## Avvio

```bash
python3 -m http.server 8112 --directory /Users/lucas/gardafarm
```

- `?qa` salta il velo d'ingresso (comodo per i collaudi).
- Con "riduci movimento" del sistema niente pin né scrub: la pagina si legge ferma.

## Struttura

- `index.html`: tutti i contenuti.
- `css/style.css`: token e stili.
- `js/disegni.js`: tutte le illustrazioni SVG (marchio, scritta, animali, frutti, albero, onde).
- `js/main.js`: la regia (GSAP 3.15 + ScrollTrigger, SplitText, DrawSVG, MotionPath; Lenis).
- `js/mappa.js`: mappa MapLibre + OpenFreeMap ridipinta nei colori del marchio, caricata solo vicino alla sezione.
- `js/percorso.js`: la strada fra le due sedi (OSRM), calcolata una volta.
- `img/`: foto dal sito attuale (date tagliate), loghi, favicon.

## Pubblicazione

GitHub Pages dal ramo `main`: push = deploy. A ogni modifica di CSS o JS aggiornare `?v=` nei due link di `index.html` (Pages tiene CSS e JS in cache 10 minuti).

Demo pubblicata: https://lucsal2603.github.io/gardafarm/ (noindex).
