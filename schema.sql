-- =================================================================================
--  項目: Flux AI Pro - Admin Database Schema
--  數據庫: Cloudflare D1
--  版本: 1.0.0
-- =================================================================================

-- 管理員帳號表
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'admin',  -- admin, super_admin
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT 1,
    login_attempts INTEGER DEFAULT 0
);

-- 操作日誌表
CREATE TABLE IF NOT EXISTS operation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER,
    username TEXT,
    action TEXT NOT NULL,           -- login, logout, update_config, ban_user, etc.
    resource_type TEXT,             -- config, user, setting
    resource_id TEXT,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id)
);

-- 請求指標表（每天聚合）
CREATE TABLE IF NOT EXISTS request_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,      -- YYYY-MM-DD
    total_requests INTEGER DEFAULT 0,
    successful_requests INTEGER DEFAULT 0,
    failed_requests INTEGER DEFAULT 0,
    unique_ips INTEGER DEFAULT 0,
    total_images_generated INTEGER DEFAULT 0,
    model_usage TEXT,               -- JSON: {"nanobanana-pro": 123, "flux": 456}
    provider_usage TEXT,            -- JSON: {"pollinations": 500, "infip": 100}
    avg_response_time REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 用戶請求日誌（詳細記錄）
CREATE TABLE IF NOT EXISTS user_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT NOT NULL,
    user_agent TEXT,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    prompt TEXT,
    width INTEGER,
    height INTEGER,
    style TEXT,
    seed INTEGER,
    status TEXT,                    -- success, failed, rate_limited
    error_message TEXT,
    response_time_ms INTEGER,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- IP 黑白名單表
CREATE TABLE IF NOT EXISTS ip_lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,             -- whitelist, blacklist
    reason TEXT,
    notes TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,            -- NULL 表示永遠
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- 系統配置表
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config_key TEXT UNIQUE NOT NULL,
    config_value TEXT,
    value_type TEXT DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    updated_by INTEGER,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES admin_users(id)
);

-- 創建索引以提高查詢性能
CREATE INDEX IF NOT EXISTS idx_operation_logs_admin ON operation_logs(admin_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_operation_logs_created ON operation_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_requests_ip ON user_requests(ip_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_requests_date ON user_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_request_metrics_date ON request_metrics(date DESC);

-- 插入默認管理員帳號（用戶名: admin, 密碼: admin123）
-- 密碼已使用 bcrypt 哈希，請在部署後立即修改
INSERT OR IGNORE INTO admin_users (username, password_hash, email, role)
VALUES ('admin', '$2b$10$YourHashedPasswordHere', 'admin@fluxai.pro', 'super_admin');

-- 插入默認系統配置
INSERT OR IGNORE INTO system_config (config_key, config_value, value_type, description) VALUES
('rate_limit_per_hour', '5', 'number', '每 IP 每小時請求限制數'),
('rate_limit_enabled', 'true', 'boolean', '是否啟用限流'),
('nano_cooldown_seconds', '180', 'number', 'Nano 版冷卻時間（秒）'),
('max_image_width', '2048', 'number', '最大圖片寬度'),
('max_image_height', '2048', 'number', '最大圖片高度'),
('allowed_providers', '["pollinations", "infip"]', 'json', '允許的 API 提供商'),
('default_provider', 'pollinations', 'string', '默認 API 提供商'),
('enable_nsfw_filter', 'true', 'boolean', '是否啟用 NSFW 過濾');

-- 創建視圖：今日統計
CREATE VIEW IF NOT EXISTS today_stats AS
SELECT 
    COUNT(*) as total_requests,
    COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_requests,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_requests,
    COUNT(DISTINCT ip_address) as unique_ips,
    AVG(response_time_ms) as avg_response_time,
    COUNT(CASE WHEN image_url IS NOT NULL THEN 1 END) as images_generated
FROM user_requests
WHERE DATE(created_at) = DATE('now');

-- 創建視圖：熱門模型
CREATE VIEW IF NOT EXISTS popular_models AS
SELECT 
    model,
    COUNT(*) as usage_count,
    ROUND(AVG(response_time_ms), 2) as avg_response_time
FROM user_requests
WHERE status = 'success'
GROUP BY model
ORDER BY usage_count DESC
LIMIT 10;