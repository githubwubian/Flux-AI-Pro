// =================================================================================
//  項目: Flux AI Pro - Admin Panel Frontend
//  功能: 管理後台前端邏輯
//  版本: 1.0.0
// =================================================================================

// 全局狀態
const state = {
    token: null,
    user: null,
    currentPage: 'dashboard'
};

// API 基礎 URL
const API_BASE = window.location.pathname.startsWith('/admin') ? '/api/admin' : '../api/admin';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initNavigation();
    initLogin();
    initDashboard();
    initLogs();
    initRequests();
    initIpList();
    initConfig();
    initAdmins();
});

// ==================== 身份驗證 ====================

function initAuth() {
    const savedToken = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');
    
    if (savedToken && savedUser) {
        state.token = savedToken;
        state.user = JSON.parse(savedUser);
        showAdminPanel();
    } else {
        showLoginPage();
    }
}

function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('adminPage').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminPage').style.display = 'block';
    
    // 更新用戶信息
    document.getElementById('currentUsername').textContent = state.user?.username || '-';
    document.getElementById('currentUserRole').textContent = state.user?.role || '-';
    
    // 加載當前頁面數據
    loadPage(state.currentPage);
}

function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');
        
        loginBtn.disabled = true;
        loginBtn.textContent = '登入中...';
        
        try {
            const response = await fetchWithAuth('/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            }, false); // 不需要 token
            
            const data = await response.json();
            
            if (data.success) {
                state.token = data.token;
                state.user = data.user;
                
                localStorage.setItem('admin_token', data.token);
                localStorage.setItem('admin_user', JSON.stringify(data.user));
                
                showAdminPanel();
            } else {
                showError(data.error || '登入失敗');
            }
        } catch (error) {
            showError('登入失敗，請稍後再試');
            console.error('Login error:', error);
        }
        
        loginBtn.disabled = false;
        loginBtn.textContent = '登入';
    });
    
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        state.token = null;
        state.user = null;
        
        showLoginPage();
    });
}

function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    
    setTimeout(() => {
        errorEl.style.display = 'none';
    }, 3000);
}

// ==================== 導航 ====================

function initNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            
            // 更新活動狀態
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // 切換頁面
            document.querySelectorAll('.admin-content').forEach(p => p.classList.remove('active'));
            document.getElementById(page + 'Page').classList.add('active');
            
            state.currentPage = page;
            loadPage(page);
        });
    });
}

function loadPage(page) {
    switch (page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'logs':
            loadLogs();
            break;
        case 'requests':
            loadRequests();
            break;
        case 'iplist':
            loadIpList();
            break;
        case 'config':
            loadConfig();
            break;
        case 'admins':
            loadAdmins();
            break;
    }
}

// ==================== API 請求 ====================

async function fetchWithAuth(endpoint, options = {}) {
    const url = API_BASE + endpoint;
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    
    if (state.token) {
        headers['Authorization'] = `Bearer ${state.token}`;
    }
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    // 檢查是否需要重新登入
    if (response.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        state.token = null;
        state.user = null;
        showLoginPage();
        throw new Error('未授權');
    }
    
    return response;
}

// ==================== 儀表板 ====================

function initDashboard() {
    loadDashboard();
}

async function loadDashboard() {
    try {
        const response = await fetchWithAuth('/dashboard');
        const data = await response.json();
        
        if (data.success) {
            renderDashboardStats(data.data);
            renderPopularModels(data.data.models);
        }
    } catch (error) {
        console.error('Failed to load dashboard:', error);
    }
}

