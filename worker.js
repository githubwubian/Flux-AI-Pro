// =================================================================================
//  項目: NanoBanana Studio Pro (Full Styles Edition)
//  版本: 3.4.0
//  日期: 2026-01-10
//  功能: 全功能生成 + 45種完整風格 + 智能修圖 + 動漫轉真人 + 額度限制
// =================================================================================

const CONFIG = {
  PROJECT_NAME: "NanoBanana Studio Pro",
  PROJECT_VERSION: "3.4.0",
  API_MASTER_KEY: "your-secret-key-here", // 請修改為您的密鑰
  
  // 核心設定
  UPSTREAM_ORIGIN: "https://nanobananaai.org",
  SUBMIT_ENDPOINT: "https://nanobananaai.org/api/gen-text-to-image",
  HOME_URL: "https://nanobananaai.org", // 回到主頁的連結
  
  // 額度控制設定
  HOURLY_LIMIT: 20, // 每小時限制張數
  QUOTA_TARGETS: ['nano', 'banana'], // 只有包含這些關鍵字的模型會扣額度
  
  MODELS: ["nano-banana-v1"],
  DEFAULT_MODEL: "nano-banana-v1",
  
  // 支持的AI模型列表
  AI_MODELS: [
    { id: "nano-banana", name: "Nano Banana", emoji: "🍌", category: "nano", quality: "fast" },
    { id: "nano-banana-pro", name: "Nano Banana Pro", emoji: "💎", category: "nano", quality: "high" },
    { id: "flux-dev", name: "FLUX.1-dev", emoji: "🚀", category: "flux", quality: "high" },
    { id: "flux-schnell", name: "FLUX.1-schnell", emoji: "⚡", category: "flux", quality: "fast" },
    { id: "sd3.5-large", name: "SD 3.5 Large", emoji: "🏆", category: "sd3", quality: "high" },
    { id: "sd3.5-medium", name: "SD 3.5 Medium", emoji: "🎨", category: "sd3", quality: "medium" },
    { id: "sdxl", name: "SDXL 1.0", emoji: "🖼️", category: "sdxl", quality: "medium" },
    { id: "sd-v1.5", name: "SD v1.5", emoji: "📸", category: "sd", quality: "fast" }
  ],
  
  // 完整的 45 種風格庫
  STYLES: [
    { id: 0, name: "無風格 (No Style)", value: "no-style", emoji: "🚫", category: "basic" },
    { id: 1, name: "3D 可愛 (3D Cute)", value: "3d-cute", emoji: "🧸", category: "3d" },
    { id: 2, name: "3D 渲染 (3D Render)", value: "3d-render", emoji: "🧊", category: "3d" },
    { id: 3, name: "拍立得 (Instax)", value: "instax", emoji: "📸", category: "photo" },
    { id: 4, name: "散景 (Bokeh)", value: "bokeh", emoji: "✨", category: "photo" },
    { id: 5, name: "電影感 (Cinematic)", value: "cinematic", emoji: "🎬", category: "photo" },
    { id: 6, name: "廣告大片 (Advertising)", value: "advertising", emoji: "📢", category: "photo" },
    { id: 7, name: "表情包 (Chibi Emoji)", value: "chibi-emoji", emoji: "😊", category: "fun" },
    { id: 8, name: "標誌設計 (Logo Design)", value: "logo-design", emoji: "✒️", category: "design" },
    { id: 9, name: "吉卜力 (Ghibli)", value: "ghibli", emoji: "🌸", category: "anime" },
    { id: 10, name: "手繪動漫 (Hand-Drawn)", value: "hand-drawn-anime", emoji: "✏️", category: "anime" },
    { id: 11, name: "標準動漫 (Anime)", value: "anime", emoji: "⭐", category: "anime" },
    { id: 12, name: "像素藝術 (Pixel Art)", value: "pixel-art", emoji: "🎮", category: "digital" },
    { id: 13, name: "迪士尼 (Disney)", value: "disney", emoji: "🏰", category: "cartoon" },
    { id: 14, name: "皮克斯 (Pixar)", value: "pixar", emoji: "👾", category: "3d" },
    { id: 15, name: "寫實照片 (Realistic)", value: "realistic", emoji: "📷", category: "photo" },
    { id: 16, name: "油畫 (Oil Painting)", value: "oil-painting", emoji: "🖼️", category: "art" },
    { id: 17, name: "水彩畫 (Watercolor)", value: "watercolor", emoji: "🎨", category: "art" },
    { id: 18, name: "賽博朋克 (Cyberpunk)", value: "cyberpunk", emoji: "🤖", category: "digital" },
    { id: 19, name: "蒸汽波 (Vaporwave)", value: "vaporwave", emoji: "🌈", category: "digital" },
    { id: 20, name: "素描 (Sketch)", value: "sketch", emoji: "📝", category: "art" },
    { id: 21, name: "漫畫 (Manga)", value: "manga", emoji: "📖", category: "anime" },
    { id: 22, name: "復古 (Vintage)", value: "vintage", emoji: "📻", category: "photo" },
    { id: 23, name: "黑白 (Black & White)", value: "bw", emoji: "⚫", category: "photo" },
    { id: 24, name: "印象派 (Impressionism)", value: "impressionism", emoji: "🌻", category: "art" },
    { id: 25, name: "超現實主義 (Surrealism)", value: "surrealism", emoji: "👁️", category: "art" },
    { id: 26, name: "普普藝術 (Pop Art)", value: "pop-art", emoji: "💥", category: "art" },
    { id: 27, name: "極簡主義 (Minimalist)", value: "minimalist", emoji: "⚪", category: "design" },
    { id: 28, name: "霓虹 (Neon)", value: "neon", emoji: "💡", category: "digital" },
    { id: 29, name: "浮世繪 (Ukiyo-e)", value: "ukiyo-e", emoji: "🌊", category: "art" },
    { id: 30, name: "低多邊形 (Low Poly)", value: "low-poly", emoji: "🔷", category: "3d" },
    { id: 31, name: "摺紙 (Origami)", value: "origami", emoji: "🦢", category: "craft" },
    { id: 32, name: "黏土風 (Claymation)", value: "claymation", emoji: "🏺", category: "craft" },
    { id: 33, name: "貼紙 (Sticker)", value: "sticker", emoji: "🏷️", category: "design" },
    { id: 34, name: "向量圖 (Vector)", value: "vector", emoji: "📐", category: "design" },
    { id: 35, name: "等距視角 (Isometric)", value: "isometric", emoji: "🎲", category: "3d" },
    { id: 36, name: "微距攝影 (Macro)", value: "macro", emoji: "🔍", category: "photo" },
    { id: 37, name: "廣角 (Wide Angle)", value: "wide-angle", emoji: "👁️", category: "photo" },
    { id: 38, name: "魚眼 (Fisheye)", value: "fisheye", emoji: "🐟", category: "photo" },
    { id: 39, name: "寶麗來 (Polaroid)", value: "polaroid", emoji: "🎞️", category: "photo" },
    { id: 40, name: "科幻 (Sci-Fi)", value: "sci-fi", emoji: "🚀", category: "digital" },
    { id: 41, name: "奇幻 (Fantasy)", value: "fantasy", emoji: "🐉", category: "art" },
    { id: 42, name: "恐怖 (Horror)", value: "horror", emoji: "👻", category: "art" },
    { id: 43, name: "蒸汽龐克 (Steampunk)", value: "steampunk", emoji: "⚙️", category: "digital" },
    { id: 44, name: "哥德式 (Gothic)", value: "gothic", emoji: "🧛", category: "art" }
  ],
  
  RATIOS: [
    { value: "1:1", label: "正方形", size: "1024x1024", icon: "⬜" },
    { value: "16:9", label: "橫屏", size: "1792x1024", icon: "🖥️" },
    { value: "9:16", label: "豎屏", size: "1024x1792", icon: "📱" },
    { value: "4:3", label: "標準", size: "1536x1152", icon: "📺" },
    { value: "3:4", label: "豎版", size: "1152x1536", icon: "📄" },
    { value: "21:9", label: "超寬", size: "2048x878", icon: "🎬" }
  ],
  
  MODES: {
    TEXT_TO_IMAGE: "text-to-image",
    IMAGE_TO_IMAGE: "image-to-image",
    IMAGE_TO_FIGURE: "image-to-figure",
    IMAGE_EDIT: "image-edit",       // 智能修圖
    GHIBLI_SPECIAL: "ghibli-special",
    ANIME_TO_REAL: "anime-to-real"  // 動漫轉真人
  },
  
  MAX_RETRIES: 3,
  POLLING_INTERVAL: 2000,
  POLLING_TIMEOUT: 90000,
  MAX_IMAGES: 4
};

