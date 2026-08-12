const express = require('express');
const path = require('path');
const fs = require('fs');
const { DIST_PATH, PUBLIC_PATH } = require('./configs/myPath.config');
const registerRoute = require('./routes');
const seoService = require('./services/seo.service');
const { applySeoPlaceholders } = require('./utils/spaSeoHtml.util');

const app = express();
const cors = require('cors');

app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use('/uploads', express.static(path.join(PUBLIC_PATH, 'uploads')));
registerRoute(app);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Hello World' });
});

let items = [
  { id: 1, name: 'React basics' },
  { id: 2, name: 'Fetch API' },
];
let nextId = 3;

app.get('/api/items', (_req, res) => {
  res.json({ success: true, data: items });
});

app.get('/api/items/:id', (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id));
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  res.json({ success: true, data: item });
});

app.post('/api/items', (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }
  const item = { id: nextId++, name: name.trim() };
  items.push(item);
  res.status(201).json({ success: true, data: item });
});

app.put('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  const { name } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }
  items[index] = { ...items[index], name: name.trim() };
  res.json({ success: true, data: items[index] });
});

app.delete('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  const [removed] = items.splice(index, 1);
  res.json({ success: true, data: removed });
});

let cachedIndexHtml = null;

async function loadSpaIndexHtml() {
  if (cachedIndexHtml) return cachedIndexHtml;
  const indexPath = path.join(DIST_PATH, 'index.html');
  cachedIndexHtml = await fs.promises.readFile(indexPath, 'utf8');
  return cachedIndexHtml;
}

function shouldServeSpaDocument(req) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return false;
  const urlPath = req.path || '/';
  if (urlPath.startsWith('/api')) return false;
  if (/\.[a-zA-Z0-9]+$/.test(urlPath)) return false;
  return true;
}

async function sendSpaDocument(req, res, next) {
  if (!shouldServeSpaDocument(req)) return next();

  try {
    const [html, meta] = await Promise.all([
      loadSpaIndexHtml(),
      seoService.resolveSpaMeta(req),
    ]);
    const output = applySeoPlaceholders(html, meta);
    if (req.method === 'HEAD') {
      res.type('html');
      return res.status(200).end();
    }
    return res.type('html').send(output);
  } catch (error) {
    console.error('sendSpaDocument', error);
    return next();
  }
}

app.use(express.static(DIST_PATH));
app.use(sendSpaDocument);

app.use(async (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next();
  }

  try {
    const html = await loadSpaIndexHtml();
    if (req.method === 'HEAD') {
      res.type('html');
      return res.status(200).end();
    }
    res.type('html').send(html);
  } catch {
    res.status(404).send('Frontend chưa được build. Chạy: cd frontend && pnpm build');
  }
});

module.exports = app;
