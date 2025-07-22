import styles from "./Navbar.module.css";
import { FiGrid, FiCamera, FiLayers, FiAlertTriangle, FiUser } from "react-icons/fi";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>MANDLACX</div>
      <ul className={styles.links}>
        <li>
          <FiGrid className={styles.icon} />
          Dashboard
        </li>
        <li>
          <FiCamera className={styles.icon} />
          Cameras
        </li>
        <li>
          <FiLayers className={styles.icon} />
          Scenes
        </li>
        <li>
          <FiAlertTriangle className={styles.icon} />
          Incidents
        </li>
        <li>
          <FiUser className={styles.icon} />
          Users
        </li>
      </ul>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>👤</div>
        <div className={styles.userDetails}>
          <div className={styles.userName}>Mohammed Ajhas</div>
          <div className={styles.userEmail}>ajhas@mandlac.com</div>
        </div>
      </div>
    </nav>
  );
}
