# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A live streaming platform for small club sporting events, deployable via Docker Compose or Kubernetes. The platform ingests RTMP streams (from OBS/Larix), transcodes them to HLS, and delivers them via a Next.js frontend.

## Architecture

### Core Components

**Streaming Pipeline:**
```
OBS/Larix (RTMP) → nginx-rtmp (port 31935) → transcoder (FFmpeg/HLS) → MinIO (S3) → Video Player
                        ↓
                   Backend API ← Frontend (Next.js)
                        ↓
                   PostgreSQL
```

**Backend API (`backend/server.js`):**
- Express.js REST API
- PostgreSQL for event/stream metadata
- RTMP authentication and stream lifecycle callbacks
- HLS URL generation and event status management
- S3 client integration for MinIO storage

**Frontend (`frontend/`):**
- Next.js 16 with TypeScript
- next-intl for internationalization
- Video.js player with HLS quality selector
- Tailwind CSS for styling

**Infrastructure Components:**
- **nginx-rtmp**: RTMP ingest server (receives streams from OBS)
- **transcoder**: Separate nginx-rtmp instance that converts RTMP to HLS segments
- **PostgreSQL**: Event metadata, stream keys, categories
- **MinIO**: S3-compatible object storage (future VOD storage)

### Database Schema

**events table:**
- `id`, `stream_key` (unique), `title`, `description`, `sport`
- `status` ('scheduled', 'live', 'ended'), `featured` (boolean)
- `started_at`, `ended_at`, `hls_url`, `thumbnail_url`

**categories table:**
- Sports categories: Football, Basketball, Tennis, Volleyball, Rugby, Cricket

**stream_stats table:**
- Viewer count tracking (structure in place, not fully implemented)

## Development Commands

### Local Development (Docker Compose)

```bash
# Start all backend services
./quick_start.sh
# Or manually:
docker-compose up -d --build

# View logs
docker-compose logs -f
docker-compose logs -f streaming-api

# Stop services
docker-compose down

# Backend development (hot reload)
cd backend
npm run dev

# Frontend development
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev  # Runs on port 3001

# Frontend debug mode
npm run debug
```

### Kubernetes Deployment

```bash
# Full deployment
./deploy.sh

# Manual deployment steps
cd backend && docker build -t streaming-api:latest . && cd ..
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/minio-deployment.yaml
kubectl apply -f k8s/nginx-rtmp-deployment.yaml
kubectl apply -f k8s/transcoder-deployment.yaml
kubectl apply -f k8s/api-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Port forward API for local frontend development
kubectl port-forward -n streaming-poc svc/streaming-api 8000:8000

# View logs
kubectl logs -f -l app=streaming-api -n streaming-poc
kubectl logs -f -l app=nginx-rtmp -n streaming-poc
kubectl logs -f -l app=transcoder -n streaming-poc

# Check pod status
kubectl get pods -n streaming-poc
kubectl top pods -n streaming-poc
```

### Testing Streaming

```bash
# Test API health
curl http://localhost:8000/health

# Create test event
curl -X POST http://localhost:8000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event","description":"Testing"}'

# List events
curl http://localhost:8000/api/events

# View nginx-rtmp statistics
curl http://localhost:8080/stat

# Test RTMP connection
telnet localhost 1935
```

## Development Workflows

### UI/UX Feature Implementation

For implementing new UI features following design system principles and best practices, use the agent web-developer:

This workflow guides you through:
1. **Requirements gathering** - Read specs and design system docs
2. **Feature validation** - Clarify flows, states, validations, accessibility
3. **Component mapping** - Identify reusable vs. new components
4. **Implementation spec** - Create detailed technical specification
5. **File planning** - List all files to create/modify
6. **Implementation** - Generate code following DRY and design patterns
7. **Peer review** - Simulate senior architect code review
8. **Documentation** - Generate executive summary
9. **User confirmation** - Get approval before finalizing
10. **Git workflow** - Commit with conventional commit messages

The workflow ensures consistency with existing patterns, proper error handling, accessibility compliance, and thorough documentation.

## Key Workflows

