import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="hero" className={styles.hero} aria-label="Introduction">
      {/* Soft animated glow layers to create a premium dark-glass backdrop. */}
      <div className={styles.heroBg} aria-hidden>
        <span className={`${styles.heroOrb} ${styles.heroOrbOne}`} />
        <span className={`${styles.heroOrb} ${styles.heroOrbTwo}`} />
      </div>

      <div className={styles.heroCard}>
        <p className={styles.heroBadge}>Available for selected projects</p>
        <h1 className={styles.heroHeadline}>Habib Hussaini</h1>
        <p className={styles.heroSubheadline}>Senior Graphic Designer</p>
        <p className={styles.heroSupporting}>Branding • Print • Visual Systems</p>

        <div className={styles.heroCtaRow}>
          {/* TODO: Add id="featured-work" to the featured-work section so this anchor scrolls correctly. */}
          <a className={`${styles.heroCta} ${styles.heroCtaPrimary}`} href="#featured-work">
            <span>View Featured Work</span>
            <span className={styles.heroArrow} aria-hidden>
              →
            </span>
          </a>

          {/* TODO: Add id="contact" or id="footer" to the contact/footer area for reliable anchor scrolling. */}
          <a className={`${styles.heroCta} ${styles.heroCtaSecondary}`} href="#footer">
            Contact
          </a>
        </div>

        <p className={styles.heroMeta}>Based in Kabul • Available for projects</p>
      </div>
    </section>
  );
}
