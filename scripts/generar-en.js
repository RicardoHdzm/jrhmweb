// Genera public/en/index.html (versión en inglés) a partir de public/index.html.
//
// Por qué existe: el sitio es bilingüe y, para que Google indexe el inglés, el inglés
// tiene que estar en el HTML y no aplicarse con JavaScript. public/index.html es la
// fuente (español); este script copia ese HTML sustituyendo cada texto marcado con
// data-i18n por su traducción del diccionario de public/script.js, y ajusta lo que es
// específico de cada idioma (lang, título, descripción, canonical, Open Graph...).
//
// Uso (desde la raíz del repositorio, cada vez que se edite public/index.html o las
// traducciones de public/script.js):
//
//   node scripts/generar-en.js
//
// No necesita instalar nada: solo Node.

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const ORIGEN = path.join(RAIZ, 'public', 'index.html');
const SCRIPT = path.join(RAIZ, 'public', 'script.js');
const DESTINO = path.join(RAIZ, 'public', 'en', 'index.html');
const URL_ES = 'https://jrhm.studio/';
const URL_EN = 'https://jrhm.studio/en/';

const normaliza = (s) => s.replace(/\r\n/g, '\n');

// --- Diccionario: se evalúa el objeto `translations` de script.js ---
const js = normaliza(fs.readFileSync(SCRIPT, 'utf8'));
const ini = js.indexOf('const translations = {');
const fin = js.indexOf('\n};', ini);
if (ini < 0 || fin < 0) throw new Error('No encuentro el diccionario `translations` en public/script.js');
const tr = eval('(' + js.slice(ini + 'const translations = '.length, fin + 2) + ')'); // eslint-disable-line no-eval
const en = tr.en;
const es = tr.es;

const escapa = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapaAttr = (s) => escapa(s).replace(/"/g, '&quot;');

let h = normaliza(fs.readFileSync(ORIGEN, 'utf8'));
const faltan = new Set();
let n = 0;

// 1. Idioma del documento
h = h.replace('<html lang="es">', '<html lang="en">');

// 2. Cabecera: título, descripción, canonical, Open Graph, Twitter
const t = en['meta.title'];
const d = en['meta.description'];
h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapa(t)}</title>`);
const meta = (pat, valor) => {
  const re = new RegExp(`(<meta ${pat} content=")[^"]*(">)`);
  if (!re.test(h)) throw new Error('No encuentro la etiqueta meta ' + pat);
  h = h.replace(re, `$1${escapaAttr(valor)}$2`);
};
meta('name="description"', d);
meta('property="og:title"', t);
meta('property="og:description"', d);
meta('property="og:url"', URL_EN);
meta('property="og:locale"', 'en_US');
meta('property="og:locale:alternate"', 'es_MX');
meta('name="twitter:title"', t);
meta('name="twitter:description"', d);
h = h.replace(`<link rel="canonical" href="${URL_ES}">`, `<link rel="canonical" href="${URL_EN}">`);
if (!h.includes(`<link rel="canonical" href="${URL_EN}">`)) throw new Error('No pude cambiar el canonical');

// 3. Datos estructurados
h = h.replace(/("description": ")[^"]*(")/, `$1${en['meta.description'].replace(/"/g, '\\"')}$2`);
h = h.replace('"@type": "ProfessionalService",', '"@type": "ProfessionalService",\n  "inLanguage": "en",\n  "url": "' + URL_EN + '",');

// 4. Textos marcados con data-i18n (su contenido es solo texto, sin etiquetas dentro)
h = h.replace(/(<([a-z0-9]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g, (m, abre, _tag, clave, _viejo, cierra) => {
  const v = en[clave];
  if (v === undefined) { faltan.add(clave); return m; }
  n++;
  return abre + escapa(v) + cierra;
});

// 5. Etiquetas aria traducibles (data-i18n-label) y el botón de tema
h = h.replace(/<[^<>]*\bdata-i18n-label="([^"]+)"[^<>]*>/g, (tag, clave) => {
  const v = en[clave];
  if (v === undefined) { faltan.add(clave); return tag; }
  return tag.replace(/aria-label="[^"]*"/, `aria-label="${escapaAttr(v)}"`);
});
h = h.replace(`aria-label="${es['theme.toLight']}"`, `aria-label="${escapaAttr(en['theme.toLight'])}"`);

// 6. Texto alternativo de las capturas de proyectos: "Sitio web de X" -> "X website"
h = h.replace(/alt="Sitio web de ([^"]+)"/g, 'alt="$1 website"');

// 7. Selector de idioma: en esta página el activo es EN
h = h.replace('class="lang-switch__btn is-active" data-lang="es" href="/" hreflang="es" lang="es" aria-current="true"', 'class="lang-switch__btn" data-lang="es" href="/" hreflang="es" lang="es"');
h = h.replace('class="lang-switch__btn" data-lang="en" href="/en/" hreflang="en" lang="en"', 'class="lang-switch__btn is-active" data-lang="en" href="/en/" hreflang="en" lang="en" aria-current="true"');

// --- Comprobaciones ---
if (faltan.size) throw new Error('Claves sin traducción al inglés: ' + Array.from(faltan).join(', '));
if (!h.includes('<html lang="en">')) throw new Error('No se aplicó lang="en"');

fs.mkdirSync(path.dirname(DESTINO), { recursive: true });
fs.writeFileSync(DESTINO, h);

// Aviso: texto visible que aún parece español (nombres propios como Culiacán son normales).
const visible = h.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, '\n');
const sospechosos = Array.from(new Set(visible.split('\n').map((s) => s.trim()).filter((s) => /[áéíóúñ¿¡]/i.test(s))));
console.log(`public/en/index.html generado: ${n} textos traducidos.`);
if (sospechosos.length) console.log('Revisar (texto con acentos o signos del español):\n  - ' + sospechosos.join('\n  - '));
