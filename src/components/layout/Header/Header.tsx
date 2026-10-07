"use client";

import { useLenis } from "lenis/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { sections, type SectionId } from "@/data/navigation";
import { profile } from "@/data/portfolio";
import { useActiveSection } from "@/hooks/useActiveSection";

import styles from "./Header.module.css";

const SCROLLED_THRESHOLD = 24;
const sectionIds = sections.map((section) => section.id);

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(sectionIds);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLLED_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Freeze the page behind the open mobile menu and let Escape close it.
  useEffect(() => {
    if (!menuOpen) return;
    lenis?.stop();
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, lenis]);

  const closeMenu = () => setMenuOpen(false);

  // Lenis ignores scroll requests while stopped, so restart it before jumping.
  const navigateFromMenu = (id: SectionId) => {
    closeMenu();
    if (lenis) {
      lenis.start();
      lenis.scrollTo(`#${id}`);
    } else {
      document.getElementById(id)?.scrollIntoView();
    }
  };

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled || menuOpen}>
        <div className={styles.inner}>
          <a
            className={styles.brand}
            href="#top"
            aria-label={`${profile.name}, back to top`}
            onClick={closeMenu}
          >
            R<span>/</span>D<span>.</span>
          </a>

          <nav className={styles.nav} aria-label="Main">
            {sections.map(({ id, label }) => (
              <NavLink key={id} id={id} label={label} active={active === id} />
            ))}
          </nav>

          <a className={styles.availability} href="#contact-me">
            <span className={styles.pulse} aria-hidden="true" />
            Available for work
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>

          <button
            type="button"
            className={styles.menuButton}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <AnimatePresence>{menuOpen && <MobileMenu onNavigate={navigateFromMenu} />}</AnimatePresence>
    </>
  );
}

function NavLink({ id, label, active }: { id: SectionId; label: string; active: boolean }) {
  return (
    <a
      href={`#${id}`}
      className={styles.link}
      data-active={active}
      aria-current={active ? "location" : undefined}
    >
      {active && (
        <motion.span
          layoutId="nav-indicator"
          className={styles.indicator}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      <span className={styles.linkText}>{label}</span>
    </a>
  );
}

function MobileMenu({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  return (
    <motion.div
      id="mobile-menu"
      className={styles.mobileMenu}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.6 }}
    >
      <nav aria-label="Mobile">
        {sections.map(({ id, label }, index) => (
          <motion.a
            key={id}
            href={`#${id}`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(id);
            }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 + index * 0.05 }}
          >
            {label}
            <ArrowUpRight size={22} aria-hidden="true" />
          </motion.a>
        ))}
      </nav>
      <p className={styles.mobileFooter}>
        {profile.name}
        <span>Full-stack developer</span>
      </p>
    </motion.div>
  );
}
