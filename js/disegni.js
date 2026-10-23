/* Disegni di Gardafarm, tutti SVG a mano in stile manifesto:
   campiture piene, niente contorni, la palette del marchio.
   Ogni funzione restituisce una stringa SVG; le parti che si muovono
   hanno una classe e (dove serve) il proprio transform-origin. */

export const C = {
  prato: '#6FA74E',
  pratoChiaro: '#8DBE73',
  pratoScuro: '#4E9442',
  bosco: '#2F6B3A',
  lago: '#0A4A6C',
  lagoChiaro: '#2C6E8F',
  sole: '#F2C72E',
  anello: '#EACF53',
  inchiostro: '#0F2A4F',
  cielo: '#E8F2EF',
  sabbia: '#EADFB4',
  lavanda: '#8F7CC6',
  muro: '#F3EADB',
  tegola: '#C7744F',
  arancio: '#E9874A'
};

let uid = 0;
const nuovoId = (p) => `${p}${++uid}`;

/* generatore casuale con seme: i disegni escono sempre uguali */
export function seme(s) {
  return function () {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f1 = (n) => Math.round(n * 10) / 10;

/* righe d'acqua: sinusoidi lunghe, periodo fisso per il loop senza giunte */
function righeAcqua({ x0, x1, y0, y1, n, periodo, ampiezza, colore, spessore, opacita, rnd }) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const y = y0 + ((y1 - y0) * (i + 0.5)) / n + (rnd() - 0.5) * 3;
    const a = ampiezza * (0.6 + rnd() * 0.8);
    const fase = Math.floor(rnd() * 4) * (periodo / 4);
    let x = x0 - periodo + fase;
    d += `M${f1(x)},${f1(y)}`;
    while (x < x1 + periodo) {
      d += ` q${periodo / 4},${-a} ${periodo / 2},0 q${periodo / 4},${a} ${periodo / 2},0`;
      x += periodo;
    }
  }
  return `<path d="${d}" fill="none" stroke="${colore}" stroke-width="${spessore}" stroke-linecap="round" opacity="${opacita}"/>`;
}

/* ================= marchio ================= */

export function marchio({ classe = '' } = {}) {
  const id = nuovoId('mc');
  const rnd = seme(7);
  return `<svg class="marchio ${classe}" width="224" height="224" viewBox="-112 -112 224 224" aria-hidden="true" focusable="false">
  <defs><clipPath id="${id}"><circle r="100"/></clipPath></defs>
  <g clip-path="url(#${id})">
    <rect class="marchio__prato" x="-112" y="-112" width="224" height="224" fill="${C.prato}"/>
    <g class="marchio__lago">
      <path d="M-130,-2 C-92,-13 -56,-16 -22,-8 C8,-1 38,6 68,4 C94,2 114,-2 130,-4 L130,130 L-130,130 Z" fill="${C.lago}"/>
      <g class="marchio__righe">
        ${righeAcqua({ x0: -110, x1: 110, y0: 8, y1: 100, n: 13, periodo: 60, ampiezza: 3.2, colore: '#1F6488', spessore: 2.2, opacita: 0.75, rnd })}
        ${righeAcqua({ x0: -110, x1: 110, y0: 12, y1: 100, n: 7, periodo: 60, ampiezza: 2.4, colore: '#063A57', spessore: 1.6, opacita: 0.6, rnd })}
      </g>
    </g>
    <g class="marchio__sole">
      <path d="M3,2 C30,-16 72,-17 102,0 C74,12 30,14 3,2 Z" fill="${C.sole}"/>
      <path d="M10,2.4 C40,3.6 70,2 95,0.6" fill="none" stroke="${C.inchiostro}" stroke-width="1.5" stroke-linecap="round"/>
    </g>
  </g>
  <circle class="marchio__anello" r="104" fill="none" stroke="${C.anello}" stroke-width="5"/>
</svg>`;
}

/* ================= scritta GARDAFARM a tratto ================= */

