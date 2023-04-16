import React, { Suspense } from "react";

import { Route, Routes, Navigate } from "react-router-dom";
import { Navbar } from "./views/Global/Navbar";
import { Cart } from "./views/Global/Cart";
import { AuthForm } from "./views/Global/AuthForm";
import { useAppSelector } from "./app/redux-hooks";
import { Spinner } from "./components/Global/Spinner";

const ProductsListAdmin = React.lazy(
  () => import("./views/ProductsList/ProductsListAdmin")
);

const ProductsListUsers = React.lazy(
  () => import("./views/ProductsList/ProductsListUsers")
);

const ProductDetails = React.lazy(
  () => import("./views/ProductDetails/ProductDetails")
);

const NotFoundView = React.lazy(() => import("./views/NotFoundView"));

export const App = () => {
  const isAuth = Boolean(useAppSelector((state) => state.auth.token));
  return (
    <div className="app">
      <Navbar />
      <Suspense fallback={<Spinner />}>
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
      </Suspense>
      <Cart />
    </div>
  );
};
