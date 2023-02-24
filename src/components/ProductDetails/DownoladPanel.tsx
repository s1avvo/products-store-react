import React from "react";
import { apiUrl } from "../../config/api";
import { Box, Button, Typography } from "@mui/material";

interface Props {
  id: string;
}

export const DownloadFile = ({ id }: Props) => {
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
    <Box display="flex" gap="10px" justifyContent="end" margin="25px">
      <Typography variant="h6">Karta charakterystyki:</Typography>
      <Button variant="contained" onClick={download} size="small">
        Otwórz
      </Button>
    </Box>
  );
};
