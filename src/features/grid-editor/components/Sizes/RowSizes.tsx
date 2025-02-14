import SizeInput from "./SizeInput";
import styles from "./RowSizes.module.scss";
import { useAppSelector } from "@/hooks";

export default function RowSizes() {
  const rows = useAppSelector((state) => state.layout.rows);

  return (
    <div className={styles.rowSizes}>
      {rows.map((_, index) => (
        <SizeInput key={index} target="row-size" index={index} />
      ))}
    </div>
  );
}
