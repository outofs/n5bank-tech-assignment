import type { StylesConfig } from "react-select";

import type { SelectOption } from "./select-options";

export function createSharedSelectStyles<IsMulti extends boolean>(
  hasError: boolean,
): StylesConfig<SelectOption, IsMulti> {
  return {
    control: (base, state) => ({
      ...base,
      minHeight: 44,
      borderRadius: 9999,
      backgroundColor: "#ffffff",
      borderColor: hasError
        ? "#fda4af"
        : state.isFocused
          ? "#335cff"
          : "#d7dfeb",
      boxShadow: state.isFocused
        ? "0 0 0 4px rgba(51, 92, 255, 0.12)"
        : "none",
      "&:hover": {
        borderColor: hasError ? "#fb7185" : "#9db0cc",
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
      color: "#94a3b8",
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
      borderRadius: 18,
      border: "1px solid #dbe3f0",
      overflow: "hidden",
      boxShadow:
        "0 18px 36px -24px rgba(15, 23, 42, 0.28), 0 10px 18px -16px rgba(15, 23, 42, 0.16)",
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
        ? "#1f4ae0"
        : state.isFocused
          ? "#eff4ff"
          : "#ffffff",
      color: state.isSelected ? "#ffffff" : "#334155",
      fontSize: "0.875rem",
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 12,
      paddingRight: 12,
      "&:active": {
        backgroundColor: state.isSelected ? "#1f4ae0" : "#dbeafe",
      },
    }),
    indicatorsContainer: (base) => ({
      ...base,
      color: "#94a3b8",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#94a3b8",
      "&:hover": {
        color: "#335cff",
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "#94a3b8",
      "&:hover": {
        color: "#335cff",
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
