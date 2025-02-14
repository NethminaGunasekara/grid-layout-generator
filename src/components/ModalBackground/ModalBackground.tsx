import { MouseEvent, ReactNode } from "react";
import styles from "./ModalBackground.module.scss";

export default function ModalBackground({
  onCLick,
  children,
}: {
  onCLick: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={styles.modalBackground}
      onClick={(e: MouseEvent) => {
        if (e.target === e.currentTarget) onCLick?.();
      }}
    >
      {children}
    </div>
  );
}