function renderDashboardStats(stats) {
    const container = document.getElementById('statsGrid');
    
    container.innerHTML = `
        <div class="stat-card success">
            <div class="stat-icon">✅</div>
            <div class="stat-value">${formatNumber(stats.today?.successful_requests || 0)}</div>
            <div class="stat-label">今日成功請求</div>
        </div>
        <div class="stat-card error">
            <div class="stat-icon">❌</div>
            <div class="stat-value">${formatNumber(stats.today?.failed_requests || 0)}</div>
            <div class="stat-label">今日失敗請求</div>
        </div>
        <div class="stat-card info">
            <div class="stat-icon">👥</div>
            <div class="stat-value">${formatNumber(stats.today?.unique_ips || 0)}</div>
            <div class="stat-label">今日獨立 IP</div>
        </div>
        <div class="stat-card warning">
            <div class="stat-icon">🖼️</div>
            <div class="stat-value">${formatNumber(stats.today?.images_generated || 0)}</div>
            <div class="stat-label">今日生成圖片</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-value">${formatNumber(stats.week?.total_requests || 0)}</div>
            <div class="stat-label">本週總請求</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-value">${formatTime(stats.today?.avg_response_time || 0)}</div>
            <div class="stat-label">平均響應時間</div>
        </div>
    `;
}

function renderPopularModels(models) {
    const table = document.getElementById('popularModelsTable');
    
    if (!models || models.length === 0) {
        table.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #9ca3af;">暫無數據</td></tr>';
        return;
    }
    
    table.innerHTML = models.map(model => `
        <tr>
            <td>${model.model}</td>
            <td>${formatNumber(model.usage_count)}</td>
            <td>${formatTime(model.avg_response_time)}</td>
        </tr>
    `).join('');
}

// ==================== 操作日誌 ====================

function initLogs() {
    document.getElementById('refreshLogsBtn').addEventListener('click', loadLogs);
}

async function loadLogs() {
    try {
        const response = await fetchWithAuth('/logs?limit=50');
        const data = await response.json();
        
        if (data.success) {
            renderLogs(data.data.logs);
        }
    } catch (error) {
        console.error('Failed to load logs:', error);
    }
}

function renderLogs(logs) {
    const table = document.getElementById('logsTable');
    
    if (!logs || logs.length === 0) {
        table.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #9ca3af;">暫無日誌記錄</td></tr>';
        return;
    }
    
    table.innerHTML = logs.map(log => `
        <tr>
            <td>${formatDateTime(log.created_at)}</td>
            <td>${log.username || '-'}</td>
            <td>${log.action}</td>
            <td>${log.resource_type || '-'}</td>
            <td>${log.ip_address || '-'}</td>
        </tr>
    `).join('');
}

// ==================== 用戶請求 ====================

function initRequests() {
    document.getElementById('refreshRequestsBtn').addEventListener('click', loadRequests);
}

async function loadRequests() {
    try {
        const response = await fetchWithAuth('/requests?limit=50');
        const data = await response.json();
        
        if (data.success) {
            renderRequests(data.data.requests);
        }
    } catch (error) {
        console.error('Failed to load requests:', error);
    }
}

function renderRequests(requests) {
    const table = document.getElementById('requestsTable');
    
    if (!requests || requests.length === 0) {
        table.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #9ca3af;">暫無請求記錄</td></tr>';
        return;
    }
    
    table.innerHTML = requests.map(req => `
        <tr>
            <td>${formatDateTime(req.created_at)}</td>
            <td>${req.ip_address}</td>
            <td>${req.provider}</td>
            <td>${req.model}</td>
            <td><span class="status-badge status-${getStatusClass(req.status)}">${formatStatus(req.status)}</span></td>
            <td>${formatTime(req.response_time_ms)}</td>
        </tr>
    `).join('');
}

// ==================== IP 管理 ====================

function initIpList() {
    document.getElementById('addBlacklistBtn').addEventListener('click', () => showIpModal('blacklist'));
    document.getElementById('addWhitelistBtn').addEventListener('click', () => showIpModal('whitelist'));
}

