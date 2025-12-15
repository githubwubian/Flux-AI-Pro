// ============================================
// Flux AI Pro - Cloudflare Worker
// Version: 10.0.0 (New API Support)
// ============================================

// ========== API 配置 ==========
const API_CONFIG = {
  // 新 API 端點 (優先使用)
  BASE_URL: 'https://gen.pollinations.ai',
  // 舊 API 端點 (降級備用)
  FALLBACK_URL: 'https://image.pollinations.ai',
  // 請求超時時間 (毫秒)
  TIMEOUT: 30000,
  // API 版本
  VERSION: 'v2',
};

// ========== 速率限制配置 ==========
const RATE_LIMIT = {
  // 每分鐘請求數
  PER_MINUTE: 10,
  // 每小時請求數
  PER_HOUR: 100,
  // 封禁時長 (毫秒)
  BAN_DURATION: 3600000, // 1小時
};

// ========== 支持的模型列表 ==========
const SUPPORTED_MODELS = {
  // Flux 系列 (穩定)
  'flux': {
    name: 'Flux',
    provider: 'Pollinations.ai',
    maxSize: 2048,
    stable: true,
    description: '均衡速度與質量',
  },
  'flux-realism': {
    name: 'Flux Realism',
    provider: 'Pollinations.ai',
    maxSize: 2048,
    stable: true,
    description: '超寫實照片風格',
  },
  'flux-anime': {
    name: 'Flux Anime',
    provider: 'Pollinations.ai',
    maxSize: 2048,
    stable: true,
    description: '日系動漫風格',
  },
  'flux-3d': {
    name: 'Flux 3D',
    provider: 'Pollinations.ai',
    maxSize: 2048,
    stable: true,
    description: '3D 渲染風格',
  },
  'flux-pro': {
    name: 'Flux Pro',
    provider: 'Pollinations.ai',
    maxSize: 2048,
    stable: true,
    description: '專業版最高質量',
  },
  'any-dark': {
    name: 'Any Dark',
    provider: 'Pollinations.ai',
    maxSize: 2048,
    stable: true,
    description: '暗黑風格',
  },
  'turbo': {
    name: 'Turbo',
    provider: 'Pollinations.ai',
    maxSize: 2048,
    stable: true,
    description: '極速生成',
  },
  
  // Flux 進階系列 (實驗性)
  'flux-1.1-pro': {
    name: 'Flux 1.1 Pro',
    provider: 'Pollinations.ai',
    maxSize: 2048,
    stable: false,
    description: '最新 Flux 1.1',
    fallback: 'flux-pro',
  },
  'flux-kontext': {
    name: 'Flux Kontext',
    provider: 'Pollinations.ai',
    maxSize: 2048,
    stable: false,
    supportReferenceImages: 1,
    description: '圖像編輯',
    fallback: 'flux-pro',
  },
  'flux-kontext-pro': {
    name: 'Flux Kontext Pro',
    provider: 'Pollinations.ai',
    maxSize: 2048,
    stable: false,
    supportReferenceImages: 1,
    description: '圖像編輯專業版',
    fallback: 'flux-pro',
  },
  
  // Nano Banana 系列
  'nanobanana': {
    name: 'Nano Banana',
    provider: 'Pollinations.ai',
    maxSize: 2048,
    stable: true,
    supportReferenceImages: 4,
    description: 'Gemini 2.5 Flash 多圖融合',
  },
  'nanobanana-pro': {
    name: 'Nano Banana Pro',
    provider: 'Pollinations.ai',
    maxSize: 4096,
    stable: true,
    supportReferenceImages: 4,
    description: 'Gemini 3 Pro 4K 超清',
  },
  
  // Stable Diffusion 系列 (實驗性)
  'sd3': {
    name: 'SD 3',
    provider: 'Pollinations.ai',
    maxSize: 2048,
    stable: false,
    description: 'Stable Diffusion 3',
    fallback: 'flux-realism',
  },
  'sd3.5-large': {
    name: 'SD 3.5 Large',
    provider: 'Pollinations.ai',
    maxSize: 2048,
    stable: false,
    description: 'SD 3.5 大模型',
    fallback: 'flux-realism',
  },
  'sd3.5-turbo': {
    name: 'SD 3.5 Turbo',
    provider: 'Pollinations.ai',
    maxSize: 2048,
    stable: false,
    description: 'SD 3.5 快速版',
    fallback: 'flux-realism',
  },
  'sdxl': {
    name: 'SDXL',
    provider: 'Pollinations.ai',
    maxSize: 2048,
    stable: false,
    description: '經典 SDXL 1.0',
    fallback: 'flux-realism',
  },
  'sdxl-lightning': {
    name: 'SDXL Lightning',
    provider: 'Pollinations.ai',
    maxSize: 2048,
    stable: false,
    description: 'SDXL 極速版',
    fallback: 'flux-realism',
  },
};

