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
const themeLabels = { dark: 'Cambiar a modo claro', light: 'Cambiar a modo oscuro' };

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeToggle) themeToggle.setAttribute('aria-label', themeLabels[theme]);
  localStorage.setItem('theme', theme);
}

applyTheme(localStorage.getItem('theme') || 'dark');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
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
    'hero.sub': 'En JRHM Web Studio creamos sitios web claros y fáciles de usar para tu negocio, desde una página sencilla hasta un sitio completo con varias secciones y formulario de contacto.',
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
    'project.bionutrients.category': 'Distribuidora de ingredientes activos para suplementos',
    'project.bionutrients.desc': 'Distribuidora de ingredientes activos y funcionales para la industria de suplementos.',
    'project.patron.category': 'Comercialización y almacenamiento de granos desde 1989',
    'project.patron.desc': 'Empresa líder en comercialización y almacenamiento de granos en México desde 1989.',
    'project.mangos.category': 'Producción y distribución de mango, marca de Grupo Patrón',
    'project.mangos.desc': 'Empresa dedicada al cultivo, empaque y distribución de mango en Sinaloa.',
    'project.limman.category': 'Servicios de limpieza comercial y residencial en Culiacán',
    'project.limman.desc': 'Empresa de limpieza con más de 50 años de experiencia en Culiacán, Sinaloa, atendiendo clientes comerciales, gubernamentales y residenciales.',
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
    'process.step3.title': 'Entrega',
    'process.step3.desc': 'Diseñamos y desarrollamos tu sitio, lo probamos tanto en escritorio como en móvil, y lo lanzamos con ajustes incluidos hasta que quede exactamente como lo imaginaste.',
    'contact.eyebrow': '04 // contacto',
    'contact.title': 'Hablemos de tu proyecto',
    'contact.sub': 'Cuéntanos qué necesitas, ya sea empezar de cero, renovar tu sitio actual, o sumarle algo que le falta, y te respondemos en menos de 24 horas. Sin compromisos: primero entendemos tu proyecto, después te decimos cómo lo resolvemos.',
    'contact.writeUs': 'Escríbenos directo por:',
    'contact.email': 'Correo',
    'contact.whatsapp': 'WhatsApp',
  },
  en: {
    'nav.servicios': 'Services',
    'nav.proyectos': 'Projects',
    'nav.proceso': 'Process',
    'nav.contacto': 'Contact',
    'hero.eyebrow': '00 // design & web development studio',
    'hero.titlePre': 'Designing websites that',
    'hero.titleHighlight': 'grow your business',
    'hero.sub': 'At JRHM Web Studio we build clear, easy-to-use websites for your business, from a simple page to a full site with several sections and a contact form.',
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
    'project.patron.category': 'Grain trading and storage since 1989',
    'project.patron.desc': 'A leading grain trading and storage company in Mexico since 1989.',
    'project.mangos.category': 'Mango production and distribution, a Grupo Patrón brand',
    'project.mangos.desc': 'A company dedicated to growing, packing, and distributing mangoes in Sinaloa.',
    'project.limman.category': 'Commercial and residential cleaning services in Culiacán',
    'project.limman.desc': 'A cleaning company with over 50 years of experience in Culiacán, Sinaloa, serving commercial, government, and residential clients.',
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
    'process.step3.title': 'Launch',
    'process.step3.desc': "We design and build your site, test it on both desktop and mobile, and launch it with revisions included until it's exactly what you pictured.",
    'contact.eyebrow': '04 // contact',
    'contact.title': "Let's talk about your project",
    'contact.sub': "Tell us what you need, whether it's starting from scratch, refreshing your current site, or adding something it's missing, and we'll get back to you in under 24 hours. No strings attached: we start by understanding your project, then tell you how we'll solve it.",
    'contact.writeUs': 'Write to us directly at:',
    'contact.email': 'Email',
    'contact.whatsapp': 'WhatsApp',
  },
};

const langButtons = document.querySelectorAll('.lang-switch__btn');
const i18nEls = document.querySelectorAll('[data-i18n]');
let currentLang = localStorage.getItem('lang') || 'es';

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

applyLanguage(currentLang);

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
    showError('name', 'Ingresa al menos 2 caracteres');
    isValid = false;
  } else {
    clearError('name');
  }

  const email = form.email.value.trim();
  const phone = form.phone.value.trim();

  const emailOk = email === '' || emailRegex.test(email);
  const phoneOk = phone === '' || phoneRegex.test(phone);

  if (!emailOk) {
    showError('email', 'Ingresa un email válido');
    isValid = false;
  } else {
    clearError('email');
  }

  if (!phoneOk) {
    showError('phone', 'Ingresa un teléfono válido');
    isValid = false;
  } else {
    clearError('phone');
  }

  if (email === '' && phone === '') {
    showError('email', 'Déjanos un email o un teléfono');
    isValid = false;
  }

  const service = form.service.value;
  if (!service) {
    showError('service', 'Selecciona una opción');
    isValid = false;
  } else {
    clearError('service');
  }

  const message = form.message.value.trim();
  if (message.length < 10) {
    showError('message', 'Cuéntanos un poco más (mínimo 10 caracteres)');
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
    statusEl.textContent = 'Revisa los campos marcados en rojo.';
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