### RTMP Stream Lifecycle

1. **Stream Start**: OBS connects with stream key → nginx-rtmp authenticates via `POST /api/rtmp/auth` → Backend validates stream key and sets event status to 'live'
2. **Transcoding Start**: Transcoder receives RTMP push → calls `POST /api/transcode/start` → Backend generates HLS URL (`http://{PUBLIC_HOST}:{HLS_PORT}/hls/{stream_key}.m3u8`)
3. **Stream End**: OBS disconnects → nginx-rtmp calls `POST /api/rtmp/done` → Backend sets event status to 'ended'

### Event Creation Flow

1. User submits event form (title, description, sport, featured flag)
2. Backend generates unique stream key (`crypto.randomBytes(16).toString('hex')`)
3. Event stored in PostgreSQL with status 'scheduled'
4. Returns RTMP URL and stream key to user

### Video Playback

- Frontend fetches event by ID (`GET /api/events/:id`)
- Extracts `hls_url` from event data
- Video.js player loads HLS manifest (`.m3u8`)
- Quality selector plugin provides adaptive bitrate switching

## Configuration

### Environment Variables (Backend)

- `PORT`: API server port (default: 8000)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: PostgreSQL connection
- `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`: MinIO/S3 configuration
- `PUBLIC_HOST`: Public-facing IP/hostname for RTMP and HLS URLs
- `HLS_PORT`: Port where transcoder serves HLS content (default: 8081)

### Environment Variables (Frontend)

- `NEXT_PUBLIC_API_URL`: Backend API URL (e.g., `http://localhost:8000`)

### Important Configuration Files

- `nginx-rtmp.conf`: RTMP ingest server (port 1935/31935) with authentication callbacks
- `transcoder.conf`: RTMP-to-HLS transcoding with adaptive bitrate variants
- `docker-compose.yml`: Local development stack definition
- `k8s/*.yaml`: Kubernetes manifests for production deployment

## Common Issues and Debugging

### OBS Cannot Connect
- Check RTMP port accessibility: `telnet <IP> 31935`
- Verify nginx-rtmp logs: `docker-compose logs nginx-rtmp`
- Ensure firewall allows port 1935/31935

### Stream Doesn't Appear in Player
- Verify transcoder is generating HLS: `docker-compose exec transcoder ls -la /tmp/hls/`
- Check HLS URL in database: `docker-compose exec postgres psql -U streamuser -d streaming -c "SELECT id, title, status, hls_url FROM events;"`
- Test HLS URL directly: `http://<TRANSCODER-IP>:8081/hls/<stream-key>.m3u8`

### Database Connection Issues
- Restart PostgreSQL: `docker-compose restart postgres` or `kubectl rollout restart statefulset/postgres -n streaming-poc`
- Verify pod readiness: `kubectl get pods -l app=postgres -n streaming-poc`

### Performance Issues
- Laggy video: Reduce OBS bitrate, check upload speed, use Ethernet instead of WiFi
- Dropped frames: Monitor OBS stats (View → Stats), reduce encoding preset or resolution
- High CPU: Switch to GPU encoding (NVENC for Nvidia, VCE for AMD, QuickSync for Intel)

## File Structure Notes

- Backend is a single-file Express app (`backend/server.js`) with all routes and database initialization
- Frontend uses Next.js App Router with internationalization (`frontend/app/[locale]/`)
- Kubernetes manifests have typo in filename: `api-deployment.yaml`
- HLS segments are stored in ephemeral volumes (`emptyDir`) - not persistent by default
- Frontend runs on port 3001 (Next.js default + 1) to avoid conflicts

## Extension Points

When adding features, consider these integration points:
- **Authentication**: Add middleware to `/api/events` routes, implement JWT/session management
- **Live chat**: WebSocket server can be added to backend, consider Socket.io integration
- **VOD recording**: Implement stream recording to MinIO in transcoder config, store references in new `recordings` table
- **Viewer analytics**: Track viewers via periodic polling or WebSocket connections, store in `stream_stats` table
- **Multi-bitrate**: Configure additional HLS variants in `transcoder.conf` (currently set for single quality)
