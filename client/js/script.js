/* =====================================================
 * Nhà Hàng Phố Cổ - Main JavaScript
 * Author: Mphong
 * ===================================================== */

'use strict';

// =====================================================
// SCROLL TO TOP ON RELOAD
// =====================================================
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// =====================================================
// CONFIG
// =====================================================
const API_BASE = window.location.origin + '/api';

// =====================================================
// DOM ELEMENTS
// =====================================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const header = $('#header');
const navToggle = $('#navToggle');
const navMenu = $('#navMenu');
const menuGrid = $('#menuGrid');
const menuFilter = $('#menuFilter');
const reservationForm = $('#reservationForm');
const contactForm = $('#contactForm');
const successModal = $('#successModal');
const backToTop = $('#backToTop');

// =====================================================
// NAVIGATION
// =====================================================

// Scroll handler: Header background + Back to top + Active section
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Scroll progress bar
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    }

    // Header background
    if (scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 400) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }

    // Active nav link based on scroll position
    updateActiveNav();

    // Scroll reveal
    revealOnScroll();

    lastScroll = scrollY;
});

// Update active nav link
function updateActiveNav() {
    const sections = $$('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            $$('.nav-link').forEach((link) => link.classList.remove('active'));
            const activeLink = $(`.nav-link[href="#${id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}

// Mobile nav toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

// Close mobile nav on link click
$$('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// Smooth scroll for nav links
$$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

// Back to top
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =====================================================
// SCROLL REVEAL ANIMATION
// =====================================================
function revealOnScroll() {
    const revealElements = $$('.reveal');
    const windowHeight = window.innerHeight;

    revealElements.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 80) {
            el.classList.add('revealed');
        }
    });
}

// =====================================================
// MENU - Load from API
// =====================================================
let allMenuItems = [];
let menuGrouped = {};
let currentMenuFilter = 'all';

// i18n key mappings for menu categories and food items
const CATEGORY_I18N = {
    'Đặc sản Ninh Bình': 'cat_dac_san',
    'Khai vị': 'cat_khai_vi',
    'Món chính': 'cat_mon_chinh',
    'Lẩu': 'cat_lau',
    'Đồ uống': 'cat_do_uong'
};

const FOOD_I18N = {
    'Cơm cháy Ninh Bình': 'food_com_chay',
    'Thịt dê tái chanh': 'food_de_tai_chanh',
    'Thịt dê nướng tảng': 'food_de_nuong',
    'Miến lươn Ninh Bình': 'food_mien_luon',
    'Ốc núi Ninh Bình': 'food_oc_nui',
    'Nem rán truyền thống': 'food_nem_ran',
    'Gỏi cuốn tôm thịt': 'food_goi_cuon',
    'Cá kho tộ': 'food_ca_kho',
    'Gà đồi nướng mật ong': 'food_ga_nuong',
    'Lẩu dê Ninh Bình': 'food_lau_de',
    'Lẩu hải sản chua cay': 'food_lau_hai_san',
    'Trà sen Ninh Bình': 'food_tra_sen'
};

async function loadMenu() {
    try {
        const response = await fetch(`${API_BASE}/menu?_t=${Date.now()}`);
        const result = await response.json();

        if (result.success) {
            allMenuItems = result.data;
            menuGrouped = result.grouped;
            renderMenuCategories(menuGrouped);
            renderMenuItems(allMenuItems);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.warn('API không khả dụng, sử dụng dữ liệu mẫu:', error.message);
        loadFallbackMenu();
    }
}

// Fallback data khi API chưa sẵn sàng
function loadFallbackMenu() {
    const fallbackData = [
        { id: 1, name: 'Cơm cháy Ninh Bình', description: 'Cơm cháy giòn tan ăn kèm thịt dê và nước sốt đặc biệt', price: 120000, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400', category: 'Đặc sản Ninh Bình' },
        { id: 2, name: 'Thịt dê tái chanh', description: 'Thịt dê tươi thái mỏng tái chanh, ăn kèm rau thơm và bánh đa', price: 180000, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: 'Đặc sản Ninh Bình' },
        { id: 3, name: 'Thịt dê nướng tảng', description: 'Thịt dê ướp gia vị truyền thống, nướng trên than hoa', price: 200000, image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400', category: 'Đặc sản Ninh Bình' },
        { id: 4, name: 'Miến lươn Ninh Bình', description: 'Miến lươn nấu từ lươn đồng tươi, nước dùng ngọt thanh', price: 85000, image: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400', category: 'Đặc sản Ninh Bình' },
        { id: 5, name: 'Ốc núi Ninh Bình', description: 'Ốc núi hấp lá chanh, chấm mắm gừng, vị ngọt tự nhiên', price: 95000, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', category: 'Đặc sản Ninh Bình' },
        { id: 6, name: 'Nem rán truyền thống', description: 'Nem rán giòn rụm với nhân thịt và mộc nhĩ', price: 75000, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: 'Khai vị' },
        { id: 7, name: 'Gỏi cuốn tôm thịt', description: 'Gỏi cuốn tươi mát với tôm, thịt và rau sống', price: 65000, image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb44?w=400', category: 'Khai vị' },
        { id: 8, name: 'Cá kho tộ', description: 'Cá kho tộ đậm đà vị quê hương, ăn kèm cơm nóng', price: 150000, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400', category: 'Món chính' },
        { id: 9, name: 'Gà đồi nướng mật ong', description: 'Gà đồi ta nướng mật ong thơm lừng, da giòn thịt mềm', price: 250000, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', category: 'Món chính' },
        { id: 10, name: 'Lẩu dê Ninh Bình', description: 'Lẩu dê truyền thống Ninh Bình, nước dùng đậm đà', price: 350000, image: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400', category: 'Lẩu' },
        { id: 11, name: 'Lẩu hải sản chua cay', description: 'Lẩu hải sản tươi sống với nước dùng chua cay đặc biệt', price: 320000, image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=400', category: 'Lẩu' },
        { id: 12, name: 'Trà sen Ninh Bình', description: 'Trà ướp hương sen tự nhiên, thanh mát', price: 35000, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', category: 'Đồ uống' }
    ];

    allMenuItems = fallbackData;

    // Group by category
    const grouped = fallbackData.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    menuGrouped = grouped;
    renderMenuCategories(menuGrouped);
    renderMenuItems(fallbackData);
}

// Render category filter buttons
function renderMenuCategories(grouped) {
    const categories = Object.keys(grouped);

    // Keep "Tất cả" button, add category buttons
    menuFilter.innerHTML = '<button class="filter-btn active" data-category="all">' + (typeof t === 'function' ? t('menu_all') : 'Tất cả') + '</button>';

    categories.forEach((cat) => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.category = cat;
        // Translate category name via i18n key
        const catKey = CATEGORY_I18N[cat];
        btn.textContent = (catKey && typeof t === 'function') ? t(catKey) : cat;
        if (cat === currentMenuFilter) {
            btn.classList.add('active');
            menuFilter.querySelector('.filter-btn[data-category="all"]').classList.remove('active');
        }
        menuFilter.appendChild(btn);
    });

    // Filter click events
    $$('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            $$('.filter-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            currentMenuFilter = btn.dataset.category;
            if (currentMenuFilter === 'all') {
                renderMenuItems(allMenuItems);
            } else {
                renderMenuItems(allMenuItems.filter((item) => item.category === currentMenuFilter));
            }
        });
    });
}

// Render menu cards
function renderMenuItems(items) {
    menuGrid.innerHTML = '';

    if (items.length === 0) {
        menuGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#999;">Không có món ăn nào.</p>';
        return;
    }

    items.forEach((item) => {
        // Translate food name, description, category via i18n
        const foodKey = FOOD_I18N[item.name];
        const translatedName = (foodKey && typeof t === 'function') ? t(foodKey + '_name') : item.name;
        const translatedDesc = (foodKey && typeof t === 'function') ? t(foodKey + '_desc') : item.description;
        const catKey = CATEGORY_I18N[item.category];
        const translatedCat = (catKey && typeof t === 'function') ? t(catKey) : item.category;

        const card = document.createElement('div');
        card.className = 'menu-card reveal';
        card.innerHTML = `
      <div class="menu-card-image">
        <img src="${item.image}" alt="${translatedName}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=400'">
        <span class="menu-card-category">${translatedCat}</span>
      </div>
      <div class="menu-card-body">
        <h3 class="menu-card-name">${translatedName}</h3>
        <p class="menu-card-desc">${translatedDesc}</p>
        <div class="menu-card-footer">
          <span class="menu-card-price">${formatPrice(item.price)}</span>
        </div>
      </div>
    `;
        menuGrid.appendChild(card);
    });

    // Trigger reveal for new items
    setTimeout(revealOnScroll, 100);
}

// Re-render menu with current language (called when language changes)
function refreshMenuLanguage() {
    if (Object.keys(menuGrouped).length > 0) {
        renderMenuCategories(menuGrouped);
    }
    if (currentMenuFilter === 'all') {
        renderMenuItems(allMenuItems);
    } else {
        renderMenuItems(allMenuItems.filter((item) => item.category === currentMenuFilter));
    }

    // Also refresh order panel if open
    const panel = $('#orderPanel');
    if (panel && panel.style.display !== 'none' && panel.dataset.loaded) {
        renderOrderMenu();
        updateOrderSummary();
    }
}

// Format price to VND
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

// =====================================================
// CUSTOM SELECT DROPDOWN
// =====================================================
function initCustomSelects() {
    const selects = $$('.custom-select');

    selects.forEach((select) => {
        const trigger = select.querySelector('.custom-select__trigger');
        const options = select.querySelectorAll('.custom-select__option');
        const valueDisplay = select.querySelector('.custom-select__value');
        const hiddenInput = select.querySelector('input[type="hidden"]');

        // Toggle dropdown
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other selects
            $$('.custom-select.open').forEach((s) => {
                if (s !== select) s.classList.remove('open');
            });
            select.classList.toggle('open');
        });

        // Select option
        options.forEach((option) => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                const text = option.textContent.trim();

                // Update hidden input
                hiddenInput.value = value;

                // Update display
                valueDisplay.textContent = text;
                valueDisplay.classList.add('has-value');

                // Update active state
                options.forEach((o) => o.classList.remove('selected'));
                option.classList.add('selected');

                // Close dropdown
                select.classList.remove('open');

                // Clear error
                const group = select.closest('.form-group');
                if (group) {
                    group.classList.remove('error');
                    const errorSpan = group.querySelector('.form-error');
                    if (errorSpan) errorSpan.textContent = '';
                }
            });
        });
    });

    // Close all dropdowns on outside click
    document.addEventListener('click', () => {
        $$('.custom-select.open').forEach((s) => s.classList.remove('open'));
    });
}

// Reset custom selects
function resetCustomSelects() {
    $$('.custom-select').forEach((select) => {
        const valueDisplay = select.querySelector('.custom-select__value');
        const hiddenInput = select.querySelector('input[type="hidden"]');
        const placeholder = valueDisplay.dataset.placeholder;

        hiddenInput.value = '';
        valueDisplay.textContent = placeholder;
        valueDisplay.classList.remove('has-value');
        select.querySelectorAll('.custom-select__option').forEach((o) => o.classList.remove('selected'));
        select.classList.remove('open');
    });
}

// =====================================================
// RESERVATION FORM
// =====================================================

// Set min date = today
const dateInput = $('#resDate');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
}

reservationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateReservationForm()) return;

    const btn = $('#reservationBtn');
    setButtonLoading(btn, true);

    const formData = {
        name: $('#resName').value.trim(),
        phone: $('#resPhone').value.trim(),
        email: $('#resEmail').value.trim(),
        date: $('#resDate').value,
        time: $('#resTime').value,
        guests: parseInt($('#resGuests').value),
        note: $('#resNote').value.trim(),
        preOrder: getOrderData()
    };

    try {
        const response = await fetch(`${API_BASE}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            showModal();
            reservationForm.reset();
            resetCustomSelects();
            clearOrder();
            // Reset date to today
            dateInput.value = new Date().toISOString().split('T')[0];
            clearAllErrors(reservationForm);
        } else {
            if (result.errors) {
                result.errors.forEach((err) => showFieldError(reservationForm, err.field, err.message));
            } else {
                showToast(result.message || 'Đặt bàn thất bại', 'error');
            }
        }
    } catch (error) {
        console.warn('API error:', error);
        // Fallback: Hiển thị thành công khi API chưa sẵn sàng
        showModal();
        reservationForm.reset();
        resetCustomSelects();
        clearOrder();
        dateInput.value = new Date().toISOString().split('T')[0];
    } finally {
        setButtonLoading(btn, false);
    }
});

