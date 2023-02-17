import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/redux-hooks";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";

import { Cart, PERSONS, setGoodsIssueOrReception } from "../../state/cartSlice";

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
  setCartItem: (data: Cart) => void;
}

const defaultValue: Cart = {
  name: "",
  amount: parseInt(""),
  person: PERSONS.knadolna,
  productId: "",
};

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError("Pole może zawierać tylko liczby")
    .required("Podaj ilość"),
});

export const SupplyForm = (props: Props) => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<Cart>(defaultValue);
  const cartProduct = useAppSelector((state) => state.cart.cartProduct);
  const cartType = useAppSelector((state) => state.cart.goodsIssueOrReception);

  const handleChangeCartType = (event: SelectChangeEvent) => {
    dispatch(
      setGoodsIssueOrReception(
        event.target.value as "goodsIssue" | "goodsReception"
      )
    );
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const setCartItem = (data: Cart) => {
    props.setCartItem({
      ...data,
      person: value.person,
      name: `${cartProduct.name} - ${cartProduct.secondName}`,
      productId: cartProduct.id as string,
    });
  };

  useEffect(() => {
    if (props.open)
      setValue({
        ...defaultValue,
        productId: cartProduct.id as string,
      });
  }, [props.open]);

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-title"
    >
      <Box sx={modalStyles.wrapper}>
        <Box display="flex" justifyContent="end" mb="15px">
          <FormControl size="small" sx={{ width: "50%" }}>
            <InputLabel id="cart-select-label">Koszyk</InputLabel>
            <Select
              labelId="cart-select-label"
              id="cart-select"
              value={cartType}
              label="Koszyk"
              onChange={handleChangeCartType}
            >
              <MenuItem value="goodsIssue">
                <Typography variant="h6">Wydanie</Typography>
              </MenuItem>
              <MenuItem value="goodsReception">
                <Typography variant="h6">Przyjęcie</Typography>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Divider />
        <Box sx={modalStyles.inputFields}>
          <Typography variant="h5">{`${cartProduct.name} ${cartProduct.secondName}`}</Typography>
          <TextField
            placeholder="Ilość"
            label="Ilość"
            required
            {...register("amount")}
            error={!!errors.amount}
            helperText={errors.amount?.message as string}
            type="number"
            value={isNaN(value.amount) ? "" : value.amount}
            onChange={(event) =>
              setValue((prevState) => ({
                ...prevState,
                amount: Number(event.target.value),
              }))
            }
          />
          <FormControl size="small">
            <InputLabel id="person-select-label">Osoba</InputLabel>
            <Select
              labelId="person-select-label"
              id="person-select"
              value={value?.person}
              label="Osoba"
              onChange={(event) =>
                setValue((prevState) => ({
                  ...prevState,
                  person: event.target.value as PERSONS,
                }))
              }
            >
              {Object.entries(PERSONS).map(([key, value]) => (
                <MenuItem key={key} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={modalStyles.buttons}>
          <Button
            variant="contained"
            onClick={handleSubmit((d) => setCartItem(d as Cart))}
          >
            <span>Wyślij</span>
          </Button>
          <Button onClick={props.onClose}>Cancel</Button>
        </Box>
      </Box>
    </Modal>
  );
};
