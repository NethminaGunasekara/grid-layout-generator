import Area from "./Area";
import CellData from "./CellData";
import Size from "./Size";

export default interface GridState {
  layout: {
    rows: Size[];
    columns: Size[];
    rowGap: Size;
    columnGap: Size;
  };

  areas: Area[];

  selectedAreaId?: string | null;

  // The list of cells that'll be occupied when the user drops an area
  destinationArea?: CellData[];
}