// Validate reservation form
function validateReservationForm() {
    let valid = true;
    clearAllErrors(reservationForm);

    const name = $('#resName').value.trim();
    const phone = $('#resPhone').value.trim();
    const date = $('#resDate').value;
    const time = $('#resTime').value;
    const guests = $('#resGuests').value;

    if (!name || name.length < 2) {
        showFieldError(reservationForm, 'name', t('val_name_required'));
        valid = false;
    }

    if (!phone || !/^(0|\+84)[0-9]{9,10}$/.test(phone)) {
        showFieldError(reservationForm, 'phone', t('val_phone_invalid'));
        valid = false;
    }

    const email = $('#resEmail').value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError(reservationForm, 'email', t('val_email_invalid'));
        valid = false;
    }

    if (!date) {
        showFieldError(reservationForm, 'date', t('val_date_required'));
        valid = false;
    }

    if (!time) {
        showFieldError(reservationForm, 'time', t('val_time_required'));
        valid = false;
    }

    if (!guests) {
        showFieldError(reservationForm, 'guests', t('val_guests_required'));
        valid = false;
    }

    return valid;
}

// =====================================================
// PRE-ORDER FOOD IN RESERVATION
// =====================================================
let orderItems = {}; // { itemId: { ...item, qty: N } }

