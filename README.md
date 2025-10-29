# 🎥 Streaming Platform PoC - HomeLab Edition

Live streaming platform for small club sporting events, deployable in your homelab with Kubernetes.

## 📋 Prerequisites

### Minimum Hardware
- **Main Server**: 16GB RAM, 4 cores CPU, 100GB SSD
- **Streaming**: Laptop with OBS or smartphone with Larix
- **Internet**: 5 Mbps upload minimum for 720p streaming

### Software
- ✅ Kubernetes (K3s, Microk8s, or vanilla Kubernetes)
- ✅ Docker
- ✅ kubectl configured
- ✅ nginx-ingress controller (optional but recommended)
- ✅ Node.js 18+ (for frontend development)

## 🏗️ Architecture

```
OBS/Larix → RTMP (port 31935) → nginx-rtmp → transcoder → HLS → MinIO
                                      ↓
                                    API Backend ← Frontend
                                      ↓
                                  PostgreSQL
```

## 🚀 Quick Installation

### 1. Clone the repository

```bash
git clone <your-repo>
cd streaming-platform-poc
```

### 2. Directory structure

```
streaming-platform-poc/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── create/
│   │   └── watch/
│   ├── components/
│   │   └── VideoPlayer.tsx
│   └── package.json
├── k8s/
│   ├── namespace.yaml
│   ├── postgres-deployment.yaml
│   ├── minio-deployment.yaml
│   ├── nginx-rtmp-deployment.yaml
│   ├── transcoder-deployment.yaml
│   ├── api-deployment.yaml
│   └── ingress.yaml
└── deploy.sh
```

### 3. Configure environment variables

Edit `k8s/api-deployment.yaml` and update:

```yaml
data:
  PUBLIC_HOST: "YOUR_HOMELAB_IP" # Example: "192.168.1.100"
```

### 4. Deploy backend in Kubernetes

```bash
# Give execution permissions to the script
chmod +x deploy.sh

# Execute deployment
./deploy.sh
```

This will:
- ✅ Build the backend Docker image
- ✅ Create namespace `streaming-poc`
- ✅ Deploy PostgreSQL
- ✅ Deploy MinIO
- ✅ Deploy nginx-rtmp
- ✅ Deploy transcoder
- ✅ Deploy API backend

### 5. Expose the API (Port Forward)

```bash
kubectl port-forward -n streaming-poc svc/streaming-api 8000:8000
```

Or if you have Ingress configured, access via your domain.

### 6. Setup Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Development mode
npm run dev
```

Frontend will be available at: `http://localhost:3001`

## 🎬 Usage

### Create an Event

1. Go to `http://localhost:3001`
2. Click on "Create Event"
3. Fill out the form
4. Save the **RTMP URL** and **Stream Key**

### Configure OBS Studio

1. Open OBS Studio
2. Go to **Settings → Stream**
3. Select **Service: Custom**
4. **Server**: `rtmp://YOUR_IP:31935/live`
5. **Key**: `<your-stream-key>`
6. Click on **Start Streaming**

### View the Stream

1. Go to the main page
2. The event will show "LIVE" status when you start streaming
3. Click on the event to view the stream

## 🔧 Advanced Configuration

### Expose with Cloudflare Tunnel

```bash
# Install cloudflared
# Linux
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Authenticate
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create streaming-platform

# Configure tunnel
cat > ~/.cloudflared/config.yml << EOF
tunnel: <TUNNEL-ID>
credentials-file: /home/<USER>/.cloudflared/<TUNNEL-ID>.json

ingress:
  - hostname: stream.yourdomain.com
    service: http://localhost:8000
  - service: http_status:404
EOF

# Create DNS record
cloudflared tunnel route dns streaming-platform stream.yourdomain.com

# Run tunnel
cloudflared tunnel run streaming-platform
```

### Quality Configuration (Transcoder)

Edit `k8s/transcoder-deployment.yaml` to adjust HLS variants:

```nginx
# For lower latency (sacrifices quality)
hls_fragment 2;
hls_playlist_length 20;

# For better quality (more latency)
hls_fragment 6;
hls_playlist_length 60;
```

### Persistent Storage

By default uses `emptyDir` for HLS segments. For production, configure PVCs:

```yaml
volumes:
- name: hls-storage
  persistentVolumeClaim:
    claimName: hls-pvc
```

## 📊 Monitoring

### View logs

```bash
# API Backend
kubectl logs -f -l app=streaming-api -n streaming-poc

# nginx-rtmp (ingest)
kubectl logs -f -l app=nginx-rtmp -n streaming-poc

# Transcoder
kubectl logs -f -l app=transcoder -n streaming-poc
```

### View active streams

```bash
# nginx-rtmp stats
curl http://<NODE-IP>:<NGINX-HTTP-PORT>/stat
```

### View resources

```bash
kubectl top pods -n streaming-poc
```

## 🐛 Troubleshooting

### OBS cannot connect

1. Verify that port 31935 is accessible:
   ```bash
   telnet <YOUR-IP> 31935
   ```

2. Check nginx-rtmp logs:
   ```bash
   kubectl logs -l app=nginx-rtmp -n streaming-poc
   ```

3. Verify firewall:
   ```bash
   sudo ufw allow 31935/tcp
   ```

### The stream doesn't appear in the player

1. Verify that the transcoder is receiving the stream:
   ```bash
   kubectl logs -l app=transcoder -n streaming-poc
   ```

2. Verify the HLS URL in the database:
   ```bash
   kubectl exec -it -n streaming-poc postgres-0 -- psql -U streamuser -d streaming -c "SELECT id, title, status, hls_url FROM events;"
   ```

3. Try accessing HLS directly:
   ```
   http://<TRANSCODER-IP>:8080/hls/<stream-key>.m3u8
   ```

### Database doesn't connect

```bash
# Restart postgres
kubectl rollout restart statefulset/postgres -n streaming-poc

# Verify status
kubectl get pods -l app=postgres -n streaming-poc
```

## 🔐 Security

### For Production

1. **Change all passwords** in the secrets
2. **Enable authentication** in the API
3. **Use TLS** for RTMPS
4. **Rate limit** event creation
5. **Implement token-based auth** for stream keys

### Example: Enable RTMPS

```nginx
rtmp {
  server {
    listen 1935 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    # ...
  }
}
```

## 📈 Scalability

### Scale transcoders

```bash
kubectl scale deployment transcoder -n streaming-poc --replicas=3
```

### Scale API

```bash
kubectl scale deployment streaming-api -n streaming-poc --replicas=5
```

### Add Redis for caching

Uncomment Redis sections in the manifests to improve performance.

## 🛠️ Development

### Backend hot reload

```bash
cd backend
npm run dev
```

### Frontend hot reload

```bash
cd frontend
npm run dev
```

### Rebuild backend image

```bash
cd backend
docker build -t streaming-api:latest .
kubectl rollout restart deployment/streaming-api -n streaming-poc
```

## 📝 To-Do / Roadmap

- [ ] User authentication
- [ ] Live chat with WebSocket
- [ ] Automatic VOD recording
- [ ] Automatic thumbnails
- [ ] Admin panel
- [ ] Metrics with Prometheus
- [ ] Improved adaptive multi-bitrate
- [ ] Support for multiple cameras
- [ ] Clipping and highlights
- [ ] Integration with Frigate (your local cameras)

## 🤝 Contributing

PRs welcome! For major changes, open an issue first.

## 📄 License

MIT

## 🙏 Credits

- nginx-rtmp-module
- Video.js
- FFmpeg
- Next.js / React

---

**Having issues? Open an issue or check the logs.**
