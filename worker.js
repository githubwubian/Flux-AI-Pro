// =================================================================================
//  項目: Flux AI Pro - NanoBanana Edition
//  版本: 10.6.7 (Full UI + Live Stats)
//  更新: 恢復完整主界面並整合實時在線統計系統
// =================================================================================

const CONFIG = {
  PROJECT_NAME: "Flux-AI-Pro",
  PROJECT_VERSION: "10.6.7",
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
      description: "官方 AI 圖像生成服務",
      features: {
        private_mode: true, custom_size: true, seed_control: true, negative_prompt: true, enhance: true, nologo: true, style_presets: true, auto_hd: true, quality_modes: true, auto_translate: true, reference_images: true, image_to_image: true, batch_generation: true, api_key_auth: true
      },
      models: [
        { id: "nanobanana-pro", name: "Nano Banana Pro 🍌", confirmed: true, category: "special", description: "Nano Banana Pro 風格模型 (每小時限額 5 張)", max_size: 2048, pricing: { image_price: 0, currency: "free" }, input_modalities: ["text"], output_modalities: ["image"] },
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
    "american-comic": { name: "美式漫畫", prompt: "american comic book style, bold lines, vibrant colors, superhero art, dynamic action, dramatic shading", negative: "anime, manga, realistic photo, soft", category: "manga", icon: "💥", description: "美國超級英雄漫畫" },
    "korean-webtoon": { name: "韓國網漫", prompt: "korean webtoon style, manhwa art, detailed linework, soft colors, romantic, vertical scroll format", negative: "american comic, rough sketch, dark", category: "manga", icon: "📱", description: "韓國網路漫畫風格" },
    chibi: { name: "Q版漫畫", prompt: "chibi style, super deformed, cute, kawaii, big head small body, simple features, adorable", negative: "realistic proportions, serious, dark", category: "manga", icon: "🥰", description: "Q版可愛漫畫風格" },
    "black-white": { name: "黑白", prompt: "black and white, monochrome, high contrast, dramatic lighting, grayscale", negative: "color, colorful, vibrant, saturated", category: "monochrome", icon: "⚫⚪", description: "純黑白高對比效果" },
    sketch: { name: "素描", prompt: "pencil sketch, hand drawn, graphite drawing, detailed shading, artistic sketch, loose lines", negative: "color, digital, polished, photo", category: "monochrome", icon: "✏️", description: "鉛筆素描手繪質感" },
    "ink-drawing": { name: "水墨畫", prompt: "traditional chinese ink painting, sumi-e, brush strokes, minimalist, zen aesthetic, black ink on white paper", negative: "color, western style, detailed, cluttered", category: "monochrome", icon: "🖌️", description: "中國傳統水墨畫" },
    silhouette: { name: "剪影", prompt: "silhouette art, stark contrast, black shapes, minimalist, dramatic, shadow play, clean edges", negative: "detailed, realistic, colorful, textured", category: "monochrome", icon: "👤", description: "剪影藝術極簡構圖" },
    charcoal: { name: "炭筆畫", prompt: "charcoal drawing, rough texture, dramatic shading, expressive, smudged, artistic, monochrome", negative: "clean, digital, colorful, precise", category: "monochrome", icon: "🖤", description: "炭筆繪畫粗糙質感" },
    photorealistic: { name: "寫實照片", prompt: "photorealistic, 8k uhd, high quality, detailed, professional photography, sharp focus", negative: "anime, cartoon, illustration, painting, drawing, art", category: "realistic", icon: "📷", description: "攝影級寫實效果" },
    "oil-painting": { name: "油畫", prompt: "oil painting, canvas texture, visible brushstrokes, rich colors, artistic, masterpiece", negative: "photograph, digital art, anime, flat", category: "painting", icon: "🖼️", description: "經典油畫質感" },
    watercolor: { name: "水彩畫", prompt: "watercolor painting, soft colors, watercolor texture, artistic, hand-painted, paper texture, flowing colors", negative: "photograph, digital, sharp edges, 3d", category: "painting", icon: "💧", description: "清新水彩風格" },
    impressionism: { name: "印象派", prompt: "impressionist painting, soft brushstrokes, light and color focus, Monet style, outdoor scene, visible brush marks", negative: "sharp, detailed, photorealistic, dark", category: "art-movement", icon: "🌅", description: "印象派繪畫光影捕捉" },
    abstract: { name: "抽象派", prompt: "abstract art, non-representational, geometric shapes, bold colors, modern art, expressive", negative: "realistic, figurative, detailed, representational", category: "art-movement", icon: "🎭", description: "抽象藝術幾何圖形" },
    cubism: { name: "立體主義", prompt: "cubist style, geometric shapes, multiple perspectives, fragmented, Picasso inspired, angular forms", negative: "realistic, smooth, traditional, single perspective", category: "art-movement", icon: "🔷", description: "立體主義多視角解構" },
    surrealism: { name: "超現實主義", prompt: "surrealist art, dreamlike, bizarre, impossible scenes, Salvador Dali style, imaginative, symbolic", negative: "realistic, mundane, ordinary, logical", category: "art-movement", icon: "🌀", description: "超現實主義夢幻場景" },
    "pop-art": { name: "普普藝術", prompt: "pop art style, bold colors, comic book elements, Andy Warhol inspired, retro, screen print effect", negative: "subtle, muted, traditional, realistic", category: "art-movement", icon: "🎪", description: "普普藝術大膽色彩" },
    neon: { name: "霓虹燈", prompt: "neon lights, glowing, vibrant neon colors, night scene, electric, luminous, dark background", negative: "daylight, muted, natural, dull", category: "visual", icon: "💡", description: "霓虹燈發光效果" },
    vintage: { name: "復古", prompt: "vintage style, retro, aged, nostalgic, warm tones, classic, faded colors, old photograph", negative: "modern, futuristic, clean, vibrant", category: "visual", icon: "📻", description: "復古懷舊褪色效果" },
    steampunk: { name: "蒸汽朋克", prompt: "steampunk style, Victorian era, brass and copper, gears and mechanisms, mechanical, industrial", negative: "modern, minimalist, clean, futuristic", category: "visual", icon: "⚙️", description: "蒸汽朋克機械美學" },
    minimalist: { name: "極簡主義", prompt: "minimalist design, clean, simple, geometric, negative space, modern, uncluttered", negative: "detailed, complex, ornate, busy", category: "visual", icon: "◽", description: "極簡設計留白美學" },
    vaporwave: { name: "蒸氣波", prompt: "vaporwave aesthetic, retro futuristic, pastel colors, glitch art, 80s 90s nostalgia, neon pink and blue", negative: "realistic, natural, muted, traditional", category: "visual", icon: "🌴", description: "蒸氣波復古未來" },
    "pixel-art": { name: "像素藝術", prompt: "pixel art, 8-bit, 16-bit, retro gaming style, pixelated, nostalgic, limited color palette", negative: "high resolution, smooth, realistic, detailed", category: "digital", icon: "🎮", description: "像素藝術復古遊戲" },
    "low-poly": { name: "低多邊形", prompt: "low poly 3d, geometric, faceted, minimalist 3d art, polygonal, angular shapes", negative: "high poly, detailed, realistic, organic", category: "digital", icon: "🔺", description: "低多邊形3D幾何" },
    "3d-render": { name: "3D渲染", prompt: "3d render, cinema 4d, octane render, detailed, professional lighting, ray tracing, photorealistic 3d", negative: "2d, flat, hand drawn, sketchy", category: "digital", icon: "🎬", description: "專業3D渲染寫實光影" },
    gradient: { name: "漸變", prompt: "gradient art, smooth color transitions, modern, vibrant gradients, soft blending, colorful", negative: "solid colors, flat, harsh edges, traditional", category: "digital", icon: "🌈", description: "漸變藝術柔和過渡" },
    glitch: { name: "故障藝術", prompt: "glitch art, digital corruption, RGB shift, distorted, cyberpunk, data moshing, scanlines", negative: "clean, perfect, traditional, smooth", category: "digital", icon: "📺", description: "故障美學數位崩壞" },
    "ukiyo-e": { name: "浮世繪", prompt: "ukiyo-e style, japanese woodblock print, Hokusai inspired, traditional japanese art, flat colors, bold outlines", negative: "modern, western, photographic, 3d", category: "traditional", icon: "🗾", description: "日本浮世繪木刻版畫" },
    "stained-glass": { name: "彩繪玻璃", prompt: "stained glass art, colorful, leaded glass, church window style, luminous, geometric patterns, light through glass", negative: "realistic, photographic, modern, opaque", category: "traditional", icon: "🪟", description: "彩繪玻璃透光效果" },
    "paper-cut": { name: "剪紙藝術", prompt: "paper cut art, layered paper, shadow box effect, intricate patterns, handcrafted, silhouette", negative: "painted, digital, realistic, photographic", category: "traditional", icon: "✂️", description: "剪紙藝術層次堆疊" },
    gothic: { name: "哥特風格", prompt: "gothic style, dark, ornate, Victorian gothic, mysterious, dramatic, baroque elements, elegant darkness", negative: "bright, cheerful, minimalist, modern", category: "aesthetic", icon: "🦇", description: "哥特美學黑暗華麗" },
    "art-nouveau": { name: "新藝術", prompt: "art nouveau style, organic forms, flowing lines, decorative, elegant, floral motifs, Alphonse Mucha inspired", negative: "geometric, minimalist, modern, rigid", category: "aesthetic", icon: "🌺", description: "新藝術流動線條" },
    cyberpunk: { name: "賽博朋克", prompt: "cyberpunk style, neon lights, futuristic, sci-fi, dystopian, high-tech low-life, blade runner style", negative: "natural, rustic, medieval, fantasy", category: "scifi", icon: "🌃", description: "賽博朋克未來科幻" },
    fantasy: { name: "奇幻風格", prompt: "fantasy art, magical, epic fantasy, detailed fantasy illustration, mystical, enchanted", negative: "modern, realistic, mundane, contemporary", category: "fantasy", icon: "🐉", description: "奇幻魔法世界" }
  },
  
  STYLE_CATEGORIES: {
    'basic': { name: '基礎', icon: '⚡', order: 1 },
    'illustration': { name: '插畫動畫', icon: '🎨', order: 2 },
    'manga': { name: '漫畫風格', icon: '📖', order: 3 },
    'monochrome': { name: '黑白單色', icon: '⚫', order: 4 },
    'realistic': { name: '寫實照片', icon: '📷', order: 5 },
    'painting': { name: '繪畫風格', icon: '🖼️', order: 6 },
    'art-movement': { name: '藝術流派', icon: '🎭', order: 7 },
    'visual': { name: '視覺風格', icon: '✨', order: 8 },
    'digital': { name: '數位風格', icon: '💻', order: 9 },
    'traditional': { name: '傳統藝術', icon: '🏛️', order: 10 },
    'aesthetic': { name: '美學風格', icon: '🌟', order: 11 },
    'scifi': { name: '科幻', icon: '🚀', order: 12 },
    'fantasy': { name: '奇幻', icon: '🐉', order: 13 }
  },
  
  OPTIMIZATION_RULES: {
    MODEL_STEPS: { 
      "nanobanana-pro": { min: 15, optimal: 20, max: 30 },
      "gptimage": { min: 10, optimal: 18, max: 28 },
      "gptimage-large": { min: 15, optimal: 25, max: 35 },
      "zimage": { min: 8, optimal: 15, max: 25 }, 
      "flux": { min: 15, optimal: 20, max: 30 }, 
      "turbo": { min: 4, optimal: 8, max: 12 }, 
      "kontext": { min: 18, optimal: 25, max: 35 } 
    },
    SIZE_MULTIPLIER: { small: { threshold: 512 * 512, multiplier: 0.8 }, medium: { threshold: 1024 * 1024, multiplier: 1.0 }, large: { threshold: 1536 * 1536, multiplier: 1.15 }, xlarge: { threshold: 2048 * 2048, multiplier: 1.3 } },
    STYLE_ADJUSTMENT: { "photorealistic": 1.1, "oil-painting": 1.05, "watercolor": 0.95, "sketch": 0.9, "manga": 1.0, "pixel-art": 0.85, "3d-render": 1.15, "default": 1.0 }
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
      "nanobanana-pro": { min_resolution: 1024, max_resolution: 2048, optimal_steps_boost: 1.0, guidance_boost: 1.0, recommended_quality: "standard" },
      "gptimage": { min_resolution: 1024, max_resolution: 2048, optimal_steps_boost: 1.0, guidance_boost: 1.0, recommended_quality: "standard" },
      "gptimage-large": { min_resolution: 1280, max_resolution: 2048, optimal_steps_boost: 1.15, guidance_boost: 1.05, recommended_quality: "ultra" },
      "zimage": { min_resolution: 1024, max_resolution: 2048, optimal_steps_boost: 1.0, guidance_boost: 1.0, recommended_quality: "economy" },
      "flux": { min_resolution: 1024, max_resolution: 2048, optimal_steps_boost: 1.1, guidance_boost: 1.0, recommended_quality: "standard" },
      "turbo": { min_resolution: 1024, max_resolution: 2048, optimal_steps_boost: 0.9, guidance_boost: 0.95, recommended_quality: "economy" },
      "kontext": { min_resolution: 1280, max_resolution: 2048, optimal_steps_boost: 1.2, guidance_boost: 1.1, recommended_quality: "ultra" }
    }
  }
};