function initOrderPanel() {
    const toggleBtn = $('#orderToggleBtn');
    const panel = $('#orderPanel');
    if (!toggleBtn || !panel) return;

    toggleBtn.addEventListener('click', () => {
        const isOpen = panel.style.display !== 'none';
        panel.style.display = isOpen ? 'none' : 'block';
        toggleBtn.classList.toggle('active', !isOpen);

        // Update button text
        const btnText = toggleBtn.querySelector('[data-i18n]');
        if (btnText) {
            btnText.setAttribute('data-i18n', isOpen ? 'res_order_add' : 'res_order_hide');
            btnText.textContent = t(isOpen ? 'res_order_add' : 'res_order_hide');
        }

        // Render menu if opening for first time
        if (!isOpen && !panel.dataset.loaded) {
            renderOrderMenu();
            panel.dataset.loaded = 'true';
        }
    });

    // Clear all button
    const clearBtn = $('#orderClearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            orderItems = {};
            renderOrderMenu();
            updateOrderSummary();
        });
    }
}

function renderOrderMenu() {
    const grid = $('#orderMenuGrid');
    const catContainer = $('#orderCategories');
    if (!grid || !catContainer) return;

    const items = allMenuItems.length > 0 ? allMenuItems : [];
    if (items.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:rgba(247,231,206,0.4);font-size:0.78rem;">' + t('res_order_empty') + '</p>';
        catContainer.innerHTML = '';
        return;
    }

    // Group by category
    const grouped = {};
    items.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
    });

    // Category tabs
    const cats = Object.keys(grouped);
    catContainer.innerHTML = '<button type="button" class="order-cat-btn active" data-cat="all">' + t('menu_all') + '</button>' +
        cats.map(cat => {
            const catKey = CATEGORY_I18N[cat];
            const label = (catKey && typeof t === 'function') ? t(catKey) : cat;
            return `<button type="button" class="order-cat-btn" data-cat="${cat}">${label}</button>`;
        }).join('');

    // Category click handlers
    catContainer.querySelectorAll('.order-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            catContainer.querySelectorAll('.order-cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.cat;
            renderOrderItems(cat === 'all' ? items : items.filter(i => i.category === cat));
        });
    });

    renderOrderItems(items);
}

function renderOrderItems(items) {
    const grid = $('#orderMenuGrid');
    if (!grid) return;

    grid.innerHTML = items.map(item => {
        const foodKey = FOOD_I18N[item.name];
        const translatedName = (foodKey && typeof t === 'function') ? t(foodKey + '_name') : item.name;
        const qty = orderItems[item.id] ? orderItems[item.id].qty : 0;
        const selectedClass = qty > 0 ? ' selected' : '';

        return `
        <div class="order-item${selectedClass}" data-id="${item.id}">
            <i class="fas fa-check order-item-check"></i>
            <img class="order-item-img" src="${item.image}" alt="${translatedName}" loading="lazy"
                 onerror="this.src='https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=400'">
            <div class="order-item-info">
                <div class="order-item-name">${translatedName}</div>
                <div class="order-item-price">${formatPrice(item.price)}</div>
            </div>
            <div class="order-item-qty">
                <button type="button" class="order-qty-btn order-qty-minus" data-id="${item.id}">−</button>
                <span class="order-qty-val">${qty}</span>
                <button type="button" class="order-qty-btn order-qty-plus" data-id="${item.id}">+</button>
            </div>
        </div>`;
    }).join('');

    // Attach qty button handlers
    grid.querySelectorAll('.order-qty-plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            addOrderItem(id);
        });
    });

    grid.querySelectorAll('.order-qty-minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            removeOrderItem(id);
        });
    });

    // Click on item card to add +1
    grid.querySelectorAll('.order-item').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.order-qty-btn')) return;
            const id = parseInt(card.dataset.id);
            addOrderItem(id);
        });
    });
}

