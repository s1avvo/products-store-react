import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/redux-hooks";
import { useNavigate } from "react-router-dom";

import {
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  PersonOutline,
  ShoppingBagOutlined,
  MenuOutlined,
  HomeOutlined,
} from "@mui/icons-material";

import { setIsCartOpen } from "../../state/cartSlice";
import { setStatus } from "../../state/productListSlice";

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
          width="80%"
          margin="10px auto"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            display="flex"
            alignItems="center"
            onClick={() => {
              navigate("/");
              dispatch(setStatus("idle"));
            }}
            sx={{ "&:hover": { cursor: "pointer" } }}
          >
            <IconButton sx={{ color: "black" }}>
              <HomeOutlined />
            </IconButton>
            <Typography>STRONA GŁÓWNA</Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            columnGap="20px"
            zIndex="2"
          >
            <Tooltip title="Zaloguj">
              <IconButton
                sx={{ color: "black" }}
                onClick={() => navigate(`/auth`)}
              >
                <PersonOutline />
              </IconButton>
            </Tooltip>
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
            <Tooltip title="Menu">
              <IconButton
                sx={{ color: "black" }}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  setAnchorEl(event.currentTarget);
                }}
                aria-controls={open ? "menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <MenuOutlined />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu"
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem
                onClick={() => {
                  navigate(`/`);
                  setAnchorEl(null);
                }}
              >
                Lista produktów
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate(`/goods-issue`);
                  setAnchorEl(null);
                }}
              >
                Wydania
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate(`/goods-reception`);
                  setAnchorEl(null);
                }}
              >
                Przyjęcia
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>
    </>
  );
};
