import moveButton from "@/assets/icons/move.svg";
import deleteButton from "@/assets/icons/delete.svg";
import resizeButton from "@/assets/icons/resize.svg";
import styles from "./Area.module.scss";
import { useAppDispatch, useAppSelector, useIdValidator } from "@/hooks";
import {
  editArea,
  editAreaId,
  removeArea,
  setDestinationArea,
  setSelectedArea,
} from "../../../gridSlice";
import { FocusEvent, useEffect, useRef, useState } from "react";
import { getCellData } from "../../../utils/helpers";
import CellData from "../../../types/CellData";

export interface AreaProps {
  id: string;
  selected: boolean;
  rowStart: number;
  columnStart: number;
  rowEnd: number;
  columnEnd: number;
  alignSelf: string;
  justifySelf: string;
  backgroundColor: string;
}

export default function Area({
  id,
  selected,
  rowStart,
  columnStart,
  rowEnd,
  columnEnd,
  alignSelf,
  justifySelf,
  backgroundColor,
}: AreaProps) {
  const dispatch = useAppDispatch();
  const areaRef = useRef<HTMLDivElement | null>(null);
  const moveBtnRef = useRef<HTMLButtonElement | null>(null);
  const resizeBtnRef = useRef<HTMLButtonElement | null>(null);

  const rows = useAppSelector((state) => state.layout.rows);
  const columns = useAppSelector((state) => state.layout.columns);

  // Local state indicating if the area is selected
  // Used for hiding area controls when not selected, or moving the area
  const [isSelected, setIsSelected] = useState(selected);

  // Used to determine if the area can be moved
  const [canMove, setCanMove] = useState<boolean | null>(null);

  // Used to determine if the area can be resized
  const [canResize, setCanResize] = useState<boolean | null>(null);

  // Local state indicating the position of the area
  // Used for repositioning the area when the user drops it on the grid
  const [areaPosition, setAreaPosition] = useState({
    rowStart,
    columnStart,
    rowEnd,
    columnEnd,
  });

  // Area initial size, which set when the user has begun to move the area
  const [initialAreaSize, setInitialAreaSize] = useState({
    width: 0,
    height: 0,
  });

  // Start position of the area, which is set when the user has begun to move the area
  const [areaStartPosition, setAreaStartPosition] = useState({ x: 0, y: 0 });

  // Get the currently selected area from the global state
  const selectedAreaId = useAppSelector((state) => state.selectedAreaId);

  // Update isSelected when the global state changes
  useEffect(() => {
    setIsSelected(selectedAreaId == id);
  }, [id, selectedAreaId]);

  /**
   * Returns the top-left position of the area relative to the viewport.
   * Returns undefined if the area ref is not set.
   */
  const getTopLeftPosition = () => {
    if (!areaRef.current) return undefined;
    const rect = areaRef.current.getBoundingClientRect();

    return {
      x: rect.left,
      y: rect.top,
    };
  };

  const getBottomRightPosition = () => {
    if (!areaRef.current) return undefined;
    const rect = areaRef.current.getBoundingClientRect();

    return {
      x: rect.right,
      y: rect.bottom,
    };
  };

  // Update the area position in the global state when the user stops moving the area
  useEffect(() => {
    if (!canMove) dispatch(editArea({ id: id, ...areaPosition }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canMove]);

  const [startPosition, setStartPosition] = useState({
    clientX: 0,
    clientY: 0,
  });

  useEffect(() => {
    /**
     * Sets the destination area based on the position of the top left corner
     * of the area. If the corner is inside a cell, that cell is added to the
     * destination area. Otherwise, the destination area is reset to undefined.
     */
    const setDestination = () => {
      const cellData = getCellData();
      const topLeft = getTopLeftPosition();

      if (!topLeft) return;

      const matchingCell = cellData.find((cell) => {
        return (
          cell.left <= topLeft.x &&
          cell.right >= topLeft.x &&
          cell.top <= topLeft.y &&
          cell.bottom >= topLeft.y
        );
      });

      // Width of area (columns)
      const areaWidth = columnEnd - columnStart;

      // Height of area (rows)
      const areaHeight = rowEnd - rowStart;

      if (
        matchingCell &&
        matchingCell.row + areaHeight - 1 <= rows.length &&
        matchingCell.column + areaWidth - 1 <= columns.length
      ) {
        // Cells to be occupied
        const cells: { row: number; column: number }[] = [];

        for (let i = 0; i < areaHeight; i++) {
          for (let j = 0; j < areaWidth; j++) {
            cells.push({
              row: matchingCell.row + i,
              column: matchingCell.column + j,
            });
          }
        }

        dispatch(setDestinationArea(cells));

        // Update the area position in state
        setAreaPosition({
          rowStart: matchingCell.row,
          columnStart: matchingCell.column,
          rowEnd: matchingCell.row + areaHeight,
          columnEnd: matchingCell.column + areaWidth,
        });

        return;
      }

      dispatch(setDestinationArea(undefined));

      // Update the area position to default
      setAreaPosition({
        rowStart,
        columnStart,
        rowEnd,
        columnEnd,
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!areaRef.current || !moveBtnRef.current) return;

      setDestination();

      const offsetX = e.clientX - startPosition.clientX;
      const offsetY = e.clientY - startPosition.clientY;

      areaRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    };

    if (canMove === null || !areaRef.current || !moveBtnRef.current) return;

    // If the user is moving the area
    if (canMove) {
      setIsSelected(false);
      areaRef.current.style.cursor = "grabbing";
      document.addEventListener("mousemove", onMouseMove);
    } else {
      setIsSelected(selected);
      areaRef.current.style.cursor = "pointer";
      document.removeEventListener("mousemove", onMouseMove);
    }

    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [
    canMove,
    columnEnd,
    columnStart,
    columns.length,
    dispatch,
    rowEnd,
    rowStart,
    rows.length,
    selected,
    startPosition.clientX,
    startPosition.clientY,
  ]);

  const handleClick = () => {
    if (isSelected) return;

    setIsSelected(!isSelected);

    dispatch(setSelectedArea(id));
  };

  /**
   * Sets a new area position, or resets to its original position and stops the
   * moving of the area. Also resets the destination area to undefined, which resets
   * the background colors of the cells to be occupied
   */
  const handleMouseUp = () => {
    if (!areaRef.current) return;

    // Reset the destination area
    dispatch(setDestinationArea(undefined));

    // If the user was moving the area
    if (canMove) {
      areaRef.current.style.transform = "translate(0, 0)";
      setCanMove(false);

      return;
    }

    // If the user was resizing the area
    setCanResize(false);

    // Update the area position
    if (canMove || canResize) dispatch(editArea({ id: id, ...areaPosition }));

    // Reset the styles applied
    areaRef.current.style.position = "unset";
    areaRef.current.style.top = "unset";
    areaRef.current.style.left = "unset";
    areaRef.current.style.width = "unset";
    areaRef.current.style.height = "unset";
  };

  const getOccupiedCells = (
    rowStart: number,
    columnStart: number,
    rowEnd: number,
    columnEnd: number
  ) => {
    const cells = [];

    for (let row = rowStart; row < rowEnd; row++) {
      for (let column = columnStart; column < columnEnd; column++) {
        cells.push({ row, column });
      }
    }

    return cells;
  };

  // Marks the list of cells that'll be occupied when the user resizes the area
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setDestinationCells = (targetCell: CellData) => {
    const rowStart = areaPosition.rowStart;
    const columnStart = areaPosition.columnStart;
    const rowEnd = targetCell.row + 1;
    const columnEnd = targetCell.column + 1;

    setAreaPosition({ rowStart, columnStart, rowEnd, columnEnd });

    const occupiedCells = getOccupiedCells(
      rowStart,
      columnStart,
      rowEnd,
      columnEnd
    );

    dispatch(setDestinationArea(occupiedCells));
  };

  useEffect(() => {
    if (!areaRef.current) return;

    const onResize = (e: MouseEvent) => {
      if (!areaRef.current) return;

      const offsetX = e.clientX - startPosition.clientX;
      const offsetY = e.clientY - startPosition.clientY;

      areaRef.current.style.position = "fixed";

      areaRef.current.style.top = `${areaStartPosition.y}px`;
      areaRef.current.style.left = `${areaStartPosition.x}px`;

      areaRef.current.style.width = `${initialAreaSize.width + offsetX}px`;
      areaRef.current.style.height = `${initialAreaSize.height + offsetY}px`;

      const cellData = getCellData();
      const bottomRight = getBottomRightPosition();

      if (!bottomRight) return;

      const matchingCell = cellData.find((cell) => {
        return (
          cell.left <= bottomRight.x &&
          cell.right >= bottomRight.x &&
          cell.top <= bottomRight.y &&
          cell.bottom >= bottomRight.y
        );
      });

      if (!matchingCell) return;

      // Cells to be occupied
      setDestinationCells({
        row: matchingCell.row,
        column: matchingCell.column,
      });
    };

    if (canResize === null || !areaRef.current || !resizeBtnRef.current) return;

    // If the user is resizing the area
    if (canResize) {
      setIsSelected(false);
      document.addEventListener("mousemove", onResize);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      setIsSelected(selected);
      document.removeEventListener("mousemove", onResize);
    }

    return () => {
      document.removeEventListener("mousemove", onResize);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    areaStartPosition.x,
    areaStartPosition.y,
    canResize,
    initialAreaSize.height,
    initialAreaSize.width,
    selected,
    setDestinationCells,
    startPosition.clientX,
    startPosition.clientY,
  ]);

  /**
   * Sets the start position and allows the area to be moved.
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!areaRef.current) return;

    const target = e.target as HTMLElement;

    // Record the cursor position at the time of the click
    setStartPosition({
      clientX: e.clientX,
      clientY: e.clientY,
    });

    // prettier-ignore
    // Allow the user to move the area if they clicked on the move button
    if (target == moveBtnRef.current || target.parentElement == moveBtnRef.current) {
      setCanMove(true);

      return;
    }

    // Allow the user to resize the area if they clicked on the resize button
    setCanResize(true);

    // Set the initial area size
    const rect = areaRef.current.getBoundingClientRect();
    setInitialAreaSize({ width: rect.width, height: rect.height });

    // Record initial area position
    setAreaStartPosition({
      x: rect.left,
      y: rect.top,
    });
  };

  const input = useRef<HTMLInputElement>(null);
  const { handleValidation } = useIdValidator();

  useEffect(() => {
    input.current!.value = id;
  }, [id]);

  const handleChange = (e: FocusEvent) => {
    const input = e.target as HTMLInputElement;
    const value = input.value;

    // Validate the input using the custom hook
    if (!handleValidation(value, selectedAreaId!)) {
      input.value = selectedAreaId!; // Revert to the previous valid ID
      return;
    }

    // Update the area ID and the selected area
    dispatch(editAreaId({ id, newId: value }));
    dispatch(setSelectedArea(value));
  };

  return (
    <>
      <div
        ref={areaRef}
        style={{
          backgroundColor,
          gridArea: `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`,
          alignSelf: alignSelf,
          justifySelf: justifySelf,
        }}
        className={styles.area}
        data-id={id}
        data-testid="area"
        data-row-start={rowStart}
        data-column-start={columnStart}
        data-row-end={rowEnd}
        data-column-end={columnEnd}
        onClick={handleClick}
        onMouseUp={handleMouseUp}
      >
        <input
          type="text"
          ref={input}
          className={styles.input}
          data-testid="area-id"
          defaultValue={id}
          onBlur={handleChange}
        />

        <button
          className={isSelected ? styles.deleteButton : styles.hidden}
          onClick={() => dispatch(removeArea(id))}
        >
          <img src={deleteButton} alt="Delete icon" />
        </button>

        <button
          ref={moveBtnRef}
          className={isSelected ? styles.moveButton : styles.hidden}
          onMouseDown={handleMouseDown}
        >
          <img src={moveButton} alt="Move icon" />
        </button>

        <button
          ref={resizeBtnRef}
          className={isSelected ? styles.resizeButton : styles.hidden}
          onMouseDown={handleMouseDown}
        >
          <img src={resizeButton} alt="Resize icon" />
        </button>
      </div>
    </>
  );
}