const LETTERE = [
  'M40,20 C36,8 27,4 19,5 C8,7 4,24 4,50 C4,78 8,96 21,97 C34,98 40,86 40,70 L40,58 L27,58',
  'M53,98 L70,8 Q71.5,3 73,8 L89,98 M60,66 L82,65',
  'M108,98 L107,7 C126,4 140,10 140,28 C140,46 126,50 110,49 L141,98',
  'M160,6 L160,98 C182,98 193,80 192,52 C192,22 182,6 160,6',
  'M205,98 L222,8 Q223.5,3 225,8 L241,98 M212,66 L234,65',
  'M260,98 L260,6 L291,6 M260,48 L285,47',
  'M302,98 L319,8 Q320.5,3 322,8 L338,98 M309,66 L331,65',
  'M355,98 L354,7 C373,4 387,10 387,28 C387,46 373,50 357,49 L388,98',
  'M403,98 L405,6 L422,63 L439,6 L441,98'
];

export function scritta({ classe = '', colore = C.inchiostro, spessore = 8.5 } = {}) {
  return `<svg class="scritta ${classe}" viewBox="-6 -2 456 108" role="img" aria-label="Gardafarm">
  <g fill="none" stroke="${colore}" stroke-width="${spessore}" stroke-linecap="round" stroke-linejoin="round">
    ${LETTERE.map((d) => `<path class="scritta__l" d="${d}"/>`).join('')}
  </g>
</svg>`;
}

/* firma piccola: onda + collina sotto "Enjoy nature" */
export function enjoy({ classe = '' } = {}) {
  return `<svg class="enjoy ${classe}" viewBox="0 0 300 30" aria-hidden="true">
  <path class="enjoy__onda" d="M2,6 C24,2 50,2 70,8 C58,22 34,28 14,24 C6,22 2,14 2,6 Z" fill="${C.lagoChiaro}"/>
  <text x="150" y="21" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="600" font-size="17" letter-spacing="1.5" fill="${C.pratoScuro}">ENJOY NATURE</text>
  <path class="enjoy__collina" d="M232,26 C240,8 262,2 280,6 C292,10 298,18 298,26 Z" fill="#1F8A35"/>
</svg>`;
}

/* ================= icone del manifesto ================= */

export const ICONE = {
  foglia: `<svg class="icona icona--foglia" viewBox="0 0 64 64" aria-hidden="true"><g class="icona__dondola" style="transform-origin:14px 54px"><path d="M14,54 C10,30 24,10 54,8 C56,36 40,54 14,54 Z" fill="${C.prato}"/><path d="M14,54 C24,40 36,26 50,13" fill="none" stroke="${C.bosco}" stroke-width="3" stroke-linecap="round"/></g></svg>`,
  sole: `<svg class="icona icona--sole" viewBox="-32 -32 64 64" aria-hidden="true"><g class="icona__raggi">${Array.from({ length: 10 }, (_, i) => `<path d="M0,-30 C3,-24 3,-20 0,-17 C-3,-20 -3,-24 0,-30Z" fill="${C.sole}" transform="rotate(${i * 36})"/>`).join('')}</g><circle r="13" fill="${C.sole}"/></svg>`,
  casa: `<svg class="icona icona--casa" viewBox="0 0 64 64" aria-hidden="true"><path d="M10,30 L32,12 L54,30 L54,54 L10,54 Z" fill="${C.muro}"/><path d="M6,32 L32,10 L58,32" fill="none" stroke="${C.tegola}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><rect x="26" y="38" width="12" height="16" rx="2" fill="${C.lago}"/><g class="icona__fumo"><circle cx="46" cy="10" r="3" fill="#fff" opacity=".9"/><circle cx="50" cy="4" r="2.2" fill="#fff" opacity=".7"/></g><rect x="42" y="14" width="6" height="10" fill="${C.tegola}"/></svg>`,
  asino: `<svg class="icona icona--asino" viewBox="0 0 64 64" aria-hidden="true"><g class="icona__orecchio" style="transform-origin:24px 24px"><path d="M22,26 C14,16 12,4 16,0 C24,6 28,16 28,24 Z" fill="#8A7F74"/></g><g class="icona__orecchio icona__orecchio--b" style="transform-origin:34px 22px"><path d="M32,24 C30,12 34,2 40,0 C42,10 40,20 38,26 Z" fill="#7B7067"/></g><path d="M18,26 C22,18 38,16 44,24 C52,34 58,46 54,54 C50,62 36,62 30,54 C22,44 16,34 18,26 Z" fill="#8A7F74"/><ellipse cx="48" cy="52" rx="9" ry="8" fill="#E7E1D8"/><circle cx="32" cy="32" r="3" fill="#1E1A17"/><circle cx="33" cy="31" r="1" fill="#fff"/></svg>`
};

