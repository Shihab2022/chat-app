import { useRef } from "react";
import { Box, IconButton, InputBase } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  autoFocus?: boolean;
}

/**
 * Consistent search input with icon + clear button.
 */
const SearchInput = ({
  value,
  onChange,
  placeholder = "Search…",
  ariaLabel = "search",
  autoFocus = false,
}: SearchInputProps) => {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        px: 1.25,
        height: 42,
        borderRadius: "10px",
        backgroundColor: theme.palette.grey[50],
        border: `1px solid ${theme.palette.divider}`,
        transition: "border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease",
        "&:focus-within": {
          borderColor: theme.palette.primary.main,
          backgroundColor: "#FFFFFF",
          boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.16)}`,
        },
      }}
    >
      <SearchRoundedIcon sx={{ fontSize: 20, color: theme.palette.text.disabled }} />
      <InputBase
        inputRef={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        inputProps={{ "aria-label": ariaLabel }}
        sx={{ ml: 0.5, flex: 1, fontSize: "0.875rem" }}
      />
      {value && (
        <IconButton
          size="small"
          aria-label="clear search"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          sx={{ color: theme.palette.text.disabled }}
        >
          <CloseRoundedIcon sx={{ fontSize: 17 }} />
        </IconButton>
      )}
    </Box>
  );
};

export default SearchInput;