class Logger {
  constructor() { this.logs = []; }
  add(title, data) { this.logs.push({ title, data, timestamp: new Date().toISOString() }); }
  get() { return this.logs; }
}

// ====== KV Stats Manager ======
class StatsManager {
  constructor(env) { this.env = env; }

  // 更新在線狀態並返回統計數據
  async updateAndGet(ip) {
    if (!this.env.FLUX_KV) return { online: 1, total: 0 };
    
    const KEY_ONLINE = 'stats:online_users_v2';
    const KEY_TOTAL = 'stats:total_generations';
    const WINDOW_MS = 5 * 60 * 1000; // 5分鐘內視為在線
    const NOW = Date.now();

    try {
        let [onlineDataRaw, totalCount] = await Promise.all([
            this.env.FLUX_KV.get(KEY_ONLINE),
            this.env.FLUX_KV.get(KEY_TOTAL)
        ]);

        let onlineUsers = onlineDataRaw ? JSON.parse(onlineDataRaw) : {};
        let total = parseInt(totalCount || '0');
        let dirty = false;

        const activeUsers = {};
        for (const [userIp, timestamp] of Object.entries(onlineUsers)) {
            if (NOW - timestamp < WINDOW_MS) {
                activeUsers[userIp] = timestamp;
            } else {
                dirty = true;
            }
        }

        if (!activeUsers[ip] || (NOW - activeUsers[ip] > 60000)) {
            activeUsers[ip] = NOW;
            dirty = true;
        }

        if (dirty) {
            this.env.FLUX_KV.put(KEY_ONLINE, JSON.stringify(activeUsers), { expirationTtl: 600 }).catch(e=>console.error(e));
        }

        return { online: Object.keys(activeUsers).length, total: total };

    } catch (e) {
        console.error("Stats Error:", e);
        return { online: 1, total: 0 };
    }
  }

