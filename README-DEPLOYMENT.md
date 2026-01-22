# 🚀 Guía de Despliegue - Transporte Mar del Sur

Esta guía te ayudará a desplegar tu sitio web en un VPS usando Docker.

## 📋 Requisitos Previos

1. **VPS con Ubuntu/Debian** (mínimo 1GB RAM, 1 vCPU)
2. **Dominio configurado** apuntando a la IP de tu VPS
3. **Acceso SSH** al servidor como root o con sudo

## 🔧 Paso 1: Preparar el Servidor

Conéctate a tu VPS por SSH:

```bash
ssh root@TU_IP_DEL_SERVIDOR
```

Actualiza el sistema:

```bash
apt update && apt upgrade -y
```

Instala Git:

```bash
apt install git -y
```

## 📦 Paso 2: Clonar el Proyecto

Clona tu repositorio en el servidor:

```bash
cd /var/www
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git mardelsur
cd mardelsur
```

O sube los archivos usando SCP desde tu computadora local:

```bash
# Desde tu computadora (no desde el VPS)
scp -r "/Users/bchavez/Proyectos/web Transportes mar del sur/" root@TU_IP:/var/www/mardelsur
```

## 🐳 Paso 3: Desplegar con Docker

Ejecuta el script de despliegue:

```bash
cd /var/www/mardelsur
chmod +x deploy.sh
./deploy.sh
```

Este script:
- ✅ Instala Docker y Docker Compose si no están instalados
- ✅ Construye las imágenes Docker
- ✅ Inicia los contenedores (Nginx, Flask, Certbot)
- ✅ Configura el proxy reverso

## 🔒 Paso 4: Configurar SSL (HTTPS)

**IMPORTANTE:** Antes de ejecutar este paso, asegúrate de que tu dominio ya apunte a la IP de tu servidor.

Para verificar que el dominio apunta correctamente:

```bash
ping transportemardelsur.cl
# Debe mostrar la IP de tu VPS
```

Una vez confirmado, ejecuta:

```bash
chmod +x ssl-setup.sh
./ssl-setup.sh
```

Sigue las instrucciones:
1. Ingresa tu dominio (ejemplo: `transportemardelsur.cl`)
2. Ingresa tu email para notificaciones de Let's Encrypt
3. El script obtendrá automáticamente el certificado SSL

## 🌐 Paso 5: Configurar el DNS de tu Dominio

En el panel de tu proveedor de dominios (GoDaddy, Namecheap, etc.), configura:

### Registros DNS:

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A    | @      | TU_IP_VPS | 3600 |
| A    | www    | TU_IP_VPS | 3600 |

**Ejemplo:**
```
A    @      192.168.1.100    3600
A    www    192.168.1.100    3600
```

Los cambios DNS pueden tardar entre 5 minutos y 48 horas en propagarse.

## ✅ Verificar el Despliegue

1. **Verificar contenedores:**
   ```bash
   docker-compose ps
   ```
   Deberías ver 3 contenedores corriendo: `web`, `nginx`, `certbot`

2. **Ver logs:**
   ```bash
   docker-compose logs -f web
   ```

3. **Probar el sitio:**
   - HTTP: http://tu-dominio.com (debería redirigir a HTTPS)
   - HTTPS: https://tu-dominio.com

## 🔄 Comandos Útiles

### Ver estado de contenedores:
```bash
docker-compose ps
```

### Ver logs en tiempo real:
```bash
docker-compose logs -f
docker-compose logs -f web      # Solo logs de Flask
docker-compose logs -f nginx    # Solo logs de Nginx
```

### Reiniciar servicios:
```bash
docker-compose restart          # Reiniciar todo
docker-compose restart web      # Solo reiniciar Flask
docker-compose restart nginx    # Solo reiniciar Nginx
```

### Detener servicios:
```bash
docker-compose down
```

### Iniciar servicios:
```bash
docker-compose up -d
```

### Ver uso de recursos:
```bash
docker stats
```

## 🛠️ Mantenimiento y Actualizaciones

### Actualizar el código:

```bash
cd /var/www/mardelsur

# Opción 1: Desde Git
git pull origin main

# Opción 2: Subir archivos desde tu computadora
# scp -r ./templates root@TU_IP:/var/www/mardelsur/
# scp -r ./static root@TU_IP:/var/www/mardelsur/

# Reconstruir y reiniciar
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Actualizar solo templates/static (sin reconstruir):

Si solo modificaste archivos HTML, CSS, o JS:

```bash
cd /var/www/mardelsur
git pull origin main
docker-compose restart web
```

### Backup de la aplicación:

```bash
# Crear backup
tar -czf mardelsur-backup-$(date +%Y%m%d).tar.gz /var/www/mardelsur

# Restaurar backup
tar -xzf mardelsur-backup-YYYYMMDD.tar.gz -C /
```

## 🔥 Firewall (Seguridad)

Configura el firewall para permitir solo los puertos necesarios:

```bash
# Instalar UFW
apt install ufw -y

# Configurar reglas
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp

# Activar firewall
ufw enable

# Ver estado
ufw status
```

## 📊 Monitoreo

### Ver uso de CPU/RAM:
```bash
htop
```

### Ver uso de disco:
```bash
df -h
```

### Ver logs del sistema:
```bash
journalctl -u docker -f
```

## 🐛 Solución de Problemas

### El sitio no carga:

1. Verificar que los contenedores estén corriendo:
   ```bash
   docker-compose ps
   ```

2. Verificar logs:
   ```bash
   docker-compose logs web
   docker-compose logs nginx
   ```

3. Verificar que los puertos estén abiertos:
   ```bash
   netstat -tlnp | grep -E '80|443|5001'
   ```

### Error de SSL:

1. Verificar que el dominio apunte a tu IP:
   ```bash
   dig transportemardelsur.cl
   ```

2. Verificar certificados:
   ```bash
   docker-compose exec nginx ls -la /etc/letsencrypt/live/
   ```

3. Volver a obtener certificado:
   ```bash
   ./ssl-setup.sh
   ```

### Contenedor no inicia:

1. Ver logs detallados:
   ```bash
   docker-compose logs web
   ```

2. Reconstruir desde cero:
   ```bash
   docker-compose down -v
   docker-compose build --no-cache
   docker-compose up -d
   ```

## 📱 Contacto y Soporte

Si tienes problemas, verifica:
1. ✅ Los contenedores están corriendo
2. ✅ El dominio apunta a tu IP
3. ✅ Los puertos 80 y 443 están abiertos
4. ✅ Los logs no muestran errores críticos

## 📚 Archivos Importantes

- `Dockerfile` - Configuración de la imagen Docker
- `docker-compose.yml` - Orquestación de contenedores
- `nginx/nginx.conf` - Configuración principal de Nginx
- `nginx/conf.d/mardelsur.conf` - Configuración del sitio
- `deploy.sh` - Script de despliegue automatizado
- `ssl-setup.sh` - Script de configuración SSL
- `.dockerignore` - Archivos excluidos de la imagen

## 🎉 ¡Listo!

Tu sitio web ahora está:
- ✅ Desplegado en producción con Docker
- ✅ Protegido con HTTPS/SSL
- ✅ Configurado con proxy reverso Nginx
- ✅ Con renovación automática de certificados
- ✅ Optimizado para producción con Gunicorn

**URL del sitio:** https://transportemardelsur.cl