/* ================= animali ================= */

/* Tutti di profilo, rivolti a destra. Le zampe sono gruppi con svgOrigin
   sull'anca, così GSAP le fa camminare ruotandole. */

export function asinello({ classe = '' } = {}) {
  const pelo = '#8A7F74', scuro = '#6F655C', zoccolo = '#3E3832', muso = '#E7E1D8';
  const zampa = (x, c, cls) => `<g class="zampa ${cls}" data-anca="${x + 5.5},96"><rect x="${x}" y="92" width="11" height="50" rx="5" fill="${c}"/><rect x="${x - 0.5}" y="136" width="12" height="9" rx="3" fill="${zoccolo}"/></g>`;
  return `<svg class="animale animale--asino ${classe}" width="212" height="190" viewBox="0 -40 212 190" aria-hidden="true">
  <g class="animale__corpo">
    <g class="coda" data-perno="40,64"><path d="M40,64 C28,72 23,88 25,104" fill="none" stroke="${scuro}" stroke-width="4" stroke-linecap="round"/><ellipse cx="25" cy="109" rx="4.5" ry="9" fill="${zoccolo}"/></g>
    ${zampa(48, scuro, 'zampa--pd')}${zampa(124, scuro, 'zampa--ad')}
    <path d="M40,72 C42,54 70,47 100,48 C128,48 148,53 152,70 C156,92 140,106 104,108 C72,110 44,104 40,90 Z" fill="${pelo}"/>
    <path d="M52,98 C74,106 120,108 146,94 C140,106 120,111 100,111 C78,111 60,107 52,98 Z" fill="#A99E92"/>
    ${zampa(56, pelo, 'zampa--pv')}${zampa(132, pelo, 'zampa--av')}
    <g class="testa" data-perno="146,62">
      <path d="M134,58 C140,42 150,28 160,21 L177,31 C169,45 160,63 150,75 Z" fill="${pelo}"/>
      <path d="M136,53 C142,37 150,25 160,18 L163,23 C154,31 146,43 141,57 Z" fill="#4A433C"/>
      <g class="orecchio orecchio--b" data-perno="163,15"><path d="M160,17 C157,1 160,-16 167,-25 C172,-14 171,2 167,18 Z" fill="${scuro}"/></g>
      <path d="M152,22 C158,10 172,8 180,16 C188,26 197,44 195,54 C193,62 181,64 173,58 C165,51 154,37 152,22 Z" fill="${pelo}"/>
      <g class="orecchio" data-perno="157,17"><path d="M154,19 C147,3 147,-15 153,-27 C160,-16 162,2 161,19 Z" fill="${pelo}"/><path d="M155,12 C151,1 151,-11 154,-19 C158,-10 158,2 158,12 Z" fill="#C9BFB4"/></g>
      <ellipse cx="187" cy="54" rx="10.5" ry="9.5" fill="${muso}"/>
      <ellipse cx="191" cy="51.5" rx="1.9" ry="2.7" fill="${zoccolo}"/>
      <g class="occhio" data-perno="170,27"><circle cx="170" cy="27" r="3.4" fill="#1E1A17"/><circle cx="171.2" cy="25.8" r="1.1" fill="#fff"/></g>
    </g>
  </g>
</svg>`;
}

