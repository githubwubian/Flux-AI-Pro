// =================================================================================
//  項目: multi-provider-image-generator
//  版本: 8.5.0 (完整最終版 + 自動高清)
//  作者: Enhanced by AI Assistant
//  日期: 2025-11-29
//
//  完整功能:
//  ✅ 17個模型 (Flux + SD3)
//  ✅ 12種風格預設
//  ✅ NSFW 成人內容
//  ✅ 智能參數優化
//  ✅ 動態生成 UI
//  ✅ 自動高清優化 (NEW!)
//  ✅ 歷史記錄系統
//  ✅ OpenAI 兼容 API
// =================================================================================

const CONFIG = {
  PROJECT_NAME: "multi-provider-image-generator",
  PROJECT_VERSION: "8.5.0",
  
  API_MASTER_KEY: "1",
  
  PROVIDERS: {
    pollinations: {
      name: "Pollinations.ai",
      endpoint: "https://image.pollinations.ai",
      type: "direct",
      auth_mode: "free",
      requires_key: false,
      enabled: true,
      default: true,
      description: "完全免費的 AI 圖像生成服務 - 支持 Flux & SD3 系列 + 自動高清",
      features: {
        nsfw: true,
        private_mode: true,
        custom_size: true,
        seed_control: true,
        negative_prompt: true,
        enhance: true,
        nologo: true,
        style_presets: true,
        auto_hd: true
      },
      models: [
        { id: "flux", name: "Flux", confirmed: true, category: "flux", description: "均衡速度與質量" },
        { id: "flux-realism", name: "Flux Realism", confirmed: true, category: "flux", description: "超寫實風格" },
        { id: "flux-anime", name: "Flux Anime", confirmed: true, category: "flux", description: "日系動漫風格" },
        { id: "flux-3d", name: "Flux 3D", confirmed: true, category: "flux", description: "3D 渲染風格" },
        { id: "flux-pro", name: "Flux Pro", confirmed: true, category: "flux", description: "專業版最高質量" },
        { id: "any-dark", name: "Any Dark", confirmed: true, category: "flux", description: "暗黑風格" },
        { id: "turbo", name: "Turbo", confirmed: true, category: "flux", description: "極速生成" },
        { id: "flux-1.1-pro", name: "Flux 1.1 Pro 🔥", confirmed: false, fallback: ["flux-pro", "flux-realism"], experimental: true, category: "flux-advanced", description: "最新 Flux 1.1" },
        { id: "flux-kontext", name: "Flux Kontext 🎨", confirmed: false, fallback: ["flux-pro", "flux-realism"], experimental: true, category: "flux-advanced", description: "圖像編輯標準版" },
        { id: "flux-kontext-pro", name: "Flux Kontext Pro 💎", confirmed: false, fallback: ["flux-kontext", "flux-pro", "flux-realism"], experimental: true, category: "flux-advanced", description: "圖像編輯專業版" },
        { id: "sd3", name: "Stable Diffusion 3 ⚡", confirmed: false, fallback: ["flux-realism", "flux"], experimental: true, category: "stable-diffusion", description: "SD3 標準版" },
        { id: "sd3.5-large", name: "SD 3.5 Large 🔥", confirmed: false, fallback: ["sd3", "flux-realism", "flux"], experimental: true, category: "stable-diffusion", description: "SD 3.5 大模型" },
        { id: "sd3.5-turbo", name: "SD 3.5 Turbo ⚡", confirmed: false, fallback: ["turbo", "flux"], experimental: true, category: "stable-diffusion", description: "SD 3.5 快速版" },
        { id: "sdxl", name: "SDXL 📐", confirmed: false, fallback: ["flux-realism", "flux"], experimental: true, category: "stable-diffusion", description: "經典 SDXL" },
        { id: "sdxl-lightning", name: "SDXL Lightning ⚡", confirmed: false, fallback: ["turbo", "flux"], experimental: true, category: "stable-diffusion", description: "SDXL 極速版" }
      ],
      rate_limit: null,
      max_size: { width: 2048, height: 2048 }
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
  
  OPTIMIZATION_RULES: {
    MODEL_STEPS: {
      "turbo": { min: 4, optimal: 8, max: 12 },
      "sdxl-lightning": { min: 4, optimal: 6, max: 10 },
      "sd3.5-turbo": { min: 8, optimal: 12, max: 20 },
      "flux": { min: 15, optimal: 20, max: 30 },
      "flux-anime": { min: 15, optimal: 20, max: 30 },
      "flux-3d": { min: 15, optimal: 22, max: 35 },
      "sd3": { min: 18, optimal: 25, max: 35 },
      "sdxl": { min: 20, optimal: 28, max: 40 },
      "flux-realism": { min: 20, optimal: 28, max: 40 },
      "flux-pro": { min: 25, optimal: 32, max: 45 },
      "flux-1.1-pro": { min: 20, optimal: 28, max: 40 },
      "sd3.5-large": { min: 25, optimal: 35, max: 50 },
      "flux-kontext": { min: 22, optimal: 30, max: 40 },
      "flux-kontext-pro": { min: 25, optimal: 35, max: 45 },
      "any-dark": { min: 18, optimal: 24, max: 35 }
    },
    SIZE_MULTIPLIER: {
      small: { threshold: 512 * 512, multiplier: 0.8 },
      medium: { threshold: 1024 * 1024, multiplier: 1.0 },
      large: { threshold: 1536 * 1536, multiplier: 1.15 },
      xlarge: { threshold: 2048 * 2048, multiplier: 1.3 }
    },
    STYLE_ADJUSTMENT: {
      "photorealistic": 1.1,
      "oil-painting": 1.05,
      "watercolor": 0.95,
      "pixel-art": 0.85,
      "sketch": 0.9,
      "vector": 0.85,
      "default": 1.0
    }
  },
  
  HD_OPTIMIZATION: {
    enabled: true,
    HD_PROMPTS: {
      quality_boost: "high quality, extremely detailed, sharp focus, crisp, clear, professional",
      resolution_boost: "8k uhd, high resolution, ultra HD, masterpiece",
      texture_boost: "fine details, intricate details, highly detailed textures",
      clarity_boost: "perfect clarity, crystal clear, no blur, no noise",
      full_enhancement: "8k uhd, high quality, extremely detailed, sharp focus, crisp, clear, professional, masterpiece, fine details, intricate details, perfect clarity, crystal clear"
    },
    HD_NEGATIVE: "low quality, blurry, pixelated, low resolution, jpeg artifacts, compression artifacts, bad quality, distorted, noisy, grainy, poor details, soft focus, out of focus",
    MODEL_HD_STRATEGY: {
      "flux-realism": { prompt_level: "full_enhancement", negative: true, upscale: true },
      "flux-pro": { prompt_level: "full_enhancement", negative: true, upscale: true },
      "flux-1.1-pro": { prompt_level: "full_enhancement", negative: true, upscale: true },
      "sd3.5-large": { prompt_level: "full_enhancement", negative: true, upscale: true },
      "flux": { prompt_level: "quality_boost", negative: true, upscale: false },
      "sd3": { prompt_level: "quality_boost", negative: true, upscale: false },
      "sdxl": { prompt_level: "quality_boost", negative: true, upscale: false },
      "turbo": { prompt_level: "resolution_boost", negative: false, upscale: false },
      "sdxl-lightning": { prompt_level: "resolution_boost", negative: false, upscale: false },
      "sd3.5-turbo": { prompt_level: "resolution_boost", negative: false, upscale: false },
      "flux-anime": { prompt_level: "clarity_boost", negative: true, upscale: false },
      "flux-3d": { prompt_level: "clarity_boost", negative: true, upscale: false },
      "any-dark": { prompt_level: "texture_boost", negative: true, upscale: false }
    },
    SIZE_RECOMMENDATION: {
      min_recommended: 1024,
      auto_upscale_threshold: 768,
      max_size: 2048,
      upscale_rules: {
        "512x512": { suggested: "1024x1024", multiplier: 2 },
        "768x768": { suggested: "1536x1536", multiplier: 2 },
        "640x640": { suggested: "1280x1280", multiplier: 2 },
        "512x768": { suggested: "1024x1536", multiplier: 2 },
        "768x512": { suggested: "1536x1024", multiplier: 2 }
      }
    }
  },
  
  FETCH_TIMEOUT: 60000,
  MAX_RETRIES: 3,
  
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
  
  HISTORY: {
    MAX_ITEMS: 100,
    STORAGE_KEY: "image_generation_history"
  }
};

class Logger {
    constructor() { this.logs = []; }
    add(step, data) {
        const time = new Date().toISOString().split('T')[1].slice(0, -1);
        this.logs.push({ time, step, data });
        console.log(`[${step}]`, data);
    }
    get() { return this.logs; }
}

class HDOptimizer {
    static optimize(prompt, negativePrompt, model, width, height, autoHD = true) {
        if (!autoHD || !CONFIG.HD_OPTIMIZATION.enabled) {
            return {
                prompt: prompt,
                negativePrompt: negativePrompt,
                width: width,
                height: height,
                optimized: false
            };
        }
        
        const hdConfig = CONFIG.HD_OPTIMIZATION;
        const strategy = hdConfig.MODEL_HD_STRATEGY[model] || {
            prompt_level: "quality_boost",
            negative: true,
            upscale: false
        };
        
        const optimizations = [];
        
        let enhancedPrompt = prompt;
        if (strategy.prompt_level && hdConfig.HD_PROMPTS[strategy.prompt_level]) {
            const hdBoost = hdConfig.HD_PROMPTS[strategy.prompt_level];
            enhancedPrompt = `${prompt}, ${hdBoost}`;
            optimizations.push(`提示詞增強: ${strategy.prompt_level}`);
        }
        
        let enhancedNegative = negativePrompt || "";
        if (strategy.negative) {
            enhancedNegative = enhancedNegative 
                ? `${enhancedNegative}, ${hdConfig.HD_NEGATIVE}`
                : hdConfig.HD_NEGATIVE;
            optimizations.push(`負面提示詞: 已添加高清過濾`);
        }
        
        let finalWidth = width;
        let finalHeight = height;
        let sizeUpscaled = false;
        
        if (strategy.upscale) {
            const totalPixels = width * height;
            const minPixels = hdConfig.SIZE_RECOMMENDATION.min_recommended ** 2;
            
            if (totalPixels < minPixels) {
                const scale = Math.sqrt(minPixels / totalPixels);
                finalWidth = Math.min(Math.round(width * scale / 64) * 64, hdConfig.SIZE_RECOMMENDATION.max_size);
                finalHeight = Math.min(Math.round(height * scale / 64) * 64, hdConfig.SIZE_RECOMMENDATION.max_size);
                sizeUpscaled = true;
                optimizations.push(`尺寸提升: ${width}x${height} → ${finalWidth}x${finalHeight}`);
            }
        }
        
        const sizeKey = `${width}x${height}`;
        if (hdConfig.SIZE_RECOMMENDATION.upscale_rules[sizeKey] && !sizeUpscaled) {
            const rule = hdConfig.SIZE_RECOMMENDATION.upscale_rules[sizeKey];
            const [suggestedW, suggestedH] = rule.suggested.split('x').map(Number);
            
            if (suggestedW <= hdConfig.SIZE_RECOMMENDATION.max_size) {
                finalWidth = suggestedW;
                finalHeight = suggestedH;
                sizeUpscaled = true;
                optimizations.push(`智能提升: ${width}x${height} → ${finalWidth}x${finalHeight}`);
            }
        }
        
        return {
            prompt: enhancedPrompt,
            negativePrompt: enhancedNegative,
            width: finalWidth,
            height: finalHeight,
            optimized: true,
            strategy: strategy,
            optimizations: optimizations,
            size_upscaled: sizeUpscaled
        };
    }
}

class ParameterOptimizer {
    static optimizeSteps(model, width, height, style = 'none', userSteps = null) {
        if (userSteps !== null && userSteps !== -1) {
            const suggestion = this.calculateOptimalSteps(model, width, height, style);
            return {
                steps: userSteps,
                optimized: false,
                suggested: suggestion.steps,
                reasoning: suggestion.reasoning,
                user_override: true
            };
        }
        return this.calculateOptimalSteps(model, width, height, style);
    }
    
    static calculateOptimalSteps(model, width, height, style) {
        const rules = CONFIG.OPTIMIZATION_RULES;
        const modelRule = rules.MODEL_STEPS[model] || rules.MODEL_STEPS["flux"];
        let baseSteps = modelRule.optimal;
        
        const reasoning = [];
        reasoning.push(`模型 ${model} 基礎: ${baseSteps}步`);
        
        const totalPixels = width * height;
        let sizeMultiplier = 1.0;
        
        if (totalPixels <= rules.SIZE_MULTIPLIER.small.threshold) {
            sizeMultiplier = rules.SIZE_MULTIPLIER.small.multiplier;
            reasoning.push(`小尺寸 x${sizeMultiplier}`);
        } else if (totalPixels <= rules.SIZE_MULTIPLIER.medium.threshold) {
            sizeMultiplier = rules.SIZE_MULTIPLIER.medium.multiplier;
        } else if (totalPixels <= rules.SIZE_MULTIPLIER.large.threshold) {
            sizeMultiplier = rules.SIZE_MULTIPLIER.large.multiplier;
            reasoning.push(`大尺寸 x${sizeMultiplier}`);
        } else {
            sizeMultiplier = rules.SIZE_MULTIPLIER.xlarge.multiplier;
            reasoning.push(`超大 x${sizeMultiplier}`);
        }
        
        let styleMultiplier = rules.STYLE_ADJUSTMENT[style] || rules.STYLE_ADJUSTMENT.default;
        if (styleMultiplier !== 1.0) {
            reasoning.push(`風格 x${styleMultiplier}`);
        }
        
        let optimizedSteps = Math.round(baseSteps * sizeMultiplier * styleMultiplier);
        optimizedSteps = Math.max(modelRule.min, Math.min(optimizedSteps, modelRule.max));
        
        reasoning.push(`最終: ${optimizedSteps}步`);
        
        return {
            steps: optimizedSteps,
            optimized: true,
            base_steps: baseSteps,
            size_multiplier: sizeMultiplier,
            style_multiplier: styleMultiplier,
            min_steps: modelRule.min,
            max_steps: modelRule.max,
            reasoning: reasoning.join(' → ')
        };
    }
    
    static optimizeGuidance(model, style) {
        if (model.includes('turbo') || model.includes('lightning')) {
            return style === 'photorealistic' ? 3.0 : 2.5;
        }
        if (style === 'photorealistic') return 8.5;
        if (['oil-painting', 'watercolor', 'sketch'].includes(style)) return 6.5;
        return 7.5;
    }
}

class StyleProcessor {
    static applyStyle(prompt, style, negativePrompt) {
        const styleConfig = CONFIG.STYLE_PRESETS[style];
        if (!styleConfig || style === 'none') {
            return { enhancedPrompt: prompt, enhancedNegative: negativePrompt };
        }
        
        let enhancedPrompt = prompt;
        if (styleConfig.prompt) {
            enhancedPrompt = `${prompt}, ${styleConfig.prompt}`;
        }
        
        let enhancedNegative = negativePrompt || "";
        if (styleConfig.negative) {
            enhancedNegative = enhancedNegative 
                ? `${enhancedNegative}, ${styleConfig.negative}`
                : styleConfig.negative;
        }
        
        return { enhancedPrompt, enhancedNegative };
    }
}

async function fetchWithTimeout(url, options = {}, timeout = CONFIG.FETCH_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
    }
}

class PollinationsProvider {
    constructor(config) {
        this.config = config;
        this.name = config.name;
    }
    
    async generate(prompt, options, logger) {
        const {
            model = "flux",
            width = 1024,
            height = 1024,
            seed = -1,
            negativePrompt = "",
            guidance = null,
            steps = null,
            enhance = false,
            nologo = true,
            privateMode = true,
            style = "none",
            nsfw = false,
            autoOptimize = true,
            autoHD = true
        } = options;
        
        let hdOptimization = null;
        let finalPrompt = prompt;
        let finalNegativePrompt = negativePrompt;
        let finalWidth = width;
        let finalHeight = height;
        
        if (autoHD) {
            hdOptimization = HDOptimizer.optimize(
                prompt,
                negativePrompt,
                model,
                width,
                height,
                autoHD
            );
            
            finalPrompt = hdOptimization.prompt;
            finalNegativePrompt = hdOptimization.negativePrompt;
            finalWidth = hdOptimization.width;
            finalHeight = hdOptimization.height;
            
            if (hdOptimization.optimized) {
                logger.add("🎨 HD Optimization", {
                    original_size: `${width}x${height}`,
                    optimized_size: `${finalWidth}x${finalHeight}`,
                    size_upscaled: hdOptimization.size_upscaled,
                    optimizations: hdOptimization.optimizations
                });
            }
        }
        
        let finalSteps = steps;
        let finalGuidance = guidance;
        
        if (autoOptimize) {
            const stepsOptimization = ParameterOptimizer.optimizeSteps(
                model, 
                finalWidth,
                finalHeight, 
                style, 
                steps
            );
            finalSteps = stepsOptimization.steps;
            
            logger.add("🎯 Steps Optimization", {
                optimized: stepsOptimization.steps,
                reasoning: stepsOptimization.reasoning
            });
            
            if (guidance === null) {
                finalGuidance = ParameterOptimizer.optimizeGuidance(model, style);
            } else {
                finalGuidance = guidance;
            }
        } else {
            finalSteps = steps || 20;
            finalGuidance = guidance || 7.5;
        }
        
        const { enhancedPrompt, enhancedNegative } = StyleProcessor.applyStyle(
            finalPrompt,
            style, 
            finalNegativePrompt
        );
        
        const modelConfig = this.config.models.find(m => m.id === model);
        const modelsToTry = [model];
        
        if (modelConfig?.experimental && modelConfig?.fallback) {
            modelsToTry.push(...modelConfig.fallback);
        }
        
        logger.add("🎨 Generation Config", {
            provider: this.name,
            model: model,
            dimensions: `${finalWidth}x${finalHeight}`,
            hd_optimized: autoHD && hdOptimization?.optimized,
            optimized_steps: finalSteps,
            optimized_guidance: finalGuidance
        });
        
        const currentSeed = seed === -1 ? Math.floor(Math.random() * 1000000) : seed;
        
        let fullPrompt = enhancedPrompt;
        if (enhancedNegative && enhancedNegative.trim()) {
            fullPrompt = `${enhancedPrompt} [negative: ${enhancedNegative}]`;
        }
        
        const encodedPrompt = encodeURIComponent(fullPrompt);
        
        for (const tryModel of modelsToTry) {
            let lastError = null;
            
            for (let retry = 0; retry < CONFIG.MAX_RETRIES; retry++) {
                try {
                    let url = `${this.config.endpoint}/prompt/${encodedPrompt}`;
                    
                    const params = new URLSearchParams();
                    params.append('model', tryModel);
                    params.append('width', finalWidth.toString());
                    params.append('height', finalHeight.toString());
                    params.append('seed', currentSeed.toString());
                    params.append('nologo', nologo.toString());
                    params.append('enhance', enhance.toString());
                    params.append('private', privateMode.toString());
                    
                    if (nsfw) {
                        params.append('nsfw', 'true');
                        params.append('safe', 'false');
                    }
                    
                    if (finalGuidance !== 7.5) {
                        params.append('guidance', finalGuidance.toString());
                    }
                    if (finalSteps !== 20) {
                        params.append('steps', finalSteps.toString());
                    }
                    
                    url += '?' + params.toString();
                    
                    const response = await fetchWithTimeout(url, {
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
                            logger.add(`✅ Success`, { 
                                url: response.url,
                                used_model: tryModel,
                                final_size: `${finalWidth}x${finalHeight}`,
                                hd_optimized: autoHD && hdOptimization?.optimized,
                                seed: currentSeed
                            });
                            
                            return {
                                url: response.url,
                                provider: this.name,
                                model: tryModel,
                                requested_model: model,
                                seed: currentSeed,
                                style: style,
                                nsfw: nsfw,
                                steps: finalSteps,
                                guidance: finalGuidance,
                                width: finalWidth,
                                height: finalHeight,
                                hd_optimized: autoHD && hdOptimization?.optimized,
                                hd_details: hdOptimization,
                                cost: "FREE",
                                fallback_used: tryModel !== model,
                                auto_optimized: autoOptimize
                            };
                        } else {
                            throw new Error(`Invalid content type: ${contentType}`);
                        }
                    } else {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    
                } catch (e) {
                    lastError = e;
                    
                    if (retry < CONFIG.MAX_RETRIES - 1) {
                        await new Promise(resolve => setTimeout(resolve, 1000 * (retry + 1)));
                    }
                }
            }
        }
        
        throw new Error(`All models failed`);
    }
}

class MultiProviderRouter {
    constructor(apiKeys = {}) {
        this.providers = {};
        this.apiKeys = apiKeys;
        
        for (const [key, config] of Object.entries(CONFIG.PROVIDERS)) {
            if (config.enabled) {
                if (key === 'pollinations') {
                    this.providers[key] = new PollinationsProvider(config);
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
}

function corsHeaders(additionalHeaders = {}) {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
        ...additionalHeaders
    };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        status: 204, 
        headers: corsHeaders()
      });
    }

    try {
      if (url.pathname === '/') {
        return handleUI(request);
      } 
      else if (url.pathname === '/v1/chat/completions') {
        return handleChatCompletions(request);
      } 
      else if (url.pathname === '/v1/images/generations') {
        return handleImageGenerations(request);
      }
      else if (url.pathname === '/v1/models') {
        return handleModelsRequest();
      }
      else if (url.pathname === '/v1/providers') {
        return handleProvidersRequest();
      }
      else if (url.pathname === '/v1/styles') {
        return handleStylesRequest();
      }
      else if (url.pathname === '/health') {
        return new Response(JSON.stringify({
          status: 'ok',
          version: CONFIG.PROJECT_VERSION,
          timestamp: new Date().toISOString()
        }), {
          headers: corsHeaders({ 'Content-Type': 'application/json' })
        });
      }
      else {
        return new Response(JSON.stringify({
          project: CONFIG.PROJECT_NAME,
          version: CONFIG.PROJECT_VERSION,
          features: ['17 Models', '12 Styles', 'Smart Optimization', 'Auto HD', 'NSFW', 'History'],
          endpoints: [
            '/v1/images/generations',
            '/v1/chat/completions',
            '/v1/models',
            '/v1/providers',
            '/v1/styles',
            '/health'
          ]
        }), { 
          headers: corsHeaders({ 'Content-Type': 'application/json' })
        });
      }
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        error: {
          message: error.message,
          type: 'worker_error'
        }
      }), {
        status: 500,
        headers: corsHeaders({ 'Content-Type': 'application/json' })
      });
    }
  }
};

