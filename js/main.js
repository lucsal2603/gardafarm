/* Gardafarm: regia della home.
   GSAP 3.15 (ScrollTrigger, SplitText, DrawSVG, MotionPath) + Lenis.
   Tre strati sempre accesi: ambiente (loop), scroll (scrub/pin), interazione. */

import * as D from './disegni.js';
import { PERCORSO, PERCORSO_KM } from './percorso.js';

const { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, Lenis } = window;
gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin);

const QS = new URLSearchParams(location.search);
const QA = QS.has('qa');
const RIDOTTO = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const MOBILE = () => innerWidth <= 820;

let lenis = null;
const statoMappa = { p: 0, mappa: null, errore: null };
const ambiente = new Map(); /* sezione -> tween di ambiente da mettere in pausa fuori vista */

if (RIDOTTO) document.documentElement.classList.add('ridotto');

function inAmbiente(sezione, ...tween) {
  if (!sezione) return;
  if (!ambiente.has(sezione)) ambiente.set(sezione, []);
  ambiente.get(sezione).push(...tween);
}

/* ================= disegni nel DOM ================= */

function perni(radice) {
  /* data-perno e data-anca diventano svgOrigin per GSAP */
  $$('[data-perno]', radice).forEach((g) => { g._perno = g.dataset.perno.replace(',', ' '); });
  $$('[data-anca]', radice).forEach((g) => { g._perno = g.dataset.anca.replace(',', ' '); });
  $$('.frutto__foglia[data-perno]', radice).forEach((g) => { g.style.transformOrigin = g.dataset.perno.split(',').map((n) => n + 'px').join(' '); });
}

function disegna() {
  const fabbrica = {
    marchio: () => D.marchio(),
    scritta: () => D.scritta(),
    'scritta-piede': () => D.scritta({ colore: '#E8F2EF', spessore: 7 }),
    enjoy: () => D.enjoy(),
    ape: () => D.ape(),
    asinello: () => D.asinello(),
    capretta: () => D.capretta(),
    gallina: () => D.gallina(),
    coniglio: () => D.coniglio(),
    pesca: () => D.FRUTTI.pesca(),
    ciliegia: () => D.FRUTTI.ciliegia(),
    mela: () => D.FRUTTI.mela(),
    crescita: () => D.alberoCrescita()
  };
  $$('[data-disegno]').forEach((el) => {
    const f = fabbrica[el.dataset.disegno];
    if (f) el.innerHTML = f();
  });
  $$('[data-icona]').forEach((el) => { el.innerHTML = D.ICONE[el.dataset.icona] || ''; });
  $$('i[data-segno]').forEach((el) => { el.innerHTML = D.SEGNI[el.dataset.segno] || ''; el.setAttribute('aria-hidden', 'true'); });
  $$('[data-confine]').forEach((el) => {
    const tipo = el.dataset.confine;
    const html = tipo === 'onda' ? D.onda({ colore: el.dataset.colore }) : D.colline({ colore: el.dataset.colore });
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    const dentro = t.content.firstElementChild;
    el.classList.add(...dentro.classList);
    el.innerHTML = dentro.innerHTML;
  });
  $$('[data-anno]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  const km = $('[data-conta-km]');
  if (km) { km.textContent = Math.round(PERCORSO_KM); km.dataset.conta = Math.round(PERCORSO_KM); }
  perni(document);
}

/* ================= scroll morbido ================= */

function avviaLenis() {
  if (RIDOTTO) return;
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 0.95,
    touchMultiplier: 1.3
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

function vaiA(sel) {
  const el = typeof sel === 'string' ? $(sel) : sel;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.8, offset: 0 });
  else el.scrollIntoView({ behavior: RIDOTTO ? 'auto' : 'smooth' });
}

function ancore() {
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = $(id);
      if (!el) return;
      e.preventDefault();
      chiudiTendina();
      vaiA(el);
    });
  });
}

/* velocità di scroll smorzata, condivisa da nastri, animali e ape */
const scroll = { v: 0, liscia: 0 };
function velocita() {
  gsap.ticker.add(() => {
    const v = lenis ? lenis.velocity : 0;
    scroll.v = v;
    scroll.liscia += (v - scroll.liscia) * 0.08;
  });
}

/* ================= velo d'ingresso ================= */