export default {
  async fetch(request, env, ctx) {
    const apiKey = env.API_MASTER_KEY || CONFIG.API_MASTER_KEY;
    const url = new URL(request.url);
    
    if (request.method === 'OPTIONS') return handleCorsPreflight();
    
    // UI 介面
    if (url.pathname === '/') return handleStudioUI(request, apiKey);
    
    // API 路由 (傳入 env 以便存取 KV)
    if (url.pathname.startsWith('/v1/')) return handleApi(request, apiKey, env);
    
    return createErrorResponse(`Path not found: ${url.pathname}`, 404, 'not_found');
  }
};

// ==================== 額度控制邏輯 (KV) ====================

async function checkQuota(ip, env) {
  if (!env.NB_LIMITS) {
    // 如果沒有綁定 KV，預設不限制，避免報錯
    console.warn("NB_LIMITS KV not bound");
    return { allowed: true, remaining: 999, current: 0, key: null };
  }

  const now = new Date();
  // Key 格式: limit:年份-月-日-小時:IP
  const timeKey = `${now.getUTCFullYear()}-${now.getUTCMonth()+1}-${now.getUTCDate()}-${now.getUTCHours()}`;
  const key = `limit:${timeKey}:${ip}`;
  
  let currentUsage = await env.NB_LIMITS.get(key);
  currentUsage = currentUsage ? parseInt(currentUsage) : 0;
  
  if (currentUsage >= CONFIG.HOURLY_LIMIT) {
    return { allowed: false, remaining: 0, current: currentUsage, key: key };
  }
  
  return { 
    allowed: true, 
    remaining: CONFIG.HOURLY_LIMIT - currentUsage, 
    current: currentUsage, 
    key: key 
  };
}

