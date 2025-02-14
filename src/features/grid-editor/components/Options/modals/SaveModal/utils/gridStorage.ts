import { GridState } from "@/features/grid-editor/types";

export interface SavedLayout {
  index: number;
  name: string;
  layout: GridState;
  lastModified: string;
}

export interface LayoutData {
  name: string;
  layout: GridState;
  lastModified: string;
}

/**
 * Retrieves the saved grid layouts from local storage.
 *
 * @returns { SavedLayout[] | undefined }
 */

function retrieveLayouts() {
  const savedLayouts = localStorage.getItem("saved-layouts");

  if (!savedLayouts) return undefined;

  const parsedLayouts = JSON.parse(savedLayouts) as LayoutData[];

  return parsedLayouts.map((layout, index) => ({ index, ...layout }));
}

/**
 * Saves a grid layout to local storage.
 *
 * @param {LayoutData} layout - Layout data to save
 */

const saveLayout = (layout: LayoutData) => {
  const savedLayouts = localStorage.getItem("saved-layouts");

  if (savedLayouts) {
    const parsedLayouts = JSON.parse(savedLayouts) as LayoutData[];
    parsedLayouts.push(layout);
    localStorage.setItem("saved-layouts", JSON.stringify(parsedLayouts));
    return;
  }

  localStorage.setItem("saved-layouts", JSON.stringify([layout]));
};

/**
 * Renames a specific grid layout stored in local storage.
 *
 * @param {number} index - The index of the layout to rename.
 * @param {string} newName - The new name to assign to the layout.
 */
const renameLayout = (index: number, newName: string) => {
  const savedLayouts = localStorage.getItem("saved-layouts");

  if (savedLayouts) {
    const parsedLayouts = JSON.parse(savedLayouts) as LayoutData[];

    parsedLayouts[index].name = newName;

    parsedLayouts[index].lastModified = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    localStorage.setItem("saved-layouts", JSON.stringify(parsedLayouts));
  }
};

/**
 * Deletes a grid layout from local storage based on its index.
 *
 * @param {number} index - The index of the layout to delete.
 */

const deleteLayout = (index: number) => {
  const savedLayouts = localStorage.getItem("saved-layouts");

  if (savedLayouts) {
    const parsedLayouts = JSON.parse(savedLayouts) as LayoutData[];
    parsedLayouts.splice(index, 1);
    localStorage.setItem("saved-layouts", JSON.stringify(parsedLayouts));
  }
};

/**
 * Overwrites a grid layout stored in local storage at the given index.
 *
 * @param {number} index - The index of the layout to overwrite.
 * @param {LayoutData} layout - The new layout data to store at the given index.
 */
const overwriteLayout = (index: number, layout: LayoutData) => {
  const savedLayouts = localStorage.getItem("saved-layouts");

  if (savedLayouts) {
    const parsedLayouts = JSON.parse(savedLayouts) as LayoutData[];
    parsedLayouts[index] = layout;
    localStorage.setItem("saved-layouts", JSON.stringify(parsedLayouts));
  }
};

export {
  retrieveLayouts,
  saveLayout,
  renameLayout,
  deleteLayout,
  overwriteLayout,
};