export function capretta({ classe = '' } = {}) {
  const pelo = '#F3EEE6', macchia = '#C4955F', zoccolo = '#4A3B30';
  const zampa = (x, c, cls) => `<g class="zampa ${cls}" data-anca="${x + 3.5},90"><rect x="${x}" y="86" width="7.5" height="52" rx="3.5" fill="${c}"/><rect x="${x - 0.5}" y="134" width="8.5" height="7" rx="2" fill="${zoccolo}"/></g>`;
  return `<svg class="animale animale--capra ${classe}" width="200" height="160" viewBox="0 -10 200 160" aria-hidden="true">
  <g class="animale__corpo">
    <g class="coda" data-perno="52,60"><path d="M52,62 C45,54 45,47 49,42 C54,48 57,55 57,62 Z" fill="${pelo}"/></g>
    ${zampa(58, '#DCD4C8', 'zampa--pd')}${zampa(126, '#DCD4C8', 'zampa--ad')}
    <path d="M48,66 C52,52 80,48 110,50 C134,52 148,58 150,72 C152,90 136,100 104,100 C74,100 50,96 46,84 Z" fill="${pelo}"/>
    <path d="M80,52 C96,48 114,52 118,64 C120,76 104,82 90,78 C78,74 72,60 80,52 Z" fill="${macchia}"/>
    ${zampa(66, pelo, 'zampa--pv')}${zampa(134, pelo, 'zampa--av')}
    <g class="testa" data-perno="142,62">
      <path d="M136,60 C140,48 146,38 152,32 L166,38 C162,48 156,60 150,70 Z" fill="${pelo}"/>
      <path d="M152,24 C150,11 157,3 168,1 C161,7 159,15 159,24 Z" fill="#B9A58A"/>
      <path d="M148,32 C152,20 166,18 174,26 C180,32 187,42 185,48 C183,54 173,54 167,50 C159,44 150,40 148,32 Z" fill="${pelo}"/>
      <path d="M171,50 C171,58 167,64 162,67 C164,59 164,54 166,50 Z" fill="#DCD4C8"/>
      <g class="orecchio" data-perno="150,31"><path d="M151,29 C141,27 133,31 129,35 C137,38 145,36 153,33 Z" fill="${macchia}"/></g>
      <g class="occhio" data-perno="166,32"><circle cx="166" cy="32" r="3.2" fill="#E2B649"/><rect x="163.6" y="31.3" width="4.8" height="1.5" rx=".7" fill="#1E1A17"/></g>
      <ellipse cx="183" cy="45" rx="1.4" ry="1.9" fill="#7A6A5A"/>
    </g>
  </g>
</svg>`;
}

export function gallina({ classe = '' } = {}) {
  const piuma = '#B4683A', ala = '#8E4A28', cresta = '#D8432F', zampe = '#E9A93A';
  return `<svg class="animale animale--gallina ${classe}" width="120" height="122" viewBox="0 0 120 122" aria-hidden="true">
  <g class="animale__corpo">
    <g class="coda" data-perno="30,50"><path d="M30,52 C14,38 14,18 24,8 C28,24 34,36 44,46 Z" fill="#5A3A26"/><path d="M28,56 C16,48 10,36 12,24 C20,34 28,42 38,50 Z" fill="#2F5A48"/></g>
    <g class="zampa zampa--pv" data-anca="46,88"><path d="M46,88 L44,110 M44,110 L36,113 M44,110 L50,114" fill="none" stroke="${zampe}" stroke-width="3" stroke-linecap="round"/></g>
    <g class="zampa zampa--av" data-anca="58,88"><path d="M58,88 L60,110 M60,110 L52,113 M60,110 L67,113" fill="none" stroke="${zampe}" stroke-width="3" stroke-linecap="round"/></g>
    <path d="M20,56 C24,40 44,36 64,40 C80,44 88,56 86,70 C84,86 66,94 48,92 C30,90 18,78 20,56 Z" fill="${piuma}"/>
    <g class="ala" data-perno="44,60"><path d="M38,60 C50,52 68,56 74,66 C66,77 48,79 38,71 Z" fill="${ala}"/></g>
    <g class="testa" data-perno="70,50">
      <path d="M64,44 C66,34 72,28 80,26 C86,30 88,40 84,50 C78,54 70,52 64,44 Z" fill="${piuma}"/>
      <circle cx="80" cy="33" r="12" fill="${piuma}"/>
      <path d="M71,24 C71,15 78,13 80,19 C82,11 89,11 89,19 C93,15 97,21 93,26 Z" fill="${cresta}"/>
      <path d="M91,30 L101,34 L91,38 Z" fill="${C.sole}"/>
      <ellipse cx="89" cy="44" rx="3.2" ry="5.2" fill="${cresta}"/>
      <circle cx="84" cy="30" r="2.2" fill="#1E1A17"/><circle cx="84.7" cy="29.3" r=".7" fill="#fff"/>
    </g>
  </g>
</svg>`;
}

