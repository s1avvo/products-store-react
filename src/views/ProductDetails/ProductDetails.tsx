import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ProductEntity, GoodsEntity } from "types";
import { Box, Paper, Typography } from "@mui/material";
import { SupplyDetails } from "./SupplyDetails";

export const ProductDetails = () => {
  const { productId } = useParams();
  const [item, setItem] = useState<ProductEntity | null>(null);
  const [goodsIssue, setGoodsIssue] = useState<GoodsEntity[]>([]);
  const [goodsReception, setGoodsReception] = useState<GoodsEntity[]>([]);

  async function getItem() {
    const res = await fetch(`http://localhost:3001/details/${productId}`, {
      method: "GET",
    });
    const item = await res.json();
    setItem(item.product as ProductEntity);
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
          Historia <b>produktu</b>
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
        <Box m="25px">
          <Typography variant="h4">
            {item?.name} - {item?.secondName}
          </Typography>
          <Typography sx={{ mt: "20px" }}>
            Ilość:{" "}
            <b>
              {item?.qty}
              {item?.unit}
            </b>
          </Typography>
          <Typography sx={{ mt: "20px" }}>
            Miejsce: <b>{item?.place}</b>
          </Typography>
        </Box>

        {/* GOODS AND SUPPLY */}
        <Box>
          <SupplyDetails
            goodsIssue={goodsIssue}
            goodsReception={goodsReception}
          />
        </Box>
      </Paper>
    </Box>
  );
};
