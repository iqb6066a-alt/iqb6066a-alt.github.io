// CAVE Node.js HTTP Server for 24/7 Cloud Hosting & Local Dev

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3030;
const PUBLIC_DIR = __dirname;
const DB_FILE = path.join(__dirname, 'db.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // CORS Headers for cross-device & mobile access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // REST API Endpoints for State Persistence & Device Sync
  if (req.url === '/api/state') {
    if (req.method === 'GET') {
      fs.readFile(DB_FILE, (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Failed to read database' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      });
      return;
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          fs.writeFile(DB_FILE, JSON.stringify(parsed, null, 2), err => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ error: 'Failed to save to disk' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true, timestamp: new Date().toISOString() }));
          });
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        }
      });
      return;
    }
  }

  // Serve static assets
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n==================================================`);
  console.log(`CAVE — Automotive Operating System`);
  console.log(`Server active on port: ${PORT}`);
  console.log(`Disk Persistence DB: db.json`);
  console.log(`==================================================\n`);
});
