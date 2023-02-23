import React from "react";

import { Route, Routes, Navigate } from "react-router-dom";
import { ProductsListAdmin } from "./views/ProductsList/ProductsListAdmin";
import { ProductDetails } from "./views/ProductDetails/ProductDetails";
import { NotFoundView } from "./views/NotFoundView";
import { Navbar } from "./views/Global/Navbar";
import { Cart } from "./views/Global/Cart";
import { AuthForm } from "./views/Global/AuthForm";
import { useAppSelector } from "./app/redux-hooks";
import { ProductsListUsers } from "./views/ProductsList/ProductsListUsers";

export const App = () => {
  const isAuth = Boolean(useAppSelector((state) => state.auth.token));
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/products-users" replace />} />
        <Route path="/products-users" element={<ProductsListUsers />} />
        <Route path="/details/:productId" element={<ProductDetails />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route
          path="/products-admin"
          element={isAuth ? <ProductsListAdmin /> : <Navigate to="/" />}
        />
        <Route path="cart" element={<Cart />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>
      <Cart />
    </div>
  );
};
