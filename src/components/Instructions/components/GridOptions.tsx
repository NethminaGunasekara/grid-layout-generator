import gridOptions from "@/assets/icons/reset-layout.svg";
import styles from "./styles.module.scss";

export default function GridOptions() {
  return (
    <div className={styles.container}>
      <h3>1. Customize Grid Options</h3>

      <img
        src={"/images/grid-options.png"}
        className={styles.image}
        alt="Grid options"
      />

      <div className={styles.content}>
        <p>
          Under the Grid Options, you can configure the structure of your grid:
        </p>

        <ol>
          <li>Rows: Define the number and size of rows.</li>
          <li>Columns: Specify the number and size of columns.</li>
          <li>Row Gap: Adjust the space between rows.</li>
          <li>Column Gap: Set the spacing between columns.</li>
        </ol>

        <p>
          You can start fresh by clicking the Reset Grid button{" "}
          <img src={gridOptions} className={styles.inlineIcon} alt="" /> under
          the Grid Options.
        </p>
      </div>
    </div>
  );
}