// ========== 藝術風格列表 ==========
const SUPPORTED_STYLES = {
  // 動漫系列
  'anime': '動漫風格',
  'anime-chibi': 'Q版動漫',
  'japanese-manga': '日本漫畫',
  'shoujo-manga': '少女漫畫',
  'seinen-manga': '青年漫畫',
  'studio-ghibli': '吉卜力風格',
  
  // 寫實系列
  'photorealistic': '寫實照片',
  'cinematic': '電影級',
  'portrait': '人像攝影',
  
  // 傳統繪畫
  'oil-painting': '油畫',
  'watercolor': '水彩畫',
  'chinese-painting': '中國水墨畫',
  'ukiyo-e': '浮世繪',
  'sketch': '素描',
  'charcoal': '炭筆畫',
  'impressionism': '印象派',
  'surrealism': '超現實主義',
  
  // 數位藝術
  'digital-art': '數位藝術',
  'pixel-art': '像素藝術',
  'vector-art': '向量藝術',
  'low-poly': '低多邊形',
  
  // 幻想科幻
  'fantasy': '奇幻風格',
  'dark-fantasy': '黑暗奇幻',
  'fairy-tale': '童話風格',
  'cyberpunk': '賽博朋克',
  'sci-fi': '科幻未來',
  'steampunk': '蒸汽朋克',
  'vaporwave': '蒸氣波',
  
  // 動畫影視
  'disney': '迪士尼風格',
  'comic-book': '美式漫畫',
  
  // 藝術流派
  'pop-art': '普普藝術',
  'art-deco': '裝飾藝術',
  'art-nouveau': '新藝術風格',
  'abstract': '抽象藝術',
  'minimalist': '極簡主義',
  
  // 特殊風格
  'graffiti': '塗鴉藝術',
  'horror': '恐怖風格',
  'kawaii': '可愛風格',
};

// ========== 尺寸預設 ==========
const SIZE_PRESETS = {
  // 方形系列
  'square-512': { width: 512, height: 512 },
  'square-1k': { width: 1024, height: 1024 },
  'square-1.5k': { width: 1536, height: 1536 },
  'square-2k': { width: 2048, height: 2048 },
  'square-4k': { width: 4096, height: 4096 }, // 僅 Nano Banana Pro
  
  // 豎屏系列
  'portrait-9-16': { width: 768, height: 1344 },
  'portrait-9-16-hd': { width: 1080, height: 1920 },
  'portrait-9-16-2k': { width: 1536, height: 2688 },
  'portrait-3-4': { width: 768, height: 1024 },
  'portrait-3-4-hd': { width: 1152, height: 1536 },
  'portrait-2-3': { width: 1024, height: 1536 },
  
  // 橫屏系列
  'landscape-16-9': { width: 1344, height: 768 },
  'landscape-16-9-hd': { width: 1920, height: 1080 },
  'landscape-16-9-2k': { width: 2560, height: 1440 },
  'landscape-16-9-4k': { width: 3840, height: 2160 }, // 僅 Nano Banana Pro
  'landscape-4-3': { width: 1024, height: 768 },
  'landscape-21-9': { width: 2560, height: 1080 },
  
  // 社交媒體
  'instagram-square': { width: 1080, height: 1080 },
  'instagram-portrait': { width: 1080, height: 1350 },
  'instagram-story': { width: 1080, height: 1920 },
  'facebook-cover': { width: 2048, height: 1152 },
  'twitter-header': { width: 1500, height: 500 },
  'youtube-thumbnail': { width: 1280, height: 720 },
  'linkedin-banner': { width: 1584, height: 396 },
  
  // 印刷/設計
  'a4-portrait': { width: 2480, height: 3508 },
  'a4-landscape': { width: 3508, height: 2480 },
  'poster-24-36': { width: 2400, height: 3600 },
  
  // 桌布系列
  'wallpaper-fhd': { width: 1920, height: 1080 },
  'wallpaper-2k': { width: 2560, height: 1440 },
  'wallpaper-4k': { width: 3840, height: 2160 }, // 僅 Nano Banana Pro
  'wallpaper-ultrawide': { width: 3440, height: 1440 },
  'mobile-wallpaper': { width: 1242, height: 2688 },
};
// ========== 全局變量 (內存緩存) ==========
const requestCache = new Map();
const rateLimitStore = new Map();
const statsStore = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalGenerationTime: 0,
};

// ========== 工具函數 ==========

/**
 * 獲取客戶端 IP 地址
 */
function getClientIP(request) {
  return request.headers.get('CF-Connecting-IP') || 
         request.headers.get('X-Forwarded-For')?.split(',')[0] || 
         'unknown';
}

/**
 * 獲取 Pollinations API Token
 */
function getPollinationsToken(env, request) {
  // 優先級: 請求頭 > 環境變量
  const headerToken = request.headers.get('X-Pollinations-Token');
  if (headerToken) return headerToken;
  
  return env.POLLINATIONS_API_KEY || null;
}

/**
 * 檢查速率限制
 */
