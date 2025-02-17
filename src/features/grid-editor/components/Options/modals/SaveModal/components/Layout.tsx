import { SavedLayout } from "../utils/gridStorage";
import DownloadIcon from "@/assets/icons/save-modal/download.svg";
import EditIcon from "@/assets/icons/save-modal/edit.svg";
import DeleteIcon from "@/assets/icons/save-modal/delete.svg";
import styles from "./Layout.module.scss";
import { getClassName } from "@/features/grid-editor/utils/helpers";
import { MouseEvent } from "react";
import useCodeGenerator from "@/features/code-generator/hooks/useCodeGenerator";
import { downloadFile } from "@/features/code-generator/utils";

interface LayoutProps {
  index: number;
  layout: SavedLayout;
  selected: boolean;
  onClick: (e: MouseEvent) => void;
  onDoubleClick: (e: MouseEvent) => void;
  onRename: (index: number) => void;
  onDelete: (index: number) => void;
}

export default function Layout(props: LayoutProps) {
  const code = useCodeGenerator(props.layout);

  return (
    <>
      <tr
        onClick={props.onClick}
        onDoubleClick={props.onDoubleClick}
        className={
          props.selected
            ? getClassName(styles.layout, styles.active)
            : styles.layout
        }
        data-testid="saved-layout"
      >
        {/* Layout Name */}
        <td className={styles.layoutName} data-testid="layout-name">
          {props.layout.name}
        </td>

        {/* Last Modified Date */}
        <td className={styles.lastModified}>{props.layout.lastModified}</td>

        {/* Actions */}
        <td className={styles.actions}>
          <button
            onClick={() => {
              downloadFile("index.html", code.html);
              downloadFile("styles.css", code.css);
            }}
            className={styles.button}
          >
            <img src={DownloadIcon} alt="Download icon" />
          </button>

          <button
            onClick={() => props.onRename(props.index)}
            className={styles.button}
          >
            <img src={EditIcon} alt="Edit icon" />
          </button>

          <button
            onClick={() => props.onDelete(props.index)}
            className={styles.button}
          >
            <img src={DeleteIcon} alt="Delete icon" />
          </button>
        </td>
      </tr>
    </>
  );
}
