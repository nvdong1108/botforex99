/* BotForex99 — header, footer, menu, đếm lượt truy cập, hiệu ứng cuộn
   Menu chỉnh ở mảng NAV bên dưới. Link đối tác / mạng xã hội chỉnh ở data/site.json */
document.documentElement.classList.add('js');

const NAV = [
  { label: 'Trang chủ', href: '/' },
  {
    label: 'Hướng dẫn',
    children: [
      { label: 'Mở tài khoản Exness', note: 'Đăng ký qua link đối tác', href: '/huong-dan/exness' },
      { label: 'Mở tài khoản Vantage', note: 'Đăng ký qua link đối tác', href: '/huong-dan/vantage' },
      { label: 'Cài bot lên máy tính', note: 'MetaTrader 5 trên Windows', href: '/huong-dan/cai-bot' },
    ],
  },
  {
    label: 'Tải bot',
    children: [
      { label: 'Tất cả bot', note: 'Danh sách đầy đủ', href: '/bot/' },
      { label: 'Bot đang chạy', note: 'Đã chạy tiền thật', href: '/bot/?status=dang-chay' },
      { label: 'Bot thử nghiệm', note: 'Nên chạy demo trước', href: '/bot/?status=thu-nghiem' },
    ],
  },
];

const LOGO_SVG = `<svg class="logo__mark" viewBox="0 0 32 32" aria-hidden="true">
  <rect width="32" height="32" rx="9" fill="#0d1b2a"/>
  <path d="M9 9v14M16 6v20M23 11v10" stroke="#3c4b5e" stroke-width="1.5"/>
  <rect x="6.5" y="12" width="5" height="7" rx="1" fill="#e5484d"/>
  <rect x="13.5" y="10" width="5" height="11" rx="1" fill="#0e9f6e"/>
  <rect x="20.5" y="13" width="5" height="5" rx="1" fill="#0e9f6e"/>
</svg>`;

