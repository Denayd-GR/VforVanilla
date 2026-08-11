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
  WEAPON_SUBCLASS_GROUP_OPTIONS,
  WEAPON_CATEGORY_ID,
  MOUNT_CATEGORY_ID,
  ARMOR_TYPE_GROUPS,
  ARMOR_TYPE_SLOT_OPTIONS,
  getQualityColor,
  getWeaponTypeOptionsForGroup,
  getArmorTypeOption,
  DEFAULT_ITEM_CATEGORY,
} from "../../constants/items";
import type { ItemsQueryParams, LookupOption } from "../../types";
import styles from "./ItemFilters.module.css";

const ARMOR_CATEGORY_ID = 4;
const CONTAINER_CATEGORY_ID = 1;

interface Props {
  value: ItemsQueryParams;
  onChange: (next: ItemsQueryParams) => void;
}

function parseOptionalNumber(raw: string): number | undefined {
  if (raw === "") return undefined;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? undefined : parsed;
}

interface OptionGroup {
  label: string;
  options: LookupOption[];
}

interface FilterSelectProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  options?: LookupOption[];
  groups?: OptionGroup[];
  placeholder?: string;
  disabled?: boolean;
  label: string;
  includeBlankOption?: boolean;
}

function FilterSelect({
  value,
  onChange,
  options,
  groups,
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
        {groups
          ? groups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            ))
          : options?.map((opt) => (
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
  const [weaponGroup, setWeaponGroup] = useState<number | undefined>(undefined);
  const [armorTypeId, setArmorTypeId] = useState<number | undefined>(undefined);
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
    setWeaponGroup(undefined);
    setArmorTypeId(undefined);
  }

  function handleReset() {
    const defaults = { itemClass: DEFAULT_ITEM_CATEGORY };
    debouncedCommit.clear();
    setDraft(defaults);
    onChange(defaults);
    setWeaponGroup(undefined);
    setArmorTypeId(undefined);
  }

  const isWeaponCategory = draft.itemClass === WEAPON_CATEGORY_ID;
  const isArmorCategory = draft.itemClass === ARMOR_CATEGORY_ID;
  const isContainerCategory = draft.itemClass === CONTAINER_CATEGORY_ID;
  const isMountCategory = draft.itemClass === MOUNT_CATEGORY_ID;

  const selectedArmorType = getArmorTypeOption(armorTypeId);
  const armorAllowsSlot = selectedArmorType?.allowsSlot === true;

  // For weapons, "Subclass" picks a family (One-Handed/Two-Handed/Ranged/Other)
  // rather than a real item_template.subclass value — it just scopes which
  // specific weapon types the "Slot" field offers next.
  // For armor, "Subclass" picks a type (Cloth, Amulets, Cloaks, ...); each
  // type maps to its own real subclass and/or inventory_type value, so both
  // fields are set together and stale values from a previous pick never linger.
  function handleSubclassChange(id: number | undefined) {
    if (isWeaponCategory) {
      setWeaponGroup(id);
      updateImmediate({ subclass: undefined });
    } else if (isArmorCategory) {
      setArmorTypeId(id);
      const opt = getArmorTypeOption(id);
      updateImmediate({ subclass: opt?.subclass, inventoryType: opt?.inventoryType });
    } else {
      updateImmediate({ subclass: id });
    }
  }

  // For weapons, "Slot" holds the real subclass id (Dagger, Bow, etc.). For
  // armor it only activates when the chosen type is Cloth/Leather/Mail/Plate,
  // narrowing that same subclass down to a specific equip slot. Everywhere
  // else it holds the equip slot (inventoryType) as before.
  function handleSlotChange(id: number | undefined) {
    if (isWeaponCategory) {
      updateImmediate({ subclass: id });
    } else {
      updateImmediate({ inventoryType: id });
    }
  }

  const subclassOptions = useMemo(() => {
    if (isWeaponCategory) return WEAPON_SUBCLASS_GROUP_OPTIONS;
    if (isArmorCategory || isMountCategory || draft.itemClass === undefined) return [];
    return ITEM_CLASSES.find((c) => c.id === draft.itemClass)?.subclasses ?? [];
  }, [draft.itemClass, isWeaponCategory, isArmorCategory, isMountCategory]);

  const slotOptions = useMemo(() => {
    if (isWeaponCategory) return getWeaponTypeOptionsForGroup(weaponGroup);
    if (isArmorCategory) return armorAllowsSlot ? ARMOR_TYPE_SLOT_OPTIONS : [];
    return [];
  }, [isWeaponCategory, isArmorCategory, weaponGroup, armorAllowsSlot]);

  // Mounts are never equippable (inventory_type is always 0) and their real
  // item_template.subclass is always 0 too, so neither Subclass nor Slot has
  // a usable value to offer — both are disabled the same way Container hides Slot.
  const isSlotNotApplicable = isContainerCategory || isMountCategory || (isArmorCategory && !armorAllowsSlot);

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
            value={isWeaponCategory ? weaponGroup : isArmorCategory ? armorTypeId : draft.subclass}
            onChange={handleSubclassChange}
            options={isArmorCategory ? undefined : subclassOptions}
            groups={isArmorCategory ? ARMOR_TYPE_GROUPS : undefined}
            placeholder={draft.itemClass === undefined ? "Pick a category first" : "Any subclass"}
            disabled={!isArmorCategory && subclassOptions.length === 0}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Slot</span>
          <FilterSelect
            label={isWeaponCategory ? "Weapon type" : "Equip slot"}
            value={
              isWeaponCategory
                ? draft.subclass
                : isSlotNotApplicable
                  ? undefined
                  : draft.inventoryType
            }
            onChange={handleSlotChange}
            options={slotOptions}
            placeholder={
              isSlotNotApplicable
                ? "Not Applicable"
                : isWeaponCategory
                  ? weaponGroup === undefined
                    ? "Pick a subclass first"
                    : "Any type"
                  : "Any slot"
            }
            disabled={isSlotNotApplicable || (isWeaponCategory && slotOptions.length === 0)}
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
