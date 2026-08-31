/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { analyzeText, freeLints } from "./harperProvider";
import {
  getCompletions,
  PROTECTED_TERMS,
  type CompletionCandidate,
} from "./completionDictionary";
import {
  getWordBeforeCaret,
  hasBangla,
  hasCompletedSentence,
  isWordFinished,
  lastSentenceStart,
  shouldIgnoreLint,
  getCaretCoordinates,
} from "./textUtils";

export type SuggestionKind = "completion" | "spelling" | "grammar";
export type SuggestionMode = "Replace" | "Remove" | "InsertAfter" | "Unknown";

export interface SmartSuggestion {
  id: string;
  kind: SuggestionKind;
  /** text shown in the popup */
  label: string;
  /** short explanation shown under the label */
  detail?: string;
  /** absolute range inside the input value to replace */
  start: number;
  end: number;
  /** replacement text to put in place of [start, end) */
  replacement: string;
  /** how the replacement should be applied */
  mode: SuggestionMode;
}

export interface UseSmartSuggestionsOptions {
  enabled?: boolean;
  /** debounce delay for Harper (spelling/grammar) analysis */
  debounceMs?: number;
  /** minimum characters typed before offering completions (~3-4) */
  minCompletionChars?: number;
  /** maximum number of popup items */
  maxItems?: number;
  /** invoked with the new value + caret position when a suggestion is applied */
  onApply: (value: string, caret: number) => void;
}

const GRAMMAR_KINDS = new Set([
  "Grammar", "Capitalization", "Punctuation", "Agreement", "Usage",
  "WordChoice", "WordOrder", "Nonstandard", "Repetition", "Style",
  "Eggcorn", "Malapropism", "BoundaryError", "Redundancy", "Enhancement",
  "Regionalism", "Formatting", "Readability", "Miscellaneous",
]);

const isGrammarKind = (kind: string): boolean =>
  GRAMMAR_KINDS.has(kind) || kind === "Typo";

const isSpellingKind = (kind: string): boolean =>
  kind === "Spelling";

const asMode = (mode?: string): SuggestionMode =>
  mode === "Replace" || mode === "Remove" || mode === "InsertAfter"
    ? mode
    : "Unknown";
