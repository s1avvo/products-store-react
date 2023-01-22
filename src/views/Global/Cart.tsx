import React, { FormEvent } from "react";
import { CartSupply } from "types";
import { useAppDispatch, useAppSelector } from "../../app/redux-hooks";

import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";

import {
  clearCart,
  removeFromCart,
  setIsCartOpen,
  setIsGoodsOrSupply,
} from "../../state/cartSlice";

import { setStatus, updateQty } from "../../state/productListSlice";

const FlexBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Cart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);
  const cartType = useAppSelector((state) => state.cart.isGoodsOrSupply);
  const isCartOpen = useAppSelector((state) => state.cart.isCartOpen);

  const handleChangeCartType = (event: SelectChangeEvent) => {
    dispatch(setIsGoodsOrSupply(event.target.value as "goods" | "supply"));
  };

  const handelSupply = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const supplyId = await fetch(`http://localhost:3001/store/supply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          person: "Katarzyna Nadolna",
        }),
      });
      const id = await supplyId.json();

      await handelSupplyItems(id.supplyId);
      dispatch(clearCart());
    } catch (e) {
      console.log(e);
    }
  };

  const handelSupplyItems = (supplyId: string) => {
    cart.map(async (item: CartSupply) => {
      try {
        dispatch(setStatus("pending"));
        await fetch(`http://localhost:3001/store/supply/item`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: item.amount,
            productId: item.productId,
            supplyId: supplyId,
          }),
        });
        dispatch(updateQty({ id: item.productId, qty: item.amount }));
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setStatus("idle"));
      }
    });
  };

  const handelGoods = (event: FormEvent) => {
    event.preventDefault();

    cart.map(async (item: CartSupply) => {
      try {
        dispatch(setStatus("pending"));
        await fetch(`http://localhost:3001/store/goods/${item.productId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: item.amount,
            person: item.person,
            productId: item.productId,
          }),
        });
        dispatch(updateQty({ id: item.productId, qty: -item.amount }));
        dispatch(clearCart());
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setStatus("idle"));
      }
    });
  };

  return (
    <Box
      display={isCartOpen ? "block" : "none"}
      bgcolor="rgba(0, 0, 0, 0.4)"
      position="fixed"
      zIndex={10}
      width="100%"
      height="100%"
      left="0"
      top="0"
      overflow="auto"
    >
      <Box
        margin="0 auto"
        width="max(500px, 40%)"
        height="100%"
        bgcolor="white"
        component="form"
        onSubmit={cartType === "goods" ? handelGoods : handelSupply}
      >
        <Box padding="30px" overflow="auto" height="100%">
          {/* HEADER */}
          <Box mb="15px">
            <FormControl fullWidth>
              <InputLabel id="cart-select-label">Koszyk</InputLabel>
              <Select
                labelId="cart-select-label"
                id="cart-select"
                value={cartType}
                label="Koszyk"
                onChange={handleChangeCartType}
              >
                <MenuItem value="goods">
                  <Typography variant="h5">Wydanie ({cart.length})</Typography>
                </MenuItem>
                <MenuItem value="supply">
                  <Typography variant="h5">
                    Zamówienie ({cart.length})
                  </Typography>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* CART LIST */}
          {cart.map((item: CartSupply) => (
            <Box key={`${item.productId}`}>
              <FlexBox p="15px 0">
                <Box flex="1 1 60%">
                  <FlexBox mb="5px" mt="5px">
                    <Typography fontWeight="bold" variant="h5">
                      {item.name}
                    </Typography>
                    <IconButton
                      onClick={() =>
                        dispatch(removeFromCart({ productId: item.productId }))
                      }
                    >
                      <CloseIcon />
                    </IconButton>
                  </FlexBox>
                  <FlexBox m="15px 0">
                    <Typography variant="h6">
                      Ilość: <b>{item.amount}</b>
                    </Typography>
                    <Typography>{item.person}</Typography>
                  </FlexBox>
                </Box>
              </FlexBox>
              <Divider />
            </Box>
          ))}
          {/*BUTTONS*/}
          <Box m="20px 0" display="flex" justifyContent="end" gap="10px">
            <Button
              variant="contained"
              type="submit"
              onClick={() => {
                dispatch(setIsCartOpen());
              }}
            >
              {cartType === "goods" ? <span>Wydaj</span> : <span>Zamów</span>}
            </Button>
            <Button onClick={() => dispatch(setIsCartOpen())}>Cancel</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
