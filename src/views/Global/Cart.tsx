import React, { FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/redux-hooks";
import { apiUrl } from "../../config/api";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";

import {
  clearCart,
  removeFromCart,
  setIsCartOpen,
  setGoodsIssueOrReception,
} from "../../state/cartSlice";

import { setStatus, updateQty } from "../../state/productListSlice";

const FlexBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Cart = () => {
  const dispatch = useAppDispatch();
  const isNonMobileScreens = useMediaQuery("(min-width:600px)");
  const token = useAppSelector((state) => state.auth.token);
  const cart = useAppSelector((state) => state.cart.cart);
  const cartType = useAppSelector((state) => state.cart.goodsIssueOrReception);
  const isCartOpen = useAppSelector((state) => state.cart.isCartOpen);
  const [check, setCheck] = useState(false);

  const handleChangeCartType = (event: SelectChangeEvent) => {
    dispatch(
      setGoodsIssueOrReception(
        event.target.value as "goodsIssue" | "goodsReception"
      )
    );
  };

  const handelGoodsReception = (event: FormEvent) => {
    event.preventDefault();

    console.log(cart);

    cart.map(async (item) => {
      try {
        dispatch(setStatus("pending"));
        await fetch(`${apiUrl}/store/goods-reception/${item.productId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: item.amount,
            person: item.person,
            productId: item.productId,
          }),
        });
        dispatch(updateQty({ id: item.productId, qty: item.amount }));
        dispatch(clearCart());
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setStatus("idle"));
      }
    });
  };

  const handelGoodsIssue = (event: FormEvent) => {
    event.preventDefault();

    cart.map(async (item) => {
      try {
        dispatch(setStatus("pending"));
        await fetch(`${apiUrl}/store/goods-issue/${item.productId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    setCheck(false);
  }, [isCartOpen]);

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
        position="absolute"
        right="0px"
        margin="0 auto"
        width={isNonMobileScreens ? "max(420px, 30%)" : "100%"}
        height="100%"
        bgcolor="white"
        component="form"
        onSubmit={
          cartType === "goodsIssue" ? handelGoodsIssue : handelGoodsReception
        }
      >
        <Box padding="30px" overflow="auto" height="100%">
          {/* HEADER */}
          <FlexBox mb="15px">
            <FormControl size="small" fullWidth>
              <InputLabel id="cart-select-label">Koszyk</InputLabel>
              <Select
                labelId="cart-select-label"
                id="cart-select"
                value={cartType}
                label="Koszyk"
                onChange={handleChangeCartType}
              >
                <MenuItem value="goodsIssue">
                  <Typography variant="h5">Wydanie ({cart.length})</Typography>
                </MenuItem>
                <MenuItem value="goodsReception">
                  <Typography variant="h5">
                    Przyjęcie ({cart.length})
                  </Typography>
                </MenuItem>
              </Select>
            </FormControl>
            <Tooltip title="Sprawdź typ koszyka i potwierdź przed wysłaniem.">
              <Checkbox
                checked={check}
                onChange={() => setCheck(!check)}
                inputProps={{ "aria-label": "controlled" }}
                sx={{ "& .MuiSvgIcon-root": { fontSize: "2.5rem" } }}
              />
            </Tooltip>
          </FlexBox>

          {/* CART LIST */}
          {cart.map((item) => (
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
              onClick={() => dispatch(setIsCartOpen())}
              disabled={!check}
            >
              Wyślij
            </Button>
            <Button onClick={() => dispatch(setIsCartOpen())}>Anuluj</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
