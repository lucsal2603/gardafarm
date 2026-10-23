# Gardafarm: sistema di design

## Tesi visiva

Il logo diventa il mondo del sito: i suoi tre piani (prato, lago, sole) più l'inchiostro della scritta. Stile da manifesto illustrato: campiture piene, niente contorni, niente ombre finte. Ogni confine fra le sezioni è un orizzonte vivo, fatto di onde e colline sempre in moto. Le foto stanno dentro la "lente" rotonda del marchio, con l'anello giallo.

## Tesi di movimento

Tre strati sempre accesi, sempre in pausa fuori vista:

- **Ambiente**: loop lenti in sine.inOut, da 2 a 90 s. Onde, sole, nuvole, api, animali che respirano, foto che respirano, etichette come erba al vento.
- **Scroll**: scrub da 0.6 a 0.9, pin per le scene grandi. Dezoom del paesaggio nel marchio, manifesto a parole, galleria orizzontale, sfilata, volo della mappa, albero che cresce, scritta del piede.
- **Interazione**: pulsanti elastici (asse wdth di Archivo + overshoot), link "lago che sale", frutti che fanno la capriola, lente che segue il puntatore, ape compagna del cursore.

Vietati: riga sotto i link in hover, pallini luminosi, numerazioni ordinali, emoji, coordinate, barra di avanzamento, cursore punto+anello.

## Colori

| Token | Hex | Uso |
|---|---|---|
| `--cielo` | #E8F2EF | fondo chiaro |
| `--latte` | #FBFCF8 | carte e pannelli |
| `--germoglio` | #E3EFD6 | fondo di Villafranca |
| `--prato` | #6FA74E | verde del marchio |
| `--prato-scuro` | #4E9442 | prato in primo piano |
| `--bosco` | #2F6B3A | testo verde (5,4:1 su bianco) |
| `--lago` | #0A4A6C | blu del marchio, fondo di Verona |
| `--notte` | #062B40 | piede |
| `--sole` | #F2C72E | accento (5,9:1 su lago) |
| `--anello` | #EACF53 | anello delle lenti |
| `--inchiostro` | #0F2A4F | testo (5,1:1 su prato) |

## Caratteri

- **Young Serif**: titoli e numeri. Calda, da bustina di semi: richiama il vivaio del 1988.
- **Archivo** variabile (wdth 62-125, wght 300-800): testo, etichette e pulsanti elastici.
- La scritta GARDAFARM è disegnata a tratto (`js/disegni.js`) e si scrive con DrawSVG.

## Curve e tempi

- `--dolce` cubic-bezier(.23, 1, .32, 1): entrate.
- `--elastico` cubic-bezier(.34, 1.9, .45, 1): pulsanti e piccoli rimbalzi.
- `--onda` cubic-bezier(.45, 0, .55, 1): ambiente.
- Reveal 1-1.4 s expo.out; interazioni 0.16-0.6 s; stagger 0.04-0.12 s.

## Forme

- Lente rotonda (`.lente`), arco e foglia per le carte.
- Raggio dei pannelli `--raggio` clamp(22px, 2.6vw, 40px); pillole a 999px.
- Confini `onda` e `colline`: strisce SVG larghe il doppio che scorrono senza giunte.