function velo(poi) {
  const v = $('.velo');
  const scena = $('.hero__scena');
  if (!v) return poi();
  if (RIDOTTO || QA) { v.remove(); poi(true); return; }
  if (lenis) lenis.stop();

  const m = $('.velo__marchio .marchio');
  const lettere = $$('.velo__scritta .scritta__l');
  const enjoy = $('.velo__enjoy');
  const rect = m.getBoundingClientRect();
  const r0 = rect.width * (100 / 224);
  const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;

  gsap.set(scena, { clipPath: `circle(0px at ${cx}px ${cy}px)` });
  /* titolo, testata e invito restano nascosti finché il cerchio non si apre */
  gsap.set(['.hero__titolo', '.testata', '.hero__scorri'], { autoAlpha: 0 });
  gsap.set($('.marchio__anello', m), { drawSVG: '0%' });
  gsap.set($('.marchio__prato', m), { scaleY: 0, svgOrigin: '0 -100' });
  gsap.set($('.marchio__lago', m), { y: 120 });
  gsap.set($('.marchio__sole', m), { y: 26, rotation: -24, svgOrigin: '50 2', autoAlpha: 0 });
  gsap.set(lettere, { drawSVG: '0%' });
  gsap.set(enjoy, { autoAlpha: 0, y: 12 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to($('.marchio__anello', m), { drawSVG: '100%', duration: 1, ease: 'power2.inOut' }, 0.15)
    .to($('.marchio__prato', m), { scaleY: 1, duration: 0.8, ease: 'expo.out' }, 0.5)
    .to($('.marchio__lago', m), { y: 0, duration: 1, ease: 'expo.out' }, 0.62)
    .to($('.marchio__sole', m), { y: 0, rotation: 0, autoAlpha: 1, duration: 0.9, ease: 'back.out(2.2)' }, 0.95)
    .to(lettere, { drawSVG: '100%', duration: 0.42, stagger: 0.075, ease: 'power2.inOut' }, 0.9)
    .to(enjoy, { autoAlpha: 1, y: 0, duration: 0.6 }, 1.55)
    .addLabel('via', 2.35)
    .to([$('.velo__scritta'), enjoy], { autoAlpha: 0, y: -16, duration: 0.45, ease: 'power2.in', stagger: 0.05 }, 'via')
    .to(m, { scale: 1.08, duration: 0.5, ease: 'power2.inOut' }, 'via')
    .set(scena, { clipPath: `circle(${r0}px at ${cx}px ${cy}px)` }, 'via+=0.45')
    .to(v, { backgroundColor: 'rgba(232,242,239,0)', duration: 0.2 }, 'via+=0.45')
    .to(m, { autoAlpha: 0, scale: 1.4, duration: 0.6, ease: 'power2.in' }, 'via+=0.45')
    .to(scena, { clipPath: `circle(${Math.hypot(innerWidth, innerHeight)}px at ${cx}px ${cy}px)`, duration: 1.5, ease: 'expo.inOut' }, 'via+=0.45')
    .add(() => {
      v.remove();
      gsap.set(scena, { clipPath: 'circle(150% at 50% 50%)' });
      if (lenis) lenis.start();
    })
    .add(() => poi(false), 'via+=1.4');

  /* rete di sicurezza: scheda in background, rAF fermi */
  setTimeout(() => { if (document.body.contains(v)) tl.progress(1); }, 9000);
}

/* ================= hero: la foto che diventa il marchio ================= */

/* la foto della home (2048 x 1334): il fuoco sta fra la casa, la serra e il sole;
   nel cerchio finale entrano circa 1300 px della foto */
const FOTO = { w: 2048, h: 1334, fuoco: { x: 1010, y: 680 }, campo: 1300 };

function geometriaHero() {
  const vw = innerWidth, vh = innerHeight;
  const rapporto = FOTO.w / FOTO.h;
  const Wt = Math.max(vw, rapporto * vh), Ht = Wt / rapporto, k = Wt / FOTO.w;
  const left = (vw - Wt) / 2, top = vh - Ht;
  let r, cx, cy;
  if (MOBILE()) {
    r = Math.min(0.42 * vw, 0.22 * vh);
    cx = vw / 2;
    cy = vh - r - Math.max(54, 0.08 * vh);
  } else {
    r = Math.min(0.3 * vw, 0.4 * vh);
    const margine = Math.min(80, Math.max(20, vw * 0.05));
    cx = vw - margine - r - Math.min(40, vw * 0.02);
    cy = vh * 0.53;
  }
  const s = (2 * r) / (FOTO.campo * k);
  return { vw, vh, Wt, k, left, top, r, cx, cy, s, tx: cx - left - s * FOTO.fuoco.x * k, ty: cy - top - s * FOTO.fuoco.y * k };
}

function hero() {
  const sez = $('.hero');
  const palco = $('.hero__palco');
  const scena = $('.hero__scena');
  const tela = $('.hero__tela');
  const kb = $('.hero__kb');
  const ombra = $('.hero__ombra');
  const anello = $('.hero__anello');
  const giro = $('.hero__giro');
  const titolo = $('.hero__titolo');
  const intro = $('.hero__intro');
  const scorri = $('.hero__scorri');

  /* righe del titolo e dell'intro */
  const titoloRighe = $$('.riga', titolo);
  const sotto = $('.hero__sotto');
  const introSplit = SplitText.create($('.titolo-2', intro), { type: 'lines', mask: 'lines', linesClass: 'riga-maschera' });
  const introAltri = [$('p', intro), ...$$('.bottone', intro)];

  if (RIDOTTO) {
    gsap.set([intro], { autoAlpha: 1 });
    return;
  }

  /* la foto non sta mai ferma: respira piano (zoom lentissimo) e, sugli schermi
     stretti dove è più larga dello schermo, scorre di lato fra la casa e la serra */
  const pan = { a: 1 };
  const stato = { attivo: true };
  inAmbiente(sez, { pause: () => { stato.attivo = false; }, resume: () => { stato.attivo = true; } });
  gsap.ticker.add((t) => {
    if (!stato.attivo) return;
    const Wt = Math.max(innerWidth, (FOTO.w / FOTO.h) * innerHeight);
    const A = Math.max(0, (Wt - innerWidth) / 2) * 0.82;
    const respiro = 1.04 + Math.sin(t * 0.2) * 0.03 * (0.35 + 0.65 * pan.a);
    gsap.set(kb, { x: Math.sin(t * 0.16) * A * pan.a, scale: respiro });
  });

  const posiziona = () => {
    const g = geometriaHero();
    const lato = 2 * g.r + 16;
    gsap.set(anello, { width: lato, height: lato, x: g.cx - lato / 2, y: g.cy - lato / 2 });
    const lg = ((g.r + 24) / 0.88) * 2;
    gsap.set(giro, { width: lg, height: lg, x: g.cx - lg / 2, y: g.cy - lg / 2 });
    return g;
  };
  posiziona();
  ScrollTrigger.addEventListener('refreshInit', posiziona);

  gsap.set($('circle', anello), { drawSVG: '0%' });
  gsap.set(intro, { autoAlpha: 1 });
  gsap.set(introSplit.lines, { yPercent: 110 });
  gsap.set(introAltri, { autoAlpha: 0, y: 24 });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: sez,
      start: 'top top',
      end: () => '+=' + innerHeight * 1.9,
      pin: palco,
      scrub: 0.9,
      invalidateOnRefresh: true
    }
  });

  tl.to(pan, { a: 0, duration: 0.25 }, 0)
    .to(scorri, { autoAlpha: 0, y: 20, duration: 0.08 }, 0)
    .to(titoloRighe, { yPercent: -60, autoAlpha: 0, stagger: 0.04, duration: 0.18, ease: 'power2.in' }, 0.02)
    .to(sotto, { autoAlpha: 0, y: -20, duration: 0.14 }, 0.06)
    /* prima del dezoom la foto sale appena, come una camera che si alza */
    .to(kb, { yPercent: -3, duration: 0.2 }, 0)
    .to(kb, { yPercent: 0, duration: 0.3, ease: 'power2.inOut' }, 0.3)
    .to(ombra, { autoAlpha: 0, duration: 0.3 }, 0.15);

  tl.fromTo(scena,
    { clipPath: () => `circle(${Math.hypot(innerWidth, innerHeight)}px at ${geometriaHero().cx}px ${geometriaHero().cy}px)` },
    { clipPath: () => { const g = geometriaHero(); return `circle(${g.r}px at ${g.cx}px ${g.cy}px)`; }, duration: 0.5, ease: 'power2.inOut', immediateRender: false }, 0.18);
  tl.fromTo(tela, { x: 0, y: 0, scale: 1 },
    { x: () => geometriaHero().tx, y: () => geometriaHero().ty, scale: () => geometriaHero().s, duration: 0.5, ease: 'power2.inOut', immediateRender: false }, 0.18);

  tl.to($('circle', anello), { drawSVG: '100%', duration: 0.22, ease: 'power2.inOut' }, 0.6)
    .fromTo(anello, { visibility: 'visible', rotation: -90 }, { rotation: 0, duration: 0.22 }, 0.6)
    .fromTo(giro, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: 'back.out(1.6)' }, 0.68)
    .to(introSplit.lines, { yPercent: 0, stagger: 0.04, duration: 0.2, ease: 'power3.out' }, 0.7)
    .to(introAltri, { autoAlpha: 1, y: 0, stagger: 0.03, duration: 0.16, ease: 'power3.out' }, 0.78)
    .to({}, { duration: 0.12 });
}

