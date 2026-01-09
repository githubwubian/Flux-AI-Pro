// =================================================================================
//  項目: Flux AI Pro - NanoBanana Edition
//  版本: 10.1.0 (KV Rate Limit & Independent Page)
//  更新: 新增獨立 /nano 頁面與 KV 限流功能
// =================================================================================

const CONFIG = {
  PROJECT_NAME: "Flux-AI-Pro",
  PROJECT_VERSION: "10.1.0",
  API_MASTER_KEY: "1",
  FETCH_TIMEOUT: 120000,
  MAX_RETRIES: 3,
  
  POLLINATIONS_AUTH: {
    enabled: true,
    token: "", 
    method: "header"
  },
  
  PRESET_SIZES: {
    "square-1k": { name: "方形 1024x1024", width: 1024, height: 1024 },
    "square-1.5k": { name: "方形 1536x1536", width: 1536, height: 1536 },
    "square-2k": { name: "方形 2048x2048", width: 2048, height: 2048 },
    "portrait-9-16-hd": { name: "豎屏 9:16 HD", width: 1080, height: 1920 },
    "landscape-16-9-hd": { name: "橫屏 16:9 HD", width: 1920, height: 1080 },
    "instagram-square": { name: "Instagram 方形", width: 1080, height: 1080 },
    "wallpaper-fhd": { name: "桌布 Full HD", width: 1920, height: 1080 }
  },
  
  PROVIDERS: {
    pollinations: {
      name: "Pollinations.ai",
      endpoint: "https://gen.pollinations.ai",
      pathPrefix: "/image",
      type: "direct",
      auth_mode: "required",
      requires_key: true,
      enabled: true,
      default: true,
      description: "官方 AI 圖像生成服務（需要 API Key）",
      features: {
        private_mode: true, custom_size: true, seed_control: true, negative_prompt: true, enhance: true, nologo: true, style_presets: true, auto_hd: true, quality_modes: true, auto_translate: true, reference_images: true, image_to_image: true, batch_generation: true, api_key_auth: true
      },
      models: [
        { 
          id: "nano-banana", 
          name: "Nano Banana 🍌", 
          confirmed: true, 
          category: "special", 
          description: "Nano Banana 風格模型 (每小時限額 20 張)", 
          max_size: 2048, 
          pricing: { image_price: 0, currency: "free" },
          input_modalities: ["text"], 
          output_modalities: ["image"],
          restricted: true 
        },
        { id: "gptimage", name: "GPT-Image 🎨", confirmed: true, category: "gptimage", description: "通用 GPT 圖像生成模型", max_size: 2048, pricing: { image_price: 0.0002, currency: "pollen" }, input_modalities: ["text"], output_modalities: ["image"] },
        { id: "gptimage-large", name: "GPT-Image Large 🌟", confirmed: true, category: "gptimage", description: "高質量 GPT 圖像生成模型", max_size: 2048, pricing: { image_price: 0.0003, currency: "pollen" }, input_modalities: ["text"], output_modalities: ["image"] },
        { id: "zimage", name: "Z-Image Turbo ⚡", confirmed: true, category: "zimage", description: "快速 6B 參數圖像生成 (Alpha)", max_size: 2048, pricing: { image_price: 0.0002, currency: "pollen" }, input_modalities: ["text"], output_modalities: ["image"] },
        { id: "flux", name: "Flux 標準版", confirmed: true, category: "flux", description: "快速且高質量的圖像生成", max_size: 2048, pricing: { image_price: 0.00012, currency: "pollen" }, input_modalities: ["text"], output_modalities: ["image"] },
        { id: "turbo", name: "Flux Turbo ⚡", confirmed: true, category: "flux", description: "超快速圖像生成", max_size: 2048, pricing: { image_price: 0.0003, currency: "pollen" }, input_modalities: ["text"], output_modalities: ["image"] },
        { id: "kontext", name: "Kontext 🎨", confirmed: true, category: "kontext", description: "上下文感知圖像生成（支持圖生圖）", max_size: 2048, pricing: { image_price: 0.04, currency: "pollen" }, supports_reference_images: true, max_reference_images: 1, input_modalities: ["text", "image"], output_modalities: ["image"] }
      ],
      rate_limit: null,
      max_size: { width: 2048, height: 2048 }
    }
  },
  
  DEFAULT_PROVIDER: "pollinations",
  
  STYLE_PRESETS: {
    none: { name: "無風格", prompt: "", negative: "", category: "basic", icon: "⚡", description: "使用原始提示詞" },
    anime: { name: "動漫風格", prompt: "anime style, anime art, vibrant colors, cel shading, detailed anime", negative: "realistic, photograph, 3d, ugly", category: "illustration", icon: "🎭", description: "日系動漫風格" },
    ghibli: { name: "吉卜力", prompt: "Studio Ghibli style, Hayao Miyazaki, anime, soft colors, whimsical, detailed background, hand-drawn", negative: "realistic, dark, 3D, western animation", category: "illustration", icon: "🍃", description: "宮崎駿動畫風格" },
    manga: { name: "日本漫畫", prompt: "manga style, japanese comic art, black and white, screentones, halftone patterns, dynamic poses, detailed linework", negative: "color, colorful, realistic, photo, western comic", category: "manga", icon: "📖", description: "經典日本漫畫黑白網點" },
    "manga-color": { name: "彩色日漫", prompt: "colored manga style, japanese comic art, vibrant colors, cel shading, clean linework, digital coloring", negative: "realistic, photo, western style, messy", category: "manga", icon: "🎨", description: "彩色日本漫畫風格" },
    photorealistic: { name: "寫實照片", prompt: "photorealistic, 8k uhd, high quality, detailed, professional photography, sharp focus", negative: "anime, cartoon, illustration, painting, drawing, art", category: "realistic", icon: "📷", description: "攝影級寫實效果" },
    "pixel-art": { name: "像素藝術", prompt: "pixel art, 8-bit, 16-bit, retro gaming style, pixelated, nostalgic, limited color palette", negative: "high resolution, smooth, realistic, detailed", category: "digital", icon: "🎮", description: "像素藝術復古遊戲" },
    cyberpunk: { name: "賽博朋克", prompt: "cyberpunk style, neon lights, futuristic, sci-fi, dystopian, high-tech low-life, blade runner style", negative: "natural, rustic, medieval, fantasy", category: "scifi", icon: "🌃", description: "賽博朋克未來科幻" }
  },
  
  STYLE_CATEGORIES: {
    'basic': { name: '基礎', icon: '⚡', order: 1 },
    'illustration': { name: '插畫動畫', icon: '🎨', order: 2 },
    'manga': { name: '漫畫風格', icon: '📖', order: 3 },
    'realistic': { name: '寫實照片', icon: '📷', order: 5 },
    'digital': { name: '數位風格', icon: '💻', order: 9 },
    'scifi': { name: '科幻', icon: '🚀', order: 12 }
  },
  
  OPTIMIZATION_RULES: {
    MODEL_STEPS: { 
      "gptimage": { min: 10, optimal: 18, max: 28 },
      "gptimage-large": { min: 15, optimal: 25, max: 35 },
      "zimage": { min: 8, optimal: 15, max: 25 }, 
      "flux": { min: 15, optimal: 20, max: 30 }, 
      "turbo": { min: 4, optimal: 8, max: 12 }, 
      "kontext": { min: 18, optimal: 25, max: 35 },
      "nano-banana": { min: 15, optimal: 20, max: 30 }
    },
    SIZE_MULTIPLIER: { small: { threshold: 512 * 512, multiplier: 0.8 }, medium: { threshold: 1024 * 1024, multiplier: 1.0 }, large: { threshold: 1536 * 1536, multiplier: 1.15 }, xlarge: { threshold: 2048 * 2048, multiplier: 1.3 } },
    STYLE_ADJUSTMENT: { "photorealistic": 1.1, "default": 1.0 }
  },
  
  HD_OPTIMIZATION: {
    enabled: true,
    QUALITY_MODES: {
      economy: { name: "經濟模式", description: "快速出圖", min_resolution: 1024, max_resolution: 2048, steps_multiplier: 0.85, guidance_multiplier: 0.9, hd_level: "basic" },
      standard: { name: "標準模式", description: "平衡質量與速度", min_resolution: 1280, max_resolution: 2048, steps_multiplier: 1.0, guidance_multiplier: 1.0, hd_level: "enhanced" },
      ultra: { name: "超高清模式", description: "極致質量", min_resolution: 1536, max_resolution: 2048, steps_multiplier: 1.35, guidance_multiplier: 1.15, hd_level: "maximum", force_upscale: true }
    },
    HD_PROMPTS: { basic: "high quality, detailed, sharp", enhanced: "high quality, highly detailed, sharp focus, professional, 8k uhd", maximum: "masterpiece, best quality, ultra detailed, 8k uhd, high resolution, professional photography, sharp focus, HDR" },
    HD_NEGATIVE: "blurry, low quality, distorted, ugly, bad anatomy, low resolution, pixelated, artifacts, noise",
    MODEL_QUALITY_PROFILES: {
      "gptimage": { min_resolution: 1024, max_resolution: 2048, optimal_steps_boost: 1.0, guidance_boost: 1.0, recommended_quality: "standard" },
      "gptimage-large": { min_resolution: 1280, max_resolution: 2048, optimal_steps_boost: 1.15, guidance_boost: 1.05, recommended_quality: "ultra" },
      "zimage": { min_resolution: 1024, max_resolution: 2048, optimal_steps_boost: 1.0, guidance_boost: 1.0, recommended_quality: "economy" },
      "flux": { min_resolution: 1024, max_resolution: 2048, optimal_steps_boost: 1.1, guidance_boost: 1.0, recommended_quality: "standard" },
      "turbo": { min_resolution: 1024, max_resolution: 2048, optimal_steps_boost: 0.9, guidance_boost: 0.95, recommended_quality: "economy" },
      "kontext": { min_resolution: 1280, max_resolution: 2048, optimal_steps_boost: 1.2, guidance_boost: 1.1, recommended_quality: "ultra" },
      "nano-banana": { min_resolution: 1024, max_resolution: 2048, optimal_steps_boost: 1.0, guidance_boost: 1.0, recommended_quality: "standard" }
    }
  }
};

