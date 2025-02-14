import styles from "./code-generator.module.scss";
import { getClassName } from "../grid-editor/utils/helpers";
import { useEffect, useState } from "react";
import { CodeBlock, dracula } from "react-code-blocks";
import CopyIcon from "@/assets/icons/copy.svg";
import TickIcon from "@/assets/icons/tick.svg";
import useCodeGenerator from "./hooks/useCodeGenerator";
import { toast } from "react-toastify";
import ModalBackground from "@/components/ModalBackground/ModalBackground";
import { downloadFile } from "./utils";

export default function CodeGenerator({ onClose }: { onClose: () => void }) {
  const [activeLanguage, setActiveLanguage] = useState<"html" | "css">("html");
  const [copied, setCopied] = useState(false);

  const code = useCodeGenerator();

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1200);
    }
  }, [copied]);

  const handleDownload = () => {
    if (activeLanguage === "html") {
      downloadFile("index.html", code.html);
    } else if (activeLanguage === "css") {
      downloadFile("styles.css", code.css);
    }
  };

  const normalize = (str: string) => str.trim().replace(/\r\n|\r|\n/g, "\n");

  const copyCode = () => {
    if (copied) return; // Prevent duplicate copying

    const currentCode =
      activeLanguage === "html" ? normalize(code.html) : normalize(code.css);

    // Check if the code is already in the clipboard
    navigator.clipboard.readText().then((text) => {
      if (normalize(text) === currentCode) {
        return; // Exit if the code is already in the clipboard
      } else {
        // Write the code to the clipboard if it's different
        navigator.clipboard.writeText(currentCode).then(() => {
          setCopied(true); // Set copied state
          // Show a notification
          toast.success("Code copied to clipboard!");
        });
      }
    });
  };

  return (
    <ModalBackground onCLick={onClose}>
      <div className={styles.codeGenerator} data-testid="code-generator">
        {/* Modal titlebar */}
        <div className={styles.titleBar}>
          <div className={styles.codeSelector}>
            <button
              onClick={() => setActiveLanguage("html")}
              className={
                activeLanguage === "html"
                  ? getClassName(styles.htmlBtn, styles.activeTab)
                  : styles.htmlBtn
              }
              data-testid="html-btn"
            >
              HTML
            </button>

            <button
              onClick={() => setActiveLanguage("css")}
              className={
                activeLanguage === "css"
                  ? getClassName(styles.cssBtn, styles.activeTab)
                  : styles.cssBtn
              }
              data-testid="css-btn"
            >
              CSS
            </button>
          </div>

          <button type="button" className={styles.copyBtn} onClick={copyCode}>
            <img
              src={CopyIcon}
              className={copied ? styles.hidden : styles.copyIcon}
              alt="Copy icon"
            />
            <img
              src={TickIcon}
              className={copied ? styles.tickIcon : styles.hidden}
              alt="Tick icon"
            />
          </button>
        </div>

        {/* Modal body */}
        <div className={styles.body} data-testid="code-block">
          <CodeBlock
            text={activeLanguage === "html" ? code.html : code.css}
            language={activeLanguage}
            showLineNumbers={true}
            theme={dracula}
          />
        </div>

        {/* Modal buttons */}
        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
            data-testid="close-modal"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className={styles.downloadBtn}
          >
            Download
          </button>
        </div>
      </div>
    </ModalBackground>
  );
}
