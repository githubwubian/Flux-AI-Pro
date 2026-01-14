// =================================================================================
//  項目: Flux AI Pro - Multi-Provider Edition
//  版本: 10.7.1 (修復 IndexedDB keyPath 錯誤)
//  更新: 支持 Pollinations + Infip.pro 多供應商，自動獲取模型
// =================================================================================

const CONFIG = {
  PROJECT_NAME: "Flux-AI-Pro",
  PROJECT_VERSION: "10.7.1",
  API_MASTER_KEY: "1",
  FETCH_TIMEOUT: 120000,
  MAX_RETRIES: 3,
  
  POLLINATIONS_AUTH: {
    enabled: true,
    token: "", 
    method: "header"
  },
  
  INFIP_AUTH: {
    enabled: false,
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
      endpoint: "https://image.pollinations.ai",
      pathPrefix: "",
      type: "direct",
      auth_mode: "required",
      requires_key: true,
      enabled: true,
      default: true,
      description: "官方 AI 圖像生成服務",
      features: {
        private_mode: true, custom_size: true, seed_control: true, negative_prompt: true, 
        enhance: true, nologo: true, style_presets: true, auto_hd: true, quality_modes: true, 
        auto_translate: true, reference_images: true, image_to_image: true, batch_generation: true, 
        api_key_auth: true
      },
      models: [
        { id: "nanobanana-pro", name: "Nano Banana Pro 🍌", confirmed: true, category: "special", description: "Nano Banana Pro 風格模型", max_size: 2048, pricing: { image_price: 0, currency: "free" }, input_modalities: ["text"], output_modalities: ["image"] },
        { id: "gptimage", name: "GPT-Image 🎨", confirmed: true, category: "gptimage", description: "通用 GPT 圖像生成模型", max_size: 2048, pricing: { image_price: 0.0002, currency: "pollen" }, input_modalities: ["text"], output_modalities: ["image"] },
        { id: "gptimage-large", name: "GPT-Image Large 🌟", confirmed: true, category: "gptimage", description: "高質量 GPT 圖像生成模型", max_size: 2048, pricing: { image_price: 0.0003, currency: "pollen" }, input_modalities: ["text"], output_modalities: ["image"] },
        { id: "zimage", name: "Z-Image Turbo ⚡", confirmed: true, category: "zimage", description: "快速 6B 參數圖像生成", max_size: 2048, pricing: { image_price: 0.0002, currency: "pollen" }, input_modalities: ["text"], output_modalities: ["image"] },
        { id: "flux", name: "Flux 標準版", confirmed: true, category: "flux", description: "快速且高質量的圖像生成", max_size: 2048, pricing: { image_price: 0.00012, currency: "pollen" }, input_modalities: ["text"], output_modalities: ["image"] },
        { id: "turbo", name: "Flux Turbo ⚡", confirmed: true, category: "flux", description: "超快速圖像生成", max_size: 2048, pricing: { image_price: 0.0003, currency: "pollen" }, input_modalities: ["text"], output_modalities: ["image"] },
        { id: "kontext", name: "Kontext 🎨", confirmed: true, category: "kontext", description: "上下文感知圖像生成（支持圖生圖）", max_size: 2048, pricing: { image_price: 0.04, currency: "pollen" }, supports_reference_images: true, max_reference_images: 1, input_modalities: ["text", "image"], output_modalities: ["image"] }
      ],
      rate_limit: null,
      max_size: { width: 2048, height: 2048 }
    },
    
    infip: {
      name: "Infip.pro",
      endpoint: "https://api.infip.pro",
      pathPrefix: "/v1/images/generations",
      type: "openai-compatible",
      auth_mode: "required",
      requires_key: true,
      enabled: false,
      default: false,
      description: "OpenAI 兼容的圖像生成 API",
      features: {
        private_mode: true, custom_size: true, seed_control: false, negative_prompt: true, 
        enhance: false, nologo: true, style_presets: true, auto_hd: true, quality_modes: true, 
        auto_translate: true, reference_images: false, image_to_image: false, batch_generation: true, 
        api_key_auth: true, auto_fetch_models: true
      },
      models: [],
      rate_limit: null,
      max_size: { width: 2048, height: 2048 }
    }
  },
  
  DEFAULT_PROVIDER: "pollinations",
  
  STYLE_CATEGORIES: {
    basic: { name: "基礎", icon: "⚡", order: 1 },
    illustration: { name: "插畫", icon: "🎨", order: 2 },
    manga: { name: "漫畫", icon: "📖", order: 3 },
    monochrome: { name: "黑白", icon: "⚫", order: 4 },
    realistic: { name: "寫實", icon: "📷", order: 5 },
    painting: { name: "繪畫", icon: "🖼️", order: 6 },
    "art-movement": { name: "藝術運動", icon: "🎭", order: 7 },
    visual: { name: "視覺風格", icon: "✨", order: 8 },
    digital: { name: "數位藝術", icon: "💻", order: 9 }
  },
  
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
    "3d-render": { name: "3D渲染", prompt: "3d render, cinema 4d, octane render, detailed, professional lighting, ray tracing, photorealistic 3d", negative: "2d, flat, hand drawn, sketchy", category: "digital", icon: "🎬", description: "專業3D渲染效果" },
    cyberpunk: { name: "賽博龐克", prompt: "cyberpunk style, neon lights, futuristic, dystopian, high tech low life, dark atmosphere, rain, urban", negative: "natural, rural, historical, bright daylight", category: "visual", icon: "🌃", description: "賽博龐克未來都市" }
  }
};

function corsHeaders(additional = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Source',
    ...additional
  };
}

function getClientIP(request) {
  return request.headers.get('CF-Connecting-IP') || 
         request.headers.get('X-Forwarded-For')?.split(',')[0] || 
         'unknown';
}

async function fetchWithTimeout(url, options = {}, timeout = 30000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

function normalizeInfipSize(width, height) {
  const ratio = width / height;
  if (Math.abs(ratio - 1) < 0.12) return "1024x1024";
  if (ratio > 1) return "1792x1024";
  return "1024x1792";
}

async function fetchInfipModels(apiKey) {
  try {
    const response = await fetchWithTimeout('https://api.infip.pro/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      }
    }, 10000);

    if (!response.ok) {
      console.error('Infip /v1/models failed: ' + response.status);
      return [];
    }

    const data = await response.json();
    return (data.data || []).map(m => ({
      id: m.id,
      name: m.id,
      confirmed: true,
      category: "infip",
      description: 'Infip model (tier: ' + (m.tier || 'unknown') + ')',
      max_size: 2048,
      pricing: { image_price: 0, currency: "credits" },
      input_modalities: ["text"],
      output_modalities: ["image"]
    }));
  } catch (error) {
    console.error("Failed to fetch Infip models:", error.message);
    return [];
  }
}

class Logger {
  constructor() { this.logs = []; }
  add(stage, data) { this.logs.push({ stage: stage, timestamp: new Date().toISOString(), ...data }); }
  get() { return this.logs; }
}

class RateLimiter {
  constructor(env) { this.env = env; }
  async checkLimit(clientIP) {
    if (!this.env.FLUX_KV) return { allowed: true, remaining: 5 };
    const now = new Date();
    const hourKey = 'nano_limit_' + clientIP + '_' + now.toDateString() + '_' + now.getHours();
    const count = await this.env.FLUX_KV.get(hourKey);
    const used = count ? parseInt(count) : 0;
    if (used >= 5) return { allowed: false, remaining: 0, reason: "🍌 本小時的 Nano Banana 能量已耗盡！請稍後再來（每小時限 5 張）" };
    await this.env.FLUX_KV.put(hourKey, (used + 1).toString(), { expirationTtl: 3600 });
    return { allowed: true, remaining: 5 - used - 1 };
  }
}

async function translateToEnglish(text, env) {
  if (!env || !env.AI) return { translated: false, text: text, error: "AI binding not available" };
  try {
    const response = await env.AI.run('@cf/meta/m2m100-1.2b', {
      text: text,
      source_lang: "zh",
      target_lang: "en"
    });
    if (response && response.translated_text) {
      return { translated: true, text: response.translated_text, original: text };
    }
    return { translated: false, text: text, error: "No translation returned" };
  } catch (error) {
    return { translated: false, text: text, error: error.message };
  }
}

class PromptAnalyzer {
  static analyzeComplexity(prompt) {
    const words = prompt.split(/\s+/).length;
    const hasDetails = /\b(detailed|intricate|complex|elaborate)\b/i.test(prompt);
    const hasLighting = /\b(lighting|light|shadow|glow|illuminate)\b/i.test(prompt);
    const hasTexture = /\b(texture|material|surface|grain)\b/i.test(prompt);
    let score = Math.min(words / 50, 1) * 0.4;
    if (hasDetails) score += 0.2;
    if (hasLighting) score += 0.2;
    if (hasTexture) score += 0.2;
    return Math.min(score, 1);
  }
  
  static recommendQualityMode(prompt, model) {
    const complexity = this.analyzeComplexity(prompt);
    if (complexity > 0.7) return 'ultra';
    if (complexity > 0.4) return 'standard';
    return 'economy';
  }
}

class HDOptimizer {
  static optimize(prompt, negativePrompt, model, width, height, qualityMode, autoHD) {
    if (!autoHD) return { prompt: prompt, negativePrompt: negativePrompt, width: width, height: height, optimized: false };
    
    let enhancedPrompt = prompt;
    let enhancedNegative = negativePrompt;
    let finalWidth = width;
    let finalHeight = height;
    let optimizations = [];
    let hdLevel = 'standard';
    let sizeUpscaled = false;
    
    if (qualityMode === 'ultra') {
      hdLevel = 'ultra';
      if (width <= 1024 && height <= 1024) {
        finalWidth = Math.min(width * 1.5, 2048);
        finalHeight = Math.min(height * 1.5, 2048);
        sizeUpscaled = true;
        optimizations.push('Resolution upscaled 1.5x for ultra quality');
      }
      if (!/\b(8k|4k|uhd|ultra|high.?quality|high.?res)\b/i.test(enhancedPrompt)) {
        enhancedPrompt = enhancedPrompt + ', 8k uhd, ultra high quality, sharp focus, professional';
        optimizations.push('Added ultra HD quality keywords');
      }
      if (enhancedNegative && !/\blow.?quality\b/i.test(enhancedNegative)) {
        enhancedNegative = enhancedNegative + ', low quality, blurry, pixelated, low resolution';
        optimizations.push('Enhanced negative prompt for ultra mode');
      }
    } else if (qualityMode === 'standard') {
      hdLevel = 'standard';
      if (!/\b(high.?quality|detailed)\b/i.test(enhancedPrompt)) {
        enhancedPrompt = enhancedPrompt + ', high quality, detailed';
        optimizations.push('Added standard HD keywords');
      }
    }
    
    return {
      prompt: enhancedPrompt,
      negativePrompt: enhancedNegative,
      width: Math.round(finalWidth),
      height: Math.round(finalHeight),
      optimized: optimizations.length > 0,
      optimizations: optimizations,
      hd_level: hdLevel,
      size_upscaled: sizeUpscaled
    };
  }
}

