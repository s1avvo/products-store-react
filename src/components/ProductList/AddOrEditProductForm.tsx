import React, { useCallback, useEffect, useState } from "react";
import { CreateProduct } from "types";
import * as Yup from "yup";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Modal,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { EditOutlined, DeleteOutlined } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { Formik, FormikHelpers } from "formik";
import moment from "moment/moment";

enum Units {
  l = "l",
  kg = "kg",
}

export interface DataSheetInterface {
  file: File | null;
  productDataSheet: number;
}

export const defaultValueDataSheet: DataSheetInterface = {
  file: null,
  productDataSheet: 0,
};

export const defaultValue: Omit<CreateProduct, "createdAt"> = {
  name: "",
  secondName: "",
  unit: "",
  place: "",
  productDataSheet: 0,
  active: 1,
};

interface Props {
  open: boolean;
  onClose: () => void;
  addOrEditProduct: (data: CreateProduct, dataSheet: File | null) => void;
  valueForm: CreateProduct;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Podaj nazwę produktu")
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
    .required("Podaj miejsce produktu"),
});

export const AddOrEditProductForm = (props: Props) => {
  const [initialValues, setInitialValues] = useState(props.valueForm);
  const [file, setFile] = useState(defaultValueDataSheet);
  const isNonMobileScreens = useMediaQuery("(min-width:600px)");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile({ file: acceptedFiles[0], productDataSheet: 1 });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const handleProductForm = async (
    values: CreateProduct,
    onSubmitProps: FormikHelpers<CreateProduct>
  ) => {
    !initialValues.id
      ? props.addOrEditProduct(
          {
            ...values,
            createdAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            productDataSheet: file.productDataSheet,
          } as CreateProduct,
          file.file
        )
      : props.addOrEditProduct(
          {
            ...values,
            createdAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            productDataSheet: file.productDataSheet,
            id: initialValues.id,
          } as CreateProduct,
          file.file
        );
    setFile(defaultValueDataSheet);
    onSubmitProps.resetForm();
  };

  useEffect(() => {
    setInitialValues(props.valueForm);
  }, [props.valueForm]);

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="product-form"
    >
      <Box
        position="absolute"
        right="0px"
        width={isNonMobileScreens ? "max(420px, 30%)" : "100%"}
        margin="0 auto"
        height="100%"
        bgcolor="white"
      >
        <Box overflow="auto" height="100%" padding="30px" gap="20px">
          <Formik
            enableReinitialize
            onSubmit={handleProductForm}
            initialValues={initialValues}
            validationSchema={validationSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap="20px">
                  <TextField
                    label="Nazwa"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    error={Boolean(touched.name) && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    label="Druga nazwa"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.secondName}
                    name="secondName"
                    error={
                      Boolean(touched.secondName) && Boolean(errors.secondName)
                    }
                    helperText={touched.secondName && errors.secondName}
                  />
                  <TextField
                    label="j.m."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.unit}
                    name="unit"
                    error={Boolean(touched.unit) && Boolean(errors.unit)}
                    helperText={touched.unit && errors.unit}
                    select
                  >
                    <MenuItem value={Units.l}>l</MenuItem>
                    <MenuItem value={Units.kg}>kg</MenuItem>
                  </TextField>
                  <TextField
                    label="Miejsce"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.place}
                    name="place"
                    error={Boolean(touched.place) && Boolean(errors.place)}
                    helperText={touched.place && errors.place}
                  />
                  <FormControl variant="standard" component="fieldset">
                    <FormControlLabel
                      control={
                        <Switch
                          name="active"
                          value={values.active}
                          checked={values.active === 1}
                          onChange={(event, checked) => {
                            setFieldValue("active", checked ? 1 : 0);
                          }}
                        />
                      }
                      label="Wł./Wył. produkt"
                    />
                  </FormControl>

                  {/* FILE DROPZONE */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box
                      border={`1px dashed lightgrey`}
                      borderRadius="5px"
                      p="1rem"
                      width="100%"
                    >
                      {initialValues.productDataSheet !== 1 ? (
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          {!file.file ? (
                            isDragActive ? (
                              <Typography>Możesz puścić plik</Typography>
                            ) : (
                              <Typography>
                                Dodaj kartę charakterystyki
                              </Typography>
                            )
                          ) : (
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography>{file.file?.name}</Typography>
                              <EditOutlined />
                            </Box>
                          )}
                        </div>
                      ) : (
                        <Typography>Karta została już dodana</Typography>
                      )}
                    </Box>
                    <IconButton
                      color="primary"
                      onClick={() => setFile(defaultValueDataSheet)}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </Box>

                  {/* BUTTONS */}
                  <Box display="flex" justifyContent="space-between" gap="10px">
                    <Button variant="contained" type="submit" fullWidth>
                      Wyślij
                    </Button>
                    <Button onClick={props.onClose}>Anuluj</Button>
                  </Box>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Modal>
  );
};
