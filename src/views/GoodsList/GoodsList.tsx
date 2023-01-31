import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/redux-hooks";

import { Cart, OrderViewEntity } from "types";

import { Box, Paper, Typography } from "@mui/material";
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

import { AddCircleOutlineOutlined } from "@mui/icons-material";

import { SupplyForm } from "../../components/SupplyForm";

interface Props {
  filter: string;
}

export const GoodsList = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);

  const [goodsList, setGoodsList] = useState<OrderViewEntity[]>([]);
  const [pageSize, setPageSize] = useState(25);
  const [openAmount, setOpenAmount] = useState(false);

  async function getItems() {
    const res = await fetch(`http://localhost:3001/${props.filter}`, {
      method: "GET",
    });
    setGoodsList(await res.json());
  }

  useEffect(() => {
    getItems();
  }, [props.filter]);

  /*SET CART ITEM*/

  const setCartItem = (cartItem: Cart) => {
    dispatch(addToCart(cartItem));
    setOpenAmount(false);
  };

  const columns: GridColDef[] = [
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
              !!cart.find((item) => item.productId === cellValues.row.id)
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
      <SupplyForm
        open={openAmount}
        onClose={() => setOpenAmount(false)}
        setCartItem={setCartItem}
      />
      <Box width="80%" margin="20px auto">
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
        <Paper
          sx={{
            margin: "0 auto",
            height: "auto",
            overflow: "auto",
            backgroundColor: "rgba(250, 250, 250, 0.95)",
            zIndex: "10",
          }}
        >
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
            autoHeight={true}
            pagination
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[10, 25, 50]}
            onCellClick={(params) =>
              params.field !== "actions"
                ? navigate(`/details/${params.row.id}`)
                : null
            }
          />
        </Paper>
      </Box>
    </>
  );
};