  async incrementTotal() {
    if (!this.env.FLUX_KV) return;
    const KEY_TOTAL = 'stats:total_generations';
    try {
        let current = await this.env.FLUX_KV.get(KEY_TOTAL);
        let newVal = (parseInt(current || '0') + 1);
        this.env.FLUX_KV.put(KEY_TOTAL, newVal.toString()).catch(e=>console.error(e));
    } catch(e) { console.error(e); }
  }
}

class RateLimiter {
  constructor(env) {
    this.env = env;
    this.KV = env.FLUX_KV;
  }
  async checkLimit(ip) {
    if (!this.KV) return { allowed: true };
    const key = `nano_limit:${ip}`;
    const windowSize = 3600 * 1000;
    const maxRequests = 5; 
    try {
      const rawData = await this.KV.get(key);
      let timestamps = rawData ? JSON.parse(rawData) : [];
      const now = Date.now();
      timestamps = timestamps.filter(ts => now - ts < windowSize);
      if (timestamps.length >= maxRequests) {
        const oldest = timestamps[0];
        const waitMin = Math.ceil(((oldest + windowSize) - now) / 60000);
        return { allowed: false, reason: `🍌 限額已滿 (5張/小時)。請休息 ${waitMin} 分鐘。`, remaining: 0 };
      }
      timestamps.push(now);
      await this.KV.put(key, JSON.stringify(timestamps), { expirationTtl: 3600 });
      return { allowed: true, remaining: maxRequests - timestamps.length };
    } catch (err) {
      return { allowed: true };
    }
  }
}

function getClientIP(request) {
  return request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
}

async function translateToEnglish(text, env) {
  try {
    const hasChinese = /[\u4e00-\u9fa5]/.test(text);
    if (!hasChinese) return { text: text, translated: false };
    const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=" + encodeURIComponent(text);
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!response.ok) throw new Error("Translation API failed");
    const data = await response.json();
    let translatedText = "";
    if (data && data[0]) data[0].forEach(s => { if (s && s[0]) translatedText += s[0]; });
    return { text: translatedText.trim(), translated: true };
  } catch (error) {
    return { text: text, translated: false, error: error.message };
  }
}

class PromptAnalyzer {
  static analyzeComplexity(prompt) {
    const keywords = ['detailed', 'intricate', 'realistic', 'photorealistic', '8k', 'hdr'];
    let score = 0;
    keywords.forEach(k => { if (prompt.toLowerCase().includes(k)) score += 0.1; });
    if (prompt.length > 100) score += 0.2;
    return Math.min(score, 1.0);
  }
  static recommendQualityMode(prompt, model) {
    const complexity = this.analyzeComplexity(prompt);
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
    
    let enhancedPrompt = prompt;
    if (hdConfig.HD_PROMPTS[modeConfig.hd_level]) enhancedPrompt += ", " + hdConfig.HD_PROMPTS[modeConfig.hd_level];
    
    let enhancedNegative = negativePrompt || "";
    if (qualityMode !== 'economy') enhancedNegative += ", " + hdConfig.HD_NEGATIVE;

    const maxModelRes = profile?.max_resolution || 2048;
    const minRes = Math.max(modeConfig.min_resolution, profile?.min_resolution || 1024);
    
    let finalWidth = width;
    let finalHeight = height;
    
    const currentRes = Math.min(width, height);
    if (currentRes < minRes || modeConfig.force_upscale) {
      const scale = minRes / currentRes;
      finalWidth = Math.min(Math.round(width * scale / 64) * 64, maxModelRes);
      finalHeight = Math.min(Math.round(height * scale / 64) * 64, maxModelRes);
    }

    return { prompt: enhancedPrompt, negativePrompt: enhancedNegative, width: finalWidth, height: finalHeight, optimized: true, hd_level: modeConfig.hd_level };
  }
}

class ParameterOptimizer {
  static optimizeSteps(model, width, height, style = 'none', qualityMode = 'standard', userSteps = null) {
    if (userSteps) return { steps: userSteps };
    const base = CONFIG.OPTIMIZATION_RULES.MODEL_STEPS[model]?.optimal || 20;
    const modeMult = CONFIG.HD_OPTIMIZATION.QUALITY_MODES[qualityMode]?.steps_multiplier || 1.0;
    return { steps: Math.round(base * modeMult) };
  }
  static optimizeGuidance(model, style, qualityMode = 'standard') {
    let base = 7.5;
    if (style === 'photorealistic') base = 8.5;
    if (model.includes('turbo')) base = 3.5;
    return base;
  }
}

class StyleProcessor {
  static applyStyle(prompt, style, negativePrompt) {
    if (!style || style === 'none' || !CONFIG.STYLE_PRESETS[style]) return { enhancedPrompt: prompt, enhancedNegative: negativePrompt || "" };
    const s = CONFIG.STYLE_PRESETS[style];
    return { 
        enhancedPrompt: prompt + (s.prompt ? ", " + s.prompt : ""), 
        enhancedNegative: (negativePrompt || "") + (s.negative ? ", " + s.negative : "")
    };
  }
}

