// ===== Año en footer =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Link activo del nav según la sección visible =====
// Se toma la última sección, en orden del documento, cuyo borde superior ya pasó
// la mitad de la ventana. El hero se incluye para apagar el enlace activo arriba
// del todo.
const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
const navSections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean)
  .concat(document.getElementById('home') || [])
  .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

let navPendiente = false;
function actualizarNavActivo() {
  navPendiente = false;
  let activa = null;
  navSections.forEach((s) => {
    if (s.getBoundingClientRect().top <= window.innerHeight * 0.5) activa = s;
  });
  const href = activa ? '#' + activa.id : '';
  navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === href));
}
function pedirNavActivo() {
  if (navPendiente) return;
  navPendiente = true;
  requestAnimationFrame(actualizarNavActivo);
}
if (navSections.length) {
  window.addEventListener('scroll', pedirNavActivo, { passive: true });
  window.addEventListener('resize', pedirNavActivo);
  actualizarNavActivo();
}

// ===== Modo claro/oscuro =====
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// El aria-label depende del idioma. Va aparte de applyTheme porque esa corre
// al cargar la página, cuando el diccionario de traducciones todavía no existe.
function updateThemeLabel() {
  if (!themeToggle) return;
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  themeToggle.setAttribute('aria-label', t(isDark ? 'theme.toLight' : 'theme.toDark'));
}

applyTheme(localStorage.getItem('theme') || 'dark');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
    updateThemeLabel();
  });
}

