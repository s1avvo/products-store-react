import React from "react";
import { Box, Typography } from "@mui/material";

export const NotFoundView = () => (
  <>
    <Box display="block" textAlign="center">
      <Typography
        variant="h2"
        fontWeight="bold"
        textTransform="uppercase"
        margin="20px"
      >
        404 - Page not found.
      </Typography>
      <Typography variant="h4">
        Wygląda na to, że zabłądziłeś. ¯\_(ツ)_/¯
      </Typography>
    </Box>
  </>
);
