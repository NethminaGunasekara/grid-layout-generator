import GitHubIcon from "@/assets/icons/github.svg";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>🚀 Be part of the solution on</p>

      <button
        type="button"
        onClick={() =>
          window.open(
            "https://github.com/NethminaGunasekara/grid-layout-generator"
          )
        }
      >
        <img src={GitHubIcon} alt="GitHub Icon" />
        <span>grid-layout-generator</span>
      </button>
    </footer>
  );
}