function addOrderItem(id) {
    const item = allMenuItems.find(i => i.id === id);
    if (!item) return;

    if (orderItems[id]) {
        orderItems[id].qty++;
    } else {
        orderItems[id] = { ...item, qty: 1 };
    }

    updateOrderItemUI(id);
    updateOrderSummary();
}

function removeOrderItem(id) {
    if (!orderItems[id]) return;

    orderItems[id].qty--;
    if (orderItems[id].qty <= 0) {
        delete orderItems[id];
    }

    updateOrderItemUI(id);
    updateOrderSummary();
}

function updateOrderItemUI(id) {
    const card = document.querySelector(`.order-item[data-id="${id}"]`);
    if (!card) return;

    const qty = orderItems[id] ? orderItems[id].qty : 0;
    card.querySelector('.order-qty-val').textContent = qty;
    card.classList.toggle('selected', qty > 0);
}

function updateOrderSummary() {
    const summary = $('#orderSummary');
    const list = $('#orderItemsList');
    const totalEl = $('#orderTotalPrice');
    if (!summary || !list || !totalEl) return;

    const entries = Object.values(orderItems);

    if (entries.length === 0) {
        summary.style.display = 'none';
        return;
    }

    summary.style.display = 'block';

    let total = 0;
    list.innerHTML = entries.map(item => {
        const foodKey = FOOD_I18N[item.name];
        const translatedName = (foodKey && typeof t === 'function') ? t(foodKey + '_name') : item.name;
        const subtotal = item.price * item.qty;
        total += subtotal;

        return `
        <div class="order-summary-item">
            <span class="order-summary-item-name">${translatedName}</span>
            <span class="order-summary-item-qty">x${item.qty}</span>
            <span class="order-summary-item-price">${formatPrice(subtotal)}</span>
            <button type="button" class="order-summary-item-remove" data-id="${item.id}"><i class="fas fa-times"></i></button>
        </div>`;
    }).join('');

    totalEl.textContent = formatPrice(total);

    // Remove button handlers
    list.querySelectorAll('.order-summary-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            delete orderItems[id];
            updateOrderItemUI(id);
            updateOrderSummary();
        });
    });
}

function getOrderData() {
    const entries = Object.values(orderItems);
    if (entries.length === 0) return null;

    return entries.map(item => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price
    }));
}

function clearOrder() {
    orderItems = {};
    const panel = $('#orderPanel');
    const toggleBtn = $('#orderToggleBtn');
    if (panel) {
        panel.style.display = 'none';
        panel.dataset.loaded = '';
    }
    if (toggleBtn) {
        toggleBtn.classList.remove('active');
        const btnText = toggleBtn.querySelector('[data-i18n]');
        if (btnText) {
            btnText.setAttribute('data-i18n', 'res_order_add');
            btnText.textContent = t('res_order_add');
        }
    }
    updateOrderSummary();
}

