import { useEffect, useRef } from "react";
import styles from "./Count.module.scss";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { toast } from "react-toastify";
import { editArea } from "@/features/grid-editor/gridSlice";

interface InputProps {
  id: string;
  type: "row-start" | "column-start" | "row-end" | "column-end";
}

export default function Input({ id, type }: InputProps) {
  const input = useRef<HTMLInputElement>(null);
  const incrementBtn = useRef<HTMLButtonElement>(null);
  const decrementBtn = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();

  const selectedAreaId = useAppSelector((state) => state.selectedAreaId);
  const selectedArea = useAppSelector((state) =>
    state.areas.find((area) => area.id === selectedAreaId),
  );
  const defaultValue =
    type == "row-start"
      ? selectedArea?.rowStart
      : type == "column-start"
        ? selectedArea?.columnStart
        : type == "row-end"
          ? selectedArea?.rowEnd
          : selectedArea?.columnEnd;

  // Update the input value based on the selected area's start/end
  useEffect(() => {
    if (!input.current || !defaultValue) return;

    input.current.value = defaultValue.toString();
  }, [defaultValue]);

  const rows = useAppSelector((state) => state.layout.rows);
  const columns = useAppSelector((state) => state.layout.columns);

  let maxValue;

  switch (type) {
    case "row-start":
      maxValue = rows.length;
      break;

    case "column-start":
      maxValue = columns.length;
      break;

    case "row-end":
      maxValue = rows.length + 1;
      break;

    default:
      maxValue = columns.length + 1;
  }

  const handleChange = () => {
    const value = Number(input.current!.value);

    // Check if the value is less than 1, or empty
    if (!value || value < 1) {
      input.current!.value = defaultValue!.toString();

      toast.error(
        `The minimum allowed value for "${type}" is 1. Please try again.`,
      );

      return;
    }

    // Check if the value is greater than the maximum
    if (value > maxValue) {
      input.current!.value = defaultValue!.toString();

      toast.error(
        `The maximum allowed value for "${type}" is ${maxValue}. Please try again.`,
      );

      return;
    }

    const rowStart = type == "row-start" ? value : selectedArea!.rowStart;
    const rowEnd = type == "row-end" ? value : selectedArea!.rowEnd;
    const columnStart =
      type == "column-start" ? value : selectedArea!.columnStart;
    const columnEnd = type == "column-end" ? value : selectedArea!.columnEnd;

    // Check if the end position is greater than or equal to the start position
    if (rowStart >= rowEnd || columnStart >= columnEnd) {
      toast.error(
        "The end position must be greater than or equal to the start position.",
      );

      input.current!.value = defaultValue!.toString();
      return;
    }

    // If none of the above conditions are met, update the start and end positions
    dispatch(
      editArea({
        id: selectedAreaId!,
        rowStart,
        columnStart,
        rowEnd,
        columnEnd,
      }),
    );
  };

  return (
    <>
      <div className={styles.count}>
        <button
          ref={decrementBtn}
          className={styles.decrementBtn}
          onClick={() => {
            input.current?.stepDown();
            handleChange();
          }}
        >
          -
        </button>

        <input
          id={id}
          type="number"
          ref={input}
          min={1}
          max={maxValue}
          defaultValue={defaultValue}
          onBlur={handleChange}
        />

        <button
          ref={incrementBtn}
          className={styles.incrementBtn}
          onClick={() => {
            input.current?.stepUp();
            handleChange();
          }}
        >
          +
        </button>
      </div>
    </>
  );
}
