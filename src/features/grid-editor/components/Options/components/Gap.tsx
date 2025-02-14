import { ChangeEvent, useRef, useState } from "react";
import styles from "./Gap.module.scss";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setColumnGap, setRowGap } from "@/features/grid-editor/gridSlice";
import { Unit } from "@/features/grid-editor/types";

interface GapProps {
  id: string;
  type: "rowGap" | "columnGap";
}

type GapUnit = Unit.PX | Unit.EM | Unit.PERCENT;

export default function Gap({ id, type }: GapProps) {
  const [maxValue, setMaxValue] = useState(48);
  const currentGap = useAppSelector((state) =>
    type === "rowGap" ? state.layout.rowGap : state.layout.columnGap,
  );

  const select = useRef<HTMLSelectElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  const checkSize = (gapValue: number, gapUnit: GapUnit) => {
    const maxValues: Record<GapUnit, number> = {
      px: 48,
      em: 4,
      "%": 100,
    };

    const unitType = type == "rowGap" ? "Row" : "Column";
    const maxGap = maxValues[gapUnit];

    if (gapValue < 0) {
      toast(
        `Oops! Negative gaps? ${unitType} gaps in "${gapUnit}" must be positive!`,
      );
      return false;
    }

    if (gapValue > maxGap) {
      toast(
        `The maximum allowed ${unitType.toLowerCase()} gap is ${maxGap}${gapUnit}.`,
      );
      return false;
    }

    return gapValue > 0;
  };

  const onChange = (e: ChangeEvent) => {
    if (!input.current || !select.current || !e.target) return;

    const target = e.target;

    const gapValue = Number(input.current.value);
    const gapUnit = select.current.value as GapUnit;

    // Exit if there's no change
    if (gapValue === currentGap.value && gapUnit === currentGap.unit) return;

    // Set the maximum value based on the unit
    const maxValues: Record<GapUnit, number> = { px: 48, em: 4, "%": 100 };
    setMaxValue(maxValues[gapUnit]);

    if (!checkSize(gapValue, gapUnit)) {
      dispatch(
        type === "rowGap"
          ? setRowGap({ value: 0, unit: gapUnit })
          : setColumnGap({ value: 0, unit: gapUnit }),
      );

      // Reset the value
      input.current.value = "0";

      // If the target is an input (i.e. the user has set gap value to 0)
      if (target.tagName == "INPUT") {
        toast.success(
          `${type === "rowGap" ? "Row" : "Column"} gap updated successfully.`,
        );
      }

      return;
    }

    // Update gap in the store if provided size is valid
    dispatch(
      type === "rowGap"
        ? setRowGap({ value: gapValue, unit: gapUnit })
        : setColumnGap({ value: gapValue, unit: gapUnit }),
    );

    // Success message
    toast.success(
      `${type === "rowGap" ? "Row" : "Column"} gap updated successfully.`,
    );
  };

  return (
    <>
      <div className={styles.gapInput}>
        <input
          id={id}
          type="number"
          ref={input}
          min="0"
          max={maxValue}
          step="1"
          defaultValue="0"
          onBlur={onChange}
        />

        <select
          ref={select}
          defaultValue={"px"}
          onChange={onChange}
          aria-label={`${type === "rowGap" ? "Row" : "Column"} gap unit`}
        >
          <option value="px">px</option>
          <option value="em">em</option>
          <option value="%">%</option>
        </select>
      </div>
    </>
  );
}
