import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartSupply, ProductEntity } from "types";

interface CartState {
  isCartOpen: boolean;
  isGoodsOrSupply: "goods" | "supply";
  cart: CartSupply[];
  cartProduct: ProductEntity;
  productsList: ProductEntity[];
}

const initialState: CartState = {
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
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
