/* =====================================================
 * Admin Dashboard - JavaScript
 * Nhà Hàng Phố Cổ
 * Author: Mphong
 * ===================================================== */

'use strict';

const API = window.location.origin + '/api';

// DOM shortcuts
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// =====================================================
// ADMIN AUTH - Bảo vệ trang admin bằng mật khẩu
// =====================================================
let isAuthenticated = sessionStorage.getItem('admin_auth') === 'true';
let adminToken = sessionStorage.getItem('admin_token') || '';

// Auth headers for admin API calls
function authHeaders(contentType = true) {
    const h = {};
    if (contentType) h['Content-Type'] = 'application/json';
    if (adminToken) h['Authorization'] = `Bearer ${adminToken}`;
    return h;
}

function showLoginOverlay() {
    if (isAuthenticated) return;

    const overlay = document.createElement('div');
    overlay.id = 'loginOverlay';
    overlay.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(31,41,55,0.97);z-index:9999;display:flex;align-items:center;justify-content:center;">
      <div style="background:#fff;padding:40px;border-radius:16px;text-align:center;max-width:420px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
        <div style="font-size:3rem;margin-bottom:12px;">🏮</div>
        <h2 style="color:#1F2937;margin-bottom:8px;font-size:1.4rem;">Đăng nhập Quản lý</h2>
        <p style="color:#6B7280;margin-bottom:24px;font-size:0.9rem;">Nhập tài khoản và mật khẩu để truy cập trang quản lý</p>
        <div style="text-align:left;margin-bottom:14px;">
          <label style="display:block;font-size:0.85rem;font-weight:600;color:#374151;margin-bottom:6px;"><i class='fas fa-user' style='margin-right:6px;color:#8B4513;'></i>Tài khoản</label>
          <input type="text" id="adminUsername" placeholder="Nhập tài khoản" autocomplete="username"
            style="width:100%;padding:12px 16px;border:2px solid #E5E7EB;border-radius:10px;font-size:1rem;outline:none;box-sizing:border-box;"
            onfocus="this.style.borderColor='#8B4513'" onblur="this.style.borderColor='#E5E7EB'">
        </div>
        <div style="text-align:left;margin-bottom:14px;">
          <label style="display:block;font-size:0.85rem;font-weight:600;color:#374151;margin-bottom:6px;"><i class='fas fa-lock' style='margin-right:6px;color:#8B4513;'></i>Mật khẩu</label>
          <input type="password" id="adminPassword" placeholder="Nhập mật khẩu" autocomplete="current-password"
            style="width:100%;padding:12px 16px;border:2px solid #E5E7EB;border-radius:10px;font-size:1rem;outline:none;box-sizing:border-box;"
            onfocus="this.style.borderColor='#8B4513'" onblur="this.style.borderColor='#E5E7EB'"
            onkeydown="if(event.key==='Enter')document.getElementById('loginBtn').click()">
        </div>
        <p id="loginError" style="color:#EF4444;font-size:0.85rem;margin-bottom:12px;display:none;text-align:left;">
          <i class='fas fa-exclamation-circle'></i> Tài khoản hoặc mật khẩu không đúng
        </p>
        <button id="loginBtn" onclick="handleLogin()" 
          style="width:100%;padding:13px;background:#8B4513;color:#fff;border:none;border-radius:10px;font-size:1rem;font-weight:600;cursor:pointer;transition:background 0.2s;"
          onmouseover="this.style.background='#6B3410'" onmouseout="this.style.background='#8B4513'">
          <i class='fas fa-sign-in-alt' style='margin-right:6px;'></i> Đăng nhập
        </button>
        <p style="margin-top:16px;font-size:0.78rem;color:#9CA3AF;"><i class='fas fa-shield-alt'></i> Trang quản lý dành riêng cho nhân viên nhà hàng</p>
      </div>
    </div>
  `;
    document.body.appendChild(overlay);
    setTimeout(() => $('#adminUsername').focus(), 100);
}

async function handleLogin() {
    const username = $('#adminUsername').value.trim();
    const password = $('#adminPassword').value;
    const errorEl = $('#loginError');

    if (!username || !password) {
        errorEl.innerHTML = "<i class='fas fa-exclamation-circle'></i> Vui lòng nhập đầy đủ tài khoản và mật khẩu";
        errorEl.style.display = 'block';
        if (!username) $('#adminUsername').style.borderColor = '#EF4444';
        if (!password) $('#adminPassword').style.borderColor = '#EF4444';
        return;
    }

    try {
        const res = await fetch(`${API}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (data.success) {
            isAuthenticated = true;
            adminToken = data.token;
            sessionStorage.setItem('admin_auth', 'true');
            sessionStorage.setItem('admin_token', data.token);
            $('#loginOverlay').remove();
            initDashboard();
        } else {
            errorEl.innerHTML = "<i class='fas fa-exclamation-circle'></i> Tài khoản hoặc mật khẩu không đúng";
            errorEl.style.display = 'block';
            $('#adminUsername').style.borderColor = '#EF4444';
            $('#adminPassword').style.borderColor = '#EF4444';
            $('#adminPassword').value = '';
            $('#adminPassword').focus();
        }
    } catch (e) {
        errorEl.innerHTML = "<i class='fas fa-exclamation-circle'></i> Lỗi kết nối server";
        errorEl.style.display = 'block';
    }
}

window.handleLogin = handleLogin;

// =====================================================
// TAB NAVIGATION
// =====================================================
const navItems = $$('.nav-item');
const tabPanels = $$('.tab-panel');

navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.dataset.tab;

        // Update nav
        navItems.forEach((n) => n.classList.remove('active'));
        item.classList.add('active');

        // Update panels
        tabPanels.forEach((p) => p.classList.remove('active'));
        $(`#tab-${tab}`).classList.add('active');

        // Close mobile sidebar
        $('#sidebar').classList.remove('open');

        // Load data for tab
        if (tab === 'dashboard') loadDashboard();
        if (tab === 'reservations') loadReservations();
        if (tab === 'contacts') loadContacts();
        if (tab === 'menu-manage') loadMenuItems();
        if (tab === 'analytics') loadAnalytics();
        if (tab === 'content') loadContent();
    });
});

// Mobile sidebar toggle
$('#menuBtn').addEventListener('click', () => {
    $('#sidebar').classList.toggle('open');
});

