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
} from "../../state/productListSlice";

import { SupplyForm } from "../../components/Global/SupplyForm";
import { ProductsGoodsListMenu } from "../../components/ProductList/ProductsGoodsListMenu";
import { AddOrEditProductForm } from "../../components/ProductList/AddOrEditProductForm";
import { TopBox } from "../../components/Global/TopBox";
import { ProductsDataGrid } from "../../components/ProductList/ProductsDataGrid";

const defaultValue: CreateProduct = {
  name: "",
  secondName: "",
  unit: "",
  place: "",
  productDataSheet: 0,
  active: 1,
};

export const ProductsListAdmin = () => {
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);
  const products = useAppSelector(selectAllProducts);
  const postStatus = useAppSelector((state) => state.productList.status);
  const cart = useAppSelector((state) => state.cart.cart);

  const [filter, setFilter] = useState("products");
  const [openAmountForm, setOpenAmountForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [valueEditForm, setValueEditForm] = useState<ProductEntity | null>(
    null
  );
  const [openAddForm, setOpenAddForm] = useState(false);

  if (!token) throw new Error("Brak autoryzacji");

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

  /*POST ACTION*/

  const handleAddProduct = async (product: CreateProduct) => {
    await dispatch(addProductToList({ product, token }))
      .unwrap()
      .catch((err) => console.log(err.message));

    setOpenAddForm(false);
  };

  /*PUT ACTION*/

  const handleUpdateProduct = async (product: CreateProduct) => {
    await dispatch(
      updateProductOnList({
        product: { id: valueEditForm?.id as string, ...product },
        token,
      })
    )
      .unwrap()
      .catch((err) => console.log(err.message));

    setOpenEditForm(false);
  };

  /*SET CART ITEM*/

  const setCartItem = (cartItem: Cart) => {
    dispatch(addToCart(cartItem));
    setOpenAmountForm(false);
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
            onClick={() =>
              dispatch(
                deleteProductFromList({ id: cellValues.id as string, token })
              )
            }
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
          name="Edytuj product:"
          open={openEditForm}
          onClose={() => setOpenEditForm(false)}
          addOrEditProduct={handleUpdateProduct}
          valueForm={valueEditForm as CreateProduct}
        />
      )}
      <AddOrEditProductForm
        name="Dodaj product:"
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
      <Box width="80%" margin="20px auto">
        <TopBox name="Productów">
          <ProductsGoodsListMenu handleFilter={handleFilter} />
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
    </>
  );
};