export function coniglio({ classe = '' } = {}) {
  const pelo = '#CFC6BA', scuro = '#BFB5A8';
  return `<svg class="animale animale--coniglio ${classe}" width="140" height="128" viewBox="0 -14 140 128" aria-hidden="true">
  <g class="animale__corpo">
    <circle class="coda" cx="22" cy="80" r="9.5" fill="#F6F2EC"/>
    <g class="zampa zampa--pv" data-anca="50,96"><path d="M40,98 C35,107 43,112 60,112 C67,112 67,105 60,103 Z" fill="${scuro}"/></g>
    <path d="M24,90 C20,66 38,50 62,50 C84,50 98,64 98,82 C98,100 84,110 60,110 C40,110 26,104 24,90 Z" fill="${pelo}"/>
    <g class="zampa zampa--av" data-anca="92,96"><rect x="88" y="94" width="9" height="18" rx="4.5" fill="${scuro}"/></g>
    <g class="testa" data-perno="96,62">
      <g class="orecchio orecchio--b" data-perno="96,44"><path d="M94,44 C84,26 84,6 90,-6 C98,6 102,26 102,44 Z" fill="${scuro}"/></g>
      <circle cx="104" cy="58" r="19" fill="${pelo}"/>
      <g class="orecchio" data-perno="100,42"><path d="M98,44 C92,24 94,4 102,-8 C110,6 110,26 106,44 Z" fill="${pelo}"/><path d="M100,36 C97,22 98,8 102,-1 C106,10 106,24 104,36 Z" fill="#E9C9C4"/></g>
      <g class="occhio" data-perno="111,53"><circle cx="111" cy="53" r="3.2" fill="#1E1A17"/><circle cx="112" cy="52" r="1" fill="#fff"/></g>
      <circle cx="121.5" cy="62" r="2.4" fill="#D98C8C"/>
      <path d="M121,64 C121,68 118,70 115,69" fill="none" stroke="#8E8174" stroke-width="1.4" stroke-linecap="round"/>
    </g>
  </g>
</svg>`;
}

export function ape({ classe = '' } = {}) {
  const id = nuovoId('ap');
  return `<svg class="ape ${classe}" width="68" height="60" viewBox="-34 -30 68 60" aria-hidden="true">
  <defs><clipPath id="${id}"><ellipse cx="-2" cy="4" rx="17" ry="12"/></clipPath></defs>
  <g class="ape__ali">
    <ellipse class="ape__ala ape__ala--b" cx="-6" cy="-10" rx="8" ry="13" fill="#fff" opacity=".7" transform="rotate(-20 -6 -10)"/>
    <ellipse class="ape__ala" cx="2" cy="-11" rx="8" ry="14" fill="#fff" opacity=".85" transform="rotate(14 2 -11)"/>
  </g>
  <path d="M-19,4 L-27,6 L-19,8 Z" fill="${C.inchiostro}"/>
  <ellipse cx="-2" cy="4" rx="17" ry="12" fill="${C.sole}"/>
  <g clip-path="url(#${id})" fill="${C.inchiostro}"><rect x="-8" y="-10" width="5" height="28"/><rect x="2" y="-10" width="5" height="28"/></g>
  <circle cx="17" cy="1" r="8" fill="${C.inchiostro}"/>
  <circle cx="20" cy="-1" r="1.8" fill="#fff"/>
  <path d="M18,-6 C20,-14 24,-16 27,-16 M14,-6 C14,-14 17,-18 20,-19" fill="none" stroke="${C.inchiostro}" stroke-width="1.4" stroke-linecap="round"/>
</svg>`;
}

