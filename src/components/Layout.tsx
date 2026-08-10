import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import styles from "../cssModules/Layout.module.css";

function Layout() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