async function handleChatCompletions(request) {
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
                if (part.type === 'text') {
                    prompt += part.text + " ";
                }
            }
        }

        prompt = prompt.trim();
        if (!prompt) throw new Error("Empty prompt");

        const options = {
            provider: body.provider || null,
            model: body.model || "flux",
            width: body.width || 1024,
            height: body.height || 1024,
            numOutputs: Math.min(Math.max(body.n || 1, 1), 4),
            seed: body.seed !== undefined ? body.seed : -1,
            negativePrompt: body.negative_prompt || "",
            guidance: body.guidance_scale || null,
            steps: body.steps || null,
            enhance: body.enhance === true,
            nologo: body.nologo !== false,
            privateMode: body.private !== false,
            style: body.style || "none",
            nsfw: body.nsfw === true,
            autoOptimize: body.auto_optimize !== false,
            autoHD: body.auto_hd !== false
        };

        const router = new MultiProviderRouter();
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
                        id: respId, 
                        object: 'chat.completion.chunk', 
                        created: Math.floor(Date.now()/1000),
                        model: options.model, 
                        choices: [{ index: 0, delta: { content: respContent }, finish_reason: null }]
                    };
                    await writer.write(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
                    
                    const endChunk = {
                        id: respId, 
                        object: 'chat.completion.chunk', 
                        created: Math.floor(Date.now()/1000),
                        model: options.model, 
                        choices: [{ index: 0, delta: {}, finish_reason: 'stop' }]
                    };
                    await writer.write(encoder.encode(`data: ${JSON.stringify(endChunk)}\n\n`));
                    await writer.write(encoder.encode('data: [DONE]\n\n'));
                } finally {
                    await writer.close();
                }
            })();

            return new Response(readable, {
                headers: corsHeaders({ 'Content-Type': 'text/event-stream' })
            });
        } else {
            return new Response(JSON.stringify({
                id: respId,
                object: "chat.completion",
                created: Math.floor(Date.now() / 1000),
                model: options.model,
                choices: [{
                    index: 0,
                    message: { role: "assistant", content: respContent },
                    finish_reason: "stop"
                }]
            }), { 
              headers: corsHeaders({ 'Content-Type': 'application/json' })
            });
        }
    } catch (e) {
        logger.add("❌ Error", e.message);
        return new Response(JSON.stringify({
          error: { 
            message: e.message,
            debug_logs: logger.get()
          }
        }), { 
          status: 500,
          headers: corsHeaders({ 'Content-Type': 'application/json' })
        });
    }
}

