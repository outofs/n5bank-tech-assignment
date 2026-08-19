import type { StylesConfig } from "react-select";

import type { SelectOption } from "./select-options";

export function createSharedSelectStyles<IsMulti extends boolean>(
  hasError: boolean,
): StylesConfig<SelectOption, IsMulti> {
  return {
    control: (base, state) => ({
      ...base,
      minHeight: 44,
      borderRadius: 12,
      backgroundColor: "#ffffff",
      borderColor: hasError
        ? "#fda4af"
        : state.isFocused
          ? "#57534e"
          : "#d6d3d1",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(120, 113, 108, 0.12)"
        : "none",
      "&:hover": {
        borderColor: hasError ? "#fb7185" : "#a8a29e",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "2px 12px",
      gap: 4,
    }),
    input: (base) => ({
      ...base,
      color: "#0f172a",
      margin: 0,
      padding: 0,
    }),
    placeholder: (base) => ({
      ...base,
      color: "#a8a29e",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#0f172a",
    }),
    multiValue: (base) => ({
      ...base,
      borderRadius: 9999,
      backgroundColor: "#f5f5f4",
      border: "1px solid #e7e5e4",
    }),
    multiValueLabel: (base) => ({
      ...base,
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 2,
      paddingBottom: 2,
      color: "#44403c",
      fontSize: "0.75rem",
      fontWeight: 500,
    }),
    multiValueRemove: (base) => ({
      ...base,
      borderRadius: 9999,
      color: "#78716c",
      "&:hover": {
        backgroundColor: "#e7e5e4",
        color: "#1c1917",
      },
    }),
    menu: (base) => ({
      ...base,
      marginTop: 8,
      borderRadius: 12,
      border: "1px solid #e7e5e4",
      overflow: "hidden",
      boxShadow:
        "0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.08)",
      zIndex: 20,
    }),
    menuList: (base) => ({
      ...base,
      paddingTop: 4,
      paddingBottom: 4,
      maxHeight: 240,
    }),
    option: (base, state) => ({
      ...base,
      cursor: "pointer",
      backgroundColor: state.isSelected
        ? "#0c0a09"
        : state.isFocused
          ? "#f5f5f4"
          : "#ffffff",
      color: state.isSelected ? "#ffffff" : "#44403c",
      fontSize: "0.875rem",
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 12,
      paddingRight: 12,
      "&:active": {
        backgroundColor: state.isSelected ? "#0c0a09" : "#e7e5e4",
      },
    }),
    indicatorsContainer: (base) => ({
      ...base,
      color: "#a8a29e",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#a8a29e",
      "&:hover": {
        color: "#57534e",
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "#a8a29e",
      "&:hover": {
        color: "#57534e",
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: "none",
    }),
    noOptionsMessage: (base) => ({
      ...base,
      color: "#78716c",
      fontSize: "0.875rem",
      paddingTop: 8,
      paddingBottom: 8,
    }),
  };
}