async function fetchWithTimeout(url, options = {}, timeout = 120000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

function corsHeaders() {
  return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': '*' };
}

class PollinationsProvider {
  constructor(config, env) { this.config = config; this.env = env; }
  
  async generate(prompt, options, logger) {
    const { model, width, height, seed, negativePrompt, style, autoHD, qualityMode, steps, guidance } = options;
    
    let basePrompt = prompt;
    const trans = await translateToEnglish(prompt, this.env);
    if (trans.translated) basePrompt = trans.text;

    let finalPrompt = basePrompt;
    let finalNeg = negativePrompt;
    let finalW = width;
    let finalH = height;

    if (autoHD) {
        const hd = HDOptimizer.optimize(basePrompt, negativePrompt, model, width, height, qualityMode, true);
        finalPrompt = hd.prompt;
        finalNeg = hd.negativePrompt;
        finalW = hd.width;
        finalH = hd.height;
    }

    const { enhancedPrompt, enhancedNegative } = StyleProcessor.applyStyle(finalPrompt, style, finalNeg);
    const fullPrompt = enhancedPrompt + (enhancedNegative ? " [negative: " + enhancedNegative + "]" : "");
    
    const finalSteps = steps || ParameterOptimizer.optimizeSteps(model, finalW, finalH, style, qualityMode).steps;
    const finalGuidance = guidance || ParameterOptimizer.optimizeGuidance(model, style, qualityMode);
    
    const params = new URLSearchParams({
        model, width: finalW, height: finalH, seed: seed === -1 ? Math.floor(Math.random()*1e6) : seed,
        nologo: options.nologo, enhance: options.enhance, private: options.privateMode,
        steps: finalSteps, guidance: finalGuidance
    });
    
    if (options.referenceImages?.length) params.append('image', options.referenceImages[0]);

    const url = `${this.config.endpoint}/image/${encodeURIComponent(fullPrompt)}?${params}`;
    const headers = { 
        'Authorization': `Bearer ${CONFIG.POLLINATIONS_AUTH.token}`,
        'User-Agent': 'FluxWorker/1.0',
        'Referer': 'https://pollinations.ai/'
    };

    for (let i = 0; i < 3; i++) {
        try {
            const res = await fetchWithTimeout(url, { headers });
            if (res.ok && res.headers.get('content-type').includes('image')) {
                const buf = await res.arrayBuffer();
                return { imageData: buf, contentType: res.headers.get('content-type'), seed: options.seed, model };
            }
            if (res.status === 429) throw new Error("Rate limit exceeded");
            if (res.status >= 500) throw new Error("Server error");
        } catch (e) {
            if (i === 2) throw e;
            await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
    }
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (env.POLLINATIONS_API_KEY) CONFIG.POLLINATIONS_AUTH.token = env.POLLINATIONS_API_KEY;
    
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders() });
    
    try {
      if (url.pathname === '/stats') {
        return await handleStats(request, env);
      }
      else if (url.pathname === '/nano') { 
        return handleNanoPage(request); 
      } 
      else if (url.pathname === '/') { 
        return handleUI(request); 
      } 
      else if (url.pathname === '/_internal/generate') { 
        return await handleInternalGenerate(request, env, ctx); 
      } 
      else {
        return new Response('Not Found', { status: 404 });
      }
    } catch (e) {
      return new Response(JSON.stringify({ error: { message: e.message } }), { status: 500, headers: corsHeaders() });
    }
  }
};

async function handleStats(request, env) {
    const ip = getClientIP(request);
    const statsMgr = new StatsManager(env);
    const stats = await statsMgr.updateAndGet(ip);
    return new Response(JSON.stringify(stats), { headers: { 'Content-Type': 'application/json', ...corsHeaders() }});
}

async function handleInternalGenerate(request, env, ctx) {
    const body = await request.json();
    const ip = getClientIP(request);
    const logger = new Logger();

    if (body.model === 'nanobanana-pro') {
        const limiter = new RateLimiter(env);
        const check = await limiter.checkLimit(ip);
        if (!check.allowed) {
            return new Response(JSON.stringify({ error: { message: check.reason } }), { status: 429, headers: corsHeaders() });
        }
    }

    const provider = new PollinationsProvider(CONFIG.PROVIDERS.pollinations, env);
    try {
        const result = await provider.generate(body.prompt, {
            model: body.model || 'gptimage',
            width: body.width || 1024,
            height: body.height || 1024,
            seed: body.seed || -1,
            style: body.style || 'none',
            nologo: body.nologo !== false,
            enhance: body.enhance === true,
            privateMode: true,
            autoHD: body.auto_hd !== false,
            qualityMode: body.quality_mode || 'standard',
            steps: body.steps ? parseInt(body.steps) : null,
            guidance: body.guidance_scale ? parseFloat(body.guidance_scale) : null,
            referenceImages: body.reference_images || []
        }, logger);

        const statsMgr = new StatsManager(env);
        ctx.waitUntil(statsMgr.incrementTotal());

        return new Response(result.imageData, {
            headers: { 
                'Content-Type': result.contentType, 
                'X-Seed': result.seed.toString(),
                ...corsHeaders() 
            }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: { message: e.message } }), { status: 400, headers: corsHeaders() });
    }
}

