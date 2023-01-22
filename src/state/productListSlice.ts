import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductEntity, QtyUpdate } from "types";
import { RootState } from "../app/store";

interface ProductsListState {
  productsList: ProductEntity[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: ProductsListState = {
  productsList: [],
  status: "idle",
};

export const fetchProductsList = createAsyncThunk(
  "productsList/fetchProductsList",
  async (path: string) => {
    const response = await fetch(`http://localhost:3001/${path}`, {
      method: "GET",
    });
    return response.json();
  }
);

export const productListSlice = createSlice({
  name: "productsList",
  initialState,
  reducers: {
    updateQty: (state, action: PayloadAction<QtyUpdate>) => {
      state.productsList.map((item) =>
        item.id === action.payload.id
          ? { ...item, qty: item.qty + action.payload.qty }
          : item
      );
    },
    addToProductsList: (state, action: PayloadAction<ProductEntity>) => {
      state.productsList.push(action.payload);
    },
    removeToProductsList: (state, action) => {
      state.productsList.filter((item) => item.id !== action.payload.id);
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProductsList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.productsList = action.payload;
      })
      .addCase(fetchProductsList.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { updateQty, addToProductsList, removeToProductsList, setStatus } =
  productListSlice.actions;

export const productListReducer = productListSlice.reducer;

export const selectAllProducts = (state: RootState) =>
  state.productList.productsList;

export const selectProductById = (state: RootState, productId: string) =>
  state.productList.productsList.find((product) => product.id === productId);
