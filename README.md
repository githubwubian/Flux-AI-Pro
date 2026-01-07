這份是 **Flux AI Pro v9.9.0** 的最終完整版 `README.md`。

此版本已整合了**方案選擇指南**、**雙引擎架構介紹**以及**免費翻譯功能**，您可以直接複製並覆蓋倉庫中的 `README.md` 文件。

```markdown
# 🎨 Flux AI Pro (v9.9.0)

<div align="center">

![Version](https://img.shields.io/badge/version-9.9.0--gpt-blue?style=for-the-badge&logo=github)
![Model](https://img.shields.io/badge/Model-GPT%20%7C%20Flux%20%7C%20Turbo-purple?style=for-the-badge&logo=openai)
![Platform](https://img.shields.io/badge/Platform-Cloudflare%20Workers-orange?style=for-the-badge&logo=cloudflare)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**🚀 全能型 AI 圖像生成平台 | GPT & Flux 雙引擎 | 雙語國際版**

基於 Cloudflare Workers 的高性能無伺服器架構  
**六大模型支援** · **智能參數優化** · **Google 免費翻譯** · **完整 Web UI**

[🎯 快速開始](#-3-分鐘快速部署) · [📸 在線演示](https://flux-ai-pro.workers.dev) · [⚖️ 方案選擇](#-方案選擇指南) · [📖 功能文檔](#-功能特性)

</div>

---

## ✨ v9.9.0 重大更新

<table>
<tr>
<td width="50%">

### 🤖 雙引擎架構 (GPT + Flux)
本版本引入了 **GPT-Image** 系列模型，與現有的 Flux 模型形成互補：
- **GPT-Image Large**：極致細節與藝術性，適合高品質創作。
- **GPT-Image**：通用型生成，指令依從性高，色彩豐富。

### 🌍 Google GTX 智能翻譯
- **完全免費**：整合 Google GTX API，不再消耗 Workers AI 額度。
- **無縫體驗**：輸入中文提示詞，自動轉譯為高品質英文 Prompt。

</td>
<td width="50%">

### 📊 六大模型矩陣
1. **GPT-Image** (通用)
2. **GPT-Image Large** (藝術)
3. **Flux Standard** (寫實)
4. **Flux Turbo** (極速)
5. **Z-Image** (預覽)
6. **Kontext** (圖生圖)

### 🎨 午夜藍調 UI
- 全新 **Midnight Blue** 深色主題。
- 響應式設計，完美支援手機與桌面操作。

</td>
</tr>
</table>

---

## ⚖️ 方案選擇指南

不知道該選哪個模型？請參考以下場景推薦：

### 1️⃣ 追求極致畫質 (藝術創作)
*   **推薦模型**: `GPT-Image Large` 🌟 或 `Flux Standard`
*   **推薦設定**: Quality: `Ultra HD`, Auto-Optimize: `ON`
*   **特點**: 細節最豐富，光影最自然，適合製作桌布、海報或藝術作品。

### 2️⃣ 追求生成速度 (快速迭代)
*   **推薦模型**: `Flux Turbo` ⚡ 或 `Z-Image`
*   **推薦設定**: Quality: `Economy`, Size: `1024x1024`
*   **特點**: 5秒內出圖，適合測試 Prompt 構圖、快速預覽或批量生成。

### 3️⃣ 需要修改現有圖片 (圖生圖)
*   **推薦模型**: `Kontext` 🎨
*   **推薦設定**: 填入 `Reference Image URL`
*   **特點**: 唯一支援「以圖生圖」的模型，可進行風格遷移（如：照片轉油畫）或細節重繪。

### 4️⃣ 通用日常使用
*   **推薦模型**: `GPT-Image` 🎨
*   **推薦設定**: Quality: `Standard`
*   **特點**: 色彩鮮豔，對指令理解力強，平衡了速度與質量，適合社群分享圖。

---

## 🚀 3 分鐘快速部署

本項目基於 Cloudflare Workers，**完全免費**且無需伺服器維護。

### 1. 前置準備
- [Cloudflare 帳號](https://dash.cloudflare.com/sign-up) (免費)
- [Pollinations.ai API Key](https://pollinations.ai) (註冊獲取免費 Key)
- Node.js 環境 (v16+)

### 2. 部署步驟

**第一步：克隆項目**
```bash
git clone https://github.com/kinai9661/Flux-AI-Pro.git
cd Flux-AI-Pro
```

**第二步：安裝 Wrangler 工具**
```bash
npm install -g wrangler
```

**第三步：登錄 Cloudflare**
```bash
wrangler login
# 瀏覽器會自動彈出，點擊「Allow」授權
```

**第四步：設置 API Key (必需)**
```bash
wrangler secret put POLLINATIONS_API_KEY
# 提示輸入時，貼上你的 Key (格式: pk_xxxxxxxxxxxxx)
```

**第五步：發布上線**
```bash
wrangler deploy
```

部署成功後，終端會顯示您的專屬網址：
`https://flux-ai-pro.<你的用戶名>.workers.dev`

