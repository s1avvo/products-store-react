import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/redux-hooks";

import { CartSupply, OrderViewEntity } from "types";

import { Box, Typography } from "@mui/material";
import { addToCart, setCartProduct } from "../../state/cartSlice";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderEditCellParams,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

import {
  AddCircleOutlineOutlined,
  ArrowCircleRightOutlined,
} from "@mui/icons-material";

import { ProductSupplyForm } from "../ProductsList/ProductSupplyForm";

export const GoodsList = () => {
  const navigate = useNavigate();
  const [goodsList, setGoodsList] = useState<OrderViewEntity[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [openAmount, setOpenAmount] = useState(false);
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);

  async function getItems() {
    const res = await fetch("http://localhost:3001/goods", { method: "GET" });
    setGoodsList(await res.json());
  }

  useEffect(() => {
    getItems();
  }, []);

  /*SET CART ITEM*/

  const setCartItem = (cartItem: CartSupply) => {
    dispatch(addToCart(cartItem));
    setOpenAmount(false);
  };

  const columns: GridColDef[] = [
    {
      field: "Szczegóły",
      headerName: "",
      width: 50,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (cellValues: GridRenderEditCellParams<string>) => {
        return [
          <GridActionsCellItem
            key={`${cellValues.id}-details`}
            icon={<ArrowCircleRightOutlined />}
            label="Details"
            onClick={() => navigate(`/details/${cellValues.row.id}`)}
            color="inherit"
          />,
        ];
      },
    },
    { field: "name", headerName: "Nazwa", flex: 1, minWidth: 150 },
    { field: "qty", headerName: "Stan", flex: 0.5, type: "number" },
    {
      field: "unit",
      headerName: "j.m.",
      flex: 0.3,
      sortable: false,
      filterable: false,
    },
    { field: "amount", headerName: "Ilość wyd.", flex: 0.5, type: "number" },
    {
      field: "data",
      headerName: "Data wyd.",
      flex: 0.8,
      type: "date",
      valueGetter: ({ value }) => value && new Date(value).toLocaleDateString(),
    },
    { field: "person", headerName: "Osoba", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (cellValues: GridRenderEditCellParams<string>) => {
        return [
          <GridActionsCellItem
            key={`${cellValues.row.idItem}-add`}
            icon={<AddCircleOutlineOutlined />}
            label="Add"
            disabled={
              !!cart.find(
                (item: CartSupply) => item.productId === cellValues.row.id
              )
            }
            onClick={() => {
              dispatch(setCartProduct(cellValues.row));
              setOpenAmount(true);
            }}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <>
      <ProductSupplyForm
        open={openAmount}
        onClose={() => setOpenAmount(false)}
        setCartItem={setCartItem}
      />
      <Box width="80%" margin="80px auto 50px auto">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          m="15px"
        >
          <Typography variant="h4">
            Lista <b>Wydań</b>
          </Typography>
        </Box>
        <Box margin="0 auto" height="75vh">
          <DataGrid
            rows={goodsList}
            columns={columns}
            getRowId={(row: OrderViewEntity) => row.idItem}
            components={{
              Toolbar: () => (
                <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
                  <GridToolbarColumnsButton />
                  <GridToolbarQuickFilter />
                </GridToolbarContainer>
              ),
            }}
            loading={!goodsList.length}
            sx={{ padding: "10px" }}
            disableSelectionOnClick
            // autoPageSize={true}
            pagination
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </Box>
    </>
  );
};
