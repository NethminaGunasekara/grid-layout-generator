import Count from "./components/Count";
import Gap from "./components/Gap";
import GridIcon from "@/assets/icons/grid.svg";
import ResetIcon from "@/assets/icons/reset.svg";
import SaveIcon from "@/assets/icons/save.svg";
import ResetModal from "./modals/ResetModal/ResetModal";
import CodeGenerator from "@/features/code-generator";
import styles from "./GridOptions.module.scss";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks";
import { toast } from "react-toastify";
import { resetGrid } from "../../gridSlice";
import SaveModal from "./modals/SaveModal/SaveModal";

export default function GridOptions() {
  const dispatch = useAppDispatch();

  const [isSaveModalShown, setIsSaveModalShown] = useState(false);
  const [isResetModalShown, setIsResetModalShown] = useState(false);
  const [isCodeModalShown, setIsCodeModalShown] = useState(false);

  useEffect(() => {
    if (isResetModalShown || isCodeModalShown) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSaveModalShown, isResetModalShown, isCodeModalShown]);

  return (
    <>
      <div className={styles.gridOptions}>
        <div className={styles.optionsHeader}>
          <img src={GridIcon} className={styles.gridIcon} alt="Grid Icon" />
          <span>Grid Options</span>

          {/* Save Grid Button */}
          <button
            onClick={() => setIsSaveModalShown(true)}
            type="button"
            className={styles.saveBtn}
            data-testid="open-save-modal"
          >
            <img src={SaveIcon} alt="Save Icon" />
          </button>

          {/* Reset Grid Button */}
          <button
            onClick={() => setIsResetModalShown(true)}
            className={styles.resetBtn}
            data-testid="reset-layout"
          >
            <img src={ResetIcon} alt="Reset Icon" />
          </button>
        </div>

        <div className={styles.optionsContainer}>
          <div className={styles.rowCount}>
            <label htmlFor="rowCount">Rows</label>
            <Count id="rowCount" type="rowCount" />
          </div>

          <div className={styles.columnCount}>
            <label htmlFor="columnCount">Columns</label>
            <Count id="columnCount" type="columnCount" />
          </div>

          <div className={styles.rowGap}>
            <label htmlFor="rowGap">Row Gap</label>
            <Gap id="rowGap" type="rowGap" />
          </div>

          <div className={styles.columnGap}>
            <label htmlFor="columnGap">Column Gap</label>
            <Gap id="columnGap" type="columnGap" />
          </div>

          <button
            onClick={() => setIsCodeModalShown(true)}
            className={styles.viewCode}
            data-testid="view-code"
          >
            View Code
          </button>
        </div>
      </div>

      {isSaveModalShown && (
        <SaveModal onClose={() => setIsSaveModalShown(false)} />
      )}

      {isResetModalShown && (
        <ResetModal
          onClose={() => setIsResetModalShown(false)}
          onReset={() => {
            dispatch(resetGrid());
            setIsResetModalShown(false);
            toast.success(
              "Grid Reset Successful. You can now start customizing it again!"
            );
          }}
        />
      )}

      {isCodeModalShown && (
        <CodeGenerator onClose={() => setIsCodeModalShown(false)} />
      )}
    </>
  );
}