// ===== Idioma (ES/EN) =====
const translations = {
  es: {
    'nav.proyectos': 'Proyectos',
    'nav.servicios': 'Servicios',
    'nav.proceso': 'Proceso',
    'nav.contacto': 'Contacto',
    'hero.tag': 'Estudio de diseño y desarrollo web',
    'hero.title': 'Sitios web a medida, diseñados y programados desde cero',
    'hero.sub': 'JRHM.STUDIO es un estudio de diseño y desarrollo web. Trabajamos con negocios en México y Estados Unidos: restaurantes, empresas de servicios y distribuidoras, desde una página sencilla hasta una tienda en línea.',
    'hero.btnWork': 'Ver proyectos',
    'hero.btnContact': 'Escríbenos',
    'projects.label': 'Proyectos',
    'services.label': 'Servicios',
    'service.design.title': 'Diseño 100% personalizado',
    'service.multipage.title': 'Sitios multi-página',
    'service.ecommerce.title': 'E-commerce en Shopify',
    'service.forms.title': 'Formularios e integraciones',
    'service.seo.title': 'Optimización SEO',
    'service.maintenance.title': 'Mantenimiento y soporte',
    'service.design.desc': 'Cada sitio se diseña desde cero para tu marca, sin plantillas genéricas ni soluciones prefabricadas.',
    'service.multipage.desc': 'Desde una landing de una sola sección hasta sitios con varias páginas conectadas entre sí.',
    'service.ecommerce.desc': 'Tiendas en línea completas (catálogo, pagos y envíos) para que empieces a vender sin complicaciones.',
    'service.forms.desc': 'Formularios de contacto que llegan directo a tu email, más integración con WhatsApp.',
    'service.seo.desc': 'Buenas prácticas técnicas (velocidad, metadatos y estructura) para que te encuentren en Google.',
    'service.maintenance.desc': 'Actualizaciones, mejoras continuas y acompañamiento después del lanzamiento.',
    'process.label': 'Proceso',
    'process.step1.title': 'Contacto',
    'process.step2.title': 'Propuesta',
    'process.step3.title': 'Diseño y desarrollo',
    'process.step4.title': 'Revisión y entrega',
    'process.step1.desc': 'Nos escribes por WhatsApp o correo y nos cuentas qué necesita tu negocio: un sitio nuevo, un rediseño o algo puntual. Te respondemos en menos de 24 horas.',
    'process.step2.desc': 'Te armamos una propuesta clara acorde a tus necesidades, tiempo de entrega y costo del proyecto, para que sepas exactamente qué esperar antes de arrancar.',
    'process.step3.desc': 'Diseñamos y desarrollamos tu sitio, lo probamos tanto en escritorio como en móvil, asegurando que la estructura y la experiencia queden impecables.',
    'process.step4.desc': 'Te presentamos el resultado final para que lo pruebes, aplicamos los ajustes necesarios y lanzamos el sitio oficialmente para que empiece a funcionar.',
    'contact.label': 'Contacto',
    'contact.title': 'Hablemos de tu proyecto',
    'contact.sub': 'Cuéntanos qué necesitas, ya sea empezar de cero, renovar tu sitio actual, o sumarle algo que le falta, y te respondemos en menos de 24 horas. Sin compromisos: primero entendemos tu proyecto, después te decimos cómo lo resolvemos.',
    'contact.whatsapp': 'WhatsApp',
    'form.name': 'Nombre',
    'form.phone': 'Teléfono',
    'form.message': 'Mensaje',
    'form.help': '¿En qué te podemos ayudar?',
    'form.option': 'Selecciona una opción',
    'form.option1': 'Necesito un sitio web',
    'form.option2': 'Rediseño de mi sitio actual',
    'form.option3': 'E-commerce en Shopify',
    'form.option4': 'Formularios & Integraciones',
    'form.option5': 'Optimización SEO',
    'form.option6': 'Mantenimiento & Soporte',
    'form.option7': 'Otro',
    'form.button': 'Enviar mensaje',
    'form.sending': 'Enviando...',
    'form.err.name': 'Ingresa al menos 2 caracteres',
    'form.err.email': 'Ingresa un email válido',
    'form.err.phone': 'Ingresa un teléfono válido',
    'form.err.contact': 'Déjanos un email o un teléfono',
    'form.err.service': 'Selecciona una opción',
    'form.err.message': 'Cuéntanos un poco más (mínimo 10 caracteres)',
    'form.status.invalid': 'Revisa los campos marcados en rojo.',
    'form.status.success': '¡Mensaje enviado! Te vamos a responder pronto.',
    'form.status.network': 'No pudimos conectarnos. Revisa tu conexión e intenta de nuevo.',
    'form.status.generic': 'Algo salió mal. Intenta de nuevo en un momento.',
    'footer.top': 'Volver arriba',
    'theme.toLight': 'Cambiar a modo claro',
    'theme.toDark': 'Cambiar a modo oscuro',
    'meta.title': 'JRHM.STUDIO | Diseño & Desarrollo Web',
    'meta.description': 'Diseño y desarrollo de sitios web a medida: landing pages, sitios multi-página y e-commerce en Shopify. Creamos sitios web que hacen crecer tu negocio.',
    'project.altogroup.desc': 'Grupo restaurantero dueño de las marcas Mito, Zoukmaya y Los Grandes.',
    'project.mito.desc': 'Restaurante dedicado a la tradición, el sabor y el entretenimiento, en tributo a la gastronomía latinoamericana.',
    'project.zoukmaya.desc': 'Restaurante latinoamericano en Forest Lake, Minnesota, con ambiente vibrante y sabores auténticos.',
    'project.losgrandes.desc': 'Restaurante y bar que celebra la cocina mexicana con mariscos, música en vivo y gran ambiente en Burnsville, Minnesota.',
    'project.limman.desc': 'Empresa de limpieza con más de 50 años de experiencia en Culiacán, Sinaloa, atendiendo clientes comerciales, gubernamentales y residenciales.',
    'project.bionutrients.desc': 'Distribuidora de ingredientes activos y funcionales para la industria de suplementos.',
    'project.patron.desc': 'Empresa líder en comercialización y almacenamiento de granos en México desde 1989.',
    'project.mangos.desc': 'Empresa dedicada al cultivo, empaque y distribución de mango en Sinaloa.',
    'project.qabu.desc': 'Desarrollo residencial boutique en Mazatlán, con departamentos y planes de financiamiento a medida.',
    'project.caeti.desc': 'Empresa mexicana de tecnología especializada en gestión de datos, ciberseguridad e inteligencia analítica para clientes de gobierno y sector privado.',
    'projects.view': '[Ver proyecto]',
    'project.tags': 'Diseño + Desarrollo',
    'hero.status': 'Disponible para nuevos proyectos',
    'hero.place': 'Culiacán, MX',
  },
  en: {
    'nav.proyectos': 'Projects',
    'nav.servicios': 'Services',
    'nav.proceso': 'Process',
    'nav.contacto': 'Contact',
    'hero.tag': 'Web design & development studio',
    'hero.title': 'Custom websites, designed and programmed from scratch',
    'hero.sub': 'JRHM.STUDIO is a web design and development studio. We work with businesses in Mexico and the United States: restaurants, service companies and distributors, from a simple page to a full online store.',
    'hero.btnWork': 'See projects',
    'hero.btnContact': 'Get in touch',
    'projects.label': 'Projects',
    'services.label': 'Services',
    'service.design.title': '100% custom design',
    'service.multipage.title': 'Multi-page sites',
    'service.ecommerce.title': 'Shopify e-commerce',
    'service.forms.title': 'Forms & integrations',
    'service.seo.title': 'SEO optimization',
    'service.maintenance.title': 'Maintenance & support',
    'service.design.desc': 'Every site is designed from scratch for your brand, no generic templates or prefab solutions.',
    'service.multipage.desc': 'From a single-section landing page to sites with several pages linked together.',
    'service.ecommerce.desc': 'Full online stores (catalog, payments, and shipping) so you can start selling without the hassle.',
    'service.forms.desc': 'Contact forms that land straight in your inbox, plus WhatsApp integration.',
    'service.seo.desc': 'Solid technical practices (speed, metadata, and structure) so people can find you on Google.',
    'service.maintenance.desc': 'Updates, ongoing improvements, and support after launch.',
    'process.label': 'Process',
    'process.step1.title': 'Contact',
    'process.step2.title': 'Proposal',
    'process.step3.title': 'Design & development',
    'process.step4.title': 'Review & delivery',
    'process.step1.desc': 'You reach out on WhatsApp or email and tell us what your business needs: a new site, a redesign, or something specific. We reply within 24 hours.',
    'process.step2.desc': 'We put together a clear proposal based on your needs, delivery timeline, and project cost, so you know exactly what to expect before we start.',
    'process.step3.desc': 'We design and develop your site, testing it on both desktop and mobile, ensuring the structure and experience turn out flawless.',
    'process.step4.desc': 'We present the final result for you to test, apply any necessary adjustments, and officially launch the site so it can start working for you.',
    'contact.label': 'Contact',
    'contact.title': 'Let\'s talk about your project',
    'contact.sub': 'Tell us what you need, whether it\'s starting from scratch, refreshing your current site, or adding something it\'s missing, and we\'ll get back to you in under 24 hours. No strings attached: we start by understanding your project, then tell you how we\'ll solve it.',
    'contact.whatsapp': 'WhatsApp',
    'form.name': 'Name',
    'form.phone': 'Phone',
    'form.message': 'Message',
    'form.help': 'How can we help you?',
    'form.option': 'Select an option',
    'form.option1': 'I need a website',
    'form.option2': 'Redesign my current website',
    'form.option3': 'Shopify E-commerce',
    'form.option4': 'Forms & Integrations',
    'form.option5': 'SEO Optimization',
    'form.option6': 'Maintenance & Support',
    'form.option7': 'Other',
    'form.button': 'Send message',
    'form.sending': 'Sending...',
    'form.err.name': 'Enter at least 2 characters',
    'form.err.email': 'Enter a valid email address',
    'form.err.phone': 'Enter a valid phone number',
    'form.err.contact': 'Leave us an email or a phone number',
    'form.err.service': 'Select an option',
    'form.err.message': 'Tell us a bit more (10 characters minimum)',
    'form.status.invalid': 'Check the fields marked in red.',
    'form.status.success': 'Message sent! We\'ll get back to you soon.',
    'form.status.network': 'We couldn\'t connect. Check your connection and try again.',
    'form.status.generic': 'Something went wrong. Please try again in a moment.',
    'footer.top': 'Back to top',
    'theme.toLight': 'Switch to light mode',
    'theme.toDark': 'Switch to dark mode',
    'meta.title': 'JRHM.STUDIO | Web Design & Development',
    'meta.description': 'Custom web design and development: landing pages, multi-page sites, and Shopify e-commerce. We build websites that grow your business.',
    'project.altogroup.desc': 'Restaurant group behind the Mito, Zoukmaya, and Los Grandes brands.',
    'project.mito.desc': 'A restaurant dedicated to tradition, flavor, and entertainment, paying tribute to Latin American cuisine.',
    'project.zoukmaya.desc': 'Latin American restaurant in Forest Lake, Minnesota, with a vibrant atmosphere and authentic flavors.',
    'project.losgrandes.desc': 'A restaurant and bar celebrating Mexican cuisine with seafood, live music, and a great atmosphere in Burnsville, Minnesota.',
    'project.bionutrients.desc': 'Distributor of active and functional ingredients for the supplement industry.',
    'project.limman.desc': 'A cleaning company with over 50 years of experience in Culiacán, Sinaloa, serving commercial, government, and residential clients.',
    'project.patron.desc': 'A leading grain trading and storage company in Mexico since 1989.',
    'project.mangos.desc': 'A company dedicated to growing, packing, and distributing mangoes in Sinaloa.',
    'project.qabu.desc': 'A boutique residential development in Mazatlán, with units and financing plans tailored to fit.',
    'project.caeti.desc': 'A Mexican technology company specializing in data management, cybersecurity, and analytical intelligence for government and private-sector clients.',
    'projects.view': '[View project]',
    'project.tags': 'Design + Development',
    'hero.status': 'Available for new projects',
    'hero.place': 'Culiacán, MX',
  },
};