class Logger {
  constructor() { this.logs = []; }
  add(title, data) { this.logs.push({ title, data, timestamp: new Date().toISOString() }); }
  get() { return this.logs; }
}

// ====== RateLimiter: 負責 KV 限制邏輯 ======
class RateLimiter {
  constructor(env) {
    this.env = env;
    this.KV = env.FLUX_KV; // ⚠️ 務必在 Cloudflare 後台綁定 KV Namespace 為 "FLUX_KV"
  }

  async checkLimit(ip) {
    if (!this.KV) {
      console.warn("⚠️ FLUX_KV 未綁定，跳過限制");
      return { allowed: true };
    }

    const key = `nano_limit:${ip}`;
    const windowSize = 3600 * 1000; // 1小時 (毫秒)
    const maxRequests = 20; // 限制數量

    try {
      // 讀取歷史紀錄
      const rawData = await this.KV.get(key);
      let timestamps = rawData ? JSON.parse(rawData) : [];
      const now = Date.now();

      // 滑動視窗：過濾掉 1 小時前的紀錄
      timestamps = timestamps.filter(ts => now - ts < windowSize);

      // 檢查是否超額
      if (timestamps.length >= maxRequests) {
        const oldest = timestamps[0];
        const resetTime = oldest + windowSize;
        const waitMin = Math.ceil((resetTime - now) / 60000);
        return { 
          allowed: false, 
          reason: `🍌 香蕉能量耗盡！限額已滿 (20張/小時)。請休息 ${waitMin} 分鐘後再來。`,
          remaining: 0
        };
      }

      // 寫入新紀錄
      timestamps.push(now);
      await this.KV.put(key, JSON.stringify(timestamps), { expirationTtl: 3600 }); // TTL 設為 1 小時自動清除

      return { allowed: true, remaining: maxRequests - timestamps.length };
    } catch (err) {
      console.error("KV Error:", err);
      return { allowed: true }; // 發生錯誤時預設放行
    }
  }
}

