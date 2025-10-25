// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

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
        status VARCHAR(50) DEFAULT 'scheduled',
        started_at TIMESTAMP,
        ended_at TIMESTAMP,
        hls_url TEXT,
        thumbnail_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS stream_stats (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id),
        viewers INTEGER DEFAULT 0,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
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
    const { title, description } = req.body;
    const streamKey = generateStreamKey();

    const result = await pool.query(
      'INSERT INTO events (stream_key, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [streamKey, title, description, 'scheduled']
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

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM events ORDER BY created_at DESC'
    );
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

    const hlsUrl = `http://transcoder:8080/hls/${streamKey}.m3u8`;

    await pool.query(
      'UPDATE events SET hls_url = $1 WHERE stream_key = $2',
      [hlsUrl, streamKey]
    );

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