/* ================= animali: rig ================= */

function svgOrigin(el) { return el && el._perno ? el._perno : '0 0'; }

/* vita a riposo: orecchie, occhi, coda, respiro */
function vitaAnimale(a) {
  const tw = [];
  const corpo = $('.animale__corpo', a);
  $$('.orecchio', a).forEach((o, i) => {
    tw.push(gsap.timeline({ repeat: -1, repeatDelay: 2.4 + i * 0.7 + Math.random() * 2 })
      .to(o, { rotation: -16, svgOrigin: svgOrigin(o), duration: 0.12, ease: 'power2.out' })
      .to(o, { rotation: 6, duration: 0.14, ease: 'power2.inOut' })
      .to(o, { rotation: 0, duration: 0.3, ease: 'elastic.out(1, .4)' }));
  });
  $$('.occhio', a).forEach((o) => {
    tw.push(gsap.timeline({ repeat: -1, repeatDelay: 3 + Math.random() * 2.5 })
      .to(o, { scaleY: 0.1, svgOrigin: svgOrigin(o), duration: 0.07 })
      .to(o, { scaleY: 1, duration: 0.1 }));
  });
  const coda = $('.coda', a);
  if (coda && coda._perno) tw.push(gsap.fromTo(coda, { rotation: -10, svgOrigin: coda._perno }, { rotation: 12, duration: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true }));
  if (corpo) tw.push(gsap.to(corpo, { scaleY: 1.015, svgOrigin: '100 140', duration: 1.6, ease: 'sine.inOut', repeat: -1, yoyo: true }));
  if (a.classList.contains('animale--gallina')) {
    const testa = $('.testa', a);
    tw.push(gsap.timeline({ repeat: -1, repeatDelay: 1.8 })
      .to(testa, { rotation: 48, x: 6, svgOrigin: svgOrigin(testa), duration: 0.16, ease: 'power2.in' })
      .to(testa, { rotation: 40, duration: 0.08, repeat: 3, yoyo: true })
      .to(testa, { rotation: 0, x: 0, duration: 0.3, ease: 'power2.out' }));
  }
  return tw;
}

/* camminata: zampe a coppie diagonali, testa che annuisce, corpo che sobbalza */
function camminata(a) {
  const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: 'sine.inOut' } });
  const zampa = (cls) => $(`.zampa--${cls}`, a);
  const corpo = $('.animale__corpo', a);
  const testa = $('.testa', a);
  const passo = 0.42;
  const muovi = (z, fase) => {
    if (!z) return;
    tl.fromTo(z, { rotation: 22 * fase, svgOrigin: svgOrigin(z) }, { rotation: -22 * fase, duration: passo, repeat: 1, yoyo: true }, 0);
  };
  if (a.classList.contains('animale--coniglio')) {
    tl.to(corpo, { y: -18, rotation: -6, svgOrigin: '60 110', duration: passo * 0.5, ease: 'power2.out' }, 0)
      .to(corpo, { y: 0, rotation: 0, duration: passo * 0.5, ease: 'power2.in' }, passo * 0.5)
      .fromTo(zampa('pv'), { rotation: 0, svgOrigin: svgOrigin(zampa('pv')) }, { rotation: 34, duration: passo * 0.5, yoyo: true, repeat: 1 }, 0)
      .to({}, { duration: passo });
    return tl;
  }
  if (a.classList.contains('animale--gallina')) {
    muovi(zampa('pv'), 1); muovi(zampa('av'), -1);
    if (testa) tl.fromTo(testa, { x: -5 }, { x: 5, duration: passo, repeat: 1, yoyo: true, ease: 'power3.inOut' }, 0);
    tl.fromTo(corpo, { y: 0 }, { y: -3, duration: passo / 2, repeat: 3, yoyo: true }, 0);
    return tl;
  }
  muovi(zampa('pv'), 1); muovi(zampa('ad'), 1);
  muovi(zampa('pd'), -1); muovi(zampa('av'), -1);
  tl.fromTo(corpo, { y: 0 }, { y: -3.5, duration: passo / 2, repeat: 3, yoyo: true }, 0);
  if (testa) tl.fromTo(testa, { rotation: -3, svgOrigin: svgOrigin(testa) }, { rotation: 4, duration: passo / 2, repeat: 3, yoyo: true }, 0);
  return tl;
}

/* ================= reveal generici ================= */

