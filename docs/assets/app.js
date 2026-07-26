(() => {
  "use strict";

  const CACHE_URLS = [
    "./data/notmeter-ranking.json.gz",
    "https://raw.githubusercontent.com/Not4You-Dev/NotMeter-Update/main/docs/data/notmeter-ranking.json.gz",
  ];
  const EXPECTED_SCHEMA = "notmeter-web-ranking-v1";
  const DAILY_USER_KEY = "__notmeter_daily_active_users__";
  const STANDARD_CP_TIER_LIMIT = 100;
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
      thisWeek: "이번 주",
      today: "오늘",
      recent14: "최근 14일",
      allPeriod: "전체 기간",
      records: "기록",
      samples: "표본",
      updated: "갱신",
      weeklyCompare: "직업 옆 ▲▼는 직전 주 동일 조건 상위 25% DPS 대비",
      weeklyTooltip: "직전 주 동일 조건 비교",
      classDps: "{job} DPS 1~20위",
      top20: "TOP 20",
      backToJobs: "직업 목록으로",
      party: "파티",
      viewDetails: "보기",
      combatDetails: "전투 상세 정보",
      totalDamage: "총 데미지",
      contribution: "기여도",
      combatPower: "전투력 CP",
      hits: "타수",
      hitRate: "적중률",
      criticalRate: "치명타율",
      skillCount: "스킬 수",
      skillBreakdown: "스킬 피해 내역",
      skill: "스킬",
      damage: "데미지",
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
      drainHealing: "흡혈",
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
      thisWeek: "This week",
      today: "Today",
      recent14: "Last 14 days",
      allPeriod: "All time",
      records: "records",
      samples: "samples",
      updated: "updated",
      weeklyCompare: "▲▼ compares top-25% DPS with the previous week under the same filters",
      weeklyTooltip: "Previous week, same filters",
      classDps: "{job} DPS — Top 20",
      top20: "TOP 20",
      backToJobs: "Back to classes",
      party: "PARTY",
      viewDetails: "View",
      combatDetails: "Combat Details",
      totalDamage: "Total damage",
      contribution: "Contribution",
      combatPower: "Combat Power",
      hits: "Hits",
      hitRate: "Hit rate",
      criticalRate: "Critical rate",
      skillCount: "Skills",
      skillBreakdown: "Skill Damage",
      skill: "Skill",
      damage: "Damage",
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
      drainHealing: "Drain",
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
    locale: localStorage.getItem("notmeter-stats-locale") ||
      (navigator.language.toLowerCase().startsWith("ko") ? "ko" : "en"),
    dungeonKey: "",
    bossIndex: 0,
    cpTierIndex: 0,
    period: "Weekly",
    selectedJob: "",
    selectedDetail: null,
    mode: "summary",
    loading: false,
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
  });

  function bindElements() {
    for (const id of [
      "daily-user-count", "language-button", "dungeon-filter", "boss-filter", "cp-filter",
      "period-filter", "refresh-button", "retry-button", "snapshot-title", "snapshot-caption",
      "sample-meta", "generated-meta", "class-heading", "class-title", "class-caption",
      "back-button", "loading-state", "error-state", "error-message", "empty-state",
      "summary-view", "summary-rows", "class-view", "class-rows", "cache-age",
      "combat-detail-modal", "detail-close", "detail-job-icon", "detail-title",
      "detail-character", "detail-duration", "detail-cp", "detail-total-damage",
      "detail-dps", "detail-share", "detail-summary-duration", "detail-hits",
      "detail-parry-rate", "detail-critical-rate", "detail-front-rate", "detail-back-rate",
      "detail-perfect-rate", "detail-double-rate", "detail-evade-rate", "detail-cp-row",
      "detail-visible-count", "detail-settings-toggle", "detail-settings-options",
      "detail-skill-rows", "detail-buffs-section", "detail-buffs", "detail-buff-count",
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
      closeCombatDetail();
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
    const detail = resolveCombatDetail(player);
    if (detail) {
      tr.className = "class-detail-row";
      tr.tabIndex = 0;
      tr.setAttribute("role", "button");
      tr.setAttribute(
        "aria-label",
        `${formatCharacterName(player.name, player.serverId)} ${t("combatDetails")}`);
      const open = () => openCombatDetail(player, detail);
      tr.addEventListener("click", open);
      tr.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      });
    }
    tr.append(cellWithRank(player.rank));

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
      badge.title = state.language === "en" ? "Taiwan server" : "대만 서버";
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
    characterCell.append(characterStack);
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
    const detailCell = document.createElement("td");
    detailCell.className = "detail-column";
    if (detail) {
      const detailLink = document.createElement("span");
      detailLink.className = "detail-link";
      detailLink.textContent = `${t("viewDetails")} ›`;
      detailCell.append(detailLink);
    }
    tr.append(detailCell);
    return tr;
  }

  function resolveCombatDetail(player) {
    const detailId = String(player.D ?? player.detailId ?? "").trim();
    if (!detailId) {
      return null;
    }
    return state.data?.classRankings?.[state.dungeonKey]?.details?.[detailId] || null;
  }

  function openCombatDetail(player, detail) {
    state.selectedDetail = { player, detail };
    renderCombatDetail();
    elements["combat-detail-modal"].hidden = false;
    document.body.classList.add("detail-open");
    elements["detail-close"].focus({ preventScroll: true });
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
    const { player, detail } = state.selectedDetail;
    const detailJob = detail.jobName || state.selectedJob;
    const durationSeconds = Math.max(0, Number(player.durationSeconds) || 60);
    const dungeon = currentDungeon();
    const bossIndex = Number(player.B ?? player.bossIndex ?? state.bossIndex);
    const bossName = bossIndex > 0
      ? dungeon?.bossNames?.[bossIndex - 1]
      : dungeon?.bossNames?.[0] || dungeonName(dungeon);

    elements["detail-job-icon"].replaceChildren(createJobIcon(detailJob));
    elements["detail-title"].textContent = bossName || t("combatDetails");
    elements["detail-character"].textContent = formatCharacterName(
      detail.name || player.name,
      Number(detail.serverId || player.serverId));
    elements["detail-duration"].textContent = formatDuration(durationSeconds);

    const combatPower = Number(detail.combatPower || player.combatPower) || 0;
    elements["detail-cp-row"].hidden = combatPower <= 0;
    elements["detail-cp"].textContent = formatInteger(combatPower);
    elements["detail-total-damage"].textContent = formatInteger(detail.totalDamage);
    elements["detail-dps"].textContent = formatCompact(Number(detail.dps) || 0);
    elements["detail-share"].textContent = formatPercent(detail.sharePercent);
    elements["detail-summary-duration"].textContent = formatDuration(durationSeconds);
    elements["detail-hits"].textContent = formatInteger(detail.hitCount);
    elements["detail-parry-rate"].textContent = formatPercent(detail.parryRate);
    elements["detail-critical-rate"].textContent = formatPercent(detail.criticalRate);
    elements["detail-front-rate"].textContent = formatPositionPercent(detail.frontAttackRate);
    elements["detail-back-rate"].textContent = formatPositionPercent(detail.backAttackRate);
    elements["detail-perfect-rate"].textContent = formatPercent(detail.perfectRate);
    elements["detail-double-rate"].textContent = formatPercent(detail.doubleDamageRate);
    elements["detail-evade-rate"].textContent = formatPercent(detail.evadeRate);
    applyDetailMetricVisibility();

    const skills = Array.isArray(detail.skills)
      ? [...detail.skills]
          .filter(skill => Number(skill.totalDamage) > 0)
          .sort((left, right) => Number(right.totalDamage) - Number(left.totalDamage))
      : [];
    const skillRows = document.createDocumentFragment();
    for (const skill of skills) {
      skillRows.append(buildDetailSkillRow(skill));
    }
    elements["detail-skill-rows"].replaceChildren(skillRows);

    const buffs = Array.isArray(detail.buffs)
      ? [...detail.buffs]
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

  function buildDetailSkillRow(skill) {
    const row = document.createElement("article");
    row.className = "detail-skill-row";
    row.title = `${String(skill.skillName || "—")}\n${formatInteger(skill.minHit)} ~ ${formatInteger(skill.maxHit)}`;

    const bar = document.createElement("span");
    bar.className = "detail-skill-bar";
    bar.style.width = `${Math.max(0, Math.min(100, Number(skill.damagePercentage) || 0))}%`;

    const icon = document.createElement("span");
    icon.className = "detail-skill-icon";
    applySkillIcon(icon, skill.skillCode, skill.rawSkillCode, 28);

    const name = document.createElement("strong");
    name.className = "detail-skill-name";
    name.textContent = String(skill.skillName || "—");

    const damage = document.createElement("strong");
    damage.className = "detail-skill-damage";
    damage.append(document.createTextNode(formatInteger(skill.totalDamage)));
    const share = document.createElement("span");
    share.textContent = ` (${formatPercent(skill.damagePercentage, 1)})`;
    damage.append(share);

    const chips = document.createElement("div");
    chips.className = "detail-skill-chips";
    const interval = Number(skill.averageUseIntervalMilliseconds);
    if (Number.isFinite(interval) && interval > 0) {
      chips.append(buildDetailChip(t("averageInterval"), `${interval.toFixed(2)}ms`, "accent"));
    }
    if (isDetailMetricVisible("specialization")) {
      chips.append(buildSpecializationChip(skill.specializationFlags));
    }
    if (isDetailMetricVisible("hits")) {
      chips.append(buildDetailChip(t("hits"), formatInteger(skill.hitCount)));
    }
    if (isDetailMetricVisible("parry")) {
      chips.append(buildDetailChip(t("parry"), formatPercent(skill.parryRate), "accent"));
    }
    if (isDetailMetricVisible("avoidance") && Number(skill.evadeCount) > 0) {
      chips.append(buildDetailChip(
        t("avoidance"),
        `${formatInteger(skill.evadeCount)} / ${formatPercent(skill.evadeRate)}`));
    }
    if (isDetailMetricVisible("multiHit")) {
      const hits = Math.max(0, Number(skill.hitCount) || 0);
      const ratio = hits > 0 ? (Number(skill.multiHitCount) || 0) / hits * 100 : 0;
      chips.append(buildDetailChip(t("multiHit"), formatPercent(ratio), "double"));
    }
    if (isDetailMetricVisible("critical")) {
      chips.append(buildDetailChip(t("critical"), formatPercent(skill.criticalRate), "critical"));
    }
    if (isDetailMetricVisible("front")) {
      chips.append(buildDetailChip(t("front"), formatPositionPercent(skill.frontAttackRate), "position"));
    }
    if (isDetailMetricVisible("back")) {
      chips.append(buildDetailChip(t("back"), formatPositionPercent(skill.backAttackRate), "position"));
    }
    if (isDetailMetricVisible("perfect")) {
      chips.append(buildDetailChip(t("perfect"), formatPercent(skill.perfectRate), "perfect"));
    }
    if (isDetailMetricVisible("double")) {
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
    if (isDetailMetricVisible("drainHealing") && Number(skill.drainHealingAmount) > 0) {
      chips.append(buildDetailChip(t("drainHealing"), formatCompact(skill.drainHealingAmount), "healing"));
    }
    if (isDetailMetricVisible("averageDamage")) {
      chips.append(buildDetailChip(t("averageDamage"), formatCompact(skill.averageDamage)));
    }

    row.append(bar, icon, name, damage, chips);
    return row;
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
    applyBuffIcon(icon, buff.code, buff.rawCode, 30);
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

  function applyBuffIcon(element, code, rawCode, size) {
    const manifest = state.iconAtlases.buff;
    if (manifest) {
      for (const candidate of [rawCode, code]) {
        const iconKey = manifest.codes?.[String(Math.abs(Number(candidate) || 0))];
        if (iconKey && Object.hasOwn(manifest.icons, iconKey)) {
          applyAtlasIcon(element, "buff", iconKey, size);
          return;
        }
      }
    }
    applySkillIcon(element, rawCode, code, size);
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
    const views = state.data.views.filter(view =>
      view.dungeonKey === state.dungeonKey &&
      Number(view.bossIndex) === state.bossIndex &&
      Number(view.cpTierIndex) === state.cpTierIndex);
    if (state.period === "Weekly") {
      return views.find(view =>
        normalizePeriod(view.period) === "All" &&
        parseWeeklyRange(view.periodLabel));
    }
    return views.find(view =>
      normalizePeriod(view.period) === state.period &&
      (state.period !== "All" || !parseWeeklyRange(view.periodLabel)));
  }

  function findClassView() {
    const classRanking = state.data.classRankings[state.dungeonKey];
    const views = classRanking?.views?.filter(view =>
      Number(view.bossIndex) === state.bossIndex &&
      Number(view.cpTierIndex) === state.cpTierIndex) || [];
    if (state.period === "Weekly") {
      return [...views].reverse().find(view => normalizePeriod(view.period) === "All");
    }
    return views.find(view => normalizePeriod(view.period) === state.period);
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
