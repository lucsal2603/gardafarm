/* Gardafarm v2 — regia
   GSAP 3.15 (ScrollTrigger, SplitText) + Lenis. Tutto parte da init(). */
(() => {
  const html = document.documentElement;
  html.classList.replace('no-js', 'js');
  const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (ridotto) html.classList.add('ridotto');
  const touch = matchMedia('(hover: none)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ================= forme (frutti e natura a faccette, come carta ritagliata) ================= */
  const COL = {
    prato: '#4F8F35', bosco: '#2F6B2A', lago: '#0B4A6E', sole: '#F2C230', pesca: '#F3A06B',
    ciliegia: '#B8323F', lavanda: '#8E7CC3', legno: '#5B3A1E', uovo: '#E8C48F', crema: '#FBF5EA', rosa: '#E98FA0'
  };
  const poly = (cx, cy, r, n, jit, rot = 0, seed = 1) => {
    let s = seed;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const pts = [];
    for (let k = 0; k < n; k++) {
      const a = rot + (k / n) * Math.PI * 2;
      const rr = r * (1 - jit / 2 + rnd() * jit);
      pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`);
    }
    return `M${pts.join(' L')} Z`;
  };
  const svg = (inner) => `<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">${inner}</svg>`;
  const FORME = {
    mela: (c = COL.prato) => svg(
      `<path fill="${c}" d="M100 62 L126 50 L154 56 L174 80 L180 112 L170 146 L148 172 L122 184 L100 176 L78 184 L52 172 L30 146 L20 112 L26 80 L46 56 L74 50 Z"/>
       <path fill="${COL.legno}" d="M97 64 L101 24 L109 26 L105 64 Z"/>
       <path fill="${COL.bosco}" d="M106 44 L128 24 L158 18 L148 40 L122 50 Z"/>`),
    pesca: (c = COL.pesca) => svg(
      `<path fill="${c}" d="M100 56 L132 46 L162 60 L180 90 L180 124 L166 154 L138 176 L104 182 L70 174 L42 152 L24 122 L26 88 L44 62 L72 48 Z"/>
       <path fill="none" stroke="rgba(0,0,0,.13)" stroke-width="6" stroke-linejoin="round" d="M100 60 L92 94 L93 134 L103 178"/>
       <path fill="${COL.bosco}" d="M102 54 L116 26 L146 12 L140 38 L118 54 Z"/>`),
    ciliegia: (c = COL.ciliegia) => svg(
      `<path fill="none" stroke="${COL.legno}" stroke-width="5" stroke-linecap="round" d="M62 112 Q 78 62 118 28 M138 118 Q 130 72 118 28"/>
       <path fill="${c}" d="M62 108 L86 116 L98 140 L94 166 L74 182 L48 180 L30 164 L26 138 L38 116 Z"/>
       <path fill="${c}" d="M138 114 L162 122 L174 146 L170 172 L150 188 L124 186 L106 170 L102 144 L114 122 Z"/>
       <path fill="${COL.bosco}" d="M118 28 L146 12 L178 18 L158 38 L130 40 Z"/>`),
    foglia: (c = COL.bosco) => svg(
      `<path fill="${c}" d="M24 178 L42 128 L78 80 L124 48 L170 28 L184 24 L178 62 L158 110 L120 148 L74 172 Z"/>
       <path fill="none" stroke="${COL.crema}" stroke-opacity=".45" stroke-width="4" stroke-linecap="round" d="M30 172 L98 108 L178 30"/>`),
    uovo: (c = COL.uovo) => svg(
      `<path fill="${c}" d="M100 18 L128 28 L150 56 L164 94 L166 132 L152 164 L126 184 L100 190 L74 184 L48 164 L34 132 L36 94 L50 56 L72 28 Z"/>`),
    fiore: (c = COL.sole) => {
      let petali = '';
      for (let k = 0; k < 5; k++) {
        const a = (k * 72 - 90) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
        const p = (d, w) => `${(100 + ca * d - sa * w).toFixed(1)} ${(100 + sa * d + ca * w).toFixed(1)}`;
        petali += `<path fill="${c}" d="M${p(18, -14)} L${p(60, -30)} L${p(88, -14)} L${p(94, 8)} L${p(70, 28)} L${p(24, 16)} Z"/>`;
      }
      return svg(`${petali}<path fill="${COL.pesca}" d="${poly(100, 100, 24, 8, .2, .3, 3)}"/>`);
    },
    lavanda: (c = COL.lavanda) => {
      let fiori = '';
      for (let j = 0; j < 8; j++) {
        const y = 22 + j * 15, lato = j % 2 ? 1 : -1;
        fiori += `<path fill="${c}" d="${poly(100 + lato * 11, y, 11 - j * .3, 6, .25, .5, j + 2)}"/>`;
        fiori += `<path fill="${c}" opacity=".75" d="${poly(100 - lato * 7, y + 8, 8, 6, .3, .2, j + 9)}"/>`;
      }
      return svg(`<path fill="none" stroke="${COL.bosco}" stroke-width="5" stroke-linecap="round" d="M100 196 L100 60 M100 150 L76 120 M100 168 L126 140"/>${fiori}`);
    },
    ape: () => svg(
      `<path fill="#FFFFFF" fill-opacity=".9" d="M88 76 L74 34 L98 20 L116 44 L106 76 Z"/>
       <path fill="#FFFFFF" fill-opacity=".9" d="M110 76 L124 30 L154 30 L152 60 L126 80 Z"/>
       <path fill="${COL.sole}" d="M42 112 L52 86 L80 72 L120 72 L148 86 L160 112 L148 138 L120 152 L80 152 L52 138 Z"/>
       <path fill="${COL.lago}" d="M84 72 L100 72 L100 152 L84 152 Z M116 73 L132 78 L132 147 L116 151 Z"/>
       <path fill="${COL.lago}" d="M26 112 L32 94 L48 90 L54 112 L48 134 L32 130 Z M160 106 L178 112 L160 118 Z"/>`),
    sole: (c = COL.sole) => {
      let raggi = '';
      for (let k = 0; k < 12; k++) {
        const a = (k * 30) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
        const p = (d, w) => `${(100 + ca * d - sa * w).toFixed(1)} ${(100 + sa * d + ca * w).toFixed(1)}`;
        raggi += `<path fill="${c}" d="M${p(62, -9)} L${p(94, 0)} L${p(62, 9)} Z"/>`;
      }
      return svg(`${raggi}<path fill="${c}" d="${poly(100, 100, 54, 12, .08, 0, 5)}"/>`);
    },
    asinello: (c = COL.lago) => svg(
      `<path fill="${c}" d="M40 88 L58 70 L72 30 L80 30 L80 62 L90 62 L96 28 L104 30 L100 66 L112 80 L150 82 L172 96 L176 128 L168 134 L168 180 L156 180 L154 140 L120 142 L114 180 L102 180 L100 140 L90 134 L80 110 L60 112 L44 106 Z"/>
       <path fill="${COL.crema}" d="M44 100 L52 98 L54 104 L46 106 Z"/>`),
    gallina: (c = COL.pesca) => svg(
      `<path fill="${COL.ciliegia}" d="M60 44 L66 30 L74 40 L80 28 L86 42 L82 52 L64 54 Z"/>
       <path fill="${c}" d="M58 52 L84 50 L96 72 L98 96 L124 96 L150 70 L170 64 L176 92 L168 126 L144 150 L108 158 L78 148 L60 124 L58 96 L48 82 L38 80 L50 66 Z"/>
       <path fill="${COL.sole}" d="M38 76 L26 82 L40 86 Z"/>
       <path fill="none" stroke="${COL.sole}" stroke-width="5" stroke-linecap="round" d="M102 158 L100 184 M120 156 L122 184"/>
       <path fill="${COL.lago}" d="M64 66 L70 64 L71 70 L65 71 Z"/>`)
  };
  const disegnaForme = () => {
    $$('[data-forma]').forEach((el) => {
      const f = FORME[el.dataset.forma];
      if (f) el.innerHTML = f(el.dataset.colore || undefined);
    });
  };

  /* poligono arrotondato per la forma dell'hero */
  const poligonoTondo = (pts, r) => {
    const n = pts.length;
    let d = '';
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
      const v1 = [p0[0] - p1[0], p0[1] - p1[1]], v2 = [p2[0] - p1[0], p2[1] - p1[1]];
      const l1 = Math.hypot(...v1), l2 = Math.hypot(...v2);
      const rr = Math.min(r, l1 / 2, l2 / 2);
      const a = [p1[0] + v1[0] / l1 * rr, p1[1] + v1[1] / l1 * rr];
      const b = [p1[0] + v2[0] / l2 * rr, p1[1] + v2[1] / l2 * rr];
      d += `${i ? 'L' : 'M'}${a[0].toFixed(1)} ${a[1].toFixed(1)} Q${p1[0]} ${p1[1]} ${b[0].toFixed(1)} ${b[1].toFixed(1)} `;
    }
    return d + 'Z';
  };

  disegnaForme();

  /* sagome delle foto nella giostra della home (viewBox 200x240) */
  const fiore = () => {
    const n = 10, R = 86, cx = 100, cy = 120;
    const pt = (k) => [cx + Math.cos(k / n * Math.PI * 2 - Math.PI / 2) * R, cy + Math.sin(k / n * Math.PI * 2 - Math.PI / 2) * R * 1.12];
    let d = `M${pt(0).map((v) => v.toFixed(1)).join(' ')}`;
    for (let k = 1; k <= n; k++) d += ` A30 30 0 0 1 ${pt(k).map((v) => v.toFixed(1)).join(' ')}`;
    return d + ' Z';
  };
  const SAGOME = {
    cerchio: 'M4 120 A96 96 0 1 1 196 120 A96 96 0 1 1 4 120 Z',
    arco: 'M6 236 L6 98 A94 94 0 0 1 194 98 L194 236 Z',
    foglia: 'M100 2 C 178 52, 202 142, 100 238 C -2 142, 22 52, 100 2 Z',
    uovo: 'M100 4 C 162 4, 196 104, 194 158 C 192 210, 150 238, 100 238 C 50 238, 8 210, 6 158 C 4 104, 38 4, 100 4 Z',
    goccia: 'M100 4 C 128 58, 194 104, 194 156 A94 84 0 0 1 6 156 C 6 104, 72 58, 100 4 Z',
    ciottolo: 'M40 8 C 120 -4, 196 20, 196 110 C 196 200, 150 238, 92 236 C 30 234, 4 190, 6 120 C 8 50, 10 12, 40 8 Z',
    faccette: 'M100 8 L150 16 L186 52 L196 108 L190 168 L160 214 L110 236 L56 228 L18 192 L4 136 L10 80 L42 30 Z',
    fiore: fiore()
  };
  $$('[data-sagoma]').forEach((b, i) => {
    const foto = $('.bustina__foto', b) || b, img = $('img', foto);
    const d = SAGOME[b.dataset.sagoma];
    if (!img || !d) return;
    const id = `sagoma-${i}`;
    foto.innerHTML = `<svg viewBox="-12 -12 224 264" role="img" aria-label="${img.alt.replace(/"/g, '&quot;')}">
      <defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs>
      <path d="${d}" fill="var(--c)" stroke="var(--c)" stroke-width="18" stroke-linejoin="round"/>
      <path d="${d}" fill="var(--crema)" stroke="var(--crema)" stroke-width="6" stroke-linejoin="round"/>
      <g clip-path="url(#${id})"><image href="${img.getAttribute('src')}" x="-10" y="-10" width="220" height="260" preserveAspectRatio="xMidYMid slice"/></g>
    </svg>`;
  });

  /* senza GSAP (CDN irraggiungibile) la pagina resta leggibile */
  if (!window.gsap) {
    html.classList.add('ridotto');
    $('.loader')?.classList.add('is-done');
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: 'expo.out', duration: 1.2 });

  /* ================= Lenis ================= */
  let lenis = null;
  if (!ridotto && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const vaiA = (target) => (lenis ? lenis.scrollTo(target, { offset: 0, duration: 1.6 }) : $(target)?.scrollIntoView({ behavior: 'smooth' }));
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1 && $(id)) { e.preventDefault(); chiudiMenu(); vaiA(id); }
  }));

  /* ================= header ================= */
  const header = $('.header');
  let ultimo = 0;
  const suScroll = (y) => {
    if (!header || html.classList.contains('menu-aperto')) return;
    header.classList.toggle('is-small', y > 60);
    ultimo = y;
  };
  if (lenis) lenis.on('scroll', ({ scroll }) => suScroll(scroll));
  else addEventListener('scroll', () => suScroll(scrollY), { passive: true });

  /* ================= menu ================= */
  const menu = $('.menu'), menuBtn = $('.menu-btn');
  let tlMenu = null;
  if (menu) {
    const links = $$('.menu__link span', menu);
    tlMenu = gsap.timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
      .set(menu, { visibility: 'visible' })
      .to(menu, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', duration: 1 })
      .from(links, { yPercent: 110, rotate: 4, stagger: 0.05, duration: 1, ease: 'expo.out' }, 0.35)
      .from('.menu__visual, .menu__piede', { opacity: 0, y: 30, duration: 0.8, ease: 'expo.out' }, 0.5);
    const imgs = $$('.menu__visual img', menu);
    $$('.menu__link', menu).forEach((l, i) => l.addEventListener('mouseenter', () => {
      imgs.forEach((im, k) => im.classList.toggle('is-on', k === i % imgs.length));
    }));
  }
  function apriMenu() {
    if (!tlMenu) return;
    html.classList.add('menu-aperto');
    header.classList.remove('is-hidden');
    menuBtn.setAttribute('aria-expanded', 'true');
    lenis?.stop();
    tlMenu.timeScale(1).play();
    setTimeout(() => $('.menu__link', menu)?.focus({ preventScroll: true }), 500);
  }
  function chiudiMenu() {
    if (!tlMenu || !html.classList.contains('menu-aperto')) return;
    html.classList.remove('menu-aperto');
    menuBtn.setAttribute('aria-expanded', 'false');
    lenis?.start();
    tlMenu.timeScale(1.6).reverse();
  }
  menuBtn?.addEventListener('click', () => (html.classList.contains('menu-aperto') ? chiudiMenu() : apriMenu()));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') chiudiMenu(); });

  /* ================= cursore "scopri" ================= */
  const cursore = $('.cursore');
  if (cursore && !touch) {
    const testo = $('span', cursore);
    let mx = -200, my = -200, cx = -200, cy = -200;
    addEventListener('pointermove', (e) => { mx = e.clientX + 14; my = e.clientY + 14; }, { passive: true });
    gsap.ticker.add(() => {
      cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
      cursore.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
    });
    $$('[data-cursor]').forEach((el) => {
      el.addEventListener('pointerenter', () => { testo.textContent = el.dataset.cursor; cursore.classList.add('is-on'); });
      el.addEventListener('pointerleave', () => cursore.classList.remove('is-on'));
    });
  }

  /* ================= transizioni fra pagine ================= */
  const sipario = $('.sipario');
  if (sipario) gsap.set(sipario, { y: 0, yPercent: 100 });
  const interno = (a) => a.origin === location.origin && !a.hash && a.target !== '_blank' && /\.html$|\/$/.test(a.pathname) && !a.hasAttribute('download');
  $$('a[href]').forEach((a) => a.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || !interno(a) || !sipario || ridotto) return;
    if (a.pathname === location.pathname) { e.preventDefault(); chiudiMenu(); vaiA(0); return; }
    e.preventDefault();
    try { sessionStorage.setItem('gfSipario', '1'); } catch (_) {}
    gsap.fromTo(sipario, { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: 'expo.inOut', onComplete: () => { location.href = a.href; } });
  }));
  addEventListener('pageshow', (e) => { if (e.persisted && sipario) gsap.set(sipario, { yPercent: 100 }); });

  /* ================= testi che salgono ================= */
  const splitTesti = () => {
    $$('[data-split]').forEach((el) => {
      const chars = el.dataset.split === 'chars';
      SplitText.create(el, {
        type: chars ? 'chars,lines' : 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          if (ridotto) return;
          return gsap.from(chars ? self.chars : self.lines, {
            yPercent: 115,
            rotate: chars ? 6 : 0,
            stagger: chars ? 0.028 : 0.09,
            duration: chars ? 1.3 : 1.2,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true }
          });
        }
      });
    });
    if (!ridotto) {
      $$('[data-reveal]').forEach((el) => gsap.to(el, {
        opacity: 1, y: 0, duration: 1.3, delay: +(el.dataset.reveal || 0),
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      }));
    }
  };

  /* ================= hero: giostra di bustine ================= */
  const hero = $('.hero');
  let introHero = null;
  if (hero) {
    const forma = $('.forma', hero), clip = $('#clip-forma path', hero);
    const pts = [[30, 900], [140, 400], [470, 190], [800, 250], [975, 600], [1000, 900]];
    const d = poligonoTondo(pts, 95);
    forma?.setAttribute('d', d);
    clip?.setAttribute('d', d);
    const giro = $('.giro', hero);
    const bustine = $$('.bustina', hero);
    const N = bustine.length;
    const tilt = [-6, 9, -12, 7, -9, 12, -7, 10, -10];
    const alza = [-18, 26, -30, 14, -8, 30, -22, 18, -12];
    let corrente = 0, auto = 0, scrollP = 0, ultimoT = performance.now();
    const ingresso = { t: ridotto ? 9 : 0 };
    const entra = gsap.parseEase('expo.out');
    if (!ridotto) {
      ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom bottom', onUpdate: (s) => { scrollP = s.progress; } });
    }
    const disponi = () => {
      const now = performance.now(), dt = Math.min(0.05, (now - ultimoT) / 1000); ultimoT = now;
      if (!ridotto) auto += dt * 0.06;
      const obiettivo = auto + scrollP * N * 0.85;
      corrente += (obiettivo - corrente) * 0.075;
      const W = innerWidth, H = innerHeight, mobile = W < 760;
      const passo = mobile ? W * 0.52 : Math.min(W * 0.235, 400);
      bustine.forEach((b, i) => {
        let t = ((i - corrente) % N + N) % N;
        if (t > N / 2) t -= N;
        const at = Math.abs(t), lim = Math.min(1, at);
        const x = t * passo;
        const e = entra(Math.min(1, Math.max(0, ingresso.t - at * 0.12)));
        const y = Math.pow(at, 1.5) * H * 0.045 + alza[i % alza.length] * lim * (H / 900) + (1 - e) * H * 0.85;
        const rot = t * 7 + tilt[i % tilt.length] * (0.35 + 0.65 * lim) + (1 - e) * (i % 2 ? 24 : -24);
        const s = 1 - Math.min(at, 3) * 0.1;
        const blur = Math.min(7, Math.max(0, at - 0.6) * 3.2);
        const op = at > N / 2 - 0.8 ? Math.max(0, (N / 2 - at) / 0.8) : 1;
        b.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${s.toFixed(3)})`;
        b.style.filter = blur > 0.15 ? `blur(${blur.toFixed(1)}px)` : 'none';
        b.style.zIndex = String(100 - Math.round(at * 10));
        b.style.opacity = op.toFixed(2);
        b.tabIndex = at < 0.5 ? 0 : -1;
      });
      giro?.setAttribute('transform', `rotate(${(-corrente * 14).toFixed(2)} 500 640)`);
      if (forma) forma.parentNode.style.transform = `rotate(${(Math.sin(corrente * 0.6) * 2.2).toFixed(2)}deg)`;
    };
    disponi();
    gsap.ticker.add(disponi);
    introHero = () => {
      if (ridotto) return;
      gsap.timeline()
        .from('.hero__forma', { yPercent: 40, rotate: -6, duration: 1.8 }, 0)
        .to(ingresso, { t: 1.6, duration: 2.2, ease: 'none' }, 0.1)
        .from('.header > *', { y: -30, opacity: 0, stagger: 0.08, duration: 1 }, 0.5)
        .from('.hero__scorri, .hero h1, .hero__piccolo', { opacity: 0, y: 16, duration: 1 }, 0.8);
    };
  }

  /* ================= immagine che si espande ================= */
  const espandi = () => {
    $$('.espandi').forEach((sez) => {
      const img = $('.espandi__img', sez), foto = $('img', img), titolo = $('.espandi__titolo', sez);
      if (ridotto || innerWidth < 760) return;
      const g = () => parseFloat(getComputedStyle(html).getPropertyValue('--gutter')) || 24;
      const r = () => parseFloat(getComputedStyle(img).borderRadius) || 24;
      const tl = gsap.timeline({ scrollTrigger: { trigger: sez, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true } });
      tl.fromTo(img,
        { clipPath: () => `inset(${innerHeight * 0.06}px ${g()}px ${innerHeight * 0.58}px ${g()}px round 24px)` },
        { clipPath: 'inset(0px 0px 0px 0px round 0px)', ease: 'power2.inOut', duration: 1 }, 0)
        .fromTo(foto, { scale: 1.18 }, { scale: 1, ease: 'none', duration: 1.3 }, 0)
        .fromTo(img, { '--velo': 0 }, { '--velo': 1, ease: 'none', duration: 0.6 }, 0.5);
      if (titolo) {
        const split = SplitText.create(titolo, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
        tl.fromTo(titolo, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.05 }, 0.6)
          .from(split.lines, { yPercent: 115, stagger: 0.08, ease: 'expo.out', duration: 0.6 }, 0.62);
      }
    });
  };

  /* ================= forme in parallasse ================= */
  const parallasse = () => {
    if (ridotto) return;
    $$('[data-speed]').forEach((el) => {
      const v = parseFloat(el.dataset.speed) || 1;
      gsap.fromTo(el, { y: v * 160, rotate: -v * 14 }, {
        y: -v * 160, rotate: v * 14, ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    $$('[data-sale]').forEach((el) => gsap.fromTo(el, { yPercent: () => -12 * parseFloat(el.dataset.sale) }, {
      yPercent: () => 12 * parseFloat(el.dataset.sale), ease: 'none',
      scrollTrigger: { trigger: el.parentNode, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true }
    }));
    $$('[data-sale] img').forEach((im) => gsap.fromTo(im, { scale: 1.15 }, {
      scale: 1, ease: 'none', scrollTrigger: { trigger: im.parentNode, start: 'top bottom', end: 'bottom top', scrub: true }
    }));
    $$('.parola-cielo img, [data-parallasse] img').forEach((im) => gsap.fromTo(im, { yPercent: -8 }, {
      yPercent: 8, ease: 'none', scrollTrigger: { trigger: im.parentNode, start: 'top bottom', end: 'bottom top', scrub: true }
    }));
  };

  /* ================= righe orizzontali guidate dallo scroll ================= */
  const righe = () => {
    $$('[data-orizzontale]').forEach((bin) => {
      if (ridotto) { bin.parentNode.style.overflowX = 'auto'; return; }
      const verso = bin.dataset.orizzontale === 'destra' ? 1 : -1;
      const dist = () => Math.max(0, bin.scrollWidth - innerWidth);
      gsap.fromTo(bin, { x: () => (verso < 0 ? 0 : -dist()) }, {
        x: () => (verso < 0 ? -dist() : 0), ease: 'none',
        scrollTrigger: { trigger: bin.parentNode, start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true }
      });
    });
  };

  /* ================= esperienze: il fiore ruota, il petalo in alto racconta l'esperienza ================= */
  const fioreEsperienze = () => {
    const sez = $('.fiore-sez');
    if (!sez) return;
    const giro = $('.fiore__giro', sez), petali = $$('.petalo', sez), infos = $$('.fiore__info', sez), ape = $('.fiore__ape', sez);
    const N = petali.length, passo = 360 / N;
    let attivo = -1;
    const accendi = (k) => {
      if (k === attivo) return;
      attivo = k;
      petali.forEach((p, i) => p.classList.toggle('is-on', i === k));
      infos.forEach((el, i) => el.classList.toggle('is-on', i === k));
    };
    /* l'ape vola da una punta all'altra: si alza dal petalo che se ne va e si posa su quello che arriva in alto */
    const fiore = $('.fiore', sez);
    let ultimoF = 0, verso = 1;
    const punta = (k, r) => {
      const F = fiore.offsetWidth, a = (k * passo + r) * Math.PI / 180, R = F * 0.53;
      return { x: Math.sin(a) * R, y: -Math.cos(a) * R };
    };
    const muoviApe = (r) => {
      if (!ape) return;
      const f = -r / passo, i = Math.floor(f), t = f - i;
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const p0 = punta(i, r), p1 = punta(i + 1, r), F = fiore.offsetWidth;
      const volo = Math.sin(Math.PI * e);
      const x = p0.x + (p1.x - p0.x) * e, y = p0.y + (p1.y - p0.y) * e - volo * F * 0.16;
      if (Math.abs(f - ultimoF) > 0.0005) verso = f > ultimoF ? 1 : -1;
      ultimoF = f;
      const incl = volo * 16 * verso;
      ape.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${incl.toFixed(1)}deg) scaleX(${verso})`;
    };
    muoviApe(0);
    addEventListener('resize', () => muoviApe(-ultimoF * passo));
    accendi(0);
    if (ridotto) return;
    const SOSTA = 0.85; /* mezzo schermo fermo appena la sezione appare */
    const stato = { r: 0 };
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sez, start: 'top top', end: () => '+=' + innerHeight * (0.6 * (N - 1 + SOSTA) + 1), pin: true, scrub: 0.6,
        refreshPriority: 1, invalidateOnRefresh: true
      }
    });
    tl.to({}, { duration: SOSTA });
    for (let i = 1; i < N; i++) {
      tl.to(stato, { r: -passo * i, ease: 'sine.inOut', duration: 1, onUpdate: () => {
        gsap.set(giro, { rotate: stato.r });
        muoviApe(stato.r);
        accendi(((Math.round(-stato.r / passo) % N) + N) % N);
      } });
    }
    /* uscita: le stagioni salgono sopra, il fiore resta fermo e si allontana */
    tl.to(sez, { scale: 0.9, autoAlpha: 0.35, ease: 'none', duration: 1 / 0.6 });
    ScrollTrigger.sort();
  };

  /* ================= la vita a Gardafarm: viaggio orizzontale tra le stagioni ================= */
  const stagioni = () => {
    const sez = $('.stagioni');
    if (!sez || ridotto) return;
    const binario = $('.stagioni__binario', sez);
    const dist = () => binario.scrollWidth - innerWidth;
    const corsa = gsap.to(binario, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: sez, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true }
    });
    $$('.stagione', sez).forEach((pan) => {
      const nome = $('.stagione__nome', pan);
      if (nome) gsap.fromTo(nome, { xPercent: 18 }, { xPercent: -22, ease: 'none', scrollTrigger: { trigger: pan, containerAnimation: corsa, start: 'left right', end: 'right left', scrub: true } });
      $$('.stagione__foto', pan).forEach((f) => {
        const v = parseFloat(f.dataset.v) || 1;
        gsap.fromTo(f, { x: () => innerWidth * 0.08 * v, y: 40 * v }, { x: () => -innerWidth * 0.08 * v, y: -40 * v, ease: 'none',
          scrollTrigger: { trigger: pan, containerAnimation: corsa, start: 'left right', end: 'right left', scrub: true, invalidateOnRefresh: true } });
      });
      const testo = $('.stagione__testo', pan);
      if (testo) gsap.from(testo, { autoAlpha: 0, y: 40, ease: 'power2.out', scrollTrigger: { trigger: pan, containerAnimation: corsa, start: 'left 55%', end: 'left 20%', scrub: true } });
    });
  };

  /* ================= ventaglio: le foto laterali escono da dietro quella centrale ================= */
  const ventaglio = () => {
    const sez = $('.ventaglio');
    if (!sez || ridotto) return;
    const sx = $('.ventaglio__carta--sx', sez), dx = $('.ventaglio__carta--dx', sez), centro = $('.ventaglio__carta--centro', sez);
    const frase = $('.ventaglio__frase', sez);
    const apri = innerWidth < 760 ? 44 : 68;
    /* nessun cambio di grandezza: appena la sezione entra nello schermo le laterali si aprono */
    const tl = gsap.timeline({ scrollTrigger: { trigger: sez, start: 'top 85%', end: 'top 20%', scrub: 0.8 } });
    tl.fromTo(sx, { xPercent: 0, rotate: 0, rotationY: 0 },
        { xPercent: -apri, rotate: -14, rotationY: 32, ease: 'power3.out', duration: 1 }, 0)
      .fromTo(dx, { xPercent: 0, rotate: 0, rotationY: 0 },
        { xPercent: apri, rotate: 16, rotationY: -32, ease: 'power3.out', duration: 1 }, 0)
      .fromTo(frase, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.5 }, 0.5);
  };

  /* ================= manifesto: parole e simboli compaiono con lo scroll ================= */
  const manifesto = () => {
    const sez = $('.manifesto');
    if (!sez || ridotto) return;
    const pezzi = [];
    [...$('.manifesto__testo', sez).children].forEach((el) => {
      if (el.classList.contains('manifesto__parte')) {
        SplitText.create(el, { type: 'words', wordsClass: 'parola' }).words.forEach((w) => pezzi.push(w));
      } else pezzi.push(el);
    });
    const tl = gsap.timeline({ scrollTrigger: { trigger: sez, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true } });
    pezzi.forEach((el, i) => {
      const icona = el.classList.contains('manifesto__icona');
      tl.fromTo(el,
        icona ? { scale: 0, rotate: -40, autoAlpha: 0 } : { autoAlpha: 0.12, yPercent: 35, filter: 'blur(6px)' },
        icona ? { scale: 1, rotate: 0, autoAlpha: 1, ease: 'back.out(2.2)', duration: 1.2 } : { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 1 },
        i * 0.55);
    });
    /* striscia gialla: scende col percorso a serpentina, poi si allarga fino a coprire lo schermo */
    const svgL = $('.manifesto__striscia', sez), linea = $('.manifesto__striscia path', sez), palco = $('.manifesto__palco', sez);
    if (linea) {
      /* percorso a serpentina su tutta la larghezza, ricalcolato in pixel sullo schermo reale */
      const PERCORSO = [[0.5, -0.06], [0.95, 0.04, 0.97, 0.19, 0.72, 0.26], [0.45, 0.33, 0.05, 0.28, 0.1, 0.42],
        [0.14, 0.56, 0.9, 0.5, 0.88, 0.64], [0.86, 0.78, 0.17, 0.7, 0.24, 0.84], [0.29, 0.94, 0.53, 0.95, 0.5, 1.08]];
      let W = 0, H = 0;
      const disegna = () => {
        W = palco.clientWidth; H = palco.clientHeight;
        svgL.setAttribute('viewBox', `0 0 ${W} ${H}`);
        const p = (x, y) => `${(x * W).toFixed(1)} ${(y * H).toFixed(1)}`;
        let d = `M${p(...PERCORSO[0])}`;
        for (const c of PERCORSO.slice(1)) d += ` C ${p(c[0], c[1])}, ${p(c[2], c[3])}, ${p(c[4], c[5])}`;
        linea.setAttribute('d', d);
      };
      disegna();
      ScrollTrigger.addEventListener('refreshInit', disegna);
      const spessore = () => Math.max(28, Math.min(W, H) * 0.07);
      gsap.set(linea, { attr: { 'stroke-width': spessore() } });
      /* l'ape sta sulla punta: la striscia è la scia che lascia */
      const ape = $('.manifesto__ape', sez);
      const prog = { p: 0 };
      let angolo = 90;
      const muovi = () => {
        linea.setAttribute('stroke-dashoffset', (1 - prog.p).toFixed(5));
        if (!ape) return;
        const L = linea.getTotalLength(), l = prog.p * L;
        const pt = linea.getPointAtLength(l), dietro = linea.getPointAtLength(Math.max(0, l - 6)), avanti = linea.getPointAtLength(Math.min(L, l + 6));
        const a = Math.atan2(avanti.y - dietro.y, avanti.x - dietro.x) * 180 / Math.PI;
        let diff = ((a - angolo + 540) % 360) - 180;
        angolo += diff * 0.35;
        const sp = ape.offsetWidth * 0.32, rad = angolo * Math.PI / 180;
        /* se va verso sinistra la specchio, così non vola a pancia in su */
        const sinistra = Math.cos(rad) < 0;
        const rot = sinistra ? angolo - 180 : angolo;
        ape.style.transform = `translate3d(${(pt.x + Math.cos(rad) * sp).toFixed(1)}px, ${(pt.y + Math.sin(rad) * sp).toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scaleX(${sinistra ? -1 : 1})`;
      };
      muovi();
      ScrollTrigger.addEventListener('refresh', muovi);
      tl.to(prog, { p: 1, ease: 'none', duration: 7, onUpdate: muovi }, '+=0.4')
        .fromTo(linea, { attr: { 'stroke-width': () => spessore() } }, { attr: { 'stroke-width': () => Math.hypot(W, H) * 1.2 }, ease: 'power2.in', duration: 2.4 })
        .to({}, { duration: 0.5 })
        /* lo schermo è giallo: il palco sparisce e sotto c'è già la sezione delle esperienze, ferma */
        .to(palco, { autoAlpha: 0, ease: 'none', duration: 0.15 });
    } else tl.to({}, { duration: 1.5 });
  };

  /* ================= pila di carte ================= */
  const pila = () => {
    if (ridotto || innerWidth < 760) return;
    const carte = $$('.carta-pila');
    carte.forEach((c, i) => {
      const prossima = carte[i + 1];
      if (!prossima) return;
      gsap.to(c, {
        scale: 0.9, rotate: i % 2 ? 2.4 : -2.4, '--scuro': 1, ease: 'none',
        scrollTrigger: { trigger: prossima, start: 'top bottom', end: 'top 20%', scrub: true }
      });
    });
  };

  /* ================= contatori ================= */
  const contatori = () => {
    $$('[data-conta]').forEach((el) => {
      const fine = parseFloat(el.dataset.conta);
      if (ridotto) { el.textContent = fine; return; }
      const o = { v: 0 };
      gsap.to(o, { v: fine, duration: 2.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => { el.textContent = el.hasAttribute('data-anno') ? Math.round(o.v) : Math.round(o.v).toLocaleString('it-IT'); } });
    });
  };

  /* ================= scritte che scorrono ================= */
  const scorrevoli = () => {
    $$('.scorrevole__binario').forEach((b) => {
      if (ridotto) return;
      const tw = gsap.to(b, { xPercent: -50, repeat: -1, duration: 34, ease: 'none' });
      lenis?.on('scroll', ({ velocity }) => {
        gsap.to(tw, { timeScale: 1 + Math.min(4, Math.abs(velocity) * 0.25), duration: 0.3, overwrite: true });
      });
    });
  };

  /* ================= footer: la scritta grande ================= */
  const piede = () => {
    const g = $('.footer__grande');
    if (!g || ridotto) return;
    const parola = $('.display', g), corsivo = $('.italic', g);
    const s1 = SplitText.create(parola, { type: 'chars', mask: 'chars' });
    gsap.timeline({ scrollTrigger: { trigger: g, start: 'top 85%', once: true } })
      .from(s1.chars, { yPercent: 105, stagger: 0.045, duration: 1.4 })
      .from(corsivo, { yPercent: 60, opacity: 0, duration: 1.4 }, 0.35);
  };

  /* ================= loader / ingresso ================= */
  const loader = $('.loader');
  let primaVolta = true, daSipario = false;
  try {
    primaVolta = !sessionStorage.getItem('gfVisto');
    daSipario = sessionStorage.getItem('gfSipario') === '1';
    sessionStorage.setItem('gfVisto', '1');
    sessionStorage.removeItem('gfSipario');
  } catch (_) {}

  const avvia = () => {
    splitTesti();
    espandi();
    parallasse();
    righe();
    ventaglio();
    manifesto();
    fioreEsperienze();
    stagioni();
    pila();
    contatori();
    scorrevoli();
    piede();
    ScrollTrigger.refresh();
  };

  const entra = () => {
    if (introHero) introHero();
    else if (!ridotto) gsap.from('.titolo-pagina .display, .titolo-pagina__lati', { yPercent: 30, opacity: 0, stagger: 0.1, duration: 1.4 });
  };

  if (loader && primaVolta && !ridotto) {
    lenis?.stop();
    const perc = $('.loader__perc span', loader);
    const o = { v: 0 };
    const caricato = new Promise((r) => (document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true })));
    const minimo = gsap.to(o, { v: 82, duration: 1.4, ease: 'power2.inOut', onUpdate: () => { perc.textContent = Math.round(o.v); } });
    Promise.all([caricato, document.fonts?.ready, minimo.then()]).then(() => {
      gsap.timeline({ onComplete: () => { loader.classList.add('is-done'); lenis?.start(); } })
        .to(o, { v: 100, duration: 0.5, ease: 'power2.out', onUpdate: () => { perc.textContent = Math.round(o.v); } })
        .to('.loader__perc, .loader__frase', { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' })
        .to('.loader__marchio', { scale: 0.6, opacity: 0, duration: 0.6, ease: 'power3.in' }, '<')
        .to(loader, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' })
        .add(entra, '-=0.6');
      avvia();
    });
  } else {
    loader?.classList.add('is-done');
    if (sipario && daSipario && !ridotto) {
      gsap.set(sipario, { yPercent: 0 });
      gsap.to(sipario, { yPercent: -100, duration: 1, ease: 'expo.inOut', delay: 0.15, onComplete: () => gsap.set(sipario, { yPercent: 100 }) });
    }
    const pronto = () => { avvia(); entra(); };
    document.fonts ? document.fonts.ready.then(pronto) : pronto();
  }
  addEventListener('load', () => ScrollTrigger.refresh());
})();
