import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../app/redux-hooks";
import { setStatus } from "../../state/productListSlice";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface Props {
  handleFilter: (filter: string) => void;
}

export const ProductsGoodsListMenu = ({ handleFilter }: Props) => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState("products");

  useEffect(() => {
    dispatch(setStatus("idle"));
  }, [value, dispatch]);

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
            }}
          >
            Wszystkie
          </MenuItem>
          <MenuItem
            key="products-goods-issue-frequently"
            value="products-goods-issue-frequently"
            onClick={() => {
              handleFilter("products-goods-issue-frequently");
            }}
          >
            Najczęściej wydawane
          </MenuItem>
          <MenuItem
            key="products-goods-reception-frequently"
            value="products-goods-reception-frequently"
            onClick={() => {
              handleFilter("products-goods-reception-frequently");
            }}
          >
            Najczęściej przyjmowane
          </MenuItem>
          <MenuItem
            key="products-goods-issue-recently"
            value="products-goods-issue-recently"
            onClick={() => {
              handleFilter("products-goods-issue-recently");
            }}
          >
            Ostatnio wydane
          </MenuItem>
          <MenuItem
            key="products-goods-reception-recently"
            value="products-goods-reception-recently"
            onClick={() => {
              handleFilter("products-goods-reception-recently");
            }}
          >
            Ostatnio przyjęte
          </MenuItem>
        </Select>
      </FormControl>
    </>
  );
};
