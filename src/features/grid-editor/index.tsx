import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getTemplate } from "./utils/helpers";
import { Layout, RowSizes, ColSizes, Options } from "./components";
import styles from "./grid-editor.module.scss";
import { useEffect, useRef } from "react";

export default function GridEditor() {
  const gridRows = useSelector((state: RootState) => state.layout.rows);
  const gridColumns = useSelector((state: RootState) => state.layout.columns);
  const rowGap = useSelector((state: RootState) => state.layout.rowGap);
  const columnGap = useSelector((state: RootState) => state.layout.columnGap);

  const gridEditor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridEditor.current) return;

    gridEditor.current.style.setProperty("--grid-rows", getTemplate(gridRows));
    gridEditor.current.style.setProperty(
      "--grid-columns",
      getTemplate(gridColumns)
    );
    gridEditor.current.style.setProperty(
      "--row-gap",
      `${rowGap.value}${rowGap.unit}`
    );
    gridEditor.current.style.setProperty(
      "--column-gap",
      `${columnGap.value}${columnGap.unit}`
    );
  }, [gridRows, gridColumns, rowGap, columnGap]);

  return (
    <div
      ref={gridEditor}
      className={styles.gridEditor}
      data-testid="grid-editor"
    >
      <RowSizes />
      <ColSizes />
      <Layout />
      <Options />
    </div>
  );
}
