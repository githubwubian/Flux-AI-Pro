# Flux AI Pro - 後台管理系統部署指南

## 📋 目錄

1. [系統概述](#系統概述)
2. [前置要求](#前置要求)
3. [部署步驟](#部署步驟)
4. [數據庫設置](#數據庫設置)
5. [首次登入](#首次登入)
6. [功能說明](#功能說明)
7. [安全建議](#安全建議)

---

## 系統概述

Flux AI Pro 後台管理系統提供完整的 AI 圖像生成服務管理功能，包括：

### ✨ 核心功能
- 🔐 管理員登入驗證（JWT Token）
- 📊 實時儀表板統計
- 📝 操作日誌記錄
- 🚫 IP 黑白名單管理
- ⚙️ 系統配置管理
- 👥 管理員權限管理
- 📈 用戶請求日誌分析

### 🏗️ 技術架構
```
┌─────────────────────────────────────┐
│   Cloudflare Pages (Admin UI)       │
│   - React/Vue 管理介面              │
│   - 圖表儀表板                      │
└─────────────────────────────────────┘
              ↓ HTTPS
┌─────────────────────────────────────┐
│   Cloudflare Workers (API)          │
│   - /admin/* 路由保護               │
│   - JWT 驗證中間件                  │
│   - D1 數據存取                    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   D1 Database                       │
│   - admin_users 表                  │
│   - operation_logs 表               │
│   - request_metrics 表              │
│   - user_requests 表                │
│   - ip_lists 表                     │
│   - system_config 表                │
└─────────────────────────────────────┘
```

---

## 前置要求

### 必需工具
```bash
# 安裝 Node.js (v18+)
node --version

# 安裝 Wrangler CLI
npm install -g wrangler

# 登入 Cloudflare
wrangler login
```

### Cloudflare 資源
- Cloudflare Workers 免費帳號
- D1 數據庫
- KV 存儲

---

## 部署步驟

### 1️⃣ 創建 D1 數據庫

```bash
# 創建 D1 數據庫
wrangler d1 create flux_ai_pro_db

# 記錄返回的 database_id
# 例如: database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 2️⃣ 初始化數據庫架構

```bash
# 執行 SQL 腳本創建表結構
wrangler d1 execute flux_ai_pro_db --file=./schema.sql --remote

# 驗證表創建
wrangler d1 execute flux_ai_pro_db --remote --command="SELECT name FROM sqlite_master WHERE type='table'"
```

### 3️⃣ 創建 KV 命名空間

```bash
# 創建 KV
wrangler kv:namespace create FLUX_KV

# 記錄返回的 namespace id
```

### 4️⃣ 更新 wrangler.toml 配置

```toml
name = "flux-ai-pro"
main = "worker.js"
compatibility_date = "2024-01-01"

# KV 命名空間綁定
[[kv_namespaces]]
binding = "FLUX_KV"
id = "your-kv-namespace-id-here"
preview_id = "your-preview-kv-namespace-id-here"

# D1 數據庫綁定
[[d1_databases]]
binding = "FLUX_DB"
database_name = "flux_ai_pro_db"
database_id = "your-d1-database-id-here"

# 環境變量
[vars]
PROJECT_NAME = "Flux-AI-Pro"
PROJECT_VERSION = "11.8.0"
# ⚠️ 重要：修改為安全的隨機密鑰
JWT_SECRET = "change-this-to-a-secure-random-secret-key-in-production"

# 定時任務 - 每小時清理過期 IP 列表
[[triggers]]
crons = ["0 * * * *"]
```

### 5️⃣ 設置環境變量

```bash
# 設置 JWT 密鑰（生產環境必須修改！）
wrangler secret put JWT_SECRET
# 輸入安全的隨機字符串，例如：
# openssl rand -base64 32

# 可選：設置 Pollinations API Key
wrangler secret put POLLINATIONS_API_KEY

# 可選：設置 Infip API Key
wrangler secret put INFIP_API_KEY
```

### 6️⃣ 部署 Worker

```bash
# 部署到生產環境
wrangler deploy

# 部署到測試環境
wrangler deploy --env preview
```

### 7️⃣ 驗證部署

```bash
# 檢查 Worker 狀態
wrangler tail

# 訪問後台登入頁面
# https://your-worker-subdomain.workers.dev/admin
```

---

## 數據庫設置

### 初始化默認管理員帳號

執行 [`schema.sql`](schema.sql:1) 後，系統會創建以下默認帳號：

| 屬性 | 值 |
|------|-----|
| 用戶名 | `admin` |
| 密碼 | `admin123` |
| 郵箱 | `admin@fluxai.pro` |
| 角色 | `super_admin` |

### ⚠️ 安全警告：首次登入後請立即修改密碼！

```sql
-- 修改默認密碼的 SQL（在 D1 控制台執行）
UPDATE admin_users 
SET password_hash = '$newHashedPassword' 
WHERE username = 'admin';
```

### 數據庫表結構

| 表名 | 說明 |
|------|------|
| `admin_users` | 管理員帳號 |
| `operation_logs` | 操作日誌 |
| `request_metrics` | 每日請求指標 |
| `user_requests` | 用戶請求詳情 |
| `ip_lists` | IP 黑白名單 |
| `system_config` | 系統配置 |

---

## 首次登入

### 訪問後台

1. 打開瀏覽器訪問：`https://your-worker.workers.dev/admin`
2. 輸入默認憑證：
   - 用戶名：`admin`
   - 密碼：`admin123`
3. 登入成功後立即修改密碼！

### 修改密碼步驟

1. 點擊側邊欄「管理員」
2. 找到要修改的管理員帳號
3. 點擊「修改密碼」按鈕
4. 輸入新密碼（至少 6 位）
5. 保存修改

---

## 功能說明

### 📊 儀表板

**顯示內容：**
- 今日請求統計（成功/失敗）
- 獨立 IP 訪問數
- 生成圖片數量
- 本週總請求數
- 平均響應時間
- 熱門模型使用排行

### 📝 操作日誌

**記錄內容：**
- 登入/登出
- 配置修改
- IP 黑白名單操作
- 管理員管理操作
- 時間戳和 IP 地址

### 🚫 IP 管理

**功能：**
- 黑名單：封禁惡意 IP
- 白名單：僅允許特定 IP 訪問
- 支持過期時間設置
- 支持添加備註

### ⚙️ 系統配置

**可配置項：**

| 配置項 | 默認值 | 說明 |
|--------|--------|------|
| `rate_limit_per_hour` | 5 | 每小時請求限制數 |
| `rate_limit_enabled` | true | 是否啟用限流 |
| `nano_cooldown_seconds` | 180 | Nano 版冷卻時間（秒） |
| `max_image_width` | 2048 | 最大圖片寬度 |
| `max_image_height` | 2048 | 最大圖片高度 |
| `enable_nsfw_filter` | true | 是否啟用 NSFW 過濾 |

### 👥 管理員管理

**支持操作：**
- 添加新管理員
- 修改管理員密碼
- 刪除管理員（不能刪除最後一個）
- 角色管理（admin / super_admin）

---

## 安全建議

### 🔒 生產環境必做

1. **修改默認密碼**
   ```
   首次登入後立即修改 admin 帳號密碼
   ```

2. **設置安全 JWT Secret**
   ```bash
   # 使用 OpenSSL 生成安全密鑰
   openssl rand -base64 32
   wrangler secret put JWT_SECRET
   ```

3. **啟用 HTTPS**
   - Cloudflare Workers 自動提供 HTTPS
   - 確保自定義域名也使用 HTTPS

4. **限制訪問 IP**
   - 將後台訪問 IP 加入白名單
   - 或使用 IP 限制規則

5. **定期備份數據**
   ```bash
   # 導出 D1 數據
   wrangler d1 execute flux_ai_pro_db --remote --command="SELECT * FROM admin_users"
   wrangler d1 execute flux_ai_pro_db --remote --command="SELECT * FROM system_config"
   ```

### 🛡️ 安全最佳實踐

| 項目 | 建議 |
|------|------|
| 密碼長度 | 至少 12 位字符 |
| 密碼複雜度 | 包含大小寫、數字、特殊字符 |
| 登入嘗試限制 | 5 次失敗後鎖定 |
| Token 過期時間 | 7 天（可配置） |
| 定期密碼更換 | 每 90 天 |
| 多因素認證 | 考慮添加（未來版本） |

### 📊 監控與日誌

```bash
# 實時查看 Worker 日誌
wrangler tail

# 查看特定日誌級別
wrangler tail --format=pretty

# 導出日誌
wrangler tail --format=json > logs.json
```

---

## 故障排除

### 常見問題

**Q: 無法登入管理後台**
```
A: 檢查：
1. D1 數據庫是否正確綁定
2. admin_users 表是否創建成功
3. 密碼是否正確 (默認: admin123)
4. JWT_SECRET 環境變量是否設置
```

**Q: API 請求返回 401 錯誤**
```
A: 檢查：
1. Token 是否有效
2. Token 是否過期
3. JWT_SECRET 是否與創建時一致
```

**Q: 操作日誌未記錄**
```
A: 檢查：
1. D1 數據庫連接是否正常
2. operation_logs 表是否存在
3. 檢查 Worker 日誌查看錯誤信息
```

**Q: IP 黑白名單不生效**
```
A: 檢查：
1. is_active 欄位是否為 1
2. expires_at 是否未過期
3. IP 地址格式是否正確
4. 檢查 handleInternalGenerate 中的檢查邏輯
```

---

## 下一步

### 部署後建議
1. ✅ 完成首次登入並修改密碼
2. ✅ 設置自定義域名
3. ✅ 配置 SMTP 通知（日後發展）
4. ✅ 設置監控和警報
5. ✅ 定期備份 D1 數據

### 功能擴展建議
- 添加用戶管理功能
- 實現支付系統集成
- 添加 AI 內容審核
- 部署分析報表
- 實現多租戶支持

---

## 支援

- 📧 郵件：admin@fluxai.pro
- 🌐 項目主頁：https://github.com/kinai9661/Flux-AI-Pro
- 📖 文檔：https://github.com/kinai9661/Flux-AI-Pro/wiki

---

**版本歷史：**
- v11.8.0 - 完整後台管理系統
- v11.7.0 - 多語言擴展
- v11.6.0 - AI 提示詞生成器

---

© 2024 Flux AI Pro. All rights reserved.