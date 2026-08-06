const PROFILES = {
  rtx50high: {
    label: "RTX 5070 Ti 이상 / 5080 / 5090",
    short: "RTX 50 상급",
    hint: "고화질 유지",
    gpu: "RTX 5070 Ti / 5080 / 5090",
    vram: "12GB 이상",
    values: {
      dlss: 1, dlssPreset: 2, screen: 100, gamma: 2.05, skylight: 1.35, sharpen: 0.58,
      viewDistance: 1.85, staticLod: 0.58, skeletalBias: -2, nanitePixels: 1.9, naniteBias: 0,
      lumenReflections: 1, lumenDiffuse: 1, lumenProbe: 24, lumenMeshSdf: 1,
      poolSize: 6144, limitPoolToVram: 1, streamingPerFrame: 64, streamingBoost: 1.18,
      emitterScale: 0.85, particleLight: 0, meshLight: 0, gcPurge: 150, forceGc: 1,
      shadowQuality: 4, cascades: 4, shadowDistance: 1.2, radiusThreshold: 0.035,
      ssr: 3, contactShadows: 1, bloom: 3, fog: 0, waterReflection: 1,
      boostPlayerTextures: 1.25, createShadersOnLoad: 1,
    },
  },
  rtx5060ti: {
    label: "RTX 5060 / 5060 Ti / 5070",
    short: "RTX 5060/5070",
    hint: "균형 추천",
    gpu: "RTX 5060 / 5060 Ti / RTX 5070",
    vram: "8GB~12GB",
    values: {
      dlss: 1, dlssPreset: 2, screen: 100, gamma: 2.1, skylight: 1.3, sharpen: 0.55,
      viewDistance: 1.55, staticLod: 0.74, skeletalBias: -2, nanitePixels: 2.35, naniteBias: 0.05,
      lumenReflections: 1, lumenDiffuse: 1, lumenProbe: 16, lumenMeshSdf: 1,
      poolSize: 4096, limitPoolToVram: 1, streamingPerFrame: 50, streamingBoost: 1.08,
      emitterScale: 0.78, particleLight: 0, meshLight: 0, gcPurge: 120, forceGc: 1,
      shadowQuality: 3, cascades: 3, shadowDistance: 1.05, radiusThreshold: 0.05,
      ssr: 2, contactShadows: 1, bloom: 2, fog: 0, waterReflection: 1,
      boostPlayerTextures: 1.15, createShadersOnLoad: 1,
    },
  },
  rtx40high: {
    label: "RTX 4080 / 4080 SUPER / 4090",
    short: "RTX 4080/4090",
    hint: "고화질",
    gpu: "RTX 4080 / 4080 SUPER / 4090",
    vram: "16GB 이상",
    values: {
      dlss: 1, dlssPreset: 2, screen: 100, gamma: 2.05, skylight: 1.35, sharpen: 0.58,
      viewDistance: 1.85, staticLod: 0.58, skeletalBias: -2, nanitePixels: 1.9, naniteBias: 0,
      lumenReflections: 1, lumenDiffuse: 1, lumenProbe: 24, lumenMeshSdf: 1,
      poolSize: 6144, limitPoolToVram: 1, streamingPerFrame: 64, streamingBoost: 1.18,
      emitterScale: 0.85, particleLight: 0, meshLight: 0, gcPurge: 150, forceGc: 1,
      shadowQuality: 4, cascades: 4, shadowDistance: 1.2, radiusThreshold: 0.035,
      ssr: 3, contactShadows: 1, bloom: 3, fog: 0, waterReflection: 1,
      boostPlayerTextures: 1.25, createShadersOnLoad: 1,
    },
  },
  rtx4070: {
    label: "RTX 4070 / 4070 SUPER / 4070 Ti",
    short: "RTX 4070",
    hint: "품질 균형",
    gpu: "RTX 4070 / 4070 SUPER / 4070 Ti",
    vram: "12GB 이상",
    values: {
      dlss: 1, dlssPreset: 2, screen: 100, gamma: 2.05, skylight: 1.3, sharpen: 0.56,
      viewDistance: 1.65, staticLod: 0.68, skeletalBias: -2, nanitePixels: 2.15, naniteBias: 0.05,
      lumenReflections: 1, lumenDiffuse: 1, lumenProbe: 16, lumenMeshSdf: 1,
      poolSize: 4608, limitPoolToVram: 1, streamingPerFrame: 54, streamingBoost: 1.1,
      emitterScale: 0.8, particleLight: 0, meshLight: 0, gcPurge: 120, forceGc: 1,
      shadowQuality: 3, cascades: 3, shadowDistance: 1.05, radiusThreshold: 0.045,
      ssr: 2, contactShadows: 1, bloom: 2, fog: 0, waterReflection: 1,
      boostPlayerTextures: 1.18, createShadersOnLoad: 1,
    },
  },
  rtx40mid: {
    label: "RTX 4060 / 4060 Ti",
    short: "RTX 4060",
    hint: "프레임 방어",
    gpu: "RTX 4060 / 4060 Ti",
    vram: "8GB~16GB",
    values: {
      dlss: 1, dlssPreset: 2, screen: 100, gamma: 2.05, skylight: 1.25, sharpen: 0.55,
      viewDistance: 1.55, staticLod: 0.74, skeletalBias: -2, nanitePixels: 2.35, naniteBias: 0.08,
      lumenReflections: 1, lumenDiffuse: 1, lumenProbe: 12, lumenMeshSdf: 1,
      poolSize: 3500, limitPoolToVram: 1, streamingPerFrame: 50, streamingBoost: 1.05,
      emitterScale: 0.75, particleLight: 0, meshLight: 0, gcPurge: 120, forceGc: 1,
      shadowQuality: 3, cascades: 3, shadowDistance: 1, radiusThreshold: 0.05,
      ssr: 2, contactShadows: 1, bloom: 2, fog: 0, waterReflection: 1,
      boostPlayerTextures: 1.15, createShadersOnLoad: 1,
    },
  },
  rtx30high: {
    label: "RTX 3070 / 3070 Ti / 3080 / 3090",
    short: "RTX 3070+",
    hint: "30 상급",
    gpu: "RTX 3070 / 3080 / 3090",
    vram: "8GB~24GB",
    values: {
      dlss: 1, dlssPreset: 2, screen: 100, gamma: 1.9, skylight: 1.6, sharpen: 0.55,
      viewDistance: 1.55, staticLod: 0.7, skeletalBias: -2, nanitePixels: 2.3, naniteBias: 0.05,
      lumenReflections: 1, lumenDiffuse: 1, lumenProbe: 16, lumenMeshSdf: 1,
      poolSize: 5000, limitPoolToVram: 0, streamingPerFrame: 50, streamingBoost: 1.08,
      emitterScale: 0.78, particleLight: 0, meshLight: 0, gcPurge: 120, forceGc: 1,
      shadowQuality: 3, cascades: 3, shadowDistance: 1.05, radiusThreshold: 0.045,
      ssr: 2, contactShadows: 1, bloom: 3, fog: 0, waterReflection: 1,
      boostPlayerTextures: 1.2, createShadersOnLoad: 1,
    },
  },
  rtx3060ti: {
    label: "RTX 3060 Ti",
    short: "RTX 3060 Ti",
    hint: "8GB 균형",
    gpu: "RTX 3060 Ti",
    vram: "8GB",
    values: {
      dlss: 1, dlssPreset: 2, screen: 100, gamma: 2.05, skylight: 1.25, sharpen: 0.54,
      viewDistance: 1.5, staticLod: 0.78, skeletalBias: -1, nanitePixels: 2.45, naniteBias: 0.08,
      lumenReflections: 1, lumenDiffuse: 1, lumenProbe: 12, lumenMeshSdf: 1,
      poolSize: 3500, limitPoolToVram: 1, streamingPerFrame: 42, streamingBoost: 1,
      emitterScale: 0.7, particleLight: 0, meshLight: 0, gcPurge: 120, forceGc: 1,
      shadowQuality: 3, cascades: 2, shadowDistance: 0.95, radiusThreshold: 0.055,
      ssr: 1, contactShadows: 1, bloom: 2, fog: 0, waterReflection: 1,
      boostPlayerTextures: 1.1, createShadersOnLoad: 1,
    },
  },
  rtx3060: {
    label: "RTX 3060 12GB",
    short: "RTX 3060",
    hint: "12GB 균형",
    gpu: "RTX 3060 12GB",
    vram: "12GB",
    values: {
      dlss: 1, dlssPreset: 2, screen: 100, gamma: 2.05, skylight: 1.25, sharpen: 0.54,
      viewDistance: 1.45, staticLod: 0.82, skeletalBias: -1, nanitePixels: 2.55, naniteBias: 0.1,
      lumenReflections: 1, lumenDiffuse: 1, lumenProbe: 12, lumenMeshSdf: 1,
      poolSize: 4096, limitPoolToVram: 1, streamingPerFrame: 42, streamingBoost: 1,
      emitterScale: 0.7, particleLight: 0, meshLight: 0, gcPurge: 120, forceGc: 1,
      shadowQuality: 3, cascades: 2, shadowDistance: 0.95, radiusThreshold: 0.055,
      ssr: 1, contactShadows: 1, bloom: 2, fog: 0, waterReflection: 1,
      boostPlayerTextures: 1.1, createShadersOnLoad: 1,
    },
  },
  rtx3050: {
    label: "RTX 3050",
    short: "RTX 3050",
    hint: "성능 우선",
    gpu: "RTX 3050",
    vram: "4GB~8GB",
    values: {
      dlss: 1, dlssPreset: 2, screen: 100, gamma: 2.05, skylight: 1.12, sharpen: 0.5,
      viewDistance: 1.18, staticLod: 1.02, skeletalBias: -1, nanitePixels: 3.1, naniteBias: 0.25,
      lumenReflections: 0, lumenDiffuse: 0, lumenProbe: 8, lumenMeshSdf: 0,
      poolSize: 2400, limitPoolToVram: 1, streamingPerFrame: 28, streamingBoost: 0.95,
      emitterScale: 0.5, particleLight: 0, meshLight: 0, gcPurge: 150, forceGc: 1,
      shadowQuality: 2, cascades: 1, shadowDistance: 0.65, radiusThreshold: 0.085,
      ssr: 0, contactShadows: 0, bloom: 1, fog: 0, waterReflection: 0,
      boostPlayerTextures: 0.9, createShadersOnLoad: 0,
    },
  },
  rtx20mid: {
    label: "RTX 2060 / 2070 / 2080",
    short: "RTX 20",
    hint: "반사/그림자 절충",
    gpu: "RTX 2060 / 2070 / 2080",
    vram: "6GB~8GB",
    values: {
      dlss: 1, dlssPreset: 2, screen: 100, gamma: 2.0, skylight: 1.25, sharpen: 0.52,
      viewDistance: 1.35, staticLod: 0.86, skeletalBias: -1, nanitePixels: 2.75, naniteBias: 0.14,
      lumenReflections: 0, lumenDiffuse: 1, lumenProbe: 8, lumenMeshSdf: 0,
      poolSize: 3000, limitPoolToVram: 1, streamingPerFrame: 40, streamingBoost: 1,
      emitterScale: 0.65, particleLight: 0, meshLight: 0, gcPurge: 120, forceGc: 1,
      shadowQuality: 2, cascades: 2, shadowDistance: 0.85, radiusThreshold: 0.06,
      ssr: 1, contactShadows: 0, bloom: 1, fog: 0, waterReflection: 0,
      boostPlayerTextures: 1.05, createShadersOnLoad: 0,
    },
  },
  gtx: {
    label: "GTX 1060 / 1650 / 1660",
    short: "GTX 계열",
    hint: "성능 우선",
    gpu: "GTX 1060 / 1650 / 1660",
    vram: "4GB~6GB",
    values: {
      dlss: 0, dlssPreset: 0, screen: 100, gamma: 2.0, skylight: 1.15, sharpen: 0.48,
      viewDistance: 1.12, staticLod: 1.0, skeletalBias: -1, nanitePixels: 3.2, naniteBias: 0.28,
      lumenReflections: 0, lumenDiffuse: 0, lumenProbe: 8, lumenMeshSdf: 0,
      poolSize: 2200, limitPoolToVram: 1, streamingPerFrame: 32, streamingBoost: 0.95,
      emitterScale: 0.55, particleLight: 0, meshLight: 0, gcPurge: 150, forceGc: 1,
      shadowQuality: 2, cascades: 1, shadowDistance: 0.7, radiusThreshold: 0.08,
      ssr: 0, contactShadows: 0, bloom: 1, fog: 0, waterReflection: 0,
      boostPlayerTextures: 1, createShadersOnLoad: 0,
    },
  },
  amdHigh: {
    label: "AMD RX 6700 XT 이상 / RX 7000",
    short: "AMD RX 상급",
    hint: "VRAM 활용",
    gpu: "RX 6700 XT 이상 / RX 7000",
    vram: "10GB 이상",
    values: {
      dlss: 0, dlssPreset: 0, screen: 100, gamma: 2.05, skylight: 1.3, sharpen: 0.55,
      viewDistance: 1.55, staticLod: 0.72, skeletalBias: -2, nanitePixels: 2.35, naniteBias: 0.08,
      lumenReflections: 1, lumenDiffuse: 1, lumenProbe: 12, lumenMeshSdf: 1,
      poolSize: 4608, limitPoolToVram: 1, streamingPerFrame: 50, streamingBoost: 1.05,
      emitterScale: 0.75, particleLight: 0, meshLight: 0, gcPurge: 120, forceGc: 1,
      shadowQuality: 3, cascades: 3, shadowDistance: 1, radiusThreshold: 0.05,
      ssr: 2, contactShadows: 1, bloom: 2, fog: 0, waterReflection: 1,
      boostPlayerTextures: 1.15, createShadersOnLoad: 1,
    },
  },
  amdMid: {
    label: "AMD RX 6600 / 7600",
    short: "AMD RX 중급",
    hint: "안정성",
    gpu: "RX 6600 / 7600",
    vram: "8GB~16GB",
    values: {
      dlss: 0, dlssPreset: 0, screen: 100, gamma: 2.05, skylight: 1.2, sharpen: 0.52,
      viewDistance: 1.35, staticLod: 0.88, skeletalBias: -1, nanitePixels: 2.75, naniteBias: 0.15,
      lumenReflections: 0, lumenDiffuse: 1, lumenProbe: 8, lumenMeshSdf: 0,
      poolSize: 3200, limitPoolToVram: 1, streamingPerFrame: 36, streamingBoost: 1,
      emitterScale: 0.62, particleLight: 0, meshLight: 0, gcPurge: 150, forceGc: 1,
      shadowQuality: 2, cascades: 2, shadowDistance: 0.8, radiusThreshold: 0.07,
      ssr: 1, contactShadows: 0, bloom: 1, fog: 0, waterReflection: 0,
      boostPlayerTextures: 1, createShadersOnLoad: 0,
    },
  },
  low: {
    label: "저사양 / 노트북 / 내장 그래픽",
    short: "저사양",
    hint: "최대 안정성",
    gpu: "내장 그래픽 / 저전력 노트북",
    vram: "4GB 이하",
    values: {
      dlss: 0, dlssPreset: 0, screen: 95, gamma: 2.05, skylight: 1.05, sharpen: 0.46,
      viewDistance: 1.0, staticLod: 1.12, skeletalBias: 0, nanitePixels: 3.55, naniteBias: 0.35,
      lumenReflections: 0, lumenDiffuse: 0, lumenProbe: 8, lumenMeshSdf: 0,
      poolSize: 1400, limitPoolToVram: 1, streamingPerFrame: 24, streamingBoost: 0.85,
      emitterScale: 0.4, particleLight: 0, meshLight: 0, gcPurge: 180, forceGc: 1,
      shadowQuality: 1, cascades: 1, shadowDistance: 0.55, radiusThreshold: 0.1,
      ssr: 0, contactShadows: 0, bloom: 0, fog: 0, waterReflection: 0,
      boostPlayerTextures: 0.8, createShadersOnLoad: 0,
    },
  },
};

