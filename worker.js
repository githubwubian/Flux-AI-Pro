// =================================================================================
//  項目: multi-provider-image-generator (優化版)
//  版本: 9.0.0 (架構重構 + 性能優化)
//  作者: Enhanced by AI Assistant
//  日期: 2025-12-11
//  優化: 模塊化架構、性能提升、錯誤處理改進
// =================================================================================

const CONFIG = {
  PROJECT_NAME: "multi-provider-image-generator",
  PROJECT_VERSION: "9.0.0",
  API_MASTER_KEY: "1",
  
  MODELS: {
    "flux": { id: "flux", name: "Flux", category: "flux", confirmed: true, description: "均衡速度與質量", optimization: { steps: { min: 15, optimal: 20, max: 30 }, guidance: 7.5 } },
    "flux-realism": { id: "flux-realism", name: "Flux Realism", category: "flux", confirmed: true, description: "超寫實風格", optimization: { steps: { min: 20, optimal: 28, max: 40 }, guidance: 8.5 } },
    "flux-anime": { id: "flux-anime", name: "Flux Anime", category: "flux", confirmed: true, description: "日系動漫風格", optimization: { steps: { min: 15, optimal: 20, max: 30 }, guidance: 7.0 } },
    "flux-3d": { id: "flux-3d", name: "Flux 3D", category: "flux", confirmed: true, description: "3D 渲染風格", optimization: { steps: { min: 15, optimal: 22, max: 35 }, guidance: 7.5 } },
    "flux-pro": { id: "flux-pro", name: "Flux Pro", category: "flux", confirmed: true, description: "專業版最高質量", optimization: { steps: { min: 25, optimal: 32, max: 45 }, guidance: 8.0 } },
    "any-dark": { id: "any-dark", name: "Any Dark", category: "flux", confirmed: true, description: "暗黑風格", optimization: { steps: { min: 18, optimal: 24, max: 35 }, guidance: 7.5 } },
    "turbo": { id: "turbo", name: "Turbo", category: "flux", confirmed: true, description: "極速生成", optimization: { steps: { min: 4, optimal: 8, max: 12 }, guidance: 2.5 } },
    "flux-1.1-pro": { id: "flux-1.1-pro", name: "Flux 1.1 Pro 🔥", category: "flux-advanced", confirmed: false, experimental: true, fallback: ["flux-pro", "flux-realism"], description: "最新 Flux 1.1", optimization: { steps: { min: 20, optimal: 28, max: 40 }, guidance: 8.0 } },
    "flux-kontext": { id: "flux-kontext", name: "Flux Kontext 🎨", category: "flux-advanced", confirmed: false, experimental: true, fallback: ["flux-pro", "flux-realism"], description: "圖像編輯標準版", optimization: { steps: { min: 22, optimal: 30, max: 40 }, guidance: 7.5 } },
    "flux-kontext-pro": { id: "flux-kontext-pro", name: "Flux Kontext Pro 💎", category: "flux-advanced", confirmed: false, experimental: true, fallback: ["flux-kontext", "flux-pro", "flux-realism"], description: "圖像編輯專業版", optimization: { steps: { min: 25, optimal: 35, max: 45 }, guidance: 8.0 } },
    "nanobanana": { id: "nanobanana", name: "Nano Banana 🍌", category: "gemini", confirmed: true, description: "Google Gemini 2.5 Flash 圖像生成 (快速版)", optimization: { steps: { min: 15, optimal: 20, max: 30 }, guidance: 7.0 } },
    "nanobanana-pro": { id: "nanobanana-pro", name: "Nano Banana Pro 🍌💎", category: "gemini", confirmed: true, description: "Google Gemini 3 Pro 圖像生成 (支持4K、繁中文字、14圖融合)", optimization: { steps: { min: 20, optimal: 28, max: 40 }, guidance: 8.0 } },
    "sd3": { id: "sd3", name: "Stable Diffusion 3 ⚡", category: "stable-diffusion", confirmed: false, experimental: true, fallback: ["flux-realism", "flux"], description: "SD3 標準版", optimization: { steps: { min: 18, optimal: 25, max: 35 }, guidance: 7.5 } },
    "sd3.5-large": { id: "sd3.5-large", name: "SD 3.5 Large 🔥", category: "stable-diffusion", confirmed: false, experimental: true, fallback: ["sd3", "flux-realism", "flux"], description: "SD 3.5 大模型", optimization: { steps: { min: 25, optimal: 35, max: 50 }, guidance: 8.0 } },
    "sd3.5-turbo": { id: "sd3.5-turbo", name: "SD 3.5 Turbo ⚡", category: "stable-diffusion", confirmed: false, experimental: true, fallback: ["turbo", "flux"], description: "SD 3.5 快速版", optimization: { steps: { min: 8, optimal: 12, max: 20 }, guidance: 3.0 } },
    "sdxl": { id: "sdxl", name: "SDXL 📐", category: "stable-diffusion", confirmed: false, experimental: true, fallback: ["flux-realism", "flux"], description: "經典 SDXL", optimization: { steps: { min: 20, optimal: 28, max: 40 }, guidance: 7.5 } },
    "sdxl-lightning": { id: "sdxl-lightning", name: "SDXL Lightning ⚡", category: "stable-diffusion", confirmed: false, experimental: true, fallback: ["turbo", "flux"], description: "SDXL 極速版", optimization: { steps: { min: 4, optimal: 6, max: 10 }, guidance: 2.0 } }
  },

  PROVIDERS: {
    pollinations: {
      name: "Pollinations.ai",
      endpoint: "https://image.pollinations.ai",
      type: "direct",
      auth_mode: "free",
      requires_key: false,
      enabled: true,
      default: true,
      description: "完全免費的 AI 圖像生成服務",
      features: {
        private_mode: true,
        custom_size: true,
        seed_control: true,
        negative_prompt: true,
        enhance: true,
        nologo: true,
        style_presets: true,
        auto_hd: true,
        quality_modes: true,
        auto_translate: true
      }
    }
  },

  DEFAULT_PROVIDER: "pollinations",

  STYLE_PRESETS: {
    none: { name: "無 (使用原始提示詞)", prompt: "", negative: "" },
    "japanese-manga": { name: "日本漫畫 🇯🇵", prompt: "Japanese manga style, manga art, black and white manga, detailed linework, screentone, manga panel", negative: "photograph, realistic, 3d render, western comic" },
    "anime": { name: "動漫風格 ✨", prompt: "anime style, anime art, vibrant colors, anime character, detailed anime", negative: "realistic, photograph, 3d, ugly" },
    "vector": { name: "矢量圖 📐", prompt: "vector art, flat design, clean lines, minimalist, geometric shapes, vector illustration", negative: "photograph, realistic, textured, noisy" },
    "oil-painting": { name: "油畫 🎨", prompt: "oil painting, classical oil painting style, visible brushstrokes, rich colors, artistic", negative: "photograph, digital art, anime" },
    "watercolor": { name: "水彩畫 💧", prompt: "watercolor painting, soft colors, watercolor texture, artistic, hand-painted", negative: "photograph, digital, sharp edges" },
    "pixel-art": { name: "像素藝術 👾", prompt: "pixel art, 8-bit style, retro pixel graphics, pixelated", negative: "high resolution, smooth, realistic" },
    "cyberpunk": { name: "賽博朋克 🌃", prompt: "cyberpunk style, neon lights, futuristic, sci-fi, dystopian, high-tech low-life", negative: "natural, rustic, medieval" },
    "fantasy": { name: "奇幻風格 🐉", prompt: "fantasy art, magical, epic fantasy, detailed fantasy illustration", negative: "modern, realistic, mundane" },
    "photorealistic": { name: "寫實照片 📷", prompt: "photorealistic, ultra realistic, 8k uhd, professional photography, detailed, sharp focus", negative: "anime, cartoon, illustration, painting" },
    "studio-ghibli": { name: "吉卜力風格 🌿", prompt: "Studio Ghibli style, Ghibli art, Hayao Miyazaki style, whimsical, detailed background", negative: "dark, gritty, realistic" },
    "comic-book": { name: "美式漫畫 💥", prompt: "comic book style, American comic art, bold lines, vibrant colors, superhero comic", negative: "photograph, manga, realistic" },
    "sketch": { name: "素描 ✏️", prompt: "pencil sketch, hand-drawn, sketch art, graphite drawing, artistic sketch", negative: "colored, painted, digital" }
  },

  QUALITY_MODES: {
    economy: { name: "經濟模式", description: "快速出圖，適合測試", min_resolution: 1024, steps_multiplier: 0.85, guidance_multiplier: 0.9, hd_level: "basic" },
    standard: { name: "標準模式", description: "平衡質量與速度", min_resolution: 1280, steps_multiplier: 1.0, guidance_multiplier: 1.0, hd_level: "enhanced" },
    ultra: { name: "超高清模式", description: "極致質量，耗時較長", min_resolution: 1536, steps_multiplier: 1.35, guidance_multiplier: 1.15, hd_level: "maximum", force_upscale: true }
  },

  HD_PROMPTS: {
    basic: "high quality, detailed, sharp",
    enhanced: "high quality, extremely detailed, sharp focus, crisp, clear, professional, 8k uhd, masterpiece, fine details",
    maximum: "ultra high quality, extremely detailed, razor sharp focus, crystal clear, professional grade, 8k uhd resolution, masterpiece quality, fine details, intricate details, perfect clarity"
  },

  HD_NEGATIVE: "low quality, blurry, pixelated, low resolution, jpeg artifacts, compression artifacts, bad quality, distorted, noisy, grainy, poor details, soft focus, out of focus",

  PRESET_SIZES: {
    "square": { width: 1024, height: 1024, name: "方形 1:1" },
    "portrait": { width: 768, height: 1344, name: "豎屏 9:16" },
    "landscape": { width: 1344, height: 768, name: "橫屏 16:9" },
    "standard-portrait": { width: 768, height: 1024, name: "標準豎屏 3:4" },
    "standard-landscape": { width: 1024, height: 768, name: "標準橫屏 4:3" },
    "ultrawide": { width: 1536, height: 640, name: "超寬屏 21:9" },
    "ultrawide-portrait": { width: 640, height: 1536, name: "超豎屏 9:21" },
    "custom": { width: 1024, height: 1024, name: "自定義" }
  },

  FETCH_TIMEOUT: 60000,
  MAX_RETRIES: 3,
  HISTORY: { MAX_ITEMS: 100, STORAGE_KEY: "flux_ai_history" }
};

