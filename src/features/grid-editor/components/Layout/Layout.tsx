import { useSelector } from "react-redux";
import Cell from "./components/Cell";
import styles from "./Layout.module.scss";
import { RootState } from "@/store";
import Area from "./components/Area";
import { useAppSelector } from "@/hooks";

export default function Layout() {
  const rows = useSelector((state: RootState) => state.layout.rows);
  const columns = useSelector((state: RootState) => state.layout.columns);
  const areas = useSelector((state: RootState) => state.areas);
  const selectedAreaId = useAppSelector((state) => state.selectedAreaId);

  return (
    <div className={styles.layout}>
      {rows.map((_, rowIndex) =>
        columns.map((_, columnIndex) => (
          <Cell
            key={`${rowIndex + 1}-${columnIndex + 1}`}
            row={rowIndex + 1}
            column={columnIndex + 1}
          />
        ))
      )}

      {areas.map((area, index) => (
        <Area
          key={index}
          id={area.id}
          selected={area.id == selectedAreaId}
          rowStart={area.rowStart}
          columnStart={area.columnStart}
          rowEnd={area.rowEnd}
          columnEnd={area.columnEnd}
          alignSelf={area.alignSelf ?? "stretch"}
          justifySelf={area.justifySelf ?? "stretch"}
          backgroundColor={area.backgroundColor}
        />
      ))}
    </div>
  );
}
