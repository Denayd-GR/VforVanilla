import { useEffect, useState } from "react";
import { fetchItems } from "../../api/items";
import type { ItemsQueryParams, ItemSummary, PaginatedResult } from "../../types";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEM_CATEGORY } from "../../constants/items";
import ItemFilters from "./ItemFilters";
import ItemResults from "./ItemResults";
import Pagination from "./Pagination";
import styles from "./Items.module.css";

function Items() {
  const [filters, setFilters] = useState<ItemsQueryParams>({ itemClass: DEFAULT_ITEM_CATEGORY });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [result, setResult] = useState<PaginatedResult<ItemSummary> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchItems({ ...filters, page, limit })
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load items. The server may be unreachable.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, page, limit]);

  function handleFiltersChange(next: ItemsQueryParams) {
    setPage(1);
    setFilters(next);
  }

  function handleLimitChange(next: number) {
    setPage(1);
    setLimit(next);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Items</h1>
        {result && (
          <p className={styles.count}>{result.total.toLocaleString()} total</p>
        )}
      </header>

      <ItemFilters value={filters} onChange={handleFiltersChange} />

      {error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          <ItemResults
            key={result ? `${result.page}-${result.limit}-${result.total}` : "empty"}
            items={result?.data ?? []}
            loading={loading}
          />
          {result && result.total > 0 && (
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={handleLimitChange}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Items;
