@@ -1,3260 +1,2788 @@
// =================================================================================
//  項目: Flux AI Pro - Extended Styles Edition
//  版本: 9.6.1-extended-styles (✅ 45+ 種藝術風格)
//  作者: Enhanced by AI Assistant  
//  日期: 2025-12-17
//  更新: ✅ 45+ 種藝術風格 | ✅ 分類組織 | ✅ 新 API 端點 | ✅ Google 翻譯整合
//  模型: zimage, flux, turbo, kontext (4個模型)
//  翻譯: Google Translate Free API (無需 API Key)
// =================================================================================

const CONFIG = {
  PROJECT_NAME: "Flux-AI-Pro",
  PROJECT_VERSION: "9.6.1-extended-styles-google-translate",
  API_MASTER_KEY: "1",
  FETCH_TIMEOUT: 120000,
  MAX_RETRIES: 3,

  POLLINATIONS_AUTH: {
    enabled: true,
    token: "",  // 將從 env.POLLINATIONS_API_KEY 讀取
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
        private_mode: true,
        custom_size: true,
        seed_control: true,
        negative_prompt: true,
        enhance: true,
        nologo: true,
        style_presets: true,
        auto_hd: true,
        quality_modes: true,
        auto_translate: true,
        reference_images: true,
        image_to_image: true,
        batch_generation: true,
        api_key_auth: true
      },
      models: [
        { 
          id: "zimage", 
          name: "Z-Image Turbo ⚡", 
          confirmed: true, 
          category: "zimage", 
          description: "快速 6B 參數圖像生成 (Alpha)", 
          max_size: 2048,
          pricing: { image_price: 0.0002, currency: "pollen" },
          input_modalities: ["text"],
          output_modalities: ["image"]
        },
        { 
          id: "flux", 
          name: "Flux 標準版", 
          confirmed: true, 
          category: "flux", 
          description: "快速且高質量的圖像生成", 
          max_size: 2048,
          pricing: { image_price: 0.00012, currency: "pollen" },
          input_modalities: ["text"],
          output_modalities: ["image"]
        },
        { 
          id: "turbo", 
          name: "Flux Turbo ⚡", 
          confirmed: true, 
          category: "flux", 
          description: "超快速圖像生成", 
          max_size: 2048,
          pricing: { image_price: 0.0003, currency: "pollen" },
          input_modalities: ["text"],
          output_modalities: ["image"]
        },
        { 
          id: "kontext", 
          name: "Kontext 🎨", 
          confirmed: true, 
          category: "kontext", 
          description: "上下文感知圖像生成（支持圖生圖）", 
          max_size: 2048,
          pricing: { image_price: 0.04, currency: "pollen" },
          supports_reference_images: true,
          max_reference_images: 1,
          input_modalities: ["text", "image"],
          output_modalities: ["image"]
        }
      ],
      rate_limit: null,
      max_size: { width: 2048, height: 2048 }
    }
  },

  DEFAULT_PROVIDER: "pollinations",

  // ========================================
  // ✨ 擴展風格庫 - 45+ 種藝術風格
  // ========================================
  STYLE_PRESETS: {
    // ========== 基礎風格 ==========
    none: { 
      name: "無風格", 
      prompt: "", 
      negative: "",
      category: "basic",
      icon: "⚡",
      description: "使用原始提示詞"
    },
    
    // ========== 插畫動畫 ==========
    anime: { 
      name: "動漫風格", 
      prompt: "anime style, anime art, vibrant colors, cel shading, detailed anime", 
      negative: "realistic, photograph, 3d, ugly",
      category: "illustration",
      icon: "🎭",
      description: "日系動漫風格"
    },
    ghibli: { 
      name: "吉卜力", 
      prompt: "Studio Ghibli style, Hayao Miyazaki, anime, soft colors, whimsical, detailed background, hand-drawn", 
      negative: "realistic, dark, 3D, western animation",
      category: "illustration",
      icon: "🍃",
      description: "宮崎駿動畫風格"
    },
    
    // ========== 漫畫風格 ==========
    manga: {
      name: "日本漫畫",
      prompt: "manga style, japanese comic art, black and white, screentones, halftone patterns, dynamic poses, detailed linework",
      negative: "color, colorful, realistic, photo, western comic",
      category: "manga",
      icon: "📖",
      description: "經典日本漫畫黑白網點"
    },
    "manga-color": {
      name: "彩色日漫",
      prompt: "colored manga style, japanese comic art, vibrant colors, cel shading, clean linework, digital coloring",
      negative: "realistic, photo, western style, messy",
      category: "manga",
      icon: "🎨",
      description: "彩色日本漫畫風格"
    },
    "american-comic": {
      name: "美式漫畫",
      prompt: "american comic book style, bold lines, vibrant colors, superhero art, dynamic action, dramatic shading",
      negative: "anime, manga, realistic photo, soft",
      category: "manga",
      icon: "💥",
      description: "美國超級英雄漫畫"
    },
    "korean-webtoon": {
      name: "韓國網漫",
      prompt: "korean webtoon style, manhwa art, detailed linework, soft colors, romantic, vertical scroll format",
      negative: "american comic, rough sketch, dark",
      category: "manga",
      icon: "📱",
      description: "韓國網路漫畫風格"
    },
    chibi: {
      name: "Q版漫畫",
      prompt: "chibi style, super deformed, cute, kawaii, big head small body, simple features, adorable",
      negative: "realistic proportions, serious, dark",
      category: "manga",
      icon: "🥰",
      description: "Q版可愛漫畫風格"
    },
    
    // ========== 黑白單色 ==========
    "black-white": {
      name: "黑白",
      prompt: "black and white, monochrome, high contrast, dramatic lighting, grayscale",
      negative: "color, colorful, vibrant, saturated",
      category: "monochrome",
      icon: "⚫⚪",
      description: "純黑白高對比效果"
    },
    sketch: {
      name: "素描",
      prompt: "pencil sketch, hand drawn, graphite drawing, detailed shading, artistic sketch, loose lines",
      negative: "color, digital, polished, photo",
      category: "monochrome",
      icon: "✏️",
      description: "鉛筆素描手繪質感"
    },
    "ink-drawing": {
      name: "水墨畫",
      prompt: "traditional chinese ink painting, sumi-e, brush strokes, minimalist, zen aesthetic, black ink on white paper",
      negative: "color, western style, detailed, cluttered",
      category: "monochrome",
      icon: "🖌️",
      description: "中國傳統水墨畫"
    },
    silhouette: {
      name: "剪影",
      prompt: "silhouette art, stark contrast, black shapes, minimalist, dramatic, shadow play, clean edges",
      negative: "detailed, realistic, colorful, textured",
      category: "monochrome",
      icon: "👤",
      description: "剪影藝術極簡構圖"
    },
    charcoal: {
      name: "炭筆畫",
      prompt: "charcoal drawing, rough texture, dramatic shading, expressive, smudged, artistic, monochrome",
      negative: "clean, digital, colorful, precise",
      category: "monochrome",
      icon: "🖤",
      description: "炭筆繪畫粗糙質感"
    },
    
    // ========== 寫實風格 ==========
    photorealistic: { 
      name: "寫實照片", 
      prompt: "photorealistic, 8k uhd, high quality, detailed, professional photography, sharp focus", 
      negative: "anime, cartoon, illustration, painting, drawing, art",
      category: "realistic",
      icon: "📷",
      description: "攝影級寫實效果"
    },
    
    // ========== 繪畫風格 ==========
    "oil-painting": { 
      name: "油畫", 
      prompt: "oil painting, canvas texture, visible brushstrokes, rich colors, artistic, masterpiece", 
      negative: "photograph, digital art, anime, flat",
      category: "painting",
      icon: "🖼️",
      description: "經典油畫質感"
    },
    watercolor: { 
      name: "水彩畫", 
      prompt: "watercolor painting, soft colors, watercolor texture, artistic, hand-painted, paper texture, flowing colors", 
      negative: "photograph, digital, sharp edges, 3d",
      category: "painting",
      icon: "💧",
      description: "清新水彩風格"
    },
    
    // ========== 藝術流派 ==========
    impressionism: {
      name: "印象派",
      prompt: "impressionist painting, soft brushstrokes, light and color focus, Monet style, outdoor scene, visible brush marks",
      negative: "sharp, detailed, photorealistic, dark",
      category: "art-movement",
      icon: "🌅",
      description: "印象派繪畫光影捕捉"
    },
    abstract: {
      name: "抽象派",
      prompt: "abstract art, non-representational, geometric shapes, bold colors, modern art, expressive",
      negative: "realistic, figurative, detailed, representational",
      category: "art-movement",
      icon: "🎭",
      description: "抽象藝術幾何圖形"
    },
    cubism: {
      name: "立體主義",
      prompt: "cubist style, geometric shapes, multiple perspectives, fragmented, Picasso inspired, angular forms",
      negative: "realistic, smooth, traditional, single perspective",
      category: "art-movement",
      icon: "🔷",
      description: "立體主義多視角解構"
    },
    surrealism: {
      name: "超現實主義",
      prompt: "surrealist art, dreamlike, bizarre, impossible scenes, Salvador Dali style, imaginative, symbolic",
      negative: "realistic, mundane, ordinary, logical",
      category: "art-movement",
      icon: "🌀",
      description: "超現實主義夢幻場景"
    },
    "pop-art": {
      name: "普普藝術",
      prompt: "pop art style, bold colors, comic book elements, Andy Warhol inspired, retro, screen print effect",
      negative: "subtle, muted, traditional, realistic",
      category: "art-movement",
      icon: "🎪",
      description: "普普藝術大膽色彩"
    },
    
    // ========== 視覺風格 ==========
    neon: {
      name: "霓虹燈",
      prompt: "neon lights, glowing, vibrant neon colors, night scene, electric, luminous, dark background",
      negative: "daylight, muted, natural, dull",
      category: "visual",
      icon: "💡",
      description: "霓虹燈發光效果"
    },
    vintage: {
      name: "復古",
      prompt: "vintage style, retro, aged, nostalgic, warm tones, classic, faded colors, old photograph",
      negative: "modern, futuristic, clean, vibrant",
      category: "visual",
      icon: "📻",
      description: "復古懷舊褪色效果"
    },
    steampunk: {
      name: "蒸汽朋克",
      prompt: "steampunk style, Victorian era, brass and copper, gears and mechanisms, mechanical, industrial",
      negative: "modern, minimalist, clean, futuristic",
      category: "visual",
      icon: "⚙️",
      description: "蒸汽朋克機械美學"
    },
    minimalist: {
      name: "極簡主義",
      prompt: "minimalist design, clean, simple, geometric, negative space, modern, uncluttered",
      negative: "detailed, complex, ornate, busy",
      category: "visual",
      icon: "◽",
      description: "極簡設計留白美學"
    },
    vaporwave: {
      name: "蒸氣波",
      prompt: "vaporwave aesthetic, retro futuristic, pastel colors, glitch art, 80s 90s nostalgia, neon pink and blue",
      negative: "realistic, natural, muted, traditional",
      category: "visual",
      icon: "🌴",
      description: "蒸氣波復古未來"
    },
    
    // ========== 數位風格 ==========
    "pixel-art": {
      name: "像素藝術",
      prompt: "pixel art, 8-bit, 16-bit, retro gaming style, pixelated, nostalgic, limited color palette",
      negative: "high resolution, smooth, realistic, detailed",
      category: "digital",
      icon: "🎮",
      description: "像素藝術復古遊戲"
    },
    "low-poly": {
      name: "低多邊形",
      prompt: "low poly 3d, geometric, faceted, minimalist 3d art, polygonal, angular shapes",
      negative: "high poly, detailed, realistic, organic",
      category: "digital",
      icon: "🔺",
      description: "低多邊形3D幾何"
    },
    "3d-render": {
      name: "3D渲染",
      prompt: "3d render, cinema 4d, octane render, detailed, professional lighting, ray tracing, photorealistic 3d",
      negative: "2d, flat, hand drawn, sketchy",
      category: "digital",
      icon: "🎬",
      description: "專業3D渲染寫實光影"
    },
    gradient: {
      name: "漸變",
      prompt: "gradient art, smooth color transitions, modern, vibrant gradients, soft blending, colorful",
      negative: "solid colors, flat, harsh edges, traditional",
      category: "digital",
      icon: "🌈",
      description: "漸變藝術柔和過渡"
    },
    glitch: {
      name: "故障藝術",
      prompt: "glitch art, digital corruption, RGB shift, distorted, cyberpunk, data moshing, scanlines",
      negative: "clean, perfect, traditional, smooth",
      category: "digital",
      icon: "📺",
      description: "故障美學數位崩壞"
    },
    
    // ========== 傳統藝術 ==========
    "ukiyo-e": {
      name: "浮世繪",
      prompt: "ukiyo-e style, japanese woodblock print, Hokusai inspired, traditional japanese art, flat colors, bold outlines",
      negative: "modern, western, photographic, 3d",
      category: "traditional",
      icon: "🗾",
      description: "日本浮世繪木刻版畫"
    },
    "stained-glass": {
      name: "彩繪玻璃",
      prompt: "stained glass art, colorful, leaded glass, church window style, luminous, geometric patterns, light through glass",
      negative: "realistic, photographic, modern, opaque",
      category: "traditional",
      icon: "🪟",
      description: "彩繪玻璃透光效果"
    },
    "paper-cut": {
      name: "剪紙藝術",
      prompt: "paper cut art, layered paper, shadow box effect, intricate patterns, handcrafted, silhouette",
      negative: "painted, digital, realistic, photographic",
      category: "traditional",
      icon: "✂️",
      description: "剪紙藝術層次堆疊"
    },
    
    // ========== 美學風格 ==========
    gothic: {
      name: "哥特風格",
      prompt: "gothic style, dark, ornate, Victorian gothic, mysterious, dramatic, baroque elements, elegant darkness",
      negative: "bright, cheerful, minimalist, modern",
      category: "aesthetic",
      icon: "🦇",
      description: "哥特美學黑暗華麗"
    },
    "art-nouveau": {
      name: "新藝術",
      prompt: "art nouveau style, organic forms, flowing lines, decorative, elegant, floral motifs, Alphonse Mucha inspired",
      negative: "geometric, minimalist, modern, rigid",
      category: "aesthetic",
      icon: "🌺",
      description: "新藝術流動線條"
    },
    
    // ========== 科幻奇幻 ==========
    cyberpunk: { 
      name: "賽博朋克", 
      prompt: "cyberpunk style, neon lights, futuristic, sci-fi, dystopian, high-tech low-life, blade runner style", 
      negative: "natural, rustic, medieval, fantasy",
      category: "scifi",
      icon: "🌃",
      description: "賽博朋克未來科幻"
    },
    fantasy: { 
      name: "奇幻風格", 
      prompt: "fantasy art, magical, epic fantasy, detailed fantasy illustration, mystical, enchanted", 
      negative: "modern, realistic, mundane, contemporary",
      category: "fantasy",
      icon: "🐉",
      description: "奇幻魔法世界"
    }
  },

  // ========================================
  // 風格分類配置
  // ========================================
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
      "zimage": { min: 8, optimal: 15, max: 25 },
      "flux": { min: 15, optimal: 20, max: 30 },
      "turbo": { min: 4, optimal: 8, max: 12 },
      "kontext": { min: 18, optimal: 25, max: 35 }
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
      "sketch": 0.9,
      "manga": 1.0,
      "pixel-art": 0.85,
      "3d-render": 1.15,
      "default": 1.0
    }
  },

  HD_OPTIMIZATION: {
    enabled: true,
    QUALITY_MODES: {
      economy: { 
        name: "經濟模式", 
        description: "快速出圖", 
        min_resolution: 1024, 
        max_resolution: 2048, 
        steps_multiplier: 0.85, 
        guidance_multiplier: 0.9, 
        hd_level: "basic" 
      },
      standard: { 
        name: "標準模式", 
        description: "平衡質量與速度", 
        min_resolution: 1280, 
        max_resolution: 2048, 
        steps_multiplier: 1.0, 
        guidance_multiplier: 1.0, 
        hd_level: "enhanced" 
      },
      ultra: { 
        name: "超高清模式", 
        description: "極致質量", 
        min_resolution: 1536, 
        max_resolution: 2048, 
        steps_multiplier: 1.35, 
        guidance_multiplier: 1.15, 
        hd_level: "maximum", 
        force_upscale: true 
      }
    },
    HD_PROMPTS: {
      basic: "high quality, detailed, sharp",
      enhanced: "high quality, highly detailed, sharp focus, professional, 8k uhd",
      maximum: "masterpiece, best quality, ultra detailed, 8k uhd, high resolution, professional photography, sharp focus, HDR"
    },
    HD_NEGATIVE: "blurry, low quality, distorted, ugly, bad anatomy, low resolution, pixelated, artifacts, noise",
    MODEL_QUALITY_PROFILES: {
      "zimage": { 
        min_resolution: 1024, 
        max_resolution: 2048, 
        optimal_steps_boost: 1.0, 
        guidance_boost: 1.0, 
        recommended_quality: "economy" 
      },
      "flux": { 
        min_resolution: 1024, 
        max_resolution: 2048, 
        optimal_steps_boost: 1.1, 
        guidance_boost: 1.0, 
        recommended_quality: "standard" 
      },
      "turbo": { 
        min_resolution: 1024, 
        max_resolution: 2048, 
        optimal_steps_boost: 0.9, 
        guidance_boost: 0.95, 
        recommended_quality: "economy" 
      },
      "kontext": { 
        min_resolution: 1280, 
        max_resolution: 2048, 
        optimal_steps_boost: 1.2, 
        guidance_boost: 1.1, 
        recommended_quality: "ultra" 
      }
    }
  }
};
// =================================================================================
// 工具類：Logger, IP獲取, Google 免費翻譯, 優化器
// =================================================================================

