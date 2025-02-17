import { renderHook } from "@testing-library/react";
import { toast } from "react-toastify";
import useIdValidator from "./useIdValidator";
import { useAppSelector } from "@/hooks";
import { beforeEach, describe, expect, it, MockedFunction, vi } from "vitest";

// Mock the toast library
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock the useAppSelector hook
vi.mock("@/hooks", () => ({
  useAppSelector: vi.fn(),
}));

describe("useIdValidator", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset all mocks before each test
  });

  // Mock areas data
  const mockAreas = [{ id: "existing-id-1" }, { id: "existing-id-2" }];

  // Set up the mock for useAppSelector
  beforeEach(() => {
    (useAppSelector as MockedFunction<typeof useAppSelector>).mockReturnValue(
      mockAreas,
    );
  });

  it("should return isValid: true if the ID is the same as the current ID", () => {
    const { result } = renderHook(() => useIdValidator());
    const { validateId } = result.current;

    const currentId = "current-id";
    const id = "current-id";

    const validationResult = validateId(id, currentId);
    expect(validationResult.isValid).toBe(true);
    expect(validationResult.error).toBeUndefined();
  });

  it("should return isValid: false if the ID is empty", () => {
    const { result } = renderHook(() => useIdValidator());
    const { validateId } = result.current;

    const validationResult = validateId("", null);
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.error).toBe("Area ID cannot be empty!");
  });

  it("should return isValid: false if the ID already exists", () => {
    const { result } = renderHook(() => useIdValidator());
    const { validateId } = result.current;

    const id = "existing-id-1"; // This ID exists in mockAreas
    const validationResult = validateId(id, null);
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.error).toBe("Area ID already exists!");
  });

  it("should return isValid: false if the ID does not conform to HTML ID rules", () => {
    const { result } = renderHook(() => useIdValidator());
    const { validateId } = result.current;

    const invalidIds = [
      "1invalid", // Starts with a number
      "invalid@id", // Contains invalid character
      "invalid id", // Contains space
      "-invalid", // Starts with a hyphen
    ];

    invalidIds.forEach((id) => {
      const validationResult = validateId(id, null);
      expect(validationResult.isValid).toBe(false);
      expect(validationResult.error).toBe(
        "Area ID must start with a letter and include only letters, numbers, -, _, :, or .",
      );
    });
  });

  it("should return isValid: true if the ID is valid and unique", () => {
    const { result } = renderHook(() => useIdValidator());
    const { validateId } = result.current;

    const validIds = [
      "valid-id",
      "valid_id",
      "valid.id",
      "valid:id",
      "validId123",
    ];

    validIds.forEach((id) => {
      const validationResult = validateId(id, null);
      expect(validationResult.isValid).toBe(true);
      expect(validationResult.error).toBeUndefined();
    });
  });

  it("should call toast.error with the correct message if the ID is invalid", () => {
    const { result } = renderHook(() => useIdValidator());
    const { handleValidation } = result.current;

    const invalidId = "invalid@id";
    const isValid = handleValidation(invalidId, null);

    expect(isValid).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      "Area ID must start with a letter and include only letters, numbers, -, _, :, or .",
    );
  });

  it("should not call toast.error if the ID is valid", () => {
    const { result } = renderHook(() => useIdValidator());
    const { handleValidation } = result.current;

    const validId = "valid-id";
    const isValid = handleValidation(validId, null);

    expect(isValid).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });
});
