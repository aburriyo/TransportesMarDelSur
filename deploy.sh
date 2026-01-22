#!/bin/bash

# Deployment script for Transporte Mar del Sur
# Run this script on your VPS to deploy or update the application

set -e

echo "🚀 Iniciando despliegue de Transporte Mar del Sur..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Por favor ejecuta este script como root o con sudo${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker no está instalado. Instalando...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl start docker
    systemctl enable docker
    echo -e "${GREEN}✅ Docker instalado correctamente${NC}"
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker Compose no está instalado. Instalando...${NC}"
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose instalado correctamente${NC}"
fi

# Stop existing containers
echo -e "${YELLOW}🛑 Deteniendo contenedores existentes...${NC}"
docker-compose down 2>/dev/null || true

# Build and start containers
echo -e "${YELLOW}🔨 Construyendo imágenes Docker...${NC}"
docker-compose build --no-cache

echo -e "${YELLOW}🚀 Iniciando contenedores...${NC}"
docker-compose up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Esperando que los servicios estén listos...${NC}"
sleep 10

# Check container status
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Contenedores iniciados correctamente${NC}"
    docker-compose ps
else
    echo -e "${RED}❌ Error al iniciar los contenedores${NC}"
    docker-compose logs
    exit 1
fi

# Show logs
echo -e "\n${YELLOW}📋 Últimos logs:${NC}"
docker-compose logs --tail=50

echo -e "\n${GREEN}🎉 ¡Despliegue completado exitosamente!${NC}"
echo -e "${GREEN}🌐 Tu sitio debería estar disponible en http://tu-dominio.com${NC}"
echo -e "${YELLOW}📝 Para ver logs en tiempo real: docker-compose logs -f${NC}"
echo -e "${YELLOW}🔄 Para reiniciar: docker-compose restart${NC}"
echo -e "${YELLOW}🛑 Para detener: docker-compose down${NC}"