const langButtons = document.querySelectorAll('.lang-switch__btn');
const i18nEls = document.querySelectorAll('[data-i18n]');
let currentLang = localStorage.getItem('lang') || 'es';

// Busca una traducción; si falta la clave en el idioma activo cae al español
// antes que dejar la interfaz en blanco.
function t(key) {
  return translations[currentLang][key] ?? translations.es[key] ?? key;
}

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  i18nEls.forEach((el) => {
    const value = translations[lang][el.dataset.i18n];
    if (value !== undefined) el.textContent = value;
  });

  langButtons.forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
  });

  document.title = t('meta.title');
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', t('meta.description'));

  updateThemeLabel();
  refreshFormMessages();

  localStorage.setItem('lang', lang);
  // Los juegos (se cargan bajo demanda) repintan sus textos al oír esto.
  document.dispatchEvent(new CustomEvent('jrhm:idioma', { detail: lang }));
}

langButtons.forEach((btn) => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

// ===== Formulario de contacto =====
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

// Pages Function servida en el mismo dominio (functions/api/contact.js)
const API_URL = '/api/contact';

// Guardamos la CLAVE de cada mensaje visible, no el texto, para poder
// re-pintarlos si el visitante cambia de idioma con el formulario a medio
// llenar o con errores en pantalla.
const fieldErrors = {};
let statusKey = null;
let isSubmitting = false;

function showError(field, key) {
  const row = form.querySelector(`#${field}`).closest('.form__row');
  const errorEl = row.querySelector('.form__error');
  if (key) {
    fieldErrors[field] = key;
    row.classList.add('has-error');
    errorEl.textContent = t(key);
  } else {
    delete fieldErrors[field];
    row.classList.remove('has-error');
    errorEl.textContent = '';
  }
}

function clearError(field) {
  showError(field, null);
}

// `literal` es para el texto que ya viene traducido del servidor: no tiene
// clave, así que al cambiar de idioma se queda como está.
function setStatus(key, state, literal) {
  statusKey = key;
  statusEl.textContent = key ? t(key) : (literal || '');
  statusEl.dataset.state = state || '';
}

// La llama applyLanguage al cambiar de idioma.
function refreshFormMessages() {
  if (!form) return;
  Object.entries(fieldErrors).forEach(([field, key]) => {
    const row = form.querySelector(`#${field}`).closest('.form__row');
    row.querySelector('.form__error').textContent = t(key);
  });
  if (statusKey) statusEl.textContent = t(statusKey);
  if (!isSubmitting) submitBtn.querySelector('.btn__label').textContent = t('form.button');
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Acepta formatos comunes: +52 667 123 4567, (667) 123-4567, 6671234567, etc.
const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;

function validateForm() {
  let isValid = true;

  const name = form.name.value.trim();
  if (name.length < 2) {
    showError('name', 'form.err.name');
    isValid = false;
  } else {
    clearError('name');
  }

  const email = form.email.value.trim();
  const phone = form.phone.value.trim();

  const emailOk = email === '' || emailRegex.test(email);
  const phoneOk = phone === '' || phoneRegex.test(phone);

  if (!emailOk) {
    showError('email', 'form.err.email');
    isValid = false;
  } else {
    clearError('email');
  }

  if (!phoneOk) {
    showError('phone', 'form.err.phone');
    isValid = false;
  } else {
    clearError('phone');
  }

  if (email === '' && phone === '') {
    showError('email', 'form.err.contact');
    isValid = false;
  }

  const service = form.service.value;
  if (!service) {
    showError('service', 'form.err.service');
    isValid = false;
  } else {
    clearError('service');
  }

  const message = form.message.value.trim();
  if (message.length < 10) {
    showError('message', 'form.err.message');
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
    setStatus('form.status.invalid', 'error');
    return;
  }

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    service: form.service.value,
    message: form.message.value.trim(),
    // El servidor responde los errores en este idioma.
    lang: currentLang,
  };

  isSubmitting = true;
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn__label').textContent = t('form.sending');
  setStatus(null, '');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || '');
    }

    setStatus('form.status.success', 'success');
    form.reset();
    Object.keys(fieldErrors).forEach(clearError);
  } catch (err) {
    if (err instanceof TypeError) {
      // fetch() solo lanza TypeError cuando la petición ni siquiera salió.
      setStatus('form.status.network', 'error');
    } else if (err.message) {
      setStatus(null, 'error', err.message);
    } else {
      setStatus('form.status.generic', 'error');
    }
  } finally {
    isSubmitting = false;
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn__label').textContent = t('form.button');
  }
});