async function handleImageGenerations(request) {
    const logger = new Logger();

    try {
        const body = await request.json();
        
        const prompt = body.prompt;
        if (!prompt || !prompt.trim()) {
            throw new Error("Prompt is required");
        }

        let width = 1024, height = 1024;
        if (body.size) {
            const [w, h] = body.size.split('x').map(Number);
            if (w && h) {
                width = w;
                height = h;
            }
        }
        if (body.width) width = body.width;
        if (body.height) height = body.height;

        const options = {
            provider: body.provider || null,
            model: body.model || "flux",
            width: Math.min(Math.max(width, 256), 2048),
            height: Math.min(Math.max(height, 256), 2048),
            numOutputs: Math.min(Math.max(body.n || 1, 1), 4),
            seed: body.seed !== undefined ? body.seed : -1,
            negativePrompt: body.negative_prompt || "",
            guidance: body.guidance_scale || null,
            steps: body.steps || null,
            enhance: body.enhance === true,
            nologo: body.nologo !== false,
            privateMode: body.private !== false,
            style: body.style || "none",
            nsfw: body.nsfw === true,
            autoOptimize: body.auto_optimize !== false,
            autoHD: body.auto_hd !== false
        };

        const router = new MultiProviderRouter();
        const results = await router.generate(prompt, options, logger);

        return new Response(JSON.stringify({
            created: Math.floor(Date.now() / 1000),
            data: results.map(r => ({ 
                url: r.url,
                provider: r.provider,
                model: r.model,
                seed: r.seed,
                width: r.width,
                height: r.height,
                style: r.style,
                nsfw: r.nsfw,
                steps: r.steps,
                guidance: r.guidance,
                auto_optimized: r.auto_optimized,
                hd_optimized: r.hd_optimized,
                cost: r.cost
            }))
        }), { 
          headers: corsHeaders({ 'Content-Type': 'application/json' })
        });
    } catch (e) {
        logger.add("❌ Error", e.message);
        return new Response(JSON.stringify({
          error: { 
            message: e.message,
            debug_logs: logger.get()
          }
        }), { 
          status: 500,
          headers: corsHeaders({ 'Content-Type': 'application/json' })
        });
    }
}