export const useSmartSuggestions = (options: UseSmartSuggestionsOptions) => {
  const {
    enabled = true,
    debounceMs = 300,
    minCompletionChars = 3,
    maxItems = 6,
    onApply,
  } = options;

  const [items, setItems] = useState<SmartSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const valueRef = useRef("");
  const caretRef = useRef(0);
  const debounceTimerRef = useRef<number | null>(null);
  const seqRef = useRef(0);
  const focusedRef = useRef(false);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const onApplyRef = useRef(onApply);
  onApplyRef.current = onApply;
  const cfgRef = useRef({ debounceMs, minCompletionChars, maxItems });
  cfgRef.current = { debounceMs, minCompletionChars, maxItems };

  const close = useCallback(() => {
    setItems([]);
    setPosition(null);
    setActiveIndex(0);
  }, []);

  const updatePosition = useCallback(() => {
    const el = inputRef.current;
    const anchor = anchorRef.current;
    if (!el || !anchor || !focusedRef.current) return null;
    const coords = getCaretCoordinates(el, caretRef.current);
    const elRect = el.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    const popupWidth = 292;
    let left = elRect.left - anchorRect.left + coords.left;
    let top = elRect.top - anchorRect.top + coords.top - 6;
    // keep the popup inside the anchor horizontally
    left = Math.max(4, Math.min(left, Math.max(4, anchorRect.width - popupWidth - 8)));
    // keep it inside the anchor vertically (popup renders translateY(-100%))
    top = Math.max(4, top);
    return { top, left };
  }, []);

const buildCompletions = useCallback(
    (value: string, caret: number): SmartSuggestion[] => {
      const minLen = cfgRef.current.minCompletionChars;
      const max = cfgRef.current.maxItems;
      if (!value || caret <= 0) return [];
      // Never complete a Bangla character (preserve Unicode untouched).
      const prevChar = value.charAt(Math.max(0, caret - 1));
      if (hasBangla(prevChar)) return [];

      const token = getWordBeforeCaret(value, caret);
      if (!token) return [];
      if (token.text.length < minLen) return [];

      const completions = getCompletions(token.text, max);
      return completions.map(
        (c: CompletionCandidate): SmartSuggestion => ({
          id: `completion-${token.start}-${c.word}`,
          kind: "completion",
          label: c.display,
          detail: "Complete word",
          start: token.start,
          end: caret,
          replacement: c.word,
          mode: "Replace",
        })
      );
    },
    []
  );

  const buildHarperItems = useCallback(
    async (value: string, caret: number): Promise<SmartSuggestion[]> => {
      if (!value.trim()) return [];
      // Fully-Bangla messages are preserved: skip Harper entirely and let the
      // architecture grow a future Bangla provider.
      if (hasBangla(value)) {
        return [];
      }
      const lints = await analyzeText(value);
      if (!lints.length) return [];

      try {
        const spelling: SmartSuggestion[] = [];
        const grammar: SmartSuggestion[] = [];
        const hasCompleteSentence = hasCompletedSentence(value, caret);
        const sentenceStart = hasCompleteSentence
          ? lastSentenceStart(value, caret)
          : caret;

        for (const lint of lints) {
          // Only suggest for text the user has already typed.
          if (lint.end > caret || lint.start > caret) continue;
          if (lint.start >= lint.end) continue;
          if (shouldIgnoreLint(value, lint.start, lint.end, PROTECTED_TERMS)) {
            continue;
          }

          const suggestionIdx = lint.suggestions.findIndex(
            (s, i) => s && s.trim() && lint.suggestionModes[i] !== "Unknown"
          );
          if (suggestionIdx === -1) continue;

          const replacement = lint.suggestions[suggestionIdx];
          const mode = asMode(lint.suggestionModes[suggestionIdx]);
          const base: SmartSuggestion = {
            id: `harper-${lint.kind}-${lint.start}-${suggestionIdx}`,
            kind: "spelling",
            label: replacement || lint.problem,
            detail:
              mode === "Remove"
                ? `Remove "${lint.problem}"`
                : `Fix spelling of "${lint.problem}"`,
            start: lint.start,
            end: lint.end,
            replacement,
            mode,
          };

          if (isSpellingKind(lint.kind)) {
            // Only offer corrections for words the user has actually finished
            // with a space/punctuation (do not nag mid-word).
            if (lint.end < value.length && isWordFinished(value, lint.end)) {
              spelling.push(base);
            }
          } else if (isGrammarKind(lint.kind)) {
            // Grammar suggestions are limited to the last completed sentence.
            if (lint.start >= sentenceStart) {
              grammar.push({
                ...base,
                kind: "grammar",
                detail: `Grammar: ${lint.message || "Improve phrasing"}`,
              });
            }
          }
        }
        return [...spelling, ...grammar].slice(0, cfgRef.current.maxItems);
      } finally {
        freeLints(lints);
      }
    },
    []
  );
const checkWord = useCallback(
    (value: string) => {
      const seq = ++seqRef.current;
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      if (!enabledRef.current) return;

      // Debounced Harper analysis (~300ms) keeps typing fast.
      debounceTimerRef.current = window.setTimeout(async () => {
        if (seq !== seqRef.current) return;
        setIsAnalyzing(true);
        let harper: SmartSuggestion[] = [];
        try {
          harper = await buildHarperItems(value, value.length);
        } finally {
          setIsAnalyzing(false);
        }
        if (seq !== seqRef.current) return;
        const completions = buildCompletions(value, value.length);
        const merged = [...completions, ...harper];
        setItems(merged);
        setActiveIndex(0);
        if (merged.length) {
          requestAnimationFrame(() => {
            setPosition(updatePosition());
          });
        } else {
          setPosition(null);
        }
      }, cfgRef.current.debounceMs);
    },
    [buildHarperItems, buildCompletions, updatePosition]
  );

  /** Call in the input's onChange. */
  const handleChange = useCallback(
    (value: string, caret?: number) => {
      valueRef.current = value;
      caretRef.current = caret ?? value.length;
      if (!enabledRef.current || !focusedRef.current) return;
      checkWord(value);
    },
    [checkWord]
  );

  /** Call when the input gains focus. */
  const handleFocus = useCallback(
    (el: HTMLInputElement | HTMLTextAreaElement) => {
      inputRef.current = el;
      focusedRef.current = true;
      const value = el.value ?? "";
      caretRef.current = el.selectionStart ?? value.length;
      valueRef.current = value;
      checkWord(value);
    },
    [checkWord]
  );

  /** Call when the input loses focus. */
  const handleBlur = useCallback(() => {
    focusedRef.current = false;
    close();
  }, [close]);
/** Apply the currently-active (or specified) suggestion to the input. */
  const applySuggestion = useCallback(
    (index?: number) => {
      const idx = typeof index === "number" ? index : activeIndex;
      const item = items[idx];
      if (!item) return false;
      const el = inputRef.current;
      if (!el) return false;

      const value = valueRef.current;
      let nextValue = value;
      let nextCaret = el.selectionStart ?? value.length;

      if (item.mode === "Remove") {
        nextValue = value.slice(0, item.start) + value.slice(item.end);
        nextCaret = item.start;
      } else if (item.mode === "InsertAfter") {
        nextValue =
          value.slice(0, item.end) + item.replacement + value.slice(item.end);
        nextCaret = item.end + item.replacement.length;
      } else {
        // Replace (default)
        nextValue =
          value.slice(0, item.start) + item.replacement + value.slice(item.end);
        nextCaret = item.start + item.replacement.length;
      }

      valueRef.current = nextValue;
      caretRef.current = nextCaret;

      if (el) {
        el.value = nextValue;
        // Preserve cursor/selection position after applying the correction.
        try {
          el.setSelectionRange(nextCaret, nextCaret);
        } catch {
          /* read-only inputs cannot set selection */
        }
        // Let React's controlled value match the DOM.
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }

      onApplyRef.current?.(nextValue, nextCaret);
      close();
      return true;
    },
    [items, activeIndex, close]
  );

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): boolean => {
      if (!items.length) return false;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return true;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        return true;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        applySuggestion();
        return true;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return true;
      }
      return false;
    },
    [items, applySuggestion, close]
  );

  // Clear pending timers when the component unmounts.
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, []);

  return {
    /** register as the anchor container for the popup (position: relative) */
    anchorRef,
    /** list of suggestions to render (positional) */
    items,
    /** index of the currently-highlighted suggestion */
    activeIndex,
    /** pixel coordinates for the popup (relative to anchor) */
    position,
    /** true while the Harper worker is analyzing */
    isAnalyzing,
    /** bind to the input: ref, onChange, onKeyDown, onFocus, onBlur */
    inputRef,
    handleChange,
    handleKeyDown,
    handleFocus,
    handleBlur,
    applySuggestion,
    close,
  };
};