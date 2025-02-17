import Select from "./components/Select";
import Input from "./components/Input";
import AreaID from "./components/AreaID";
import AreaIcon from "@/assets/icons/area.svg";
import styles from "./AreaOptions.module.scss";
import { useAppSelector } from "@/hooks";

export default function AreaOptions() {
  const selectedAreaId = useAppSelector((state) => state.selectedAreaId);

  return (
    <div className={styles.areaOptions}>
      <div className={styles.gridOptions}>
        <div className={styles.optionsHeader}>
          <img src={AreaIcon} className={styles.areaIcon} alt="Grid Icon" />
          <span>Area Options</span>
        </div>

        <div className={styles.optionsContainer}>
          <div className={styles.input}>
            <label>Areas Available</label>
            <Select type="areas-available" data-testid="areas-available" />
          </div>

          <div className={styles.input}>
            <label htmlFor="area-id">Area ID</label>
            <AreaID />
          </div>

          {selectedAreaId && (
            <div className={styles.areaPlacement}>
              <div className={styles.rowStart}>
                <label htmlFor="row-start">Row Start</label>
                <Input id="row-start" type="row-start" />
              </div>

              <div className={styles.columnStart}>
                <label htmlFor="column-start">Column Start</label>
                <Input id="column-start" type="column-start" />
              </div>

              <div className={styles.rowEnd}>
                <label htmlFor="row-end">Row End</label>
                <Input id="row-end" type="row-end" />
              </div>

              <div className={styles.columnEnd}>
                <label htmlFor="column-end">Column End</label>
                <Input id="column-end" type="column-end" />
              </div>
            </div>
          )}

          <div className={styles.input}>
            <label>align-self</label>
            <Select type="align-self" />
          </div>

          <div className={styles.input}>
            <label>justify-self</label>
            <Select type="justify-self" />
          </div>
        </div>
      </div>
    </div>
  );
}
