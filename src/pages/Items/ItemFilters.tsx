import { useEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties } from "react";
import debounce from "debounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faArrowRotateLeft,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  QUALITY_FILTER_OPTIONS,
  ITEM_CLASSES,
  CATEGORY_FILTER_OPTIONS,
  getQualityColor,
  getSlotOptionsForCategory,
  DEFAULT_ITEM_CATEGORY,
} from "../../constants/items";
import type { ItemsQueryParams, LookupOption } from "../../types";
import styles from "./ItemFilters.module.css";

interface Props {
  value: ItemsQueryParams;
  onChange: (next: ItemsQueryParams) => void;
}

function parseOptionalNumber(raw: string): number | undefined {
  if (raw === "") return undefined;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? undefined : parsed;
}

interface FilterSelectProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  options: LookupOption[];
  placeholder?: string;
  disabled?: boolean;
  label: string;
  includeBlankOption?: boolean;
}

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  label,
  includeBlankOption = true,
}: FilterSelectProps) {
  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange(e.target.value === "" ? undefined : Number(e.target.value));
  }

  return (
    <div className={styles.selectWrap}>
      <select
        className={styles.select}
        value={value ?? ""}
        disabled={disabled}
        onChange={handleChange}
        aria-label={label}
      >
        {includeBlankOption && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
      <FontAwesomeIcon icon={faCaretDown} className={styles.selectCaret} />
    </div>
  );
}

function ItemFilters({ value, onChange }: Props) {
  const [draft, setDraft] = useState<ItemsQueryParams>(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const debouncedCommit = useMemo(
    () => debounce((next: ItemsQueryParams) => onChangeRef.current(next), 350),
    [],
  );

  useEffect(() => () => debouncedCommit.clear(), [debouncedCommit]);

  function updateImmediate(patch: Partial<ItemsQueryParams>) {
    const next = { ...draft, ...patch };
    setDraft(next);
    debouncedCommit.clear();
    onChange(next);
  }

  function updateName(e: ChangeEvent<HTMLInputElement>) {
    const nameValue = e.target.value;
    const next = { ...draft, name: nameValue || undefined };
    setDraft(next);
    debouncedCommit(next);
  }

  function handleClassChange(itemClass: number | undefined) {
    updateImmediate({ itemClass, subclass: undefined, inventoryType: undefined });
  }

  function handleReset() {
    const defaults = { itemClass: DEFAULT_ITEM_CATEGORY };
    debouncedCommit.clear();
    setDraft(defaults);
    onChange(defaults);
  }

  const subclassOptions = useMemo(() => {
    if (draft.itemClass === undefined) return [];
    return ITEM_CLASSES.find((c) => c.id === draft.itemClass)?.subclasses ?? [];
  }, [draft.itemClass]);

  const slotOptions = useMemo(
    () => getSlotOptionsForCategory(draft.itemClass),
    [draft.itemClass],
  );

  const isAtDefaults =
    Object.keys(draft).length === 1 && draft.itemClass === DEFAULT_ITEM_CATEGORY;
  const hasActiveFilters = !isAtDefaults;

  return (
    <section className={styles.panel}>
      <div className={styles.searchRow}>
        <div className={styles.searchField}>
          <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search item name…"
            value={draft.name ?? ""}
            onChange={updateName}
            aria-label="Search item name"
          />
        </div>
        <button
          type="button"
          className={styles.resetButton}
          onClick={handleReset}
          disabled={!hasActiveFilters}
        >
          <FontAwesomeIcon icon={faArrowRotateLeft} />
          Reset
        </button>
      </div>

      <div className={styles.qualityRow} role="group" aria-label="Filter by quality">
        <button
          type="button"
          className={`${styles.qualityPill} ${draft.quality === undefined ? styles.qualityPillActive : ""}`}
          onClick={() => updateImmediate({ quality: undefined })}
        >
          All
        </button>
        {QUALITY_FILTER_OPTIONS.map((q) => (
          <button
            key={q.id}
            type="button"
            className={`${styles.qualityPill} ${draft.quality === q.id ? styles.qualityPillActive : ""}`}
            style={{ "--pill-color": getQualityColor(q.id) } as CSSProperties}
            onClick={() => updateImmediate({ quality: draft.quality === q.id ? undefined : q.id })}
          >
            {q.label}
          </button>
        ))}
      </div>

      <div className={styles.fieldsRow}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Category</span>
          <FilterSelect
            label="Item category"
            value={draft.itemClass}
            onChange={handleClassChange}
            options={CATEGORY_FILTER_OPTIONS}
            includeBlankOption={false}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Subclass</span>
          <FilterSelect
            label="Item subclass"
            value={draft.subclass}
            onChange={(subclass) => updateImmediate({ subclass })}
            options={subclassOptions}
            placeholder={draft.itemClass === undefined ? "Pick a category first" : "Any subclass"}
            disabled={subclassOptions.length === 0}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Slot</span>
          <FilterSelect
            label="Equip slot"
            value={draft.inventoryType}
            onChange={(inventoryType) => updateImmediate({ inventoryType })}
            options={slotOptions}
            placeholder="Any slot"
          />
        </label>
      </div>

      <div className={styles.rangeRow}>
        <div className={styles.rangeField}>
          <span className={styles.fieldLabel}>Required Level</span>
          <div className={styles.rangeInputs}>
            <input
              type="number"
              min={0}
              max={60}
              placeholder="Min"
              value={draft.requiredLevelMin ?? ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateImmediate({ requiredLevelMin: parseOptionalNumber(e.target.value) })
              }
              aria-label="Minimum required level"
            />
            <span className={styles.rangeDash}>–</span>
            <input
              type="number"
              min={0}
              max={60}
              placeholder="Max"
              value={draft.requiredLevelMax ?? ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateImmediate({ requiredLevelMax: parseOptionalNumber(e.target.value) })
              }
              aria-label="Maximum required level"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ItemFilters;
