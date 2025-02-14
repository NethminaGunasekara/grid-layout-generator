import styles from "./styles.module.scss";

export default function AddArea() {
  return (
    <div className={styles.container}>
      <h3>2. Add a New Area</h3>

      <img
        src={"/images/add-area.png"}
        className={styles.image}
        alt="Grid options"
      />

      <div className={styles.content}>
        <p>To add an area:</p>

        <ol>
          <li>Click on any cell within the grid.</li>
          <li>A new area will appear, which can be customized.</li>
        </ol>
      </div>
    </div>
  );
}
