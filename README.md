# 🎨 Flux AI Pro - Serverless AI Image Generator

![Version](https://img.shields.io/badge/Version-11.2.0-8B5CF6?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Cloudflare%20Workers-orange?style=flat-square)
![Engine](https://img.shields.io/badge/Engine-Multi%20Provider-blue?style=flat-square)

**Flux AI Pro** 是一個部署在 Cloudflare Workers 上的單檔式 AI 繪圖應用。支援多供應商架構（Pollinations.ai 與 Infip/Ghostbot），提供無伺服器、低延遲的圖像生成服務。

本專案包含兩套獨立介面：**完整專業版 UI** 與 **NanoBanana Pro 極簡版 UI**。

---

## 🔥 v11.2.0 更新亮點 (UI Overhaul & Klein Model)

- **🌌 全新視覺設計**：主介面升級為「深空紫」主題，採用玻璃擬態 (Glassmorphism) 設計，視覺更具現代感與科技感。
- **🤖 FLUX.2 Klein 4B**：新增強大的 Klein 模型 (4B 參數)，提供更細膩的畫質與細節表現。
- **✨ 畫質自動升級**：全域實裝「最佳品質策略」，所有生成請求自動強制使用 **Ultra (超高清)** 畫質模式。
- **👥 真實人數統計**：整合 `whos.amung.us` 第三方統計服務，實時顯示線上活躍人數。
- **🔗 頁腳優化**：主頁新增包含友情鏈接 (Pollinations, Infip, GitHub) 與 ShowMeBestAI 推薦徽章的單行頁腳；Nano 版保持極簡無頁腳設計。
- **🖼️ 圖片保存優化**：修復了圖片下載功能，現在支持自定義檔名與燈箱模式直接下載。

---

## ✨ 功能特色

### 1. 雙重操作介面
- **主介面 (`/`)**：功能完整的控制台，採用全新深色玻璃主題，支援所有模型、數十種藝術風格、歷史紀錄管理 (IndexedDB)、參數微調。
- **Nano 介面 (`/nano`)**：類似 App 的沉浸式體驗，包含燈箱效果、剩餘額度顯示、隨機靈感骰子。

### 2. 多模型與供應商支援
- **Pollinations.ai (Free)**: 
  - `FLUX.2 Klein 4B` (✨New! 推薦), `Flux Standard`, `Flux Turbo`
  - `GPT-Image`, `GPT-Image Large`
  - `Flux Realism`, `Flux Coda`, `Flux Anime`, `Flux 3D`
- **Ghostbot / Infip (Premium)**:
  - `img4` (Flux Pro), `Flux Schnell`
  - `SDXL`, `Lucid Origin`
  - 支援 **NSFW** 選項（需自備 Key）
  - 支援批次生成 (Batch Size: 1-4)

### 3. 進階圖像處理
- **風格預設**：內建 40+ 種風格（動漫、寫實、油畫、賽博龐克、浮世繪等）。
- **參考圖 (Img2Img)**：支援輸入圖片 URL 進行參考生成（僅限特定模型如 Kontext）。
- **畫布比例**：預設多種社群媒體常用比例 (IG, 16:9, 桌布)。
- **自動優化**：內建提示詞增強與自動翻譯功能。

---

## 🛠️ 部署教學 (Deployment)

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
編輯 `wrangler.toml`，確保包含 KV 綁定以啟用限流功能（如需要）：

```toml
name = "flux-ai-pro"
main = "worker.js"
compatibility_date = "2024-01-01"

# 綁定 KV 用於 Nano 模式的限流記錄
[[kv_namespaces]]
binding = "FLUX_KV"
id = "你的_KV_NAMESPACE_ID"
```

> **如何獲取 KV ID？**
> 執行 `wrangler kv:namespace create "FLUX_KV"`，將輸出的 ID 填入上述設定。

### 3. 設定環境變數 (Secrets)
為了使用 Infip 的進階功能（如 NSFW），建議設定 API Key：

```bash
wrangler secret put INFIP_API_KEY
# 輸入你的 Infip API Key
```

### 4. 部署
```bash
wrangler deploy
```

---

## ⚙️ API 接口 (Internal)

Worker 暴露了一個內部的生成 API，供前端呼叫：

**Endpoint:** `POST /_internal/generate`

**Body:**
```json
{
  "prompt": "a cyberpunk cat",
  "model": "klein",
  "width": 1024,
  "height": 1024,
  "style": "anime",
  "auto_optimize": true
}
```

> **注意**：`nanobanana-pro` 模型僅允許來自 Nano 頁面的請求 (`X-Source: nano-page`) 且受 KV 限流控制。

---

## 🤝 友情鏈接

- [Pollinations.ai](https://pollinations.ai)
- [Infip.pro](https://infip.pro)
- [ShowMeBest.AI](https://showmebest.ai)

---

## 📄 License
MIT License
