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
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── assets/ · fontawesome/ · robots.txt · sitemap.xml · favicon.gif · logo.gif
├── src/
│   └── worker.js        ← Worker: sirve public/ y expone POST /api/contact
├── wrangler.jsonc       ← configuración del Worker
└── backend/             ← LEGADO: servidor Express, ya no se usa
```

**Solo se publica lo que está dentro de `public/`.** Todo lo demás — el código del
Worker, este README, `backend/` y sobre todo `.git` — queda fuera de la web. Antes la
carpeta de assets era la raíz del repo y el historial de git completo era descargable
desde el dominio.

Si agregás un archivo nuevo al sitio, va en `public/`. Si lo dejás en la raíz, no se
publica.

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
| 500 | Faltan variables de entorno |
| 502 | Resend rechazó el envío (key inválida, dominio sin verificar) |

## Sobre el scroll de pantalla completa

En escritorio (ventanas de 901px de ancho o más), cada sección ocupa el alto disponible bajo
el nav y el scroll "engancha" (scroll-snap) directo a la siguiente sección. En mobile esto se
desactiva y el scroll vuelve a ser normal, porque el scroll-snap con alturas de pantalla completa
suele dar problemas en navegadores móviles (la barra de direcciones cambia el alto disponible).

Si en alguna pantalla el contenido de una sección es más alto que la ventana (por ejemplo, una
laptop con poca altura de pantalla), esa sección simplemente crece un poco más allá del 100% en
vez de recortar contenido — el scroll-snap se sigue enganchando al inicio de cada sección igual.

## Pendientes

- No hay rate limiting en el formulario. El Express viejo tenía 5 envíos por IP cada 15
  minutos; en Workers un contador en memoria no sirve porque cada request puede caer en
  un isolate distinto. Lo equivalente es una regla de Rate Limiting en el WAF de
  Cloudflare sobre `/api/contact` (el plan gratuito incluye una).
- `backend/` quedó sin uso; se puede borrar cuando confirmes que el endpoint nuevo anda.
- El repo tiene tres ramas (`gh-pages` con el sitio real, `main` prácticamente vacía y
  `master` vieja). Conviene consolidar en una sola.
- `CNAME` es un remanente de GitHub Pages; ya no lo usa nadie.
