import React, { useState } from "react";
import { useAppDispatch } from "../../app/redux-hooks";
import { setStatus } from "../../state/productListSlice";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface Props {
  handleFilter: (filter: string) => void;
}

export const ProductsGoodsListMenu = ({ handleFilter }: Props) => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState("products");
  return (
    <>
      <FormControl sx={{ width: "230px" }} size="small">
        <InputLabel id="filter" variant="filled">
          STATYSTYKI
        </InputLabel>
        <Select
          id="filter"
          variant="filled"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        >
          <MenuItem
            value="products"
            onClick={() => {
              handleFilter("products");
              dispatch(setStatus("idle"));
            }}
          >
            Wszystkie
          </MenuItem>
          <MenuItem
            value="products-goods-issue-frequently"
            onClick={() => {
              handleFilter("products-goods-issue-frequently");
              dispatch(setStatus("idle"));
            }}
          >
            Najczęściej wydawane
          </MenuItem>
          <MenuItem
            value="products-goods-reception-frequently"
            onClick={() => {
              handleFilter("products-goods-reception-frequently");
              dispatch(setStatus("idle"));
            }}
          >
            Najczęściej przyjmowane
          </MenuItem>
          <MenuItem
            value="products-goods-issue-recently"
            onClick={() => {
              handleFilter("products-goods-issue-recently");
              dispatch(setStatus("idle"));
            }}
          >
            Ostatnio wydane
          </MenuItem>
          <MenuItem
            value="products-goods-reception-recently"
            onClick={() => {
              handleFilter("products-goods-reception-recently");
              dispatch(setStatus("idle"));
            }}
          >
            Ostatnio przyjęte
          </MenuItem>
        </Select>
      </FormControl>
    </>
  );
};
