require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));

// Evita spam: máximo 5 envíos por IP cada 15 minutos
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos. Probá de nuevo más tarde.' },
});

// ===== Transportador de email =====
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ===== Validación =====
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;

function validatePayload(body) {
  const errors = [];
  const { name, email, phone, service, message } = body;

  if (!name || name.trim().length < 2) errors.push('El nombre es inválido.');

  const hasEmail = email && email.trim() !== '';
  const hasPhone = phone && phone.trim() !== '';

  if (!hasEmail && !hasPhone) {
    errors.push('Necesitamos un email o un teléfono de contacto.');
  }
  if (hasEmail && !emailRegex.test(email.trim())) errors.push('El email es inválido.');
  if (hasPhone && !phoneRegex.test(phone.trim())) errors.push('El teléfono es inválido.');

  if (!service || service.trim() === '') errors.push('Seleccioná un tipo de servicio.');
  if (!message || message.trim().length < 10) errors.push('El mensaje es demasiado corto.');

  return errors;
}

// ===== Endpoint principal =====
app.post('/api/contact', contactLimiter, async (req, res) => {
  const errors = validatePayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(' ') });
  }

  const { name, email, phone, service, message } = req.body;
  const contactLine = [email, phone].filter(Boolean).join(' · ');

  try {
    await transporter.sendMail({
      from: `"JRHM Web Studio" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      replyTo: email || undefined,
      subject: `Nuevo mensaje de ${name} — ${service}`,
      text: `Nombre: ${name}\nContacto: ${contactLine}\nServicio: ${service}\n\nMensaje:\n${message}`,
      html: `
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Contacto:</strong> ${contactLine}</p>
        <p><strong>Servicio de interés:</strong> ${service}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error al enviar el email:', err.message);
    res.status(500).json({ error: 'No pudimos enviar tu mensaje. Intentá de nuevo en un momento.' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