// ===== Proyectos apilados =====
// Cada proyecto se queda fijo bajo el título (position: sticky) y el siguiente
// sube cubriéndolo. Para que quede justo debajo del título, el CSS necesita
// saber cuánto miden la barra superior y el título; cambian con el ancho (en
// móvil la barra tiene dos filas), así que se miden aquí.
const rootEl = document.documentElement;
const navEl = document.querySelector('.nav');
const projectsHead = document.querySelector('.projects__head');

function medirApilado() {
  if (navEl) rootEl.style.setProperty('--nav-h', navEl.offsetHeight + 'px');
  if (projectsHead) rootEl.style.setProperty('--head-h', projectsHead.offsetHeight + 'px');
}
medirApilado();
window.addEventListener('resize', medirApilado);
// Las fuentes cambian el alto del título al cargar.
if (document.fonts && document.fonts.ready) document.fonts.ready.then(medirApilado);

// ===== Proyectos en horizontal =====
// La sección se fija en pantalla y el scroll vertical mueve los proyectos de lado.
// Alto de la sección = alto visible + recorrido horizontal, así 1px de scroll son
// 1px de desplazamiento. Con movimiento reducido (o sin este script) queda la
// versión vertical que define el CSS.
const seccionProy = document.querySelector('.projects');
const pinProy = document.querySelector('.projects__pin');
const pistaProy = document.querySelector('.projects .stack');
const contadorProy = document.querySelector('.projects__count');
const totalProy = document.querySelectorAll('.projects .stack > .proj').length;
const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
const pantallaMovil = window.matchMedia('(max-width: 760px)');
let recorridoProy = 0;