class ParameterOptimizer {
  static optimizeSteps(model, width, height, style, qualityMode, userSteps) {
    if (userSteps !== null && userSteps !== undefined) return { steps: userSteps, reasoning: "User specified" };
    
    let baseSteps = 20;
    const totalPixels = width * height;
    
    if (qualityMode === 'ultra') baseSteps = 30;
    else if (qualityMode === 'economy') baseSteps = 15;
    
    if (totalPixels > 2048 * 2048) baseSteps += 5;
    
    if (style !== 'none' && CONFIG.STYLE_PRESETS[style]) {
      const styleCategory = CONFIG.STYLE_PRESETS[style].category;
      if (styleCategory === 'realistic' || styleCategory === 'painting') baseSteps += 5;
    }
    
    if (model === 'turbo') baseSteps = Math.max(Math.round(baseSteps * 0.6), 10);
    
    return { steps: Math.min(baseSteps, 50), reasoning: "Auto-optimized based on quality mode, size, and style" };
  }
  
  static optimizeGuidance(model, style, qualityMode) {
    let guidance = 7.5;
    
    if (qualityMode === 'ultra') guidance = 8.5;
    else if (qualityMode === 'economy') guidance = 6.5;
    
    if (style !== 'none' && CONFIG.STYLE_PRESETS[style]) {
      const styleCategory = CONFIG.STYLE_PRESETS[style].category;
      if (styleCategory === 'realistic') guidance += 1;
      else if (styleCategory === 'abstract' || styleCategory === 'art-movement') guidance -= 0.5;
    }
    
    if (model === 'turbo') guidance = Math.max(guidance - 1, 5);
    
    return Math.max(Math.min(guidance, 15), 3);
  }
}

class StyleProcessor {
  static applyStyle(prompt, styleKey, negativePrompt) {
    if (!styleKey || styleKey === 'none') return { enhancedPrompt: prompt, enhancedNegative: negativePrompt };
    
    const style = CONFIG.STYLE_PRESETS[styleKey];
    if (!style) return { enhancedPrompt: prompt, enhancedNegative: negativePrompt };
    
    let enhancedPrompt = prompt;
    if (style.prompt) {
      enhancedPrompt = prompt + ', ' + style.prompt;
    }
    
    let enhancedNegative = negativePrompt || "";
    if (style.negative) {
      enhancedNegative = enhancedNegative ? enhancedNegative + ', ' + style.negative : style.negative;
    }
    
    return { enhancedPrompt: enhancedPrompt, enhancedNegative: enhancedNegative };
  }
}
// =================================================================================
//  Provider 類別：Pollinations 和 Infip
// =================================================================================

class PollinationsProvider {
  constructor(config, env) { 
    this.config = config; 
    this.name = config.name; 
    this.env = env; 
  }
  
  async generate(prompt, options, logger) {
    const { 
      model = "zimage", width = 1024, height = 1024, seed = -1, 
      negativePrompt = "", guidance = null, steps = null, 
      enhance = false, nologo = true, privateMode = true, 
      style = "none", autoOptimize = true, autoHD = true, 
      qualityMode = 'standard', referenceImages = []
    } = options;

    let apiModel = model; 
    
    const modelConfig = this.config.models.find(m => m.id === model);
    const supportsRefImages = modelConfig?.supports_reference_images || false;
    const maxRefImages = modelConfig?.max_reference_images || 0;
    
    let validReferenceImages = [];
    if (referenceImages && referenceImages.length > 0) {
      if (!supportsRefImages) {
        logger.add("⚠️ Reference Images", { 
          warning: model + " 不支持參考圖像，已忽略", 
          supported_models: ["kontext"] 
        });
      } else if (referenceImages.length > maxRefImages) {
        logger.add("⚠️ Reference Images", { 
          warning: model + " 最多支持 " + maxRefImages + " 張參考圖", 
          provided: referenceImages.length, 
          using: maxRefImages 
        });
        validReferenceImages = referenceImages.slice(0, maxRefImages);
      } else {
        validReferenceImages = referenceImages;
        logger.add("🖼️ Reference Images", { 
          model: model, 
          count: validReferenceImages.length, 
          max_allowed: maxRefImages, 
          mode: "圖生圖" 
        });
      }
    }
    
    let basePrompt = prompt;
    let translationLog = { translated: false };

    if (/[\u4e00-\u9fa5]/.test(prompt)) {
      logger.add("🌐 Pre-translation", { message: "Detecting Chinese, translating first..." });
      const translation = await translateToEnglish(prompt, this.env);
      if (translation.translated) {
        basePrompt = translation.text;
        translationLog = translation;
        logger.add("✅ Translation Success", { original: prompt, translated: basePrompt });
      } else {
        logger.add("⚠️ Translation Failed", { error: translation.error });
      }
    }

    const promptComplexity = PromptAnalyzer.analyzeComplexity(basePrompt);
    const recommendedQuality = PromptAnalyzer.recommendQualityMode(basePrompt, model);
    logger.add("🧠 Prompt Analysis", { 
      complexity: (promptComplexity * 100).toFixed(1) + '%', 
      recommended_quality: recommendedQuality, 
      selected_quality: qualityMode, 
      has_reference_images: validReferenceImages.length > 0 
    });
    
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
      if (hdOptimization.optimized) {
        logger.add("🎨 HD Optimization", { 
          mode: qualityMode, 
          hd_level: hdOptimization.hd_level, 
          original: width + "x" + height, 
          optimized: finalWidth + "x" + finalHeight, 
          upscaled: hdOptimization.size_upscaled, 
          details: hdOptimization.optimizations 
        });
      }
    }
    
    let finalSteps = steps;
    let finalGuidance = guidance;
    
    if (autoOptimize) {
      const stepsOptimization = ParameterOptimizer.optimizeSteps(model, finalWidth, finalHeight, style, qualityMode, steps);
      finalSteps = stepsOptimization.steps;
      logger.add("🎯 Steps Optimization", { 
        steps: stepsOptimization.steps, 
        reasoning: stepsOptimization.reasoning 
      });
      if (guidance === null) finalGuidance = ParameterOptimizer.optimizeGuidance(model, style, qualityMode);
      else finalGuidance = guidance;
    } else {
      finalSteps = steps || 20;
      finalGuidance = guidance || 7.5;
    }
    
    const { enhancedPrompt, enhancedNegative } = StyleProcessor.applyStyle(optimizedPrompt, style, finalNegative);
    const finalFullPrompt = enhancedPrompt;

    logger.add("🎨 Style Processing", { 
      selected_style: style, 
      style_name: CONFIG.STYLE_PRESETS[style]?.name || style, 
      style_applied: style !== 'none', 
      original_prompt_length: optimizedPrompt.length, 
      enhanced_prompt_length: enhancedPrompt.length 
    });
    
    const currentSeed = seed === -1 ? Math.floor(Math.random() * 1000000) : seed;
    let fullPrompt = finalFullPrompt;
    if (enhancedNegative && enhancedNegative.trim()) {
      fullPrompt = finalFullPrompt + " [negative: " + enhancedNegative + "]";
    }
    
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const pathPrefix = this.config.pathPrefix || "";
    let baseUrl = this.config.endpoint + pathPrefix + "/" + encodedPrompt;
    
    const params = new URLSearchParams();
    params.append('model', apiModel); 
    params.append('width', finalWidth.toString());
    params.append('height', finalHeight.toString());
    params.append('seed', currentSeed.toString());
    params.append('nologo', nologo.toString());
    params.append('enhance', enhance.toString());
    params.append('private', privateMode.toString());
    
    if (validReferenceImages && validReferenceImages.length > 0) {
      params.append('image', validReferenceImages.join(','));
      logger.add("🖼️ Reference Images Added", { 
        count: validReferenceImages.length, 
        urls: validReferenceImages 
      });
    }
    
    if (finalGuidance !== 7.5) params.append('guidance', finalGuidance.toString());
    if (finalSteps !== 20) params.append('steps', finalSteps.toString());
    
    const headers = { 
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 
      'Accept': 'image/*', 
      'Referer': 'https://pollinations.ai/' 
    };
    
    const authConfig = CONFIG.POLLINATIONS_AUTH;
    if (authConfig.enabled && authConfig.token) {
      headers['Authorization'] = 'Bearer ' + authConfig.token;
      logger.add("🔐 API Authentication", { 
        method: "Bearer Token", 
        token_prefix: authConfig.token.substring(0, 8) + "...", 
        enabled: true, 
        endpoint: this.config.endpoint 
      });
    } else {
      logger.add("⚠️ No API Key", { 
        authenticated: false, 
        note: "新 API 端點需要 API Key，請設置 POLLINATIONS_API_KEY 環境變量", 
        endpoint: this.config.endpoint, 
        warning: "未認證的請求可能會失敗" 
      });
    }
    
    const url = baseUrl + '?' + params.toString();
    logger.add("📡 API Request", { 
      endpoint: this.config.endpoint, 
      path: pathPrefix + "/" + encodedPrompt.substring(0, 50) + "...", 
      model: apiModel, 
      authenticated: authConfig.enabled && !!authConfig.token, 
      full_url: url.substring(0, 100) + "..." 
    });
    
