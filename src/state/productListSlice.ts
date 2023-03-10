import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductEntity, QtyUpdate, CreateProduct } from "types";
import { RootState } from "../app/store";
import { apiUrl } from "../config/api";

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
      const response = await fetch(`${apiUrl}/${path}`, {
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
  async (
    data: { product: CreateProduct; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${apiUrl}/store/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data.product),
      });
      return await response.json();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateProductOnList = createAsyncThunk(
  "productsList/updateProductOnList",
  async (
    data: { product: CreateProduct; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${apiUrl}/store/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data.product),
      });
      return await response.json();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateProductDataSheet = createAsyncThunk(
  "productsList/updateProductDataSheet",
  async (
    data: { id: string; token: string; file: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${apiUrl}/store/upload/${data.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        body: data.file,
      });
      return await response.json();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteProductFromList = createAsyncThunk(
  "productsList/deleteProductFromList",
  async (data: { id: string; token: string }, { rejectWithValue }) => {
    try {
      await fetch(`${apiUrl}/store/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: data.id }),
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
      })
      .addCase(updateProductOnList.fulfilled, (state, action) => {
        state.productsList[action.payload.id] = action.payload;
        state.status = "idle";
      })
      .addCase(deleteProductFromList.fulfilled, (state, action) => {
        state.productsList = state.productsList.filter(
          (item) => item.id !== action.meta.arg.id
        );
      })
      .addCase(updateProductDataSheet.fulfilled, (state, action) => {
        state.productsList.map((item) =>
          item.id === action.meta.arg.id
            ? { ...item, productDataSheet: 1 }
            : item
        );
      });
  },
});

export const { updateQty, setStatus } = productListSlice.actions;

export const productListReducer = productListSlice.reducer;

export const selectAllProducts = (state: RootState) =>
  state.productList.productsList;

export const selectSingleProduct = (state: RootState, productId: string) =>
  state.productList.productsList.find((item) => item.id === productId);
