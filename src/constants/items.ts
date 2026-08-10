import {
  faFlask,
  faBagShopping,
  faHammer,
  faGem,
  faShieldHalved,
  faMortarPestle,
  faCrosshairs,
  faLayerGroup,
  faCube,
  faScroll,
  faCoins,
  faBoxArchive,
  faCircleQuestion,
  faKey,
  faDice,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { LookupOption, ItemClassOption, MoneyBreakdown } from "../types";

// VMaNGOS is a 1.12 "Vanilla" world DB — these mirror the client's original
// ItemClass/ItemSubclass/InventoryType enums, not the modern retail tables.

export const QUALITIES: LookupOption[] = [
  { id: 0, label: "Poor" },
  { id: 1, label: "Common" },
  { id: 2, label: "Uncommon" },
  { id: 3, label: "Rare" },
  { id: 4, label: "Epic" },
  { id: 5, label: "Legendary" },
  { id: 6, label: "Artifact" },
];

const QUALITY_VAR_BY_ID: Record<number, string> = {
  0: "var(--color-quality-0)",
  1: "var(--color-quality-1)",
  2: "var(--color-quality-2)",
  3: "var(--color-quality-3)",
  4: "var(--color-quality-4)",
  5: "var(--color-quality-5)",
  6: "var(--color-quality-6)",
};

export function getQualityColor(quality: number): string {
  return QUALITY_VAR_BY_ID[quality] ?? QUALITY_VAR_BY_ID[1];
}

export function getQualityLabel(quality: number): string {
  return QUALITIES.find((q) => q.id === quality)?.label ?? "Unknown";
}

// Quality filter pills only offer the tiers worth hunting for — items below
// Rare are still labeled/colored correctly via QUALITIES when they show up
// in unfiltered results, just not selectable as a filter.
const QUALITY_FILTER_IDS = [3, 4, 5, 6];

export const QUALITY_FILTER_OPTIONS: LookupOption[] = QUALITIES.filter((q) =>
  QUALITY_FILTER_IDS.includes(q.id),
);

export const ITEM_CLASSES: ItemClassOption[] = [
  {
    id: 0,
    label: "Consumable",
    icon: faFlask,
    subclasses: [
      { id: 0, label: "Consumable" },
      { id: 1, label: "Potion" },
      { id: 2, label: "Elixir" },
      { id: 3, label: "Flask" },
      { id: 4, label: "Scroll" },
      { id: 5, label: "Food & Drink" },
      { id: 6, label: "Item Enhancement" },
      { id: 7, label: "Bandage" },
      { id: 8, label: "Other" },
    ],
  },
  {
    id: 1,
    label: "Container",
    icon: faBagShopping,
    subclasses: [
      { id: 0, label: "Bag" },
      { id: 1, label: "Soul Bag" },
      { id: 2, label: "Herb Bag" },
      { id: 3, label: "Enchanting Bag" },
      { id: 4, label: "Engineering Bag" },
    ],
  },
  {
    id: 2,
    label: "Weapon",
    icon: faHammer,
    subclasses: [
      { id: 0, label: "One-Handed Axe" },
      { id: 1, label: "Two-Handed Axe" },
      { id: 2, label: "Bow" },
      { id: 3, label: "Gun" },
      { id: 4, label: "One-Handed Mace" },
      { id: 5, label: "Two-Handed Mace" },
      { id: 6, label: "Polearm" },
      { id: 7, label: "One-Handed Sword" },
      { id: 8, label: "Two-Handed Sword" },
      { id: 10, label: "Staff" },
      { id: 13, label: "Fist Weapon" },
      { id: 14, label: "Miscellaneous" },
      { id: 15, label: "Dagger" },
      { id: 16, label: "Thrown" },
      { id: 18, label: "Crossbow" },
      { id: 19, label: "Wand" },
      { id: 20, label: "Fishing Pole" },
    ],
  },
  {
    id: 3,
    label: "Gem",
    icon: faGem,
    subclasses: [{ id: 0, label: "Gem" }],
  },
  {
    id: 4,
    label: "Armor",
    icon: faShieldHalved,
    subclasses: [
      { id: 0, label: "Miscellaneous" },
      { id: 1, label: "Cloth" },
      { id: 2, label: "Leather" },
      { id: 3, label: "Mail" },
      { id: 4, label: "Plate" },
      { id: 6, label: "Shield" },
      { id: 7, label: "Libram" },
      { id: 8, label: "Idol" },
      { id: 9, label: "Totem" },
    ],
  },
  {
    id: 5,
    label: "Reagent",
    icon: faMortarPestle,
    subclasses: [{ id: 0, label: "Reagent" }],
  },
  {
    id: 6,
    label: "Projectile",
    icon: faCrosshairs,
    subclasses: [
      { id: 2, label: "Arrow" },
      { id: 3, label: "Bullet" },
    ],
  },
  {
    id: 7,
    label: "Trade Goods",
    icon: faLayerGroup,
    subclasses: [
      { id: 0, label: "Trade Goods" },
      { id: 1, label: "Parts" },
      { id: 2, label: "Explosives" },
      { id: 3, label: "Devices" },
      { id: 5, label: "Cloth" },
      { id: 6, label: "Leather" },
      { id: 7, label: "Metal & Stone" },
      { id: 8, label: "Meat" },
      { id: 9, label: "Herb" },
      { id: 10, label: "Elemental" },
      { id: 11, label: "Other" },
      { id: 12, label: "Enchanting" },
    ],
  },
  {
    id: 9,
    label: "Recipe",
    icon: faScroll,
    subclasses: [
      { id: 0, label: "Book" },
      { id: 1, label: "Leatherworking" },
      { id: 2, label: "Tailoring" },
      { id: 3, label: "Engineering" },
      { id: 4, label: "Blacksmithing" },
      { id: 5, label: "Cooking" },
      { id: 6, label: "Alchemy" },
      { id: 7, label: "First Aid" },
      { id: 8, label: "Enchanting" },
      { id: 9, label: "Fishing" },
    ],
  },
  {
    id: 11,
    label: "Quiver",
    icon: faBoxArchive,
    subclasses: [
      { id: 0, label: "Quiver" },
      { id: 2, label: "Ammo Pouch" },
    ],
  },
  {
    id: 12,
    label: "Quest",
    icon: faCircleQuestion,
    subclasses: [{ id: 0, label: "Quest" }],
  },
  {
    id: 13,
    label: "Key",
    icon: faKey,
    subclasses: [
      { id: 0, label: "Key" },
      { id: 1, label: "Lockpick" },
    ],
  },
  {
    id: 15,
    label: "Miscellaneous",
    icon: faDice,
    subclasses: [
      { id: 0, label: "Junk" },
      { id: 1, label: "Reagent" },
      { id: 2, label: "Pet" },
      { id: 3, label: "Holiday" },
      { id: 4, label: "Other" },
      { id: 5, label: "Mount" },
    ],
  },
];

// Category filter only offers gear worth browsing — everything else (consumables,
// quest items, trade goods, etc.) is still labeled correctly via ITEM_CLASSES
// when it shows up in unfiltered results, just not selectable as a filter.
const CATEGORY_FILTER_IDS = [2, 4];

export const CATEGORY_FILTER_OPTIONS: ItemClassOption[] = ITEM_CLASSES.filter((c) =>
  CATEGORY_FILTER_IDS.includes(c.id),
);

const DEFAULT_CLASS_ICON: IconDefinition = faCube;
const MONEY_CLASS_ICON: IconDefinition = faCoins;

export function getClassIcon(itemClass: number): IconDefinition {
  if (itemClass === 10) return MONEY_CLASS_ICON;
  return ITEM_CLASSES.find((c) => c.id === itemClass)?.icon ?? DEFAULT_CLASS_ICON;
}

export function getClassLabel(itemClass: number): string {
  return ITEM_CLASSES.find((c) => c.id === itemClass)?.label ?? "Unknown";
}

export function getSubclassLabel(itemClass: number, subclass: number): string {
  const subclasses = ITEM_CLASSES.find((c) => c.id === itemClass)?.subclasses;
  return subclasses?.find((s) => s.id === subclass)?.label ?? "Unknown";
}

export const INVENTORY_TYPES: LookupOption[] = [
  { id: 1, label: "Head" },
  { id: 2, label: "Neck" },
  { id: 3, label: "Shoulder" },
  { id: 4, label: "Shirt" },
  { id: 5, label: "Chest" },
  { id: 6, label: "Waist" },
  { id: 7, label: "Legs" },
  { id: 8, label: "Feet" },
  { id: 9, label: "Wrist" },
  { id: 10, label: "Hands" },
  { id: 11, label: "Finger" },
  { id: 12, label: "Trinket" },
  { id: 13, label: "One-Hand" },
  { id: 14, label: "Shield" },
  { id: 15, label: "Ranged" },
  { id: 16, label: "Back" },
  { id: 17, label: "Two-Hand" },
  { id: 18, label: "Bag" },
  { id: 19, label: "Tabard" },
  { id: 20, label: "Robe" },
  { id: 21, label: "Main Hand" },
  { id: 22, label: "Off Hand" },
  { id: 23, label: "Held In Off-hand" },
  { id: 24, label: "Ammo" },
  { id: 25, label: "Thrown" },
  { id: 26, label: "Ranged (Alt.)" },
];

export function getInventoryTypeLabel(inventoryType: number): string {
  if (inventoryType === 0) return "Not Equippable";
  return INVENTORY_TYPES.find((t) => t.id === inventoryType)?.label ?? "Unknown";
}

// Slot filter is scoped per category — the Weapon and Armor categories don't
// share equip slots, so the dropdown should only ever offer the ones relevant
// to whichever category is currently selected.
const WEAPON_SLOT_IDS = [13, 15, 17, 21, 22, 23, 25, 26];
const ARMOR_SLOT_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 19, 20];