function checkRateLimit(ip) {
  const now = Date.now();
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, {
      minuteRequests: [],
      hourRequests: [],
      bannedUntil: null,
    });
  }
  
  const userLimit = rateLimitStore.get(ip);
  
  // 檢查是否被封禁
  if (userLimit.bannedUntil && now < userLimit.bannedUntil) {
    const remainingTime = Math.ceil((userLimit.bannedUntil - now) / 60000);
    return {
      allowed: false,
      reason: `Rate limit exceeded. Try again in ${remainingTime} minutes.`,
      retryAfter: Math.ceil((userLimit.bannedUntil - now) / 1000),
    };
  }
  
  // 清理過期記錄
  userLimit.minuteRequests = userLimit.minuteRequests.filter(t => now - t < 60000);
  userLimit.hourRequests = userLimit.hourRequests.filter(t => now - t < 3600000);
  
  // 檢查分鐘限制
  if (userLimit.minuteRequests.length >= RATE_LIMIT.PER_MINUTE) {
    return {
      allowed: false,
      reason: `Rate limit: ${RATE_LIMIT.PER_MINUTE} requests per minute`,
      retryAfter: 60,
    };
  }
  
  // 檢查小時限制
  if (userLimit.hourRequests.length >= RATE_LIMIT.PER_HOUR) {
    // 封禁 1 小時
    userLimit.bannedUntil = now + RATE_LIMIT.BAN_DURATION;
    return {
      allowed: false,
      reason: `Rate limit: ${RATE_LIMIT.PER_HOUR} requests per hour. Banned for 1 hour.`,
      retryAfter: 3600,
    };
  }
  
  // 記錄本次請求
  userLimit.minuteRequests.push(now);
  userLimit.hourRequests.push(now);
  
  return {
    allowed: true,
    remaining: {
      minute: RATE_LIMIT.PER_MINUTE - userLimit.minuteRequests.length,
      hour: RATE_LIMIT.PER_HOUR - userLimit.hourRequests.length,
    },
  };
}

/**
 * 驗證和標準化尺寸
 */
function validateSize(width, height, model) {
  const modelInfo = SUPPORTED_MODELS[model] || SUPPORTED_MODELS['flux'];
  const maxSize = modelInfo.maxSize || 2048;
  
  // 尺寸範圍檢查
  width = Math.max(256, Math.min(width, maxSize));
  height = Math.max(256, Math.min(height, maxSize));
  
  // 確保是 8 的倍數 (AI 模型要求)
  width = Math.floor(width / 8) * 8;
  height = Math.floor(height / 8) * 8;
  
  return { width, height };
}

/**
 * 解析尺寸預設
 */
function parseSize(sizePreset, customWidth, customHeight, model) {
  if (sizePreset && SIZE_PRESETS[sizePreset]) {
    const preset = SIZE_PRESETS[sizePreset];
    return validateSize(preset.width, preset.height, model);
  }
  
  return validateSize(
    customWidth || 1024,
    customHeight || 1024,
    model
  );
}

/**
 * 增強提示詞 (HD 優化)
 */
function enhancePrompt(prompt, style, qualityMode, autoHD) {
  let enhanced = prompt;
  
  // 添加風格關鍵詞
  if (style && SUPPORTED_STYLES[style]) {
    enhanced = `${enhanced}, ${style} style`;
  }
  
  // HD 優化
  if (autoHD) {
    const hdKeywords = {
      'economy': 'good quality',
      'standard': 'high quality, detailed',
      'ultra': 'ultra high quality, highly detailed, sharp focus, professional',
      'ultra_4k': 'ultra high quality, 4K, highly detailed, sharp focus, masterpiece, professional photography',
    };
    
    const keyword = hdKeywords[qualityMode] || hdKeywords['standard'];
    enhanced = `${enhanced}, ${keyword}`;
  }
  
  return enhanced.trim();
}

/**
 * 生成負面提示詞
 */
function generateNegativePrompt(customNegative, qualityMode) {
  const baseNegative = 'low quality, blurry, pixelated, jpeg artifacts';
  
  const qualityNegatives = {
    'economy': baseNegative,
    'standard': `${baseNegative}, distorted, deformed`,
    'ultra': `${baseNegative}, distorted, deformed, ugly, bad anatomy, watermark`,
    'ultra_4k': `${baseNegative}, distorted, deformed, ugly, bad anatomy, watermark, signature, text, cropped`,
  };
  
  const autoNegative = qualityNegatives[qualityMode] || qualityNegatives['standard'];
  
  return customNegative 
    ? `${customNegative}, ${autoNegative}` 
    : autoNegative;
}

/**
 * 中文檢測
 */
function containsChinese(text) {
  return /[\u4e00-\u9fa5]/.test(text);
}

/**
 * 翻譯中文 (使用 Workers AI)
 */
async function translateToEnglish(text, env) {
  if (!containsChinese(text)) {
    return text;
  }
  
  // 檢查是否綁定了 Workers AI
  if (!env.AI) {
    console.warn('⚠️ Workers AI not bound, skipping translation');
    return text;
  }
  
  try {
    const response = await env.AI.run('@cf/meta/m2m100-1.2b', {
      text: text,
      source_lang: 'zh',
      target_lang: 'en',
    });
    
    return response.translated_text || text;
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // 翻譯失敗時使用原文
  }
}

/**
 * 生成隨機 Seed
 */
function generateRandomSeed() {
  return Math.floor(Math.random() * 1000000);
}

/**
 * 格式化錯誤響應
 */
function errorResponse(message, status = 400, details = {}) {
  return new Response(JSON.stringify({
    error: {
      message: message,
      type: 'invalid_request_error',
      code: status,
      ...details,
    },
  }), {
    status: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

/**
 * 成功響應
 */
function successResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    },
  });
}

/**
 * CORS 預檢響應
 */
function corsResponse() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Pollinations-Token',
      'Access-Control-Max-Age': '86400',
    },
  });
}
// ========== 新 API 圖像生成函數 ==========

/**
 * 使用新 API 生成圖像
 */
