import { GridOptions, AddArea, EditArea, DownloadCode } from "./components";
import styles from "./Instructions.module.scss";

export default function Instructions() {
  return (
    <div className={styles.instructions}>
      <h2>Using the Grid Generator</h2>

      <p>
        This CSS Grid Generator is designed to be easy to use. Follow the steps
        below to get started and create your own custom grid layouts!
      </p>

      <GridOptions />

      <AddArea />
      <EditArea />
      <DownloadCode />
    </div>
  );
}
