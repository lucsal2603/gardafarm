/* Mappa vera (MapLibre + OpenFreeMap, niente chiavi) ridipinta coi colori
   del marchio. La camera vola fra le due sedi seguendo lo scroll e la strada
   che le unisce si disegna mentre un segnaposto giallo la percorre. */

import { marchio } from './disegni.js';

const VERONA = [10.9071511, 45.4557998];
const VILLAFRANCA = [10.855525, 45.3391081];
const STILE = 'https://tiles.openfreemap.org/styles/liberty';
const LIB_JS = 'https://cdn.jsdelivr.net/npm/maplibre-gl@5.6.0/dist/maplibre-gl.js';
const LIB_CSS = 'https://cdn.jsdelivr.net/npm/maplibre-gl@5.6.0/dist/maplibre-gl.css';

/* fotogrammi della camera lungo lo scroll */
const CAMERA = [
  { p: 0, centro: [10.80, 45.43], zoom: 9.3, pitch: 0, bearing: 0 },
  { p: 0.12, centro: [10.86, 45.42], zoom: 10.2, pitch: 20, bearing: -6 },
  { p: 0.3, centro: VERONA, zoom: 14.6, pitch: 54, bearing: -20 },
  { p: 0.44, centro: VERONA, zoom: 15.1, pitch: 58, bearing: -34 },
  { p: 0.64, centro: VILLAFRANCA, zoom: 14.6, pitch: 54, bearing: 18 },
  { p: 0.78, centro: VILLAFRANCA, zoom: 15, pitch: 58, bearing: 32 },
  { p: 1, centro: [10.882, 45.399], zoom: 11.3, pitch: 34, bearing: 0 }
];

const C = {
  fondo: '#E8F2EF', acqua: '#0A4A6C', acquaLinea: '#2C6E8F', verde: '#C9E0B4', verdeScuro: '#A9CF8E',
  campi: '#DCEACB', edifici: '#DCE5DE', strada: '#FFFFFF', autostrada: '#F2C72E', testo: '#0F2A4F'
};

function caricaLibreria() {
  if (window.maplibregl) return Promise.resolve(window.maplibregl);
  return new Promise((ok, no) => {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = LIB_CSS; document.head.appendChild(l);
    const s = document.createElement('script');
    s.src = LIB_JS; s.async = true;
    s.onload = () => (window.maplibregl ? ok(window.maplibregl) : no(new Error('maplibre')));
    s.onerror = no;
    document.head.appendChild(s);
  });
}

function ridipingi(map) {
  const prova = (fn) => { try { fn(); } catch (e) { /* proprietà non applicabile a questo strato */ } };
  for (const l of map.getStyle().layers) {
    const id = l.id.toLowerCase();
    if (l.type === 'background') prova(() => map.setPaintProperty(l.id, 'background-color', C.fondo));
    else if (l.type === 'fill') {
      if (/water|ocean|lake|river/.test(id)) prova(() => map.setPaintProperty(l.id, 'fill-color', C.acqua));
      else if (/wood|forest|tree/.test(id)) prova(() => map.setPaintProperty(l.id, 'fill-color', C.verdeScuro));
      else if (/park|grass|meadow|scrub|landcover|garden|vineyard|orchard|farm|cemetery|pitch/.test(id)) prova(() => map.setPaintProperty(l.id, 'fill-color', C.verde));
      else if (/building/.test(id)) prova(() => map.setPaintProperty(l.id, 'fill-color', C.edifici));
      else if (/landuse|residential|industrial|commercial/.test(id)) prova(() => map.setPaintProperty(l.id, 'fill-color', C.campi));
      prova(() => map.setPaintProperty(l.id, 'fill-outline-color', 'rgba(0,0,0,0)'));
    } else if (l.type === 'fill-extrusion') {
      prova(() => map.setPaintProperty(l.id, 'fill-extrusion-color', '#E6ECE6'));
      prova(() => map.setPaintProperty(l.id, 'fill-extrusion-opacity', 0.55));
    } else if (l.type === 'line') {
      if (/water|river|stream|canal|waterway/.test(id)) prova(() => map.setPaintProperty(l.id, 'line-color', C.acquaLinea));
      else if (/motorway|trunk/.test(id)) prova(() => map.setPaintProperty(l.id, 'line-color', /casing/.test(id) ? '#D8A915' : C.autostrada));
      else if (/boundary|admin/.test(id)) prova(() => map.setLayoutProperty(l.id, 'visibility', 'none'));
      else if (/rail|transit/.test(id)) prova(() => map.setPaintProperty(l.id, 'line-color', '#C3CFCB'));
      else if (/road|street|highway|primary|secondary|tertiary|minor|service|path|track|bridge|tunnel/.test(id)) prova(() => map.setPaintProperty(l.id, 'line-color', /casing/.test(id) ? '#D3DDD8' : C.strada));
    } else if (l.type === 'symbol') {
      if (/place|city|town|village|water_name|waterway|lake/.test(id)) {
        prova(() => map.setPaintProperty(l.id, 'text-color', C.testo));
        prova(() => map.setPaintProperty(l.id, 'text-halo-color', C.fondo));
        prova(() => map.setPaintProperty(l.id, 'text-halo-width', 1.6));
      } else prova(() => map.setLayoutProperty(l.id, 'visibility', 'none'));
    }
  }
}

