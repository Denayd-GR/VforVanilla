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
  faHorse,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { LookupOption, ItemClassOption, MoneyBreakdown } from "../types";

// VMaNGOS is a 1.12 "Vanilla" world DB — these mirror the client's original
// ItemClass/ItemSubclass/InventoryType enums, not the modern retail tables.

export const WEAPON_CATEGORY_ID = 2;
export const MOUNT_CATEGORY_ID = 15;

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
    // Engineering Bag (subclass 4) exists in the retail enum but has zero
    // rows in this world DB — omitted so the filter never offers a dead end.
    subclasses: [
      { id: 0, label: "Bag" },
      { id: 1, label: "Soul Bag" },
      { id: 2, label: "Herb Bag" },
      { id: 3, label: "Enchanting Bag" },
    ],
  },
  {
    id: WEAPON_CATEGORY_ID,
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
// Consumables and the rest of Miscellaneous (pets/junk/holiday) are deliberately
// excluded: every row in both classes shares the same subclass value in this
// world DB, so there's no real column left to filter on without name-pattern
// guessing. Mounts is the one exception — the backend identifies mount rows via
// their on-use spell's Mounted aura instead of subclass, so it gets its own
// synthetic entry here (same class id as Miscellaneous, distinct label/icon)
// rather than reusing the generic ITEM_CLASSES[15] entry.
const CATEGORY_FILTER_IDS = [1, 2, 4];

const MOUNT_CATEGORY_OPTION: ItemClassOption = {
  id: MOUNT_CATEGORY_ID,
  label: "Mounts",
  icon: faHorse,
  subclasses: [],
};

export const CATEGORY_FILTER_OPTIONS: ItemClassOption[] = [
  ...ITEM_CLASSES.filter((c) => CATEGORY_FILTER_IDS.includes(c.id)),
  MOUNT_CATEGORY_OPTION,
];

// Armor browsing groups real item_template.subclass/inventory_type values
// into the families players actually think in (matches the in-game AH
// filter tree). Each option maps to the real column(s) that identify it:
//   - Types (Cloth/Leather/Mail/Plate): subclass only — `allowsSlot` means
//     the Slot field then further narrows by inventory_type (Chest, Head...).
//   - Jewelry/Relics/Other: a single subclass and/or inventory_type value
//     fully identifies the item, so Slot has nothing left to add.
// Cloaks are the one cross-cutting case — every cape in the game is itemized
// as subclass 1 (Cloth) regardless of who can wear it, distinguished only by
// inventory_type 16 (Back), so that option pins both fields at once.
export interface ArmorTypeOption extends LookupOption {
  subclass?: number;
  inventoryType?: number;
  allowsSlot?: boolean;
}

export interface ArmorTypeGroup {
  label: string;
  options: ArmorTypeOption[];
}

export const ARMOR_TYPE_GROUPS: ArmorTypeGroup[] = [
  {
    label: "Types",
    options: [
      { id: 0, label: "Cloth", subclass: 1, allowsSlot: true },
      { id: 1, label: "Leather", subclass: 2, allowsSlot: true },
      { id: 2, label: "Mail", subclass: 3, allowsSlot: true },
      { id: 3, label: "Plate", subclass: 4, allowsSlot: true },
    ],
  },
  {
    label: "Jewelry",
    options: [
      { id: 4, label: "Amulets", inventoryType: 2 },
      { id: 5, label: "Rings", inventoryType: 11 },
      { id: 6, label: "Trinkets", inventoryType: 12 },
    ],
  },
  {
    label: "Relics",
    options: [
      { id: 7, label: "Librams", subclass: 7 },
      { id: 8, label: "Idols", subclass: 8 },
      { id: 9, label: "Totems", subclass: 9 },
    ],
  },
  {
    label: "Other",
    options: [
      { id: 10, label: "Cloaks", subclass: 1, inventoryType: 16 },
      { id: 11, label: "Off-hand Frills", inventoryType: 23 },
      { id: 12, label: "Shields", subclass: 6 },
      { id: 13, label: "Shirts", inventoryType: 4 },
      { id: 14, label: "Tabards", inventoryType: 19 },
      { id: 15, label: "Miscellaneous", subclass: 0 },
    ],
  },
];

export function getArmorTypeOption(id: number | undefined): ArmorTypeOption | undefined {
  if (id === undefined) return undefined;
  for (const group of ARMOR_TYPE_GROUPS) {
    const found = group.options.find((o) => o.id === id);
    if (found) return found;
  }
  return undefined;
}

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

// Only reachable once Armor > Types > Cloth/Leather/Mail/Plate is picked —
// Robe (20) is a chest-slot cosmetic variant with real, substantial data in
// this DB, so it's kept as its own pick rather than silently merged into Chest.
const ARMOR_TYPE_SLOT_IDS = [1, 3, 5, 6, 7, 8, 9, 10, 20];

export const ARMOR_TYPE_SLOT_OPTIONS: LookupOption[] = INVENTORY_TYPES.filter((t) =>
  ARMOR_TYPE_SLOT_IDS.includes(t.id),
);

// Weapon browsing groups the real item_template.subclass values (One-Handed
// Axe, Dagger, etc.) into the four families players actually think in. The
// group itself isn't a DB column — picking a group just scopes which real
// subclass ids the next dropdown offers. Labels here are display-only
// (plural, matching the filter UI); getSubclassLabel still returns the
// canonical singular label from ITEM_CLASSES for item cards/detail pages.
export const WEAPON_SUBCLASS_GROUPS: { label: string; options: LookupOption[] }[] = [
  {
    label: "One-Handed",
    options: [
      { id: 15, label: "Daggers" },
      { id: 13, label: "Fist Weapons" },
      { id: 0, label: "One-Handed Axes" },
      { id: 4, label: "One-Handed Maces" },
      { id: 7, label: "One-Handed Swords" },
    ],
  },
  {
    label: "Two-Handed",
    options: [
      { id: 6, label: "Polearms" },
      { id: 10, label: "Staves" },
      { id: 1, label: "Two-Handed Axes" },
      { id: 5, label: "Two-Handed Maces" },
      { id: 8, label: "Two-Handed Swords" },
    ],
  },
  {
    label: "Ranged",
    options: [
      { id: 2, label: "Bows" },
      { id: 18, label: "Crossbows" },
      { id: 3, label: "Guns" },
      { id: 19, label: "Wands" },
      { id: 16, label: "Thrown" },
    ],
  },
  {
    label: "Other",
    options: [
      { id: 20, label: "Fishing Poles" },
      { id: 14, label: "Miscellaneous" },
    ],
  },
];

export const WEAPON_SUBCLASS_GROUP_OPTIONS: LookupOption[] = WEAPON_SUBCLASS_GROUPS.map(
  (group, index) => ({ id: index, label: group.label }),
);

export function getWeaponTypeOptionsForGroup(groupIndex: number | undefined): LookupOption[] {
  if (groupIndex === undefined) return [];
  return WEAPON_SUBCLASS_GROUPS[groupIndex]?.options ?? [];
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
