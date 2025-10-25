#!/bin/bash
echo "=== DEBUG STREAMING PLATFORM ==="
echo ""
echo "1. Container status:"
docker-compose ps
echo ""
echo "2. Active streams (nginx-rtmp):"
curl -s http://localhost:8080/stat | grep -A 10 "<stream>"
echo ""
echo "3. Generated HLS files:"
docker-compose exec transcoder ls -laR /tmp/hls/ 2>/dev/null || echo "No HLS files"
echo ""
echo "4. Events in DB:"
docker-compose exec postgres psql -U streamuser -d streaming -c "SELECT id, title, status, hls_url FROM events;" 2>/dev/null
echo ""
echo "5. Recent nginx-rtmp logs:"
docker-compose logs --tail=10 nginx-rtmp
echo ""
echo "6. Recent transcoder logs:"
docker-compose logs --tail=10 transcoder
