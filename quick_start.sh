#!/bin/bash

# Quick Start Script - Docker Compose Version
# Para desarrollo local sin Kubernetes

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════╗"
echo "║   🎥 Streaming Platform - Quick Start        ║"
echo "║   Docker Compose Edition                     ║"
echo "╚═══════════════════════════════════════════════╝"
echo -e "${NC}"

# Check prerequisites
echo -e "${YELLOW}Verificando prerequisitos...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker y Docker Compose encontrados${NC}"

# Create directory structure
echo ""
echo -e "${YELLOW}Creando estructura de directorios...${NC}"
mkdir -p backend frontend

# Stop any existing containers
echo ""
echo -e "${YELLOW}Deteniendo contenedores existentes...${NC}"
docker-compose down 2>/dev/null || true

# Build and start services
echo ""
echo -e "${YELLOW}Construyendo e iniciando servicios...${NC}"
docker-compose up -d --build

# Wait for services to be healthy
echo ""
echo -e "${YELLOW}Esperando a que los servicios estén listos...${NC}"

echo -n "PostgreSQL"
until docker-compose exec -T postgres pg_isready -U streamuser &>/dev/null; do
    echo -n "."
    sleep 2
done
echo -e " ${GREEN}✓${NC}"

echo -n "MinIO"
until curl -sf http://localhost:9000/minio/health/live &>/dev/null; do
    echo -n "."
    sleep 2
done
echo -e " ${GREEN}✓${NC}"

echo -n "API Backend"
until curl -sf http://localhost:3000/health &>/dev/null; do
    echo -n "."
    sleep 2
done
echo -e " ${GREEN}✓${NC}"

echo -n "nginx-rtmp"
until curl -sf http://localhost:8080/health &>/dev/null; do
    echo -n "."
    sleep 2
done
echo -e " ${GREEN}✓${NC}"

echo -n "Transcoder"
until curl -sf http://localhost:8081/health &>/dev/null; do
    echo -n "."
    sleep 2
done
echo -e " ${GREEN}✓${NC}"

# Get local IP
LOCAL_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "localhost")

# Success message
echo ""
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════╗"
echo "║   ✅ ¡Todos los servicios están listos!      ║"
echo "╚═══════════════════════════════════════════════╝"
echo -e "${NC}"

echo ""
echo -e "${BLUE}📊 Servicios Disponibles:${NC}"
echo ""
echo -e "  ${GREEN}API Backend:${NC}"
echo -e "    http://localhost:3000"
echo -e "    http://${LOCAL_IP}:3000"
echo ""
echo -e "  ${GREEN}RTMP Server (para OBS):${NC}"
echo -e "    rtmp://localhost:1935/live"
echo -e "    rtmp://${LOCAL_IP}:1935/live"
echo ""
echo -e "  ${GREEN}HLS Streams:${NC}"
echo -e "    http://localhost:8081/hls/<stream-key>.m3u8"
echo ""
echo -e "  ${GREEN}MinIO Console:${NC}"
echo -e "    http://localhost:9001"
echo -e "    User: minioadmin / Pass: minioadmin123"
echo ""
echo -e "  ${GREEN}nginx-rtmp Stats:${NC}"
echo -e "    http://localhost:8080/stat"
echo ""

echo -e "${BLUE}📝 Próximos Pasos:${NC}"
echo ""
echo "1. Configura el frontend:"
echo -e "   ${YELLOW}cd frontend${NC}"
echo -e "   ${YELLOW}npm install${NC}"
echo -e "   ${YELLOW}echo 'NEXT_PUBLIC_API_URL=http://localhost:3000' > .env.local${NC}"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "2. Crea un evento en: http://localhost:3001"
echo ""
echo "3. Configura OBS:"
echo "   - Servidor: rtmp://${LOCAL_IP}:1935/live"
echo "   - Clave: <usa la stream key del evento creado>"
echo ""
echo "4. ¡Comienza a transmitir!"
echo ""

echo -e "${BLUE}🔧 Comandos Útiles:${NC}"
echo ""
echo -e "  Ver logs:        ${YELLOW}docker-compose logs -f${NC}"
echo -e "  Ver logs API:    ${YELLOW}docker-compose logs -f streaming-api${NC}"
echo -e "  Detener:         ${YELLOW}docker-compose down${NC}"
echo -e "  Reiniciar:       ${YELLOW}docker-compose restart${NC}"
echo -e "  Ver estado:      ${YELLOW}docker-compose ps${NC}"
echo ""

echo -e "${GREEN}¡Listo para transmitir! 🎉${NC}"
echo ""