function medirHorizontal() {
  if (!seccionProy || !pistaProy || !seccionProy.classList.contains('projects--h')) return;
  const ancho = rootEl.clientWidth; // sin la barra de scroll
  rootEl.style.setProperty('--vw', ancho + 'px');
  rootEl.style.setProperty('--bleed', seccionProy.getBoundingClientRect().left + 'px');
  const barra = navEl ? navEl.offsetHeight : 0;
  const altoPanel = window.innerHeight - barra;
  pinProy.style.height = altoPanel + 'px';
  recorridoProy = Math.max(0, pistaProy.offsetWidth - ancho);
  // Un tramo extra al final: la última tarjeta se queda quieta un momento antes de
  // que la sección siga hacia abajo.
  seccionProy.style.height = altoPanel + recorridoProy + altoPanel * 0.25 + 'px';
  moverHorizontal();
}

function moverHorizontal() {
  if (!seccionProy.classList.contains('projects--h')) return;
  const barra = navEl ? navEl.offsetHeight : 0;
  const avance = recorridoProy > 0
    ? Math.min(1, Math.max(0, (barra - seccionProy.getBoundingClientRect().top) / recorridoProy))
    : 0;
  pistaProy.style.transform = 'translate3d(' + (-avance * recorridoProy).toFixed(1) + 'px, 0, 0)';
  if (contadorProy && totalProy) {
    const actual = Math.round(avance * (totalProy - 1)) + 1;
    contadorProy.textContent = String(actual).padStart(2, '0') + ' / ' + String(totalProy).padStart(2, '0');
  }
}

