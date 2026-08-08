// ===== Año en footer =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Mostrar más proyectos =====
const projectsToggle = document.getElementById('projects-toggle');
const extraProjects = document.querySelectorAll('.project--extra');

if (projectsToggle) {
  projectsToggle.addEventListener('click', () => {
    const expanded = projectsToggle.getAttribute('aria-expanded') === 'true';
    extraProjects.forEach((project) => project.classList.toggle('is-visible', !expanded));
    projectsToggle.setAttribute('aria-expanded', String(!expanded));
    projectsToggle.querySelector('span').textContent = expanded ? 'Mostrar más' : 'Mostrar menos';

    if (expanded) {
      document.getElementById('proyectos').scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// ===== Formulario de contacto =====
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

// Cambiá esto por la URL real de tu backend cuando lo despliegues
const API_URL = 'http://localhost:3000/api/contact';

function showError(field, message) {
  const row = form.querySelector(`#${field}`).closest('.form__row');
  const errorEl = row.querySelector('.form__error');
  if (message) {
    row.classList.add('has-error');
    errorEl.textContent = message;
  } else {
    row.classList.remove('has-error');
    errorEl.textContent = '';
  }
}

function clearError(field) {
  showError(field, '');
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Acepta formatos comunes: +52 667 123 4567, (667) 123-4567, 6671234567, etc.
const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;

function validateForm() {
  let isValid = true;

  const name = form.name.value.trim();
  if (name.length < 2) {
    showError('name', 'Ingresá al menos 2 caracteres');
    isValid = false;
  } else {
    clearError('name');
  }

  const email = form.email.value.trim();
  const phone = form.phone.value.trim();

  const emailOk = email === '' || emailRegex.test(email);
  const phoneOk = phone === '' || phoneRegex.test(phone);

  if (!emailOk) {
    showError('email', 'Ingresá un email válido');
    isValid = false;
  } else {
    clearError('email');
  }

  if (!phoneOk) {
    showError('phone', 'Ingresá un teléfono válido');
    isValid = false;
  } else {
    clearError('phone');
  }

  if (email === '' && phone === '') {
    showError('email', 'Dejanos un email o un teléfono');
    isValid = false;
  }

  const service = form.service.value;
  if (!service) {
    showError('service', 'Seleccioná una opción');
    isValid = false;
  } else {
    clearError('service');
  }

  const message = form.message.value.trim();
  if (message.length < 10) {
    showError('message', 'Contanos un poco más (mínimo 10 caracteres)');
    isValid = false;
  } else {
    clearError('message');
  }

  return isValid;
}

['name', 'email', 'phone', 'service', 'message'].forEach((field) => {
  const el = form.querySelector(`#${field}`);
  const evt = field === 'service' ? 'change' : 'blur';
  el.addEventListener(evt, validateForm);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    statusEl.textContent = 'Revisá los campos marcados en rojo.';
    statusEl.dataset.state = 'error';
    return;
  }

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    service: form.service.value,
    message: form.message.value.trim(),
  };

  submitBtn.disabled = true;
  submitBtn.querySelector('.btn__label').textContent = 'Enviando...';
  statusEl.textContent = '';
  statusEl.dataset.state = '';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Algo salió mal en el servidor.');
    }

    statusEl.textContent = '¡Mensaje enviado! Te vamos a responder pronto.';
    statusEl.dataset.state = 'success';
    form.reset();
  } catch (err) {
    statusEl.textContent = err.message.includes('fetch')
      ? 'No pudimos conectarnos al servidor. ¿Está corriendo el backend?'
      : err.message;
    statusEl.dataset.state = 'error';
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn__label').textContent = 'Enviar mensaje';
  }
});