    for (let retry = 0; retry < CONFIG.MAX_RETRIES; retry++) {
      try {
        const response = await fetchWithTimeout(url, { method: 'GET', headers: headers }, 120000);
        
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.startsWith('image/')) {
            logger.add("✅ Success", { 
              url: response.url, 
              used_model: apiModel, 
              final_size: finalWidth + "x" + finalHeight, 
              quality_mode: qualityMode, 
              style_used: style, 
              style_name: CONFIG.STYLE_PRESETS[style]?.name || style, 
              hd_optimized: autoHD && hdOptimization?.optimized, 
              auto_translated: translationLog.translated, 
              reference_images_used: validReferenceImages.length, 
              generation_mode: validReferenceImages.length > 0 ? "圖生圖" : "文生圖", 
              authenticated: authConfig.enabled && !!authConfig.token, 
              seed: currentSeed 
            });
            
            const imageBlob = await response.blob();
            const imageBuffer = await imageBlob.arrayBuffer();
            
            return { 
              imageData: imageBuffer, 
              contentType: contentType, 
              url: response.url, 
              provider: this.name, 
              model: model, 
              requested_model: model, 
              seed: currentSeed, 
              style: style, 
              style_name: CONFIG.STYLE_PRESETS[style]?.name || style, 
              style_category: CONFIG.STYLE_PRESETS[style]?.category || 'unknown', 
              steps: finalSteps, 
              guidance: finalGuidance, 
              width: finalWidth, 
              height: finalHeight, 
              quality_mode: qualityMode, 
              prompt_complexity: promptComplexity, 
              hd_optimized: autoHD && hdOptimization?.optimized, 
              hd_details: hdOptimization, 
              auto_translated: translationLog.translated, 
              reference_images: validReferenceImages, 
              reference_images_count: validReferenceImages.length, 
              generation_mode: validReferenceImages.length > 0 ? "圖生圖" : "文生圖", 
              authenticated: authConfig.enabled && !!authConfig.token, 
              cost: "FREE", 
              auto_optimized: autoOptimize 
            };
          } else { 
            throw new Error("Invalid content type: " + contentType); 
          }
        } else if (response.status === 401) { 
          throw new Error("Authentication failed: Invalid or missing API key"); 
        } else if (response.status === 403) { 
          throw new Error("Access forbidden: API key may lack required permissions"); 
        } else { 
          throw new Error("HTTP " + response.status + ": " + (await response.text()).substring(0, 200)); 
        }
      } catch (e) {
        logger.add("❌ Request Failed", { 
          error: e.message, 
          model: apiModel, 
          retry: retry + 1, 
          max_retries: CONFIG.MAX_RETRIES, 
          endpoint: this.config.endpoint 
        });
        if (retry < CONFIG.MAX_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (retry + 1)));
        } else {
          throw new Error("Generation failed: " + e.message);
        }
      }
    }
    throw new Error("Model " + model + " failed after " + CONFIG.MAX_RETRIES + " retries");
  }
}

class InfipProvider {
  constructor(config, env) { 
    this.config = config; 
    this.name = config.name; 
    this.env = env; 
  }
  
  async generate(prompt, options, logger) {
    const { 
      model = "flux-pro", width = 1024, height = 1024, 
      negativePrompt = "", style = "none", autoOptimize = true, 
      autoHD = true, qualityMode = 'standard'
    } = options;

    let basePrompt = prompt;
    let translationLog = { translated: false };

    if (/[\u4e00-\u9fa5]/.test(prompt)) {
      logger.add("🌐 Pre-translation", { message: "Detecting Chinese, translating first..." });
      const translation = await translateToEnglish(prompt, this.env);
      if (translation.translated) {
        basePrompt = translation.text;
        translationLog = translation;
        logger.add("✅ Translation Success", { original: prompt, translated: basePrompt });
      }
    }

    const promptComplexity = PromptAnalyzer.analyzeComplexity(basePrompt);
    logger.add("🧠 Prompt Analysis", { 
      complexity: (promptComplexity * 100).toFixed(1) + '%', 
      selected_quality: qualityMode 
    });
    
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
      if (hdOptimization.optimized) {
        logger.add("🎨 HD Optimization", { 
          mode: qualityMode, 
          original: width + "x" + height, 
          optimized: finalWidth + "x" + finalHeight 
        });
      }
    }
    
    const { enhancedPrompt, enhancedNegative } = StyleProcessor.applyStyle(optimizedPrompt, style, finalNegative);
    logger.add("🎨 Style Processing", { 
      selected_style: style, 
      style_name: CONFIG.STYLE_PRESETS[style]?.name || style 
    });
    
    const authConfig = CONFIG.INFIP_AUTH;
    if (!authConfig.enabled || !authConfig.token) {
      throw new Error("Infip API Key not configured. Please set INFIP_API_KEY environment variable.");
    }

    const size = normalizeInfipSize(finalWidth, finalHeight);
    let finalPrompt = enhancedPrompt;
    if (enhancedNegative && enhancedNegative.trim()) {
      finalPrompt = enhancedPrompt + "\n\nAvoid: " + enhancedNegative;
    }

    const payload = {
      model: model,
      prompt: finalPrompt,
      n: 1,
      size: size,
      response_format: "url"
    };

    const headers = {
      'Authorization': 'Bearer ' + authConfig.token,
      'Content-Type': 'application/json'
    };

    logger.add("📡 API Request", { 
      endpoint: this.config.endpoint, 
      model: model, 
      size: size,
      authenticated: true 
    });

    for (let retry = 0; retry < CONFIG.MAX_RETRIES; retry++) {
      try {
        const response = await fetchWithTimeout(
          this.config.endpoint + this.config.pathPrefix,
          { 
            method: 'POST', 
            headers: headers,
            body: JSON.stringify(payload)
          }, 
          120000
        );

        if (!response.ok) {
          const errorText = await response.text();
          if (response.status === 401) throw new Error("Invalid Infip API Key");
          if (response.status === 403) throw new Error("Access forbidden");
          throw new Error("HTTP " + response.status + ": " + errorText.substring(0, 200));
        }

        const data = await response.json();
        logger.add("✅ Response Received", { 
          model: model, 
          images_count: data.data?.length || 0 
        });

        if (!data.data || data.data.length === 0) {
          throw new Error("No image data in response");
        }

        const imageUrl = data.data[0].url;
        
        const imageResponse = await fetchWithTimeout(imageUrl, { method: 'GET' }, 60000);
        if (!imageResponse.ok) throw new Error("Failed to download image from URL");

        const imageBlob = await imageResponse.blob();
        const imageBuffer = await imageBlob.arrayBuffer();

        logger.add("✅ Success", { 
          provider: "Infip.pro",
          model: model, 
          size: size,
          quality_mode: qualityMode,
          style: style,
          auto_translated: translationLog.translated
        });

        return { 
          imageData: imageBuffer, 
          contentType: 'image/png',
          url: imageUrl,
          provider: this.name, 
          model: model,
          seed: -1,
          style: style, 
          style_name: CONFIG.STYLE_PRESETS[style]?.name || style,
          width: finalWidth, 
          height: finalHeight, 
          quality_mode: qualityMode,
          auto_translated: translationLog.translated,
          authenticated: true,
          cost: "CREDITS"
        };

      } catch (e) {
        logger.add("❌ Request Failed", { 
          error: e.message, 
          model: model, 
          retry: retry + 1, 
          max_retries: CONFIG.MAX_RETRIES 
        });
        if (retry < CONFIG.MAX_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (retry + 1)));
        } else {
          throw new Error("Generation failed: " + e.message);
        }
      }
    }
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
        if (key === 'infip') this.providers[key] = new InfipProvider(config, env);
      }
    }
  }
  
  getProvider(providerName = null) {
    if (providerName && this.providers[providerName]) {
      return { name: providerName, instance: this.providers[providerName] };
    }
    const defaultName = CONFIG.DEFAULT_PROVIDER;
    if (this.providers[defaultName]) {
      return { name: defaultName, instance: this.providers[defaultName] };
    }
    const firstProvider = Object.keys(this.providers)[0];
    if (firstProvider) {
      return { name: firstProvider, instance: this.providers[firstProvider] };
    }
    throw new Error('No available provider');
  }
  
  async generate(prompt, options, logger) {
    const { provider: requestedProvider = null, numOutputs = 1 } = options;
    const { name: providerName, instance: provider } = this.getProvider(requestedProvider);
    
    logger.add("🚀 Provider Selection", { 
      requested: requestedProvider || 'default', 
      selected: providerName,
      num_outputs: numOutputs 
    });
    
    const results = [];
    for (let i = 0; i < numOutputs; i++) {
      const currentOptions = { 
        ...options, 
        seed: options.seed === -1 ? -1 : options.seed + i 
      };
      const result = await provider.generate(prompt, currentOptions, logger);
      results.push(result);
    }
    return results;
  }
  
  getAvailableProviders() {
    return Object.entries(CONFIG.PROVIDERS)
      .filter(([key, config]) => config.enabled)
      .map(([key, config]) => ({
        id: key,
        name: config.name,
        endpoint: config.endpoint,
        authenticated: key === 'pollinations' ? CONFIG.POLLINATIONS_AUTH.enabled : CONFIG.INFIP_AUTH.enabled,
        models_count: config.models.length
      }));
  }
}
// =================================================================================
//  主 Worker 處理器
// =================================================================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const startTime = Date.now();
    const clientIP = getClientIP(request);

    // 初始化 Pollinations API Key（從 env 注入）
    if (env.POLLINATIONS_API_KEY) {
      CONFIG.POLLINATIONS_AUTH.enabled = true;
      CONFIG.POLLINATIONS_AUTH.token = env.POLLINATIONS_API_KEY;
    } else {
      CONFIG.POLLINATIONS_AUTH.enabled = false;
      CONFIG.POLLINATIONS_AUTH.token = "";
    }

    // 初始化 Infip API Key（從 env 注入）
    if (env.INFIP_API_KEY) {
      CONFIG.INFIP_AUTH.enabled = true;
      CONFIG.INFIP_AUTH.token = env.INFIP_API_KEY;
      CONFIG.PROVIDERS.infip.enabled = true;

      // 自動抓模型（失敗就維持空列表）
      try {
        const models = await fetchInfipModels(env.INFIP_API_KEY);
        if (models && models.length > 0) CONFIG.PROVIDERS.infip.models = models;
      } catch (e) {
        console.error("Failed to fetch infip models:", e.message);
      }
    } else {
      CONFIG.INFIP_AUTH.enabled = false;
      CONFIG.INFIP_AUTH.token = "";
      CONFIG.PROVIDERS.infip.enabled = false;
      CONFIG.PROVIDERS.infip.models = [];
    }

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    try {
      let response;

      if (url.pathname === '/' || url.pathname === '') {
        response = handleUI(request);
      } else if (url.pathname === '/nano') {
        response = handleNanoPage(request);
      } else if (url.pathname === '/_internal/generate') {
        response = await handleInternalGenerate(request, env, ctx);
      } else if (url.pathname === '/health') {
        const providers = Object.entries(CONFIG.PROVIDERS)
          .filter(([_, cfg]) => cfg.enabled)
          .map(([id, cfg]) => ({
            id,
            name: cfg.name,
            endpoint: cfg.endpoint,
            authenticated: id === 'pollinations' ? CONFIG.POLLINATIONS_AUTH.enabled : CONFIG.INFIP_AUTH.enabled,
            models_count: (cfg.models || []).length
          }));

        response = new Response(JSON.stringify({
          status: "ok",
          version: CONFIG.PROJECT_VERSION,
          timestamp: new Date().toISOString(),
          client_ip: clientIP,
          providers
        }), {
          headers: corsHeaders({ 'Content-Type': 'application/json;charset=UTF-8' })
        });
      } else {
        response = new Response(JSON.stringify({
          error: "Not Found",
          available_paths: ["/", "/nano", "/_internal/generate", "/health"]
        }), {
          status: 404,
          headers: corsHeaders({ 'Content-Type': 'application/json;charset=UTF-8' })
        });
      }

      // 統一加上 trace header
      const duration = Date.now() - startTime;
      const headers = new Headers(response.headers);
      headers.set('X-Response-Time', duration + 'ms');
      headers.set('X-Worker-Version', CONFIG.PROJECT_VERSION);

      return new Response(response.body, { status: response.status, headers });
    } catch (error) {
      const duration = Date.now() - startTime;
      return new Response(JSON.stringify({
        error: {
          message: error.message,
          type: "worker_error",
          duration_ms: duration
        }
      }), {
        status: 500,
        headers: corsHeaders({ 'Content-Type': 'application/json;charset=UTF-8' })
      });
    }
  }
};