async function incrementQuota(key, currentUsage, count, env) {
  if (!env.NB_LIMITS || !key) return;
  // 設定 TTL 為 7200 秒 (2小時)
  await env.NB_LIMITS.put(key, (currentUsage + count).toString(), { expirationTtl: 7200 });
}

// ==================== 核心功能 ====================

function generateRandomIP() {
  const part1 = Math.floor(Math.random() * 223) + 1;
  const part2 = Math.floor(Math.random() * 256);
  const part3 = Math.floor(Math.random() * 256);
  const part4 = Math.floor(Math.random() * 256);
  if (part1 === 10) return generateRandomIP();
  if (part1 === 192 && part2 === 168) return generateRandomIP();
  if (part1 === 172 && (part2 >= 16 && part2 <= 31)) return generateRandomIP();
  return `${part1}.${part2}.${part3}.${part4}`;
}

function generateFingerprint() {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function getHeaders(fingerprint, fakeIP) {
  return {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "content-type": "application/json",
    "origin": CONFIG.UPSTREAM_ORIGIN,
    "referer": `${CONFIG.UPSTREAM_ORIGIN}/?utm_source=studio`,
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "x-fingerprint-id": fingerprint,
    "priority": "u=1, i",
    "X-Forwarded-For": fakeIP,
    "X-Real-IP": fakeIP,
    "Client-IP": fakeIP,
    "True-Client-IP": fakeIP,
    "X-Client-IP": fakeIP,
    "CF-Connecting-IP": fakeIP
  };
}

async function performGeneration(prompt, aspectRatio, styleId, imageCount = 1, mode = "text-to-image", sourceImage = null, modelId = "nano-banana") {
  let lastError = null;
  for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
    const fingerprint = generateFingerprint();
    const fakeIP = generateRandomIP();
    const headers = getHeaders(fingerprint, fakeIP);
    
    const style = CONFIG.STYLES.find(s => s.id == styleId);
    let finalPrompt = prompt;
    
    // 處理特殊模式的 Prompt
    if (mode === CONFIG.MODES.GHIBLI_SPECIAL) {
      finalPrompt = `${prompt}, Studio Ghibli style, Hayao Miyazaki, anime, hand-drawn, traditional animation`;
    } else if (mode === CONFIG.MODES.ANIME_TO_REAL) {
      finalPrompt = `Transform the anime character into a hyper-realistic real life cosplay photo, 8k resolution, highly detailed, photorealistic, cinematic lighting, ${prompt}`;
    } else if (mode === CONFIG.MODES.IMAGE_TO_FIGURE) {
      if (prompt) {
        finalPrompt = `Transform the character from the reference image into a highly detailed 3D collectible figure, ${prompt}, anime style figurine, premium quality toy with intricate details, studio photography, professional product shot, glossy finish`;
      } else {
        finalPrompt = `Transform the character from the reference image into a highly detailed 3D collectible figure, anime style figurine, premium quality toy with intricate details, studio photography, professional product shot, glossy finish, detailed sculpture`;
      }
    } else if (style && style.value !== 'no-style' && mode !== CONFIG.MODES.IMAGE_EDIT) {
      finalPrompt = `${prompt}, ${style.name} style`;
    }
    
    const payload = {
      prompt: finalPrompt,
      aspectRatio: aspectRatio || "1:1",
      imageCount: Math.min(imageCount, CONFIG.MAX_IMAGES),
      fingerprintId: fingerprint,
      mode: mode,
      model: modelId
    };
    
    // 這些模式需要附帶圖片
    const modesWithImage = [
        CONFIG.MODES.IMAGE_TO_IMAGE, 
        CONFIG.MODES.IMAGE_TO_FIGURE, 
        CONFIG.MODES.IMAGE_EDIT, 
        CONFIG.MODES.GHIBLI_SPECIAL,
        CONFIG.MODES.ANIME_TO_REAL
    ];
    
    if (sourceImage && modesWithImage.includes(mode)) {
      payload.sourceImage = sourceImage;
    }
    
    console.log(`[Attempt ${attempt}] Model: ${modelId}, Mode: ${mode}, IP: ${fakeIP}, HasImage: ${!!sourceImage}`);
    
    try {
      const submitResp = await fetch(CONFIG.SUBMIT_ENDPOINT, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload)
      });
      
      if (!submitResp.ok) throw new Error(`HTTP ${submitResp.status}`);
      const submitData = await submitResp.json();
      
      if (submitData.code === -1) {
        console.warn(`[Attempt ${attempt}] Blocked: ${submitData.message}`);
        lastError = new Error(`IP/Device Blocked: ${submitData.message}`);
        continue;
      }
      
      if (submitData.code !== 0 || !submitData.data?.taskId) {
        throw new Error(`API Error: ${JSON.stringify(submitData)}`);
      }
      
      return await pollTask(submitData.data.taskId, fingerprint, headers);
    } catch (e) {
      lastError = e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw lastError || new Error("Max retries exceeded");
}