const GOALS = {
  balanced: { title: "균형", desc: "처음 쓰는 사용자에게 가장 무난합니다.", tag: "추천", tune: {} },
  quality: { title: "고화질", desc: "프레임보다 예쁜 화면과 질감을 우선합니다.", tag: "고사양", tune: { sharpness: 1, resolution: 1, distance: 2, characterDistance: 1, lighting: 2, effects: 1, texture: 2, foliage: 1, postprocess: 1, latency: "smooth", water: "quality", fog: "soft", mood: "cinematic" } },
  clarity: { title: "선명도", desc: "흐릿함과 번짐을 줄이고 또렷하게 만듭니다.", tag: "시인성", tune: { sharpness: 2, resolution: 1, distance: 1, characterDistance: 1, texture: 1, foliage: 0, postprocess: -1, latency: "smooth", water: "low", fog: "off", mood: "clean" } },
  pvp: { title: "쟁/PVP", desc: "시야 확보와 전투 안정성을 우선합니다.", tag: "전투", tune: { sharpness: 1, distance: 1, characterDistance: 1, lighting: -1, effects: -1, foliage: -1, postprocess: -1, stutter: 1, latency: "responsive", water: "off", frameLimit: "120", fog: "off", mood: "clean" } },
  fps: { title: "프레임", desc: "프레임 방어와 렉 감소를 우선합니다.", tag: "성능", tune: { resolution: -1, distance: -1, lighting: -2, effects: -2, texture: -1, foliage: -2, postprocess: -2, stutter: 1, latency: "responsive", water: "off", frameLimit: "90", fog: "off" } },
  low: { title: "저사양", desc: "발열과 끊김을 최대한 줄입니다.", tag: "가벼움", tune: { sharpness: -1, resolution: -2, distance: -2, characterDistance: -1, lighting: -2, effects: -2, texture: -2, foliage: -2, postprocess: -2, stutter: 2, latency: "responsive", vram: "4", water: "off", frameLimit: "60", fog: "soft", mood: "natural" } },
};