function reveal() {
  if (RIDOTTO) return;
  const esclusi = '.hero, .manifesto, .arrivare, .storia';
  $$('.titolo-2').filter((t) => !t.closest(esclusi)).forEach((t) => {
    SplitText.create(t, {
      type: 'lines', mask: 'lines', linesClass: 'riga-maschera', autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 112, duration: 1.15, stagger: 0.09, ease: 'expo.out',
        scrollTrigger: { trigger: t, start: 'top 88%', toggleActions: 'play none none reverse' }
      })
    });
  });

  const blocchi = $$('.capitolo__intro, .capitolo__tipo, .capitolo__sede, .striscia__apertura p, .camere__testo p, .sale__testa p, .iaa__testo p, .esperienze__testa p, .sale-vf__testo p, .contatti__sotto, .scheda-sede__testo, .porta__testo');
  blocchi.forEach((b) => {
    gsap.from(b, { autoAlpha: 0, y: 34, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: b, start: 'top 92%', toggleActions: 'play none none reverse' } });
  });

  /* lenti: entrano ruotando e poi la foto scorre dentro */
  $$('.lente').filter((l) => !l.closest('.striscia') && !l.classList.contains('voci__lente')).forEach((l) => {
    gsap.from(l, { scale: 0.72, rotation: -14, autoAlpha: 0, duration: 1.3, ease: 'elastic.out(1, .7)', scrollTrigger: { trigger: l, start: 'top 90%', toggleActions: 'play none none reverse' } });
    const img = $('img', l);
    if (img) gsap.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: l, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ambiente: ogni foto respira piano dentro la sua lente */
  $$('.lente img').forEach((img, i) => {
    inAmbiente(img.closest('section') || document.body, gsap.to(img, { scale: 1.09, duration: 7 + (i % 4) * 1.5, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: -(i % 5) }));
  });
  /* le etichette ondeggiano come erba al vento, un'onda che le attraversa */
  $$('.spighe, .iaa__per').forEach((s) => {
    inAmbiente(s.closest('section'), gsap.to($$('li', s), { y: -4, rotation: 0.8, duration: 1.6, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: { each: 0.14, repeat: -1, yoyo: true } }));
  });

  /* spighe: le etichette spuntano a raffica */
  $$('.spighe').forEach((s) => {
    gsap.from($$('li', s), { scale: 0.4, autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.05, ease: 'back.out(2.4)', scrollTrigger: { trigger: s, start: 'top 90%', toggleActions: 'play none none reverse' } });
  });

  /* contatori */
  $$('[data-conta]').forEach((el) => {
    const fine = parseFloat(el.dataset.conta);
    const o = { n: 0 };
    gsap.to(o, {
      n: fine, duration: fine > 200 ? 2.2 : 1.6, ease: 'power3.out',
      onUpdate: () => { el.textContent = Math.round(o.n).toLocaleString('it-IT'); },
      scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' }
    });
  });
}

/* ================= manifesto ================= */

function manifesto() {
  const sez = $('.manifesto');
  const palco = $('.manifesto__palco');
  const frase = $('.manifesto__frase');
  const firma = $('.manifesto__firma');
  inAmbiente(sez);
  if (RIDOTTO) return;
  SplitText.create(frase, { type: 'words', wordsClass: 'parola', ignore: '.manifesto__icona' });
  const pezzi = $$('.parola, .manifesto__icona', frase);
  gsap.set($$('.manifesto__icona', frase), { scale: 0.3, rotation: -40, transformOrigin: '50% 60%' });
  gsap.set(firma, { autoAlpha: 0, y: 16 });

  /* la scena resta ferma per tutta la sezione (alta 250svh): prima le parole,
     poi il foglio delle sedi sale e la copre */
  ScrollTrigger.create({ trigger: sez, start: 'top top', end: () => '+=' + sez.offsetHeight, pin: palco, pinSpacing: false, invalidateOnRefresh: true });
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: sez, start: 'top top', end: () => '+=' + innerHeight * 1.35, scrub: 0.6, invalidateOnRefresh: true }
  });
  pezzi.forEach((p, i) => {
    if (p.classList.contains('parola')) tl.to(p, { color: '#0F2A4F', duration: 0.5 }, i * 0.32);
    else tl.to(p, { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(3)' }, i * 0.32);
  });
  tl.to(firma, { autoAlpha: 1, y: 0, duration: 0.8 }, '>-0.2').to({}, { duration: 1.2 });

  /* il foglio blu sale e copre: il manifesto arretra */
  gsap.to(palco, {
    scale: 0.93, autoAlpha: 0.35, ease: 'none',
    scrollTrigger: { trigger: '.sedi', start: 'top bottom', end: 'top top', scrub: true }
  });
}

/* ================= le due sedi ================= */

function sedi() {
  const sez = $('.sedi');
  if (RIDOTTO) return;
  $$('.porta').forEach((p, i) => {
    gsap.from(p, {
      y: 120, rotation: i ? 3 : -3, autoAlpha: 0, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: '.sedi__porte', start: 'top 85%', toggleActions: 'play none none reverse' },
      delay: i * 0.12
    });
    const nome = $('.porta__nome', p);
    gsap.from(nome, { yPercent: 60, autoAlpha: 0, duration: 1.2, ease: 'expo.out', delay: 0.25 + i * 0.12, scrollTrigger: { trigger: '.sedi__porte', start: 'top 85%', toggleActions: 'play none none reverse' } });
    /* la freccia gialla respira */
    inAmbiente(sez, gsap.to($('.porta__vai', p), { y: -6, duration: 1.4 + i * 0.3, ease: 'sine.inOut', repeat: -1, yoyo: true }));
  });
}

/* ================= capitoli ================= */

function nomeCapitolo(cap) {
  const nome = $('.capitolo__nome', cap);
  const split = SplitText.create(nome, { type: 'words,chars', charsClass: 'lettera' });
  if (RIDOTTO) return;
  gsap.from(split.chars, {
    yPercent: 105, rotation: (i) => (i % 2 ? 8 : -8), autoAlpha: 0, ease: 'power3.out', stagger: 0.04,
    scrollTrigger: { trigger: nome, start: 'top 95%', end: 'top 45%', scrub: 0.8 }
  });
  /* poi galleggiano: sull'acqua a Verona, al vento a Villafranca */
  const acqua = cap.classList.contains('capitolo--verona');
  inAmbiente(cap, gsap.to(split.chars, {
    y: acqua ? -10 : -6, rotation: acqua ? 0 : 2.5,
    duration: acqua ? 2.4 : 1.9, ease: 'sine.inOut', repeat: -1, yoyo: true,
    stagger: { each: 0.18, repeat: -1, yoyo: true }
  }));
}

function striscia() {
  const box = $('.striscia');
  const binario = $('.striscia__binario');
  if (!box) return;
  const carte = $$('.carta', binario);
  if (RIDOTTO) return;
  const distanza = () => Math.max(0, binario.scrollWidth - innerWidth);
  const corsa = gsap.to(binario, {
    x: () => -distanza(), ease: 'none',
    scrollTrigger: { trigger: box, start: 'center center', end: () => '+=' + distanza(), pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 }
  });
  carte.forEach((c, i) => {
    const img = $('img', c);
    if (img) gsap.fromTo(img, { xPercent: -8, scale: 1.15 }, { xPercent: 8, scale: 1.15, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: corsa, start: 'left right', end: 'right left', scrub: true } });
    gsap.from(c, { rotation: i % 2 ? 6 : -6, y: 60, scale: 0.9, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: corsa, start: 'left right', end: 'left 60%', scrub: true } });
  });
  /* le carte si inclinano con la velocità */
  const inclina = gsap.quickTo(carte, 'skewX', { duration: 0.5, ease: 'power3' });
  gsap.ticker.add(() => { if (corsa.scrollTrigger && corsa.scrollTrigger.isActive) inclina(gsap.utils.clamp(-7, 7, -scroll.liscia * 0.25)); });
}

function camere() {
  if (RIDOTTO) return;
  const pannello = $('.camere');
  gsap.from(pannello, { y: 120, scale: 0.94, borderRadius: 120, ease: 'none', scrollTrigger: { trigger: pannello, start: 'top bottom', end: 'top 55%', scrub: 0.8 } });
  $$('.prezzo', pannello).forEach((p, i) => {
    gsap.from(p, { x: 80, rotation: 4, autoAlpha: 0, duration: 1.1, ease: 'expo.out', delay: i * 0.12, scrollTrigger: { trigger: p, start: 'top 90%', toggleActions: 'play none none reverse' } });
  });
}

