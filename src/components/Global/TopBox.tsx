import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";

interface Props {
  name: string;
  children?: React.ReactNode;
}

export const TopBox = (props: Props) => {
  const isNonMobileScreens = useMediaQuery("(min-width:600px)");
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      margin="15px 5px 15px 15px"
    >
      <Box>
        <Typography variant="h4" color="#5A5B5B">
          {props.name}
        </Typography>
      </Box>
      <Box
        minWidth="120px"
        display={isNonMobileScreens ? "flex" : "block"}
        textAlign="end"
      >
        <Box
          display="flex"
          gap="5px"
          flexDirection={isNonMobileScreens ? "row" : "column"}
        >
          {props.children}
        </Box>
      </Box>
    </Box>
  );
};
