import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import { CartSupply, ProductEntity, QtyUpdate } from "types";

interface Global {
  isCartOpen: boolean;
  isGoodsOrSupply: "goods" | "supply";
  cart: CartSupply[];
  cartProduct: ProductEntity;
  productsList: ProductEntity[];
}

const initialState: Global = {
  isCartOpen: false,
  isGoodsOrSupply: "goods",
  cart: [],
  cartProduct: {} as ProductEntity,
  productsList: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setProductsList: (state, action: PayloadAction<ProductEntity[]>) => {
      state.productsList = action.payload;
    },

    updateQty: (state, action: PayloadAction<QtyUpdate>) => {
      state.productsList = [...state.productsList].map((item) =>
        item.id === action.payload.id
          ? { ...item, qty: item.qty + action.payload.qty }
          : item
      );
    },

    addToProductsList: (state, action: PayloadAction<ProductEntity>) => {
      state.productsList = [...state.productsList, action.payload];
    },

    removeToProductsList: (state, action) => {
      state.productsList = state.productsList.filter(
        (item) => item.id !== action.payload.id
      );
    },

    setCartProduct: (state, action: PayloadAction<ProductEntity>) => {
      state.cartProduct = action.payload;
    },

    addToCart: (state, action: PayloadAction<CartSupply>) => {
      state.cart = [...state.cart, action.payload];
    },

    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item?.productId !== action.payload.productId
      );
    },
    setIsCartOpen: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    setIsGoodsOrSupply: (state, action: PayloadAction<"goods" | "supply">) => {
      state.isGoodsOrSupply = action.payload;
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  setIsCartOpen,
  setIsGoodsOrSupply,
  clearCart,
  setCartProduct,
  setProductsList,
  addToProductsList,
  removeToProductsList,
  updateQty,
} = cartSlice.actions;

export default cartSlice.reducer;