// Close sidebar on overlay click (mobile)
document.addEventListener('click', (e) => {
    const sidebar = $('#sidebar');
    const menuBtn = $('#menuBtn');
    if (sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !menuBtn.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

// =====================================================
// TOAST NOTIFICATION
// =====================================================
function showToast(message, type = 'success') {
    const container = $('#toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
    toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// =====================================================
// CUSTOM CONFIRM MODAL (thay thế confirm() xấu)
// =====================================================
function showConfirmModal({ title, message, icon, iconColor, confirmText, confirmColor, cancelText }) {
    return new Promise((resolve) => {
        // Xóa modal cũ nếu còn
        const old = $('#confirmModal');
        if (old) old.remove();

        const modal = document.createElement('div');
        modal.id = 'confirmModal';
        modal.innerHTML = `
        <div class="confirm-overlay">
            <div class="confirm-box">
                <div class="confirm-icon" style="color:${iconColor || '#EF4444'}">
                    <i class="fas fa-${icon || 'exclamation-triangle'}"></i>
                </div>
                <h3 class="confirm-title">${title || 'Xác nhận'}</h3>
                <p class="confirm-msg">${message || 'Bạn có chắc chắn muốn thực hiện?'}</p>
                <div class="confirm-btns">
                    <button class="confirm-btn confirm-btn--cancel" id="confirmCancel">
                        <i class="fas fa-times"></i> ${cancelText || 'Hủy bỏ'}
                    </button>
                    <button class="confirm-btn confirm-btn--ok" id="confirmOk" style="background:${confirmColor || '#EF4444'}">
                        <i class="fas fa-check"></i> ${confirmText || 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
        `;
        document.body.appendChild(modal);

        // Animation
        requestAnimationFrame(() => modal.classList.add('show'));

        const cleanup = (result) => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 200);
            resolve(result);
        };

        $('#confirmOk').addEventListener('click', () => cleanup(true));
        $('#confirmCancel').addEventListener('click', () => cleanup(false));
        modal.querySelector('.confirm-overlay').addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.confirm-overlay')) cleanup(false);
        });
    });
}

// =====================================================
// FORMAT HELPERS
// =====================================================
function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatTime(timeStr) {
    if (!timeStr) return '—';
    // timeStr may be "HH:MM:SS" or "HH:MM"
    return timeStr.substring(0, 5);
}

function formatDateTime(dtStr) {
    if (!dtStr) return '—';
    const d = new Date(dtStr);
    return d.toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

function getStatusHTML(status) {
    const map = {
        pending: { label: 'Chờ xác nhận', icon: 'clock', cls: 'pending' },
        confirmed: { label: 'Đã xác nhận', icon: 'check-circle', cls: 'confirmed' },
        cancelled: { label: 'Đã hủy', icon: 'times-circle', cls: 'cancelled' }
    };
    const s = map[status] || map.pending;
    return `<span class="status status--${s.cls}"><i class="fas fa-${s.icon}"></i> ${s.label}</span>`;
}

function getActionButtons(id, status) {
    let html = '<div class="action-btns">';
    if (status !== 'confirmed') {
        html += `<button class="action-btn action-btn--confirm" onclick="updateReservation('${id}', 'confirmed')" title="Xác nhận">
      <i class="fas fa-check"></i> Xác nhận
    </button>`;
    }
    if (status !== 'cancelled') {
        html += `<button class="action-btn action-btn--cancel" onclick="updateReservation('${id}', 'cancelled')" title="Hủy">
      <i class="fas fa-times"></i> Hủy
    </button>`;
    }
    if (status === 'confirmed') {
        html += `<span style="color:#065F46; font-size:0.8rem; font-weight:600;">✓ Đã xác nhận</span>`;
    }
    if (status === 'cancelled') {
        html += `<span style="color:#991B1B; font-size:0.8rem; font-weight:600;">✗ Đã hủy</span>`;
    }
    html += `<button class="action-btn action-btn--delete" onclick="deleteReservation('${id}')" title="Xóa" style="background:#FEE2E2;color:#991B1B;margin-left:4px;">
      <i class="fas fa-trash-alt"></i>
    </button>`;
    html += '</div>';
    return html;
}

// Format pre-order data for display
function getPreOrderHTML(preOrder) {
    if (!preOrder) return '<span style="color:#6B7280;">—</span>';

    let items = preOrder;
    if (typeof preOrder === 'string') {
        try { items = JSON.parse(preOrder); } catch (e) { return '<span style="color:#6B7280;">—</span>'; }
    }

    if (!Array.isArray(items) || items.length === 0) return '<span style="color:#6B7280;">—</span>';

    const total = items.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const listHTML = items.map(i =>
        `<div style="display:flex;justify-content:space-between;gap:8px;font-size:0.8rem;padding:2px 0;">
            <span>${escHTML(i.name)} <strong style="color:#D97706;">x${i.qty}</strong></span>
            <span style="white-space:nowrap;">${formatPrice(i.price * i.qty)}</span>
        </div>`
    ).join('');

    return `<div class="preorder-cell" style="min-width:180px;max-width:280px;">
        ${listHTML}
        <div style="border-top:1px solid #E5E7EB;margin-top:4px;padding-top:4px;font-weight:700;text-align:right;font-size:0.82rem;color:#D97706;">
            ${formatPrice(total)}
        </div>
    </div>`;
}

// Helper: cập nhật badge, ẩn khi = 0
function updateBadge(el, count) {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-block' : 'none';
}

// =====================================================
// LOAD DASHBOARD
// =====================================================
async function loadDashboard() {
    // Set today date
    const today = new Date();
    $('#todayDate').textContent = today.toLocaleDateString('vi-VN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    try {
        // Load reservations & contacts in parallel
        const [resData, ctData] = await Promise.all([
            fetch(`${API}/reservations`).then(r => r.json()),
            fetch(`${API}/contacts`).then(r => r.json())
        ]);

        const reservations = resData.success ? resData.data : [];
        const contacts = ctData.success ? ctData.data : [];

        // Stats
        const pending = reservations.filter(r => r.status === 'pending').length;
        const confirmed = reservations.filter(r => r.status === 'confirmed').length;

        $('#statTotalRes').textContent = reservations.length;
        $('#statPending').textContent = pending;
        $('#statConfirmed').textContent = confirmed;
        $('#statContacts').textContent = contacts.length;

        // Badges (ẩn khi = 0)
        updateBadge($('#resBadge'), pending);
        updateBadge($('#ctBadge'), contacts.length);

        // Initialize notification tracking
        if (lastKnownPendingCount < 0) lastKnownPendingCount = pending;

        // Today's reservations
        const todayStr = today.toISOString().split('T')[0];
        const todayRes = reservations.filter(r => {
            const d = new Date(r.date).toISOString().split('T')[0];
            return d === todayStr;
        });

        const tbody = $('#todayReservations');
        if (todayRes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-msg">Hôm nay chưa có đặt bàn nào</td></tr>';
        } else {
            tbody.innerHTML = todayRes.map(r => `
        <tr>
          <td><strong>${escHTML(r.name)}</strong></td>
          <td><a href="tel:${r.phone}" class="phone-link">${escHTML(r.phone)}</a></td>
          <td>${formatTime(r.time)}</td>
          <td>${r.guests} người</td>
          <td>${getPreOrderHTML(r.pre_order)}</td>
          <td>${getStatusHTML(r.status)}</td>
          <td>${getActionButtons(r.id, r.status)}</td>
        </tr>
      `).join('');
        }

    } catch (error) {
        console.error('Dashboard load error:', error);
        showToast('Không thể tải dữ liệu. Kiểm tra kết nối server.', 'error');
    }
}

// =====================================================
// LOAD ALL RESERVATIONS
// =====================================================
async function loadReservations(dateFilter) {
    const tbody = $('#allReservations');
    tbody.innerHTML = '<tr><td colspan="12" class="empty-msg">Đang tải...</td></tr>';

    try {
        let url = `${API}/reservations?limit=200`;
        if (dateFilter) url += `&date=${dateFilter}`;

        const res = await fetch(url);
        const data = await res.json();
        const list = data.success ? data.data : [];

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="12" class="empty-msg">
        ${dateFilter ? 'Không có đặt bàn ngày ' + formatDate(dateFilter) : 'Chưa có đơn đặt bàn nào'}
      </td></tr>`;
            return;
        }

        tbody.innerHTML = list.map((r, i) => `
      <tr>
        <td>${r.id}</td>
        <td><strong>${escHTML(r.name)}</strong></td>
        <td><a href="tel:${r.phone}" class="phone-link">${escHTML(r.phone)}</a></td>
        <td>${escHTML(r.email || '—')}</td>
        <td>${formatDate(r.date)}</td>
        <td>${formatTime(r.time)}</td>
        <td>${r.guests} người</td>
        <td class="note-cell" title="${escHTML(r.note || '')}">${escHTML(r.note || '—')}</td>
        <td>${getPreOrderHTML(r.pre_order)}</td>
        <td>${getStatusHTML(r.status)}</td>
        <td>${formatDateTime(r.created_at)}</td>
        <td>${getActionButtons(r.id, r.status)}</td>
      </tr>
    `).join('');

        // Update badge
        const pending = list.filter(r => r.status === 'pending').length;
        updateBadge($('#resBadge'), pending);

    } catch (error) {
        console.error('Load reservations error:', error);
        tbody.innerHTML = '<tr><td colspan="11" class="empty-msg">Lỗi tải dữ liệu</td></tr>';
    }
}

// =====================================================
// DELETE RESERVATION
// =====================================================
async function deleteReservation(id) {
    const ok = await showConfirmModal({
        title: 'Xóa đơn đặt bàn',
        message: `Bạn chắc chắn muốn <strong>xóa đơn #${id}</strong>?<br><span style="font-size:0.85rem;color:#9CA3AF;">Hành động này không thể hoàn tác!</span>`,
        icon: 'trash-alt',
        iconColor: '#EF4444',
        confirmText: 'Xóa',
        confirmColor: '#EF4444'
    });
    if (!ok) return;

    try {
        const res = await fetch(`${API}/reservations/${id}`, { method: 'DELETE', headers: authHeaders(false) });
        const data = await res.json();

        if (data.success) {
            showToast(`Đã xóa đơn #${id}`, 'success');
            const activeTab = $('.nav-item.active').dataset.tab;
            if (activeTab === 'dashboard') loadDashboard();
            else loadReservations($('#filterDate').value || undefined);
        } else {
            showToast(data.message || 'Xóa thất bại', 'error');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showToast('Lỗi kết nối server', 'error');
    }
}

window.deleteReservation = deleteReservation;

// =====================================================
// UPDATE RESERVATION STATUS
// =====================================================
async function updateReservation(id, status) {
    const label = status === 'confirmed' ? 'xác nhận' : 'hủy';
    const ok = await showConfirmModal({
        title: status === 'confirmed' ? 'Xác nhận đặt bàn' : 'Hủy đặt bàn',
        message: `Bạn muốn <strong>${label}</strong> đơn đặt bàn <strong>#${id}</strong>?`,
        icon: status === 'confirmed' ? 'check-circle' : 'times-circle',
        iconColor: status === 'confirmed' ? '#10B981' : '#F59E0B',
        confirmText: status === 'confirmed' ? 'Xác nhận' : 'Hủy đơn',
        confirmColor: status === 'confirmed' ? '#10B981' : '#F59E0B'
    });
    if (!ok) return;

    try {
        const res = await fetch(`${API}/reservations/${id}/status`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ status })
        });

        const data = await res.json();

        if (data.success) {
            showToast(`Đã ${label} đơn #${id} thành công!`, 'success');
            // Refresh current tab
            const activeTab = $('.nav-item.active').dataset.tab;
            if (activeTab === 'dashboard') loadDashboard();
            else loadReservations($('#filterDate').value || undefined);
        } else {
            showToast(data.message || 'Cập nhật thất bại', 'error');
        }
    } catch (error) {
        console.error('Update error:', error);
        showToast('Lỗi kết nối server', 'error');
    }
}