// =================================================================================
//  內部生成 API：/_internal/generate
// =================================================================================

async function handleInternalGenerate(request, env, ctx) {
  const logger = new Logger();
  const startTime = Date.now();
  const clientIP = getClientIP(request);

  try {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: { message: "Method not allowed" } }), {
        status: 405,
        headers: corsHeaders({ 'Content-Type': 'application/json;charset=UTF-8' })
      });
    }

    const body = await request.json();
    const prompt = (body.prompt || '').trim();
    if (!prompt) throw new Error("Prompt is required");

    // NanoBanana Pro：只允許 /nano 頁面呼叫 + KV 限流
    if (body.model === 'nanobanana-pro') {
      const source = request.headers.get('X-Source');
      if (source !== 'nano-page') {
        return new Response(JSON.stringify({ error: { message: "🍌 Nano Banana Pro 模型僅限 /nano 使用", type: "access_denied" } }), {
          status: 403,
          headers: corsHeaders({ 'Content-Type': 'application/json;charset=UTF-8' })
        });
      }

      const limiter = new RateLimiter(env);
      const check = await limiter.checkLimit(clientIP);
      if (!check.allowed) {
        return new Response(JSON.stringify({ error: { message: check.reason, type: "rate_limit_exceeded" } }), {
          status: 429,
          headers: corsHeaders({ 'Content-Type': 'application/json;charset=UTF-8' })
        });
      }
    }

    // size
    const width = Math.min(Math.max(parseInt(body.width || 1024), 256), 2048);
    const height = Math.min(Math.max(parseInt(body.height || 1024), 256), 2048);

    // seed
    const seedInput = body.seed !== undefined ? body.seed : -1;
    let seedValue = -1;
    if (seedInput !== -1) {
      const parsed = parseInt(seedInput);
      if (!isNaN(parsed)) seedValue = parsed;
    }

    // ref images
    let referenceImages = [];
    if (Array.isArray(body.reference_images)) {
      referenceImages = body.reference_images
        .map(s => String(s || '').trim())
        .filter(Boolean)
        .filter(u => { try { new URL(u); return true; } catch { return false; } });
    }

    const autoOptimize = body.auto_optimize !== false;
    const userSteps = body.steps ? parseInt(body.steps) : null;
    const userGuidance = body.guidance_scale ? parseFloat(body.guidance_scale) : null;

    const options = {
      provider: body.provider || null,
      model: body.model || "gptimage",
      width,
      height,
      numOutputs: Math.min(Math.max(parseInt(body.n || 1), 1), 4),
      seed: seedValue,
      negativePrompt: body.negative_prompt || "",
      guidance: autoOptimize ? null : userGuidance,
      steps: autoOptimize ? null : userSteps,
      enhance: body.enhance === true,
      nologo: body.nologo !== false,
      privateMode: body.private !== false,
      style: body.style || "none",
      autoOptimize,
      autoHD: body.auto_hd !== false,
      qualityMode: body.quality_mode || "standard",
      referenceImages
    };

    const router = new MultiProviderRouter({}, env);
    const results = await router.generate(prompt, options, logger);
    const duration = Date.now() - startTime;

    // 單張：回傳 image binary
    if (results.length === 1 && results[0].imageData) {
      const r = results[0];
      return new Response(r.imageData, {
        headers: {
          'Content-Type': r.contentType || 'image/png',
          'Content-Disposition': 'inline; filename="flux-ai-' + r.seed + '.png"',
          'X-Provider': r.provider,
          'X-Model': r.model,
          'X-Seed': String(r.seed),
          'X-Width': String(r.width),
          'X-Height': String(r.height),
          'X-Quality-Mode': r.quality_mode || 'standard',
          'X-Style': r.style || 'none',
          'X-Style-Name': r.style_name || r.style || 'none',
          'X-Generation-Time': duration + 'ms',
          ...corsHeaders()
        }
      });
    }

    // 多張：base64 JSON（目前 UI 用不到，但保留）
    const data = await Promise.all(results.map(async (r) => {
      const u8 = new Uint8Array(r.imageData);
      let bin = '';
      for (let i = 0; i < u8.byteLength; i++) bin += String.fromCharCode(u8[i]);
      return {
        image: 'data:' + (r.contentType || 'image/png') + ';base64,' + btoa(bin),
        provider: r.provider,
        model: r.model,
        seed: r.seed,
        width: r.width,
        height: r.height
      };
    }));

    return new Response(JSON.stringify({
      created: Math.floor(Date.now() / 1000),
      generation_time_ms: duration,
      data
    }), {
      headers: corsHeaders({ 'Content-Type': 'application/json;charset=UTF-8' })
    });
  } catch (e) {
    logger.add("❌ Error", { message: e.message });
    return new Response(JSON.stringify({
      error: { message: e.message, debug_logs: logger.get() }
    }), {
      status: 400,
      headers: corsHeaders({ 'Content-Type': 'application/json;charset=UTF-8' })
    });
  }
}
// =================================================================================
//  Nano Banana Pro 專屬頁面（180秒冷卻，每小時5張限額）
// =================================================================================

function handleNanoPage(request) {
  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>🍌 NanoBanana Pro - 控制台</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍌</text></svg>">
<style>
:root {
    --primary: #FACC15;
    --primary-dim: #cca400;
    --bg-dark: #0f0f11;
    --panel-bg: rgba(30, 30, 35, 0.7);
    --border: rgba(255, 255, 255, 0.1);
    --text: #ffffff;
    --text-muted: #9ca3af;
    --glass: blur(20px) saturate(180%);
}
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
body {
    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: var(--bg-dark);
    background-image: radial-gradient(circle at 10% 20%, rgba(250, 204, 21, 0.05) 0%, transparent 40%);
    color: var(--text);
    height: 100vh;
    overflow: hidden;
    display: flex;
}
.app-container { display: flex; width: 100%; height: 100%; }
.sidebar {
    width: 380px;
    background: var(--panel-bg);
    backdrop-filter: var(--glass);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 24px;
    overflow-y: auto;
    z-index: 10;
    position: relative;
}
.main-stage {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at center, #1a1a1d 0%, #000 100%);
    overflow: hidden;
}
.logo-area { display: flex; align-items: center; gap: 12px; margin-bottom: 30px; }
.logo-icon { font-size: 28px; animation: float 3s ease-in-out infinite; }
.logo-text h1 { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
.logo-text .badge { background: var(--primary); color: #000; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 700; margin-left: 6px; vertical-align: top; }
.control-group { margin-bottom: 24px; }
.label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
textarea, input[type="text"], input[type="number"] {
    width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 12px; padding: 14px; color: #fff; font-size: 14px; transition: 0.2s; font-family: inherit; resize: none;
}
textarea:focus, input:focus { border-color: var(--primary); outline: none; background: rgba(0,0,0,0.5); }
.ratio-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.ratio-item {
    background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 8px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; position: relative;
}
.ratio-item:hover { background: rgba(255,255,255,0.1); }
.ratio-item.active { border-color: var(--primary); background: rgba(250, 204, 21, 0.1); color: var(--primary); }
.ratio-shape { border: 2px solid currentColor; opacity: 0.7; }
select { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--border); padding: 12px; border-radius: 12px; color: white; appearance: none; cursor: pointer; }
.gen-btn {
    width: 100%; background: var(--primary); color: #000; border: none; padding: 16px; border-radius: 14px; font-size: 16px; font-weight: 800; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 20px rgba(250, 204, 21, 0.2); position: relative; overflow: hidden;
}
.gen-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(250, 204, 21, 0.4); }
.gen-btn:active { transform: scale(0.98); }
.gen-btn:disabled { opacity: 0.7; cursor: not-allowed; filter: grayscale(1); }
.tool-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; transition: 0.2s; font-size: 14px; }
.tool-btn:hover { color: var(--primary); }
.tool-btn.active { color: var(--primary); }
.quota-box { margin-top: auto; padding-top: 20px; border-top: 1px solid var(--border); }
.quota-info { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
.quota-bar { width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
.quota-fill { height: 100%; background: var(--primary); width: 100%; transition: width 0.5s ease; }
.quota-text { font-weight: bold; color: var(--primary); }
#resultImg {
    max-width: 90%; max-height: 85%; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); display: none; object-fit: contain; transition: 0.3s; cursor: zoom-in;
}
.placeholder-text { color: rgba(255,255,255,0.1); font-size: 80px; font-weight: 900; user-select: none; }
.history-dock {
    position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(20, 20, 23, 0.8);
    backdrop-filter: blur(15px); border: 1px solid var(--border); padding: 10px; border-radius: 20px;
    display: flex; gap: 10px; max-width: 90%; overflow-x: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 20;
}
.history-item { width: 50px; height: 50px; border-radius: 10px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: 0.2s; flex-shrink: 0; }
.history-item img { width: 100%; height: 100%; object-fit: cover; }
.history-item:hover { transform: scale(1.1); z-index: 10; }
.history-item.active { border-color: var(--primary); }