/* ================= frutti delle sale ================= */

export const FRUTTI = {
  pesca: () => {
    const id = nuovoId('fp');
    return `<svg class="frutto frutto--pesca" width="128" height="128" viewBox="-64 -70 128 128" aria-hidden="true">
  <defs><radialGradient id="${id}" cx="35%" cy="35%" r="75%"><stop offset="0" stop-color="#FBC981"/><stop offset=".6" stop-color="#F59A68"/><stop offset="1" stop-color="#E76458"/></radialGradient></defs>
  <g class="frutto__foglia" data-perno="2,-40"><path d="M2,-40 C10,-60 34,-64 44,-55 C34,-45 18,-40 2,-40 Z" fill="#5E9B47"/><path d="M4,-41 C18,-50 30,-54 40,-55" fill="none" stroke="#3E7A34" stroke-width="1.6"/></g>
  <path d="M0,-40 C27,-45 47,-22 45,5 C43,33 23,47 0,47 C-23,47 -45,31 -45,3 C-45,-25 -25,-43 0,-40 Z" fill="url(#${id})"/>
  <path d="M-2,-38 C-11,-16 -11,18 -2,45" fill="none" stroke="#D9584F" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>
  <ellipse cx="-20" cy="-16" rx="9" ry="5" fill="#fff" opacity=".35" transform="rotate(-35 -20 -16)"/>
</svg>`;
  },
  ciliegia: () => `<svg class="frutto frutto--ciliegia" width="128" height="128" viewBox="-64 -74 128 128" aria-hidden="true">
  <g class="frutto__foglia" data-perno="6,-58"><path d="M6,-58 C18,-74 40,-72 48,-62 C36,-54 20,-54 6,-58 Z" fill="#5E9B47"/></g>
  <path d="M6,-58 C-6,-36 -18,-14 -22,4 M6,-58 C12,-34 18,-10 20,12" fill="none" stroke="#5A6B2E" stroke-width="3" stroke-linecap="round"/>
  <g class="frutto__chicco" data-perno="-22,4"><circle cx="-22" cy="22" r="22" fill="#C8283B"/><ellipse cx="-30" cy="14" rx="6" ry="3.6" fill="#fff" opacity=".4" transform="rotate(-35 -30 14)"/></g>
  <g class="frutto__chicco frutto__chicco--b" data-perno="20,12"><circle cx="20" cy="30" r="21" fill="#AD1F33"/><ellipse cx="13" cy="22" rx="5.6" ry="3.4" fill="#fff" opacity=".35" transform="rotate(-35 13 22)"/></g>
</svg>`,
  mela: () => {
    const id = nuovoId('fm');
    return `<svg class="frutto frutto--mela" width="128" height="128" viewBox="-64 -68 128 128" aria-hidden="true">
  <defs><radialGradient id="${id}" cx="65%" cy="40%" r="70%"><stop offset="0" stop-color="#E5503E"/><stop offset=".55" stop-color="#E5503E" stop-opacity=".55"/><stop offset="1" stop-color="#E5503E" stop-opacity="0"/></radialGradient></defs>
  <path d="M0,-32 C2,-42 6,-50 12,-56" fill="none" stroke="#5A4630" stroke-width="4" stroke-linecap="round"/>
  <g class="frutto__foglia" data-perno="6,-44"><path d="M6,-44 C10,-60 28,-66 40,-60 C34,-48 20,-42 6,-44 Z" fill="#5E9B47"/></g>
  <path d="M0,-30 C10,-40 34,-40 42,-18 C50,4 40,36 18,44 C10,47 4,44 0,42 C-4,44 -10,47 -18,44 C-40,36 -50,4 -42,-18 C-34,-40 -10,-40 0,-30 Z" fill="#9CC54B"/>
  <path d="M0,-30 C10,-40 34,-40 42,-18 C50,4 40,36 18,44 C10,47 4,44 0,42 C-4,44 -10,47 -18,44 C-40,36 -50,4 -42,-18 C-34,-40 -10,-40 0,-30 Z" fill="url(#${id})"/>
  <ellipse cx="-24" cy="-14" rx="8" ry="4.5" fill="#fff" opacity=".35" transform="rotate(-40 -24 -14)"/>
</svg>`;
  }
};

