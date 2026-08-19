// Worker de jrhm.studio.
//
// Sirve el sitio estático (binding ASSETS, ver wrangler.jsonc) y expone el
// endpoint del formulario de contacto en POST /api/contact. Al vivir en el
// mismo dominio que el sitio no hay CORS ni hosting aparte.
//
// Reemplaza al servidor Express de /backend. El runtime de Workers no puede
// abrir conexiones SMTP, así que el correo sale por la API HTTP de Resend.
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

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
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

  if (!env.RESEND_API_KEY || !env.NOTIFY_EMAIL || !env.FROM_EMAIL) {
    console.error('Faltan variables: RESEND_API_KEY / NOTIFY_EMAIL / FROM_EMAIL');
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

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/contact') {
      return handleContact(request, env);
    }

    // Todo lo demás lo resuelve el sitio estático.
    return env.ASSETS.fetch(request);
  },
};
