import React, { ChangeEvent, useState } from "react";
import { Box, Button, Input } from "@mui/material";

interface Props {
  id: string;
  productDataSheet: (d: number) => void;
}

export const UploadFile = ({ id, productDataSheet }: Props) => {
  const [file, setFile] = useState<File>();

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const upload = async () => {
    if (!file) return;

    const uploadedFile = new FormData();
    uploadedFile.append("uploaded", file, `${id}.pdf`);

    try {
      await fetch(`http://localhost:3001/store/upload/${id}`, {
        method: "POST",
        body: uploadedFile,
      });
      productDataSheet(1);
      // alert(await res.text());
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box display="flex" gap="10px" justifyContent="end" marginRight="25px">
      <Input type="file" onChange={handleFile} />
      <Button variant="outlined" onClick={upload} size="small">
        Wrzuć plik
      </Button>
    </Box>
  );
};
