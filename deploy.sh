#!/bin/bash

# Script de deployment para Streaming Platform PoC
# Para HomeLab con Kubernetes

set -e

echo "🚀 Deployment de Streaming Platform PoC"
echo "========================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl no está instalado${NC}"
    exit 1
fi

# Check if docker is available
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ docker no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisitos OK${NC}"

# Step 1: Build backend image
echo ""
echo "📦 Paso 1: Construyendo imagen del backend..."
cd backend
docker build -t streaming-api:latest .
cd ..
echo -e "${GREEN}✅ Imagen del backend construida${NC}"

# Step 2: Create namespace
echo ""
echo "🔧 Paso 2: Creando namespace..."
kubectl apply -f k8s/namespace.yaml
echo -e "${GREEN}✅ Namespace creado${NC}"

# Step 3: Deploy PostgreSQL
echo ""
echo "🐘 Paso 3: Deployando PostgreSQL..."
kubectl apply -f k8s/postgres-deployment.yaml
echo "Esperando a que PostgreSQL esté listo..."
kubectl wait --for=condition=ready pod -l app=postgres -n streaming-poc --timeout=120s
echo -e "${GREEN}✅ PostgreSQL deployado${NC}"

# Step 4: Deploy MinIO
echo ""
echo "💾 Paso 4: Deployando MinIO..."
kubectl apply -f k8s/minio-deployment.yaml
echo "Esperando a que MinIO esté listo..."
kubectl wait --for=condition=ready pod -l app=minio -n streaming-poc --timeout=120s
echo -e "${GREEN}✅ MinIO deployado${NC}"

# Step 5: Deploy nginx-rtmp
echo ""
echo "📡 Paso 5: Deployando nginx-rtmp..."
kubectl apply -f k8s/nginx-rtmp-deployment.yaml
echo "Esperando a que nginx-rtmp esté listo..."
kubectl wait --for=condition=ready pod -l app=nginx-rtmp -n streaming-poc --timeout=120s
echo -e "${GREEN}✅ nginx-rtmp deployado${NC}"

# Step 6: Deploy transcoder
echo ""
echo "🎬 Paso 6: Deployando transcoder..."
kubectl apply -f k8s/transcoder-deployment.yaml
echo "Esperando a que transcoder esté listo..."
kubectl wait --for=condition=ready pod -l app=transcoder -n streaming-poc --timeout=120s
echo -e "${GREEN}✅ Transcoder deployado${NC}"

# Step 7: Deploy API
echo ""
echo "🔌 Paso 7: Deployando API backend..."
kubectl apply -f k8s/api-deployment.yaml
echo "Esperando a que API esté lista..."
kubectl wait --for=condition=ready pod -l app=streaming-api -n streaming-poc --timeout=120s
echo -e "${GREEN}✅ API deployada${NC}"

# Step 8: Deploy Ingress
echo ""
echo "🌐 Paso 8: Configurando Ingress..."
kubectl apply -f k8s/ingress.yaml
echo -e "${GREEN}✅ Ingress configurado${NC}"

# Get NodePort for RTMP
echo ""
echo "============================================"
echo -e "${GREEN}✅ Deployment completado!${NC}"
echo "============================================"
echo ""
echo "📊 Estado de los servicios:"
kubectl get pods -n streaming-poc
echo ""
echo "🔗 Endpoints:"
echo ""
echo "RTMP Server:"
NODEPORT=$(kubectl get svc nginx-rtmp -n streaming-poc -o jsonpath='{.spec.ports[0].nodePort}')
echo "  rtmp://$(hostname -I | awk '{print $1}'):${NODEPORT}/live"
echo ""
echo "API Backend:"
echo "  http://$(hostname -I | awk '{print $1}'):$(kubectl get svc streaming-api -n streaming-poc -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null || echo '3000')"
echo ""
echo "MinIO Console:"
echo "  http://$(hostname -I | awk '{print $1}'):$(kubectl get svc minio -n streaming-poc -o jsonpath='{.spec.ports[1].nodePort}' 2>/dev/null || echo '9001')"
echo ""
echo "============================================"
echo ""
echo "📝 Próximos pasos:"
echo "1. Configura port-forward para el API:"
echo "   kubectl port-forward -n streaming-poc svc/streaming-api 3000:3000"
echo ""
echo "2. Configura tu frontend con:"
echo "   NEXT_PUBLIC_API_URL=http://localhost:3000"
echo ""
echo "3. Configura OBS con la URL RTMP mostrada arriba"
echo ""
echo "Para logs:"
echo "  kubectl logs -f -l app=streaming-api -n streaming-poc"
echo "  kubectl logs -f -l app=nginx-rtmp -n streaming-poc"
echo ""