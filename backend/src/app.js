const express = require('express');
const path = require('path');
const fs = require('fs');
const { DIST_PATH } = require('./configs/myPath.config');
const registerRoute = require('./routes');

const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(registerRoute);
//cors
app.use(cors())
// register route
registerRoute(app);
// API routes (prefix /api để không đụng SPA)
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Hello World' });
});
// In-memory store — đủ cho demo CRUD, restart server sẽ mất data
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
