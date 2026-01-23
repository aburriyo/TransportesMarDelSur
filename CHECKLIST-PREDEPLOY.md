# ✅ Checklist Pre-Deploy - Transporte Mar del Sur

## 🟢 COMPLETADO

### Seguridad y HTTPS
- [x] **Forzar HTTPS** - Redirección automática de HTTP a HTTPS en producción
- [x] **Headers de seguridad** - Configurados en Nginx (X-Frame-Options, X-Content-Type-Options, etc.)
- [x] **SSL/TLS** - Script de configuración Let's Encrypt incluido

### SEO y Metadatos
- [x] **Favicon** - SVG profesional con logo de camión y colores corporativos
- [x] **Apple Touch Icon** - Configurado para dispositivos iOS
- [x] **Web Manifest** - PWA ready con colores y configuración
- [x] **Theme Color** - #FFD600 (Hazard Yellow) configurado
- [x] **Sitemap actualizado** - Todas las nuevas rutas incluidas
- [x] **Robots.txt** - Optimizado con nuevas rutas

### Páginas y Funcionalidad
- [x] **Página 404 personalizada** - Diseño profesional con navegación
- [x] **Error handler 500** - Manejo de errores del servidor
- [x] **Multi-ruta** - 7 páginas separadas funcionando

### Diseño y UX
- [x] **Hero con imagen de fondo** - Animaciones y efectos visuales
- [x] **Botones de contacto flotantes** - WhatsApp + Teléfono
- [x] **Responsive design** - Optimizado para móvil y desktop
- [x] **Badges compactos** - Mejor visualización del CTA

---

## 🟡 PENDIENTE (Recomendado antes del deploy)

### Favicons PNG (Generación Manual)
Los navegadores más antiguos necesitan versiones PNG del favicon:

```bash
# Opción 1: Usar herramienta online
# Ve a https://realfavicongenerator.net/
# Sube el archivo static/img/favicon.svg
# Descarga el paquete y copia los archivos a static/img/

# Opción 2: Usar ImageMagick (si está instalado)
cd static/img
convert -background none favicon.svg -resize 16x16 favicon-16x16.png
convert -background none favicon.svg -resize 32x32 favicon-32x32.png
convert -background none favicon.svg -resize 180x180 apple-touch-icon.png
convert -background none favicon.svg -resize 192x192 icon-192x192.png
convert -background none favicon.svg -resize 512x512 icon-512x512.png
```

### Formulario de Contacto Funcional
El formulario actualmente no envía emails. Opciones:

**Opción A: Formspree (Más fácil, gratis hasta 50 envíos/mes)**
```html
<!-- Cambiar en contact.html -->
<form action="https://formspree.io/f/TU_FORM_ID" method="POST">
```

**Opción B: EmailJS (Envío desde el cliente)**
```javascript
// Agregar script de EmailJS
emailjs.sendForm('service_id', 'template_id', form);
```

**Opción C: Backend propio (Más control)**
```python
# Agregar en app.py ruta POST para procesar formulario
@app.route('/enviar-contacto', methods=['POST'])
def enviar_contacto():
    # Procesar y enviar email con smtplib
```

### Google Analytics (Opcional pero recomendado)
```html
<!-- Agregar antes de </head> en base.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Optimización de Imágenes
```bash
# Comprimir imágenes para mejor rendimiento
# Usar herramientas como:
# - squoosh.app (online)
# - imageoptim (Mac)
# - optipng / jpegoptim (CLI)
```

---

## 🔴 OPCIONAL (Post-deploy)

### Mejoras Futuras
- [ ] **Google Search Console** - Verificar propiedad del sitio
- [ ] **Google My Business** - Crear/vincular perfil de empresa
- [ ] **Schema.org adicional** - Reviews, FAQ estructurado
- [ ] **Open Graph Image** - Crear imagen personalizada para compartir
- [ ] **Lazy Loading Avanzado** - Para imágenes debajo del fold
- [ ] **Service Worker** - Para funcionalidad offline (PWA completo)
- [ ] **Compresión Brotli** - Mejor que gzip para textos

### Integraciones
- [ ] **Chat en vivo** - Tawk.to, Crisp, o similar
- [ ] **WhatsApp Business API** - Mensajes automatizados
- [ ] **CRM** - HubSpot, Pipedrive para gestionar leads

### Monitoreo
- [ ] **Uptime monitoring** - UptimeRobot, Pingdom
- [ ] **Error tracking** - Sentry para capturar errores JS
- [ ] **Performance** - Google PageSpeed Insights

---

## 📋 Verificación Final Pre-Deploy

### En el Servidor
```bash
# Verificar que Docker está corriendo
docker-compose ps

# Verificar logs
docker-compose logs -f web

# Verificar certificado SSL
curl -I https://tu-dominio.com

# Verificar redirección HTTP -> HTTPS
curl -I http://tu-dominio.com
```

### En el Navegador
- [ ] Visitar todas las páginas y verificar que cargan
- [ ] Probar en móvil (o DevTools modo responsive)
- [ ] Verificar favicon aparece en la pestaña
- [ ] Probar botones de WhatsApp y teléfono
- [ ] Verificar que HTTPS muestra candado verde
- [ ] Probar página 404 visitando /pagina-inexistente

### Herramientas de Verificación
- **SSL:** https://www.ssllabs.com/ssltest/
- **SEO:** https://www.seobility.net/en/seocheck/
- **Performance:** https://pagespeed.web.dev/
- **Mobile:** https://search.google.com/test/mobile-friendly
- **Structured Data:** https://search.google.com/test/rich-results

---

## 🎯 Prioridad de Implementación

1. **CRÍTICO** (Hacer ahora):
   - ✅ HTTPS configurado
   - ✅ Favicon
   - ✅ Página 404

2. **IMPORTANTE** (Hacer pronto):
   - ⏳ Generar PNGs del favicon
   - ⏳ Formulario de contacto funcional

3. **RECOMENDADO** (Primera semana):
   - ⏳ Google Analytics
   - ⏳ Google Search Console

4. **OPCIONAL** (Cuando haya tiempo):
   - Chat en vivo
   - Optimizaciones avanzadas