function activarHorizontal() {
  if (!seccionProy || !pistaProy) return;
  // En móvil los proyectos van en lista vertical: deslizar el dedo hacia abajo y que
  // la pantalla se mueva de lado confunde, y las tarjetas quedarían diminutas.
  const activo = !sinMovimiento.matches && !pantallaMovil.matches;
  seccionProy.classList.toggle('projects--h', activo);
  if (activo) {
    // Las imágenes están fuera de pantalla a un lado: con carga diferida tardarían
    // en aparecer al hacer scroll rápido. Son 6 JPG de unos 70 KB.
    document.querySelectorAll('.projects .proj__media > img').forEach((img) => { img.loading = 'eager'; });
    medirApilado();
    medirHorizontal();
  } else {
    ['--vw', '--bleed'].forEach((v) => rootEl.style.removeProperty(v));
    seccionProy.style.removeProperty('height');
    pinProy.style.removeProperty('height');
    pistaProy.style.removeProperty('transform');
  }
}
activarHorizontal();
let horizontalPendiente = false;
window.addEventListener('scroll', () => {
  if (horizontalPendiente) return;
  horizontalPendiente = true;
  requestAnimationFrame(() => { horizontalPendiente = false; moverHorizontal(); });
}, { passive: true });
window.addEventListener('resize', () => { medirApilado(); medirHorizontal(); });
sinMovimiento.addEventListener('change', activarHorizontal);
pantallaMovil.addEventListener('change', activarHorizontal);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { medirApilado(); medirHorizontal(); });

// ===== Easter egg: juegos =====
// El punto final del titular abre un panel con Gato, Conecta 4 y Buscaminas. El
// código (juegos.js + juegos.css) no se descarga hasta el primer clic.
const puntoJuegos = document.querySelector('.hero__punto');
let cargaJuegos = null;
function abrirJuegos() {
  if (window.JRHM_JUEGOS) return window.JRHM_JUEGOS.abrir();
  if (!cargaJuegos) {
    cargaJuegos = new Promise((ok, fallo) => {
      const s = document.createElement('script');
      s.src = 'juegos.js';
      s.onload = ok;
      s.onerror = fallo;
      document.head.appendChild(s);
    });
  }
  return cargaJuegos.then(() => window.JRHM_JUEGOS.abrir()).catch(() => { cargaJuegos = null; });
}
if (puntoJuegos) puntoJuegos.addEventListener('click', abrirJuegos);

