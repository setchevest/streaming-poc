// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'streaming',
  user: process.env.DB_USER || 'streamuser',
  password: process.env.DB_PASSWORD || 'changeme123',
});

// MinIO (S3) client
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || 'http://minio:9000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin123',
  },
  forcePathStyle: true,
});

// Initialize database
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        stream_key VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        sport VARCHAR(100),
        status VARCHAR(50) DEFAULT 'scheduled',
        featured BOOLEAN DEFAULT FALSE,
        started_at TIMESTAMP,
        ended_at TIMESTAMP,
        hls_url TEXT,
        thumbnail_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add missing columns to existing tables if they don't exist
    await pool.query(`
      ALTER TABLE events
      ADD COLUMN IF NOT EXISTS sport VARCHAR(100),
      ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS stream_stats (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id),
        viewers INTEGER DEFAULT 0,
        peak_viewers INTEGER DEFAULT 0,
        uptime_minutes INTEGER DEFAULT 0,
        buffer_rate DECIMAL(5, 2) DEFAULT 0.0,
        avg_bitrate INTEGER DEFAULT 0,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        icon VARCHAR(10) NOT NULL
      );
    `);

    // Insert default sports categories
    await pool.query(`
      INSERT INTO categories (id, name, slug, icon)
      VALUES
        ('1', 'Football', 'football', '⚽'),
        ('2', 'Basketball', 'basketball', '🏀'),
        ('3', 'Tennis', 'tennis', '🎾'),
        ('4', 'Volleyball', 'volleyball', '🏐'),
        ('5', 'Rugby', 'rugby', '🏉'),
        ('6', 'Cricket', 'cricket', '🏏')
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ Database initialization error:', err);
  }
}

// Generate stream key
function generateStreamKey() {
  return crypto.randomBytes(16).toString('hex');
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Create new event
app.post('/api/events', async (req, res) => {
  try {
    const { title, description, sport, featured } = req.body;
    const streamKey = generateStreamKey();

    const result = await pool.query(
      'INSERT INTO events (stream_key, title, description, sport, featured, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [streamKey, title, description, sport, featured || false, 'scheduled']
    );

    res.json({
      success: true,
      event: result.rows[0],
      rtmpUrl: `rtmp://${process.env.PUBLIC_HOST || 'localhost'}:31935/live`,
      streamKey: streamKey,
    });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all events with optional filtering
app.get('/api/events', async (req, res) => {
  try {
    const { status, featured, sort, limit } = req.query;

    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    // Apply status filter
    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Apply featured filter
    if (featured === 'true') {
      query += ` AND featured = $${paramIndex}`;
      params.push(true);
      paramIndex++;
    }

    // Apply sorting
    if (sort === 'date') {
      query += ' ORDER BY started_at ASC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    // Apply limit
    if (limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(parseInt(limit));
    }

    const result = await pool.query(query, params);
    res.json({ events: result.rows });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get single event
app.get('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ event: result.rows[0] });
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get sports categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json({ categories: result.rows });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: err.message });
  }
});

// RTMP authentication callback
app.post('/api/rtmp/auth', async (req, res) => {
  try {
    const streamKey = req.body.name;
    console.log('🔐 Auth request for stream key:', streamKey);

    const result = await pool.query(
      'SELECT * FROM events WHERE stream_key = $1',
      [streamKey]
    );

    if (result.rows.length === 0) {
      console.log('❌ Invalid stream key');
      return res.status(403).send('Invalid stream key');
    }

    const event = result.rows[0];

    // Update event status to live
    await pool.query(
      'UPDATE events SET status = $1, started_at = $2 WHERE id = $3',
      ['live', new Date(), event.id]
    );

    console.log('✅ Stream authorized:', event.title);
    res.status(200).send('OK');
  } catch (err) {
    console.error('Error in RTMP auth:', err);
    res.status(500).send('Internal error');
  }
});

// RTMP stream done callback
app.post('/api/rtmp/done', async (req, res) => {
  try {
    const streamKey = req.body.name;
    console.log('🛑 Stream ended:', streamKey);

    await pool.query(
      'UPDATE events SET status = $1, ended_at = $2 WHERE stream_key = $3',
      ['ended', new Date(), streamKey]
    );

    res.status(200).send('OK');
  } catch (err) {
    console.error('Error in RTMP done:', err);
    res.status(500).send('Internal error');
  }
});

// Transcoder start callback
app.post('/api/transcode/start', async (req, res) => {
  try {
    const streamKey = req.body.name;
    console.log('🎬 Transcoding started for:', streamKey);

    // Use public HLS URL that the browser can access
    const publicHost = process.env.PUBLIC_HOST || 'localhost';
    const hlsPort = process.env.HLS_PORT || '8081';
    const hlsUrl = `http://${publicHost}:${hlsPort}/hls/${streamKey}.m3u8`;

    await pool.query(
      'UPDATE events SET hls_url = $1 WHERE stream_key = $2',
      [hlsUrl, streamKey]
    );

    console.log('✅ HLS URL configured:', hlsUrl);
    res.status(200).send('OK');
  } catch (err) {
    console.error('Error in transcode start:', err);
    res.status(500).send('Internal error');
  }
});

