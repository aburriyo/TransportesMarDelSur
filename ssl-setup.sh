#!/bin/bash

# SSL Certificate Setup Script using Let's Encrypt
# Run this AFTER deploy.sh and after your domain points to your VPS

set -e

echo "🔒 Configurando certificados SSL con Let's Encrypt..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Por favor ejecuta este script como root o con sudo${NC}"
    exit 1
fi

# Get domain name
read -p "Ingresa tu dominio (ejemplo: transportemardelsur.cl): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ Debes ingresar un dominio${NC}"
    exit 1
fi

# Get email for Let's Encrypt
read -p "Ingresa tu email para Let's Encrypt: " EMAIL

if [ -z "$EMAIL" ]; then
    echo -e "${RED}❌ Debes ingresar un email${NC}"
    exit 1
fi

echo -e "${YELLOW}📝 Dominio: $DOMAIN${NC}"
echo -e "${YELLOW}📧 Email: $EMAIL${NC}"

# Create directories for certbot
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

# First, update nginx config with your actual domain
echo -e "${YELLOW}📝 Actualizando configuración de Nginx...${NC}"
sed -i "s/transportemardelsur.cl/$DOMAIN/g" nginx/conf.d/mardelsur.conf

# Restart nginx to pick up changes
echo -e "${YELLOW}🔄 Reiniciando Nginx...${NC}"
docker-compose restart nginx

# Get SSL certificate
echo -e "${YELLOW}🔐 Obteniendo certificado SSL...${NC}"
docker-compose run --rm certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Certificado SSL obtenido correctamente${NC}"

    # Restart nginx to use the new certificate
    echo -e "${YELLOW}🔄 Reiniciando Nginx con SSL...${NC}"
    docker-compose restart nginx

    echo -e "${GREEN}🎉 ¡SSL configurado exitosamente!${NC}"
    echo -e "${GREEN}🌐 Tu sitio ahora está disponible en https://$DOMAIN${NC}"
else
    echo -e "${RED}❌ Error al obtener el certificado SSL${NC}"
    echo -e "${YELLOW}Verifica que:${NC}"
    echo -e "${YELLOW}  1. Tu dominio apunte a la IP de este servidor${NC}"
    echo -e "${YELLOW}  2. Los puertos 80 y 443 estén abiertos${NC}"
    echo -e "${YELLOW}  3. Nginx esté funcionando correctamente${NC}"
    exit 1
fi

echo -e "\n${YELLOW}📝 Nota: El certificado se renovará automáticamente cada 12 horas${NC}"
