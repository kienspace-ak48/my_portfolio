const express = require('express');
const path = require('path');
const fs = require('fs');
const { DIST_PATH } = require('./configs/myPath.config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes (prefix /api để không đụng SPA)
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Hello World' });
});

// Static assets từ build Vite
app.use(express.static(DIST_PATH));

// SPA fallback — mọi route không phải file/API đều trả index.html
app.use(async (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next();
  }

  try {
    const indexPath = path.join(DIST_PATH, 'index.html');
    const html = await fs.promises.readFile(indexPath, 'utf8');
    res.type('html').send(html);
  } catch {
    res.status(404).send('Frontend chưa được build. Chạy: cd frontend && pnpm build');
  }
});

module.exports = app;