const SLOT_OPTIONS_BY_CATEGORY: Record<number, LookupOption[]> = {
  2: INVENTORY_TYPES.filter((t) => WEAPON_SLOT_IDS.includes(t.id)),
  4: INVENTORY_TYPES.filter((t) => ARMOR_SLOT_IDS.includes(t.id)),
};

export function getSlotOptionsForCategory(itemClass: number | undefined): LookupOption[] {
  if (itemClass === undefined) return INVENTORY_TYPES;
  return SLOT_OPTIONS_BY_CATEGORY[itemClass] ?? INVENTORY_TYPES;
}

export const ITEMS_PER_PAGE_OPTIONS = [24, 48, 96];
export const DEFAULT_ITEMS_PER_PAGE = 24;

// Weapon — the landing category for /items.
export const DEFAULT_ITEM_CATEGORY = 2;

// item_template.bonding values.
export function getBondingLabel(bonding: number): string | null {
  switch (bonding) {
    case 1:
      return "Binds when picked up";
    case 2:
      return "Binds when equipped";
    case 3:
      return "Binds when used";
    case 4:
      return "Quest Item";
    default:
      return null;
  }
}

// ITEM_FLAG_UNIQUE_EQUIPPED on item_template.flags.
export const UNIQUE_EQUIPPED_FLAG = 0x00080000;

