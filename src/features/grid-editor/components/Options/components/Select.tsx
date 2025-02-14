import { useEffect, useRef } from "react";
import styles from "./Select.module.scss";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  setAreaPlacement,
  setSelectedArea,
} from "@/features/grid-editor/gridSlice";

export interface SelectProps {
  type: "areas-available" | "align-self" | "justify-self";
}

export default function Select({ type }: SelectProps) {
  const select = useRef<HTMLSelectElement>(null);
  const areas = useAppSelector((state) => state.areas);
  const selectedAreaId = useAppSelector((state) => state.selectedAreaId);

  const dispatch = useAppDispatch();

  const options =
    type === "areas-available"
      ? areas.map((area) => area.id)
      : ["stretch", "center", "start", "end"];

  const selectedArea = useAppSelector((state) =>
    state.areas.find((area) => area.id === selectedAreaId),
  );

  const defaultValue =
    type == "areas-available"
      ? selectedAreaId
      : type == "align-self"
        ? selectedArea?.alignSelf
        : selectedArea?.justifySelf;

  useEffect(() => {
    if (!select.current) return;

    if (type == "areas-available") {
      select.current.value = selectedAreaId ?? "-";
      return;
    }

    select.current.value = defaultValue ?? "stretch";
  }, [defaultValue, selectedAreaId, type]);

  const onChange = () => {
    if (!select.current) return;

    if (type === "areas-available") {
      dispatch(setSelectedArea(select.current.value));
      return;
    }

    dispatch(
      setAreaPlacement({
        id: selectedAreaId!,
        type,
        value: select.current.value,
      }),
    );
  };

  return (
    <select
      ref={select}
      className={styles.select}
      defaultValue={selectedAreaId ? (defaultValue ?? "stretch") : "-"}
      disabled={!selectedAreaId}
      onChange={onChange}
      data-testid={type}
      aria-label={type.replace("-", " ")}
    >
      {selectedAreaId &&
        options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}

      {!selectedAreaId && <option value="-">-</option>}
    </select>
  );
}
