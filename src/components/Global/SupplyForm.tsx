import React from "react";
import { useAppSelector } from "../../app/redux-hooks";
import * as Yup from "yup";

import {
  Box,
  Button,
  MenuItem,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { Cart, PERSONS } from "../../state/cartSlice";
import { Formik, FormikHelpers } from "formik";

interface Props {
  open: boolean;
  onClose: () => void;
  setCartItem: (data: Cart) => void;
}

const initialValues: Cart = {
  name: "",
  amount: 0,
  person: PERSONS.knadolna,
  productId: "",
};

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError("Pole może zawierać tylko liczby")
    .moreThan(0, "Podaj wartość większą niż 0")
    .required("Podaj ilość"),
  person: Yup.mixed<PERSONS>()
    .oneOf(Object.values(PERSONS), "Wybierz osobę")
    .required(),
});

export const SupplyForm = (props: Props) => {
  const cartProduct = useAppSelector((state) => state.cart.cartProduct);

  const handleAmountForm = async (
    values: Cart,
    onSubmitProps: FormikHelpers<Cart>
  ) => {
    props.setCartItem({
      ...values,
      name: cartProduct.name,
      productId: cartProduct.id as string,
    });
    onSubmitProps.resetForm();
  };

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="Add amount form"
    >
      <Paper
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "max(300px, 30%)",
          margin: "0 auto",
          padding: "20px",
          gap: "20px",
        }}
      >
        <Formik
          onSubmit={handleAmountForm}
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
          }) => (
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap="20px">
                <Typography variant="h5">{cartProduct.name}</Typography>
                <TextField
                  label="Ilość"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  onFocus={(event) => event.target.select()}
                  value={values.amount}
                  name="amount"
                  error={Boolean(touched.amount) && Boolean(errors.amount)}
                  helperText={touched.amount && errors.amount}
                  type="number"
                />
                <TextField
                  label="Osoba"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.person}
                  name="person"
                  error={Boolean(touched.person) && Boolean(errors.person)}
                  helperText={touched.person && errors.person}
                  select
                >
                  {Object.entries(PERSONS).map(([key, value]) => (
                    <MenuItem key={key} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>

                {/* BUTTONS */}
                <Box display="flex" justifyContent="space-between" gap="10px">
                  <Button variant="contained" type="submit" fullWidth>
                    Wyślij
                  </Button>
                  <Button onClick={props.onClose}>Cancel</Button>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Paper>
    </Modal>
  );
};
