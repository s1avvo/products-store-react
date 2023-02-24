import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/redux-hooks";
import { useNavigate } from "react-router-dom";

import {
  Badge,
  Box,
  FormControl,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  PersonOutline,
  ShoppingBagOutlined,
  HomeOutlined,
} from "@mui/icons-material";

import { setIsCartOpen } from "../../state/cartSlice";
import { setStatus } from "../../state/productListSlice";
import { setLogout } from "../../state/authSlice";

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);
  const user = useAppSelector((state) => state.auth.user);
  const isAuth = Boolean(useAppSelector((state) => state.auth.token));

  return (
    <>
      <Box
        width="100%"
        height="260px"
        position="absolute"
        top="0"
        left="0"
        bgcolor="rgba(215, 215, 215, 0.85)"
        zIndex="-1"
      />
      <Box display="flex" alignItems="flex-start" width="100%" color="black">
        <Box
          width="90%"
          margin="10px auto"
          padding="5px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            display="flex"
            alignItems="center"
            onClick={() => {
              isAuth ? navigate("/products-admin") : navigate("/");
              dispatch(setStatus("idle"));
            }}
            sx={{ "&:hover": { cursor: "pointer" } }}
          >
            <IconButton sx={{ color: "black" }}>
              <HomeOutlined />
            </IconButton>
            <Typography>STRONA GŁÓWNA</Typography>
          </Box>
          <Box display="flex" gap="10px">
            <Badge
              badgeContent={cart.length}
              color="secondary"
              invisible={cart.length === 0}
            >
              <Tooltip title="Koszyk">
                <IconButton
                  onClick={() => dispatch(setIsCartOpen())}
                  sx={{ color: "black" }}
                >
                  <ShoppingBagOutlined />
                </IconButton>
              </Tooltip>
            </Badge>
            {isAuth ? (
              <FormControl variant="standard">
                <Select
                  value={`${user}`}
                  sx={{
                    borderRadius: "0.25rem",
                    border: "1px solid #1976d2",
                    p: "0.15rem 1rem",
                    "& .MuiSvgIcon-root": {
                      width: "3rem",
                    },
                  }}
                  input={<InputBase />}
                >
                  <MenuItem value={`${user}`}>{`${user}`}</MenuItem>
                  <MenuItem onClick={() => dispatch(setLogout())}>
                    Wyloguj
                  </MenuItem>
                </Select>
              </FormControl>
            ) : (
              <Tooltip title="Zaloguj">
                <IconButton
                  sx={{ color: "black" }}
                  onClick={() => navigate(`/auth`)}
                >
                  <PersonOutline />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};