async function generateImageWithNewAPI(prompt, params = {}, env) {
  const token = params.token || null;
  
  // 如果沒有 Token，降級到舊 API
  if (!token) {
    console.warn('⚠️ No API token found, falling back to old API');
    return generateImageWithOldAPI(prompt, params, env);
  }
  
  // 構建 URL
  const url = new URL(`${API_CONFIG.BASE_URL}/image/${encodeURIComponent(prompt)}`);
  
  // 準備查詢參數
  const queryParams = {
    model: params.model || 'flux',
    width: params.width || 1024,
    height: params.height || 1024,
    seed: params.seed !== undefined ? params.seed : generateRandomSeed(),
    nologo: params.nologo !== false, // 默認去水印
    enhance: params.enhance || false,
    safe: params.safe || false,
    nofeed: params.private || params.nofeed || false,
  };
  
  // 可選參數
  if (params.negative_prompt) {
    queryParams.negative = params.negative_prompt;
  }
  
  // 參考圖片處理
  if (params.reference_images && params.reference_images.length > 0) {
    // 新 API 使用 | 分隔多個圖片
    queryParams.image = params.reference_images.join('|');
  }
  
  // 添加所有參數到 URL
  Object.entries(queryParams).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      url.searchParams.append(key, String(val));
    }
  });
  
  console.log('🚀 Calling new API:', url.toString());
  
  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Flux-AI-Pro/10.0.0',
        'Accept': 'image/*,application/json',
      },
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    });
    
    // 處理錯誤響應
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = `API Error ${response.status}`;
      
      if (contentType?.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // JSON 解析失敗，使用默認消息
        }
      } else {
        const errorText = await response.text().catch(() => '');
        if (errorText) errorMessage = errorText;
      }
      
      throw new Error(errorMessage);
    }
    
    // 檢查響應類型
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      // 返回 JSON (包含圖片 URL)
      const data = await response.json();
      return {
        url: data.url || data.image_url || data.result,
        seed: queryParams.seed,
        model: queryParams.model,
        provider: 'Pollinations.ai',
        api_version: 'v2',
        fallback: false,
      };
    } else {
      // 直接返回圖片 URL
      return {
        url: url.toString(),
        seed: queryParams.seed,
        model: queryParams.model,
        provider: 'Pollinations.ai',
        api_version: 'v2',
        fallback: false,
      };
    }
    
  } catch (error) {
    console.error('❌ New API failed:', error.message);
    
    // 處理特定錯誤
    if (error.message.includes('401') || error.message.includes('403')) {
      console.warn('🔑 Authentication failed, falling back to old API');
      return generateImageWithOldAPI(prompt, params, env);
    }
    
    if (error.message.includes('timeout') || error.message.includes('abort')) {
      throw new Error('Request timeout. Please try again.');
    }
    
    // 嘗試降級
    if (!params.skipFallback) {
      console.warn('🔄 Falling back to old API');
      return generateImageWithOldAPI(prompt, params, env);
    }
    
    throw error;
  }
}

// ========== 舊 API 圖像生成函數 (降級備用) ==========

/**
 * 使用舊 API 生成圖像
 */
async function generateImageWithOldAPI(prompt, params = {}, env) {
  const url = new URL(`${API_CONFIG.FALLBACK_URL}/prompt/${encodeURIComponent(prompt)}`);
  
  // 準備查詢參數
  const queryParams = {
    model: params.model || 'flux',
    width: params.width || 1024,
    height: params.height || 1024,
    seed: params.seed !== undefined ? params.seed : generateRandomSeed(),
    enhance: params.enhance || false,
  };
  
  // 添加所有參數到 URL
  Object.entries(queryParams).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      url.searchParams.append(key, String(val));
    }
  });
  
  console.log('🔄 Calling fallback API:', url.toString());
  
  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Flux-AI-Pro/10.0.0',
      },
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    });
    
    if (!response.ok) {
      throw new Error(`Fallback API Error ${response.status}`);
    }
    
    return {
      url: url.toString(),
      seed: queryParams.seed,
      model: queryParams.model,
      provider: 'Pollinations.ai',
      api_version: 'v1',
      fallback: true,
      warning: 'Using legacy API. Image may contain watermark. Consider adding API token.',
    };
    
  } catch (error) {
    console.error('❌ Fallback API also failed:', error.message);
    throw new Error(`All APIs failed: ${error.message}`);
  }
}

// ========== 模型降級處理 ==========

/**
 * 嘗試生成圖像，失敗時自動降級模型
 */
async function generateWithFallback(prompt, params, env) {
  const model = params.model || 'flux';
  const modelInfo = SUPPORTED_MODELS[model];
  
  // 如果模型不存在，使用默認模型
  if (!modelInfo) {
    console.warn(`⚠️ Unknown model: ${model}, using flux`);
    params.model = 'flux';
    return generateImageWithNewAPI(prompt, params, env);
  }
  
  try {
    // 嘗試使用指定模型
    return await generateImageWithNewAPI(prompt, params, env);
    
  } catch (error) {
    // 如果是實驗性模型且有降級選項
    if (!modelInfo.stable && modelInfo.fallback) {
      console.warn(`🔄 Model ${model} failed, trying fallback: ${modelInfo.fallback}`);
      params.model = modelInfo.fallback;
      
      try {
        const result = await generateImageWithNewAPI(prompt, params, env);
        result.fallback_model = modelInfo.fallback;
        result.original_model = model;
        result.warning = `Original model ${model} failed, used ${modelInfo.fallback} instead`;
        return result;
        
      } catch (fallbackError) {
        // 最終降級到 flux
        console.warn('🔄 Fallback model also failed, using flux');
        params.model = 'flux';
        const result = await generateImageWithNewAPI(prompt, params, env);
        result.fallback_model = 'flux';
        result.original_model = model;
        result.warning = `Original model ${model} failed, used flux instead`;
        return result;
      }
    }
    
    // 非實驗性模型直接拋出錯誤
    throw error;
  }
}

