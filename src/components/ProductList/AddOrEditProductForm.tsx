import React, { useCallback, useEffect, useState } from "react";
import { ProductEntity, CreateProduct } from "types";
import * as Yup from "yup";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Modal,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { EditOutlined } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";

const modalStyles = {
  wrapper: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "max(500px, 30%)",
    backgroundColor: "white",
    p: 4,
    zIndex: 10,
  },
  inputFields: {
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
    marginBottom: "15px",
    gap: "20px",
  },
  buttons: {
    display: "flex",
    justifyContent: "end",
    gap: "10px",
  },
};

enum Units {
  l = "l",
  kg = "kg",
}

interface Props {
  name: string;
  open: boolean;
  onClose: () => void;
  addOrEditProduct: (data: ProductEntity, dataSheet: File | null) => void;
  valueForm: CreateProduct;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Podaj nazwe produktu")
    .min(3, "Nazwa musi zawierać min. 3 znaki"),
  secondName: Yup.string()
    .notRequired()
    .when({
      is: (value: string) => value?.length,
      then: (rule) => rule.min(3, "Nazwa musi zawierać min. 3 znaki"),
    }),
  unit: Yup.mixed<Units>()
    .oneOf(Object.values(Units), "Wybierz jednostkę miary")
    .required(),
  place: Yup.number()
    .typeError("Pole może zawierać tylko liczby")
    .required("Podaj miejsce productu"),
});

export const AddOrEditProductForm = (props: Props) => {
  const [value, setValue] = useState<CreateProduct>(props.valueForm);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema), mode: "all" });

  const addOrEditProduct: SubmitHandler<FieldValues> = (data) => {
    props.addOrEditProduct(data as ProductEntity, file);
  };

  useEffect(() => {
    setValue(props.valueForm);
  }, [props.open, props.valueForm]);

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-title"
    >
      <Box
        sx={modalStyles.wrapper}
        component="form"
        onSubmit={handleSubmit(addOrEditProduct)}
      >
        <Typography id="modal-modal-title" variant="subtitle1">
          {props.name}
        </Typography>
        <Divider />
        <Box sx={modalStyles.inputFields}>
          <TextField
            placeholder="Nazwa"
            label="Nazwa"
            required
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message as string}
            value={value.name}
            onChange={(event) =>
              setValue((prevState) => ({
                ...prevState,
                name: event.target.value,
              }))
            }
          />
          <TextField
            placeholder="Druga nazwa"
            label="Druga nazwa"
            {...register("secondName")}
            error={!!errors.secondName}
            helperText={errors.secondName?.message as string}
            value={value.secondName}
            onChange={(event) =>
              setValue((prevState) => ({
                ...prevState,
                secondName: event.target.value,
              }))
            }
          />
          <TextField
            label="j.m."
            {...register("unit")}
            value={value.unit}
            select
            error={!!errors.unit}
            helperText={errors.unit?.message as string}
            onChange={(event) =>
              setValue((prevState) => ({
                ...prevState,
                unit: event.target.value,
              }))
            }
          >
            <MenuItem value={Units.l}>l</MenuItem>
            <MenuItem value={Units.kg}>kg</MenuItem>
          </TextField>
          <TextField
            placeholder="Miejsce"
            label="Miejsce"
            required
            {...register("place")}
            error={!!errors.place}
            helperText={errors.place?.message as string}
            value={value.place}
            onChange={(event) =>
              setValue((prevState) => ({
                ...prevState,
                place: event.target.value,
              }))
            }
          />
          <Box
            gridColumn="span 4"
            border={`1px solid grey`}
            borderRadius="5px"
            p="1rem"
          >
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {!file ? (
                isDragActive ? (
                  <Typography>Możesz puścić plik</Typography>
                ) : (
                  <Typography>Przeciągnij plik lub kliknij</Typography>
                )
              ) : (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>{file?.name}</Typography>
                  <EditOutlined />
                </Box>
              )}
            </div>
          </Box>
          <FormControl variant="standard" component="fieldset">
            <FormControlLabel
              control={
                <Switch
                  {...register("active")}
                  checked={!!value.active}
                  onChange={(event) =>
                    setValue((prevState) => ({
                      ...prevState,
                      active: event.target.checked ? 1 : 0,
                    }))
                  }
                />
              }
              label="Wł./Wył. produkt"
            />
          </FormControl>
        </Box>
        <Box sx={modalStyles.buttons}>
          <Button variant="contained" type="submit">
            Wyślij
          </Button>
          <Button onClick={props.onClose}>Cancel</Button>
        </Box>
      </Box>
    </Modal>
  );
};