// 日誌系統
class StructuredLogger {
  constructor(requestId = null) {
    this.requestId = requestId || this.generateRequestId();
    this.logs = [];
    this.startTime = Date.now();
  }

  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  add(step, data = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      requestId: this.requestId,
      step,
      data,
      elapsed: Date.now() - this.startTime
    };
    
    this.logs.push(entry);
    console.log(`[${step}]`, JSON.stringify({ ...entry, data }));
  }

  info(message, data = {}) { this.add(`ℹ️ ${message}`, data); }
  success(message, data = {}) { this.add(`✅ ${message}`, data); }
  error(message, error = null) { this.add(`❌ ${message}`, { error: error?.message, stack: error?.stack?.split('\n').slice(0, 3) }); }
  warn(message, data = {}) { this.add(`⚠️ ${message}`, data); }
  get() { return this.logs; }
  getSummary() { return { requestId: this.requestId, totalTime: Date.now() - this.startTime, steps: this.logs.length, errors: this.logs.filter(log => log.step.includes('❌')).length }; }
}

// 性能監控
class PerformanceMonitor {
  static startTimer(name, logger = null) {
    return {
      name, start: Date.now(), logger,
      end() {
        const duration = Date.now() - this.start;
        const message = `${this.name}: ${duration}ms`;
        if (this.logger) { this.logger.add(`⏱️ ${message}`); } else { console.log(`⏱️ ${message}`); }
        return duration;
      }
    };
  }
}

// 參數驗證
class ParameterValidator {
  static validateImageOptions(options) {
    const errors = [];
    if (!options.width || options.width < 256 || options.width > 2048) errors.push("寬度必須在 256-2048 之間");
    if (!options.height || options.height < 256 || options.height > 2048) errors.push("高度必須在 256-2048 之間");
    if (options.model && !CONFIG.MODELS[options.model]) errors.push(`不支持的模型: ${options.model}`);
    if (options.style && !CONFIG.STYLE_PRESETS[options.style]) errors.push(`不支持的風格: ${options.style}`);
    if (options.qualityMode && !CONFIG.QUALITY_MODES[options.qualityMode]) errors.push(`不支持的質量模式: ${options.qualityMode}`);
    if (options.numOutputs && (options.numOutputs < 1 || options.numOutputs > 4)) errors.push("生成數量必須在 1-4 之間");
    if (errors.length > 0) throw new Error(`參數驗證失敗: ${errors.join(", ")}`);
    return true;
  }

  static sanitizePrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') throw new Error("提示詞不能為空");
    return prompt.trim().substring(0, 2000);
  }
}

// HTTP 工具
class HttpUtils {
  static async fetchWithTimeout(url, options = {}, timeout = CONFIG.FETCH_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') throw new Error(`請求超時 (${timeout}ms)`);
      throw error;
    }
  }

  static getCORSHeaders(additionalHeaders = {}) {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
      ...additionalHeaders
    };
  }

  static createJSONResponse(data, status = 200, additionalHeaders = {}) {
    return new Response(JSON.stringify(data), {
      status,
      headers: this.getCORSHeaders({ 'Content-Type': 'application/json', ...additionalHeaders })
    });
  }

  static createErrorResponse(message, status = 500, details = {}) {
    return this.createJSONResponse({
      error: { message, type: 'api_error', timestamp: new Date().toISOString(), ...details }
    }, status);
  }
}

// 翻譯服務
async function translateToEnglish(text, env) {
  try {
    const hasChinese = /[\u4e00-\u9fa5]/.test(text);
    if (!hasChinese) return { text: text, translated: false };

    if (env?.AI) {
      const response = await env.AI.run("@cf/meta/m2m100-1.2b", {
        text: text, source_lang: "chinese", target_lang: "english"
      });
      return { text: response.translated_text || text, translated: true, original: text };
    }

    return { text: text, translated: false };
  } catch (e) {
    console.error("Translation error:", e);
    return { text: text, translated: false, error: e.message };
  }
}

// 提示詞分析
class PromptAnalyzer {
  static analyzeComplexity(prompt) {
    const complexKeywords = ['detailed', 'intricate', 'complex', 'elaborate', 'realistic', 'photorealistic', 'hyperrealistic', 'architecture', 'cityscape', 'landscape', 'portrait', 'face', 'eyes', 'hair', 'texture', 'material', 'fabric', 'skin', 'lighting', 'shadows', 'reflections', 'fine details', 'high detail', 'ultra detailed'];
    
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
    const modelConfig = CONFIG.MODELS[model];
    
    if (modelConfig?.category === 'gemini' && model.includes('pro')) return 'ultra';
    if (complexity > 0.7) return 'ultra';
    if (complexity > 0.4) return 'standard';
    return 'economy';
  }
}

// HD 優化器
class HDOptimizer {
  static optimize(prompt, negativePrompt, model, width, height, qualityMode = 'standard', autoHD = true) {
    if (!autoHD) return { prompt: prompt, negativePrompt: negativePrompt, width: width, height: height, optimized: false };

    const modeConfig = CONFIG.QUALITY_MODES[qualityMode];
    const optimizations = [];

    let enhancedPrompt = prompt;
    let enhancedNegative = negativePrompt || "";
    let finalWidth = width;
    let finalHeight = height;

    if (modeConfig?.hd_level && CONFIG.HD_PROMPTS[modeConfig.hd_level]) {
      const hdBoost = CONFIG.HD_PROMPTS[modeConfig.hd_level];
      enhancedPrompt = `${prompt}, ${hdBoost}`;
      optimizations.push(`HD增強: ${modeConfig.hd_level}`);
    }

    if (qualityMode !== 'economy') {
      enhancedNegative = enhancedNegative ? `${enhancedNegative}, ${CONFIG.HD_NEGATIVE}` : CONFIG.HD_NEGATIVE;
      optimizations.push("負面提示詞: 高清過濾");
    }

    const minRes = modeConfig?.min_resolution || 1024;
    const currentRes = Math.min(width, height);
    let sizeUpscaled = false;

    if (currentRes < minRes || modeConfig?.force_upscale) {
      const scale = minRes / currentRes;
      finalWidth = Math.min(Math.round(width * scale / 64) * 64, 2048);
      finalHeight = Math.min(Math.round(height * scale / 64) * 64, 2048);
      sizeUpscaled = true;
      optimizations.push(`尺寸優化: ${width}x${height} → ${finalWidth}x${finalHeight}`);
    }

    return {
      prompt: enhancedPrompt, negativePrompt: enhancedNegative, width: finalWidth, height: finalHeight,
      optimized: true, quality_mode: qualityMode, hd_level: modeConfig?.hd_level,
      optimizations: optimizations, size_upscaled: sizeUpscaled
    };
  }
}

// 參數優化器
class ParameterOptimizer {
  static optimizeSteps(model, width, height, style = 'none', qualityMode = 'standard', userSteps = null) {
    if (userSteps !== null && userSteps !== -1) {
      const suggestion = this.calculateOptimalSteps(model, width, height, style, qualityMode);
      return { steps: userSteps, optimized: false, suggested: suggestion.steps, reasoning: suggestion.reasoning, user_override: true };
    }
    return this.calculateOptimalSteps(model, width, height, style, qualityMode);
  }

  static calculateOptimalSteps(model, width, height, style, qualityMode) {
    const modelConfig = CONFIG.MODELS[model];
    const modeConfig = CONFIG.QUALITY_MODES[qualityMode];
    
    if (!modelConfig?.optimization) return { steps: 20, optimized: false, reasoning: "使用默認步數" };

    const baseSteps = modelConfig.optimization.steps.optimal;
    const reasoning = [`${model}: ${baseSteps}步`];

    const totalPixels = width * height;
    let sizeMultiplier = 1.0;
    
    if (totalPixels <= 512 * 512) {
      sizeMultiplier = 0.8;
    } else if (totalPixels >= 1536 * 1536) {
      sizeMultiplier = 1.15;
      reasoning.push(`大尺寸 x${sizeMultiplier}`);
    } else if (totalPixels >= 2048 * 2048) {
      sizeMultiplier = 1.3;
      reasoning.push(`超大 x${sizeMultiplier}`);
    }

    const qualityMultiplier = modeConfig?.steps_multiplier || 1.0;
    if (qualityMultiplier !== 1.0) reasoning.push(`${modeConfig.name} x${qualityMultiplier}`);

    const styleMultipliers = { "photorealistic": 1.1, "oil-painting": 1.05, "watercolor": 0.95, "pixel-art": 0.85, "sketch": 0.9, "vector": 0.85 };
    const styleMultiplier = styleMultipliers[style] || 1.0;

    let optimizedSteps = Math.round(baseSteps * sizeMultiplier * qualityMultiplier * styleMultiplier);
    
    const minSteps = modelConfig.optimization.steps.min;
    const maxSteps = modelConfig.optimization.steps.max;
    optimizedSteps = Math.max(minSteps, Math.min(optimizedSteps, maxSteps));

    reasoning.push(`→ ${optimizedSteps}步`);

    return { steps: optimizedSteps, optimized: true, reasoning: reasoning.join(' ') };
  }

  static optimizeGuidance(model, style, qualityMode = 'standard') {
    const modelConfig = CONFIG.MODELS[model];
    const modeConfig = CONFIG.QUALITY_MODES[qualityMode];
    
    let baseGuidance = modelConfig?.optimization?.guidance || 7.5;
    
    if (model.includes('turbo') || model.includes('lightning')) {
      baseGuidance = style === 'photorealistic' ? 3.0 : 2.5;
    } else if (style === 'photorealistic') {
      baseGuidance = 8.5;
    } else if (['oil-painting', 'watercolor', 'sketch'].includes(style)) {
      baseGuidance = 6.5;
    }

    const qualityBoost = modeConfig?.guidance_multiplier || 1.0;
    return Math.round(baseGuidance * qualityBoost * 10) / 10;
  }
}