const CUSTOM_GOAL = { title: "커스텀", desc: "사용자가 직접 조절한 설정입니다.", tag: "직접 조절", tune: {} };

const DEFAULT_TUNE = {
  sharpness: 0,
  resolution: 0,
  distance: 0,
  characterDistance: 0,
  lighting: 0,
  effects: 0,
  texture: 0,
  foliage: 0,
  postprocess: 0,
  stutter: 0,
  latency: "smooth",
  vram: "auto",
  water: "auto",
  frameLimit: "auto",
  fog: "off",
  mood: "neutral",
  motionBlur: "off",
  depthOfField: "off",
  lensFlare: "off",
};

const LABELS = {
  sharpness: { "-2": "부드러움", "-1": "약하게", 0: "기본", 1: "선명", 2: "매우 선명" },
  resolution: { "-2": "성능", "-1": "조금 낮춤", 0: "기본", 1: "높임", 2: "최대" },
  distance: { "-2": "가볍게", "-1": "조금 낮춤", 0: "기본", 1: "멀리 보기", 2: "최대 시야" },
  characterDistance: { "-2": "가볍게", "-1": "조금 낮춤", 0: "기본", 1: "선명", 2: "멀리 선명" },
  lighting: { "-2": "프레임 우선", "-1": "가볍게", 0: "기본", 1: "품질", 2: "고품질" },
  effects: { "-2": "최소", "-1": "낮춤", 0: "기본", 1: "화려하게", 2: "최대" },
  texture: { "-2": "VRAM 절약", "-1": "가볍게", 0: "기본", 1: "안정", 2: "최대 안정" },
  foliage: { "-2": "가볍게", "-1": "줄임", 0: "기본", 1: "풍성", 2: "최대" },
  postprocess: { "-2": "최소", "-1": "가볍게", 0: "기본", 1: "품질", 2: "고품질" },
  stutter: { "-2": "즉시 정리", "-1": "메모리 절약", 0: "기본", 1: "끊김 완화", 2: "최대 완화" },
};

