"use client";

import { Keyboard } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { useWordCatcher } from "@/hooks/useWordCatcher";
import { normalizeWord, rawPrefixLength } from "@/lib/word-catcher/matcher";

import { toolIcons, type ToolIcon } from "./toolIcons";
import styles from "./Toolkit.module.css";
import { TypingHud } from "./TypingHud";

interface ToolGridProps {
  groups: Record<string, readonly string[]>;
}

/**
 * The toolkit as logo chips. Typing a tool's name anywhere on the page
 * lights up its letters as you go, and a finished name glows red.
 */
export function ToolGrid({ groups }: ToolGridProps) {
  const tools = useMemo(() => Object.values(groups).flat(), [groups]);
  const { buffer, caught, lastCaught, type, backspace } = useWordCatcher(tools);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const query = normalizeWord(buffer);

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

  const typedLength = (tool: string) =>
    query && normalizeWord(tool).startsWith(query) ? rawPrefixLength(tool, query.length) : 0;

  return (
    <>
      <div className={styles.groups}>
        {Object.entries(groups).map(([group, items], index) => (
          <Reveal key={group} delay={index * 0.1} className={styles.group}>
            <h3 className={styles.groupHeading}>
              {group}
              <span>{items.length}</span>
            </h3>
            <ul className={styles.chips}>
              {items.map((tool) => (
                <ToolChip
                  key={tool}
                  name={tool}
                  icon={toolIcons[tool]}
                  typed={typedLength(tool)}
                  lit={caught.has(tool)}
                  justLit={lastCaught === tool}
                />
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <p className={styles.progress}>
        <span>
          {caught.size}/{tools.length} lit
        </span>
        <button
          type="button"
          className={styles.keyboardButton}
          onClick={() => mobileInputRef.current?.focus()}
        >
          <Keyboard size={16} aria-hidden="true" />
          Tap to type a tool
        </button>
      </p>
      <input
        ref={mobileInputRef}
        className={styles.mobileInput}
        type="text"
        inputMode="text"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Type a tool's name to light it up"
        tabIndex={-1}
      />

      <TypingHud buffer={buffer} lastLit={lastCaught} litCount={caught.size} total={tools.length} />
    </>
  );
}

interface ToolChipProps {
  name: string;
  icon: ToolIcon | undefined;
  /** Number of leading characters the visitor has typed so far. */
  typed: number;
  lit: boolean;
  justLit: boolean;
}

function ToolChip({ name, icon, typed, lit, justLit }: ToolChipProps) {
  return (
    <li className={styles.chip} data-lit={lit} data-just-lit={justLit}>
      {icon && <ToolLogo icon={icon} />}
      <span>
        <span className={styles.typed}>{name.slice(0, typed)}</span>
        {name.slice(typed)}
      </span>
    </li>
  );
}

function ToolLogo({ icon }: { icon: ToolIcon }) {
  const style = { "--brand": icon.color } as React.CSSProperties;

  if (icon.kind === "lucide") {
    return <icon.Icon className={styles.logo} style={style} size={18} aria-hidden="true" />;
  }
  return (
    <svg className={styles.logo} style={style} viewBox={icon.viewBox} aria-hidden="true">
      <path d={icon.path} fillRule={icon.evenOdd ? "evenodd" : undefined} />
    </svg>
  );
}
