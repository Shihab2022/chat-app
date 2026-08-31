/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Small, dependency-free text helpers shared by the smart-suggestion system:
 * Bangla (বাংলা) detection, word/token boundaries, safe-token detection and
 * caret coordinate measurement.
 */

/** Bangla Unicode block: U+0980 – U+09FF */
export const BANGLA_REGEX = /[\u0980-\u09FF]/;

export const hasBangla = (value: string): boolean => BANGLA_REGEX.test(value || "");

/** ASCII letters only (used for word-boundary logic; Bangla text is preserved). */
const ASCII_LETTER = /[A-Za-z]/;

/** Word separators – finishing a word with one of these triggers a spelling check. */
export const WORD_FINISHER = /[\s.,!?;:)\]}"'\u2019\u201d]/;

export interface TokenRange {
  start: number;
  end: number;
  text: string;
}

/**
 * Return the ASCII word that ends exactly at `position` (the word currently
 * being typed). Returns `undefined` when the caret is inside the middle of a
 * word or when there is no ASCII word before the caret.
 */
export const getWordBeforeCaret = (
  value: string,
  position: number
): TokenRange | undefined => {
  if (!value || position <= 0) return undefined;
  let end = position;
  if (end > value.length) end = value.length;

  // If the character right after the caret is also a letter the user is
  // editing the middle of a word – do not offer completions.
  if (end < value.length && ASCII_LETTER.test(value[end])) return undefined;

  let start = end;
  while (start > 0 && ASCII_LETTER.test(value[start - 1])) start -= 1;

  if (start === end) return undefined; // nothing typed yet
  const text = value.slice(start, end);
  if (!ASCII_LETTER.test(text[0])) return undefined;
  return { start, end, text };
};

/** Index of the previous word separator before `position` (or -1). */
export const prevSeparatorIndex = (value: string, position: number): number => {
  for (let i = position - 1; i >= 0; i -= 1) {
    if (WORD_FINISHER.test(value[i])) return i;
  }
  return -1;
};

/** Whether the word that ends at `end` has been finished with a space/punctuation. */
export const isWordFinished = (value: string, end: number): boolean => {
  if (end >= value.length) return true;
  return WORD_FINISHER.test(value[end]);
};

export const containsUrl = (value: string): boolean =>
  /(https?:\/\/|www\.)/i.test(value || "");

export const containsEmail = (value: string): boolean =>
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(value || "");

export const containsNumber = (value: string): boolean =>
  /\d/.test(value || "");

export const containsMentionOrHashtag = (value: string): boolean =>
  /[@#][A-Za-z0-9_]+/.test(value || "");

/**
 * Should a Harper lint be ignored? Guards the rules:
 *  - do not flag URLs, emails, numbers, mentions/hashtags
 *  - do not invent corrections for Bangla text
 *  - do not flag protected names/brands/technical terms
 *  - do not flag capitalised words that look like names (not at sentence start)
 */
export const shouldIgnoreLint = (
  value: string,
  start: number,
  end: number,
  protectedTerms: Set<string>
): boolean => {
  const region = value.slice(start, end);
  if (!region) return true;
  if (hasBangla(region)) return true;
  if (containsUrl(region) || containsEmail(region) || containsNumber(region)) {
    return true;
  }
  if (containsMentionOrHashtag(region)) return true;

  const lower = region.toLowerCase();
  if (protectedTerms.has(lower)) return true;

  // Capitalised tokens that are not the start of a sentence are likely names.
  const isCapitalized = /^[A-Z][a-z]/.test(region) || /^[A-Z]+$/.test(region);
  if (isCapitalized && !isSentenceStart(value, start)) return true;

  // Very short tokens are rarely worth correcting.
  if (region.length <= 2) return true;
  return false;
};

/** True when `index` is the very beginning of a sentence. */
export const isSentenceStart = (value: string, index: number): boolean => {
  const before = value.slice(sentencePartStart(value, index), index);
  return !before.trim() || /[.!?][\s"')\]]*$/.test(before);
};

const sentencePartStart = (value: string, index: number): number => {
  for (let i = index - 1; i >= 0; i -= 1) {
    if (/[.!?]/.test(value[i])) return i + 1;
  }
  return 0;
};

/** Start index of the last complete sentence before `caret`. */
export const lastSentenceStart = (value: string, caret: number): number => {
  for (let i = caret - 1; i >= 0; i -= 1) {
    if (/[.!?]/.test(value[i])) return i + 1;
  }
  return 0;
};

export const hasCompletedSentence = (value: string, caret: number): boolean => {
  const end = Math.min(caret, value.length);
  for (let i = 0; i < end; i += 1) {
    if (/[.!?]/.test(value[i])) return true;
  }
  return false;
};
/**
 * Measure the pixel coordinates of the caret inside an <input>/<textarea>.
 * Returns coordinates relative to the element's bounding box top-left.
 */
export const getCaretCoordinates = (
  element: HTMLInputElement | HTMLTextAreaElement,
  position: number
): { top: number; left: number; height: number } => {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return { top: 0, left: 0, height: 16 };
  }
  const computed = window.getComputedStyle(element);
  const isTextarea = element.tagName === "TEXTAREA";

  const mirror = document.createElement("div");
  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.top = "0";
  mirror.style.left = "0";
  mirror.style.whiteSpace = isTextarea ? "pre-wrap" : "pre";
  mirror.style.wordWrap = isTextarea ? "break-word" : "normal";
  mirror.style.overflow = "hidden";

  const props = [
    "direction", "boxSizing", "width", "height", "overflowX", "overflowY",
    "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth",
    "borderTopStyle", "borderRightStyle", "borderBottomStyle", "borderLeftStyle",
    "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
    "fontStyle", "fontVariant", "fontWeight", "fontStretch", "fontSize",
    "fontSizeAdjust", "lineHeight", "fontFamily", "textAlign", "textTransform",
    "textIndent", "textDecoration", "letterSpacing", "wordSpacing",
    "tabSize", "wordBreak",
  ] as const;

  for (const p of props) {
    try {
      const v = computed.getPropertyValue(p as string);
      if (v) mirror.style.setProperty(p as string, v);
    } catch {
      /* ignore unsupported props */
    }
  }

  const clamped = Math.max(0, Math.min(position, element.value.length));
  const textBefore = element.value.substring(0, clamped);

  mirror.appendChild(document.createTextNode(textBefore));
  const marker = document.createElement("span");
  marker.textContent = ".";
  mirror.appendChild(marker);

  document.body.appendChild(mirror);

  const borderTop = parseInt(computed.borderTopWidth || "0", 10) || 0;
  const borderLeft = parseInt(computed.borderLeftWidth || "0", 10) || 0;

  const result = {
    top: marker.offsetTop + borderTop,
    left: marker.offsetLeft + borderLeft,
    height: Math.max(
      14,
      parseInt(computed.lineHeight || "0", 10) ||
        parseInt(computed.fontSize || "14", 10) * 1.2
    ),
  };
  document.body.removeChild(mirror);
  return result;
};