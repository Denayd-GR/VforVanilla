import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCoins } from "@fortawesome/free-solid-svg-icons";
import { fetchItemDetail } from "../../api/items";
import type { ItemDetail as ItemDetailData } from "../../types";
import {
  getQualityColor,
  getSubclassLabel,
  getInventoryTypeLabel,
  getBondingLabel,
  getStatLabel,
  getDamageSchoolLabel,
  formatMoney,
  UNIQUE_EQUIPPED_FLAG,
} from "../../constants/items";
import styles from "./ItemDetail.module.css";

const STAT_SLOTS = 10;
const EXTRA_DAMAGE_SLOTS = [2, 3, 4, 5];

function ItemDetail() {
  const { entry } = useParams<{ entry: string }>();
  const [item, setItem] = useState<ItemDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entry) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setError(null);

    fetchItemDetail(entry)
      .then((data) => {
        if (!cancelled) setItem(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
          setNotFound(true);
        } else {
          setError("Couldn't load this item. The server may be unreachable.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [entry]);

  if (loading) {
    return <p className={styles.status}>Loading item…</p>;
  }

  if (notFound || error || !item) {
    return (
      <div className={styles.page}>
        <Link to="/items" className={styles.backLink}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Items
        </Link>
        <p className={notFound ? styles.status : styles.error}>
          {notFound ? "Item not found." : error}
        </p>
      </div>
    );
  }

  const rawStats = item as unknown as Record<string, number>;
  const isWeapon = item.class === 2;
  const isArmorPiece = item.class === 4;
  const isUnique = (item.flags & UNIQUE_EQUIPPED_FLAG) !== 0;
  const bondingLabel = getBondingLabel(item.bonding);

  const stats: { type: number; value: number }[] = [];
  for (let slot = 1; slot <= STAT_SLOTS; slot++) {
    const type = rawStats[`stat_type${slot}`];
    const value = rawStats[`stat_value${slot}`];
    if (type !== 0 && value !== 0) stats.push({ type, value });
  }

  const resistances = [
    { label: "Holy Resistance", value: item.holy_res },
    { label: "Fire Resistance", value: item.fire_res },
    { label: "Nature Resistance", value: item.nature_res },
    { label: "Frost Resistance", value: item.frost_res },
    { label: "Shadow Resistance", value: item.shadow_res },
    { label: "Arcane Resistance", value: item.arcane_res },
  ].filter((r) => r.value !== 0);

  const extraDamage = EXTRA_DAMAGE_SLOTS.map((slot) => ({
    min: rawStats[`dmg_min${slot}`],
    max: rawStats[`dmg_max${slot}`],
    type: rawStats[`dmg_type${slot}`],
  })).filter((d) => d.min > 0 || d.max > 0);

  const hasPrimaryDamage = item.dmg_min1 > 0 || item.dmg_max1 > 0;
  const speedSeconds = item.delay / 1000;
  const dps = speedSeconds > 0 ? (item.dmg_min1 + item.dmg_max1) / 2 / speedSeconds : 0;

  const metaRight = isWeapon
    ? getSubclassLabel(item.class, item.subclass)
    : isArmorPiece && item.armor > 0
      ? `${item.armor} Armor`
      : null;

  const money = formatMoney(item.sell_price);

  return (
    <div className={styles.page}>
      <Link to="/items" className={styles.backLink}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Items
      </Link>

      <h1 className={styles.title}>{item.name || "Unnamed Item"}</h1>

      <div className={styles.card}>
        <p className={styles.itemName} style={{ color: getQualityColor(item.quality) }}>
          {item.name || "Unnamed Item"}
        </p>
        <p className={styles.itemLevel}>Item Level {item.item_level}</p>

        {bondingLabel && <p className={styles.line}>{bondingLabel}</p>}
        {isUnique && <p className={styles.line}>Unique-Equipped</p>}

        {item.inventory_type > 0 && (
          <div className={styles.metaRow}>
            <span>{getInventoryTypeLabel(item.inventory_type)}</span>
            {metaRight && <span>{metaRight}</span>}
          </div>
        )}

        {isWeapon && hasPrimaryDamage && (
          <>
            <div className={styles.metaRow}>
              <span>
                {item.dmg_min1} - {item.dmg_max1}
                {item.dmg_type1 > 0 ? ` ${getDamageSchoolLabel(item.dmg_type1)}` : ""} Damage
              </span>
              <span>Speed {speedSeconds.toFixed(2)}</span>
            </div>
            <p className={styles.dps}>({dps.toFixed(1)} damage per second)</p>
          </>
        )}

        {extraDamage.map((d, i) => (
          <p key={i} className={styles.line}>
            +{d.min} - {d.max} {getDamageSchoolLabel(d.type)} Damage
          </p>
        ))}

        {!isWeapon && !isArmorPiece && item.armor > 0 && (
          <p className={styles.line}>{item.armor} Armor</p>
        )}

        {item.block > 0 && <p className={styles.line}>{item.block} Block</p>}

        {stats.map((s, i) => (
          <p key={i} className={styles.line}>
            +{s.value} {getStatLabel(s.type)}
          </p>
        ))}

        {resistances.map((r, i) => (
          <p key={i} className={styles.line}>
            +{r.value} {r.label}
          </p>
        ))}

        {item.max_durability > 0 && (
          <p className={styles.line}>
            Durability {item.max_durability} / {item.max_durability}
          </p>
        )}

        {item.required_level > 0 && (
          <p className={styles.line}>Requires Level {item.required_level}</p>
        )}

        {item.spellEffects.length > 0 && (
          <div className={styles.effects}>
            {item.spellEffects.map((effect, i) => (
              <p key={i} className={styles.effectLine}>
                {effect.label}: {effect.text}
              </p>
            ))}
          </div>
        )}

        {item.description && <p className={styles.flavor}>&ldquo;{item.description}&rdquo;</p>}

        {item.sell_price > 0 && (
          <p className={styles.sellPrice}>
            <FontAwesomeIcon icon={faCoins} />
            <span>Sell Price:</span>
            {money.gold > 0 && <span className={styles.gold}>{money.gold}g</span>}
            {money.silver > 0 && <span className={styles.silver}>{money.silver}s</span>}
            {money.copper > 0 && <span className={styles.copper}>{money.copper}c</span>}
          </p>
        )}
      </div>

      {item.droppedBy.length > 0 && (
        <div className={styles.dropSection}>
          <h2 className={styles.dropHeading}>Dropped By</h2>
          <ul className={styles.dropList}>
            {item.droppedBy.map((d, i) => (
              <li key={i} className={styles.dropRow}>
                <span>{d.creature}</span>
                <span className={styles.dropChance}>{d.chance.toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ItemDetail;
