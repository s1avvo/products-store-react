import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cart, ProductEntity } from "types";

interface CartState {
  isCartOpen: boolean;
  goodsIssueOrReception: "goodsIssue" | "goodsReception";
  cart: Cart[];
  cartProduct: ProductEntity;
  productsList: ProductEntity[];
}

const initialState: CartState = {
  isCartOpen: false,
  goodsIssueOrReception: "goodsIssue",
  cart: [],
  cartProduct: {} as ProductEntity,
  productsList: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartProduct: (state, action: PayloadAction<ProductEntity>) => {
      state.cartProduct = action.payload;
    },

    addToCart: (state, action: PayloadAction<Cart>) => {
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
    setGoodsIssueOrReception: (
      state,
      action: PayloadAction<"goodsIssue" | "goodsReception">
    ) => {
      state.goodsIssueOrReception = action.payload;
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
  setGoodsIssueOrReception,
  clearCart,
  setCartProduct,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
