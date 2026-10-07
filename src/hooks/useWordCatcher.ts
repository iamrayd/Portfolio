"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createWordIndex, trimToPrefix } from "@/lib/word-catcher/matcher";

/** How long to wait for more input when a match is also a prefix ("React" vs "React Native"). */
const AMBIGUOUS_MATCH_DELAY_MS = 700;
const MAX_BUFFER_LENGTH = 24;
const CAUGHT_DISPLAY_MS = 1600;
const TYPEABLE_KEY = /^[a-z0-9+#.\- ]$/i;

interface WordCatcher {
  buffer: string;
  caught: ReadonlySet<string>;
  lastCaught: string | null;
  /** Feed one typed character (used by the mobile keyboard input). */
  type: (char: string) => void;
  backspace: () => void;
  clear: () => void;
}

function isEditableTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    Boolean(target.closest("input, textarea, select, [contenteditable='true']"))
  );
}

/**
 * Tracks what the visitor types anywhere on the page and reports
 * when the buffer spells one of `words`.
 */
export function useWordCatcher(
  words: readonly string[],
  onCatch?: (word: string) => void,
): WordCatcher {
  const index = useMemo(() => createWordIndex(words), [words]);
  const [buffer, setBuffer] = useState("");
  const [caught, setCaught] = useState<ReadonlySet<string>>(() => new Set());
  const [lastCaught, setLastCaught] = useState<string | null>(null);

  const bufferRef = useRef("");
  const pendingRef = useRef<{ word: string; timer: ReturnType<typeof setTimeout> } | null>(null);
  const celebrationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCatchRef = useRef(onCatch);

  useEffect(() => {
    onCatchRef.current = onCatch;
  }, [onCatch]);

  const updateBuffer = useCallback((value: string) => {
    bufferRef.current = value;
    setBuffer(value);
  }, []);

  const cancelPending = useCallback(() => {
    if (pendingRef.current) clearTimeout(pendingRef.current.timer);
    pendingRef.current = null;
  }, []);

  const commit = useCallback(
    (word: string) => {
      cancelPending();
      updateBuffer("");
      setLastCaught(word);
      setCaught((previous) => new Set(previous).add(word));
      onCatchRef.current?.(word);

      if (celebrationRef.current) clearTimeout(celebrationRef.current);
      celebrationRef.current = setTimeout(() => setLastCaught(null), CAUGHT_DISPLAY_MS);
    },
    [cancelPending, updateBuffer],
  );

  const type = useCallback(
    (char: string) => {
      let base = bufferRef.current;
      const pending = pendingRef.current;

      // A pending match that the new character can't extend is caught first.
      if (pending && !index.hasLongerMatch(base + char)) {
        commit(pending.word);
        base = "";
        if (char === " ") return;
      }
      cancelPending();

      const trimmed = trimToPrefix((base + char).slice(-MAX_BUFFER_LENGTH), index);
      const match = trimmed ? index.exact(trimmed) : undefined;

      if (match && index.hasLongerMatch(trimmed)) {
        updateBuffer(trimmed);
        pendingRef.current = {
          word: match,
          timer: setTimeout(() => commit(match), AMBIGUOUS_MATCH_DELAY_MS),
        };
      } else if (match) {
        commit(match);
      } else {
        updateBuffer(trimmed);
        setLastCaught(null);
      }
    },
    [cancelPending, commit, index, updateBuffer],
  );

  const backspace = useCallback(() => {
    cancelPending();
    updateBuffer(bufferRef.current.slice(0, -1));
  }, [cancelPending, updateBuffer]);

  const clear = useCallback(() => {
    cancelPending();
    updateBuffer("");
    setLastCaught(null);
  }, [cancelPending, updateBuffer]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || isEditableTarget(event.target)) return;

      if (event.key === "Escape") return clear();
      if (event.key === "Backspace") return backspace();
      if (!TYPEABLE_KEY.test(event.key)) return;

      // Space would otherwise scroll the page mid-word.
      if (event.key === " ") {
        if (!bufferRef.current) return;
        event.preventDefault();
      }
      type(event.key);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [backspace, clear, type]);

  useEffect(
    () => () => {
      cancelPending();
      if (celebrationRef.current) clearTimeout(celebrationRef.current);
    },
    [cancelPending],
  );

  return { buffer, caught, lastCaught, type, backspace, clear };
}