// ===== Recorrido en video al pasar el cursor =====
// Cada proyecto tiene un video corto (scroll por las secciones del sitio) encima de
// su captura. No se descarga hasta que la tarjeta asoma en pantalla (el panel
// horizontal recorta lo que aún no ha entrado, así que no se adelanta más). Con el cursor
// encima se funde y se reproduce desde el principio; al salir se funde de vuelta y
// se rebobina. Sin hover (táctil) o con movimiento reducido no se reproduce.
const puedeReproducir = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (puedeReproducir) {
  const tarjetasVideo = Array.from(document.querySelectorAll('.proj')).filter((t) => t.querySelector('.proj__video'));
  const cargar = (video) => {
    if (video.dataset.src && !video.getAttribute('src')) {
      video.setAttribute('src', video.dataset.src);
      video.preload = 'auto';
      video.load();
    }
  };
  if ('IntersectionObserver' in window) {
    const cercania = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        cargar(entrada.target.querySelector('.proj__video'));
        cercania.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 100% 0px 100%' });
    tarjetasVideo.forEach((t) => cercania.observe(t));
  }
  tarjetasVideo.forEach((tarjeta) => {
    const video = tarjeta.querySelector('.proj__video');
    let rebobinar = null;
    const encender = () => {
      if (sinMovimiento.matches) return;
      clearTimeout(rebobinar);
      cargar(video);
      video.currentTime = 0;
      video.classList.add('is-on');
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    };
    const apagar = () => {
      video.classList.remove('is-on');
      clearTimeout(rebobinar);
      // Se pausa cuando ya terminó de fundirse, para no cortar el fundido.
      rebobinar = setTimeout(() => { video.pause(); video.currentTime = 0; }, 500);
    };
    tarjeta.addEventListener('pointerenter', encender);
    tarjeta.addEventListener('pointerleave', apagar);
    tarjeta.addEventListener('focus', encender);
    tarjeta.addEventListener('blur', apagar);
  });
}

// Etiqueta "[Ver proyecto]" que sigue al cursor sobre las imágenes. Solo con
// ratón: en táctil no hay cursor al que seguir, y ahí el texto del enlace basta.
const stackEl = document.querySelector('.stack');
if (stackEl && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const etiqueta = document.createElement('div');
  etiqueta.className = 'proj-label';
  etiqueta.setAttribute('aria-hidden', 'true');
  document.body.appendChild(etiqueta);

  stackEl.addEventListener('pointermove', (e) => {
    const sobreImagen = e.target instanceof Element && e.target.closest('.proj__media');
    if (!sobreImagen) {
      etiqueta.classList.remove('is-on');
      return;
    }
    etiqueta.textContent = t('projects.view');
    etiqueta.style.transform = `translate(${e.clientX + 34}px, ${e.clientY + 22}px)`;
    etiqueta.classList.add('is-on');
  });
  stackEl.addEventListener('pointerleave', () => etiqueta.classList.remove('is-on'));
}

// ===== Hora local =====
// Culiacán está en la zona horaria de Mazatlán (UTC-7, sin horario de verano).
const horaEl = document.getElementById('hora');
if (horaEl) {
  const formato = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'America/Mazatlan',
  });
  const pintarHora = () => { horaEl.textContent = formato.format(new Date()); };
  pintarHora();
  setInterval(pintarHora, 1000);
}

// ===== Líneas que se dibujan =====
// Solo se animan las líneas de las secciones; el contenido no se toca, así que
// nada puede quedar invisible. La clase la añade el JS, nunca el HTML.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lineas = document.querySelectorAll('.row__label, .list--services .list__item, .list--steps .list__item');
  lineas.forEach((el) => {
    el.classList.add('anim');
    // Posición dentro del grupo: escalona el trazo de los cuatro pasos.
    if (el.classList.contains('list__item') && el.parentElement.classList.contains('list--steps')) {
      el.style.setProperty('--d', String(Array.prototype.indexOf.call(el.parentElement.children, el)));
    }
  });
  const vigilante = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('is-in');
        vigilante.unobserve(entrada.target);
      });
    },
    { threshold: 0.2 }
  );
  // Dos fotogramas antes de observar: el navegador pinta primero el estado sin
  // trazar y así hay desde dónde hacer la transición.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => lineas.forEach((el) => vigilante.observe(el)));
  });
}

