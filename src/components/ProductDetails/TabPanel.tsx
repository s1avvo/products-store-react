import React from "react";
import { Box } from "@mui/material";

interface Props {
  children?: React.ReactNode;
  index: string;
  value: string;
}

export const TabPanel = (props: Props) => {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};