// Transcoder done callback
app.post('/api/transcode/done', async (req, res) => {
  try {
    const streamKey = req.body.name;
    console.log('✅ Transcoding done for:', streamKey);
    res.status(200).send('OK');
  } catch (err) {
    console.error('Error in transcode done:', err);
    res.status(500).send('Internal error');
  }
});

// Get HLS stream URL
app.get('/api/stream/:streamKey', async (req, res) => {
  try {
    const { streamKey } = req.params;

    const result = await pool.query(
      'SELECT * FROM events WHERE stream_key = $1',
      [streamKey]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    const event = result.rows[0];

    if (event.status !== 'live') {
      return res.status(400).json({ error: 'Stream is not live' });
    }

    res.json({
      streamUrl: event.hls_url,
      event: event,
    });
  } catch (err) {
    console.error('Error fetching stream:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get current stream statistics for an event
app.get('/api/events/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;

    // Get latest stats entry
    const result = await pool.query(
      `SELECT * FROM stream_stats
       WHERE event_id = $1
       ORDER BY timestamp DESC
       LIMIT 1`,
      [id]
    );

    if (result.rows.length === 0) {
      // Return default stats if no stats exist yet
      return res.json({
        stats: {
          event_id: id,
          viewers: 0,
          peak_viewers: 0,
          uptime_minutes: 0,
          buffer_rate: 0,
          avg_bitrate: 0,
          timestamp: new Date(),
        },
      });
    }

    res.json({ stats: result.rows[0] });
  } catch (err) {
    console.error('Error fetching stream stats:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get historical stream statistics for analytics
app.get('/api/events/:id/stats/history', async (req, res) => {
  try {
    const { id } = req.params;
    const { hours = 24 } = req.query;

    const result = await pool.query(
      `SELECT * FROM stream_stats
       WHERE event_id = $1
       AND timestamp >= NOW() - INTERVAL '${parseInt(hours)} hours'
       ORDER BY timestamp ASC`,
      [id]
    );

    res.json({ stats: result.rows });
  } catch (err) {
    console.error('Error fetching stream stats history:', err);
    res.status(500).json({ error: err.message });
  }
});

// Record stream statistics (called by monitoring system)
app.post('/api/events/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const { viewers, peak_viewers, uptime_minutes, buffer_rate, avg_bitrate } = req.body;

    const result = await pool.query(
      `INSERT INTO stream_stats
       (event_id, viewers, peak_viewers, uptime_minutes, buffer_rate, avg_bitrate, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [id, viewers || 0, peak_viewers || 0, uptime_minutes || 0, buffer_rate || 0, avg_bitrate || 0]
    );

    res.json({ success: true, stats: result.rows[0] });
  } catch (err) {
    console.error('Error recording stream stats:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get aggregated analytics for an event
app.get('/api/events/:id/analytics', async (req, res) => {
  try {
    const { id } = req.params;
    const { hours = 24 } = req.query;

    // Get event details
    const eventResult = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = eventResult.rows[0];

    // Calculate uptime in minutes
    let uptimeMinutes = 0;
    if (event.started_at && event.ended_at) {
      uptimeMinutes = Math.floor(
        (new Date(event.ended_at) - new Date(event.started_at)) / 60000
      );
    } else if (event.started_at && event.status === 'live') {
      uptimeMinutes = Math.floor((new Date() - new Date(event.started_at)) / 60000);
    }

    // Get stats data
    const statsResult = await pool.query(
      `SELECT
        MAX(viewers) as peak_viewers,
        AVG(viewers)::INTEGER as avg_viewers,
        MAX(buffer_rate)::DECIMAL(5, 2) as max_buffer_rate,
        AVG(buffer_rate)::DECIMAL(5, 2) as avg_buffer_rate,
        AVG(avg_bitrate)::INTEGER as avg_bitrate,
        COUNT(*) as sample_count
       FROM stream_stats
       WHERE event_id = $1
       AND timestamp >= NOW() - INTERVAL '${parseInt(hours)} hours'`,
      [id]
    );

    const stats = statsResult.rows[0];

    res.json({
      analytics: {
        event_id: id,
        event_title: event.title,
        uptime_minutes: uptimeMinutes,
        peak_viewers: stats.peak_viewers || 0,
        avg_viewers: stats.avg_viewers || 0,
        max_buffer_rate: stats.max_buffer_rate || 0,
        avg_buffer_rate: stats.avg_buffer_rate || 0,
        avg_bitrate: stats.avg_bitrate || 0,
        sample_count: stats.sample_count || 0,
      },
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Streaming API running on port ${PORT}`);
  await initDB();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing connections...');
  await pool.end();
  process.exit(0);
});
