import ModalBackground from "@/components/ModalBackground/ModalBackground";
import SaveIcon from "@/assets/icons/save-modal/save.svg";
import styles from "./SaveModal.module.scss";
import { MouseEvent, useState } from "react";
import RenameModal from "./RenameModal";
import {
  deleteLayout,
  overwriteLayout,
  retrieveLayouts,
  SavedLayout,
} from "./utils/gridStorage";
import Layout from "./components/Layout";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { applyLayout } from "@/features/grid-editor/gridSlice";

interface SaveModalProps {
  onClose: () => void;
}

interface RenameModalState {
  visibility: "shown" | "hidden";
  actionType?: "save" | "rename";
  index?: number;
  onFinish?: () => void;
}

export default function SaveModal({ onClose }: SaveModalProps) {
  const [selectedLayoutIndex, setSelectedLayoutIndex] = useState<
    number | undefined
  >(undefined);

  const [renameModalState, setRenameModalState] = useState<RenameModalState | null>(null); // prettier-ignore

  const [layouts, setLayouts] = useState<SavedLayout[]>(
    () => retrieveLayouts() || []
  );

  const layout = useAppSelector((state) => state.layout);
  const areas = useAppSelector((state) => state.areas);

  const dispatch = useAppDispatch();

  const handleSave = () => {
    if (selectedLayoutIndex != undefined && layouts[selectedLayoutIndex]) {
      // Overwrite the layout at the selected index with the current grid state
      overwriteLayout(selectedLayoutIndex, {
        name: layouts[selectedLayoutIndex].name,
        layout: {
          layout,
          areas,
        },
        lastModified: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });

      toast.success(
        `The layout "${layouts[selectedLayoutIndex].name}" has been updated successfully!`
      );

      // Update the list of layouts available in state
      setLayouts(retrieveLayouts() || []);

      return;
    }

    setRenameModalState({
      visibility: "shown",
      actionType: "save",
      onFinish: () => setLayouts(retrieveLayouts() || []),
    });

    setSelectedLayoutIndex(layouts.length);
  };

  const handleRename = (index: number) => {
    setRenameModalState({
      visibility: "shown",
      actionType: "rename",
      index,
      onFinish: () => setLayouts(retrieveLayouts() || []),
    });
  };

  const handleDeselect = (e: MouseEvent) => {
    // Deselect the currently selected layout if the user clicks outside of it
    if (["DIV", "H2", "SPAN", "TH"].includes((e.target as HTMLElement).tagName))
      setSelectedLayoutIndex(undefined);
  };

  const loadLayout = (index: number) => {
    dispatch(
      applyLayout({
        ...layouts[index].layout,
      })
    );

    toast.success(
      `The layout "${layouts[index].name}" has been loaded successfully!`
    );

    onClose();
  };

  const handleDelete = (index: number) => {
    deleteLayout(index);

    // Update the list of layouts available
    setLayouts(retrieveLayouts() || []);

    toast.success(
      `The layout "${layouts[index].name}" has been deleted successfully!`
    );
  };

  return (
    <>
      <ModalBackground onCLick={onClose}>
        <div
          id="save-modal"
          className={styles.saveModal}
          onClick={handleDeselect}
          data-testid="save-modal"
        >
          {/* Modal titlebar */}
          <div className={styles.titlebar}>
            <h2>
              Saved <span>Grid</span> Layouts
            </h2>

            <button type="button" onClick={handleSave} data-testid="set-name">
              <img src={SaveIcon} alt="Save icon" />
              <span>Save Layout</span>
            </button>
          </div>

          {/* Modal body */}
          <div className={styles.modalBody}>
            <table>
              <thead>
                <tr>
                  <th>Layout Name</th>
                  <th>Last Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {layouts.map((layout, index) => {
                  return (
                    <Layout
                      key={layout.index}
                      index={index}
                      layout={layout}
                      selected={selectedLayoutIndex === layout.index}
                      onClick={(e: MouseEvent) => {
                        if ((e.target as HTMLElement).tagName != "TD") return;

                        setSelectedLayoutIndex(layout.index);
                      }}
                      onDoubleClick={(e: MouseEvent) => {
                        if ((e.target as HTMLElement).tagName != "TD") return;

                        loadLayout(layout.index);
                      }}
                      onRename={handleRename}
                      onDelete={handleDelete}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Modal buttons */}
          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>

            <button
              type="button"
              className={styles.loadBtn}
              onClick={() => loadLayout(selectedLayoutIndex!)}
              data-testid="load-selected"
            >
              Load Selected
            </button>
          </div>
        </div>
      </ModalBackground>

      {renameModalState?.visibility == "shown" && (
        <RenameModal
          index={renameModalState.index}
          onFinish={renameModalState.onFinish!}
          onClose={() => setRenameModalState({ visibility: "hidden" })}
          actionType={renameModalState.actionType!}
        />
      )}
    </>
  );
}