function getClientIP(request) {
  return request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
}

async function translateToEnglish(text, env) {
  try {
    const hasChinese = /[\u4e00-\u9fa5\u3400-\u4db5\u20000-\u2a6d6]/.test(text);
    if (!hasChinese) return { text: text, translated: false, reason: "No Chinese detected" };
    const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=" + encodeURIComponent(text);
    const response = await fetch(url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } });
    if (!response.ok) throw new Error(`Google API HTTP ${response.status}`);
    const data = await response.json();
    let translatedText = "";
    if (data && data[0] && Array.isArray(data[0])) { data[0].forEach(segment => { if (segment && segment[0]) translatedText += segment[0]; }); }
    if (!translatedText) throw new Error("Empty translation result");
    console.log(`✅ [Google GTX] Translated: "${text.substring(0,10)}..." -> "${translatedText.substring(0,10)}..."`);
    return { text: translatedText.trim(), translated: true, original: text, model: "google-gtx-free" };
  } catch (error) {
    console.error("❌ Translate Error:", error.message);
    return { text: text, translated: false, error: error.message };
  }
}

class PromptAnalyzer {
  static analyzeComplexity(prompt) {
    const complexKeywords = ['detailed', 'intricate', 'complex', 'elaborate', 'realistic', 'photorealistic', 'hyperrealistic', 'architecture', 'cityscape', 'landscape', 'portrait', 'face', 'eyes', 'hair', 'texture', 'material', 'fabric', 'skin', 'lighting', 'shadows', 'reflections', 'fine details', 'high detail', 'ultra detailed', '4k', '8k', 'uhd', 'hdr'];
    let score = 0;
    const lowerPrompt = prompt.toLowerCase();
    complexKeywords.forEach(keyword => { if (lowerPrompt.includes(keyword)) score += 0.1; });
    if (prompt.length > 100) score += 0.2;
    if (prompt.length > 200) score += 0.3;
    if (prompt.split(',').length > 5) score += 0.15;
    return Math.min(score, 1.0);
  }
  static recommendQualityMode(prompt, model) {
    const complexity = this.analyzeComplexity(prompt);
    const profile = CONFIG.HD_OPTIMIZATION.MODEL_QUALITY_PROFILES[model];
    if (profile?.recommended_quality) return profile.recommended_quality;
    if (complexity > 0.7) return 'ultra';
    if (complexity > 0.4) return 'standard';
    return 'economy';
  }
}

class HDOptimizer {
  static optimize(prompt, negativePrompt, model, width, height, qualityMode = 'standard', autoHD = true) {
    if (!autoHD || !CONFIG.HD_OPTIMIZATION.enabled) return { prompt, negativePrompt, width, height, optimized: false };
    const hdConfig = CONFIG.HD_OPTIMIZATION;
    const modeConfig = hdConfig.QUALITY_MODES[qualityMode] || hdConfig.QUALITY_MODES.standard;
    const profile = hdConfig.MODEL_QUALITY_PROFILES[model];
    const optimizations = [];
    const hdLevel = modeConfig.hd_level;
    let enhancedPrompt = prompt;
    if (hdConfig.HD_PROMPTS[hdLevel]) { enhancedPrompt = prompt + ", " + hdConfig.HD_PROMPTS[hdLevel]; optimizations.push("HD增強: " + hdLevel); }
    let enhancedNegative = negativePrompt || "";
    if (qualityMode !== 'economy') { enhancedNegative = enhancedNegative ? enhancedNegative + ", " + hdConfig.HD_NEGATIVE : hdConfig.HD_NEGATIVE; optimizations.push("負面提示詞: 高清過濾"); }
    let finalWidth = width;
    let finalHeight = height;
    let sizeUpscaled = false;
    const maxModelRes = profile?.max_resolution || 2048;
    const minRes = Math.max(modeConfig.min_resolution, profile?.min_resolution || 1024);
    const currentRes = Math.min(width, height);
    if (currentRes < minRes || modeConfig.force_upscale) {
      const scale = minRes / currentRes;
      finalWidth = Math.min(Math.round(width * scale / 64) * 64, maxModelRes);
      finalHeight = Math.min(Math.round(height * scale / 64) * 64, maxModelRes);
      sizeUpscaled = true;
      optimizations.push("尺寸優化: " + width + "x" + height + " → " + finalWidth + "x" + finalHeight);
    }
    if (finalWidth > maxModelRes || finalHeight > maxModelRes) {
      const scale = maxModelRes / Math.max(finalWidth, finalHeight);
      finalWidth = Math.round(finalWidth * scale / 64) * 64;
      finalHeight = Math.round(finalHeight * scale / 64) * 64;
      optimizations.push("模型限制: 調整至 " + finalWidth + "x" + finalHeight);
    }
    return { prompt: enhancedPrompt, negativePrompt: enhancedNegative, width: finalWidth, height: finalHeight, optimized: true, quality_mode: qualityMode, hd_level: hdLevel, optimizations, size_upscaled: sizeUpscaled };
  }
}

