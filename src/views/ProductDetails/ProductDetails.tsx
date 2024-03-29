import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../config/api";
import { SupplyDetails } from "../../components/ProductDetails/SupplyDetails";
import { ProductDetailsHeader } from "../../components/ProductDetails/ProductDetailsHeader";

import { GoodsEntity, ProductEntity } from "types";
import { Box, Paper, useMediaQuery } from "@mui/material";
import { DownloadFile } from "../../components/ProductDetails/DownoladPanel";
import { TopBox } from "../../components/Global/TopBox";

const ProductDetails = () => {
  const { productId } = useParams();
  const isNonMobileScreens = useMediaQuery("(min-width:800px)");

  const [product, setProduct] = useState<ProductEntity | null>(null);
  const [goodsIssue, setGoodsIssue] = useState<GoodsEntity[]>([]);
  const [goodsReception, setGoodsReception] = useState<GoodsEntity[]>([]);
  const [isProductDataSheet, setIsProductDataSheet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const resProduct = await fetch(`${apiUrl}/products/${productId}`);
        const product = await resProduct.json();
        setProduct(product);
        setIsProductDataSheet(product.productDataSheet === 1);

        const resDetails = await fetch(`${apiUrl}/details/${productId}`, {
          method: "GET",
        });
        const details = await resDetails.json();
        setGoodsIssue(details.goodsIssue as GoodsEntity[]);
        setGoodsReception(details.goodsReception as GoodsEntity[]);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [productId]);

  return (
    <Box width="90%" margin="20px auto">
      <TopBox name="Historia">
        {/* PRODUCT DATA SHEET .PDF */}
        {isProductDataSheet ? <DownloadFile id={productId!} /> : null}
      </TopBox>
      <Paper
        sx={{
          margin: "0 auto",
          height: "auto",
          overflow: "auto",
          backgroundColor: "rgba(250, 250, 250, 0.95)",
          zIndex: "10",
        }}
      >
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="1fr 2fr"
          sx={{
            "& > div": {
              gridColumn: isNonMobileScreens ? undefined : "span 2",
            },
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
            isLoading={isLoading}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default ProductDetails;
