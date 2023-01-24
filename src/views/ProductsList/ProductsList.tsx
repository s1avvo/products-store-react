import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/redux-hooks";
import { CreateProductReq, ProductEntity, CartSupply } from "types";

import { Box, Button, Paper, Typography } from "@mui/material";
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
  ArrowCircleRightOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@mui/icons-material";

import { addToCart, setCartProduct } from "../../state/cartSlice";
import {
  addToProductsList,
  fetchProductsList,
  removeToProductsList,
  selectAllProducts,
  setStatus,
} from "../../state/productListSlice";

import { NewProductForm } from "./NewProductForm";
import { ProductSupplyForm } from "./ProductSupplyForm";
import { ProductsGoodsListMenu } from "./ProductsGoodsListMenu";
import { EditProductForm } from "./EditProductForm";

export const ProductsList = () => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState("products");
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const postStatus = useAppSelector((state) => state.productList.status);
  const cart = useAppSelector((state) => state.cart.cart);

  const [openAmount, setOpenAmount] = useState(false);

  /*FILTER*/

  const handleFilter = (filter: string) => {
    setFilter(filter);
  };

  useEffect(() => {
    if (postStatus === "idle") {
      console.log("zmiana");
      dispatch(fetchProductsList(filter!));
    }
  }, [dispatch, postStatus, filter]);

  /*ADD ACTION*/

  const [openProduct, setOpenProduct] = useState(false);

  const addProduct = async (product: CreateProductReq) => {
    try {
      dispatch(setStatus("pending"));
      const res = await fetch("http://localhost:3001/store/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const newProduct: ProductEntity = await res.json();
      dispatch(addToProductsList(newProduct));
    } catch (err) {
      console.error("Failed to save the new product: ", err);
    } finally {
      dispatch(setStatus("idle"));
    }
    setOpenProduct(false);
  };

  /*UPDATE ACTION*/

  const [openEditForm, setOpenEditForm] = useState(false);
  const [valueEditForm, setValueEditForm] = useState<ProductEntity | null>(
    null
  );

  const updateProduct = async (product: ProductEntity) => {
    try {
      dispatch(setStatus("pending"));
      await fetch("http://localhost:3001/store/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: valueEditForm!.id,
          ...product,
        }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setStatus("idle"));
    }
    setOpenEditForm(false);
  };

  /*DELETE ACTION*/

  const handleDeleteClick = async (id: GridRowId) => {
    try {
      dispatch(setStatus("pending"));
      await fetch("http://localhost:3001/store/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      dispatch(removeToProductsList({ id }));
    } catch (err) {
      console.error("Failed to delete the product: ", err);
    } finally {
      dispatch(setStatus("idle"));
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
            key={`${cellValues.id}-edit`}
            icon={<EditOutlined />}
            label="Edit"
            onClick={() => {
              setValueEditForm(cellValues.row);
              setOpenEditForm(true);
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
      {valueEditForm && (
        <EditProductForm
          open={openEditForm}
          onClose={() => setOpenEditForm(false)}
          valueForm={valueEditForm as CreateProductReq}
          updateProduct={updateProduct}
        />
      )}
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
      <Box width="80%" margin="20px auto">
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
        <Paper
          sx={{
            margin: "0 auto",
            // height: 'calc(100vh - 280px)',
            height: "auto",
            overflow: "auto",
            backgroundColor: "rgba(250, 250, 250, 0.95)",
            zIndex: "10",
          }}
        >
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
            autoHeight={true}
            sx={{ padding: "10px" }}
            disableSelectionOnClick
            pagination
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[2, 5, 10]}
            // editMode="cell"
            // onCellEditStop={(params, event) => handleSave(params.id)}
            // processRowUpdate={handleProcessRowUpdate}
            // experimentalFeatures={{ newEditingApi: true }}
          />
        </Paper>
      </Box>
    </>
  );
};