.lightbox {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95);
    z-index: 1000; display: none; flex-direction: column; justify-content: center; align-items: center;
    opacity: 0; transition: opacity 0.3s;
}
.lightbox.show { display: flex; opacity: 1; }
.lightbox img { max-width: 95%; max-height: 85vh; border-radius: 8px; box-shadow: 0 0 50px rgba(0,0,0,0.8); }
.lightbox-close { position: absolute; top: 20px; right: 30px; color: #fff; font-size: 40px; cursor: pointer; opacity: 0.7; transition: 0.2s; }
.lightbox-close:hover { opacity: 1; color: var(--primary); }
.lightbox-actions { margin-top: 20px; display: flex; gap: 15px; }
.action-btn { padding: 10px 20px; border-radius: 8px; border: 1px solid var(--border); background: rgba(255,255,255,0.1); color: #fff; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; text-decoration: none; transition: 0.2s; }
.action-btn:hover { background: var(--primary); color: #000; border-color: var(--primary); }

.loading-overlay {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);
    display: none; flex-direction: column; align-items: center; justify-content: center; z-index: 50;
}
.banana-loader { font-size: 60px; animation: spin-bounce 1.5s infinite; margin-bottom: 20px; }
.loading-text { color: var(--primary); font-weight: bold; letter-spacing: 2px; text-transform: uppercase; font-size: 14px; }

@media (max-width: 900px) {
    body { flex-direction: column; overflow-y: auto; height: auto; }
    .sidebar { width: 100%; height: auto; padding-bottom: 100px; border-right: none; }
    .main-stage { height: 50vh; order: -1; border-bottom: 1px solid var(--border); }
    #resultImg { max-height: 90%; }
    .history-dock { bottom: 10px; }
}

@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes spin-bounce { 0% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.2) rotate(10deg); } 100% { transform: scale(1) rotate(0deg); } }
.toast {
  position: fixed; top: 20px; right: 20px; background: #333; border-left: 4px solid var(--primary); color: #fff;
  padding: 15px 25px; border-radius: 8px; display: none; z-index: 100; box-shadow: 0 10px 30px rgba(0,0,0,0.5); font-size: 14px;
  animation: slideIn 0.3s forwards;
}
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
</style>
</head>
<body>
  <div id="toast" class="toast"></div>

  <div class="app-container">
    <div class="sidebar">
      <div class="logo-area">
        <div class="logo-icon">🍌</div>
        <div class="logo-text">
          <h1>Nano Pro <span class="badge">V10.7</span></h1>
          <p style="color:#666; font-size:12px">Flux Engine • Pro Model</p>
        </div>
      </div>

      <div class="control-group">
        <div class="label-row">
          <label>Prompt</label>
          <button class="tool-btn" id="randomBtn" title="隨機靈感">🎲 靈感骰子</button>
        </div>
        <textarea id="prompt" rows="4" placeholder="描述你想像中的畫面... (支援中文)"></textarea>
      </div>

      <div class="control-group">
        <label style="margin-bottom:10px; display:block">畫布比例</label>
        <div class="ratio-grid">
          <div class="ratio-item active" data-w="1024" data-h="1024" title="1:1 方形"><div class="ratio-shape" style="width:14px; height:14px;"></div></div>
          <div class="ratio-item" data-w="1080" data-h="1350" title="4:5 IG"><div class="ratio-shape" style="width:12px; height:15px;"></div></div>
          <div class="ratio-item" data-w="1080" data-h="1920" title="9:16 限動"><div class="ratio-shape" style="width:9px; height:16px;"></div></div>
          <div class="ratio-item" data-w="1920" data-h="1080" title="16:9 桌布"><div class="ratio-shape" style="width:16px; height:9px;"></div></div>
          <div class="ratio-item" data-w="2048" data-h="858" title="21:9 電影"><div class="ratio-shape" style="width:18px; height:7px;"></div></div>
        </div>
        <input type="hidden" id="width" value="1024">
        <input type="hidden" id="height" value="1024">
      </div>

      <div class="control-group">
        <label style="margin-bottom:10px; display:block">風格</label>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <select id="style">
            <option value="none">✨ 智能無風格</option>
            <option value="photorealistic">📷 寫實照片</option>
            <option value="anime">🌸 日系動漫</option>
            <option value="3d-render">🧊 3D 渲染</option>
            <option value="cyberpunk">🌃 賽博龐克</option>
            <option value="manga">📖 黑白漫畫</option>
            <option value="oil-painting">🎨 古典油畫</option>
          </select>
          <div style="position:relative">
            <input type="number" id="seed" placeholder="Seed" value="-1" disabled style="padding-right:30px">
            <button id="lockSeedBtn" class="tool-btn" style="position:absolute; right:10px; top:50%; transform:translateY(-50%)">🎲</button>
          </div>
        </div>
      </div>

      <div class="control-group">
        <label>排除 (Negative)</label>
        <input type="text" id="negative" value="nsfw, ugly, text, watermark, low quality, bad anatomy" style="font-size:12px; color:#aaa">
      </div>

      <button id="genBtn" class="gen-btn">
        <span>生成圖像</span>
        <span style="font-size:12px; opacity:0.6; font-weight:400; display:block; margin-top:4px">消耗 1 香蕉能量 🍌</span>
      </button>

      <div class="quota-box">
        <div class="quota-info">
          <span>每小時能量</span>
          <span id="quotaText" class="quota-text">5 / 5</span>
        </div>
        <div class="quota-bar"><div id="quotaFill" class="quota-fill"></div></div>
      </div>
    </div>

    <div class="main-stage">
      <div class="placeholder-text">NANOPRO</div>
      <img id="resultImg" alt="Generated Image" title="點擊放大">

      <div class="loading-overlay">
        <div class="banana-loader">🍌</div>
        <div class="loading-text">正在注入 AI 能量...</div>
      </div>

      <div class="history-dock" id="historyStrip"></div>
    </div>
  </div>

  <div class="lightbox" id="lightbox">
    <div class="lightbox-close" id="lbClose">×</div>
    <img id="lbImg" src="">
    <div class="lightbox-actions">
      <a id="lbDownload" class="action-btn" download="nano-banana-art.png" href="#">📥 保存圖片</a>
      <button class="action-btn" onclick="document.getElementById('lbClose').click()">❌ 關閉</button>
    </div>
  </div>

<script>
  var els = {
    prompt: document.getElementById('prompt'),
    negative: document.getElementById('negative'),
    style: document.getElementById('style'),
    seed: document.getElementById('seed'),
    width: document.getElementById('width'),
    height: document.getElementById('height'),
    genBtn: document.getElementById('genBtn'),
    img: document.getElementById('resultImg'),
    loader: document.querySelector('.loading-overlay'),
    history: document.getElementById('historyStrip'),
    lockSeed: document.getElementById('lockSeedBtn'),
    randomBtn: document.getElementById('randomBtn'),
    ratios: document.querySelectorAll('.ratio-item'),
    quotaText: document.getElementById('quotaText'),
    quotaFill: document.getElementById('quotaFill'),
    lightbox: document.getElementById('lightbox'),
    lbImg: document.getElementById('lbImg'),
    lbClose: document.getElementById('lbClose'),
    lbDownload: document.getElementById('lbDownload')
  };

  var currentQuota = 5;
  var maxQuota = 5;
  var COOLDOWN_KEY = 'nano_cooldown_timestamp';
  var COOLDOWN_SEC = 180;
  var cooldownInterval = null;

  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(function() { t.style.display = 'none'; }, 3000);
  }

  function checkAndStartCooldown() {
    var lastTime = localStorage.getItem(COOLDOWN_KEY);
    if (!lastTime) return;
    var now = Date.now();
    var diff = Math.floor((now - parseInt(lastTime)) / 1000);
    if (diff < COOLDOWN_SEC) startCooldownTimer(COOLDOWN_SEC - diff);
  }

  function startCooldownTimer(seconds) {
    if (cooldownInterval) clearInterval(cooldownInterval);
    els.genBtn.disabled = true;
    updateCooldownText(seconds);
    var left = seconds;
    cooldownInterval = setInterval(function() {
      left--;
      if (left <= 0) {
        clearInterval(cooldownInterval);
        localStorage.removeItem(COOLDOWN_KEY);
        if (currentQuota > 0) {
          els.genBtn.disabled = false;
          els.genBtn.innerHTML = '<span>生成圖像</span><span style="font-size:12px; opacity:0.6; font-weight:400; display:block; margin-top:4px">消耗 1 香蕉能量 🍌</span>';
        } else {
          updateQuotaUI();
        }
      } else {
        updateCooldownText(left);
      }
    }, 1000);
  }

  function updateCooldownText(sec) {
    els.genBtn.innerHTML = '<span>⚡ 能量回充中... (' + sec + 's)</span>';
  }

  var now = new Date();
  var currentHourStr = now.toDateString() + '-' + now.getHours();
  var stored = localStorage.getItem('nano_quota_hourly_v2');
  if (stored) {
    var data = JSON.parse(stored);
    if (data.hour === currentHourStr) currentQuota = data.val;
    else {
      localStorage.setItem('nano_quota_hourly_v2', JSON.stringify({ hour: currentHourStr, val: maxQuota }));
      currentQuota = maxQuota;
    }
  } else {
    localStorage.setItem('nano_quota_hourly_v2', JSON.stringify({ hour: currentHourStr, val: maxQuota }));
  }

  function updateQuotaUI() {
    els.quotaText.textContent = currentQuota + ' / ' + maxQuota;
    var pct = (currentQuota / maxQuota) * 100;
    els.quotaFill.style.width = pct + '%';
    if (currentQuota <= 0) {
      els.quotaFill.style.background = '#ef4444';
      els.genBtn.disabled = true;
      els.genBtn.innerHTML = '<span>本小時能量已耗盡</span><span style="display:block;font-size:12px;font-weight:400;margin-top:4px">請稍後再來</span>';
    }
  }

  function consumeQuota() {
    if (currentQuota > 0) {
      currentQuota--;
      var n = new Date();
      var h = n.toDateString() + '-' + n.getHours();
      localStorage.setItem('nano_quota_hourly_v2', JSON.stringify({ hour: h, val: currentQuota }));
      updateQuotaUI();
    }
  }

  updateQuotaUI();
  checkAndStartCooldown();

  els.ratios.forEach(function(r) {
    r.onclick = function() {
      els.ratios.forEach(function(i) { i.classList.remove('active'); });
      r.classList.add('active');
      els.width.value = r.dataset.w;
      els.height.value = r.dataset.h;
    };
  });

  var isSeedRandom = true;
  els.lockSeed.onclick = function() {
    isSeedRandom = !isSeedRandom;
    if (isSeedRandom) {
      els.seed.value = '-1';
      els.seed.disabled = true;
      els.lockSeed.textContent = '🎲';
      els.lockSeed.classList.remove('active');
    } else {
      if (els.seed.value == '-1') els.seed.value = Math.floor(Math.random() * 1000000);
      els.seed.disabled = false;
      els.lockSeed.textContent = '🔒';
      els.lockSeed.classList.add('active');
    }
  };

  var prompts = [
    "Cyberpunk street vendor making noodles, neon rain, detailed, 8k",
    "A translucent glass banana floating in space, nebula background",
    "Cute isometric room, gaming setup, pastel colors, 3d render",
    "Portrait of a futuristic warrior, gold and black armor, cinematic lighting",
    "Traditional Japanese village in winter, snow, ukiyo-e style",
    "Macro shot of a mechanical eye, gears, steampunk"
  ];
  els.randomBtn.onclick = function() {
    els.prompt.value = prompts[Math.floor(Math.random() * prompts.length)];
    els.prompt.focus();
  };

  function openLightbox(url) {
    els.lbImg.src = url;
    els.lbDownload.href = url;
    els.lightbox.classList.add('show');
  }
  els.lbClose.onclick = function() { els.lightbox.classList.remove('show'); };
  els.img.onclick = function() { if (els.img.src) openLightbox(els.img.src); };

  function addHistory(url) {
    var div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = '<img src="' + url + '">';
    div.onclick = function() {
      els.img.src = url;
      document.querySelectorAll('.history-item').forEach(function(i) { i.classList.remove('active'); });
      div.classList.add('active');
    };
    els.history.prepend(div);
    if (els.history.children.length > 10) els.history.lastChild.remove();
    document.querySelectorAll('.history-item').forEach(function(i) { i.classList.remove('active'); });
    div.classList.add('active');
  }

  els.genBtn.onclick = async function() {
    var p = els.prompt.value.trim();
    if (!p) return toast("⚠️ 請輸入提示詞");
    if (currentQuota <= 0) return toast("🚫 本小時能量已耗盡，請稍後再來！");

    els.genBtn.disabled = true;
    els.loader.style.display = 'flex';
    els.img.style.opacity = '0.5';

    try {
      var res = await fetch('/_internal/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Source': 'nano-page' },
        body: JSON.stringify({
          prompt: p,
          negative_prompt: els.negative.value,
          model: 'nanobanana-pro',
          width: parseInt(els.width.value),
          height: parseInt(els.height.value),
          style: els.style.value,
          seed: parseInt(els.seed.value),
          n: 1,
          nologo: true
        })
      });

      if (res.status === 429) {
        var err = await res.json();
        currentQuota = 0;
        var n = new Date();
        var h = n.toDateString() + '-' + n.getHours();
        localStorage.setItem('nano_quota_hourly_v2', JSON.stringify({ hour: h, val: 0 }));
        updateQuotaUI();
        throw new Error((err.error && err.error.message) ? err.error.message : '限額已滿');
      }

      if (!res.ok) {
        var err = await res.json();
        throw new Error((err.error && err.error.message) ? err.error.message : '生成失敗');
      }

      var blob = await res.blob();
      var url = URL.createObjectURL(blob);

      els.img.src = url;
      els.img.style.display = 'block';
      els.img.style.opacity = '1';
      document.querySelector('.placeholder-text').style.display = 'none';

      var realSeed = res.headers.get('X-Seed');
      if (!isSeedRandom) els.seed.value = realSeed;

      addHistory(url);
      consumeQuota();

      localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
      startCooldownTimer(COOLDOWN_SEC);

    } catch (e) {
      toast("❌ " + e.message);
      if (currentQuota > 0 && !String(e.message).includes('限額')) els.genBtn.disabled = false;
    } finally {
      els.loader.style.display = 'none';
    }
  };
