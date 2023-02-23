import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { cartReducer } from "../state/cartSlice";
import { productListReducer } from "../state/productListSlice";
import { authReducer } from "../state/authSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    productList: productListReducer,
    auth: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
