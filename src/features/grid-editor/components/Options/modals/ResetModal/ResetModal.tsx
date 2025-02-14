import ModalBackground from "@/components/ModalBackground/ModalBackground";
import CloseBtn from "@/assets/icons/confirmation-modal/close.svg";
import styles from "./ResetModal.module.scss";

interface ResetModalProps {
  onClose: () => void;
  onReset: () => void;
}

export default function ResetModal({ onClose, onReset }: ResetModalProps) {
  return (
    <ModalBackground onCLick={onClose}>
      <div className={styles.resetModal} data-testid="grid-reset">
        {/* Modal titlebar */}
        <div className={styles.titlebar}>
          <span>Reset Grid</span>
          <button type="button" onClick={onClose}>
            <img src={CloseBtn} alt="Close icon" />
          </button>
        </div>

        {/* Modal body */}
        <span className={styles.modalHeading}>
          Are you sure you want to reset the grid?
        </span>
        <span className={styles.modalBody}>
          This will remove all your customizations and restore the default
          layout. This action cannot be undone.
        </span>

        {/* Modal buttons */}
        <div className={styles.modalActions}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <button
            type="button"
            onClick={onReset}
            className={styles.resetBtn}
            data-testid="reset-btn"
          >
            Reset Grid
          </button>
        </div>
      </div>
    </ModalBackground>
  );
}
