/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialect,
  LocalLinter,
} from "harper.js";

/**
 * Lazily-created Harper.js linter singleton.
 * - The ~15 MB WebAssembly binary is fetched + compiled lazily on the first
 *   real analysis, so the app shell is never blocked by it.
 * - Runs on the main thread via `LocalLinter` (short chat messages only).
 *
 * A future Bangla provider can reuse the exact same `LintLike` interface.
 */

export interface LintLike {
  /** absolute start offset of the problem inside the analyzed text */
  start: number;
  /** absolute end offset of the problem inside the analyzed text */
  end: number;
  /** the exact misspelled/mistyped text */
  problem: string;
  /** Harper lint category, e.g. "Spelling", "Grammar", "Capitalization" */
  kind: string;
  /** human-readable explanation of the fix */
  message: string;
  /** replacement texts offered for this problem */
  suggestions: string[];
  /** how each suggestion should be applied: Replace | Remove | InsertAfter */
  suggestionModes: Array<"Replace" | "Remove" | "InsertAfter" | "Unknown">;
  raw?: any;
}

let linterPromise: Promise<LocalLinter> | null = null;

const createLinter = async (): Promise<LocalLinter> => {
  // `harper.js/binary` is the package's own WASM loader: it resolves the
  // `harper_wasm_bg.wasm` file relative to its module URL (this is why
  // `harper.js` must stay out of Vite's dep pre-bundling — see vite.config.ts).
  // The ~16 MB binary is only fetched when `linter.setup()` runs below, on the
  // first real analysis.
  const { binary } = await import("harper.js/binary");
  const linter = new LocalLinter({ binary, dialect: Dialect.American });
  // Warm-up: forces the wasm to download + compile and pre-loads config.
  await linter.setup();
  return linter;
};

export const getHarperLinter = (): Promise<LocalLinter> => {
  if (!linterPromise) {
    linterPromise = createLinter().catch((err) => {
      linterPromise = null; // allow retrying on next interaction
      throw err;
    });
  }
  return linterPromise;
};

/** Convert a raw Harper `Lint` (wasm wrapper around `Span`/`Suggestion`) into
 *  our serializable shape. */
const serializeLint = (lint: any): LintLike => {
  const span = lint.span?.();
  const start = Number(span?.start ?? 0);
  const end = Number(span?.end ?? 0);
  const suggestions: string[] = [];
  const suggestionModes: LintLike["suggestionModes"] = [];
  for (const s of lint.suggestions?.() ?? []) {
    try {
      suggestions.push(s.get_replacement_text?.() ?? "");
      const kindCode = s.kind?.();
      const mode =
        kindCode === 0
          ? "Replace"
          : kindCode === 1
          ? "Remove"
          : kindCode === 2
          ? "InsertAfter"
          : "Unknown";
      suggestionModes.push(mode);
    } catch {
      suggestions.push("");
      suggestionModes.push("Unknown");
    }
  }
  return {
    start,
    end,
    problem: lint.get_problem_text?.() ?? "",
    kind: lint.lint_kind?.() ?? "",
    message: lint.message?.() ?? "",
    suggestions,
    suggestionModes,
    raw: lint,
  };
};

/**
 * Run Harper on the given text and return normalized lints.
 * Language is always `plaintext` so links/code inside chat are preserved.
 */
export const analyzeText = async (text: string): Promise<LintLike[]> => {
  const cleaned = text.replace(/\u00a0/g, " ");
  if (!cleaned.trim()) return [];
  try {
    const linter = await getHarperLinter();
    const lints = await linter.lint(cleaned, {
      language: "plaintext",
      dedup: true,
    });
    return (lints ?? []).map(serializeLint);
  } catch (err) {
    // If Harper fails (network/worker/CSP), degrade gracefully to silently
    // offering no corrections instead of crashing the composer.
    console.warn("[smart-suggest] Harper analysis failed:", err);
    return [];
  }
};

/** Free wasm-backed wrappers after use (frees native memory). */
export const freeLints = (lints: LintLike[]): void => {
  for (const lint of lints) {
    try {
      lint.raw?.free?.();
    } catch {
      /* already freed */
    }
  }
};