// 風格處理器
class StyleProcessor {
  static applyStyle(prompt, style, negativePrompt) {
    const styleConfig = CONFIG.STYLE_PRESETS[style];
    
    if (!styleConfig || style === 'none') {
      return { enhancedPrompt: prompt, enhancedNegative: negativePrompt };
    }

    let enhancedPrompt = prompt;
    if (styleConfig.prompt) enhancedPrompt = `${prompt}, ${styleConfig.prompt}`;

    let enhancedNegative = negativePrompt || "";
    if (styleConfig.negative) {
      enhancedNegative = enhancedNegative ? `${enhancedNegative}, ${styleConfig.negative}` : styleConfig.negative;
    }

    return { enhancedPrompt, enhancedNegative };
  }
}

// Pollinations 提供商
class PollinationsProvider {
  constructor(config, env) {
    this.config = config;
    this.env = env;
    this.name = config.name;
  }

  async generate(prompt, options, logger) {
    try {
      ParameterValidator.validateImageOptions(options);
      
      const complexity = PromptAnalyzer.analyzeComplexity(prompt);
      const recommendedQuality = PromptAnalyzer.recommendQualityMode(prompt, options.model);
      
      logger.add("🧠 Prompt Analysis", {
        complexity: (complexity * 100).toFixed(1) + '%',
        recommended_quality: recommendedQuality,
        selected_quality: options.qualityMode
      });

      let finalPrompt = prompt;
      let finalNegativePrompt = options.negativePrompt;
      let finalWidth = options.width;
      let finalHeight = options.height;
      let finalSteps = options.steps;
      let finalGuidance = options.guidance;

      if (options.autoHD) {
        const hdResult = HDOptimizer.optimize(prompt, options.negativePrompt, options.model, options.width, options.height, options.qualityMode, options.autoHD);
        finalPrompt = hdResult.prompt;
        finalNegativePrompt = hdResult.negativePrompt;
        finalWidth = hdResult.width;
        finalHeight = hdResult.height;
        
        if (hdResult.optimized) {
          logger.add("🎨 HD Optimization", {
            mode: options.qualityMode, hd_level: hdResult.hd_level,
            original: `${options.width}x${options.height}`, optimized: `${hdResult.width}x${hdResult.height}`,
            upscaled: hdResult.size_upscaled, details: hdResult.optimizations
          });
        }
      }

      if (options.autoOptimize) {
        const stepsResult = ParameterOptimizer.optimizeSteps(options.model, finalWidth, finalHeight, options.style, options.qualityMode, options.steps);
        finalSteps = stepsResult.steps;
        logger.add("🎯 Steps Optimization", { steps: stepsResult.steps, reasoning: stepsResult.reasoning });

        if (options.guidance === null) {
          finalGuidance = ParameterOptimizer.optimizeGuidance(options.model, options.style, options.qualityMode);
        }
      } else {
        finalSteps = options.steps || 20;
        finalGuidance = options.guidance || 7.5;
      }

      const { enhancedPrompt, enhancedNegative } = StyleProcessor.applyStyle(finalPrompt, options.style, finalNegativePrompt);
      const translation = await translateToEnglish(enhancedPrompt, this.env);
      const finalPromptForAPI = translation.text;

      if (translation.translated) {
        logger.add("🌐 Auto Translation", {
          original_zh: translation.original,
          translated_en: finalPromptForAPI,
          success: true
        });
      }

      const modelConfig = CONFIG.MODELS[options.model];
      const modelsToTry = [options.model];
      if (modelConfig?.experimental && modelConfig?.fallback) {
        modelsToTry.push(...modelConfig.fallback);
      }

      logger.add("🎨 Generation Config", {
        provider: this.name, model: options.model, dimensions: `${finalWidth}x${finalHeight}`,
        quality_mode: options.qualityMode, hd_optimized: options.autoHD,
        auto_translated: translation.translated, steps: finalSteps, guidance: finalGuidance
      });

      const currentSeed = options.seed === -1 ? Math.floor(Math.random() * 1000000) : options.seed;
      let fullPrompt = finalPromptForAPI;
      if (enhancedNegative && enhancedNegative.trim()) {
        fullPrompt = `${finalPromptForAPI} [negative: ${enhancedNegative}]`;
      }

      for (const tryModel of modelsToTry) {
        for (let retry = 0; retry < CONFIG.MAX_RETRIES; retry++) {
          try {
            const encodedPrompt = encodeURIComponent(fullPrompt);
            let url = `${this.config.endpoint}/prompt/${encodedPrompt}`;
            
            const params = new URLSearchParams({
              model: tryModel,
              width: finalWidth.toString(),
              height: finalHeight.toString(),
              seed: currentSeed.toString(),
              nologo: (options.nologo !== false).toString(),
              enhance: (options.enhance === true).toString(),
              private: (options.privateMode !== false).toString()
            });

            if (finalGuidance && finalGuidance !== 7.5) params.append('guidance', finalGuidance.toString());
            if (finalSteps && finalSteps !== 20) params.append('steps', finalSteps.toString());

            url += '?' + params.toString();

            const response = await HttpUtils.fetchWithTimeout(url, {
              method: 'GET',
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'image/*,*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Referer': 'https://pollinations.ai/'
              }
            }, 45000);

            if (response.ok) {
              const contentType = response.headers.get('content-type');
              if (contentType && contentType.startsWith('image/')) {
                logger.add("✅ Success", {
                  url: response.url, used_model: tryModel, final_size: `${finalWidth}x${finalHeight}`,
                  quality_mode: options.qualityMode, seed: currentSeed
                });

                return {
                  url: response.url, provider: this.name, model: tryModel, requested_model: options.model,
                  seed: currentSeed, style: options.style, steps: finalSteps, guidance: finalGuidance,
                  width: finalWidth, height: finalHeight, quality_mode: options.qualityMode,
                  prompt_complexity: complexity, hd_optimized: options.autoHD,
                  auto_translated: translation.translated, cost: "FREE",
                  fallback_used: tryModel !== options.model, auto_optimized: options.autoOptimize
                };
              } else {
                throw new Error(`Invalid content type: ${contentType}`);
              }
            } else {
              throw new Error(`HTTP ${response.status}`);
            }
          } catch (e) {
            if (retry < CONFIG.MAX_RETRIES - 1) {
              await new Promise(resolve => setTimeout(resolve, 1000 * (retry + 1)));
            }
          }
        }
      }

      throw new Error("All models failed");
    } catch (error) {
      logger.error("生成失敗", error);
      throw error;
    }
  }
}

// 多提供商路由器
class MultiProviderRouter {
  constructor(apiKeys = {}, env = null) {
    this.providers = {};
    this.apiKeys = apiKeys;
    this.env = env;
    
    for (const [key, config] of Object.entries(CONFIG.PROVIDERS)) {
      if (config.enabled) {
        if (key === 'pollinations') {
          this.providers[key] = new PollinationsProvider(config, env);
        }
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
    
    logger.info("Router initialized", { provider: providerName, outputs: numOutputs });

    const results = [];
    
    for (let i = 0; i < numOutputs; i++) {
      const currentOptions = { ...options, seed: options.seed === -1 ? -1 : options.seed + i };
      const result = await provider.generate(prompt, currentOptions, logger);
      results.push(result);
    }

    return results;
  }
}

// 處理器
async function handleImageGenerations(request, env) {
  const logger = new StructuredLogger();
  
  try {
    const body = await request.json();
    logger.info("Request received", { 
      prompt_length: body.prompt?.length, model: body.model,
      size: body.size || `${body.width}x${body.height}`
    });

    const prompt = ParameterValidator.sanitizePrompt(body.prompt);
    
    let width = 1024, height = 1024;
    if (body.size) {
      const [w, h] = body.size.split('x').map(Number);
      if (w && h) { width = w; height = h; }
    }
    if (body.width) width = body.width;
    if (body.height) height = body.height;

    const options = {
      provider: body.provider || null, model: body.model || "flux",
      width: Math.min(Math.max(width, 256), 2048), height: Math.min(Math.max(height, 256), 2048),
      numOutputs: Math.min(Math.max(body.n || 1, 1), 4), seed: body.seed !== undefined ? body.seed : -1,
      negativePrompt: body.negative_prompt || "", guidance: body.guidance_scale || null,
      steps: body.steps || null, enhance: body.enhance === true, nologo: body.nologo !== false,
      privateMode: body.private !== false, style: body.style || "none",
      autoOptimize: body.auto_optimize !== false, autoHD: body.auto_hd !== false,
      qualityMode: body.quality_mode || 'standard'
    };

    const router = new MultiProviderRouter({}, env);
    const results = await router.generate(prompt, options, logger);
    
    logger.success("Request completed", { results_count: results.length });

    return HttpUtils.createJSONResponse({
      created: Math.floor(Date.now() / 1000),
      data: results.map(r => ({
        url: r.url, provider: r.provider, model: r.model, seed: r.seed,
        width: r.width, height: r.height, style: r.style, quality_mode: r.quality_mode,
        prompt_complexity: r.prompt_complexity, steps: r.steps, guidance: r.guidance,
        auto_optimized: r.auto_optimized, hd_optimized: r.hd_optimized,
        auto_translated: r.auto_translated, cost: r.cost
      }))
    });

  } catch (error) {
    logger.error("Request failed", error);
    return HttpUtils.createErrorResponse(error.message, 500, { debug_logs: logger.get() });
  }
}

async function handleChatCompletions(request, env) {
  const logger = new StructuredLogger();
  
  try {
    const body = await request.json();
    const isWebUI = body.is_web_ui === true;
    
    const messages = body.messages || [];
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg) throw new Error("No messages found");

    let prompt = "";
    if (typeof lastMsg.content === 'string') {
      prompt = lastMsg.content;
    } else if (Array.isArray(lastMsg.content)) {
      for (const part of lastMsg.content) {
        if (part.type === 'text') prompt += part.text + " ";
      }
    }

    prompt = ParameterValidator.sanitizePrompt(prompt);

    const options = {
      provider: body.provider || null, model: body.model || "flux",
      width: body.width || 1024, height: body.height || 1024,
      numOutputs: Math.min(Math.max(body.n || 1, 1), 4), seed: body.seed !== undefined ? body.seed : -1,
      negativePrompt: body.negative_prompt || "", guidance: body.guidance_scale || null,
      steps: body.steps || null, enhance: body.enhance === true, nologo: body.nologo !== false,
      privateMode: body.private !== false, style: body.style || "none",
      autoOptimize: body.auto_optimize !== false, autoHD: body.auto_hd !== false,
      qualityMode: body.quality_mode || 'standard'
    };

    const router = new MultiProviderRouter({}, env);
    const results = await router.generate(prompt, options, logger);

    let respContent = "";
    results.forEach((result, index) => {
      respContent += `![Generated Image ${index + 1}](${result.url})\n`;
    });

    const respId = `chatcmpl-${crypto.randomUUID()}`;

    if (body.stream) {
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const encoder = new TextEncoder();

      (async () => {
        try {
          if (isWebUI) {
            await writer.write(encoder.encode(`data: ${JSON.stringify({ debug: logger.get() })}\n\n`));
          }

          const chunk = {
            id: respId, object: 'chat.completion.chunk', created: Math.floor(Date.now() / 1000),
            model: options.model, choices: [{ index: 0, delta: { content: respContent }, finish_reason: null }]
          };
          
          await writer.write(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));

          const endChunk = {
            id: respId, object: 'chat.completion.chunk', created: Math.floor(Date.now() / 1000),
            model: options.model, choices: [{ index: 0, delta: {}, finish_reason: 'stop' }]
          };
          
          await writer.write(encoder.encode(`data: ${JSON.stringify(endChunk)}\n\n`));
          await writer.write(encoder.encode('data: [DONE]\n\n'));
          
        } finally {
          await writer.close();
        }
      })();

      return new Response(readable, {
        headers: HttpUtils.getCORSHeaders({ 'Content-Type': 'text/event-stream' })
      });
    } else {
      return HttpUtils.createJSONResponse({
        id: respId, object: "chat.completion", created: Math.floor(Date.now() / 1000),
        model: options.model, choices: [{
          index: 0, message: { role: "assistant", content: respContent }, finish_reason: "stop"
        }]
      });
    }

  } catch (error) {
    logger.error("Chat completion failed", error);
    return HttpUtils.createErrorResponse(error.message, 500, { debug_logs: logger.get() });
  }
}