// ========== 批量生成函數 ==========

/**
 * 批量生成多張圖片
 */
async function batchGenerate(prompt, params, count, env) {
  const results = [];
  const baseSeed = params.seed !== undefined ? params.seed : generateRandomSeed();
  
  // 限制批量數量
  const actualCount = Math.min(count, 4);
  
  for (let i = 0; i < actualCount; i++) {
    try {
      // 每張圖片使用遞增的 seed
      const currentParams = {
        ...params,
        seed: baseSeed + i,
      };
      
      const result = await generateWithFallback(prompt, currentParams, env);
      
      results.push({
        url: result.url,
        provider: result.provider,
        model: result.model,
        seed: result.seed,
        width: params.width,
        height: params.height,
        index: i + 1,
        fallback: result.fallback || false,
        warning: result.warning,
        cost: 'FREE',
      });
      
    } catch (error) {
      console.error(`Image ${i + 1} generation failed:`, error.message);
      results.push({
        error: error.message,
        index: i + 1,
        seed: baseSeed + i,
      });
    }
  }
  
  return results;
}
// ========== API 路由處理函數 ==========

/**
 * 處理圖像生成請求
 */
async function handleImageGeneration(request, env) {
  const startTime = Date.now();
  
  try {
    // 解析請求體
    const body = await request.json().catch(() => ({}));
    
    // 提取參數
    const {
      prompt,
      model = 'flux',
      width: customWidth,
      height: customHeight,
      size_preset,
      seed,
      n = 1,
      style,
      quality_mode = 'standard',
      reference_images = [],
      negative_prompt,
      auto_hd = false,
      enhance = false,
      nologo = true,
      private: isPrivate = false,
      safe = false,
    } = body;
    
    // 驗證必需參數
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return errorResponse('Prompt is required and must be a non-empty string', 400);
    }
    
    if (prompt.length > 1000) {
      return errorResponse('Prompt is too long (max 1000 characters)', 400);
    }
    
    // 驗證批量數量
    const batchCount = Math.max(1, Math.min(parseInt(n) || 1, 4));
    
    // 驗證模型
    if (model && !SUPPORTED_MODELS[model]) {
      return errorResponse(
        `Unsupported model: ${model}. Use /v1/models to see available models.`,
        400
      );
    }
    
    // 解析尺寸
    const { width, height } = parseSize(
      size_preset,
      customWidth,
      customHeight,
      model
    );
    
    // 驗證參考圖片數量
    const modelInfo = SUPPORTED_MODELS[model];
    if (reference_images.length > 0) {
      const maxImages = modelInfo.supportReferenceImages || 0;
      if (maxImages === 0) {
        return errorResponse(
          `Model ${model} does not support reference images`,
          400
        );
      }
      if (reference_images.length > maxImages) {
        return errorResponse(
          `Model ${model} supports max ${maxImages} reference images, got ${reference_images.length}`,
          400
        );
      }
    }
    
    // 翻譯中文提示詞
    let translatedPrompt = prompt;
    try {
      translatedPrompt = await translateToEnglish(prompt, env);
      console.log('📝 Translated prompt:', translatedPrompt);
    } catch (error) {
      console.warn('Translation failed, using original prompt:', error);
    }
    
    // 增強提示詞
    const enhancedPrompt = enhancePrompt(
      translatedPrompt,
      style,
      quality_mode,
      auto_hd || enhance
    );
    
    // 生成負面提示詞
    const finalNegativePrompt = generateNegativePrompt(
      negative_prompt,
      quality_mode
    );
    
    // 獲取 API Token
    const token = getPollinationsToken(env, request);
    
    // 準備生成參數
    const generateParams = {
      model,
      width,
      height,
      seed,
      token,
      reference_images,
      negative_prompt: finalNegativePrompt,
      enhance: enhance || auto_hd,
      nologo,
      private: isPrivate,
      safe,
    };
    
    // 批量生成
    console.log(`🎨 Generating ${batchCount} image(s) with model: ${model}`);
    const results = await batchGenerate(
      enhancedPrompt,
      generateParams,
      batchCount,
      env
    );
    
    // 計算生成時間
    const generationTime = Date.now() - startTime;
    
    // 更新統計
    statsStore.totalRequests++;
    statsStore.successfulRequests++;
    statsStore.totalGenerationTime += generationTime;
    
    // 構建響應
    const response = {
      created: Math.floor(Date.now() / 1000),
      data: results,
      generation_time_ms: generationTime,
      api_version: API_CONFIG.VERSION,
      model_info: {
        requested: model,
        name: modelInfo.name,
        provider: modelInfo.provider,
        stable: modelInfo.stable,
      },
      prompt_info: {
        original: prompt,
        translated: translatedPrompt !== prompt ? translatedPrompt : undefined,
        enhanced: enhancedPrompt,
        negative: finalNegativePrompt,
      },
      parameters: {
        size: `${width}x${height}`,
        seed: seed !== undefined ? seed : 'random',
        style: style || 'default',
        quality_mode,
        reference_images_count: reference_images.length,
      },
      authentication: {
        has_token: !!token,
        api_type: token ? 'authenticated' : 'anonymous',
        warning: !token ? 'Using anonymous API. Consider adding API token for better quality and rate limits.' : undefined,
      },
    };
    
    return successResponse(response);
    
  } catch (error) {
    console.error('❌ Generation error:', error);
    
    // 更新統計
    statsStore.totalRequests++;
    statsStore.failedRequests++;
    
    return errorResponse(
      error.message || 'Internal server error',
      500,
      { details: error.stack }
    );
  }
}

