// const express = require('express');
import express from 'express';
const app = express();
import path from 'path';

import { DIST_PATH } from './configs/myPath.config.js';

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Serve frontend
app.use(express.static(DIST_PATH));
let cachedIndexHtml = null;
let cachedIndexMtimeMs = 0;

async function loadSpaIndexHtml(){
    const indexPath = path.join(DIST_PATH, 'index.html');
    const stat = await fs.promises.stat(indexPath);
  if (!cachedIndexHtml || stat.mtimeMs !== cachedIndexMtimeMs) {
    cachedIndexHtml = await fs.promises.readFile(indexPath, 'utf8');
    cachedIndexMtimeMs = stat.mtimeMs;
  }
  return cachedIndexHtml;
}

app.get('/', (req, res)=>{
    res.json({success: true, mess: "Hello World"})
})

export default app;