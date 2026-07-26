(() => {
  "use strict";

  const ENHANCED_PARTY_BUFF_CODES = new Set([
    117800072,
    127800012,
  ]);

  function code(value) {
    const parsed = Math.abs(Number(value) || 0);
    return Number.isSafeInteger(parsed) ? parsed : 0;
  }

  function isEnhanced(buff) {
    return ENHANCED_PARTY_BUFF_CODES.has(code(buff?.code)) ||
      ENHANCED_PARTY_BUFF_CODES.has(code(buff?.rawCode));
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
    isEnhanced,
  });
})();