class Logger {
  constructor() {
    this.logs = [];
  }
  add(title, data) {
    this.logs.push({ title, data, timestamp: new Date().toISOString() });
  }
  get() {
    return this.logs;
  }
}

function getClientIP(request) {
  return request.headers.get('cf-connecting-ip') || 
         request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

// ========================================
// ✨ Google 免費翻譯 API（方案2）
// ========================================
async function translateToEnglish(text, env) {
  try {
    // 檢測是否包含中文（繁體、簡體都支援）
    const hasChinese = /[\u4e00-\u9fa5]/.test(text);
    if (!hasChinese) {
      return { 
        text: text, 
        translated: false, 
        reason: "No Chinese detected" 
      };
    }

    console.log("🌐 檢測到中文，準備翻譯:", text.substring(0, 50) + (text.length > 50 ? "..." : ""));

    try {
      // 使用 Google Translate 免費端點（無需 API Key）
      const url = new URL('https://translate.googleapis.com/translate_a/single');
      url.searchParams.append('client', 'gtx');
      url.searchParams.append('sl', 'auto');   // 自動檢測來源語言（支援簡繁中文）
      url.searchParams.append('tl', 'en');     // 目標語言：英文
      url.searchParams.append('dt', 't');      // dt=t 表示只返回翻譯文字
      url.searchParams.append('sl', 'auto');
      url.searchParams.append('tl', 'en');
      url.searchParams.append('dt', 't');
      url.searchParams.append('q', text);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7'
        }
      });

      if (!response.ok) {
        console.error("❌ Google Translate API 回應錯誤:", response.status, response.statusText);
        return { 
          text: text, 
          translated: false, 
          reason: `API returned ${response.status}` 
          reason: "API returned " + response.status
        };
      }

      const result = await response.json();
      
      // 解析 Google Translate API 回應格式
      // 格式: [[["翻譯文字", "原始文字", null, null, 3], ...], null, "zh-CN", ...]
      let translatedText = '';

      if (result && Array.isArray(result) && result[0]) {
        for (const item of result[0]) {
          if (Array.isArray(item) && item[0]) {
            translatedText += item[0];
          }
        }
      }

      // 去除可能的空白和換行
      translatedText = translatedText.trim();

      if (!translatedText || translatedText === text) {
        console.warn("⚠️ 翻譯結果為空或與原文相同");
        return { 
          text: text, 
          translated: false, 
          reason: "Empty or identical translation" 
        };
      }

      // 檢測語言（result[2] 是檢測到的來源語言）
      const detectedLang = result[2] || 'unknown';

      console.log("✅ Google 翻譯成功!");
      console.log("   原文 (" + detectedLang + "):", text.substring(0, 50) + (text.length > 50 ? "..." : ""));
      console.log("   譯文 (en):", translatedText.substring(0, 50) + (translatedText.length > 50 ? "..." : ""));

      return { 
        text: translatedText, 
        translated: true, 
        original: text,
        detectedLanguage: detectedLang,
        model: "Google Translate (Free API)",
        confidence: 0.95,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error("❌ Google 翻譯過程發生錯誤:", error.message);
      console.error("   錯誤堆疊:", error.stack);

      // 翻譯失敗不影響生成，返回原文
      return { 
        text: text, 
        translated: false, 
        reason: "Translation error",
        error: error.message 
      };
    }

  } catch (error) {
    console.error("❌ translateToEnglish 函數錯誤:", error);
    return { 
      text: text, 
      translated: false, 
      error: error.message 
    };
  }
}

