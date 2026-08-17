(() => {
  "use strict";

  const API_BASE = "https://notmeter.112-168-140-142.sslip.io/formula/v1";
  const LOCALES = ["ko", "en", "zh-TW"];
  const FALLBACK_JOBS = [
    ["검성", "검성"], ["수호성", "수호성"], ["궁성", "궁성"],
    ["살성", "살성"], ["마도성", "마도성"], ["정령성", "정령성"],
    ["치유성", "치유성"], ["호법성", "호법성"], ["권성", "권성"],
  ];
  const TEXT = {
    ko: {
      title: "스탯 효율 계산기", subtitle: "최상위 던전 실전 표본으로 검증하는 직업·스킬별 효율",
      back: "통계로 돌아가기", noticeTitle: "테스트 기능 안내", notice: "이 기능은 테스트 기능이며, 신뢰 테스트가 진행전 입니다.",
      heroTitle: "내 캐릭터에서 무엇을 올려야 가장 강해지는지 확인하세요", heroDescription: "주신 스탯, PVE·보스 스탯, 공격 방향, 스킬 레벨·특성·패시브를 같은 조건의 실전 피해 표본과 비교합니다.",
      collecting: "표본 수집 중 · 준비 중", ready: "계산 모델 준비됨", samples: "{count} 표본", sourceOnly: "수식 학습 대상",
      deus: "잠식된 데우스 연구기지(어려움)", noiran: "노이란의 숨겨진 유산(4단계)", combatProfile: "전투 조건", combatProfileHelp: "직업과 비교할 대표 스킬·방향을 선택합니다.",
      job: "직업", skill: "대표 스킬", overall: "직업 종합", skillLevel: "스킬 레벨", direction: "공격 방향", allDirections: "종합", front: "전방", backDirection: "후방", specializations: "스킬 특성",
      passives: "피해 관련 패시브", passiveHelp: "검증된 패시브만 표시됩니다", noPassives: "현재 선택할 수 있는 검증된 패시브가 없습니다.", level: "레벨",
	  attackStats: "공격 스탯", attackStatsHelp: "게임의 스탯 정보에 표시된 값을 그대로 입력합니다.", attack: "공격력", nakedAttack: "무기 해제 공격력", power: "위력", destruction: "파괴", accuracy: "명중", pveAccuracy: "PVE 명중", critical: "치명타", penetration: "관통", breakthrough: "돌파 장비 수", pveAttack: "PVE 공격력", bossAttack: "보스 공격력", frontAttack: "전방 공격력", backAttack: "후방 공격력",
	  percentStats: "증폭·판정 스탯", percentStatsHelp: "% 기호 없이 화면에 보이는 숫자를 그대로 입력합니다. 재시전 시간은 -37.2처럼 음수로 입력합니다.", damageAmp: "피해 증폭", weaponAmp: "무기 피해 증폭", pveAmp: "PVE 피해 증폭", bossAmp: "보스 피해 증폭", criticalAmp: "치명타 피해 증폭", additionalHit: "다단 히트 적중", perfect: "완벽", hardHit: "강타", cooldownTime: "재시전 시간", combatSpeed: "전투 속도", frontAmp: "전방 피해 증폭", backAmp: "후방 피해 증폭",
      calculate: "VPS에서 효율 계산", calculating: "계산 중…", resultTitle: "스탯 효율 순위", waitingTitle: "표본을 수집하고 있습니다", waitingDescription: "신뢰 기준을 충족한 서버 모델이 준비되면 계산 결과가 열립니다.", formulaPrivate: "계산식·계수는 VPS에서만 처리됩니다.",
	  advertisement: "광고", advertisementAria: "광고", sponsorOpenAria: "광고 페이지 열기", privacyPolicy: "개인정보처리방침", advertisingNotice: "Google AdSense 광고를 사용합니다.",
      qualityTitle: "오염 방지 기준", qualityOne: "전체 전투 스탯 패킷이 확인된 표본만 사용", qualityTwo: "스킬 레벨·특성·패시브 구성이 확정된 표본만 사용", qualityThree: "외부 출처·미확인 버프가 섞인 전투는 자동 제외", qualityFour: "두 최상위 던전의 검증된 보스 코드만 수집",
      pending: "검증 전", low: "낮은 신뢰", medium: "중간 신뢰", high: "높은 신뢰", invalid: "입력값을 확인해 주세요.", unavailable: "VPS 계산 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.",
	  powerEffect: "위력 +1", destructionEffect: "파괴 +1", attackEffect: "공격력 +10", accuracyEffect: "명중 +10", pveAccuracyEffect: "PVE 명중 +10", criticalEffect: "치명타 +10", penetrationEffect: "관통 +10", damageAmplificationEffect: "피해 증폭 +1%p", weaponDamageAmplificationEffect: "무기 피해 증폭 +1%p", criticalDamageAmplificationEffect: "치명타 피해 증폭 +1%p", additionalHitAccuracyEffect: "다단 히트 적중 +1%p", perfectEffect: "완벽 +1%p", hardHitEffect: "강타 +1%p", cooldownTimeEffect: "재시전 시간 -1%p", combatSpeedEffect: "전투 속도 +1%p", pveAttackEffect: "PVE 공격력 +10", pveDamageAmplificationEffect: "PVE 피해 증폭 +1%p", bossAttackEffect: "보스 공격력 +10", bossDamageAmplificationEffect: "보스 피해 증폭 +1%p", frontAttackEffect: "전방 공격력 +10", backAttackEffect: "후방 공격력 +10", frontDamageAmplificationEffect: "전방 피해 증폭 +1%p", backDamageAmplificationEffect: "후방 피해 증폭 +1%p",
    },
    en: {
      title: "Stat Efficiency Calculator", subtitle: "Class and skill efficiency verified with endgame dungeon samples", back: "Back to statistics",
      noticeTitle: "Test feature", notice: "This is a test feature and reliability validation has not started yet.", heroTitle: "See which upgrade makes your character stronger", heroDescription: "Compare divine stats, PVE and boss stats, direction, skill level, traits, and passives against equivalent live combat samples.",
      collecting: "Collecting samples · Coming soon", ready: "Calculation model ready", samples: "{count} samples", sourceOnly: "Training sources", deus: "Corrupted Deus Research Base (Hard)", noiran: "Noiran's Hidden Legacy (Stage 4)",
      combatProfile: "Combat profile", combatProfileHelp: "Choose a class, representative skill, and attack direction.", job: "Class", skill: "Representative skill", overall: "Class overall", skillLevel: "Skill level", direction: "Direction", allDirections: "Overall", front: "Front", backDirection: "Back", specializations: "Skill traits", passives: "Damage passives", passiveHelp: "Only validated passives appear", noPassives: "No validated passives are available.", level: "Level",
	  attackStats: "Attack stats", attackStatsHelp: "Enter the values shown in the in-game stat panel.", attack: "Attack", nakedAttack: "Attack without weapon", power: "Power", destruction: "Destruction", accuracy: "Accuracy", pveAccuracy: "PVE Accuracy", critical: "Critical", penetration: "Penetration", breakthrough: "Breakthrough pieces", pveAttack: "PVE Attack", bossAttack: "Boss Attack", frontAttack: "Front Attack", backAttack: "Back Attack",
	  percentStats: "Amplification and hit stats", percentStatsHelp: "Enter displayed values without the percent sign. Enter cooldown time as a negative value, such as -37.2.", damageAmp: "Damage Amp", weaponAmp: "Weapon Damage Amp", pveAmp: "PVE Damage Amp", bossAmp: "Boss Damage Amp", criticalAmp: "Critical Damage Amp", additionalHit: "Multi-hit Accuracy", perfect: "Perfect", hardHit: "Power Hit", cooldownTime: "Cooldown Time", combatSpeed: "Combat Speed", frontAmp: "Front Damage Amp", backAmp: "Back Damage Amp",
      calculate: "Calculate on VPS", calculating: "Calculating…", resultTitle: "Stat efficiency ranking", waitingTitle: "Samples are being collected", waitingDescription: "Results unlock after the server model meets its reliability threshold.", formulaPrivate: "Formula and coefficients are processed only on the VPS.", qualityTitle: "Contamination safeguards", qualityOne: "Only samples with a complete combat-stat packet", qualityTwo: "Skill level, traits, and passive loadout must be confirmed", qualityThree: "External or unknown-source buffs are excluded", qualityFour: "Only verified bosses from the two endgame dungeons",
	  advertisement: "Ad", advertisementAria: "Advertisement", sponsorOpenAria: "Open advertisement page", privacyPolicy: "Privacy Policy", advertisingNotice: "This site uses Google AdSense advertising.",
      pending: "Unverified", low: "Low confidence", medium: "Medium confidence", high: "High confidence", invalid: "Check the entered values.", unavailable: "Could not reach the VPS calculator. Try again shortly.",
	  powerEffect: "Power +1", destructionEffect: "Destruction +1", attackEffect: "Attack +10", accuracyEffect: "Accuracy +10", pveAccuracyEffect: "PVE Accuracy +10", criticalEffect: "Critical +10", penetrationEffect: "Penetration +10", damageAmplificationEffect: "Damage Amp +1%p", weaponDamageAmplificationEffect: "Weapon Damage Amp +1%p", criticalDamageAmplificationEffect: "Critical Damage Amp +1%p", additionalHitAccuracyEffect: "Multi-hit Accuracy +1%p", perfectEffect: "Perfect +1%p", hardHitEffect: "Power Hit +1%p", cooldownTimeEffect: "Cooldown Time -1%p", combatSpeedEffect: "Combat Speed +1%p", pveAttackEffect: "PVE Attack +10", pveDamageAmplificationEffect: "PVE Damage Amp +1%p", bossAttackEffect: "Boss Attack +10", bossDamageAmplificationEffect: "Boss Damage Amp +1%p", frontAttackEffect: "Front Attack +10", backAttackEffect: "Back Attack +10", frontDamageAmplificationEffect: "Front Damage Amp +1%p", backDamageAmplificationEffect: "Back Damage Amp +1%p",
    },
    "zh-TW": {
      title: "屬性效率計算器", subtitle: "以頂級副本實戰樣本驗證職業與技能效率", back: "返回統計", noticeTitle: "測試功能說明", notice: "此功能目前為測試功能，尚未開始可信度驗證。",
      heroTitle: "確認哪一項提升最能強化角色", heroDescription: "以相同條件的實戰傷害樣本比較主神屬性、PVE與首領屬性、方向、技能等級、特性及被動技能。", collecting: "正在收集樣本 · 準備中", ready: "計算模型已就緒", samples: "{count} 筆樣本", sourceOnly: "公式學習對象", deus: "受侵蝕的德烏斯研究基地（困難）", noiran: "諾伊蘭的隱藏遺產（第4階段）",
      combatProfile: "戰鬥條件", combatProfileHelp: "選擇職業、代表技能與攻擊方向。", job: "職業", skill: "代表技能", overall: "職業綜合", skillLevel: "技能等級", direction: "攻擊方向", allDirections: "綜合", front: "正面", backDirection: "背面", specializations: "技能特性", passives: "傷害相關被動", passiveHelp: "只顯示已驗證項目", noPassives: "目前沒有可選擇的已驗證被動技能。", level: "等級",
	  attackStats: "攻擊屬性", attackStatsHelp: "請輸入遊戲屬性資訊中顯示的數值。", attack: "攻擊力", nakedAttack: "卸下武器攻擊力", power: "威力", destruction: "破壞", accuracy: "命中", pveAccuracy: "PVE 命中", critical: "暴擊", penetration: "貫穿", breakthrough: "突破裝備數", pveAttack: "PVE 攻擊力", bossAttack: "首領攻擊力", frontAttack: "正面攻擊力", backAttack: "背面攻擊力",
	  percentStats: "增幅與判定屬性", percentStatsHelp: "不輸入百分比符號。再使用時間請依畫面輸入負數，例如 -37.2。", damageAmp: "傷害增幅", weaponAmp: "武器傷害增幅", pveAmp: "PVE 傷害增幅", bossAmp: "首領傷害增幅", criticalAmp: "暴擊傷害增幅", additionalHit: "多段命中", perfect: "完美", hardHit: "強擊", cooldownTime: "再使用時間", combatSpeed: "戰鬥速度", frontAmp: "正面傷害增幅", backAmp: "背面傷害增幅",
      calculate: "在 VPS 計算效率", calculating: "計算中…", resultTitle: "屬性效率排名", waitingTitle: "正在收集樣本", waitingDescription: "伺服器模型達到可信門檻後才會開放結果。", formulaPrivate: "公式與係數僅在 VPS 處理。", qualityTitle: "防止污染標準", qualityOne: "僅使用完整戰鬥屬性封包樣本", qualityTwo: "技能等級、特性與被動配置必須確認", qualityThree: "自動排除外部或來源不明增益", qualityFour: "只收集兩個頂級副本中已驗證的首領代碼", pending: "尚未驗證", low: "低可信度", medium: "中可信度", high: "高可信度", invalid: "請確認輸入值。", unavailable: "無法連線至 VPS 計算伺服器，請稍後再試。",
	  advertisement: "廣告", advertisementAria: "廣告", sponsorOpenAria: "開啟廣告頁面", privacyPolicy: "隱私權政策", advertisingNotice: "本網站使用 Google AdSense 廣告。",
	  powerEffect: "威力 +1", destructionEffect: "破壞 +1", attackEffect: "攻擊力 +10", accuracyEffect: "命中 +10", pveAccuracyEffect: "PVE 命中 +10", criticalEffect: "暴擊 +10", penetrationEffect: "貫穿 +10", damageAmplificationEffect: "傷害增幅 +1%p", weaponDamageAmplificationEffect: "武器傷害增幅 +1%p", criticalDamageAmplificationEffect: "暴擊傷害增幅 +1%p", additionalHitAccuracyEffect: "多段命中 +1%p", perfectEffect: "完美 +1%p", hardHitEffect: "強擊 +1%p", cooldownTimeEffect: "再使用時間 -1%p", combatSpeedEffect: "戰鬥速度 +1%p", pveAttackEffect: "PVE 攻擊力 +10", pveDamageAmplificationEffect: "PVE 傷害增幅 +1%p", bossAttackEffect: "首領攻擊力 +10", bossDamageAmplificationEffect: "首領傷害增幅 +1%p", frontAttackEffect: "正面攻擊力 +10", backAttackEffect: "背面攻擊力 +10", frontDamageAmplificationEffect: "正面傷害增幅 +1%p", backDamageAmplificationEffect: "背面傷害增幅 +1%p",
    },
  };
  const EFFECT_KEYS = {
    power: "powerEffect", destruction: "destructionEffect", attack: "attackEffect",
	accuracy: "accuracyEffect", pveAccuracy: "pveAccuracyEffect", critical: "criticalEffect", penetration: "penetrationEffect",
    damageAmplification: "damageAmplificationEffect", weaponDamageAmplification: "weaponDamageAmplificationEffect",
	criticalDamageAmplification: "criticalDamageAmplificationEffect", additionalHitAccuracy: "additionalHitAccuracyEffect", perfect: "perfectEffect", hardHit: "hardHitEffect", cooldownTime: "cooldownTimeEffect", combatSpeed: "combatSpeedEffect",
    pveAttack: "pveAttackEffect", pveDamageAmplification: "pveDamageAmplificationEffect", bossAttack: "bossAttackEffect",
	bossDamageAmplification: "bossDamageAmplificationEffect", frontAttack: "frontAttackEffect", backAttack: "backAttackEffect", frontDamageAmplification: "frontDamageAmplificationEffect",
    backDamageAmplification: "backDamageAmplificationEffect",
  };
  const state = { locale: resolveLocale(), catalog: null };
  const form = document.getElementById("efficiency-form");
  const jobSelect = document.getElementById("job");
  const skillSelect = document.getElementById("skill");
  const specializationField = document.getElementById("specialization-field");
  const passiveOptions = document.getElementById("passive-options");
  const submitButton = form.querySelector("button[type=submit]");

  function resolveLocale() {
    const stored = localStorage.getItem("notmeter-stats-locale");
    if (LOCALES.includes(stored)) return stored;
    const browser = String(navigator.language || "").toLowerCase();
    return browser.startsWith("zh") ? "zh-TW" : browser.startsWith("en") ? "en" : "ko";
  }

  function t(key) { return TEXT[state.locale]?.[key] || TEXT.ko[key] || key; }
  function applyLocale() {
    document.documentElement.lang = state.locale;
    document.title = `${t("title")} · NotMeter`;
    document.querySelectorAll("[data-i18n]").forEach(element => {
      element.textContent = t(element.dataset.i18n);
    });
	document.querySelectorAll("[data-i18n-aria-label]").forEach(element => {
	  element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
	});
    document.getElementById("language-button").textContent = state.locale === "ko" ? "EN" : state.locale === "en" ? "繁中" : "한국어";
    updateSelectFixedLabels();
    renderCatalog();
  }

  function updateSelectFixedLabels() {
    skillSelect.options[0].textContent = t("overall");
    const direction = document.getElementById("direction");
    direction.options[0].textContent = t("allDirections");
    direction.options[1].textContent = t("front");
    direction.options[2].textContent = t("backDirection");
  }

  function jobs() {
    if (state.catalog?.jobs?.length) return state.catalog.jobs.map(job => [job.key, job.name]);
    return FALLBACK_JOBS;
  }

  function renderCatalog() {
    const previousJob = jobSelect.value;
    jobSelect.replaceChildren(...jobs().map(([value, label]) => new Option(label, value)));
    if ([...jobSelect.options].some(option => option.value === previousJob)) jobSelect.value = previousJob;
    renderSkillOptions();
  }

  function currentJob() { return state.catalog?.jobs?.find(job => job.key === jobSelect.value); }
  function renderSkillOptions() {
    const previousSkill = skillSelect.value;
    const options = [new Option(t("overall"), "0")];
    for (const skill of currentJob()?.skills || []) options.push(new Option(`${skill.name} · ${formatCount(skill.sampleCount)}`, String(skill.code)));
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
      const empty = document.createElement("p"); empty.className = "passive-empty"; empty.textContent = t("noPassives");
      passiveOptions.replaceChildren(empty); return;
    }
    passiveOptions.replaceChildren(...passives.map(passive => {
      const label = document.createElement("label"); label.className = "passive-option";
      const checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.dataset.passiveCode = String(passive.code);
      const name = document.createElement("span"); name.textContent = passive.name;
      const level = document.createElement("input"); level.type = "number"; level.min = "1"; level.max = String(passive.maximumLevel); level.value = "1"; level.setAttribute("aria-label", `${passive.name} ${t("level")}`);
      label.append(checkbox, name, level); return label;
    }));
  }

  function formatCount(value) { return new Intl.NumberFormat(state.locale).format(Number(value) || 0); }
  function setModelState(status, sampleCount) {
    const ready = status === "ready";
    document.getElementById("model-state").classList.toggle("ready", ready);
    document.getElementById("model-state-title").textContent = t(ready ? "ready" : "collecting");
    document.getElementById("model-sample-count").textContent = t("samples").replace("{count}", formatCount(sampleCount));
  }

  async function loadCatalog() {
    try {
      const response = await fetch(`${API_BASE}/catalog`, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(String(response.status));
      state.catalog = await response.json();
      setModelState(state.catalog.status, state.catalog.sampleCount);
      renderCatalog();
    } catch {
      state.catalog = null;
      setModelState("collecting", 0);
      renderCatalog();
    }
  }

  function number(formData, key) { const value = Number(formData.get(key)); return Number.isFinite(value) ? value : 0; }
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
	  accuracy: number(data, "accuracy"), pveAccuracy: number(data, "pveAccuracy"), critical: number(data, "critical"), penetration: number(data, "penetration"),
	  pveAttack: number(data, "pveAttack"), bossAttack: number(data, "bossAttack"), frontAttack: number(data, "frontAttack"), backAttack: number(data, "backAttack"), damageAmplificationPercent: number(data, "damageAmplificationPercent"), weaponDamageAmplificationPercent: number(data, "weaponDamageAmplificationPercent"),
	  pveDamageAmplificationPercent: number(data, "pveDamageAmplificationPercent"), bossDamageAmplificationPercent: number(data, "bossDamageAmplificationPercent"),
	  criticalDamageAmplificationPercent: number(data, "criticalDamageAmplificationPercent"), additionalHitAccuracyPercent: number(data, "additionalHitAccuracyPercent"), perfectPercent: number(data, "perfectPercent"), hardHitPercent: number(data, "hardHitPercent"), cooldownTimePercent: number(data, "cooldownTimePercent"), combatSpeedPercent: number(data, "combatSpeedPercent"),
      frontDamageAmplificationPercent: number(data, "frontDamageAmplificationPercent"), backDamageAmplificationPercent: number(data, "backDamageAmplificationPercent"),
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
      row.append(rank, name, gain); return row;
    }));
    document.getElementById("result-empty").hidden = true; list.hidden = false;
    const confidence = document.getElementById("confidence"); confidence.className = `confidence ${result.confidence}`; confidence.textContent = t(result.confidence);
    document.getElementById("formula-version").textContent = result.formulaVersion || "—";
  }

  async function submit(event) {
    event.preventDefault();
    const error = document.getElementById("form-error"); error.hidden = true;
    if (!form.reportValidity()) return;
    submitButton.disabled = true; submitButton.textContent = t("calculating");
    try {
      const response = await fetch(`${API_BASE}/calculate`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(requestPayload()) });
      const result = await response.json();
      if (!response.ok || result.status === "invalid") throw new Error(t("invalid"));
      renderResults(result);
    } catch (failure) {
      error.textContent = failure instanceof Error && failure.message ? failure.message : t("unavailable");
      if (!error.textContent || /^\d+$/.test(error.textContent)) error.textContent = t("unavailable");
      error.hidden = false;
    } finally {
      submitButton.disabled = false; submitButton.textContent = t("calculate");
    }
  }

  document.getElementById("language-button").addEventListener("click", () => {
    state.locale = LOCALES[(LOCALES.indexOf(state.locale) + 1) % LOCALES.length];
    localStorage.setItem("notmeter-stats-locale", state.locale); applyLocale();
  });
  jobSelect.addEventListener("change", renderSkillOptions);
  skillSelect.addEventListener("change", renderSkillOptions);
  form.addEventListener("submit", submit);
  applyLocale();
  showCollecting();
  void loadCatalog();
})();