// Make updateReservation accessible from inline onclick
window.updateReservation = updateReservation;

// =====================================================
// LOAD CONTACTS
// =====================================================
async function loadContacts() {
    const tbody = $('#allContacts');
    tbody.innerHTML = '<tr><td colspan="7" class="empty-msg">Đang tải...</td></tr>';

    try {
        const res = await fetch(`${API}/contacts`);
        const data = await res.json();
        const list = data.success ? data.data : [];

        if (list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-msg">Chưa có tin nhắn nào</td></tr>';
            updateBadge($('#ctBadge'), 0);
            return;
        }

        tbody.innerHTML = list.map(c => `
      <tr>
        <td>${c.id}</td>
        <td><strong>${escHTML(c.name)}</strong></td>
        <td><a href="mailto:${c.email}">${escHTML(c.email)}</a></td>
        <td>${escHTML(c.subject || '—')}</td>
        <td class="msg-cell" onclick="this.classList.toggle('expanded')" title="Click để xem đầy đủ">${escHTML(c.message)}</td>
        <td>${formatDateTime(c.created_at)}</td>
        <td>
          <button class="action-btn action-btn--delete" onclick="deleteContact('${c.id}')" title="Xóa" style="background:#FEE2E2;color:#991B1B;">
            <i class="fas fa-trash-alt"></i> Xóa
          </button>
        </td>
      </tr>
    `).join('');

        updateBadge($('#ctBadge'), list.length);

    } catch (error) {
        console.error('Load contacts error:', error);
        tbody.innerHTML = '<tr><td colspan="7" class="empty-msg">Lỗi tải dữ liệu</td></tr>';
    }
}

// =====================================================
// DELETE CONTACT
// =====================================================
async function deleteContact(id) {
    const ok = await showConfirmModal({
        title: 'Xóa tin nhắn',
        message: `Bạn chắc chắn muốn <strong>xóa tin nhắn #${id}</strong>?<br><span style="font-size:0.85rem;color:#9CA3AF;">Hành động này không thể hoàn tác!</span>`,
        icon: 'trash-alt',
        iconColor: '#EF4444',
        confirmText: 'Xóa',
        confirmColor: '#EF4444'
    });
    if (!ok) return;

    try {
        const res = await fetch(`${API}/contacts/${id}`, { method: 'DELETE', headers: authHeaders(false) });
        const data = await res.json();

        if (data.success) {
            showToast('Đã xóa tin nhắn', 'success');
            loadContacts();
        } else {
            showToast(data.message || 'Xóa thất bại', 'error');
        }
    } catch (error) {
        console.error('Delete contact error:', error);
        showToast('Lỗi kết nối server', 'error');
    }
}

window.deleteContact = deleteContact;

