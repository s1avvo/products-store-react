import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/redux-hooks";

import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

import {
  selectAllProducts,
  fetchProductsList,
} from "../../state/productListSlice";

import { ProductsGoodsListMenu } from "../../components/ProductList/ProductsGoodsListMenu";
import { TopBox } from "../../components/Global/TopBox";
import { ProductsDataGrid } from "../../components/ProductList/ProductsDataGrid";

export const ProductsListUsers = () => {
  const dispatch = useAppDispatch();

  const products = useAppSelector(selectAllProducts);
  const postStatus = useAppSelector((state) => state.productList.status);

  const [filter, setFilter] = useState("products");

  /*FILTER*/

  const handleFilter = (filter: string) => {
    setFilter(filter);
  };

  /*GET ACTION*/

  const getProductsList = async () => {
    await dispatch(fetchProductsList(filter!))
      .unwrap()
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    if (postStatus === "idle") {
      getProductsList();
    }
  }, [postStatus]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nazwa",
      flex: 1,
      minWidth: 150,
    },
    { field: "secondName", headerName: "Druga nazwa", flex: 1 },
    { field: "qty", headerName: "Ilość", flex: 0.3, type: "number" },
    {
      field: "unit",
      headerName: "j.m.",
      flex: 0.3,
      sortable: false,
      filterable: false,
    },
    {
      field: "place",
      headerName: "Miejsce",
      flex: 0.4,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <>
      <Box width="80%" margin="20px auto">
        <TopBox name="Productów">
          <ProductsGoodsListMenu handleFilter={handleFilter} />
        </TopBox>
        <ProductsDataGrid
          rows={products}
          columns={columns}
          postStatus={postStatus}
        />
      </Box>
    </>
  );
};
