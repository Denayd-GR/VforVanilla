import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { BIS_CLASSES, getBiSSpecData } from "../../constants/bis";
import type { BiSGearEntry } from "../../types";
import styles from "./BiSSpecDetail.module.css";

const CONSUMABLE_CATEGORY_STYLES: Record<string, string> = {
  flasks: styles.categoryFlasks,
  food: styles.categoryFood,
  potions: styles.categoryPotions,
  weaponBuffs: styles.categoryWeaponBuffs,
  misc: styles.categoryMisc,
};

function GearRowFields({ entry }: { entry: BiSGearEntry }) {
  return (
    <>
      <span className={styles.gearSlot}>{entry.slot}</span>
      <div className={styles.gearInfo}>
        <span className={styles.gearItem}>{entry.item}</span>
        {entry.enchant && <span className={styles.gearEnchant}>{entry.enchant}</span>}
      </div>
      <div className={styles.gearSource}>
        <span>{entry.source}</span>
        <span className={styles.gearDetail}>{entry.detail}</span>
      </div>
    </>
  );
}

function BiSSpecDetail() {
  const { classSlug, specSlug } = useParams<{ classSlug: string; specSlug: string }>();
  const classInfo = BIS_CLASSES.find((c) => c.slug === classSlug);
  const specInfo = classInfo?.specs.find((s) => s.slug === specSlug);
  const specData = classSlug && specSlug ? getBiSSpecData(classSlug, specSlug) : undefined;
  const [phaseId, setPhaseId] = useState(specData?.phases[0]?.id);

  useEffect(() => {
    setPhaseId(getBiSSpecData(classSlug ?? "", specSlug ?? "")?.phases[0]?.id);
  }, [classSlug, specSlug]);

  if (!specData) {
    return (
      <div className={styles.page}>
        <Link to="/bis" className={styles.backLink}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back to BiS
        </Link>
        <p className={styles.status}>
          {classInfo && specInfo
            ? `${classInfo.name} ${specInfo.name} isn't wired up yet — check back soon.`
            : "That class or spec doesn't exist."}
        </p>
      </div>
    );
  }

  const activePhase = specData.phases.find((p) => p.id === phaseId) ?? specData.phases[0];

  return (
    <div className={styles.page}>
      <Link to="/bis" className={styles.backLink}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back to BiS
      </Link>

      <h1 className={styles.title}>
        {classInfo?.name} {specInfo?.name}
      </h1>

      <div className={styles.phaseTabs} role="tablist" aria-label="Gear phase">
        {specData.phases.map((phase) => (
          <button
            key={phase.id}
            type="button"
            role="tab"
            aria-selected={phase.id === activePhase.id}
            className={`${styles.phaseTab} ${phase.id === activePhase.id ? styles.phaseTabActive : ""}`}
            onClick={() => setPhaseId(phase.id)}
          >
            {phase.label}
          </button>
        ))}
      </div>

      <div className={styles.gearAndGuideRow}>
        <section className={styles.gearSection}>
          {activePhase.zone && <p className={styles.phaseZone}>{activePhase.zone}</p>}
          <ul className={styles.gearList}>
            {activePhase.gear.map((entry) => (
              <li key={entry.slot} className={styles.gearRow}>
                {entry.entry ? (
                  <Link
                    to={`/items/${entry.entry}`}
                    className={`${styles.gearRowInner} ${styles.gearRowLinked}`}
                  >
                    <GearRowFields entry={entry} />
                  </Link>
                ) : (
                  <div className={styles.gearRowInner}>
                    <GearRowFields entry={entry} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>

        {specData.classGuide && (
          <section className={styles.classGuideSection}>
            <div className={styles.classGuideCard}>
              <h2 className={styles.sectionHeading}>Introduction</h2>
              <p className={styles.classGuideText}>{specData.classGuide.introduction}</p>
            </div>

            <div className={styles.classGuideCard}>
              <h2 className={styles.sectionHeading}>Rotation</h2>
              {specData.classGuide.rotationNote && (
                <p className={styles.classGuideText}>{specData.classGuide.rotationNote}</p>
              )}

              <h3 className={styles.classGuideSubheading}>Single Target</h3>
              <ol className={styles.classGuideList}>
                {specData.classGuide.singleTarget.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>

              <h3 className={styles.classGuideSubheading}>AoE</h3>
              <ol className={styles.classGuideList}>
                {specData.classGuide.aoe.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </section>
        )}
      </div>

      <div className={styles.talentAndConsumablesRow}>
        {specData.talentImage && (
          <section className={styles.talentSection}>
            <h2 className={styles.sectionHeading}>Recommended Talent Build</h2>
            <img
              src={specData.talentImage}
              alt={`${classInfo?.name} ${specInfo?.name} recommended talent build`}
              className={styles.talentImage}
            />
          </section>
        )}

        <section className={styles.consumablesSection}>
          <h2 className={styles.sectionHeading}>Best Consumables</h2>
          <div className={styles.consumablesGrid}>
            {specData.consumables.map((c) => (
              <div
                key={c.category}
                className={`${styles.consumableCard} ${CONSUMABLE_CATEGORY_STYLES[c.slug] ?? ""}`}
              >
                <h3 className={styles.consumableCategory}>
                  <FontAwesomeIcon icon={c.icon} className={styles.consumableIcon} />
                  {c.category}
                </h3>
                <p className={styles.consumableBest}>{c.best}</p>
                {c.alternatives && (
                  <p className={styles.consumableAlt}>Alternatives: {c.alternatives}</p>
                )}
                {c.note && <p className={styles.consumableNote}>{c.note}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default BiSSpecDetail;
