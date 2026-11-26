# JRHM Web Studio — Sitio

Sitio en producción: **https://jrhm.studio**

## Deploy

El sitio corre en **Cloudflare Workers** (con assets estáticos), conectado a este repo
de GitHub. No es un proyecto de Pages, aunque se le parezca: el dominio apunta al Worker
llamado `jrhmweb`. La rama de producción es **`gh-pages`** — lo que se pushea ahí se
despliega solo.

No hay build: es HTML/CSS/JS puro. `wrangler.jsonc` es la fuente de verdad de la
configuración y manda sobre lo que esté puesto en el dashboard.

## Estructura

```
├── public/              ← TODO lo que se publica en la web
│   ├── index.html       ← español (fuente)
│   ├── en/index.html    ← inglés (generado con scripts/generar-en.js)
│   ├── juegos.js · juegos.css   ← easter egg (se cargan al primer clic)
│   ├── style.css
│   ├── script.js
│   ├── assets/ · fontawesome/ · robots.txt · sitemap.xml · favicon.gif · logo.gif
├── scripts/
│   └── generar-en.js    ← genera public/en/index.html
├── src/
│   └── worker.js        ← Worker: sirve public/ y expone POST /api/contact
└── wrangler.jsonc       ← configuración del Worker
```

**Solo se publica lo que está dentro de `public/`.** Todo lo demás — el código del
Worker, este README y sobre todo `.git` — queda fuera de la web. Antes la
carpeta de assets era la raíz del repo y el historial de git completo era descargable
desde el dominio.

Si agregás un archivo nuevo al sitio, va en `public/`. Si lo dejás en la raíz, no se
publica.

## Idiomas (español e inglés)

El sitio tiene dos páginas reales para que Google indexe cada idioma por separado:

- `/` → `public/index.html` (español). **Es la fuente**: aquí se editan los textos y la estructura.
- `/en/` → `public/en/index.html` (inglés). **Se genera**, no se edita a mano.

El inglés sale de copiar `public/index.html` sustituyendo cada texto marcado con
`data-i18n` por su traducción del diccionario de `public/script.js`. Cada vez que se
cambie el HTML de español o alguna traducción, hay que regenerarlo:

```
node scripts/generar-en.js
```

(No necesita instalar nada, solo Node.) El script avisa si falta alguna traducción.
El selector ES/EN de la barra son enlaces a una u otra página, y la analítica y los
juegos usan el idioma de la página.

## Analítica (Google Tag Manager)

El contenedor GTM ya está en la página; el sitio solo emite eventos al `dataLayer` y
nunca envía datos personales. Para usarlos hay que crear en GTM disparadores de tipo
"Evento personalizado" con estos nombres:

| Evento | Cuándo | Datos |
|---|---|---|
| `contacto_click` | clic en WhatsApp o correo | `metodo`, `lugar` |
| `formulario_enviado` / `formulario_error` | envío del formulario | `servicio`, `idioma` / `tipo` |
| `proyecto_click` | clic en un proyecto | `proyecto`, `url` |
| `proyecto_vista_previa` | primera vez que se pasa el cursor por un proyecto | `proyecto` |
| `seccion_vista` | primera vez que se ve cada sección | `seccion` |
| `menu_click` / `hero_click` | clic en el menú o en los botones del hero | `destino` |
| `idioma_cambiado` / `tema_cambiado` | cambio de idioma o de tema | `idioma` / `tema` |
| `juegos_abierto` / `juego_elegido` / `juego_terminado` | easter egg de los juegos | `juego`, `resultado` |

## Formulario de contacto

Vive en `src/worker.js` y se sirve en `https://jrhm.studio/api/contact` — mismo dominio
que el sitio, así que no hay CORS ni hosting aparte.

El runtime de Workers no puede abrir conexiones SMTP, por eso el correo sale por la API
HTTP de [Resend](https://resend.com) en vez de nodemailer.

### Variables de entorno

Viven en el dashboard, no en el repo: **Workers & Pages** (o **Compute (Workers)**) →
Worker **jrhmweb** → **Settings** → **Variables and Secrets**.

| Variable | Tipo | Qué es |
|---|---|---|
| `RESEND_API_KEY` | Secret | API key de Resend, con permiso *Sending access* y acotada a `jrhm.studio` |
| `NOTIFY_EMAIL` | Variable | A dónde llegan los mensajes del formulario |
| `FROM_EMAIL` | Variable | Remitente. `JRHM Web Studio <hello@jrhm.studio>` |

**Por qué `wrangler.jsonc` lleva `keep_vars: true`:** por defecto, `wrangler deploy`
borra del Worker toda variable de texto plano que no esté declarada en el archivo de
configuración. Como estas viven en el dashboard, sin esa línea el primer despliegue
las dejaría vacías y el formulario respondería 500. Los Secrets nunca se tocan; el
flag es para las otras dos.

### Remitente y verificación del dominio

Resend solo deja enviar desde un dominio verificado, con sus registros DKIM y SPF en
el DNS de Cloudflare. `jrhm.studio` ya lo está.

Si alguna vez hay que enviar antes de verificar un dominio, la salida provisional es
poner `onboarding@resend.dev` en `FROM_EMAIL`: es el remitente de pruebas de Resend y
solo entrega al correo con el que se registró la cuenta.

### Probar en local

```bash
npx wrangler dev
```

Levanta el sitio y el endpoint juntos en `http://localhost:8787`. Las variables se leen
de un `.dev.vars` en la raíz (ignorado por git):

```
RESEND_API_KEY=re_...
NOTIFY_EMAIL=hola@ejemplo.com
FROM_EMAIL=JRHM Web Studio <hello@jrhm.studio>
```

Wrangler no recarga `.dev.vars` en caliente: si lo editás, reiniciá el server.

### Respuestas del endpoint

| Código | Cuándo |
|---|---|
| 200 | Enviado |
| 400 | Falló la validación, o el JSON venía roto |
| 405 | Method distinto de POST |
| 429 | Más de 3 envíos por IP en un minuto |
| 500 | Faltan variables de entorno |
| 502 | Resend rechazó el envío (key inválida, dominio sin verificar) |

## Pendientes

- El repo tiene tres ramas (`gh-pages` con el sitio real, `main` prácticamente vacía y
  `master` vieja). Conviene consolidar en una sola.
- `CNAME` es un remanente de GitHub Pages; ya no lo usa nadie.
