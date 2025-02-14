import GridOptions from "./GridOptions";
import AreaOptions from "./AreaOptions";
import styles from "./Options.module.scss";

export default function Options() {
  return (
    <div className={styles.options}>
      <GridOptions />
      <AreaOptions />
    </div>
  );
}