const VRAM_CAPS = { 4: 1800, 6: 2600, 8: 3500, 12: 4096, 16: 6144 };
const STORAGE_KEY = "notmeter-optimizer-settings-v2";
const LOCALE_STORAGE_KEY = "notmeter-stats-locale";
const SUPPORTED_LOCALES = ["ko", "en", "zh-TW"];
const profileKeys = Object.keys(PROFILES);
let activeProfileKey = "rtx5060ti";
let activeGoalKey = "balanced";
let tune = { ...DEFAULT_TUNE };
let locale = normalizeLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
const OPTIMIZER_TEXT = globalThis.NotMeterOptimizerText || {};
const LANGUAGE_LABELS = { ko: "한국어", en: "English", "zh-TW": "繁中" };

const el = {
  gpuSelect: document.querySelector("#gpuSelect"),
  profileGrid: document.querySelector("#profileGrid"),
  goalGrid: document.querySelector("#goalGrid"),
  configOutput: document.querySelector("#configOutput"),
  copyButton: document.querySelector("#copyButton"),
  copyButtonSmall: document.querySelector("#copyButtonSmall"),
  copyPathButton: document.querySelector("#copyPathButton"),
  resetButton: document.querySelector("#resetButton"),
  languageButton: document.querySelector("#optimizationLanguage"),
  safetyStatus: document.querySelector("#configSafetyStatus"),
  resultTitle: document.querySelector("#resultTitle"),
  resultSummary: document.querySelector("#resultSummary"),
  metricClarity: document.querySelector("#metricClarity"),
  metricQuality: document.querySelector("#metricQuality"),
  metricLoad: document.querySelector("#metricLoad"),
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));
const round = (value, digits = 2) => Math.round((Number(value) || 0) * 10 ** digits) / 10 ** digits;
const tuneNumber = (key) => Number(tune[key] || 0);
const optimizationValue = (value) => Number.isFinite(Number(value)) ? String(value) : String(value ?? "");

function normalizeLocale(value) {
  const saved = String(value || "").trim();
  if (SUPPORTED_LOCALES.includes(saved)) return saved;
  const browserLocale = String(navigator.language || "").toLowerCase();
  if (browserLocale.startsWith("zh")) return "zh-TW";
  return browserLocale.startsWith("ko") ? "ko" : "en";
}

function translated(value) {
  const original = String(value ?? "");
  return locale === "ko" ? original : OPTIMIZER_TEXT[locale]?.[original] || original;
}

function translateStaticPage() {
  document.documentElement.lang = locale;
  el.languageButton.textContent = LANGUAGE_LABELS[locale] || "EN";
  document.title = translated("아이온2 그래픽 최적화 설정 생성기 | NOT METER");
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      return parent && !parent.closest("script, style, pre, #configOutput") && node.nodeValue.trim()
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    if (node.__notMeterOriginalText === undefined) {
      node.__notMeterOriginalText = node.nodeValue;
    }
    const original = node.__notMeterOriginalText;
    const phrase = original.trim();
    node.nodeValue = phrase
      ? original.replace(phrase, translated(phrase))
      : original;
  }
}

function sanitizeTune(value) {
  const result = { ...DEFAULT_TUNE };
  for (const key of [
    "sharpness", "resolution", "distance", "characterDistance", "lighting",
    "effects", "texture", "foliage", "postprocess", "stutter",
  ]) {
    result[key] = Math.max(-2, Math.min(2, Math.round(Number(value?.[key]) || 0)));
  }
  const allowed = {
    latency: ["smooth", "responsive"],
    vram: ["auto", "4", "6", "8", "12", "16"],
    water: ["auto", "off", "low", "quality"],
    frameLimit: ["auto", "60", "90", "120", "144", "165", "240"],
    fog: ["off", "soft", "on"],
    mood: ["neutral", "clean", "vivid", "cinematic", "natural"],
    motionBlur: ["off", "low", "game"],
    depthOfField: ["off", "on", "game"],
    lensFlare: ["off", "on", "game"],
  };
  for (const [key, values] of Object.entries(allowed)) {
    const candidate = String(value?.[key] ?? result[key]);
    if (values.includes(candidate)) result[key] = candidate;
  }
  return result;
}

function restoreSavedSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || typeof saved !== "object") return;
    if (PROFILES[saved.profile]) activeProfileKey = saved.profile;
    if (GOALS[saved.goal] || saved.goal === "custom") activeGoalKey = saved.goal;
    tune = sanitizeTune(saved.tune);
  } catch {
  }
}

function persistSettings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      profile: activeProfileKey,
      goal: activeGoalKey,
      tune: sanitizeTune(tune),
    }));
  } catch {
  }
}