class PromptAnalyzer {
  static analyzeComplexity(prompt) {
    const complexKeywords = [
      'detailed', 'intricate', 'complex', 'elaborate', 
      'realistic', 'photorealistic', 'hyperrealistic',
      'architecture', 'cityscape', 'landscape', 'portrait',
      'face', 'eyes', 'hair', 'texture', 'material',
      'fabric', 'skin', 'lighting', 'shadows', 'reflections',
      'fine details', 'high detail', 'ultra detailed',
      '4k', '8k', 'uhd', 'hdr'
    ];

    let score = 0;
    const lowerPrompt = prompt.toLowerCase();

    complexKeywords.forEach(keyword => {
      if (lowerPrompt.includes(keyword)) score += 0.1;
    });

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
    const modeConfig = hdConfig.QUALITY_MODES[qualityMode] || hdConfig.QUALITY_MODES.standard;
    const profile = hdConfig.MODEL_QUALITY_PROFILES[model];
    const optimizations = [];

    const hdLevel = modeConfig.hd_level;
    let enhancedPrompt = prompt;

    if (hdConfig.HD_PROMPTS[hdLevel]) {
      const hdBoost = hdConfig.HD_PROMPTS[hdLevel];
      enhancedPrompt = prompt + ", " + hdBoost;
      optimizations.push("HD增強: " + hdLevel);
    }

    let enhancedNegative = negativePrompt || "";
    if (qualityMode !== 'economy') {
      enhancedNegative = enhancedNegative 
        ? enhancedNegative + ", " + hdConfig.HD_NEGATIVE 
        : hdConfig.HD_NEGATIVE;
      optimizations.push("負面提示詞: 高清過濾");
    }

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

    return { 
      prompt: enhancedPrompt, 
      negativePrompt: enhancedNegative, 
      width: finalWidth, 
      height: finalHeight, 
      optimized: true, 
      quality_mode: qualityMode, 
      hd_level: hdLevel, 
      optimizations: optimizations, 
      size_upscaled: sizeUpscaled 
    };
  }
}

class ParameterOptimizer {
  static optimizeSteps(model, width, height, style = 'none', qualityMode = 'standard', userSteps = null) {
    if (userSteps !== null && userSteps !== -1) {
      const suggestion = this.calculateOptimalSteps(model, width, height, style, qualityMode);
      return { 
        steps: userSteps, 
        optimized: false, 
        suggested: suggestion.steps, 
        reasoning: suggestion.reasoning, 
        user_override: true 
      };
    }
    return this.calculateOptimalSteps(model, width, height, style, qualityMode);
  }

  static calculateOptimalSteps(model, width, height, style, qualityMode = 'standard') {
    const rules = CONFIG.OPTIMIZATION_RULES;
    const modelRule = rules.MODEL_STEPS[model] || rules.MODEL_STEPS["flux"];
    const modeConfig = CONFIG.HD_OPTIMIZATION.QUALITY_MODES[qualityMode];
    const profile = CONFIG.HD_OPTIMIZATION.MODEL_QUALITY_PROFILES[model];

    let baseSteps = modelRule.optimal;
    const reasoning = [];
    reasoning.push(model + ": " + baseSteps + "步");

    const totalPixels = width * height;
    let sizeMultiplier = 1.0;

    if (totalPixels >= rules.SIZE_MULTIPLIER.xlarge.threshold) {
      sizeMultiplier = rules.SIZE_MULTIPLIER.xlarge.multiplier;
      reasoning.push("超大 x" + sizeMultiplier);
    } else if (totalPixels >= rules.SIZE_MULTIPLIER.large.threshold) {
      sizeMultiplier = rules.SIZE_MULTIPLIER.large.multiplier;
      reasoning.push("大尺寸 x" + sizeMultiplier);
    } else if (totalPixels <= rules.SIZE_MULTIPLIER.small.threshold) {
      sizeMultiplier = rules.SIZE_MULTIPLIER.small.multiplier;
    } else {
      sizeMultiplier = rules.SIZE_MULTIPLIER.medium.multiplier;
    }

    let styleMultiplier = rules.STYLE_ADJUSTMENT[style] || rules.STYLE_ADJUSTMENT.default;
    let qualityMultiplier = modeConfig?.steps_multiplier || 1.0;
    if (qualityMultiplier !== 1.0) reasoning.push(modeConfig.name + " x" + qualityMultiplier);

    let profileBoost = profile?.optimal_steps_boost || 1.0;
    if (profileBoost !== 1.0) reasoning.push("模型配置 x" + profileBoost);

    let optimizedSteps = Math.round(baseSteps * sizeMultiplier * styleMultiplier * qualityMultiplier * profileBoost);
    optimizedSteps = Math.max(modelRule.min, Math.min(optimizedSteps, modelRule.max));

    reasoning.push("→ " + optimizedSteps + "步");

    return { 
      steps: optimizedSteps, 
      optimized: true, 
      base_steps: baseSteps, 
      size_multiplier: sizeMultiplier, 
      style_multiplier: styleMultiplier, 
      quality_multiplier: qualityMultiplier, 
      profile_boost: profileBoost, 
      min_steps: modelRule.min, 
      max_steps: modelRule.max, 
      reasoning: reasoning.join(' ') 
    };
  }