const CARET = `<svg class="nav__caret" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;

const here = location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/');
const isCurrent = (href) => {
  const [p, q] = href.split('?');
  if (q) return p === here && location.search.includes(q);
  return p === here && (!location.search || p !== '/bot/');
};

function renderHeader() {
  const items = NAV.map((item, i) => {
    if (!item.children) {
      return `<li class="nav__item"><a class="nav__link" href="${item.href}" ${isCurrent(item.href) ? 'aria-current="page"' : ''}>${item.label}</a></li>`;
    }
    const active = item.children.some((c) => c.href.split('?')[0] === here);
    const subs = item.children
      .map((c) => `<li><a href="${c.href}" ${isCurrent(c.href) ? 'aria-current="page"' : ''}>${c.label}<small>${c.note}</small></a></li>`)
      .join('');
    return `<li class="nav__item ${active ? 'is-active' : ''}">
      <button class="nav__link" type="button" aria-expanded="false" aria-controls="sub-${i}">${item.label}${CARET}</button>
      <ul class="subnav" id="sub-${i}">${subs}</ul>
    </li>`;
  }).join('');

  return `<div class="wrap">
    <a class="logo" href="/">${LOGO_SVG}<span>BotForex<b>99</b></span></a>
    <nav class="nav" id="site-nav" aria-label="Menu chính">
      <ul class="nav__list">${items}</ul>
      <div class="nav__mobile-cta">
        <a class="btn btn--gold" data-site="exness.link" target="_blank" rel="noopener">Mở tài khoản Exness</a>
        <a class="btn btn--blue" data-site="vantage.link" target="_blank" rel="noopener">Mở tài khoản Vantage</a>
      </div>
    </nav>
    <button class="theme-btn" type="button" aria-label="Đổi giao diện sáng/tối">
      <svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>
      <svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
    </button>
    <a class="btn btn--sm header-cta" href="/bot/">Tải bot</a>
    <button class="burger" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="site-nav"><span></span></button>
  </div>`;
}

function renderFooter() {
  const year = new Date().getFullYear();
  return `<div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="logo" href="/">${LOGO_SVG}<span>BotForex<b>99</b></span></a>
        <p style="margin-top:12px">Bot giao dịch MT5 và hướng dẫn mở tài khoản Exness, Vantage cho người mới.</p>
        <span class="footer-counter" title="Tổng lượt truy cập"><span class="live-dot"></span><span data-visits="total">—</span>&nbsp;lượt truy cập</span>
      </div>
      <div>
        <h4>Hướng dẫn</h4>
        <ul>
          <li><a href="/huong-dan/exness">Mở tài khoản Exness</a></li>
          <li><a href="/huong-dan/vantage">Mở tài khoản Vantage</a></li>
          <li><a href="/huong-dan/cai-bot">Cài bot lên máy tính</a></li>
        </ul>
      </div>
      <div>
        <h4>Tải bot</h4>
        <ul>
          <li><a href="/bot/">Tất cả bot</a></li>
          <li><a href="/bot/?status=dang-chay">Bot đang chạy</a></li>
          <li><a href="/bot/?status=thu-nghiem">Bot thử nghiệm</a></li>
        </ul>
      </div>
      <div>
        <h4>Liên hệ</h4>
        <ul>
          <li><a data-site="tiktok" target="_blank" rel="noopener">TikTok</a></li>
          <li><a data-site="telegram" target="_blank" rel="noopener">Telegram</a></li>
          <li><a data-site="zalo" target="_blank" rel="noopener">Zalo</a></li>
        </ul>
      </div>
    </div>
    <p class="risk"><strong>Cảnh báo rủi ro:</strong> Giao dịch Forex, vàng và CFD có đòn bẩy, rủi ro cao và có thể mất toàn bộ vốn. Kết quả quá khứ của bot không đảm bảo lợi nhuận trong tương lai. Nội dung trên website chỉ mang tính chia sẻ kinh nghiệm, không phải lời khuyên đầu tư. Hãy chạy thử trên tài khoản demo trước khi dùng tiền thật.<br>© ${year} BotForex99.</p>
  </div>`;
}

function initNav() {
  const header = document.querySelector('.site-header');
  const burger = header.querySelector('.burger');
  const mobile = window.matchMedia('(max-width: 920px)');

  // Theme: mặc định dark, chỉ lưu khi người xem chọn light
  const themeBtn = header.querySelector('.theme-btn');
  const metaColor = document.querySelector('meta[name="theme-color"]');
  const syncTheme = () => {
    const light = document.documentElement.dataset.theme === 'light';
    themeBtn.setAttribute('aria-pressed', light);
    themeBtn.title = light ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng';
    if (metaColor) metaColor.content = light ? '#edf1f5' : '#0a1220';
  };
  themeBtn.addEventListener('click', () => {
    const light = document.documentElement.dataset.theme !== 'light';
    if (light) document.documentElement.dataset.theme = 'light';
    else delete document.documentElement.dataset.theme;
    try { light ? localStorage.setItem('theme', 'light') : localStorage.removeItem('theme'); } catch { /* bỏ qua */ }
    syncTheme();
  });
  syncTheme();

  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  });

  header.querySelectorAll('.nav__item > button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const open = !item.classList.contains('is-open');
      if (!mobile.matches) header.querySelectorAll('.nav__item.is-open').forEach((x) => x !== item && x.classList.remove('is-open'));
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open);
    });
  });

  // Mở sẵn nhóm menu của trang hiện tại trên mobile
  if (mobile.matches) header.querySelectorAll('.nav__item.is-active').forEach((x) => x.classList.add('is-open'));

  document.addEventListener('click', (e) => {
    if (!mobile.matches && !e.target.closest('.nav__item')) {
      header.querySelectorAll('.nav__item.is-open').forEach((x) => x.classList.remove('is-open'));
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    header.querySelectorAll('.nav__item.is-open').forEach((x) => x.classList.remove('is-open'));
    if (document.body.classList.contains('nav-open')) burger.click();
  });
}

/* ---------- cấu hình site (link đối tác...) ---------- */
const site = fetch('/api/site').then((r) => r.json()).catch(() => ({}));
const pick = (obj, key) => key.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);

async function applySite() {
  const cfg = await site;
  document.querySelectorAll('[data-site]').forEach((el) => {
    const v = pick(cfg, el.dataset.site);
    if (!v) return;
    if (el.tagName === 'A') el.href = v;
    else el.textContent = v;
  });
}

/* ---------- đếm số ---------- */
function countUp(el, to) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = (n) => Math.round(n).toLocaleString('vi-VN');
  if (reduce || to < 10) { el.textContent = fmt(to); return; }
  const start = performance.now();
  const dur = 1400;
  const tick = (t) => {
    const p = Math.min(1, (t - start) / dur);
    el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
window.countUp = countUp;

async function trackVisit() {
  try {
    const stats = await fetch('/api/visit', { method: 'POST' }).then((r) => r.json());
    document.querySelectorAll('[data-visits]').forEach((el) => countUp(el, stats[el.dataset.visits] || 0));
  } catch { /* server chưa chạy */ }
}

/* ---------- hiện dần khi cuộn ---------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach((el) => io.observe(el));
}
window.initReveal = initReveal;

/* ---------- mục lục trang hướng dẫn ---------- */
function initToc() {
  const links = document.querySelectorAll('.toc a');
  if (!links.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('on', a.hash === '#' + e.target.id));
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  document.querySelectorAll('.tl-step[id]').forEach((s) => io.observe(s));
}

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const footer = document.querySelector('.site-footer');
  if (header) { header.innerHTML = renderHeader(); initNav(); }
  if (footer) footer.innerHTML = renderFooter();
  applySite();
  trackVisit();
  initReveal();
  initToc();
});