function sale() {
  const cap = $('.capitolo--verona');
  $$('.sala').forEach((s, i) => {
    const frutto = $('.frutto', s);
    if (!frutto) return;
    /* ambiente: ogni frutto dondola appeso al suo picciolo */
    inAmbiente(cap, gsap.to(frutto, { y: -10, rotation: i % 2 ? 4 : -4, duration: 2 + i * 0.35, ease: 'sine.inOut', repeat: -1, yoyo: true }));
    const foglia = $('.frutto__foglia', frutto);
    if (foglia) inAmbiente(cap, gsap.to(foglia, { rotation: 10, svgOrigin: foglia._perno, duration: 1.4 + i * 0.2, ease: 'sine.inOut', repeat: -1, yoyo: true }));
    $$('.frutto__chicco', frutto).forEach((c, j) => {
      inAmbiente(cap, gsap.fromTo(c, { rotation: -6, svgOrigin: c._perno }, { rotation: 6, duration: 1.3 + j * 0.25, ease: 'sine.inOut', repeat: -1, yoyo: true }));
    });
    if (!RIDOTTO) {
      gsap.from(s, { y: 100, autoAlpha: 0, duration: 1.2, ease: 'expo.out', delay: i * 0.12, scrollTrigger: { trigger: '.sale__frutti', start: 'top 85%', toggleActions: 'play none none reverse' } });
      gsap.from($('.sala__frutto', s), { y: -160, rotation: (i - 1) * 40, duration: 1.4, ease: 'bounce.out', delay: 0.15 + i * 0.15, scrollTrigger: { trigger: '.sale__frutti', start: 'top 85%', toggleActions: 'play none none reverse' } });
    }
    /* al tocco il frutto fa una capriola */
    const box = $('.sala__frutto', s);
    const salta = () => {
      if (box._salto && box._salto.isActive()) return;
      box._salto = gsap.timeline()
        .to(box, { y: -46, scaleX: 0.9, scaleY: 1.1, duration: 0.3, ease: 'power2.out' })
        .to(box, { rotation: '+=360', duration: 0.6, ease: 'power2.inOut' }, 0)
        .to(box, { y: 0, scaleX: 1.12, scaleY: 0.88, duration: 0.26, ease: 'power2.in' }, 0.32)
        .to(box, { scaleX: 1, scaleY: 1, duration: 0.6, ease: 'elastic.out(1, .35)' });
    };
    s.addEventListener('pointerenter', salta);
    s.addEventListener('click', salta);
  });
}

function sostenibile() {
  if (RIDOTTO) return;
  const b = $('.sostenibile');
  gsap.from(b, { clipPath: 'inset(0 100% 0 0 round 40px)', ease: 'none', scrollTrigger: { trigger: b, start: 'top 90%', end: 'top 50%', scrub: 0.8 } });
}

/* nastri di parole: scorrono sempre, la velocità di scroll li spinge e li inclina */
function nastri() {
  $$('.nastro').forEach((n) => {
    const binario = $('.nastro__binario', n);
    const base = binario.innerHTML;
    while (binario.scrollWidth < innerWidth * 2.4) binario.innerHTML += base;
    binario.innerHTML += binario.innerHTML;
    const dir = parseFloat(n.dataset.velocita || 1);
    let x = 0;
    const sez = n.closest('section');
    const stato = { attivo: true };
    inAmbiente(sez, { pause: () => { stato.attivo = false; }, resume: () => { stato.attivo = true; } });
    const inclina = gsap.quickTo(binario, 'skewX', { duration: 0.6, ease: 'power3' });
    gsap.ticker.add((t, dt) => {
      if (!stato.attivo) return;
      const meta = binario.scrollWidth / 2;
      const spinta = RIDOTTO ? 0 : scroll.liscia * 0.6;
      x -= (dt / 16.67) * (0.6 + Math.abs(spinta)) * dir * (spinta < 0 ? -1 : 1);
      if (x <= -meta) x += meta;
      if (x > 0) x -= meta;
      gsap.set(binario, { x });
      if (!RIDOTTO) inclina(gsap.utils.clamp(-10, 10, -scroll.liscia * 0.35));
    });
  });
}

