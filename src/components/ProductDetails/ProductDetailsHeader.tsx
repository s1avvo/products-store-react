import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  name: string | undefined;
  secondName: string | undefined;
  qty: string | undefined;
  place: string | undefined;
  children: React.ReactNode;
}

export const ProductDetailsHeader = ({
  name,
  secondName,
  qty,
  place,
  children,
}: Props) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="start">
      <Box m="25px">
        <Typography variant="h4">
          {name} {secondName}
        </Typography>
        <Typography sx={{ mt: "20px" }}>
          Ilość: <b>{qty}</b>
        </Typography>
        <Typography sx={{ mt: "20px" }}>
          Miejsce: <b>{place}</b>
        </Typography>
      </Box>
      {children}
    </Box>
  );
};
