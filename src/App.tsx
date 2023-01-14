import React from "react";

import { Route, Routes } from "react-router-dom";
import { ProductsList } from "./views/ProductsList/ProductsList";
import { ProductDetails } from "./views/ProductDetails/ProductDetails";
import { NotFoundView } from "./views/NotFoundView";
import { Navbar } from "./views/Global/Navbar";
import { Cart } from "./views/Global/Cart";

export const App = () => {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductsList />} />
        <Route path="/:productId" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>
      <Cart />
    </div>
  );
};
