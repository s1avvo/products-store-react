import { Alert, AlertColor, Snackbar } from "@mui/material";
import React from "react";

export interface SnackbarInterface {
  open: boolean;
  alert: string;
  variant: AlertColor;
}

interface Props {
  open: boolean;
  onClose: () => void;
  alert: string;
  variant: AlertColor;
}

export const MySnackbar = ({ open, onClose, alert, variant }: Props) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={variant} sx={{ width: "100%" }}>
        {alert}
      </Alert>
    </Snackbar>
  );
};
