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
import {
  MySnackbar,
  SnackbarInterface,
} from "../../components/Global/MySnackbar";

export const ProductsListUsers = () => {
  const dispatch = useAppDispatch();

  const products = useAppSelector(selectAllProducts);
  const postStatus = useAppSelector((state) => state.productList.status);
  const [openSnackbar, setOpenSnackbar] = useState<SnackbarInterface>({
    open: false,
    alert: "",
    variant: "info",
  });

  const [filter, setFilter] = useState("products");

  /*GET ACTION*/

  useEffect(() => {
    if (postStatus === "idle") {
      (async () => {
        await dispatch(fetchProductsList(filter!))
          .unwrap()
          .catch((err) =>
            setOpenSnackbar({
              open: true,
              alert: `[${err.message}] Nie udało załadować się danych, spróbuj później.`,
              variant: "error",
            })
          );
      })();
    }
  }, [postStatus, filter, dispatch]);

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
      <Box width="90%" margin="20px auto">
        <TopBox name="Lista">
          <ProductsGoodsListMenu handleFilter={(filter) => setFilter(filter)} />
        </TopBox>
        <ProductsDataGrid
          rows={products}
          columns={columns}
          postStatus={postStatus}
        />
      </Box>
      {openSnackbar && (
        <MySnackbar
          open={openSnackbar.open}
          onClose={() =>
            setOpenSnackbar((prevState) => ({ ...prevState, open: false }))
          }
          alert={openSnackbar.alert}
          variant={openSnackbar.variant}
        />
      )}
    </>
  );
};
