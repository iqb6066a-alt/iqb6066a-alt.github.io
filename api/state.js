// Vercel Serverless Function for CAVE State Persistence & Sync

import fs from 'fs';
import path from 'path';

let memoryState = null;

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const dbPath = path.join(process.cwd(), 'db.json');

  if (req.method === 'GET') {
    if (memoryState) {
      return res.status(200).json(memoryState);
    }
    try {
      if (fs.existsSync(dbPath)) {
        const fileData = fs.readFileSync(dbPath, 'utf8');
        memoryState = JSON.parse(fileData);
        return res.status(200).json(memoryState);
      }
    } catch (e) {}
    return res.status(200).json({});
  }

  if (req.method === 'POST') {
    try {
      const bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      memoryState = bodyData;
      return res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).end();
}
