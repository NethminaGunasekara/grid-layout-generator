import { useAppDispatch, useAppSelector } from "@/hooks";
import styles from "./Count.module.scss";
import {
  setColumnsCount,
  setRowsCount,
} from "@/features/grid-editor/gridSlice";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

interface CountProps {
  id: string;
  type: "rowCount" | "columnCount";
}

export default function Count({ id, type }: CountProps) {
  const input = useRef<HTMLInputElement>(null);
  const incrementBtn = useRef<HTMLButtonElement>(null);
  const decrementBtn = useRef<HTMLButtonElement>(null);

  const dispatch = useAppDispatch();

  const action = type === "rowCount" ? setRowsCount : setColumnsCount;

  const count = useAppSelector((state) =>
    type === "columnCount"
      ? state.layout.columns.length
      : state.layout.rows.length,
  );

  useEffect(() => {
    if (input.current) input.current.value = count.toString();
  }, [count]);

  const handleChange = () => {
    const value = Number(input.current?.value);

    if (!input.current) return;

    if (value < 1) {
      input.current.value = count.toString();

      toast("Tiny grids are cute, but this is too tiny. Try 1 or more!");

      return;
    }

    if (value > 12) {
      input.current.value = count.toString();

      toast("Over 12? We’re not designing a parking lot here!");

      return;
    }

    if (value > 12 || value < 1 || value == count) return;

    // Update the row/column count in the store
    dispatch(action(value));
  };

  return (
    <>
      <div className={styles.count}>
        <button
          ref={decrementBtn}
          className={styles.decrementBtn}
          data-testid={
            type == "rowCount" ? "row-decrement" : "column-decrement"
          }
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
          max={12}
          defaultValue={count}
          onBlur={handleChange}
        />

        <button
          ref={incrementBtn}
          className={styles.incrementBtn}
          data-testid={
            type == "rowCount" ? "row-increment" : "column-increment"
          }
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
