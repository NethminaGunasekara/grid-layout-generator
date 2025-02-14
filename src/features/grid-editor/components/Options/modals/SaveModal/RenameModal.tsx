import ModalBackground from "@/components/ModalBackground/ModalBackground";
import CloseBtn from "@/assets/icons/confirmation-modal/close.svg";
import styles from "./RenameModal.module.scss";
import { retrieveLayouts, SavedLayout, saveLayout } from "./utils/gridStorage";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "@/hooks";

interface RenameModalProps {
  index?: number;
  onFinish: () => void;
  onClose: () => void;
  actionType: "save" | "rename";
}

export default function RenameModal({
  index,
  onFinish,
  onClose,
  actionType,
}: RenameModalProps) {
  const input = useRef<HTMLInputElement>(null);

  const layout = useAppSelector((state) => state.layout);
  const areas = useAppSelector((state) => state.areas);

  const handleSave = () => {
    const userInput = input.current!.value;

    if (!userInput) {
      toast.error("Please enter a name for this layout.");
      return;
    }

    if (retrieveLayouts()?.find((layout) => layout.name === userInput)) {
      toast.error("A layout with this name already exists.");
      return;
    }

    saveLayout({
      name: userInput,
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

    toast.success(`The layout "${userInput}" has been saved successfully!`);

    onFinish(); // Update the list of available layouts

    onClose(); // Close the rename modal
  };

  const handleRename = () => {
    const userInput = input.current!.value;

    if (!userInput) {
      toast.error("Please enter a name for this layout.");
      return;
    }

    if (retrieveLayouts()?.find((layout) => layout.name === userInput)) {
      toast.error("A layout with this name already exists.");
      return;
    }

    const savedLayouts: SavedLayout[] | undefined = retrieveLayouts();

    const layout = savedLayouts!.find((layout) => layout.index === index);

    const previousName = layout!.name;

    if (layout) {
      layout.name = userInput;
      layout.lastModified = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    localStorage.setItem("saved-layouts", JSON.stringify(savedLayouts));

    toast.success(
      `The layout "${previousName}" has been renamed successfully!`
    );

    onFinish(); // Update the list of available layouts

    onClose(); // Close the rename modal
  };

  useEffect(() => {
    if (actionType === "rename") {
      const savedLayouts: SavedLayout[] | undefined = retrieveLayouts();

      const layout = savedLayouts!.find((layout) => layout.index === index);

      input.current!.value = layout!.name;
    }
  }, [actionType, index]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (actionType === "save") {
        handleSave();
      } else if (actionType === "rename") {
        handleRename();
      }
    }
  };

  return (
    <ModalBackground onCLick={onClose}>
      <div className={styles.renameModal}>
        {/* Modal Titlebar */}
        <div className={styles.titleBar}>
          <span>{actionType === "save" ? "Save" : "Rename"} Layout</span>
          <button type="button" onClick={onClose}>
            <img src={CloseBtn} alt="Close icon" />
          </button>
        </div>

        {/* Name Input */}
        <div className={styles.input}>
          <input
            type="text"
            ref={input}
            id="name"
            placeholder="What's this layout called?"
            data-testid="layout-name"
            aria-label="Layout name input"
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={actionType === "save" ? handleSave : handleRename}
          className={styles.saveBtn}
          data-testid="save-layout"
        >
          {actionType === "save" ? "Save" : "Rename"} Layout
        </button>
      </div>
    </ModalBackground>
  );
}
