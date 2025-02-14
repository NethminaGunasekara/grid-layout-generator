import { toast } from "react-toastify";
import { useAppSelector } from "@/hooks";

export default function useIdValidator() {
  const areas = useAppSelector((state) => state.areas);

  /**
   * Validates the given ID against various criteria to ensure it is suitable
   * for use as an area ID. It checks if the ID is not empty, does not already
   * exist in the list of areas, conforms to HTML ID naming rules, and is not
   * the same as the current ID if provided.
   *
   * @param id - The ID to be validated
   * @param currentId - The current ID of the area
   * @returns An object with a boolean `isValid` indicating whether the ID is
   *          valid, and an optional `error` message if invalid.
   */

  const validateId = (
    id: string,
    currentId: string | null
  ): { isValid: boolean; error?: string } => {
    const trimmedId = id.trim();

    if (trimmedId === currentId) {
      return { isValid: true };
    }

    if (!trimmedId) {
      return { isValid: false, error: "Area ID cannot be empty!" };
    }

    if (areas.some((area) => area.id === trimmedId)) {
      return { isValid: false, error: "Area ID already exists!" };
    }

    const isValidHtmlId = /^[a-zA-Z][\w:.-]*$/.test(trimmedId);
    if (!isValidHtmlId) {
      return {
        isValid: false,
        error:
          "Area ID must start with a letter and include only letters, numbers, -, _, :, or .",
      };
    }

    return { isValid: true };
  };

  const handleValidation = (id: string, currentId: string | null): boolean => {
    const { isValid, error } = validateId(id, currentId);
    if (!isValid && error) {
      toast.error(error);
    }
    return isValid;
  };

  return { validateId, handleValidation };
}
