(() => {
  "use strict";

  const surface = document.getElementById("stat-efficiency-surface");
  if (!surface) return;

  const API_BASE = "https://notmeter.112-168-140-142.sslip.io/formula/v1";
  const CLIPBOARD_PREFIX = "NOTMETER_STATS_V1:";
  const CLIPBOARD_SCHEMA = "notmeter-stat-efficiency-profile-v1";
  const LOCALES = ["ko", "en", "zh-TW"];
  const FALLBACK_JOBS = [
    ["검성", "검성"], ["수호성", "수호성"], ["궁성", "궁성"],
    ["살성", "살성"], ["마도성", "마도성"], ["정령성", "정령성"],
    ["치유성", "치유성"], ["호법성", "호법성"], ["권성", "권성"],
  ];
  const PROFILE_FIELDS = [
    "attack", "nakedAttack", "power", "destruction", "breakthroughParts",
    "accuracy", "pveAccuracy", "critical", "penetration", "pveAttack",
    "bossAttack", "frontAttack", "backAttack", "damageAmplificationPercent",
    "weaponDamageAmplificationPercent", "pveDamageAmplificationPercent",
    "bossDamageAmplificationPercent", "criticalDamageAmplificationPercent",
    "additionalHitAccuracyPercent", "perfectPercent", "hardHitPercent",
    "cooldownTimePercent", "combatSpeedPercent", "frontDamageAmplificationPercent",
    "backDamageAmplificationPercent",
  ];
  const TEXT = {
    ko: {
      title: "스탯 효율 계산기", subtitle: "내 캐릭터에서 무엇을 올려야 가장 강해지는지 비교합니다.",
      importTitle: "딜미터기에서 복사한 내 스탯 붙여넣기", importDescription: "처치 기록의 ‘내 스탯 복사’를 누른 뒤 아래 칸에 붙여넣으면 모든 스탯이 자동 입력됩니다.", importPlaceholder: "여기를 누르고 Ctrl+V로 붙여넣기", importWaiting: "복사한 값을 기다리고 있습니다", importSuccess: "내 스탯 {count}개를 자동 입력했습니다", importInvalid: "딜미터기에서 복사한 올바른 스탯 값이 아닙니다",
      noticeTitle: "테스트 기능 안내", notice: "이 기능은 테스트 기능이며, 신뢰 테스트가 진행전 입니다.", heroKicker: "실전 데이터 기반", heroTitle: "직업·스킬과 공격 방향에 맞는 성장 우선순위를 확인하세요", heroDescription: "주신 스탯과 PVE·보스 스탯을 함께 비교하며, 던전에서 받은 정상적인 파티 버프도 분석에 반영합니다.",
      collecting: "표본 수집 중 · 준비 중", ready: "계산 준비 완료", samples: "{count} 표본", sourceOnly: "분석 대상", deus: "잠식된 데우스 연구기지(어려움)", noiran: "노이란의 숨겨진 유산(4단계)",
      combatProfile: "전투 조건", combatProfileHelp: "직업과 비교할 대표 스킬·방향을 선택합니다.", job: "직업", skill: "대표 스킬", overall: "직업 종합", skillLevel: "스킬 레벨", direction: "공격 방향", allDirections: "종합", front: "전방", backDirection: "후방", specializations: "스킬 특성", passives: "피해 관련 패시브", passiveHelp: "검증된 패시브만 표시됩니다", noPassives: "현재 선택 가능한 패시브가 없습니다.", level: "레벨",
      attackStats: "공격 스탯", attackStatsHelp: "복사 기능을 사용하면 자동 입력됩니다.", attack: "공격력", nakedAttack: "무기 해제 공격력", power: "위력", destruction: "파괴", accuracy: "명중", pveAccuracy: "PVE 명중", critical: "치명타", penetration: "관통", breakthrough: "돌파 장비 수", pveAttack: "PVE 공격력", bossAttack: "보스 공격력", frontAttack: "전방 공격력", backAttack: "후방 공격력",
      percentStats: "증폭·판정 스탯", percentStatsHelp: "화면에 표시된 값을 그대로 사용합니다.", damageAmp: "피해 증폭", weaponAmp: "무기 피해 증폭", pveAmp: "PVE 피해 증폭", bossAmp: "보스 피해 증폭", criticalAmp: "치명타 피해 증폭", additionalHit: "다단 히트 적중", perfect: "완벽", hardHit: "강타", cooldownTime: "재시전 시간", combatSpeed: "전투 속도", frontAmp: "전방 피해 증폭", backAmp: "후방 피해 증폭",
      calculate: "효율 계산", calculating: "계산 중…", resultKicker: "직업·스킬별 분석", resultTitle: "스탯 효율 순위", waitingTitle: "표본을 수집하고 있습니다", waitingDescription: "신뢰 기준을 충족할 만큼 데이터가 쌓이면 계산 결과가 열립니다.", resultGuide: "현재 입력값을 기준으로 각 스탯을 올렸을 때의 효율입니다.", easyTitle: "간편하게 사용하는 방법", easyOne: "딜미터기 처치 기록에서 ‘내 스탯 복사’를 누릅니다.", easyTwo: "이 페이지 상단 입력칸에 붙여넣습니다.", easyThree: "대표 스킬과 공격 방향을 선택하고 계산합니다.",
      pending: "검증 전", low: "낮은 신뢰", medium: "중간 신뢰", high: "높은 신뢰", invalid: "입력값을 확인해 주세요.", unavailable: "계산 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      powerEffect: "위력 +1", destructionEffect: "파괴 +1", attackEffect: "공격력 +10", accuracyEffect: "명중 +10", pveAccuracyEffect: "PVE 명중 +10", criticalEffect: "치명타 +10", penetrationEffect: "관통 +10", damageAmplificationEffect: "피해 증폭 +1%p", weaponDamageAmplificationEffect: "무기 피해 증폭 +1%p", criticalDamageAmplificationEffect: "치명타 피해 증폭 +1%p", additionalHitAccuracyEffect: "다단 히트 적중 +1%p", perfectEffect: "완벽 +1%p", hardHitEffect: "강타 +1%p", cooldownTimeEffect: "재시전 시간 -1%p", combatSpeedEffect: "전투 속도 +1%p", pveAttackEffect: "PVE 공격력 +10", pveDamageAmplificationEffect: "PVE 피해 증폭 +1%p", bossAttackEffect: "보스 공격력 +10", bossDamageAmplificationEffect: "보스 피해 증폭 +1%p", frontAttackEffect: "전방 공격력 +10", backAttackEffect: "후방 공격력 +10", frontDamageAmplificationEffect: "전방 피해 증폭 +1%p", backDamageAmplificationEffect: "후방 피해 증폭 +1%p",
    },
    en: {
      title: "Stat Efficiency Calculator", subtitle: "Compare which upgrade makes your character stronger.", importTitle: "Paste stats copied from NotMeter", importDescription: "In Kill Records, press ‘Copy my stats’, then paste below to fill every stat automatically.", importPlaceholder: "Click here and press Ctrl+V", importWaiting: "Waiting for copied stats", importSuccess: "Filled {count} stats automatically", importInvalid: "This is not a valid stat value copied from NotMeter", noticeTitle: "Test feature", notice: "This is a test feature and reliability validation has not started yet.", heroKicker: "LIVE COMBAT DATA", heroTitle: "Find your upgrade priority for the selected class, skill, and direction", heroDescription: "Compare divine, PVE, and boss stats together. Verified party buffs received in dungeons are included in the analysis.", collecting: "Collecting samples · Coming soon", ready: "Ready to calculate", samples: "{count} samples", sourceOnly: "Analysis sources", deus: "Corrupted Deus Research Base (Hard)", noiran: "Noiran's Hidden Legacy (Stage 4)",
      combatProfile: "Combat profile", combatProfileHelp: "Choose a class, representative skill, and attack direction.", job: "Class", skill: "Representative skill", overall: "Class overall", skillLevel: "Skill level", direction: "Direction", allDirections: "Overall", front: "Front", backDirection: "Back", specializations: "Skill traits", passives: "Damage passives", passiveHelp: "Only validated passives appear", noPassives: "No passives are available yet.", level: "Level",
      attackStats: "Attack stats", attackStatsHelp: "Use copied stats to fill these automatically.", attack: "Attack", nakedAttack: "Attack without weapon", power: "Power", destruction: "Destruction", accuracy: "Accuracy", pveAccuracy: "PVE Accuracy", critical: "Critical", penetration: "Penetration", breakthrough: "Breakthrough pieces", pveAttack: "PVE Attack", bossAttack: "Boss Attack", frontAttack: "Front Attack", backAttack: "Back Attack", percentStats: "Amplification and hit stats", percentStatsHelp: "Use the exact values displayed in game.", damageAmp: "Damage Amp", weaponAmp: "Weapon Damage Amp", pveAmp: "PVE Damage Amp", bossAmp: "Boss Damage Amp", criticalAmp: "Critical Damage Amp", additionalHit: "Multi-hit Accuracy", perfect: "Perfect", hardHit: "Power Hit", cooldownTime: "Cooldown Time", combatSpeed: "Combat Speed", frontAmp: "Front Damage Amp", backAmp: "Back Damage Amp",
      calculate: "Calculate efficiency", calculating: "Calculating…", resultKicker: "CLASS AND SKILL ANALYSIS", resultTitle: "Stat efficiency ranking", waitingTitle: "Samples are being collected", waitingDescription: "Results unlock after enough reliable data is collected.", resultGuide: "Efficiency shows the gain from increasing each stat at your current values.", easyTitle: "Quick start", easyOne: "Press ‘Copy my stats’ in NotMeter Kill Records.", easyTwo: "Paste into the box at the top of this page.", easyThree: "Choose a representative skill and direction, then calculate.", pending: "Unverified", low: "Low confidence", medium: "Medium confidence", high: "High confidence", invalid: "Check the entered values.", unavailable: "Could not reach the calculator. Try again shortly.",
      powerEffect: "Power +1", destructionEffect: "Destruction +1", attackEffect: "Attack +10", accuracyEffect: "Accuracy +10", pveAccuracyEffect: "PVE Accuracy +10", criticalEffect: "Critical +10", penetrationEffect: "Penetration +10", damageAmplificationEffect: "Damage Amp +1%p", weaponDamageAmplificationEffect: "Weapon Damage Amp +1%p", criticalDamageAmplificationEffect: "Critical Damage Amp +1%p", additionalHitAccuracyEffect: "Multi-hit Accuracy +1%p", perfectEffect: "Perfect +1%p", hardHitEffect: "Power Hit +1%p", cooldownTimeEffect: "Cooldown Time -1%p", combatSpeedEffect: "Combat Speed +1%p", pveAttackEffect: "PVE Attack +10", pveDamageAmplificationEffect: "PVE Damage Amp +1%p", bossAttackEffect: "Boss Attack +10", bossDamageAmplificationEffect: "Boss Damage Amp +1%p", frontAttackEffect: "Front Attack +10", backAttackEffect: "Back Attack +10", frontDamageAmplificationEffect: "Front Damage Amp +1%p", backDamageAmplificationEffect: "Back Damage Amp +1%p",
    },
    "zh-TW": {
      title: "屬性效率計算器", subtitle: "比較哪一項提升最能強化目前角色。", importTitle: "貼上從 NotMeter 複製的角色屬性", importDescription: "在討伐紀錄按下「複製我的屬性」，再貼到下方即可自動填入所有數值。", importPlaceholder: "點擊此處並按 Ctrl+V 貼上", importWaiting: "等待貼上已複製的屬性", importSuccess: "已自動填入 {count} 項屬性", importInvalid: "這不是從 NotMeter 複製的有效屬性", noticeTitle: "測試功能說明", notice: "此功能目前為測試功能，尚未開始可信度驗證。", heroKicker: "實戰資料分析", heroTitle: "確認符合職業、技能與攻擊方向的成長優先順序", heroDescription: "同時比較主神、PVE 與首領屬性，副本中已確認的隊伍增益也會納入分析。", collecting: "正在收集樣本 · 準備中", ready: "可開始計算", samples: "{count} 筆樣本", sourceOnly: "分析對象", deus: "受侵蝕的德烏斯研究基地（困難）", noiran: "諾伊蘭的隱藏遺產（第4階段）",
      combatProfile: "戰鬥條件", combatProfileHelp: "選擇職業、代表技能與攻擊方向。", job: "職業", skill: "代表技能", overall: "職業綜合", skillLevel: "技能等級", direction: "攻擊方向", allDirections: "綜合", front: "正面", backDirection: "背面", specializations: "技能特性", passives: "傷害相關被動", passiveHelp: "只顯示已驗證項目", noPassives: "目前沒有可選被動技能。", level: "等級",
      attackStats: "攻擊屬性", attackStatsHelp: "使用複製功能即可自動填入。", attack: "攻擊力", nakedAttack: "卸下武器攻擊力", power: "威力", destruction: "破壞", accuracy: "命中", pveAccuracy: "PVE 命中", critical: "暴擊", penetration: "貫穿", breakthrough: "突破裝備數", pveAttack: "PVE 攻擊力", bossAttack: "首領攻擊力", frontAttack: "正面攻擊力", backAttack: "背面攻擊力", percentStats: "增幅與判定屬性", percentStatsHelp: "使用遊戲畫面顯示的原始數值。", damageAmp: "傷害增幅", weaponAmp: "武器傷害增幅", pveAmp: "PVE 傷害增幅", bossAmp: "首領傷害增幅", criticalAmp: "暴擊傷害增幅", additionalHit: "多段命中", perfect: "完美", hardHit: "強擊", cooldownTime: "再使用時間", combatSpeed: "戰鬥速度", frontAmp: "正面傷害增幅", backAmp: "背面傷害增幅",
      calculate: "計算效率", calculating: "計算中…", resultKicker: "職業與技能分析", resultTitle: "屬性效率排名", waitingTitle: "正在收集樣本", waitingDescription: "累積足夠且可靠的資料後將開放結果。", resultGuide: "依目前輸入值顯示提升各項屬性時的效率。", easyTitle: "快速使用方法", easyOne: "在 NotMeter 討伐紀錄按下「複製我的屬性」。", easyTwo: "貼到本頁上方輸入框。", easyThree: "選擇代表技能與攻擊方向後進行計算。", pending: "尚未驗證", low: "低可信度", medium: "中可信度", high: "高可信度", invalid: "請確認輸入值。", unavailable: "無法連線至計算服務，請稍後再試。",
      powerEffect: "威力 +1", destructionEffect: "破壞 +1", attackEffect: "攻擊力 +10", accuracyEffect: "命中 +10", pveAccuracyEffect: "PVE 命中 +10", criticalEffect: "暴擊 +10", penetrationEffect: "貫穿 +10", damageAmplificationEffect: "傷害增幅 +1%p", weaponDamageAmplificationEffect: "武器傷害增幅 +1%p", criticalDamageAmplificationEffect: "暴擊傷害增幅 +1%p", additionalHitAccuracyEffect: "多段命中 +1%p", perfectEffect: "完美 +1%p", hardHitEffect: "強擊 +1%p", cooldownTimeEffect: "再使用時間 -1%p", combatSpeedEffect: "戰鬥速度 +1%p", pveAttackEffect: "PVE 攻擊力 +10", pveDamageAmplificationEffect: "PVE 傷害增幅 +1%p", bossAttackEffect: "首領攻擊力 +10", bossDamageAmplificationEffect: "首領傷害增幅 +1%p", frontAttackEffect: "正面攻擊力 +10", backAttackEffect: "背面攻擊力 +10", frontDamageAmplificationEffect: "正面傷害增幅 +1%p", backDamageAmplificationEffect: "背面傷害增幅 +1%p",
    },
  };
  const EFFECT_KEYS = {
    power: "powerEffect", destruction: "destructionEffect", attack: "attackEffect",
    accuracy: "accuracyEffect", pveAccuracy: "pveAccuracyEffect", critical: "criticalEffect", penetration: "penetrationEffect",
    damageAmplification: "damageAmplificationEffect", weaponDamageAmplification: "weaponDamageAmplificationEffect",
    criticalDamageAmplification: "criticalDamageAmplificationEffect", additionalHitAccuracy: "additionalHitAccuracyEffect", perfect: "perfectEffect", hardHit: "hardHitEffect", cooldownTime: "cooldownTimeEffect", combatSpeed: "combatSpeedEffect",
    pveAttack: "pveAttackEffect", pveDamageAmplification: "pveDamageAmplificationEffect", bossAttack: "bossAttackEffect", bossDamageAmplification: "bossDamageAmplificationEffect", frontAttack: "frontAttackEffect", backAttack: "backAttackEffect", frontDamageAmplification: "frontDamageAmplificationEffect", backDamageAmplification: "backDamageAmplificationEffect",
  };

  const state = { locale: resolveLocale(), catalog: null, catalogLoad: null, initialized: false, pendingJobName: "" };
  const form = document.getElementById("efficiency-form");
  const jobSelect = document.getElementById("job");
  const skillSelect = document.getElementById("skill");
  const specializationField = document.getElementById("specialization-field");
  const passiveOptions = document.getElementById("passive-options");
  const submitButton = form.querySelector("button[type=submit]");
  const importInput = document.getElementById("stat-import");
  const importStatus = document.getElementById("stat-import-status");

  function resolveLocale() {
    const documentLocale = document.documentElement.lang;
    if (LOCALES.includes(documentLocale)) return documentLocale;
    const stored = localStorage.getItem("notmeter-stats-locale");
    if (LOCALES.includes(stored)) return stored;
    const browser = String(navigator.language || "").toLowerCase();
    return browser.startsWith("zh") ? "zh-TW" : browser.startsWith("en") ? "en" : "ko";
  }

  function t(key, values = {}) {
    let text = TEXT[state.locale]?.[key] || TEXT.ko[key] || key;
    for (const [name, value] of Object.entries(values)) text = text.replaceAll(`{${name}}`, String(value));
    return text;
  }

  function applyLocale() {
    surface.querySelectorAll("[data-stat-i18n]").forEach(element => {
      element.textContent = t(element.dataset.statI18n);
    });
    surface.querySelectorAll("[data-stat-i18n-placeholder]").forEach(element => {
      element.setAttribute("placeholder", t(element.dataset.statI18nPlaceholder));
    });
    updateSelectFixedLabels();
    renderCatalog();
  }

  function updateSelectFixedLabels() {
    if (skillSelect.options.length) skillSelect.options[0].textContent = t("overall");
    const direction = document.getElementById("direction");
    direction.options[0].textContent = t("allDirections");
    direction.options[1].textContent = t("front");
    direction.options[2].textContent = t("backDirection");
  }

  function jobs() {
    return state.catalog?.jobs?.length
      ? state.catalog.jobs.map(job => [job.key, job.name])
      : FALLBACK_JOBS;
  }

  function renderCatalog() {
    const requestedJob = state.pendingJobName || jobSelect.value;
    jobSelect.replaceChildren(...jobs().map(([value, label]) => new Option(label, value)));
    const match = [...jobSelect.options].find(option =>
      option.value === requestedJob || option.textContent === requestedJob);
    if (match) jobSelect.value = match.value;
    if (state.pendingJobName && match) state.pendingJobName = "";
    renderSkillOptions();
  }

  function currentJob() {
    return state.catalog?.jobs?.find(job => job.key === jobSelect.value || job.name === jobSelect.value);
  }

  function renderSkillOptions() {
    const previousSkill = skillSelect.value;
    const options = [new Option(t("overall"), "0")];
    for (const skill of currentJob()?.skills || []) {
      options.push(new Option(`${skill.name} · ${formatCount(skill.sampleCount)}`, String(skill.code)));
    }
    skillSelect.replaceChildren(...options);
    if ([...skillSelect.options].some(option => option.value === previousSkill)) skillSelect.value = previousSkill;
    const hasSkill = Number(skillSelect.value) > 0;
    specializationField.disabled = !hasSkill;
    document.getElementById("skill-level").disabled = !hasSkill;
    renderPassiveOptions();
  }

  function renderPassiveOptions() {
    const passives = currentJob()?.passives || [];
    if (!passives.length) {
      const empty = document.createElement("p");
      empty.className = "passive-empty";
      empty.textContent = t("noPassives");
      passiveOptions.replaceChildren(empty);
      return;
    }
    passiveOptions.replaceChildren(...passives.map(passive => {
      const label = document.createElement("label"); label.className = "passive-option";
      const checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.dataset.passiveCode = String(passive.code);
      const name = document.createElement("span"); name.textContent = passive.name;
      const level = document.createElement("input"); level.type = "number"; level.min = "1"; level.max = String(passive.maximumLevel); level.value = "1"; level.setAttribute("aria-label", `${passive.name} ${t("level")}`);
      label.append(checkbox, name, level);
      return label;
    }));
  }

  function formatCount(value) { return new Intl.NumberFormat(state.locale).format(Number(value) || 0); }

  function setModelState(status, sampleCount) {
    const ready = status === "ready";
    document.getElementById("model-state").classList.toggle("ready", ready);
    document.getElementById("model-state-title").textContent = t(ready ? "ready" : "collecting");
    document.getElementById("model-sample-count").textContent = t("samples", { count: formatCount(sampleCount) });
  }

  function loadCatalog() {
    if (state.catalogLoad) return state.catalogLoad;
    state.catalogLoad = fetch(`${API_BASE}/catalog`, { headers: { Accept: "application/json" } })
      .then(response => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then(catalog => {
        state.catalog = catalog;
        setModelState(catalog.status, catalog.sampleCount);
        renderCatalog();
      })
      .catch(() => {
        state.catalog = null;
        setModelState("collecting", 0);
        renderCatalog();
      });
    return state.catalogLoad;
  }

  function decodeClipboardProfile(text) {
    const trimmed = String(text || "").trim();
    let json = trimmed;
    if (trimmed.startsWith(CLIPBOARD_PREFIX)) {
      const encoded = trimmed.slice(CLIPBOARD_PREFIX.length);
      const bytes = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
      json = new TextDecoder().decode(bytes);
    }
    const profile = JSON.parse(json);
    if (!profile || profile.schema !== CLIPBOARD_SCHEMA || profile.version !== 1 ||
        typeof profile.jobName !== "string" || !profile.jobName.trim()) {
      throw new Error("invalid profile");
    }
    for (const field of PROFILE_FIELDS) {
      if (!Number.isFinite(Number(profile[field]))) throw new Error(`invalid ${field}`);
    }
    return profile;
  }

  function displayNumber(value) {
    const number = Number(value);
    return Number.isInteger(number) ? String(number) : String(Math.round(number * 100) / 100);
  }

  function applyClipboardProfile(text) {
    try {
      const profile = decodeClipboardProfile(text);
      state.pendingJobName = profile.jobName.trim();
      renderCatalog();
      let filled = 0;
      for (const field of PROFILE_FIELDS) {
        const input = form.elements.namedItem(field);
        if (!(input instanceof HTMLInputElement)) continue;
        input.value = displayNumber(profile[field]);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        filled++;
      }
      importInput.value = "";
      importStatus.className = "stat-import-status success";
      importStatus.textContent = t("importSuccess", { count: filled });
      form.classList.add("stats-imported");
      window.setTimeout(() => form.classList.remove("stats-imported"), 900);
      return true;
    } catch {
      importStatus.className = "stat-import-status error";
      importStatus.textContent = t("importInvalid");
      return false;
    }
  }

  function number(formData, key) {
    const value = Number(formData.get(key));
    return Number.isFinite(value) ? value : 0;
  }

  function requestPayload() {
    const data = new FormData(form);
    let specializationMask = 0;
    specializationField.querySelectorAll("input:checked").forEach(input => { specializationMask |= Number(input.value); });
    const passives = [...passiveOptions.querySelectorAll(".passive-option")].flatMap(option => {
      const checkbox = option.querySelector("input[type=checkbox]");
      if (!checkbox.checked) return [];
      return [{ code: Number(checkbox.dataset.passiveCode), level: Number(option.querySelector("input[type=number]").value) || 1 }];
    });
    return {
      jobName: String(data.get("jobName") || ""), targetType: "boss", direction: String(data.get("direction") || "none"),
      attack: number(data, "attack"), nakedAttack: number(data, "nakedAttack"), power: number(data, "power"), destruction: number(data, "destruction"), breakthroughParts: number(data, "breakthroughParts"),
      accuracy: number(data, "accuracy"), pveAccuracy: number(data, "pveAccuracy"), critical: number(data, "critical"), penetration: number(data, "penetration"), pveAttack: number(data, "pveAttack"), bossAttack: number(data, "bossAttack"), frontAttack: number(data, "frontAttack"), backAttack: number(data, "backAttack"),
      damageAmplificationPercent: number(data, "damageAmplificationPercent"), weaponDamageAmplificationPercent: number(data, "weaponDamageAmplificationPercent"), pveDamageAmplificationPercent: number(data, "pveDamageAmplificationPercent"), bossDamageAmplificationPercent: number(data, "bossDamageAmplificationPercent"), criticalDamageAmplificationPercent: number(data, "criticalDamageAmplificationPercent"), additionalHitAccuracyPercent: number(data, "additionalHitAccuracyPercent"), perfectPercent: number(data, "perfectPercent"), hardHitPercent: number(data, "hardHitPercent"), cooldownTimePercent: number(data, "cooldownTimePercent"), combatSpeedPercent: number(data, "combatSpeedPercent"), frontDamageAmplificationPercent: number(data, "frontDamageAmplificationPercent"), backDamageAmplificationPercent: number(data, "backDamageAmplificationPercent"),
      skillCode: number(data, "skillCode"), skillLevel: number(data, "skillLevel"), specializationMask, passives,
    };
  }

  function showCollecting(result) {
    setModelState("collecting", result?.sampleCount || state.catalog?.sampleCount || 0);
    document.getElementById("result-empty").hidden = false;
    document.getElementById("result-list").hidden = true;
    document.getElementById("confidence").className = "confidence pending";
    document.getElementById("confidence").textContent = t("pending");
    document.getElementById("formula-version").textContent = result?.formulaVersion || "—";
  }

  function renderResults(result) {
    if (result.status !== "ready") { showCollecting(result); return; }
    setModelState("ready", result.sampleCount);
    const list = document.getElementById("result-list");
    list.replaceChildren(...result.effects.map((effect, index) => {
      const row = document.createElement("div"); row.className = "result-row";
      const rank = document.createElement("span"); rank.className = "result-rank"; rank.textContent = String(index + 1);
      const name = document.createElement("span"); name.className = "result-name"; name.textContent = t(EFFECT_KEYS[effect.key] || effect.key);
      const gain = document.createElement("strong"); gain.className = "result-gain"; gain.textContent = `+${Number(effect.gainPercent).toFixed(4)}%`;
      row.append(rank, name, gain);
      return row;
    }));
    document.getElementById("result-empty").hidden = true;
    list.hidden = false;
    const confidence = document.getElementById("confidence");
    confidence.className = `confidence ${result.confidence}`;
    confidence.textContent = t(result.confidence);
    document.getElementById("formula-version").textContent = result.formulaVersion || "—";
  }

  async function submit(event) {
    event.preventDefault();
    const error = document.getElementById("form-error");
    error.hidden = true;
    if (!form.reportValidity()) return;
    submitButton.disabled = true;
    submitButton.textContent = t("calculating");
    try {
      const response = await fetch(`${API_BASE}/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(requestPayload()),
      });
      const result = await response.json();
      if (!response.ok || result.status === "invalid") throw new Error(t("invalid"));
      renderResults(result);
    } catch (failure) {
      error.textContent = failure instanceof Error && failure.message ? failure.message : t("unavailable");
      if (!error.textContent || /^\d+$/.test(error.textContent)) error.textContent = t("unavailable");
      error.hidden = false;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = t("calculate");
    }
  }

  function bind() {
    if (state.initialized) return;
    state.initialized = true;
    jobSelect.addEventListener("change", renderSkillOptions);
    skillSelect.addEventListener("change", renderSkillOptions);
    form.addEventListener("submit", submit);
    surface.addEventListener("paste", event => {
      const text = event.clipboardData?.getData("text/plain") || "";
      if (!text.trim().startsWith(CLIPBOARD_PREFIX) && event.target !== importInput) return;
      event.preventDefault();
      applyClipboardProfile(text);
    });
    importInput.addEventListener("input", () => {
      const value = importInput.value.trim();
      if (value.startsWith(CLIPBOARD_PREFIX) || value.startsWith("{")) applyClipboardProfile(value);
    });
    showCollecting();
  }

  function activate() {
    bind();
    applyLocale();
    void loadCatalog();
    window.setTimeout(() => importInput.focus({ preventScroll: true }), 0);
  }

  function setLocale(locale) {
    state.locale = LOCALES.includes(locale) ? locale : "ko";
    if (state.initialized) applyLocale();
  }

  window.NotMeterStatEfficiency = { activate, setLocale, applyClipboardProfile };
})();