---

## 📖 功能特性

### 🧠 智能優化系統 (Auto-Optimize)
系統會根據您選擇的**模型**與**尺寸**，自動計算最佳參數：
- **Steps 優化**：Flux 用 20-30 步，GPT-Large 用 25-35 步，Turbo 僅需 8 步。
- **Guidance 優化**：寫實風格 (Photorealistic) 自動提高 Guidance，動漫風格自動降低。
- **HD 自動增強**：當選擇「Ultra」畫質時，自動添加 `8k uhd, masterpiece` 等高品質提示詞。

### 🖼️ 圖生圖 (Image-to-Image)
專為 **Kontext** 模型設計：
1. 在 UI 選擇 `Kontext` 模型。
2. 在「參考圖像」欄位輸入圖片 URL（支援多張，逗號分隔）。
3. 輸入提示詞（例如：「變成梵高油畫風格」）。
4. 系統將保留原圖構圖並進行風格轉換。

### 💾 歷史記錄管理 (Local History)
- **自動保存**：所有生成的圖片、參數、Seed 自動存入瀏覽器。
- **一鍵重用**：點擊歷史記錄中的 `🔄 Reuse`，立即還原當時的所有設定。
- **批量導出**：支援將生成記錄導出為 JSON 備份。

---

## 🔧 API 開發指南

Flux AI Pro 不僅是 Web UI，更是一個標準的 **REST API Proxy**，可供您的其他應用程式調用。

### 基礎資訊
- **Endpoint**: `https://your-worker.workers.dev/_internal/generate`
- **Method**: `POST`
- **Auth**: 無需驗證 (或可在 worker.js 中自行添加 Bearer Token 驗證)

### 請求參數 (JSON)

```json
{
  "prompt": "A futuristic cyberpunk city with neon lights",
  "model": "gptimage-large",    // 可選: gptimage, flux, turbo, kontext
  "width": 1024,
  "height": 1024,
  "n": 1,                       // 生成數量 (1-4)
  "quality_mode": "ultra",      // economy, standard, ultra
  "style": "cyberpunk",         // 風格預設 ID
  "auto_hd": true,              // 是否啟用 HD 優化
  "seed": -1                    // -1 為隨機
}
```

### 響應格式

**單張生成 (Default)**
直接返回 `image/png` 二進制流，可直接用於 `<img src="...">`。

**多張生成 (n > 1)**
返回 JSON 格式：
```json
{
  "created": 1704700000,
  "data": [
    { "image": "data:image/png;base64,..." },
    { "image": "data:image/png;base64,..." }
  ]
}
```

---

## ⚙️ 環境變數配置

您可以在 `wrangler.toml` 中修改默認設定，或通過 Cloudflare Dashboard 調整。

| 變數名稱 | 描述 | 默認值 |
| :--- | :--- | :--- |
| `DEFAULT_MODEL` | 預設選中的模型 | `"gptimage"` |
| `MAX_TIMEOUT` | API 請求超時時間 (毫秒) | `120000` |
| `API_MASTER_KEY` | (可選) 用於保護您的 API 接口 | `"1"` |

---

## ❓ 常見問題 (FAQ)

**Q: 這是真的免費嗎？**
A: 是的。Cloudflare Workers 每日提供 10 萬次免費請求，Pollinations API 目前也是免費的（需註冊 Key）。

**Q: 為什麼顯示 "Authentication failed"?**
A: 請確保您已執行 `wrangler secret put POLLINATIONS_API_KEY` 並輸入了正確的 Key。

**Q: GPT-Image 和 Flux 哪個比較好？**
A: 
- **Flux**：光影、物理結構更準確，適合寫實照片。
- **GPT-Image**：色彩更豐富，對抽象概念和藝術風格理解更好。

**Q: 如何更新到最新版本？**
A: 執行 `git pull` 拉取最新代碼，然後再次執行 `wrangler deploy` 即可。

---

<div align="center">

**[GitHub Repository](https://github.com/kinai9661/Flux-AI-Pro)**

Made with ❤️ by Flux AI Pro Community

</div>
```
