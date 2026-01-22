# ⚡ Inicio Rápido - Despliegue en 5 Pasos

Esta es la guía EXPRESS para desplegar tu sitio web. Para más detalles, consulta `README-DEPLOYMENT.md`.

## 🎯 Requisitos
- VPS Ubuntu/Debian con acceso SSH
- Dominio apuntando a la IP del VPS

## 📝 Paso a Paso

### 1️⃣ Conectar al VPS
```bash
ssh root@TU_IP_SERVIDOR
```

### 2️⃣ Subir Archivos
Desde tu computadora local:
```bash
scp -r "/Users/bchavez/Proyectos/web Transportes mar del sur/" root@TU_IP:/var/www/mardelsur
```

### 3️⃣ Desplegar
En el VPS:
```bash
cd /var/www/mardelsur
chmod +x deploy.sh
./deploy.sh
```

### 4️⃣ Configurar SSL
```bash
chmod +x ssl-setup.sh
./ssl-setup.sh
```
- Ingresa tu dominio: `transportemardelsur.cl`
- Ingresa tu email para Let's Encrypt

### 5️⃣ Configurar DNS
En tu proveedor de dominios:
- **Tipo A** → `@` → `IP_DE_TU_VPS`
- **Tipo A** → `www` → `IP_DE_TU_VPS`

## ✅ Verificar
```bash
# Ver contenedores
docker-compose ps

# Ver logs
docker-compose logs -f

# Probar sitio
curl https://tu-dominio.com
```

## 🔄 Actualizar Código
```bash
cd /var/www/mardelsur
# Subir archivos nuevos desde tu PC con SCP
docker-compose restart web
```

## 🆘 Problemas Comunes

**Sitio no carga:**
```bash
docker-compose logs web
docker-compose restart
```

**Error SSL:**
```bash
# Verifica que el dominio apunte a tu IP
dig tu-dominio.com

# Vuelve a ejecutar
./ssl-setup.sh
```

**Puerto ocupado:**
```bash
# Ver qué usa el puerto 80
netstat -tlnp | grep :80

# Detener servicio conflictivo
systemctl stop apache2  # o nginx si existe
```

## 📱 Comandos Útiles
```bash
docker-compose ps              # Ver estado
docker-compose logs -f         # Ver logs
docker-compose restart         # Reiniciar
docker-compose down            # Detener
docker-compose up -d           # Iniciar
```

## 🎉 ¡Listo!
Tu sitio está en: **https://transportemardelsur.cl**

Para más detalles: lee `README-DEPLOYMENT.md`