function handleNanoPage(request) {
  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>🍌 NanoBanana Pro</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍌</text></svg>">
<style>
:root { --primary: #FACC15; --bg-dark: #0f0f11; --panel-bg: rgba(30, 30, 35, 0.7); --border: rgba(255, 255, 255, 0.1); --text: #ffffff; --glass: blur(20px); }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: sans-serif; background: var(--bg-dark); color: var(--text); height: 100vh; display: flex; overflow: hidden; }
.sidebar { width: 380px; background: var(--panel-bg); backdrop-filter: var(--glass); padding: 24px; display: flex; flex-direction: column; border-right: 1px solid var(--border); overflow-y: auto; z-index: 10; }
.main-stage { flex: 1; background: #000; display: flex; align-items: center; justify-content: center; position: relative; }
.logo-area { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.logo-icon { font-size: 28px; }
.stats-badge { background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 6px; font-size: 11px; color: #4ade80; display: flex; align-items: center; gap: 4px; margin-left: auto; }
.control-group { margin-bottom: 20px; }
textarea, select, input { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 8px; padding: 12px; color: #fff; margin-top: 5px; }
.gen-btn { width: 100%; background: var(--primary); color: #000; border: none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; }
.gen-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.quota-box { margin-top: auto; padding-top: 15px; border-top: 1px solid var(--border); }
.quota-bar { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; margin-top: 5px; }
.quota-fill { height: 100%; background: var(--primary); width: 100%; }
#resultImg { max-width: 90%; max-height: 85%; border-radius: 12px; display: none; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
.loading { position: absolute; display: none; flex-direction: column; align-items: center; }
.spinner { font-size: 40px; animation: spin 1s infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@media (max-width: 900px) { body { flex-direction: column; } .sidebar { width: 100%; height: auto; } .main-stage { height: 50vh; order: -1; } }
</style>
</head>
<body>
    <div class="sidebar">
        <div class="logo-area">
            <div class="logo-icon">🍌</div>
            <div>
                <h1 style="font-size:18px">Nano Pro</h1>
                <div style="font-size:10px; color:#666">Flux Engine</div>
            </div>
            <div class="stats-badge">
                <span style="width:6px;height:6px;background:#4ade80;border-radius:50%;display:inline-block"></span>
                <span id="onlineCount">-</span> Online
            </div>
        </div>
        <div class="control-group"><label style="font-size:12px;color:#aaa">Prompt</label><textarea id="prompt" rows="3" placeholder="描述..."></textarea></div>
        <div class="control-group"><label style="font-size:12px;color:#aaa">Size & Style</label><div style="display:flex;gap:5px"><select id="size"><option value="1024,1024">Square 1:1</option><option value="1080,1920">Story 9:16</option><option value="1920,1080">Wallpaper 16:9</option></select><select id="style"><option value="none">無風格</option><option value="photorealistic">寫實</option><option value="anime">動漫</option><option value="cyberpunk">賽博</option></select></div></div>
        <button id="genBtn" class="gen-btn">生成圖像 (1 🍌)</button>
        <div class="quota-box"><div style="display:flex;justify-content:space-between;font-size:12px;color:#aaa"><span>Energy</span><span id="quotaText">5/5</span></div><div class="quota-bar"><div id="quotaFill" class="quota-fill"></div></div></div>
    </div>
    <div class="main-stage"><h1 style="color:#222;font-size:60px;font-weight:900" id="placeholder">NANO</h1><img id="resultImg"><div class="loading"><div class="spinner">🍌</div><div style="margin-top:10px;color:var(--primary);font-size:12px;font-weight:bold">GENERATING...</div></div></div>
<script>
    async function updateStats() { try { const res = await fetch('/stats'); const data = await res.json(); document.getElementById('onlineCount').textContent = data.online; } catch(e) {} }
    setInterval(updateStats, 10000); updateStats();
    const els = { prompt: document.getElementById('prompt'), genBtn: document.getElementById('genBtn'), img: document.getElementById('resultImg'), loader: document.querySelector('.loading'), ph: document.getElementById('placeholder') };
    let quota = 5; const cooldownKey = 'nano_cd';
    function checkCooldown() { const last = localStorage.getItem(cooldownKey); if(last) { const left = 60 - Math.floor((Date.now() - parseInt(last))/1000); if(left > 0) startTimer(left); } }
    function startTimer(sec) { els.genBtn.disabled = true; let s = sec; const t = setInterval(() => { els.genBtn.textContent = \`⚡ 回充中 (\${s}s)\`; s--; if(s < 0) { clearInterval(t); els.genBtn.disabled = false; els.genBtn.textContent = '生成圖像 (1 🍌)'; } }, 1000); }
    checkCooldown();
    els.genBtn.onclick = async () => {
        if(!els.prompt.value) return alert('請輸入提示詞');
        els.genBtn.disabled = true; els.loader.style.display = 'flex'; els.img.style.display = 'none'; els.ph.style.display = 'none';
        try {
            const [w,h] = document.getElementById('size').value.split(',').map(Number);
            const res = await fetch('/_internal/generate', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ prompt: els.prompt.value, model: 'nanobanana-pro', width: w, height: h, style: document.getElementById('style').value, seed: Math.floor(Math.random()*1e6), nologo: true }) });
            if(res.status === 429) throw new Error("限額已滿！請稍後再來"); if(!res.ok) throw new Error("生成失敗");
            const blob = await res.blob(); els.img.src = URL.createObjectURL(blob); els.img.style.display = 'block';
            localStorage.setItem(cooldownKey, Date.now()); startTimer(60); quota--; document.getElementById('quotaText').textContent = Math.max(0, quota) + '/5'; document.getElementById('quotaFill').style.width = (Math.max(0, quota)/5)*100 + '%';
        } catch(e) { alert(e.message); els.genBtn.disabled = false; } finally { els.loader.style.display = 'none'; }
    };
</script></body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html', ...corsHeaders() } });
}

function handleUI() {
  const authStatus = CONFIG.POLLINATIONS_AUTH.enabled ? '<span style="color:#22c55e;font-weight:600;font-size:12px">🔐 已認證</span>' : '<span style="color:#f59e0b;font-weight:600;font-size:12px">⚠️ 需要 API Key</span>';
  
  // 生成樣式選單 HTML (與之前版本相同)
  const styleCategories = CONFIG.STYLE_CATEGORIES;
  const stylePresets = CONFIG.STYLE_PRESETS;
  let styleOptionsHTML = '';
  const sortedCategories = Object.entries(styleCategories).sort((a, b) => a[1].order - b[1].order);
  for (const [categoryKey, categoryInfo] of sortedCategories) {
    const stylesInCategory = Object.entries(stylePresets).filter(([key, style]) => style.category === categoryKey);
    if (stylesInCategory.length > 0) {
      styleOptionsHTML += `<optgroup label="${categoryInfo.icon} ${categoryInfo.name}">`;
      for (const [styleKey, styleConfig] of stylesInCategory) {
        styleOptionsHTML += `<option value="${styleKey}"${styleKey === 'none' ? ' selected' : ''}>${styleConfig.icon} ${styleConfig.name}</option>`;
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
/* 核心樣式 - 保持不變 */
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%);color:#fff;min-height:100vh}
.container{max-width:100%;margin:0;padding:0;height:100vh;display:flex;flex-direction:column}
.top-nav{background:rgba(255,255,255,0.05);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,0.1);padding:15px 25px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
.nav-left{display:flex;align-items:center;gap:20px}
.logo{color:#f59e0b;font-size:24px;font-weight:800;text-shadow:0 0 20px rgba(245,158,11,0.6);display:flex;align-items:center;gap:10px}
.badge{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:4px 10px;border-radius:12px;font-size:11px;font-weight:600}
.nav-menu{display:flex;gap:10px;align-items:center}
.nav-btn{padding:8px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#9ca3af;cursor:pointer;font-size:14px;font-weight:600;transition:all 0.3s;display:flex;align-items:center;gap:6px;text-decoration:none}
.nav-btn:hover{border-color:#f59e0b;color:#fff}
.nav-btn.active{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);color:#fff;border-color:#f59e0b}
.nav-btn.nano-btn:hover {border-color: #FACC15; background: rgba(250, 204, 21, 0.1); color: #FACC15; box-shadow: 0 0 10px rgba(250, 204, 21, 0.2);}
.lang-btn{padding:6px 10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#ccc;cursor:pointer;font-size:12px;margin-left:10px}
.main-content{flex:1;display:flex;overflow:hidden}
.left-panel{width:320px;background:rgba(255,255,255,0.03);border-right:1px solid rgba(255,255,255,0.1);overflow-y:auto;padding:20px;flex-shrink:0}
.center-panel{flex:1;padding:20px;overflow-y:auto}
.right-panel{width:380px;background:rgba(255,255,255,0.03);border-left:1px solid rgba(255,255,255,0.1);overflow-y:auto;padding:20px;flex-shrink:0}
@media(max-width:1024px){.main-content{flex-direction:column}.left-panel,.right-panel{width:100%;border:none;border-bottom:1px solid rgba(255,255,255,0.1)}}
.page{display:none}
.page.active{display:block}
.page.active .main-content{display:flex}
.form-group{margin-bottom:16px}
label{display:block;margin-bottom:6px;font-weight:600;font-size:13px;color:#e5e7eb}
input,textarea,select{width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#fff;font-size:13px;transition:all 0.3s}
input:focus,textarea:focus,select:focus{outline:none;border-color:#f59e0b;box-shadow:0 0 0 3px rgba(245,158,11,0.1)}
select{background-color:#1e293b!important;color:#e2e8f0!important;cursor:pointer}
.btn{padding:12px 24px;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.3s;display:inline-flex;align-items:center;gap:8px;justify-content:center;width:100%}
.btn-primary{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);color:#fff;box-shadow:0 4px 15px rgba(245,158,11,0.3)}
.btn-primary:disabled{opacity:0.5;cursor:not-allowed}
.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
.gallery-item{background:rgba(0,0,0,0.4);border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);transition:all 0.3s}
.gallery-item img{width:100%;height:280px;object-fit:cover;display:block;cursor:pointer}
.gallery-info{padding:15px}
.gallery-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:5px}
.model-badge,.seed-badge,.style-badge{padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;background:rgba(255,255,255,0.1)}
.gallery-actions{display:flex;gap:8px;margin-top:10px}
.action-btn{padding:6px 12px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:6px;font-size:12px;color:#fff;cursor:pointer;flex:1}
.action-btn:hover{background:rgba(255,255,255,0.2)}
.loading{text-align:center;padding:60px 20px;color:#9ca3af}
.spinner{border:3px solid rgba(255,255,255,0.1);border-top:3px solid #f59e0b;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;margin:0 auto 15px}
@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
/* 🔥 New Stats Style */
.stats-pill {
    background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #34d399;
    padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; display: flex; align-items: center; gap: 6px;
}
.blink-dot { width: 6px; height: 6px; background: #34d399; border-radius: 50%; box-shadow: 0 0 5px #34d399; animation: pulse 2s infinite; }
@keyframes pulse { 0% {opacity: 1;} 50% {opacity: 0.5;} 100% {opacity: 1;} }
</style>
</head>
<body>
<div class="container">
<div class="top-nav">
    <div class="nav-left">
        <div class="logo">🎨 Flux AI Pro <span class="badge">v${CONFIG.PROJECT_VERSION}</span></div>
        <!-- 🔥 統計數據顯示區 -->
        <div class="stats-pill" title="實時在線人數">
            <span class="blink-dot"></span> <span id="onlineCount">-</span> Online
        </div>
        <div><div class="api-status">${authStatus}</div></div>
    </div>
    <div class="nav-menu">
        <a href="/nano" target="_blank" class="nav-btn nano-btn" style="border-color:rgba(250,204,21,0.5);color:#FACC15;margin-right:5px">
            🍌 Nano版
        </a>
        <button class="nav-btn active" data-page="generate"><span data-t="nav_gen">🎨 生成圖像</span></button>
        <button class="nav-btn" data-page="history"><span data-t="nav_his">📚 歷史記錄</span> <span id="historyCount" style="background:rgba(245,158,11,0.2);padding:2px 8px;border-radius:10px;font-size:11px">0</span></button>
        <button class="lang-btn" id="langSwitch">EN / 繁中</button>
    </div>
</div>
<div id="generatePage" class="page active">
<div class="main-content">
<div class="left-panel">
<div class="section-title" data-t="settings_title">⚙️ 生成參數</div>
<form id="generateForm">
<div class="form-group">
    <label data-t="model_label">模型選擇</label>
    <select id="model">
        <optgroup label="🤖 GPT-Image Series">
        <option value="gptimage" selected>GPT-Image 🎨</option>
        <option value="gptimage-large">GPT-Image Large 🌟</option>
        </optgroup>
        <optgroup label="⚡ Z-Image Series">
        <option value="zimage">Z-Image Turbo ⚡ (6B)</option>
        </optgroup>
        <optgroup label="🎨 Flux Series">
        <option value="flux">Flux Standard</option>
        <option value="turbo">Flux Turbo ⚡</option>
        </optgroup>
        <optgroup label="🖼️ Kontext Series">
        <option value="kontext">Kontext 🎨 (Img2Img)</option>
        </optgroup>
    </select>
</div>
<div class="form-group"><label data-t="size_label">尺寸預設</label><select id="size"><option value="square-1k" selected>Square 1024x1024</option><option value="square-1.5k">Square 1536x1536</option><option value="portrait-9-16-hd">Portrait 1080x1920</option><option value="landscape-16-9-hd">Landscape 1920x1080</option></select></div>
<div class="form-group"><label data-t="style_label">藝術風格 🎨</label><select id="style">${styleOptionsHTML}</select></div>
<div class="form-group"><label data-t="quality_label">質量模式</label><select id="qualityMode"><option value="economy">Economy</option><option value="standard" selected>Standard</option><option value="ultra">Ultra HD</option></select></div>
<div class="form-group">
    <label data-t="seed_label">Seed (種子碼)</label>
    <div style="display:flex; gap:10px;">
        <input type="number" id="seed" value="-1" placeholder="Random (-1)" disabled style="flex:1; opacity: 0.7; cursor: not-allowed; font-family: monospace;">
        <button type="button" id="seedToggleBtn" class="btn" style="width:auto; padding:0 15px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2);">🎲</button>
    </div>
</div>
<div class="form-group" style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; margin-top:15px;">
    <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
            <label for="autoOptimize" style="margin:0; cursor:pointer;" data-t="auto_opt_label">✨ 自動優化</label>
            <div style="font-size:11px; color:#9ca3af; margin-top:2px;" data-t="auto_opt_desc">自動調整 Steps 與 Guidance</div>
        </div>
        <input type="checkbox" id="autoOptimize" checked style="width:auto; width:20px; height:20px; cursor:pointer;">
    </div>
    <div id="advancedParams" style="display:none; margin-top:15px; border-top:1px solid rgba(255,255,255,0.1); padding-top:15px;">
        <div style="font-size:12px; color:#f59e0b; margin-bottom:10px; font-weight:bold;" data-t="adv_settings">🛠️ 進階參數</div>
        <div class="form-group"><label data-t="steps_label">生成步數 (Steps)</label><input type="number" id="steps" value="25" min="1" max="50"></div>
        <div class="form-group"><label data-t="guidance_label">引導係數 (Guidance)</label><input type="number" id="guidanceScale" value="7.5" step="0.1" min="1" max="20"></div>
    </div>
</div>
<button type="submit" class="btn btn-primary" id="generateBtn" data-t="gen_btn" style="margin-top:10px;">🎨 開始生成</button>
</form>
</div>
<div class="center-panel">
<div id="results"><div class="empty-state"><p data-t="empty_title">尚未生成任何圖像</p></div></div>
</div>
<div class="right-panel">
<div class="form-group"><label data-t="pos_prompt">正面提示詞</label><textarea id="prompt" placeholder="Describe your image..." required></textarea></div>
<div class="form-group"><label data-t="neg_prompt">負面提示詞 (可選)</label><textarea id="negativePrompt" placeholder="What to avoid..." rows="4"></textarea></div>
<div class="form-group"><label data-t="ref_img">參考圖像 URL (Kontext 專用)</label><textarea id="referenceImages" placeholder="Image URLs separated by comma" rows="3"></textarea></div>
</div></div></div>
<div id="historyPage" class="page">
<div class="main-content" style="flex-direction:column;padding:20px">
<div class="history-header">
<div class="history-stats"><div class="stat-item"><div class="label" data-t="stat_total">📊 總記錄數</div><div class="value" id="historyTotal">0</div></div><div class="stat-item"><div class="label" data-t="stat_storage">💾 存儲空間 (永久)</div><div class="value" id="storageSize">0 KB</div></div></div>
<div class="history-actions"><button class="btn btn-secondary" id="exportBtn" style="width:auto;padding:10px 20px" data-t="btn_export">📥 導出</button><button class="btn btn-danger" id="clearBtn" style="width:auto;padding:10px 20px" data-t="btn_clear">🗑️ 清空</button></div>
</div>
<div id="historyList" style="padding:0 20px"><p>Loading history...</p></div>
</div></div>
<div id="imageModal" class="modal"><span class="modal-close" id="modalCloseBtn">×</span><div class="modal-content"><img id="modalImage" src=""></div></div>
<script>
// I18N & Logic
const I18N={zh:{nav_gen:"🎨 生成圖像",nav_his:"📚 歷史記錄",settings_title:"⚙️ 生成參數",model_label:"模型選擇",size_label:"尺寸預設",style_label:"藝術風格 🎨",quality_label:"質量模式",seed_label:"Seed (種子碼)",seed_random:"🎲 隨機",seed_lock:"🔒 鎖定",auto_opt_label:"✨ 自動優化",auto_opt_desc:"自動調整 Steps 與 Guidance",adv_settings:"🛠️ 進階參數",steps_label:"生成步數 (Steps)",guidance_label:"引導係數 (Guidance)",gen_btn:"🎨 開始生成",empty_title:"尚未生成任何圖像",pos_prompt:"正面提示詞",neg_prompt:"負面提示詞 (可選)",ref_img:"參考圖像 URL (Kontext 專用)",stat_total:"📊 總記錄數",stat_storage:"💾 存儲空間 (永久)",btn_export:"📥 導出",btn_clear:"🗑️ 清空",no_history:"暫無歷史記錄",btn_reuse:"🔄 重用",btn_dl:"💾 下載"},en:{nav_gen:"🎨 Create",nav_his:"📚 History",settings_title:"⚙️ Settings",model_label:"Model",size_label:"Size",style_label:"Art Style 🎨",quality_label:"Quality",seed_label:"Seed",seed_random:"🎲 Random",seed_lock:"🔒 Lock",auto_opt_label:"✨ Auto Optimize",auto_opt_desc:"Auto adjust Steps & Guidance",adv_settings:"🛠️ Advanced",steps_label:"Steps",guidance_label:"Guidance Scale",gen_btn:"🎨 Generate",empty_title:"No images yet",pos_prompt:"Positive Prompt",neg_prompt:"Negative Prompt",ref_img:"Reference Image URL",stat_total:"📊 Total",stat_storage:"💾 Storage",btn_export:"📥 Export",btn_clear:"🗑️ Clear",no_history:"No history found",btn_reuse:"🔄 Reuse",btn_dl:"💾 Save"}};
let curLang='zh';
function toggleLang(){curLang=curLang==='zh'?'en':'zh';updateLang();}
function updateLang(){document.querySelectorAll('[data-t]').forEach(el=>{const k=el.getAttribute('data-t');if(I18N[curLang][k])el.textContent=I18N[curLang][k];});const b=document.getElementById('seedToggleBtn');if(b)b.innerHTML=isSeedRandom?I18N[curLang].seed_random:I18N[curLang].seed_lock;}
document.getElementById('langSwitch').onclick=toggleLang;
const PRESET_SIZES=${JSON.stringify(CONFIG.PRESET_SIZES)};
const STYLE_PRESETS=${JSON.stringify(CONFIG.STYLE_PRESETS)};
const DB_NAME='FluxAI_DB',STORE_NAME='images',DB_VERSION=1;
const dbPromise=new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,DB_VERSION);req.onupgradeneeded=(e)=>{const db=e.target.result;if(!db.objectStoreNames.contains(STORE_NAME))db.createObjectStore(STORE_NAME,{keyPath:'id'});};req.onsuccess=(e)=>resolve(e.target.result);req.onerror=(e)=>reject(e.target.error);});
async function saveToDB(item){const db=await dbPromise;return new Promise((resolve)=>{const tx=db.transaction(STORE_NAME,'readwrite');const store=tx.objectStore(STORE_NAME);store.put(item);tx.oncomplete=()=>resolve();});}
async function getHistoryFromDB(){const db=await dbPromise;return new Promise((resolve)=>{const tx=db.transaction(STORE_NAME,'readonly');const store=tx.objectStore(STORE_NAME);const req=store.getAll();req.onsuccess=()=>resolve((req.result||[]).sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp)));});}
async function deleteFromDB(id){const db=await dbPromise;const tx=db.transaction(STORE_NAME,'readwrite');tx.objectStore(STORE_NAME).delete(id);await new Promise(r=>tx.oncomplete=r);updateHistoryDisplay();}
async function clearDB(){const db=await dbPromise;const tx=db.transaction(STORE_NAME,'readwrite');tx.objectStore(STORE_NAME).clear();await new Promise(r=>tx.oncomplete=r);updateHistoryDisplay();}
async function addToHistory(item){let base64Data=item.image;if(!base64Data&&item.url){try{const resp=await fetch(item.url);const blob=await resp.blob();base64Data=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(blob);});}catch(e){console.error("Image convert failed",e);}}const record={id:Date.now()+Math.random(),timestamp:new Date().toISOString(),prompt:item.prompt,model:item.model,style:item.style,seed:item.seed,base64:base64Data||item.url};await saveToDB(record);}
async function updateHistoryDisplay(){const history=await getHistoryFromDB();const list=document.getElementById('historyList');document.getElementById('historyCount').textContent=history.length;document.getElementById('historyTotal').textContent=history.length;const size=JSON.stringify(history).length;document.getElementById('storageSize').textContent=(size/1024/1024).toFixed(2)+' MB';if(history.length===0){list.innerHTML='<div class="empty-state"><p>'+I18N[curLang].no_history+'</p></div>';return;}const div=document.createElement('div');div.className='gallery';history.forEach(item=>{const imgSrc=item.base64||item.url;const d=document.createElement('div');d.className='gallery-item';d.innerHTML=\`<img src="\${imgSrc}" loading="lazy"><div class="gallery-info"><div class="gallery-meta"><span class="model-badge">\${item.model}</span><span class="seed-badge">#\${item.seed}</span></div><div class="gallery-actions"><button class="action-btn reuse-btn">\${I18N[curLang].btn_reuse}</button><button class="action-btn download-btn">\${I18N[curLang].btn_dl}</button><button class="action-btn delete delete-btn">🗑️</button></div></div>\`;d.querySelector('img').onclick=()=>openModal(imgSrc);d.querySelector('.reuse-btn').onclick=()=>{document.getElementById('prompt').value=item.prompt||'';document.getElementById('model').value=item.model||'gptimage';document.getElementById('style').value=item.style||'none';const savedSeed=item.seed;if(savedSeed&&savedSeed!==-1&&savedSeed!=='-1'){isSeedRandom=false;seedInput.value=savedSeed;}else{isSeedRandom=true;seedInput.value='-1';}updateSeedUI();document.querySelector('[data-page="generate"]').click();};d.querySelector('.download-btn').onclick=()=>{const a=document.createElement('a');a.href=imgSrc;a.download='flux-'+item.seed+'.png';a.click();};d.querySelector('.delete-btn').onclick=()=>deleteFromDB(item.id);div.appendChild(d);});list.innerHTML='';list.appendChild(div);}
function openModal(src){document.getElementById('modalImage').src=src;document.getElementById('imageModal').classList.add('show');}
document.getElementById('modalCloseBtn').onclick=()=>document.getElementById('imageModal').classList.remove('show');
document.getElementById('clearBtn').onclick=()=>{if(confirm('Clear all history?'))clearDB();};
document.getElementById('exportBtn').onclick=async()=>{const history=await getHistoryFromDB();const blob=new Blob([JSON.stringify(history,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='flux-history.json';a.click();};
const seedInput=document.getElementById('seed');const seedToggleBtn=document.getElementById('seedToggleBtn');const autoOptCheckbox=document.getElementById('autoOptimize');const advParamsDiv=document.getElementById('advancedParams');let isSeedRandom=true;
function updateSeedUI(){if(isSeedRandom){seedInput.value='-1';seedInput.disabled=true;seedInput.style.opacity='0.7';seedInput.style.cursor='not-allowed';seedToggleBtn.innerHTML=I18N[curLang].seed_random;seedToggleBtn.classList.remove('active');seedToggleBtn.style.background='rgba(255,255,255,0.1)';seedToggleBtn.style.color='#fff';}else{if(seedInput.value==='-1')seedInput.value=Math.floor(Math.random()*1000000);seedInput.disabled=false;seedInput.style.opacity='1';seedInput.style.cursor='text';seedToggleBtn.innerHTML=I18N[curLang].seed_lock;seedToggleBtn.classList.add('active');seedToggleBtn.style.background='#f59e0b';seedToggleBtn.style.color='#000';}}
seedToggleBtn.addEventListener('click',()=>{isSeedRandom=!isSeedRandom;updateSeedUI();});autoOptCheckbox.addEventListener('change',()=>{advParamsDiv.style.display=autoOptCheckbox.checked?'none':'block';});
document.querySelectorAll('.nav-btn:not(.nano-btn)').forEach(btn=>{btn.addEventListener('click',function(){const p=this.dataset.page;if(!p)return;document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.nav-btn').forEach(x=>x.classList.remove('active'));document.getElementById(p+'Page').classList.add('active');this.classList.add('active');if(p==='history')updateHistoryDisplay();});});
// 🔥 實時統計邏輯
async function fetchStats() {
    try {
        const r = await fetch('/stats');
        const d = await r.json();
        document.getElementById('onlineCount').textContent = d.online;
    } catch(e) {}
}
setInterval(fetchStats, 10000);
fetchStats(); // Initial load

document.getElementById('generateForm').addEventListener('submit',async(e)=>{e.preventDefault();const btn=document.getElementById('generateBtn');if(btn.disabled)return;const prompt=document.getElementById('prompt').value;const resDiv=document.getElementById('results');const sizeConfig=PRESET_SIZES[document.getElementById('size').value];if(!prompt)return;btn.disabled=true;btn.textContent=curLang==='zh'?'生成中...':'Generating...';resDiv.innerHTML='<div class="loading"><div class="spinner"></div></div>';const currentSeed=isSeedRandom?-1:parseInt(seedInput.value);const isAutoOpt=autoOptCheckbox.checked;try{const res=await fetch('/_internal/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,model:document.getElementById('model').value,width:sizeConfig.width,height:sizeConfig.height,style:document.getElementById('style').value,quality_mode:document.getElementById('qualityMode').value,seed:currentSeed,auto_optimize:isAutoOpt,steps:isAutoOpt?null:parseInt(document.getElementById('steps').value),guidance_scale:isAutoOpt?null:parseFloat(document.getElementById('guidanceScale').value),negative_prompt:document.getElementById('negativePrompt').value,reference_images:document.getElementById('referenceImages').value.split(',').filter(u=>u.trim())})});
// 🔥 429 處理
if(res.status === 429) { const d = await res.json(); throw new Error(d.error?.message || "Rate limit"); }
let items=[];const contentType=res.headers.get('content-type');if(contentType&&contentType.startsWith('image/')){const blob=await res.blob();const reader=new FileReader();reader.readAsDataURL(blob);reader.onloadend=async()=>{const base64=reader.result;const item={image:base64,prompt,model:res.headers.get('X-Model'),seed:res.headers.get('X-Seed'),style:res.headers.get('X-Style')};await addToHistory(item);displayResult([item]);btn.disabled=false;btn.textContent=I18N[curLang].gen_btn;};}else{const data=await res.json();if(data.error)throw new Error(data.error.message);for(const d of data.data){const item={...d,prompt};await addToHistory(item);items.push(item);}displayResult(items);btn.disabled=false;btn.textContent=I18N[curLang].gen_btn;}}catch(err){resDiv.innerHTML='<p style="color:red;text-align:center">'+err.message+'</p>';btn.disabled=false;btn.textContent=I18N[curLang].gen_btn;}});
function displayResult(items){const div=document.createElement('div');div.className='gallery';items.forEach(item=>{const d=document.createElement('div');d.className='gallery-item';d.innerHTML=\`<img src="\${item.image||item.url}" onclick="openModal(this.src)">\`;div.appendChild(d);});document.getElementById('results').innerHTML='';document.getElementById('results').appendChild(div);}
window.onload=()=>{updateLang();updateHistoryDisplay();};
</script>
</body>
</html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8', ...corsHeaders() } });
}
