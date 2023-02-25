import React, { useState } from "react";

import { useAppDispatch } from "../../app/redux-hooks";

import { Button, Menu, MenuItem, Tooltip } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

import { setStatus } from "../../state/productListSlice";

interface Props {
  handleFilter: (filter: string) => void;
}

export const ProductsGoodsListMenu = ({ handleFilter }: Props) => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  return (
    <>
      <Tooltip title="Statystyki produktów">
        <Button
          variant="contained"
          endIcon={<MenuIcon />}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
          }}
          aria-controls={open ? "stats" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          top 25
        </Button>
      </Tooltip>
      <Menu
        id="stats"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleFilter("products-goods-issue-frequently");
            dispatch(setStatus("idle"));
            setAnchorEl(null);
          }}
        >
          Najcześciej wydawane
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleFilter("products-goods-reception-frequently");
            dispatch(setStatus("idle"));
            setAnchorEl(null);
          }}
        >
          Najcześciej przyjmowane
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleFilter("products-goods-issue-recently");
            dispatch(setStatus("idle"));
            setAnchorEl(null);
          }}
        >
          Ostatnio wydane
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleFilter("products-goods-reception-recently");
            dispatch(setStatus("idle"));
            setAnchorEl(null);
          }}
        >
          Ostatnio przyjęte
        </MenuItem>
      </Menu>
    </>
  );
};