const buildSummary = () => {
  const parts = [];
  if (tuneNumber("sharpness") > 0) parts.push("화면 선명도와 TAA 흐림을 보정합니다.");
  if (tuneNumber("resolution") > 0) parts.push("해상도 스케일을 올려 화면 해상감을 높입니다.");
  if (tuneNumber("resolution") < 0) parts.push("해상도 스케일을 낮춰 프레임과 발열을 줄입니다.");
  if (tuneNumber("distance") > 0) parts.push("원거리 몬스터와 오브젝트 식별을 강화합니다.");
  if (tuneNumber("characterDistance") > 0) parts.push("멀리 있는 캐릭터, 보스, NPC가 늦게 뭉개지는 현상을 줄입니다.");
  if (tuneNumber("characterDistance") < 0) parts.push("캐릭터/NPC 표현 부담을 줄여 대규모 전투 안정성을 우선합니다.");
  if (tuneNumber("lighting") > 0) parts.push("그림자와 반사 품질을 더 살립니다.");
  if (tuneNumber("effects") < 0) parts.push("전투 중 스킬 이펙트 부담을 줄입니다.");
  if (tuneNumber("texture") > 0) parts.push("텍스처 팝인과 로딩 끊김을 줄입니다.");
  if (tuneNumber("foliage") > 0) parts.push("수풀과 필드 오브젝트 표현을 더 살립니다.");
  if (tuneNumber("foliage") < 0) parts.push("필드 수풀과 오브젝트 부담을 줄입니다.");
  if (tuneNumber("postprocess") > 0) parts.push("공간감과 후처리 품질을 더 살립니다.");
  if (tuneNumber("postprocess") < 0) parts.push("후처리 효과를 줄여 저사양 PC 부담을 낮춥니다.");
  if (tune.latency === "responsive") parts.push("스킬 입력 반응성을 우선합니다.");
  if (tune.water === "off") parts.push("물과 화면 반사를 꺼서 성역/물가 프레임을 방어합니다.");
  if (tune.water === "low") parts.push("물과 반사를 낮게 유지해 화면과 프레임을 절충합니다.");
  if (tune.water === "quality") parts.push("물과 반사 품질을 살려 화면 질감을 유지합니다.");
  if (tune.frameLimit !== "auto") {
    parts.push(locale === "en"
      ? `A ${tune.frameLimit} FPS cap reduces heat and load spikes.`
      : locale === "zh-TW"
        ? `限制為 ${tune.frameLimit} FPS，以降低發熱與瞬間負載。`
        : `${tune.frameLimit} FPS 제한으로 발열과 순간 부하를 줄입니다.`);
  }
  if (tune.fog === "soft") parts.push("안개를 일부 유지해 배경 깨짐을 완화합니다.");
  if (tune.fog === "off") parts.push("안개를 꺼서 가장 선명하게 보이게 합니다.");
  if (tune.mood === "cinematic") parts.push("고화질 질감과 화면 분위기를 우선합니다.");
  if (tune.mood === "vivid") parts.push("밝고 화사한 색감을 우선합니다.");
  if (tune.mood === "clean") parts.push("번짐을 줄이고 깨끗한 화면을 우선합니다.");
  return parts.map(translated).join(" ") ||
    translated("균형값으로 생성됩니다. 처음 쓰는 사용자는 그대로 복사해도 됩니다.");
};

const metricLabel = (score) => {
  if (score <= 1) return translated("낮음");
  if (score <= 3) return translated("보통");
  if (score <= 5) return translated("높음");
  return translated("매우 높음");
};

const buildMetrics = () => {
  const clarityBonus = (tune.mood === "clean" ? 1 : 0) + (tune.fog === "off" ? 1 : 0);
  const waterQualityBonus = tune.water === "quality" ? 1 : 0;
  const frameLimitPenalty = tune.frameLimit !== "auto" ? 1 : 0;
  const qualityBonus = (tune.mood === "cinematic" ? 2 : tune.mood === "vivid" ? 1 : 0) + (tune.fog === "soft" ? 1 : 0) + waterQualityBonus;
  const loadPenalty = (tuneNumber("stutter") > 0 ? 1 : 0) + frameLimitPenalty + (tune.water === "off" ? 1 : 0);
  return {
    clarity: metricLabel(clamp(3 + tuneNumber("sharpness") + Math.max(0, tuneNumber("resolution")) + Math.max(0, tuneNumber("distance")) + Math.max(0, tuneNumber("characterDistance")) + clarityBonus, 0, 7)),
    quality: metricLabel(clamp(3 + tuneNumber("resolution") + tuneNumber("lighting") + tuneNumber("effects") + tuneNumber("texture") + tuneNumber("foliage") + tuneNumber("postprocess") + qualityBonus, 0, 7)),
    load: metricLabel(clamp(3 + Math.max(0, tuneNumber("resolution")) + Math.max(0, tuneNumber("distance")) + Math.max(0, tuneNumber("characterDistance")) + Math.max(0, tuneNumber("lighting")) + Math.max(0, tuneNumber("effects")) + Math.max(0, tuneNumber("texture")) + Math.max(0, tuneNumber("foliage")) + Math.max(0, tuneNumber("postprocess")) - loadPenalty, 0, 7)),
  };
};

