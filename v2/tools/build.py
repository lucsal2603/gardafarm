#!/usr/bin/env python3
"""Compone le pagine di v2/ da tools/pagine/*.html + parti comuni.

Ogni file in pagine/ inizia con tre righe:
    titolo: ...
    descrizione: ...
    voce: home|chi-siamo|verona|villafranca|esperienze
seguite da una riga vuota e dal contenuto di <main>.

Uso:  python3 v2/tools/build.py
"""
from pathlib import Path

QUI = Path(__file__).resolve().parent
RADICE = QUI.parent
VERSIONE = '2026102910'

VOCI = [
    ('home', 'index.html', 'Home', 'giardino-verde'),
    ('chi-siamo', 'chi-siamo.html', 'Chi siamo', 'pesco'),
    ('verona', 'verona.html', 'Verona', 'terrazza'),
    ('villafranca', 'villafranca.html', 'Villafranca', 'asinello'),
    ('esperienze', 'esperienze.html', 'Esperienze', 'apicoltore'),
]

TESTA = '''<!doctype html>
<html lang="it" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titolo}</title>
<meta name="description" content="{descrizione}">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#FBF5EA">
<meta property="og:title" content="{titolo}">
<meta property="og:description" content="{descrizione}">
<meta property="og:image" content="img/giardino-verde.webp">
<link rel="icon" href="img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..500;1,9..144,300..500&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.css">
<link rel="stylesheet" href="css/style.css?v={v}">
</head>
<body class="pagina-{voce}">
<a class="skip" href="#contenuto">Vai al contenuto</a>
'''

LOADER = '''<div class="loader" aria-hidden="true">
  <img class="loader__marchio" src="img/marchio.svg" alt="" width="130" height="130">
  <div class="loader__perc"><span>0</span>%</div>
  <div class="loader__frase">Enjoy nature · stare bene nella natura</div>
</div>
'''

def header(voce):
    return f'''<div class="sipario" aria-hidden="true"><img class="sipario__marchio" src="img/marchio.svg" alt="" width="90" height="90"></div>
<div class="cursore" aria-hidden="true"><span>Scopri</span></div>

<header class="header">
  <div class="header__sx">
    <a class="pill pill--tondo" href="tel:+393402212375" aria-label="Chiama Gardafarm">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"/></svg>
    </a>
    <a class="pill" href="#contatti">Contatti</a>
  </div>
  <a class="header__logo" href="index.html" aria-label="Gardafarm, torna alla home">
    <img src="img/logo-gardafarm.png" alt="Gardafarm, Enjoy nature" width="380" height="420">
  </a>
  <div class="header__dx">
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu">
      <span class="pill"><span class="menu-btn__apri">Menu</span><span class="menu-btn__chiudi">Chiudi</span></span>
      <span class="pill-dot" aria-hidden="true"></span>
    </button>
  </div>
</header>

<nav class="menu" id="menu" aria-label="Menu principale">
  <ul class="menu__lista">
{menu_voci(voce)}
    <li><a class="menu__link" href="#contatti"><span>Contatti</span></a></li>
  </ul>
  <div class="menu__visual" aria-hidden="true">
{menu_img()}
  </div>
  <div class="menu__piede">
    <a href="mailto:info@gardafarmverona.com">info@gardafarmverona.com</a>
    <a href="tel:+393402212375">+39 340 221 2375</a>
    <a href="tel:+393516124770">+39 351 612 4770</a>
    <a href="https://www.instagram.com/gardafarm.villafranca/" target="_blank" rel="noopener">Instagram</a>
    <a href="https://www.facebook.com/gardafarmverona/" target="_blank" rel="noopener">Facebook</a>
  </div>
</nav>
'''

def menu_voci(voce):
    righe = []
    for chiave, file, nome, _ in VOCI:
        cur = ' aria-current="page"' if chiave == voce else ''
        righe.append(f'    <li><a class="menu__link" href="{file}"{cur}><span>{nome}</span></a></li>')
    return '\n'.join(righe)