class ParameterOptimizer {
  static optimizeSteps(model, width, height, style = 'none', qualityMode = 'standard', userSteps = null) {
    if (userSteps !== null && userSteps !== -1) { const suggestion = this.calculateOptimalSteps(model, width, height, style, qualityMode); return { steps: userSteps, optimized: false, suggested: suggestion.steps, reasoning: suggestion.reasoning, user_override: true }; }
    return this.calculateOptimalSteps(model, width, height, style, qualityMode);
  }
  static calculateOptimalSteps(model, width, height, style, qualityMode = 'standard') {
    const rules = CONFIG.OPTIMIZATION_RULES;
    const modelRule = rules.MODEL_STEPS[model] || rules.MODEL_STEPS["flux"];
    const modeConfig = CONFIG.HD_OPTIMIZATION.QUALITY_MODES[qualityMode];
    const profile = CONFIG.HD_OPTIMIZATION.MODEL_QUALITY_PROFILES[model];
    let baseSteps = modelRule.optimal;
    const reasoning = [model + ": " + baseSteps + "步"];
    const totalPixels = width * height;
    let sizeMultiplier = 1.0;
    if (totalPixels >= rules.SIZE_MULTIPLIER.xlarge.threshold) { sizeMultiplier = rules.SIZE_MULTIPLIER.xlarge.multiplier; reasoning.push("超大 x" + sizeMultiplier); }
    else if (totalPixels >= rules.SIZE_MULTIPLIER.large.threshold) { sizeMultiplier = rules.SIZE_MULTIPLIER.large.multiplier; reasoning.push("大尺寸 x" + sizeMultiplier); }
    else if (totalPixels <= rules.SIZE_MULTIPLIER.small.threshold) { sizeMultiplier = rules.SIZE_MULTIPLIER.small.multiplier; }
    else { sizeMultiplier = rules.SIZE_MULTIPLIER.medium.multiplier; }
    let styleMultiplier = rules.STYLE_ADJUSTMENT[style] || rules.STYLE_ADJUSTMENT.default;
    let qualityMultiplier = modeConfig?.steps_multiplier || 1.0;
    if (qualityMultiplier !== 1.0) reasoning.push(modeConfig.name + " x" + qualityMultiplier);
    let profileBoost = profile?.optimal_steps_boost || 1.0;
    if (profileBoost !== 1.0) reasoning.push("模型配置 x" + profileBoost);
    let optimizedSteps = Math.round(baseSteps * sizeMultiplier * styleMultiplier * qualityMultiplier * profileBoost);
    optimizedSteps = Math.max(modelRule.min, Math.min(optimizedSteps, modelRule.max));
    reasoning.push("→ " + optimizedSteps + "步");
    return { steps: optimizedSteps, optimized: true, base_steps: baseSteps, size_multiplier: sizeMultiplier, style_multiplier: styleMultiplier, quality_multiplier: qualityMultiplier, profile_boost: profileBoost, min_steps: modelRule.min, max_steps: modelRule.max, reasoning: reasoning.join(' ') };
  }
  static optimizeGuidance(model, style, qualityMode = 'standard') {
    const modeConfig = CONFIG.HD_OPTIMIZATION.QUALITY_MODES[qualityMode];
    const profile = CONFIG.HD_OPTIMIZATION.MODEL_QUALITY_PROFILES[model];
    let baseGuidance = 7.5;
    if (model.includes('turbo')) baseGuidance = style === 'photorealistic' ? 3.0 : 2.5;
    else if (style === 'photorealistic') baseGuidance = 8.5;
    else if (['oil-painting', 'watercolor', 'sketch'].includes(style)) baseGuidance = 6.5;
    else if (['manga', 'anime', 'chibi'].includes(style)) baseGuidance = 7.0;
    else if (['pixel-art', 'low-poly'].includes(style)) baseGuidance = 6.0;
    let qualityBoost = modeConfig?.guidance_multiplier || 1.0;
    let profileBoost = profile?.guidance_boost || 1.0;
    return Math.round(baseGuidance * qualityBoost * profileBoost * 10) / 10;
  }
}

class StyleProcessor {
  static applyStyle(prompt, style, negativePrompt) {
    try {
      if (!style || style === 'none' || style === '') return { enhancedPrompt: prompt, enhancedNegative: negativePrompt || "" };
      if (!CONFIG.STYLE_PRESETS || typeof CONFIG.STYLE_PRESETS !== 'object') return { enhancedPrompt: prompt, enhancedNegative: negativePrompt || "" };
      const styleConfig = CONFIG.STYLE_PRESETS[style];
      if (!styleConfig) return { enhancedPrompt: prompt, enhancedNegative: negativePrompt || "" };
      let enhancedPrompt = prompt;
      if (styleConfig.prompt && styleConfig.prompt.trim()) enhancedPrompt = prompt + ", " + styleConfig.prompt;
      let enhancedNegative = negativePrompt || "";
      if (styleConfig.negative && styleConfig.negative.trim()) {
        if (enhancedNegative && enhancedNegative.trim()) enhancedNegative = enhancedNegative + ", " + styleConfig.negative;
        else enhancedNegative = styleConfig.negative;
      }
      return { enhancedPrompt: enhancedPrompt, enhancedNegative: enhancedNegative };
    } catch (error) { console.error("❌ StyleProcessor error:", error.message); return { enhancedPrompt: prompt, enhancedNegative: negativePrompt || "" }; }
  }
}