const buildValues = () => {
  const profile = PROFILES[activeProfileKey];
  const v = { ...profile.values };
  const sharpness = tuneNumber("sharpness");
  const resolution = tuneNumber("resolution");
  const distance = tuneNumber("distance");
  const characterDistance = tuneNumber("characterDistance");
  const lighting = tuneNumber("lighting");
  const effects = tuneNumber("effects");
  const texture = tuneNumber("texture");
  const foliage = tuneNumber("foliage");
  const postprocess = tuneNumber("postprocess");
  const stutter = tuneNumber("stutter");

  v.screen = round(clamp((Number(v.screen) || 100) + sharpness * 3 + resolution * 5, 80, 120), 0);
  v.sharpen = round(clamp((Number(v.sharpen) || 0.5) + sharpness * 0.05, 0.28, 0.7), 2);
  v.temporalAAWeight = round(clamp(0.18 + sharpness * 0.025, 0.1, 0.3), 2);
  v.aaQuality = Math.round(clamp(4 + (sharpness >= 2 ? 1 : sharpness <= -2 ? -1 : 0), 2, 5));

  v.viewDistance = round(clamp((Number(v.viewDistance) || 1.2) + distance * 0.15, 0.75, 2.15), 2);
  v.staticLod = round(clamp((Number(v.staticLod) || 1) - distance * 0.09, 0.45, 1.55), 2);
  v.nanitePixels = round(clamp((Number(v.nanitePixels) || 3) - distance * 0.22, 1.4, 4.8), 2);
  v.naniteBias = round(clamp((Number(v.naniteBias) || 0) - distance * 0.06, -0.15, 0.7), 2);
  v.skeletalBias = Math.round(clamp((Number(v.skeletalBias) || 0) - (distance > 0 ? 1 : distance < 0 ? -1 : 0) - characterDistance, -4, 2));
  v.boostPlayerTextures = round(clamp((Number(v.boostPlayerTextures) || 1) + characterDistance * 0.1, 0.55, 1.45), 2);

  v.shadowQuality = Math.round(clamp((Number(v.shadowQuality) || 2) + lighting, 0, 5));
  v.cascades = Math.round(clamp((Number(v.cascades) || 1) + Math.max(-1, Math.min(1, lighting)), 1, 4));
  v.shadowDistance = round(clamp((Number(v.shadowDistance) || 0.8) + lighting * 0.1, 0.45, 1.35), 2);
  v.ssr = Math.round(clamp((Number(v.ssr) || 0) + lighting, 0, 4));
  if (lighting <= -2) {
    v.lumenReflections = 0;
    v.lumenDiffuse = 0;
    v.contactShadows = 0;
  } else if (lighting >= 1) {
    v.lumenReflections = 1;
    v.lumenDiffuse = 1;
    v.contactShadows = 1;
  }

  v.emitterScale = round(clamp((Number(v.emitterScale) || 0.7) + effects * 0.08, 0.3, 1), 2);
  v.bloom = Math.round(clamp((Number(v.bloom) || 1) + effects, 0, 5));
  v.particleLight = effects >= 2 ? 1 : 0;

  v.poolSize = Math.round(clamp((Number(v.poolSize) || 3000) + texture * 384, 1200, 8192));
  v.streamingBoost = round(clamp((Number(v.streamingBoost) || 1) + texture * 0.06, 0.75, 1.3), 2);
  v.boostPlayerTextures = round(clamp((Number(v.boostPlayerTextures) || 1) + texture * 0.08, 0.55, 1.45), 2);
  v.streamingPerFrame = Math.round(clamp((Number(v.streamingPerFrame) || 40) - stutter * 6, 18, 72));
  v.gcPurge = Math.round(clamp((Number(v.gcPurge) || 120) + stutter * 30, 60, 240));
  v.forceGc = stutter >= 2 ? 0 : 1;
  v.createShadersOnLoad = stutter >= 1 ? 1 : Number(v.createShadersOnLoad) || 0;
  v.mipBias = round(clamp(0 - texture * 0.18, 0, 2), 2);

  v.foliageDensity = round(clamp(1 + foliage * 0.14, 0.5, 1.25), 2);
  v.grassDensity = round(clamp(1 + foliage * 0.14, 0.5, 1.25), 2);
  v.foliageLodDistance = round(clamp(1 + foliage * 0.12, 0.7, 1.3), 2);

  v.oneFrameLag = tune.latency === "responsive" ? 0 : 1;
  v.maxFps = tune.frameLimit === "auto"
    ? null
    : Math.round(clamp(Number(tune.frameLimit), 30, 240));
  v.ambientOcclusion = Math.round(clamp(1 + postprocess, 0, 3));
  v.ambientOcclusionRadius = round(clamp(1 + postprocess * 0.12, 0.75, 1.25), 2);
  v.lightShaft = postprocess >= 1 ? 1 : 0;
  v.translucencyDim = Math.round(clamp(32 + postprocess * 8, 16, 48));
  v.separateTranslucencyScreen = Math.round(clamp(100 + postprocess * 8, 80, 116));
  v.motionBlur = tune.motionBlur === "game" ? null : tune.motionBlur === "low" ? 2 : 0;
  v.depthOfField = tune.depthOfField === "game" ? null : tune.depthOfField === "on" ? 2 : 0;
  v.lensFlare = tune.lensFlare === "game" ? null : tune.lensFlare === "on" ? 2 : 0;

  if (tune.vram !== "auto" && VRAM_CAPS[tune.vram]) {
    v.poolSize = Math.min(v.poolSize, VRAM_CAPS[tune.vram]);
  }

  if (tune.fog === "on") {
    v.fog = 1;
    v.volumetricFog = 1;
  } else if (tune.fog === "soft") {
    v.fog = 1;
    v.volumetricFog = 0;
  } else {
    v.fog = 0;
    v.volumetricFog = 0;
  }

  v.filmToe = 0;
  v.colorMid = 0.5;
  if (tune.mood === "clean") {
    v.gamma = round(clamp((Number(v.gamma) || 2.05) + 0.04, 1.75, 2.35), 2);
    v.skylight = round(clamp((Number(v.skylight) || 1.2) + 0.05, 0.8, 2.2), 2);
    v.sharpen = round(clamp((Number(v.sharpen) || 0.5) + 0.03, 0.28, 0.7), 2);
  } else if (tune.mood === "vivid") {
    v.gamma = round(clamp((Number(v.gamma) || 2.05) - 0.04, 1.75, 2.35), 2);
    v.skylight = round(clamp((Number(v.skylight) || 1.2) + 0.18, 0.8, 2.2), 2);
    v.bloom = Math.round(clamp((Number(v.bloom) || 1) + 1, 0, 5));
    v.colorMid = 0.56;
  } else if (tune.mood === "cinematic") {
    v.gamma = round(clamp((Number(v.gamma) || 2.05) + 0.02, 1.75, 2.35), 2);
    v.skylight = round(clamp((Number(v.skylight) || 1.2) + 0.08, 0.8, 2.2), 2);
    v.shadowQuality = Math.round(clamp((Number(v.shadowQuality) || 2) + 1, 1, 5));
    v.ssr = Math.round(clamp((Number(v.ssr) || 0) + 1, 0, 4));
    v.contactShadows = 1;
    v.bloom = Math.round(clamp((Number(v.bloom) || 1) + 1, 0, 5));
    v.colorMid = 0.53;
  } else if (tune.mood === "natural") {
    v.gamma = round(clamp((Number(v.gamma) || 2.05) + 0.08, 1.75, 2.35), 2);
    v.skylight = round(clamp((Number(v.skylight) || 1.2) - 0.08, 0.8, 2.2), 2);
    v.sharpen = round(clamp((Number(v.sharpen) || 0.5) - 0.04, 0.28, 0.68), 2);
    v.bloom = Math.round(clamp((Number(v.bloom) || 1), 0, 3));
  }

  if (tune.water === "off") {
    v.waterReflection = 0;
    v.ssr = 0;
    v.lumenReflections = 0;
  } else if (tune.water === "low") {
    v.waterReflection = 0;
    v.ssr = Math.min(Number(v.ssr) || 0, 1);
  } else if (tune.water === "quality") {
    v.waterReflection = 1;
    v.ssr = Math.max(Number(v.ssr) || 0, 2);
    if (lighting >= 0) v.lumenReflections = 1;
  }

  return v;
};

