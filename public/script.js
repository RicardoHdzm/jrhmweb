// ===== Año en footer =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Link activo del nav según la sección visible =====
const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
const navSections = Array.from(navLinks)
.map((link) => document.querySelector(link.getAttribute('href')))
.filter(Boolean);

if (navSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeHref = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === activeHref);
        });
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
    );

  navSections.forEach((section) => sectionObserver.observe(section));
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
    'nav.servicios': 'Servicios',
    'nav.proyectos': 'Proyectos',
    'nav.proceso': 'Proceso',
    'nav.contacto': 'Contacto',
    'hero.eyebrow': '00 // estudio de diseño & desarrollo web',
    'hero.titlePre': 'Diseñando sitios web que',
    'hero.titleHighlight': 'hacen crecer tu negocio',
    'hero.sub': 'En JRHM.STUDIO diseñamos y desarrollamos sitios web a la medida de tu marca. Creamos soluciones claras y funcionales, desde una página sencilla hasta sitios mas completos adaptados exactamente a lo que tu negocio necesita.',
    'hero.btnProjects': 'Ver proyectos',
    'hero.btnContact': 'Contactar',
    'hero.scroll': 'Explorar',
    'services.eyebrow': '01 // servicios',
    'services.title': '¿En qué podemos ayudar?',
    'service.design.mark': 'Diseño 100% Personalizado',
    'service.design.desc': 'Cada sitio se diseña desde cero para tu marca, sin plantillas genéricas ni soluciones prefabricadas.',
    'service.multipage.mark': 'Sitios Multi-página',
    'service.multipage.desc': 'Desde una landing de una sola sección hasta sitios con varias páginas conectadas entre sí.',
    'service.ecommerce.mark': 'E-commerce en Shopify',
    'service.ecommerce.desc': 'Tiendas en línea completas (catálogo, pagos y envíos) para que empieces a vender sin complicaciones.',
    'service.forms.mark': 'Formularios & Integraciones',
    'service.forms.desc': 'Formularios de contacto que llegan directo a tu email, más integración con WhatsApp.',
    'service.seo.mark': 'Optimización SEO',
    'service.seo.desc': 'Buenas prácticas técnicas (velocidad, metadatos y estructura) para que te encuentren en Google.',
    'service.maintenance.mark': 'Mantenimiento & Soporte',
    'service.maintenance.desc': 'Actualizaciones, mejoras continuas y acompañamiento después del lanzamiento.',
    'projects.eyebrow': '02 // proyectos',
    'projects.title': 'Clientes que confiaron en nosotros',
    'project.link': 'Visitar sitio →',
    'projects.showMore': 'Mostrar más',
    'projects.showLess': 'Mostrar menos',
    'project.altogroup.category': 'Grupo restaurantero en Minnesota',
    'project.altogroup.desc': 'Grupo restaurantero dueño de las marcas Mito, Zoukmaya y Los Grandes.',
    'project.mito.category': 'Restaurante de cocina latinoamericana',
    'project.mito.desc': 'Restaurante dedicado a la tradición, el sabor y el entretenimiento, en tributo a la gastronomía latinoamericana.',
    'project.zoukmaya.category': 'Restaurante latinoamericano en Forest Lake, MN',
    'project.zoukmaya.desc': 'Restaurante latinoamericano en Forest Lake, Minnesota, con ambiente vibrante y sabores auténticos.',
    'project.losgrandes.category': 'Restaurante & bar mexicano en Burnsville, MN',
    'project.losgrandes.desc': 'Restaurante y bar que celebra la cocina mexicana con mariscos, música en vivo y gran ambiente en Burnsville, Minnesota.',
    'project.limman.category': 'Servicios de limpieza comercial y residencial en Culiacán',
    'project.limman.desc': 'Empresa de limpieza con más de 50 años de experiencia en Culiacán, Sinaloa, atendiendo clientes comerciales, gubernamentales y residenciales.',
    'project.bionutrients.category': 'Distribuidora de ingredientes activos para suplementos',
    'project.bionutrients.desc': 'Distribuidora de ingredientes activos y funcionales para la industria de suplementos.',
    'project.patron.category': 'Comercialización y almacenamiento de granos desde 1989',
    'project.patron.desc': 'Empresa líder en comercialización y almacenamiento de granos en México desde 1989.',
    'project.mangos.category': 'Producción y distribución de mango, marca de Grupo Patrón',
    'project.mangos.desc': 'Empresa dedicada al cultivo, empaque y distribución de mango en Sinaloa.',
    'project.qabu.category': 'Desarrollo residencial boutique en Mazatlán',
    'project.qabu.desc': 'Desarrollo residencial boutique en Mazatlán, con departamentos y planes de financiamiento a medida.',
    'project.caeti.category': 'Soluciones de gestión de datos y transformación digital',
    'project.caeti.desc': 'Empresa mexicana de tecnología especializada en gestión de datos, ciberseguridad e inteligencia analítica para clientes de gobierno y sector privado.',
    'process.eyebrow': '03 // proceso',
    'process.title': 'Cómo trabajamos',
    'process.step1.title': 'Contacto',
    'process.step1.desc': 'Nos escribes por WhatsApp o correo y nos cuentas qué necesita tu negocio: un sitio nuevo, un rediseño o algo puntual. Te respondemos en menos de 24 horas.',
    'process.step2.title': 'Propuesta',
    'process.step2.desc': 'Te armamos una propuesta clara acorde a tus necesidades, tiempo de entrega y costo del proyecto, para que sepas exactamente qué esperar antes de arrancar.',
    'process.step3.title': 'Diseño & Desarrollo',
    'process.step3.desc': 'Diseñamos y desarrollamos tu sitio, lo probamos tanto en escritorio como en móvil, asegurando que la estructura y la experiencia queden impecables.',
    'process.step4.title': 'Revisión & Entrega',
    'process.step4.desc': 'Te presentamos el resultado final para que lo pruebes, aplicamos los ajustes necesarios y lanzamos el sitio oficialmente para que empiece a funcionar.',
    'contact.eyebrow': '04 // contacto',
    'contact.title': 'Hablemos de tu proyecto',
    'contact.sub': 'Cuéntanos qué necesitas, ya sea empezar de cero, renovar tu sitio actual, o sumarle algo que le falta, y te respondemos en menos de 24 horas. Sin compromisos: primero entendemos tu proyecto, después te decimos cómo lo resolvemos.',
    'contact.writeUs': 'O escríbenos directo por:',
    'contact.email': 'Correo',
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
    'theme.toLight': 'Cambiar a modo claro',
    'theme.toDark': 'Cambiar a modo oscuro',
    'meta.title': 'JRHM.STUDIO | Diseño & Desarrollo Web',
    'meta.description': 'Diseño y desarrollo de sitios web a medida: landing pages, sitios multi-página y e-commerce en Shopify. Creamos sitios web que hacen crecer tu negocio.',

  },
  en: {
    'nav.servicios': 'Services',
    'nav.proyectos': 'Projects',
    'nav.proceso': 'Process',
    'nav.contacto': 'Contact',
    'hero.eyebrow': '00 // design & web development studio',
    'hero.titlePre': 'Designing websites that',
    'hero.titleHighlight': 'grow your business',
    'hero.sub': 'At JRHM.STUDIO we design and develop custom websites tailored to your brand. We create clear, functional solutions, ranging from a simple landing page to more comprehensive sites adapted precisely to what your business needs.',
    'hero.btnProjects': 'View projects',
    'hero.btnContact': 'Get in touch',
    'hero.scroll': 'Scroll',
    'services.eyebrow': '01 // services',
    'services.title': 'How can we help?',
    'service.design.mark': '100% Custom Design',
    'service.design.desc': 'Every site is designed from scratch for your brand, no generic templates or prefab solutions.',
    'service.multipage.mark': 'Multi-page Sites',
    'service.multipage.desc': 'From a single-section landing page to sites with several pages linked together.',
    'service.ecommerce.mark': 'Shopify E-commerce',
    'service.ecommerce.desc': 'Full online stores (catalog, payments, and shipping) so you can start selling without the hassle.',
    'service.forms.mark': 'Forms & Integrations',
    'service.forms.desc': 'Contact forms that land straight in your inbox, plus WhatsApp integration.',
    'service.seo.mark': 'SEO Optimization',
    'service.seo.desc': 'Solid technical practices (speed, metadata, and structure) so people can find you on Google.',
    'service.maintenance.mark': 'Maintenance & Support',
    'service.maintenance.desc': 'Updates, ongoing improvements, and support after launch.',
    'projects.eyebrow': '02 // projects',
    'projects.title': 'Clients who trusted us',
    'project.link': 'Visit site →',
    'projects.showMore': 'Show more',
    'projects.showLess': 'Show less',
    'project.altogroup.category': 'Restaurant group in Minnesota',
    'project.altogroup.desc': 'Restaurant group behind the Mito, Zoukmaya, and Los Grandes brands.',
    'project.mito.category': 'Latin American restaurant',
    'project.mito.desc': 'A restaurant dedicated to tradition, flavor, and entertainment, paying tribute to Latin American cuisine.',
    'project.zoukmaya.category': 'Latin American restaurant in Forest Lake, MN',
    'project.zoukmaya.desc': 'Latin American restaurant in Forest Lake, Minnesota, with a vibrant atmosphere and authentic flavors.',
    'project.losgrandes.category': 'Mexican restaurant & bar in Burnsville, MN',
    'project.losgrandes.desc': 'A restaurant and bar celebrating Mexican cuisine with seafood, live music, and a great atmosphere in Burnsville, Minnesota.',
    'project.bionutrients.category': 'Active ingredient distributor for supplements',
    'project.bionutrients.desc': 'Distributor of active and functional ingredients for the supplement industry.',
    'project.limman.category': 'Commercial and residential cleaning services in Culiacán',
    'project.limman.desc': 'A cleaning company with over 50 years of experience in Culiacán, Sinaloa, serving commercial, government, and residential clients.',
    'project.patron.category': 'Grain trading and storage since 1989',
    'project.patron.desc': 'A leading grain trading and storage company in Mexico since 1989.',
    'project.mangos.category': 'Mango production and distribution, a Grupo Patrón brand',
    'project.mangos.desc': 'A company dedicated to growing, packing, and distributing mangoes in Sinaloa.',
    'project.qabu.category': 'Boutique residential development in Mazatlán',
    'project.qabu.desc': 'A boutique residential development in Mazatlán, with units and financing plans tailored to fit.',
    'project.caeti.category': 'Data management and digital transformation solutions',
    'project.caeti.desc': 'A Mexican technology company specializing in data management, cybersecurity, and analytical intelligence for government and private-sector clients.',
    'process.eyebrow': '03 // process',
    'process.title': 'How we work',
    'process.step1.title': 'Contact',
    'process.step1.desc': "You reach out on WhatsApp or email and tell us what your business needs: a new site, a redesign, or something specific. We reply within 24 hours.",
    'process.step2.title': 'Proposal',
    'process.step2.desc': "We put together a clear proposal based on your needs, delivery timeline, and project cost, so you know exactly what to expect before we start.",
    'process.step3.title': 'Design & Development',
    'process.step3.desc': "We design and develop your site, testing it on both desktop and mobile, ensuring the structure and experience turn out flawless.",
    'process.step4.title': 'Review & Delivery',
    'process.step4.desc': "We present the final result for you to test, apply any necessary adjustments, and officially launch the site so it can start working for you.",
    'contact.eyebrow': '04 // contact',
    'contact.title': "Let's talk about your project",
    'contact.sub': "Tell us what you need, whether it's starting from scratch, refreshing your current site, or adding something it's missing, and we'll get back to you in under 24 hours. No strings attached: we start by understanding your project, then tell you how we'll solve it.",
    'contact.writeUs': 'Or write to us directly at:',
    'contact.email': 'Email',
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
    'form.status.success': "Message sent! We'll get back to you soon.",
    'form.status.network': "We couldn't connect. Check your connection and try again.",
    'form.status.generic': 'Something went wrong. Please try again in a moment.',
    'theme.toLight': 'Switch to light mode',
    'theme.toDark': 'Switch to dark mode',
    'meta.title': 'JRHM.STUDIO | Web Design & Development',
    'meta.description': 'Custom web design and development: landing pages, multi-page sites, and Shopify e-commerce. We build websites that grow your business.',
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

  if (projectsToggle) {
    const expanded = projectsToggle.getAttribute('aria-expanded') === 'true';
    projectsToggle.querySelector('span').textContent = expanded
    ? translations[lang]['projects.showLess']
    : translations[lang]['projects.showMore'];
  }

  document.title = t('meta.title');
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', t('meta.description'));

  updateThemeLabel();
  refreshFormMessages();

  localStorage.setItem('lang', lang);
}

langButtons.forEach((btn) => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

// ===== Mostrar más proyectos =====
const projectsToggle = document.getElementById('projects-toggle');
const extraProjects = document.querySelectorAll('.project--extra');

if (projectsToggle) {
  projectsToggle.addEventListener('click', () => {
    const expanded = projectsToggle.getAttribute('aria-expanded') === 'true';
    extraProjects.forEach((project) => project.classList.toggle('is-visible', !expanded));
    projectsToggle.setAttribute('aria-expanded', String(!expanded));
    projectsToggle.querySelector('span').textContent = expanded
    ? translations[currentLang]['projects.showMore']
    : translations[currentLang]['projects.showLess'];

    if (expanded) {
      document.getElementById('proyectos').scrollIntoView({ behavior: 'smooth' });
    }
  });
}


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

// ===== Cursor personalizado =====
// Un punto que sigue al ratón exacto y un anillo que llega con retardo. Solo en
// dispositivos con puntero fino: en táctil no hay cursor que reemplazar.
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const dot = document.querySelector('.cursor__dot');
  const ring = document.querySelector('.cursor__ring');

  if (dot && ring) {
    // Qué hace crecer el anillo, y qué lo aparta.
    const PULSABLE = 'a, button, select, summary, [role="button"]';
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
