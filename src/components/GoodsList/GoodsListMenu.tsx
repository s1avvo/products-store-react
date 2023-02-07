import React, { useState } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface Props {
  handleRange: (range: SelectChangeEvent) => void;
}

export const GoodsListMenu = ({ handleRange }: Props) => {
  const [range, setRange] = useState("1");

  const handleSelect = (event: SelectChangeEvent) => {
    setRange(event.target.value as string);
    handleRange(event);
  };

  return (
    <>
      <FormControl fullWidth>
        <Select
          id="select-range"
          value={range.toString()}
          label="Age"
          onChange={handleSelect}
          size="small"
          sx={{
            border: "none",
            color: "#fff",
            backgroundColor: "#1976d2",
            fontWeight: "500",
            boxShadow: "0px 3px 3px -2px rgb(0 0 0 / 50%)",
            ".MuiSvgIcon-root ": {
              fill: "white !important",
            },
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#1976d2",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1976d2",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1565c0",
            },
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          <MenuItem value={1}>Ostatni miesiąc</MenuItem>
          <MenuItem value={3}>Ostatnie 3 miesiące</MenuItem>
          <MenuItem value={6}>Ostatnie 6 miesięcy</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};
