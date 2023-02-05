import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/redux-hooks";

import { Cart, OrderViewEntity } from "types";

import { Box, Typography } from "@mui/material";
import { addToCart, setCartProduct } from "../../state/cartSlice";
import {
  GridActionsCellItem,
  GridColDef,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";

import { AddCircleOutlineOutlined } from "@mui/icons-material";

import { SupplyForm } from "../../components/SupplyForm";
import { GoodsDataGrid } from "../../components/GoodsDataGrid";

interface Props {
  filter: string;
}

export const GoodsList = (props: Props) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);

  const [goodsList, setGoodsList] = useState<OrderViewEntity[]>([]);
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
            {props.filter === "goods" ? (
              <>
                Lista <b>Wydań produktów</b>
              </>
            ) : (
              <>
                Lista <b>Przyjęć produktów</b>
              </>
            )}
          </Typography>
        </Box>
        <GoodsDataGrid rows={goodsList} columns={columns} />
      </Box>
    </>
  );
};