async function pollTask(taskId, fingerprint, headers) {
  const startTime = Date.now();
  while (Date.now() - startTime < CONFIG.POLLING_TIMEOUT) {
    await new Promise(r => setTimeout(r, CONFIG.POLLING_INTERVAL));
    const pollUrl = `${CONFIG.SUBMIT_ENDPOINT}?taskId=${taskId}&fingerprintId=${fingerprint}`;
    const pollResp = await fetch(pollUrl, { method: "GET", headers: headers });
    if (!pollResp.ok) continue;
    const pollData = await pollResp.json();
    const task = pollData.data?.task;
    if (!task) continue;
    if (task.status === 'completed') {
      let images = [];
      if (task.image_url) images.push(task.image_url);
      if (task.image_urls) {
        try {
          const parsed = typeof task.image_urls === 'string' ? JSON.parse(task.image_urls) : task.image_urls;
          if (Array.isArray(parsed)) images = parsed;
        } catch (e) {}
      }
      return [...new Set(images)];
    } else if (task.status === 'failed') {
      throw new Error(`Generation Failed: ${task.result || 'Unknown error'}`);
    }
  }
  throw new Error("Polling timeout");
}

// ==================== API 處理 ====================

async function handleApi(request, apiKey, env) {
  const authHeader = request.headers.get('Authorization');
  if (apiKey && apiKey !== "your-secret-key-here") {
    if (!authHeader || !authHeader.startsWith('Bearer ')) 
      return createErrorResponse('Unauthorized', 401, 'unauthorized');
    if (authHeader.substring(7) !== apiKey) 
      return createErrorResponse('Invalid Key', 403, 'invalid_api_key');
  }
  
  const url = new URL(request.url);
  const requestId = `req-${crypto.randomUUID()}`;
  
  // 用戶額度查詢 API
  if (url.pathname === '/v1/user/quota') {
    const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
    const quota = await checkQuota(ip, env);
    return new Response(JSON.stringify(quota), { headers: corsHeaders({'Content-Type': 'application/json'}) });
  }

  if (url.pathname === '/v1/models') return handleModelsRequest();
  if (url.pathname === '/v1/chat/completions') return handleChatCompletions(request, requestId);
  if (url.pathname === '/v1/images/generations') return handleImageGenerations(request, requestId, env);
  
  return createErrorResponse('Not Found', 404, 'not_found');
}

function handleModelsRequest() {
  return new Response(JSON.stringify({
    object: 'list',
    data: CONFIG.MODELS.map(id => ({ id, object: 'model', created: Date.now(), owned_by: 'nanobanana' }))
  }), { headers: corsHeaders({ 'Content-Type': 'application/json' }) });
}

