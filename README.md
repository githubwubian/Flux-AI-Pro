# 🎨 Flux AI Pro - NanoBanana Edition

![Version](https://img.shields.io/badge/Version-11.12.0-8B5CF6?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Cloudflare%20Workers-orange?style=flat-square)
![Engine](https://img.shields.io/badge/Engine-Multi%20Provider-blue?style=flat-square)
![I18N](https://img.shields.io/badge/I18N-5%20Languages-green?style=flat-square)
![Video](https://img.shields.io/badge/Video-Generation-red?style=flat-square)

**Flux AI Pro - NanoBanana Edition** 是一個基於 Cloudflare Workers 構建的高性能、單文件 AI 圖像和影片生成解決方案。它整合了 Pollinations.ai、Infip/Ghostbot、Aqua Server 和 Kinai API 等頂級 AI 供應商，提供無伺服器、極速且功能豐富的創作體驗。

---

## 🌍 English Introduction

**Flux AI Pro** 專為追求速度、品質和靈活性的創作者設計。透過利用 Cloudflare 邊緣網絡的強大功能，它提供無縫的介面來生成高品質 AI 藝術，無需複雜的伺服器設置。

### 🚀 Key Features
- **雙重介面設計**：
  - **專業版 UI**：完整控制 Steps、Guidance 和 Seed 等參數。
  - **NanoBanana Pro**：簡化、手機友好的「一鍵」生成體驗。
- **影片生成功能**：
  - **文字轉影片**：使用 Pollinations.ai 從文字提示生成影片。
  - **圖片轉影片**：將靜態圖片轉換為動態影片。
  - **單一供應商**：Pollinations.ai 支援 Flux Video 和 Turbo 模型。
- **多供應商架構**：無縫切換 Pollinations.ai（免費）、Infip/Ghostbot（專業版）、Aqua Server 和 Kinai API。
- **全球語言支援**：原生支援 **英文、繁體中文、日文、韓文和阿拉伯文**。
- **智慧語言偵測**：自動遵循您的系統/瀏覽器語言設置。
- **完整 RTL 支援**：為從右到左語言（阿拉伯語）提供專用佈局和文字方向。
- **AI 提示詞生成器**：由 Google Gemini 3 Flash 驅動，將簡單想法轉化為專業提示詞。
- **預設超高清**：內建優化策略，確保每張圖像都以最大品質生成。
- **永久本地歷史記錄**：使用 IndexedDB 本地存儲您的創作，支援匯出/匯入功能。

---

## 🔥 v11.12.0 更新亮點 (Release Highlights)

- **🎬 完整影片生成 UI**：提供完整的影片生成使用者介面，包含主頁面和 Nano 版本。
- **🤖 單一供應商**：整合 Pollinations.ai 影片生成 API。
- **🎯 模型選擇器**：提供 Flux Video 和 Turbo 兩種影片模型。
- **📐 多種解析度**：支援 4 種預設影片尺寸 (16:9、9:16、1:1、Full HD)。
- **📊 API 端點**：提供完整的 RESTful API 端點供外部呼叫。
- **🌍 多語言支援**：影片生成介面完整支援繁體中文、英文、日文、韓文、阿拉伯語。
- **💾 本地歷史記錄**：使用 LocalStorage 儲存影片生成歷史，點擊可重新載入。
- **🎨 精美 UI 設計**：深色漸變背景、毛玻璃效果、響應式設計。

---

## ✨ 核心功能特色

### 1. 雙重操作介面 (Dual UI)
*   **專業版主介面 (`/`)**：提供完整的參數控制，適合需要精細調整的專業創作者。
*   **NanoBanana Pro (`/nano`)**：極簡設計，內建每小時 5 張的免費配額與能量回充系統，適合快速獲取靈感。

### 2. 影片生成功能 (Video Generation)
*   **完整 UI 介面**：
   - **主頁面 (`/video`)**：功能完整的影片生成介面，包含提示詞輸入、圖片上傳、模型選擇、尺寸調整、FPS 調整、持續時間調整。
   - **Nano 版本 (`/video/nano`)**：簡化版介面，適合手機瀏覽。
*   **單一供應商支援**：
   - **Pollinations.ai**：免費影片生成，支援 Flux Video 和 Turbo 模型。
*   **模型選擇**：2 種影片模型 - Flux Video (高品質) 和 Turbo (快速生成)。
*   **多種解析度**：4 種預設影片尺寸 - 16:9 (1280x720)、Full HD (1920x1080)、1:1 (720x720)、9:16 (1080x1920)。
*   **圖片上傳**：支援拖曳上傳參考圖片，實現圖片轉影片功能。
*   **配額顯示**：即時顯示剩餘配額和冷卻時間。
*   **歷史記錄**：最近 10 筆生成記錄，點擊可重新載入影片。
*   **API 端點**：提供完整的 RESTful API 端點供外部呼叫。
*   **限流機制**：每小時每 IP 5 個影片免費配額，180 秒生成冷卻。

### 3. 智慧語言管理 (Smart I18N)
*   **自動偵測**：根據 `navigator.language` 自動切換，並記憶用戶的手動選擇。
*   **RTL 支援**：阿拉伯語模式下，介面元素自動鏡像翻轉，符合母語用戶習慣。

### 4. 多供應商模型庫 (Multi-Model Library)
*   **Pollinations.ai**：提供 `Flux 2 Dev`、`Imagen 4`、`NanoBanana` (Nano Pro 專用)、`SeeDream`、`Flux Schnell`、`Z-Image`、`FLUX.2 Klein`、`FLUX.2 Klein 9B` 等免費高品質模型。
*   **Infip/Ghostbot**：支援 Google `Imagen 4` 與 `Flux Schnell`，具備更強的併發處理能力，支援 NSFW 模式。
*   **Aqua Server**：提供 `Flux 2`、`Z-Image`、`Imagen 4` (輪詢模式)、`NanoBanana` (Img2Img 輪詢模式) 等高品質模型。
*   **Kinai API**：提供 `Flux 2 Dev`、`Imagen 4`、`Flux Schnell`、`SDXL`、`GLM-Image` 等高品質模型，支援 NSFW 模式與批量生成。
*   **輪詢模型支援**：imagen-4 和 nanobanana 採用輪詢機制，確保大型模型生成的穩定性。
*   **Img2Img 功能**：nanobanana 模型支援參考圖片上傳，實現圖片轉圖片生成。
*   **NSFW 模式**：Infip 和 Kinai 供應商支援解除成人內容限制功能。
*   **供應商統計追蹤**：自動追蹤各供應商的使用次數與比例，透過 API 端點查詢。

### 5. 性能與優化 (Performance)
*   **懶加載技術**：利用 IntersectionObserver 優化圖片加載速度。
*   **請求隊列**：智慧管理併發請求，避免瀏覽器卡頓。
*   **自動翻譯**：內建 Google 翻譯接口，支援中文提示詞自動轉英文。
*   **實時生成時間追蹤**：顯示圖片生成的實時進度與最終耗時，提供透明的性能反饋。

---

## 🛠️ 快速部署 (Quick Deployment)

1.  **複製專案**：
    ```bash
    git clone https://github.com/kinai9661/Flux-AI-Pro.git
    ```
2.  **配置 `wrangler.toml`**：
    ```toml
    name = "flux-ai-pro"
    main = "worker.js"
    [[kv_namespaces]]
    binding = "FLUX_KV"
    id = "你的_KV_ID"
    ```
3.  **設定 Secrets**：
    ```bash
    wrangler secret put POLLINATIONS_API_KEY
    wrangler secret put INFIP_API_KEY
    wrangler secret put AQUA_API_KEY
    wrangler secret put KINAI_API_KEY
    wrangler secret put GEMINI_API_KEY
    # 影片生成 API Key (可選)
    wrangler secret put POLLINATIONS_VIDEO_API_KEY
    ```
4.  **部署**：
    ```bash
    wrangler deploy
    ```

## 🎬 影片生成 API 端點

### 環境變數 API Key 配置

影片生成功能支援透過環境變數配置 API Key，這樣可以避免在前端暴露敏感的 API Key。當環境變數配置後，前端會自動隱藏 API Key 輸入框。

**設置環境變數：**

```bash
# Pollinations 影片生成 API Key（可選）
wrangler secret put POLLINATIONS_VIDEO_API_KEY
```

**API Key 優先順序：**
1. 環境變數中的 API Key（優先使用）
2. 前端輸入的 API Key（備用）

### 生成影片
```
POST /api/video/generate
Content-Type: application/json

{
  "prompt": "A beautiful sunset over mountains",
  "model": "seedance",
  "width": 1280,
  "height": 720,
  "fps": 24,
  "duration": 5,
  "referenceImage": "https://example.com/image.jpg",  // 可選，用於圖片轉影片
  "apiKey": "YOUR_API_KEY"  // 可選，如果環境變數已配置則不需要
}
```

### 支援的影片模型

| 供應商 | 模型 | 類型 | 費用 | 說明 |
|--------|------|------|------|------|
| Pollinations.ai | seedance | 文字/圖片轉影片 | 0.0000018/token | BytePlus 模型，預設選項 (2-10秒) |
| Pollinations.ai | seedance-pro | 文字/圖片轉影片 | 0.000001/token | BytePlus 進階版，更好的提示詞遵循 (2-10秒) |
| Pollinations.ai | wan | 圖片轉影片（含音訊） | 0.025 Pollen/sec | 圖片轉影片含音訊 (2-15秒，最高 1080P) |

### 支援的影片尺寸

| 比例 | 寬度 | 高度 | 標籤 |
|------|------|------|------|
| 16:9 | 1280 | 720 | HD (16:9) |
| 16:9 | 1920 | 1080 | Full HD (16:9) |
| 1:1 | 720 | 720 | 方形 (1:1) |
| 9:16 | 1080 | 1920 | 直向 (9:16) |

---

## 📊 限流與冷卻 (Rate Limiting)

*   **Nano 模式**：每小時 5 張免費配額，180 秒生成冷卻。
*   **影片生成**：每小時每 IP 5 個影片免費配額，180 秒生成冷卻。
*   **主介面**：根據供應商不同，設有 30-60 秒的智慧冷卻保護。

### 影片生成 API 端點

*   `POST /api/video/generate` - 生成影片
*   `GET /api/video/models` - 獲取可用模型列表
*   `GET /api/video/styles` - 獲取樣式列表
*   `GET /api/video/sizes` - 獲取尺寸列表
*   `GET /api/video/quota` - 獲取配額資訊
*   `GET /api/video/config` - 獲取完整配置

---

## 🤝 合作與致謝 (Credits)

- [Pollinations.ai](https://pollinations.ai) - Free AI Image & Video API
- [Infip.pro](https://infip.pro) - Ghostbot Web API
- [Aqua Server](https://aqua.server) - AI Generation Server
- [Kinai API](https://kinai.eu.cc) - High-Performance AI Generation API
- [ShowMeBest.AI](https://showmebest.ai) - AI Tool Directory
- [Cloudflare Workers](https://workers.cloudflare.com) - Serverless Platform

---

## 📄 授權協議 (License)

MIT License. 歡迎 Fork 與二次開發。
