// =================================================================================
//  擴展風格配置 (Extended Styles)
//  額外的藝術風格，可持續擴展
// =================================================================================

export const EXTENDED_STYLES = {
  // ====== 賽博朋克擴展 ======
  "cyberpunk-2077": {
    name: "賽博朋克 2077",
    prompt: "cyberpunk 2077 style, neon lights, futuristic city, high-tech low-life, night city, chrome, cybernetics, holographic displays, rain-soaked streets, blade runner aesthetic, keanu reeves, johnny silverhand",
    negative: "natural, rustic, medieval, fantasy, daylight, organic, clean",
    category: "scifi",
    icon: "🌃",
    description: "CDPR 賽博朋克 2077 遊戲風格"
  },
  "cyberpunk-retro": {
    name: "復古賽博",
    prompt: "retro cyberpunk, 80s aesthetic, vhs glitch, analog technology, cassette futurism, neon pink and cyan, grid patterns, wireframe graphics, synthwave, outrun",
    negative: "modern, clean, realistic, high definition, 4k",
    category: "scifi",
    icon: "📼",
    description: "80 年代復古賽博朋克"
  },
  "cyberpunk-noir": {
    name: "賽博黑色",
    prompt: "cyberpunk noir, dark detective, rain, neon reflections, shadows, mystery, film noir aesthetic, futuristic noir, blade runner 2049, ryan gosling",
    negative: "bright, cheerful, colorful, daylight, clean",
    category: "scifi",
    icon: "🌧️",
    description: "黑色電影風格賽博朋克"
  },

  // ====== 奇幻擴展 ======
  "dark-fantasy": {
    name: "黑暗奇幻",
    prompt: "dark fantasy, gothic horror, eldritch horror, lovecraftian, ominous atmosphere, twisted creatures, ancient ruins, forbidden magic, shadows and darkness, bloodborne, dark souls",
    negative: "bright, cheerful, cute, colorful, lighthearted, daylight",
    category: "fantasy",
    icon: "🌑",
    description: "黑暗哥特奇幻風格"
  },
  "high-fantasy": {
    name: "高等奇幻",
    prompt: "high fantasy, epic fantasy, tolkien style, majestic castles, noble knights, dragons, elves, dwarves, magical realms, heroic quests, lord of the rings, middle earth",
    negative: "modern, urban, sci-fi, dark horror, gritty",
    category: "fantasy",
    icon: "🏰",
    description: "托爾金式高等奇幻"
  },
  "fairy-tale": {
    name: "童話風格",
    prompt: "fairy tale style, whimsical, magical, enchanted forest, fairy lights, dreamlike, storybook illustration, disney style, princess, castle, magical creatures",
    negative: "dark, gritty, realistic, horror, modern",
    category: "fantasy",
    icon: "🧚",
    description: "經典童話故事風格"
  },
  "mythology": {
    name: "神話風格",
    prompt: "mythological art, greek mythology, roman mythology, norse mythology, gods and goddesses, ancient temples, epic scenes, classical art, renaissance painting",
    negative: "modern, sci-fi, anime, cartoon",
    category: "fantasy",
    icon: "⚡",
    description: "古典神話藝術風格"
  },

  // ====== 藝術運動擴展 ======
  "art-deco": {
    name: "裝飾藝術",
    prompt: "art deco style, geometric patterns, gold and black, luxury, elegance, 1920s, great gatsby, streamlined forms, decorative motifs, jazz age, roaring twenties",
    negative: "minimalist, rustic, organic, asymmetrical, modern",
    category: "art-movement",
    icon: "💎",
    description: "1920 年代裝飾藝術風格"
  },
  "bauhaus": {
    name: "包豪斯",
    prompt: "bauhaus style, minimalist geometric, primary colors, functional design, clean lines, abstract shapes, modernist, industrial, walter gropius, german design",
    negative: "ornate, decorative, organic, traditional, baroque",
    category: "art-movement",
    icon: "🔲",
    description: "德國包豪斯設計風格"
  },
  "expressionism": {
    name: "表現主義",
    prompt: "expressionist art, emotional, distorted, bold colors, edvard munch, the scream, german expressionism, angst, psychological, intense",
    negative: "realistic, calm, peaceful, photorealistic",
    category: "art-movement",
    icon: "😱",
    description: "德國表現主義風格"
  },
  "dadaism": {
    name: "達達主義",
    prompt: "dada art, absurd, collage, ready-made, anti-art, marcel duchamp, chaotic, nonsensical, avant-garde, experimental",
    negative: "traditional, realistic, beautiful, harmonious",
    category: "art-movement",
    icon: "🎭",
    description: "達達主義反藝術風格"
  },
  "fauvism": {
    name: "野獸派",
    prompt: "fauvism, wild beasts, bold unnatural colors, henri matisse, expressive, vibrant, simplified forms, emotional color",
    negative: "realistic, muted, natural colors, detailed",
    category: "art-movement",
    icon: "🦁",
    description: "野獸派大膽色彩風格"
  },

  // ====== 視覺風格擴展 ======
  "synthwave": {
    name: "合成波",
    prompt: "synthwave, retrowave, 80s nostalgia, neon grids, sunset, palm trees, digital landscape, vhs aesthetic, purple and pink gradient, outrun, driving at night",
    negative: "natural, realistic, daylight, organic, clean",
    category: "visual",
    icon: "🌆",
    description: "80 年代合成波音樂視覺風格"
  },
  "outrun": {
    name: "Outrun",
    prompt: "outrun aesthetic, retro futuristic, 80s sports cars, neon lights, sunset, palm trees, wireframe landscapes, digital dreams, kung fury, miami vice",
    negative: "modern, realistic, daylight, natural, vintage",
    category: "visual",
    icon: "🚗",
    description: "Outrun 駕駛遊戲風格"
  },
  "retro-wave": {
    name: "復古波",
    prompt: "retrowave, 80s retro, cassette tapes, vhs, crt monitors, scanlines, pixel art, neon, nostalgia, analog technology",
    negative: "modern, digital, clean, 4k, realistic",
    category: "visual",
    icon: "📼",
    description: "80 年代復古科技風格"
  },
  "y2k": {
    name: "千禧風格",
    prompt: "y2k aesthetic, year 2000, millennium, chrome, metallic, futuristic 2000s, britney spears, nsync, bubblegum, glossy, iridescent",
    negative: "grunge, dark, vintage, rustic, organic",
    category: "visual",
    icon: "✨",
    description: "2000 年代千禧美學"
  },
  "grunge": {
    name: "垃圾搖滾",
    prompt: "grunge aesthetic, 90s, kurt cobain, nirvana, flannel, distressed, dirty, raw, alternative rock, seattle, moody",
    negative: "clean, polished, bright, cheerful, pop",
    category: "visual",
    icon: "🎸",
    description: "90 年代垃圾搖滾風格"
  },

  // ====== 數位風格擴展 ======
  "voxel-art": {
    name: "體素藝術",
    prompt: "voxel art, 3D pixel art, blocky, minecraft style, cubic, isometric, colorful blocks, low poly 3D, lego-like",
    negative: "smooth, realistic, organic, high detail, curved",
    category: "digital",
    icon: "🧊",
    description: "3D 體素像素藝術"
  },
  "isometric": {
    name: "等距視角",
    prompt: "isometric art, isometric view, 2.5D, architectural, clean lines, flat design, geometric, city builder style, simcity, diorama",
    negative: "perspective, realistic, organic, messy, 3d realistic",
    category: "digital",
    icon: "📐",
    description: "等距視角建築風格"
  },
  "flat-design": {
    name: "扁平設計",
    prompt: "flat design, minimalist, clean, simple shapes, solid colors, no gradients, modern ui, material design, vector art",
    negative: "realistic, 3d, textured, detailed, skeuomorphic",
    category: "digital",
    icon: "🔷",
    description: "現代扁平設計風格"
  },
  "skeuomorphic": {
    name: "擬物化",
    prompt: "skeuomorphic design, realistic textures, leather, wood, metal, glass, shadows, depth, apple ios 6 style, realistic ui",
    negative: "flat, minimalist, abstract, simple",
    category: "digital",
    icon: "📱",
    description: "擬物化設計風格"
  },
  "generative-art": {
    name: "生成藝術",
    prompt: "generative art, algorithmic, procedural, mathematical, fractal, geometric patterns, code-generated, complex, intricate, computational art",
    negative: "hand-drawn, organic, realistic, traditional",
    category: "digital",
    icon: "🔮",
    description: "算法生成藝術風格"
  },

  // ====== 傳統藝術擴展 ======
  "byzantine": {
    name: "拜占庭",
    prompt: "byzantine art, gold leaf, religious icons, mosaics, rich colors, ornate patterns, medieval, eastern orthodox, halos, divine",
    negative: "minimalist, modern, secular, plain, protestant",
    category: "traditional",
    icon: "✝️",
    description: "拜占庭帝國藝術風格"
  },
  "celtic": {
    name: "凱爾特",
    prompt: "celtic art, celtic knots, intricate patterns, interlacing, medieval, ornamental, green and gold, ancient irish, druidic",
    negative: "minimalist, modern, geometric simple, clean",
    category: "traditional",
    icon: "☘️",
    description: "凱爾特結節藝術風格"
  },
  "art-nouveau-2": {
    name: "新藝術 2",
    prompt: "art nouveau extended, alphonse mucha, gustav klimt, decorative, ornate, flowing lines, floral, elegant, gold leaf, vienna secession",
    negative: "minimalist, geometric, modern, industrial",
    category: "traditional",
    icon: "🌸",
    description: "新藝術運動擴展風格"
  },
  "rococo": {
    name: "洛可可",
    prompt: "rococo art, ornate, delicate, pastel colors, playful, decorative, french, 18th century, fragonard, boucher, elegant",
    negative: "dark, serious, minimalist, modern",
    category: "traditional",
    icon: "🎀",
    description: "18 世紀洛可可藝術風格"
  },

  // ====== 美學風格擴展 ======
  "cottagecore": {
    name: "鄉村風",
    prompt: "cottagecore aesthetic, cottage, garden, flowers, vintage, pastoral, cozy, romantic, english countryside, cottage life, baking, nature",
    negative: "urban, modern, industrial, dark, gritty",
    category: "aesthetic",
    icon: "🏡",
    description: "鄉村生活美學風格"
  },
  "dark-academia": {
    name: "黑暗學院",
    prompt: "dark academia aesthetic, old books, libraries, universities, tweed, vintage, scholarly, gothic, mysterious, classic literature, oxford",
    negative: "bright, colorful, modern, casual, sporty",
    category: "aesthetic",
    icon: "📚",
    description: "學術黑暗美學風格"
  },
  "light-academia": {
    name: "明亮學院",
    prompt: "light academia aesthetic, art museums, coffee shops, vintage, scholarly, soft colors, classical, romantic, european, poetry",
    negative: "dark, gritty, modern, streetwear",
    category: "aesthetic",
    icon: "☕",
    description: "學術明亮美學風格"
  },
  "royalcore": {
    name: "皇室風",
    prompt: "royalcore aesthetic, royalty, princess, queen, palace, crown, jewels, elegant, regal, luxury, monarchy, tiara",
    negative: "casual, modern, street, grunge",
    category: "aesthetic",
    icon: "👸",
    description: "皇室貴族美學風格"
  },

  // ====== 科幻擴展 ======
  "space-opera": {
    name: "太空歌劇",
    prompt: "space opera, star wars, star trek, epic space battles, alien worlds, spaceships, futuristic, grand scale, adventure, cosmic",
    negative: "grounded, realistic, modern day, small scale",
    category: "scifi",
    icon: "🚀",
    description: "太空歌劇科幻風格"
  },
  "hard-scifi": {
    name: "硬科幻",
    prompt: "hard science fiction, realistic space, nasa, astronauts, space stations, satellites, realistic technology, physics-based, the martian, interstellar",
    negative: "fantasy, magic, unrealistic, cartoonish",
    category: "scifi",
    icon: "🛸",
    description: "硬核科幻風格"
  },
  "solarpunk": {
    name: "太陽朋克",
    prompt: "solarpunk, renewable energy, green technology, sustainable, utopian, solar panels, wind turbines, gardens, eco-friendly, bright future",
    negative: "dystopian, dark, polluted, industrial, cyberpunk",
    category: "scifi",
    icon: "☀️",
    description: "太陽朋克烏托邦風格"
  },
  "biopunk": {
    name: "生物朋克",
    prompt: "biopunk, genetic engineering, biotechnology, organic technology, dna, mutations, biological horror, body horror, genetic modification",
    negative: "mechanical, robotic, clean, sterile",
    category: "scifi",
    icon: "🧬",
    description: "生物科技朋克風格"
  },

  // ====== 動漫擴展 ======
  "shonen": {
    name: "少年漫",
    prompt: "shonen anime style, action-packed, dynamic poses, battle manga, dragon ball, naruto, one piece, intense, powerful, energetic",
    negative: "slice of life, calm, peaceful, realistic",
    category: "illustration",
    icon: "⚔️",
    description: "少年漫畫動作風格"
  },
  "shojo": {
    name: "少女漫",
    prompt: "shojo anime style, romantic, delicate, sparkles, flowers, soft colors, sailor moon, cardcaptor sakura, cute, emotional",
    negative: "dark, gritty, action-heavy, realistic",
    category: "illustration",
    icon: "💖",
    description: "少女漫畫浪漫風格"
  },
  "seinen": {
    name: "青年漫",
    prompt: "seinen anime style, mature, detailed, realistic proportions, darker themes, berserk, attack on titan, vinland saga, complex",
    negative: "cute, childish, simple, bright",
    category: "illustration",
    icon: "🗡️",
    description: "青年漫畫成熟風格"
  },
  "isekai": {
    name: "異世界",
    prompt: "isekai anime style, fantasy world, transported to another world, rpg elements, magic, adventure, sword art online, overlord, konosuba",
    negative: "modern day, realistic, slice of life",
    category: "illustration",
    icon: "🌀",
    description: "異世界動漫風格"
  },

  // ====== 日本漫畫作者風格 ======
  "oda-eiichiro": {
    name: "尾田榮一郎",
    prompt: "eiichiro oda style, one piece manga, dynamic action poses, exaggerated expressions, detailed character designs, adventurous, pirate aesthetic, bold linework, vibrant colors, comic book style",
    negative: "realistic, photograph, 3d, western comic, stiff",
    category: "manga-author",
    icon: "🏴‍☠️",
    description: "《海賊王》作者尾田榮一郎風格"
  },
  "kishimoto-masashi": {
    name: "岸本齊史",
    prompt: "masashi kishimoto style, naruto manga, ninja aesthetic, dynamic action scenes, detailed ninja gear, chakra effects, dramatic poses, shonen manga style, japanese comic art",
    negative: "realistic, photograph, western comic, soft",
    category: "manga-author",
    icon: "🍥",
    description: "《火影忍者》作者岸本齊史風格"
  },
  "toriyama-akira": {
    name: "鳥山明",
    prompt: "akira toriyama style, dragon ball manga, classic shonen, muscular characters, dynamic action poses, martial arts, dragon ball aesthetic, bold outlines, vibrant colors, retro anime",
    negative: "realistic, photograph, 3d, western comic",
    category: "manga-author",
    icon: "🐉",
    description: "《七龍珠》作者鳥山明風格"
  },
  "araki-hirohiko": {
    name: "荒木飛呂彥",
    prompt: "hirohiko araki style, jojo's bizarre adventure, unique poses, fashion-forward, stylish, dramatic, bold colors, manga art, distinctive character designs, jojo aesthetic",
    negative: "realistic, photograph, conventional, boring",
    category: "manga-author",
    icon: "✨",
    description: "《JoJo的奇妙冒險》作者荒木飛呂彥風格"
  },
  "kubo-tite": {
    name: "久保帶人",
    prompt: "tite kubo style, bleach manga, shinigami aesthetic, detailed character designs, sword fighting, soul reaper, dramatic poses, gothic elements, japanese comic art",
    negative: "realistic, photograph, western comic, cute",
    category: "manga-author",
    icon: "⚔️",
    description: "《死神》作者久保帶人風格"
  },
  "togashi-yoshihiro": {
    name: "富堅義博",
    prompt: "yoshihiro togashi style, hunter x hunter manga, detailed character designs, nen abilities, dynamic action, shonen manga, adventure, japanese comic art, intricate details",
    negative: "realistic, photograph, western comic, simple",
    category: "manga-author",
    icon: "🎯",
    description: "《獵人》作者富堅義博風格"
  },
  "aoyama-gosho": {
    name: "青山剛昌",
    prompt: "gosho aoyama style, detective conan manga, mystery, detective aesthetic, detailed character designs, crime solving, japanese comic art, classic manga style",
    negative: "realistic, photograph, western comic, action-heavy",
    category: "manga-author",
    icon: "🔍",
    description: "《名偵探柯南》作者青山剛昌風格"
  },
  "takahashi-rumiko": {
    name: "高橋留美子",
    prompt: "rumiko takahashi style, ranma 1/2, inuyasha, romantic comedy, fantasy, detailed character designs, classic shojo/shonen blend, japanese comic art, expressive",
    negative: "realistic, photograph, western comic, dark",
    category: "manga-author",
    icon: "🌸",
    description: "《亂馬1/2》《犬夜叉》作者高橋留美子風格"
  },
  "tezuka-osamu": {
    name: "手塚治蟲",
    prompt: "osamu tezuka style, astro boy, classic manga, retro anime, black and white manga, detailed linework, manga pioneer, japanese comic art, vintage style",
    negative: "realistic, photograph, modern, 3d",
    category: "manga-author",
    icon: "🤖",
    description: "《原子小金剛》作者手塚治蟲風格"
  },
  "miyazaki-hayao": {
    name: "宮崎駿",
    prompt: "hayao miyazaki style, studio ghibli, spirited away, howl's moving castle, anime art, soft colors, detailed backgrounds, whimsical, magical, hand-drawn animation style",
    negative: "realistic, photograph, western animation, dark",
    category: "manga-author",
    icon: "🍃",
    description: "吉卜力工作室宮崎駿風格"
  },
  "shinkai-makoto": {
    name: "新海誠",
    prompt: "makoto shinkai style, your name, weathering with you, anime art, photorealistic backgrounds, emotional, atmospheric, detailed scenery, modern anime aesthetic, beautiful lighting",
    negative: "cartoonish, simple, western animation, flat",
    category: "manga-author",
    icon: "☁️",
    description: "《你的名字》作者新海誠風格"
  },
  "isayama-hajime": {
    name: "諫山創",
    prompt: "hajime isayama style, attack on titan, dark fantasy, intense action, detailed character designs, titan aesthetic, gritty, dramatic, manga art, horror elements",
    negative: "cute, cheerful, colorful, lighthearted",
    category: "manga-author",
    icon: "🗡️",
    description: "《進擊的巨人》作者諫山創風格"
  },
  "gotouge-koyoharu": {
    name: "吾峠呼世晴",
    prompt: "koyoharu gotouge style, demon slayer, kimetsu no yaiba, detailed character designs, demon slayer aesthetic, dynamic action, beautiful art, japanese comic art, fantasy",
    negative: "realistic, photograph, western comic, simple",
    category: "manga-author",
    icon: "🌙",
    description: "《鬼滅之刃》作者吾峠呼世晴風格"
  },
  "fujiko-f-fujio": {
    name: "藤子·F·不二雄",
    prompt: "fujiko f fujio style, doraemon, classic manga, retro anime, cute characters, adventure, japanese comic art, family-friendly, nostalgic style",
    negative: "realistic, photograph, dark, gritty",
    category: "manga-author",
    icon: "🐱",
    description: "《哆啦A夢》作者藤子·F·不二雄風格"
  },
  "horikoshi-kohei": {
    name: "堀越耕平",
    prompt: "kohei horikoshi style, my hero academia, superhero manga, dynamic action, detailed character designs, hero aesthetic, shonen manga, japanese comic art, vibrant",
    negative: "realistic, photograph, western comic, dark",
    category: "manga-author",
    icon: "💪",
    description: "《我的英雄學院》作者堀越耕平風格"
  },

  // ====== 繪畫擴展 ======
  "acrylic": {
    name: "丙烯畫",
    prompt: "acrylic painting, bold colors, textured, vibrant, modern, thick brushstrokes, expressive, contemporary art",
    negative: "watercolor, oil painting, soft, delicate",
    category: "painting",
    icon: "🎨",
    description: "丙烯顏料繪畫風格"
  },
  "pastel": {
    name: "粉彩畫",
    prompt: "pastel art, soft colors, chalk, delicate, dreamy, gentle, muted tones, romantic, impressionist",
    negative: "bold, dark, vibrant, harsh",
    category: "painting",
    icon: "🖍️",
    description: "粉彩筆繪畫風格"
  },
  "gouache": {
    name: "水粉畫",
    prompt: "gouache painting, opaque watercolor, matte finish, flat colors, illustrative, design, bold, graphic",
    negative: "transparent, glossy, realistic, detailed",
    category: "painting",
    icon: "🖌️",
    description: "水粉顏料繪畫風格"
  },
  "encaustic": {
    name: "蠟畫",
    prompt: "encaustic painting, wax medium, textured, layered, luminous, ancient, ethereal, abstract, beeswax",
    negative: "smooth, flat, digital, clean",
    category: "painting",
    icon: "🕯️",
    description: "熱蠟繪畫風格"
  }
};

export const EXTENDED_CATEGORIES = {
  'cyberpunk': { name: '賽博朋克', icon: '🌃', order: 14 },
  'dark-fantasy': { name: '黑暗奇幻', icon: '🌑', order: 15 },
  'high-fantasy': { name: '高等奇幻', icon: '🏰', order: 16 },
  'fairy-tale': { name: '童話', icon: '🧚', order: 17 },
  'mythology': { name: '神話', icon: '⚡', order: 18 },
  'retro': { name: '復古', icon: '📼', order: 19 },
  'academic': { name: '學院風', icon: '📚', order: 20 },
  'royal': { name: '皇室風', icon: '👸', order: 21 },
  'eco': { name: '生態', icon: '☀️', order: 22 },
  'anime-genre': { name: '動漫類型', icon: '📺', order: 23 },
  'manga-author': { name: '漫畫作者', icon: '✏️', order: 24 }
};
