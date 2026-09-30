"use client";

import { Keyboard } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import { useWordCatcher } from "@/hooks/useWordCatcher";
import { FallingWordsEngine } from "@/lib/falling-words/engine";

import styles from "./FallingWords.module.css";

interface FallingWordsProps {
  words: readonly string[];
}

function resolveFontFamily(): string {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-michroma");
  return family.trim() || "sans-serif";
}

/**
 * Full-screen canvas of drifting tech words. Typing a word anywhere on the
 * page turns it red letter by letter, and completing it shatters the word.
 */
export function FallingWords({ words }: FallingWordsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<FallingWordsEngine | null>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const handleCatch = useCallback((word: string) => engineRef.current?.catchWord(word), []);
  const { buffer, caught, lastCaught, type, backspace } = useWordCatcher(words, handleCatch);

  const uniqueWordCount = new Set(words).size;
  const allCaught = caught.size === uniqueWordCount;
  const isVisible = Boolean(buffer || lastCaught);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const engine = new FallingWordsEngine(canvas, {
      words,
      fontFamily: resolveFontFamily(),
      reducedMotion,
    });
    engineRef.current = engine;
    engine.start();
    // Sprites drawn before the web font loaded would keep the fallback font.
    void document.fonts.ready.then(() => engine.invalidateSprites());

    const onResize = () => engine.resize();
    const onScroll = () => engine.notifyScroll();
    const onVisibilityChange = () => (document.hidden ? engine.stop() : engine.resume());

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      engine.stop();
      engineRef.current = null;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [words]);

  useEffect(() => {
    engineRef.current?.setQuery(buffer);
  }, [buffer]);

  // Touch devices have no physical keyboard, so a hidden input feeds the same game.
  useEffect(() => {
    const input = mobileInputRef.current;
    if (!input) return;

    const onBeforeInput = (event: InputEvent) => {
      event.preventDefault();
      if (event.inputType === "deleteContentBackward") return backspace();
      for (const char of event.data ?? "") type(char);
    };

    input.addEventListener("beforeinput", onBeforeInput);
    return () => input.removeEventListener("beforeinput", onBeforeInput);
  }, [backspace, type]);

  const label = allCaught && lastCaught ? "All caught" : lastCaught ? "Caught" : "Typing";

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <div
        className={styles.hud}
        data-visible={isVisible}
        data-caught={Boolean(lastCaught)}
        role="status"
        aria-live="polite"
      >
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>
          {lastCaught ?? buffer}
          <span className={styles.caret} aria-hidden="true">
            _
          </span>
        </span>
        <span className={styles.count}>
          {caught.size}/{uniqueWordCount}
        </span>
      </div>

      <button
        type="button"
        className={styles.keyboardButton}
        onClick={() => mobileInputRef.current?.focus()}
        aria-label="Open keyboard to catch falling words"
      >
        <Keyboard size={18} aria-hidden="true" />
      </button>
      <input
        ref={mobileInputRef}
        className={styles.mobileInput}
        type="text"
        inputMode="text"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Type a falling word to catch it"
        tabIndex={-1}
      />
    </>
  );
}