// =====================================================
// LOAD MENU ITEMS (Admin - tất cả, gồm ẩn)
// =====================================================
async function loadMenuItems() {
    const tbody = $('#allMenuItems');
    tbody.innerHTML = '<tr><td colspan="8" class="empty-msg">Đang tải...</td></tr>';

    try {
        const res = await fetch(`${API}/menu/all?_t=${Date.now()}`);
        const data = await res.json();
        const list = data.success ? data.data : [];

        if (list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-msg">Chưa có món nào</td></tr>';
            return;
        }

        tbody.innerHTML = list.map(m => `
      <tr class="${m.is_active ? '' : 'row-inactive'}">
        <td>${m.id}</td>
        <td><img src="${m.image}" alt="${escHTML(m.name)}" class="menu-thumb" onerror="this.src='https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=100'"></td>
        <td><strong>${escHTML(m.name)}</strong></td>
        <td><span class="cat-badge">${escHTML(m.category)}</span></td>
        <td style="color:#C8102E; font-weight:600; white-space:nowrap;">${formatPrice(m.price)}</td>
        <td class="note-cell">${escHTML(m.description || '')}</td>
        <td>${m.is_active ? '<span class="status status--confirmed"><i class="fas fa-eye"></i> Hiện</span>' : '<span class="status status--cancelled"><i class="fas fa-eye-slash"></i> Ẩn</span>'}</td>
        <td>
          <div class="action-btns">
            <button class="action-btn action-btn--confirm" onclick="editMenuItem('${m.id}')" title="Sửa">
              <i class="fas fa-edit"></i> Sửa
            </button>
            <button class="action-btn action-btn--${m.is_active ? 'cancel' : 'confirm'}" onclick="toggleMenuItem('${m.id}', ${m.is_active ? 0 : 1})" title="${m.is_active ? 'Ẩn' : 'Hiện'}">
              <i class="fas fa-${m.is_active ? 'eye-slash' : 'eye'}"></i> ${m.is_active ? 'Ẩn' : 'Hiện'}
            </button>
            <button class="action-btn action-btn--delete" onclick="deleteMenuItem('${m.id}')" title="Xóa" style="background:#FEE2E2;color:#991B1B;">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

        // Update category datalist
        const categories = [...new Set(list.map(m => m.category))];
        const datalist = $('#categoryList');
        if (datalist) datalist.innerHTML = categories.map(c => `<option value="${c}">`).join('');

    } catch (error) {
        console.error('Load menu error:', error);
        tbody.innerHTML = '<tr><td colspan="8" class="empty-msg">Lỗi tải dữ liệu</td></tr>';
    }
}

// =====================================================
// MENU MODAL (Add/Edit)
// =====================================================
function openMenuModal(item = null) {
    const modal = $('#menuModal');
    const title = $('#menuModalTitle');

    if (item) {
        title.innerHTML = '<i class="fas fa-edit"></i> Sửa món ăn';
        $('#menuEditId').value = item.id;
        $('#menuName').value = item.name || '';
        $('#menuCategory').value = item.category || '';
        $('#menuPrice').value = item.price || '';
        $('#menuDesc').value = item.description || '';
        $('#menuImage').value = item.image || '';
        $('#menuActive').value = item.is_active !== undefined ? item.is_active : 1;
        showImagePreview('menuImage', item.image);
    } else {
        title.innerHTML = '<i class="fas fa-plus-circle"></i> Thêm món mới';
        $('#menuEditId').value = '';
        $('#menuName').value = '';
        $('#menuCategory').value = '';
        $('#menuPrice').value = '';
        $('#menuDesc').value = '';
        $('#menuImage').value = '';
        $('#menuActive').value = '1';
        $('#preview_menuImage').innerHTML = '';
    }
    modal.classList.add('show');
}

function closeMenuModal() {
    $('#menuModal').classList.remove('show');
}

window.closeMenuModal = closeMenuModal;

async function editMenuItem(id) {
    try {
        const res = await fetch(`${API}/menu/${id}?_t=${Date.now()}`);
        const data = await res.json();
        if (data.success) openMenuModal(data.data);
        else showToast('Không tìm thấy món', 'error');
    } catch { showToast('Lỗi tải dữ liệu', 'error'); }
}

window.editMenuItem = editMenuItem;

async function saveMenuItem() {
    const id = $('#menuEditId').value;
    const name = $('#menuName').value.trim();
    const category = $('#menuCategory').value.trim();
    const price = $('#menuPrice').value;
    const description = $('#menuDesc').value.trim();
    const image = $('#menuImage').value.trim();
    const is_active = Number($('#menuActive').value);

    if (!name || !category || !price) {
        showToast('Vui lòng điền tên, danh mục và giá', 'error');
        return;
    }

    const body = { name, category, price: Number(price), description, image, is_active };

    // Disable save button to prevent double-click
    const saveBtn = $('#menuSaveBtn');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
    }

    try {
        const url = id ? `${API}/menu/${id}` : `${API}/menu`;
        const method = id ? 'PUT' : 'POST';
        console.log(`[Menu Save] ${method} ${url}`, body);
        const res = await fetch(url, {
            method,
            headers: authHeaders(),
            body: JSON.stringify(body)
        });
        const data = await res.json();
        console.log('[Menu Save] Response:', data);
        if (data.success) {
            showToast(id ? 'Đã cập nhật món thành công!' : 'Đã thêm món mới thành công!', 'success');
            closeMenuModal();
            loadMenuItems();
        } else {
            showToast(data.message || 'Lỗi lưu món ăn', 'error');
            console.error('[Menu Save] Server error:', data);
        }
    } catch (error) {
        console.error('[Menu Save] Network error:', error);
        showToast('Lỗi kết nối server - kiểm tra console để xem chi tiết', 'error');
    } finally {
        // Re-enable save button
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Lưu món';
        }
    }
}

window.saveMenuItem = saveMenuItem;

async function deleteMenuItem(id) {
    const ok = await showConfirmModal({
        title: 'Xóa món ăn',
        message: `Bạn chắc chắn muốn <strong>xóa món #${id}</strong>?<br><span style="font-size:0.85rem;color:#9CA3AF;">Hành động này không thể hoàn tác!</span>`,
        icon: 'trash-alt',
        iconColor: '#EF4444',
        confirmText: 'Xóa',
        confirmColor: '#EF4444'
    });
    if (!ok) return;

    try {
        const res = await fetch(`${API}/menu/${id}`, { method: 'DELETE', headers: authHeaders(false) });
        const data = await res.json();
        if (data.success) {
            showToast('Đã xóa món', 'success');
            loadMenuItems();
        } else showToast(data.message || 'Xóa thất bại', 'error');
    } catch { showToast('Lỗi kết nối server', 'error'); }
}

window.deleteMenuItem = deleteMenuItem;

async function toggleMenuItem(id, newActive) {
    try {
        const res = await fetch(`${API}/menu/${id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ is_active: newActive })
        });
        const data = await res.json();
        if (data.success) {
            showToast(newActive ? 'Đã hiện món' : 'Đã ẩn món', 'success');
            loadMenuItems();
        } else showToast(data.message || 'Lỗi', 'error');
    } catch { showToast('Lỗi kết nối server', 'error'); }
}

window.toggleMenuItem = toggleMenuItem;

// =====================================================
// IMAGE UPLOAD HELPER
// =====================================================
async function uploadImageFor(inputId, fileInput) {
    const file = fileInput.files[0];
    if (!file) return;

    // Check size
    if (file.size > 5 * 1024 * 1024) {
        showToast('Ảnh quá lớn (tối đa 5MB)', 'error');
        fileInput.value = '';
        return;
    }

    // Check auth token
    if (!adminToken) {
        showToast('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error');
        fileInput.value = '';
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    showToast('Đang upload ảnh...', 'info');

    try {
        console.log('[Upload] Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
        const res = await fetch(`${API}/upload`, {
            method: 'POST',
            body: formData,
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error('[Upload] Server responded with', res.status, errText);
            if (res.status === 401) {
                showToast('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error');
            } else {
                showToast(`Upload thất bại (HTTP ${res.status})`, 'error');
            }
            fileInput.value = '';
            return;
        }

        const data = await res.json();
        console.log('[Upload] Response:', data);
        if (data.success && data.url) {
            $(`#${inputId}`).value = data.url;
            showImagePreview(inputId, data.url);
            showToast('Upload ảnh thành công! Nhấn "Lưu món" để lưu thay đổi.', 'success');
        } else {
            showToast(data.message || 'Upload thất bại - không nhận được URL ảnh', 'error');
        }
    } catch (error) {
        console.error('[Upload] Network error:', error);
        showToast('Lỗi kết nối server khi upload ảnh', 'error');
    }
    fileInput.value = '';
}

