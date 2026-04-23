/**
 * 主脚本 - 上海泓锦浩机械科技有限公司
 */

/* ── 导航滚动效果 ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

/* ── 汉堡菜单 ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    mobileMenu.classList.contains('open')
      ? (spans[0].style.transform = 'rotate(45deg) translate(5px,5px)',
         spans[1].style.opacity = '0',
         spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)')
      : (spans[0].style.transform = '',
         spans[1].style.opacity = '',
         spans[2].style.transform = '');
  });
}

/* ── 数字滚动动画 ── */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, 30);
  });
}

/* ── IntersectionObserver 触发动画 ── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.classList.contains('stats-bar')) animateCounters();
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.stats-bar, .service-card, .product-card, .testimonial-card, .value-card, .timeline-content').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  io.observe(el);
});

document.addEventListener('animationEnd', () => {});

// 补充 visible 样式
const style = document.createElement('style');
style.textContent = `.visible { opacity:1 !important; transform:translateY(0) !important; }`;
document.head.appendChild(style);

/* ── 渲染首页产品预览（取前6条） ── */
const productsGrid = document.getElementById('productsGrid');
if (productsGrid && window.SiteData) {
  SiteData.products.slice(0, 6).forEach((p, i) => {
    const imgHtml = p.image ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML='${p.emoji}'">` : p.emoji;
    productsGrid.innerHTML += `
      <div class="product-card" style="animation-delay:${i * 0.08}s">
        <div class="product-img" style="background:${p.bg}">${imgHtml}</div>
        <div class="product-body">
          <div class="product-cat">${p.category}</div>
          <h3>${p.name}</h3>
          <p>${p.desc.substring(0, 60)}…</p>
        </div>
      </div>`;
  });
  document.querySelectorAll('.product-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    io.observe(el);
  });
}

/* ── Toast 通知 ── */
window.showToast = function(msg, type = 'default') {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  requestAnimationFrame(() => { toast.classList.add('show'); });
  setTimeout(() => toast.classList.remove('show'), 3000);
};

/* ── 联系表单处理 ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    btn.textContent = '发送中…';
    btn.disabled = true;
    setTimeout(() => {
      showToast('✅ 消息已发送，我们将尽快与您联系！', 'success');
      contactForm.reset();
      btn.textContent = '发送消息';
      btn.disabled = false;
    }, 1200);
  });
}

/* ── 产品页过滤 ── */
window.filterProducts = function(key) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  const grid = document.getElementById('fullProductsGrid');
  if (!grid || !window.SiteData) return;
  renderProductsGrid(key === 'all' ? SiteData.products : SiteData.products.filter(p => p.cat_key === key));
};

function renderProductsGrid(list) {
  const grid = document.getElementById('fullProductsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  list.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.cssText = `opacity:0;transform:translateY(24px);transition:opacity .5s ease ${i * 0.06}s,transform .5s ease ${i * 0.06}s`;
    const imgHtml = p.image ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML='${p.emoji}'">` : p.emoji;
    card.innerHTML = `
      <div class="product-img" style="background:${p.bg}">${imgHtml}</div>
      <div class="product-body">
        <div class="product-cat">${p.category}</div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div style="margin-top:.8rem;display:flex;flex-wrap:wrap;gap:6px">
          ${p.tags.map(t => `<span class="tag" style="font-size:.75rem">${t}</span>`).join('')}
        </div>
      </div>`;
    grid.appendChild(card);
    requestAnimationFrame(() => { setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50); });
  });
}

const fullProductsGrid = document.getElementById('fullProductsGrid');
if (fullProductsGrid && window.SiteData) renderProductsGrid(SiteData.products);
