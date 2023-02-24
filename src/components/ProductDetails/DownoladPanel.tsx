import React from "react";
import { apiUrl } from "../../config/api";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";

interface Props {
  id: string;
}

export const DownloadFile = ({ id }: Props) => {
  const isNonMobileScreens = useMediaQuery("(min-width:800px)");
  const download = async () => {
    try {
      const res = await fetch(`${apiUrl}/download/${id}.pdf`, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });
      const data = await res.blob();
      const blob = new Blob([data], { type: "application/pdf" });
      const blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
      URL.revokeObjectURL(blobURL);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      display={isNonMobileScreens ? "flex" : "block"}
      gap="10px"
      justifyContent="end"
      textAlign="end"
    >
      <Typography variant="h6">Karta charakterystyki:</Typography>
      <Button variant="contained" onClick={download} size="small">
        Otwórz
      </Button>
    </Box>
  );
};