window.uploadImageFor = uploadImageFor;

function showImagePreview(inputId, url) {
    const previewEl = $(`#preview_${inputId}`);
    if (!previewEl) return;
    if (url) {
        previewEl.innerHTML = `<img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<span class=\\'preview-error\\'>Không tải được ảnh</span>'">`;
    } else {
        previewEl.innerHTML = '';
    }
}

// Auto-preview on input change
document.addEventListener('input', (e) => {
    if (e.target.id && e.target.id.startsWith('ct_') || e.target.id === 'menuImage') {
        const previewEl = $(`#preview_${e.target.id}`);
        if (previewEl && e.target.value) {
            clearTimeout(e.target._previewTimer);
            e.target._previewTimer = setTimeout(() => showImagePreview(e.target.id, e.target.value), 500);
        }
    }
});

// =====================================================
// CONTENT MANAGEMENT (Nội dung website)
// =====================================================
let currentContent = null;

async function loadContent() {
    try {
        const res = await fetch(`${API}/content`);
        const data = await res.json();
        if (data.success) {
            currentContent = data.data;
            fillContentForm(data.data);
        }
    } catch (error) {
        console.error('Load content error:', error);
        showToast('Không thể tải nội dung website', 'error');
    }
}

function fillContentForm(data) {
    // Video Intro
    if (data.introVideo) {
        $('#ct_videoEnabled').value = data.introVideo.enabled ? '1' : '0';
        $('#ct_videoUrl').value = data.introVideo.url || '';
        $('#ct_videoMuted').value = data.introVideo.muted === false ? '0' : '1';
        showVideoPreview(data.introVideo.url);
    }
    // Hero
    if (data.hero) {
        $('#ct_heroSubtitle').value = data.hero.subtitle || '';
        $('#ct_heroTitle').value = data.hero.title || '';
        $('#ct_heroTagline').value = data.hero.tagline || '';
        $('#ct_heroDesc').value = data.hero.description || '';
        $('#ct_heroBg').value = data.hero.backgroundImage || '';
        showImagePreview('ct_heroBg', data.hero.backgroundImage);
    }
    // About
    if (data.about) {
        $('#ct_aboutTitle').value = data.about.title || '';
        $('#ct_aboutExp').value = data.about.experience || '';
        $('#ct_aboutDesc').value = data.about.description || '';
        $('#ct_aboutImage').value = data.about.image || '';
        showImagePreview('ct_aboutImage', data.about.image);
    }
    // Contact
    if (data.contact) {
        $('#ct_address').value = data.contact.address || '';
        $('#ct_phone').value = data.contact.phone || '';
        $('#ct_email').value = data.contact.email || '';
        $('#ct_openHours').value = data.contact.openHours || '';
        $('#ct_mapUrl').value = data.contact.mapUrl || '';
    }
    // Gallery
    renderGalleryGrid(data.gallery || []);

    // Stats Counter
    if (data.stats) {
        $('#ct_statCustomers').value = data.stats.customers || 15000;
        $('#ct_statDishes').value = data.stats.dishes || 50;
        $('#ct_statYears').value = data.stats.years || 10;
        $('#ct_statReviews').value = data.stats.reviews || 4800;
    }

    // Testimonials
    if (data.testimonials) {
        currentContent.testimonials = data.testimonials;
        renderTestimonialsAdmin(data.testimonials);
    }

    // Offer Banner
    if (data.offer) {
        $('#ct_offerEnabled').value = data.offer.enabled ? '1' : '0';
        $('#ct_offerBadge').value = data.offer.badge || '';
        $('#ct_offerTitle').value = data.offer.title || '';
        $('#ct_offerDesc').value = data.offer.desc || '';
        $('#ct_offerBtn').value = data.offer.btnText || '';
    }

    // Floating Contact
    if (data.floatingContact) {
        $('#ct_floatPhone').value = data.floatingContact.phone || '';
        $('#ct_floatZalo').value = data.floatingContact.zalo || '';
        $('#ct_floatMessenger').value = data.floatingContact.messenger || '';
    }

    // Social Media Links
    if (data.socialLinks) {
        $('#ct_socialFacebook').value = data.socialLinks.facebook || '';
        $('#ct_socialInstagram').value = data.socialLinks.instagram || '';
        $('#ct_socialTiktok').value = data.socialLinks.tiktok || '';
        $('#ct_socialZalo').value = data.socialLinks.zalo || '';
    }

    // Footer Hours
    if (data.footerHours) {
        $('#ct_hoursWeekday').value = data.footerHours.weekday || '';
        $('#ct_hoursSaturday').value = data.footerHours.saturday || '';
        $('#ct_hoursSunday').value = data.footerHours.sunday || '';
    }
}

function renderGalleryGrid(images) {
    const grid = $('#galleryGrid');
    if (!images || images.length === 0) {
        grid.innerHTML = '<p class="empty-msg">Chưa có ảnh nào trong gallery. Bấm "Thêm ảnh" để bắt đầu.</p>';
        return;
    }
    grid.innerHTML = images.map((img, i) => `
        <div class="gallery-admin-item">
            <img src="${img.url || img}" alt="${escHTML(img.caption || '')}" onerror="this.src='https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=200'">
            <div class="gallery-admin-overlay">
                <input type="text" class="gallery-caption" placeholder="Chú thích..." value="${escHTML(img.caption || '')}" onchange="updateGalleryCaption(${i}, this.value)">
                <button class="gallery-remove-btn" onclick="removeGalleryImage(${i})" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `).join('');
}

async function addGalleryImage() {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { showToast('Ảnh quá lớn (tối đa 5MB)', 'error'); return; }

        const formData = new FormData();
        formData.append('image', file);
        showToast('Đang upload ảnh...', 'info');

        try {
            const res = await fetch(`${API}/upload`, { method: 'POST', body: formData, headers: { 'Authorization': `Bearer ${adminToken}` } });
            const data = await res.json();
            if (data.success) {
                if (!currentContent) currentContent = { gallery: [] };
                if (!currentContent.gallery) currentContent.gallery = [];
                currentContent.gallery.push({ url: data.url, caption: '' });
                renderGalleryGrid(currentContent.gallery);
                showToast('Đã thêm ảnh vào gallery', 'success');
            } else showToast(data.message || 'Upload thất bại', 'error');
        } catch { showToast('Lỗi upload', 'error'); }
    };
    input.click();
}

function removeGalleryImage(index) {
    if (!currentContent || !currentContent.gallery) return;
    currentContent.gallery.splice(index, 1);
    renderGalleryGrid(currentContent.gallery);
}

