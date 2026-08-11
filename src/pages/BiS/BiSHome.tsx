import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { BIS_CLASSES } from "../../constants/bis";
import styles from "./BiSHome.module.css";

function BiSHome() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Best in Slot</h1>
        <p className={styles.subtitle}>
          Community-curated gear and consumable guides, by class and spec.
        </p>
      </header>

      <div className={styles.classList}>
        {BIS_CLASSES.map((cls) => (
          <section key={cls.slug} className={styles.classSection}>
            <h2 className={styles.className}>
              <FontAwesomeIcon icon={cls.icon} className={styles.classIcon} />
              {cls.name}
            </h2>
            <div className={styles.specGrid}>
              {cls.specs.map((spec) =>
                spec.hasData ? (
                  <Link
                    key={spec.slug}
                    to={`/bis/${cls.slug}/${spec.slug}`}
                    className={styles.specCard}
                  >
                    <span className={styles.specName}>{spec.name}</span>
                    <span className={styles.specStatus}>View guide</span>
                  </Link>
                ) : (
                  <div
                    key={spec.slug}
                    className={`${styles.specCard} ${styles.specCardDisabled}`}
                    aria-disabled="true"
                  >
                    <span className={styles.specName}>{spec.name}</span>
                    <span className={styles.specStatus}>
                      <FontAwesomeIcon icon={faLock} /> Coming soon
                    </span>
                  </div>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default BiSHome;
