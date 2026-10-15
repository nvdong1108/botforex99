/* Cửa sổ MT5 mô phỏng ở trang chủ: nến chạy + nhật ký tab Experts.
   Đây là minh họa, không phải dữ liệu giao dịch thật. */
(function () {
  const root = document.querySelector('[data-term]');
  if (!root) return;

  const svg = root.querySelector('.term__chart svg');
  const priceEl = root.querySelector('.term__price');
  const log = root.querySelector('.term__log');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const W = 400, H = 210, N = 34, CW = W / N;
  let price = 2650.0;
  const candles = [];

  function nextCandle() {
    const o = price;
    const drift = (Math.random() - 0.46) * 4.2;
    const c = +(o + drift).toFixed(2);
    const h = Math.max(o, c) + Math.random() * 1.8;
    const l = Math.min(o, c) - Math.random() * 1.8;
    price = c;
    return { o, c, h, l };
  }
  for (let i = 0; i < N; i++) candles.push(nextCandle());

  function draw() {
    const hi = Math.max(...candles.map((k) => k.h));
    const lo = Math.min(...candles.map((k) => k.l));
    const pad = (hi - lo) * 0.12 || 1;
    const y = (v) => H - ((v - (lo - pad)) / (hi - lo + pad * 2)) * H;

    // đường MA đơn giản
    const ma = candles.map((_, i) => {
      const s = candles.slice(Math.max(0, i - 7), i + 1);
      return s.reduce((a, k) => a + k.c, 0) / s.length;
    });
    const maPath = ma.map((v, i) => `${i ? 'L' : 'M'}${(i * CW + CW / 2).toFixed(1)},${y(v).toFixed(1)}`).join('');

    let grid = '';
    for (let g = 1; g < 4; g++) grid += `<line x1="0" x2="${W}" y1="${(H / 4) * g}" y2="${(H / 4) * g}" stroke="#16263f" stroke-dasharray="2 4"/>`;

    const bodies = candles.map((k, i) => {
      const x = i * CW + CW / 2;
      const up = k.c >= k.o;
      const col = up ? '#0e9f6e' : '#e5484d';
      const top = y(Math.max(k.o, k.c));
      const bh = Math.max(1, Math.abs(y(k.o) - y(k.c)));
      return `<line x1="${x}" x2="${x}" y1="${y(k.h)}" y2="${y(k.l)}" stroke="${col}" stroke-width="1"/>
        <rect x="${x - CW * 0.32}" y="${top}" width="${CW * 0.64}" height="${bh}" fill="${col}" rx="1"/>`;
    }).join('');

    const last = candles[candles.length - 1];
    const ly = y(last.c);
    svg.innerHTML = `${grid}<path d="${maPath}" fill="none" stroke="#f5b014" stroke-width="1.4" opacity=".85"/>${bodies}
      <line x1="0" x2="${W}" y1="${ly}" y2="${ly}" stroke="#2160d8" stroke-dasharray="3 3"/>`;

    priceEl.textContent = last.c.toFixed(2);
    priceEl.classList.toggle('up', last.c >= last.o);
    priceEl.classList.toggle('down', last.c < last.o);
  }

  const pad2 = (n) => String(n).padStart(2, '0');
  function now() {
    const d = new Date();
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  }
  function push(msg, cls = '') {
    const li = document.createElement('li');
    li.innerHTML = `<time>${now()}</time><span class="${cls}">${msg}</span>`;
    log.appendChild(li);
    while (log.children.length > 9) log.firstElementChild.remove();
  }

  let ticket = 18452730;
  let open = null;
  function step() {
    candles.shift();
    candles.push(nextCandle());
    draw();

    const last = candles[candles.length - 1];
    if (!open && Math.random() < 0.35) {
      const buy = last.c >= last.o;
      open = { buy, at: last.c, t: ++ticket };
      push(`${buy ? 'buy' : 'sell'} 0.01 XAUUSD at ${last.c.toFixed(2)} #${open.t}`, buy ? 'buy' : 'sell');
    } else if (open && Math.random() < 0.4) {
      const pnl = ((open.buy ? 1 : -1) * (last.c - open.at) * 1).toFixed(2);
      push(`close #${open.t} at ${last.c.toFixed(2)}  P/L ${pnl > 0 ? '+' : ''}${pnl}`, pnl >= 0 ? 'buy' : 'sell');
      open = null;
    } else if (Math.random() < 0.3) {
      push(open ? `trailing SL #${open.t} → ${(open.at + (open.buy ? 0.5 : -0.5)).toFixed(2)}` : 'chờ tín hiệu… spread 12');
    }
  }

  draw();
  push('BotForex99 (XAUUSD,M15) loaded successfully', 'gold');
  push('Algo Trading enabled, account #10xxxx');
  push('chờ tín hiệu… spread 12');

  if (!reduce) setInterval(step, 1800);
})();
