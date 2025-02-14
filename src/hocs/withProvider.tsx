import store from "@/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";

export default function withProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
