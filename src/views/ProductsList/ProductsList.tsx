import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/redux-hooks";

import { CreateProductReq, ProductEntity, CartSupply } from "types";

import { Box, Button, Typography } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderEditCellParams,
  GridRowId,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  AddCircleOutlineOutlined,
  DeleteOutlined,
  ArrowCircleRightOutlined,
} from "@mui/icons-material";

import { addToCart, setCartProduct } from "../../state/cartSlice";
import {
  addToProductsList,
  fetchProductsList,
  removeToProductsList,
  setStatus,
} from "../../state/productListSlice";

import { NewProductForm } from "./NewProductForm";
import { ProductSupplyForm } from "./ProductSupplyForm";
import { ProductsGoodsListMenu } from "./ProductsGoodsListMenu";

export const ProductsList = () => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState("products");
  // const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.productList.productsList);
  const cart = useAppSelector((state) => state.cart.cart);
  const postStatus = useAppSelector((state) => state.productList.status);
  const [openAmount, setOpenAmount] = useState(false);

  // const breakPoint = useMediaQuery("(min-width:600px)");
  // const [columnVisibilityModel, setColumnVisibilityModel] =
  //   useState<GridColumnVisibilityModel>({
  //     id: false,
  //   });

  /*FILTER*/

  const handleFilter = (filter: string) => {
    setFilter(filter);
  };

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchProductsList(filter!));
    }
  }, [dispatch, postStatus, filter]);

  /*ADD ACTION*/

  const [openProduct, setOpenProduct] = useState(false);

  const addProduct = async (product: CreateProductReq) => {
    try {
      const res = await fetch("http://localhost:3001/store/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const newProduct: ProductEntity = await res.json();
      dispatch(addToProductsList(newProduct));
    } catch (e) {
      console.log(e);
    }
    setOpenProduct(false);
  };

  /*DELETE ACTION*/

  const handleDeleteClick = async (id: GridRowId) => {
    try {
      await fetch("http://localhost:3001/store/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      dispatch(removeToProductsList({ id }));
      dispatch(setStatus());
    } catch (e) {
      console.log(e);
    }
  };

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
    {
      field: "name",
      headerName: "Nazwa",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    { field: "secondName", headerName: "Druga nazwa", flex: 1, editable: true },
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
      editable: true,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
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
            key={`${cellValues.id}-add`}
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
          <GridActionsCellItem
            key={`${cellValues.id}-delete`}
            icon={<DeleteOutlined />}
            label="Delete"
            onClick={() => handleDeleteClick(cellValues.id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <>
      <NewProductForm
        open={openProduct}
        onClose={() => setOpenProduct(false)}
        addProduct={addProduct}
      />
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
          position="relative"
          m="15px"
        >
          <Box position="absolute">
            <Typography variant="h4">
              Lista <b>Produktów</b>
            </Typography>
          </Box>
          <Box marginLeft="auto">
            <ProductsGoodsListMenu handleFilter={handleFilter} />
            <Button variant="contained" onClick={() => setOpenProduct(true)}>
              Dodaj produkt
            </Button>
          </Box>
        </Box>
        <Box margin="0 auto" height="75vh">
          <DataGrid
            rows={products}
            columns={columns}
            components={{
              Toolbar: () => (
                <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
                  <GridToolbarColumnsButton />
                  <GridToolbarQuickFilter />
                </GridToolbarContainer>
              ),
            }}
            loading={postStatus === "loading"}
            sx={{ padding: "10px" }}
            // checkboxSelection
            // onSelectionModelChange={(newSelectionModel) => {
            //   setSelectionModel(newSelectionModel);
            // }}
            // selectionModel={selectionModel}
            disableSelectionOnClick
            // autoPageSize={true}
            pagination
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[2, 5, 10]}
            // experimentalFeatures={{ newEditingApi: true }}
            // processRowUpdate={processRowUpdate}
            // onProcessRowUpdateError={handleProcessRowUpdateError}
            // columnVisibilityModel={columnVisibilityModel}
            // onColumnVisibilityModelChange={(newModel) =>
            //   setColumnVisibilityModel(newModel)
            // }
            // initialState={{
            //   sorting: { sortModel: [{ field: "name", sort: "asc" }] },
            // }}
          />
        </Box>
      </Box>
    </>
  );
};
