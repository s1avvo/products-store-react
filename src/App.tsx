import React from "react";

import { Route, Routes, Navigate } from "react-router-dom";
import { ProductsList } from "./views/ProductsList/ProductsList";
import { GoodsList } from "./views/GoodsList/GoodsList";
import { SupplyList } from "./views/SupplyList/SupplyList";
import { ProductDetails } from "./views/ProductDetails/ProductDetails";
import { NotFoundView } from "./views/NotFoundView";
import { Navbar } from "./views/Global/Navbar";
import { Cart } from "./views/Global/Cart";

export const App = () => {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/goods" element={<GoodsList />} />
        <Route path="/supply" element={<SupplyList />} />
        <Route path="/details/:productId" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>
      <Cart />
    </div>
  );
};
