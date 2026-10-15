const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const VISITS_FILE = path.join(DATA_DIR, 'visits.json');
const BOTS_FILE = path.join(DATA_DIR, 'bots.json');
const SITE_FILE = path.join(DATA_DIR, 'site.json');

const app = express();
app.disable('x-powered-by');
app.use(express.json());

// ---------- helpers ----------
function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function todayVN() {
  // Ngày theo giờ Việt Nam (UTC+7)
  return new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

function parseCookies(header = '') {
  return Object.fromEntries(
    header.split(';').map((c) => c.trim().split('=')).filter((p) => p[0]).map(([k, ...v]) => [k, decodeURIComponent(v.join('='))])
  );
}

// ---------- visit counter ----------
const visits = readJson(VISITS_FILE, { total: 0, unique: 0, days: {} });
let saveTimer = null;
function saveVisits() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    fs.writeFile(VISITS_FILE, JSON.stringify(visits, null, 2), () => {});
  }, 500);
}

function visitStats() {
  const today = todayVN();
  return {
    total: visits.total,
    unique: visits.unique,
    today: visits.days[today] || 0,
  };
}

// Mỗi phiên trình duyệt (cookie bf_s, hết hạn sau 30 phút không hoạt động) chỉ tính 1 lượt
app.post('/api/visit', (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const setCookies = [];

  if (!cookies.bf_id) {
    visits.unique += 1;
    setCookies.push(`bf_id=${crypto.randomUUID()}; Max-Age=31536000; Path=/; SameSite=Lax; HttpOnly`);
  }
  if (!cookies.bf_s) {
    const today = todayVN();
    visits.total += 1;
    visits.days[today] = (visits.days[today] || 0) + 1;
    saveVisits();
  }
  setCookies.push('bf_s=1; Max-Age=1800; Path=/; SameSite=Lax; HttpOnly');
  res.setHeader('Set-Cookie', setCookies);
  res.json(visitStats());
});

app.get('/api/visit', (req, res) => res.json(visitStats()));

// ---------- data ----------
app.get('/api/bots', (req, res) => res.json(readJson(BOTS_FILE, [])));
app.get('/api/site', (req, res) => res.json(readJson(SITE_FILE, {})));

// ---------- static ----------
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
  console.log(`BotForex99 đang chạy: http://localhost:${PORT}`);
});
