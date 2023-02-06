import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  name: string | undefined;
  secondName: string | undefined;
  qty: string | undefined;
  place: string | undefined;
}

export const ProductDetailsHeader = ({
  name,
  secondName,
  qty,
  place,
}: Props) => {
  return (
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
  );
};
