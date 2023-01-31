import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ProductEntity,
  QtyUpdate,
  CreateProductReq,
  UpdateProductReq,
} from "types";
import { RootState } from "../app/store";

interface ProductsListState {
  productsList: ProductEntity[];
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: ProductsListState = {
  productsList: [],
  status: "idle",
};

export const fetchProductsList = createAsyncThunk(
  "productsList/fetchProductsList",
  async (path: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3001/${path}`, {
        method: "GET",
      });
      return await response.json();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addProductToList = createAsyncThunk(
  "productsList/addProductToList",
  async (product: CreateProductReq, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3001/store/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      return await response.json();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateProductOnList = createAsyncThunk(
  "productsList/updateProductOnList",
  async (product: UpdateProductReq, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3001/store/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      return await response.json();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteProductFromList = createAsyncThunk(
  "productsList/deleteProductFromList",
  async (id: string, { rejectWithValue }) => {
    try {
      await fetch("http://localhost:3001/store/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      return rejectWithValue(err);
    }
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
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProductsList.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchProductsList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.productsList = action.payload;
      })
      .addCase(fetchProductsList.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addProductToList.fulfilled, (state, action) => {
        state.productsList.push(action.payload);
        state.status = "idle";
      })
      .addCase(updateProductOnList.fulfilled, (state, action) => {
        state.productsList.map((item) =>
          item.id === action.meta.arg.id ? { ...action.meta.arg } : item
        );
        state.status = "idle";
      })
      .addCase(deleteProductFromList.fulfilled, (state, action) => {
        state.productsList.filter((item) => item.id !== action.meta.arg);
        state.status = "idle";
      });
  },
});

export const { updateQty, setStatus } = productListSlice.actions;

export const productListReducer = productListSlice.reducer;

export const selectAllProducts = (state: RootState) =>
  state.productList.productsList;
