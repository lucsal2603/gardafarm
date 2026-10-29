# Gardafarm v2: sito completo ispirato ad Agrumea Farm

Rifacimento da zero di [gardafarmverona.com](https://www.gardafarmverona.com) (Wix) in 5 pagine statiche, con lo stile di un sito premiato su Awwwards.

## Il riferimento

**Agrumea Farm**: [agrumeafarm.it](https://www.agrumeafarm.it/en), Honorable Mention + Developer Award su Awwwards (1 ottobre 2026, Studio K95). Azienda agricola siciliana: stesso mondo di Gardafarm (campagna, prodotti della terra, ospitalità). Scheda: https://www.awwwards.com/sites/agrumea-farm

Cosa abbiamo preso, adattandolo:

| Agrumea | Gardafarm v2 |
|---|---|
| Fondo crema, bordeaux + arancio | Fondo crema, **lago** `#0B4A6E` + **prato** `#4F8F35` + **sole** `#F2C230` (dal logo) |
| Ivy Mode + Ivy Style Sans (a pagamento) | **Fraunces** 300, opsz 144 (titoli maiuscoli e corsivi) + **Figtree** (testi), da Google Fonts |
| Loader con percentuale gigante | Uguale, col marchio rotondo |
| Hero: barattoli 3D in giostra su una forma bordeaux con testo circolare | Giostra di "bustine di semi" (foto + etichetta) su una forma blu, testo circolare giallo "Enjoy nature · stare bene nella natura" che ruota con lo scroll; sfocatura di profondità sui lati |
| Pillola MENU + bottone tondo | Uguale; menu a tutto schermo blu con anteprima foto |
| Cursore "Discover the product" | Cursore "Scopri…" sulle carte |
| Titoli enormi + immagine che si espande a schermo pieno | Uguale su ogni pagina interna |
| Testo centrato tra due rombi | Uguale |
| Frutti a faccette in parallasse | Frutti e animali disegnati in SVG a faccette (pesca, ciliegia, mela = i nomi delle sale di Verona; asinello, gallina, ape, lavanda…) |
| Esperienze: carte impilate su fondo arancio | Carte impilate (sticky) su fondo giallo |
| Footer bordeaux con "AGRUMEA Farm" gigante | Footer blu con "GARDAFARM *Enjoy nature*" gigante che sale lettera per lettera |

## Pagine

- `index.html`: hero a giostra, manifesto, immagine che si espande, le due sedi, frutti in parallasse, esperienze in riga orizzontale, galleria a nastro, contatto.
- `chi-siamo.html`: storia dal 1988, numeri, filosofia, "Visione" sul cielo, riconoscimenti.
- `verona.html`: agriturismo, "qui trovi", numeri, camere con scheda prezzi, sale (Pesca, Ciliegia, Mela, Giardino sensoriale), sostenibilità, dintorni.
- `villafranca.html`: fattoria didattica e sociale, IAA, scritta che scorre con gli animali, esperienze in fattoria, sale.
- `esperienze.html`: 6 esperienze in carte impilate + "su misura per te".

## Come si modifica

Le pagine `*.html` sono **generate**: non modificarle a mano.

1. Contenuti di ogni pagina: `tools/pagine/<voce>.html` (tre righe di intestazione + il contenuto di `<main>`).
2. Header, menu, loader e footer comuni: `tools/build.py`.
3. Rigenera: `python3 v2/tools/build.py` (alza `VERSIONE` in build.py quando cambi CSS o JS, per la cache).

Stile in `css/style.css`, regia in `js/main.js` (GSAP 3.15 + ScrollTrigger + SplitText, Lenis 1.3.26, da jsDelivr).

Anteprima locale:

```bash
python3 -m http.server 8123 --directory v2
```

Con "riduci movimento" attivo nel sistema la pagina resta ferma e leggibile (niente pin, niente scrub).

## Da verificare con il cliente

- **Logo**: ricavato dall'unico file del sito (JPG 300×300) scontornando il bianco; il marchio rotondo (`img/marchio.svg`) è ridisegnato in vettoriale. Serve il file originale.
- **Foto**: tutte dal sito attuale; tolte le date "Galaxy A32" stampate in basso; escluse quelle con i bambini coperti dalle faccine. Arena, terme, Lago di Garda e la mano nell'erba sono foto stock già presenti sul loro sito Wix.
- **Telefoni**: Verona +39 351 612 4770, Villafranca +39 340 221 2375 (dalla firma email del cliente); il sito li elenca insieme.
- **Prezzi camere** (da 59 € / 89 €, letto extra 15 €): presi dal sito, confermare.
- La brochure del Sentiero del campione non è stata trovata: il bottone apre una email di richiesta.
- `noindex` attivo: è una demo. Privacy e cookie puntano ancora alle pagine del vecchio sito.
- Lingue DE/EN del vecchio sito non ancora tradotte.
