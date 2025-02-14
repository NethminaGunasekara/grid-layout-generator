import { useDispatch, useSelector } from "react-redux";
import { addArea } from "../../../gridSlice";
import { getAreaColor, getAreaId } from "../../../utils/helpers";
import { RootState } from "@/store";
import "./Cell.scss";
import { useAppSelector } from "@/hooks";

interface CellProps {
  row: number;
  column: number;
}

export default function Cell({ row, column }: CellProps) {
  const dispatch = useDispatch();
  const areas = useSelector((state: RootState) => state.areas);
  const destinationArea = useAppSelector((state) => state.destinationArea);

  const areaProps = {
    id: getAreaId(areas.map((area) => area.id)),
    row,
    column,
    backgroundColor: getAreaColor(areas.map((area) => area.backgroundColor)),
  };

  return (
    <div
      style={{ gridArea: `${row} / ${column} / ${row + 1} / ${column + 1}` }}
      className={
        destinationArea?.some(
          (area) => area.row === row && area.column === column
        )
          ? "cell marked"
          : "cell"
      }
      data-testid="cell"
      onClick={() => dispatch(addArea(areaProps))}
      data-row={row}
      data-column={column}
    ></div>
  );
}