function updateGalleryCaption(index, caption) {
    if (!currentContent || !currentContent.gallery) return;
    if (typeof currentContent.gallery[index] === 'string') {
        currentContent.gallery[index] = { url: currentContent.gallery[index], caption };
    } else {
        currentContent.gallery[index].caption = caption;
    }
}

window.removeGalleryImage = removeGalleryImage;
window.updateGalleryCaption = updateGalleryCaption;

// =====================================================
// TESTIMONIALS ADMIN (CRUD)
// =====================================================
function renderTestimonialsAdmin(testimonials) {
    const container = $('#testimonialsAdmin');
    if (!testimonials || testimonials.length === 0) {
        container.innerHTML = '<p class="empty-msg">Chưa có đánh giá nào. Bấm "Thêm đánh giá" để bắt đầu.</p>';
        return;
    }
    container.innerHTML = testimonials.map((t, i) => {
        const starsHTML = Array.from({ length: 5 }, (_, s) =>
            `<i class="fas fa-star" style="color:${s < (t.stars || 5) ? '#D4AF37' : '#555'};font-size:0.85rem;"></i>`
        ).join('');
        return `
        <div class="testimonial-admin-item" style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:16px;margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;align-items:start;gap:12px;flex-wrap:wrap;">
                <div style="flex:1;min-width:200px;">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                        <i class="fas fa-user-circle" style="font-size:1.8rem;color:#D4AF37;"></i>
                        <div>
                            <input type="text" class="input-field" value="${escHTML(t.name || '')}" 
                                onchange="updateTestimonial(${i}, 'name', this.value)"
                                placeholder="Tên khách hàng" style="font-weight:600;padding:4px 8px;font-size:0.9rem;">
                            <input type="text" class="input-field" value="${escHTML(t.role || '')}" 
                                onchange="updateTestimonial(${i}, 'role', this.value)"
                                placeholder="Vai trò (VD: Khách du lịch)" style="padding:4px 8px;font-size:0.82rem;margin-top:4px;">
                        </div>
                    </div>
                    <textarea class="input-field" rows="2" 
                        onchange="updateTestimonial(${i}, 'text', this.value)"
                        placeholder="Nội dung đánh giá..." style="font-size:0.88rem;">${escHTML(t.text || '')}</textarea>
                    <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
                        <label style="font-size:0.8rem;font-weight:600;color:#6B7280;">Số sao:</label>
                        <select class="input-field" style="width:80px;padding:4px 8px;font-size:0.85rem;" 
                            onchange="updateTestimonial(${i}, 'stars', Number(this.value))">
                            <option value="5" ${(t.stars || 5) === 5 ? 'selected' : ''}>5 ⭐</option>
                            <option value="4" ${t.stars === 4 ? 'selected' : ''}>4 ⭐</option>
                            <option value="3" ${t.stars === 3 ? 'selected' : ''}>3 ⭐</option>
                        </select>
                        <span style="margin-left:4px;">${starsHTML}</span>
                    </div>
                </div>
                <button class="action-btn action-btn--delete" onclick="removeTestimonial(${i})" title="Xóa đánh giá" 
                    style="background:#FEE2E2;color:#991B1B;padding:8px 12px;border-radius:8px;border:none;cursor:pointer;white-space:nowrap;">
                    <i class="fas fa-trash-alt"></i> Xóa
                </button>
            </div>
        </div>`;
    }).join('');
}

function addTestimonial() {
    if (!currentContent) currentContent = {};
    if (!currentContent.testimonials) currentContent.testimonials = [];
    currentContent.testimonials.push({
        name: 'Khách hàng mới',
        role: 'Khách hàng',
        text: 'Nhà hàng rất tuyệt vời! Món ăn ngon, phục vụ chu đáo.',
        stars: 5
    });
    renderTestimonialsAdmin(currentContent.testimonials);
    showToast('Đã thêm đánh giá mới. Nhớ bấm "Lưu tất cả" để lưu.', 'info');
}

function removeTestimonial(index) {
    if (!currentContent || !currentContent.testimonials) return;
    currentContent.testimonials.splice(index, 1);
    renderTestimonialsAdmin(currentContent.testimonials);
    showToast('Đã xóa đánh giá. Nhớ bấm "Lưu tất cả" để lưu.', 'info');
}

function updateTestimonial(index, field, value) {
    if (!currentContent || !currentContent.testimonials) return;
    currentContent.testimonials[index][field] = value;
}

window.addTestimonial = addTestimonial;
window.removeTestimonial = removeTestimonial;
window.updateTestimonial = updateTestimonial;

async function saveContent() {
    const body = {
        introVideo: {
            url: $('#ct_videoUrl').value.trim(),
            enabled: $('#ct_videoEnabled').value === '1',
            muted: $('#ct_videoMuted').value === '1'
        },
        hero: {
            subtitle: $('#ct_heroSubtitle').value.trim(),
            title: $('#ct_heroTitle').value.trim(),
            tagline: $('#ct_heroTagline').value.trim(),
            description: $('#ct_heroDesc').value.trim(),
            backgroundImage: $('#ct_heroBg').value.trim()
        },
        about: {
            title: $('#ct_aboutTitle').value.trim(),
            experience: $('#ct_aboutExp').value.trim(),
            description: $('#ct_aboutDesc').value.trim(),
            image: $('#ct_aboutImage').value.trim()
        },
        contact: {
            address: $('#ct_address').value.trim(),
            phone: $('#ct_phone').value.trim(),
            email: $('#ct_email').value.trim(),
            openHours: $('#ct_openHours').value.trim(),
            mapUrl: $('#ct_mapUrl').value.trim()
        },
        gallery: currentContent ? currentContent.gallery || [] : [],
        stats: {
            customers: Number($('#ct_statCustomers').value) || 15000,
            dishes: Number($('#ct_statDishes').value) || 50,
            years: Number($('#ct_statYears').value) || 10,
            reviews: Number($('#ct_statReviews').value) || 4800
        },
        testimonials: currentContent ? currentContent.testimonials || [] : [],
        offer: {
            enabled: $('#ct_offerEnabled').value === '1',
            badge: $('#ct_offerBadge').value.trim(),
            title: $('#ct_offerTitle').value.trim(),
            desc: $('#ct_offerDesc').value.trim(),
            btnText: $('#ct_offerBtn').value.trim()
        },
        floatingContact: {
            phone: $('#ct_floatPhone').value.trim(),
            zalo: $('#ct_floatZalo').value.trim(),
            messenger: $('#ct_floatMessenger').value.trim()
        },
        socialLinks: {
            facebook: $('#ct_socialFacebook').value.trim(),
            instagram: $('#ct_socialInstagram').value.trim(),
            tiktok: $('#ct_socialTiktok').value.trim(),
            zalo: $('#ct_socialZalo').value.trim()
        },
        footerHours: {
            weekday: $('#ct_hoursWeekday').value.trim(),
            saturday: $('#ct_hoursSaturday').value.trim(),
            sunday: $('#ct_hoursSunday').value.trim()
        }
    };

    try {
        const res = await fetch(`${API}/content`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.success) {
            currentContent = data.data;
            showToast('Đã lưu nội dung website!', 'success');
        } else showToast(data.message || 'Lưu thất bại', 'error');
    } catch (error) {
        console.error('Save content error:', error);
        showToast('Lỗi kết nối server', 'error');
    }
}