// =====================================================
// CONTACT FORM
// =====================================================
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateContactForm()) return;

    const btn = $('#contactBtn');
    setButtonLoading(btn, true);

    const formData = {
        name: $('#ctName').value.trim(),
        email: $('#ctEmail').value.trim(),
        subject: $('#ctSubject').value.trim(),
        message: $('#ctMessage').value.trim()
    };

    try {
        const response = await fetch(`${API_BASE}/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            showToast(t('toast_contact_success'), 'success');
            contactForm.reset();
            clearAllErrors(contactForm);
        } else {
            if (result.errors) {
                result.errors.forEach((err) => showFieldError(contactForm, err.field, err.message));
            } else {
                showToast(result.message || 'Gửi thất bại', 'error');
            }
        }
    } catch (error) {
        console.warn('API error:', error);
        showToast(t('toast_contact_fallback'), 'success');
        contactForm.reset();
    } finally {
        setButtonLoading(btn, false);
    }
});

// Validate contact form
function validateContactForm() {
    let valid = true;
    clearAllErrors(contactForm);

    const name = $('#ctName').value.trim();
    const email = $('#ctEmail').value.trim();
    const message = $('#ctMessage').value.trim();

    if (!name || name.length < 2) {
        showFieldError(contactForm, 'name', t('val_name_short'));
        valid = false;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError(contactForm, 'email', t('val_email_invalid'));
        valid = false;
    }

    if (!message || message.length < 10) {
        showFieldError(contactForm, 'message', t('val_msg_short'));
        valid = false;
    }

    return valid;
}

// =====================================================
// FORM UTILITY FUNCTIONS
// =====================================================

function showFieldError(form, fieldName, message) {
    const input = form.querySelector(`[name="${fieldName}"]`);
    if (input) {
        const group = input.closest('.form-group');
        group.classList.add('error');
        const errorSpan = group.querySelector('.form-error');
        if (errorSpan) errorSpan.textContent = message;
    }
}

function clearAllErrors(form) {
    form.querySelectorAll('.form-group').forEach((group) => {
        group.classList.remove('error');
        const errorSpan = group.querySelector('.form-error');
        if (errorSpan) errorSpan.textContent = '';
    });
}

function setButtonLoading(btn, loading) {
    const textEl = btn.querySelector('.btn-text');
    const loadEl = btn.querySelector('.btn-loading');
    if (loading) {
        textEl.style.display = 'none';
        loadEl.style.display = 'inline-flex';
        btn.disabled = true;
    } else {
        textEl.style.display = 'inline';
        loadEl.style.display = 'none';
        btn.disabled = false;
    }
}

// =====================================================
// MODAL
// =====================================================
function showModal() {
    successModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    successModal.classList.remove('show');
    document.body.style.overflow = '';
}

// Close modal on overlay click
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) closeModal();
});

// Make closeModal accessible from HTML onclick
window.closeModal = closeModal;

// =====================================================
// TOAST NOTIFICATION
// =====================================================
function showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    ${message}
  `;
    document.body.appendChild(toast);

    // Show animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto hide
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// =====================================================
// LOAD DYNAMIC CONTENT FROM API
// =====================================================
async function loadDynamicContent() {
    try {
        const res = await fetch(`${API_BASE}/content?_t=${Date.now()}`);
        const data = await res.json();
        if (!data.success) return;
        const ct = data.data;

        // Hero section - update Vietnamese translations so i18n won't overwrite
        if (ct.hero) {
            if (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS.vi) {
                if (ct.hero.subtitle) TRANSLATIONS.vi.hero_subtitle = ct.hero.subtitle;
                if (ct.hero.title) TRANSLATIONS.vi.hero_title = ct.hero.title;
                if (ct.hero.tagline) TRANSLATIONS.vi.hero_tagline = ct.hero.tagline;
                if (ct.hero.description) TRANSLATIONS.vi.hero_desc = ct.hero.description;
            }
            const setText = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
            setText('dyn-hero-subtitle', ct.hero.subtitle);
            setText('dyn-hero-title', ct.hero.title);
            setText('dyn-hero-tagline', ct.hero.tagline);
            setText('dyn-hero-desc', ct.hero.description);
            if (ct.hero.backgroundImage) {
                const hero = document.querySelector('.hero');
                if (hero) hero.style.backgroundImage = `url('${ct.hero.backgroundImage}')`;
            }
        }

        // About section - update Vietnamese translations
        if (ct.about) {
            if (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS.vi) {
                if (ct.about.title) TRANSLATIONS.vi.about_heading = ct.about.title;
                if (ct.about.description) {
                    const paragraphs = ct.about.description.split('\n').filter(p => p.trim());
                    paragraphs.forEach((p, i) => {
                        TRANSLATIONS.vi['about_p' + (i + 1)] = p;
                    });
                }
            }
            const titleEl = document.getElementById('dyn-about-title');
            if (titleEl && ct.about.title) titleEl.textContent = ct.about.title;
            const expEl = document.getElementById('dyn-about-exp');
            if (expEl && ct.about.experience) {
                expEl.textContent = ct.about.experience;
                expEl.dataset.target = parseInt(ct.about.experience) || 10;
            }
            const imgEl = document.getElementById('dyn-about-image');
            if (imgEl && ct.about.image) imgEl.src = ct.about.image;
            const descEl = document.getElementById('dyn-about-desc');
            if (descEl && ct.about.description) {
                descEl.innerHTML = ct.about.description.split('\n').filter(p => p.trim()).map((p, i) => `<p data-i18n="about_p${i + 1}">${p}</p>`).join('');
            }
        }

        // Contact section
        if (ct.contact) {
            const addrEl = document.getElementById('dyn-ct-address');
            if (addrEl && ct.contact.address) addrEl.innerHTML = ct.contact.address.replace(/\n/g, '<br>');
            const phoneEl = document.getElementById('dyn-ct-phone');
            if (phoneEl && ct.contact.phone) {
                const cleanPhone = ct.contact.phone.replace(/\s/g, '');
                phoneEl.innerHTML = `<a href="tel:${cleanPhone}">${ct.contact.phone}</a>`;
            }
            const emailEl = document.getElementById('dyn-ct-email');
            if (emailEl && ct.contact.email) emailEl.innerHTML = `<a href="mailto:${ct.contact.email}">${ct.contact.email}</a>`;
            const hoursEl = document.getElementById('dyn-ct-hours');
            if (hoursEl && ct.contact.openHours) hoursEl.textContent = ct.contact.openHours;
            const mapEl = document.getElementById('dyn-ct-map');
            if (mapEl && ct.contact.mapUrl) mapEl.src = ct.contact.mapUrl;

            // Also update footer contact info
            const ftAddr = document.getElementById('ft-address');
            if (ftAddr && ct.contact.address) ftAddr.textContent = ct.contact.address;
            const ftPhone = document.getElementById('ft-phone');
            if (ftPhone && ct.contact.phone) {
                const cleanPhone = ct.contact.phone.replace(/\s/g, '');
                ftPhone.innerHTML = `<a href="tel:${cleanPhone}">${ct.contact.phone}</a>`;
            }
            const ftEmail = document.getElementById('ft-email');
            if (ftEmail && ct.contact.email) ftEmail.innerHTML = `<a href="mailto:${ct.contact.email}">${ct.contact.email}</a>`;
        }

        // Gallery section (dynamic)
        if (ct.gallery && ct.gallery.length > 0) {
            const grid = document.getElementById('dyn-gallery');
            if (grid) {
                grid.innerHTML = ct.gallery.map((img, i) => {
                    const url = typeof img === 'string' ? img : img.url;
                    const caption = typeof img === 'string' ? '' : (img.caption || '');
                    const large = (i === 0 || i === ct.gallery.length - 1) ? ' gallery-item--large' : '';
                    return `
                        <div class="gallery-item${large}">
                            <img src="${url}" alt="${caption || 'Hình ảnh nhà hàng'}" loading="lazy">
                            <div class="gallery-overlay">
                                <span>${caption || 'Nhà Hàng Phố Cổ'}</span>
                            </div>
                        </div>`;
                }).join('');

                // Re-add reveal class
                grid.querySelectorAll('.gallery-item').forEach(el => el.classList.add('reveal'));
                revealOnScroll();
            }
        }

        // Video Intro
        if (ct.introVideo && ct.introVideo.enabled && ct.introVideo.url) {
            const videoMuted = false; // Mặc định phát có âm thanh
            showVideoIntro(ct.introVideo.url, videoMuted);
        }

        // =====================================================
        // STATS COUNTER - Update from admin
        // =====================================================
        if (ct.stats) {
            const statMap = [
                { key: 'customers', selector: '.stat-item:nth-child(1) .counter' },
                { key: 'dishes', selector: '.stat-item:nth-child(2) .counter' },
                { key: 'years', selector: '.stat-item:nth-child(3) .counter' },
                { key: 'reviews', selector: '.stat-item:nth-child(4) .counter' }
            ];
            statMap.forEach(({ key, selector }) => {
                const el = document.querySelector(selector);
                if (el && ct.stats[key] !== undefined) {
                    el.setAttribute('data-target', ct.stats[key]);
                }
            });
        }

        // =====================================================
        // TESTIMONIALS - Update from admin
        // =====================================================
        if (ct.testimonials && ct.testimonials.length > 0) {
            const track = document.getElementById('testimonialTrack');
            if (track) {
                track.innerHTML = ct.testimonials.map((t, i) => {
                    const starsHTML = Array.from({ length: t.stars || 5 }, () =>
                        '<i class="fas fa-star"></i>'
                    ).join('');
                    return `
                    <div class="testimonial-card">
                        <div class="testimonial-stars">${starsHTML}</div>
                        <p class="testimonial-text" data-i18n="testi_${i + 1}_text">"${t.text}"</p>
                        <div class="testimonial-author">
                            <div class="testimonial-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <div>
                                <h4 class="testimonial-name" data-i18n="testi_${i + 1}_name">${t.name}</h4>
                                <span class="testimonial-role" data-i18n="testi_${i + 1}_role">${t.role}</span>
                            </div>
                        </div>
                    </div>`;
                }).join('');

                // Update Vietnamese translations for testimonials
                if (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS.vi) {
                    ct.testimonials.forEach((t, i) => {
                        TRANSLATIONS.vi[`testi_${i + 1}_text`] = `"${t.text}"`;
                        TRANSLATIONS.vi[`testi_${i + 1}_name`] = t.name;
                        TRANSLATIONS.vi[`testi_${i + 1}_role`] = t.role;
                    });
                }

                // Rebuild carousel dots
                const dotsContainer = document.querySelector('.testimonial-dots');
                if (dotsContainer) {
                    dotsContainer.innerHTML = ct.testimonials.map((_, i) =>
                        `<span class="testimonial-dot${i === 0 ? ' active' : ''}" data-index="${i}"></span>`
                    ).join('');
                }

                // Reinitialize testimonials carousel
                if (typeof initTestimonials === 'function') {
                    initTestimonials();
                }
            }
        }

        // =====================================================
        // OFFER BANNER - Update from admin
        // =====================================================
        if (ct.offer) {
            const offerSection = document.querySelector('.offer-banner');
            if (offerSection) {
                if (ct.offer.enabled === false) {
                    offerSection.style.display = 'none';
                } else {
                    offerSection.style.display = '';
                    if (ct.offer.badge) {
                        const badgeEl = offerSection.querySelector('[data-i18n="offer_badge"]');
                        if (badgeEl) badgeEl.textContent = ct.offer.badge;
                    }
                    if (ct.offer.title) {
                        const titleEl = offerSection.querySelector('[data-i18n="offer_title"]');
                        if (titleEl) titleEl.textContent = ct.offer.title;
                    }
                    if (ct.offer.desc) {
                        const descEl = offerSection.querySelector('[data-i18n="offer_desc"]');
                        if (descEl) descEl.textContent = ct.offer.desc;
                    }
                    if (ct.offer.btnText) {
                        const btnEl = offerSection.querySelector('[data-i18n="offer_btn"]');
                        if (btnEl) btnEl.textContent = ct.offer.btnText;
                    }
                    // Update Vietnamese translations
                    if (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS.vi) {
                        if (ct.offer.badge) TRANSLATIONS.vi.offer_badge = ct.offer.badge;
                        if (ct.offer.title) TRANSLATIONS.vi.offer_title = ct.offer.title;
                        if (ct.offer.desc) TRANSLATIONS.vi.offer_desc = ct.offer.desc;
                        if (ct.offer.btnText) TRANSLATIONS.vi.offer_btn = ct.offer.btnText;
                    }
                }
            }
        }

        // =====================================================
        // FLOATING CONTACT - Update from admin
        // =====================================================
        if (ct.floatingContact) {
            const phoneBtn = document.querySelector('.floating-phone');
            if (phoneBtn && ct.floatingContact.phone) {
                phoneBtn.href = `tel:${ct.floatingContact.phone}`;
            }
            const zaloBtn = document.querySelector('.floating-zalo');
            if (zaloBtn && ct.floatingContact.zalo) {
                zaloBtn.href = ct.floatingContact.zalo;
            }
            const messengerBtn = document.querySelector('.floating-messenger');
            if (messengerBtn && ct.floatingContact.messenger) {
                messengerBtn.href = ct.floatingContact.messenger;
            }
        }

        // =====================================================
        // SOCIAL LINKS - Update from admin
        // =====================================================
        if (ct.socialLinks) {
            const socialMap = {
                facebook: '.footer-social a[aria-label="Facebook"]',
                instagram: '.footer-social a[aria-label="Instagram"]',
                tiktok: '.footer-social a[aria-label="TikTok"]',
                zalo: '.footer-social a[aria-label="Zalo"]'
            };
            Object.entries(socialMap).forEach(([key, selector]) => {
                const el = document.querySelector(selector);
                if (el && ct.socialLinks[key]) {
                    el.href = ct.socialLinks[key];
                }
            });
        }

        // =====================================================
        // FOOTER HOURS - Update from admin
        // =====================================================
        if (ct.footerHours) {
            const hoursItems = document.querySelectorAll('.footer-hours ul li');
            if (hoursItems.length >= 3) {
                if (ct.footerHours.weekday) {
                    const span = hoursItems[0].querySelectorAll('span');
                    if (span.length >= 2) span[1].textContent = ct.footerHours.weekday;
                }
                if (ct.footerHours.saturday) {
                    const span = hoursItems[1].querySelectorAll('span');
                    if (span.length >= 2) span[1].textContent = ct.footerHours.saturday;
                }
                if (ct.footerHours.sunday) {
                    const span = hoursItems[2].querySelectorAll('span');
                    if (span.length >= 2) span[1].textContent = ct.footerHours.sunday;
                }
            }
        }

        // Re-apply current language after dynamic content is loaded
        if (typeof applyLanguage === 'function' && typeof currentLang !== 'undefined') {
            applyLanguage(currentLang);
        }

    } catch (error) {
        console.log('Content API not available, using defaults');
    }
}

// =====================================================
// HERO BACKGROUND VIDEO
// =====================================================
function showVideoIntro(videoUrl, startMuted) {
    const heroVideo = document.getElementById('heroVideo');
    const controls = document.getElementById('heroVideoControls');
    const skipBtn = document.getElementById('heroVideoSkip');
    const muteBtn = document.getElementById('heroVideoMute');
    const hero = document.querySelector('.hero');

    if (!heroVideo || !hero) return;

    heroVideo.src = videoUrl;
    heroVideo.loop = true;
    heroVideo.preload = 'auto';
    heroVideo.muted = false;
    updateMuteIcon(muteBtn, false);
    heroVideo.load();

    function showControls() {
        heroVideo.classList.add('active');
        heroVideo.classList.remove('fading');
        hero.classList.add('hero--video-playing');
        if (controls) controls.style.display = 'flex';
    }

    // Tự động bật âm thanh khi user tương tác bất kỳ với trang
    function enableSoundOnInteraction() {
        if (heroVideo && heroVideo.muted && heroVideo.classList.contains('active')) {
            heroVideo.muted = false;
            updateMuteIcon(muteBtn, false);
            if (heroVideo.paused) heroVideo.play().catch(() => { });
        }
        // Gỡ tất cả listener sau khi đã bật âm thanh
        ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
            document.removeEventListener(evt, enableSoundOnInteraction, { capture: true });
        });
    }

    heroVideo.addEventListener('canplay', () => {
        showControls();
        heroVideo.muted = false;
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Phát có âm thanh thành công!
                updateMuteIcon(muteBtn, false);
            }).catch(() => {
                // Trình duyệt chặn autoplay có âm -> phát muted trước
                heroVideo.muted = true;
                updateMuteIcon(muteBtn, true);
                heroVideo.play().catch(() => { });
                // Tự động bật âm thanh ngay khi user tương tác với trang
                ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
                    document.addEventListener(evt, enableSoundOnInteraction, { capture: true, once: true });
                });
            });
        }
    }, { once: true });

    // Khi quay lại tab/app -> tự động phát lại video
    document.addEventListener('visibilitychange', () => {
        if (!heroVideo.src || !heroVideo.classList.contains('active')) return;
        if (document.hidden) {
            heroVideo.pause();
        } else {
            heroVideo.play().catch(() => {
                heroVideo.muted = true;
                updateMuteIcon(muteBtn, true);
                heroVideo.play().catch(() => { });
            });
        }
    });

    // Khi focus lại trang (bổ sung cho mobile)
    window.addEventListener('focus', () => {
        if (heroVideo.src && heroVideo.classList.contains('active') && heroVideo.paused) {
            heroVideo.play().catch(() => { });
        }
    });

    function stopVideo() {
        heroVideo.classList.add('fading');
        hero.classList.remove('hero--video-playing');
        if (controls) controls.style.display = 'none';
        setTimeout(() => {
            heroVideo.pause();
            heroVideo.classList.remove('active', 'fading');
        }, 800);
    }

    // Mute/unmute toggle
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            heroVideo.muted = !heroVideo.muted;
            updateMuteIcon(muteBtn, heroVideo.muted);
            if (!heroVideo.muted && heroVideo.paused) {
                heroVideo.play().catch(() => {
                    heroVideo.muted = true;
                    updateMuteIcon(muteBtn, true);
                });
            }
        });
    }

    // Skip button - dừng hẳn video
    if (skipBtn) skipBtn.addEventListener('click', stopVideo);
}