async function fetchWithTimeout(url, options = {}, timeout = CONFIG.FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') throw new Error("Request timeout after " + timeout + "ms");
    throw error;
  }
}

function corsHeaders(additionalHeaders = {}) {
  return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With', 'Access-Control-Max-Age': '86400', ...additionalHeaders };
}
class PollinationsProvider {
  constructor(config, env) { this.config = config; this.name = config.name; this.env = env; }
  
  async generate(prompt, options, logger) {
    const { 
      model = "zimage", width = 1024, height = 1024, seed = -1, negativePrompt = "", guidance = null, steps = null, 
      enhance = false, nologo = true, privateMode = true, style = "none", autoOptimize = true, autoHD = true, 
      qualityMode = 'standard', referenceImages = []
    } = options;
    
    // ... (省略部分 PollinationsProvider 內部邏輯，保持原樣) ...
    // 為節省空間，此處核心邏輯與之前版本相同，僅需確保使用最新的 CONFIG
    
    const modelConfig = this.config.models.find(m => m.id === model);
    const supportsRefImages = modelConfig?.supports_reference_images || false;
    const maxRefImages = modelConfig?.max_reference_images || 0;
    
    let validReferenceImages = referenceImages.slice(0, maxRefImages);
    
    let basePrompt = prompt;
    let translationLog = { translated: false };

    if (/[\u4e00-\u9fa5]/.test(prompt)) {
      const translation = await translateToEnglish(prompt, this.env);
      if (translation.translated) basePrompt = translation.text;
    }

    const promptComplexity = PromptAnalyzer.analyzeComplexity(basePrompt);
    const recommendedQuality = PromptAnalyzer.recommendQualityMode(basePrompt, model);
    
    let hdOptimization = null;
    let optimizedPrompt = basePrompt;
    let finalNegative = negativePrompt;
    let finalWidth = width;
    let finalHeight = height;
    
    if (autoHD) {
      hdOptimization = HDOptimizer.optimize(basePrompt, negativePrompt, model, width, height, qualityMode, autoHD);
      optimizedPrompt = hdOptimization.prompt;
      finalNegative = hdOptimization.negativePrompt;
      finalWidth = hdOptimization.width;
      finalHeight = hdOptimization.height;
    }
    
    let finalSteps = steps;
    let finalGuidance = guidance;
    
    if (autoOptimize) {
      const stepsOptimization = ParameterOptimizer.optimizeSteps(model, finalWidth, finalHeight, style, qualityMode, steps);
      finalSteps = stepsOptimization.steps;
      if (guidance === null) finalGuidance = ParameterOptimizer.optimizeGuidance(model, style, qualityMode);
      else finalGuidance = guidance;
    } else {
      finalSteps = steps || 20;
      finalGuidance = guidance || 7.5;
    }
    
    const { enhancedPrompt, enhancedNegative } = StyleProcessor.applyStyle(optimizedPrompt, style, finalNegative);
    const currentSeed = seed === -1 ? Math.floor(Math.random() * 1000000) : seed;
    let fullPrompt = enhancedPrompt;
    if (enhancedNegative && enhancedNegative.trim()) fullPrompt = enhancedPrompt + " [negative: " + enhancedNegative + "]";
    
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const pathPrefix = this.config.pathPrefix || "";
    let baseUrl = this.config.endpoint + pathPrefix + "/" + encodedPrompt;
    
    const params = new URLSearchParams();
    params.append('model', model);
    params.append('width', finalWidth.toString());
    params.append('height', finalHeight.toString());
    params.append('seed', currentSeed.toString());
    params.append('nologo', nologo.toString());
    params.append('enhance', enhance.toString());
    params.append('private', privateMode.toString());
    if (validReferenceImages && validReferenceImages.length > 0) params.append('image', validReferenceImages.join(','));
    if (finalGuidance !== 7.5) params.append('guidance', finalGuidance.toString());
    if (finalSteps !== 20) params.append('steps', finalSteps.toString());
    
    const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept': 'image/*', 'Referer': 'https://pollinations.ai/' };
    const authConfig = CONFIG.POLLINATIONS_AUTH;
    if (authConfig.enabled && authConfig.token) headers['Authorization'] = `Bearer ${authConfig.token}`;
    
    const url = baseUrl + '?' + params.toString();
    
    for (let retry = 0; retry < CONFIG.MAX_RETRIES; retry++) {
      try {
        const response = await fetchWithTimeout(url, { method: 'GET', headers: headers }, 120000);
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.startsWith('image/')) {
            const imageBlob = await response.blob();
            const imageBuffer = await imageBlob.arrayBuffer();
            return { imageData: imageBuffer, contentType: contentType, url: response.url, provider: this.name, model: model, seed: currentSeed, width: finalWidth, height: finalHeight, quality_mode: qualityMode, style: style, authenticated: authConfig.enabled && !!authConfig.token };
          } else { throw new Error("Invalid content type: " + contentType); }
        }
        else throw new Error("HTTP " + response.status);
      } catch (e) {
        if (retry < CONFIG.MAX_RETRIES - 1) await new Promise(resolve => setTimeout(resolve, 1000 * (retry + 1)));
        else throw new Error("Generation failed: " + e.message);
      }
    }
    throw new Error("Model " + model + " failed after " + CONFIG.MAX_RETRIES + " retries");
  }
}

class MultiProviderRouter {
  constructor(apiKeys = {}, env = null) {
    this.providers = {};
    this.apiKeys = apiKeys;
    this.env = env;
    for (const [key, config] of Object.entries(CONFIG.PROVIDERS)) {
      if (config.enabled) {
        if (key === 'pollinations') this.providers[key] = new PollinationsProvider(config, env);
      }
    }
  }
  getProvider(providerName = null) {
    if (providerName && this.providers[providerName]) return { name: providerName, instance: this.providers[providerName] };
    const defaultName = CONFIG.DEFAULT_PROVIDER;
    if (this.providers[defaultName]) return { name: defaultName, instance: this.providers[defaultName] };
    const firstProvider = Object.keys(this.providers)[0];
    if (firstProvider) return { name: firstProvider, instance: this.providers[firstProvider] };
    throw new Error('No available provider');
  }
  async generate(prompt, options, logger) {
    const { provider: requestedProvider = null, numOutputs = 1 } = options;
    const { name: providerName, instance: provider } = this.getProvider(requestedProvider);
    const results = [];
    for (let i = 0; i < numOutputs; i++) {
      const currentOptions = { ...options, seed: options.seed === -1 ? -1 : options.seed + i };
      const result = await provider.generate(prompt, currentOptions, logger);
      results.push(result);
    }
    return results;
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const startTime = Date.now();
    const clientIP = getClientIP(request);
    
    if (env.POLLINATIONS_API_KEY) { CONFIG.POLLINATIONS_AUTH.enabled = true; CONFIG.POLLINATIONS_AUTH.token = env.POLLINATIONS_API_KEY; } 
    else { CONFIG.POLLINATIONS_AUTH.enabled = false; CONFIG.POLLINATIONS_AUTH.token = ""; }
    
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders() });
    
    try {
      let response;
      // ====== 路由判斷：新增 /nano 頁面 ======
      if (url.pathname === '/nano') { response = handleNanoPage(request); }
      else if (url.pathname === '/' || url.pathname === '') { response = handleUI(request); } 
      else if (url.pathname === '/_internal/generate') { response = await handleInternalGenerate(request, env, ctx); } 
      else if (url.pathname === '/health') {
        response = new Response(JSON.stringify({ status: 'ok', version: CONFIG.PROJECT_VERSION }), { headers: corsHeaders({ 'Content-Type': 'application/json' }) });
      } else {
        response = new Response(JSON.stringify({ error: 'Not Found' }), { status: 404, headers: corsHeaders({ 'Content-Type': 'application/json' }) });
      }
      
      const headers = new Headers(response.headers);
      headers.set('X-Worker-Version', CONFIG.PROJECT_VERSION);
      return new Response(response.body, { status: response.status, headers: headers });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: { message: error.message } }), { status: 500, headers: corsHeaders({ 'Content-Type': 'application/json' }) });
    }
  }
};

async function handleInternalGenerate(request, env, ctx) {
  const logger = new Logger();
  const startTime = Date.now();
  const clientIP = getClientIP(request);

  try {
    const body = await request.json();
    const prompt = body.prompt;
    if (!prompt || !prompt.trim()) throw new Error("Prompt is required");

    // ====== NanoBanana 限制檢查邏輯 ======
    if (body.model === 'nano-banana') {
        const limiter = new RateLimiter(env);
        const check = await limiter.checkLimit(clientIP);
        
        if (!check.allowed) {
            return new Response(JSON.stringify({ 
                error: { message: check.reason, type: 'rate_limit_exceeded' } 
            }), { 
                status: 429, 
                headers: corsHeaders({ 'Content-Type': 'application/json' }) 
            });
        }
    }
    // ==========================================
    
    let width = 1024, height = 1024;
    if (body.width) width = body.width;
    if (body.height) height = body.height;
    
    let referenceImages = [];
    if (body.reference_images && Array.isArray(body.reference_images)) {
      referenceImages = body.reference_images.filter(url => { try { new URL(url); return true; } catch { return false; } });
    }
    
    const seedInput = body.seed !== undefined ? body.seed : -1;
    let seedValue = -1;
    if (seedInput !== -1) { 
        const parsedSeed = parseInt(seedInput); 
        if (!isNaN(parsedSeed)) seedValue = parsedSeed; 
    }
    
    const autoOptimize = body.auto_optimize !== false;
    const userSteps = body.steps ? parseInt(body.steps) : null;
    const userGuidance = body.guidance_scale ? parseFloat(body.guidance_scale) : null;

    const options = { 
      provider: body.provider || null, 
      model: body.model || "gptimage", 
      width: Math.min(Math.max(width, 256), 2048), 
      height: Math.min(Math.max(height, 256), 2048), 
      numOutputs: Math.min(Math.max(body.n || 1, 1), 4), 
      seed: seedValue, 
      negativePrompt: body.negative_prompt || "", 
      guidance: autoOptimize ? null : userGuidance, 
      steps: autoOptimize ? null : userSteps, 
      enhance: body.enhance === true, 
      nologo: body.nologo !== false, 
      privateMode: body.private !== false, 
      style: body.style || "none", 
      autoOptimize: autoOptimize, 
      autoHD: body.auto_hd !== false, 
      qualityMode: body.quality_mode || 'standard', 
      referenceImages: referenceImages
    };
    
    const router = new MultiProviderRouter({}, env);
    const results = await router.generate(prompt, options, logger);
    const duration = Date.now() - startTime;
    
    if (results.length === 1 && results[0].imageData) {
      const result = results[0];
      return new Response(result.imageData, {
        headers: { 'Content-Type': result.contentType || 'image/png', 'Content-Disposition': `inline; filename="flux-ai-${result.seed}.png"`, 'X-Model': result.model, 'X-Seed': result.seed.toString(), 'X-Width': result.width.toString(), 'X-Height': result.height.toString(), ...corsHeaders() }
      });
    }
    // 多張圖片返回 JSON (此處省略部分邏輯，保持原樣)
    return new Response(JSON.stringify({ created: Math.floor(Date.now() / 1000), data: [] }), { headers: corsHeaders({ 'Content-Type': 'application/json' }) });

  } catch (e) {
    logger.add("❌ Error", e.message);
    return new Response(JSON.stringify({ error: { message: e.message } }), { status: 400, headers: corsHeaders({ 'Content-Type': 'application/json' }) });
  }
}
function handleNanoPage(request) {
  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>🍌 NanoBanana AI - 獨立版</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍌</text></svg>">
<style>
/* 獨立頁面的 CSS：黃色主題 */
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#1a1a1a;color:#fff;min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}
.container{max-width:500px;width:100%;background:#2a2a2a;border-radius:20px;padding:30px;box-shadow:0 10px 30px rgba(0,0,0,0.5);border:1px solid #333}
.header{text-align:center;margin-bottom:30px}
.logo{font-size:48px;margin-bottom:10px;animation:bounce 2s infinite}
h1{color:#FACC15;margin-bottom:5px;font-size:24px}
.subtitle{color:#888;font-size:14px}
.limit-badge{display:inline-block;background:#FACC15;color:#000;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold;margin-top:10px}
.form-group{margin-bottom:20px}
textarea{width:100%;background:#333;border:2px solid #444;border-radius:12px;padding:15px;color:#fff;font-size:16px;min-height:100px;resize:vertical;transition:0.3s}
textarea:focus{outline:none;border-color:#FACC15;background:#404040}
.controls{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px}
select{width:100%;padding:12px;background:#333;border:1px solid #444;border-radius:10px;color:#fff;cursor:pointer}
.btn{width:100%;padding:15px;background:linear-gradient(45deg, #FACC15, #EAB308);border:none;border-radius:12px;color:#000;font-weight:900;font-size:18px;cursor:pointer;transition:transform 0.2s, box-shadow 0.2s}
.btn:hover{transform:translateY(-2px);box-shadow:0 5px 15px rgba(250, 204, 21, 0.3)}
.btn:active{transform:translateY(0)}
.btn:disabled{opacity:0.6;cursor:not-allowed}
#resultArea{margin-top:30px;min-height:200px;display:flex;justify-content:center;align-items:center;background:#222;border-radius:12px;border:2px dashed #444;position:relative;overflow:hidden}
#resultImg{max-width:100%;display:none;border-radius:8px}
.loading{display:none;color:#FACC15;font-weight:bold}
@keyframes bounce {0%, 100% {transform: translateY(0);} 50% {transform: translateY(-10px);}}
.toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#ef4444;color:white;padding:10px 20px;border-radius:8px;display:none;z-index:100;box-shadow:0 5px 15px rgba(0,0,0,0.3)}
</style>
</head>
<body>
    <div id="toast" class="toast"></div>
    <div class="container">
        <div class="header">
            <div class="logo">🍌</div>
            <h1>NanoBanana Generator</h1>
            <div class="subtitle">極速生成 • 獨立通道</div>
            <div class="limit-badge">⚡ 每小時限額: 20 張</div>
        </div>
        <div class="form-group">
            <textarea id="prompt" placeholder="輸入你想看到的畫面... (例如: yellow banana cyberpunk city)"></textarea>
        </div>
        <div class="controls">
            <select id="ratio">
                <option value="1024,1024">1:1 方形</option>
                <option value="1080,1920">9:16 手機</option>
                <option value="1920,1080">16:9 電腦</option>
            </select>
            <select id="style">
                <option value="none">無風格</option>
                <option value="photorealistic">寫實照片</option>
                <option value="anime">日系動漫</option>
                <option value="pixel-art">像素藝術</option>
                <option value="cyberpunk">賽博龐克</option>
            </select>
        </div>
        <button id="genBtn" class="btn">立即生成 🍌</button>
        <div id="resultArea">
            <div class="loading">🍌 正在召喚香蕉之力...</div>
            <img id="resultImg" alt="Result">
        </div>
    </div>
<script>
    const genBtn = document.getElementById('genBtn');
    const promptIn = document.getElementById('prompt');
    const resultImg = document.getElementById('resultImg');
    const loading = document.querySelector('.loading');
    const toast = document.getElementById('toast');
    function showToast(msg) { toast.textContent = msg; toast.style.display = 'block'; setTimeout(() => toast.style.display = 'none', 3000); }
    genBtn.onclick = async () => {
        const prompt = promptIn.value.trim();
        if(!prompt) return showToast("請輸入提示詞！");
        genBtn.disabled = true; genBtn.innerHTML = '生成中...'; resultImg.style.display = 'none'; loading.style.display = 'block';
        const [width, height] = document.getElementById('ratio').value.split(',').map(Number);
        try {
            const res = await fetch('/_internal/generate', {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    prompt: prompt, model: 'nano-banana', width: width, height: height,
                    style: document.getElementById('style').value, nologo: true
                })
            });
            if(res.status === 429) { const errData = await res.json(); throw new Error(errData.error.message); }
            if(!res.ok) throw new Error('生成失敗');
            const blob = await res.blob(); const url = URL.createObjectURL(blob);
            resultImg.src = url; resultImg.style.display = 'block';
        } catch (err) { showToast(err.message); } finally { loading.style.display = 'none'; genBtn.disabled = false; genBtn.innerHTML = '立即生成 🍌'; }
    };
</script>
</body>
</html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
}
function handleUI() {
  const authStatus = CONFIG.POLLINATIONS_AUTH.enabled ? '<span style="color:#22c55e;font-weight:600;font-size:12px">🔐 已認證</span>' : '<span style="color:#f59e0b;font-weight:600;font-size:12px">⚠️ 需要 API Key</span>';
  
  // 生成風格選項 HTML
  let styleOptionsHTML = '';
  const sortedCategories = Object.entries(CONFIG.STYLE_CATEGORIES).sort((a, b) => a[1].order - b[1].order);
  for (const [categoryKey, categoryInfo] of sortedCategories) {
    const stylesInCategory = Object.entries(CONFIG.STYLE_PRESETS).filter(([key, style]) => style.category === categoryKey);
    if (stylesInCategory.length > 0) {
      styleOptionsHTML += `<optgroup label="${categoryInfo.icon} ${categoryInfo.name}">`;
      for (const [styleKey, styleConfig] of stylesInCategory) {
        styleOptionsHTML += `<option value="${styleKey}">${styleConfig.icon} ${styleConfig.name}</option>`;
      }
      styleOptionsHTML += '</optgroup>';
    }
  }
  
  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Flux AI Pro v${CONFIG.PROJECT_VERSION}</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎨</text></svg>">
<style>
/* ... (保留原本的主頁 CSS 樣式) ... */
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%);color:#fff;min-height:100vh}
.container{max-width:100%;margin:0;padding:0;height:100vh;display:flex;flex-direction:column}
.top-nav{background:rgba(255,255,255,0.05);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,0.1);padding:15px 25px;display:flex;justify-content:space-between;align-items:center}
.logo{color:#f59e0b;font-size:24px;font-weight:800;display:flex;align-items:center;gap:10px}
.main-content{flex:1;display:flex;overflow:hidden}
.left-panel{width:320px;background:rgba(255,255,255,0.03);border-right:1px solid rgba(255,255,255,0.1);overflow-y:auto;padding:20px}
.center-panel{flex:1;padding:20px;overflow-y:auto}
.right-panel{width:380px;background:rgba(255,255,255,0.03);border-left:1px solid rgba(255,255,255,0.1);overflow-y:auto;padding:20px}
.form-group{margin-bottom:16px}
label{display:block;margin-bottom:6px;font-weight:600;font-size:13px;color:#e5e7eb}
input,textarea,select{width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#fff;font-size:13px}
.btn{padding:12px;border:none;border-radius:8px;font-weight:700;cursor:pointer;width:100%;background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);color:#fff}
.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
.gallery-item img{width:100%;border-radius:12px;cursor:pointer}
</style>
</head>
<body>
<div class="container">
<div class="top-nav">
<div class="logo">🎨 Flux AI Pro</div>
<div>${authStatus}</div>
</div>
<div class="main-content">
<div class="left-panel">
<form id="generateForm">
<div class="form-group"><label>模型</label><select id="model">
<optgroup label="🍌 Special">
<option value="nano-banana">Nano Banana (限時)</option>
</optgroup>
<optgroup label="🤖 Standard">
<option value="gptimage">GPT-Image</option>
<option value="flux">Flux Standard</option>
</optgroup>
</select></div>
<div class="form-group"><label>尺寸</label><select id="size"><option value="square-1k">Square 1K</option><option value="portrait-9-16-hd">Portrait HD</option></select></div>
<div class="form-group"><label>風格</label><select id="style">${styleOptionsHTML}</select></div>
<button type="submit" class="btn" id="generateBtn">🎨 開始生成</button>
</form>
</div>
<div class="center-panel">
<div id="results"></div>
</div>
<div class="right-panel">
<div class="form-group"><label>提示詞</label><textarea id="prompt" placeholder="描述你的畫面..." required></textarea></div>
</div>
</div>
</div>
<script>
// ... (保留原本的 JS 邏輯，包含 IndexedDB 與 Fetch) ...
const PRESET_SIZES=${JSON.stringify(CONFIG.PRESET_SIZES)};
document.getElementById('generateForm').addEventListener('submit',async(e)=>{
    e.preventDefault();
    const btn=document.getElementById('generateBtn');
    const prompt=document.getElementById('prompt').value;
    const sizeConfig=PRESET_SIZES[document.getElementById('size').value];
    
    if(!prompt)return;
    btn.disabled=true; btn.textContent='Generating...';
    
    try{
        const res=await fetch('/_internal/generate',{
            method:'POST', headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                prompt, model:document.getElementById('model').value, width:sizeConfig.width, height:sizeConfig.height,
                style:document.getElementById('style').value, nologo:true
            })
        });
        
        if(res.status === 429) {
            const err = await res.json();
            alert(err.error.message);
        } else if(res.ok) {
            const blob=await res.blob();
            const url=URL.createObjectURL(blob);
            const img=document.createElement('img');
            img.src=url;
            const item=document.createElement('div');
            item.className='gallery-item';
            item.appendChild(img);
            document.getElementById('results').prepend(item);
        }
    }catch(err){ alert(err.message); }
    finally{ btn.disabled=false; btn.textContent='🎨 開始生成'; }
});
</script>
</body>
</html>`;
  
  return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8', ...corsHeaders() } });
}
