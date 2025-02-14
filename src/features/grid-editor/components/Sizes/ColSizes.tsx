import { useAppSelector } from "@/hooks";
import SizeInput from "./SizeInput";
import styles from "./ColSizes.module.scss";

export default function ColSizes() {
  const cols = useAppSelector((state) => state.layout.columns);

  return (
    <div className={styles.colSizes}>
      {cols.map((_, index) => (
        <SizeInput key={index} target="col-size" index={index} />
      ))}
    </div>
  );
}
