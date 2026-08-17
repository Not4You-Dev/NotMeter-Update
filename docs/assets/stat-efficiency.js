(() => {
  "use strict";

  const surface = document.getElementById("stat-efficiency-surface");
  if (!surface) return;

  const API_BASE = "https://notmeter.112-168-140-142.sslip.io/formula/v1";
  const CLIPBOARD_PREFIX = "NOTMETER_STATS_V4:";
  const CLIPBOARD_SCHEMA = "notmeter-stat-efficiency-profile-v4";
  const SIMULATION_DEBOUNCE_MS = 450;
  const SIMULATION_CACHE_LIMIT = 48;
  const LOCALES = ["ko", "en", "zh-TW"];
  const FALLBACK_JOBS = [
    ["검성", "검성"], ["수호성", "수호성"], ["궁성", "궁성"],
    ["살성", "살성"], ["마도성", "마도성"], ["정령성", "정령성"],
    ["치유성", "치유성"], ["호법성", "호법성"], ["권성", "권성"],
  ];
  const PROFILE_FIELDS = [
    "attack", "additionalAttack", "minimumAttack", "maximumAttack", "attackIncreasePercent", "criticalAttackPower",
	"sealstoneAdditionalDamage", "power", "vitality", "agility", "knowledge", "precision",
    "will", "justice", "freedom", "illusion", "life", "time", "destruction",
    "death", "wisdom", "destiny", "space",
    "accuracy", "weaponAccuracy", "accuracyIncreasePercent", "pveAccuracy", "critical", "criticalIncreasePercent",
    "defense", "armorDefense", "defenseIncreasePercent", "penetration", "pveAttack",
    "bossAttack", "frontAttack", "backAttack", "frontCritical", "backCritical",
	"damageAmplificationPercent",
    "weaponDamageAmplificationPercent", "pveDamageAmplificationPercent",
    "bossDamageAmplificationPercent", "criticalDamageAmplificationPercent",
    "additionalHitAccuracyPercent", "perfectPercent", "hardHitPercent",
    "cooldownTimePercent", "combatSpeedPercent", "frontDamageAmplificationPercent",
    "backDamageAmplificationPercent",
  ];
	const GROWTH_EFFECTS = new Set([
		"power", "vitality", "agility", "knowledge", "precision", "will", "justice",
		"freedom", "illusion", "life", "time", "destruction", "death", "wisdom",
		"destiny", "space",
	]);
	const INTEGER_EFFECTS = new Set([
		"additionalAttack", "minimumAttack", "maximumAttack", "criticalAttackPower", "sealstoneAdditionalDamage",
		"accuracy", "pveAccuracy", "critical", "penetration", "pveAttack", "bossAttack",
		"frontAttack", "backAttack", "frontCritical", "backCritical",
	]);
  const TEXT = {
    ko: {
      title: "스탯 효율 계산기", subtitle: "내 캐릭터에서 무엇을 올려야 가장 강해지는지 비교합니다.",
      importTitle: "딜미터기에서 복사한 내 스탯 붙여넣기", importDescription: "딜미터기 처치 기록 상단의 ‘내 스탯 복사’를 누른 뒤 아래 칸에 붙여넣으면 현재 캐릭터 스탯이 자동 입력됩니다.", importPlaceholder: "여기를 누르고 Ctrl+V로 붙여넣기", importWaiting: "복사한 값을 기다리고 있습니다", importSuccess: "내 스탯 {count}개를 자동 입력했습니다", importInvalid: "딜미터기에서 복사한 올바른 스탯 값이 아닙니다",
      noticeTitle: "테스트 기능 안내", notice: "이 기능은 테스트 기능이며, 신뢰 테스트가 진행전 입니다.", heroKicker: "실전 데이터 기반", heroTitle: "직업·스킬과 공격 방향에 맞는 성장 우선순위를 확인하세요", heroDescription: "주신 스탯과 PVE·보스 스탯을 함께 비교하며, 던전에서 받은 정상적인 파티 버프도 분석에 반영합니다.",
      collecting: "표본 수집 중 · 준비 중", ready: "계산 준비 완료", samples: "{count} 표본", sourceOnly: "분석 대상", deus: "잠식된 데우스 연구기지(어려움)", noiran: "노이란의 숨겨진 유산(4단계)",
      combatProfile: "전투 조건", combatProfileHelp: "지원 던전 6개 보스를 동일 가중치로 종합하며 직업·대표 스킬·방향만 선택합니다.", job: "직업", targetBoss: "분석 보스", targetCollecting: "표본 수집 중", skill: "대표 스킬", overall: "직업 종합", skillLevel: "스킬 레벨", direction: "공격 방향", allDirections: "종합", front: "전방", backDirection: "후방", specializations: "스킬 특성", passives: "패시브·스티그마 레벨", passiveHelp: "특성 선택 없이 실제 레벨만 반영합니다", noPassives: "현재 검증된 패시브·스티그마가 없습니다.", passive: "패시브", stigma: "스티그마", level: "레벨",
      attackStats: "공격 스탯", attackStatsHelp: "복사 기능을 사용하면 자동 입력됩니다.", attack: "기초 공격력", additionalAttack: "추가 공격력", minimumAttack: "최소 공격력", maximumAttack: "최대 공격력", criticalAttackPower: "치명타 공격력", sealstoneAdditionalDamage: "봉혼석 추가 피해", power: "위력", vitality: "체력", agility: "민첩", knowledge: "지식", precision: "정확", will: "의지", justice: "정의", freedom: "자유", illusion: "환상", life: "생명", time: "시간", destruction: "파괴", death: "죽음", wisdom: "지혜", destiny: "운명", space: "공간", accuracy: "명중", weaponAccuracy: "무기 명중", pveAccuracy: "PVE 명중", critical: "치명타", defense: "방어력", armorDefense: "방어구 방어력", penetration: "관통", pveAttack: "PVE 공격력", bossAttack: "보스 공격력", frontAttack: "전방 공격력", backAttack: "후방 공격력", frontCritical: "전방 치명타", backCritical: "후방 치명타",
      percentStats: "증폭·판정 스탯", percentStatsHelp: "화면에 표시된 값을 그대로 사용합니다.", attackIncrease: "공격력 증가율", accuracyIncrease: "명중 증가율", criticalIncrease: "치명타 증가율", defenseIncrease: "방어력 증가율", damageAmp: "피해 증폭", weaponAmp: "무기 피해 증폭", pveAmp: "PVE 피해 증폭", bossAmp: "보스 피해 증폭", criticalAmp: "치명타 피해 증폭", additionalHit: "다단 히트 적중", perfect: "완벽", hardHit: "강타", cooldownTime: "재시전 시간", combatSpeed: "전투 속도", frontAmp: "전방 피해 증폭", backAmp: "후방 피해 증폭",
      calculate: "효율 계산", calculating: "계산 중…", resultKicker: "직업·스킬별 분석", resultTitle: "스탯 효율 순위", displayedStatsTitle: "실시간 스탯 시뮬레이션", displayedStatsHelp: "복사 기준에서 입력값을 바꾸면 게임 표시 최종 스탯이 바로 갱신됩니다.", displayedAttack: "최종 공격력", displayedAccuracy: "최종 명중", displayedCritical: "최종 치명타", displayedDefense: "최종 방어력", simulationReset: "복사 기준으로 초기화", simulationDamage: "예상 종합 피해 변화", simulationWaiting: "기준 스탯을 붙여넣으면 자동 계산됩니다.", simulationCalculating: "변경값을 계산하고 있습니다.", simulationCollecting: "피해 효율은 표본 수집 중이며 최종 스탯은 정상 계산되었습니다.", simulationReady: "지원 보스 6종을 동일 가중치로 계산한 결과입니다.", waitingTitle: "표본을 수집하고 있습니다", waitingDescription: "모든 지원 보스와 선택한 직업·스킬이 높은 신뢰 기준을 통과하면 결과가 열립니다.", resultGuide: "+1, +10, +1%p 단위별 순위이며 서로 다른 단위끼리는 직접 비교하지 않습니다.", growthGroup: "주신 스탯 · +1 기준", integerGroup: "전투 수치 · +10 기준", percentGroup: "퍼센트 스탯 · +1%p 기준", easyTitle: "간편하게 사용하는 방법", easyOne: "딜미터기 처치 기록 상단에서 ‘내 스탯 복사’를 누릅니다.", easyTwo: "이 페이지 상단 입력칸에 붙여넣습니다.", easyThree: "대표 스킬·공격 방향을 선택하면 지원 던전 6개 보스를 동일 가중치로 종합 계산합니다.",
      pending: "검증 전", low: "낮은 신뢰", medium: "중간 신뢰", high: "높은 신뢰", invalid: "입력값을 확인해 주세요.", unavailable: "계산 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      powerEffect: "위력 +1", vitalityEffect: "체력 +1", agilityEffect: "민첩 +1", knowledgeEffect: "지식 +1", precisionEffect: "정확 +1", willEffect: "의지 +1", justiceEffect: "정의 +1", freedomEffect: "자유 +1", illusionEffect: "환상 +1", lifeEffect: "생명 +1", timeEffect: "시간 +1", destructionEffect: "파괴 +1", deathEffect: "죽음 +1", wisdomEffect: "지혜 +1", destinyEffect: "운명 +1", spaceEffect: "공간 +1", additionalAttackEffect: "추가 공격력 +10", minimumAttackEffect: "최소 공격력 +10", maximumAttackEffect: "최대 공격력 +10", criticalAttackPowerEffect: "치명타 공격력 +10", sealstoneAdditionalDamageEffect: "봉혼석 추가 피해 +10", accuracyEffect: "명중 +10", pveAccuracyEffect: "PVE 명중 +10", criticalEffect: "치명타 +10", penetrationEffect: "관통 +10", damageAmplificationEffect: "피해 증폭 +1%p", weaponDamageAmplificationEffect: "무기 피해 증폭 +1%p", criticalDamageAmplificationEffect: "치명타 피해 증폭 +1%p", additionalHitAccuracyEffect: "다단 히트 적중 +1%p", perfectEffect: "완벽 +1%p", hardHitEffect: "강타 +1%p", cooldownTimeEffect: "재시전 시간 -1%p", combatSpeedEffect: "전투 속도 +1%p", pveAttackEffect: "PVE 공격력 +10", pveDamageAmplificationEffect: "PVE 피해 증폭 +1%p", bossAttackEffect: "보스 공격력 +10", bossDamageAmplificationEffect: "보스 피해 증폭 +1%p", frontAttackEffect: "전방 공격력 +10", backAttackEffect: "후방 공격력 +10", frontCriticalEffect: "전방 치명타 +10", backCriticalEffect: "후방 치명타 +10", frontDamageAmplificationEffect: "전방 피해 증폭 +1%p", backDamageAmplificationEffect: "후방 피해 증폭 +1%p",
    },
    en: {
	  minimumAttackEffect: "Minimum Attack +10",
      title: "Stat Efficiency Calculator", subtitle: "Compare which upgrade makes your character stronger.", importTitle: "Paste stats copied from NotMeter", importDescription: "Press ‘Copy my stats’ at the top of Kill Records, then paste below to fill the current character's stats automatically.", importPlaceholder: "Click here and press Ctrl+V", importWaiting: "Waiting for copied stats", importSuccess: "Filled {count} stats automatically", importInvalid: "This is not a valid stat value copied from NotMeter", noticeTitle: "Test feature", notice: "This is a test feature and reliability validation has not started yet.", heroKicker: "LIVE COMBAT DATA", heroTitle: "Find your upgrade priority for the selected class, skill, and direction", heroDescription: "Compare divine, PVE, and boss stats together. Verified party buffs received in dungeons are included in the analysis.", collecting: "Collecting samples · Coming soon", ready: "Ready to calculate", samples: "{count} samples", sourceOnly: "Analysis sources", deus: "Corrupted Deus Research Base (Hard)", noiran: "Noiran's Hidden Legacy (Stage 4)",
      combatProfile: "Combat profile", combatProfileHelp: "All supported bosses are combined at equal weight; choose only a class, skill, and direction.", job: "Class", targetBoss: "Target boss", targetCollecting: "Collecting samples", skill: "Representative skill", overall: "Class overall", skillLevel: "Skill level", direction: "Direction", allDirections: "Overall", front: "Front", backDirection: "Back", specializations: "Skill traits", passives: "Passive and stigma levels", passiveHelp: "Only the actual level is used; no traits are selectable", noPassives: "No validated passive or stigma skills yet.", passive: "Passive", stigma: "Stigma", level: "Level",
      attackStats: "Attack stats", attackStatsHelp: "Use copied stats to fill these automatically.", attack: "Base Attack", additionalAttack: "Additional Attack", minimumAttack: "Minimum Attack", maximumAttack: "Maximum Attack", criticalAttackPower: "Critical Attack Power", sealstoneAdditionalDamage: "Sealstone Additional Damage", power: "Power", vitality: "Vitality", agility: "Agility", knowledge: "Knowledge", precision: "Precision", will: "Will", justice: "Justice", freedom: "Freedom", illusion: "Illusion", life: "Life", time: "Time", destruction: "Destruction", death: "Death", wisdom: "Wisdom", destiny: "Destiny", space: "Space", accuracy: "Accuracy", weaponAccuracy: "Weapon Accuracy", pveAccuracy: "PVE Accuracy", critical: "Critical", defense: "Defense", armorDefense: "Armor Defense", penetration: "Penetration", pveAttack: "PVE Attack", bossAttack: "Boss Attack", frontAttack: "Front Attack", backAttack: "Back Attack", frontCritical: "Front Critical", backCritical: "Back Critical", percentStats: "Amplification and hit stats", percentStatsHelp: "Use the exact values displayed in game.", attackIncrease: "Attack Increase", accuracyIncrease: "Accuracy Increase", criticalIncrease: "Critical Increase", defenseIncrease: "Defense Increase", damageAmp: "Damage Amp", weaponAmp: "Weapon Damage Amp", pveAmp: "PVE Damage Amp", bossAmp: "Boss Damage Amp", criticalAmp: "Critical Damage Amp", additionalHit: "Multi-hit Accuracy", perfect: "Perfect", hardHit: "Power Hit", cooldownTime: "Cooldown Time", combatSpeed: "Combat Speed", frontAmp: "Front Damage Amp", backAmp: "Back Damage Amp",
      calculate: "Calculate efficiency", calculating: "Calculating…", resultKicker: "CLASS AND SKILL ANALYSIS", resultTitle: "Stat efficiency ranking", displayedStatsTitle: "Live stat simulation", displayedStatsHelp: "Change an input to update the final in-game totals from the copied baseline.", displayedAttack: "Total Attack", displayedAccuracy: "Total Accuracy", displayedCritical: "Total Critical", displayedDefense: "Total Defense", simulationReset: "Reset to copied stats", simulationDamage: "Estimated overall damage change", simulationWaiting: "Paste copied stats to start automatic calculation.", simulationCalculating: "Calculating the changed values.", simulationCollecting: "Damage efficiency is collecting samples; final stats were calculated normally.", simulationReady: "Calculated with equal weight across all six supported bosses.", waitingTitle: "Samples are being collected", waitingDescription: "Results unlock only after every supported boss and the selected class and skill pass high-confidence validation.", resultGuide: "Rankings use +1, +10, and +1%p groups; do not compare different units directly.", growthGroup: "DIVINE STATS · PER +1", integerGroup: "COMBAT VALUES · PER +10", percentGroup: "PERCENT STATS · PER +1%p", easyTitle: "Quick start", easyOne: "Press ‘Copy my stats’ at the top of NotMeter Kill Records.", easyTwo: "Paste into the box at the top of this page.", easyThree: "Choose a skill and direction to calculate across all supported bosses.", pending: "Unverified", low: "Low confidence", medium: "Medium confidence", high: "High confidence", invalid: "Check the entered values.", unavailable: "Could not reach the calculator. Try again shortly.",
      powerEffect: "Power +1", vitalityEffect: "Vitality +1", agilityEffect: "Agility +1", knowledgeEffect: "Knowledge +1", precisionEffect: "Precision +1", willEffect: "Will +1", justiceEffect: "Justice +1", freedomEffect: "Freedom +1", illusionEffect: "Illusion +1", lifeEffect: "Life +1", timeEffect: "Time +1", destructionEffect: "Destruction +1", deathEffect: "Death +1", wisdomEffect: "Wisdom +1", destinyEffect: "Destiny +1", spaceEffect: "Space +1", additionalAttackEffect: "Additional Attack +10", maximumAttackEffect: "Maximum Attack +10", criticalAttackPowerEffect: "Critical Attack Power +10", sealstoneAdditionalDamageEffect: "Sealstone Additional Damage +10", accuracyEffect: "Accuracy +10", pveAccuracyEffect: "PVE Accuracy +10", criticalEffect: "Critical +10", penetrationEffect: "Penetration +10", damageAmplificationEffect: "Damage Amp +1%p", weaponDamageAmplificationEffect: "Weapon Damage Amp +1%p", criticalDamageAmplificationEffect: "Critical Damage Amp +1%p", additionalHitAccuracyEffect: "Multi-hit Accuracy +1%p", perfectEffect: "Perfect +1%p", hardHitEffect: "Power Hit +1%p", cooldownTimeEffect: "Cooldown Time -1%p", combatSpeedEffect: "Combat Speed +1%p", pveAttackEffect: "PVE Attack +10", pveDamageAmplificationEffect: "PVE Damage Amp +1%p", bossAttackEffect: "Boss Attack +10", bossDamageAmplificationEffect: "Boss Damage Amp +1%p", frontAttackEffect: "Front Attack +10", backAttackEffect: "Back Attack +10", frontCriticalEffect: "Front Critical +10", backCriticalEffect: "Back Critical +10", frontDamageAmplificationEffect: "Front Damage Amp +1%p", backDamageAmplificationEffect: "Back Damage Amp +1%p",
    },
    "zh-TW": {
	  minimumAttackEffect: "最小攻擊力 +10",
      title: "屬性效率計算器", subtitle: "比較哪一項提升最能強化目前角色。", importTitle: "貼上從 NotMeter 複製的角色屬性", importDescription: "在討伐紀錄上方按下「複製我的屬性」，再貼到下方即可自動填入目前角色的數值。", importPlaceholder: "點擊此處並按 Ctrl+V 貼上", importWaiting: "等待貼上已複製的屬性", importSuccess: "已自動填入 {count} 項屬性", importInvalid: "這不是從 NotMeter 複製的有效屬性", noticeTitle: "測試功能說明", notice: "此功能目前為測試功能，尚未開始可信度驗證。", heroKicker: "實戰資料分析", heroTitle: "確認符合職業、技能與攻擊方向的成長優先順序", heroDescription: "同時比較主神、PVE 與首領屬性，副本中已確認的隊伍增益也會納入分析。", collecting: "正在收集樣本 · 準備中", ready: "可開始計算", samples: "{count} 筆樣本", sourceOnly: "分析對象", deus: "受侵蝕的德烏斯研究基地（困難）", noiran: "諾伊蘭的隱藏遺產（第4階段）",
      combatProfile: "戰鬥條件", combatProfileHelp: "所有支援首領採相同權重綜合，只需選擇職業、技能與方向。", job: "職業", targetBoss: "分析首領", targetCollecting: "正在收集樣本", skill: "代表技能", overall: "職業綜合", skillLevel: "技能等級", direction: "攻擊方向", allDirections: "綜合", front: "正面", backDirection: "背面", specializations: "技能特性", passives: "被動與烙印等級", passiveHelp: "不選特性，只套用實際等級", noPassives: "目前沒有已驗證的被動或烙印。", passive: "被動", stigma: "烙印", level: "等級",
      attackStats: "攻擊屬性", attackStatsHelp: "使用複製功能即可自動填入。", attack: "基礎攻擊力", additionalAttack: "追加攻擊力", minimumAttack: "最小攻擊力", maximumAttack: "最大攻擊力", criticalAttackPower: "暴擊攻擊力", sealstoneAdditionalDamage: "封魂石追加傷害", power: "威力", vitality: "體力", agility: "敏捷", knowledge: "知識", precision: "精準", will: "意志", justice: "正義", freedom: "自由", illusion: "幻象", life: "生命", time: "時間", destruction: "破壞", death: "死亡", wisdom: "智慧", destiny: "命運", space: "空間", accuracy: "命中", weaponAccuracy: "武器命中", pveAccuracy: "PVE 命中", critical: "暴擊", defense: "防禦力", armorDefense: "防具防禦力", penetration: "貫穿", pveAttack: "PVE 攻擊力", bossAttack: "首領攻擊力", frontAttack: "正面攻擊力", backAttack: "背面攻擊力", frontCritical: "正面暴擊", backCritical: "背面暴擊", percentStats: "增幅與判定屬性", percentStatsHelp: "使用遊戲畫面顯示的原始數值。", attackIncrease: "攻擊力增加率", accuracyIncrease: "命中增加率", criticalIncrease: "暴擊增加率", defenseIncrease: "防禦力增加率", damageAmp: "傷害增幅", weaponAmp: "武器傷害增幅", pveAmp: "PVE 傷害增幅", bossAmp: "首領傷害增幅", criticalAmp: "暴擊傷害增幅", additionalHit: "多段命中", perfect: "完美", hardHit: "強擊", cooldownTime: "再使用時間", combatSpeed: "戰鬥速度", frontAmp: "正面傷害增幅", backAmp: "背面傷害增幅",
      calculate: "計算效率", calculating: "計算中…", resultKicker: "職業與技能分析", resultTitle: "屬性效率排名", displayedStatsTitle: "即時屬性模擬", displayedStatsHelp: "變更輸入值後，會從複製基準即時更新遊戲最終屬性。", displayedAttack: "最終攻擊力", displayedAccuracy: "最終命中", displayedCritical: "最終暴擊", displayedDefense: "最終防禦力", simulationReset: "重設為複製基準", simulationDamage: "預估綜合傷害變化", simulationWaiting: "貼上複製的屬性後即可自動計算。", simulationCalculating: "正在計算變更後的數值。", simulationCollecting: "傷害效率仍在收集樣本，最終屬性已正常計算。", simulationReady: "以六個支援首領相同權重計算。", waitingTitle: "正在收集樣本", waitingDescription: "所有支援首領及所選職業、技能通過高可信度驗證後才會顯示結果。", resultGuide: "排名分為 +1、+10、+1%p 三種單位，不可跨單位直接比較。", growthGroup: "主神屬性 · 每 +1", integerGroup: "戰鬥數值 · 每 +10", percentGroup: "百分比屬性 · 每 +1%p", easyTitle: "快速使用方法", easyOne: "在 NotMeter 討伐紀錄上方按下「複製我的屬性」。", easyTwo: "貼到本頁上方輸入框。", easyThree: "選擇代表技能與方向後，以所有支援首領綜合計算。", pending: "尚未驗證", low: "低可信度", medium: "中可信度", high: "高可信度", invalid: "請確認輸入值。", unavailable: "無法連線至計算服務，請稍後再試。",
      powerEffect: "威力 +1", vitalityEffect: "體力 +1", agilityEffect: "敏捷 +1", knowledgeEffect: "知識 +1", precisionEffect: "精準 +1", willEffect: "意志 +1", justiceEffect: "正義 +1", freedomEffect: "自由 +1", illusionEffect: "幻象 +1", lifeEffect: "生命 +1", timeEffect: "時間 +1", destructionEffect: "破壞 +1", deathEffect: "死亡 +1", wisdomEffect: "智慧 +1", destinyEffect: "命運 +1", spaceEffect: "空間 +1", additionalAttackEffect: "追加攻擊力 +10", maximumAttackEffect: "最大攻擊力 +10", criticalAttackPowerEffect: "暴擊攻擊力 +10", sealstoneAdditionalDamageEffect: "封魂石追加傷害 +10", accuracyEffect: "命中 +10", pveAccuracyEffect: "PVE 命中 +10", criticalEffect: "暴擊 +10", penetrationEffect: "貫穿 +10", damageAmplificationEffect: "傷害增幅 +1%p", weaponDamageAmplificationEffect: "武器傷害增幅 +1%p", criticalDamageAmplificationEffect: "暴擊傷害增幅 +1%p", additionalHitAccuracyEffect: "多段命中 +1%p", perfectEffect: "完美 +1%p", hardHitEffect: "強擊 +1%p", cooldownTimeEffect: "再使用時間 -1%p", combatSpeedEffect: "戰鬥速度 +1%p", pveAttackEffect: "PVE 攻擊力 +10", pveDamageAmplificationEffect: "PVE 傷害增幅 +1%p", bossAttackEffect: "首領攻擊力 +10", bossDamageAmplificationEffect: "首領傷害增幅 +1%p", frontAttackEffect: "正面攻擊力 +10", backAttackEffect: "背面攻擊力 +10", frontCriticalEffect: "正面暴擊 +10", backCriticalEffect: "背面暴擊 +10", frontDamageAmplificationEffect: "正面傷害增幅 +1%p", backDamageAmplificationEffect: "背面傷害增幅 +1%p",
    },
  };
  const EFFECT_KEYS = {
    power: "powerEffect", vitality: "vitalityEffect", agility: "agilityEffect", knowledge: "knowledgeEffect", precision: "precisionEffect", will: "willEffect", justice: "justiceEffect", freedom: "freedomEffect", illusion: "illusionEffect", life: "lifeEffect", time: "timeEffect", destruction: "destructionEffect", death: "deathEffect", wisdom: "wisdomEffect", destiny: "destinyEffect", space: "spaceEffect",
	additionalAttack: "additionalAttackEffect", minimumAttack: "minimumAttackEffect", maximumAttack: "maximumAttackEffect", criticalAttackPower: "criticalAttackPowerEffect", sealstoneAdditionalDamage: "sealstoneAdditionalDamageEffect",
    accuracy: "accuracyEffect", pveAccuracy: "pveAccuracyEffect", critical: "criticalEffect", penetration: "penetrationEffect",
    damageAmplification: "damageAmplificationEffect", weaponDamageAmplification: "weaponDamageAmplificationEffect",
    criticalDamageAmplification: "criticalDamageAmplificationEffect", additionalHitAccuracy: "additionalHitAccuracyEffect", perfect: "perfectEffect", hardHit: "hardHitEffect", cooldownTime: "cooldownTimeEffect", combatSpeed: "combatSpeedEffect",
    pveAttack: "pveAttackEffect", pveDamageAmplification: "pveDamageAmplificationEffect", bossAttack: "bossAttackEffect", bossDamageAmplification: "bossDamageAmplificationEffect", frontAttack: "frontAttackEffect", backAttack: "backAttackEffect", frontCritical: "frontCriticalEffect", backCritical: "backCriticalEffect", frontDamageAmplification: "frontDamageAmplificationEffect", backDamageAmplification: "backDamageAmplificationEffect",
  };

  const state = {
    locale: resolveLocale(), catalog: null, catalogLoad: null, initialized: false,
    pendingJobName: "", importedSkills: new Map(),
    simulationBaseline: null, simulationResult: null, simulationTimer: 0,
    simulationAbortController: null, simulationCache: new Map(), applyingStats: false,
  };
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
    if (state.simulationResult) renderSimulation(state.simulationResult);
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
    const selectedSkill = currentJob()?.skills?.find(skill => skill.code === Number(skillSelect.value));
    const hasSkill = Boolean(selectedSkill);
    specializationField.disabled = !selectedSkill?.supportsSpecializations;
    if (specializationField.disabled) {
      specializationField.querySelectorAll("input:checked").forEach(input => { input.checked = false; });
    }
    document.getElementById("skill-level").disabled = !hasSkill;
    if (selectedSkill && state.importedSkills.has(selectedSkill.code)) {
      document.getElementById("skill-level").value = String(state.importedSkills.get(selectedSkill.code).level);
    }
    renderPassiveOptions();
  }

  function renderPassiveOptions() {
    const selected = new Map([...passiveOptions.querySelectorAll(".passive-option")].map(option => [
      Number(option.querySelector("input[type=checkbox]")?.dataset.passiveCode),
      {
        checked: Boolean(option.querySelector("input[type=checkbox]")?.checked),
        level: Number(option.querySelector("input[type=number]")?.value) || 1,
      },
    ]));
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
      const imported = state.importedSkills.get(passive.code);
      const previous = selected.get(passive.code);
      const checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.dataset.passiveCode = String(passive.code); checkbox.checked = previous?.checked ?? Boolean(imported);
      const name = document.createElement("span"); name.textContent = `${passive.name} · ${t(passive.kind === "stigma" ? "stigma" : "passive")}`;
      const level = document.createElement("input"); level.type = "number"; level.min = "1"; level.max = String(passive.maximumLevel); level.value = String(Math.min(passive.maximumLevel, previous?.level ?? imported?.level ?? 1)); level.setAttribute("aria-label", `${passive.name} ${t("level")}`);
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
    if (!profile || profile.schema !== CLIPBOARD_SCHEMA || profile.version !== 4 ||
        typeof profile.jobName !== "string" || !profile.jobName.trim()) {
      throw new Error("invalid profile");
    }
    for (const field of PROFILE_FIELDS) {
      if (!Number.isFinite(Number(profile[field]))) throw new Error(`invalid ${field}`);
    }
    if (!Array.isArray(profile.skills) || profile.skills.some(skill =>
        !Number.isInteger(Number(skill?.code)) || Number(skill.code) <= 0 ||
        !Number.isInteger(Number(skill?.level)) || Number(skill.level) <= 0 ||
        !["active", "stigma", "passive"].includes(String(skill?.category)))) {
      throw new Error("invalid skills");
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
      state.importedSkills = new Map(profile.skills.map(skill => [Number(skill.code), {
        level: Number(skill.level), category: String(skill.category),
      }]));
      renderCatalog();
      let filled = 0;
      state.applyingStats = true;
      for (const field of PROFILE_FIELDS) {
        const input = form.elements.namedItem(field);
        if (!(input instanceof HTMLInputElement)) continue;
        input.value = displayNumber(profile[field]);
		input.setCustomValidity("");
        filled++;
      }
      state.applyingStats = false;
      importInput.value = "";
      importStatus.className = "stat-import-status success";
      importStatus.textContent = t("importSuccess", { count: filled });
      form.classList.add("stats-imported");
      window.setTimeout(() => form.classList.remove("stats-imported"), 900);
	  establishSimulationBaseline();
      return true;
    } catch {
      state.applyingStats = false;
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
      jobName: String(data.get("jobName") || ""), targetType: "boss", targetKey: "all", direction: String(data.get("direction") || "none"),
      attack: number(data, "attack"), additionalAttack: number(data, "additionalAttack"), minimumAttack: number(data, "minimumAttack"), maximumAttack: number(data, "maximumAttack"), attackIncreasePercent: number(data, "attackIncreasePercent"), criticalAttackPower: number(data, "criticalAttackPower"), sealstoneAdditionalDamage: number(data, "sealstoneAdditionalDamage"), power: number(data, "power"), vitality: number(data, "vitality"), agility: number(data, "agility"), knowledge: number(data, "knowledge"), precision: number(data, "precision"), will: number(data, "will"), justice: number(data, "justice"), freedom: number(data, "freedom"), illusion: number(data, "illusion"), life: number(data, "life"), time: number(data, "time"), destruction: number(data, "destruction"), death: number(data, "death"), wisdom: number(data, "wisdom"), destiny: number(data, "destiny"), space: number(data, "space"),
      accuracy: number(data, "accuracy"), weaponAccuracy: number(data, "weaponAccuracy"), accuracyIncreasePercent: number(data, "accuracyIncreasePercent"), pveAccuracy: number(data, "pveAccuracy"), critical: number(data, "critical"), criticalIncreasePercent: number(data, "criticalIncreasePercent"), defense: number(data, "defense"), armorDefense: number(data, "armorDefense"), defenseIncreasePercent: number(data, "defenseIncreasePercent"), penetration: number(data, "penetration"), pveAttack: number(data, "pveAttack"), bossAttack: number(data, "bossAttack"), frontAttack: number(data, "frontAttack"), backAttack: number(data, "backAttack"), frontCritical: number(data, "frontCritical"), backCritical: number(data, "backCritical"),
      damageAmplificationPercent: number(data, "damageAmplificationPercent"), weaponDamageAmplificationPercent: number(data, "weaponDamageAmplificationPercent"), pveDamageAmplificationPercent: number(data, "pveDamageAmplificationPercent"), bossDamageAmplificationPercent: number(data, "bossDamageAmplificationPercent"), criticalDamageAmplificationPercent: number(data, "criticalDamageAmplificationPercent"), additionalHitAccuracyPercent: number(data, "additionalHitAccuracyPercent"), perfectPercent: number(data, "perfectPercent"), hardHitPercent: number(data, "hardHitPercent"), cooldownTimePercent: number(data, "cooldownTimePercent"), combatSpeedPercent: number(data, "combatSpeedPercent"), frontDamageAmplificationPercent: number(data, "frontDamageAmplificationPercent"), backDamageAmplificationPercent: number(data, "backDamageAmplificationPercent"),
      skillCode: number(data, "skillCode"), skillLevel: number(data, "skillLevel"), specializationMask, passives,
    };
  }

  function showCollecting(result) {
	if (!state.simulationBaseline) renderDisplayedStats(result?.displayedStats);
    setModelState("collecting", result?.sampleCount || state.catalog?.sampleCount || 0);
    document.getElementById("result-empty").hidden = false;
    document.getElementById("result-list").hidden = true;
    document.getElementById("confidence").className = "confidence pending";
    document.getElementById("confidence").textContent = t("pending");
    document.getElementById("formula-version").textContent = result?.formulaVersion || "—";
  }

  function validDisplayedStats(stats) {
    return Boolean(stats) && ["attack", "accuracy", "critical", "defense"].every(key =>
      Number.isSafeInteger(Number(stats[key])) && Number(stats[key]) >= 0);
  }

  function renderDisplayedStats(stats, baselineStats = null) {
	const panel = document.getElementById("displayed-stats");
	if (!validDisplayedStats(stats)) {
		panel.hidden = true;
		return;
	}
	const hasBaseline = validDisplayedStats(baselineStats);
	for (const key of ["attack", "accuracy", "critical", "defense"]) {
      const candidate = Number(stats[key]);
      const baseline = hasBaseline ? Number(baselineStats[key]) : candidate;
      const delta = candidate - baseline;
      document.getElementById(`displayed-${key}`).textContent = delta
        ? `${formatCount(baseline)} → ${formatCount(candidate)}`
        : formatCount(candidate);
      const deltaElement = document.getElementById(`displayed-${key}-delta`);
      deltaElement.textContent = delta ? `${delta > 0 ? "+" : ""}${formatCount(delta)}` : "";
      deltaElement.className = delta > 0 ? "positive" : delta < 0 ? "negative" : "";
	}
    document.getElementById("simulation-reset").hidden = !state.simulationBaseline;
	panel.hidden = false;
  }

  function renderSimulation(result) {
    state.simulationResult = result;
    renderDisplayedStats(result?.candidateDisplayedStats, result?.baselineDisplayedStats);
    const gain = document.getElementById("simulation-damage-gain");
    const description = document.getElementById("simulation-damage-state");
    const gainPercent = Number(result?.gainPercent);
    if (result?.status === "ready" && Number.isFinite(gainPercent)) {
      gain.textContent = `${gainPercent > 0 ? "+" : ""}${gainPercent.toFixed(4)}%`;
      gain.className = gainPercent > 0 ? "positive" : gainPercent < 0 ? "negative" : "";
      description.textContent = t("simulationReady");
      return;
    }
    gain.textContent = "—";
    gain.className = "";
    description.textContent = result?.status === "calculating"
      ? t("simulationCalculating")
      : t("simulationCollecting");
  }

  function clonePayload(payload) {
    return JSON.parse(JSON.stringify(payload));
  }

  function establishSimulationBaseline() {
    if (!form.checkValidity()) return false;
    window.clearTimeout(state.simulationTimer);
    state.simulationAbortController?.abort();
    state.simulationBaseline = clonePayload(requestPayload());
    state.simulationResult = null;
    state.simulationCache.clear();
    scheduleSimulation(true);
    return true;
  }

  function scheduleSimulation(immediate = false) {
    if (!state.simulationBaseline || !form.checkValidity()) return;
    window.clearTimeout(state.simulationTimer);
    state.simulationAbortController?.abort();
    state.simulationAbortController = null;
    renderSimulation({
      status: "calculating",
      baselineDisplayedStats: state.simulationResult?.baselineDisplayedStats,
      candidateDisplayedStats: state.simulationResult?.candidateDisplayedStats,
    });
    state.simulationTimer = window.setTimeout(
      () => void runSimulation(),
      immediate ? 0 : SIMULATION_DEBOUNCE_MS);
  }

  async function runSimulation() {
    if (!state.simulationBaseline || !form.checkValidity()) return;
    const payload = {
      baseline: state.simulationBaseline,
      candidate: requestPayload(),
    };
    const cacheKey = JSON.stringify(payload);
    const cached = state.simulationCache.get(cacheKey);
    if (cached) {
      renderSimulation(cached);
      return;
    }

    state.simulationAbortController?.abort();
    const controller = new AbortController();
    state.simulationAbortController = controller;
    try {
      const response = await fetch(`${API_BASE}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || result.status === "invalid") throw new Error("invalid simulation");
      state.simulationCache.set(cacheKey, result);
      if (state.simulationCache.size > SIMULATION_CACHE_LIMIT) {
        state.simulationCache.delete(state.simulationCache.keys().next().value);
      }
      renderSimulation(result);
    } catch (failure) {
      if (failure?.name === "AbortError") return;
      const previous = state.simulationResult;
      renderSimulation({
        status: "collecting",
        baselineDisplayedStats: previous?.baselineDisplayedStats,
        candidateDisplayedStats: previous?.candidateDisplayedStats,
      });
    } finally {
      if (state.simulationAbortController === controller) state.simulationAbortController = null;
    }
  }

  function resetSimulation() {
    if (!state.simulationBaseline) return;
    state.applyingStats = true;
    for (const field of PROFILE_FIELDS) {
      const input = form.elements.namedItem(field);
      if (input instanceof HTMLInputElement) {
        input.value = displayNumber(state.simulationBaseline[field]);
        input.setCustomValidity("");
      }
    }
    state.applyingStats = false;
    scheduleSimulation(true);
  }

  function installStatStepControls() {
    for (const field of PROFILE_FIELDS) {
      const input = form.elements.namedItem(field);
      if (!(input instanceof HTMLInputElement) || input.parentElement?.classList.contains("stat-input-control")) continue;
      const control = document.createElement("div");
      control.className = "stat-input-control";
      const decrement = document.createElement("button");
      decrement.type = "button";
      decrement.className = "stat-step-button";
      decrement.dataset.delta = "-1";
      decrement.setAttribute("aria-label", `${field} -1`);
      decrement.textContent = "−";
      const increment = document.createElement("button");
      increment.type = "button";
      increment.className = "stat-step-button";
      increment.dataset.delta = "1";
      increment.setAttribute("aria-label", `${field} +1`);
      increment.textContent = "+";
      input.before(control);
      control.append(decrement, input, increment);
    }
  }

  function changeStatBy(input, delta) {
    if (!state.simulationBaseline && form.checkValidity()) {
      state.simulationBaseline = clonePayload(requestPayload());
      state.simulationCache.clear();
    }
    const minimum = input.min === "" ? -Infinity : Number(input.min);
    const maximum = input.max === "" ? Infinity : Number(input.max);
    const current = Number(input.value);
    if (!Number.isFinite(current)) return;
    input.value = displayNumber(Math.min(maximum, Math.max(minimum, current + delta)));
    input.setCustomValidity("");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function renderResults(result) {
    if (result.status !== "ready") { showCollecting(result); return; }
	if (!state.simulationBaseline) renderDisplayedStats(result.displayedStats);
    setModelState("ready", result.sampleCount);
    const list = document.getElementById("result-list");
    const effects = Array.isArray(result.effects) ? result.effects : [];
	const groups = [
		["growthGroup", effects.filter(effect => GROWTH_EFFECTS.has(effect.key))],
		["integerGroup", effects.filter(effect => INTEGER_EFFECTS.has(effect.key))],
		["percentGroup", effects.filter(effect => !GROWTH_EFFECTS.has(effect.key) && !INTEGER_EFFECTS.has(effect.key))],
	];
	list.replaceChildren(...groups.filter(([, items]) => items.length).map(([titleKey, items]) => {
		const group = document.createElement("section"); group.className = "result-group";
		const title = document.createElement("h4"); title.className = "result-group-title"; title.textContent = t(titleKey);
		group.append(title, ...items.map((effect, index) => {
			const row = document.createElement("div"); row.className = `result-row${index === 0 ? " is-top" : ""}`;
			const rank = document.createElement("span"); rank.className = "result-rank"; rank.textContent = String(index + 1);
			const name = document.createElement("span"); name.className = "result-name"; name.textContent = t(EFFECT_KEYS[effect.key] || effect.key);
			const gain = document.createElement("strong"); gain.className = "result-gain"; gain.textContent = `+${Number(effect.gainPercent).toFixed(4)}%`;
			row.append(rank, name, gain);
			return row;
		}));
		return group;
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
    if (!state.simulationBaseline) establishSimulationBaseline();
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
    installStatStepControls();
    jobSelect.addEventListener("change", renderSkillOptions);
    skillSelect.addEventListener("change", renderSkillOptions);
    form.addEventListener("submit", submit);
    form.addEventListener("input", event => {
      if (state.applyingStats || !(event.target instanceof HTMLInputElement) ||
          !PROFILE_FIELDS.includes(event.target.name)) return;
      if (!state.simulationBaseline) {
        if (form.checkValidity()) establishSimulationBaseline();
        return;
      }
      scheduleSimulation();
    });
    form.addEventListener("change", event => {
      if (state.applyingStats ||
          (event.target instanceof HTMLInputElement && PROFILE_FIELDS.includes(event.target.name))) return;
      if (form.checkValidity()) establishSimulationBaseline();
    });
    form.addEventListener("click", event => {
      const button = event.target instanceof Element
        ? event.target.closest(".stat-step-button")
        : null;
      if (!button || !form.contains(button)) return;
      const input = button.parentElement?.querySelector("input[type=number]");
      if (input instanceof HTMLInputElement) changeStatBy(input, Number(button.dataset.delta));
    });
    document.getElementById("simulation-reset").addEventListener("click", resetSimulation);
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
