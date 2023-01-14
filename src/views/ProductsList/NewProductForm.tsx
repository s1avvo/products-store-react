import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateProductReq } from "types";

const modalStyles = {
  wrapper: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "max(500px, 30%)",
    bgcolor: "white",
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

interface Props {
  open: boolean;
  onClose: () => void;
  addProduct: (data: CreateProductReq) => void;
}

const defaultValue: CreateProductReq = {
  name: "",
  secondName: "",
  unit: "",
  place: "",
};

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
  unit: Yup.string().required("Wybierz jednostkę miary"),
  place: Yup.number()
    .typeError("Pole może zawierać tylko liczby")
    .required("Podaj miejsce productu"),
});

export const NewProductForm = (props: Props) => {
  const [value, setValue] = useState<CreateProductReq>(defaultValue);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const addNewProduct = (data: CreateProductReq) => {
    props.addProduct(data);
  };

  useEffect(() => {
    if (props.open) setValue(defaultValue);
  }, [props.open]);

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-title"
    >
      <Box sx={modalStyles.wrapper}>
        <Typography id="modal-modal-title" variant="subtitle1">
          Dodaj produkt:
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
            placeholder="j.m."
            label="j.m."
            required
            {...register("unit")}
            error={!!errors.unit}
            helperText={errors.unit?.message as string}
            value={value.unit}
            onChange={(event) =>
              setValue((prevState) => ({
                ...prevState,
                unit: event.target.value,
              }))
            }
          />
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
        </Box>
        <Box sx={modalStyles.buttons}>
          <Button
            variant="contained"
            onClick={handleSubmit((d) => addNewProduct(d as CreateProductReq))}
          >
            Wyślij
          </Button>
          <Button onClick={props.onClose}>Cancel</Button>
        </Box>
      </Box>
    </Modal>
  );
};
