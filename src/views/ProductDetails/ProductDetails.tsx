import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { SupplyDetails } from "../../components/ProductDetails/SupplyDetails";
import { ProductDetailsHeader } from "../../components/ProductDetails/ProductDetailsHeader";

import { GoodsEntity, ProductEntity } from "types";
import { Box, Paper, Typography } from "@mui/material";
import { DownloadFile } from "../../components/ProductDetails/DownoladPanel";

export const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<ProductEntity | null>(null);
  const [goodsIssue, setGoodsIssue] = useState<GoodsEntity[]>([]);
  const [goodsReception, setGoodsReception] = useState<GoodsEntity[]>([]);
  const [isProductDataSheet, setIsProductDataSheet] = useState(false);

  useEffect(() => {
    (async () => {
      const resProduct = await fetch(
        `http://localhost:3001/products/${productId}`
      );
      const product = await resProduct.json();
      setProduct(product);
      setIsProductDataSheet(product.productDataSheet === 1);

      const resDetails = await fetch(
        `http://localhost:3001/details/${productId}`,
        {
          method: "GET",
        }
      );
      const details = await resDetails.json();
      setGoodsIssue(details.goodsIssue as GoodsEntity[]);
      setGoodsReception(details.goodsReception as GoodsEntity[]);
    })();
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
        {/* PRODUCT DATA SHEET .PDF */}
        {isProductDataSheet ? <DownloadFile id={productId!} /> : null}

        {/* GOODSIssue AND GOODSReception */}
        <SupplyDetails
          goodsIssue={goodsIssue}
          goodsReception={goodsReception}
        />
      </Paper>
    </Box>
  );
};
