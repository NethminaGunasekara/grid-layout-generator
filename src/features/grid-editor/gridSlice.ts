import { createSlice } from "@reduxjs/toolkit";
import { GridState, SelfAlignment, Size, Unit } from "./types";
import CellData from "./types/CellData";

const initialState: GridState = {
  layout: {
    rows: Array(6).fill({ value: 1, unit: Unit.FR }),
    columns: Array(6).fill({ value: 1, unit: Unit.FR }),
    rowGap: { value: 0, unit: Unit.PX },
    columnGap: { value: 0, unit: Unit.PX },
  },

  areas: [],

  // The list of cells that'll be occupied when the user drops an area
  destinationArea: [],
};

const gridSlice = createSlice({
  name: "grid",
  initialState,
  reducers: {
    setRowsCount(state, action: { payload: number }) {
      if (action.payload > state.layout.rows.length) {
        state.layout.rows.push(
          ...Array(action.payload - state.layout.rows.length).fill({
            value: 1,
            unit: Unit.FR,
          })
        );
      } else {
        state.layout.rows.splice(action.payload);
      }
    },

    setColumnsCount(state, action: { payload: number }) {
      if (action.payload > state.layout.columns.length) {
        state.layout.columns.push(
          ...Array(action.payload - state.layout.columns.length).fill({
            value: 1,
            unit: Unit.FR,
          })
        );
      } else {
        state.layout.columns.splice(action.payload);
      }
    },

    setRowGap(state, action: { payload: Size }) {
      state.layout.rowGap = action.payload;
    },

    setColumnGap(state, action: { payload: Size }) {
      state.layout.columnGap = action.payload;
    },

    editRow(state, action: { payload: { index: number; newSize: Size } }) {
      state.layout.rows[action.payload.index] = action.payload.newSize;
    },

    editColumn(state, action: { payload: { index: number; newSize: Size } }) {
      state.layout.columns[action.payload.index] = action.payload.newSize;
    },

    addArea(
      state,
      action: {
        payload: {
          id: string;
          row: number;
          column: number;
          backgroundColor: string;
        };
      }
    ) {
      state.areas.push({
        id: action.payload.id,
        rowStart: action.payload.row,
        columnStart: action.payload.column,
        rowEnd: action.payload.row + 1,
        columnEnd: action.payload.column + 1,
        backgroundColor: action.payload.backgroundColor,
      });

      state.selectedAreaId = action.payload.id;
    },

    removeArea(state, action: { payload: string }) {
      const index = state.areas.findIndex((area) => area.id === action.payload);
      state.areas.splice(index, 1);

      // set selected area to null or last area available
      if (state.areas.length > 0)
        state.selectedAreaId = state.areas[state.areas.length - 1].id;
      else state.selectedAreaId = null;
    },

    editArea(
      state,
      action: {
        payload: {
          id: string;
          rowStart: number;
          columnStart: number;
          rowEnd: number;
          columnEnd: number;
        };
      }
    ) {
      const index = state.areas.findIndex(
        (area) => area.id === action.payload.id
      );

      if (index !== -1) {
        state.areas[index] = {
          ...state.areas[index],
          ...action.payload,
        };
      }
    },

    editAreaId(state, action: { payload: { id: string; newId: string } }) {
      const index = state.areas.findIndex(
        (area) => area.id === action.payload.id
      );

      if (index !== -1) {
        state.areas[index].id = action.payload.newId;
      }
    },

    setAreaPlacement(
      state,
      action: {
        payload: {
          id: string;
          type: "align-self" | "justify-self";
          value: string;
        };
      }
    ) {
      const area = state.areas.find((area) => area.id === action.payload.id);

      if (!area) return;

      if (action.payload.type === "align-self") {
        area.alignSelf = action.payload.value as SelfAlignment;
      } else {
        area.justifySelf = action.payload.value as SelfAlignment;
      }
    },

    setSelectedArea: (state, action: { payload: string }) => {
      state.selectedAreaId = action.payload;
    },

    setDestinationArea: (
      state,
      action: { payload: CellData[] | undefined }
    ) => {
      state.destinationArea = action.payload;
    },

    resetGrid: () => initialState,

    applyLayout: (_, action: { payload: GridState }) => action.payload,
  },
});

export default gridSlice;

export const {
  setRowsCount,
  setColumnsCount,
  setRowGap,
  setColumnGap,
  editRow,
  editColumn,
  addArea,
  removeArea,
  editArea,
  editAreaId,
  setAreaPlacement,
  setSelectedArea,
  setDestinationArea,
  resetGrid,
  applyLayout,
} = gridSlice.actions;
