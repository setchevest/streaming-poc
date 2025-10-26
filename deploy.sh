#!/bin/bash

# Deployment script for Streaming Platform PoC
# For HomeLab with Kubernetes

set -e

echo "🚀 Deploying Streaming Platform PoC"
echo "========================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl is not installed${NC}"
    exit 1
fi

# Check if docker is available
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ docker is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites OK${NC}"

# Step 1: Build backend image
echo ""
echo "📦 Step 1: Building backend image..."
cd backend
docker build -t streaming-api:latest .
cd ..
echo -e "${GREEN}✅ Backend image built${NC}"

# Step 2: Create namespace
echo ""
echo "🔧 Step 2: Creating namespace..."
kubectl apply -f k8s/namespace.yaml
echo -e "${GREEN}✅ Namespace created${NC}"

# Step 3: Deploy PostgreSQL
echo ""
echo "🐘 Step 3: Deploying PostgreSQL..."
kubectl apply -f k8s/postgres-deployment.yaml
echo "Waiting for PostgreSQL to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n streaming-poc --timeout=120s
echo -e "${GREEN}✅ PostgreSQL deployed${NC}"

# Step 4: Deploy MinIO
echo ""
echo "💾 Step 4: Deploying MinIO..."
kubectl apply -f k8s/minio-deployment.yaml
echo "Waiting for MinIO to be ready..."
kubectl wait --for=condition=ready pod -l app=minio -n streaming-poc --timeout=120s
echo -e "${GREEN}✅ MinIO deployed${NC}"

# Step 5: Deploy nginx-rtmp
echo ""
echo "📡 Step 5: Deploying nginx-rtmp..."
kubectl apply -f k8s/nginx-rtmp-deployment.yaml
echo "Waiting for nginx-rtmp to be ready..."
kubectl wait --for=condition=ready pod -l app=nginx-rtmp -n streaming-poc --timeout=120s
echo -e "${GREEN}✅ nginx-rtmp deployed${NC}"

# Step 6: Deploy transcoder
echo ""
echo "🎬 Step 6: Deploying transcoder..."
kubectl apply -f k8s/transcoder-deployment.yaml
echo "Waiting for transcoder to be ready..."
kubectl wait --for=condition=ready pod -l app=transcoder -n streaming-poc --timeout=120s
echo -e "${GREEN}✅ Transcoder deployed${NC}"

# Step 7: Deploy API
echo ""
echo "🔌 Step 7: Deploying backend API..."
kubectl apply -f k8s/api-deployment.yaml
echo "Waiting for API to be ready..."
kubectl wait --for=condition=ready pod -l app=streaming-api -n streaming-poc --timeout=120s
echo -e "${GREEN}✅ API deployed${NC}"

# Step 8: Deploy Ingress
echo ""
echo "🌐 Step 8: Configuring Ingress..."
kubectl apply -f k8s/ingress.yaml
echo -e "${GREEN}✅ Ingress configured${NC}"

# Get NodePort for RTMP
echo ""
echo "============================================"
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo "============================================"
echo ""
echo "📊 Service status:"
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
echo "📝 Next steps:"
echo "1. Configure port-forward for the API:"
echo "   kubectl port-forward -n streaming-poc svc/streaming-api 3000:3000"
echo ""
echo "2. Configure your frontend with:"
echo "   NEXT_PUBLIC_API_URL=http://localhost:3000"
echo ""
echo "3. Configure OBS with the RTMP URL shown above"
echo ""
echo "For logs:"
echo "  kubectl logs -f -l app=streaming-api -n streaming-poc"
echo "  kubectl logs -f -l app=nginx-rtmp -n streaming-poc"
echo ""
