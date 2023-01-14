import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CartSupply } from "types";
import { useDispatch, useSelector } from "react-redux";
import { setIsGoodsOrSupply } from "../../state/state";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";

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

const PERSONS = {
  0: "Katarzyna Nadolna",
  1: "Dorota Olender",
  2: "Anna Pawełczyk",
  3: "Katarzyna Sowa",
  4: "Barbara Cwynar",
  5: "Justyna Żwawiak",
  6: "Marek Bernard",
  7: "Joanna Warguła",
};

const STATUS = {
  0: "Oczekujące",
  1: "Zrealizowane",
  2: "Anulowane",
};

interface Props {
  open: boolean;
  onClose: () => void;
  setCartItem: (data: CartSupply) => void;
}

const defaultValue: CartSupply = {
  name: "",
  amount: parseInt(""),
  person: PERSONS["0"],
  productId: "",
};

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError("Pole może zawierać tylko liczby")
    .required("Podaj ilość"),
});

export const ProductSupplyForm = (props: Props) => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<CartSupply>(defaultValue);
  const cartProduct = useAppSelector((state) => state.cart.cartProduct);
  const cartType = useAppSelector((state) => state.cart.isGoodsOrSupply);

  const handleChangeCartType = (event: SelectChangeEvent) => {
    dispatch(setIsGoodsOrSupply(event.target.value as "goods" | "supply"));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const setCartItem = (data: CartSupply) => {
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
              <MenuItem value="goods">
                <Typography variant="h6">Wydanie</Typography>
              </MenuItem>
              <MenuItem value="supply">
                <Typography variant="h6">Zamówienie</Typography>
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
          {cartType === "goods" && (
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
                    person: event.target.value,
                  }))
                }
              >
                <MenuItem value={PERSONS["0"]}>{PERSONS["0"]}</MenuItem>
                <MenuItem value={PERSONS["1"]}>{PERSONS["1"]}</MenuItem>
                <MenuItem value={PERSONS["2"]}>{PERSONS["2"]}</MenuItem>
                <MenuItem value={PERSONS["3"]}>{PERSONS["3"]}</MenuItem>
                <MenuItem value={PERSONS["4"]}>{PERSONS["4"]}</MenuItem>
                <MenuItem value={PERSONS["5"]}>{PERSONS["5"]}</MenuItem>
                <MenuItem value={PERSONS["6"]}>{PERSONS["6"]}</MenuItem>
                <MenuItem value={PERSONS["7"]}>{PERSONS["7"]}</MenuItem>
              </Select>
            </FormControl>
          )}
          {/*{cartType === "supply" && (*/}
          {/*  <FormControl size="small">*/}
          {/*    <InputLabel id="status-select-label">Status</InputLabel>*/}
          {/*    <Select*/}
          {/*      labelId="status-select-label"*/}
          {/*      id="status-select"*/}
          {/*      value={value.status}*/}
          {/*      label="Status"*/}
          {/*      onChange={(event) =>*/}
          {/*        setValue((prevState) => ({*/}
          {/*          ...prevState,*/}
          {/*          status: event.target.value,*/}
          {/*        }))*/}
          {/*      }*/}
          {/*    >*/}
          {/*      <MenuItem value={STATUS["0"]}>{STATUS["0"]}</MenuItem>*/}
          {/*      <MenuItem value={STATUS["1"]}>{STATUS["1"]}</MenuItem>*/}
          {/*      <MenuItem value={STATUS["2"]}>{STATUS["2"]}</MenuItem>*/}
          {/*    </Select>*/}
          {/*  </FormControl>*/}
          {/*)}*/}
        </Box>
        <Box sx={modalStyles.buttons}>
          <Button
            variant="contained"
            onClick={handleSubmit((d) => setCartItem(d as CartSupply))}
          >
            {cartType === "goods" ? <span>Wydaj</span> : <span>Zamów</span>}
          </Button>
          <Button onClick={props.onClose}>Cancel</Button>
        </Box>
      </Box>
    </Modal>
  );
};
