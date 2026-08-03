/**
 * 上海泓锦浩机械科技有限公司 - 主 JavaScript 文件
 * 功能：多语言切换、内容加载、产品展示、交互逻辑
 */

// ==================== 全局变量 ====================
let currentLang = 'zh'; // 默认语言
let allProducts = [];
let allCategories = [];

// 自动检测基础路径（处理子目录中的页面）
function getBasePath() {
    const path = window.location.pathname;
    // 计算当前页面相对于网站根目录的深度
    const parts = path.split('/').filter(p => p.length > 0 && !p.includes('.html'));
    if (parts.length === 0) return '';
    return '../'.repeat(parts.length);
}

// ==================== 语言切换 ====================
function switchLang(lang) {
    currentLang = lang;
    localStorage.setItem('preferred-lang', lang);
    
    // 更新按钮状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const btnZh = document.getElementById('btn-zh');
    const btnEn = document.getElementById('btn-en');
    if (btnZh && btnEn) {
        btnZh.classList.remove('active');
        btnEn.classList.remove('active');
        if (lang === 'zh') {
            btnZh.classList.add('active');
            btnZh.style.background = '#1a6db5';
            btnZh.style.color = '#fff';
            btnEn.style.background = '#fff';
            btnEn.style.color = '#334155';
        } else {
            btnEn.classList.add('active');
            btnEn.style.background = '#1a6db5';
            btnEn.style.color = '#fff';
            btnZh.style.background = '#fff';
            btnZh.style.color = '#334155';
        }
    }
    
    // 重新加载内容
    loadPageContent();
    loadFeaturedProducts();
    applyStaticTranslations();
}

// 应用静态多语言文本（data-zh / data-en）
function applyStaticTranslations() {
    document.querySelectorAll('[data-zh][data-en]').forEach(el => {
        const text = currentLang === 'zh' ? el.getAttribute('data-zh') : el.getAttribute('data-en');
        if (text) el.textContent = text;
    });
}

// ==================== 移动端菜单 ====================
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('open');
    }
}

// ==================== 加载页面内容 ====================
async function loadPageContent() {
    try {
        const basePath = getBasePath();
        const response = await fetch(basePath + 'assets/data/homepage.md');
        if (response.ok) {
            const text = await response.text();
            const content = parseMarkdown(text);
            
            // 更新页面内容
            if (content.banner_title) {
                const el = document.getElementById('heroTitle');
                if (el) el.textContent = currentLang === 'zh' ? content.banner_title : (content.banner_title_en || content.banner_title);
            }
            if (content.banner_subtitle) {
                const el = document.getElementById('heroSub');
                if (el) el.innerHTML = currentLang === 'zh' ? content.banner_subtitle : (content.banner_subtitle_en || content.banner_subtitle);
            }
        }
    } catch (error) {
        console.log('使用默认内容');
    }
}

// ==================== 加载分类 ====================
async function loadCategories() {
    try {
        const basePath = getBasePath();
        const response = await fetch(basePath + 'assets/data/categories.json');
        if (response.ok) {
            allCategories = await response.json();
            renderCategories();
        }
    } catch (error) {
        console.log('无法加载分类，使用默认数据');
        allCategories = getDefaultCategories();
        renderCategories();
    }
}

function renderCategories() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    allCategories.forEach(category => {
        const card = createCategoryCard(category);
        grid.appendChild(card);
    });
}