/* ================= onde e colline di confine ================= */

/* una striscia larga il doppio dello schermo con un'onda periodica:
   il CSS la fa scorrere di metà larghezza, senza giunte */
export function onda({ colore, alto = 90, periodo = 360, ampiezza = 18, classe = '' }) {
  const W = 2880, base = alto * 0.55;
  const tratto = (a, fase) => {
    let d = `M0,${alto} L0,${base}`;
    for (let x = 0; x < W; x += periodo) {
      d += ` C${x + periodo * 0.25},${base - a} ${x + periodo * 0.25},${base - a} ${x + periodo * 0.5},${base}`;
      d += ` C${x + periodo * 0.75},${base + a * fase} ${x + periodo * 0.75},${base + a * fase} ${x + periodo},${base}`;
    }
    return d + ` L${W},${alto} Z`;
  };
  return `<div class="confine confine--onda ${classe}" aria-hidden="true">
  <svg class="confine__strato confine__strato--dietro" viewBox="0 0 ${W} ${alto}" preserveAspectRatio="none"><path d="${tratto(ampiezza * 0.8, 0.7)}" fill="${colore}" opacity=".45"/></svg>
  <svg class="confine__strato" viewBox="0 0 ${W} ${alto}" preserveAspectRatio="none"><path d="${tratto(ampiezza, 0.9)}" fill="${colore}"/></svg>
</div>`;
}

export function colline({ colore, alto = 110, classe = '' }) {
  const W = 2880;
  /* colline irregolari ma periodiche su metà larghezza */
  const meta = [[0, 70], [180, 34], [420, 58], [610, 26], [860, 62], [1060, 40], [1250, 66], [1440, 70]];
  const mezzo = (off) => meta.slice(1).map(([x, y], i) => {
    const [px, py] = meta[i];
    const cx = (px + x) / 2;
    return `C${cx + off},${py} ${cx + off},${y} ${x + off},${y}`;
  }).join(' ');
  const d = `M0,${alto} L0,${meta[0][1]} ${mezzo(0)} ${mezzo(1440)} L${W},${alto} Z`;
  return `<div class="confine confine--colline ${classe}" aria-hidden="true">
  <svg class="confine__strato" viewBox="0 0 ${W} ${alto}" preserveAspectRatio="none"><path d="${d}" fill="${colore}"/></svg>
</div>`;
}

/* ================= albero che cresce (chi siamo) ================= */