function handleModelsRequest() {
  const models = [];
  
  for (const [providerKey, providerConfig] of Object.entries(CONFIG.PROVIDERS)) {
    if (providerConfig.enabled) {
      for (const [modelId, modelConfig] of Object.entries(CONFIG.MODELS)) {
        models.push({
          id: modelConfig.id, object: 'model', name: modelConfig.name,
          provider: providerKey, category: modelConfig.category,
          confirmed: modelConfig.confirmed || false, experimental: modelConfig.experimental || false,
          description: modelConfig.description
        });
      }
    }
  }

  return HttpUtils.createJSONResponse({ object: 'list', data: models, total: models.length });
}

function handleProvidersRequest() {
  const providers = {};
  
  for (const [key, config] of Object.entries(CONFIG.PROVIDERS)) {
    providers[key] = {
      name: config.name, endpoint: config.endpoint, auth_mode: config.auth_mode,
      enabled: config.enabled, features: config.features
    };
  }

  return HttpUtils.createJSONResponse({ object: 'list', data: providers });
}

function handleStylesRequest() {
  const styles = Object.entries(CONFIG.STYLE_PRESETS).map(([key, value]) => ({
    id: key, name: value.name, prompt_addition: value.prompt, negative_addition: value.negative
  }));

  return HttpUtils.createJSONResponse({ object: 'list', data: styles });
}

