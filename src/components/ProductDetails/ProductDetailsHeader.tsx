import React from "react";
import { Box, Divider, Typography, useMediaQuery } from "@mui/material";

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
  const isNonMobileScreens = useMediaQuery("(min-width:600px)");
  return (
    <Box
      display={isNonMobileScreens ? "flex" : "block"}
      justifyContent="space-between"
      alignItems="start"
      bgcolor="rgb(25,118,210)"
    >
      <Box m="25px" color="white">
        <Typography variant="h4">{name}</Typography>
        <Divider
          variant="middle"
          color="white"
          sx={{ margin: "10px auto", height: "2px" }}
        />
        <Typography variant="h6" textTransform="uppercase" sx={{ mt: "20px" }}>
          {secondName}
        </Typography>
        <Typography variant="h6" sx={{ mt: "10px" }}>
          Ilość: <b>{qty}</b>
        </Typography>
        <Typography variant="h6" sx={{ mt: "10px" }}>
          Miejsce: <b>{place}</b>
        </Typography>
      </Box>
    </Box>
  );
};