function schede() {
  $$('.scheda-sede').forEach((s) => {
    const m = $('.marchio', s);
    const cap = s.closest('section');
    if (m) inAmbiente(cap, gsap.to($('.marchio__sole', m), { y: -4, rotation: -4, svgOrigin: '50 2', duration: 1.8, ease: 'sine.inOut', repeat: -1, yoyo: true }));
    if (RIDOTTO) return;
    gsap.from(s, { y: 90, scale: 0.95, autoAlpha: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 88%', toggleActions: 'play none none reverse' } });
    if (m) gsap.from(m, { rotation: -200, scale: 0.4, duration: 1.6, ease: 'elastic.out(1, .6)', scrollTrigger: { trigger: s, start: 'top 85%', toggleActions: 'play none none reverse' } });
  });
}

function contatori() {
  if (RIDOTTO) return;
  $$('.contatori').forEach((c) => {
    gsap.from($$('li', c), { y: 50, autoAlpha: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 88%', toggleActions: 'play none none reverse' } });
  });
}

/* ================= villafranca ================= */

function pilastri() {
  const cap = $('.capitolo--villafranca');
  $$('.pilastro').forEach((p, i) => {
    const icona = $('svg', $('.pilastro__icona', p));
    if (icona) inAmbiente(cap, gsap.to(icona, { y: -6, rotation: i % 2 ? 5 : -5, duration: 1.7 + i * 0.2, ease: 'sine.inOut', repeat: -1, yoyo: true }));
    if (RIDOTTO) return;
    gsap.from(p, { y: 90, rotation: i % 2 ? 3 : -3, autoAlpha: 0, duration: 1.2, ease: 'expo.out', delay: (i % 4) * 0.1, scrollTrigger: { trigger: '.pilastri', start: 'top 85%', toggleActions: 'play none none reverse' } });
  });
}

function sfilata() {
  const box = $('.sfilata');
  const palco = $('.sfilata__palco');
  const fila = $('.sfilata__fila');
  const animali = $$('.sfilata__animale', fila);
  const nomi = $$('.sfilata__nomi span');
  const cap = box.closest('section');
  if (!box) return;

  const rig = animali.map((el) => {
    const a = $('.animale', el);
    const r = { el, a, cammina: a ? camminata(a) : null };
    if (a) inAmbiente(cap, ...vitaAnimale(a));
    if (r.cammina) { r.cammina.play(); r.cammina.timeScale(0.0001); inAmbiente(cap, r.cammina); }
    return r;
  });

  /* l'ape vola su e giù sopra la fila */
  const ape = animali.find((el) => el.classList.contains('sfilata__animale--ape'));
  if (ape) inAmbiente(cap, gsap.to($('svg', ape), { y: -26, rotation: 8, duration: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true }));

  /* distanze: ogni animale ha il suo posto nella fila */
  const posti = () => {
    let x = 0;
    return animali.map((el) => { const w = el.getBoundingClientRect().width; const p = x; x += w + Math.max(40, innerWidth * 0.06); return p; });
  };
  let P = posti();
  const larghezzaFila = () => { const p = posti(); P = p; const ult = animali[animali.length - 1]; return p[p.length - 1] + ult.getBoundingClientRect().width; };

  animali.forEach((el, i) => gsap.set(el, { x: P[i] }));

  if (RIDOTTO) {
    gsap.set(fila, { x: () => (innerWidth - larghezzaFila()) / 2 });
    return;
  }

  const st = gsap.fromTo(fila, { x: () => -larghezzaFila() - 40 }, {
    x: () => innerWidth + 40, ease: 'none',
    scrollTrigger: {
      trigger: box, start: 'top top', end: () => '+=' + innerHeight * 2.4, pin: palco, scrub: 0.6, invalidateOnRefresh: true,
      onRefresh: () => { P = posti(); animali.forEach((el, i) => gsap.set(el, { x: P[i] })); },
      onUpdate: (self) => {
        /* nome acceso: l'animale più vicino al centro dello schermo */
        const fx = gsap.getProperty(fila, 'x');
        let migliore = 0, dist = Infinity;
        animali.forEach((el, i) => {
          const c = fx + P[i] + el.getBoundingClientRect().width / 2;
          const d = Math.abs(c - innerWidth / 2);
          if (d < dist) { dist = d; migliore = i; }
        });
        nomi.forEach((n, i) => n.classList.toggle('is-qui', i === migliore && self.progress > 0.05 && self.progress < 0.97));
      }
    }
  });

  /* il passo segue la velocità dello scroll */
  gsap.ticker.add(() => {
    const v = Math.min(2.6, Math.abs(scroll.liscia) / 9);
    rig.forEach((r) => { if (r.cammina) r.cammina.timeScale(Math.max(0.0001, v)); });
  });
  return st;
}

function esperienze() {
  const voci = $$('.voce');
  voci.forEach((v) => {
    const b = $('.voce__testa', v);
    b.addEventListener('click', () => {
      const aperta = v.classList.toggle('is-aperta');
      b.setAttribute('aria-expanded', aperta);
      setTimeout(() => ScrollTrigger.refresh(), 650);
    });
  });
  if (!RIDOTTO) {
    gsap.from(voci, { x: -60, autoAlpha: 0, duration: 1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '.voci', start: 'top 85%', toggleActions: 'play none none reverse' } });
  }
  /* lente che segue il puntatore con la foto dell'esperienza */
  const lente = $('.voci__lente');
  if (!lente || !FINE || RIDOTTO) return;
  const img = $('img', lente);
  const xTo = gsap.quickTo(lente, 'x', { duration: 0.6, ease: 'power3' });
  const yTo = gsap.quickTo(lente, 'y', { duration: 0.6, ease: 'power3' });
  const rTo = gsap.quickTo(lente, 'rotation', { duration: 0.8, ease: 'power3' });
  let ultimoX = 0;
  const lista = $('.voci');
  lista.addEventListener('pointermove', (e) => {
    const w = lente.offsetWidth;
    xTo(e.clientX + 28); yTo(e.clientY - w / 2);
    rTo(gsap.utils.clamp(-14, 14, (e.clientX - ultimoX) * 0.8));
    ultimoX = e.clientX;
  });
  voci.forEach((v) => {
    $('.voce__testa', v).addEventListener('pointerenter', () => {
      const src = v.dataset.foto;
      if (img.getAttribute('src') !== src) {
        gsap.fromTo(img, { scale: 1.3, autoAlpha: 0.4 }, { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'expo.out' });
        img.setAttribute('src', src);
      }
      gsap.to(lente, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' });
    });
  });
  lista.addEventListener('pointerleave', () => gsap.to(lente, { autoAlpha: 0, scale: 0.6, duration: 0.35, ease: 'power2.in' }));
  gsap.set(lente, { scale: 0.6 });
}

function iaa() {
  if (RIDOTTO) return;
  gsap.from($$('.iaa__per li'), { x: 70, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.iaa__per', start: 'top 90%', toggleActions: 'play none none reverse' } });
}

/* ================= come arrivare: mappa vera nei colori del marchio ================= */

function arrivare() {
  const sez = $('.arrivare');
  const palco = $('.arrivare__palco');
  const tappe = { verona: $('.tappa--verona'), villafranca: $('.tappa--villafranca') };
  const stato = statoMappa;

  if (RIDOTTO) {
    import('./mappa.js').then((m) => m.creaMappa($('#mappa'), PERCORSO, stato)).then((api) => api.aggiorna(1)).catch(() => sez.classList.add('is-senza-mappa'));
    return;
  }

  const mostra = (el, si) => {
    if (el._si === si) return;
    el._si = si;
    gsap.to(el, si ? { autoAlpha: 1, y: 0, rotation: 0, duration: 0.8, ease: 'back.out(1.7)', overwrite: 'auto' } : { autoAlpha: 0, y: 40, rotation: 2, duration: 0.35, ease: 'power2.in', overwrite: 'auto' });
  };
  gsap.set(Object.values(tappe), { autoAlpha: 0, y: 40 });

  ScrollTrigger.create({
    trigger: sez, start: 'top top', end: () => '+=' + innerHeight * 3, pin: palco, scrub: true,
    onUpdate: (self) => {
      stato.p = self.progress;
      if (stato.mappa) stato.mappa.aggiorna(self.progress, stato.giro);
      mostra(tappe.verona, self.progress > 0.16 && self.progress < 0.47);
      mostra(tappe.villafranca, self.progress > 0.56);
    }
  });

  /* da ferma la camera gira piano attorno al punto, come chi si guarda intorno */
  stato.giro = 0;
  const giro = { attivo: false };
  inAmbiente(sez, { pause: () => { giro.attivo = false; }, resume: () => { giro.attivo = true; } });
  gsap.ticker.add((t) => {
    if (!giro.attivo || !stato.mappa || RIDOTTO) return;
    stato.giro = Math.sin(t * 0.18) * 5;
    stato.mappa.aggiorna(stato.p, stato.giro);
  });

  /* carica la libreria solo quando la sezione si avvicina */
  let caricata = false;
  const carica = () => {
    if (caricata) return; caricata = true;
    import('./mappa.js')
      .then((m) => m.creaMappa($('#mappa'), PERCORSO, stato))
      .then((api) => { stato.mappa = api; api.aggiorna(stato.p); })
      .catch((e) => { stato.errore = String(e && e.message || e); sez.classList.add('is-senza-mappa'); });
  };
  ScrollTrigger.create({ trigger: sez, start: 'top 250%', onEnter: carica, onEnterBack: carica });
}

/* ================= chi siamo: l'albero cresce dal 1988 ================= */

function storia() {
  const sez = $('.storia');
  const palco = $('.storia__palco');
  const svg = $('.crescita', sez);
  const passi = $$('.passo-storia', sez);
  if (!svg) return;
  const seme = $('.crescita__seme', svg);
  const radici = $$('.crescita__radici path', svg);
  const rami = $$('.crescita__rami path', svg).sort((a, b) => a.dataset.prof - b.dataset.prof);
  const foglie = $$('.crescita__germoglio', svg);
  const frutti = $$('.crescita__frutto', svg);
  const terra = $('.crescita__terra', svg);

  /* un'ape gira attorno alla chioma */
  const ape = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  ape.innerHTML = D.ape();
  ape.classList.add('crescita__ape');
  svg.appendChild(ape);
  gsap.set(ape, { scale: 0.6, autoAlpha: 0 });
  inAmbiente(sez, gsap.to(ape, { motionPath: { path: 'M300,170 C460,150 520,300 420,360 C320,420 140,380 150,260 C160,160 240,180 300,170 Z', autoRotate: false }, duration: 8, repeat: -1, ease: 'none' }));

  if (RIDOTTO) { gsap.set(ape, { autoAlpha: 1 }); return; }

  gsap.set(radici, { drawSVG: '0%' });
  gsap.set(rami, { drawSVG: '0%' });
  /* il perno è il picciolo, misurato sul riquadro della foglia: svgOrigin qui
     sbaglierebbe, perché il gruppo padre ruota col fruscio CSS */
  foglie.forEach((el) => {
    const [x, y] = el.dataset.perno.split(',').map(Number);
    const bb = el.getBBox();
    gsap.set(el, { scale: 0, transformOrigin: `${x - bb.x}px ${y - bb.y}px` });
  });
  gsap.set(frutti, { scale: 0, transformOrigin: '50% 50%' });
  gsap.set(terra, { scaleX: 0.3, transformOrigin: '50% 100%' });
  gsap.set(passi, { autoAlpha: 0, y: 50 });
  gsap.set(passi[0], { autoAlpha: 1, y: 0 });

  const profMax = Math.max(...rami.map((r) => +r.dataset.prof));
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: sez, start: 'top top', end: () => '+=' + innerHeight * 2.4, pin: palco, scrub: 0.8, invalidateOnRefresh: true }
  });
  tl.to(terra, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, 0)
    .to(seme, { scale: 1.4, svgOrigin: '300 598', duration: 0.3, ease: 'back.out(3)' }, 0.1)
    .to(radici, { drawSVG: '100%', duration: 0.8, stagger: 0.08 }, 0.3)
    .to(seme, { autoAlpha: 0, duration: 0.2 }, 0.7);
  for (let p = 0; p <= profMax; p++) {
    tl.to(rami.filter((r) => +r.dataset.prof === p), { drawSVG: '100%', duration: 0.55, stagger: 0.015 }, 0.6 + p * 0.42);
  }
  const inizioFoglie = 0.6 + profMax * 0.42;
  tl.to(foglie, { scale: 1, duration: 0.5, ease: 'back.out(2.6)', stagger: { each: 0.008, from: 'random' } }, inizioFoglie - 0.2)
    .to(frutti, { scale: 1, duration: 0.4, ease: 'back.out(3)', stagger: 0.03 }, inizioFoglie + 0.6)
    .to(ape, { autoAlpha: 1, duration: 0.3 }, inizioFoglie + 0.4);
  const T = tl.duration();
  tl.to(passi[0], { autoAlpha: 0, y: -50, duration: 0.3 }, T * 0.3)
    .to(passi[1], { autoAlpha: 1, y: 0, duration: 0.3 }, T * 0.34)
    .to(passi[1], { autoAlpha: 0, y: -50, duration: 0.3 }, T * 0.66)
    .to(passi[2], { autoAlpha: 1, y: 0, duration: 0.3 }, T * 0.7)
    .to({}, { duration: T * 0.12 });
}

/* ================= contatti e piede ================= */

function contatti() {
  if (RIDOTTO) return;
  const t = $('.contatti__titolo');
  const s = SplitText.create(t, { type: 'words', wordsClass: 'parola' });
  gsap.from(s.words, { yPercent: 120, rotation: 6, autoAlpha: 0, duration: 1.2, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 85%', toggleActions: 'play none none reverse' } });
  gsap.from($$('.contatti__sede'), { y: 60, autoAlpha: 0, duration: 1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.contatti__sedi', start: 'top 90%', toggleActions: 'play none none reverse' } });
  const b = $('.contatti .bottone--grande');
  gsap.from(b, { scale: 0.6, autoAlpha: 0, duration: 1.2, ease: 'elastic.out(1, .5)', scrollTrigger: { trigger: b, start: 'top 92%', toggleActions: 'play none none reverse' } });
}

function piede() {
  const sez = $('.piede');
  const lettere = $$('.piede__scritta .scritta__l');
  if (!lettere.length) return;
  if (!RIDOTTO) {
    gsap.fromTo(lettere, { drawSVG: '0%' }, {
      drawSVG: '100%', ease: 'none', stagger: 0.12,
      scrollTrigger: { trigger: sez, start: 'top 85%', end: 'bottom bottom', scrub: 0.8 }
    });
  }
  /* poi le lettere ondeggiano come canne al vento */
  inAmbiente(sez, gsap.to(lettere, { y: -5, duration: 1.6, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: { each: 0.15, repeat: -1, yoyo: true } }));
}

/* ================= testata e menu ================= */

function testata() {
  const h = $('.testata');
  let ultimo = 0;
  const su = (y) => {
    const scesa = y > ultimo && y > innerHeight * 0.6;
    h.classList.toggle('is-nascosta', scesa && !document.body.classList.contains('tendina-aperta'));
    h.classList.toggle('is-piena', y > innerHeight * 0.4);
    ultimo = y;
  };
  if (lenis) lenis.on('scroll', ({ scroll: y }) => su(y));
  else addEventListener('scroll', () => su(scrollY), { passive: true });
  const marchio = $('.testata__marchio .marchio');
  if (marchio && !RIDOTTO) {
    const sole = $('.marchio__sole', marchio);
    inAmbiente($('.hero'), gsap.to(sole, { y: -3, duration: 1.6, ease: 'sine.inOut', repeat: -1, yoyo: true }));
  }
}

let tendinaTl = null;
function tendina() {
  const b = $('.testata__apri');
  const t = $('#tendina');
  if (!b || !t) return;
  const voci = $$('.tendina__voci a', t);
  const etichetta = $('.testata__apri-testo', b);
  const icona = $('i', b);
  b.addEventListener('click', () => {
    const apri = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', apri);
    etichetta.textContent = apri ? 'Chiudi' : 'Menu';
    icona.innerHTML = apri ? D.SEGNI.chiudi : D.SEGNI.menu;
    document.body.classList.toggle('tendina-aperta', apri);
    if (apri) {
      t.hidden = false;
      if (lenis) lenis.stop();
      const r = b.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      tendinaTl = gsap.timeline()
        .fromTo(t, { clipPath: `circle(0px at ${cx}px ${cy}px)` }, { clipPath: `circle(${Math.hypot(innerWidth, innerHeight) * 1.1}px at ${cx}px ${cy}px)`, duration: RIDOTTO ? 0 : 0.9, ease: 'expo.inOut' })
        .from(voci, { yPercent: 80, autoAlpha: 0, rotation: 3, duration: RIDOTTO ? 0 : 0.8, stagger: 0.05, ease: 'expo.out' }, RIDOTTO ? 0 : 0.35);
    } else chiudiTendina();
  });
}
function chiudiTendina() {
  const b = $('.testata__apri');
  const t = $('#tendina');
  if (!t || t.hidden) return;
  b.setAttribute('aria-expanded', 'false');
  $('.testata__apri-testo', b).textContent = 'Menu';
  $('i', b).innerHTML = D.SEGNI.menu;
  document.body.classList.remove('tendina-aperta');
  if (tendinaTl) tendinaTl.kill();
  gsap.to(t, { autoAlpha: 0, duration: RIDOTTO ? 0 : 0.35, ease: 'power2.in', onComplete: () => { t.hidden = true; gsap.set(t, { clearProps: 'all' }); } });
  if (lenis) lenis.start();
}

/* ================= ape che accompagna il puntatore ================= */

function apeCursore() {
  const ape = $('.ape-cursore');
  if (!ape || !FINE || RIDOTTO) { if (ape) ape.remove(); return; }
  const corpo = $('.ape-cursore__corpo', ape);
  const xTo = gsap.quickTo(ape, 'x', { duration: 0.75, ease: 'power3' });
  const yTo = gsap.quickTo(ape, 'y', { duration: 0.75, ease: 'power3' });
  const rTo = gsap.quickTo(corpo, 'rotation', { duration: 0.5, ease: 'power3' });
  const mouse = { x: innerWidth / 2, y: innerHeight / 2, fermo: 0 };
  let visto = false, angolo = 0, px = 0;
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.fermo = 0;
    if (!visto) { visto = true; gsap.to(ape, { autoAlpha: 1, duration: 0.4 }); }
    const su = e.target.closest('a, button, .sala, .porta');
    ape.classList.toggle('is-su-link', !!su);
  }, { passive: true });
  document.addEventListener('pointerleave', () => gsap.to(ape, { autoAlpha: 0, duration: 0.3 }));
  document.addEventListener('pointerenter', () => { if (visto) gsap.to(ape, { autoAlpha: 1, duration: 0.3 }); });
  gsap.ticker.add((t, dt) => {
    mouse.fermo += dt;
    /* da ferma l'ape gira attorno alla punta, in movimento la insegue */
    const giro = gsap.utils.clamp(0, 1, (mouse.fermo - 250) / 600);
    angolo += dt * 0.0026;
    const ox = 34 + Math.cos(angolo) * 30 * giro;
    const oy = 26 + Math.sin(angolo * 1.3) * 22 * giro;
    const tx = mouse.x + ox, ty = mouse.y + oy;
    xTo(tx); yTo(ty);
    const dx = tx - px; px = tx;
    rTo(gsap.utils.clamp(-30, 30, dx * 1.6) + Math.sin(t * 6) * 4);
    gsap.set(corpo, { scaleX: dx < -0.5 ? -1 : (dx > 0.5 ? 1 : gsap.getProperty(corpo, 'scaleX')) });
  });
}

/* ================= pausa fuori vista ================= */

function pausaFuoriVista() {
  const sezioni = $$('.hero, .manifesto, .sedi, .capitolo, .arrivare, .storia, .feste, .contatti, .piede');
  const io = new IntersectionObserver((voci) => {
    voci.forEach((v) => {
      const s = v.target;
      s.classList.toggle('is-fermo', !v.isIntersecting);
      (ambiente.get(s) || []).forEach((tw) => (v.isIntersecting ? tw.resume() : tw.pause()));
    });
  }, { rootMargin: '25% 0px' });
  sezioni.forEach((s) => io.observe(s));
}

/* ================= avvio ================= */

function avvia() {
  disegna();
  avviaLenis();
  velocita();
  ancore();

  const fontPronti = document.fonts ? document.fonts.ready : Promise.resolve();
  fontPronti.then(() => {
    hero();
    manifesto();
    sedi();
    $$('.capitolo').forEach(nomeCapitolo);
    contatori();
    striscia();
    camere();
    sale();
    sostenibile();
    nastri();
    schede();
    pilastri();
    sfilata();
    iaa();
    esperienze();
    arrivare();
    storia();
    contatti();
    piede();
    reveal();
    testata();
    tendina();
    apeCursore();
    pausaFuoriVista();

    const titoloHero = $$('.hero__titolo .riga');
    const sotto = $('.hero__sotto');
    velo((salta) => {
      if (salta || RIDOTTO) return;
      gsap.set(['.hero__titolo', '.testata', '.hero__scorri'], { autoAlpha: 1 });
      gsap.from(titoloHero, { yPercent: 70, autoAlpha: 0, rotation: 3, duration: 1.4, stagger: 0.12, ease: 'expo.out' });
      gsap.from(sotto, { autoAlpha: 0, y: 24, duration: 1.2, delay: 0.3, ease: 'expo.out' });
      gsap.from('.testata', { yPercent: -120, duration: 1.2, delay: 0.2, ease: 'expo.out' });
      gsap.from('.hero__scorri', { autoAlpha: 0, y: 20, duration: 1, delay: 1.3, ease: 'expo.out' });
    });

    ScrollTrigger.refresh();
    if (lenis) lenis.resize();
    addEventListener('load', () => { ScrollTrigger.refresh(); if (lenis) lenis.resize(); });
  });

  window.__gf = { gsap, ScrollTrigger, lenis: () => lenis, ambiente, mappa: statoMappa };
}

avvia();