async function handleChatCompletions(request, requestId) {
  try {
    const body = await request.json();
    const messages = body.messages || [];
    const lastMsg = messages.reverse().find(m => m.role === 'user');
    if (!lastMsg) throw new Error("No user message found");
    const prompt = lastMsg.content;
    let aspectRatio = "1:1";
    let cleanPrompt = prompt;
    const arMatch = prompt.match(/--ar\s+(\d+:\d+)/);
    if (arMatch) {
      aspectRatio = arMatch[1];
      cleanPrompt = prompt.replace(arMatch[0], "").trim();
    }
    const images = await performGeneration(cleanPrompt, aspectRatio, 0, 1);
    const imageUrl = images[0];
    const markdown = `![Generated Image](${imageUrl})\n\n[下載原圖](${imageUrl})`;
    
    if (body.stream) {
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const encoder = new TextEncoder();
      (async () => {
        const chunk = { id: requestId, object: 'chat.completion.chunk', created: Math.floor(Date.now()/1000), model: body.model || CONFIG.DEFAULT_MODEL, choices: [{ index: 0, delta: { content: markdown }, finish_reason: null }] };
        await writer.write(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
        const endChunk = { id: requestId, object: 'chat.completion.chunk', created: Math.floor(Date.now()/1000), model: body.model || CONFIG.DEFAULT_MODEL, choices: [{ index: 0, delta: {}, finish_reason: 'stop' }] };
        await writer.write(encoder.encode(`data: ${JSON.stringify(endChunk)}\n\n`));
        await writer.write(encoder.encode('data: [DONE]\n\n'));
        await writer.close();
      })();
      return new Response(readable, { headers: corsHeaders({ 'Content-Type': 'text/event-stream' }) });
    } else {
      return new Response(JSON.stringify({ id: requestId, object: "chat.completion", created: Math.floor(Date.now()/1000), model: body.model || CONFIG.DEFAULT_MODEL, choices: [{ index: 0, message: { role: "assistant", content: markdown }, finish_reason: "stop" }] }), { headers: corsHeaders({ 'Content-Type': 'application/json' }) });
    }
  } catch (e) {
    return createErrorResponse(e.message, 500, 'generation_failed');
  }
}

async function handleImageGenerations(request, requestId, env) {
  try {
    const body = await request.json();
    const prompt = body.prompt;
    const n = Math.min(body.n || 1, CONFIG.MAX_IMAGES);
    const size = body.size || "1024x1024";
    const mode = body.mode || CONFIG.MODES.TEXT_TO_IMAGE;
    const sourceImage = body.image;
    const modelId = body.model || "nano-banana";
    
    let aspectRatio = "1:1";
    if (size === "1024x1792") aspectRatio = "9:16";
    if (size === "1792x1024") aspectRatio = "16:9";
    if (size === "1536x1152") aspectRatio = "4:3";
    if (size === "1152x1536") aspectRatio = "3:4";
    if (size === "2048x878") aspectRatio = "21:9";
    
    // [額度邏輯] 檢查是否為受限模型
    const isRestrictedModel = CONFIG.QUOTA_TARGETS.some(k => modelId.toLowerCase().includes(k));
    let quotaKey = null;
    let currentUsage = 0;

    if (isRestrictedModel) {
      const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
      const quota = await checkQuota(ip, env);
      
      if (!quota.allowed) {
        return createErrorResponse(
          `Nano Banana 模型每小時限額 (${CONFIG.HOURLY_LIMIT}張) 已滿，請切換 FLUX 或 SD 模型繼續創作！(下個整點重置)`, 
          429, 
          'quota_exceeded'
        );
      }
      quotaKey = quota.key;
      currentUsage = quota.current;
    }

    const styleId = body.style || 0;
    const images = await performGeneration(prompt, aspectRatio, styleId, n, mode, sourceImage, modelId);
    
    // [額度邏輯] 只有在成功生成後才扣除額度
    if (isRestrictedModel && quotaKey) {
      await incrementQuota(quotaKey, currentUsage, n, env);
    }
    
    return new Response(JSON.stringify({
      created: Math.floor(Date.now() / 1000),
      data: images.map(url => ({ url: url }))
    }), { headers: corsHeaders({ 'Content-Type': 'application/json' }) });
  } catch (e) {
    return createErrorResponse(e.message, 500, 'generation_failed');
  }
}

function createErrorResponse(message, status, code) {
  return new Response(JSON.stringify({ error: { message, type: 'api_error', code } }), {
    status, headers: corsHeaders({ 'Content-Type': 'application/json' })
  });
}

function handleCorsPreflight() { 
  return new Response(null, { status: 204, headers: corsHeaders() }); 
}

function corsHeaders(headers = {}) {
  return { 
    ...headers, 
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 
    'Access-Control-Allow-Headers': 'Content-Type, Authorization' 
  };
}

// ==================== UI 界面 (整合版) ====================

function handleStudioUI(request, apiKey) {
  const origin = new URL(request.url).origin;
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${CONFIG.PROJECT_NAME} - AI圖像創作工作室</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--primary:#667eea;--secondary:#764ba2;--bg:#0f0f23;--card:#1a1a2e;--text:#e4e4e7;--border:#2d2d44;--hover:#25253f;--success:#10b981;--error:#ef4444}
body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:linear-gradient(135deg,var(--bg),#1a1432);color:var(--text);min-height:100vh;padding:20px}
.container{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:420px 1fr;gap:20px}
@media(max-width:968px){.container{grid-template-columns:1fr}}
.card{background:var(--card);border-radius:16px;border:1px solid var(--border);padding:24px}
.header{display:flex;align-items:center;gap:12px;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--border)}
.logo{font-size:24px;background:linear-gradient(135deg,var(--primary),#f093fb);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:800}
.version{background:linear-gradient(135deg,var(--primary),var(--secondary));color:#fff;padding:4px 12px;border-radius:12px;font-size:11px;font-weight:600}
.home-btn{text-decoration:none;font-size:20px;padding:8px 12px;background:var(--card);border:1px solid var(--border);border-radius:8px;margin-right:12px;transition:all .2s;cursor:pointer;display:flex;align-items:center;justify-content:center}
.home-btn:hover{background:var(--hover);border-color:var(--primary);transform:scale(1.05)}
.label{display:block;font-size:14px;font-weight:500;margin-bottom:8px}
textarea,select{width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:12px;border-radius:8px;font-size:14px;font-family:inherit}
textarea{min-height:100px;resize:vertical}
textarea:focus,select:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(102,126,234,0.1)}
.btn{width:100%;padding:16px;background:linear-gradient(135deg,var(--primary),var(--secondary));color:#fff;border:none;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;transition:all .3s;box-shadow:0 4px 20px rgba(102,126,234,0.4)}
.btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 30px rgba(102,126,234,0.6)}
.btn:disabled{opacity:.6;cursor:not-allowed}
.mode-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
.mode-btn{background:var(--bg);border:2px solid var(--border);color:var(--text);padding:14px 10px;border-radius:10px;cursor:pointer;font-size:13px;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:6px}
.mode-btn:hover{background:var(--hover);border-color:var(--primary)}
.mode-btn.active{background:linear-gradient(135deg,var(--primary),var(--secondary));border-color:var(--primary);color:#fff}
.mode-btn .emoji{font-size:22px}
.upload-area{border:2px dashed var(--border);border-radius:12px;padding:24px;text-align:center;cursor:pointer;transition:all .3s;background:var(--bg);margin-bottom:20px}
.upload-area:hover{border-color:var(--primary);background:var(--hover)}
.upload-area.has-image{padding:0;border:2px solid var(--primary)}
.upload-preview{width:100%;border-radius:10px;display:block}
.upload-placeholder{color:#888}
.upload-placeholder svg{width:48px;height:48px;margin:0 auto 8px;opacity:.5}
.info{padding:16px;background:var(--bg);border-radius:8px;margin-top:24px}
.info code{display:block;font-size:10px;color:var(--primary);word-break:break-all;margin-top:6px;padding:8px;background:rgba(0,0,0,0.3);border-radius:4px;cursor:pointer}
.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
.gallery-item{background:var(--card);border-radius:12px;overflow:hidden;border:1px solid var(--border);transition:all .3s}
.gallery-item:hover{transform:translateY(-4px);box-shadow:0 8px 30px rgba(0,0,0,0.3)}
.gallery-item img{width:100%;display:block;background:var(--bg)}
.item-info{padding:16px}
.badge{display:inline-block;background:var(--bg);padding:4px 10px;border-radius:6px;font-size:11px;color:#888;border:1px solid var(--border);margin-right:6px;margin-bottom:6px}
.prompt{font-size:13px;color:#888;margin:8px 0 12px;line-height:1.5}
.action-btns{display:flex;gap:8px}
.action-btn{flex:1;padding:8px 12px;background:var(--bg);border:1px solid var(--border);color:var(--text);border-radius:6px;cursor:pointer;font-size:12px;transition:all .2s;text-align:center}
.action-btn:hover{background:var(--primary);border-color:var(--primary);color:#fff}
.empty{text-align:center;padding:80px 20px;color:#666}
.empty svg{width:64px;height:64px;margin-bottom:16px;opacity:.3}
.spinner{display:inline-block;width:14px;height:14px;border:2px solid #888;border-top-color:#fff;border-radius:50%;animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.toast{position:fixed;bottom:20px;right:20px;background:var(--card);border:1px solid var(--border);padding:16px 20px;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.5);z-index:1000;animation:slideIn .3s ease;max-width:350px}
@keyframes slideIn{from{transform:translateX(400px);opacity:0}to{transform:translateX(0);opacity:1}}
.toast.success{border-left:4px solid var(--success)}
.toast.error{border-left:4px solid var(--error)}
.hint{font-size:12px;color:#888;margin-top:6px;font-style:italic}
</style>
</head>
<body>
<div class="container">
<div>
<div class="card">
<div class="header">
<a href="${CONFIG.HOME_URL}" class="home-btn" title="回到主頁">🏠</a>
<div class="logo">🍌 ${CONFIG.PROJECT_NAME}</div>
<div id="quotaBadge" style="margin-left:auto; background:#222; padding:6px 12px; border-radius:20px; font-size:12px; border:1px solid #333; display:flex; align-items:center; gap:6px;">
  <span id="quotaLabel">⏳ Nano 額度:</span>
  <span id="quotaCount" style="color:var(--success); font-weight:bold;">計算中...</span>
</div>
</div>
<div class="mode-grid">
<button class="mode-btn active" data-mode="text-to-image" onclick="selectMode(this)">
<span class="emoji">✍️</span>
<span>文生圖</span>
</button>
<button class="mode-btn" data-mode="ghibli-special" onclick="selectMode(this)">
<span class="emoji">🌸</span>
<span>吉卜力</span>
</button>
<button class="mode-btn" data-mode="image-to-image" onclick="selectMode(this)">
<span class="emoji">🖼️</span>
<span>圖生圖</span>
</button>
<button class="mode-btn" data-mode="anime-to-real" onclick="selectMode(this)">
<span class="emoji">💃</span>
<span>轉真人</span>
</button>
<button class="mode-btn" data-mode="image-to-figure" onclick="selectMode(this)">
<span class="emoji">🎎</span>
<span>圖生手辦</span>
</button>
<button class="mode-btn" data-mode="image-edit" onclick="selectMode(this)">
<span class="emoji">🪄</span>
<span>智能修圖</span>
</button>
</div>
<div id="uploadSection" style="display:none">
<label class="label">📸 上傳圖片</label>
<div class="upload-area" id="uploadArea" onclick="document.getElementById('fileInput').click()">
<div class="upload-placeholder" id="uploadPlaceholder">
<svg viewBox="0 0 24 24" fill="currentColor">
<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
</svg>
<p style="font-size:14px;margin-bottom:4px">點擊上傳圖片</p>
<p style="font-size:12px;color:#666">支持 JPG, PNG, WebP</p>
</div>
<img id="uploadPreview" class="upload-preview" style="display:none">
</div>
<input type="file" id="fileInput" accept="image/*" style="display:none" onchange="handleFileUpload(event)">
</div>
<div style="margin-bottom:20px">
<label class="label">🤖 AI 模型 (選擇 Nano 才會扣額度)</label>
<select id="model">
${CONFIG.AI_MODELS.map(m => `<option value="${m.id}">${m.emoji} ${m.name}</option>`).join('')}
</select>
</div>
<div style="margin-bottom:20px">
<label class="label">💭 提示詞 <span id="promptHint" class="hint"></span></label>
<textarea id="prompt" placeholder="描述你想生成的圖像,例如:一隻可愛的貓咪坐在月球上看地球"></textarea>
</div>
<div style="margin-bottom:20px" id="styleSection">
<label class="label">🎨 風格</label>
<select id="style">
${CONFIG.STYLES.map(s => `<option value="${s.id}">${s.emoji} ${s.name}</option>`).join('')}
</select>
</div>
<div style="margin-bottom:20px">
<label class="label">📐 比例</label>
<select id="ratio">
${CONFIG.RATIOS.map(r => `<option value="${r.value}">${r.icon} ${r.label} (${r.value})</option>`).join('')}
</select>
</div>
<div style="margin-bottom:20px">
<label class="label">🔢 數量</label>
<select id="count">
<option value="1">1 張</option>
<option value="2">2 張</option>
<option value="3">3 張</option>
<option value="4">4 張</option>
</select>
</div>
<button class="btn" id="genBtn" onclick="generate()">🚀 開始創作</button>
<div class="info">
<div style="font-size:11px;color:#888;margin-bottom:6px">🔑 API 密鑰</div>
<code onclick="copy('${apiKey}')">${apiKey}</code>
<div style="font-size:11px;color:#888;margin:12px 0 6px">🌐 API 端點</div>
<code onclick="copy('${origin}/v1/images/generations')">${origin}/v1/images/generations</code>
</div>
</div>
</div>
<div>
<div class="card">
<div class="header">
<div style="flex:1">
<h2 style="font-size:20px;margin-bottom:4px">🖼️ 創作畫廊</h2>
<p style="font-size:13px;color:#888">你的 AI 藝術收藏</p>
</div>
<button onclick="clearHistory()" class="action-btn" style="padding:8px 16px">清空</button>
</div>
<div id="gallery" class="gallery">
<div class="empty">
<svg viewBox="0 0 24 24" fill="currentColor">
<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
</svg>
<p>還沒有創作作品</p>
<p style="font-size:12px;margin-top:8px;color:#555">選擇模式並輸入提示詞開始創作吧!</p>
</div>
</div>
</div>
</div>
</div>
<script>
const API="${origin}/v1/images/generations";
const KEY="${apiKey}";
const CFG=${JSON.stringify(CONFIG)};
let mode="text-to-image";
let uploadedImage=null;
let history=JSON.parse(localStorage.getItem('nbHistory')||'[]');
let selectedModel=localStorage.getItem('nbSelectedModel')||'nano-banana';

document.getElementById('model').value=selectedModel;

function selectMode(btn){
  document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  mode=btn.dataset.mode;
  
  const needsImage = ['image-to-image', 'image-to-figure', 'image-edit', 'anime-to-real'].includes(mode);
  
  document.getElementById('uploadSection').style.display=needsImage?'block':'none';
  document.getElementById('styleSection').style.display=mode==='ghibli-special'?'none':'block';
  
  const promptHint=document.getElementById('promptHint');
  const promptInput=document.getElementById('prompt');
  
  if(mode==='image-to-figure'){
    promptHint.textContent='(可選,留空自動生成)';
    promptInput.placeholder='可留空或輸入額外描述';
  } else if (mode === 'anime-to-real') {
    promptHint.textContent = '(可選,留空自動轉真人)';
    promptInput.placeholder = '描述特定的服裝或場景細節 (例如: wearing a red dress, in a cyberpunk city)';
  } else if (mode === 'image-edit') {
    promptHint.textContent = '(必填)';
    promptInput.placeholder = '描述你想如何修改圖片 (例如: 把頭髮變成紅色, 背景換成沙灘)';
  } else {
    promptHint.textContent='';
    promptInput.placeholder='描述你想生成的圖像,例如:一隻可愛的貓咪坐在月球上看地球';
  }
}

function handleFileUpload(e){
const file=e.target.files[0];
if(!file)return;
if(!file.type.startsWith('image/')){showToast('請上傳圖片文件','error');return}
if(file.size>10*1024*1024){showToast('圖片大小不能超過 10MB','error');return}
const reader=new FileReader();
reader.onload=ev=>{
uploadedImage=ev.target.result;
console.log('✅ 圖片已加載, 大小:',uploadedImage.length,'字節');
document.getElementById('uploadPlaceholder').style.display='none';
const preview=document.getElementById('uploadPreview');
preview.src=uploadedImage;
preview.style.display='block';
document.getElementById('uploadArea').classList.add('has-image');
showToast('圖片上傳成功','success')
};
reader.onerror=()=>showToast('圖片讀取失敗','error');
reader.readAsDataURL(file);
}

function render(){
const g=document.getElementById('gallery');
if(!history.length){
g.innerHTML='<div class="empty"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg><p>還沒有創作作品</p><p style="font-size:12px;margin-top:8px;color:#555">選擇模式並輸入提示詞開始創作吧!</p></div>';
return;
}
const modeNames = {
  'text-to-image': '文生圖',
  'ghibli-special': '吉卜力',
  'image-to-image': '圖生圖',
  'image-to-figure': '圖生手辦',
  'anime-to-real': '轉真人',
  'image-edit': '修圖'
};
g.innerHTML=history.map(function(h){
return '<div class="gallery-item"><img src="'+h.url+'" alt="'+h.prompt+'" loading="lazy"><div class="item-info"><div><span class="badge">'+h.mode+'</span><span class="badge">'+h.model+'</span><span class="badge">'+h.style+'</span><span class="badge">'+h.ratio+'</span></div><div class="prompt">'+h.prompt+'</div><div class="action-btns"><button class="action-btn" onclick="reuse(\\''+h.prompt.replace(/'/g,"\\'")+'\\')">復用</button><button class="action-btn" onclick="download(\\''+h.url+'\\','+h.id+')">下載</button><button class="action-btn" onclick="window.open(\\''+h.url+'\\',\\'_blank\\')">查看</button></div></div></div>';
}).join('');
}

async function updateQuota() {
  const modelSelect = document.getElementById('model');
  const selectedModel = modelSelect.value;
  // 檢查是否為受限模型
  const isNano = CFG.QUOTA_TARGETS.some(t => selectedModel.toLowerCase().includes(t));
  
  const label = document.getElementById('quotaLabel');
  const count = document.getElementById('quotaCount');

  if (!isNano) {
    label.textContent = "🚀 免費模型:";
    count.textContent = "不限額";
    count.style.color = "#3b82f6";
    return true; 
  }

  label.textContent = "⏳ Nano 額度:";
  try {
    const res = await fetch(\`\${window.location.origin}/v1/user/quota\`);
    const data = await res.json();
    
    if (data.allowed) {
      count.textContent = \`\${data.remaining} / \${CFG.HOURLY_LIMIT}\`;
      count.style.color = '#10b981';
    } else {
      count.textContent = \`0 / \${CFG.HOURLY_LIMIT} (下小時重置)\`;
      count.style.color = '#ef4444';
    }
    return data.allowed;
  } catch(e) { console.error(e); }
}

async function generate(){
  // 先檢查額度
  const allowed = await updateQuota();
  if (allowed === false) {
    showToast('Nano Banana 模型每小時額度已用完，請切換其他模型！', 'error');
    return;
  }

  let prompt=document.getElementById('prompt').value.trim();
  const needsImage = ['image-to-image', 'image-to-figure', 'image-edit', 'anime-to-real'].includes(mode);
  
  if(mode==='image-to-figure' && !prompt){
    prompt='';
    console.log('🎎 圖生手辦模式:將基於上傳圖片中的角色自動生成');
  } else if (mode === 'anime-to-real' && !prompt) {
    prompt = '';
  }
  
  if(!prompt && !['image-to-figure', 'anime-to-real'].includes(mode)){showToast('請輸入提示詞','error');return}
  if(needsImage && !uploadedImage){showToast('請先上傳圖片','error');return}
  
  const btn=document.getElementById('genBtn');
  btn.disabled=true;
  btn.innerHTML='<span class="spinner"></span> 生成中...';
  
  try{
    const modelSelect=document.getElementById('model');
    selectedModel=modelSelect.value;
    localStorage.setItem('nbSelectedModel',selectedModel);
    const modelName=modelSelect.options[modelSelect.selectedIndex].text;
    const selectedStyleId=parseInt(document.getElementById('style').value)||0;
    const style=CFG.STYLES.find(s=>s.id===selectedStyleId)||CFG.STYLES[0];
    const ratio=CFG.RATIOS.find(r=>r.value===document.getElementById('ratio').value)||CFG.RATIOS[0];
    const count=parseInt(document.getElementById('count').value)||1;
    
    const payload={
      prompt,
      style:mode==='ghibli-special'?9:style.id,
      size:ratio.size,
      n:count,
      mode,
      model:selectedModel
    };
    
    if(uploadedImage){
      payload.image=uploadedImage;
    }
    
    const res=await fetch(API,{
      method:'POST',
      headers:{'Authorization':'Bearer '+KEY,'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    
    const data=await res.json();
    if(!res.ok)throw new Error(data.error?.message||'生成失敗');
    
    const modeNames = {
      'text-to-image': '文生圖',
      'ghibli-special': '吉卜力',
      'image-to-image': '圖生圖',
      'image-to-figure': '圖生手辦',
      'anime-to-real': '轉真人',
      'image-edit': '修圖'
    };
    
    const displayPrompt = (!prompt && (mode==='image-to-figure'||mode==='anime-to-real')) 
      ? (mode==='image-to-figure'?'基於上傳角色生成的3D手辦':'基於動漫角色轉真人') 
      : prompt;
      
    data.data.forEach(img=>{
      history.unshift({
        id:Date.now()+Math.random(),
        url:img.url,
        prompt:displayPrompt,
        mode:modeNames[mode]||mode,
        model:modelName,
        style:mode==='ghibli-special'?'吉卜力':style.name,
        ratio:ratio.value,
        time:new Date().toLocaleString()
      })
    });
    
    if(history.length>50)history=history.slice(0,50);
    localStorage.setItem('nbHistory',JSON.stringify(history));
    render();
    showToast('成功生成 '+data.data.length+' 張圖片!','success');
    
    // 成功後再次更新額度顯示
    updateQuota();
    
  }catch(e){
    console.error('❌ 生成錯誤:',e);
    showToast('生成失敗: '+e.message,'error');
  }finally{
    btn.disabled=false;
    btn.innerHTML='🚀 開始創作'
  }
}

function reuse(p){document.getElementById('prompt').value=p;window.scrollTo({top:0,behavior:'smooth'});showToast('已填充提示詞','success')}
function download(url,id){fetch(url).then(r=>r.blob()).then(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='nanobanana-'+id+'.png';a.click();showToast('開始下載','success')}).catch(()=>showToast('下載失敗','error'))}
function clearHistory(){if(!confirm('確定清空所有歷史?'))return;history=[];localStorage.removeItem('nbHistory');render();showToast('已清空歷史','success')}
function copy(t){navigator.clipboard.writeText(t).then(()=>showToast('已複製','success')).catch(()=>showToast('複製失敗','error'))}
function showToast(msg,type='success'){const toast=document.createElement('div');toast.className='toast '+type;toast.textContent=msg;document.body.appendChild(toast);setTimeout(()=>toast.remove(),3000)}

document.getElementById('model').addEventListener('change', updateQuota);

// 初始化
render();
updateQuota();
</script>
</body>
</html>`;
  
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
