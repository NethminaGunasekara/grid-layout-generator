import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export { default as useIdValidator } from "./useIdValidator";
