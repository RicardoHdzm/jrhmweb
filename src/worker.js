// Worker de jrhm.studio.
//
// Sirve el sitio estático (binding ASSETS, ver wrangler.jsonc) y expone el
// endpoint del formulario de contacto en POST /api/contact. Al vivir en el
// mismo dominio que el sitio no hay CORS ni hosting aparte.
//
// El runtime de Workers no puede abrir conexiones SMTP, así que el correo
// sale por la API HTTP de Resend en vez de por nodemailer.
//
// Variables (dashboard → Worker jrhmweb → Settings → Variables and Secrets):
//   RESEND_API_KEY  — Secret. API key de https://resend.com
//   NOTIFY_EMAIL    — a dónde llegan los mensajes del formulario
//   FROM_EMAIL      — remitente en un dominio verificado en Resend
//                     (ej. "JRHM Web Studio <hello@jrhm.studio>")

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;

// El sitio es bilingüe: el frontend manda `lang` y el error vuelve en ese idioma.
const MESSAGES = {
  es: {
    badRequest: 'Petición inválida.',
    methodNotAllowed: 'Método no permitido.',
    name: 'El nombre es inválido.',
    contact: 'Necesitamos un email o un teléfono de contacto.',
    email: 'El email es inválido.',
    phone: 'El teléfono es inválido.',
    service: 'Selecciona un tipo de servicio.',
    message: 'El mensaje es demasiado corto.',
    sendFailed: 'No pudimos enviar tu mensaje. Intenta de nuevo en un momento.',
    tooMany: 'Demasiados envíos seguidos. Espera un minuto y vuelve a intentarlo.',
  },
  en: {
    badRequest: 'Invalid request.',
    methodNotAllowed: 'Method not allowed.',
    name: 'That name is not valid.',
    contact: 'We need an email address or a phone number.',
    email: 'That email address is not valid.',
    phone: 'That phone number is not valid.',
    service: 'Select a type of service.',
    message: 'That message is too short.',
    sendFailed: "We couldn't send your message. Please try again in a moment.",
    tooMany: 'Too many submissions in a row. Wait a minute and try again.',
  },
};

function messagesFor(lang) {
  return lang === 'en' ? MESSAGES.en : MESSAGES.es;
}

function validatePayload({ name, email, phone, service, message }, m) {
  const errors = [];

  if (!name || name.trim().length < 2) errors.push(m.name);

  const hasEmail = email && email.trim() !== '';
  const hasPhone = phone && phone.trim() !== '';

  if (!hasEmail && !hasPhone) {
    errors.push(m.contact);
  }
  if (hasEmail && !emailRegex.test(email.trim())) errors.push(m.email);
  if (hasPhone && !phoneRegex.test(phone.trim())) errors.push(m.phone);

  if (!service || service.trim() === '') errors.push(m.service);
  if (!message || message.trim().length < 10) errors.push(m.message);

  return errors;
}

// Lo que escribe un desconocido termina dentro de un email HTML: hay que escaparlo.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