async function loadIpList() {
    try {
        const [blacklistResponse, whitelistResponse] = await Promise.all([
            fetchWithAuth('/ip-list?type=blacklist'),
            fetchWithAuth('/ip-list?type=whitelist')
        ]);
        
        const blacklistData = await blacklistResponse.json();
        const whitelistData = await whitelistResponse.json();
        
        if (blacklistData.success) {
            renderIpList('blacklist', blacklistData.data);
        }
        if (whitelistData.success) {
            renderIpList('whitelist', whitelistData.data);
        }
    } catch (error) {
        console.error('Failed to load IP list:', error);
    }
}

function renderIpList(type, list) {
    const table = document.getElementById(type + 'Table');
    
    if (!list || list.length === 0) {
        table.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #9ca3af;">暫無${type === 'blacklist' ? '黑名單' : '白名單'}</td></tr>`;
        return;
    }
    
    table.innerHTML = list.map(item => `
        <tr>
            <td>${item.ip_address}</td>
            <td>${item.reason || '-'}</td>
            <td>${formatDateTime(item.created_at)}</td>
            <td>${item.expires_at ? formatDateTime(item.expires_at) : '永不'}</td>
            <td>
                <button class="action-btn action-btn-danger" onclick="removeIp('${item.id}', '${type}')">刪除</button>
            </td>
        </tr>
    `).join('');
}

function showIpModal(type) {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <h2 style="margin-bottom: 20px;">添加${type === 'blacklist' ? '黑名單' : '白名單'}</h2>
        <form id="ipForm">
            <div class="form-group">
                <label>IP 地址</label>
                <input type="text" id="ipAddress" required placeholder="例如: 192.168.1.1 或 192.168.1.0/24">
            </div>
            <div class="form-group">
                <label>原因</label>
                <input type="text" id="ipReason" placeholder="請輸入原因">
            </div>
            <div class="form-group">
                <label>過期時間（可選）</label>
                <input type="datetime-local" id="ipExpires">
            </div>
            <div class="form-group">
                <label>備註</label>
                <input type="text" id="ipNotes" placeholder="備註信息">
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button type="submit" class="action-btn action-btn-primary" style="flex: 1;">提交</button>
                <button type="button" class="action-btn action-btn-secondary" onclick="closeModal()" style="flex: 1;">取消</button>
            </div>
        </form>
    `;
    
    document.getElementById('ipForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const ipAddress = document.getElementById('ipAddress').value;
        const reason = document.getElementById('ipReason').value;
        const expiresAt = document.getElementById('ipExpires').value || null;
        const notes = document.getElementById('ipNotes').value;
        
        try {
            const response = await fetchWithAuth('/ip-list', {
                method: 'POST',
                body: JSON.stringify({
                    ip_address: ipAddress,
                    type: type,
                    reason: reason,
                    expires_at: expiresAt,
                    notes: notes
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                closeModal();
                loadIpList();
            } else {
                alert(data.error || '添加失敗');
            }
        } catch (error) {
            console.error('Failed to add IP:', error);
            alert('添加失敗');
        }
    });
    
    modalOverlay.style.display = 'flex';
}

async function removeIp(id, type) {
    if (!confirm(`確定要從${type === 'blacklist' ? '黑名單' : '白名單'}中刪除此 IP 嗎？`)) {
        return;
    }
    
    try {
        const response = await fetchWithAuth(`/ip-list/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadIpList();
        } else {
            alert(data.error || '刪除失敗');
        }
    } catch (error) {
        console.error('Failed to remove IP:', error);
        alert('刪除失敗');
    }
}

// ==================== 系統配置 ====================

function initConfig() {
    loadConfig();
}

async function loadConfig() {
    try {
        const response = await fetchWithAuth('/config');
        const data = await response.json();
        
        if (data.success) {
            renderConfig(data.data);
        }
    } catch (error) {
        console.error('Failed to load config:', error);
    }
}