// =====================================================
// FILTER EVENTS
// =====================================================
$('#filterBtn').addEventListener('click', () => {
    const date = $('#filterDate').value;
    if (date) loadReservations(date);
    else showToast('Vui lòng chọn ngày để lọc', 'info');
});

$('#clearFilterBtn').addEventListener('click', () => {
    $('#filterDate').value = '';
    loadReservations();
});

$('#refreshResBtn').addEventListener('click', () => {
    $('#filterDate').value = '';
    loadReservations();
    showToast('Đã làm mới dữ liệu', 'info');
});

$('#refreshCtBtn').addEventListener('click', () => {
    loadContacts();
    showToast('Đã làm mới dữ liệu', 'info');
});

// Menu buttons
$('#addMenuBtn').addEventListener('click', () => openMenuModal());
$('#refreshMenuBtn').addEventListener('click', () => {
    loadMenuItems();
    showToast('Đã làm mới thực đơn', 'info');
});

// Content buttons
$('#saveContentBtn').addEventListener('click', saveContent);
$('#addGalleryBtn').addEventListener('click', addGalleryImage);
$('#addTestimonialBtn').addEventListener('click', addTestimonial);

// Video upload handler
$('#videoFileInput').addEventListener('change', async function () {
    const file = this.files[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
        showToast('Video quá lớn (tối đa 100MB)', 'error');
        this.value = '';
        return;
    }

    const formData = new FormData();
    formData.append('video', file);

    const progress = $('#videoProgress');
    const fill = $('#videoProgressFill');
    const text = $('#videoProgressText');
    progress.style.display = 'flex';

    try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API}/upload-video`);

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const pct = Math.round((e.loaded / e.total) * 100);
                fill.style.width = pct + '%';
                text.textContent = pct + '%';
            }
        };

        xhr.onload = () => {
            progress.style.display = 'none';
            fill.style.width = '0%';
            const data = JSON.parse(xhr.responseText);
            if (data.success) {
                $('#ct_videoUrl').value = data.url;
                showVideoPreview(data.url);
                showToast('Upload video thành công!', 'success');
            } else {
                showToast(data.message || 'Upload thất bại', 'error');
            }
        };

        xhr.onerror = () => {
            progress.style.display = 'none';
            showToast('Lỗi upload video', 'error');
        };

        xhr.send(formData);
    } catch (error) {
        progress.style.display = 'none';
        console.error('Video upload error:', error);
        showToast('Lỗi upload video', 'error');
    }
    this.value = '';
});

function showVideoPreview(url) {
    const preview = $('#videoPreview');
    if (!url) {
        preview.innerHTML = '<p class="empty-msg">Chưa có video. Upload video để xem trước.</p>';
        return;
    }
    preview.innerHTML = `
        <video controls style="width:100%;max-height:300px;border-radius:10px;background:#000;">
            <source src="${url}" type="video/mp4">
            Trình duyệt không hỗ trợ video.
        </video>
        <button class="btn btn-sm" style="margin-top:8px;background:#FEE2E2;color:#991B1B;" onclick="removeVideo()">
            <i class="fas fa-trash-alt"></i> Xóa video
        </button>
    `;
}

function removeVideo() {
    $('#ct_videoUrl').value = '';
    showVideoPreview('');
    showToast('Đã xóa video', 'info');
}
window.removeVideo = removeVideo;

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenuModal();
});

// Close modal on overlay click
$('#menuModal').addEventListener('click', (e) => {
    if (e.target === $('#menuModal')) closeMenuModal();
});

// =====================================================
// NOTIFICATION SOUND (Thông báo đơn mới)
// =====================================================
let lastKnownPendingCount = -1;

function playNotificationSound() {
    try {
        // Use Web Audio API to generate a pleasant notification sound
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 chord
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
            gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.15 + 0.05);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.15 + 0.4);
            osc.connect(gain).connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.15);
            osc.stop(ctx.currentTime + i * 0.15 + 0.5);
        });
    } catch (e) { /* AudioContext not supported */ }
}

async function checkNewReservations() {
    try {
        const res = await fetch(`${API}/reservations`);
        const data = await res.json();
        if (data.success) {
            const pendingCount = data.data.filter(r => r.status === 'pending').length;
            if (lastKnownPendingCount >= 0 && pendingCount > lastKnownPendingCount) {
                // New pending reservation!
                playNotificationSound();
                showToast(`🔔 Có ${pendingCount - lastKnownPendingCount} đơn đặt bàn mới!`, 'info');
            }
            lastKnownPendingCount = pendingCount;
        }
    } catch (e) { /* ignore */ }
}

// =====================================================
// AUTO-REFRESH (mỗi 30 giây) + Notification check
// =====================================================
setInterval(() => {
    const activeTab = $('.nav-item.active').dataset.tab;
    if (activeTab === 'dashboard') loadDashboard();
    else if (activeTab === 'reservations') loadReservations($('#filterDate').value || undefined);
    else if (activeTab === 'contacts') loadContacts();
    else if (activeTab === 'menu-manage') loadMenuItems();

    // Always check for new reservations
    checkNewReservations();
}, 30000);

// =====================================================
// UTILITY
// =====================================================
function escHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// =====================================================
// ANALYTICS / STATISTICS
// =====================================================
async function loadAnalytics() {
    const period = $('#analyticsPeriod') ? $('#analyticsPeriod').value : '30';
    try {
        const res = await fetch(`${API}/analytics?period=${period}`);
        const result = await res.json();
        if (!result.success) {
            showToast('Lỗi tải thống kê', 'error');
            return;
        }
        const d = result.data;

        // Update stat cards
        $('#anTotalRevenue').textContent = formatPrice(d.totalRevenue);
        $('#anTotalOrders').textContent = d.ordersWithPreOrder;
        $('#anAvgOrder').textContent = formatPrice(d.avgOrderValue);
        $('#anTotalGuests').textContent = d.totalGuests;

        // Draw Revenue Chart
        drawRevenueChart(d.daily);

        // Draw Status Pie Chart
        drawStatusChart(d.statusCount);

        // Top Dishes
        renderTopDishes(d.topDishes);

        // Daily Revenue Table
        renderDailyTable(d.daily);

    } catch (error) {
        console.error('Analytics error:', error);
        showToast('Không thể tải thống kê', 'error');
    }
}

// Period filter change
document.addEventListener('DOMContentLoaded', () => {
    const periodSelect = document.getElementById('analyticsPeriod');
    if (periodSelect) {
        periodSelect.addEventListener('change', () => {
            loadAnalytics();
        });
    }
    const refreshBtn = document.getElementById('refreshAnalyticsBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadAnalytics();
            showToast('Đã làm mới thống kê', 'info');
        });
    }
});

// =====================================================
// CANVAS CHART: Revenue Bar Chart
// =====================================================
function drawRevenueChart(daily) {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Set actual pixel dimensions
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 300;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Take last 14 days max, sorted by date asc
    const data = [...daily].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);

    if (data.length === 0) {
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '14px Open Sans';
        ctx.textAlign = 'center';
        ctx.fillText('Chưa có dữ liệu', canvas.width / 2, canvas.height / 2);
        return;
    }

    const padding = { top: 30, right: 20, bottom: 60, left: 80 };
    const chartW = canvas.width - padding.left - padding.right;
    const chartH = canvas.height - padding.top - padding.bottom;

    const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
    const barWidth = Math.min(chartW / data.length * 0.6, 40);
    const gap = chartW / data.length;

    // Grid lines
    const gridSteps = 5;
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.font = '11px Open Sans';
    ctx.fillStyle = '#6B7280';
    ctx.textAlign = 'right';

    for (let i = 0; i <= gridSteps; i++) {
        const y = padding.top + (chartH / gridSteps) * i;
        const val = maxRevenue - (maxRevenue / gridSteps) * i;
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.moveTo(padding.left, y);
        ctx.lineTo(canvas.width - padding.right, y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillText(formatCompact(val), padding.left - 8, y + 4);
    }

    // Bars with gradient
    data.forEach((d, i) => {
        const x = padding.left + gap * i + (gap - barWidth) / 2;
        const barH = (d.revenue / maxRevenue) * chartH;
        const y = padding.top + chartH - barH;

        // Gradient bar
        const grad = ctx.createLinearGradient(x, y, x, y + barH);
        grad.addColorStop(0, '#D4AF37');
        grad.addColorStop(1, '#8B6914');
        ctx.fillStyle = grad;

        // Rounded top corners
        const r = Math.min(4, barWidth / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + barWidth - r, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
        ctx.lineTo(x + barWidth, y + barH);
        ctx.lineTo(x, y + barH);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.fill();

        // Value on top
        if (d.revenue > 0) {
            ctx.fillStyle = '#374151';
            ctx.font = 'bold 10px Open Sans';
            ctx.textAlign = 'center';
            ctx.fillText(formatCompact(d.revenue), x + barWidth / 2, y - 6);
        }

        // Date label
        ctx.fillStyle = '#6B7280';
        ctx.font = '10px Open Sans';
        ctx.textAlign = 'center';
        ctx.save();
        ctx.translate(x + barWidth / 2, padding.top + chartH + 14);
        ctx.rotate(-0.5);
        const label = d.date.substring(5); // MM-DD
        ctx.fillText(label, 0, 0);
        ctx.restore();
    });
}

// =====================================================
// CANVAS CHART: Status Pie Chart
// =====================================================
function drawStatusChart(statusCount) {
    const canvas = document.getElementById('statusChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 260;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const total = (statusCount.pending || 0) + (statusCount.confirmed || 0) + (statusCount.cancelled || 0);

    if (total === 0) {
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '14px Open Sans';
        ctx.textAlign = 'center';
        ctx.fillText('Chưa có dữ liệu', canvas.width / 2, canvas.height / 2);
        return;
    }

    const slices = [
        { label: 'Chờ xác nhận', value: statusCount.pending || 0, color: '#F59E0B' },
        { label: 'Đã xác nhận', value: statusCount.confirmed || 0, color: '#10B981' },
        { label: 'Đã hủy', value: statusCount.cancelled || 0, color: '#EF4444' }
    ].filter(s => s.value > 0);

    const cx = canvas.width / 2;
    const cy = 110;
    const radius = 85;
    let startAngle = -Math.PI / 2;

    slices.forEach(slice => {
        const sliceAngle = (slice.value / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = slice.color;
        ctx.fill();

        // White border between slices
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label on slice
        const midAngle = startAngle + sliceAngle / 2;
        const labelR = radius * 0.65;
        const lx = cx + Math.cos(midAngle) * labelR;
        const ly = cy + Math.sin(midAngle) * labelR;
        const pct = Math.round((slice.value / total) * 100);
        if (pct >= 5) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 13px Open Sans';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(pct + '%', lx, ly);
        }

        startAngle = endAngle;
    });

    // White center circle (donut)
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Total in center
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 22px Open Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total, cx, cy - 6);
    ctx.font = '11px Open Sans';
    ctx.fillStyle = '#6B7280';
    ctx.fillText('đơn', cx, cy + 12);

    // Legend below
    const legendEl = document.getElementById('statusLegend');
    if (legendEl) {
        legendEl.innerHTML = slices.map(s => `
            <span class="chart-legend-item">
                <span class="legend-dot" style="background:${s.color}"></span>
                ${s.label}: <strong>${s.value}</strong>
            </span>
        `).join('');
    }
}

// =====================================================
// TOP DISHES LIST
// =====================================================
function renderTopDishes(dishes) {
    const container = document.getElementById('topDishesList');
    if (!container) return;

    if (!dishes || dishes.length === 0) {
        container.innerHTML = '<p class="empty-msg">Chưa có dữ liệu đặt món</p>';
        return;
    }

    const maxQty = dishes[0].qty;
    container.innerHTML = dishes.map((dish, i) => {
        const pct = Math.round((dish.qty / maxQty) * 100);
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
        return `
        <div class="top-dish-item">
            <div class="top-dish-rank">${medal}</div>
            <div class="top-dish-info">
                <div class="top-dish-name">${escHTML(dish.name)}</div>
                <div class="top-dish-bar">
                    <div class="top-dish-fill" style="width:${pct}%"></div>
                </div>
            </div>
            <div class="top-dish-stats">
                <span class="top-dish-qty">${dish.qty} phần</span>
                <span class="top-dish-rev">${formatPrice(dish.revenue)}</span>
            </div>
        </div>`;
    }).join('');
}

// =====================================================
// DAILY REVENUE TABLE
// =====================================================
function renderDailyTable(daily) {
    const tbody = document.getElementById('dailyRevenueTable');
    if (!tbody) return;

    if (!daily || daily.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-msg">Chưa có dữ liệu</td></tr>';
        return;
    }

    // Show max 30 rows
    tbody.innerHTML = daily.slice(0, 30).map(d => `
        <tr>
            <td style="font-weight:600;">${formatDate(d.date)}</td>
            <td>${d.orders} đơn</td>
            <td>${d.guests} người</td>
            <td style="font-weight:700;color:${d.revenue > 0 ? '#10B981' : '#6B7280'};">${d.revenue > 0 ? formatPrice(d.revenue) : '—'}</td>
        </tr>
    `).join('');
}

// Format compact number: 1500000 -> 1.5M, 500000 -> 500K
function formatCompact(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'tr';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
}

// =====================================================
// INIT
// =====================================================
function initDashboard() {
    loadDashboard();
    checkDbStatus();
    console.log('🏮 Admin Dashboard loaded');
}

// Kiểm tra trạng thái Database
async function checkDbStatus() {
    try {
        const res = await fetch(`${API}/health?_t=${Date.now()}`);
        const data = await res.json();
        console.log('[Health Check]', data);
        const dbConnected = data.database && (data.database.connected || data.database.mongoConnected);
        if (data.database && !dbConnected) {
            showToast('⚠️ Database chưa kết nối! Dữ liệu sẽ KHÔNG được lưu. Kiểm tra cấu hình database.', 'error');
            console.error('[DB Status] Database NOT connected:', data.database);
        } else if (dbConnected) {
            console.log('[DB Status] Database connected OK ✅');
        }
    } catch (e) {
        console.error('[Health Check] Error:', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!isAuthenticated) {
        showLoginOverlay();
    } else {
        initDashboard();
    }
});