function updateMuteIcon(btn, isMuted) {
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (icon) {
        icon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    }
}

// =====================================================
// INITIALIZATION
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    // Load menu data
    loadMenu();

    // Load dynamic content from API
    loadDynamicContent();

    // Init custom select dropdowns
    initCustomSelects();

    // Init pre-order panel
    initOrderPanel();

    // Init testimonials carousel
    initTestimonials();

    // Init gallery lightbox
    initLightbox();

    // Init floating contact button
    initFloatingContact();

    // Init cookie consent banner
    initCookieConsent();

    // Init privacy policy modal
    initPrivacyModal();

    // Add reveal class to animated elements
    $$('.section-header, .about-grid, .gallery-item, .contact-grid > *, .stat-item, .offer-content').forEach((el) => {
        el.classList.add('reveal');
    });

    // Initial reveal check
    revealOnScroll();

    // Clear input errors on input
    $$('input, select, textarea').forEach((input) => {
        input.addEventListener('input', () => {
            const group = input.closest('.form-group');
            if (group) {
                group.classList.remove('error');
                const errorSpan = group.querySelector('.form-error');
                if (errorSpan) errorSpan.textContent = '';
            }
        });
    });

    // Generate hero particles
    generateHeroParticles();

    // Init counter animation
    initCounterAnimation();

    // Init language switcher (i18n)
    initLanguageSwitcher();

    // Hide preloader
    hidePreloader();

    console.log('🏮 Nhà Hàng Phố Cổ - Website loaded successfully!');
});