function renderConfig(config) {
    const container = document.getElementById('configGrid');
    
    const configLabels = {
        rate_limit_per_hour: '每小時請求限制',
        rate_limit_enabled: '啟用限流',
        nano_cooldown_seconds: 'Nano 版冷卻時間（秒）',
        max_image_width: '最大圖片寬度',
        max_image_height: '最大圖片高度',
        allowed_providers: '允許的提供商',
        default_provider: '默認提供商',
        enable_nsfw_filter: '啟用 NSFW 過濾'
    };
    
    container.innerHTML = Object.entries(config).map(([key, item]) => `
        <div class="config-item">
            <div class="config-item-header">
                <h4>${configLabels[key] || key}</h4>
                <span>${item.type}</span>
            </div>
            <div class="config-description">${item.description || ''}</div>
            <div class="form-group">
                ${renderConfigInput(key, item)}
            </div>
            <button class="config-save-btn" onclick="saveConfig('${key}')">保存</button>
        </div>
    `).join('');
}

function renderConfigInput(key, item) {
    if (item.type === 'boolean') {
        return `
            <select class="config-input" id="config-${key}">
                <option value="true" ${item.value ? 'selected' : ''}>啟用</option>
                <option value="false" ${!item.value ? 'selected' : ''}>禁用</option>
            </select>
        `;
    } else if (item.type === 'number') {
        return `
            <input type="number" class="config-input" id="config-${key}" value="${item.value}" />
        `;
    } else if (item.type === 'json') {
        return `
            <textarea class="config-input" id="config-${key}" rows="3">${JSON.stringify(item.value, null, 2)}</textarea>
        `;
    } else {
        return `
            <input type="text" class="config-input" id="config-${key}" value="${item.value}" />
        `;
    }
}