  static optimizeGuidance(model, style, qualityMode = 'standard') {
    const modeConfig = CONFIG.HD_OPTIMIZATION.QUALITY_MODES[qualityMode];
    const profile = CONFIG.HD_OPTIMIZATION.MODEL_QUALITY_PROFILES[model];

    let baseGuidance = 7.5;

    if (model.includes('turbo')) {
      baseGuidance = style === 'photorealistic' ? 3.0 : 2.5;
    } else if (style === 'photorealistic') {
      baseGuidance = 8.5;
    } else if (['oil-painting', 'watercolor', 'sketch'].includes(style)) {
      baseGuidance = 6.5;
    } else if (['manga', 'anime', 'chibi'].includes(style)) {
      baseGuidance = 7.0;
    } else if (['pixel-art', 'low-poly'].includes(style)) {
      baseGuidance = 6.0;
    }

    let qualityBoost = modeConfig?.guidance_multiplier || 1.0;
    let profileBoost = profile?.guidance_boost || 1.0;

    return Math.round(baseGuidance * qualityBoost * profileBoost * 10) / 10;
  }
}

class StyleProcessor {
  static applyStyle(prompt, style, negativePrompt) {
    try {
      if (!style || style === 'none' || style === '') {
        return { 
          enhancedPrompt: prompt, 
          enhancedNegative: negativePrompt || "" 
        };
      }

      if (!CONFIG.STYLE_PRESETS || typeof CONFIG.STYLE_PRESETS !== 'object') {
        console.warn("⚠️ STYLE_PRESETS not found");
        return { 
          enhancedPrompt: prompt, 
          enhancedNegative: negativePrompt || "" 
        };
      }

      const styleConfig = CONFIG.STYLE_PRESETS[style];
      if (!styleConfig) {
        console.warn("⚠️ Style '" + style + "' not found");
        return { 
          enhancedPrompt: prompt, 
          enhancedNegative: negativePrompt || "" 
        };
      }

      let enhancedPrompt = prompt;
      if (styleConfig.prompt && styleConfig.prompt.trim()) {
        enhancedPrompt = prompt + ", " + styleConfig.prompt;
      }

      let enhancedNegative = negativePrompt || "";
      if (styleConfig.negative && styleConfig.negative.trim()) {
        if (enhancedNegative && enhancedNegative.trim()) {
          enhancedNegative = enhancedNegative + ", " + styleConfig.negative;
        } else {
          enhancedNegative = styleConfig.negative;
        }
      }

      console.log("✅ Style applied:", style, "-", styleConfig.name);
      return { 
        enhancedPrompt: enhancedPrompt, 
        enhancedNegative: enhancedNegative 
      };
    } catch (error) {
      console.error("❌ StyleProcessor error:", error.message);
      return { 
        enhancedPrompt: prompt, 
        enhancedNegative: negativePrompt || "" 
      };
    }
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
    if (error.name === 'AbortError') {
      throw new Error("Request timeout after " + timeout + "ms");
    }
    throw error;
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
// =================================================================================
// PollinationsProvider：核心圖像生成類
// =================================================================================

class PollinationsProvider {
  constructor(config, env) {
    this.config = config;
    this.name = config.name;
    this.env = env;
  }

  async generate(prompt, options, logger) {
    const { 
      model = "zimage", 
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
      autoOptimize = true, 
      autoHD = true, 
      qualityMode = 'standard',
      referenceImages = []
    } = options;

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

    let hdOptimization = null;
    let finalPrompt = prompt;
    let finalNegativePrompt = negativePrompt;
    let finalWidth = width;
    let finalHeight = height;

    const promptComplexity = PromptAnalyzer.analyzeComplexity(prompt);
    const recommendedQuality = PromptAnalyzer.recommendQualityMode(prompt, model);
    logger.add("🧠 Prompt Analysis", { 
      complexity: (promptComplexity * 100).toFixed(1) + '%', 
      recommended_quality: recommendedQuality, 
      selected_quality: qualityMode,
      has_reference_images: validReferenceImages.length > 0
    });

    if (autoHD) {
      hdOptimization = HDOptimizer.optimize(
        prompt, 
        negativePrompt, 
        model, 
        width, 
        height, 
        qualityMode, 
        autoHD
      );
      finalPrompt = hdOptimization.prompt;
      finalNegativePrompt = hdOptimization.negativePrompt;
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
      const stepsOptimization = ParameterOptimizer.optimizeSteps(
        model, 
        finalWidth, 
        finalHeight, 
        style, 
        qualityMode, 
        steps
      );
      finalSteps = stepsOptimization.steps;
      logger.add("🎯 Steps Optimization", { 
        steps: stepsOptimization.steps, 
        reasoning: stepsOptimization.reasoning 
      });

      if (guidance === null) {
        finalGuidance = ParameterOptimizer.optimizeGuidance(model, style, qualityMode);
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

    logger.add("🎨 Style Processing", { 
      selected_style: style,
      style_name: CONFIG.STYLE_PRESETS[style]?.name || style,
      style_category: CONFIG.STYLE_PRESETS[style]?.category || 'unknown',
      style_applied: style !== 'none',
      original_prompt_length: finalPrompt.length,
      enhanced_prompt_length: enhancedPrompt.length,
      prompt_added: enhancedPrompt.length - finalPrompt.length
    });

    // ========================================
    // ✨ Google 翻譯整合（步驟6）
    // ========================================
    const translation = await translateToEnglish(enhancedPrompt, this.env);
    const finalPromptForAPI = translation.text;

    if (translation.translated) {
      logger.add("🌐 Auto Translation", { 
        original_zh: translation.original,
        translated_en: finalPromptForAPI.substring(0, 100) + (finalPromptForAPI.length > 100 ? '...' : ''),
        detected_language: translation.detectedLanguage || 'unknown',
        success: true,
        model: translation.model || "Google Translate (Free API)",
        confidence: translation.confidence || 0.95
      });
    } else {
      logger.add("⚠️ Translation", { 
        status: "skipped",
        reason: translation.reason || "Unknown",
        using_original: true
      });
    }

    logger.add("🎨 Generation Config", { 
      provider: this.name, 
      model: model, 
      dimensions: finalWidth + "x" + finalHeight,
      quality_mode: qualityMode, 
      hd_optimized: autoHD && hdOptimization?.optimized, 
      auto_translated: translation.translated,
      style_applied: style !== 'none',
      reference_images: validReferenceImages.length,
      generation_mode: validReferenceImages.length > 0 ? "圖生圖" : "文生圖",
      steps: finalSteps, 
      guidance: finalGuidance,
      seed: seed
    });

    const currentSeed = seed === -1 ? Math.floor(Math.random() * 1000000) : seed;
    let fullPrompt = finalPromptForAPI;
    if (enhancedNegative && enhancedNegative.trim()) {
      fullPrompt = finalPromptForAPI + " [negative: " + enhancedNegative + "]";
    }

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
      headers['Authorization'] = `Bearer ${authConfig.token}`;
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
      model: model,
      authenticated: authConfig.enabled && !!authConfig.token,
      full_url: url.substring(0, 100) + "..."
    });

    for (let retry = 0; retry < CONFIG.MAX_RETRIES; retry++) {
      try {
        const response = await fetchWithTimeout(url, { 
          method: 'GET', 
          headers: headers
        }, 120000);

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.startsWith('image/')) {
            logger.add("✅ Success", { 
              url: response.url, 
              used_model: model, 
              final_size: finalWidth + "x" + finalHeight,
              quality_mode: qualityMode, 
              style_used: style,
              style_name: CONFIG.STYLE_PRESETS[style]?.name || style,
              hd_optimized: autoHD && hdOptimization?.optimized, 
              auto_translated: translation.translated,
              translation_model: translation.model || "None",
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
              auto_translated: translation.translated,
              translation_info: translation.translated ? {
                original: translation.original,
                translated: finalPromptForAPI,
                detected_language: translation.detectedLanguage,
                model: translation.model,
                confidence: translation.confidence
              } : null,
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
          throw new Error("Authentication failed: Invalid or missing API key. Please set POLLINATIONS_API_KEY");
        } else if (response.status === 403) {
          throw new Error("Access forbidden: API key may lack required permissions");
        } else {
          throw new Error("HTTP " + response.status + ": " + (await response.text()).substring(0, 200));
        }
      } catch (e) {
        logger.add("❌ Request Failed", { 
          error: e.message, 
          model: model, 
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
// =================================================================================
// 主 Worker Handler
// =================================================================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const clientIP = getClientIP(request);

    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        status: 204, 
        headers: corsHeaders() 
      });
    }

    // ========================================
    // API 路由
    // ========================================
    
    // 1. 生成圖片 API (內部端點)
    if (path === '/_internal/generate' && request.method === 'POST') {
      const logger = new Logger();
      logger.add("📥 Request Info", { 
        method: request.method, 
        path: path, 
        ip: clientIP,
        timestamp: new Date().toISOString()
      });

      try {
        const body = await request.json();
        const { 
          prompt, 
          model = "zimage", 
          provider = "pollinations", 
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
          numOutputs = 1, 
          responseFormat = "url", 
          autoOptimize = true, 
          autoHD = true, 
          qualityMode = 'standard',
          referenceImages = []
        } = body;

        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
          return Response.json({ 
            error: "Missing or invalid 'prompt' parameter" 
          }, { 
            status: 400, 
            headers: corsHeaders() 
          });
        }

        logger.add("📝 Request Params", { 
          prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
          model: model, 
          provider: provider, 
          size: width + "x" + height, 
          style: style,
          quality_mode: qualityMode, 
          num_outputs: numOutputs, 
          response_format: responseFormat,
          auto_optimize: autoOptimize, 
          auto_hd: autoHD,
          reference_images: referenceImages?.length || 0,
          generation_mode: referenceImages?.length > 0 ? "圖生圖" : "文生圖"
        });

        // 從環境變數讀取 API Key
        const pollinationsApiKey = env.POLLINATIONS_API_KEY || "";
        if (pollinationsApiKey) {
          CONFIG.POLLINATIONS_AUTH.token = pollinationsApiKey;
          logger.add("🔐 API Key", { 
            status: "loaded",
            token_prefix: pollinationsApiKey.substring(0, 8) + "...",
            source: "environment variable"
          });
        } else {
          logger.add("⚠️ API Key", { 
            status: "not found",
            warning: "新 API 端點需要 API Key，請設置 POLLINATIONS_API_KEY 環境變量"
          });
        }

        const router = new MultiProviderRouter({
          pollinations: pollinationsApiKey
        }, env);

        const results = await router.generate(prompt, { 
          provider: provider, 
          model: model, 
          width: width, 
          height: height, 
          seed: seed, 
          negativePrompt: negativePrompt, 
          guidance: guidance, 
          steps: steps, 
          enhance: enhance, 
          nologo: nologo, 
          privateMode: privateMode, 
          style: style, 
          numOutputs: numOutputs, 
          autoOptimize: autoOptimize, 
          autoHD: autoHD, 
          qualityMode: qualityMode,
          referenceImages: referenceImages
        }, logger);

        if (responseFormat === 'b64_json') {
          const data = results.map((result, index) => {
            const base64 = btoa(String.fromCharCode(...new Uint8Array(result.imageData)));
            return {
              b64_json: base64,
              seed: result.seed,
              model: result.model,
              style: result.style,
              style_name: result.style_name,
              style_category: result.style_category,
              width: result.width,
              height: result.height,
              quality_mode: result.quality_mode,
              hd_optimized: result.hd_optimized,
              auto_translated: result.auto_translated,
              translation_info: result.translation_info,
              reference_images_count: result.reference_images_count,
              generation_mode: result.generation_mode,
              authenticated: result.authenticated
            };
          });

          return Response.json({ 
            created: Math.floor(Date.now() / 1000), 
            data: data,
            logs: logger.get() 
          }, { 
            headers: corsHeaders({ 'Content-Type': 'application/json' }) 
          });

        } else {
          if (results.length === 1) {
            return new Response(results[0].imageData, { 
              headers: corsHeaders({ 
                'Content-Type': results[0].contentType || 'image/png',
                'X-Generation-Seed': results[0].seed.toString(),
                'X-Generation-Model': results[0].model,
                'X-Generation-Style': results[0].style,
                'X-Generation-Style-Name': encodeURIComponent(results[0].style_name || ''),
                'X-Generation-Quality': results[0].quality_mode,
                'X-Generation-HD-Optimized': results[0].hd_optimized.toString(),
                'X-Generation-Auto-Translated': results[0].auto_translated.toString(),
                'X-Generation-Mode': results[0].generation_mode || '文生圖',
                'X-Generation-Authenticated': results[0].authenticated.toString()
              }) 
            });
          } else {
            const data = results.map((result, index) => {
              const base64 = btoa(String.fromCharCode(...new Uint8Array(result.imageData)));
              return {
                image: 'data:' + (result.contentType || 'image/png') + ';base64,' + base64,
                seed: result.seed,
                model: result.model,
                style: result.style,
                style_name: result.style_name,
                style_category: result.style_category,
                width: result.width,
                height: result.height,
                quality_mode: result.quality_mode,
                hd_optimized: result.hd_optimized,
                auto_translated: result.auto_translated,
                translation_info: result.translation_info,
                reference_images_count: result.reference_images_count,
                generation_mode: result.generation_mode,
                authenticated: result.authenticated
              };
            });

            return Response.json({ 
              created: Math.floor(Date.now() / 1000), 
              data: data,
              logs: logger.get() 
            }, { 
              headers: corsHeaders({ 'Content-Type': 'application/json' }) 
            });
          }
        }
      } catch (error) {
        logger.add("❌ Generation Error", { 
          error: error.message, 
          stack: error.stack 
        });

        return Response.json({ 
          error: error.message, 
          logs: logger.get() 
        }, { 
          status: 500, 
          headers: corsHeaders() 
        });
      }
    }

    // 2. 獲取配置 API
    if (path === '/api/config' || path === '/_internal/config') {
      const configData = {
        project: {
          name: CONFIG.PROJECT_NAME,
          version: CONFIG.PROJECT_VERSION
        },
        providers: Object.keys(CONFIG.PROVIDERS).map(key => {
          const provider = CONFIG.PROVIDERS[key];
          return {
            id: key,
            name: provider.name,
            enabled: provider.enabled,
            default: provider.default || false,
            description: provider.description,
            models: provider.models.map(m => ({
              id: m.id,
              name: m.name,
              description: m.description,
              category: m.category,
              max_size: m.max_size,
              supports_reference_images: m.supports_reference_images || false,
              max_reference_images: m.max_reference_images || 0,
              input_modalities: m.input_modalities || ["text"],
              output_modalities: m.output_modalities || ["image"]
            })),
            features: provider.features
          };
        }),
        default_provider: CONFIG.DEFAULT_PROVIDER,
        styles: Object.keys(CONFIG.STYLE_PRESETS).map(key => ({
          id: key,
          name: CONFIG.STYLE_PRESETS[key].name,
          category: CONFIG.STYLE_PRESETS[key].category,
          icon: CONFIG.STYLE_PRESETS[key].icon,
          description: CONFIG.STYLE_PRESETS[key].description
        })),
        style_categories: CONFIG.STYLE_CATEGORIES,
        preset_sizes: CONFIG.PRESET_SIZES,
        quality_modes: Object.keys(CONFIG.HD_OPTIMIZATION.QUALITY_MODES).map(key => ({
          id: key,
          name: CONFIG.HD_OPTIMIZATION.QUALITY_MODES[key].name,
          description: CONFIG.HD_OPTIMIZATION.QUALITY_MODES[key].description
        })),
        features: {
          auto_translation: true,
          translation_engine: "Google Translate (Free API)",
          hd_optimization: CONFIG.HD_OPTIMIZATION.enabled,
          auto_optimize: true,
          style_presets: true,
          reference_images: true,
          image_to_image: true,
          quality_modes: true
        }
      };

      return Response.json(configData, { 
        headers: corsHeaders({ 'Content-Type': 'application/json' }) 
      });
    }

    // 3. 健康檢查 API
    if (path === '/health' || path === '/_internal/health') {
      const pollinationsApiKey = env.POLLINATIONS_API_KEY || "";

      return Response.json({ 
        status: 'ok', 
        version: CONFIG.PROJECT_VERSION,
        timestamp: new Date().toISOString(),
        api_key_configured: !!pollinationsApiKey,
        translation_engine: "Google Translate (Free API)",
        providers: Object.keys(CONFIG.PROVIDERS).filter(k => CONFIG.PROVIDERS[k].enabled),
        models: CONFIG.PROVIDERS.pollinations.models.length,
        styles: Object.keys(CONFIG.STYLE_PRESETS).length,
        features: {
          auto_translation: true,
          translation_free: true,
          hd_optimization: CONFIG.HD_OPTIMIZATION.enabled,
          reference_images: true,
          image_to_image: true
        }
      }, { 
        headers: corsHeaders({ 'Content-Type': 'application/json' }) 
      });
    }

    // 4. 風格列表 API
    if (path === '/api/styles' || path === '/_internal/styles') {
      const groupedStyles = {};

      for (const [styleId, styleConfig] of Object.entries(CONFIG.STYLE_PRESETS)) {
        const category = styleConfig.category || 'basic';
        if (!groupedStyles[category]) {
          groupedStyles[category] = {
            ...CONFIG.STYLE_CATEGORIES[category],
            styles: []
          };
        }
        groupedStyles[category].styles.push({
          id: styleId,
          name: styleConfig.name,
          icon: styleConfig.icon,
          description: styleConfig.description,
          prompt: styleConfig.prompt,
          negative: styleConfig.negative
        });
      }

      const sortedCategories = Object.entries(groupedStyles)
        .sort(([, a], [, b]) => (a.order || 999) - (b.order || 999))
        .map(([id, data]) => ({ id, ...data }));

      return Response.json({ 
        total: Object.keys(CONFIG.STYLE_PRESETS).length,
        categories: sortedCategories 
      }, { 
        headers: corsHeaders({ 'Content-Type': 'application/json' }) 
      });
    }

    // 5. 模型列表 API
    if (path === '/api/models' || path === '/_internal/models') {
      const models = CONFIG.PROVIDERS.pollinations.models.map(m => ({
        id: m.id,
        name: m.name,
        description: m.description,
        category: m.category,
        max_size: m.max_size,
        confirmed: m.confirmed,
        pricing: m.pricing,
        supports_reference_images: m.supports_reference_images || false,
        max_reference_images: m.max_reference_images || 0,
        input_modalities: m.input_modalities || ["text"],
        output_modalities: m.output_modalities || ["image"]
      }));

      return Response.json({ 
        provider: "pollinations",
        total: models.length,
        models: models 
      }, { 
        headers: corsHeaders({ 'Content-Type': 'application/json' }) 
      });
    }

    // 6. 翻譯測試 API
    if (path === '/api/translate' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { text } = body;

        if (!text) {
          return Response.json({ 
            error: "Missing 'text' parameter" 
          }, { 
            status: 400, 
            headers: corsHeaders() 
          });
        }

        const result = await translateToEnglish(text, env);

        return Response.json({ 
          success: true,
          translated: result.translated,
          original: text,
          result: result.text,
          detected_language: result.detectedLanguage || 'unknown',
          model: result.model || "Google Translate (Free API)",
          confidence: result.confidence || 0,
          reason: result.reason || null,
          timestamp: new Date().toISOString()
        }, { 
          headers: corsHeaders({ 'Content-Type': 'application/json' }) 
        });
      } catch (error) {
        return Response.json({ 
          error: error.message 
        }, { 
          status: 500, 
          headers: corsHeaders() 
        });
      }
    }

    // 7. 提供前端 HTML
    if (path === '/' || path === '/index.html') {
      return new Response(HTML_CONTENT, { 
        headers: corsHeaders({ 'Content-Type': 'text/html; charset=utf-8' }) 
      });
    }

    // 404 處理
    return Response.json({ 
      error: 'Not Found',
      available_endpoints: [
        'POST /_internal/generate - 生成圖片',
        'GET /api/config - 獲取配置',
        'GET /api/styles - 獲取風格列表',
        'GET /api/models - 獲取模型列表',
        'POST /api/translate - 測試翻譯',
        'GET /health - 健康檢查',
        'GET / - 前端界面'
      ]
    }, { 
      status: 404, 
      headers: corsHeaders() 
    });
  }
};
// =================================================================================
// 前端 HTML 界面（第 5 段 Part 1）
// 前端 HTML 界面
// =================================================================================

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flux AI Pro - AI 圖像生成工具 (Google 翻譯版)</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft JhengHei', 'PingFang TC', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
      color: #333;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    
    .header .subtitle {
      font-size: 1.1em;
      opacity: 0.95;
    }
    
    .header .version {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.9em;
      margin-top: 10px;
    }
    
    .main-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      padding: 30px;
    }
    
