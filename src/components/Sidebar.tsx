import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesStacked,
  faWandMagicSparkles,
  faUserGroup,
  faTrophy,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../cssModules/Sidebar.module.css";

const NAV_ITEMS = [
  { to: "/items", label: "Items", icon: faBoxesStacked },
  { to: "/spells", label: "Spells", icon: faWandMagicSparkles },
  { to: "/npcs", label: "NPCs", icon: faUserGroup },
  { to: "/bis", label: "BiS", icon: faTrophy },
  { to: "/misc", label: "Misc", icon: faEllipsis },
];

function Sidebar() {
  return (
    <nav className={styles.sidebar} aria-label="Categories">
      <div className={styles.mark} aria-hidden="true">
        V
      </div>
      <ul className={styles.list}>
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ""}`
              }
            >
              <FontAwesomeIcon icon={item.icon} className={styles.icon} />
              <span className={styles.label}>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;