async function saveConfig(key) {
    const input = document.getElementById(`config-${key}`);
    let value = input.value;
    
    // 根據類型轉換值
    const configItem = await getConfigItem(key);
    if (configItem.type === 'boolean') {
        value = value === 'true';
    } else if (configItem.type === 'number') {
        value = parseFloat(value);
    } else if (configItem.type === 'json') {
        try {
            value = JSON.parse(value);
        } catch (e) {
            alert('無效的 JSON 格式');
            return;
        }
    }
    
    try {
        const response = await fetchWithAuth('/config', {
            method: 'PATCH',
            body: JSON.stringify({
                config_key: key,
                config_value: value
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('保存成功');
            loadConfig();
        } else {
            alert(data.error || '保存失敗');
        }
    } catch (error) {
        console.error('Failed to save config:', error);
        alert('保存失敗');
    }
}

async function getConfigItem(key) {
    const response = await fetchWithAuth('/config');
    const data = await response.json();
    return data.data[key];
}

// ==================== 管理員管理 ====================

function initAdmins() {
    document.getElementById('addAdminBtn').addEventListener('click', showAddAdminModal);
}

async function loadAdmins() {
    try {
        const response = await fetchWithAuth('/admins');
        const data = await response.json();
        
        if (data.success) {
            renderAdmins(data.data);
        }
    } catch (error) {
        console.error('Failed to load admins:', error);
    }
}

function renderAdmins(admins) {
    const table = document.getElementById('adminsTable');
    
    if (!admins || admins.length === 0) {
        table.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #9ca3af;">暫無管理員</td></tr>';
        return;
    }
    
    table.innerHTML = admins.map(admin => `
        <tr>
            <td>${admin.username}</td>
            <td>${admin.email}</td>
            <td><span class="status-badge ${admin.role === 'super_admin' ? 'status-success' : 'status-info'}">${admin.role}</span></td>
            <td>${formatDateTime(admin.created_at)}</td>
            <td>${admin.last_login ? formatDateTime(admin.last_login) : '從未'}</td>
            <td>
                <button class="action-btn action-btn-secondary" onclick="showChangePasswordModal(${admin.id})">修改密碼</button>
                ${admin.id !== state.user.id ? `<button class="action-btn action-btn-danger" onclick="deleteAdmin(${admin.id})">刪除</button>` : ''}
            </td>
        </tr>
    `).join('');
}

function showAddAdminModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <h2 style="margin-bottom: 20px;">添加管理員</h2>
        <form id="adminForm">
            <div class="form-group">
                <label>用戶名</label>
                <input type="text" id="newUsername" required placeholder="請輸入用戶名">
            </div>
            <div class="form-group">
                <label>密碼</label>
                <input type="password" id="newPassword" required minlength="6" placeholder="至少 6 位">
            </div>
            <div class="form-group">
                <label>郵箱</label>
                <input type="email" id="newEmail" required placeholder="請輸入郵箱">
            </div>
            <div class="form-group">
                <label>角色</label>
                <select id="newRole" class="config-input">
                    <option value="admin">管理員</option>
                    <option value="super_admin">超級管理員</option>
                </select>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button type="submit" class="action-btn action-btn-primary" style="flex: 1;">創建</button>
                <button type="button" class="action-btn action-btn-secondary" onclick="closeModal()" style="flex: 1;">取消</button>
            </div>
        </form>
    `;
    
    document.getElementById('adminForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('newUsername').value;
        const password = document.getElementById('newPassword').value;
        const email = document.getElementById('newEmail').value;
        const role = document.getElementById('newRole').value;
        
        try {
            const response = await fetchWithAuth('/admins', {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    password,
                    email,
                    role
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                closeModal();
                loadAdmins();
            } else {
                alert(data.error || '創建失敗');
            }
        } catch (error) {
            console.error('Failed to create admin:', error);
            alert('創建失敗');
        }
    });
    
    modalOverlay.style.display = 'flex';
}

function showChangePasswordModal(adminId) {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <h2 style="margin-bottom: 20px;">修改密碼</h2>
        <form id="passwordForm">
            <div class="form-group">
                <label>新密碼</label>
                <input type="password" id="newPassword" required minlength="6" placeholder="至少 6 位">
            </div>
            <div class="form-group">
                <label>確認密碼</label>
                <input type="password" id="confirmPassword" required minlength="6" placeholder="請再次輸入新密碼">
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button type="submit" class="action-btn action-btn-primary" style="flex: 1;">保存</button>
                <button type="button" class="action-btn action-btn-secondary" onclick="closeModal()" style="flex: 1;">取消</button>
            </div>
        </form>
    `;
    
    document.getElementById('passwordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            alert('兩次輸入的密碼不一致');
            return;
        }
        
        try {
            const response = await fetchWithAuth(`/admins/${adminId}/password`, {
                method: 'PATCH',
                body: JSON.stringify({ password: newPassword })
            });
            
            const data = await response.json();
            
            if (data.success) {
                closeModal();
                alert('密碼修改成功');
            } else {
                alert(data.error || '修改失敗');
            }
        } catch (error) {
            console.error('Failed to change password:', error);
            alert('修改失敗');
        }
    });
    
    modalOverlay.style.display = 'flex';
}

async function deleteAdmin(adminId) {
    if (!confirm('確定要刪除此管理員嗎？此操作不可恢復。')) {
        return;
    }
    
    try {
        const response = await fetchWithAuth(`/admins/${adminId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadAdmins();
        } else {
            alert(data.error || '刪除失敗');
        }
    } catch (error) {
        console.error('Failed to delete admin:', error);
        alert('刪除失敗');
    }
}

// ==================== 工具函數 ====================

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatTime(ms) {
    if (!ms) return '-';
    if (ms < 1000) {
        return ms + 'ms';
    }
    return (ms / 1000).toFixed(2) + 's';
}

function formatDateTime(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusClass(status) {
    switch (status) {
        case 'success':
            return 'success';
        case 'failed':
            return 'failed';
        case 'rate_limited':
            return 'rate-limited';
        default:
            return 'info';
    }
}

function formatStatus(status) {
    switch (status) {
        case 'success':
            return '成功';
        case 'failed':
            return '失敗';
        case 'rate_limited':
            return '限流';
        default:
            return status;
    }
}