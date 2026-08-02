(() => {
  "use strict";

  const ENHANCED_PARTY_BUFF_CODES = new Set([
    117800072,
    127800012,
  ]);
  const AMPLIFICATION_PRAYER_CODE = 17430000;
  const EARTH_BLESSING_CODES = new Set([
    17400027,
    17400037,
    17400047,
    17400057,
    17400058,
  ]);
  const NON_GAMEPLAY_DETAIL_BUFF_CODES = new Set([
    1096,
    1097,
    1098,
    1099,
    1100,
    1101,
    1102,
    1168,
    11021,
    11041,
    18064961,
    19000000,
    19000001,
    19000062,
    19000070,
    19000071,
    19000074,
    19000079,
    19005001,
    19005011,
    19005071,
    19005081,
    19005151,
    19007001,
    19007007,
  ]);
  function code(value) {
    const parsed = Math.abs(Number(value) || 0);
    return Number.isSafeInteger(parsed) ? parsed : 0;
  }

  function isEnhanced(buff) {
    return ENHANCED_PARTY_BUFF_CODES.has(code(buff?.code)) ||
      ENHANCED_PARTY_BUFF_CODES.has(code(buff?.rawCode));
  }

  function compactCode(value) {
    let result = code(value);
    while (result > 99999999) {
      result = Math.floor(result / 10);
    }
    return result;
  }

  function skillFamilyCode(value) {
    return Math.floor(compactCode(value) / 10000) * 10000;
  }

  function isCommonAbnormalCode(value) {
    const normalized = compactCode(value);
    return normalized >= 19000000 && normalized < 19010000;
  }

  function shouldDisplay(buff) {
    const rawCode = compactCode(buff?.rawCode);
    const identityCode = rawCode > 0 ? rawCode : compactCode(buff?.code);
    if (NON_GAMEPLAY_DETAIL_BUFF_CODES.has(identityCode)) {
      return false;
    }

    const name = String(buff?.name || "").trim().toLocaleLowerCase();
    return !name.startsWith("테스트용_") &&
      !name.startsWith("for testing_") &&
      name !== "사라진 상승기류" &&
      name !== "still air";
  }

  function iconSource(buff) {
    const name = String(buff?.name || "").trim().toLocaleLowerCase();
    const isAmplificationPrayer =
      name === "증폭의 기도" ||
      name === "prayer of amplification";
    const isEarthBlessing =
      name === "대지의 축복" ||
      name === "earth's blessing" ||
      name === "earth’s blessing";

    if (isAmplificationPrayer ||
        skillFamilyCode(buff?.code) === AMPLIFICATION_PRAYER_CODE ||
        skillFamilyCode(buff?.rawCode) === AMPLIFICATION_PRAYER_CODE) {
      return { type: "skill", key: String(AMPLIFICATION_PRAYER_CODE) };
    }

    if (isEarthBlessing ||
        EARTH_BLESSING_CODES.has(compactCode(buff?.code)) ||
        EARTH_BLESSING_CODES.has(compactCode(buff?.rawCode))) {
      return { type: "buff", key: "ICON_CL_SKILL_030" };
    }

    return null;
  }

  function skillIconSource(skill) {
    const name = String(skill?.skillName || "").trim().toLocaleLowerCase();
    const isEarthBlessing =
      name === "대지의 축복" ||
      name === "earth's blessing" ||
      name === "earth’s blessing";

    if (isEarthBlessing ||
        EARTH_BLESSING_CODES.has(compactCode(skill?.skillCode)) ||
        EARTH_BLESSING_CODES.has(compactCode(skill?.rawSkillCode))) {
      return { type: "buff", key: "ICON_CL_SKILL_030" };
    }

    return null;
  }

  function skillDisplayName(skill) {
    const recordedName = String(skill?.skillName || "").trim() || "—";
    const level = Math.trunc(Number(skill?.skillLevel) || 0);
    return level > 0 && level <= 99
      ? `${recordedName} - Lv.${level}`
      : recordedName;
  }

  function displayName(buff, locale, manifest) {
    const recordedName = String(buff?.name || "").trim();
    const names = locale === "en" ? manifest?.namesEn : manifest?.namesKo;
    const rawCode = compactCode(buff?.rawCode);
    const storedCode = compactCode(buff?.code);
    if (rawCode !== storedCode && isCommonAbnormalCode(rawCode)) {
      const exactName = String(names?.[String(rawCode)] || "").trim();
      if (exactName) {
        return exactName;
      }
    }

    if (locale !== "en" && recordedName) {
      return recordedName;
    }

    for (const candidate of [buff?.rawCode, buff?.code]) {
      const name = String(names?.[String(code(candidate))] || "").trim();
      if (name) {
        return name;
      }
    }

    return recordedName || "—";
  }

  globalThis.NotMeterCombatDetailBuffs = Object.freeze({
    displayName,
    iconSource,
    isEnhanced,
    shouldDisplay,
    skillDisplayName,
    skillIconSource,
  });
})();