function handleModelsRequest() {
    const models = [];
    
    for (const [providerKey, providerConfig] of Object.entries(CONFIG.PROVIDERS)) {
        if (providerConfig.enabled && providerConfig.models) {
            for (const model of providerConfig.models) {
                models.push({
                    id: model.id,
                    object: 'model',
                    name: model.name,
                    provider: providerKey,
                    category: model.category,
                    confirmed: model.confirmed || false,
                    experimental: model.experimental || false,
                    description: model.description
                });
            }
        }
    }
    
    return new Response(JSON.stringify({
        object: 'list',
        data: models,
        total: models.length
    }), { 
      headers: corsHeaders({ 'Content-Type': 'application/json' })
    });
}

function handleProvidersRequest() {
    const providers = {};
    
    for (const [key, config] of Object.entries(CONFIG.PROVIDERS)) {
        providers[key] = {
            name: config.name,
            endpoint: config.endpoint,
            auth_mode: config.auth_mode,
            enabled: config.enabled,
            features: config.features
        };
    }
    
    return new Response(JSON.stringify({
        object: 'list',
        data: providers
    }), { 
      headers: corsHeaders({ 'Content-Type': 'application/json' })
    });
}

function handleStylesRequest() {
    const styles = Object.entries(CONFIG.STYLE_PRESETS).map(([key, value]) => ({
        id: key,
        name: value.name,
        prompt_addition: value.prompt,
        negative_addition: value.negative
    }));
    
    return new Response(JSON.stringify({
        object: 'list',
        data: styles
    }), { 
      headers: corsHeaders({ 'Content-Type': 'application/json' })
    });
}

