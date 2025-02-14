import { useDispatch } from "react-redux";
import { editColumn, editRow } from "../../gridSlice";
import styles from "./SizeInput.module.scss";
import { useEffect, useRef } from "react";
import { Size, Unit } from "../../types";
import { isIntrinsicSize } from "../../utils/helpers";

interface SizeInputProps {
  target: "row-size" | "col-size";
  index: number;
}

export default function SizeInput({ target, index }: SizeInputProps) {
  // eslint-disable-next-line prefer-const
  let value = useRef<Size>({ value: 1, unit: Unit.FR });

  const dispatch = useDispatch();
  const action = target === "row-size" ? editRow : editColumn;

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.addEventListener("focusout", () => {
      if (!input.current || !value.current) return;

      // prettier-ignore
      const SIZE_REGEX = /^(-?\d*\.?\d+)(fr|px|%|em|rem|vw|vh|ch|ex)$|^(min-content|max-content|auto)$/;

      const match = input.current.value.match(SIZE_REGEX);

      if (!match) {
        // Display a notification
        input.current.value = isIntrinsicSize(value.current.unit as Unit)
          ? value.current.unit.toString()
          : `${value.current.value}${value.current.unit}`;
        return;
      }

      if (match[1]) {
        // Update the local state, which will be later used to reset the input value
        value.current.value = Number(match[1]);
        value.current.unit = match[2] as Unit;

        // Apply the new size to the row/column
        dispatch(
          action({
            index,
            newSize: { value: Number(match[1]), unit: match[2] as Unit },
          }),
        );
        return;
      }

      value.current.value = 1;
      value.current.unit = match[0] as Unit;

      dispatch(
        action({ index, newSize: { value: 1, unit: match[0] as Unit } }),
      );
    });
  }, [action, dispatch, index]);

  return (
    <input
      type="text"
      className={styles.sizeInput}
      data-testid={target}
      aria-label={`Size of ${target == "row-size" ? "row" : "column"} ${index + 1}`}
      ref={input}
      defaultValue={
        isIntrinsicSize(value.current.unit)
          ? value.current.unit
          : `${value.current.value}${value.current.unit}`
      }
    />
  );
}
