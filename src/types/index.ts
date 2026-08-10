import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface LookupOption {
  id: number;
  label: string;
}

export interface ItemClassOption extends LookupOption {
  icon: IconDefinition;
  subclasses: LookupOption[];
}

export interface ItemSummary {
  entry: number;
  patch: number;
  name: string;
  quality: number;
  class: number;
  subclass: number;
  inventory_type: number;
  item_level: number;
  required_level: number;
}

export interface ItemsQueryParams {
  name?: string;
  quality?: number;
  itemClass?: number;
  subclass?: number;
  inventoryType?: number;
  requiredLevelMin?: number;
  requiredLevelMax?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SpellEffectDetail {
  trigger: number;
  label: string;
  text: string;
}

export interface DropSource {
  creature: string;
  chance: number;
}

export interface ItemDetail {
  entry: number;
  patch: number;
  name: string;
  description: string;
  quality: number;
  class: number;
  subclass: number;
  inventory_type: number;
  item_level: number;
  required_level: number;
  bonding: number;
  flags: number;
  sell_price: number;
  max_durability: number;
  armor: number;
  block: number;
  delay: number;
  dmg_min1: number;
  dmg_max1: number;
  dmg_type1: number;
  dmg_min2: number;
  dmg_max2: number;
  dmg_type2: number;
  dmg_min3: number;
  dmg_max3: number;
  dmg_type3: number;
  dmg_min4: number;
  dmg_max4: number;
  dmg_type4: number;
  dmg_min5: number;
  dmg_max5: number;
  dmg_type5: number;
  stat_type1: number;
  stat_value1: number;
  stat_type2: number;
  stat_value2: number;
  stat_type3: number;
  stat_value3: number;
  stat_type4: number;
  stat_value4: number;
  stat_type5: number;
  stat_value5: number;
  stat_type6: number;
  stat_value6: number;
  stat_type7: number;
  stat_value7: number;
  stat_type8: number;
  stat_value8: number;
  stat_type9: number;
  stat_value9: number;
  stat_type10: number;
  stat_value10: number;
  holy_res: number;
  fire_res: number;
  nature_res: number;
  frost_res: number;
  shadow_res: number;
  arcane_res: number;
  spellEffects: SpellEffectDetail[];
  droppedBy: DropSource[];
}

export interface MoneyBreakdown {
  gold: number;
  silver: number;
  copper: number;
}
