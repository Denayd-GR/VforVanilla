import type { ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faChevronLeft,
  faChevronRight,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { ITEMS_PER_PAGE_OPTIONS } from "../../constants/items";
import styles from "./Pagination.module.css";

interface Props {
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

function Pagination({ page, totalPages, limit, onPageChange, onLimitChange }: Props) {
  const atStart = page <= 1;
  const atEnd = page >= totalPages;

  function handleLimitChange(e: ChangeEvent<HTMLSelectElement>) {
    onLimitChange(Number(e.target.value));
  }

  return (
    <nav className={styles.bar} aria-label="Pagination">
      <div className={styles.controls}>
        <button type="button" onClick={() => onPageChange(1)} disabled={atStart} aria-label="First page">
          <FontAwesomeIcon icon={faAnglesLeft} />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={atStart}
          aria-label="Previous page"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <span className={styles.pageIndicator}>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={atEnd}
          aria-label="Next page"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={atEnd}
          aria-label="Last page"
        >
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>
      <label className={styles.limitField}>
        <span>Per page</span>
        <select value={limit} onChange={handleLimitChange} aria-label="Items per page">
          {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>
    </nav>
  );
}

export default Pagination;
