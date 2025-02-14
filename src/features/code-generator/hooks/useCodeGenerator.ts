import { SavedLayout } from "@/features/grid-editor/components/Options/modals/SaveModal/utils/gridStorage";
import SelfAlignment from "@/features/grid-editor/types/SelfAlignment";
import { useAppSelector } from "@/hooks";

export default function useCodeGenerator(layoutData?: SavedLayout) {
  let layout = useAppSelector((state) => state.layout);
  let areas = useAppSelector((state) => state.areas);

  if (layoutData) {
    layout = layoutData.layout.layout;
    areas = layoutData.layout.areas;
  }

  /**
   * Generates an HTML representation of the current grid layout.
   */
  const generateHTML = () => {
    const spacing = "  ";

    let html: string = "";
    html += '<div class="container">';

    areas.forEach((area) => {
      html += `\n${spacing}<div id="${area.id}"></div>`;
    });

    if (areas.length === 0) html += "\n";

    html += "\n</div>";

    return html;
  };

  // Convert a Size object to a css size
  const sizeToCss = (size: { value: number; unit: string }) =>
    `${size.value}${size.unit}`;

  /**
   * Returns a CSS grid template string from an array of Size objects.
   * If all sizes are the same, returns a "repeat" template, otherwise
   * returns a template string with all sizes concatenated with spaces.
   */
  const getGridTemplate = (sizes: { value: number; unit: string }[]) => {
    const uniqueSizes = Array.from(new Set(sizes.map(sizeToCss)));

    if (uniqueSizes.length === 1) {
      return `repeat(${sizes.length}, ${uniqueSizes[0]})`;
    }

    return sizes.map(sizeToCss).join(" ");
  };

  const generateCSS = () => {
    const spacing = "  ";

    let css: string = "";

    // Grid styles
    css += `.container {\n`;
    css += `${spacing}display: grid;\n`;

    // Template columns
    css += `${spacing}grid-template-columns: ${getGridTemplate(
      layout.columns
    )};\n`;

    // Template rows
    css += `${spacing}grid-template-rows: ${getGridTemplate(layout.rows)};\n`;

    // "row-gap" and "column-gap" values
    css += `${spacing}column-gap: ${layout.columnGap.value}${layout.columnGap.unit};\n`;
    css += `${spacing}row-gap: ${layout.rowGap.value}${layout.rowGap.unit};\n}`;

    areas.forEach((area) => {
      css += `
      \n#${area.id} {\n`;
      css += `${spacing}grid-area: ${area.rowStart} / ${area.columnStart} / ${area.rowEnd} / ${area.columnEnd};\n`;

      if (area.alignSelf && area.alignSelf != SelfAlignment.Stretch)
        css += `${spacing}align-self: ${area.alignSelf};\n`;

      if (area.justifySelf && area.justifySelf != SelfAlignment.Stretch)
        css += `${spacing}justify-self: ${area.justifySelf};\n`;
      css += `}`;
    });

    return css;
  };

  return {
    html: generateHTML(),
    css: generateCSS(),
  };
}