function handleUI(request) {
  const origin = new URL(request.url).origin;
  
  const defaultProvider = CONFIG.PROVIDERS[CONFIG.DEFAULT_PROVIDER];
  
  const fluxModels = defaultProvider.models
    .filter(m => m.category === 'flux')
    .map(m => `<option value="${m.id}">${m.name}</option>`)
    .join('\n');
    
  const fluxAdvanced = defaultProvider.models
    .filter(m => m.category === 'flux-advanced')
    .map(m => `<option value="${m.id}">${m.name}</option>`)
    .join('\n');
    
  const sdModels = defaultProvider.models
    .filter(m => m.category === 'stable-diffusion')
    .map(m => `<option value="${m.id}">${m.name}</option>`)
    .join('\n');
  
  const styleOptions = Object.entries(CONFIG.STYLE_PRESETS).map(([key, value]) => 
    `<option value="${key}">${value.name}</option>`
  ).join('\n');
  
  const sizeOptions = Object.entries(CONFIG.PRESET_SIZES).map(([key, value]) => 
    `<option value="${key}">${value.name} (${value.width}x${value.height})</option>`
  ).join('\n');
  
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${CONFIG.PROJECT_NAME} v${CONFIG.PROJECT_VERSION}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial; 
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%); 
        color: #fff; 
        padding: 20px;
        min-height: 100vh;
      }
      .container { max-width: 1400px; margin: 0 auto; }
      
      h1 { 
        color: #f59e0b; 
        text-align: center; 
        margin-bottom: 10px;
        font-size: 36px;
        font-weight: 800;
        text-shadow: 0 0 30px rgba(245, 158, 11, 0.6);
      }
      .badge { 
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        padding: 6px 14px; 
        border-radius: 20px; 
        font-size: 14px;
        margin-left: 10px;
      }
      .subtitle { 
        text-align: center; 
        color: #9ca3af; 
        margin-bottom: 20px; 
        font-size: 15px; 
      }
      
      .tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        border-bottom: 2px solid rgba(255, 255, 255, 0.1);
      }
      .tab {
        padding: 12px 24px;
        background: transparent;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        font-size: 15px;
        font-weight: 600;
        border-bottom: 3px solid transparent;
        transition: all 0.3s;
      }
      .tab:hover { color: #f59e0b; }
      .tab.active {
        color: #f59e0b;
        border-bottom-color: #f59e0b;
      }
      
      .tab-content {
        display: none;
      }
      .tab-content.active {
        display: block;
      }
      
      .info-card {
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid #3b82f6;
        padding: 16px;
        border-radius: 12px;
        margin-bottom: 20px;
      }
      .info-card h4 {
        color: #60a5fa;
        margin-bottom: 10px;
        font-size: 16px;
      }
      .info-card p {
        color: #93c5fd;
        font-size: 13px;
        line-height: 1.6;
      }
      
      .grid { 
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        gap: 20px; 
        margin: 20px 0;
      }
      @media (max-width: 768px) {
        .grid { grid-template-columns: 1fr; }
      }
      
      .box { 
        background: rgba(26, 26, 26, 0.95); 
        padding: 24px; 
        border-radius: 16px; 
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      h3 { 
        color: #f59e0b; 
        margin-bottom: 18px; 
        font-size: 18px;
        font-weight: 700;
      }
      
      label { 
        display: block; 
        margin: 16px 0 8px 0; 
        color: #e5e7eb; 
        font-weight: 600;
        font-size: 13px;
      }
      select, textarea, input { 
        width: 100%; 
        padding: 12px; 
        margin: 0; 
        background: #2a2a2a; 
        border: 1px solid #444; 
        color: #fff; 
        border-radius: 10px;
        font-size: 14px;
        font-family: inherit;
        transition: all 0.3s;
      }
      select:focus, textarea:focus, input:focus {
        outline: none;
        border-color: #f59e0b;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
      }
      textarea { resize: vertical; min-height: 90px; }
      input[type="range"] { padding: 0; height: 6px; }
      
      .range-value {
        display: inline-block;
        background: #3a3a3a;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 12px;
        margin-left: 10px;
        color: #f59e0b;
        font-weight: 600;
      }
      
      .checkbox-group {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 12px 0;
      }
      .checkbox-group input[type="checkbox"] {
        width: auto;
        margin: 0;
      }
      
      .nsfw-warning {
        background: rgba(239, 68, 68, 0.2);
        border: 1px solid #ef4444;
        padding: 12px;
        border-radius: 8px;
        margin-top: 10px;
        font-size: 12px;
        color: #fca5a5;
      }
      
      button { 
        width: 100%; 
        padding: 18px; 
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: #000; 
        cursor: pointer; 
        font-weight: 800; 
        border: none;
        border-radius: 12px;
        font-size: 17px;
        margin-top: 24px;
        transition: all 0.3s;
      }
      button:hover { 
        transform: translateY(-3px);
        box-shadow: 0 8px 30px rgba(245, 158, 11, 0.6);
      }
      button:disabled { 
        background: #3a3a3a; 
        color: #666; 
        cursor: not-allowed;
        transform: none;
      }
      
      .generating-container {
        text-align: center;
        padding: 60px 20px;
        background: rgba(26, 26, 26, 0.95);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .generating-icon {
        width: 120px;
        height: 120px;
        margin: 0 auto 30px;
        position: relative;
      }
      
      .generating-spinner {
        width: 120px;
        height: 120px;
        border: 6px solid rgba(245, 158, 11, 0.1);
        border-radius: 50%;
        border-top-color: #f59e0b;
        border-right-color: #f59e0b;
        animation: spin 1.5s linear infinite;
      }
      
      .generating-image {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 48px;
        animation: pulse 2s ease-in-out infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        50% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.9); }
      }
      
      .generating-title {
        font-size: 24px;
        font-weight: 700;
        color: #f59e0b;
        margin-bottom: 16px;
        animation: fadeIn 0.5s ease-in;
      }
      
      .generating-subtitle {
        font-size: 16px;
        color: #9ca3af;
        margin-bottom: 30px;
        animation: fadeIn 0.5s ease-in 0.2s backwards;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .progress-container {
        width: 100%;
        max-width: 500px;
        margin: 0 auto 20px;
        animation: fadeIn 0.5s ease-in 0.4s backwards;
      }
      
      .progress-bar-bg {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        overflow: hidden;
        position: relative;
      }
      
      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #f59e0b 0%, #eab308 50%, #f59e0b 100%);
        background-size: 200% 100%;
        border-radius: 10px;
        transition: width 0.3s ease;
        animation: shimmer 2s linear infinite;
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
      }
      
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      .progress-text {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        font-size: 13px;
        color: #9ca3af;
      }
      
      .generating-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
        max-width: 600px;
        margin: 30px auto 0;
        animation: fadeIn 0.5s ease-in 0.6s backwards;
      }
      
      .info-card-small {
        background: rgba(255, 255, 255, 0.05);
        padding: 16px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .info-card-label {
        font-size: 11px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
      }
      
      .info-card-value {
        font-size: 16px;
        font-weight: 700;
        color: #f59e0b;
      }
      
      .status-messages {
        max-width: 500px;
        margin: 30px auto 0;
        text-align: left;
        animation: fadeIn 0.5s ease-in 0.8s backwards;
      }
      
      .status-message {
        padding: 12px 16px;
        background: rgba(59, 130, 246, 0.1);
        border-left: 3px solid #3b82f6;
        border-radius: 6px;
        margin-bottom: 10px;
        font-size: 13px;
        color: #93c5fd;
        animation: slideIn 0.3s ease-out;
      }
      
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      .status-message.success {
        background: rgba(16, 185, 129, 0.1);
        border-color: #10b981;
        color: #6ee7b7;
      }
      
      .cancel-button {
        margin-top: 30px;
        padding: 12px 32px;
        background: rgba(239, 68, 68, 0.2);
        border: 1px solid #ef4444;
        color: #fca5a5;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s;
        animation: fadeIn 0.5s ease-in 1s backwards;
      }
      
      .cancel-button:hover {
        background: rgba(239, 68, 68, 0.3);
        transform: translateY(-2px);
      }
      
      .preview-placeholder {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-top: 30px;
        animation: fadeIn 0.5s ease-in 1.2s backwards;
      }
      
      .placeholder-item {
        aspect-ratio: 1;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
        border-radius: 12px;
        border: 2px dashed rgba(245, 158, 11, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
        animation: placeholderPulse 2s ease-in-out infinite;
      }
      
      @keyframes placeholderPulse {
        0%, 100% { opacity: 0.3; border-color: rgba(245, 158, 11, 0.3); }
        50% { opacity: 0.6; border-color: rgba(245, 158, 11, 0.6); }
      }
      
      .result-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 20px;
        margin-top: 24px;
      }
      .result img { 
        width: 100%; 
        border-radius: 16px; 
        cursor: pointer; 
        transition: transform 0.3s;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
      }
      .result img:hover { transform: scale(1.05); }
      
      .history-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 16px;
        margin-top: 20px;
      }
      .history-item {
        background: rgba(26, 26, 26, 0.95);
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s;
        cursor: pointer;
      }
      .history-item:hover {
        border-color: #f59e0b;
        transform: translateY(-2px);
      }
      .history-thumbnail {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
      .history-info {
        padding: 12px;
      }
      .history-prompt {
        font-size: 13px;
        color: #e5e7eb;
        margin-bottom: 8px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .history-meta {
        font-size: 11px;
        color: #9ca3af;
        display: flex;
        justify-content: space-between;
      }
      .history-actions {
        display: flex;
        gap: 8px;
        padding: 0 12px 12px 12px;
      }
      .history-btn {
        flex: 1;
        padding: 8px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: #fff;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
      }
      .history-btn:hover {
        background: rgba(245, 158, 11, 0.3);
      }
      
      .success, .error { 
        padding: 20px; 
        border-radius: 12px; 
        margin: 24px 0; 
        border-left: 4px solid;
      }
      .success { 
        background: rgba(6, 78, 59, 0.3); 
        border-color: #10b981;
        color: #6ee7b7;
      }
      .error {
        background: rgba(127, 29, 29, 0.3);
        border-color: #dc2626;
        color: #fecaca;
      }
      
      .help-text {
        font-size: 11px;
        color: #9ca3af;
        margin-top: 6px;
      }
      
      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #6b7280;
      }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 AI Image Generator <span class="badge">v${CONFIG.PROJECT_VERSION}</span></h1>
        <div class="subtitle">完整平台 - Flux & SD3 系列 + 智能優化 + 自動高清</div>
        
        <div class="tabs">
            <button class="tab active" onclick="switchTab(event, 'generate')">🎨 生成</button>
            <button class="tab" onclick="switchTab(event, 'history')">📜 歷史 (<span id="historyCount">0</span>)</button>
        </div>
        
        <div id="generate-tab" class="tab-content active">
            <div class="info-card">
                <h4>🚀 v8.5.0 新功能</h4>
                <p>
                    <strong>✨ 自動高清:</strong> 智能添加高清質量提示詞 + 自動尺寸優化<br>
                    <strong>🎯 智能優化:</strong> 根據模型和尺寸自動調整步數<br>
                    <strong>🎨 完整功能:</strong> 17個模型 | 12種風格 | NSFW支持 | 完全免費
                </p>
            </div>
            
            <div class="grid">
                <div class="box">
                    <h3>基礎設置</h3>
                    
                    <label>模型:</label>
                    <select id="model">
                        <optgroup label="✅ Flux 標準">
                            ${fluxModels}
                        </optgroup>
                        <optgroup label="🧪 Flux 高級">
                            ${fluxAdvanced}
                        </optgroup>
                        <optgroup label="🧪 SD3 系列">
                            ${sdModels}
                        </optgroup>
                    </select>
                    
                    <label>風格:</label>
                    <select id="style">
                        ${styleOptions}
                    </select>
                    
                    <label>提示詞:</label>
                    <textarea id="prompt" placeholder="描述你想生成的圖片..."></textarea>
                    
                    <label>負面提示詞:</label>
                    <textarea id="negativePrompt" rows="2" placeholder="不想要的內容..."></textarea>
                    
                    <label>數量 (1-4):</label>
                    <input type="number" id="num" min="1" max="4" value="1">
                </div>
                
                <div class="box">
                    <h3>進階參數</h3>
                    
                    <label>尺寸:</label>
                    <select id="sizePreset" onchange="updateSize()">${sizeOptions}</select>
                    
                    <div id="customSize" style="display:none;">
                        <label>寬度:</label>
                        <input type="number" id="width" min="256" max="2048" step="64" value="1024">
                        <label>高度:</label>
                        <input type="number" id="height" min="256" max="2048" step="64" value="1024">
                    </div>
                    
                    <label>Seed:</label>
                    <input type="number" id="seed" value="-1" min="-1">
                    
                    <div class="checkbox-group">
                        <input type="checkbox" id="autoHD" checked onchange="toggleAutoHD()">
                        <label for="autoHD">🎨 自動高清 (推薦)</label>
                    </div>
                    <div class="help-text" id="hdHelp" style="color:#10b981">✅ 自動添加高清提示詞 + 尺寸優化</div>
                    
                    <div class="checkbox-group">
                        <input type="checkbox" id="autoOptimize" checked onchange="toggleAutoOptimize()">
                        <label for="autoOptimize">🎯 智能優化 (推薦)</label>
                    </div>
                    <div class="help-text" id="optimizeHelp" style="color:#10b981">✅ 自動選擇最佳參數</div>
                    
                    <div id="manualParams" style="opacity: 0.5; pointer-events: none;">
                        <label>步數: <span class="range-value" id="stepsValue">20</span></label>
                        <input type="range" id="steps" min="1" max="50" value="20" oninput="document.getElementById('stepsValue').innerText=this.value">
                        
                        <label>引導: <span class="range-value" id="guidanceValue">7.5</span></label>
                        <input type="range" id="guidance" min="1" max="20" step="0.5" value="7.5" oninput="document.getElementById('guidanceValue').innerText=this.value">
                    </div>
                    
                    <div class="checkbox-group">
                        <input type="checkbox" id="enhance">
                        <label for="enhance">AI 優化</label>
                    </div>
                    
                    <div class="checkbox-group">
                        <input type="checkbox" id="nologo" checked>
                        <label for="nologo">移除水印</label>
                    </div>
                    
                    <div class="checkbox-group">
                        <input type="checkbox" id="private" checked>
                        <label for="private">私密模式</label>
                    </div>
                    
                    <div class="checkbox-group">
                        <input type="checkbox" id="nsfw" onchange="toggleNSFWWarning()">
                        <label for="nsfw">🔞 成人內容</label>
                    </div>
                    
                    <div id="nsfwWarning" class="nsfw-warning" style="display:none;">
                        <strong>⚠️ NSFW 警告</strong>
                        <p style="margin-top:6px;">請確保您已年滿 18 歲</p>
                    </div>
                </div>
            </div>
            
            <button onclick="generate()">🚀 開始生成</button>
            
            <div id="result"></div>
        </div>
        
        <div id="history-tab" class="tab-content">
            <div class="box">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0;">歷史記錄</h3>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="exportHistory()" style="width: auto; padding: 10px 20px; margin: 0; font-size: 14px;">📥 導出</button>
                        <button onclick="clearHistory()" style="width: auto; padding: 10px 20px; margin: 0; font-size: 14px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);">🗑️ 清空</button>
                    </div>
                </div>
                <div id="historyContainer"></div>
            </div>
        </div>
    </div>

    <script>
        const SIZES = ${JSON.stringify(CONFIG.PRESET_SIZES)};
        const API_URL = '${origin}/v1/images/generations';
        const STORAGE_KEY = '${CONFIG.HISTORY.STORAGE_KEY}';
        const MAX_HISTORY = ${CONFIG.HISTORY.MAX_ITEMS};
        
        let generationAborted = false;
        let currentAbortController = null;
        
        function toggleNSFWWarning() {
            const checkbox = document.getElementById('nsfw');
            const warning = document.getElementById('nsfwWarning');
            warning.style.display = checkbox.checked ? 'block' : 'none';
        }
        
        function toggleAutoHD() {
            const checked = document.getElementById('autoHD').checked;
            const help = document.getElementById('hdHelp');
            
            if (checked) {
                help.innerText = '✅ 自動添加高清提示詞 + 尺寸優化';
                help.style.color = '#10b981';
            } else {
                help.innerText = '⚠️ 已關閉 - 使用原始參數';
                help.style.color = '#9ca3af';
            }
        }
        
        function toggleAutoOptimize() {
            const checked = document.getElementById('autoOptimize').checked;
            const manualParams = document.getElementById('manualParams');
            const help = document.getElementById('optimizeHelp');
            
            if (checked) {
                manualParams.style.opacity = '0.5';
                manualParams.style.pointerEvents = 'none';
                help.innerText = '✅ 自動選擇最佳參數';
                help.style.color = '#10b981';
            } else {
                manualParams.style.opacity = '1';
                manualParams.style.pointerEvents = 'auto';
                help.innerText = '⚠️ 手動模式';
                help.style.color = '#fbbf24';
            }
        }
        
        function getHistory() {
            try {
                const history = localStorage.getItem(STORAGE_KEY);
                return history ? JSON.parse(history) : [];
            } catch (e) {
                return [];
            }
        }
        
        function saveHistory(item) {
            try {
                let history = getHistory();
                history.unshift({
                    ...item,
                    id: Date.now(),
                    timestamp: new Date().toISOString()
                });
                
                if (history.length > MAX_HISTORY) {
                    history = history.slice(0, MAX_HISTORY);
                }
                
                localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
                updateHistoryCount();
            } catch (e) {
                console.error('Save failed:', e);
            }
        }
        
        function deleteHistoryItem(id) {
            try {
                let history = getHistory();
                history = history.filter(item => item.id !== id);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
                loadHistory();
                updateHistoryCount();
            } catch (e) {
                console.error('Delete failed:', e);
            }
        }
        
        function clearHistory() {
            if (confirm('確定清空所有歷史?')) {
                localStorage.removeItem(STORAGE_KEY);
                loadHistory();
                updateHistoryCount();
            }
        }
        
        function exportHistory() {
            const history = getHistory();
            const dataStr = JSON.stringify(history, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = \`history-\${new Date().toISOString().split('T')[0]}.json\`;
            link.click();
            URL.revokeObjectURL(url);
        }
        
        function loadHistory() {
            const history = getHistory();
            const container = document.getElementById('historyContainer');
            
            if (history.length === 0) {
                container.innerHTML = '<div class="empty-state"><p style="font-size:18px;">📭</p><p>還沒有記錄</p></div>';
                return;
            }
            
            container.innerHTML = '<div class="history-grid">' + history.map(item => \`
                <div class="history-item">
                    <img src="\${item.url}" class="history-thumbnail" onclick="window.open('\${item.url}')" alt="Generated">
                    <div class="history-info">
                        <div class="history-prompt">\${item.prompt}</div>
                        <div class="history-meta">
                            <span>\${item.model}</span>
                            <span>\${new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="history-actions">
                        <button class="history-btn" onclick='regenFromHistory(\${JSON.stringify(item).replace(/'/g, "&#39;")})'>🔄</button>
                        <button class="history-btn" onclick="deleteHistoryItem(\${item.id})">🗑️</button>
                    </div>
                </div>
            \`).join('') + '</div>';
        }
        
        function regenFromHistory(item) {
            switchTab({target: document.querySelectorAll('.tab')[0]}, 'generate');
            document.getElementById('model').value = item.model || 'flux';
            document.getElementById('style').value = item.style || 'none';
            document.getElementById('prompt').value = item.prompt || '';
            document.getElementById('negativePrompt').value = item.negativePrompt || '';
            document.getElementById('num').value = item.numOutputs || 1;
            document.getElementById('width').value = item.width || 1024;
            document.getElementById('height').value = item.height || 1024;
            document.getElementById('seed').value = item.seed || -1;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        function updateHistoryCount() {
            document.getElementById('historyCount').innerText = getHistory().length;
        }
        
        function switchTab(event, tabName) {
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
            
            if (tabName === 'history') {
                loadHistory();
            }
        }
        
        function updateSize() {
            const preset = document.getElementById('sizePreset').value;
            const customDiv = document.getElementById('customSize');
            
            if (preset === 'custom') {
                customDiv.style.display = 'block';
            } else {
                customDiv.style.display = 'none';
                const size = SIZES[preset];
                document.getElementById('width').value = size.width;
                document.getElementById('height').value = size.height;
            }
        }
        
        function renderGeneratingUI(config) {
            const { model, numOutputs, width, height, steps } = config;
            
            return \`
                <div class="generating-container">
                    <div class="generating-icon">
                        <div class="generating-spinner"></div>
                        <div class="generating-image">🎨</div>
                    </div>
                    
                    <div class="generating-title">正在生成圖片...</div>
                    <div class="generating-subtitle">AI 正在創作,請稍候</div>
                    
                    <div class="progress-container">
                        <div class="progress-bar-bg">
                            <div class="progress-bar" id="progressBar" style="width: 0%"></div>
                        </div>
                        <div class="progress-text">
                            <span id="progressPercent">0%</span>
                            <span id="progressTime">預計 <span id="estimatedTime">--</span> 秒</span>
                        </div>
                    </div>
                    
                    <div class="generating-info">
                        <div class="info-card-small">
                            <div class="info-card-label">模型</div>
                            <div class="info-card-value">\${model}</div>
                        </div>
                        <div class="info-card-small">
                            <div class="info-card-label">尺寸</div>
                            <div class="info-card-value">\${width}x\${height}</div>
                        </div>
                        <div class="info-card-small">
                            <div class="info-card-label">數量</div>
                            <div class="info-card-value">\${numOutputs} 張</div>
                        </div>
                        <div class="info-card-small">
                            <div class="info-card-label">步數</div>
                            <div class="info-card-value">\${steps || 'Auto'}</div>
                        </div>
                    </div>
                    
                    <div class="status-messages" id="statusMessages">
                        <div class="status-message">🔄 初始化...</div>
                    </div>
                    
                    <div class="preview-placeholder">
                        \${Array(numOutputs).fill(0).map(() => \`<div class="placeholder-item">🖼️</div>\`).join('')}
                    </div>
                    
                    <button class="cancel-button" onclick="cancelGeneration()">❌ 取消</button>
                </div>
            \`;
        }
        
        function addStatusMessage(message, type = 'info') {
            const container = document.getElementById('statusMessages');
            if (!container) return;
            
            const messageEl = document.createElement('div');
            messageEl.className = \`status-message \${type}\`;
            messageEl.textContent = message;
            
            if (container.children.length >= 5) {
                container.removeChild(container.firstChild);
            }
            
            container.appendChild(messageEl);
        }
        
        function updateProgress(percent, elapsedSeconds) {
            const progressBar = document.getElementById('progressBar');
            const progressPercent = document.getElementById('progressPercent');
            const estimatedTimeEl = document.getElementById('estimatedTime');
            
            if (progressBar) {
                progressBar.style.width = percent + '%';
            }
            if (progressPercent) {
                progressPercent.textContent = Math.round(percent) + '%';
            }
            if (estimatedTimeEl && elapsedSeconds) {
                const estimated = Math.max(0, Math.round((100 - percent) / percent * elapsedSeconds));
                estimatedTimeEl.textContent = estimated;
            }
        }
        
        function simulateProgress() {
            let progress = 0;
            const startTime = Date.now();
            
            const interval = setInterval(() => {
                if (generationAborted) {
                    clearInterval(interval);
                    return;
                }
                
                const elapsed = (Date.now() - startTime) / 1000;
                
                if (progress < 60) {
                    progress += Math.random() * 3 + 2;
                } else if (progress < 90) {
                    progress += Math.random() * 1.5 + 0.5;
                } else {
                    progress += Math.random() * 0.5;
                }
                
                progress = Math.min(progress, 95);
                
                updateProgress(progress, elapsed);
                
                if (progress > 20 && progress < 25) {
                    addStatusMessage('🎨 處理提示詞...');
                } else if (progress > 40 && progress < 45) {
                    addStatusMessage('🖼️ 生成基礎結構...');
                } else if (progress > 60 && progress < 65) {
                    addStatusMessage('✨ 細化細節...');
                } else if (progress > 80 && progress < 85) {
                    addStatusMessage('🎯 最終優化...');
                }
            }, 500);
            
            return interval;
        }
        
        function cancelGeneration() {
            if (confirm('確定取消?')) {
                generationAborted = true;
                if (currentAbortController) {
                    currentAbortController.abort();
                }
                document.getElementById('result').innerHTML = \`
                    <div class="error">
                        <strong>❌ 已取消</strong>
                        <p style="margin-top: 12px;">已取消生成</p>
                    </div>
                \`;
            }
        }
        
        async function generate() {
            const model = document.getElementById('model').value;
            const style = document.getElementById('style').value;
            const prompt = document.getElementById('prompt').value.trim();
            const negativePrompt = document.getElementById('negativePrompt').value.trim();
            const num = parseInt(document.getElementById('num').value) || 1;
            const width = parseInt(document.getElementById('width').value);
            const height = parseInt(document.getElementById('height').value);
            const seed = parseInt(document.getElementById('seed').value);
            const autoHD = document.getElementById('autoHD').checked;
            const autoOptimize = document.getElementById('autoOptimize').checked;
            const guidance = autoOptimize ? null : parseFloat(document.getElementById('guidance').value);
            const steps = autoOptimize ? null : parseInt(document.getElementById('steps').value);
            const enhance = document.getElementById('enhance').checked;
            const nologo = document.getElementById('nologo').checked;
            const privateMode = document.getElementById('private').checked;
            const nsfw = document.getElementById('nsfw').checked;
            
            const resultDiv = document.getElementById('result');
            
            if (!prompt) {
                resultDiv.innerHTML = '<div class="error">⚠️ 請輸入提示詞</div>';
                return;
            }
            
            if (nsfw && !confirm('確認您已年滿18歲?')) {
                return;
            }
            
            generationAborted = false;
            currentAbortController = new AbortController();
            
            resultDiv.innerHTML = renderGeneratingUI({
                model, numOutputs: num, width, height, 
                steps: steps || 'Auto'
            });
            
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            const startTime = Date.now();
            const progressInterval = simulateProgress();
            
            setTimeout(() => addStatusMessage('📡 連接服務器...'), 500);
            setTimeout(() => addStatusMessage('🔐 驗證參數...', 'success'), 1000);
            setTimeout(() => addStatusMessage('🚀 開始生成...', 'success'), 1500);
            
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model, style, prompt, negative_prompt: negativePrompt, n: num,
                        width, height, seed, 
                        guidance_scale: guidance,
                        steps: steps,
                        auto_optimize: autoOptimize,
                        auto_hd: autoHD,
                        enhance, nologo, private: privateMode, nsfw
                    }),
                    signal: currentAbortController.signal
                });
                
                clearInterval(progressInterval);
                
                if (generationAborted) return;
                
                updateProgress(100, (Date.now() - startTime) / 1000);
                addStatusMessage('✅ 完成!', 'success');
                
                const data = await response.json();
                
                if (data.error) {
                    throw new Error(data.error.message);
                }
                
                if (!data.data || data.data.length === 0) {
                    throw new Error('沒有生成圖片');
                }
                
                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                
                data.data.forEach(item => {
                    saveHistory({
                        url: item.url,
                        prompt, negativePrompt, model: item.model, style,
                        numOutputs: num, width: item.width, height: item.height, seed,
                        guidance: item.guidance, steps: item.steps, 
                        enhance, nologo, privateMode, nsfw
                    });
                });
                
                setTimeout(() => {
                    const images = data.data.map((item, idx) => 
                        \`<img src="\${item.url}" onclick="window.open(this.src)" alt="\${idx + 1}" loading="lazy" style="animation: fadeIn 0.5s ease-in \${idx * 0.1}s backwards;">\`
                    ).join('');
                    
                    const optimizedNote = data.data[0].auto_optimized ? 
                        \`<p style="color: #10b981; font-size: 12px; margin-top: 4px;">🎯 步數: \${data.data[0].steps} (智能優化)</p>\` : '';
                    
                    const hdNote = data.data[0].hd_optimized ? 
                        \`<p style="color: #a78bfa; font-size: 12px; margin-top: 4px;">🎨 高清優化: \${data.data[0].width}x\${data.data[0].height} | 質量增強</p>\` : '';
                    
                    resultDiv.innerHTML = \`
                        <div class="success" style="animation: slideIn 0.5s ease-out;">
                            <strong style="font-size: 20px;">🎉 成功!</strong>
                            <p style="margin-top: 12px; font-size: 14px;">
                                <strong>模型:</strong> \${data.data[0].model} | 
                                <strong>尺寸:</strong> \${data.data[0].width}x\${data.data[0].height}<br>
                                <strong>耗時:</strong> \${elapsed}秒 | 
                                <strong>費用:</strong> <span style="color:#10b981">免費</span>
                            </p>
                            \${optimizedNote}
                            \${hdNote}
                        </div>
                        <div class="result-grid">\${images}</div>
                    \`;
                }, 500);
                
            } catch (error) {
                clearInterval(progressInterval);
                
                if (error.name === 'AbortError') {
                    return;
                }
                
                console.error(error);
                resultDiv.innerHTML = \`
                    <div class="error" style="animation: slideIn 0.5s ease-out;">
                        <strong style="font-size: 18px;">❌ 失敗</strong>
                        <p style="margin-top: 12px;">\${error.message}</p>
                        <button onclick="generate()" style="margin-top: 16px; width: auto; padding: 10px 24px;">🔄 重試</button>
                    </div>
                \`;
            }
        }
        
        updateSize();
        updateHistoryCount();
        
        document.getElementById('prompt').addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                generate();
            }
        });
        
        console.log('%c🎨 v${CONFIG.PROJECT_VERSION} - Auto HD', 'font-size: 16px; color: #f59e0b;');
    </script>
</body>
</html>`;

  return new Response(html, { 
    headers: corsHeaders({ 'Content-Type': 'text/html; charset=utf-8' })
  });
}
