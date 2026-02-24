# 🎨 Flux AI Pro - NanoBanana Edition

![Version](https://img.shields.io/badge/Version-11.16.0-8B5CF6?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Cloudflare%20Workers-orange?style=flat-square)
![Engine](https://img.shields.io/badge/Engine-Multi%20Provider-blue?style=flat-square)
![I18N](https://img.shields.io/badge/I18N-5%20Languages-green?style=flat-square)
![Models](https://img.shields.io/badge/Models-40%2B-purple?style=flat-square)

**Flux AI Pro - NanoBanana Edition** 是一個基於 Cloudflare Workers 構建的高性能、單文件 AI 圖像生成解決方案。它整合了 Pollinations.ai、Infip/Ghostbot、Aqua Server、Kinai API、Airforce API、Nonpon API 和 Kaai API 等頂級 AI 供應商，提供無伺服器、極速且功能豐富的創作體驗。

---

## 📑 目錄

- [🌍 English Introduction](#-english-introduction)
- [🚀 Key Features](#-key-features)
- [🔥 v11.16.0 更新亮點](#-v11160-更新亮點-release-highlights)
- [✨ 核心功能特色](#-核心功能特色)
- [🗂️ 專案結構](#️-專案結構)
- [🔧 核心技術架構](#-核心技術架構)
- [🛠️ 快速部署](#️-快速部署-deployment)
- [📊 限流與冷卻](#-限流與冷卻-rate-limiting)
- [🌐 API 端點](#-api-端點)
- [🤝 合作與致謝](#-合作與致謝-credits)
- [📄 授權協議](#-授權協議-license)

---

## 🌍 English Introduction

**Flux AI Pro** 專為追求速度、品質和靈活性的創作者設計。透過利用 Cloudflare 邊緣網絡的強大功能，它提供無縫的介面來生成高品質 AI 藝術，無需複雜的伺服器設置。

### 🚀 Key Features

- **雙重介面設計**：
  - **專業版 UI**：完整控制 Steps、Guidance 和 Seed 等參數。
  - **NanoBanana Pro**：簡化、手機友好的「一鍵」生成體驗，使用 Gemini 3 Pro Image Preview 模型。
- **多供應商架構**：無縫切換 Pollinations.ai（免費）、Infip/Ghostbot（專業版）、Aqua Server、Kinai API、Airforce API、Nonpon API 和 Kaai API。
- **全球語言支援**：原生支援 **英文、繁體中文、日文、韓文和阿拉伯文**。
- **智慧語言偵測**：自動遵循您的系統/瀏覽器語言設置。
- **完整 RTL 支援**：為從右到左語言（阿拉伯語）提供專用佈局和文字方向。
- **AI 提示詞生成器**：由 Pollinations Vision API 驅動，將簡單想法轉化為專業提示詞。
- **預設超高清**：內建優化策略，確保每張圖像都以最大品質生成。
- **永久本地歷史記錄**：使用 IndexedDB 本地存儲您的創作，支援匯出/匯入功能。
- **介面語言跟蹤**：所有 UI 元素（生成進度、按鈕、狀態消息）完全支持 5 種語言。

---

## 🔥 v11.16.0 更新亮點 (Release Highlights)

### 🎨 Nano Pro UI 大幅升級
- **功能區塊重組**：將控制面板重組為 4 個區塊（核心輸入、尺寸與風格、進階設定、操作區域），提升操作效率。
- **可折疊進階設定**：進階參數（Seed、Negative Prompt、Steps/Guidance/Quality）可折疊收納，介面更簡潔。

### ✨ 互動體驗增強
- **多狀態載入動畫**：載入時顯示「🎨 正在創作...」、「✨ 添加細節...」、「🖼️ 生成圖像...」、「⏳ 即將完成...」四種狀態循環切換。
- **比例預覽**：懸停比例選項時，在主舞台顯示比例預覽框，即時查看畫布尺寸。
- **風格按鈕懸停預覽**：懸停風格快捷按鈕時，顯示風格描述提示框。
- **歷史記錄改進**：縮圖懸停放大、刪除/下載操作按鈕、拖曳排序功能。

### 🌍 多語言支援
- 完整支援繁體中文、英文、日文、韓文、阿拉伯語
- 所有語言均包含視頻生成翻譯

### 💾 本地歷史記錄
- 使用 IndexedDB 儲存生成歷史
- 點擊可重新載入圖像

### 🤖 AI 提示詞生成器
- 使用 Pollinations Vision API 生成專業提示詞

### 📊 API 端點
- 提供完整的 RESTful API 端點供外部呼叫

### 🔧 供應商優化
- **Airforce API**：更新端點為 `https://api.airforce/v1/images/generations`，改進 JSON 響應處理和錯誤處理。
- **Nonpon API**：新增 Nonpon API 供應商，使用 Gemini 3 Pro Image Preview 模型。
- **Kaai API**：新增 Kaai API 供應商，支援 DALL-E 3、GPT Image 系列模型。

### 🆕 新功能
- **Gemini 3 Pro 參數控制**：Nano Pro 頁面新增 Steps、Guidance、Quality Mode 參數控制。
- **2K/4K 輸出支持**：Nano Pro 頁面支持 2K (2048x2048) 和 4K (4096x4096) 輸出。
- **風格快捷按鈕**：Nano Pro 頁面新增 10 個常用風格快捷按鈕。
- **每分鐘配額系統**：Nano Pro 頁面改為每分鐘 3 次免費配額。
- **歷史記錄本地化**：Nano Pro 頁面歷史記錄僅在本地顯示，不再同步到主頁 IndexedDB。

---

## ✨ 核心功能特色

### 1. 雙重操作介面 (Dual UI)

| 介面 | 路徑 | 特點 | 適用場景 |
|------|------|------|----------|
| **專業版主介面** | `/` | 完整參數控制，支援所有供應商 | 專業創作者 |
| **Nano Pro** | `/nano` | 極簡設計，Gemini 3 Pro 專用 | 快速獲取靈感 |

> **注意**：Nonpon API 僅在 Nano Pro 頁面可用，主介面不支援此供應商。

### 2. 智慧語言管理 (Smart I18N)

- **自動偵測**：根據 `navigator.language` 自動切換，並記憶用戶的手動選擇。
- **RTL 支援**：阿拉伯語模式下，介面元素自動鏡像翻轉，符合母語用戶習慣。
- **完整語言覆蓋**：所有 5 種語言（zh、en、ja、ko、ar）均包含完整的視頻生成翻譯。
- **介面語言跟蹤**：生成進度、按鈕文本、狀態消息、錯誤提示等所有 UI 元素均支持多語言。

### 3. 多供應商模型庫 (Multi-Model Library)

#### 🎨 Pollinations.ai（免費）

| 模型 | 描述 | 最大尺寸 |
|------|------|----------|
| **Flux 2 Dev** 🌟 | Flux 2 開發者版本 - 高品質圖像生成 | 2048x2048 |
| **NanoBanana** 🍌 | NanoBanana 高品質模型 | 2048x2048 |
| **SeeDream** 🌈 | 夢幻般的圖像生成 | 2048x2048 |
| **Flux Schnell** ⚡ | 快速且高質量的圖像生成 | 2048x2048 |
| **Z-Image** ⚡ | 快速 6B 參數圖像生成 (Alpha) | 2048x2048 |
| **FLUX.2 Klein 4B** | Advanced Flux 2 model | 2048x2048 |
| **FLUX.2 Klein 9B** 🌟 | Advanced Flux 2 Large model - 9B parameters | 2048x2048 |

#### 🔥 Infip/Ghostbot（專業版）

| 模型 | 描述 | 模式 | 最大尺寸 |
|------|------|------|----------|
| **Imagen 4** 🌟 | Google 最新高品質繪圖模型 | 直接 | 1792x1792 |
| **Imagen 3** | Google Imagen 3 模型 | 直接 | 1024x1024 |
| **Flux Schnell** ⚡ | Flux 極速版 | 直接 | 1024x1024 |
| **Lucid Origin** | Lucid 風格模型 | 直接 | 1024x1024 |
| **Phoenix** 🔥 | Phoenix 圖像生成模型 | 直接 | 1024x1024 |
| **SDXL** | Stable Diffusion XL | 直接 | 1024x1024 |
| **SDXL Lite** ⚡ | SDXL 輕量版 | 直接 | 1024x1024 |
| **Z-Image Turbo** ⚡ | Z-Image 快速版 | 輪詢 | 1024x1024 |
| **Nano Banana** 🍌 | Nano Banana Img2Img 模型 | 輪詢 | 1024x1024 |
| **NB Pro** 🌟 | NB Pro 高品質模型 | 輪詢 | 1024x1024 |
| **Qwen Image** 🎨 | 通義千問圖像模型 | 輪詢 | 1024x1024 |

**特色功能**：
- 更強的併發處理能力
- NSFW 模式支援
- **Img2Img 支援**（Nano Banana、NB Pro）
- **異步輪詢模式**（Z-Image Turbo、Nano Banana、NB Pro、Qwen Image）

#### 💧 Aqua Server

| 模型 | 描述 | 模式 |
|------|------|------|
| **Flux 2** ⚡ | Flux 2 Generation | 直接 |
| **Z-Image** | Z-Image Model | 直接 |
| **Imagen 4** | Google Imagen 4 | 輪詢 |
| **NanoBanana** 🍌 | NanoBanana Img2Img | 輪詢 |

**特色功能**：Img2Img 功能（nanobanana 支援參考圖片上傳）

#### 🌟 Kinai API

| 模型 | 描述 | 最大尺寸 |
|------|------|----------|
| **GLM Image** 🎨 | 智譜 GLM 圖像生成模型 | 2048x2048 |

**特色功能**：NSFW 模式支援、批量生成（最多 4 張）

#### ✈️ Airforce API（排隊系統）

| 模型 | 描述 | 最大尺寸 |
|------|------|----------|
| **Plutogen O1** 🌟 | Plutogen O1 高品質圖像生成模型 | 2048x2048 |
| **Z-Image** ⚡ | 快速 6B 參數圖像生成 | 2048x2048 |
| **Imagen 4** 🌟 | Google 最新高品質繪圖模型 | 2048x2048 |
| **Flux 2 Pro** 🌟 | Flux 2 Pro 高品質模型 | 2048x2048 |
| **Flux 2 Flex** ⚡ | Flux 2 Flex 靈活模型 | 2048x2048 |
| **GPT Image 1.5** 🎨 | GPT Image 1.5 圖像生成模型 | 2048x2048 |
| **Flux 2 Klein 4B** | Advanced Flux 2 model - 4B parameters | 2048x2048 |
| **Flux 2 Klein 9B** 🌟 | Advanced Flux 2 Large model - 9B parameters | 2048x2048 |
| **SeeDream 4.5** 🌈 | 夢幻般的圖像生成 v4.5 | 2048x2048 |

**特色功能**：排隊系統、並發控制、實時隊列狀態顯示

#### 🍌 Nonpon API（Nano Pro 專用）

| 模型 | 描述 | 最大尺寸 |
|------|------|----------|
| **Gemini 3 Pro Image Preview** 🌟 | Google Gemini 3 Pro 高品質圖像生成模型 | 4096x4096 |

**特色功能**：2K/4K 輸出支持、Steps/Guidance/Quality Mode 參數控制、風格快捷按鈕、每分鐘 3 次免費配額

#### 🎨 Kaai API（OpenAI 相容）

| 模型 | 描述 | 最大尺寸 |
|------|------|----------|
| **DALL-E 3 HD** 🌟 | DALL-E 3 高清版本 - 最高品質圖像生成 | 2048x2048 |
| **GPT Image 1.5** 🎨 | GPT Image 1.5 - 最新圖像生成模型 | 2048x2048 |
| **GPT Image 1** 🖼️ | GPT Image 1 - OpenAI 圖像生成模型 | 2048x2048 |
| **DALL-E 3** ✨ | DALL-E 3 - 高品質圖像生成 | 2048x2048 |
| **DALL-E 2** ⚡ | DALL-E 2 - 快速圖像生成 | 1024x1024 |

**特色功能**：OpenAI 相容 API、批量生成（最多 4 張）

### 4. 風格系統

- **核心風格**：127 種預設風格
- **分類**：13 個類別

| 分類 | 包含風格 |
|------|----------|
| 基礎 | 無風格 |
| 插畫動畫 | 動漫風格、吉卜力 |
| 漫畫風格 | 日本漫畫、彩色日漫、美式漫畫、韓國網漫、Q版漫畫 |
| 黑白單色 | 黑白、素描、水墨畫、剪影、炭筆畫 |
| 寫實照片 | 寫實照片 |
| 繪畫風格 | 油畫、水彩畫 |
| 藝術流派 | 印象派、抽象派、立體主義、超現實主義、普普藝術 |
| 視覺風格 | 霓虹燈、復古、蒸汽朋克、極簡主義、蒸氣波 |
| 數位風格 | 像素藝術、低多邊形、3D渲染、漸變、故障藝術 |
| 傳統藝術 | 浮世繪、彩繪玻璃、剪紙藝術 |
| 美學風格 | 哥特風格、新藝術 |
| 科幻 | 賽博朋克 |
| 奇幻 | 奇幻風格 |

### 5. 預設尺寸配置

| 類型 | 預設名稱 | 尺寸 |
|------|----------|------|
| **方形** | square-1k | 1024x1024 |
| | square-1.5k | 1536x1536 |
| | square-2k | 2048x2048 |
| | square-4k | 4096x4096 |
| **豎屏 9:16** | portrait-9-16-hd | 1080x1920 |
| | portrait-9-16-2k | 2160x3840 |
| | portrait-9-16-4k | 4320x7680 |
| **橫屏 16:9** | landscape-16-9-hd | 1920x1080 |
| | landscape-16-9-2k | 3840x2160 |
| | landscape-16-9-4k | 7680x4320 |
| **社交媒體** | instagram-square | 1080x1080 |
| **桌布** | wallpaper-fhd | 1920x1080 |
| | wallpaper-2k | 2560x1440 |
| | wallpaper-4k | 3840x2160 |
| **其他** | portrait-3-4 | 768x1024 |
| | portrait-4-5 | 1080x1350 |
| | landscape-4-3 | 1024x768 |
| | landscape-3-2 | 1200x800 |
| **電影感 21:9** | cinematic-21-9 | 1920x822 |
| | cinematic-21-9-2k | 3840x1644 |
| | cinematic-21-9-4k | 7680x3288 |

### 6. 性能與優化 (Performance)

- **懶加載技術**：利用 IntersectionObserver 優化圖片加載速度。
- **請求隊列**：智慧管理併發請求，避免瀏覽器卡頓。
- **自動翻譯**：內建 Google 翻譯接口，支援中文提示詞自動轉英文。
- **實時生成時間追蹤**：顯示圖片生成的實時進度與最終耗時，提供透明的性能反饋。
- **HD 優化**：根據模型和尺寸自動優化 Steps、Guidance 參數。
- **動態超時**：根據圖片大小動態調整請求超時時間。

---

## 🗂️ 專案結構

```
Flux-AI-Pro-main/
├── worker.js              # 主程式入口 (7733 行)
├── wrangler.toml          # Cloudflare Workers 配置
├── README.md              # 專案說明文件
├── i18n/
│   ├── i18n-manager.js    # 國際化管理器
│   └── translations.js    # 多語言翻譯
├── plans/
│   └── admin-system-design.md  # 管理系統設計文檔
├── styles/
│   ├── base.css           # 基礎樣式
│   ├── core.js            # 核心風格配置 (127 種風格)
│   └── extended.js        # 擴展風格配置
└── utils/
    ├── auth.js            # 認證模組
    ├── helpers.js         # 輔助函數 (防抖、節流、格式化等)
    ├── style-adapter.js   # 風格適配器 (服務器端/客戶端)
    └── style-merger.js    # 風格合併器
```

---

## 🔧 核心技術架構

### 主要類別

| 類別 | 位置 | 功能描述 |
|------|------|----------|
| `RateLimiter` | worker.js:259 | KV 限流邏輯 (3次/分鐘) |
| `PollinationsProvider` | worker.js:457 | Pollinations API 處理 |
| `InfipProvider` | worker.js:741 | Infip API 處理 |
| `AquaProvider` | worker.js:891 | Aqua API 處理 (含輪詢) |
| `KinaiProvider` | worker.js:1192 | Kinai API 處理 |
| `KaaiProvider` | worker.js:1330 | Kaai API 處理 |
| `AirforceProvider` | worker.js:1474 | Airforce API 處理 |
| `HDOptimizer` | worker.js:347 | HD 優化器 |
| `ParameterOptimizer` | worker.js:382 | 參數優化器 |
| `StyleProcessor` | worker.js:424 | 風格處理器 |
| `PromptAnalyzer` | worker.js:326 | 提示詞分析器 |
| `Logger` | worker.js:252 | 日誌記錄器 |

### 風格管理器

| 管理器 | 位置 | 適用環境 |
|--------|------|----------|
| `ServerStyleManager` | utils/style-adapter.js:13 | Cloudflare Workers |
| `ClientStyleManager` | utils/style-adapter.js:82 | 瀏覽器 (支援 IndexedDB) |

---

## 🛠️ 快速部署 (Quick Deployment)

### 1. 複製專案

```bash
git clone https://github.com/kinai9661/Flux-AI-Pro.git
cd Flux-AI-Pro
```

### 2. 配置 `wrangler.toml`

```toml
name = "flux-ai-pro"
main = "worker.js"
compatibility_date = "2024-12-01"

# KV 存儲綁定 (NanoBanana 限流必需)
[[kv_namespaces]]
binding = "FLUX_KV"
id = "你的_KV_ID"

# Workers AI 綁定（用於中文自動翻譯）
[ai]
binding = "AI"

# 環境變量（非敏感）
[vars]
WORKER_VERSION = "11.16.0"
DEFAULT_MODEL = "flux-schnell"
MAX_WIDTH = 4096
MAX_HEIGHT = 4096
MAX_TIMEOUT = 300000
ENVIRONMENT = "production"
```

### 3. 創建 KV 命名空間

```bash
npx wrangler kv:namespace create "FLUX_KV"
```

將生成的 id 填入 `wrangler.toml`。

### 4. 設定 Secrets

```bash
# API 供應商 Keys
npx wrangler secret put POLLINATIONS_API_KEY
npx wrangler secret put INFIP_API_KEY
npx wrangler secret put AQUA_API_KEY
npx wrangler secret put KINAI_API_KEY
npx wrangler secret put AIRFORCE_API_KEY
npx wrangler secret put NONPON_API_KEY
npx wrangler secret put KAAI_API_KEY
```

### 5. 部署

```bash
npx wrangler deploy
```

### 6. 本地開發

```bash
npx wrangler dev
```

---

## 📊 限流與冷卻 (Rate Limiting)

| 模式 | 限制 | 冷卻時間 |
|------|------|----------|
| **Nano 模式** | 每分鐘 3 張免費配額 | 20 秒生成冷卻 |
| **主介面** | 根據供應商不同 | 30-60 秒智慧冷卻 |

### KV 存儲用途

| Key 格式 | 用途 | TTL |
|----------|------|-----|
| `nano_limit:{ip}` | IP 限流計數 | 60s |
| `rate_limit:{ip}` | API 速率限制計數 | 動態 |
| `online:{ip}` | 在線用戶計數 | 60s |
| `stats:daily:{date}` | 每日請求統計 | 24h |
| `stats:total` | 總請求計數 | 永久 |

---

## 🌐 API 端點

### 圖像生成

```http
POST /api/generate
Content-Type: application/json

{
  "prompt": "一隻可愛的貓咪",
  "model": "flux-schnell",
  "width": 1024,
  "height": 1024,
  "provider": "pollinations",
  "style": "anime",
  "seed": -1,
  "negativePrompt": "",
  "autoHD": true,
  "qualityMode": "standard"
}
```

### 獲取模型列表

```http
GET /api/models
```

### 獲取供應商列表

```http
GET /api/providers
```

### 獲取風格列表

```http
GET /api/styles
```

### 獲取統計數據

```http
GET /api/stats
```

---

## 🤝 合作與致謝 (Credits)

- [Pollinations.ai](https://pollinations.ai) - Free AI Image API
- [Infip.pro](https://infip.pro) - Ghostbot Web API
- [Aqua Server](https://aqua.server) - AI Generation Server
- [Kinai API](https://kinai.eu.cc) - High-Performance AI Generation API
- [Airforce API](https://api.airforce) - High-Quality AI Image Generation API
- [Nonpon API](https://api-reverse-engineering.kines966176.workers.dev) - AI Image Generation API (Nano Pro 專用)
- [Kaai API](https://kaai.eu.cc) - OpenAI Compatible API (DALL-E/GPT Image)
- [ShowMeBest.AI](https://showmebest.ai) - AI Tool Directory
- [Cloudflare Workers](https://workers.cloudflare.com) - Serverless Platform

---

## 📄 授權協議 (License)

MIT License. 歡迎 Fork 與二次開發。

---

## 📝 更新日誌 (Changelog)

### v11.16.0 (2026-02-19)
- 新增 Kaai API 供應商支援
- 優化 Airforce API JSON 響應處理
- 改進錯誤處理和日誌記錄
- 更新風格系統架構

### v11.15.0
- Nano Pro UI 大幅升級
- 新增多狀態載入動畫
- 改進歷史記錄功能
- 新增風格快捷按鈕

### v11.14.0
- 新增 Nonpon API 整合
- 支援 Gemini 3 Pro Image Preview
- 新增 2K/4K 輸出支援

---

**Made with ❤️ by Kinai**