// ===== Cursor personalizado =====
// Un punto que sigue al ratón exacto y un anillo que llega con retardo. Solo en
// dispositivos con puntero fino: en táctil no hay cursor que reemplazar.
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const dot = document.querySelector('.cursor__dot');
  const ring = document.querySelector('.cursor__ring');

  if (dot && ring) {
    // Qué hace crecer el anillo, y qué lo aparta.
    const PULSABLE = 'a, button, select, summary, [role="button"], .hero__punto';
    const CAMPO_DE_TEXTO = 'input, textarea';

    // Quien pidió menos movimiento no recibe la inercia: el anillo va pegado.
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SEGUIMIENTO = sinMovimiento ? 1 : 0.18;

    let ratonX = window.innerWidth / 2;
    let ratonY = window.innerHeight / 2;
    let anilloX = ratonX;
    let anilloY = ratonY;
    let visible = false;

    document.addEventListener('pointermove', (e) => {
      ratonX = e.clientX;
      ratonY = e.clientY;

      if (!visible) {
        // Hasta el primer movimiento no sabemos dónde está el ratón: mostrarlo
        // antes lo dejaría plantado en el centro de la pantalla.
        visible = true;
        anilloX = ratonX;
        anilloY = ratonY;
        dot.classList.add('is-ready');
        ring.classList.add('is-ready');
      }
    });

    document.addEventListener('pointerover', (e) => {
      const destino = e.target;
      if (!(destino instanceof Element)) return;
      ring.classList.toggle('is-active', !!destino.closest(PULSABLE));
      const enCampo = !!destino.closest(CAMPO_DE_TEXTO);
      dot.classList.toggle('is-hidden', enCampo);
      ring.classList.toggle('is-hidden', enCampo);
    });

    // Al salir de la ventana el cursor se queda congelado en el borde: mejor
    // esconderlo y recuperarlo al volver.
    document.addEventListener('mouseleave', () => {
      dot.classList.add('is-hidden');
      ring.classList.add('is-hidden');
    });
    document.addEventListener('mouseenter', () => {
      dot.classList.remove('is-hidden');
      ring.classList.remove('is-hidden');
    });

    // Clic: el anillo se encoge mientras se mantiene pulsado y sale una onda
    // desde el punto exacto del clic.
    const lanzarOnda = (x, y) => {
      if (sinMovimiento) return;
      const onda = document.createElement('div');
      onda.className = 'cursor__ripple';
      onda.style.setProperty('--x', `${x}px`);
      onda.style.setProperty('--y', `${y}px`);
      // La limpieza normal la hace animationend. El temporizador es la red de
      // seguridad: si la animación no llega a correr (pestaña oculta, alguna
      // extensión que las desactive), la onda se quedaría fija en pantalla.
      const quitar = () => {
        clearTimeout(plazo);
        onda.remove();
      };
      const plazo = setTimeout(quitar, 800);
      onda.addEventListener('animationend', quitar);
      document.body.appendChild(onda);
    };

    document.addEventListener('pointerdown', (e) => {
      ring.classList.add('is-pressed');
      lanzarOnda(e.clientX, e.clientY);
    });
    // pointercancel también: si el navegador se queda el gesto, el anillo no
    // puede quedarse encogido para siempre.
    document.addEventListener('pointerup', () => ring.classList.remove('is-pressed'));
    document.addEventListener('pointercancel', () => ring.classList.remove('is-pressed'));

    const frame = () => {
      anilloX += (ratonX - anilloX) * SEGUIMIENTO;
      anilloY += (ratonY - anilloY) * SEGUIMIENTO;
      dot.style.transform = `translate(${ratonX}px, ${ratonY}px)`;
      ring.style.transform = `translate(${anilloX}px, ${anilloY}px)`;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}

// Al final del todo: applyLanguage toca el formulario y el selector de tema,
// que se definen más arriba pero se inicializan en este punto.
applyLanguage(currentLang);
