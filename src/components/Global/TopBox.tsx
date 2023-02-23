import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  name: string;
  children: React.ReactNode;
}

export const TopBox = (props: Props) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
      m="15px"
    >
      <Box position="absolute">
        <Typography variant="h4">
          Lista <b>{props.name}</b>
        </Typography>
      </Box>
      <Box marginLeft="auto">{props.children}</Box>
    </Box>
  );
};