const lerp = (a, b, t) => a + (b - a) * t;
const dolce = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function camera(p) {
  let i = 0;
  while (i < CAMERA.length - 2 && p > CAMERA[i + 1].p) i++;
  const a = CAMERA[i], b = CAMERA[i + 1];
  const t = dolce(Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p))));
  /* in volo fra due sedi si sale un po' per vedere la strada */
  const salita = a.centro !== b.centro && a.zoom > 13 && b.zoom > 13 ? Math.sin(Math.PI * t) * 2.2 : 0;
  return {
    center: [lerp(a.centro[0], b.centro[0], t), lerp(a.centro[1], b.centro[1], t)],
    zoom: lerp(a.zoom, b.zoom, t) - salita,
    pitch: lerp(a.pitch, b.pitch, t),
    bearing: lerp(a.bearing, b.bearing, t)
  };
}

/* lunghezze cumulative del percorso, per tagliarlo a una frazione */
function misura(punti) {
  const cum = [0];
  for (let i = 1; i < punti.length; i++) {
    const [x1, y1] = punti[i - 1], [x2, y2] = punti[i];
    cum.push(cum[i - 1] + Math.hypot((x2 - x1) * Math.cos((y1 * Math.PI) / 180), y2 - y1));
  }
  return cum;
}
function taglia(punti, cum, f) {
  const L = cum[cum.length - 1] * f;
  const out = [punti[0]];
  for (let i = 1; i < punti.length; i++) {
    if (cum[i] <= L) { out.push(punti[i]); continue; }
    const t = (L - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
    out.push([lerp(punti[i - 1][0], punti[i][0], t), lerp(punti[i - 1][1], punti[i][1], t)]);
    break;
  }
  return out;
}

function spillo(nome) {
  const el = document.createElement('div');
  el.className = 'spillo';
  el.innerHTML = `<div class="spillo__giro">${marchio()}</div><span class="spillo__nome">${nome}</span>`;
  return el;
}

export async function creaMappa(contenitore, percorso) {
  const maplibregl = await caricaLibreria();
  const prova = document.createElement('canvas');
  if (!(prova.getContext('webgl2') || prova.getContext('webgl'))) throw new Error('webgl');
  const c0 = camera(0);
  const map = new maplibregl.Map({
    container: contenitore,
    style: STILE,
    center: c0.center, zoom: c0.zoom, pitch: c0.pitch, bearing: c0.bearing,
    interactive: false,
    attributionControl: { compact: true },
    fadeDuration: 0,
    maxPitch: 70
  });

  await new Promise((ok, no) => { map.once('load', ok); map.once('error', (e) => { if (!map.loaded()) no(e.error || e); }); setTimeout(() => no(new Error('timeout')), 15000); });
  ridipingi(map);

  const cum = misura(percorso);
  /* strada: un'ombra larga sotto, il tratto giallo sopra */
  map.addSource('strada', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: percorso.slice(0, 2) } } });
  map.addLayer({ id: 'strada-ombra', type: 'line', source: 'strada', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#0F2A4F', 'line-width': ['interpolate', ['linear'], ['zoom'], 9, 5, 15, 14], 'line-opacity': 0.9 } });
  map.addLayer({ id: 'strada-sole', type: 'line', source: 'strada', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#F2C72E', 'line-width': ['interpolate', ['linear'], ['zoom'], 9, 2.4, 15, 7], 'line-dasharray': [1.6, 1.4] } });

  new maplibregl.Marker({ element: spillo('Verona'), anchor: 'bottom' }).setLngLat(VERONA).addTo(map);
  new maplibregl.Marker({ element: spillo('Villafranca'), anchor: 'bottom' }).setLngLat(VILLAFRANCA).addTo(map);

  const viaggio = document.createElement('div');
  viaggio.className = 'viaggiatore';
  viaggio.style.opacity = 0;
  viaggio.style.transition = 'opacity .4s ease';
  viaggio.innerHTML = '<svg viewBox="0 0 30 26" aria-hidden="true"><path d="M3 15l3-7c.4-1 1.4-1.6 2.5-1.6h13c1.1 0 2.1.6 2.5 1.6l3 7v6.5c0 .8-.7 1.5-1.5 1.5h-2c-.8 0-1.5-.7-1.5-1.5V20H8v1.5c0 .8-.7 1.5-1.5 1.5h-2C3.7 23 3 22.3 3 21.5z" fill="#0F2A4F"/><path d="M7 14l2-5h12l2 5z" fill="#BFE0EA"/><circle cx="8" cy="17" r="1.6" fill="#F2C72E"/><circle cx="22" cy="17" r="1.6" fill="#F2C72E"/></svg>';
  const segnaposto = new maplibregl.Marker({ element: viaggio }).setLngLat(VERONA).addTo(map);

  let ultimo = -1, ultimoGiro = 0;
  return {
    map,
    aggiorna(p, giro = 0) {
      if (Math.abs(p - ultimo) < 0.0005 && Math.abs(giro - ultimoGiro) < 0.02) return;
      const nuovoTratto = Math.abs(p - ultimo) >= 0.0005;
      ultimo = p; ultimoGiro = giro;
      const cam = camera(p);
      cam.bearing += giro;
      map.jumpTo(cam);
      if (!nuovoTratto) return;
      /* la strada si disegna fra 0.4 e 0.66 del viaggio */
      const f = Math.min(1, Math.max(0.002, (p - 0.4) / 0.26));
      const tratto = taglia(percorso, cum, f);
      map.getSource('strada').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: tratto.length > 1 ? tratto : percorso.slice(0, 2) } });
      segnaposto.setLngLat(tratto[tratto.length - 1]);
      viaggio.style.opacity = p > 0.36 && p < 0.7 ? 1 : 0;
    }
  };
}