/**
 * 獲取模型列表
 */
async function handleGetModels(request, env) {
  const models = Object.entries(SUPPORTED_MODELS).map(([id, info]) => ({
    id,
    name: info.name,
    provider: info.provider,
    max_size: info.maxSize,
    stable: info.stable,
    description: info.description,
    support_reference_images: info.supportReferenceImages || 0,
    fallback_model: info.fallback,
  }));
  
  return successResponse({
    data: models,
    total: models.length,
  });
}

/**
 * 獲取風格列表
 */
async function handleGetStyles(request, env) {
  const styles = Object.entries(SUPPORTED_STYLES).map(([id, name]) => ({
    id,
    name,
    category: getCategoryForStyle(id),
  }));
  
  return successResponse({
    data: styles,
    total: styles.length,
  });
}

/**
 * 獲取風格分類
 */
function getCategoryForStyle(styleId) {
  const categories = {
    anime: 'Animation',
    photorealistic: 'Photography',
    'oil-painting': 'Traditional Art',
    'digital-art': 'Digital Art',
    fantasy: 'Fantasy & Sci-Fi',
    disney: 'Animation & Film',
    'pop-art': 'Art Movements',
    graffiti: 'Special Styles',
  };
  
  for (const [key, category] of Object.entries(categories)) {
    if (styleId.includes(key)) return category;
  }
  
  return 'Other';
}

/**
 * 獲取尺寸預設列表
 */
async function handleGetSizePresets(request, env) {
  const presets = Object.entries(SIZE_PRESETS).map(([id, size]) => ({
    id,
    width: size.width,
    height: size.height,
    aspect_ratio: (size.width / size.height).toFixed(2),
    category: getCategoryForPreset(id),
  }));
  
  return successResponse({
    data: presets,
    total: presets.length,
  });
}

/**
 * 獲取預設分類
 */
function getCategoryForPreset(presetId) {
  if (presetId.startsWith('square')) return 'Square';
  if (presetId.startsWith('portrait')) return 'Portrait';
  if (presetId.startsWith('landscape')) return 'Landscape';
  if (presetId.startsWith('instagram') || 
      presetId.startsWith('facebook') || 
      presetId.startsWith('twitter') ||
      presetId.startsWith('youtube') ||
      presetId.startsWith('linkedin')) return 'Social Media';
  if (presetId.startsWith('a4') || presetId.startsWith('poster')) return 'Print & Design';
  if (presetId.startsWith('wallpaper') || presetId.startsWith('mobile')) return 'Wallpapers';
  return 'Other';
}

/**
 * 獲取服務商信息
 */
async function handleGetProviders(request, env) {
  const token = getPollinationsToken(env, request);
  
  return successResponse({
    data: [
      {
        id: 'pollinations',
        name: 'Pollinations.ai',
        endpoint: API_CONFIG.BASE_URL,
        fallback_endpoint: API_CONFIG.FALLBACK_URL,
        version: API_CONFIG.VERSION,
        authentication: {
          required: false,
          type: 'Bearer Token',
          has_token: !!token,
          get_token_url: 'https://auth.pollinations.ai',
        },
        features: {
          text_to_image: true,
          image_to_image: true,
          multi_image_fusion: true,
          chinese_translation: !!env.AI,
          batch_generation: true,
          seed_control: true,
          style_presets: true,
        },
        rate_limits: {
          anonymous: '15 seconds per request',
          seed_tier: '5 seconds per request (free registration)',
          flower_tier: '3 seconds per request (paid)',
          nectar_tier: 'Unlimited (enterprise)',
        },
        supported_models: Object.keys(SUPPORTED_MODELS).length,
        cost: 'FREE',
      },
    ],
  });
}

/**
 * 健康檢查
 */
async function handleHealthCheck(request, env) {
  const token = getPollinationsToken(env, request);
  
  return successResponse({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '10.0.0',
    api_version: API_CONFIG.VERSION,
    services: {
      pollinations_new_api: {
        endpoint: API_CONFIG.BASE_URL,
        authenticated: !!token,
        status: 'operational',
      },
      pollinations_fallback_api: {
        endpoint: API_CONFIG.FALLBACK_URL,
        status: 'operational',
      },
      workers_ai: {
        status: env.AI ? 'operational' : 'not configured',
        features: ['translation'],
      },
    },
    features: {
      chinese_translation: !!env.AI,
      batch_generation: true,
      seed_control: true,
      reference_images: true,
    },
  });
}

/**
 * 性能統計
 */