// item_template.dmg_typeN / resist school ids (0=Physical matches no resist column).
const DAMAGE_SCHOOL_LABELS: Record<number, string> = {
  0: "Physical",
  1: "Holy",
  2: "Fire",
  3: "Nature",
  4: "Frost",
  5: "Shadow",
  6: "Arcane",
};

export function getDamageSchoolLabel(school: number): string {
  return DAMAGE_SCHOOL_LABELS[school] ?? "Physical";
}

// WoW's ItemModType enum — covers the stat/rating types that actually show up
// on gear in this DB, not the full obscure enum.
const STAT_TYPE_LABELS: Record<number, string> = {
  0: "Mana",
  1: "Health",
  3: "Agility",
  4: "Strength",
  5: "Intellect",
  6: "Spirit",
  7: "Stamina",
  31: "Hit Rating",
  32: "Crit Rating",
  36: "Haste Rating",
  38: "Attack Power",
  43: "Spell Power",
};

export function getStatLabel(statType: number): string {
  return STAT_TYPE_LABELS[statType] ?? `Stat ${statType}`;
}

// sell_price is stored in copper; 100 copper = 1 silver, 100 silver = 1 gold.
export function formatMoney(totalCopper: number): MoneyBreakdown {
  const gold = Math.floor(totalCopper / 10000);
  const silver = Math.floor((totalCopper % 10000) / 100);
  const copper = totalCopper % 100;
  return { gold, silver, copper };
}
