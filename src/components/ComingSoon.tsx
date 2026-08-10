import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import styles from "../cssModules/ComingSoon.module.css";

interface Props {
  icon: IconDefinition;
  title: string;
}

function ComingSoon({ icon, title }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.badge}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>This category isn't wired up yet — check back soon.</p>
    </div>
  );
}

export default ComingSoon;
