# 🎨 Flux AI Pro - NanoBanana Edition

![Version](https://img.shields.io/badge/Version-11.5.0-8B5CF6?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Cloudflare%20Workers-orange?style=flat-square)
![Engine](https://img.shields.io/badge/Engine-Multi%20Provider-blue?style=flat-square)

**Flux AI Pro - NanoBanana Edition** 是一個部署在 Cloudflare Workers 上的單檔式 AI 繪圖應用。支援多供應商架構（Pollinations.ai 與 Infip/Ghostbot），提供無伺服器、低延遲的圖像生成服務。

本專案包含兩套獨立介面：**完整專業版 UI** 與 **NanoBanana Pro 極簡版 UI**。

---

## 🔥 v11.5.0 更新亮點

- **🌌 深空紫主題**：主介面升級為「深空紫」主題，採用玻璃擬態 (Glassmorphism) 設計，視覺更具現代感與科技感。
- **🤖 FLUX.2 Klein 4B 模型**：新增強大的 Klein 模型 (4B 參數)，提供更細膩的畫質與細節表現。
- **✨ 自動 Ultra 畫質**：全域實裝「最佳品質策略」，所有生成請求自動強制使用 **Ultra (超高清)** 畫質模式。
- **🔗 頁腳優化**：主頁新增包含友情鏈接與 ShowMeBestAI 推薦徽章的單行頁腳。
- **🎨 風格系統擴展**：擴展風格預設系統，支援更多藝術風格與分類管理。
- **⚡ 性能優化**：新增懶加載、請求隊列管理、緩存機制等性能優化功能。
- **💾 IndexedDB 永久存儲**：歷史記錄使用 IndexedDB 永久存儲，支援導出與清空功能。
- **📤 參考圖像上傳**：支援上傳參考圖像進行圖生圖 (Img2Img) 生成。
- **🔞 NSFW 模式支援**：Infip 供應商支援 NSFW 模式（需自備 API Key）。
- **🖼️ 批量生成**：Infip 供應商支援批量生成 1-4 張圖片。
- **👥 真實人數統計**：整合 `whos.amung.us` 第三方統計服務，實時顯示線上活躍人數。

---

## ✨ 功能特色

### 1. 雙重操作介面

#### 主介面 (`/`) - 完整專業版
- 深空紫玻璃擬態主題設計
- 支援所有模型與供應商
- 數十種藝術風格預設
- 歷史紀錄管理 (IndexedDB 永久存儲)
- 進階參數微調 (Steps, Guidance, Seed)
- 參考圖像上傳 (Img2Img)
- 批量生成功能
- NSFW 模式切換

#### Nano 介面 (`/nano`) - 極簡版
- 類似 App 的沉浸式體驗
- 每小時 5 張免費配額
- 燈箱效果與圖片下載
- 剩餘額度顯示
- 隨機靈感骰子
- 180 秒冷卻時間

### 2. 多模型與供應商支援

#### Pollinations.ai (免費)
| 模型 ID | 名稱 | 說明 |
|---------|------|------|
| `klein` | FLUX.2 Klein 4B | 高品質 Flux 2 模型 (推薦) |
| `klein-large` | FLUX.2 Klein 9B 🌟 | 9B 參數進階版 |
| `flux` | Flux 標準版 | 快速且高質量 |
| `turbo` | Flux Turbo ⚡ | 超快速生成 |
| `gptimage` | GPT-Image 🎨 | 通用 GPT 圖像生成 |
| `gptimage-large` | GPT-Image Large 🌟 | 高質量 GPT 生成 |
| `zimage` | Z-Image Turbo ⚡ | 快速 6B 參數 |
| `kontext` | Kontext 🎨 | 支援圖生圖 |
| `seedream` | SeeDream 🌈 | 夢幻風格 |
| `seedream-pro` | SeeDream Pro 🌟 | 高品質夢幻 |

#### Ghostbot / Infip (需 API Key)
| 模型 ID | 名稱 | 說明 |
|---------|------|------|
| `img4` | Imagen 4 (Google) 🌟 | Google 最新高品質模型 |
| `flux-schnell` | Flux Schnell ⚡ | Flux 極速版 |
| `sdxl` | SDXL Stable Diffusion | Stable Diffusion XL |
| `lucid-origin` | Lucid Origin | Lucid 風格模型 |

**Infip 專屬功能：**
- NSFW 模式（需自備 Key）
- 批量生成 (Batch Size: 1-4)
- 30 秒冷卻時間

### 3. 進階圖像處理

- **風格預設**：內建 40+ 種風格（動漫、寫實、油畫、賽博龐克、浮世繪等）
- **參考圖 (Img2Img)**：支援輸入圖片 URL 或上傳圖片進行參考生成
- **畫布比例**：預設多種社群媒體常用比例
  - 方形 1024x1024 / 1536x1536 / 2048x2048
  - 豎屏 9:16 HD / 3:4 / 4:5
  - 橫屏 16:9 HD / 4:3 / 3:2
  - 電影感 21:9
- **自動優化**：內建提示詞增強與自動翻譯功能
- **畫質模式**：Economy / Standard / Ultra HD

### 4. 性能優化

- **懶加載**：使用 IntersectionObserver 實現圖片懶加載
- **請求隊列**：支援並發請求管理，最多同時處理 2 個請求
- **緩存機制**：內建圖片與請求緩存，自動清理過期數據
- **防抖與節流**：優化用戶交互響應

---

## 🛠️ 部署教學

本專案基於 Cloudflare Workers，無需購買伺服器。

### 前置要求
- Cloudflare 帳號
- Node.js 環境
- Wrangler CLI (`npm install -g wrangler`)

### 1. 下載專案
```bash
git clone https://github.com/kinai9661/Flux-AI-Pro.git
cd Flux-AI-Pro
```

### 2. 配置 Wrangler
創建 `wrangler.toml`：

```toml
name = "flux-ai-pro"
main = "worker.js"
compatibility_date = "2024-01-01"

# 綁定 KV 用於 Nano 模式的限流記錄
[[kv_namespaces]]
binding = "FLUX_KV"
id = "你的_KV_NAMESPACE_ID"
```

**獲取 KV ID：**
```bash
wrangler kv:namespace create "FLUX_KV"
```

### 3. 設定環境變數 (Secrets)

**Pollinations API Key (可選)：**
```bash
wrangler secret put POLLINATIONS_API_KEY
```

**Infip API Key (可選)：**
```bash
wrangler secret put INFIP_API_KEY
```

### 4. 部署
```bash
wrangler deploy
```

---

## ⚙️ API 接口

### 生成圖像
**Endpoint:** `POST /_internal/generate`

**Request Body:**
```json
{
  "prompt": "a cyberpunk cat",
  "negative_prompt": "nsfw, ugly, text",
  "model": "klein",
  "width": 1024,
  "height": 1024,
  "style": "anime",
  "quality_mode": "ultra",
  "seed": -1,
  "auto_optimize": true,
  "auto_hd": true,
  "reference_images": ["https://example.com/image.jpg"],
  "provider": "pollinations",
  "api_key": "your-api-key",
  "nsfw": false,
  "n": 1
}
```

**Response:**
- 成功：返回圖片二進制數據
- 失敗：返回 JSON 錯誤信息

### 上傳圖片
**Endpoint:** `POST /api/upload`

**Request:** `multipart/form-data` with `fileToUpload`

**Response:**
```json
{
  "url": "https://catbox.moe/..."
}
```

### 健康檢查
**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "version": "11.5.0",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "styles_count": 40,
  "api_auth": {
    "enabled": true,
    "method": "header",
    "has_token": true
  }
}
```

---

## 📊 限流機制

### Nano 模式限流
- **限制**：每小時 5 張圖片
- **冷卻**：每次生成後 180 秒冷卻
- **存儲**：使用 KV 存儲限流記錄

### 主介面冷卻
- **Pollinations**：60 秒冷卻
- **Infip**：30 秒冷卻

---

## 🤝 友情鏈接

- [Pollinations.ai](https://pollinations.ai) - 免費 AI 圖像生成服務
- [Infip.pro](https://infip.pro) - Ghostbot Web API
- [ShowMeBest.AI](https://showmebest.ai) - AI 工具推薦平台

---

## 📄 License

MIT License

---

## 🙏 致謝

感謝以下開源項目與服務的支持：
- [Pollinations.ai](https://pollinations.ai) - 免費 AI 圖像生成 API
- [Cloudflare Workers](https://workers.cloudflare.com) - 無伺服器計算平台
- [whos.amung.us](https://whos.amung.us) - 線上人數統計服務
