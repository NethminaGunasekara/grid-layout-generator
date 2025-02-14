import Logo from "@/assets/logo.svg";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <img src={Logo} alt="Logo" />
      <h1>
        Grid <span>Layout</span> Generator
      </h1>
    </header>
  );
}
