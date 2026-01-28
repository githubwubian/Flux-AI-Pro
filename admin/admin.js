// =================================================================================
//  項目: Flux AI Pro - Admin System
//  模塊: Admin Authentication & Data Access
//  版本: 1.0.0
// =================================================================================

import { hashPassword, verifyPassword, generateToken, verifyToken } from './auth-utils.js';

class AdminSystem {
    constructor(env) {
        this.env = env;
        this.db = env.FLUX_DB;
    }

    // ==================== 管理員認證 ====================
    
    /**
     * 管理員登入
     */
    async login(username, password, ipAddress) {
        try {
            // 查詢管理員
            const result = await this.db.prepare(
                'SELECT * FROM admin_users WHERE username = ? AND is_active = 1'
            ).bind(username).first();

            if (!result) {
                // 記錄失敗登入嘗試
                await this.logOperation(null, 'login_failed', null, null, 
                    { username, reason: 'User not found or inactive' }, ipAddress);
                return { success: false, error: '用戶名或密碼錯誤' };
            }

            // 檢查登入嘗試次數
            if (result.login_attempts >= 5) {
                await this.logOperation(result.id, result.username, 'login_blocked', null, null, 
                    { reason: 'Too many failed attempts' }, ipAddress);
                return { success: false, error: '帳號已被鎖定，請聯繫管理員' };
            }

            // 驗證密碼
            const isValid = await verifyPassword(password, result.password_hash);
            
            if (!isValid) {
                // 增加失敗次數
                await this.db.prepare(
                    'UPDATE admin_users SET login_attempts = login_attempts + 1 WHERE id = ?'
                ).bind(result.id).run();
                
                await this.logOperation(result.id, result.username, 'login_failed', null, null,
                    { username, reason: 'Invalid password' }, ipAddress);
                return { success: false, error: '用戶名或密碼錯誤' };
            }

            // 重置登入次數並更新最後登入時間
            await this.db.prepare(
                'UPDATE admin_users SET login_attempts = 0, last_login = CURRENT_TIMESTAMP WHERE id = ?'
            ).bind(result.id).run();

            // 生成 JWT token
            const token = await generateToken({
                userId: result.id,
                username: result.username,
                role: result.role
            }, this.env.JWT_SECRET || 'default-secret-change-in-production');

            // 記錄成功登入
            await this.logOperation(result.id, result.username, 'login', null, null, null, ipAddress);

            return {
                success: true,
                token,
                user: {
                    id: result.id,
                    username: result.username,
                    email: result.email,
                    role: result.role,
                    last_login: result.last_login
                }
            };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: '登入失敗，請稍後再試' };
        }
    }

    /**
     * 驗證 JWT token
     */
    async verifyToken(token) {
        try {
            const payload = await verifyToken(token, this.env.JWT_SECRET || 'default-secret-change-in-production');
            return { valid: true, user: payload };
        } catch (error) {
            return { valid: false, error: 'Token 無效或已過期' };
        }
    }

    /**
     * 記錄操作日誌
     */
    async logOperation(adminId, username, action, resourceType, resourceId, details, ipAddress, userAgent = '') {
        try {
            await this.db.prepare(`
                INSERT INTO operation_logs (admin_id, username, action, resource_type, resource_id, details, ip_address, user_agent)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
                adminId,
                username,
                action,
                resourceType,
                resourceId,
                details ? JSON.stringify(details) : null,
                ipAddress,
                userAgent
            ).run();
        } catch (error) {
            console.error('Failed to log operation:', error);
        }
    }

    // ==================== 儀表板數據 ====================

    /**
     * 獲取儀表板統計數據
     */
    async getDashboardStats() {
        try {
            // 今日統計
            const todayStats = await this.db.prepare('SELECT * FROM today_stats').first();
            
            // 本週統計
            const weekStats = await this.db.prepare(`
                SELECT 
                    COUNT(*) as total_requests,
                    COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_requests,
                    COUNT(DISTINCT ip_address) as unique_ips,
                    AVG(response_time_ms) as avg_response_time
                FROM user_requests
                WHERE created_at >= datetime('now', '-7 days')
            `).first();

            // 熱門模型
            const popularModels = await this.db.prepare('SELECT * FROM popular_models').all();
            
            // 最近 24 小時請求趨勢
            const hourlyTrend = await this.db.prepare(`
                SELECT 
                    strftime('%Y-%m-%d %H:00', created_at) as hour,
                    COUNT(*) as count
                FROM user_requests
                WHERE created_at >= datetime('now', '-24 hours')
                GROUP BY hour
                ORDER BY hour
            `).all();

            return {
                today: todayStats || { total_requests: 0, successful_requests: 0, failed_requests: 0, unique_ips: 0 },
                week: weekStats || { total_requests: 0, successful_requests: 0, unique_ips: 0 },
                models: popularModels.results || [],
                hourlyTrend: hourlyTrend.results || []
            };
        } catch (error) {
            console.error('Failed to get dashboard stats:', error);
            throw error;
        }
    }

    // ==================== 操作日誌管理 ====================

    /**
     * 獲取操作日誌列表
     */
    async getOperationLogs(limit = 50, offset = 0) {
        try {
            const logs = await this.db.prepare(`
                SELECT 
                    l.*,
                    u.username as admin_username
                FROM operation_logs l
                LEFT JOIN admin_users u ON l.admin_id = u.id
                ORDER BY l.created_at DESC
                LIMIT ? OFFSET ?
            `).bind(limit, offset).all();

            const total = await this.db.prepare('SELECT COUNT(*) as count FROM operation_logs').first();

            return {
                logs: logs.results || [],
                total: total?.count || 0,
                limit,
                offset
            };
        } catch (error) {
            console.error('Failed to get operation logs:', error);
            throw error;
        }
    }

    // ==================== 用戶請求日誌 ====================

    /**
     * 獲取用戶請求日誌
     */
    async getUserRequests(limit = 50, offset = 0, filters = {}) {
        try {
            let query = 'SELECT * FROM user_requests WHERE 1=1';
            const params = [];

            if (filters.ip) {
                query += ' AND ip_address = ?';
                params.push(filters.ip);
            }
            if (filters.status) {
                query += ' AND status = ?';
                params.push(filters.status);
            }
            if (filters.provider) {
                query += ' AND provider = ?';
                params.push(filters.provider);
            }
            if (filters.model) {
                query += ' AND model = ?';
                params.push(filters.model);
            }
            if (filters.startDate) {
                query += ' AND created_at >= ?';
                params.push(filters.startDate);
            }
            if (filters.endDate) {
                query += ' AND created_at <= ?';
                params.push(filters.endDate);
            }

            const countQuery = query.replace('*', 'COUNT(*) as count');
            const total = await this.db.prepare(countQuery).bind(...params).first();

            query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);

            const requests = await this.db.prepare(query).bind(...params).all();

            return {
                requests: requests.results || [],
                total: total?.count || 0,
                limit,
                offset
            };
        } catch (error) {
            console.error('Failed to get user requests:', error);
            throw error;
        }
    }

    // ==================== IP 黑白名單管理 ====================

    /**
     * 獲取 IP 黑白名單
     */
    async getIpList(type = null) {
        try {
            let query = `
                SELECT 
                    i.*,
                    u.username as created_by_username
                FROM ip_lists i
                LEFT JOIN admin_users u ON i.created_by = u.id
                WHERE i.is_active = 1
            `;
            const params = [];

            if (type) {
                query += ' AND i.type = ?';
                params.push(type);
            }

            const dateCondition = type === 'blacklist' 
                ? ' OR (expires_at IS NOT NULL AND expires_at < CURRENT_TIMESTAMP)'
                : '';
            
            query += ' AND (expires_at IS NULL' + dateCondition + ')';
            query += ' ORDER BY i.created_at DESC';

            const result = await this.db.prepare(query).bind(...params).all();
            return result.results || [];
        } catch (error) {
            console.error('Failed to get IP list:', error);
            throw error;
        }
    }

    /**
     * 添加 IP 到黑/白名單
     */
    async addIpToAdminList(ipAddress, type, reason, createdBy, expiresAt = null, notes = '') {
        try {
            const result = await this.db.prepare(`
                INSERT INTO ip_lists (ip_address, type, reason, created_by, expires_at, notes)
                VALUES (?, ?, ?, ?, ?, ?)
            `).bind(ipAddress, type, reason, createdBy, expiresAt, notes).run();

            return { success: true, id: result.meta.last_row_id };
        } catch (error) {
            if (error.message.includes('UNIQUE')) {
                return { success: false, error: '此 IP 已存在於列表中' };
            }
            throw error;
        }
    }

    /**
     * 刪除 IP 黑白名單
     */
    async removeIpFromAdminList(id, removedBy) {
        try {
            await this.db.prepare('UPDATE ip_lists SET is_active = 0 WHERE id = ?').bind(id).run();
            return { success: true };
        } catch (error) {
            console.error('Failed to remove IP:', error);
            throw error;
        }
    }

    // ==================== 系統配置管理 ====================

    /**
     * 獲取系統配置
     */
    async getSystemConfig() {
        try {
            const configs = await this.db.prepare('SELECT * FROM system_config ORDER BY config_key').all();
            const configMap = {};
            
            configs.results?.forEach(config => {
                let value = config.config_value;
                
                // 根據類型轉換值
                switch (config.value_type) {
                    case 'number':
                        value = parseFloat(value);
                        break;
                    case 'boolean':
                        value = value === 'true';
                        break;
                    case 'json':
                        try {
                            value = JSON.parse(value);
                        } catch (e) {
                            value = value;
                        }
                        break;
                }
                
                configMap[config.config_key] = {
                    value,
                    type: config.value_type,
                    description: config.description,
                    updatedAt: config.updated_at
                };
            });

            return configMap;
        } catch (error) {
            console.error('Failed to get system config:', error);
            throw error;
        }
    }

    /**
     * 更新系統配置
     */
    async updateSystemConfig(configKey, configValue, updatedBy) {
        try {
            const currentConfig = await this.db.prepare(
                'SELECT * FROM system_config WHERE config_key = ?'
            ).bind(configKey).first();

            if (!currentConfig) {
                return { success: false, error: '配置不存在' };
            }

            const valueMap = { ...configValue };
            
            let valueToSave;
            switch (currentConfig.value_type) {
                case 'number':
                    valueToSave = valueMap.value?.toString();
                    break;
                case 'boolean':
                    valueToSave = valueMap.value ? 'true' : 'false';
                    break;
                case 'json':
                    valueToSave = JSON.stringify(valueMap.value);
                    break;
                default:
                    valueToSave = valueMap.value?.toString();
            }

            await this.db.prepare(`
                UPDATE system_config 
                SET config_value = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
                WHERE config_key = ?
            `).bind(valueToSave, updatedBy, configKey).run();

            return { success: true };
        } catch (error) {
            console.error('Failed to update system config:', error);
            throw error;
        }
    }

    // ==================== 管理員管理 ====================

    /**
     * 獲取所有管理員
     */
    async getAdmins() {
        try {
            const result = await this.db.prepare(`
                SELECT id, username, email, role, created_at, last_login, is_active, login_attempts
                FROM admin_users
                ORDER BY created_at DESC
            `).all();

            return result.results || [];
        } catch (error) {
            console.error('Failed to get admins:', error);
            throw error;
        }
    }

    /**
     * 創建管理員
     */
    async createAdmin(username, password, email, role, createdBy) {
        try {
            // 檢查用戶名是否已存在
            const existing = await this.db.prepare(
                'SELECT id FROM admin_users WHERE username = ? OR email = ?'
            ).bind(username, email).first();

            if (existing) {
                return { success: false, error: '用戶名或郵箱已存在' };
            }

            // 哈希密碼
            const passwordHash = await hashPassword(password);

            const result = await this.db.prepare(`
                INSERT INTO admin_users (username, password_hash, email, role)
                VALUES (?, ?, ?, ?)
            `).bind(username, passwordHash, email, role).run();

            // 記錄操作
            await this.logOperation(createdBy, username, 'create_admin', 'admin_user', 
                result.meta.last_row_id.toString(), { role });

            return { success: true, id: result.meta.last_row_id };
        } catch (error) {
            console.error('Failed to create admin:', error);
            throw error;
        }
    }

    /**
     * 更新管理員密碼
     */
    async updateAdminPassword(adminId, newPassword, updatedBy) {
        try {
            const passwordHash = await hashPassword(password);
            await this.db.prepare(
                'UPDATE admin_users SET password_hash = ? WHERE id = ?'
            ).bind(passwordHash, adminId).run();

            const admin = await this.db.prepare('SELECT username FROM admin_users WHERE id = ?')
                .bind(adminId).first();

            await this.logOperation(updatedBy, admin?.username, 'change_password', 'admin_user', 
                adminId.toString());

            return { success: true };
        } catch (error) {
            console.error('Failed to update admin password:', error);
            throw error;
        }
    }

    /**
     * 刪除管理員
     */
    async deleteAdmin(adminId, deletedBy) {
        try {
            const admin = await this.db.prepare('SELECT * FROM admin_users WHERE id = ?')
                .bind(adminId).first();

            if (!admin) {
                return { success: false, error: '管理員不存在' };
            }

            // 不允許刪除最後一個管理員
            const adminCount = await this.db.prepare('SELECT COUNT(*) as count FROM admin_users')
                .first();
            if (adminCount?.count <= 1) {
                return { success: false, error: '不能刪除最後一個管理員' };
            }

            await this.db.prepare('DELETE FROM admin_users WHERE id = ?').bind(adminId).run();

            await this.logOperation(deletedBy, admin.username, 'delete_admin', 'admin_user', 
                adminId.toString());

            return { success: true };
        } catch (error) {
            console.error('Failed to delete admin:', error);
            throw error;
        }
    }
}

export default AdminSystem;