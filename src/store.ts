import { configureStore } from "@reduxjs/toolkit";
import gridSlice from "./features/grid-editor/gridSlice";

const store = configureStore({
  reducer: gridSlice.reducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
