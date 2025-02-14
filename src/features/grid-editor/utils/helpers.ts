import areaColors from "../constants/areaColors";
import { Size } from "../types";
import Unit from "../types/Unit";

/**
 * Checks if a given unit is an intrinsic size unit.
 *
 * Intrinsic size units are those that are relative to the size of the
 * containing block, rather than the size of the content itself. The intrinsic
 * size units are `min-content`, `max-content`, and `auto`.
 *
 * @param unit - the unit to be checked
 * @returns true if the given unit is an intrinsic size unit, false otherwise
 */
export function isIntrinsicSize(unit: Unit): boolean {
  return (
    unit == Unit.MIN_CONTENT || unit == Unit.MAX_CONTENT || unit == Unit.AUTO
  );
}

/**
 * Generates a CSS grid template string from an array of Size objects.
 *
 * @param sizes - The array of Size objects to be converted to a template string
 * @returns a CSS grid template string
 */
export function getTemplate(sizes: Size[]): string {
  return sizes
    .map((size) =>
      isIntrinsicSize(size.unit) ? size.unit : `${size.value}${size.unit}`
    )
    .join(" ")
    .trimEnd();
}

export function getAreaId(usedIds: string[]): string {
  const existingNumbers = usedIds
    .map((id) => parseInt(id.replace("area-", ""), 10))
    .filter(Number.isFinite)
    .sort((a, b) => a - b);

  let newId = 1;

  for (const number of existingNumbers) {
    if (number !== newId) {
      break;
    }
    newId++;
  }

  return `area-${newId}`;
}

export function getAreaColor(usedColors: string[]): string {
  const unusedColor = areaColors.find((color) => !usedColors.includes(color));

  // If all colors are used, return a random color from the list
  if (!unusedColor) {
    return areaColors[Math.floor(Math.random() * areaColors.length)];
  }

  // Otherwise, return the first unused color
  return unusedColor;
}

export function getClassName(...classList: string[]): string {
  return classList.filter(Boolean).join(" ");
}

export interface CellData {
  top: number;
  left: number;
  bottom: number;
  right: number;
  row: number;
  column: number;
}

export const getCellData = () => {
  const cells = document.querySelectorAll(".cell");

  const cellData = Array.from(cells).map((cell) => {
    const { top, left, bottom, right } = cell.getBoundingClientRect();

    return {
      top: Math.round(top),
      left: Math.round(left),
      bottom: Math.round(bottom),
      right: Math.round(right),
      row: Number(cell.getAttribute("data-row")),
      column: Number(cell.getAttribute("data-column")),
    };
  });

  return cellData;
};
