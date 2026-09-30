import { ArrowUp } from "lucide-react";

import { profile } from "@/data/portfolio";

import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <a className={styles.brand} href="#top" aria-label="Back to top">
          R<span>/</span>D<span>.</span>
        </a>
        <p className={styles.copy}>
          © {new Date().getFullYear()} {profile.name}. Built with Next.js, designed with intention.
        </p>
        <a href="#top" className={styles.backToTop}>
          Back to top <ArrowUp size={16} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
