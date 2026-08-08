# JRHM Web Studio — Sitio

## Estructura

```
portfolio/
├── index.html          ← frontend
├── style.css
├── script.js
└── backend/
    ├── server.js        ← API Express (recibe el form y envía el email)
    ├── package.json
    └── .env.example
```

## 1. Correr el frontend

Es HTML/CSS/JS puro, no necesita build. Podés:
- Abrir `index.html` directo en el navegador, o
- Usar la extensión "Live Server" de VS Code (recomendado, evita problemas de CORS)

## 2. Correr el backend

```bash
cd backend
npm install
cp .env.example .env
```

Editá `.env` con tus datos reales:
- `SMTP_USER` / `SMTP_PASS`: si usás Gmail, generá una "contraseña de aplicación" en
  https://myaccount.google.com/apppasswords (necesitás verificación en 2 pasos activada)
- `NOTIFY_EMAIL`: a dónde querés que lleguen los mensajes del formulario
- `FRONTEND_ORIGIN`: la URL donde corre tu frontend (para que CORS lo permita)

Luego:

```bash
npm start
```

El servidor queda en `http://localhost:3000`.

## 3. Probar que funciona

1. Abrí el frontend
2. Llená el formulario de contacto y enviá
3. Deberías ver el mensaje de éxito y recibir el email en tu Gmail en segundos

## 4. Pendientes de personalización

- **Redes sociales**: en `index.html`, buscá la sección `contact__social` y actualizá:
  - El link de Instagram (`https://instagram.com/jrhmwebstudio`)
  - El link de WhatsApp (`https://wa.me/50000000000` — reemplazá por tu número con código de país, sin espacios ni signos)
- **Proyectos**: los 3 proyectos de ejemplo en `#proyectos` son placeholders

## 5. Sobre el scroll de pantalla completa

En escritorio (ventanas de 901px de ancho o más), cada sección ocupa el alto disponible bajo
el nav y el scroll "engancha" (scroll-snap) directo a la siguiente sección. En mobile esto se
desactiva y el scroll vuelve a ser normal, porque el scroll-snap con alturas de pantalla completa
suele dar problemas en navegadores móviles (la barra de direcciones cambia el alto disponible).

Si en alguna pantalla el contenido de una sección es más alto que la ventana (por ejemplo, una
laptop con poca altura de pantalla), esa sección simplemente crece un poco más allá del 100% en
vez de recortar contenido — el scroll-snap se sigue enganchando al inicio de cada sección igual.

## 5. Notas para producción

- **Hosting backend**: Render, Railway o Fly.io tienen tiers gratuitos que andan bien para esto
- **Hosting frontend**: Vercel, Netlify o GitHub Pages
- **Antes de deployar**: actualizá `API_URL` en `script.js` con la URL real de tu backend en producción
