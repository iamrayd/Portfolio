"use client";

import { useEffect, useState } from "react";

/** Returns the id of the section currently crossing the upper-middle of the viewport. */
export function useActiveSection<T extends string>(ids: readonly T[]): T | null {
  const [active, setActive] = useState<T | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as T);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    // Clear the highlight when scrolling back up into the hero.
    const hero = document.getElementById("top");
    const heroObserver = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setActive(null),
      { rootMargin: "-35% 0px -60% 0px" },
    );
    if (hero) heroObserver.observe(hero);

    return () => {
      observer.disconnect();
      heroObserver.disconnect();
    };
  }, [ids]);

  return active;
}
