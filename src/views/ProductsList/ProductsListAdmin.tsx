import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/redux-hooks";
import { CreateProduct, ProductEntity } from "types";

import { Box, Button } from "@mui/material";
import {
  GridActionsCellItem,
  GridColDef,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";
import {
  AddCircleOutlineOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@mui/icons-material";

import { addToCart, Cart, setCartProduct } from "../../state/cartSlice";
import {
  selectAllProducts,
  fetchProductsList,
  addProductToList,
  updateProductOnList,
  deleteProductFromList,
  updateProductDataSheet,
} from "../../state/productListSlice";

import { SupplyForm } from "../../components/Global/SupplyForm";
import { ProductsGoodsListMenu } from "../../components/ProductList/ProductsGoodsListMenu";
import {
  AddOrEditProductForm,
  defaultValue,
} from "../../components/ProductList/AddOrEditProductForm";
import { TopBox } from "../../components/Global/TopBox";
import { ProductsDataGrid } from "../../components/ProductList/ProductsDataGrid";
import {
  MySnackbar,
  SnackbarInterface,
} from "../../components/Global/MySnackbar";

export const ProductsListAdmin = () => {
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);
  const products = useAppSelector(selectAllProducts);
  const postStatus = useAppSelector((state) => state.productList.status);
  const cart = useAppSelector((state) => state.cart.cart);

  const [filter, setFilter] = useState("products");
  const [openAmountForm, setOpenAmountForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [valueEditForm, setValueEditForm] = useState<CreateProduct | null>(
    null
  );
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState<SnackbarInterface>({
    open: false,
    alert: "",
    variant: "info",
  });

  const handleEditFormValue = (product: ProductEntity) => {
    const { id, name, secondName, unit, place, productDataSheet, active } =
      product;
    setValueEditForm({
      id,
      name,
      secondName,
      unit,
      place,
      productDataSheet,
      active,
    });
    setOpenEditForm(true);
  };

  /*POST ACTION*/

  const handleAddProduct = async (
    product: CreateProduct,
    dataSheet: File | null
  ) => {
    if (token) {
      const newProduct = await dispatch(addProductToList({ product, token }))
        .unwrap()
        .catch((err) =>
          setOpenSnackbar({
            open: true,
            alert: `[${err.message}] Nie udało dodać się produktu, spróbuj ponownie.`,
            variant: "error",
          })
        );

      setOpenSnackbar({
        open: true,
        alert: `Dodano produkt.`,
        variant: "success",
      });

      setOpenAddForm(false);

      if (!dataSheet) return;
      const uploadedFile = new FormData();
      uploadedFile.append("uploaded", dataSheet, `${newProduct.id}.pdf`);

      await dispatch(
        updateProductDataSheet({ id: newProduct.id, token, file: uploadedFile })
      )
        .unwrap()
        .catch((err) =>
          setOpenSnackbar({
            open: true,
            alert: `[${err.message}] Nie udało dodać się karty charakterystyki, spróbuj ponownie.`,
            variant: "error",
          })
        );
    }
  };

  /*PUT ACTION*/

  const handleUpdateProduct = async (
    product: CreateProduct,
    dataSheet: File | null
  ) => {
    if (token) {
      const newProduct = await dispatch(updateProductOnList({ product, token }))
        .unwrap()
        .catch((err) =>
          setOpenSnackbar({
            open: true,
            alert: `[${err.message}] Nie udało zmienić się produktu, spróbuj ponownie.`,
            variant: "error",
          })
        );

      setOpenSnackbar({
        open: true,
        alert: `Zmieniono produkt.`,
        variant: "success",
      });

      setOpenEditForm(false);

      if (!dataSheet) return;
      const uploadedFile = new FormData();
      uploadedFile.append("uploaded", dataSheet, `${newProduct.id}.pdf`);

      await dispatch(
        updateProductDataSheet({ id: newProduct.id, token, file: uploadedFile })
      )
        .unwrap()
        .catch((err) =>
          setOpenSnackbar({
            open: true,
            alert: `[${err.message}] Nie udało dodać się karty charakterystyki, spróbuj ponownie.`,
            variant: "error",
          })
        );
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (token) {
      dispatch(deleteProductFromList({ id, token }))
        .unwrap()
        .catch((err) =>
          setOpenSnackbar({
            open: true,
            alert: `[${err.message}] Nie udało usunąć się produktu, spróbuj ponownie.`,
            variant: "error",
          })
        );

      setOpenSnackbar({
        open: true,
        alert: `Usunięto produkt.`,
        variant: "success",
      });
    }
  };

  /*SET CART ITEM*/

  const setCartItem = (cartItem: Cart) => {
    dispatch(addToCart(cartItem));
    setOpenAmountForm(false);
  };

  /*GET ACTION*/

  useEffect(() => {
    if (!token) {
      setOpenSnackbar({
        open: true,
        alert: "Błąd autoryzacji, zaloguj się ponownie",
        variant: "warning",
      });
    }
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
  }, [postStatus, token, filter, dispatch]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nazwa",
      flex: 1,
      minWidth: 130,
    },
    { field: "secondName", headerName: "Druga nazwa", flex: 1 },
    { field: "qty", headerName: "Ilość", flex: 0.3, type: "number" },
    {
      field: "unit",
      headerName: "j.m.",
      flex: 0.2,
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
      width: 90,
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
              !!cart.find((item) => item.productId === cellValues.row.id)
            }
            onClick={() => {
              dispatch(setCartProduct(cellValues.row));
              setOpenAmountForm(true);
            }}
            color="inherit"
          />,
          <GridActionsCellItem
            key={`${cellValues.id}-edit`}
            icon={<EditOutlined />}
            label="Edit"
            onClick={() => handleEditFormValue(cellValues.row)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={`${cellValues.id}-delete`}
            icon={<DeleteOutlined />}
            label="Delete"
            onClick={() => handleDeleteProduct(cellValues.id as string)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <>
      {valueEditForm && (
        <AddOrEditProductForm
          open={openEditForm}
          onClose={() => setOpenEditForm(false)}
          addOrEditProduct={handleUpdateProduct}
          valueForm={valueEditForm}
        />
      )}
      <AddOrEditProductForm
        open={openAddForm}
        onClose={() => setOpenAddForm(false)}
        addOrEditProduct={handleAddProduct}
        valueForm={defaultValue}
      />
      <SupplyForm
        open={openAmountForm}
        onClose={() => setOpenAmountForm(false)}
        setCartItem={setCartItem}
      />
      <Box width="90%" margin="20px auto">
        <TopBox name="Lista">
          <ProductsGoodsListMenu handleFilter={(filter) => setFilter(filter)} />
          <Button variant="contained" onClick={() => setOpenAddForm(true)}>
            Dodaj produkt
          </Button>
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