</script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      ...corsHeaders()
    }
  });
}
// =================================================================================
//  主頁 UI：handleUI() - Part 1 (HTML/CSS/Body)
// =================================================================================

function handleUI(request) {
  // Provider 狀態提示
  const providerStatusHTML = Object.entries(CONFIG.PROVIDERS)
    .filter(([key, cfg]) => cfg.enabled)
    .map(([key, cfg]) => {
      const authEnabled = key === 'pollinations' ? CONFIG.POLLINATIONS_AUTH.enabled : CONFIG.INFIP_AUTH.enabled;
      const statusColor = authEnabled ? '#22c55e' : '#f59e0b';
      const statusIcon = authEnabled ? '🔐' : '⚠️';
      const statusText = authEnabled ? '已認證' : '需要 API Key';
      return '<div style="font-size:11px;color:' + statusColor + ';font-weight:600;margin-left:8px">' +
        statusIcon + ' ' + cfg.name + ': ' + statusText +
      '</div>';
    }).join('');

  // 風格選單
  const styleCategories = CONFIG.STYLE_CATEGORIES;
  const stylePresets = CONFIG.STYLE_PRESETS;

  let styleOptionsHTML = '';
  const sortedCategories = Object.entries(styleCategories).sort((a, b) => a[1].order - b[1].order);
  for (const [categoryKey, categoryInfo] of sortedCategories) {
    const stylesInCategory = Object.entries(stylePresets).filter(([k, s]) => s.category === categoryKey);
    if (stylesInCategory.length > 0) {
      styleOptionsHTML += '<optgroup label="' + categoryInfo.icon + ' ' + categoryInfo.name + '">';
      for (const [styleKey, styleCfg] of stylesInCategory) {
        const selected = styleKey === 'none' ? ' selected' : '';
        styleOptionsHTML += '<option value="' + styleKey + '"' + selected + '>' + styleCfg.icon + ' ' + styleCfg.name + '</option>';
      }
      styleOptionsHTML += '</optgroup>';
    }
  }

  const ENABLED_PROVIDERS = Object.entries(CONFIG.PROVIDERS)
    .filter(([id, p]) => p.enabled)
    .map(([id, p]) => ({ id: id, name: p.name, supports_seed: id !== 'infip' }));

  const MODELS_BY_PROVIDER = Object.fromEntries(
    Object.entries(CONFIG.PROVIDERS)
      .filter(([id, p]) => p.enabled)
      .map(([id, p]) => {
        const models = (p.models || []).filter(m => m.id !== 'nanobanana-pro'); // 主頁不顯示 nano
        return [id, models.map(m => ({ id: m.id, name: m.name || m.id, category: m.category || 'default' }))];
      })
  );

  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${CONFIG.PROJECT_NAME} v${CONFIG.PROJECT_VERSION}</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎨</text></svg>">

<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%);color:#fff;min-height:100vh}
.container{max-width:100%;margin:0;padding:0;height:100vh;display:flex;flex-direction:column}
.top-nav{background:rgba(255,255,255,0.05);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,0.1);padding:15px 25px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
.nav-left{display:flex;align-items:center;gap:20px;flex-wrap:wrap}
.logo{color:#f59e0b;font-size:24px;font-weight:800;text-shadow:0 0 20px rgba(245,158,11,0.6);display:flex;align-items:center;gap:10px}
.badge{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:4px 10px;border-radius:12px;font-size:11px;font-weight:600}
.api-status{display:flex;gap:5px;flex-wrap:wrap}
.nav-menu{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.nav-btn{padding:8px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#9ca3af;cursor:pointer;font-size:14px;font-weight:600;transition:all 0.3s;display:flex;align-items:center;gap:6px;text-decoration:none}
.nav-btn:hover{border-color:#f59e0b;color:#fff}
.nav-btn.active{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);color:#fff;border-color:#f59e0b}
.nav-btn.nano-btn:hover{border-color:#FACC15;background:rgba(250,204,21,0.1);color:#FACC15;box-shadow:0 0 10px rgba(250,204,21,0.2)}
.lang-btn{padding:6px 10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#ccc;cursor:pointer;font-size:12px;margin-left:10px}

.main-content{flex:1;display:flex;overflow:hidden}
.left-panel{width:320px;background:rgba(255,255,255,0.03);border-right:1px solid rgba(255,255,255,0.1);overflow-y:auto;padding:20px;flex-shrink:0}
.center-panel{flex:1;padding:20px;overflow-y:auto}
.right-panel{width:380px;background:rgba(255,255,255,0.03);border-left:1px solid rgba(255,255,255,0.1);overflow-y:auto;padding:20px;flex-shrink:0}

@media(max-width:1024px){
  .main-content{flex-direction:column}
  .left-panel,.right-panel{width:100%;border:none;border-bottom:1px solid rgba(255,255,255,0.1)}
}

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
.model-badge,.seed-badge,.style-badge,.provider-badge{padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;background:rgba(255,255,255,0.1)}
.provider-badge{background:rgba(16,185,129,0.2);color:#10b981}
.gallery-actions{display:flex;gap:8px;margin-top:10px}
.action-btn{padding:6px 12px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:6px;font-size:12px;color:#fff;cursor:pointer;flex:1}
.action-btn:hover{background:rgba(255,255,255,0.2)}

.spinner{border:3px solid rgba(255,255,255,0.1);border-top:3px solid #f59e0b;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;margin:0 auto 15px}
@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}

.history-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding:20px;background:rgba(255,255,255,0.03);border-radius:12px}
.history-stats{display:flex;gap:20px;font-size:14px}

.modal{display:none;position:fixed;z-index:1000;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.9);align-items:center;justify-content:center}
.modal.show{display:flex}
.modal-content img{max-width:90vw;max-height:90vh;border-radius:8px}
.modal-close{position:absolute;top:20px;right:20px;color:#fff;font-size:32px;cursor:pointer}

.empty-state{text-align:center;padding:80px 20px;color:#6b7280}
.empty-state p{font-size:18px;margin-bottom:10px}
</style>
</head>

<body>
<div class="container">

  <div class="top-nav">
    <div class="nav-left">
      <div class="logo">🎨 ${CONFIG.PROJECT_NAME} <span class="badge">v${CONFIG.PROJECT_VERSION}</span></div>
      <div class="api-status">${providerStatusHTML}</div>
    </div>

    <div class="nav-menu">
      <a href="/nano" target="_blank" class="nav-btn nano-btn" style="border-color:rgba(250,204,21,0.5);color:#FACC15;margin-right:5px">🍌 Nano版</a>
      <button class="nav-btn active" data-page="generate"><span data-t="nav_gen">🎨 生成圖像</span></button>
      <button class="nav-btn" data-page="history"><span data-t="nav_his">📚 歷史記錄</span> <span id="historyCount" style="background:rgba(245,158,11,0.2);padding:2px 8px;border-radius:10px;font-size:11px">0</span></button>
      <button class="lang-btn" id="langSwitch">EN / 繁中</button>
    </div>
  </div>

  <div id="generatePage" class="page active">
    <div class="main-content">

      <div class="left-panel">
        <div class="section-title" data-t="settings_title" style="font-size:16px;font-weight:700;margin-bottom:20px;color:#f59e0b">⚙️ 生成參數</div>

        <form id="generateForm">
          <div class="form-group">
            <label data-t="provider_label">🌐 API 供應商</label>
            <select id="provider"></select>
          </div>

          <div class="form-group">
            <label data-t="model_label">🤖 模型選擇</label>
            <select id="model"></select>
          </div>

          <div class="form-group">
            <label data-t="size_label">📐 尺寸預設</label>
            <select id="size">
              <option value="square-1k" selected>Square 1024x1024</option>
              <option value="square-1.5k">Square 1536x1536</option>
              <option value="portrait-9-16-hd">Portrait 1080x1920</option>
              <option value="landscape-16-9-hd">Landscape 1920x1080</option>
            </select>
          </div>

          <div class="form-group">
            <label data-t="style_label">🎨 藝術風格</label>
            <select id="style">${styleOptionsHTML}</select>
          </div>

          <div class="form-group">
            <label data-t="quality_label">⚡ 質量模式</label>
            <select id="qualityMode">
              <option value="economy">Economy</option>
              <option value="standard" selected>Standard</option>
              <option value="ultra">Ultra HD</option>
            </select>
          </div>

          <div class="form-group">
            <label data-t="seed_label">🎲 Seed (種子碼)</label>
            <div style="display:flex; gap:10px;">
              <input type="number" id="seed" value="-1" placeholder="Random (-1)" disabled style="flex:1; opacity:0.7; cursor:not-allowed; font-family: monospace;">
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
              <div class="form-group">
                <label data-t="steps_label">生成步數 (Steps)</label>
                <input type="number" id="steps" value="25" min="1" max="50">
              </div>
              <div class="form-group">
                <label data-t="guidance_label">引導係數 (Guidance)</label>
                <input type="number" id="guidanceScale" value="7.5" step="0.1" min="1" max="20">
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" id="generateBtn" data-t="gen_btn" style="margin-top:10px;">🎨 開始生成</button>
        </form>
      </div>

      <div class="center-panel">
        <div id="results">
          <div class="empty-state">
            <p data-t="empty_title">尚未生成任何圖像</p>
            <p style="font-size:14px;color:#4b5563">選擇供應商和模型，輸入提示詞後點擊生成</p>
          </div>
        </div>
      </div>

      <div class="right-panel">
        <div class="form-group">
          <label data-t="pos_prompt">💬 正面提示詞</label>
          <textarea id="prompt" placeholder="Describe your image..." required rows="6"></textarea>
        </div>

        <div class="form-group">
          <label data-t="neg_prompt">🚫 負面提示詞 (可選)</label>
          <textarea id="negativePrompt" placeholder="What to avoid..." rows="4"></textarea>
        </div>

        <div class="form-group">
          <label data-t="ref_img">🖼️ 參考圖像 URL (Kontext 專用)</label>
          <textarea id="referenceImages" placeholder="Image URLs separated by comma" rows="3"></textarea>
        </div>
      </div>

    </div>
  </div>

  <div id="historyPage" class="page">
    <div class="main-content" style="flex-direction:column;padding:20px">
      <div class="history-header">
        <div class="history-stats">
          <div class="stat-item">
            <div class="label" data-t="stat_total">📊 總記錄數</div>
            <div class="value" id="historyTotal">0</div>
          </div>
          <div class="stat-item">
            <div class="label" data-t="stat_storage">💾 存儲空間 (永久)</div>
            <div class="value" id="storageSize">0 KB</div>
          </div>
        </div>
        <div class="history-actions">
          <button class="btn btn-secondary" id="exportBtn" style="width:auto;padding:10px 20px;background:rgba(59,130,246,0.2);color:#60a5fa" data-t="btn_export">📥 導出</button>
          <button class="btn btn-danger" id="clearBtn" style="width:auto;padding:10px 20px;background:rgba(239,68,68,0.2);color:#f87171" data-t="btn_clear">🗑️ 清空</button>
        </div>
      </div>
      <div id="historyList" style="padding:0 20px"><p>Loading history...</p></div>
    </div>
  </div>

  <div id="imageModal" class="modal">
    <span class="modal-close" id="modalCloseBtn">×</span>
    <div class="modal-content"><img id="modalImage" src=""></div>
  </div>

</div>

<script>
`;
// 這是 Part 6/6：接續 Part 5 的 <script> 標籤內容
// ========= 配置與常數 =========
var ENABLED_PROVIDERS = ${JSON.stringify(ENABLED_PROVIDERS)};
var MODELS_BY_PROVIDER = ${JSON.stringify(MODELS_BY_PROVIDER)};
var PRESET_SIZES = ${JSON.stringify(CONFIG.PRESET_SIZES)};

// ========= IndexedDB (FIXED - Version 2) =========
var DB_NAME = 'FluxAI_DB';
var STORE_NAME = 'images';
var DB_VERSION = 2; // 升級版本，觸發 onupgradeneeded 重建 store

function idbReqToPromise(req) {
  return new Promise(function(resolve, reject) {
    req.onsuccess = function() { resolve(req.result); };
    req.onerror = function() { reject(req.error); };
  });
}

function txDone(tx) {
  return new Promise(function(resolve, reject) {
    tx.oncomplete = function() { resolve(); };
    tx.onerror = function() { reject(tx.error); };
    tx.onabort = function() { reject(tx.error || new Error('Transaction aborted')); };
  });
}

var dbPromise = new Promise(function(resolve, reject) {
  var req = indexedDB.open(DB_NAME, DB_VERSION);

  req.onupgradeneeded = function(e) {
    var db = e.target.result;

    // 直接重建 schema（最穩），避免舊 store 沒 autoIncrement 造成 keyPath 錯誤
    if (db.objectStoreNames.contains(STORE_NAME)) {
      db.deleteObjectStore(STORE_NAME);
    }

    db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
  };

  req.onsuccess = function(e) { resolve(e.target.result); };
  req.onerror = function(e) { reject(e.target.error); };
});

async function dbAddImage(doc) {
  var db = await dbPromise;
  var tx = db.transaction(STORE_NAME, 'readwrite');
  var store = tx.objectStore(STORE_NAME);

  // 不要自己塞 id；讓 autoIncrement 生成
  var clean = Object.assign({}, doc);
  delete clean.id;

  var id = await idbReqToPromise(store.add(clean));
  await txDone(tx);
  return id;
}

async function dbGetAllImages() {
  var db = await dbPromise;
  var tx = db.transaction(STORE_NAME, 'readonly');
  var store = tx.objectStore(STORE_NAME);

  var list = await idbReqToPromise(store.getAll());
  await txDone(tx);
  return list || [];
}

async function dbDeleteImageById(id) {
  var db = await dbPromise;
  var tx = db.transaction(STORE_NAME, 'readwrite');
  var store = tx.objectStore(STORE_NAME);

  await idbReqToPromise(store.delete(id));
  await txDone(tx);
}

async function dbClearAllImages() {
  var db = await dbPromise;
  var tx = db.transaction(STORE_NAME, 'readwrite');
  var store = tx.objectStore(STORE_NAME);

  await idbReqToPromise(store.clear());
  await txDone(tx);
}

async function updateHistoryCount() {
  var images = await dbGetAllImages();
  document.getElementById('historyCount').textContent = images.length;

  var total = images.reduce(function(sum, img) { return sum + (img.size || 0); }, 0);
  document.getElementById('storageSize').textContent = (total / 1024).toFixed(2) + ' KB';
}

// ========= UI 控制 =========
function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function saveImage(imageData) {
  await dbAddImage(imageData);
  await updateHistoryCount();
}

async function loadHistory() {
  var images = await dbGetAllImages();
  var listDiv = document.getElementById('historyList');
  var totalDiv = document.getElementById('historyTotal');

  totalDiv.textContent = images.length;

  if (images.length === 0) {
    listDiv.innerHTML = '<div class="empty-state"><p data-t="empty_his">暫無歷史記錄</p></div>';
    return;
  }

  listDiv.innerHTML = '<div class="gallery"></div>';
  var gallery = listDiv.querySelector('.gallery');

  images.slice().reverse().forEach(function(img) {
    var safePrompt = escapeHtml(img.prompt || '');
    var promptShort = safePrompt.length > 60 ? (safePrompt.substring(0, 60) + '...') : safePrompt;

    var card = document.createElement('div');
    card.className = 'gallery-item';

    card.innerHTML =
      '<img src="' + img.url + '" onclick="openModal(this.src)">' +
      '<div class="gallery-info">' +
        '<div class="gallery-meta">' +
          '<span class="provider-badge">' + escapeHtml(img.provider) + '</span>' +
          '<span class="model-badge">' + escapeHtml(img.model) + '</span>' +
        '</div>' +
        '<div class="gallery-meta">' +
          '<span class="seed-badge">Seed: ' + escapeHtml(img.seed) + '</span>' +
          '<span class="style-badge">' + escapeHtml(img.style_name) + '</span>' +
        '</div>' +
        '<div style="font-size:11px;color:#9ca3af;margin:8px 0">' + promptShort + '</div>' +
        '<div class="gallery-actions">' +
          '<button class="action-btn" onclick="downloadImage(\\'' + img.url + '\\',\\'flux-' + escapeHtml(img.seed) + '.png\\')">💾 保存</button>' +
          '<button class="action-btn" onclick="uiDeleteHistoryItem(' + img.id + ')">🗑️ 刪除</button>' +
        '</div>' +
      '</div>';

    gallery.appendChild(card);
  });
}

window.uiDeleteHistoryItem = async function(id) {
  if (!confirm('確定刪除此圖像？')) return;
  await dbDeleteImageById(id);
  await updateHistoryCount();
  await loadHistory();
};

document.getElementById('clearBtn').onclick = async function() {
  if (!confirm('確定清空所有歷史記錄？此操作不可撤銷！')) return;
  await dbClearAllImages();
  await updateHistoryCount();
  await loadHistory();
};

document.getElementById('exportBtn').onclick = async function() {
  var images = await dbGetAllImages();
  var data = images.map(function(img) {
    return {
      id: img.id,
      prompt: img.prompt,
      provider: img.provider,
      model: img.model,
      seed: img.seed,
      width: img.width,
      height: img.height,
      style: img.style_name,
      quality: img.quality_mode,
      timestamp: new Date(img.timestamp).toISOString()
    };
  });

  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'flux-ai-history-' + Date.now() + '.json';
  a.click();
};

// ========= 頁面切換 =========
var navBtns = document.querySelectorAll('.nav-btn[data-page]');
navBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    var targetPage = btn.dataset.page;
    
    navBtns.forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');

    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    document.getElementById(targetPage + 'Page').classList.add('active');

    if (targetPage === 'history') loadHistory();
  });
});

// ========= Seed 鎖定 =========
var seedInput = document.getElementById('seed');
var seedToggleBtn = document.getElementById('seedToggleBtn');
var seedLocked = false;

seedToggleBtn.addEventListener('click', function(e) {
  e.preventDefault();
  seedLocked = !seedLocked;
  
  if (seedLocked) {
    seedInput.disabled = false;
    seedInput.style.opacity = '1';
    seedInput.style.cursor = 'text';
    if (seedInput.value === '-1') seedInput.value = Math.floor(Math.random() * 1000000);
    seedToggleBtn.textContent = '🔒';
    seedToggleBtn.style.background = 'rgba(245,158,11,0.2)';
    seedToggleBtn.style.borderColor = '#f59e0b';
  } else {
    seedInput.disabled = true;
    seedInput.style.opacity = '0.7';
    seedInput.style.cursor = 'not-allowed';
    seedInput.value = '-1';
    seedToggleBtn.textContent = '🎲';
    seedToggleBtn.style.background = 'rgba(255,255,255,0.1)';
    seedToggleBtn.style.borderColor = 'rgba(255,255,255,0.2)';
  }
});

// ========= 自動優化切換 =========
var autoOptimizeCheck = document.getElementById('autoOptimize');
var advancedParamsDiv = document.getElementById('advancedParams');

autoOptimizeCheck.addEventListener('change', function() {
  advancedParamsDiv.style.display = this.checked ? 'none' : 'block';
});

// ========= Provider / Model 聯動 =========
var providerSelect = document.getElementById('provider');
var modelSelect = document.getElementById('model');

function populateProviders() {
  providerSelect.innerHTML = '';
  ENABLED_PROVIDERS.forEach(function(p) {
    var opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    providerSelect.appendChild(opt);
  });
  updateModelsForProvider(providerSelect.value);
}

function updateModelsForProvider(providerId) {
  modelSelect.innerHTML = '';
  var models = MODELS_BY_PROVIDER[providerId] || [];
  if (models.length === 0) {
    modelSelect.innerHTML = '<option value="">No models available</option>';
    return;
  }
  models.forEach(function(m) {
    var opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.name;
    modelSelect.appendChild(opt);
  });
}

providerSelect.addEventListener('change', function() {
  updateModelsForProvider(this.value);
});

// ========= 尺寸預設聯動 =========
var sizeSelect = document.getElementById('size');
sizeSelect.addEventListener('change', function() {
  var presetKey = this.value;
  var preset = PRESET_SIZES[presetKey];
  if (preset) {
    document.getElementById('width').value = preset.width;
    document.getElementById('height').value = preset.height;
  }
});

// ========= 生成表單提交 =========
var generateForm = document.getElementById('generateForm');
var generateBtn = document.getElementById('generateBtn');
var resultsDiv = document.getElementById('results');

generateForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  var prompt = document.getElementById('prompt').value.trim();
  if (!prompt) {
    alert('請輸入提示詞');
    return;
  }

  var provider = providerSelect.value;
  var model = modelSelect.value;
  var sizeKey = sizeSelect.value;
  var preset = PRESET_SIZES[sizeKey];
  var width = preset ? preset.width : 1024;
  var height = preset ? preset.height : 1024;

  var style = document.getElementById('style').value;
  var qualityMode = document.getElementById('qualityMode').value;
  var seed = parseInt(seedInput.value);
  var negativePrompt = document.getElementById('negativePrompt').value.trim();
  var referenceImagesText = document.getElementById('referenceImages').value.trim();

  var referenceImages = [];
  if (referenceImagesText) {
    referenceImages = referenceImagesText.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
  }

  var autoOptimize = autoOptimizeCheck.checked;
  var steps = autoOptimize ? null : parseInt(document.getElementById('steps').value);
  var guidanceScale = autoOptimize ? null : parseFloat(document.getElementById('guidanceScale').value);

  generateBtn.disabled = true;
  generateBtn.innerHTML = '<div class="spinner"></div> <span>生成中...</span>';

  resultsDiv.innerHTML = '<div style="text-align:center;padding:60px"><div class="spinner"></div><p style="margin-top:20px;color:#9ca3af">正在生成圖像，請稍候...</p></div>';

  try {
    var payload = {
      prompt: prompt,
      negative_prompt: negativePrompt,
      provider: provider,
      model: model,
      width: width,
      height: height,
      style: style,
      quality_mode: qualityMode,
      seed: seed,
      n: 1,
      auto_optimize: autoOptimize,
      auto_hd: true,
      reference_images: referenceImages
    };

    if (!autoOptimize) {
      if (steps) payload.steps = steps;
      if (guidanceScale) payload.guidance_scale = guidanceScale;
    }

    var response = await fetch('/_internal/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      var errorData = await response.json();
      throw new Error(errorData.error?.message || 'Generation failed');
    }

    var blob = await response.blob();
    var imageUrl = URL.createObjectURL(blob);

    var genSeed = response.headers.get('X-Seed') || seed;
    var genProvider = response.headers.get('X-Provider') || provider;
    var genModel = response.headers.get('X-Model') || model;
    var genWidth = response.headers.get('X-Width') || width;
    var genHeight = response.headers.get('X-Height') || height;
    var genStyle = response.headers.get('X-Style') || style;
    var genStyleName = response.headers.get('X-Style-Name') || style;
    var genQuality = response.headers.get('X-Quality-Mode') || qualityMode;

    resultsDiv.innerHTML = '<div class="gallery"><div class="gallery-item">' +
      '<img src="' + imageUrl + '" onclick="openModal(this.src)" style="cursor:pointer">' +
      '<div class="gallery-info">' +
        '<div class="gallery-meta">' +
          '<span class="provider-badge">' + escapeHtml(genProvider) + '</span>' +
          '<span class="model-badge">' + escapeHtml(genModel) + '</span>' +
        '</div>' +
        '<div class="gallery-meta">' +
          '<span class="seed-badge">Seed: ' + escapeHtml(genSeed) + '</span>' +
          '<span class="style-badge">' + escapeHtml(genStyleName) + '</span>' +
        '</div>' +
        '<div style="font-size:11px;color:#9ca3af;margin:8px 0">' + escapeHtml(prompt.substring(0, 80)) + '</div>' +
        '<div class="gallery-actions">' +
          '<button class="action-btn" onclick="downloadImage(\\'' + imageUrl + '\\',\\'flux-' + genSeed + '.png\\')">💾 下載</button>' +
        '</div>' +
      '</div>' +
    '</div></div>';

    await saveImage({
      url: imageUrl,
      blob: blob,
      size: blob.size,
      timestamp: Date.now(),
      prompt: prompt,
      negative_prompt: negativePrompt,
      provider: genProvider,
      model: genModel,
      seed: genSeed,
      width: genWidth,
      height: genHeight,
      style: genStyle,
      style_name: genStyleName,
      quality_mode: genQuality
    });

  } catch (error) {
    resultsDiv.innerHTML = '<div class="empty-state"><p style="color:#ef4444">❌ ' + escapeHtml(error.message) + '</p></div>';
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<span data-t="gen_btn">🎨 開始生成</span>';
  }
});

// ========= Modal =========
var modal = document.getElementById('imageModal');
var modalImg = document.getElementById('modalImage');
var modalCloseBtn = document.getElementById('modalCloseBtn');

window.openModal = function(src) {
  modal.classList.add('show');
  modalImg.src = src;
};

modalCloseBtn.onclick = function() {
  modal.classList.remove('show');
};

modal.onclick = function(e) {
  if (e.target === modal) modal.classList.remove('show');
};

// ========= 下載圖片 =========
window.downloadImage = function(url, filename) {
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};

// ========= 多語言 =========
var TEXTS = {
  'zh-TW': {
    nav_gen: '🎨 生成圖像', nav_his: '📚 歷史記錄',
    settings_title: '⚙️ 生成參數',
    provider_label: '🌐 API 供應商', model_label: '🤖 模型選擇',
    size_label: '📐 尺寸預設', style_label: '🎨 藝術風格',
    quality_label: '⚡ 質量模式', seed_label: '🎲 Seed (種子碼)',
    auto_opt_label: '✨ 自動優化', auto_opt_desc: '自動調整 Steps 與 Guidance',
    adv_settings: '🛠️ 進階參數', steps_label: '生成步數 (Steps)',
    guidance_label: '引導係數 (Guidance)', gen_btn: '🎨 開始生成',
    pos_prompt: '💬 正面提示詞', neg_prompt: '🚫 負面提示詞 (可選)',
    ref_img: '🖼️ 參考圖像 URL (Kontext 專用)',
    empty_title: '尚未生成任何圖像', empty_his: '暫無歷史記錄',
    stat_total: '📊 總記錄數', stat_storage: '💾 存儲空間 (永久)',
    btn_export: '📥 導出', btn_clear: '🗑️ 清空'
  },
  'en': {
    nav_gen: '🎨 Generate', nav_his: '📚 History',
    settings_title: '⚙️ Parameters',
    provider_label: '🌐 API Provider', model_label: '🤖 Model',
    size_label: '📐 Size Preset', style_label: '🎨 Art Style',
    quality_label: '⚡ Quality Mode', seed_label: '🎲 Seed',
    auto_opt_label: '✨ Auto Optimize', auto_opt_desc: 'Auto-adjust Steps & Guidance',
    adv_settings: '🛠️ Advanced', steps_label: 'Steps',
    guidance_label: 'Guidance Scale', gen_btn: '🎨 Generate',
    pos_prompt: '💬 Prompt', neg_prompt: '🚫 Negative Prompt',
    ref_img: '🖼️ Reference Images (Kontext)',
    empty_title: 'No images generated yet', empty_his: 'No history',
    stat_total: '📊 Total Records', stat_storage: '💾 Storage (Forever)',
    btn_export: '📥 Export', btn_clear: '🗑️ Clear'
  }
};

var currentLang = 'zh-TW';
var langSwitchBtn = document.getElementById('langSwitch');

langSwitchBtn.addEventListener('click', function() {
  currentLang = currentLang === 'zh-TW' ? 'en' : 'zh-TW';
  applyLanguage(currentLang);
});

function applyLanguage(lang) {
  var texts = TEXTS[lang];
  document.querySelectorAll('[data-t]').forEach(function(el) {
    var key = el.getAttribute('data-t');
    if (texts[key]) el.textContent = texts[key];
  });
}

// ========= 初始化 =========
populateProviders();
updateHistoryCount();
applyLanguage(currentLang);

</script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      ...corsHeaders()
    }
  });
}
</script>
