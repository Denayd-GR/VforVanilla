import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import {
  getClassIcon,
  getClassLabel,
  getSubclassLabel,
  getQualityColor,
  getInventoryTypeLabel,
} from "../../constants/items";
import type { ItemSummary } from "../../types";
import styles from "./ItemResults.module.css";

interface Props {
  items: ItemSummary[];
  loading: boolean;
}

// How long the button shows a "copied" checkmark before reverting to the copy icon.
const COPIED_FEEDBACK_MS = 1500;

function ItemResults({ items, loading }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const [copiedEntry, setCopiedEntry] = useState<number | null>(null);

  async function handleCopy(entry: number) {
    await navigator.clipboard.writeText(`.add item ${entry}`);
    setCopiedEntry(entry);
    setTimeout(() => setCopiedEntry((current) => (current === entry ? null : current)), COPIED_FEEDBACK_MS);
  }

  if (loading && items.length === 0) {
    return <p className={styles.status}>Loading items…</p>;
  }

  if (!loading && items.length === 0) {
    return <p className={styles.status}>No items match these filters.</p>;
  }

  return (
    <motion.ul
      className={`${styles.list} ${loading ? styles.listLoading : ""}`}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {items.map((item) => (
        <li key={`${item.entry}-${item.patch}`} className={styles.row}>
          <Link to={`/items/${item.entry}`} className={styles.rowLink}>
            <span className={styles.badge} style={{ borderColor: getQualityColor(item.quality) }}>
              <FontAwesomeIcon icon={getClassIcon(item.class)} />
            </span>
            <div className={styles.info}>
              <span className={styles.name} style={{ color: getQualityColor(item.quality) }}>
                {item.name || "Unnamed Item"}
              </span>
              <span className={styles.meta}>
                {getClassLabel(item.class)} · {getSubclassLabel(item.class, item.subclass)}
                {item.inventory_type > 0 ? ` · ${getInventoryTypeLabel(item.inventory_type)}` : ""}
              </span>
            </div>
            <div className={styles.levels}>
              <span className={styles.levelChip}>Lvl {item.required_level}</span>
              <span className={styles.levelChip}>ilvl {item.item_level}</span>
            </div>
          </Link>
          <button
            type="button"
            className={styles.copyButton}
            onClick={() => handleCopy(item.entry)}
            aria-label={`Copy .add item ${item.entry} to clipboard`}
          >
            <FontAwesomeIcon icon={copiedEntry === item.entry ? faCheck : faCopy} />
          </button>
        </li>
      ))}
    </motion.ul>
  );
}

export default ItemResults;
