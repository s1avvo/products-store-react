import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/redux-hooks";
import { selectSingleProduct } from "../../state/productListSlice";

import { SupplyDetails } from "../../components/ProductDetails/SupplyDetails";
import { ProductDetailsHeader } from "../../components/ProductDetails/ProductDetailsHeader";

import { GoodsEntity } from "types";
import { Box, Paper, Typography } from "@mui/material";

export const ProductDetails = () => {
  const { productId } = useParams();
  const product = useAppSelector((state) =>
    selectSingleProduct(state, productId!)
  );
  const [goodsIssue, setGoodsIssue] = useState<GoodsEntity[]>([]);
  const [goodsReception, setGoodsReception] = useState<GoodsEntity[]>([]);

  async function getItem() {
    const res = await fetch(`http://localhost:3001/details/${productId}`, {
      method: "GET",
    });
    const item = await res.json();
    setGoodsIssue(item.goodsIssue as GoodsEntity[]);
    setGoodsReception(item.goodsReception as GoodsEntity[]);
  }

  useEffect(() => {
    getItem();
  }, [productId]);

  return (
    <Box width="80%" margin="20px auto">
      <Box display="flex" justifyContent="center" alignItems="center" m="15px">
        <Typography variant="h4">
          Historia <b>{product?.name}</b>
        </Typography>
      </Box>
      <Paper
        sx={{
          margin: "0 auto",
          height: "auto",
          overflow: "auto",
          backgroundColor: "rgba(250, 250, 250, 0.95)",
          zIndex: "10",
        }}
      >
        {/* HEADER */}
        <ProductDetailsHeader
          name={product?.name}
          secondName={product?.secondName}
          qty={`${product?.qty}${product?.unit}`}
          place={product?.place}
        />
        {/* GOODSIssue AND GOODSReception */}
        <SupplyDetails
          goodsIssue={goodsIssue}
          goodsReception={goodsReception}
        />
      </Paper>
    </Box>
  );
};