const buildConfig = () => {
  const profile = PROFILES[activeProfileKey];
  const goal = GOALS[activeGoalKey] || CUSTOM_GOAL;
  const v = buildValues();
  const visualLines = [
    v.motionBlur === null ? "" : `r.MotionBlurQuality=${optimizationValue(v.motionBlur)}`,
    v.depthOfField === null ? "" : `r.DepthOfFieldQuality=${optimizationValue(v.depthOfField)}`,
    v.lensFlare === null ? "" : `r.LensFlareQuality=${optimizationValue(v.lensFlare)}`,
  ].filter(Boolean).join("\n");
  const frameLimitLine = v.maxFps === null
    ? ""
    : `t.MaxFPS=${optimizationValue(v.maxFps)}`;
  const resolutionLine = tuneNumber("resolution") === 0
    ? ""
    : `r.ScreenPercentage=${optimizationValue(v.screen)}`;
  return `; NOT METER OPTIMIZATION START
[SystemSettings]
; ===== NOT METER AION2 : ${translated(profile.short)} / ${translated(goal.title)} =====
; ${translated("게임 내 업스케일러는 강제하지 않고, 해상도 세부 조절을 바꾼 경우에만 화면 비율을 적용합니다.")}

; ===== 1. ${translated("프레임 / 해상도 / 선명도")} =====
${frameLimitLine}
r.OneFrameThreadLag=${optimizationValue(v.oneFrameLag)}
${resolutionLine}
r.Tonemapper.Sharpen=${optimizationValue(v.sharpen)}

; ===== 2. ${translated("원거리 시야 / LOD")} =====
r.ViewDistanceScale=${optimizationValue(v.viewDistance)}
r.StaticMeshLODDistanceScale=${optimizationValue(v.staticLod)}
r.SkeletalMeshLODBias=${optimizationValue(v.skeletalBias)}
r.Nanite.MaxPixelsPerEdge=${optimizationValue(v.nanitePixels)}
foliage.DensityScale=${optimizationValue(v.foliageDensity)}
foliage.LODDistanceScale=${optimizationValue(v.foliageLodDistance)}
grass.DensityScale=${optimizationValue(v.grassDensity)}

; ===== 3. ${translated("루멘 / 반사")} =====
r.Lumen.Reflections.Allow=${optimizationValue(v.lumenReflections)}
r.Lumen.DiffuseIndirect.Allow=${optimizationValue(v.lumenDiffuse)}
r.Lumen.ScreenProbeGather.RadianceCache.ProbeResolution=${optimizationValue(v.lumenProbe)}

; ===== 4. ${translated("텍스처 스트리밍 / 끊김 완화")} =====
r.Streaming.PoolSize=${optimizationValue(v.poolSize)}
r.Streaming.LimitPoolSizeToVRAM=${optimizationValue(v.limitPoolToVram)}
r.Streaming.Boost=${optimizationValue(v.streamingBoost)}
r.Streaming.MipBias=${optimizationValue(v.mipBias)}
r.Streaming.NumStaticComponentsProcessedPerFrame=${optimizationValue(v.streamingPerFrame)}
gc.TimeBetweenPurgingPendingKillObjects=${optimizationValue(v.gcPurge)}
s.ForceGCAfterLevelStreamedOut=${optimizationValue(v.forceGc)}

; ===== 5. ${translated("스킬 이펙트 / 파티클")} =====
r.EmitterSpawnRateScale=${optimizationValue(v.emitterScale)}
r.ParticleLightQuality=${optimizationValue(v.particleLight)}

; ===== 6. ${translated("그림자 / 반사")} =====
r.ShadowQuality=${optimizationValue(v.shadowQuality)}
r.Shadow.CSM.MaxCascades=${optimizationValue(v.cascades)}
r.Shadow.DistanceScale=${optimizationValue(v.shadowDistance)}
r.Shadow.RadiusThreshold=${optimizationValue(v.radiusThreshold)}
r.SSR.Quality=${optimizationValue(v.ssr)}
r.SSR.HalfResSceneColor=1
r.ContactShadows=${optimizationValue(v.contactShadows)}

; ===== 7. ${translated("후처리 / 안개 / 물")} =====
${visualLines}
r.SceneColorFringeQuality=0
r.AmbientOcclusionLevels=${optimizationValue(v.ambientOcclusion)}
r.AmbientOcclusionRadiusScale=${optimizationValue(v.ambientOcclusionRadius)}
r.LightShaftQuality=${optimizationValue(v.lightShaft)}
r.TranslucencyLightingVolumeDim=${optimizationValue(v.translucencyDim)}
r.SeparateTranslucencyScreenPercentage=${optimizationValue(v.separateTranslucencyScreen)}
r.BloomQuality=${optimizationValue(v.bloom)}
r.Fog=${optimizationValue(v.fog)}
r.VolumetricFog=${optimizationValue(v.volumetricFog)}
r.Water.SingleLayer.Reflection=${optimizationValue(v.waterReflection)}
; NOT METER OPTIMIZATION END
`;
};

const ALLOWED_CONFIG_KEYS = new Set([
  "t.MaxFPS", "r.OneFrameThreadLag", "r.ScreenPercentage", "r.Tonemapper.Sharpen",
  "r.ViewDistanceScale", "r.StaticMeshLODDistanceScale", "r.SkeletalMeshLODBias",
  "r.Nanite.MaxPixelsPerEdge", "foliage.DensityScale", "foliage.LODDistanceScale",
  "grass.DensityScale", "r.Lumen.Reflections.Allow", "r.Lumen.DiffuseIndirect.Allow",
  "r.Lumen.ScreenProbeGather.RadianceCache.ProbeResolution", "r.Streaming.PoolSize",
  "r.Streaming.LimitPoolSizeToVRAM", "r.Streaming.Boost", "r.Streaming.MipBias",
  "r.Streaming.NumStaticComponentsProcessedPerFrame", "gc.TimeBetweenPurgingPendingKillObjects",
  "s.ForceGCAfterLevelStreamedOut", "r.EmitterSpawnRateScale", "r.ParticleLightQuality",
  "r.ShadowQuality", "r.Shadow.CSM.MaxCascades", "r.Shadow.DistanceScale",
  "r.Shadow.RadiusThreshold", "r.SSR.Quality", "r.SSR.HalfResSceneColor",
  "r.ContactShadows", "r.MotionBlurQuality", "r.DepthOfFieldQuality", "r.LensFlareQuality",
  "r.SceneColorFringeQuality", "r.AmbientOcclusionLevels", "r.AmbientOcclusionRadiusScale",
  "r.LightShaftQuality", "r.TranslucencyLightingVolumeDim",
  "r.SeparateTranslucencyScreenPercentage", "r.BloomQuality", "r.Fog",
  "r.VolumetricFog", "r.Water.SingleLayer.Reflection",
]);