function handleUI() {
  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flux AI Pro v${CONFIG.PROJECT_VERSION}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%); color: #fff; padding: 20px; min-height: 100vh; }
        .container { max-width: 1400px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
        h1 { color: #f59e0b; margin: 0; font-size: 36px; font-weight: 800; text-shadow: 0 0 30px rgba(245, 158, 11, 0.6); }
        .badge { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 6px 14px; border-radius: 20px; font-size: 14px; margin-left: 10px; }
        .subtitle { color: #9ca3af; margin-top: 8px; font-size: 15px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
        .box { background: rgba(26, 26, 26, 0.95); padding: 24px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); }
        h3 { color: #f59e0b; margin-bottom: 18px; font-size: 18px; font-weight: 700; }
        label { display: block; margin: 16px 0 8px 0; color: #e5e7eb; font-weight: 600; font-size: 13px; }
        select, textarea, input { width: 100%; padding: 12px; margin: 0; background: #2a2a2a; border: 1px solid #444; color: #fff; border-radius: 10px; font-size: 14px; font-family: inherit; transition: all 0.3s; }
        select:focus, textarea:focus, input:focus { outline: none; border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15); }
        textarea { resize: vertical; min-height: 90px; }
        button { width: 100%; padding: 16px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #fff; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; margin-top: 20px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4); }
        button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(245, 158, 11, 0.6); }
        button:disabled { background: #555; cursor: not-allowed; transform: none; box-shadow: none; }
        #result { margin-top: 20px; }
        .success { background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; padding: 16px; border-radius: 12px; color: #10b981; }
        .error { background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; padding: 16px; border-radius: 12px; color: #ef4444; }
        .timer { margin-top: 10px; font-size: 16px; font-weight: 600; color: #10b981; animation: pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        .result-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
        .result img { width: 100%; border-radius: 12px; cursor: pointer; transition: transform 0.3s; }
        .result img:hover { transform: scale(1.02); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h1>🎨 Flux AI Pro<span class="badge">v${CONFIG.PROJECT_VERSION}</span></h1>
                <p class="subtitle">19個模型 · 12種風格 · 3檔質量 · 智能HD優化 · 🍌 Nano Banana · 性能監控</p>
            </div>
        </div>
        
        <div class="grid">
            <div class="box">
                <h3>📝 生成設置</h3>
                <label>提示詞 *</label>
                <textarea id="prompt" placeholder="Describe your image..."></textarea>
                
                <label>負面提示詞</label>
                <textarea id="negativePrompt" placeholder="low quality, blurry, distorted"></textarea>
                
                <label>AI 模型</label>
                <select id="model">
                    ${Object.entries(CONFIG.MODELS).map(([id, model]) => 
                        `<option value="${id}">${model.name}</option>`
                    ).join('')}
                </select>
                
                <label>藝術風格</label>
                <select id="style">
                    ${Object.entries(CONFIG.STYLE_PRESETS).map(([k, v]) => 
                        `<option value="${k}">${v.name}</option>`
                    ).join('')}
                </select>
                
                <label>質量模式</label>
                <select id="qualityMode">
                    ${Object.entries(CONFIG.QUALITY_MODES).map(([k, v]) => 
                        `<option value="${k}">${v.name} - ${v.description}</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="box">
                <h3>🎨 圖像參數</h3>
                <label>尺寸預設</label>
                <select id="sizePreset">
                    ${Object.entries(CONFIG.PRESET_SIZES).map(([k, v]) => 
                        `<option value="${k}" ${k === 'square' ? 'selected' : ''}>${v.name} (${v.width}x${v.height})</option>`
                    ).join('')}
                </select>
                
                <label>寬度: <span id="widthValue">1024</span>px</label>
                <input type="range" id="width" min="256" max="2048" step="64" value="1024">
                
                <label>高度: <span id="heightValue">1024</span>px</label>
                <input type="range" id="height" min="256" max="2048" step="64" value="1024">
                
                <label>生成數量</label>
                <select id="numOutputs">
                    <option value="1" selected>1 張</option>
                    <option value="2">2 張</option>
                    <option value="3">3 張</option>
                    <option value="4">4 張</option>
                </select>
                
                <label>隨機種子 (-1 = 隨機)</label>
                <input type="number" id="seed" value="-1" min="-1" max="1000000">
                
                <button onclick="generate()">🚀 開始生成</button>
            </div>
        </div>
        
        <div id="result"></div>
    </div>
    
    <script>
        let generationTimer = null;
        let startTime = 0;
        
        function updateTimer() {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            const resultDiv = document.getElementById('result');
            const timerElement = resultDiv.querySelector('.timer');
            if (timerElement) {
                timerElement.textContent = \`⏱️ 已耗時: \${elapsed} 秒\`;
            }
        }
        
        const widthSlider = document.getElementById('width');
        const heightSlider = document.getElementById('height');
        const widthValue = document.getElementById('widthValue');
        const heightValue = document.getElementById('heightValue');
        const sizePreset = document.getElementById('sizePreset');
        
        widthSlider.oninput = () => widthValue.textContent = widthSlider.value;
        heightSlider.oninput = () => heightValue.textContent = heightSlider.value;
        
        sizePreset.onchange = () => {
            const preset = ${JSON.stringify(CONFIG.PRESET_SIZES)}[sizePreset.value];
            if (preset && sizePreset.value !== 'custom') {
                widthSlider.value = preset.width;
                heightSlider.value = preset.height;
                widthValue.textContent = preset.width;
                heightValue.textContent = preset.height;
            }
        };
        
        async function generate() {
            const prompt = document.getElementById('prompt').value.trim();
            if (!prompt) {
                alert('請輸入提示詞');
                return;
            }
            
            const resultDiv = document.getElementById('result');
            const button = document.querySelector('button[onclick="generate()"]');
            
            button.disabled = true;
            button.textContent = '生成中...';
            startTime = Date.now();
            
            resultDiv.innerHTML = '<div class="success"><strong>⏳ 正在生成圖像，請稍候...</strong><div class="timer">⏱️ 已耗時: 0.0 秒</div></div>';
            generationTimer = setInterval(updateTimer, 100);
            
            const params = {
                prompt: prompt,
                negative_prompt: document.getElementById('negativePrompt').value,
                model: document.getElementById('model').value,
                style: document.getElementById('style').value,
                width: parseInt(widthSlider.value),
                height: parseInt(heightSlider.value),
                n: parseInt(document.getElementById('numOutputs').value),
                seed: parseInt(document.getElementById('seed').value),
                quality_mode: document.getElementById('qualityMode').value,
                auto_optimize: true,
                auto_hd: true
            };
            
            try {
                const response = await fetch('/v1/images/generations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(params)
                });
                
                const data = await response.json();
                
                if (!response.ok) throw new Error(data.error?.message || '生成失敗');
                
                clearInterval(generationTimer);
                const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
                
                resultDiv.innerHTML = \`<div class="success"><strong>✅ 生成成功!</strong> <span style="color:#10b981;font-weight:600">總耗時: \${totalTime} 秒</span></div>\`;
                resultDiv.innerHTML += '<div class="result-grid">';
                
                data.data.forEach((item, index) => {
                    resultDiv.innerHTML += \`<div class="result"><img src="\${item.url}" alt="Generated \${index+1}" onclick="window.open('\${item.url}')"><p style="margin-top:12px;font-size:13px;color:#9ca3af">\${item.model} | \${item.width}x\${item.height} | \${item.quality_mode}\${item.auto_translated?' | 🌐 已翻譯':''}</p></div>\`;
                });
                
                resultDiv.innerHTML += '</div>';
                
            } catch (error) {
                clearInterval(generationTimer);
                resultDiv.innerHTML = \`<div class="error"><strong>❌ 錯誤</strong><p style="margin-top:12px">\${error.message}</p></div>\`;
            } finally {
                button.disabled = false;
                button.textContent = '🚀 開始生成';
            }
        }
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: HttpUtils.getCORSHeaders({ 'Content-Type': 'text/html; charset=utf-8' })
  });
}

// 主入口
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: HttpUtils.getCORSHeaders() });
    }

    try {
      if (url.pathname === '/') {
        return handleUI();
      } else if (url.pathname === '/v1/chat/completions') {
        return handleChatCompletions(request, env);
      } else if (url.pathname === '/v1/images/generations') {
        return handleImageGenerations(request, env);
      } else if (url.pathname === '/v1/models') {
        return handleModelsRequest();
      } else if (url.pathname === '/v1/providers') {
        return handleProvidersRequest();
      } else if (url.pathname === '/v1/styles') {
        return handleStylesRequest();
      } else if (url.pathname === '/health') {
        return HttpUtils.createJSONResponse({
          status: 'ok', version: CONFIG.PROJECT_VERSION, timestamp: new Date().toISOString(),
          features: ['19 Models', '12 Styles', '3 Quality Modes', 'Smart Analysis', 'Auto HD', 'History', 'Auto Chinese Translation', 'Nano Banana Models', 'Real-time Timer', 'Performance Monitoring']
        });
      } else {
        return HttpUtils.createJSONResponse({
          project: CONFIG.PROJECT_NAME, version: CONFIG.PROJECT_VERSION,
          features: ['19 Models', '12 Styles', '3 Quality Modes', 'Smart Analysis', 'Auto HD', 'History', 'Auto Chinese Translation', 'Nano Banana Models', 'Real-time Timer', 'Performance Monitoring'],
          endpoints: ['/v1/images/generations', '/v1/chat/completions', '/v1/models', '/v1/providers', '/v1/styles', '/health']
        });
      }
    } catch (error) {
      console.error('Worker error:', error);
      return HttpUtils.createErrorResponse(error.message, 500);
    }
  }
};
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }
    try {
      if (url.pathname === '/') {
        return handleUI(request);
      } else if (url.pathname === '/v1/chat/completions') {
        return handleChatCompletions(request, env);
      } else if (url.pathname === '/v1/images/generations') {
        return handleImageGenerations(request, env);
      } else if (url.pathname === '/v1/models') {
        return handleModelsRequest();
      } else if (url.pathname === '/v1/providers') {
        return handleProvidersRequest();
      } else if (url.pathname === '/v1/styles') {
        return handleStylesRequest();
      } else if (url.pathname === '/health') {
        return new Response(JSON.stringify({ status: 'ok', version: CONFIG.PROJECT_VERSION, timestamp: new Date().toISOString() }), { headers: corsHeaders({ 'Content-Type': 'application/json' }) });
      } else {
        return new Response(JSON.stringify({ project: CONFIG.PROJECT_NAME, version: CONFIG.PROJECT_VERSION, features: ['19 Models', '12 Styles', '3 Quality Modes', 'Smart Analysis', 'Auto HD', 'History', 'Auto Chinese Translation', 'Nano Banana Enhanced', 'Real-time Timer'], endpoints: ['/v1/images/generations', '/v1/chat/completions', '/v1/models', '/v1/providers', '/v1/styles', '/health'] }), { headers: corsHeaders({ 'Content-Type': 'application/json' }) });
      }
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: { message: error.message, type: 'worker_error' } }), { status: 500, headers: corsHeaders({ 'Content-Type': 'application/json' }) });
    }
  }
};

async function handleChatCompletions(request, env) {
    const logger = new Logger();
    try {
        const body = await request.json();
        const isWebUI = body.is_web_ui === true;
        const messages = body.messages || [];
        const lastMsg = messages[messages.length - 1];
        if (!lastMsg) throw new Error("No messages found");
        let prompt = "";
        if (typeof lastMsg.content === 'string') {
            prompt = lastMsg.content;
        } else if (Array.isArray(lastMsg.content)) {
            for (const part of lastMsg.content) {
                if (part.type === 'text') prompt += part.text + " ";
            }
        }
        prompt = prompt.trim();
        if (!prompt) throw new Error("Empty prompt");
        const options = { provider: body.provider || null, model: body.model || "flux", width: body.width || 1024, height: body.height || 1024, numOutputs: Math.min(Math.max(body.n || 1, 1), 4), seed: body.seed !== undefined ? body.seed : -1, negativePrompt: body.negative_prompt || "", guidance: body.guidance_scale || null, steps: body.steps || null, enhance: body.enhance === true, nologo: body.nologo !== false, privateMode: body.private !== false, style: body.style || "none", autoOptimize: body.auto_optimize !== false, autoHD: body.auto_hd !== false, qualityMode: body.quality_mode || 'standard' };
        const router = new MultiProviderRouter({}, env);
        const results = await router.generate(prompt, options, logger);
        let respContent = "";
        results.forEach((result, index) => { respContent += `![Generated Image ${index + 1}](${result.url})\n`; });
        const respId = `chatcmpl-${crypto.randomUUID()}`;
        if (body.stream) {
            const { readable, writable } = new TransformStream();
            const writer = writable.getWriter();
            const encoder = new TextEncoder();
            (async () => {
                try {
                    if (isWebUI) await writer.write(encoder.encode(`data: ${JSON.stringify({ debug: logger.get() })}\n\n`));
                    const chunk = { id: respId, object: 'chat.completion.chunk', created: Math.floor(Date.now()/1000), model: options.model, choices: [{ index: 0, delta: { content: respContent }, finish_reason: null }] };
                    await writer.write(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
                    const endChunk = { id: respId, object: 'chat.completion.chunk', created: Math.floor(Date.now()/1000), model: options.model, choices: [{ index: 0, delta: {}, finish_reason: 'stop' }] };
                    await writer.write(encoder.encode(`data: ${JSON.stringify(endChunk)}\n\n`));
                    await writer.write(encoder.encode('data: [DONE]\n\n'));
                } finally {
                    await writer.close();
                }
            })();
            return new Response(readable, { headers: corsHeaders({ 'Content-Type': 'text/event-stream' }) });
        } else {
            return new Response(JSON.stringify({ id: respId, object: "chat.completion", created: Math.floor(Date.now() / 1000), model: options.model, choices: [{ index: 0, message: { role: "assistant", content: respContent }, finish_reason: "stop" }] }), { headers: corsHeaders({ 'Content-Type': 'application/json' }) });
        }
    } catch (e) {
        logger.add("❌ Error", e.message);
        return new Response(JSON.stringify({ error: { message: e.message, debug_logs: logger.get() } }), { status: 500, headers: corsHeaders({ 'Content-Type': 'application/json' }) });
    }
}

async function handleImageGenerations(request, env) {
    const logger = new Logger();
    try {
        const body = await request.json();
        const prompt = body.prompt;
        if (!prompt || !prompt.trim()) throw new Error("Prompt is required");
        let width = 1024, height = 1024;
        if (body.size) {
            const [w, h] = body.size.split('x').map(Number);
            if (w && h) { width = w; height = h; }
        }
        if (body.width) width = body.width;
        if (body.height) height = body.height;
        const options = { provider: body.provider || null, model: body.model || "flux", width: Math.min(Math.max(width, 256), 2048), height: Math.min(Math.max(height, 256), 2048), numOutputs: Math.min(Math.max(body.n || 1, 1), 4), seed: body.seed !== undefined ? body.seed : -1, negativePrompt: body.negative_prompt || "", guidance: body.guidance_scale || null, steps: body.steps || null, enhance: body.enhance === true, nologo: body.nologo !== false, privateMode: body.private !== false, style: body.style || "none", autoOptimize: body.auto_optimize !== false, autoHD: body.auto_hd !== false, qualityMode: body.quality_mode || 'standard' };
        const router = new MultiProviderRouter({}, env);
        const results = await router.generate(prompt, options, logger);
        return new Response(JSON.stringify({ created: Math.floor(Date.now() / 1000), data: results.map(r => ({ url: r.url, provider: r.provider, model: r.model, seed: r.seed, width: r.width, height: r.height, style: r.style, quality_mode: r.quality_mode, prompt_complexity: r.prompt_complexity, steps: r.steps, guidance: r.guidance, auto_optimized: r.auto_optimized, hd_optimized: r.hd_optimized, auto_translated: r.auto_translated, cost: r.cost })) }), { headers: corsHeaders({ 'Content-Type': 'application/json' }) });
    } catch (e) {
        logger.add("❌ Error", e.message);
        return new Response(JSON.stringify({ error: { message: e.message, debug_logs: logger.get() } }), { status: 500, headers: corsHeaders({ 'Content-Type': 'application/json' }) });
    }
}

function handleModelsRequest() {
    const models = [];
    for (const [providerKey, providerConfig] of Object.entries(CONFIG.PROVIDERS)) {
        if (providerConfig.enabled && providerConfig.models) {
            for (const model of providerConfig.models) {
                models.push({ id: model.id, object: 'model', name: model.name, provider: providerKey, category: model.category, confirmed: model.confirmed || false, experimental: model.experimental || false, description: model.description });
            }
        }
    }
    return new Response(JSON.stringify({ object: 'list', data: models, total: models.length }), { headers: corsHeaders({ 'Content-Type': 'application/json' }) });
}

function handleProvidersRequest() {
    const providers = {};
    for (const [key, config] of Object.entries(CONFIG.PROVIDERS)) {
        providers[key] = { name: config.name, endpoint: config.endpoint, auth_mode: config.auth_mode, enabled: config.enabled, features: config.features };
    }
    return new Response(JSON.stringify({ object: 'list', data: providers }), { headers: corsHeaders({ 'Content-Type': 'application/json' }) });
}

function handleStylesRequest() {
    const styles = Object.entries(CONFIG.STYLE_PRESETS).map(([key, value]) => ({ id: key, name: value.name, prompt_addition: value.prompt, negative_addition: value.negative }));
    return new Response(JSON.stringify({ object: 'list', data: styles }), { headers: corsHeaders({ 'Content-Type': 'application/json' }) });
}

function handleUI() {
  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Flux AI Pro v${CONFIG.PROJECT_VERSION} 🍌</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%);color:#fff;padding:20px;min-height:100vh}
body.banana-mode{background:linear-gradient(135deg,#1a1a0a 0%,#2e2a1a 100%)}
.container{max-width:1400px;margin:0 auto}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:15px}
.header-left{flex:1}
h1{color:#f59e0b;margin:0;font-size:36px;font-weight:800;text-shadow:0 0 30px rgba(245,158,11,0.6)}
.banana-mode h1{color:#fbbf24;text-shadow:0 0 30px rgba(251,191,36,0.8)}
.badge{background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:6px 14px;border-radius:20px;font-size:14px;margin-left:10px}
.banana-mode .badge{background:linear-gradient(135deg,#fbbf24 0%,#f59e0b 100%)}
.subtitle{color:#9ca3af;margin-top:8px;font-size:15px}
.banana-mode .subtitle{color:#d4b896}

.banana-banner{display:none;background:linear-gradient(135deg,rgba(251,191,36,0.15) 0%,rgba(245,158,11,0.15) 100%);border:2px solid rgba(251,191,36,0.3);border-radius:16px;padding:20px;margin-bottom:20px;backdrop-filter:blur(10px)}
.banana-mode .banana-banner{display:block}
.banana-banner-title{font-size:24px;font-weight:800;color:#fbbf24;margin-bottom:12px;display:flex;align-items:center;gap:10px}
.banana-banner-desc{color:#d4b896;font-size:14px;line-height:1.6;margin-bottom:16px}
.banana-features{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
.banana-feature{background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.2);border-radius:10px;padding:12px;font-size:13px;color:#fbbf24;font-weight:600}

.mode-toggle{display:flex;gap:10px;margin-bottom:20px}
.mode-btn{padding:10px 20px;background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.1);color:#9ca3af;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.3s}
.mode-btn:hover{background:rgba(255,255,255,0.08);border-color:rgba(245,158,11,0.5)}
.mode-btn.active{background:linear-gradient(135deg,#fbbf24 0%,#f59e0b 100%);border-color:#f59e0b;color:#000}

.history-btn{background:linear-gradient(135deg,#8b5cf6 0%,#7c3aed 100%);color:#fff;border:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all 0.3s;position:relative}
.history-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(139,92,246,0.4)}
.history-badge{position:absolute;top:-8px;right:-8px;background:#ef4444;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700}

.history-panel{position:fixed;top:0;right:0;width:400px;max-width:90vw;height:100vh;background:rgba(26,26,26,0.98);backdrop-filter:blur(10px);box-shadow:-4px 0 20px rgba(0,0,0,0.5);z-index:1000;overflow-y:auto;display:none;animation:slideIn 0.3s ease}
@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
.history-header{position:sticky;top:0;background:rgba(15,15,15,0.95);backdrop-filter:blur(10px);padding:20px;border-bottom:1px solid rgba(255,255,255,0.1);z-index:10}
.history-header h2{color:#f59e0b;font-size:20px;margin-bottom:15px}
.history-actions{display:flex;gap:10px}
.btn-clear{flex:1;padding:10px;background:rgba(239,68,68,0.2);border:1px solid #ef4444;color:#ef4444;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.3s}
.btn-clear:hover{background:rgba(239,68,68,0.3)}
.btn-close{flex:1;padding:10px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.3s}
.btn-close:hover{background:rgba(255,255,255,0.15)}

.history-filter{margin-top:15px;padding:10px;background:rgba(255,255,255,0.05);border-radius:8px}
.history-filter select{width:100%;padding:8px;background:#2a2a2a;border:1px solid #444;color:#fff;border-radius:6px;font-size:12px}

.history-list{padding:15px}
.history-item{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:15px;margin-bottom:15px;transition:all 0.3s}
.history-item:hover{background:rgba(255,255,255,0.08);border-color:rgba(245,158,11,0.5)}
.history-item img{width:100%;border-radius:8px;margin-bottom:12px;cursor:pointer;transition:transform 0.3s}
.history-item img:hover{transform:scale(1.02)}
.history-info{font-size:13px}
.history-prompt{color:#e5e7eb;margin-bottom:8px;line-height:1.5;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.history-meta{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px}
.history-meta span{color:#9ca3af;font-size:12px;background:rgba(255,255,255,0.05);padding:4px 8px;border-radius:6px}
.history-time{color:#6b7280;font-size:11px;margin-bottom:10px}
.history-actions-item{display:flex;gap:8px}
.history-actions-item button{flex:1;padding:8px;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.3s}
.btn-load{background:rgba(139,92,246,0.2);border:1px solid #8b5cf6;color:#a78bfa}
.btn-load:hover{background:rgba(139,92,246,0.3)}
.btn-delete{background:rgba(239,68,68,0.2);border:1px solid #ef4444;color:#ef4444}
.btn-delete:hover{background:rgba(239,68,68,0.3)}

.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:20px 0}
@media (max-width:768px){.grid{grid-template-columns:1fr}.history-panel{width:100vw}}

.box{background:rgba(26,26,26,0.95);padding:24px;border-radius:16px;border:1px solid rgba(255,255,255,0.1)}
.banana-mode .box{background:rgba(30,28,20,0.95);border-color:rgba(251,191,36,0.2)}
h3{color:#f59e0b;margin-bottom:18px;font-size:18px;font-weight:700}
.banana-mode h3{color:#fbbf24}
label{display:block;margin:16px 0 8px 0;color:#e5e7eb;font-weight:600;font-size:13px}

.prompt-actions{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap}
.btn-example{flex:1;min-width:80px;padding:8px;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.3);color:#a78bfa;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.3s}
.btn-example:hover{background:rgba(139,92,246,0.2);border-color:#8b5cf6}
.banana-mode .btn-example{background:rgba(251,191,36,0.1);border-color:rgba(251,191,36,0.3);color:#fbbf24}
.banana-mode .btn-example:hover{background:rgba(251,191,36,0.2);border-color:#fbbf24}

.btn-optimize{width:100%;padding:12px;background:linear-gradient(135deg,#8b5cf6 0%,#7c3aed 100%);color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;margin-top:12px;transition:all 0.3s;display:flex;align-items:center;justify-content:center;gap:8px}
.btn-optimize:hover{transform:translateY(-2px);box-shadow:0 4px 15px rgba(139,92,246,0.4)}
.banana-mode .btn-optimize{background:linear-gradient(135deg,#fbbf24 0%,#f59e0b 100%);color:#000}
.banana-mode .btn-optimize:hover{box-shadow:0 4px 15px rgba(251,191,36,0.4)}

select,textarea,input{width:100%;padding:12px;margin:0;background:#2a2a2a;border:1px solid #444;color:#fff;border-radius:10px;font-size:14px;font-family:inherit;transition:all 0.3s}
select:focus,textarea:focus,input:focus{outline:none;border-color:#f59e0b;box-shadow:0 0 0 3px rgba(245,158,11,0.15)}
.banana-mode select:focus,.banana-mode textarea:focus,.banana-mode input:focus{border-color:#fbbf24;box-shadow:0 0 0 3px rgba(251,191,36,0.15)}
textarea{resize:vertical;min-height:90px}

.quality-mode-selector{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:12px 0}
.quality-option input[type="radio"]{position:absolute;opacity:0}
.quality-label{display:block;padding:16px 12px;background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.1);border-radius:12px;text-align:center;cursor:pointer;transition:all 0.3s}
.quality-label:hover{background:rgba(255,255,255,0.08);border-color:rgba(245,158,11,0.5)}
.quality-option input[type="radio"]:checked + .quality-label{background:rgba(245,158,11,0.2);border-color:#f59e0b}
.banana-mode .quality-option input[type="radio"]:checked + .quality-label{background:rgba(251,191,36,0.2);border-color:#fbbf24}
.quality-name{font-size:14px;font-weight:600;color:#e5e7eb;margin-bottom:4px}
.quality-desc{font-size:11px;color:#9ca3af}

button{width:100%;padding:16px;background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);color:#fff;border:none;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;margin-top:20px;transition:all 0.3s;box-shadow:0 4px 15px rgba(245,158,11,0.4)}
button:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(245,158,11,0.6)}
button:disabled{background:#555;cursor:not-allowed;transform:none;box-shadow:none}
.banana-mode button{background:linear-gradient(135deg,#fbbf24 0%,#f59e0b 100%);box-shadow:0 4px 15px rgba(251,191,36,0.4)}
.banana-mode button:hover{box-shadow:0 6px 20px rgba(251,191,36,0.6)}

#result{margin-top:20px}
.result-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;margin-top:20px}
.result img{width:100%;border-radius:12px;cursor:pointer;transition:transform 0.3s}
.result img:hover{transform:scale(1.02)}

.success{background:rgba(16,185,129,0.15);border:1px solid #10b981;padding:16px;border-radius:12px;color:#10b981}
.banana-mode .success{background:rgba(251,191,36,0.15);border-color:#fbbf24;color:#fbbf24}

.timer{margin-top:10px;font-size:16px;font-weight:600;color:#10b981;animation:pulse 1.5s ease-in-out infinite}
.banana-mode .timer{color:#fbbf24}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}

.error{background:rgba(239,68,68,0.15);border:1px solid #ef4444;padding:16px;border-radius:12px;color:#ef4444}
.checkbox-group{display:flex;align-items:center;gap:10px;margin:12px 0}
.checkbox-group input[type="checkbox"]{width:auto;margin:0}

.loading-banana{display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;text-align:center}
.loading-banana.active{display:block}
.loading-banana-icon{font-size:80px;animation:bounce 1s infinite}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
.loading-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9998}
.loading-overlay.active{display:block}
</style>
</head>
<body>
<div class="loading-overlay" id="loadingOverlay"></div>
<div class="loading-banana" id="loadingBanana">
<div class="loading-banana-icon">🍌</div>
<div style="color:#fbbf24;font-size:18px;font-weight:700;margin-top:10px">Nano Banana 生成中...</div>
</div>

<div class="container">
<div class="header">
<div class="header-left">
<h1>🎨 Flux AI Pro<span class="badge">v${CONFIG.PROJECT_VERSION}</span></h1>
<p class="subtitle">19個模型 · 12種風格 · 3檔質量 · 智能HD優化 · 🍌 Nano Banana 專屬增強</p>
</div>
<button onclick="toggleHistory()" class="history-btn">
📜 歷史紀錄
<span id="historyBadge" class="history-badge" style="display:none">0</span>
</button>
</div>

<div class="banana-banner">
<div class="banana-banner-title">🍌 Nano Banana 專屬模式</div>
<div class="banana-banner-desc">
基於 Google Gemini 的強大圖像生成模型，專為繁體中文優化。支持 4K 超高清輸出、中文文字渲染、多圖融合等高級功能。
</div>
<div class="banana-features">
<div class="banana-feature">✨ 4K 超高清輸出</div>
<div class="banana-feature">🇨🇳 完美中文支持</div>
<div class="banana-feature">🎨 14 圖智能融合</div>
<div class="banana-feature">⚡ Gemini 3 Pro 驅動</div>
</div>
</div>

<div class="mode-toggle">
<button class="mode-btn all active" onclick="switchMode('all')">🎨 全部模型</button>
<button class="mode-btn banana" onclick="switchMode('banana')">🍌 Nano Banana 專屬</button>
</div>

<div id="historyPanel" class="history-panel">
<div class="history-header">
<h2>📸 圖片歷史</h2>
<div class="history-filter">
<select id="historyFilter" onchange="filterHistory()">
<option value="all">全部模型</option>
<option value="nanobanana">🍌 Nano Banana</option>
<option value="flux">⚡ Flux 系列</option>
<option value="sd">🌟 Stable Diffusion</option>
</select>
</div>
<div class="history-actions">
<button onclick="clearAllHistory()" class="btn-clear">🗑️ 清空</button>
<button onclick="toggleHistory()" class="btn-close">✕ 關閉</button>
</div>
</div>
<div id="historyList" class="history-list"></div>
</div>

<div class="grid">
<div class="box">
<h3>📝 生成設置</h3>
<label>提示詞 *</label>
<div class="prompt-actions" id="promptActions"></div>
<textarea id="prompt" placeholder="Describe your image...&#10;A beautiful sunset over mountains with vibrant colors"></textarea>
<button class="btn-optimize" onclick="autoOptimizePrompt()">
💡 智能優化提示詞
</button>
<label>負面提示詞</label>
<textarea id="negativePrompt" placeholder="low quality, blurry, distorted"></textarea>
<label>AI 模型</label>
<select id="model" onchange="onModelChange()">
<optgroup label="⚡ Flux 系列" class="flux-group">
<option value="flux">Flux (均衡)</option>
<option value="flux-realism">Flux Realism (超寫實)</option>
<option value="flux-anime">Flux Anime (動漫)</option>
<option value="flux-3d">Flux 3D (3D渲染)</option>
<option value="flux-pro">Flux Pro (專業版)</option>
<option value="any-dark">Any Dark (暗黑)</option>
<option value="turbo">Turbo (極速)</option>
</optgroup>
<optgroup label="🔥 Flux 高級版" class="flux-group">
<option value="flux-1.1-pro">Flux 1.1 Pro 🔥</option>
<option value="flux-kontext">Flux Kontext 🎨</option>
<option value="flux-kontext-pro">Flux Kontext Pro 💎</option>
</optgroup>
<optgroup label="🍌 Google Gemini (Nano Banana)" class="banana-group">
<option value="nanobanana">Nano Banana 🍌 (快速版)</option>
<option value="nanobanana-pro">Nano Banana Pro 🍌💎 (4K+繁中文字)</option>
</optgroup>
<optgroup label="🌟 Stable Diffusion" class="sd-group">
<option value="sd3">SD 3 ⚡</option>
<option value="sd3.5-large">SD 3.5 Large 🔥</option>
<option value="sd3.5-turbo">SD 3.5 Turbo ⚡</option>
<option value="sdxl">SDXL 📐</option>
<option value="sdxl-lightning">SDXL Lightning ⚡</option>
</optgroup>
</select>
<label>藝術風格</label>
<select id="style">
${Object.entries(CONFIG.STYLE_PRESETS).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join('')}
</select>
<label>質量模式</label>
<div class="quality-mode-selector">
<div class="quality-option">
<input type="radio" name="quality" value="economy" id="q-economy">
<label for="q-economy" class="quality-label"><div class="quality-name">⚡ 經濟</div><div class="quality-desc">快速測試</div></label>
</div>
<div class="quality-option">
<input type="radio" name="quality" value="standard" id="q-standard" checked>
<label for="q-standard" class="quality-label"><div class="quality-name">⭐ 標準</div><div class="quality-desc">平衡質速</div></label>
</div>
<div class="quality-option">
<input type="radio" name="quality" value="ultra" id="q-ultra">
<label for="q-ultra" class="quality-label"><div class="quality-name">💎 超高清</div><div class="quality-desc">極致質量</div></label>
</div>
</div>
<div class="checkbox-group">
<input type="checkbox" id="autoOptimize" checked>
<label for="autoOptimize" style="margin:0">🎯 自動優化參數</label>
</div>
<div class="checkbox-group">
<input type="checkbox" id="autoHD" checked>
<label for="autoHD" style="margin:0">✨ 智能HD增強</label>
</div>
</div>
<div class="box">
<h3>🎨 圖像參數</h3>
<label>尺寸預設</label>
<select id="sizePreset">
${Object.entries(CONFIG.PRESET_SIZES).map(([k,v])=>`<option value="${k}" ${k==='square'?'selected':''}>${v.name} (${v.width}x${v.height})</option>`).join('')}
</select>
<label>寬度: <span id="widthValue">1024</span>px</label>
<input type="range" id="width" min="256" max="2048" step="64" value="1024">
<label>高度: <span id="heightValue">1024</span>px</label>
<input type="range" id="height" min="256" max="2048" step="64" value="1024">
<label>生成數量</label>
<select id="numOutputs">
<option value="1" selected>1 張</option>
<option value="2">2 張</option>
<option value="3">3 張</option>
<option value="4">4 張</option>
</select>
<label>隨機種子 (-1 = 隨機)</label>
<input type="number" id="seed" value="-1" min="-1" max="1000000">
<button onclick="generate()">🚀 開始生成</button>
</div>
</div>
<div id="result"></div>
</div>
<script>
const STORAGE_KEY='flux_ai_history';
const MAX_HISTORY=100;
let currentMode='all';
let generationTimer=null;
let startTime=0;

function updateTimer(){
const elapsed=((Date.now()-startTime)/1000).toFixed(1);
const resultDiv=document.getElementById('result');
const timerElement=resultDiv.querySelector('.timer');
if(timerElement){
timerElement.textContent=\`⏱️ 已耗時: \${elapsed} 秒\`;
}
}

const EXAMPLES={
all:[
{label:'汉服',text:'一個穿著中國傳統漢服的少女，站在盛開的櫻花樹下，溫柔的微笑，細膩的畫面，柔和的光線'},
{label:'赛博朋克',text:'賽博朋克風格的中國龍 cyberpunk style, neon lights, futuristic Chinese dragon, detailed scales, glowing eyes'},
{label:'油画',text:'古典油畫風格的威尼斯運河，細膩的筆觸，豐富的色彩，藝術感強'},
{label:'动漫',text:'anime style girl with cat ears, vibrant colors, cute expression, detailed anime art'}
],
banana:[
{label:'漢服少女',text:'一位身穿精美漢服的古典美女，站在江南園林中，背景是飄落的桃花，柔和的光線，極致細節，8K畫質'},
{label:'中文書法',text:'毛筆書法「天道酬勤」四個繁體大字，墨香四溢，宣紙質感,金色背景，專業攝影，4K超高清'},
{label:'故宮建築',text:'紫禁城太和殿在日出時分，雲霧繚繞，金色陽光灑滿紅牆黃瓦，超廣角鏡頭，4K超高清'},
{label:'水墨山水',text:'中國傳統水墨山水畫，高山流水，雲霧繚繞，意境深遠，細膩的筆觸，4K超高清'}
]
};
function updateExamples(){
const container=document.getElementById('promptActions');
const examples=EXAMPLES[currentMode];
container.innerHTML=examples.map(ex=>
\`<button type="button" onclick="fillExample('\${ex.label}')" class="btn-example">\${ex.label}</button>\`
).join('');
}

function fillExample(label){
const examples=EXAMPLES[currentMode];
const example=examples.find(ex=>ex.label===label);
if(example){
document.getElementById('prompt').value=example.text;
}
}

function autoOptimizePrompt(){
const prompt=document.getElementById('prompt').value.trim();
if(!prompt){
alert('請先輸入提示詞！');
return;
}
const model=document.getElementById('model').value;
const isBanana=model.includes('nanobanana');
let optimized=prompt;
if(isBanana){
if(!prompt.includes('4K')&&!prompt.includes('8K')&&!prompt.includes('超高清')){
optimized+=', 4K超高清, 極致細節';
}
if(!prompt.includes('專業')&&!prompt.includes('攝影')){
optimized+=', 專業攝影, 完美構圖';
}
}else{
if(!prompt.includes('detailed')&&!prompt.includes('細節')){
optimized+=', extremely detailed, high quality';
}
if(!prompt.includes('sharp')&&!prompt.includes('清晰')){
optimized+=', sharp focus, crisp';
}
}
document.getElementById('prompt').value=optimized;
alert('✅ 提示詞已優化！');
}

function onModelChange(){
const model=document.getElementById('model').value;
const isBanana=model.includes('nanobanana');
if(isBanana){
document.getElementById('q-ultra').checked=true;
const widthSlider=document.getElementById('width');
const heightSlider=document.getElementById('height');
const widthValue=document.getElementById('widthValue');
const heightValue=document.getElementById('heightValue');
if(parseInt(widthSlider.value)<1536||parseInt(heightSlider.value)<1536){
widthSlider.value=1536;
heightSlider.value=1536;
widthValue.textContent='1536';
heightValue.textContent='1536';
}
}
}

function switchMode(mode){
currentMode=mode;
const body=document.body;
const modelSelect=document.getElementById('model');
const allBtn=document.querySelector('.mode-btn.all');
const bananaBtn=document.querySelector('.mode-btn.banana');
const fluxGroups=document.querySelectorAll('.flux-group, .sd-group');
const bananaGroup=document.querySelector('.banana-group');

if(mode==='banana'){
body.classList.add('banana-mode');
fluxGroups.forEach(group=>group.style.display='none');
bananaGroup.style.display='block';
modelSelect.value='nanobanana-pro';
allBtn.classList.remove('active');
bananaBtn.classList.add('active');

const widthSlider=document.getElementById('width');
const heightSlider=document.getElementById('height');
const widthValue=document.getElementById('widthValue');
const heightValue=document.getElementById('heightValue');
widthSlider.value=1536;
heightSlider.value=1536;
widthValue.textContent='1536';
heightValue.textContent='1536';

document.getElementById('q-ultra').checked=true;
}else{
body.classList.remove('banana-mode');
fluxGroups.forEach(group=>group.style.display='block');
bananaGroup.style.display='block';
allBtn.classList.add('active');
bananaBtn.classList.remove('active');
}

updateExamples();
}

class HistoryManager{
static save(record){
try{
let history=this.getAll();
record.id=Date.now();
record.timestamp=new Date().toISOString();
history.unshift(record);
if(history.length>MAX_HISTORY)history=history.slice(0,MAX_HISTORY);
localStorage.setItem(STORAGE_KEY,JSON.stringify(history));
this.updateBadge();
return true;
}catch(e){
console.error('儲存失敗:',e);
return false;
}
}
static getAll(){
try{
const data=localStorage.getItem(STORAGE_KEY);
return data?JSON.parse(data):[];
}catch(e){
console.error('讀取失敗:',e);
return[];
}
}
static delete(id){
try{
let history=this.getAll();
history=history.filter(item=>item.id!==id);
localStorage.setItem(STORAGE_KEY,JSON.stringify(history));
this.updateBadge();
return true;
}catch(e){
console.error('刪除失敗:',e);
return false;
}
}
static clear(){
try{
localStorage.removeItem(STORAGE_KEY);
this.updateBadge();
return true;
}catch(e){
console.error('清空失敗:',e);
return false;
}
}
static updateBadge(){
const count=this.getAll().length;
const badge=document.getElementById('historyBadge');
if(badge){
badge.textContent=count;
badge.style.display=count>0?'inline-block':'none';
}
}
static loadParams(record){
document.getElementById('prompt').value=record.prompt||'';
document.getElementById('negativePrompt').value=record.negativePrompt||'';
document.getElementById('model').value=record.model||'flux';
document.getElementById('style').value=record.style||'none';
document.getElementById('width').value=record.width||1024;
document.getElementById('height').value=record.height||1024;
document.getElementById('widthValue').textContent=record.width||1024;
document.getElementById('heightValue').textContent=record.height||1024;
document.getElementById('seed').value=record.seed||-1;
const qualityRadio=document.querySelector(\`input[name="quality"][value="\${record.qualityMode||'standard'}"]\`);
if(qualityRadio)qualityRadio.checked=true;
toggleHistory();
alert('✅ 參數已載入!');
}
}

function toggleHistory(){
const panel=document.getElementById('historyPanel');
if(panel.style.display==='none'||!panel.style.display){
showHistory();
panel.style.display='block';
}else{
panel.style.display='none';
}
}

function filterHistory(){
showHistory();
}

function showHistory(){
const filterValue=document.getElementById('historyFilter').value;
let history=HistoryManager.getAll();

if(filterValue==='nanobanana'){
history=history.filter(item=>item.model&&item.model.includes('nanobanana'));
}else if(filterValue==='flux'){
history=history.filter(item=>item.model&&item.model.includes('flux')&&!item.model.includes('nanobanana'));
}else if(filterValue==='sd'){
history=history.filter(item=>item.model&&(item.model.includes('sd')||item.model.includes('sdxl')));
}

const container=document.getElementById('historyList');
if(history.length===0){
container.innerHTML='<div style="text-align:center;padding:40px;color:#9ca3af">📭 暫無歷史紀錄</div>';
return;
}
container.innerHTML=history.map(item=>\`
<div class="history-item">
<img src="\${item.url}" alt="歷史圖片" onclick="window.open('\${item.url}')">
<div class="history-info">
<div class="history-prompt">\${(item.prompt||'').substring(0,60)}\${(item.prompt||'').length>60?'...':''}</div>
<div class="history-meta">
<span>🎨 \${item.model}</span>
<span>📐 \${item.width}x\${item.height}</span>
<span>⭐ \${item.qualityMode||'standard'}</span>
</div>
<div class="history-time">\${formatTime(item.timestamp)}</div>
<div class="history-actions-item">
<button onclick='HistoryManager.loadParams(\${JSON.stringify(item).replace(/'/g,"\\\\'")})' class="btn-load">🔄 載入</button>
<button onclick="deleteHistoryItem(\${item.id})" class="btn-delete">🗑️ 刪除</button>
</div>
</div>
</div>
\`).join('');
}

function deleteHistoryItem(id){
if(confirm('確定刪除這條紀錄嗎？')){
HistoryManager.delete(id);
showHistory();
}
}

function clearAllHistory(){
if(confirm('確定清空所有歷史紀錄嗎？此操作不可復原！')){
HistoryManager.clear();
showHistory();
}
}

function formatTime(timestamp){
const date=new Date(timestamp);
const now=new Date();
const diff=now-date;
if(diff<60000)return'剛剛';
if(diff<3600000)return\`\${Math.floor(diff/60000)}分鐘前\`;
if(diff<86400000)return\`\${Math.floor(diff/3600000)}小時前\`;
if(diff<604800000)return\`\${Math.floor(diff/86400000)}天前\`;
return date.toLocaleDateString('zh-TW',{month:'2-digit',day:'2-digit'});
}

const widthSlider=document.getElementById('width');
const heightSlider=document.getElementById('height');
const widthValue=document.getElementById('widthValue');
const heightValue=document.getElementById('heightValue');
const sizePreset=document.getElementById('sizePreset');

widthSlider.oninput=()=>widthValue.textContent=widthSlider.value;
heightSlider.oninput=()=>heightValue.textContent=heightSlider.value;
sizePreset.onchange=()=>{
const preset=${JSON.stringify(CONFIG.PRESET_SIZES)}[sizePreset.value];
if(preset&&sizePreset.value!=='custom'){
widthSlider.value=preset.width;
heightSlider.value=preset.height;
widthValue.textContent=preset.width;
heightValue.textContent=preset.height;
}
};

async function generate(){
const prompt=document.getElementById('prompt').value.trim();
if(!prompt){alert('請輸入提示詞');return;}

const model=document.getElementById('model').value;
const isBanana=model.includes('nanobanana');

const resultDiv=document.getElementById('result');
const button=document.querySelector('button[onclick="generate()"]');
const loadingOverlay=document.getElementById('loadingOverlay');
const loadingBanana=document.getElementById('loadingBanana');

button.disabled=true;
button.textContent='生成中...';

if(isBanana){
loadingOverlay.classList.add('active');
loadingBanana.classList.add('active');
}

startTime=Date.now();
resultDiv.innerHTML='<div class="success"><strong>⏳ 正在生成圖像，請稍候...</strong><div class="timer">⏱️ 已耗時: 0.0 秒</div></div>';

generationTimer=setInterval(updateTimer,100);

const qualityMode=document.querySelector('input[name="quality"]:checked').value;
const params={
prompt:prompt,
negative_prompt:document.getElementById('negativePrompt').value,
model:model,
style:document.getElementById('style').value,
width:parseInt(widthSlider.value),
height:parseInt(heightSlider.value),
n:parseInt(document.getElementById('numOutputs').value),
seed:parseInt(document.getElementById('seed').value),
auto_optimize:document.getElementById('autoOptimize').checked,
auto_hd:document.getElementById('autoHD').checked,
quality_mode:qualityMode
};

try{
const response=await fetch('/v1/images/generations',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify(params)
});
const data=await response.json();
if(!response.ok)throw new Error(data.error?.message||'生成失敗');

clearInterval(generationTimer);
const totalTime=((Date.now()-startTime)/1000).toFixed(1);

resultDiv.innerHTML=\`<div class="success"><strong>✅ 生成成功!</strong> <span style="color:#10b981;font-weight:600">總耗時: \${totalTime} 秒</span></div>\`;
resultDiv.innerHTML+='<div class="result-grid">';
data.data.forEach((item,index)=>{
HistoryManager.save({
url:item.url,
prompt:params.prompt,
negativePrompt:params.negative_prompt,
model:item.model,
style:item.style,
width:item.width,
height:item.height,
qualityMode:item.quality_mode,
seed:item.seed
});
resultDiv.innerHTML+=\`<div class="result"><img src="\${item.url}" alt="Generated \${index+1}" onclick="window.open('\${item.url}')"><p style="margin-top:12px;font-size:13px;color:#9ca3af">\${item.model} | \${item.width}x\${item.height} | \${item.quality_mode}\${item.auto_translated?' | 🌐 已翻譯':''}</p></div>\`;
});
resultDiv.innerHTML+='</div>';
}catch(error){
clearInterval(generationTimer);
resultDiv.innerHTML=\`<div class="error"><strong>❌ 錯誤</strong><p style="margin-top:12px">\${error.message}</p></div>\`;
}finally{
button.disabled=false;
button.textContent='🚀 開始生成';
if(isBanana){
loadingOverlay.classList.remove('active');
loadingBanana.classList.remove('active');
}
}
}

document.addEventListener('DOMContentLoaded',()=>{
HistoryManager.updateBadge();
switchMode('all');
});
</script>
</body>
</html>`;
  return new Response(html, { headers: corsHeaders({ 'Content-Type': 'text/html; charset=utf-8' }) });
}
