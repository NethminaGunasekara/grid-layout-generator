import store from "@/store";
import { ReactNode } from "react";
import { render } from "@testing-library/react";
import { TestOptions } from "vitest";
import gridSlice from "@/features/grid-editor/gridSlice";
import withProvider from "@/hocs/withProvider";

const resetGrid = () => {
  store.dispatch(gridSlice.actions.resetGrid());
};

const customRender = (ui: ReactNode, options?: TestOptions) => {
  // Reset the grid state before rendering the component
  resetGrid();

  return render(ui, { wrapper: withProvider, ...options });
};

export * from "@testing-library/react";

// override render method
export { customRender as render };
