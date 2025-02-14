import styles from "./styles/NotFound.module.scss";

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <h1>404</h1>

      <p>
        PAGE <span>NOT</span> FOUND
      </p>

      <button type="button" onClick={() => (window.location.href = "/")}>
        Go to Homepage
      </button>
    </div>
  );
}