function createCategoryCard(category) {
    const div = document.createElement('div');
    div.className = 'service-card';
    
    const title = currentLang === 'zh' ? category.title_zh : (category.title_en || category.title_zh);
    const description = currentLang === 'zh' ? category.description_zh : (category.description_en || '');
    
    div.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        <a href="products/index.html?category=${category.slug}" class="card-link">了解更多 →</a>
    `;
    
    return div;
}

// ==================== 加载产品 ====================
async function loadProducts(categoryFilter = 'all') {
    try {
        const basePath = getBasePath();
        const response = await fetch(basePath + 'assets/data/products.json');
        if (response.ok) {
            allProducts = await response.json();
        } else {
            allProducts = getDefaultProducts();
        }
        filterAndRenderProducts(categoryFilter);
    } catch (error) {
        allProducts = getDefaultProducts();
        filterAndRenderProducts(categoryFilter);
    }
}

function filterAndRenderProducts(categoryFilter = 'all') {
    let filtered = allProducts;
    
    if (categoryFilter !== 'all') {
        filtered = allProducts.filter(p => p.category === categoryFilter);
    }
    
    // 更新产品数量
    const countEl = document.getElementById('product-count');
    if (countEl) countEl.textContent = filtered.length;
    
    // 渲染产品
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-400">暂无产品</div>';
        return;
    }
    
    filtered.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    
    const imageUrl = product.image || (product.images && product.images.length > 0 
        ? product.images[0].image 
        : 'https://via.placeholder.com/400x300?text=Product');
    const title = currentLang === 'zh' ? product.title_zh : (product.title_en || product.title_zh);
    const summary = currentLang === 'zh' ? product.summary_zh : (product.summary_en || '');
    
    div.innerHTML = `
        <div class="product-img">
            <img src="${imageUrl}" alt="${title}" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div class="product-body">
            <div class="product-cat">${product.category || ''}</div>
            <h3>${title}</h3>
            <p>${summary || ''}</p>
            <a href="products/detail.html?id=${product.slug}" class="card-link">查看详情 →</a>
        </div>
    `;
    
    return div;
}

function filterByCategory(category) {
    // 更新按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
    
    // 加载并过滤产品
    loadProducts(category);
}

// ==================== 加载推荐产品（首页） ====================
async function loadFeaturedProducts() {
    try {
        const basePath = getBasePath();
        const response = await fetch(basePath + 'assets/data/products.json');
        let products = [];
        
        if (response.ok) {
            products = await response.json();
        } else {
            products = getDefaultProducts();
        }
        
        const featured = products.filter(p => p.featured).slice(0, 6);
        renderFeaturedProducts(featured);
    } catch (error) {
        renderFeaturedProducts(getDefaultProducts().slice(0, 6));
    }
}

function renderFeaturedProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const imageUrl = product.image || (product.images && product.images.length > 0 
            ? product.images[0].image 
            : 'https://via.placeholder.com/400x300?text=Product');
        const title = currentLang === 'zh' ? product.title_zh : (product.title_en || product.title_zh);
        const summary = currentLang === 'zh' ? product.summary_zh : (product.summary_en || '');
        
        card.innerHTML = `
            <div class="product-img">
                <img src="${imageUrl}" alt="${title}" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div class="product-body">
                <div class="product-cat">${product.category || ''}</div>
                <h3>${title}</h3>
                <p>${summary || ''}</p>
                <a href="products/detail.html?id=${product.slug}" class="card-link">查看详情 →</a>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// ==================== 加载产品详情 ====================
async function loadProductDetail(slug) {
    try {
        const basePath = getBasePath();
        const response = await fetch(basePath + 'assets/data/products.json');
        let products = [];
        
        if (response.ok) {
            products = await response.json();
        } else {
            products = getDefaultProducts();
        }
        
        const product = products.find(p => p.slug === slug);
        
        if (product) {
            renderProductDetail(product);
        } else {
            window.location.href = basePath + 'products/index.html';
        }
    } catch (error) {
        console.error('无法加载产品详情');
    }
}

function renderProductDetail(product) {
    const title = currentLang === 'zh' ? product.title_zh : (product.title_en || product.title_zh);
    const description = currentLang === 'zh' ? product.description_zh : (product.description_en || '');
    const summary = currentLang === 'zh' ? product.summary_zh : (product.summary_en || '');
    
    // 更新页面标题
    document.title = `${title} - 上海泓锦浩机械科技有限公司`;
    
    // 更新产品信息
    const titleEl = document.getElementById('product-title');
    if (titleEl) titleEl.textContent = title;
    
    const modelEl = document.getElementById('product-model');
    if (modelEl) modelEl.textContent = `型号：${product.model}`;
    
    const summaryEl = document.getElementById('product-summary');
    if (summaryEl) summaryEl.textContent = summary;
    
    // 更新主图
    const mainImage = document.getElementById('main-image');
    if (mainImage) {
        const imageUrl = product.image || (product.images && product.images.length > 0 
            ? product.images[0].image 
            : 'https://via.placeholder.com/800x600?text=Product');
        mainImage.src = imageUrl;
        mainImage.alt = title;
    }
    
    // 更新产品描述
    const descEl = document.getElementById('product-description');
    if (descEl && description) {
        descEl.innerHTML = `<div style="line-height:1.7;">${description}</div>`;
    }
    
    // 更新技术参数
    const specsTable = document.getElementById('specs-table');
    if (specsTable && product.specs) {
        const tbody = specsTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            product.specs.forEach(spec => {
                const row = document.createElement('tr');
                const name = currentLang === 'zh' ? spec.name_zh : (spec.name_en || spec.name_zh);
                row.innerHTML = `<td style="padding:8px 0;color:#64748b;">${name}</td><td style="padding:8px 0;font-weight:500;">${spec.value}</td>`;
                tbody.appendChild(row);
            });
        }
    }
}

// ==================== 加载联系信息 ====================
async function loadContactInfo() {
    try {
        const basePath = getBasePath();
        const response = await fetch(basePath + 'assets/data/contact.md');
        if (response.ok) {
            const text = await response.text();
            const content = parseMarkdown(text);
            
            if (content.email) {
                updateElement('footer-email', content.email);
                updateElement('contact-email', content.email);
            }
            if (content.address) {
                updateElement('footer-address', content.address);
                updateElement('contact-address', content.address);
            }
        }
    } catch (error) {
        // 使用默认联系信息（与 HTML 静态内容保持一致，避免覆盖为占位符）
        updateElement('footer-email', 'hujingchang@hongjinhao.com');
        updateElement('footer-address', '上海市宝山区逸仙路2816号1幢1层');
        updateElement('contact-email', 'hujingchang@hongjinhao.com');
        updateElement('contact-address', '上海市宝山区逸仙路2816号1幢1层');
    }
}

