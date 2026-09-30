/**
 * Pure matching logic for the "type to catch" game.
 * Kept free of React and DOM so it is easy to reason about and test.
 */

/** Lowercases and drops spacing punctuation so "nextjs" matches "Next.js". Keeps + and # so "C++" and "C#" stay distinct. */
export function normalizeWord(value: string): string {
  return value.toLowerCase().replace(/[\s.\-]/g, "");
}

export interface WordIndex {
  /** Returns the original word whose normalized form equals `query`. */
  exact(query: string): string | undefined;
  /** True if any word starts with `query`. */
  hasPrefix(query: string): boolean;
  /** True if some word other than an exact match still starts with `query`. */
  hasLongerMatch(query: string): boolean;
}

export function createWordIndex(words: readonly string[]): WordIndex {
  const entries = words.map((word) => ({ word, key: normalizeWord(word) }));

  return {
    exact(query) {
      const key = normalizeWord(query);
      return entries.find((entry) => entry.key === key)?.word;
    },
    hasPrefix(query) {
      const key = normalizeWord(query);
      return entries.some((entry) => entry.key.startsWith(key));
    },
    hasLongerMatch(query) {
      const key = normalizeWord(query);
      return entries.some((entry) => entry.key.length > key.length && entry.key.startsWith(key));
    },
  };
}

/**
 * Drops leading characters until the buffer is a prefix of some word,
 * so a typo early on doesn't block the rest of the input.
 */
export function trimToPrefix(buffer: string, index: WordIndex): string {
  let candidate = buffer;
  while (candidate && !index.hasPrefix(candidate)) {
    candidate = candidate.slice(1);
  }
  return candidate.trimStart();
}

/**
 * Number of raw characters in `word` covered by a normalized prefix of `length`.
 * Used to color exactly the typed letters, e.g. "nextj" covers "Next.j" (6 chars).
 */
export function rawPrefixLength(word: string, length: number): number {
  if (length <= 0) return 0;
  let matched = 0;
  for (let i = 0; i < word.length; i++) {
    if (normalizeWord(word[i]) !== "") matched++;
    if (matched === length) return i + 1;
  }
  return word.length;
}
