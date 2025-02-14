import { useAppDispatch, useAppSelector } from "@/hooks";
import styles from "./AreaID.module.scss";
import { FocusEvent, useEffect, useRef } from "react";
import { editAreaId, setSelectedArea } from "@/features/grid-editor/gridSlice";
import { useIdValidator } from "@/hooks";

export default function AreaID() {
  const selectedAreaId = useAppSelector((state) => state.selectedAreaId);
  const selectedArea = useAppSelector((state) =>
    state.areas.find((area) => area.id === selectedAreaId),
  );

  const input = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { handleValidation } = useIdValidator();

  useEffect(() => {
    if (input.current) {
      input.current.value = selectedAreaId ?? "-";
    }
  }, [selectedAreaId]);

  const handleChange = (e: FocusEvent) => {
    const input = e.target as HTMLInputElement;
    const value = input.value;

    // Validate the input using the custom hook
    if (!handleValidation(value, selectedAreaId!)) {
      input.value = selectedAreaId!; // Revert to the previous valid ID
      return;
    }

    // Update the area ID and the selected area
    dispatch(editAreaId({ id: selectedAreaId!, newId: value }));
    dispatch(setSelectedArea(value));
  };

  return (
    <input
      id="area-id"
      type="text"
      ref={input}
      className={styles.input}
      data-testid="area-id-input"
      defaultValue={selectedArea?.id}
      disabled={!selectedAreaId}
      onBlur={handleChange}
    />
  );
}
