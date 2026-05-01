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
            
            if (content.phone) {
                updateElement('footer-phone', content.phone);
                updateElement('contact-phone', content.phone);
            }
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
        // 使用默认联系信息
        updateElement('footer-phone', '021-XXXX-XXXX');
        updateElement('footer-email', 'info@hongjinhao.com');
        updateElement('footer-address', '上海市XX区XX路XX号');
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
            title_zh: '液压机械',
            title_en: 'Hydraulic Machinery',
            slug: 'hydraulic-machinery',
            image: 'https://via.placeholder.com/400x300?text=Hydraulic',
            description_zh: '专业液压机械设备',
            published: true,
            weight: 0
        },
        {
            title_zh: '数控设备',
            title_en: 'CNC Equipment',
            slug: 'cnc-equipment',
            image: 'https://via.placeholder.com/400x300?text=CNC',
            description_zh: '高精度数控设备',
            published: true,
            weight: 1
        },
        {
            title_zh: '切割设备',
            title_en: 'Cutting Equipment',
            slug: 'cutting-equipment',
            image: 'https://via.placeholder.com/400x300?text=Cutting',
            description_zh: '高效切割解决方案',
            published: true,
            weight: 2
        },
        {
            title_zh: '精密仪器',
            title_en: 'Precision Instruments',
            slug: 'precision-instruments',
            image: 'https://via.placeholder.com/400x300?text=Instruments',
            description_zh: '高精度精密测量仪器',
            published: true,
            weight: 3
        }
    ];
}

function getDefaultProducts() {
    return [
        {
            title_zh: '液压冲床 HC-100',
            title_en: 'Hydraulic Press HC-100',
            model: 'HC-100',
            category: 'hydraulic-machinery',
            slug: 'hc-100',
            image: 'https://images.unsplash.com/photo-1581092160607-ee3388b1c028?w=400&h=300&fit=crop',
            summary_zh: '高效液压冲床，适用于各种金属加工场景，压力可达100吨。',
            summary_en: 'High-efficiency hydraulic press suitable for various metal processing scenarios, pressure up to 100 tons.',
            featured: true,
            specs: [
                {name_zh: '额定压力', name_en: 'Rated Pressure', value: '100吨'},
                {name_zh: '功率', name_en: 'Power', value: '15kW'}
            ],
            published: true
        },
        {
            title_zh: '数控车床 CL-200',
            title_en: 'CNC Lathe CL-200',
            model: 'CL-200',
            category: 'cnc-equipment',
            slug: 'cl-200',
            image: 'https://images.unsplash.com/photo-1504328345607-3aa3b0aa7b3?w=400&h=300&fit=crop',
            summary_zh: '高精度数控车床，适用于精密零件加工。',
            summary_en: 'High-precision CNC lathe suitable for precision parts machining.',
            featured: true,
            specs: [
                {name_zh: '加工直径', name_en: 'Machining Diameter', value: '200mm'},
                {name_zh: '主轴转速', name_en: 'Spindle Speed', value: '3000rpm'}
            ],
            published: true
        },
        {
            title_zh: '激光切割机 LC-300',
            title_en: 'Laser Cutting Machine LC-300',
            model: 'LC-300',
            category: 'cutting-equipment',
            slug: 'lc-300',
            image: 'https://images.unsplash.com/photo-1581092335397-9583e4b6c1e6?w=400&h=300&fit=crop',
            summary_zh: '高精度激光切割设备，切割精度可达0.01mm。',
            summary_en: 'High-precision laser cutting equipment with cutting accuracy up to 0.01mm.',
            featured: true,
            specs: [
                {name_zh: '激光功率', name_en: 'Laser Power', value: '3000W'},
                {name_zh: '切割厚度', name_en: 'Cutting Thickness', value: '20mm'}
            ],
            published: true
        },
        {
            title_zh: '标定板 BP-100',
            title_en: 'Calibration Target BP-100',
            model: 'BP-100',
            category: 'precision-instruments',
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
            category: 'precision-instruments',
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