def menu_img():
    out = []
    for i, (_, _, _, img) in enumerate(VOCI):
        on = ' class="is-on"' if i == 0 else ''
        out.append(f'    <img{on} src="img/{img}.webp" alt="" loading="lazy">')
    out.append('    <img src="img/squadra-asinello.webp" alt="" loading="lazy">')
    return '\n'.join(out)

PIEDE = '''<footer class="footer" id="contatti">
  <a class="footer__grande" href="mailto:info@gardafarmverona.com?subject=Richiesta%20informazioni" aria-label="Scrivici: info@gardafarmverona.com">
    <span class="display">Gardafarm</span>
    <span class="italic">Enjoy nature</span>
  </a>
  <div class="footer__griglia">
    <div>
      <img class="footer__marchio" src="img/marchio.svg" alt="" width="72" height="72">
      <p>Agriturismo, sale eventi e fattoria didattica e sociale tra Verona e Villafranca.</p>
      <p>P.IVA 02150640239<br>CIN IT023091B5T99FYF8F<br>CIR 0239091-AGR-00024</p>
    </div>
    <div>
      <h4>Esplora</h4>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="chi-siamo.html">Chi siamo</a></li>
        <li><a href="verona.html">Verona</a></li>
        <li><a href="villafranca.html">Villafranca</a></li>
        <li><a href="esperienze.html">Esperienze</a></li>
      </ul>
    </div>
    <div>
      <h4>Agriturismo e sale eventi</h4>
      <p><a href="https://maps.google.com/?q=Via+Gardesane+91b+Verona" target="_blank" rel="noopener">Via Gardesane 91/B<br>Verona</a></p>
      <h4>Fattoria didattica e sociale</h4>
      <p><a href="https://maps.google.com/?q=Via+Paroline+7+Villafranca+di+Verona" target="_blank" rel="noopener">Via Paroline 7<br>Villafranca di Verona</a></p>
    </div>
    <div>
      <h4>Scrivici o chiamaci</h4>
      <p><a class="footer__email" href="mailto:info@gardafarmverona.com?subject=Richiesta%20informazioni">info@gardafarmverona.com</a></p>
      <p><a href="tel:+393402212375">+39 340 221 2375</a><br><a href="tel:+393516124770">+39 351 612 4770</a></p>
      <h4>Seguici</h4>
      <div class="footer__social">
        <a class="pill" href="https://www.instagram.com/gardafarm.villafranca/" target="_blank" rel="noopener">Instagram</a>
        <a class="pill" href="https://www.facebook.com/gardafarmverona/" target="_blank" rel="noopener">Facebook</a>
      </div>
    </div>
  </div>
  <div class="footer__fondo">
    <span>© 2026 Gardafarm, tutti i diritti riservati</span>
    <span><a href="https://www.gardafarmverona.com/general-4" target="_blank" rel="noopener">Privacy Policy</a> · <a href="https://www.gardafarmverona.com/copia-di-privacy-policy" target="_blank" rel="noopener">Dichiarazione cookie</a></span>
  </div>
</footer>
'''

CODA = '''<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/SplitText.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.min.js" defer></script>
<script src="js/main.js?v={v}" defer></script>
</body>
</html>
'''

def costruisci():
    for chiave, file, _, _ in VOCI:
        sorgente = (QUI / 'pagine' / f'{chiave}.html').read_text(encoding='utf-8')
        meta, corpo = sorgente.split('\n\n', 1)
        m = dict(r.split(': ', 1) for r in meta.strip().splitlines())
        out = TESTA.format(titolo=m['titolo'], descrizione=m['descrizione'], v=VERSIONE, voce=chiave)
        out += LOADER + header(chiave)
        out += '\n<main id="contenuto">\n' + corpo.strip() + '\n</main>\n\n'
        out += PIEDE + CODA.format(v=VERSIONE)
        (RADICE / file).write_text(out, encoding='utf-8')
        print('scritto', file)

if __name__ == '__main__':
    costruisci()
