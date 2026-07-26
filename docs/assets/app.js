(() => {
  "use strict";

  const CACHE_URLS = [
    "./data/notmeter-ranking.json.gz",
    "https://raw.githubusercontent.com/Not4You-Dev/NotMeter-Update/main/docs/data/notmeter-ranking.json.gz",
  ];
  const EXPECTED_SCHEMA = "notmeter-web-ranking-v1";
  const DAILY_USER_KEY = "__notmeter_daily_active_users__";
  const STANDARD_CP_TIER_LIMIT = 100;
  const PERIODS = ["Today", "Recent14Days", "All"];
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

  const COPY = {
    ko: {
      title: "NotMeter 던전 통계",
      subtitle: "직업별 상위 25% DPS 기준으로 정렬합니다",
      dailyUsers: "일일 사용자",
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
      top25: "상위 25%",
      median: "중앙값",
      max: "최고",
      distribution: "분포",
      details: "상세",
      character: "캐릭터",
      duration: "전투 시간",
      cacheNotice: "클라이언트와 동일한 통계 생성본을 사용합니다.",
      allBosses: "전체 보스",
      allCp: "전체 CP",
      today: "오늘",
      recent14: "최근 14일",
      allPeriod: "전체 기간",
      records: "기록",
      samples: "표본",
      updated: "갱신",
      classDps: "{job} DPS 1~20위",
      top20: "TOP 20",
      party: "파티",
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
      top25: "Top 25%",
      median: "Median",
      max: "Highest",
      distribution: "Range",
      details: "Details",
      character: "Character",
      duration: "Duration",
      cacheNotice: "Uses the same generated statistics snapshot as the client.",
      allBosses: "All bosses",
      allCp: "All CP",
      today: "Today",
      recent14: "Last 14 days",
      allPeriod: "All time",
      records: "records",
      samples: "samples",
      updated: "updated",
      classDps: "{job} DPS — Top 20",
      top20: "TOP 20",
      party: "PARTY",
      agoNow: "Updated just now",
      agoMinutes: "Updated {value}m ago",
      agoHours: "Updated {value}h ago",
      cacheInvalid: "This statistics cache format is not supported.",
      cacheUnavailable: "Please refresh again in a moment.",
    },
  };

  const state = {
    data: null,
    locale: localStorage.getItem("notmeter-stats-locale") ||
      (navigator.language.toLowerCase().startsWith("ko") ? "ko" : "en"),
    dungeonKey: "",
    bossIndex: 0,
    cpTierIndex: 0,
    period: "Recent14Days",
    selectedJob: "",
    mode: "summary",
    loading: false,
  };

  const elements = {};

  document.addEventListener("DOMContentLoaded", () => {
    bindElements();
    bindEvents();
    applyLocale();
    void loadCache();
    window.setInterval(updateCacheAge, 60_000);
  });

  function bindElements() {
    for (const id of [
      "daily-user-count", "language-button", "dungeon-filter", "boss-filter", "cp-filter",
      "period-filter", "refresh-button", "retry-button", "snapshot-title", "snapshot-caption",
      "sample-meta", "generated-meta", "class-heading", "class-title", "class-caption",
      "back-button", "loading-state", "error-state", "error-message", "empty-state",
      "summary-view", "summary-rows", "class-view", "class-rows", "cache-age",
    ]) {
      elements[id] = document.getElementById(id);
    }
  }

  function bindEvents() {
    elements["language-button"].addEventListener("click", () => {
      state.locale = state.locale === "ko" ? "en" : "ko";
      localStorage.setItem("notmeter-stats-locale", state.locale);
      applyLocale();
      populateFilters();
      render();
    });
    elements["dungeon-filter"].addEventListener("change", event => {
      state.dungeonKey = event.target.value;
      state.bossIndex = 0;
      state.cpTierIndex = 0;
      state.mode = "summary";
      state.selectedJob = "";
      populateFilters();
      render();
    });
    elements["boss-filter"].addEventListener("change", event => {
      state.bossIndex = Number(event.target.value);
      leaveClassView();
      render();
    });
    elements["cp-filter"].addEventListener("change", event => {
      state.cpTierIndex = Number(event.target.value);
      leaveClassView();
      render();
    });
    elements["period-filter"].addEventListener("change", event => {
      state.period = event.target.value;
      leaveClassView();
      render();
    });
    elements["refresh-button"].addEventListener("click", () => void loadCache(true));
    elements["retry-button"].addEventListener("click", () => void loadCache(true));
    elements["back-button"].addEventListener("click", () => {
      leaveClassView();
      render();
    });
  }

  async function loadCache(force = false) {
    if (state.loading) {
      return;
    }
    state.loading = true;
    elements["refresh-button"].disabled = true;
    showState("loading");

    try {
      const cache = await fetchRankingCache(force);
      validateCache(cache);
      const previousDungeon = state.dungeonKey;
      state.data = cache;
      state.dungeonKey = cache.dungeons.some(item => item.key === previousDungeon)
        ? previousDungeon
        : cache.dungeons[0]?.key || "";
      state.mode = "summary";
      state.selectedJob = "";
      updateDailyUsers();
      populateFilters();
      render();
    } catch (error) {
      console.error(error);
      elements["error-message"].textContent =
        error instanceof Error && error.message ? error.message : t("cacheUnavailable");
      showState("error");
    } finally {
      state.loading = false;
      elements["refresh-button"].disabled = false;
    }
  }

  async function fetchRankingCache(force) {
    const errors = [];
    for (const baseUrl of CACHE_URLS) {
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
    if (!cpTiers.some(item => Number(item.index) === state.cpTierIndex)) {
      state.cpTierIndex = 0;
    }
    replaceOptions(
      elements["cp-filter"],
      cpTiers,
      item => item.index,
      item => Number(item.index) === 0 ? t("allCp") : item.label,
      state.cpTierIndex);

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
    const jobWrap = document.createElement("div");
    jobWrap.className = "job-cell";
    jobWrap.append(createJobIcon(row.jobName));
    const name = document.createElement("span");
    name.className = "job-name";
    name.textContent = jobName(row.jobName);
    jobWrap.append(name);
    jobCell.append(jobWrap);
    tr.append(jobCell);

    tr.append(numericCell(formatInteger(row.sampleCount)));
    tr.append(numericCell(formatDps(row.p75Dps), "accent"));
    tr.append(numericCell(formatDps(row.medianDps), "median"));
    tr.append(numericCell(formatDps(row.maxDps), "max"));

    const distributionCell = document.createElement("td");
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
    const view = findClassView();
    const players = view?.rows
      ?.find(item => item.jobName === state.selectedJob)
      ?.players || [];
    const sorted = [...players]
      .sort((left, right) => Number(left.rank) - Number(right.rank))
      .slice(0, 20);

    elements["class-heading"].hidden = false;
    elements["class-title"].textContent = t("classDps", { job: jobName(state.selectedJob) });
    elements["class-caption"].textContent = filterDescription();
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
    tr.append(cellWithRank(player.rank));

    const characterCell = document.createElement("td");
    characterCell.className = "character-cell";
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
      badge.textContent = "🇹🇼 TW";
      main.append(badge);
    }
    if (Number(player.combatPower) > 0) {
      const cp = document.createElement("span");
      cp.className = "cp-badge";
      const cpIcon = document.createElement("img");
      cpIcon.src = "./assets/combat-power.png";
      cpIcon.alt = "";
      const value = document.createElement("span");
      value.textContent = formatDps(player.combatPower);
      cp.append(cpIcon, value);
      main.append(cp);
    }
    characterCell.append(main);

    const party = decodeParty(player);
    if (party.length > 0) {
      const partyLine = document.createElement("div");
      partyLine.className = "party-icons";
      const label = document.createElement("span");
      label.className = "party-label";
      label.textContent = t("party");
      partyLine.append(label);
      party.forEach(job => partyLine.append(createJobIcon(job)));
      characterCell.append(partyLine);
    }
    tr.append(characterCell);

    const dungeon = currentDungeon();
    const bossIndex = Number(player.B ?? player.bossIndex ?? state.bossIndex);
    const boss = bossIndex > 0 ? dungeon?.bossNames?.[bossIndex - 1] : "";
    const bossCell = document.createElement("td");
    bossCell.textContent = boss || (state.bossIndex > 0
      ? dungeon?.bossNames?.[state.bossIndex - 1]
      : t("allBosses"));
    tr.append(bossCell);

    tr.append(numericCell(formatDuration(player.durationSeconds)));
    tr.append(numericCell(formatInteger(Math.round(Number(player.dps) || 0)), "accent"));
    return tr;
  }

  function findSummaryView() {
    return state.data.views.find(view =>
      view.dungeonKey === state.dungeonKey &&
      Number(view.bossIndex) === state.bossIndex &&
      Number(view.cpTierIndex) === state.cpTierIndex &&
      normalizePeriod(view.period) === state.period);
  }

  function findClassView() {
    const classRanking = state.data.classRankings[state.dungeonKey];
    return classRanking?.views?.find(view =>
      Number(view.bossIndex) === state.bossIndex &&
      Number(view.cpTierIndex) === state.cpTierIndex &&
      normalizePeriod(view.period) === state.period);
  }

  function updateSnapshot(view) {
    elements["snapshot-title"].textContent = filterDescription();
    elements["sample-meta"].textContent = view
      ? `${t("records")} ${formatInteger(view.recordCount)} · ${t("samples")} ${formatInteger(view.playerSampleCount)}`
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
    const cp = state.cpTierIndex === 0
      ? t("allCp")
      : state.data.cpTiers.find(item => Number(item.index) === state.cpTierIndex)?.label || t("allCp");
    return `${dungeonName(dungeon)} · ${boss} · ${cp} · ${periodName(state.period)}`;
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
    const ageMinutes = Math.max(0, Math.floor((Date.now() - Date.parse(state.data.generatedAt)) / 60_000));
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
  }

  function showState(name) {
    elements["loading-state"].hidden = name !== "loading";
    elements["error-state"].hidden = name !== "error";
    elements["empty-state"].hidden = name !== "empty";
    elements["summary-view"].hidden = name !== "summary";
    elements["class-view"].hidden = name !== "class";
  }

  function leaveClassView() {
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
    return normalized === "Today"
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

  function cellWithRank(rank) {
    const td = document.createElement("td");
    td.className = "rank-column";
    const badge = document.createElement("span");
    badge.className = "rank-badge";
    badge.textContent = String(rank);
    td.append(badge);
    return td;
  }

  function numericCell(value, modifier = "") {
    const td = document.createElement("td");
    td.className = `numeric ${modifier}`.trim();
    td.textContent = value;
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
        return `${(number / size).toFixed(digits).replace(/\.?0+$/, "")}${suffix}`;
      }
    }
    return formatInteger(Math.round(number));
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
