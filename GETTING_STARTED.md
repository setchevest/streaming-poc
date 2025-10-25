# 🚀 Getting Started - Streaming Platform PoC

This guide will take you from 0 to streaming live in less than 30 minutes.

## 📦 Option 1: Docker Compose (Recommended for beginners)

### Step 1: Clone and Setup

```bash
# Create project directory
mkdir streaming-platform-poc
cd streaming-platform-poc

# Create basic structure
mkdir -p backend frontend k8s
```

### Step 2: Create necessary files

Copy all provided files into the structure:

```
streaming-platform-poc/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── create/page.tsx
│   │   └── watch/[id]/page.tsx
│   ├── components/
│   │   └── VideoPlayer.tsx
│   └── package.json
├── docker-compose.yml
├── nginx-rtmp.conf
├── transcoder.conf
├── quick-start.sh
├── .env.example
└── .gitignore
```

### Step 3: Start backend services

```bash
# Give script permissions
chmod +x quick-start.sh

# Execute
./quick-start.sh
```

This will start:
- ✅ PostgreSQL (database)
- ✅ MinIO (S3 storage)
- ✅ nginx-rtmp (RTMP server)
- ✅ Transcoder (HLS conversion)
- ✅ API Backend (Node.js)

### Step 4: Configure Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3000
EOF

# Start frontend
npm run dev
```

Frontend available at: **http://localhost:3001**

### Step 5: Create your first event

1. Open http://localhost:3001
2. Click on "Create Event"
3. Fill out:
   - Title: "My First Stream"
   - Description: "Streaming test"
4. Save the credentials:
   - **RTMP URL**: `rtmp://localhost:1935/live`
   - **Stream Key**: `<copy the generated one>`

### Step 6: Configure OBS

1. Open OBS Studio
2. **Settings → Stream**
   - Service: **Custom**
   - Server: `rtmp://localhost:1935/live`
   - Key: `<paste your stream key>`
3. Add a video source (webcam)
4. Click on **Start Streaming**

### Step 7: View the stream

1. Go to http://localhost:3001
2. The event will show "LIVE"
3. Click to view the stream

**🎉 Congratulations! You are streaming live.**

---

## ☸️ Option 2: Kubernetes (For production)

### Prerequisites

- Running Kubernetes cluster
- kubectl configured
- Docker installed

### Step 1: Build backend image

```bash
cd backend
docker build -t streaming-api:latest .
cd ..
```

### Step 2: Configure public IP

Edit `k8s/api-deployment.yaml`:

```yaml
data:
  PUBLIC_HOST: "192.168.1.100" # Your IP
```

### Step 3: Deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

### Step 4: Port Forward

```bash
# API
kubectl port-forward -n streaming-poc svc/streaming-api 3000:3000

# Transcoder (HLS)
kubectl port-forward -n streaming-poc svc/transcoder 8081:8080
```

### Step 5: Frontend

Same process as with Docker Compose (Step 4 above)

### RTMP URL

The RTMP port is exposed via NodePort on port **31935**:

```
rtmp://<YOUR-IP>:31935/live
```

---

## 🎥 Recommended OBS Configuration

### For 720p (normal bandwidth)

```
Settings → Output:
- Encoder: NVENC H.264 (if you have Nvidia GPU)
- Rate Control: CBR
- Bitrate: 2500 kbps
- Keyframe Interval: 2
- Preset: Quality

Settings → Video:
- Base Resolution: 1920x1080
- Output Resolution: 1280x720
- FPS: 30
```

### For 1080p (good connection)

```
Settings → Output:
- Bitrate: 4500 kbps
- Rest same

Settings → Video:
- Output Resolution: 1920x1080
```

### For weak connection

```
Settings → Output:
- Bitrate: 1000 kbps

Settings → Video:
- Output Resolution: 854x480
- FPS: 30
```

---

## 🔧 Verification and Troubleshooting

### Verify services (Docker Compose)

```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f

# View specific logs
docker-compose logs -f streaming-api
docker-compose logs -f nginx-rtmp
docker-compose logs -f transcoder
```

### Verify services (Kubernetes)

```bash
# View pods
kubectl get pods -n streaming-poc

# View logs
kubectl logs -f -l app=streaming-api -n streaming-poc
kubectl logs -f -l app=nginx-rtmp -n streaming-poc
```

### Manual API test

```bash
# Health check
curl http://localhost:3000/health

# Create test event
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event","description":"Testing"}'

# List events
curl http://localhost:3000/api/events
```

### RTMP test

```bash
# Verify RTMP port
telnet localhost 1935

# View nginx-rtmp statistics
curl http://localhost:8080/stat
```

### Common problems

**OBS doesn't connect:**
```bash
# Verify port is open
netstat -an | grep 1935

# Verify nginx-rtmp logs
docker-compose logs nginx-rtmp
```

**Stream not showing:**
```bash
# Verify transcoder is generating HLS
ls -la /tmp/hls/  # Inside the container
docker-compose exec transcoder ls -la /tmp/hls/

# Verify HLS URL in DB
docker-compose exec postgres psql -U streamuser -d streaming -c "SELECT * FROM events;"
```

**Laggy/cut video:**
- Reduce bitrate in OBS
- Check your upload speed: speedtest.net
- Use ethernet instead of WiFi
- Close other internet-using applications

---

## 📱 Streaming from mobile

### Android/iOS: Larix Broadcaster

1. Download Larix Broadcaster
2. Settings → Connections → New Connection
3. Name: My Platform
4. URL: `rtmp://YOUR_IP:1935/live/<stream-key>`
5. Tap to connect and start

### Recommended Larix configuration

- Resolution: 1280x720
- Bitrate: 2000 kbps
- FPS: 30
- Codec: H.264

---

## 🌐 Expose to the Internet (Cloudflare Tunnel)

### Quick setup

```bash
# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Login
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create streaming

# Configure
cat > ~/.cloudflared/config.yml << EOF
tunnel: <TUNNEL-ID>
credentials-file: ~/.cloudflared/<TUNNEL-ID>.json

ingress:
  - hostname: stream.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
EOF

# Create DNS
cloudflared tunnel route dns streaming stream.yourdomain.com

# Run tunnel
cloudflared tunnel run streaming
```

**Note**: RTMP cannot be tunneled with Cloudflare. For RTMP you'll need to open port 1935 on your router or use a VPS/VPN.

---

## 🎯 Production Roadmap

### Phase 1: Basic Functionality ✅
- [x] RTMP ingestion
- [x] HLS transcoding
- [x] Web player
- [x] Database
- [x] Storage

### Phase 2: Improvements (2-4 weeks)
- [ ] User authentication
- [ ] Admin dashboard
- [ ] VOD recording
- [ ] Automatic thumbnails
- [ ] Improved adaptive quality

### Phase 3: Advanced Features (1-2 months)
- [ ] Live chat
- [ ] Monetization (subscriptions)
- [ ] Analytics and metrics
- [ ] Multi-camera
- [ ] Integration with Frigate

---

## 📚 Additional Resources

- **OBS_CONFIG.md**: Detailed OBS configuration guide
- **README.md**: Complete documentation
- **OBS Documentation**: https://obsproject.com/wiki/
- **nginx-rtmp docs**: https://github.com/arut/nginx-rtmp-module/wiki

---

## 💬 Support

Having issues? Check the logs:
```bash
# Docker Compose
docker-compose logs -f

# Kubernetes
kubectl logs -f -l app=streaming-api -n streaming-poc
```

**Good luck with your streaming platform! 🎬**
