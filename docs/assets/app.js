(() => {
  "use strict";

  const CACHE_URLS = [
    "./data/notmeter-ranking.json.gz",
    "https://raw.githubusercontent.com/Not4You-Dev/NotMeter-Update/main/docs/data/notmeter-ranking.json.gz",
  ];
  const CUSTOM_CP_CACHE_URLS = [
    "./data/notmeter-ranking-custom-cp.json.gz",
    "https://raw.githubusercontent.com/Not4You-Dev/NotMeter-Update/main/docs/data/notmeter-ranking-custom-cp.json.gz",
  ];
  const EXPECTED_SCHEMA = "notmeter-web-ranking-v1";
  const EXPECTED_CUSTOM_CP_SCHEMA = "notmeter-web-custom-cp-v4";
  const EXPECTED_CUSTOM_CP_RANK_SCHEMA = "notmeter-web-custom-cp-rank-v1";
  const DETAIL_SCHEMA = "notmeter-ranking-combat-detail-v1";
  const DETAIL_ENDPOINT = "https://notmeter.112-168-140-142.sslip.io/ranking/v1/details/";
  const DETAIL_CACHE_NAME = "notmeter-ranking-details-v1";
  const DETAIL_MEMORY_LIMIT = 48;
  const DETAIL_REQUEST_TIMEOUT_MS = 5_000;
  const CACHE_SYNC_INTERVAL_MS = 5 * 60 * 1000;
  const CACHE_SYNC_THROTTLE_MS = 60 * 1000;
  const DAILY_USER_KEY = "__notmeter_daily_active_users__";
  const STANDARD_CP_TIER_LIMIT = 100;
  const INTERNAL_REPLAY_PERIOD_LABEL = "__notmeter_replay_top20_v1__";
  const WEEKLY_LABEL_PREFIX = "weekly-wed05|";
  const PERIODS = ["Weekly", "Today", "Recent14Days", "All"];
  const JOB_ORDER = ["검성", "수호성", "살성", "궁성", "마도성", "정령성", "치유성", "호법성", "권성"];
  const JOB_CODES = {
    "0": "검성",
    "1": "수호성",
    "2": "살성",
    "3": "궁성",
    "4": "마도성",
    "5": "정령성",
    "6": "치유성",
    "7": "호법성",
    "8": "권성",
  };
  const JOB_NAMES_EN = {
    "검성": "Gladiator",
    "수호성": "Templar",
    "살성": "Assassin",
    "궁성": "Ranger",
    "마도성": "Sorcerer",
    "정령성": "Spiritmaster",
    "치유성": "Cleric",
    "호법성": "Chanter",
    "권성": "Brawler",
  };
  const DUNGEON_NAMES_EN = {
    "training-dummy-60s": "Training Dummy (1 min)",
    "bakron-trial": "Trial: Bakron's Sky Island",
    "musphel-hard": "Musphel's Grail (Hard)",
    "fallen-deva-hard": "Fallen Daeva's Castle (Hard)",
    "abyss-horn-4": "Abyssal Horn Cavern (Stage 4)",
  };
  const SERVER_NAMES_ELYOS = [
    "시엘", "네자칸", "바이젤", "카이시넬", "유스티엘", "아리엘", "프레기온", "메스람타에다",
    "히타니에", "나니아", "타하바타", "루터스", "페르노스", "다미누", "카사카", "바카르마",
    "챈가룽", "코치룽", "이슈타르", "티아마트", "포에타", "베르테론", "나트하라", "탈리스라",
    "주미온", "나히드", "아사르", "칼리드", "라세이스", "페리온", "드라마타", "레다", "아울도르",
    "바크론", "나룬", "가르투아", "클로리스", "이오네", "테이나", "디모네스", "바고트", "아테론",
    "루틸리스", "실리아토르", "이드리스", "사티아", "에스티안", "라후", "라누만", "히브란",
    "우라훔", "라크슈미", "타몬", "티에", "두두리", "데르코스", "둔둔몽", "홀리아울",
  ];
  const SERVER_NAMES_ASMODIAN = [
    "이스라펠", "지켈", "트리니엘", "루미엘", "마르쿠탄", "아스펠", "에레슈키갈", "브리트라",
    "네몬", "하달", "루드라", "울고른", "무닌", "오다르", "젠카카", "크로메데", "콰이링",
    "바바룽", "파프니르", "인드나흐", "이스할겐", "알트가르드", "아그니타", "아티엘", "발데마르",
    "라그타", "게로드", "우르드", "에코", "지젤", "카샤파", "스토프", "베르크", "누아쿰",
    "그리실라", "산트라스", "루벤", "휴고", "크라키", "히스탄", "라트만", "시게베르트",
    "나즈문", "겔코스", "파톤", "펠레이르", "엘비다", "케투", "파이디온", "노툰", "무르트",
    "로탄", "쿠하푸", "두안카", "브로크", "왈터", "푸라킨", "이그누스",
  ];
  const DETAIL_METRICS = [
    ["specialization", "specialization"],
    ["hits", "hits"],
    ["parry", "parry"],
    ["avoidance", "avoidance"],
    ["multiHit", "multiHit"],
    ["critical", "critical"],
    ["front", "front"],
    ["back", "back"],
    ["perfect", "perfect"],
    ["double", "doubleDamage"],
    ["periodic", "periodicDamage"],
    ["healing", "healing"],
    ["drainHealing", "drainHealing"],
    ["averageDamage", "averageDamage"],
  ];
  const POTION_CODES = new Set([2011101, 2011102, 2010102, 2020101, 2020102, 2010106, 2010103]);

  const COPY = {
    ko: {
      title: "NotMeter 던전 통계",
      subtitle: "직업별 상위 25% DPS 기준으로 정렬합니다",
      dailyUsers: "일일 사용자",
      discord: "디스코드",
      download: "다운로드",
      dungeon: "던전",
      boss: "보스",
      period: "기간",
      refresh: "새로고침",
      loading: "동일한 통계 캐시를 불러오는 중입니다",
      loadError: "통계 캐시를 불러오지 못했습니다",
      retry: "다시 시도",
      empty: "선택한 조건에 해당하는 통계가 아직 없습니다",
      rank: "순위",
      job: "직업",
      sample: "표본",
      recordSample: "기록 표본",
      recordSampleValue: "{count}회",
      recordSampleTooltip: "전투 기록 {count}회이며 동일 캐릭터의 반복 기록이 포함될 수 있습니다",
      top25: "상위 25%",
      median: "중앙값",
      max: "최고",
      distribution: "분포",
      details: "상세",
      character: "캐릭터",
      duration: "전투 시간",
      cacheNotice: "클라이언트와 동일한 통계 생성본을 사용합니다.",
      privacyPolicy: "개인정보처리방침",
      advertisingNotice: "Google AdSense 광고를 사용합니다.",
      allBosses: "전체 보스",
      allCp: "전체 CP",
      customCp: "직접 CP 지정",
      customCpTitle: "직접 CP 지정",
      customCpDescription: "400~420은 40만 CP부터 42만 CP 구간까지 조회합니다",
      customCpMinimum: "최소 CP",
      customCpMaximum: "최대 CP",
      customCpApply: "적용",
      customCpResolved: "집계 범위 {minimum}K~{maximum}K",
      customCpInvalid: "400K~1,999K 안에서 최소 CP보다 큰 최대 CP를 입력해 주세요",
      thisWeek: "이번 주",
      today: "오늘",
      recent14: "최근 14일",
      allPeriod: "전체 기간",
      records: "기록",
      samples: "표본",
      recordSamples: "기록 표본",
      recordSamplesValue: "기록 표본 {count}회",
      updated: "갱신",
      refreshScheduleAria: "통계 갱신 시간 안내",
      refreshScheduleTitle: "통계 갱신 시간 안내",
      refreshScheduleCadence: "통계 집계는 매시 정각과 30분에 시작합니다.",
      refreshScheduleDelay: "표시된 시각은 통계 생성본의 기준 시각입니다. 기록량이 많으면 집계·압축·업로드 처리에 시간이 더 걸려 홈페이지 반영이 늦어질 수 있습니다.",
      refreshSchedulePage: "열어 둔 홈페이지는 약 5분마다 새 통계를 확인합니다. 바로 확인하려면 ‘새로고침’을 눌러주세요.",
      rankingEntryGuideTitle: "랭킹 등록 기준 안내",
      rankingEntryGuideSubtitle: "기록이 보이지 않을 때 먼저 확인해 주세요",
      rankingEntrySpreadTitle: "파티 전투력 차이",
      rankingEntrySpread: "전투 기록에서 CP가 확인된 파티원 중 최고 전투력과 최저 전투력의 차이가 200K(200,000) 이상이면 해당 전투 전체가 통계와 TOP 20 랭킹에서 제외됩니다.",
      rankingEntryCalculationTitle: "계산 방법",
      rankingEntryCalculation: "최고 CP − 최저 CP로 계산하며 정확히 200K인 경우도 제외됩니다. 예를 들어 900K와 700K가 함께 기록되면 차이가 200K이므로 등록되지 않습니다.",
      rankingEntryPurposeTitle: "적용 목적",
      rankingEntryPurpose: "버스 또는 전투력 격차가 큰 파티의 기록으로 인해 직업별 DPS 통계가 왜곡되는 것을 방지하기 위한 기준입니다.",
      rankingEntryNote: "CP를 알 수 없는 파티원은 차이 계산에서 제외됩니다. 일반 던전 기록은 확정 처치와 파티원 5인 이상 조건을 충족해야 하며, 1인 콘텐츠인 악몽은 1인 이상 확정 처치부터 집계합니다. 훈련용 허수아비는 별도 기준을 사용합니다.",
      weeklyCompare: "▲▼는 직전 주 동일 조건의 직업별 상위 25% DPS 변화",
      weeklyTooltip: "직전 주 동일 조건 비교",
      weeklyGuideTitle: "▲▼ 이번 주 변화 표시 안내",
      weeklyGuideSubtitle: "직전 주 동일 조건의 직업별 상위 25% DPS와 비교합니다",
      weeklyUp: "상승",
      weeklyDown: "하락",
      weeklyFlat: "변화 없음",
      weeklyGuidePurposeTitle: "표시 목적",
      weeklyGuidePurpose: "밸런스 패치 이후 직업별 실전 성능 흐름을 빠르게 비교하기 위한 참고 지표입니다.",
      weeklyGuideBasisTitle: "비교 기준",
      weeklyGuideBasis: "상위 25% DPS는 직업별 전체 표본에서 상위 25%가 시작되는 경계값(P75)입니다. 현재 선택한 던전·보스·CP 구간을 동일하게 맞춰 이번 주와 직전 주의 P75를 비교하며, 한 주는 매주 수요일 오전 5시부터 다음 수요일 오전 5시까지입니다.",
      weeklyGuideMeaningTitle: "퍼센트 의미",
      weeklyGuideMeaning: "변화율은 (이번 주 P75−직전 주 P75)÷직전 주 P75×100으로 계산합니다. ▲2.4%는 이번 주 값이 2.4% 높고, ▼2.4%는 2.4% 낮다는 뜻입니다.",
      weeklyGuideRankingTitle: "랭킹 반영 방식",
      weeklyGuideRanking: "직업 순서는 이번 주 상위 25% DPS로 정렬됩니다. 화살표는 변화 추세만 보여주며 개인 순위, TOP 20 순위, 상위 % 계산에는 영향을 주지 않습니다.",
      weeklyGuideNote: "직전 주에 같은 조건의 기록이 없으면 화살표가 표시되지 않습니다. 화살표에 마우스를 올리면 이전·현재 DPS와 표본 수를 확인할 수 있습니다.",
      classDps: "{job} DPS 1~{count}위",
      top20: "TOP {count}",
      uniqueRankers: "표시 캐릭터 {count}명 · 동일 캐릭터는 선택 조건에서 가장 높은 DPS 기록만 표시",
      backToJobs: "직업 목록으로",
      party: "파티",
      viewDetails: "보기",
      combatDetails: "전투 상세 정보",
      detailLoading: "전투 상세 정보를 불러오는 중입니다",
      detailUnavailable: "전투 상세 정보를 불러오지 못했습니다 다시 시도해 주세요",
      detailUnavailableTitle: "상세 기록 없음",
      detailUnavailableOld: "1.0.149 이전 버전에서 업로드되어 전투 상세가 수집되지 않은 기록입니다",
      partyMembers: "파티원",
      totalDamage: "총 데미지",
      contribution: "기여도",
      deathCount: "사망 횟수",
      combatPower: "전투력 CP",
      hits: "타수",
      hitRate: "적중률",
      criticalRate: "치명타율",
      skillCount: "스킬 수",
      skillBreakdown: "스킬 피해 내역",
      skill: "스킬",
      damage: "데미지",
      damageHealing: "피해 / 치유",
      share: "비중",
      average: "평균",
      averageInterval: "평균 간격",
      buffUptime: "버프 업타임",
      buffUptimeCaption: " / 전투 시간 대비 유지율",
      visibleItems: "표시 항목",
      openSettings: "설정 열기",
      closeSettings: "설정 닫기",
      specialization: "특성",
      parry: "페리",
      avoidance: "회피",
      multiHit: "다단 히트",
      critical: "크리",
      front: "전방",
      back: "후방",
      perfect: "완벽",
      doubleDamage: "강타",
      periodicDamage: "지속피해",
      healing: "치유",
      healingCount: "치유 횟수",
      drainHealing: "흡혈",
      useCount: "사용",
      averageDamage: "평균 데미지",
      recordedBuffsNone: "기록된 버프 없음",
      agoNow: "방금 갱신",
      agoMinutes: "{value}분 전 갱신",
      agoHours: "{value}시간 전 갱신",
      cacheInvalid: "지원하지 않는 통계 캐시 형식입니다.",
      cacheUnavailable: "잠시 후 새로고침해 주세요.",
    },
    en: {
      title: "NotMeter Dungeon Statistics",
      subtitle: "Classes are ranked by top-quartile DPS",
      dailyUsers: "Daily users",
      discord: "Discord",
      download: "Download",
      dungeon: "Dungeon",
      boss: "Boss",
      period: "Period",
      refresh: "Refresh",
      loading: "Loading the shared statistics cache",
      loadError: "Unable to load the statistics cache",
      retry: "Try again",
      empty: "No records match the selected filters yet",
      rank: "Rank",
      job: "Class",
      sample: "Samples",
      recordSample: "Combat samples",
      recordSampleValue: "{count} runs",
      recordSampleTooltip: "{count} combat records; repeated runs by the same character may be included",
      top25: "Top 25%",
      median: "Median",
      max: "Highest",
      distribution: "Range",
      details: "Details",
      character: "Character",
      duration: "Duration",
      cacheNotice: "Uses the same generated statistics snapshot as the client.",
      privacyPolicy: "Privacy policy",
      advertisingNotice: "This site uses Google AdSense advertising.",
      allBosses: "All bosses",
      allCp: "All CP",
      customCp: "Custom CP",
      customCpTitle: "Custom CP",
      customCpDescription: "400–420 includes every CP bucket from 400K through 420K",
      customCpMinimum: "Minimum CP",
      customCpMaximum: "Maximum CP",
      customCpApply: "Apply",
      customCpResolved: "Active range: {minimum}K–{maximum}K",
      customCpInvalid: "Use 400K–1,999K and enter a maximum greater than the minimum",
      thisWeek: "This week",
      today: "Today",
      recent14: "Last 14 days",
      allPeriod: "All time",
      records: "records",
      samples: "samples",
      recordSamples: "combat samples",
      recordSamplesValue: "{count} combat samples",
      updated: "updated",
      refreshScheduleAria: "Statistics refresh schedule",
      refreshScheduleTitle: "Statistics refresh schedule",
      refreshScheduleCadence: "Statistics generation starts at the top and half past every hour.",
      refreshScheduleDelay: "The displayed time is the snapshot's generation time. Large data volumes can make aggregation, compression, and upload take longer, so the website may update later.",
      refreshSchedulePage: "An open page checks for new statistics about every five minutes. Select Refresh to check immediately.",
      rankingEntryGuideTitle: "Ranking eligibility",
      rankingEntryGuideSubtitle: "Check these rules when a combat record does not appear",
      rankingEntrySpreadTitle: "Party CP spread",
      rankingEntrySpread: "If the difference between the highest and lowest known party-member CP is 200K (200,000) or more, the entire combat record is excluded from statistics and Top 20 rankings.",
      rankingEntryCalculationTitle: "How it is calculated",
      rankingEntryCalculation: "The spread is highest CP − lowest CP, and exactly 200K is also excluded. For example, a party containing both 900K and 700K characters has a 200K spread and will not be registered.",
      rankingEntryPurposeTitle: "Why this rule exists",
      rankingEntryPurpose: "This prevents carry runs and parties with very large CP gaps from distorting class DPS statistics.",
      rankingEntryNote: "Party members whose CP is unknown are not included in the spread calculation. Regular dungeon records require a confirmed kill and at least five players. Nightmare is solo content and accepts confirmed kills with one or more players. Training-dummy records use separate rules.",
      weeklyCompare: "▲▼ shows the change in each class's top-25% DPS under the same filters",
      weeklyTooltip: "Previous week, same filters",
      weeklyGuideTitle: "What the ▲▼ weekly change means",
      weeklyGuideSubtitle: "Compares each class's top-25% DPS with the previous week under identical filters",
      weeklyUp: "Higher",
      weeklyDown: "Lower",
      weeklyFlat: "No change",
      weeklyGuidePurposeTitle: "Purpose",
      weeklyGuidePurpose: "A reference indicator for quickly spotting class performance trends after balance updates.",
      weeklyGuideBasisTitle: "Comparison basis",
      weeklyGuideBasis: "Top-25% DPS is the P75 threshold where the highest quarter of a class's samples begins. It compares this week's P75 with the previous week's under the same dungeon, boss, and CP bracket. A week runs from Wednesday at 05:00 KST to the following Wednesday at 05:00 KST.",
      weeklyGuideMeaningTitle: "Percentage meaning",
      weeklyGuideMeaning: "The change is calculated as (this week's P75 − previous week's P75) ÷ previous week's P75 × 100. ▲2.4% means this week's value is 2.4% higher, while ▼2.4% means it is 2.4% lower.",
      weeklyGuideRankingTitle: "How ranking uses it",
      weeklyGuideRanking: "Classes are sorted by this week's top-25% DPS. The arrow only shows a trend and does not affect individual ranks, Top 20 ranks, or percentile calculations.",
      weeklyGuideNote: "No arrow is shown when the previous week has no records under the same filters. Hover over an arrow to see the previous and current DPS and sample counts.",
      classDps: "{job} DPS — Top {count}",
      top20: "TOP {count}",
      uniqueRankers: "{count} characters shown · only each character's highest DPS under these filters is shown",
      backToJobs: "Back to classes",
      party: "PARTY",
      viewDetails: "View",
      combatDetails: "Combat Details",
      detailLoading: "Loading combat details",
      detailUnavailable: "Combat details are temporarily unavailable. Please try again.",
      detailUnavailableTitle: "Details unavailable",
      detailUnavailableOld: "This record was uploaded by a version earlier than 1.0.149, so combat details were not collected.",
      partyMembers: "Party members",
      totalDamage: "Total damage",
      contribution: "Contribution",
      deathCount: "Deaths",
      combatPower: "Combat Power",
      hits: "Hits",
      hitRate: "Hit rate",
      criticalRate: "Critical rate",
      skillCount: "Skills",
      skillBreakdown: "Skill Damage",
      skill: "Skill",
      damage: "Damage",
      damageHealing: "Damage / Healing",
      share: "Share",
      average: "Average",
      averageInterval: "Avg. interval",
      buffUptime: "Buff uptime",
      buffUptimeCaption: " / share of combat duration",
      visibleItems: "Visible items",
      openSettings: "Open settings",
      closeSettings: "Close settings",
      specialization: "Specialization",
      parry: "Parry",
      avoidance: "Evade",
      multiHit: "Multi-hit",
      critical: "Critical",
      front: "Front",
      back: "Back",
      perfect: "Perfect",
      doubleDamage: "Power hit",
      periodicDamage: "Periodic",
      healing: "Healing",
      healingCount: "Healing count",
      drainHealing: "Drain",
      useCount: "Used",
      averageDamage: "Average damage",
      recordedBuffsNone: "No recorded buffs",
      agoNow: "Updated just now",
      agoMinutes: "Updated {value}m ago",
      agoHours: "Updated {value}h ago",
      cacheInvalid: "This statistics cache format is not supported.",
      cacheUnavailable: "Please refresh again in a moment.",
    },
  };

  const state = {
    data: null,
    customCpData: null,
    customCpLoad: null,
    customCpRankData: new Map(),
    customCpRankLoads: new Map(),
    locale: localStorage.getItem("notmeter-stats-locale") ||
      (navigator.language.toLowerCase().startsWith("ko") ? "ko" : "en"),
    dungeonKey: "",
    bossIndex: 0,
    cpTierIndex: 0,
    cpFilterMode: "standard",
    customCpMinK: Math.min(1998, Math.max(400, Number(localStorage.getItem("notmeter-stats-custom-cp-min-k")) || 400)),
    customCpMaxK: Math.min(1999, Math.max(401, Number(localStorage.getItem("notmeter-stats-custom-cp-max-k")) || 420)),
    period: "Weekly",
    selectedJob: "",
    selectedDetail: null,
    detailMemory: new Map(),
    detailLoads: new Map(),
    mode: "summary",
    loading: false,
    lastCacheSyncAt: 0,
    iconAtlases: {
      skill: null,
      buff: null,
    },
    visibleMetrics: loadVisibleMetrics(),
  };

  const elements = {};

  document.addEventListener("DOMContentLoaded", () => {
    bindElements();
    bindEvents();
    applyLocale();
    renderDetailSettings();
    void loadIconAtlases();
    void loadCache();
    window.setInterval(updateCacheAge, 60_000);
    window.setInterval(() => {
      if (!document.hidden) {
        void syncLatestCache();
      }
    }, CACHE_SYNC_INTERVAL_MS);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        void syncLatestCache();
      }
    });
  });

  function bindElements() {
    for (const id of [
      "daily-user-count", "language-button", "dungeon-filter", "boss-filter", "cp-filter",
      "custom-cp-panel", "custom-cp-min", "custom-cp-max", "custom-cp-apply", "custom-cp-result",
      "period-filter", "refresh-button", "retry-button", "snapshot-title", "snapshot-caption",
      "sample-meta", "generated-meta", "weekly-guide", "class-heading", "class-title",
      "class-badge", "class-caption", "sample-column-heading",
      "back-button", "loading-state", "error-state", "error-message", "empty-state",
      "summary-view", "summary-rows", "class-view", "class-rows", "cache-age",
      "combat-detail-modal", "detail-close", "detail-job-icon", "detail-title",
      "detail-character", "detail-duration", "detail-cp", "detail-total-damage",
      "detail-dps", "detail-share", "detail-summary-duration", "detail-death-count", "detail-hits",
      "detail-parry-rate", "detail-critical-rate", "detail-front-rate", "detail-back-rate",
      "detail-perfect-rate", "detail-double-rate", "detail-evade-rate", "detail-cp-row",
      "detail-visible-count", "detail-settings-toggle", "detail-settings-options",
      "detail-skill-rows", "detail-buffs-section", "detail-buffs", "detail-buff-count",
      "detail-party-tabs",
    ]) {
      elements[id] = document.getElementById(id);
    }
  }

  function bindEvents() {
    elements["language-button"].addEventListener("click", () => {
      const openDetail = state.selectedDetail;
      state.locale = state.locale === "ko" ? "en" : "ko";
      localStorage.setItem("notmeter-stats-locale", state.locale);
      applyLocale();
      populateFilters();
      render();
      if (openDetail) {
        state.selectedDetail = openDetail;
        renderCombatDetail();
      }
    });
    elements["dungeon-filter"].addEventListener("change", event => {
      closeCombatDetail();
      applyDungeonSelection(event.target.value);
      populateFilters();
      render();
    });
    elements["boss-filter"].addEventListener("change", event => {
      state.bossIndex = Number(event.target.value);
      leaveClassView();
      render();
    });
    elements["cp-filter"].addEventListener("change", event => {
      if (event.target.value === "custom") {
        state.cpFilterMode = "custom";
        void applyCustomCpValue();
        return;
      }
      state.cpFilterMode = "standard";
      state.cpTierIndex = Number(event.target.value);
      syncCustomCpControls();
      leaveClassView();
      render();
    });
    elements["custom-cp-apply"].addEventListener("click", () => void applyCustomCpValue());
    for (const input of [elements["custom-cp-min"], elements["custom-cp-max"]]) {
      input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          event.preventDefault();
          void applyCustomCpValue();
        }
      });
    }
    elements["period-filter"].addEventListener("change", event => {
      state.period = event.target.value;
      leaveClassView();
      render();
    });
    elements["refresh-button"].addEventListener("click", () => void loadCache(true));
    elements["retry-button"].addEventListener("click", () => void loadCache(true));
    elements["back-button"].addEventListener("click", () => {
      if (history.state?.notMeterStatsView === "class") {
        history.back();
        return;
      }
      leaveClassView();
      render();
    });
    window.addEventListener("popstate", event => {
      const job = event.state?.notMeterStatsJob;
      if (event.state?.notMeterStatsView === "class" && job) {
        state.selectedJob = job;
        state.mode = "class";
      } else {
        leaveClassView();
      }
      render();
    });
    elements["detail-close"].addEventListener("click", closeCombatDetail);
    elements["detail-settings-toggle"].addEventListener("click", () => {
      const options = elements["detail-settings-options"];
      options.hidden = !options.hidden;
      elements["detail-settings-toggle"].textContent =
        t(options.hidden ? "openSettings" : "closeSettings");
    });
    elements["combat-detail-modal"].addEventListener("click", event => {
      if (event.target === elements["combat-detail-modal"]) {
        closeCombatDetail();
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && state.selectedDetail) {
        closeCombatDetail();
      }
    });
  }

  function applyDungeonSelection(dungeonKey) {
    state.dungeonKey = dungeonKey;
    state.bossIndex = 0;
    state.mode = "summary";
    state.selectedJob = "";
  }

  async function loadCache(force = false, preserveView = false) {
    if (state.loading) {
      return;
    }
    state.loading = true;
    elements["refresh-button"].disabled = true;
    if (!preserveView) {
      showState("loading");
    }

    try {
      const cache = await fetchRankingCache(force);
      validateCache(cache);
      state.lastCacheSyncAt = Date.now();
      if (preserveView &&
        state.data &&
        String(cache.generatedAt) === String(state.data.generatedAt)) {
        return;
      }
      const previousDungeon = state.dungeonKey;
      closeCombatDetail();
      if (!state.data ||
          String(cache.generatedAt) !== String(state.data.generatedAt)) {
        state.customCpData = null;
        state.customCpLoad = null;
        state.customCpRankData.clear();
        state.customCpRankLoads.clear();
      }
      state.data = cache;
      state.detailMemory.clear();
      void pruneDetailCache(cache.generatedAt);
      state.dungeonKey = cache.dungeons.some(item => item.key === previousDungeon)
        ? previousDungeon
        : cache.dungeons[0]?.key || "";
      if (!preserveView || state.dungeonKey !== previousDungeon) {
        state.mode = "summary";
        state.selectedJob = "";
      }
      updateDailyUsers();
      populateFilters();
      if (state.cpFilterMode === "custom") {
        await ensureCustomCpCache(force);
      }
      render();
    } catch (error) {
      console.error(error);
      if (preserveView) {
        return;
      }
      elements["error-message"].textContent =
        error instanceof Error && error.message ? error.message : t("cacheUnavailable");
      showState("error");
    } finally {
      state.loading = false;
      elements["refresh-button"].disabled = false;
    }
  }

  async function syncLatestCache() {
    if (state.loading ||
      !state.data ||
      Date.now() - state.lastCacheSyncAt < CACHE_SYNC_THROTTLE_MS) {
      return;
    }
    await loadCache(false, true);
  }

  async function fetchRankingCache(force) {
    return fetchCompressedJson(CACHE_URLS, force);
  }

  async function fetchCompressedJson(urls, force) {
    const errors = [];
    for (const baseUrl of urls) {
      const separator = baseUrl.includes("?") ? "&" : "?";
      const url = force ? `${baseUrl}${separator}v=${Date.now()}` : baseUrl;
      try {
        const response = await fetch(url, {
          cache: force ? "reload" : "no-cache",
          headers: { Accept: "application/gzip, application/json" },
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const bytes = new Uint8Array(await response.arrayBuffer());
        const text = await decodeCacheBytes(bytes);
        return JSON.parse(text);
      } catch (error) {
        errors.push(`${baseUrl}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    throw new Error(`${t("cacheUnavailable")} (${errors.join(" / ")})`);
  }

  async function decodeCacheBytes(bytes) {
    const isGzip = bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
    if (!isGzip) {
      return new TextDecoder("utf-8").decode(bytes);
    }
    if (typeof DecompressionStream !== "function") {
      throw new Error("This browser cannot decompress the statistics cache.");
    }
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
    return new Response(stream).text();
  }

  function validateCache(cache) {
    if (!cache || cache.schema !== EXPECTED_SCHEMA || cache.version !== 1 ||
        !Array.isArray(cache.dungeons) || !Array.isArray(cache.views) ||
        !cache.classRankings || !cache.generatedAt) {
      throw new Error(t("cacheInvalid"));
    }
  }

  function validateCustomCpCache(cache) {
    if (!cache ||
        cache.schema !== EXPECTED_CUSTOM_CP_SCHEMA ||
        Number(cache.version) !== 4 ||
        !Array.isArray(cache.cpTiers) ||
        !Array.isArray(cache.views) ||
        !cache.classRankings ||
        !parseWeeklyRange(cache.currentWeekPeriodLabel) ||
        !cache.summaryBucketsByDungeon ||
        typeof cache.summaryBucketsByDungeon !== "object" ||
        !cache.generatedAt ||
        String(cache.generatedAt) !== String(state.data?.generatedAt)) {
      throw new Error(t("cacheInvalid"));
    }
  }

  function customCpRankCacheUrls(dungeonKey) {
    const safeKey = String(dungeonKey || "").toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const fileName = `notmeter-ranking-custom-cp-${safeKey}.json.gz`;
    return [
      `./data/${fileName}`,
      `https://raw.githubusercontent.com/Not4You-Dev/NotMeter-Update/main/docs/data/${fileName}`,
    ];
  }

  function validateCustomCpRankCache(cache, dungeonKey) {
    if (!cache ||
        cache.schema !== EXPECTED_CUSTOM_CP_RANK_SCHEMA ||
        Number(cache.version) !== 1 ||
        cache.dungeonKey !== dungeonKey ||
        !Array.isArray(cache.rankBuckets) ||
        !cache.generatedAt ||
        String(cache.generatedAt) !== String(state.data?.generatedAt)) {
      throw new Error(t("cacheInvalid"));
    }
  }

  async function ensureCustomCpCache(force = false) {
    if (state.customCpData &&
        String(state.customCpData.generatedAt) === String(state.data?.generatedAt) &&
        !force) {
      return state.customCpData;
    }
    if (state.customCpLoad && !force) {
      return state.customCpLoad;
    }
    const load = fetchCompressedJson(CUSTOM_CP_CACHE_URLS, force)
      .then(cache => {
        validateCustomCpCache(cache);
        state.customCpData = cache;
        return cache;
      })
      .finally(() => {
        state.customCpLoad = null;
      });
    state.customCpLoad = load;
    return load;
  }

  async function ensureCustomCpRankCache(dungeonKey, force = false) {
    const current = state.customCpRankData.get(dungeonKey);
    if (current &&
        String(current.generatedAt) === String(state.data?.generatedAt) &&
        !force) {
      return current;
    }
    if (state.customCpRankLoads.has(dungeonKey) && !force) {
      return state.customCpRankLoads.get(dungeonKey);
    }
    const load = fetchCompressedJson(customCpRankCacheUrls(dungeonKey), force)
      .then(cache => {
        validateCustomCpRankCache(cache, dungeonKey);
        state.customCpRankData.set(dungeonKey, cache);
        return cache;
      })
      .finally(() => {
        state.customCpRankLoads.delete(dungeonKey);
      });
    state.customCpRankLoads.set(dungeonKey, load);
    return load;
  }

  function populateFilters() {
    if (!state.data) {
      return;
    }
    replaceOptions(
      elements["dungeon-filter"],
      state.data.dungeons,
      item => item.key,
      item => dungeonName(item),
      state.dungeonKey);

    const dungeon = currentDungeon();
    const bosses = [{ index: 0, name: t("allBosses") }]
      .concat((dungeon?.bossNames || []).map((name, index) => ({ index: index + 1, name })));
    if (!bosses.some(item => item.index === state.bossIndex)) {
      state.bossIndex = 0;
    }
    replaceOptions(
      elements["boss-filter"],
      bosses,
      item => item.index,
      item => item.name,
      state.bossIndex);

    const cpTiers = state.data.cpTiers
      .filter(item => Number(item.index) < STANDARD_CP_TIER_LIMIT)
      .sort((left, right) => Number(left.index) - Number(right.index));
    if (state.cpFilterMode !== "custom" &&
        !cpTiers.some(item => Number(item.index) === state.cpTierIndex)) {
      state.cpTierIndex = 0;
    }
    replaceOptions(
      elements["cp-filter"],
      cpTiers,
      item => item.index,
      item => Number(item.index) === 0 ? t("allCp") : item.label,
      state.cpTierIndex);
    const customOption = document.createElement("option");
    customOption.value = "custom";
    customOption.textContent = t("customCp");
    elements["cp-filter"].append(customOption);
    if (state.cpFilterMode === "custom") {
      state.cpTierIndex = -1;
      elements["cp-filter"].value = "custom";
    }
    syncCustomCpControls();

    replaceOptions(
      elements["period-filter"],
      PERIODS,
      item => item,
      item => periodName(item),
      state.period);
  }

  function replaceOptions(select, items, valueSelector, labelSelector, selectedValue) {
    const fragment = document.createDocumentFragment();
    for (const item of items) {
      const option = document.createElement("option");
      option.value = String(valueSelector(item));
      option.textContent = labelSelector(item);
      option.selected = String(option.value) === String(selectedValue);
      fragment.append(option);
    }
    select.replaceChildren(fragment);
  }

  async function applyCustomCpValue() {
    const minimum = Math.trunc(Number(elements["custom-cp-min"].value));
    const maximum = Math.trunc(Number(elements["custom-cp-max"].value));
    if (!Number.isFinite(minimum) || !Number.isFinite(maximum) ||
        minimum < 400 || maximum > 1999 || maximum <= minimum) {
      elements["custom-cp-result"].textContent = t("customCpInvalid");
      elements["custom-cp-result"].classList.add("error");
      (minimum < 400 ? elements["custom-cp-min"] : elements["custom-cp-max"]).focus();
      return;
    }

    state.customCpMinK = minimum;
    state.customCpMaxK = maximum;
    state.cpFilterMode = "custom";
    localStorage.setItem("notmeter-stats-custom-cp-min-k", String(minimum));
    localStorage.setItem("notmeter-stats-custom-cp-max-k", String(maximum));
    elements["custom-cp-apply"].disabled = true;
    showState("loading");
    try {
      await ensureCustomCpCache();
    } catch (error) {
      console.error(error);
      elements["error-message"].textContent =
        error instanceof Error && error.message ? error.message : t("cacheUnavailable");
      showState("error");
      return;
    } finally {
      elements["custom-cp-apply"].disabled = false;
    }
    if (matchingCustomCpTiers().length === 0) {
      elements["custom-cp-result"].textContent = t("customCpInvalid");
      elements["custom-cp-result"].classList.add("error");
      return;
    }

    state.cpTierIndex = -1;
    elements["cp-filter"].value = "custom";
    syncCustomCpControls();
    leaveClassView();
    render();
  }

  function matchingCustomCpTiers() {
    if (!state.customCpData) {
      return [];
    }
    const minimum = state.customCpMinK * 1000;
    const maximum = state.customCpMaxK * 1000;
    return state.customCpData.cpTiers
      .filter(item => Number(item.index) >= STANDARD_CP_TIER_LIMIT)
      .filter(item => {
        const tierMinimum = Number(item.minCombatPower) || 0;
        const tierMaximum = item.maxCombatPowerExclusive == null
          ? Number.POSITIVE_INFINITY
          : Number(item.maxCombatPowerExclusive);
        return tierMaximum > minimum && tierMinimum <= maximum;
      });
  }

  function syncCustomCpControls() {
    const custom = state.cpFilterMode === "custom";
    elements["custom-cp-panel"].hidden = !custom;
    elements["custom-cp-min"].value = String(state.customCpMinK);
    elements["custom-cp-max"].value = String(state.customCpMaxK);
    elements["custom-cp-result"].classList.remove("error");
    if (!custom || !state.data) {
      elements["custom-cp-result"].textContent = "";
      return;
    }
    elements["custom-cp-result"].textContent = matchingCustomCpTiers().length > 0
      ? t("customCpResolved", {
          minimum: formatInteger(state.customCpMinK),
          maximum: formatInteger(state.customCpMaxK),
        })
      : t("customCpInvalid");
  }

  function render() {
    if (!state.data) {
      return;
    }
    applyLocale();
    updateDailyUsers();
    updateCacheAge();
    state.mode === "class" ? renderClassRanking() : renderSummary();
  }

  function renderSummary() {
    const view = findSummaryView();
    elements["sample-column-heading"].textContent =
      t(state.cpFilterMode === "custom" ? "recordSample" : "sample");
    elements["class-heading"].hidden = true;
    elements["class-view"].hidden = true;
    if (!view || !Array.isArray(view.rows) || view.rows.length === 0) {
      updateSnapshot(view);
      showState("empty");
      return;
    }

    updateSnapshot(view);
    const rows = [...view.rows]
      .sort((left, right) => Number(right.p75Dps) - Number(left.p75Dps));
    const max = Math.max(1, ...rows.map(item => Number(item.maxDps) || 0));
    const fragment = document.createDocumentFragment();
    rows.forEach((row, index) => fragment.append(buildSummaryRow(row, index + 1, max)));
    elements["summary-rows"].replaceChildren(fragment);
    showState("summary");
  }

  function buildSummaryRow(row, rank, globalMax) {
    const tr = document.createElement("tr");
    tr.className = "job-row";
    tr.tabIndex = 0;
    tr.setAttribute("role", "button");
    tr.setAttribute("aria-label", `${jobName(row.jobName)} ${t("details")}`);
    const open = () => {
      state.selectedJob = row.jobName;
      state.mode = "class";
      history.pushState({
        notMeterStatsView: "class",
        notMeterStatsJob: row.jobName,
      }, "");
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    tr.addEventListener("click", open);
    tr.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });

    tr.append(cellWithRank(rank));

    const jobCell = document.createElement("td");
    jobCell.className = "summary-job-cell";
    const jobWrap = document.createElement("div");
    jobWrap.className = "job-cell";
    jobWrap.append(createJobIcon(row.jobName));
    const name = document.createElement("span");
    name.className = "job-name";
    name.textContent = jobName(row.jobName);
    jobWrap.append(name);
    const comparison = buildWeeklyComparisonBadge(row);
    if (comparison) {
      jobWrap.append(comparison);
    }
    jobCell.append(jobWrap);
    tr.append(jobCell);

    const sampleCell = numericCell(
      state.cpFilterMode === "custom"
        ? t("recordSampleValue", { count: formatInteger(row.sampleCount) })
        : formatInteger(row.sampleCount),
      "summary-sample",
      t(state.cpFilterMode === "custom" ? "recordSample" : "sample"));
    if (state.cpFilterMode === "custom") {
      sampleCell.title = t("recordSampleTooltip", {
        count: formatInteger(row.sampleCount),
      });
    }
    tr.append(sampleCell);
    tr.append(numericCell(formatDps(row.p75Dps), "accent summary-p75", t("top25")));
    tr.append(numericCell(formatDps(row.medianDps), "median summary-median", t("median")));
    tr.append(numericCell(formatDps(row.maxDps), "max summary-max", t("max")));

    const distributionCell = document.createElement("td");
    distributionCell.className = "summary-distribution";
    const distribution = document.createElement("div");
    distribution.className = "distribution";
    const track = document.createElement("div");
    track.className = "distribution-track";
    const fill = document.createElement("div");
    fill.className = "distribution-fill";
    fill.style.width = `${Math.max(4, Math.min(100, Number(row.maxDps) / globalMax * 100))}%`;
    track.append(fill);
    const label = document.createElement("span");
    label.className = "distribution-label";
    label.textContent = `${formatDps(row.minDps)} ~ ${formatDps(row.maxDps)}`;
    distribution.append(track, label);
    distributionCell.append(distribution);
    tr.append(distributionCell);

    const chevron = document.createElement("td");
    chevron.className = "row-chevron";
    chevron.textContent = "›";
    tr.append(chevron);
    return tr;
  }

  function renderClassRanking() {
    if (state.cpFilterMode === "custom" &&
        !state.customCpRankData.has(state.dungeonKey)) {
      showState("loading");
      void ensureCustomCpRankCache(state.dungeonKey)
        .then(() => {
          if (state.mode === "class") {
            renderClassRanking();
          }
        })
        .catch(error => {
          console.error(error);
          elements["error-message"].textContent =
            error instanceof Error && error.message ? error.message : t("cacheUnavailable");
          showState("error");
        });
      return;
    }
    const view = findClassView();
    const players = view?.rows
      ?.find(item => item.jobName === state.selectedJob)
      ?.players || [];
    const sorted = [...players]
      .sort((left, right) => Number(left.rank) - Number(right.rank))
      .slice(0, 20);

    elements["class-heading"].hidden = false;
    elements["class-title"].textContent = t("classDps", {
      job: jobName(state.selectedJob),
      count: sorted.length,
    });
    elements["class-badge"].textContent = t("top20", { count: sorted.length });
    elements["class-caption"].textContent = state.cpFilterMode === "custom"
      ? `${filterDescription()} · ${t("uniqueRankers", { count: sorted.length })}`
      : filterDescription();
    elements["summary-view"].hidden = true;
    updateSnapshot(findSummaryView());
    if (sorted.length === 0) {
      elements["class-view"].hidden = true;
      showState("empty");
      return;
    }
    const fragment = document.createDocumentFragment();
    sorted.forEach(player => fragment.append(buildClassRow(player)));
    elements["class-rows"].replaceChildren(fragment);
    showState("class");
  }

  function buildClassRow(player) {
    const tr = document.createElement("tr");
    const detail = resolveCombatDetail(player);
    const publishedLookupKey = String(player.Q ?? player.detailLookupKey ?? "")
      .trim()
      .toLowerCase();
    const hasPublishedDetail =
      player.H === true || player.hasDetail === true;
    const canBuildLookupKey =
      /^[0-9a-f]{64}$/.test(publishedLookupKey) ||
      (hasPublishedDetail && Boolean(globalThis.crypto?.subtle));
    let detailLookupPromise = null;
    const getDetailLookupKey = () => {
      detailLookupPromise ||= resolveDetailLookupKey(player);
      return detailLookupPromise;
    };
    tr.className = "class-detail-row";
    tr.tabIndex = 0;
    tr.setAttribute("role", "button");
    tr.setAttribute(
      "aria-label",
      `${formatCharacterName(player.name, player.serverId)} ${t("combatDetails")}`);
    const open = async () => {
      if (detail) {
        openLegacyCombatDetail(player, detail);
      } else if (canBuildLookupKey) {
        await openRemoteCombatDetail(player, await getDetailLookupKey(), tr);
      } else {
        openUnavailableCombatDetail(player, t("detailUnavailableOld"));
      }
    };
    tr.addEventListener("click", () => void open());
    tr.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        void open();
      }
    });
    if (!detail && canBuildLookupKey) {
      let hoverTimer = 0;
      tr.addEventListener("mouseenter", () => {
        window.clearTimeout(hoverTimer);
        hoverTimer = window.setTimeout(() => {
          void getDetailLookupKey()
            .then(loadRankingCombatDetail)
            .catch(() => {});
        }, 220);
      });
      tr.addEventListener("mouseleave", () => window.clearTimeout(hoverTimer));
    }
    tr.append(cellWithRank(player.rank));

    const dungeon = currentDungeon();
    const bossIndex = Number(player.B ?? player.bossIndex ?? state.bossIndex);
    const boss = bossIndex > 0 ? dungeon?.bossNames?.[bossIndex - 1] : "";
    const targetName = String(player.T ?? player.targetName ?? "").trim();
    const bossName = targetName || boss || (state.bossIndex > 0
      ? dungeon?.bossNames?.[state.bossIndex - 1]
      : t("allBosses"));

    const characterCell = document.createElement("td");
    characterCell.className = "character-cell";
    const characterStack = document.createElement("div");
    characterStack.className = "character-stack";
    const main = document.createElement("div");
    main.className = "character-main";
    main.append(createJobIcon(state.selectedJob));
    const name = document.createElement("span");
    name.className = "character-name";
    name.textContent = formatCharacterName(player.name, player.serverId);
    main.append(name);
    if (isTaiwanName(player.name)) {
      const badge = document.createElement("span");
      badge.className = "tw-badge";
      badge.title = state.locale === "en" ? "Taiwan server" : "대만 서버";
      badge.setAttribute("role", "img");
      badge.setAttribute("aria-label", badge.title);
      main.append(badge);
    }
    if (Number(player.combatPower) > 0) {
      const cp = document.createElement("span");
      cp.className = "cp-badge";
      const cpIcon = document.createElement("img");
      cpIcon.src = "./assets/combat-power.png";
      cpIcon.alt = "";
      const value = document.createElement("span");
      value.textContent = formatCombatPower(player.combatPower);
      cp.title = `${formatInteger(player.combatPower)} CP`;
      cp.append(cpIcon, value);
      main.append(cp);
    }
    characterStack.append(main);

    const party = state.dungeonKey === "training-dummy-60s" ? [] : decodeParty(player);
    if (party.length > 1) {
      const partyLine = document.createElement("div");
      partyLine.className = "party-icons";
      const label = document.createElement("span");
      label.className = "party-label";
      label.textContent = t("party");
      partyLine.append(label);
      party.forEach(job => partyLine.append(createJobIcon(job)));
      characterStack.append(partyLine);
    }
    const mobileMeta = document.createElement("span");
    mobileMeta.className = "mobile-class-meta";
    mobileMeta.textContent = `${bossName} · ${formatDuration(player.durationSeconds)}`;
    characterStack.append(mobileMeta);
    characterCell.append(characterStack);
    tr.append(characterCell);

    const bossCell = document.createElement("td");
    bossCell.className = "class-boss";
    bossCell.textContent = bossName;
    tr.append(bossCell);

    tr.append(numericCell(formatDuration(player.durationSeconds), "class-duration", t("duration")));
    tr.append(numericCell(
      formatInteger(Math.round(Number(player.dps) || 0)),
      "accent class-dps",
      "DPS"));
    const detailCell = document.createElement("td");
    detailCell.className = "detail-column";
    const detailLink = document.createElement("span");
    detailLink.className = "detail-link";
    detailLink.textContent = `${t("viewDetails")} ›`;
    detailCell.append(detailLink);
    tr.append(detailCell);
    return tr;
  }

  function resolveCombatDetail(player) {
    const detailId = String(player.D ?? player.detailId ?? "").trim();
    if (!detailId) {
      return null;
    }
    const customDetail = state.cpFilterMode === "custom"
      ? state.customCpData?.classRankings?.[state.dungeonKey]?.details?.[detailId]
      : null;
    return customDetail ||
      state.data?.classRankings?.[state.dungeonKey]?.details?.[detailId] ||
      null;
  }

  async function resolveDetailLookupKey(player) {
    const value = String(player.Q ?? player.detailLookupKey ?? "").trim().toLowerCase();
    if (/^[0-9a-f]{64}$/.test(value)) {
      return value;
    }
    if (!globalThis.crypto?.subtle) {
      return "";
    }

    const dungeonKey = String(state.dungeonKey || "").trim().toLowerCase();
    const bossIndex = Math.max(
      0,
      Math.trunc(Number(player.B ?? player.bossIndex ?? state.bossIndex) || 0));
    const job = String(state.selectedJob || "").trim().normalize("NFC");
    const name = String(player.name || "").trim().normalize("NFC");
    const serverId = Math.max(0, Math.trunc(Number(player.serverId) || 0));
    const combatPower = Math.max(0, Math.trunc(Number(player.combatPower) || 0));
    const rawDuration = Number(player.durationSeconds);
    const roundedDuration = Math.round(
      (Number.isFinite(rawDuration) ? Math.max(0, rawDuration) : 0) * 1000) / 1000;
    const duration = roundedDuration.toFixed(3).replace(/\.?0+$/, "");
    const rawDps = Number(player.dps);
    const dps = Math.round(Number.isFinite(rawDps) ? Math.max(0, rawDps) : 0);
    const canonical = [
      dungeonKey,
      bossIndex,
      job,
      name,
      serverId,
      combatPower,
      duration || "0",
      dps,
    ].join("\n");
    const hash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(canonical));
    return Array.from(new Uint8Array(hash))
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  function openLegacyCombatDetail(player, detail) {
    const dungeon = currentDungeon();
    const bossIndex = Number(player.B ?? player.bossIndex ?? state.bossIndex);
    const bossName = bossIndex > 0
      ? dungeon?.bossNames?.[bossIndex - 1]
      : dungeon?.bossNames?.[0] || dungeonName(dungeon);
    state.selectedDetail = {
      player,
      actorId: Number(detail.actorId) || 0,
      record: {
        bossName,
        durationSeconds: Math.max(0, Number(player.durationSeconds) || 60),
        players: [detail],
      },
    };
    renderCombatDetail();
    elements["combat-detail-modal"].hidden = false;
    document.body.classList.add("detail-open");
    elements["detail-close"].focus({ preventScroll: true });
  }

  function openUnavailableCombatDetail(player, reason) {
    const dungeon = currentDungeon();
    const bossIndex = Number(player.B ?? player.bossIndex ?? state.bossIndex);
    const bossName = bossIndex > 0
      ? dungeon?.bossNames?.[bossIndex - 1]
      : dungeon?.bossNames?.[0] || dungeonName(dungeon);
    const actorId = 1;
    state.selectedDetail = {
      player,
      actorId,
      unavailableReason: String(reason || t("detailUnavailable")),
      record: {
        bossName,
        durationSeconds: Math.max(0, Number(player.durationSeconds) || 0),
        players: [{
          actorId,
          name: player.name,
          serverId: Number(player.serverId) || 0,
          jobName: state.selectedJob,
          combatPower: Number(player.combatPower) || 0,
          dps: Number(player.dps) || 0,
          skills: [],
          buffs: [],
        }],
      },
    };
    renderCombatDetail();
    elements["combat-detail-modal"].hidden = false;
    document.body.classList.add("detail-open");
    elements["detail-close"].focus({ preventScroll: true });
  }

  async function openRemoteCombatDetail(player, lookupKey, row) {
    if (!lookupKey || row.classList.contains("detail-loading")) {
      return;
    }
    row.classList.add("detail-loading");
    row.setAttribute("aria-busy", "true");
    const detailLink = row.querySelector(".detail-link");
    const previousLabel = detailLink?.textContent || "";
    if (detailLink) {
      detailLink.textContent = t("detailLoading");
    }
    try {
      const detailDocument = await loadRankingCombatDetail(lookupKey);
      const actorId = Number(detailDocument.selectors?.[lookupKey]) || 0;
      state.selectedDetail = {
        player,
        actorId,
        record: detailDocument.record,
      };
      row.removeAttribute("title");
      renderCombatDetail();
      elements["combat-detail-modal"].hidden = false;
      document.body.classList.add("detail-open");
      elements["detail-close"].focus({ preventScroll: true });
    } catch (error) {
      console.error(error);
      const reason = Number(error?.status) === 404
        ? t("detailUnavailableOld")
        : t("detailUnavailable");
      row.title = reason;
      openUnavailableCombatDetail(player, reason);
    } finally {
      row.classList.remove("detail-loading");
      row.removeAttribute("aria-busy");
      if (detailLink) {
        detailLink.textContent = previousLabel;
      }
    }
  }

  async function loadRankingCombatDetail(lookupKey) {
    if (state.detailMemory.has(lookupKey)) {
      const cached = state.detailMemory.get(lookupKey);
      state.detailMemory.delete(lookupKey);
      state.detailMemory.set(lookupKey, cached);
      return cached;
    }
    if (state.detailLoads.has(lookupKey)) {
      return state.detailLoads.get(lookupKey);
    }

    const load = loadRankingCombatDetailCore(lookupKey)
      .then(document => {
        rememberDetail(lookupKey, document);
        return document;
      })
      .finally(() => state.detailLoads.delete(lookupKey));
    state.detailLoads.set(lookupKey, load);
    return load;
  }

  async function loadRankingCombatDetailCore(lookupKey) {
    const generation = String(state.data?.generatedAt || "");
    const requestPath = `${lookupKey}?g=${encodeURIComponent(generation)}`;
    const request = new Request(
      `${DETAIL_ENDPOINT}${requestPath}`,
      { mode: "cors", credentials: "omit" });
    let cache = null;
    if ("caches" in window) {
      try {
        cache = await caches.open(DETAIL_CACHE_NAME);
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          try {
            return await parseRankingCombatDetail(cachedResponse, lookupKey);
          } catch {
            await cache.delete(request);
          }
        }
      } catch {
        cache = null;
      }
    }

    const { detailDocument, cacheCopy } = await downloadRankingCombatDetail(
      requestPath,
      lookupKey);
    if (cache) {
      try {
        await cache.put(request, cacheCopy);
      } catch {
      }
    }
    return detailDocument;
  }

  async function downloadRankingCombatDetail(requestPath, lookupKey) {
    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(),
      DETAIL_REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(`${DETAIL_ENDPOINT}${requestPath}`, {
        mode: "cors",
        credentials: "omit",
        cache: "default",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (!response.ok) {
        const error = new Error(`${t("detailUnavailable")} (${response.status})`);
        error.status = response.status;
        throw error;
      }
      const cacheCopy = response.clone();
      const detailDocument = await parseRankingCombatDetail(response, lookupKey);
      return { detailDocument, cacheCopy };
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function parseRankingCombatDetail(response, lookupKey) {
    const payload = await response.arrayBuffer();
    if (payload.byteLength <= 0 || payload.byteLength > 8 * 1024 * 1024) {
      throw new Error(t("detailUnavailable"));
    }
    const etag = String(response.headers.get("etag") || "")
      .replace(/^W\//, "")
      .replaceAll("\"", "")
      .trim()
      .toLowerCase();
    if (/^[0-9a-f]{64}$/.test(etag) && globalThis.crypto?.subtle) {
      const hash = await crypto.subtle.digest("SHA-256", payload);
      const actual = Array.from(new Uint8Array(hash))
        .map(value => value.toString(16).padStart(2, "0"))
        .join("");
      if (actual !== etag) {
        throw new Error(t("detailUnavailable"));
      }
    }

    const document = JSON.parse(new TextDecoder().decode(payload));
    const players = document.record?.players;
    const actorId = Number(document.selectors?.[lookupKey]) || 0;
    if (document.schema !== DETAIL_SCHEMA ||
        Number(document.version) !== 1 ||
        document.dungeonKey !== state.dungeonKey ||
        !Array.isArray(players) ||
        players.length < 1 ||
        players.length > 10 ||
        actorId <= 0 ||
        !players.some(player => Number(player.actorId) === actorId) ||
        players.some(player =>
          !Array.isArray(player.skills) ||
          player.skills.length > 192 ||
          !Array.isArray(player.buffs) ||
          player.buffs.length > 80)) {
      throw new Error(t("detailUnavailable"));
    }
    return document;
  }

  function rememberDetail(lookupKey, document) {
    state.detailMemory.delete(lookupKey);
    state.detailMemory.set(lookupKey, document);
    while (state.detailMemory.size > DETAIL_MEMORY_LIMIT) {
      state.detailMemory.delete(state.detailMemory.keys().next().value);
    }
  }

  async function pruneDetailCache(generatedAt) {
    if (!("caches" in window)) {
      return;
    }
    try {
      const cache = await caches.open(DETAIL_CACHE_NAME);
      const expected = `g=${encodeURIComponent(String(generatedAt || ""))}`;
      const requests = await cache.keys();
      await Promise.all(requests
        .filter(request => !request.url.includes(expected))
        .map(request => cache.delete(request)));
    } catch {
    }
  }

  function closeCombatDetail() {
    if (!state.selectedDetail && elements["combat-detail-modal"]?.hidden) {
      return;
    }
    state.selectedDetail = null;
    if (elements["combat-detail-modal"]) {
      elements["combat-detail-modal"].hidden = true;
    }
    document.body.classList.remove("detail-open");
  }

  function renderCombatDetail() {
    if (!state.selectedDetail) {
      return;
    }
    const { player, record } = state.selectedDetail;
    const unavailableReason = String(state.selectedDetail.unavailableReason || "");
    const players = Array.isArray(record?.players) ? record.players : [];
    const detail = players.find(candidate =>
      Number(candidate.actorId) === Number(state.selectedDetail.actorId)) || players[0];
    if (!detail) {
      closeCombatDetail();
      return;
    }
    const detailJob = detail.jobName || state.selectedJob;
    const durationSeconds = Math.max(
      0,
      Number(record.durationSeconds) || Number(player.durationSeconds) || 60);
    const dungeon = currentDungeon();
    const bossIndex = Number(player.B ?? player.bossIndex ?? state.bossIndex);
    const bossName = String(record.bossName || "") || (bossIndex > 0
      ? dungeon?.bossNames?.[bossIndex - 1]
      : dungeon?.bossNames?.[0] || dungeonName(dungeon));

    elements["detail-job-icon"].replaceChildren(createJobIcon(detailJob));
    elements["detail-title"].textContent = bossName || t("combatDetails");
    elements["detail-character"].textContent = formatCharacterName(
      detail.name || player.name,
      Number(detail.serverId || player.serverId));
    elements["detail-duration"].textContent = formatDuration(durationSeconds);
    renderDetailPartyTabs(players);

    const combatPower = Number(detail.combatPower || player.combatPower) || 0;
    elements["detail-cp-row"].hidden = combatPower <= 0;
    elements["detail-cp"].textContent = formatInteger(combatPower);
    elements["detail-total-damage"].textContent = unavailableReason
      ? "—"
      : formatInteger(detail.totalDamage);
    elements["detail-dps"].textContent = formatCompact(
      Number(detail.dps || player.dps) || 0);
    elements["detail-share"].textContent = unavailableReason
      ? "—"
      : formatPercent(detail.sharePercent);
    elements["detail-summary-duration"].textContent = formatDuration(durationSeconds);
    elements["detail-death-count"].textContent = unavailableReason
      ? "—"
      : formatInteger(Math.max(0, Number(detail.deathCount) || 0));
    elements["detail-hits"].textContent = unavailableReason ? "—" : formatInteger(detail.hitCount);
    elements["detail-parry-rate"].textContent = unavailableReason ? "—" : formatPercent(detail.parryRate);
    elements["detail-critical-rate"].textContent = unavailableReason ? "—" : formatPercent(detail.criticalRate);
    elements["detail-front-rate"].textContent = unavailableReason ? "—" : formatPositionPercent(detail.frontAttackRate);
    elements["detail-back-rate"].textContent = unavailableReason ? "—" : formatPositionPercent(detail.backAttackRate);
    elements["detail-perfect-rate"].textContent = unavailableReason ? "—" : formatPercent(detail.perfectRate);
    elements["detail-double-rate"].textContent = unavailableReason ? "—" : formatPercent(detail.doubleDamageRate);
    elements["detail-evade-rate"].textContent = unavailableReason ? "—" : formatPercent(detail.evadeRate);
    applyDetailMetricVisibility();

    const skills = Array.isArray(detail.skills)
      ? [...detail.skills]
          .filter(skill =>
            Number(skill.totalDamage) > 0 ||
            Number(skill.healingAmount) > 0 ||
            Number(skill.drainHealingAmount) > 0 ||
            Number(skill.useCount) > 0)
          .sort((left, right) =>
            Number(right.totalDamage) - Number(left.totalDamage) ||
            Number(right.healingAmount) - Number(left.healingAmount) ||
            Number(right.useCount) - Number(left.useCount))
      : [];
    const skillRows = document.createDocumentFragment();
    if (unavailableReason) {
      const unavailable = document.createElement("article");
      unavailable.className = "detail-unavailable";
      const title = document.createElement("strong");
      title.textContent = t("detailUnavailableTitle");
      const description = document.createElement("span");
      description.textContent = unavailableReason;
      unavailable.append(title, description);
      skillRows.append(unavailable);
    } else {
      for (const skill of skills) {
        skillRows.append(buildDetailSkillRow(skill));
      }
    }
    elements["detail-skill-rows"].replaceChildren(skillRows);

    if (unavailableReason) {
      elements["detail-buffs"].replaceChildren();
      elements["detail-buff-count"].textContent = "";
      elements["detail-buffs-section"].hidden = true;
      return;
    }

    const buffs = Array.isArray(detail.buffs)
      ? [...detail.buffs]
          .filter(buff => globalThis.NotMeterCombatDetailBuffs.shouldDisplay(buff))
          .sort((left, right) =>
            Number(right.uptimeSeconds) - Number(left.uptimeSeconds) ||
            Number(right.count) - Number(left.count) ||
            Number(left.code) - Number(right.code))
      : [];
    const buffItems = document.createDocumentFragment();
    for (const buff of buffs) {
      buffItems.append(buildDetailBuff(buff, durationSeconds));
    }
    if (buffs.length === 0) {
      const empty = document.createElement("span");
      empty.className = "detail-buff-empty";
      empty.textContent = t("recordedBuffsNone");
      buffItems.append(empty);
    }
    elements["detail-buffs"].replaceChildren(buffItems);
    elements["detail-buff-count"].textContent = ` (${formatInteger(buffs.length)})`;
    elements["detail-buffs-section"].hidden = false;
  }

  function renderDetailPartyTabs(players) {
    const host = elements["detail-party-tabs"];
    if (!host) {
      return;
    }
    if (players.length <= 1) {
      host.hidden = true;
      host.replaceChildren();
      return;
    }

    const fragment = document.createDocumentFragment();
    for (const player of players) {
      const actorId = Number(player.actorId) || 0;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "detail-party-tab";
      button.classList.toggle(
        "active",
        actorId === Number(state.selectedDetail?.actorId));
      button.append(createJobIcon(player.jobName || ""));
      const identity = document.createElement("span");
      const name = document.createElement("strong");
      name.textContent = formatCharacterName(player.name, Number(player.serverId));
      const dps = document.createElement("small");
      dps.textContent = `DPS ${formatCompact(Number(player.dps) || 0)}`;
      identity.append(name, dps);
      button.append(identity);
      button.title = `${t("partyMembers")} · ${name.textContent}`;
      button.addEventListener("click", () => {
        state.selectedDetail.actorId = actorId;
        renderCombatDetail();
      });
      fragment.append(button);
    }
    host.replaceChildren(fragment);
    host.hidden = false;
  }

  function buildDetailSkillRow(skill) {
    const row = document.createElement("article");
    row.className = "detail-skill-row";
    const totalDamage = Math.max(0, Number(skill.totalDamage) || 0);
    const healingAmount = Math.max(0, Number(skill.healingAmount) || 0);
    const useCount = Math.max(0, Number(skill.useCount) || 0);
    row.classList.toggle("healing", totalDamage <= 0 && healingAmount > 0);
    row.classList.toggle("support", totalDamage <= 0 && healingAmount <= 0);
    row.title = totalDamage > 0
      ? `${String(skill.skillName || "—")}\n${formatInteger(skill.minHit)} ~ ${formatInteger(skill.maxHit)}`
      : String(skill.skillName || "—");

    const bar = document.createElement("span");
    bar.className = "detail-skill-bar";
    bar.style.width = `${Math.max(0, Math.min(100, Number(skill.damagePercentage) || 0))}%`;

    const icon = document.createElement("span");
    icon.className = "detail-skill-icon";
    applyDetailSkillIcon(icon, skill, 28);

    const name = document.createElement("strong");
    name.className = "detail-skill-name";
    name.textContent = String(skill.skillName || "—");

    const damage = document.createElement("strong");
    damage.className = "detail-skill-damage";
    if (totalDamage > 0) {
      damage.append(document.createTextNode(formatInteger(totalDamage)));
      const share = document.createElement("span");
      share.textContent = ` (${formatPercent(skill.damagePercentage, 1)})`;
      damage.append(share);
    } else if (healingAmount > 0) {
      damage.textContent = `${t("healing")} ${formatCompact(healingAmount)}`;
    } else {
      damage.textContent = `${t("useCount")} ${formatUseCount(useCount)}`;
    }

    const chips = document.createElement("div");
    chips.className = "detail-skill-chips";
    const interval = Number(skill.averageUseIntervalMilliseconds);
    if (Number.isFinite(interval) && interval > 0) {
      chips.append(buildDetailChip(t("averageInterval"), `${interval.toFixed(2)}ms`, "accent"));
    }
    if (useCount > 0) {
      chips.append(buildDetailChip(t("useCount"), formatUseCount(useCount), "accent"));
    }
    if (isDetailMetricVisible("specialization")) {
      chips.append(buildSpecializationChip(skill.specializationFlags));
    }
    if (isDetailMetricVisible("hits") && Number(skill.hitCount) > 0) {
      chips.append(buildDetailChip(t("hits"), formatInteger(skill.hitCount)));
    }
    if (isDetailMetricVisible("parry") && Number(skill.hitCount) > 0) {
      chips.append(buildDetailChip(t("parry"), formatPercent(skill.parryRate), "accent"));
    }
    if (isDetailMetricVisible("avoidance") && Number(skill.evadeCount) > 0) {
      chips.append(buildDetailChip(
        t("avoidance"),
        `${formatInteger(skill.evadeCount)} / ${formatPercent(skill.evadeRate)}`));
    }
    if (isDetailMetricVisible("multiHit") && Number(skill.hitCount) > 0) {
      const hits = Math.max(0, Number(skill.hitCount) || 0);
      const ratio = hits > 0 ? (Number(skill.multiHitCount) || 0) / hits * 100 : 0;
      chips.append(buildDetailChip(t("multiHit"), formatPercent(ratio), "double"));
    }
    if (isDetailMetricVisible("critical") && Number(skill.hitCount) > 0) {
      chips.append(buildDetailChip(t("critical"), formatPercent(skill.criticalRate), "critical"));
    }
    if (isDetailMetricVisible("front") && Number(skill.hitCount) > 0) {
      chips.append(buildDetailChip(t("front"), formatPositionPercent(skill.frontAttackRate), "position"));
    }
    if (isDetailMetricVisible("back") && Number(skill.hitCount) > 0) {
      chips.append(buildDetailChip(t("back"), formatPositionPercent(skill.backAttackRate), "position"));
    }
    if (isDetailMetricVisible("perfect") && Number(skill.hitCount) > 0) {
      chips.append(buildDetailChip(t("perfect"), formatPercent(skill.perfectRate), "perfect"));
    }
    if (isDetailMetricVisible("double") && Number(skill.hitCount) > 0) {
      chips.append(buildDetailChip(t("doubleDamage"), formatPercent(skill.doubleDamageRate), "double"));
    }
    if (isDetailMetricVisible("periodic") &&
        (Number(skill.periodicDamage) > 0 || Number(skill.periodicHitCount) > 0)) {
      const periodic = Number(skill.periodicHitCount) > 0
        ? `${formatCompact(skill.periodicDamage)} / ${formatInteger(skill.periodicHitCount)}${state.locale === "ko" ? "회" : "x"}`
        : formatCompact(skill.periodicDamage);
      chips.append(buildDetailChip(t("periodicDamage"), periodic, "perfect"));
    }
    if (isDetailMetricVisible("healing") && Number(skill.healingAmount) > 0) {
      chips.append(buildDetailChip(t("healing"), formatCompact(skill.healingAmount), "healing"));
    }
    if (Number(skill.healingHitCount) > 0) {
      chips.append(buildDetailChip(t("healingCount"), formatInteger(skill.healingHitCount), "healing"));
    }
    if (isDetailMetricVisible("drainHealing") && Number(skill.drainHealingAmount) > 0) {
      chips.append(buildDetailChip(t("drainHealing"), formatCompact(skill.drainHealingAmount), "healing"));
    }
    if (isDetailMetricVisible("averageDamage") && totalDamage > 0) {
      chips.append(buildDetailChip(t("averageDamage"), formatCompact(skill.averageDamage)));
    }

    row.append(bar, icon, name, damage, chips);
    return row;
  }

  function formatUseCount(value) {
    const count = formatInteger(Math.max(0, Number(value) || 0));
    return state.locale === "ko" ? `${count}회` : `${count}x`;
  }

  function buildDetailChip(label, value, modifier = "") {
    const chip = document.createElement("span");
    chip.className = `detail-chip ${modifier}`.trim();
    chip.append(document.createTextNode(`${label} `));
    const strong = document.createElement("b");
    strong.textContent = value;
    chip.append(strong);
    chip.title = `${label} ${value}`;
    return chip;
  }

  function buildSpecializationChip(flags) {
    const chip = document.createElement("span");
    chip.className = "detail-chip";
    chip.append(document.createTextNode(t("specialization")));
    const dots = document.createElement("span");
    dots.className = "detail-spec-dots";
    for (let index = 0; index < 5; index++) {
      const dot = document.createElement("i");
      if (Array.isArray(flags) && flags[index]) {
        dot.className = "active";
      }
      dots.append(dot);
    }
    chip.append(dots);
    return chip;
  }

  function buildDetailBuff(buff, durationSeconds) {
    const item = document.createElement("article");
    item.className = "detail-buff";
    const seconds = Math.max(0, Number(buff.uptimeSeconds) || 0);
    const ratio = durationSeconds > 0 ? Math.min(100, seconds / durationSeconds * 100) : 0;
    const enhanced = globalThis.NotMeterCombatDetailBuffs.isEnhanced(buff);

    const iconSlot = document.createElement("span");
    iconSlot.className = "detail-buff-icon-slot";
    const icon = document.createElement("span");
    icon.className = "detail-buff-icon";
    applyBuffIcon(icon, buff, 30);
    iconSlot.append(icon);
    if (enhanced) {
      const upBadge = document.createElement("span");
      upBadge.className = "detail-buff-up";
      upBadge.textContent = "UP";
      iconSlot.append(upBadge);
    }

    const text = document.createElement("div");
    text.className = "detail-buff-text";
    const name = document.createElement("strong");
    name.textContent = buffDisplayName(buff);
    const uptime = document.createElement("span");
    uptime.textContent =
      `${formatPercent(ratio)} · ${formatDuration(seconds)} · x${Math.max(1, Number(buff.count) || 0)}`;
    text.append(name, uptime);

    const gauge = document.createElement("span");
    gauge.className = "detail-buff-gauge";
    const fill = document.createElement("i");
    fill.style.width = `${ratio}%`;
    gauge.append(fill);

    const enhancedDescription = enhanced
      ? state.locale === "en" ? "\nEnhanced buff" : "\n상위 버프"
      : "";
    item.title = `${name.textContent}\n${formatDuration(seconds)} / ${formatDuration(durationSeconds)} (${formatPercent(ratio)})${enhancedDescription}`;
    item.append(iconSlot, text, gauge);
    return item;
  }

  function buffDisplayName(buff) {
    return globalThis.NotMeterCombatDetailBuffs.displayName(
      buff,
      state.locale,
      state.iconAtlases.buff);
  }

  function loadVisibleMetrics() {
    try {
      const saved = JSON.parse(localStorage.getItem("notmeter-detail-metrics") || "null");
      if (Array.isArray(saved)) {
        const allowed = new Set(DETAIL_METRICS.map(([key]) => key));
        return new Set(saved.filter(key => allowed.has(key)));
      }
    } catch {
    }
    return new Set(DETAIL_METRICS.map(([key]) => key));
  }

  function renderDetailSettings() {
    if (!elements["detail-settings-options"]) {
      return;
    }
    const fragment = document.createDocumentFragment();
    for (const [key, labelKey] of DETAIL_METRICS) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = t(labelKey);
      button.classList.toggle("active", isDetailMetricVisible(key));
      button.addEventListener("click", () => {
        if (state.visibleMetrics.has(key)) {
          state.visibleMetrics.delete(key);
        } else {
          state.visibleMetrics.add(key);
        }
        localStorage.setItem(
          "notmeter-detail-metrics",
          JSON.stringify([...state.visibleMetrics]));
        renderDetailSettings();
        if (state.selectedDetail) {
          renderCombatDetail();
        }
      });
      fragment.append(button);
    }
    elements["detail-settings-options"].replaceChildren(fragment);
    elements["detail-visible-count"].textContent =
      `${state.visibleMetrics.size}/${DETAIL_METRICS.length}`;
    elements["detail-settings-toggle"].textContent =
      t(elements["detail-settings-options"].hidden ? "openSettings" : "closeSettings");
  }

  function isDetailMetricVisible(key) {
    return state.visibleMetrics.has(key);
  }

  function applyDetailMetricVisibility() {
    document.querySelectorAll("#combat-detail-modal [data-detail-metric]").forEach(element => {
      element.hidden = !isDetailMetricVisible(element.dataset.detailMetric);
    });
  }

  async function loadIconAtlases() {
    try {
      const [skill, buff] = await Promise.all([
        fetch("./assets/icons/skill-icons.json?v=20260726-5", { cache: "force-cache" })
          .then(response => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))),
        fetch("./assets/icons/buff-icons.json?v=20260726-5", { cache: "force-cache" })
          .then(response => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))),
      ]);
      state.iconAtlases.skill = skill;
      state.iconAtlases.buff = buff;
      if (state.selectedDetail) {
        renderCombatDetail();
      }
    } catch (error) {
      console.warn("NotMeter icon atlas unavailable", error);
    }
  }

  function applySkillIcon(element, rawCode, fallbackCode, size) {
    const key = findSkillIconKey(rawCode, fallbackCode);
    if (key) {
      applyAtlasIcon(element, "skill", key, size);
    }
  }

  function applyDetailSkillIcon(element, skill, size) {
    const preferred = globalThis.NotMeterCombatDetailBuffs.skillIconSource(skill);
    const preferredManifest = preferred ? state.iconAtlases[preferred.type] : null;
    if (preferred && Object.hasOwn(preferredManifest?.icons || {}, preferred.key)) {
      applyAtlasIcon(element, preferred.type, preferred.key, size);
      return;
    }

    const skillKey = findSkillIconKey(skill?.rawSkillCode, skill?.skillCode);
    if (skillKey) {
      applyAtlasIcon(element, "skill", skillKey, size);
      return;
    }

    const buffKey = findBuffIconKey(skill?.rawSkillCode, skill?.skillCode);
    if (buffKey) {
      applyAtlasIcon(element, "buff", buffKey, size);
    }
  }

  function applyBuffIcon(element, buff, size) {
    const code = buff?.code;
    const rawCode = buff?.rawCode;
    const preferred = globalThis.NotMeterCombatDetailBuffs.iconSource(buff);
    const preferredManifest = preferred ? state.iconAtlases[preferred.type] : null;
    if (preferred && Object.hasOwn(preferredManifest?.icons || {}, preferred.key)) {
      applyAtlasIcon(element, preferred.type, preferred.key, size);
      return;
    }

    const buffKey = findBuffIconKey(rawCode, code);
    if (buffKey) {
      applyAtlasIcon(element, "buff", buffKey, size);
      return;
    }
    applySkillIcon(element, rawCode, code, size);
  }

  function findBuffIconKey(rawCode, fallbackCode) {
    const manifest = state.iconAtlases.buff;
    if (!manifest) {
      return "";
    }

    for (const candidate of [rawCode, fallbackCode]) {
      const iconKey = manifest.codes?.[String(Math.abs(Number(candidate) || 0))];
      if (iconKey && Object.hasOwn(manifest.icons, iconKey)) {
        return iconKey;
      }
    }
    return "";
  }

  function applyAtlasIcon(element, type, key, size) {
    const manifest = state.iconAtlases[type];
    const index = manifest?.icons?.[key];
    if (!Number.isInteger(index)) {
      return;
    }
    const column = index % Number(manifest.columns);
    const row = Math.floor(index / Number(manifest.columns));
    element.style.backgroundImage = `url("./assets/icons/${type}-atlas.png?v=20260726-5")`;
    element.style.backgroundSize =
      `${Number(manifest.columns) * size}px ${Number(manifest.rows) * size}px`;
    element.style.backgroundPosition = `${-column * size}px ${-row * size}px`;
  }

  function findSkillIconKey(rawCode, fallbackCode) {
    const manifest = state.iconAtlases.skill;
    if (!manifest) {
      return "";
    }

    for (const candidate of [rawCode, fallbackCode]) {
      const godstone = godstoneIconKey(candidate);
      if (godstone && Object.hasOwn(manifest.icons, godstone)) {
        return godstone;
      }
    }

    // rawCode에는 특성 단계가 붙으므로 클라이언트 기준 코드로 접어서 찾는다
    for (const candidate of [rawCode, fallbackCode]) {
      let normalized = normalizeSkillIconCode(candidate);
      if (normalized === 11250000) {
        normalized = 11400000;
      } else if (normalized === 11400000) {
        normalized = 11250000;
      }
      const key = String(normalized || "");
      if (key && Object.hasOwn(manifest.icons, key)) {
        return key;
      }
    }
    return "";
  }

  function normalizeSkillIconCode(value) {
    let code = Math.abs(Number(value) || 0);
    if (code >= 100011 && code <= 100018) return 16100000;
    if ((code >= 100021 && code <= 100028) || code === 16990002) return 16110000;
    if ((code >= 100031 && code <= 100038) || code === 16990003) return 16120000;
    if (code >= 100041 && code <= 100048) return 16130000;
    if (code === 100051 || code === 100055) return 16250000;
    if ((code >= 16001101 && code <= 16001104) || (code >= 16001301 && code <= 16001304)) return 16100000;
    if ((code >= 16001105 && code <= 16001108) || (code >= 16001305 && code <= 16001308)) return 16110000;
    if ((code >= 16001109 && code <= 16001112) || (code >= 16001309 && code <= 16001312)) return 16120000;
    if ((code >= 16001113 && code <= 16001116) || (code >= 16001313 && code <= 16001316)) return 16130000;
    if (code === 16001117 || code === 16001317) return 16250000;
    if (POTION_CODES.has(code)) return code;
    if (code >= 10000000 && code % 10 === 0 && POTION_CODES.has(code / 10)) return code / 10;
    if (code >= 110000000 && code <= 190999999) {
      return Math.floor(code / 100000) * 10000;
    }
    if (code >= 100000000) {
      code = Math.floor(code / 10);
    }
    if (POTION_CODES.has(code)) return code;
    return code >= 11000000 && code <= 19999999
      ? Math.floor(code / 10000) * 10000
      : 0;
  }

  function godstoneIconKey(value) {
    let code = Math.abs(Number(value) || 0);
    if (code >= 3000000 && code <= 3099999) {
      code = code * 10 + 1;
    }
    if (code < 30000000 || code > 30999999) {
      return "";
    }
    const digits = String(Math.trunc(code)).padStart(8, "0");
    const suffix = Number(digits.slice(5, 7)) - 6;
    return suffix >= 1 && suffix <= 18
      ? `godstone-${String(suffix).padStart(3, "0")}`
      : "";
  }

  function findSummaryView() {
    if (state.cpFilterMode === "custom") {
      return buildCustomExactSummaryView();
    }
    const views = (state.data?.views || []).filter(view =>
      view.dungeonKey === state.dungeonKey &&
      Number(view.bossIndex) === state.bossIndex &&
      Number(view.cpTierIndex) === state.cpTierIndex);
    return selectPeriodViews(views)[0];
  }

  function selectPeriodViews(views) {
    if (state.period === "Weekly") {
      return views.filter(view =>
        normalizePeriod(view.period) === "All" &&
        parseWeeklyRange(view.periodLabel));
    }
    return views.filter(view =>
      normalizePeriod(view.period) === state.period &&
      (state.period !== "All" || !parseWeeklyRange(view.periodLabel)) &&
      view.periodLabel !== INTERNAL_REPLAY_PERIOD_LABEL);
  }

  function findClassView() {
    if (state.cpFilterMode === "custom") {
      return buildCustomExactClassView();
    }
    const classRanking = state.data?.classRankings?.[state.dungeonKey];
    const views = classRanking?.views?.filter(view =>
      Number(view.bossIndex) === state.bossIndex &&
      Number(view.cpTierIndex) === state.cpTierIndex) || [];
    if (state.period === "Weekly") {
      return [...views].reverse().find(view => normalizePeriod(view.period) === "All");
    }
    return views.find(view => normalizePeriod(view.period) === state.period);
  }

  function buildCustomExactSummaryView() {
    const buckets = filterCustomCpSummaryBuckets(state.period);
    const previousBuckets = state.period === "Weekly"
      ? filterCustomCpSummaryBuckets("PreviousWeekly")
      : [];
    const previousByJob = aggregateCustomCpSummary(previousBuckets);
    const currentByJob = aggregateCustomCpSummary(buckets);
    const rows = [...currentByJob.entries()]
      .map(([jobName, current]) => {
        const previous = previousByJob.get(jobName);
        return {
          jobName,
          sampleCount: current.sampleCount,
          minDps: current.minDps,
          p25Dps: current.p25Dps,
          medianDps: current.medianDps,
          p75Dps: current.p75Dps,
          maxDps: current.maxDps,
          dpsPercentiles: state.period === "Weekly" && previous
            ? [previous.p75Dps, current.p75Dps, previous.sampleCount]
            : null,
        };
      });
    const playerSampleCount = [...currentByJob.values()]
      .reduce((sum, row) => sum + row.sampleCount, 0);
    return {
      dungeonKey: state.dungeonKey,
      bossIndex: state.bossIndex,
      cpTierIndex: -1,
      cpTierLabel: customCpRangeLabel(),
      period: state.period === "Weekly" ? "All" : state.period,
      periodLabel: state.period === "Weekly"
        ? customCpWeeklyPeriodLabel()
        : state.period,
      generatedAt: state.customCpData?.generatedAt,
      recordCount: 0,
      playerSampleCount,
      rows,
    };
  }

  function buildCustomExactClassView() {
    const bestByCharacter = new Map();
    for (const bucket of filterCustomCpRankBuckets(state.period)) {
      const jobName = String(bucket.J || "");
      for (const player of Array.isArray(bucket.L) ? bucket.L : []) {
        const name = String(player.N || "");
        const serverId = Number(player.S) || 0;
        if (!name || serverId <= 0) {
          continue;
        }
        const participant = String(player.G || `${serverId}:${name}`);
        const key = `${jobName}\u0000${participant}`;
        const current = bestByCharacter.get(key);
        if (!current || Number(player.X) > Number(current.player.X)) {
          bestByCharacter.set(key, { jobName, player, bossIndex: Number(bucket.B) || 0 });
        }
      }
    }
    const rows = JOB_ORDER.map(jobName => {
      const players = [...bestByCharacter.values()]
        .filter(item => item.jobName === jobName)
        .sort((left, right) =>
          Number(right.player.X) - Number(left.player.X) ||
          Number(left.player.S) - Number(right.player.S) ||
          String(left.player.N).localeCompare(String(right.player.N)))
        .slice(0, 20)
        .map((item, index) => ({
          rank: index + 1,
          name: String(item.player.N || ""),
          serverId: Number(item.player.S) || 0,
          combatPower: Number(item.player.C) || 0,
          durationSeconds: Number(item.player.U) || 0,
          partyJobNames: null,
          dps: Number(item.player.X) || 0,
          P: String(item.player.P || ""),
          B: item.bossIndex,
          D: state.dungeonKey === "training-dummy-60s"
            ? String(item.player.R || "")
            : null,
          Q: String(item.player.Q || "") || null,
          H: item.player.H === true ? true : null,
          T: item.player.T || null,
        }));
      return { jobName, players };
    }).filter(row => row.players.length > 0);
    return {
      bossIndex: state.bossIndex,
      cpTierIndex: -1,
      period: state.period === "Weekly" ? "All" : state.period,
      rows,
    };
  }

  function filterCustomCpSummaryBuckets(period) {
    const buckets = state.customCpData?.summaryBucketsByDungeon?.[state.dungeonKey];
    if (!Array.isArray(buckets)) {
      return [];
    }
    const periodMask = customCpPeriodMask(period);
    return buckets.filter(bucket =>
      Number(bucket.K) >= state.customCpMinK &&
      Number(bucket.K) <= state.customCpMaxK &&
      (state.bossIndex === 0 || Number(bucket.B) === state.bossIndex) &&
      (Number(bucket.M) & periodMask) !== 0);
  }

  function filterCustomCpRankBuckets(period) {
    const buckets = state.customCpRankData.get(state.dungeonKey)?.rankBuckets;
    if (!Array.isArray(buckets)) {
      return [];
    }
    const periodMask = customCpPeriodMask(period);
    return buckets.filter(bucket =>
      Number(bucket.K) >= state.customCpMinK &&
      Number(bucket.K) <= state.customCpMaxK &&
      (state.bossIndex === 0 || Number(bucket.B) === state.bossIndex) &&
      Number(bucket.M) === periodMask);
  }

  function customCpPeriodMask(period) {
    if (period === "Today") return 1;
    if (period === "Recent14Days") return 2;
    if (period === "All") return 4;
    if (period === "Weekly") return 8;
    if (period === "PreviousWeekly") return 16;
    return 0;
  }

  function aggregateCustomCpSummary(buckets) {
    const bucketsByJob = new Map();
    for (const bucket of buckets) {
      const jobName = String(bucket.J || "");
      if (!jobName) {
        continue;
      }
      const rows = bucketsByJob.get(jobName) || [];
      rows.push(bucket);
      bucketsByJob.set(jobName, rows);
    }
    const summaryByJob = new Map();
    for (const [jobName, rows] of bucketsByJob) {
      const samples = [];
      let sampleCount = 0;
      for (const row of rows) {
        const count = Math.max(0, Number(row.N) || 0);
        sampleCount += count;
        const weight = count / 5;
        for (const value of [row.L, row.A, row.E, row.H, row.X]) {
          const dps = Number(value);
          if (dps > 0 && weight > 0) {
            samples.push([dps, weight]);
          }
        }
      }
      samples.sort((left, right) => left[0] - right[0]);
      summaryByJob.set(jobName, {
        sampleCount,
        minDps: weightedQuantile(samples, 0),
        p25Dps: weightedQuantile(samples, 0.25),
        medianDps: weightedQuantile(samples, 0.5),
        p75Dps: weightedQuantile(samples, 0.75),
        maxDps: weightedQuantile(samples, 1),
      });
    }
    return summaryByJob;
  }

  function percentile(sortedValues, quantile) {
    if (sortedValues.length === 0) {
      return 0;
    }
    if (sortedValues.length === 1) {
      return sortedValues[0];
    }
    const position = Math.max(0, Math.min(1, quantile)) * (sortedValues.length - 1);
    const lower = Math.floor(position);
    const upper = Math.ceil(position);
    if (lower === upper) {
      return sortedValues[lower];
    }
    const weight = position - lower;
    return sortedValues[lower] + (sortedValues[upper] - sortedValues[lower]) * weight;
  }

  function customCpWeeklyPeriodLabel() {
    return String(state.customCpData?.currentWeekPeriodLabel || "") ||
      (state.customCpData?.views || [])
      .find(view =>
        view.dungeonKey === state.dungeonKey &&
        parseWeeklyRange(view.periodLabel))
      ?.periodLabel || "";
  }

  function customCpWeeklyRange(previous) {
    const range = parseWeeklyRange(customCpWeeklyPeriodLabel());
    if (!range || !previous) {
      return range;
    }
    return {
      start: new Date(range.start.getTime() - 7 * 24 * 60 * 60 * 1000),
      end: new Date(range.end.getTime() - 7 * 24 * 60 * 60 * 1000),
    };
  }

  function koreaDayStart(timestamp) {
    if (!Number.isFinite(timestamp)) {
      return Number.NaN;
    }
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date(timestamp));
    const value = type => Number(parts.find(part => part.type === type)?.value || 0);
    return Date.UTC(value("year"), value("month") - 1, value("day")) -
      9 * 60 * 60 * 1000;
  }

  function mergeCustomSummaryViews(views) {
    if (views.length === 0) {
      return null;
    }
    const rowsByJob = new Map();
    for (const view of views) {
      for (const row of view.rows || []) {
        const rows = rowsByJob.get(row.jobName) || [];
        rows.push(row);
        rowsByJob.set(row.jobName, rows);
      }
    }
    return {
      ...views[0],
      cpTierIndex: -1,
      cpTierLabel: customCpRangeLabel(),
      recordCount: views.reduce((sum, view) => sum + (Number(view.recordCount) || 0), 0),
      playerSampleCount: views.reduce((sum, view) => sum + (Number(view.playerSampleCount) || 0), 0),
      rows: [...rowsByJob.entries()].map(([jobName, rows]) =>
        mergeCustomSummaryRows(jobName, rows)),
    };
  }

  function mergeCustomSummaryRows(jobName, rows) {
    const samples = [];
    for (const row of rows) {
      const values = Array.isArray(row.dpsPercentiles) && row.dpsPercentiles.length >= 10
        ? row.dpsPercentiles
        : [row.minDps, row.p25Dps, row.medianDps, row.p75Dps, row.maxDps];
      const weight = Math.max(1, Number(row.sampleCount) || 1) / Math.max(1, values.length);
      for (const value of values) {
        if (Number(value) > 0) {
          samples.push([Number(value), weight]);
        }
      }
    }
    samples.sort((left, right) => left[0] - right[0]);
    const sampleCount = rows.reduce((sum, row) => sum + (Number(row.sampleCount) || 0), 0);
    const weeklyComparison = state.period === "Weekly"
      ? mergeWeeklyComparison(rows)
      : null;
    return {
      jobName,
      sampleCount,
      minDps: weightedQuantile(samples, 0),
      p25Dps: weightedQuantile(samples, 0.25),
      medianDps: weightedQuantile(samples, 0.5),
      p75Dps: weightedQuantile(samples, 0.75),
      maxDps: weightedQuantile(samples, 1),
      dpsPercentiles: weeklyComparison,
    };
  }

  function weightedQuantile(samples, quantile) {
    if (samples.length === 0) {
      return 0;
    }
    const total = samples.reduce((sum, item) => sum + item[1], 0);
    const target = Math.max(0, Math.min(1, quantile)) * total;
    let current = 0;
    for (const item of samples) {
      current += item[1];
      if (current >= target) {
        return item[0];
      }
    }
    return samples[samples.length - 1][0];
  }

  function mergeWeeklyComparison(rows) {
    const available = rows
      .map(row => row.dpsPercentiles)
      .filter(value => Array.isArray(value) && value.length === 3 && Number(value[2]) > 0);
    if (available.length === 0) {
      return null;
    }
    const count = available.reduce((sum, value) => sum + Number(value[2]), 0);
    return [
      available.reduce((sum, value) => sum + Number(value[0]) * Number(value[2]), 0) / count,
      available.reduce((sum, value) => sum + Number(value[1]) * Number(value[2]), 0) / count,
      count,
    ];
  }

  function mergeCustomClassViews(views) {
    const minimum = state.customCpMinK * 1000;
    const maximum = state.customCpMaxK * 1000;
    const bestByCharacter = new Map();
    for (const view of views) {
      for (const row of view.rows || []) {
        for (const player of row.players || []) {
          const combatPower = Number(player.combatPower) || 0;
          if (combatPower < minimum || combatPower > maximum) {
            continue;
          }
          const key = `${row.jobName}\u0000${Number(player.serverId) || 0}\u0000${player.name}`;
          const current = bestByCharacter.get(key);
          if (!current || Number(player.dps) > Number(current.player.dps)) {
            bestByCharacter.set(key, { jobName: row.jobName, player });
          }
        }
      }
    }
    const rows = JOB_ORDER.map(jobName => {
      const players = [...bestByCharacter.values()]
        .filter(item => item.jobName === jobName)
        .map(item => item.player)
        .sort((left, right) => Number(right.dps) - Number(left.dps))
        .slice(0, 20)
        .map((player, index) => ({ ...player, rank: index + 1 }));
      return { jobName, players };
    }).filter(row => row.players.length > 0);
    return {
      bossIndex: state.bossIndex,
      cpTierIndex: -1,
      period: state.period === "Weekly" ? "All" : state.period,
      rows,
    };
  }

  function updateSnapshot(view) {
    elements["snapshot-title"].textContent = filterDescription();
    const weeklyRange = state.period === "Weekly"
      ? parseWeeklyRange(view?.periodLabel)
      : null;
    elements["snapshot-caption"].textContent = weeklyRange
      ? `${formatWeeklyRange(weeklyRange)} · ${t("weeklyCompare")}`
      : "";
    elements["snapshot-caption"].hidden = !weeklyRange;
    elements["weekly-guide"].hidden = state.period !== "Weekly";
    elements["sample-meta"].textContent = view
      ? state.cpFilterMode === "custom"
        ? t("recordSamplesValue", {
            count: formatInteger(view.playerSampleCount),
          })
        : `${t("records")} ${formatInteger(view.recordCount)} · ${t("samples")} ${formatInteger(view.playerSampleCount)}`
      : "—";
    elements["generated-meta"].textContent = state.data
      ? `${t("updated")} ${formatDateTime(state.data.generatedAt)}`
      : "—";
  }

  function filterDescription() {
    const dungeon = currentDungeon();
    const boss = state.bossIndex === 0
      ? t("allBosses")
      : dungeon?.bossNames?.[state.bossIndex - 1] || t("allBosses");
    const cp = state.cpFilterMode === "custom"
      ? customCpRangeLabel()
      : state.cpTierIndex === 0
        ? t("allCp")
        : state.data.cpTiers.find(item => Number(item.index) === state.cpTierIndex)?.label || t("allCp");
    return `${dungeonName(dungeon)} · ${boss} · ${cp} · ${periodName(state.period)}`;
  }

  function customCpRangeLabel() {
    return `${formatInteger(state.customCpMinK)}K~${formatInteger(state.customCpMaxK)}K`;
  }

  function updateDailyUsers() {
    const view = state.data?.views?.find(item => item.dungeonKey === DAILY_USER_KEY);
    elements["daily-user-count"].textContent = view
      ? `${formatInteger(view.recordCount)}${state.locale === "ko" ? "명" : ""}`
      : "—";
  }

  function updateCacheAge() {
    if (!state.data?.generatedAt) {
      elements["cache-age"].textContent = "";
      return;
    }
    const generatedAt = Date.parse(state.data.generatedAt);
    if (!Number.isFinite(generatedAt)) {
      elements["cache-age"].textContent = "";
      return;
    }
    const ageMinutes = Math.max(0, Math.floor((Date.now() - generatedAt) / 60_000));
    elements["cache-age"].textContent = ageMinutes < 2
      ? t("agoNow")
      : ageMinutes < 60
        ? t("agoMinutes", { value: ageMinutes })
        : t("agoHours", { value: Math.floor(ageMinutes / 60) });
  }

  function applyLocale() {
    document.documentElement.lang = state.locale;
    document.title = t("title");
    elements["language-button"].textContent = state.locale === "ko" ? "EN" : "KO";
    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;
      if (COPY[state.locale][key]) {
        element.textContent = t(key);
      }
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach(element => {
      const key = element.dataset.i18nAriaLabel;
      if (COPY[state.locale][key]) {
        element.setAttribute("aria-label", t(key));
      }
    });
    syncCustomCpControls();
    renderDetailSettings();
  }

  function showState(name) {
    elements["loading-state"].hidden = name !== "loading";
    elements["error-state"].hidden = name !== "error";
    elements["empty-state"].hidden = name !== "empty";
    elements["summary-view"].hidden = name !== "summary";
    elements["class-view"].hidden = name !== "class";
  }

  function leaveClassView() {
    closeCombatDetail();
    state.mode = "summary";
    state.selectedJob = "";
  }

  function currentDungeon() {
    return state.data?.dungeons?.find(item => item.key === state.dungeonKey) || null;
  }

  function dungeonName(dungeon) {
    if (!dungeon) {
      return "";
    }
    return state.locale === "en"
      ? DUNGEON_NAMES_EN[dungeon.key] || dungeon.displayName
      : dungeon.displayName;
  }

  function jobName(job) {
    return state.locale === "en" ? JOB_NAMES_EN[job] || job : job;
  }

  function periodName(period) {
    const normalized = normalizePeriod(period);
    return normalized === "Weekly"
      ? t("thisWeek")
      : normalized === "Today"
      ? t("today")
      : normalized === "All"
        ? t("allPeriod")
        : t("recent14");
  }

  function normalizePeriod(value) {
    if (typeof value === "number") {
      return ["Today", "Recent14Days", "All"][value] || "Recent14Days";
    }
    return String(value || "Recent14Days");
  }

  function parseWeeklyRange(label) {
    const text = String(label || "");
    if (!text.startsWith(WEEKLY_LABEL_PREFIX)) {
      return null;
    }
    const [startText, endText] = text.slice(WEEKLY_LABEL_PREFIX.length).split("|");
    const start = new Date(startText);
    const end = new Date(endText);
    return Number.isFinite(start.getTime()) && Number.isFinite(end.getTime()) && end > start
      ? { start, end }
      : null;
  }

  function formatWeeklyRange(range) {
    const separator = state.locale === "ko" ? "~" : "–";
    const suffix = state.locale === "ko" ? "한국시간" : "KST";
    return `${formatKoreaShort(range.start)}${separator}${formatKoreaShort(range.end)} ${suffix}`;
  }

  function formatKoreaShort(value) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(value);
    const get = type => parts.find(part => part.type === type)?.value || "";
    return `${get("month")}.${get("day")} ${get("hour")}:${get("minute")}`;
  }

  function buildWeeklyComparisonBadge(row) {
    if (state.period !== "Weekly" ||
        !Array.isArray(row.dpsPercentiles) ||
        row.dpsPercentiles.length < 3) {
      return null;
    }
    const previousP75 = Number(row.dpsPercentiles[0]);
    const previousSamples = Math.max(0, Math.round(Number(row.dpsPercentiles[2]) || 0));
    const currentP75 = Number(row.p75Dps);
    if (!(previousP75 > 0) || !(previousSamples > 0) || !Number.isFinite(currentP75)) {
      return null;
    }
    const change = (currentP75 - previousP75) / previousP75 * 100;
    const direction = change > 0.05 ? "up" : change < -0.05 ? "down" : "flat";
    const badge = document.createElement("span");
    badge.className = `weekly-change ${direction}`;
    badge.textContent = `${direction === "up" ? "▲" : direction === "down" ? "▼" : "–"} ${Math.abs(change).toFixed(1)}%`;
    badge.title =
      `${t("weeklyTooltip")}\n` +
      `${t("top25")} ${formatDps(previousP75)} → ${formatDps(currentP75)}\n` +
      `${t("samples")} ${formatInteger(previousSamples)} → ${formatInteger(row.sampleCount)}`;
    return badge;
  }

  function cellWithRank(rank) {
    const td = document.createElement("td");
    td.className = "rank-column";
    const badge = document.createElement("span");
    badge.className = "rank-badge";
    badge.textContent = String(rank);
    td.append(badge);
    return td;
  }

  function numericCell(value, modifier = "", label = "") {
    const td = document.createElement("td");
    td.className = `numeric ${modifier}`.trim();
    td.textContent = value;
    if (label) {
      td.dataset.label = label;
    }
    return td;
  }

  function createJobIcon(job) {
    const frame = document.createElement("span");
    frame.className = "job-icon-frame";
    frame.title = jobName(job);
    const img = document.createElement("img");
    img.src = `./assets/jobs/${encodeURIComponent(job)}.png`;
    img.alt = "";
    img.loading = "lazy";
    frame.append(img);
    return frame;
  }

  function decodeParty(player) {
    if (Array.isArray(player.partyJobNames) && player.partyJobNames.length > 0) {
      return player.partyJobNames.filter(job => JOB_ORDER.includes(job));
    }
    const compact = String(player.P ?? player.compactParty ?? "");
    return [...compact].map(code => JOB_CODES[code]).filter(Boolean);
  }

  function formatCharacterName(name, serverId) {
    const clean = String(name || "").replace(/^\[TW\]\s*/i, "").trim();
    const server = serverLabel(Number(serverId));
    return server ? `${clean}[${server}]` : clean;
  }

  function serverLabel(serverId) {
    const group = Math.floor(serverId / 1000);
    const offset = serverId % 1000;
    const names = group === 1 ? SERVER_NAMES_ELYOS : group === 2 ? SERVER_NAMES_ASMODIAN : null;
    const name = names?.[offset - 1] || "";
    return [...name].slice(0, 2).join("");
  }

  function isTaiwanName(name) {
    return /^\[TW\]/i.test(String(name || "")) || /[\u3400-\u4dbf\u4e00-\u9fff]/u.test(String(name || ""));
  }

  function formatDps(value) {
    const number = Number(value) || 0;
    const units = [
      [1_000_000_000, "B"],
      [1_000_000, "M"],
      [1_000, "K"],
    ];
    for (const [size, suffix] of units) {
      if (Math.abs(number) >= size) {
        const digits = Math.abs(number) >= size * 100 ? 0 : Math.abs(number) >= size * 10 ? 1 : 2;
        return `${trimFixed(number / size, digits)}${suffix}`;
      }
    }
    return formatInteger(Math.round(number));
  }

  function formatCompact(value) {
    const number = Math.max(0, Number(value) || 0);
    if (number >= 1_000_000_000) {
      return `${(number / 1_000_000_000).toFixed(2)}B`;
    }
    if (number >= 1_000_000) {
      return `${(number / 1_000_000).toFixed(2)}M`;
    }
    if (number >= 1_000) {
      return `${(number / 1_000).toFixed(2)}K`;
    }
    return formatInteger(Math.round(number));
  }

  function formatCombatPower(value) {
    const number = Math.max(0, Number(value) || 0);
    if (number >= 1_000_000) {
      return `${trimFixed(number / 1_000_000, 2)}M`;
    }
    if (number >= 1_000) {
      return `${trimFixed(number / 1_000, 1)}K`;
    }
    return formatInteger(Math.round(number));
  }

  function trimFixed(value, digits) {
    const fixed = Number(value).toFixed(digits);
    return digits > 0 ? fixed.replace(/\.?0+$/, "") : fixed;
  }

  function formatPercent(value, digits = 0) {
    return `${trimFixed(Math.max(0, Number(value) || 0), digits)}%`;
  }

  function formatPositionPercent(value) {
    return value === null || value === undefined || Number.isNaN(Number(value))
      ? "-%"
      : formatPercent(value);
  }

  function formatInterval(value) {
    const milliseconds = Number(value);
    if (!Number.isFinite(milliseconds) || milliseconds <= 0) {
      return "—";
    }
    return milliseconds >= 1_000
      ? `${trimFixed(milliseconds / 1_000, 2)}s`
      : `${formatInteger(Math.round(milliseconds))}ms`;
  }

  function formatSeconds(value) {
    const seconds = Math.max(0, Number(value) || 0);
    return state.locale === "ko"
      ? `${trimFixed(seconds, seconds < 10 ? 1 : 0)}초`
      : `${trimFixed(seconds, seconds < 10 ? 1 : 0)}s`;
  }

  function formatInteger(value) {
    return new Intl.NumberFormat(state.locale === "ko" ? "ko-KR" : "en-US")
      .format(Number(value) || 0);
  }

  function formatDuration(seconds) {
    const total = Math.max(0, Math.round(Number(seconds) || 0));
    const minutes = Math.floor(total / 60);
    return `${String(minutes).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  }

  function formatDateTime(value) {
    const date = new Date(value);
    return new Intl.DateTimeFormat(state.locale === "ko" ? "ko-KR" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  function t(key, values = {}) {
    let text = COPY[state.locale]?.[key] || COPY.ko[key] || key;
    for (const [name, value] of Object.entries(values)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
    return text;
  }
})();