// =====================================================
// HERO PARTICLES
// =====================================================
function generateHeroParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const count = 25;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'hero-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (8 + Math.random() * 12) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.width = (2 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;
        particle.style.opacity = 0.2 + Math.random() * 0.4;
        container.appendChild(particle);
    }
}

// =====================================================
// COUNTER ANIMATION
// =====================================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.target) || parseInt(el.textContent) || 0;
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current + (target >= 100 ? '+' : '+');
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// =====================================================
// PRELOADER
// =====================================================
function hidePreloader() {
    const preloader = $('#preloader');
    if (!preloader) return;

    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
        // Remove from DOM after transition
        setTimeout(() => {
            preloader.remove();
        }, 800);
    }, 2200);
}

// =====================================================
// TESTIMONIALS CAROUSEL
// =====================================================
let _testiAutoInterval = null;

function initTestimonials() {
    const track = $('#testimonialTrack');
    const prevBtn = $('#testiPrev');
    const nextBtn = $('#testiNext');
    const dotsContainer = $('#testiDots');

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const total = cards.length;
    if (total === 0) return;

    let current = 0;

    // Clear old auto-play interval
    if (_testiAutoInterval) clearInterval(_testiAutoInterval);

    // Clear existing dots
    dotsContainer.innerHTML = '';

    // Create dots
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    }

    // Reset track position
    track.style.transform = 'translateX(0%)';

    function goTo(index) {
        current = index;
        if (current < 0) current = total - 1;
        if (current >= total) current = 0;

        track.style.transform = `translateX(-${current * 100}%)`;

        // Update dots
        dotsContainer.querySelectorAll('.testimonial-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });

        resetAuto();
    }

    function resetAuto() {
        if (_testiAutoInterval) clearInterval(_testiAutoInterval);
        _testiAutoInterval = setInterval(() => goTo(current + 1), 6000);
    }

    // Clone buttons to remove old event listeners
    const newPrev = prevBtn.cloneNode(true);
    const newNext = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrev, prevBtn);
    nextBtn.parentNode.replaceChild(newNext, nextBtn);

    newPrev.addEventListener('click', () => goTo(current - 1));
    newNext.addEventListener('click', () => goTo(current + 1));

    // Touch/swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goTo(current + 1);
            else goTo(current - 1);
        }
    }, { passive: true });

    // Start auto-play
    resetAuto();
}