export function alberoCrescita() {
  const rnd = seme(1988);
  const rami = [];
  const foglie = [];
  function ramo(x, y, ang, len, w, prof) {
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    const piega = (rnd() - 0.5) * len * 0.35;
    const cx = (x + x2) / 2 + Math.cos(ang + Math.PI / 2) * piega;
    const cy = (y + y2) / 2 + Math.sin(ang + Math.PI / 2) * piega;
    rami.push({ d: `M${f1(x)},${f1(y)} Q${f1(cx)},${f1(cy)} ${f1(x2)},${f1(y2)}`, w, prof });
    if (prof >= 5 || len < 22) {
      const n = 5 + Math.floor(rnd() * 3);
      for (let i = 0; i < n; i++) {
        foglie.push({ x: x2 + (rnd() - 0.5) * 70, y: y2 + (rnd() - 0.5) * 60, r: rnd() * 360, s: 0.8 + rnd() * 0.7, c: rnd() });
      }
      return;
    }
    const figli = prof < 1 ? 2 : 2 + (rnd() > 0.6 ? 1 : 0);
    for (let i = 0; i < figli; i++) {
      const delta = (i - (figli - 1) / 2) * (0.5 + rnd() * 0.25) + (rnd() - 0.5) * 0.2;
      ramo(x2, y2, ang + delta, len * (0.68 + rnd() * 0.12), w * 0.66, prof + 1);
    }
  }
  ramo(300, 600, -Math.PI / 2, 160, 34, 0);

  const radici = [
    'M300,600 C290,630 260,650 220,662', 'M300,600 C310,632 344,650 386,658',
    'M300,604 C300,636 296,666 288,692', 'M296,606 C276,628 244,632 214,628', 'M304,606 C330,626 360,630 392,624'
  ];
  const verdi = ['#6FA74E', '#4E9442', '#8DBE73', '#2F7A3A'];
  const foglia = (f) => `<g class="crescita__foglia" style="transform-origin:${f1(f.x)}px ${f1(f.y)}px"><g class="crescita__germoglio" data-perno="${f1(f.x)},${f1(f.y)}"><path d="M${f1(f.x)},${f1(f.y)} c8,-16 30,-22 42,-16 c-6,14 -26,24 -42,16 Z" fill="${verdi[Math.floor(f.c * 4)]}" transform="rotate(${f1(f.r)} ${f1(f.x)} ${f1(f.y)})"/></g></g>`;
  const frutti = foglie.filter((_, i) => i % 7 === 3).map((f) => `<circle class="crescita__frutto" cx="${f1(f.x + 6)}" cy="${f1(f.y + 8)}" r="7" fill="${C.sole}"/>`).join('');

  return `<svg class="crescita" viewBox="0 0 600 720" aria-hidden="true">
  <path class="crescita__terra" d="M90,606 C170,570 430,570 510,606 Z" fill="${C.prato}"/>
  <path class="crescita__linea" d="M40,602 C160,590 440,590 560,602" fill="none" stroke="${C.inchiostro}" stroke-width="3" stroke-linecap="round"/>
  <g class="crescita__radici" fill="none" stroke="#7A5A3C" stroke-linecap="round">${radici.map((d, i) => `<path d="${d}" stroke-width="${6 - i * 0.6}"/>`).join('')}</g>
  <g class="crescita__seme"><ellipse cx="300" cy="598" rx="9" ry="6" fill="#7A5A3C"/><path d="M300,594 C298,584 290,578 282,578 C286,586 292,592 300,594 Z M300,594 C304,582 314,578 322,580 C316,588 308,592 300,594 Z" fill="${C.prato}"/></g>
  <g class="crescita__rami" fill="none" stroke="#6B5038" stroke-linecap="round">
    ${rami.map((r) => `<path data-prof="${r.prof}" d="${r.d}" stroke-width="${f1(Math.max(2.4, r.w))}"/>`).join('')}
  </g>
  <g class="crescita__chioma">${foglie.map(foglia).join('')}</g>
  <g class="crescita__frutti">${frutti}</g>
</svg>`;
}

/* ================= piccole icone di servizio ================= */

export const SEGNI = {
  freccia: '<svg class="segno" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  giu: '<svg class="segno" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v15M6 13l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  telefono: '<svg class="segno" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5l3 3.4-1.8 2.3a12 12 0 0 0 7 7l2.3-1.8 3.4 3-1.6 3c-.3.6-1 .9-1.6.8C9.6 20.4 3.6 14.4 2.8 6.7c-.1-.7.2-1.3.8-1.6z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>',
  posta: '<svg class="segno" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M4 7.5l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>',
  mappa: '<svg class="segno" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.4" fill="currentColor"/></svg>',
  foglia: '<svg class="segno segno--foglia" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20C3 11 9 4 20 3c1 10-5 17-16 17z" fill="currentColor"/></svg>',
  menu: '<svg class="segno" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8c3-2 6 2 9 0s6-2 9 0M3 16c3-2 6 2 9 0s6-2 9 0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  chiudi: '<svg class="segno" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  instagram: '<svg class="segno" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor"/></svg>',
  facebook: '<svg class="segno" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4.5h-3c-2.5 0-4 1.6-4 4V11H7.5v3.5H10V21h3.5v-6.5H17l.5-3.5h-4V8.8c0-.5.2-.8.5-.8z" fill="currentColor"/></svg>'
};