async function handleContact(request, env) {
  if (request.method !== 'POST') {
    return json({ error: MESSAGES.es.methodNotAllowed }, 405);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: MESSAGES.es.badRequest }, 400);
  }

  const m = messagesFor(payload && payload.lang);
  const errors = validatePayload(payload, m);
  if (errors.length > 0) {
    return json({ error: errors.join(' ') }, 400);
  }

  const name = payload.name.trim();
  const email = (payload.email || '').trim();
  const phone = (payload.phone || '').trim();
  const service = payload.service.trim();
  const message = payload.message.trim();
  const contactLine = [email, phone].filter(Boolean).join(' · ');

  // Decir cuáles faltan, no solo que falta algo: si no, un 500 aquí obliga a
  // adivinar. Solo los nombres — los valores no se registran nunca.
  // El límite se comprueba después de validar, no antes: así alguien que
  // corrige errores del formulario no gasta intentos. Al spam le da igual,
  // porque manda payloads válidos.
  if (env.CONTACT_LIMITER) {
    const ip = request.headers.get('CF-Connecting-IP') || 'desconocida';
    const { success } = await env.CONTACT_LIMITER.limit({ key: ip });
    if (!success) {
      return json({ error: m.tooMany }, 429, { 'Retry-After': '60' });
    }
  }

  const faltantes = ['RESEND_API_KEY', 'NOTIFY_EMAIL', 'FROM_EMAIL'].filter((v) => !env[v]);
  if (faltantes.length > 0) {
    console.error('Faltan variables de entorno en el Worker: ' + faltantes.join(', '));
    return json({ error: m.sendFailed }, 500);
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL,
        to: [env.NOTIFY_EMAIL],
        reply_to: email || undefined,
        subject: `Nuevo mensaje de ${name} — ${service}`,
        text: `Nombre: ${name}\nContacto: ${contactLine}\nServicio: ${service}\n\nMensaje:\n${message}`,
        html: `
          <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
          <p><strong>Contacto:</strong> ${escapeHtml(contactLine)}</p>
          <p><strong>Servicio de interés:</strong> ${escapeHtml(service)}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    if (!res.ok) {
      console.error('Resend respondió', res.status, await res.text());
      return json({ error: m.sendFailed }, 502);
    }

    return json({ success: true });
  } catch (err) {
    console.error('Error al enviar el email:', err.message);
    return json({ error: m.sendFailed }, 500);
  }
}

// Videos de los proyectos (public/assets/projects/*.mp4).
//
// El servicio de archivos estáticos de Cloudflare responde siempre con el archivo
// entero y sin `Accept-Ranges`. Chrome lo tolera, pero Safari exige peticiones por
// rangos (bytes=a-b) para reproducir un <video>, así que sin esto los videos podrían
// no verse ahí. wrangler.jsonc hace que el Worker atienda solo estas rutas
// (run_worker_first); aquí se leen del almacén de assets y se devuelve el trozo pedido.
const CACHE_VIDEO = 'public, max-age=86400, stale-while-revalidate=604800';

async function servirVideo(request, env) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return env.ASSETS.fetch(request);

  // Se pide el archivo completo (sin Range) al almacén de assets.
  const completo = await env.ASSETS.fetch(new Request(request.url, { method: 'GET' }));
  if (!completo.ok) return completo;
  const datos = await completo.arrayBuffer();
  const total = datos.byteLength;
  const etag = completo.headers.get('ETag');

  const cabeceras = {
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Cache-Control': CACHE_VIDEO,
  };
  if (etag) cabeceras.ETag = etag;
  const cuerpo = (buf) => (request.method === 'HEAD' ? null : buf);

  const rango = request.headers.get('Range');
  const m = rango ? /^bytes=(\d*)-(\d*)$/.exec(rango.trim()) : null;

  // Sin rango (o con uno que no sabemos leer): el archivo entero, que es lo que
  // permite el estándar. Si el navegador ya lo tiene (ETag), 304.
  if (!m || (m[1] === '' && m[2] === '')) {
    if (etag && request.headers.get('If-None-Match') === etag) {
      return new Response(null, { status: 304, headers: cabeceras });
    }
    return new Response(cuerpo(datos), {
      status: 200,
      headers: { ...cabeceras, 'Content-Length': String(total) },
    });
  }

  let inicio;
  let fin;
  if (m[1] === '') {
    // "bytes=-N": los últimos N bytes.
    inicio = Math.max(0, total - parseInt(m[2], 10));
    fin = total - 1;
  } else {
    inicio = parseInt(m[1], 10);
    fin = m[2] === '' ? total - 1 : Math.min(parseInt(m[2], 10), total - 1);
  }
  if (inicio >= total || inicio > fin) {
    return new Response(null, { status: 416, headers: { ...cabeceras, 'Content-Range': `bytes */${total}` } });
  }
  return new Response(cuerpo(datos.slice(inicio, fin + 1)), {
    status: 206,
    headers: {
      ...cabeceras,
      'Content-Range': `bytes ${inicio}-${fin}/${total}`,
      'Content-Length': String(fin - inicio + 1),
    },
  });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/contact') {
      return handleContact(request, env);
    }

    if (pathname.startsWith('/assets/projects/') && pathname.endsWith('.mp4')) {
      return servirVideo(request, env);
    }

    // Todo lo demás lo resuelve el sitio estático.
    return env.ASSETS.fetch(request);
  },
};
