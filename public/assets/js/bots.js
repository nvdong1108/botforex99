/* Hiển thị danh sách bot từ data/bots.json
   Dùng: <div data-bots data-limit="3"></div>  (limit tùy chọn)
   Bộ lọc: <div data-bot-filter></div> đặt trước danh sách */
(function () {
  const RISK = { 'Thấp': 1, 'Trung bình': 2, 'Cao': 3 };
  // Bộ lọc trang danh sách bot: giá trị ?status= trên URL → trường "status" trong bots.json
  const STATUS = { ALL: 'Tất cả', 'dang-chay': 'Đang chạy', 'thu-nghiem': 'Thử nghiệm' };
  const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function card(b) {
    const plat = (b.platform || '').toUpperCase();
    const ready = !!b.download;
    const test = b.status && b.status !== 'Đang chạy';
    return `<article class="bot reveal">
      <div class="bot__top">
        <span class="tag tag--${plat.toLowerCase()}">${esc(plat)}</span>
        <span class="tag tag--status ${test ? 'is-test' : ''}">${esc(b.status || '')}</span>
      </div>
      <div class="bot__body">
        <h3 class="bot__name">${esc(b.name)}</h3>
        <p class="bot__desc">${esc(b.description)}</p>
        <ul class="bot__feat">${(b.features || []).map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      </div>
      <dl class="bot__spec">
        <div><dt>Cặp</dt><dd>${esc((b.symbols || []).join(', '))}</dd></div>
        <div><dt>Khung</dt><dd>${esc(b.timeframe)}</dd></div>
        <div><dt>Vốn tối thiểu</dt><dd>${esc(b.minDeposit)}</dd></div>
        <div><dt>Rủi ro</dt><dd>${esc(b.risk)}<span class="risk-bar" data-lv="${RISK[b.risk] || 2}" aria-hidden="true"><i></i><i></i><i></i></span></dd></div>
        <div><dt>Kiểu</dt><dd>${esc(b.style)}</dd></div>
        <div><dt>Phiên bản</dt><dd>v${esc(b.version)} · ${esc(b.updated)}</dd></div>
      </dl>
      <div class="bot__foot">
        ${ready
          ? `<a class="btn btn--buy btn--sm" href="${esc(b.download)}" download>Tải bot</a>`
          : `<a class="btn btn--sm" aria-disabled="true">Sắp có</a>`}
        ${b.setFile ? `<a class="btn btn--ghost btn--sm" href="${esc(b.setFile)}" download>File .set</a>` : ''}
      </div>
    </article>`;
  }

  async function init() {
    const lists = document.querySelectorAll('[data-bots]');
    if (!lists.length) return;
    let bots = [];
    try { bots = await fetch('/api/bots').then((r) => r.json()); } catch { /* bỏ qua */ }

    document.querySelectorAll('[data-bot-count]').forEach((el) => window.countUp ? countUp(el, bots.length) : (el.textContent = bots.length));

    lists.forEach((list) => {
      const limit = +list.dataset.limit || 0;
      const filterBox = list.previousElementSibling?.matches('[data-bot-filter]') ? list.previousElementSibling : null;
      let current = new URLSearchParams(location.search).get('status') || 'ALL';
      if (!STATUS[current]) current = 'ALL';
      const match = (b) => current === 'ALL' || b.status === STATUS[current];

      const render = () => {
        let items = bots.filter(match);
        if (limit) items = items.slice(0, limit);
        list.innerHTML = items.length
          ? items.map(card).join('')
          : `<div class="empty">Chưa có bot ${current === 'ALL' ? '' : STATUS[current].toLowerCase()} nào. Theo dõi TikTok để biết khi có bot mới.</div>`;
        list.classList.toggle('bots', items.length > 0);
        window.initReveal && initReveal();
      };

      if (filterBox) {
        filterBox.innerHTML = Object.keys(STATUS).map((o) => {
          const n = o === 'ALL' ? bots.length : bots.filter((b) => b.status === STATUS[o]).length;
          return `<button class="chip" type="button" data-p="${o}" aria-pressed="${o === current}">${STATUS[o]} · ${n}</button>`;
        }).join('');
        filterBox.addEventListener('click', (e) => {
          const btn = e.target.closest('[data-p]');
          if (!btn) return;
          current = btn.dataset.p;
          filterBox.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', c === btn));
          const url = new URL(location);
          current === 'ALL' ? url.searchParams.delete('status') : url.searchParams.set('status', current);
          history.replaceState(null, '', url);
          render();
        });
      }
      render();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
