"use client";

import type { PointerEvent } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

/** Exposes the pointer position as CSS variables so a radial glow can follow it. */
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <div className={className} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}
