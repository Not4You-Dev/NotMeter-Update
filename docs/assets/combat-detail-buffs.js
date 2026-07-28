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

  function displayName(buff, locale, manifest) {
    const recordedName = String(buff?.name || "").trim();
    if (locale !== "en" && recordedName) {
      return recordedName;
    }

    const names = locale === "en" ? manifest?.namesEn : manifest?.namesKo;
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
  });
})();