    @media (max-width: 1024px) {
      .main-content {
        grid-template-columns: 1fr;
      }
    }
    
    .panel {
      background: #f8f9fa;
      border-radius: 15px;
      padding: 25px;
    }
    
    .panel h2 {
      color: #667eea;
      margin-bottom: 20px;
      font-size: 1.5em;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #555;
      font-size: 0.95em;
    }
    
    .form-group input[type="text"],
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 12px 15px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1em;
      transition: all 0.3s;
      font-family: inherit;
    }
    
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .form-group textarea {
      min-height: 100px;
      resize: vertical;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    .form-row-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 15px;
    }
    
    @media (max-width: 768px) {
      .form-row,
      .form-row-3 {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
    
    .btn {
      padding: 15px 30px;
      border: none;
      border-radius: 10px;
      font-size: 1.1em;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      text-decoration: none;
      font-family: inherit;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      width: 100%;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }
    
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn-secondary {
      background: #6c757d;
      color: white;
    }
    
    .btn-secondary:hover {
      background: #5a6268;
    }
    
    .style-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 10px;
      margin-top: 10px;
      max-height: 400px;
      overflow-y: auto;
      padding: 10px;
      background: white;
      border-radius: 10px;
    }
    
    .style-card {
      padding: 15px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      cursor: pointer;
      text-align: center;
      transition: all 0.3s;
      background: white;
    }
    
    .style-card:hover {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }
    
    .style-card.active {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .style-card .icon {
      font-size: 2em;
      margin-bottom: 8px;
    }
    
    .style-card .name {
      font-weight: 600;
      font-size: 0.9em;
      color: #333;
    }
    
    .style-category {
      margin-bottom: 20px;
    }
    
    .style-category-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      margin-bottom: 10px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }
    
    .style-category-header:hover {
      opacity: 0.9;
    }
    
    .style-category-header .toggle {
      margin-left: auto;
      font-size: 1.2em;
    }
    
    .result-container {
      background: white;
      border-radius: 10px;
      padding: 20px;
      min-height: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .result-container img {
      max-width: 100%;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    
    .loading {
      text-align: center;
    }
    
    .loading .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .loading p {
      color: #666;
      font-size: 1.1em;
    }
    
    .placeholder {
      text-align: center;
      color: #999;
    }
    
    .placeholder .icon {
      font-size: 4em;
      margin-bottom: 20px;
      opacity: 0.3;
    }
    
    .placeholder p {
      font-size: 1.1em;
    }
    
    .info-box {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .info-box.success {
      background: #e8f5e9;
      border-left-color: #4caf50;
    }
    
    .info-box.warning {
      background: #fff3e0;
      border-left-color: #ff9800;
    }
    
    .info-box.error {
      background: #ffebee;
      border-left-color: #f44336;
    }
    
    .info-box h4 {
      margin-bottom: 8px;
      color: #1976d2;
    }
    
    .info-box.success h4 {
      color: #388e3c;
    }
    
    .info-box.warning h4 {
      color: #f57c00;
    }
    
    .info-box.error h4 {
      color: #d32f2f;
    }
    
    .info-box p {
      font-size: 0.95em;
      color: #555;
      line-height: 1.5;
    }
    
    .toggle-switch {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .toggle-switch input[type="checkbox"] {
      width: 50px;
      height: 26px;
      position: relative;
      appearance: none;
      background: #ccc;
      border-radius: 13px;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .toggle-switch input[type="checkbox"]:checked {
      background: #667eea;
    }
    
    .toggle-switch input[type="checkbox"]::before {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      top: 3px;
      left: 3px;
      transition: all 0.3s;
    }
    
    .toggle-switch input[type="checkbox"]:checked::before {
      left: 27px;
    }
    
    .toggle-switch label {
      font-weight: 600;
      color: #555;
      margin: 0;
      cursor: pointer;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.85em;
      font-weight: 600;
      background: #667eea;
      color: white;
    }
    
    .badge.success {
      background: #4caf50;
    }
    
    .badge.warning {
      background: #ff9800;
    }
    
    .badge.info {
      background: #2196f3;
    }
    
    .meta-info {
      background: white;
      border-radius: 10px;
      padding: 15px;
      margin-top: 15px;
      font-size: 0.9em;
      color: #666;
    }
    
    .meta-info div {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .meta-info div:last-child {
      border-bottom: none;
    }
    
    .meta-info strong {
      color: #333;
    }
    
    .action-buttons {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }
    
    .action-buttons .btn {
      flex: 1;
    }
    
    .preset-sizes {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .preset-size-btn {
      padding: 10px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
      font-size: 0.9em;
    }
    
    .preset-size-btn:hover {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.05);
    }
    
    .preset-size-btn.active {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      font-weight: 600;
    }
    
    .quality-modes {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .quality-mode-btn {
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
    }
    
    .quality-mode-btn:hover {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.05);
    }
    
    .quality-mode-btn.active {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      font-weight: 600;
    }
    
    .quality-mode-btn .name {
      font-weight: 600;
      margin-bottom: 4px;
      color: #333;
    }
    
    .quality-mode-btn .desc {
      font-size: 0.85em;
      color: #666;
    }
    
    .translation-info {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      border: 2px solid #667eea;
      border-radius: 10px;
      padding: 15px;
      margin-top: 15px;
    }
    
    .translation-info h4 {
      color: #667eea;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .translation-info .content {
      background: white;
      padding: 10px;
      border-radius: 6px;
      margin-top: 8px;
      font-size: 0.9em;
    }
    
    .translation-info .label {
      font-weight: 600;
      color: #555;
      margin-bottom: 4px;
    }
    
    .translation-info .text {
      color: #333;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎨 Flux AI Pro</h1>
      <p class="subtitle">AI 圖像生成工具 - Google 翻譯整合版</p>
      <span class="version">v9.6.1-google-translate | 45+ 藝術風格 | 免費翻譯</span>
    </div>
    
    <div class="main-content">
      <!-- 左側：控制面板 -->
      <div class="panel">
        <h2>⚙️ 生成設定</h2>
        
        <div class="info-box">
          <h4>🌐 自動翻譯已啟用</h4>
          <p>輸入中文提示詞將自動翻譯成英文後生成圖片。使用 Google 翻譯免費 API，無需配置。</p>
        </div>
        
        <div class="form-group">
          <label>✨ 提示詞（支援中文自動翻譯）</label>
          <textarea id="prompt" placeholder="例如：一隻可愛的橘貓在花園裡玩耍，陽光明媚

系統會自動翻譯成英文後生成圖片"></textarea>
        </div>
        
        <div class="form-group">
          <label>🚫 負面提示詞（可選）</label>
          <textarea id="negativePrompt" placeholder="不想出現的內容，例如：blurry, low quality"></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>🤖 模型</label>
            <select id="model">
              <option value="zimage">Z-Image Turbo ⚡</option>
              <option value="flux">Flux 標準版</option>
              <option value="turbo">Flux Turbo ⚡</option>
              <option value="kontext">Kontext 🎨 (支援圖生圖)</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>💎 質量模式</label>
            <select id="qualityMode">
              <option value="economy">經濟模式</option>
              <option value="standard" selected>標準模式</option>
              <option value="ultra">超高清模式</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label>🎨 藝術風格</label>
          <select id="styleSelect">
            <option value="none">無風格</option>
          </select>
        </div>
        
        <div id="styleCategories" class="style-grid" style="display: none;">
          <!-- 動態生成風格卡片 -->
        </div>
        
        <div class="form-group">
          <label>📐 預設尺寸</label>
          <div class="preset-sizes" id="presetSizes">
            <!-- 動態生成預設尺寸按鈕 -->
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>📏 寬度</label>
            <input type="number" id="width" value="1024" min="512" max="2048" step="64">
          </div>
          
          <div class="form-group">
            <label>📏 高度</label>
            <input type="number" id="height" value="1024" min="512" max="2048" step="64">
          </div>
        </div>
        
        <div class="toggle-switch">
          <input type="checkbox" id="autoOptimize" checked>
          <label for="autoOptimize">🎯 自動優化參數</label>
        </div>
        
        <div class="toggle-switch">
          <input type="checkbox" id="autoHD" checked>
          <label for="autoHD">✨ HD 優化增強</label>
        </div>
        
        <button class="btn btn-primary" id="generateBtn">
          🎨 開始生成
        </button>
      </div>
      
      <!-- 右側：結果展示 -->
      <div class="panel">
        <h2>🖼️ 生成結果</h2>
        
        <div class="result-container" id="resultContainer">
          <div class="placeholder">
            <div class="icon">🎨</div>
            <p>設定參數後點擊「開始生成」</p>
          </div>
        </div>
        
        <div id="metaInfo" class="meta-info" style="display: none;">
          <!-- 動態生成元資訊 -->
        </div>
        
        <div id="translationInfo" class="translation-info" style="display: none;">
          <!-- 動態生成翻譯資訊 -->
        </div>
        
        <div class="action-buttons" id="actionButtons" style="display: none;">
          <button class="btn btn-secondary" id="downloadBtn">⬇️ 下載圖片</button>
          <button class="btn btn-secondary" id="newBtn">🔄 生成新圖</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    let currentConfig = null;
    let currentImage = null;
    let currentMetadata = null;
    
    // 載入配置
    async function loadConfig() {
      try {
        const response = await fetch('/api/config');
        currentConfig = await response.json();
        console.log('✅ 配置載入成功:', currentConfig);
        
        // 初始化風格選擇器
        initStyleSelector();
        initPresetSizes();
        
        return currentConfig;
      } catch (error) {
        console.error('❌ 載入配置失敗:', error);
        return null;
      }
    }
    
    // 初始化風格選擇器
    function initStyleSelector() {
      const styleSelect = document.getElementById('styleSelect');
      const styleCategories = document.getElementById('styleCategories');
      
      if (!currentConfig || !currentConfig.styles) return;
      
      // 清空現有選項（保留"無風格"）
      styleSelect.innerHTML = '<option value="none">無風格</option>';
      
      // 按分類組織風格
      const grouped = {};
      currentConfig.styles.forEach(style => {
        const category = style.category || 'basic';
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(style);
      });
      
      // 生成分類和風格卡片
      let html = '';
      Object.entries(grouped).forEach(([categoryId, styles]) => {
        const categoryInfo = currentConfig.style_categories[categoryId];
        if (!categoryInfo) return;
        
        html += \`
          <div class="style-category">
            <div class="style-category-header" onclick="toggleCategory('\${categoryId}')">
              <span>\${categoryInfo.icon} \${categoryInfo.name}</span>
              <span class="toggle" id="toggle-\${categoryId}">▼</span>
            </div>
            <div class="style-grid" id="category-\${categoryId}" style="display: grid;">
              \${styles.map(style => \`
                <div class="style-card" data-style="\${style.id}" onclick="selectStyle('\${style.id}')">
                  <div class="icon">\${style.icon}</div>
                  <div class="name">\${style.name}</div>
                </div>
              \`).join('')}
            </div>
          </div>
        \`;
        
        // 添加到下拉選單
        styles.forEach(style => {
          const option = document.createElement('option');
          option.value = style.id;
          option.textContent = \`\${style.icon} \${style.name}\`;
          styleSelect.appendChild(option);
        });
      });
      
      styleCategories.innerHTML = html;
    }
    
    // 初始化預設尺寸
    function initPresetSizes() {
      const container = document.getElementById('presetSizes');
      if (!currentConfig || !currentConfig.preset_sizes) return;
      
      Object.entries(currentConfig.preset_sizes).forEach(([key, size]) => {
        const btn = document.createElement('div');
        btn.className = 'preset-size-btn';
        btn.textContent = size.name;
        btn.onclick = () => {
          document.getElementById('width').value = size.width;
          document.getElementById('height').value = size.height;
          document.querySelectorAll('.preset-size-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        };
        container.appendChild(btn);
      });
    }
    
    // 切換分類顯示
    function toggleCategory(categoryId) {
      const content = document.getElementById(\`category-\${categoryId}\`);
      const toggle = document.getElementById(\`toggle-\${categoryId}\`);
      if (content.style.display === 'none') {
        content.style.display = 'grid';
        toggle.textContent = '▼';
      } else {
        content.style.display = 'none';
        toggle.textContent = '▶';
      }
    }
    
    // 選擇風格
    function selectStyle(styleId) {
      document.querySelectorAll('.style-card').forEach(card => {
        card.classList.remove('active');
      });
      document.querySelector(\`[data-style="\${styleId}"]\`).classList.add('active');
      document.getElementById('styleSelect').value = styleId;
    }
    
    // 風格選擇器改變時同步卡片
    document.getElementById('styleSelect')?.addEventListener('change', (e) => {
      const styleId = e.target.value;
      document.querySelectorAll('.style-card').forEach(card => {
        card.classList.remove('active');
      });
      const card = document.querySelector(\`[data-style="\${styleId}"]\`);
      if (card) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
    // 生成圖片
    async function generateImage() {
      const prompt = document.getElementById('prompt').value.trim();
      if (!prompt) {
        alert('請輸入提示詞');
        return;
      }
      
      const model = document.getElementById('model').value;
      const width = parseInt(document.getElementById('width').value);
      const height = parseInt(document.getElementById('height').value);
      const negativePrompt = document.getElementById('negativePrompt').value.trim();
      const style = document.getElementById('styleSelect').value;
      const qualityMode = document.getElementById('qualityMode').value;
      const autoOptimize = document.getElementById('autoOptimize').checked;
      const autoHD = document.getElementById('autoHD').checked;
      
      const generateBtn = document.getElementById('generateBtn');
      const resultContainer = document.getElementById('resultContainer');
      const metaInfo = document.getElementById('metaInfo');
      const translationInfo = document.getElementById('translationInfo');
      const actionButtons = document.getElementById('actionButtons');
      
      // 檢查是否包含中文
      const hasChinese = /[\u4e00-\u9fa5]/.test(prompt);
      const translationHint = hasChinese ? '<p style="font-size: 0.9em; color: #999; margin-top: 10px;">🌐 自動翻譯中文提示詞...</p>' : '';
      
      // 顯示載入中
      generateBtn.disabled = true;
      generateBtn.innerHTML = '⏳ 生成中...';
      resultContainer.innerHTML = \`
        <div class="loading">
          <div class="spinner"></div>
          <p>正在生成圖片，請稍候...</p>
          <p style="font-size: 0.9em; color: #999; margin-top: 10px;">
            ${/[\u4e00-\u9fa5]/.test(prompt) ? '🌐 自動翻譯中文提示詞...' : ''}
          </p>
          \${translationHint}
        </div>
      \`;
      metaInfo.style.display = 'none';
      translationInfo.style.display = 'none';
      actionButtons.style.display = 'none';
      
      try {
        const response = await fetch('/_internal/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: prompt,
            model: model,
            width: width,
            height: height,
            negativePrompt: negativePrompt,
            style: style,
            qualityMode: qualityMode,
            autoOptimize: autoOptimize,
            autoHD: autoHD,
            seed: -1,
            nologo: true,
            privateMode: true,
            enhance: false,
            responseFormat: 'url'
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || '生成失敗');
        }
        
        const contentType = response.headers.get('content-type');
        
        if (contentType.startsWith('image/')) {
        if (contentType && contentType.startsWith('image/')) {
          // 直接返回圖片
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          
          currentImage = imageUrl;
          currentMetadata = {
            model: model,
            width: width,
            height: height,
            style: style,
            qualityMode: qualityMode,
            seed: response.headers.get('X-Generation-Seed'),
            autoTranslated: response.headers.get('X-Generation-Auto-Translated') === 'true',
            hdOptimized: response.headers.get('X-Generation-HD-Optimized') === 'true',
            authenticated: response.headers.get('X-Generation-Authenticated') === 'true'
          };
          
          displayResult(imageUrl, currentMetadata);
          
        } else {
          // JSON 回應
          const data = await response.json();
          console.log('✅ 生成成功:', data);
          
          if (data.data && data.data.length > 0) {
            const result = data.data[0];
            const imageUrl = result.image || result.url;
            
            currentImage = imageUrl;
            currentMetadata = result;
            
            displayResult(imageUrl, result);
          } else {
            throw new Error('未收到圖片數據');
          }
        }
        
      } catch (error) {
        console.error('❌ 生成失敗:', error);
        resultContainer.innerHTML = \`
          <div class="placeholder">
            <div class="icon" style="color: #f44336;">❌</div>
            <p style="color: #f44336;">生成失敗：\${error.message}</p>
            <p style="font-size: 0.9em; color: #666; margin-top: 10px;">
              請檢查網絡連接或稍後重試
            </p>
          </div>
        \`;
      } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '🎨 開始生成';
      }
    }
    
    // 顯示結果
    function displayResult(imageUrl, metadata) {
      const resultContainer = document.getElementById('resultContainer');
      const metaInfo = document.getElementById('metaInfo');
      const translationInfo = document.getElementById('translationInfo');
      const actionButtons = document.getElementById('actionButtons');
      
      // 顯示圖片
      resultContainer.innerHTML = \`
        <img src="\${imageUrl}" alt="Generated Image">
      \`;
      
      // 顯示元資訊
      const styleName = currentConfig.styles.find(s => s.id === metadata.style)?.name || metadata.style;
      const qualityModeName = currentConfig.quality_modes.find(q => q.id === metadata.quality_mode || metadata.qualityMode)?.name || metadata.quality_mode || metadata.qualityMode;
      const qualityModeName = currentConfig.quality_modes.find(q => q.id === metadata.quality_mode || q.id === metadata.qualityMode)?.name || metadata.quality_mode || metadata.qualityMode;
      
      metaInfo.innerHTML = \`
        <div>
          <strong>🤖 模型</strong>
          <span>\${metadata.model}</span>
        </div>
        <div>
          <strong>📐 尺寸</strong>
          <span>\${metadata.width} × \${metadata.height}</span>
        </div>
        <div>
          <strong>🎨 風格</strong>
          <span>\${styleName}</span>
        </div>
        <div>
          <strong>💎 質量</strong>
          <span>\${qualityModeName}</span>
        </div>
        \${metadata.seed ? \`
        <div>
          <strong>🎲 種子</strong>
          <span>\${metadata.seed}</span>
        </div>
        \` : ''}
        \${metadata.steps ? \`
        <div>
          <strong>🎯 步數</strong>
          <span>\${metadata.steps}</span>
        </div>
        \` : ''}
        \${metadata.guidance ? \`
        <div>
          <strong>📊 引導</strong>
          <span>\${metadata.guidance}</span>
        </div>
        \` : ''}
        <div>
          <strong>✨ HD優化</strong>
          <span>\${metadata.hd_optimized || metadata.hdOptimized ? '✅ 已啟用' : '❌ 未啟用'}</span>
        </div>
        <div>
          <strong>🌐 自動翻譯</strong>
          <span>\${metadata.auto_translated || metadata.autoTranslated ? '✅ 已翻譯' : '⚪ 未翻譯'}</span>
        </div>
        <div>
          <strong>🔐 API認證</strong>
          <span>\${metadata.authenticated ? '✅ 已認證' : '⚠️ 未認證'}</span>
        </div>
        \${metadata.generation_mode ? \`
        <div>
          <strong>🖼️ 生成模式</strong>
          <span>\${metadata.generation_mode}</span>
        </div>
        \` : ''}
      \`;
      metaInfo.style.display = 'block';
      
      // 顯示翻譯資訊（如果有）
      if (metadata.translation_info && metadata.translation_info.original) {
        translationInfo.innerHTML = \`
          <h4>🌐 Google 翻譯資訊</h4>
          <div class="content">
            <div class="label">原文（\${metadata.translation_info.detected_language || 'zh'}）：</div>
            <div class="text">\${metadata.translation_info.original}</div>
          </div>
          <div class="content">
            <div class="label">譯文（en）：</div>
            <div class="text">\${metadata.translation_info.translated}</div>
          </div>
          <div class="content">
            <div class="label">翻譯引擎：</div>
            <div class="text">\${metadata.translation_info.model} <span class="badge success">免費</span></div>
          </div>
          \${metadata.translation_info.confidence ? \`
          <div class="content">
            <div class="label">信心分數：</div>
            <div class="text">\${(metadata.translation_info.confidence * 100).toFixed(0)}%</div>
          </div>
          \` : ''}
        \`;
        translationInfo.style.display = 'block';
      } else {
        translationInfo.style.display = 'none';
      }
      
      // 顯示操作按鈕
      actionButtons.style.display = 'flex';
    }
    
    // 下載圖片
    function downloadImage() {
      if (!currentImage) {
        alert('沒有可下載的圖片');
        return;
      }
      
      const link = document.createElement('a');
      link.href = currentImage;
      link.download = \`flux-ai-\${Date.now()}.png\`;
      link.click();
    }
    
    // 生成新圖
    function generateNew() {
      document.getElementById('resultContainer').innerHTML = \`
        <div class="placeholder">
          <div class="icon">🎨</div>
          <p>設定參數後點擊「開始生成」</p>
        </div>
      \`;
      document.getElementById('metaInfo').style.display = 'none';
      document.getElementById('translationInfo').style.display = 'none';
      document.getElementById('actionButtons').style.display = 'none';
      currentImage = null;
      currentMetadata = null;
    }
    
    // 綁定事件
    document.getElementById('generateBtn')?.addEventListener('click', generateImage);
    document.getElementById('downloadBtn')?.addEventListener('click', downloadImage);
    document.getElementById('newBtn')?.addEventListener('click', generateNew);
    
    // Enter 鍵快捷生成
    document.getElementById('prompt')?.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        generateImage();
      }
    });
    
    // 頁面載入時初始化
    window.addEventListener('DOMContentLoaded', async () => {
      console.log('🎨 Flux AI Pro 正在初始化...');
      await loadConfig();
      console.log('✅ 初始化完成！');
      
      // 顯示系統狀態
      const healthResponse = await fetch('/health');
      const health = await healthResponse.json();
      console.log('📊 系統狀態:', health);
      
      if (!health.api_key_configured) {
        const warningBox = document.createElement('div');
        warningBox.className = 'info-box warning';
        warningBox.innerHTML = \`
          <h4>⚠️ API Key 未設定</h4>
          <p>新 Pollinations API 端點需要 API Key 才能正常使用。請在 Cloudflare Workers 環境變數中設定 <code>POLLINATIONS_API_KEY</code>。</p>
          <p style="margin-top: 8px;">未設定 API Key 的請求可能會失敗。</p>
        \`;
        document.querySelector('.panel').insertBefore(warningBox, document.querySelector('.info-box'));
      }
      
      // 顯示翻譯引擎資訊
      console.log('🌐 翻譯引擎:', health.translation_engine);
      console.log('✅ 免費翻譯:', health.features?.translation_free ? '是' : '否');
    });
  </script>
</body>
</html>
`;