// =====================================================
// GALLERY LIGHTBOX
// =====================================================
function initLightbox() {
    const lightbox = $('#lightbox');
    const lightboxImg = $('#lightboxImg');
    const lightboxCaption = $('#lightboxCaption');
    const lightboxCounter = $('#lightboxCounter');
    const closeBtn = $('#lightboxClose');
    const prevBtn = $('#lightboxPrev');
    const nextBtn = $('#lightboxNext');

    if (!lightbox) return;

    let images = [];
    let currentIndex = 0;

    function collectImages() {
        images = [];
        const galleryItems = $$('#dyn-gallery .gallery-item');
        galleryItems.forEach((item, i) => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-overlay span');
            if (img) {
                images.push({
                    src: img.src,
                    caption: caption ? caption.textContent : ''
                });
            }

            // Add click listener
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => openLightbox(i));
        });
    }

    function openLightbox(index) {
        collectImages();
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        if (!images[currentIndex]) return;
        lightboxImg.src = images[currentIndex].src;
        lightboxCaption.textContent = images[currentIndex].caption;
        lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    function prevImage() {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        updateLightbox();
    }

    function nextImage() {
        currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        updateLightbox();
    }

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });

    // Collect images on load
    setTimeout(collectImages, 2000);

    // Expose openLightbox for dynamic gallery items
    window.openLightbox = openLightbox;
}

// =====================================================
// FLOATING CONTACT BUTTON
// =====================================================
function initFloatingContact() {
    const container = $('#floatingContact');
    const mainBtn = $('#floatingMainBtn');
    if (!container || !mainBtn) return;

    mainBtn.addEventListener('click', () => {
        container.classList.toggle('open');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            container.classList.remove('open');
        }
    });
}

// =====================================================
// COOKIE CONSENT
// =====================================================
function initCookieConsent() {
    const banner = document.getElementById('cookieConsent');
    if (!banner) return;

    // Check if already answered
    const consent = localStorage.getItem('cookie_consent');
    if (consent) {
        banner.style.display = 'none';
        return;
    }

    // Show banner after 1.5s
    setTimeout(() => {
        banner.style.display = 'block';
    }, 1500);

    const acceptBtn = document.getElementById('cookieAccept');
    const declineBtn = document.getElementById('cookieDecline');

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            banner.style.display = 'none';
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            banner.style.display = 'none';
        });
    }
}

// =====================================================
// PRIVACY POLICY MODAL
// =====================================================
function initPrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (!modal) return;

    // Hide by default
    modal.style.display = 'none';

    function openModal(e) {
        if (e) e.preventDefault();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Privacy link triggers
    const links = document.querySelectorAll('#privacyLink, .privacy-link, #cookiePolicyLink');
    links.forEach(link => link.addEventListener('click', openModal));

    // Close button
    const closeBtn = document.getElementById('privacyCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close on overlay click
    const overlay = modal.querySelector('.privacy-modal-overlay');
    if (overlay) overlay.addEventListener('click', closeModal);

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
}
