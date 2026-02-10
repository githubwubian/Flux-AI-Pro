# 🎨 Flux AI Pro - NanoBanana Edition

![Version](https://img.shields.io/badge/Version-11.12.0-8B5CF6?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Cloudflare%20Workers-orange?style=flat-square)
![Engine](https://img.shields.io/badge/Engine-Multi%20Provider-blue?style=flat-square)
![I18N](https://img.shields.io/badge/I18N-5%20Languages-green?style=flat-square)

**Flux AI Pro - NanoBanana Edition** 是一個基於 Cloudflare Workers 構建的高性能、單文件 AI 圖像生成解決方案。它整合了 Pollinations.ai、Infip/Ghostbot、Aqua Server、Kinai API 和 Airforce API 等頂級 AI 供應商，提供無伺服器、極速且功能豐富的創作體驗。

---

## 🌍 English Introduction

**Flux AI Pro** 專為追求速度、品質和靈活性的創作者設計。透過利用 Cloudflare 邊緣網絡的強大功能，它提供無縫的介面來生成高品質 AI 藝術，無需複雜的伺服器設置。

### 🚀 Key Features
- **雙重介面設計**：
  - **專業版 UI**：完整控制 Steps、Guidance 和 Seed 等參數。
  - **NanoBanana Pro**：簡化、手機友好的「一鍵」生成體驗。
- **多供應商架構**：無縫切換 Pollinations.ai（免費）、Infip/Ghostbot（專業版）、Aqua Server、Kinai API 和 Airforce API。
- **全球語言支援**：原生支援 **英文、繁體中文、日文、韓文和阿拉伯文**。
- **智慧語言偵測**：自動遵循您的系統/瀏覽器語言設置。
- **完整 RTL 支援**：為從右到左語言（阿拉伯語）提供專用佈局和文字方向。
- **AI 提示詞生成器**：由 Pollinations Vision API 驅動，將簡單想法轉化為專業提示詞。
- **預設超高清**：內建優化策略，確保每張圖像都以最大品質生成。
- **永久本地歷史記錄**：使用 IndexedDB 本地存儲您的創作，支援匯出/匯入功能。
- **介面語言跟蹤**：所有 UI 元素（生成進度、按鈕、狀態消息）完全支持 5 種語言。

---

## 🔥 v11.12.0 更新亮點 (Release Highlights)

- **🎨 精美 UI 設計**：深色漸變背景、毛玻璃效果、響應式設計。
- **🌍 多語言支援**：完整支援繁體中文、英文、日文、韓文、阿拉伯語，所有語言均包含視頻生成翻譯。
- **💾 本地歷史記錄**：使用 IndexedDB 儲存生成歷史，點擊可重新載入圖像。
- **🤖 AI 提示詞生成器**：使用 Pollinations Vision API 生成專業提示詞。
- **📊 API 端點**：提供完整的 RESTful API 端點供外部呼叫。
- **🌐 介面語言跟蹤**：生成進度、按鈕文本、狀態消息等所有 UI 元素均支持 5 種語言。
- **🔧 Airforce API 優化**：更新端點為 `https://api.airforce/v1/images/generations`，改進 JSON 響應處理和錯誤處理。

---

## ✨ 核心功能特色

### 1. 雙重操作介面 (Dual UI)
*   **專業版主介面 (`/`)**：提供完整的參數控制，適合需要精細調整的專業創作者。
*   **NanoBanana Pro (`/nano`)**：極簡設計，內建每小時 5 張的免費配額與能量回充系統，適合快速獲取靈感。

### 2. 智慧語言管理 (Smart I18N)
*   **自動偵測**：根據 `navigator.language` 自動切換，並記憶用戶的手動選擇。
*   **RTL 支援**：阿拉伯語模式下，介面元素自動鏡像翻轉，符合母語用戶習慣。
*   **完整語言覆蓋**：所有 5 種語言（zh、en、ja、ko、ar）均包含完整的視頻生成翻譯。
*   **介面語言跟蹤**：生成進度、按鈕文本、狀態消息、錯誤提示等所有 UI 元素均支持多語言。

### 3. 多供應商模型庫 (Multi-Model Library)
*   **Pollinations.ai**：提供 `Flux 2 Dev`、`Imagen 4`、`NanoBanana` (Nano Pro 專用)、`SeeDream`、`Flux Schnell`、`Z-Image`、`FLUX.2 Klein`、`FLUX.2 Klein 9B` 等免費高品質模型。
*   **Infip/Ghostbot**：支援 Google `Imagen 4` 與 `Flux Schnell`，具備更強的併發處理能力，支援 NSFW 模式。
*   **Aqua Server**：提供 `Flux 2`、`Z-Image`、`Imagen 4` (輪詢模式)、`NanoBanana` (Img2Img 輪詢模式) 等高品質模型。
*   **Kinai API**：提供 `GLM Image` 高品質模型，支援 NSFW 模式與批量生成（最多 4 張）。
*   **Airforce API**：提供 `Plutogen O1`、`Z-Image`、`Imagen 4` (Google)、`Flux 2 Pro`、`Flux 2 Flex`、`GPT Image 1.5`、`Flux 2 Klein 4B`、`Flux 2 Klein 9B`、`SeeDream 4.5` 等高品質模型，支援批量生成。
*   **輪詢模型支援**：imagen-4 和 nanobanana 採用輪詢機制，確保大型模型生成的穩定性。
*   **Img2Img 功能**：nanobanana 模型支援參考圖片上傳，實現圖片轉圖片生成。
*   **NSFW 模式**：Infip 和 Kinai 供應商支援解除成人內容限制功能。
*   **供應商統計追蹤**：自動追蹤各供應商的使用次數與比例，透過 API 端點查詢。

### 4. 性能與優化 (Performance)
*   **懶加載技術**：利用 IntersectionObserver 優化圖片加載速度。
*   **請求隊列**：智慧管理併發請求，避免瀏覽器卡頓。
*   **自動翻譯**：內建 Google 翻譯接口，支援中文提示詞自動轉英文。
*   **實時生成時間追蹤**：顯示圖片生成的實時進度與最終耗時，提供透明的性能反饋。
*   **JSON 響應處理**：Airforce API 採用標準 JSON 響應格式，確保穩定的圖片返回。

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
    wrangler secret put AIRFORCE_API_KEY
    ```
4.  **部署**：
    ```bash
    wrangler deploy
    ```

---

## 📊 限流與冷卻 (Rate Limiting)

*   **Nano 模式**：每小時 5 張免費配額，180 秒生成冷卻。
*   **主介面**：根據供應商不同，設有 30-60 秒的智慧冷卻保護。

---

## 🤝 合作與致謝 (Credits)

- [Pollinations.ai](https://pollinations.ai) - Free AI Image API
- [Infip.pro](https://infip.pro) - Ghostbot Web API
- [Aqua Server](https://aqua.server) - AI Generation Server
- [Kinai API](https://kinai.eu.cc) - High-Performance AI Generation API
- [Airforce API](https://api.airforce) - High-Quality AI Image Generation API
- [ShowMeBest.AI](https://showmebest.ai) - AI Tool Directory
- [Cloudflare Workers](https://workers.cloudflare.com) - Serverless Platform

---

## 📄 授權協議 (License)

MIT License. 歡迎 Fork 與二次開發。