const validateConfig = (text) => {
  const lines = String(text || "").split(/\r?\n/);
  const startMarker = "; NOT METER OPTIMIZATION START";
  const endMarker = "; NOT METER OPTIMIZATION END";
  const startIndex = lines.indexOf(startMarker);
  const endIndex = lines.indexOf(endMarker);
  if (startIndex < 0 || endIndex <= startIndex ||
      startIndex !== lines.lastIndexOf(startMarker) ||
      endIndex !== lines.lastIndexOf(endMarker) ||
      lines.filter(line => line === "[SystemSettings]").length !== 1) {
    return false;
  }
  const seenKeys = new Set();
  return lines.every(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(";") || trimmed === "[SystemSettings]") return true;
    const separator = trimmed.indexOf("=");
    if (separator <= 0) return false;
    const key = trimmed.slice(0, separator);
    const value = trimmed.slice(separator + 1);
    if (seenKeys.has(key)) return false;
    seenKeys.add(key);
    return ALLOWED_CONFIG_KEYS.has(key) && /^-?\d+(?:\.\d+)?$/.test(value);
  });
};

const renderProfiles = () => {
  el.gpuSelect.textContent = "";
  el.profileGrid.textContent = "";
  profileKeys.forEach((key) => {
    const profile = PROFILES[key];
    const option = document.createElement("option");
    option.value = key;
    option.textContent = translated(profile.label);
    el.gpuSelect.appendChild(option);

    const button = document.createElement("button");
    button.type = "button";
    button.className = `profile-button${key === activeProfileKey ? " is-active" : ""}`;
    button.dataset.profile = key;
    const title = document.createElement("strong");
    title.textContent = translated(profile.short);
    const caption = document.createElement("span");
    caption.textContent = `${translated(profile.hint)} · ${translated(profile.vram)}`;
    button.append(title, caption);
    el.profileGrid.appendChild(button);
  });
  el.gpuSelect.value = activeProfileKey;
};

const renderGoals = () => {
  el.goalGrid.textContent = "";
  Object.entries(GOALS).forEach(([key, goal]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `goal-button${key === activeGoalKey ? " is-active" : ""}`;
    button.dataset.goal = key;
    const tag = document.createElement("em");
    tag.textContent = translated(goal.tag);
    const title = document.createElement("strong");
    title.textContent = translated(goal.title);
    const caption = document.createElement("span");
    caption.textContent = translated(goal.desc);
    button.append(tag, title, caption);
    el.goalGrid.appendChild(button);
  });
};

const syncControls = () => {
  document.querySelectorAll("[data-tune]").forEach((control) => {
    const key = control.dataset.tune;
    if (key in tune) control.value = String(tune[key]);
  });
  document.querySelectorAll("[data-value-label]").forEach((node) => {
    const key = node.dataset.valueLabel;
    node.textContent = translated(LABELS[key]?.[String(tune[key])] || "기본");
  });
};

const render = () => {
  const profile = PROFILES[activeProfileKey];
  const goal = GOALS[activeGoalKey] || CUSTOM_GOAL;
  const metrics = buildMetrics();
  renderProfiles();
  renderGoals();
  syncControls();
  el.metricClarity.textContent = metrics.clarity;
  el.metricQuality.textContent = metrics.quality;
  el.metricLoad.textContent = metrics.load;
  el.resultTitle.textContent = `${translated(profile.short)} · ${translated(goal.title)}`;
  el.resultSummary.textContent = buildSummary();
  const config = buildConfig();
  const valid = validateConfig(config);
  el.configOutput.textContent = valid ? config : "";
  el.copyButton.disabled = !valid;
  el.copyButtonSmall.disabled = !valid;
  el.safetyStatus.textContent = valid
    ? translated("검증된 설정 이름과 허용 범위만 생성합니다.")
    : translated("생성값 검증에 실패했습니다. 추천값으로 초기화해 주세요.");
  el.safetyStatus.classList.toggle("error", !valid);
  translateStaticPage();
};

const setGoal = (key) => {
  activeGoalKey = GOALS[key] ? key : "balanced";
  tune = { ...DEFAULT_TUNE, ...(GOALS[activeGoalKey].tune || {}) };
  persistSettings();
  render();
};

const copyConfig = async (button) => {
  const text = el.configOutput.textContent || "";
  if (!text) return;
  const original = button.textContent;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    button.textContent = translated("복사됨");
  } catch {
    button.textContent = translated("복사 실패");
  } finally {
    window.setTimeout(() => {
      button.textContent = original;
    }, 1500);
  }
};

const copyEnginePath = async () => {
  const path = "%LOCALAPPDATA%\\AION2\\Saved\\Config\\Windows\\engine.ini";
  const original = el.copyPathButton.textContent;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(path);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = path;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    el.copyPathButton.textContent = translated("경로 복사됨");
  } catch {
    el.copyPathButton.textContent = translated("복사 실패");
  } finally {
    window.setTimeout(() => {
      el.copyPathButton.textContent = original;
    }, 1500);
  }
};

el.gpuSelect.addEventListener("change", () => {
  activeProfileKey = PROFILES[el.gpuSelect.value] ? el.gpuSelect.value : "rtx5060ti";
  persistSettings();
  render();
});

el.profileGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-profile]");
  if (!button) return;
  activeProfileKey = button.dataset.profile;
  persistSettings();
  render();
});

el.goalGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-goal]");
  if (!button) return;
  setGoal(button.dataset.goal);
});

document.querySelectorAll("[data-tune]").forEach((control) => {
  const eventName = control.type === "range" ? "input" : "change";
  control.addEventListener(eventName, () => {
    const key = control.dataset.tune;
    tune = { ...tune, [key]: control.type === "range" ? Number(control.value) : control.value };
    activeGoalKey = "custom";
    persistSettings();
    render();
  });
});

el.copyButton.addEventListener("click", () => void copyConfig(el.copyButton));
el.copyButtonSmall.addEventListener("click", () => void copyConfig(el.copyButtonSmall));
el.copyPathButton.addEventListener("click", () => void copyEnginePath());
el.resetButton.addEventListener("click", () => {
  activeProfileKey = "rtx5060ti";
  activeGoalKey = "balanced";
  tune = { ...DEFAULT_TUNE };
  persistSettings();
  render();
});
el.languageButton.addEventListener("click", () => {
  const index = SUPPORTED_LOCALES.indexOf(locale);
  locale = SUPPORTED_LOCALES[(index + 1) % SUPPORTED_LOCALES.length];
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  render();
});

restoreSavedSettings();
render();
