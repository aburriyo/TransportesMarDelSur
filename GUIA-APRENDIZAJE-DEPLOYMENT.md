# Guía de Aprendizaje: Despliegue de una Aplicación Web

Esta guía documenta todo el proceso que realizamos para poner en línea el sitio web de Transporte Mar del Sur. Está diseñada para que entiendas cada paso y puedas replicarlo en futuros proyectos.

---

## Índice

1. [Conceptos Básicos](#1-conceptos-básicos)
2. [Preparación del Proyecto](#2-preparación-del-proyecto)
3. [Subir a GitHub](#3-subir-a-github)
4. [El Servidor VPS](#4-el-servidor-vps)
5. [Docker y Contenedores](#5-docker-y-contenedores)
6. [Nginx como Proxy Inverso](#6-nginx-como-proxy-inverso)
7. [Firewall y Seguridad](#7-firewall-y-seguridad)
8. [Dominios y DNS](#8-dominios-y-dns)
9. [Cloudflare](#9-cloudflare)
10. [SSL/HTTPS](#10-sslhttps)
11. [Comandos Útiles](#11-comandos-útiles)
12. [Solución de Problemas](#12-solución-de-problemas)

---

## 1. Conceptos Básicos

### ¿Qué es un servidor?
Un servidor es simplemente una computadora que está encendida 24/7 y conectada a internet. Cuando alguien visita tu sitio web, su navegador se conecta a este servidor para obtener los archivos.

### ¿Qué es un VPS?
**VPS (Virtual Private Server)** es un servidor virtual. En lugar de tener una computadora física dedicada (muy caro), compartes una computadora potente con otros usuarios, pero cada uno tiene su espacio aislado. Es como tener un departamento en un edificio: compartes el edificio pero tu espacio es privado.

**Tu VPS de Hostinger:**
- IP: `72.61.4.202` (la "dirección" de tu servidor en internet)
- Sistema: Ubuntu 24.04 LTS
- RAM: 4 GB
- Disco: 50 GB

### ¿Qué es SSH?
**SSH (Secure Shell)** es una forma segura de conectarte a tu servidor remotamente. Es como tener un control remoto para tu servidor.

```bash
# Conectarse al servidor
ssh root@72.61.4.202

# Estructura: ssh [usuario]@[ip-del-servidor]
# root = usuario administrador (tiene todos los permisos)
```

### ¿Qué es un puerto?
Los puertos son como "puertas" en tu servidor. Cada servicio usa un puerto diferente:
- **Puerto 22**: SSH (conexión remota)
- **Puerto 80**: HTTP (web sin encriptar)
- **Puerto 443**: HTTPS (web encriptada/segura)
- **Puerto 5001**: Tu aplicación Flask

---

## 2. Preparación del Proyecto

### ¿Por qué limpiar el proyecto?
Antes de subir a producción, eliminamos archivos innecesarios:

| Eliminado | Razón |
|-----------|-------|
| `node_modules/` | 6.9 MB de dependencias que no usamos (Tailwind se carga desde CDN) |
| `documentos/` | Archivos internos de la empresa, no van en el servidor web |
| `design_proposals/` | Propuestas de diseño descartadas |
| Logos no usados | SVGs que nunca se referencian en el código |

**Beneficios:**
- Proyecto más pequeño (27 MB → 8 MB)
- Despliegue más rápido
- Menos superficie de ataque para hackers

### Archivos importantes para producción

```
proyecto/
├── app.py              # Tu aplicación Flask (el cerebro)
├── requirements.txt    # Dependencias Python (flask, gunicorn)
├── Dockerfile          # Instrucciones para crear el contenedor
├── docker-compose.yml  # Orquestación de múltiples contenedores
├── nginx/              # Configuración del servidor web
├── static/             # Archivos estáticos (CSS, JS, imágenes)
└── templates/          # Plantillas HTML
```

### El archivo `.gitignore`
Este archivo le dice a Git qué archivos NO subir al repositorio:

```gitignore
# Nunca subir:
.env              # Variables de entorno (contraseñas!)
.mcp.json         # Tokens de API
__pycache__/      # Cache de Python
node_modules/     # Dependencias de Node
```

**Importante:** Nunca subas contraseñas, tokens o claves API a GitHub.

---

## 3. Subir a GitHub

### ¿Por qué usar GitHub?
1. **Respaldo**: Tu código está seguro en la nube
2. **Versionado**: Puedes volver a versiones anteriores
3. **Despliegue fácil**: Clonas el repo en el servidor

### Comandos básicos de Git

```bash
# Ver estado de cambios
git status

# Agregar archivos al "staging" (preparar para commit)
git add archivo.py           # Un archivo específico
git add .                    # Todos los archivos

# Crear un commit (guardar cambios)
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push origin master

# En el servidor, descargar cambios
git pull
```

### Flujo que usamos:

```
Tu Mac (desarrollo)
       │
       │ git push
       ▼
    GitHub (repositorio remoto)
       │
       │ git pull
       ▼
VPS Hostinger (producción)
```

---

## 4. El Servidor VPS

### Conectarse al servidor

```bash
ssh root@72.61.4.202
# Te pedirá la contraseña
```

### Comandos básicos de Linux

```bash
# Ver en qué carpeta estás
pwd

# Listar archivos
ls -la

# Cambiar de carpeta
cd /opt/TransportesMarDelSur

# Ver contenido de un archivo
cat archivo.txt

# Ver uso de disco
df -h

# Ver uso de memoria
free -h

# Ver procesos corriendo
ps aux

# Probar si una web responde
curl http://localhost
curl -I http://localhost   # Solo headers
```

### Estructura de carpetas en Linux

```
/               # Raíz del sistema
├── opt/        # Software opcional (aquí pusimos el proyecto)
├── etc/        # Archivos de configuración
├── var/        # Archivos variables (logs, datos)
├── home/       # Carpetas de usuarios
└── root/       # Carpeta del usuario root
```

---

## 5. Docker y Contenedores

### ¿Qué es Docker?
Docker es como una "caja" que contiene todo lo necesario para ejecutar tu aplicación:
- Sistema operativo mínimo
- Python
- Tu código
- Dependencias

**Ventaja principal:** "Funciona en mi máquina" ya no es excusa. El contenedor es idéntico en desarrollo y producción.

### Dockerfile
Es la "receta" para crear la caja (imagen):

```dockerfile
# Imagen base: Python 3.11 versión ligera
FROM python:3.11-slim

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar e instalar dependencias
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copiar el código
COPY . .

# Comando para ejecutar la app
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "app:app"]
```

### docker-compose.yml
Cuando tienes múltiples contenedores que trabajan juntos:

```yaml
services:
  web:           # Tu aplicación Flask
    build: .
    ports:
      - "5001:5001"

  nginx:         # Servidor web (proxy)
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"

  certbot:       # Gestión de certificados SSL
    image: certbot/certbot
```

### Comandos de Docker

```bash
# Construir y levantar contenedores
docker compose up -d --build

# -d = detached (en segundo plano)
# --build = reconstruir imágenes

# Ver contenedores corriendo
docker ps

# Ver todos los contenedores (incluso detenidos)
docker ps -a

# Ver logs de un contenedor
docker logs mardelsur_nginx
docker logs mardelsur_web

# Detener contenedores
docker compose down

# Reiniciar
docker compose restart

# Ejecutar comando dentro de un contenedor
docker exec mardelsur_nginx cat /etc/nginx/conf.d/mardelsur.conf
```

---

## 6. Nginx como Proxy Inverso

### ¿Qué es Nginx?
Nginx es un servidor web muy eficiente. Lo usamos como "proxy inverso":

```
Internet → Nginx (puerto 80/443) → Flask (puerto 5001)
```

### ¿Por qué no exponer Flask directamente?
1. **Seguridad**: Nginx es más robusto contra ataques
2. **Rendimiento**: Nginx sirve archivos estáticos más rápido
3. **SSL**: Nginx maneja los certificados HTTPS
4. **Caché**: Puede cachear respuestas

### Configuración de Nginx

```nginx
server {
    listen 80;                    # Escuchar en puerto 80
    server_name _;                # Aceptar cualquier dominio

    # Archivos estáticos: Nginx los sirve directamente
    location /static/ {
        alias /usr/share/nginx/html/static/;
        expires 30d;              # Cachear por 30 días
    }

    # Todo lo demás: enviarlo a Flask
    location / {
        proxy_pass http://web:5001;  # "web" es el nombre del servicio en Docker
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### El problema que tuvimos
Nginx tenía configuración SSL pero no existían los certificados. Error:

```
cannot load certificate "/etc/letsencrypt/live/.../fullchain.pem"
```

**Solución:** Crear configuración solo HTTP temporalmente hasta tener el dominio.

---

## 7. Firewall y Seguridad

### ¿Qué es un firewall?
Es una "barrera" que controla qué conexiones pueden entrar o salir del servidor.

### Firewall a nivel de servidor (iptables/ufw)

```bash
# Ver estado del firewall de Ubuntu
ufw status

# En tu caso estaba inactivo (usamos el de Hostinger)
```

### Firewall de Hostinger
Hostinger tiene su propio firewall en el panel de control. Tuvimos que:

1. Ir a hPanel → VPS → Firewall
2. Crear reglas para permitir:
   - Puerto 80 (HTTP)
   - Puerto 443 (HTTPS)

**Síntoma del problema:** El sitio funcionaba localmente (`curl localhost`) pero no desde internet.

### Verificar con el MCP de Hostinger

```
Firewall ID: 180558
Reglas:
- Puerto 80 TCP: ACCEPT desde cualquiera
- Puerto 443 TCP: ACCEPT desde cualquiera
Estado: Sincronizado ✓
```

---

## 8. Dominios y DNS

### ¿Qué es un dominio?
Es un nombre legible para humanos que apunta a una IP:
- `transportesmardelsur.cl` → `72.61.4.202`

### ¿Qué es DNS?
**DNS (Domain Name System)** es como una "guía telefónica" de internet. Traduce nombres a IPs.

### Tipos de registros DNS

| Tipo | Función | Ejemplo |
|------|---------|---------|
| **A** | Apunta dominio a IPv4 | `@` → `72.61.4.202` |
| **AAAA** | Apunta dominio a IPv6 | `@` → `2a02:4780:...` |
| **CNAME** | Alias a otro dominio | `www` → `transportesmardelsur.cl` |
| **MX** | Servidor de correo | `@` → `mail.google.com` |
| **TXT** | Texto (verificaciones) | Verificar propiedad |

### Nameservers
Los nameservers son los servidores que tienen la información DNS de tu dominio:

```
Antes (nic.cl):
- ns1.nic.cl
- ns2.nic.cl

Después (Cloudflare):
- mallory.ns.cloudflare.com
- ruben.ns.cloudflare.com
```

### Propagación DNS
Cuando cambias DNS, los cambios tardan en "propagarse" por internet (hasta 24 horas, normalmente menos). Puedes verificar en:
- https://dnschecker.org

---

## 9. Cloudflare

### ¿Qué es Cloudflare?
Es un servicio que se pone "en medio" entre tus visitantes y tu servidor:

```
Usuario → Cloudflare → Tu VPS
```

### Beneficios gratuitos

1. **CDN (Content Delivery Network)**
   - Cachea tu sitio en servidores de todo el mundo
   - Visitantes cargan más rápido desde el servidor más cercano

2. **Protección DDoS**
   - Filtra ataques de denegación de servicio

3. **SSL/HTTPS gratis**
   - Certificado automático sin configurar nada

4. **Analytics**
   - Estadísticas de visitas sin Google Analytics

5. **Firewall**
   - Reglas para bloquear bots, países, etc.

### Modos de proxy

**Proxy activado (nube naranja):**
- El tráfico pasa por Cloudflare
- Tu IP real está oculta
- Tienes protección y caché

**Proxy desactivado (nube gris):**
- DNS puro, sin protección
- Solo traduce nombre → IP

### Configuración que hicimos

1. **Agregar dominio** a Cloudflare
2. **Configurar registros A:**
   - `@` (raíz) → `72.61.4.202`
   - `www` → `72.61.4.202`
3. **Cambiar nameservers** en nic.cl
4. **SSL/TLS en modo Full**

---

## 10. SSL/HTTPS

### ¿Qué es SSL/TLS?
Es el protocolo que encripta la comunicación entre el navegador y el servidor. El "candado verde" en el navegador.

### ¿Por qué es importante?
1. **Seguridad**: Datos encriptados (contraseñas, formularios)
2. **SEO**: Google favorece sitios HTTPS
3. **Confianza**: Usuarios confían más en sitios seguros

### Modos SSL en Cloudflare

| Modo | Descripción |
|------|-------------|
| **Off** | Sin HTTPS |
| **Flexible** | HTTPS solo entre usuario y Cloudflare |
| **Full** | HTTPS completo (Cloudflare acepta certificado autofirmado) |
| **Full (Strict)** | HTTPS con certificado válido en el servidor |

Usamos **Full** porque Cloudflare se encarga del certificado válido hacia el usuario.

### El código que comentamos

```python
# Force HTTPS in production (disabled temporarily)
# @app.before_request
# def force_https():
#     if not app.debug:
#         if request.headers.get('X-Forwarded-Proto', 'http') == 'http':
#             url = request.url.replace('http://', 'https://', 1)
#             return redirect(url, code=301)
```

Este código forzaba HTTPS, pero causaba redirecciones infinitas porque:
1. Usuario pide HTTP
2. Cloudflare convierte a HTTPS
3. Flask ve `X-Forwarded-Proto: http` (porque Cloudflare→Servidor es HTTP)
4. Flask redirige a HTTPS
5. Loop infinito

**Solución:** Cloudflare maneja HTTPS, no necesitamos forzarlo en Flask.

---

## 11. Comandos Útiles

### Actualizar el sitio (después de cambios)

En tu Mac:
```bash
git add .
git commit -m "Descripción del cambio"
git push origin master
```

En el servidor:
```bash
cd /opt/TransportesMarDelSur
git pull
docker compose down && docker compose up -d --build
```

### Ver logs del sitio

```bash
# Logs de Flask
docker logs mardelsur_web

# Logs de Nginx
docker logs mardelsur_nginx

# Seguir logs en tiempo real
docker logs -f mardelsur_web
```

### Reiniciar servicios

```bash
# Reiniciar todo
docker compose restart

# Reiniciar solo uno
docker compose restart web
docker compose restart nginx
```

### Verificar estado

```bash
# Ver contenedores
docker ps

# Probar localmente
curl -I http://localhost

# Ver uso de recursos
docker stats
```

---

## 12. Solución de Problemas

### El sitio no carga desde internet pero sí localmente
**Causa probable:** Firewall bloqueando puertos 80/443
**Solución:** Abrir puertos en el panel de Hostinger

### Nginx se reinicia constantemente
**Causa probable:** Error en configuración o certificados SSL faltantes
**Diagnóstico:**
```bash
docker logs mardelsur_nginx
```
**Solución:** Revisar configuración de nginx

### Cambios no se reflejan
**Causa probable:** No se reconstruyó la imagen Docker
**Solución:**
```bash
docker compose down
docker compose up -d --build  # --build es clave
```

### Error 502 Bad Gateway
**Causa probable:** Flask no está corriendo
**Diagnóstico:**
```bash
docker logs mardelsur_web
docker ps  # Verificar que el contenedor web esté "Up"
```

### Redirección infinita (ERR_TOO_MANY_REDIRECTS)
**Causa probable:** Conflicto entre redirección de Flask y Cloudflare
**Solución:** Comentar el force_https en Flask, dejar que Cloudflare maneje SSL

---

## Glosario

| Término | Significado |
|---------|-------------|
| **VPS** | Servidor virtual privado |
| **SSH** | Protocolo para conexión remota segura |
| **Docker** | Plataforma de contenedores |
| **Contenedor** | Ambiente aislado para ejecutar aplicaciones |
| **Imagen** | Plantilla para crear contenedores |
| **Nginx** | Servidor web / proxy inverso |
| **Proxy inverso** | Intermediario que recibe peticiones y las envía al backend |
| **DNS** | Sistema que traduce dominios a IPs |
| **Nameserver** | Servidor que responde consultas DNS |
| **CDN** | Red de distribución de contenido |
| **SSL/TLS** | Protocolo de encriptación para HTTPS |
| **Firewall** | Barrera que controla tráfico de red |
| **Puerto** | Punto de conexión para servicios de red |

---

## Recursos para seguir aprendiendo

- **Docker**: https://docs.docker.com/get-started/
- **Nginx**: https://nginx.org/en/docs/beginners_guide.html
- **Linux**: https://linuxjourney.com/
- **DNS**: https://howdns.works/
- **Cloudflare**: https://developers.cloudflare.com/fundamentals/

---

*Documento creado durante el despliegue del sitio transportesmardelsur.cl - Enero 2026*