async function handleStats(request, env) {
  const avgGenerationTime = statsStore.totalRequests > 0
    ? Math.round(statsStore.totalGenerationTime / statsStore.totalRequests)
    : 0;
  
  return successResponse({
    statistics: {
      total_requests: statsStore.totalRequests,
      successful_requests: statsStore.successfulRequests,
      failed_requests: statsStore.failedRequests,
      success_rate: statsStore.totalRequests > 0
        ? ((statsStore.successfulRequests / statsStore.totalRequests) * 100).toFixed(2) + '%'
        : '0%',
      avg_generation_time_ms: avgGenerationTime,
    },
    cache_info: {
      cached_requests: requestCache.size,
      rate_limit_records: rateLimitStore.size,
    },
    timestamp: new Date().toISOString(),
  });
}
// ========== 主路由處理 ==========

/**
 * 路由分發器
 */
async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  
  // CORS 預檢請求
  if (method === 'OPTIONS') {
    return corsResponse();
  }
  
  // 獲取客戶端 IP
  const clientIP = getClientIP(request);
  
  // 速率限制檢查 (除了健康檢查和靜態端點)
  if (!path.match(/^\/(health|stats|v1\/(models|styles|providers|size-presets))$/)) {
    const rateLimitResult = checkRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({
        error: {
          message: rateLimitResult.reason,
          type: 'rate_limit_error',
          retry_after: rateLimitResult.retryAfter,
        },
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(rateLimitResult.retryAfter),
          'X-RateLimit-Remaining-Minute': String(rateLimitResult.remaining?.minute || 0),
          'X-RateLimit-Remaining-Hour': String(rateLimitResult.remaining?.hour || 0),
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  }
  
  // ========== 路由表 ==========
  
  // 主頁 - 返回 Web UI
  if (path === '/' && method === 'GET') {
    return handleWebUI(request, env);
  }
  
  // 圖像生成 API
  if (path === '/v1/images/generations' && method === 'POST') {
    return handleImageGeneration(request, env);
  }
  
  // 獲取模型列表
  if (path === '/v1/models' && method === 'GET') {
    return handleGetModels(request, env);
  }
  
  // 獲取風格列表
  if (path === '/v1/styles' && method === 'GET') {
    return handleGetStyles(request, env);
  }
  
  // 獲取尺寸預設列表
  if (path === '/v1/size-presets' && method === 'GET') {
    return handleGetSizePresets(request, env);
  }
  
  // 獲取服務商信息
  if (path === '/v1/providers' && method === 'GET') {
    return handleGetProviders(request, env);
  }
  
  // 健康檢查
  if (path === '/health' && method === 'GET') {
    return handleHealthCheck(request, env);
  }
  
  // 性能統計
  if (path === '/stats' && method === 'GET') {
    return handleStats(request, env);
  }
  
  // API 文檔
  if (path === '/docs' && method === 'GET') {
    return handleDocs(request, env);
  }
  
  // 404 未找到
  return errorResponse('Endpoint not found', 404, {
    available_endpoints: [
      'POST /v1/images/generations',
      'GET /v1/models',
      'GET /v1/styles',
      'GET /v1/size-presets',
      'GET /v1/providers',
      'GET /health',
      'GET /stats',
      'GET /docs',
    ],
  });
}

// ========== Web UI 處理 ==========

/**
 * 返回 Web UI 頁面
 */
async function handleWebUI(request, env) {
  // 檢查是否有 nanobanana.html 文件
  // 如果你的 Worker 包含 HTML 文件，這裡返回它
  // 否則返回簡單的 API 信息頁
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flux AI Pro - API Service</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 800px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 {
      color: #667eea;
      margin-bottom: 10px;
      font-size: 2.5em;
    }
    .version {
      color: #888;
      margin-bottom: 30px;
    }
    .status {
      background: #10b981;
      color: white;
      padding: 10px 20px;
      border-radius: 50px;
      display: inline-block;
      margin-bottom: 30px;
      font-weight: bold;
    }
    .info {
      background: #f3f4f6;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    .endpoint {
      background: #1f2937;
      color: #10b981;
      padding: 15px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      margin: 10px 0;
      overflow-x: auto;
    }
    .button {
      background: #667eea;
      color: white;
      padding: 12px 30px;
      border-radius: 8px;
      text-decoration: none;
      display: inline-block;
      margin: 10px 10px 0 0;
      transition: all 0.3s;
    }
    .button:hover {
      background: #5568d3;
      transform: translateY(-2px);
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    .feature {
      background: #f9fafb;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .feature h3 {
      color: #667eea;
      font-size: 1.1em;
      margin-bottom: 5px;
    }
    .feature p {
      color: #666;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎨 Flux AI Pro</h1>
    <div class="version">Version 10.0.0 - New API Support</div>
    <div class="status">✓ Service Operational</div>
    
    <div class="info">
      <h2 style="margin-bottom: 15px;">API Endpoints</h2>
      <div class="endpoint">POST /v1/images/generations</div>
      <div class="endpoint">GET /v1/models</div>
      <div class="endpoint">GET /v1/styles</div>
      <div class="endpoint">GET /health</div>
    </div>
    
    <div class="features">
      <div class="feature">
        <h3>17 AI Models</h3>
        <p>Flux, Nano Banana, SD3</p>
      </div>
      <div class="feature">
        <h3>39 Styles</h3>
        <p>動漫、寫實、藝術風格</p>
      </div>
      <div class="feature">
        <h3>Batch Generation</h3>
        <p>一次生成 1-4 張</p>
      </div>
      <div class="feature">
        <h3>Seed Control</h3>
        <p>精確復現圖片</p>
      </div>
      <div class="feature">
        <h3>Image to Image</h3>
        <p>支持參考圖生成</p>
      </div>
      <div class="feature">
        <h3>Chinese Support</h3>
        <p>自動翻譯中文</p>
      </div>
    </div>
    
    <div style="margin-top: 30px;">
      <a href="/docs" class="button">📖 API Documentation</a>
      <a href="/health" class="button">🏥 Health Check</a>
      <a href="/stats" class="button">📊 Statistics</a>
      <a href="https://github.com/kinai9661/Flux-AI-Pro" class="button" target="_blank">💻 GitHub</a>
    </div>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #888; text-align: center;">
      <p>Powered by <strong>Pollinations.ai</strong> | Made with ❤️ by kinai9661</p>
      <p style="margin-top: 10px; font-size: 0.9em;">
        New API: <code>gen.pollinations.ai</code> | 
        <a href="https://auth.pollinations.ai" target="_blank" style="color: #667eea;">Get API Token</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
  
  return new Response(htmlContent, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

// ========== API 文檔處理 ==========

/**
 * 返回 API 文檔
 */
async function handleDocs(request, env) {
  const token = getPollinationsToken(env, request);
  
  const docs = {
    title: 'Flux AI Pro API Documentation',
    version: '10.0.0',
    api_version: API_CONFIG.VERSION,
    base_url: new URL(request.url).origin,
    authentication: {
      type: 'Bearer Token (Optional)',
      header: 'Authorization: Bearer YOUR_TOKEN',
      alternative: 'X-Pollinations-Token: YOUR_TOKEN',
      get_token: 'https://auth.pollinations.ai',
      current_status: token ? 'Authenticated' : 'Anonymous',
      note: 'Token is optional but recommended for better rate limits and no watermark',
    },
    endpoints: {
      'POST /v1/images/generations': {
        description: '生成 AI 圖像',
        parameters: {
          prompt: { type: 'string', required: true, description: '圖像描述 (支持中文)' },
          model: { type: 'string', default: 'flux', description: '模型名稱' },
          width: { type: 'number', default: 1024, description: '寬度 (256-4096)' },
          height: { type: 'number', default: 1024, description: '高度 (256-4096)' },
          size_preset: { type: 'string', description: '尺寸預設 ID' },
          seed: { type: 'number', description: 'Seed 值 (0-999999)，留空則隨機' },
          n: { type: 'number', default: 1, description: '生成數量 (1-4)' },
          style: { type: 'string', description: '藝術風格 ID' },
          quality_mode: { type: 'string', default: 'standard', enum: ['economy', 'standard', 'ultra', 'ultra_4k'] },
          reference_images: { type: 'array', description: '參考圖片 URL 列表' },
          negative_prompt: { type: 'string', description: '負面提示詞' },
          auto_hd: { type: 'boolean', default: false, description: '自動 HD 優化' },
          enhance: { type: 'boolean', default: false, description: '增強提示詞' },
          nologo: { type: 'boolean', default: true, description: '去除水印 (需認證)' },
          private: { type: 'boolean', default: false, description: '不顯示在公開 Feed' },
          safe: { type: 'boolean', default: false, description: '啟用內容安全檢查' },
        },
        example: {
          prompt: 'a beautiful sunset over mountains',
          model: 'flux-realism',
          width: 1920,
          height: 1080,
          seed: 12345,
          n: 2,
          style: 'cinematic',
          quality_mode: 'ultra',
        },
      },
      'GET /v1/models': {
        description: '獲取所有可用模型列表',
        parameters: {},
      },
      'GET /v1/styles': {
        description: '獲取所有藝術風格列表',
        parameters: {},
      },
      'GET /v1/size-presets': {
        description: '獲取所有尺寸預設',
        parameters: {},
      },
      'GET /v1/providers': {
        description: '獲取服務商信息',
        parameters: {},
      },
      'GET /health': {
        description: '健康檢查',
        parameters: {},
      },
      'GET /stats': {
        description: '性能統計',
        parameters: {},
      },
    },
    rate_limits: {
      anonymous: {
        per_minute: RATE_LIMIT.PER_MINUTE,
        per_hour: RATE_LIMIT.PER_HOUR,
        note: '無 Token 時的限制',
      },
      authenticated: {
        note: '取決於 Pollinations.ai 賬戶層級',
        seed_tier: '5 秒/請求 (免費註冊)',
        flower_tier: '3 秒/請求 (付費)',
        nectar_tier: '無限制 (企業)',
      },
    },
    example_curl: `curl -X POST '${new URL(request.url).origin}/v1/images/generations' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_TOKEN' \\
  -d '{
    "prompt": "a beautiful cat",
    "model": "flux-realism",
    "width": 1024,
    "height": 1024,
    "seed": 12345
  }'`,
  };
  
  return successResponse(docs);
}

// ========== Worker 主入口 ==========

/**
 * Cloudflare Worker 入口函數
 */
export default {
  async fetch(request, env, ctx) {
    try {
      return await handleRequest(request, env);
    } catch (error) {
      console.error('❌ Unhandled error:', error);
      return errorResponse(
        'Internal server error',
        500,
        {
          message: error.message,
          stack: error.stack,
        }
      );
    }
  },
};