function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// ==================== 工具函数 ====================
function parseMarkdown(text) {
    const lines = text.split('\n');
    const content = {};
    let currentKey = '';
    let currentValue = '';
    let inFrontmatter = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line === '---') {
            if (currentKey && currentValue) {
                content[currentKey] = currentValue.trim();
            }
            inFrontmatter = !inFrontmatter;
            continue;
        }
        
        if (inFrontmatter && line.includes(':')) {
            if (currentKey && currentValue) {
                content[currentKey] = currentValue.trim();
            }
            
            const [key, ...valueParts] = line.split(':');
            currentKey = key.trim();
            currentValue = valueParts.join(':').trim();
            
            // 移除引号
            if (currentValue.startsWith('"') && currentValue.endsWith('"')) {
                currentValue = currentValue.slice(1, -1);
            }
        }
    }
    
    if (currentKey && currentValue) {
        content[currentKey] = currentValue.trim();
    }
    
    return content;
}

// ==================== 默认数据 ====================
function getDefaultCategories() {
    return [
        {
            title_zh: '相机标定',
            title_en: 'Camera Calibration',
            slug: 'calibration',
            image: 'https://via.placeholder.com/400x300?text=Calibration',
            description_zh: '高精度相机标定板及标定服务',
            published: true,
            weight: 0
        },
        {
            title_zh: '精密大理石',
            title_en: 'Precision Marble',
            slug: 'marble',
            image: 'https://via.placeholder.com/400x300?text=Marble',
            description_zh: '高精度大理石平台及精密工具',
            published: true,
            weight: 1
        },
        {
            title_zh: '贸易产品',
            title_en: 'Trade Products',
            slug: 'trade',
            image: 'https://via.placeholder.com/400x300?text=Trade',
            description_zh: '多品类工业贸易产品采购服务',
            published: true,
            weight: 2
        }
    ];
}

function getDefaultProducts() {
    return [
        {
            title_zh: '标定板 BP-100',
            title_en: 'Calibration Target BP-100',
            model: 'BP-100',
            category: 'calibration',
            slug: 'bp-100',
            image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
            summary_zh: '高精度相机标定板，适用于机器视觉、自动驾驶等领域。',
            summary_en: 'High-precision camera calibration target for machine vision, autonomous driving, etc.',
            featured: true,
            specs: [
                {name_zh: '精度', name_en: 'Accuracy', value: '±0.01mm'},
                {name_zh: '材质', name_en: 'Material', value: '陶瓷'}
            ],
            published: true
        },
        {
            title_zh: '精密大理石平台 PM-200',
            title_en: 'Precision Marble Platform PM-200',
            model: 'PM-200',
            category: 'marble',
            slug: 'pm-200',
            image: 'https://images.unsplash.com/photo-1581092160607-ee3388b1c028?w=400&h=300&fit=crop',
            summary_zh: '高精度大理石平台，适用于精密测量和检测。',
            summary_en: 'High-precision marble platform for precision measurement and inspection.',
            featured: true,
            specs: [
                {name_zh: '平面度', name_en: 'Flatness', value: '±0.005mm'},
                {name_zh: '尺寸', name_en: 'Dimensions', value: '2000x1000mm'}
            ],
            published: true
        },
        {
            title_zh: '工业贸易产品',
            title_en: 'Industrial Trade Products',
            model: 'TR-001',
            category: 'trade',
            slug: 'trade-products',
            image: 'https://images.unsplash.com/photo-1581092160607-ee3388b1c028?w=400&h=300&fit=crop',
            summary_zh: '机械设备、仪器仪表、电子元器件等多品类工业贸易产品，按需采购。',
            summary_en: 'Multi-category industrial trade products, procured on demand.',
            featured: true,
            specs: [
                {name_zh: '产品类别', name_en: 'Categories', value: '机械设备/仪器仪表/电子元器件等'},
                {name_zh: '采购模式', name_en: 'Mode', value: '按需采购'}
            ],
            published: true
        }
    ];
}

// ==================== 数字动画 ====================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    });
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    // 恢复语言设置
    const savedLang = localStorage.getItem('preferred-lang');
    if (savedLang) {
        switchLang(savedLang);
    } else {
        switchLang('zh');
    }
    
    // 移动端菜单
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            const menu = document.getElementById('mobileMenu');
            if (menu) {
                menu.classList.toggle('open');
            }
        });
    }
    
    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    // 数字动画 - 当统计栏进入视口时触发
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsBar);
    }
});

// 导出函数供全局使用
window.switchLang = switchLang;
window.toggleMenu = toggleMenu;
window.filterByCategory = filterByCategory;
window.loadProductDetail = loadProductDetail;
